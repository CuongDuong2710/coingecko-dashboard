import { NextResponse } from 'next/server';
import { cachedFetch, errorResponse, CG_BASE } from '@/lib/api';

export async function GET() {
    try {
        const data = await cachedFetch(
            `${CG_BASE}/nfts/markets?order=market_cap_usd_desc&per_page=50&page=1`,
            120_000
        );
        return NextResponse.json(data);
    } catch (err) {
        // Fallback to trending NFTs if /markets is unauthorized (Free tier limitation)
        if (err instanceof Error && (err.message.includes('401') || err.message.includes('403'))) {
            try {
                const fallbackData = await cachedFetch(`${CG_BASE}/search/trending`, 120_000);
                if (!fallbackData || !fallbackData.nfts) throw new Error('No fallback data');

                // Map trending format to match markets format expected by the frontend
                const mapped = fallbackData.nfts.map((nft: any) => ({
                    id: nft.id,
                    name: nft.name,
                    image: { small: nft.thumb },
                    native_currency_symbol: nft.native_currency_symbol,
                    floor_price: {
                        native_currency: parseFloat(nft.data?.floor_price ?? '0') || null,
                        usd: null,
                    },
                    market_cap: { usd: null },
                    volume_24h: {
                        usd: null,
                        native_currency: parseFloat(nft.data?.h24_volume ?? '0') || null
                    },
                    floor_price_in_usd_24h_percentage_change: nft.floor_price_24h_percentage_change,
                }));
                return NextResponse.json(mapped);
            } catch (fallbackErr) {
                return errorResponse(fallbackErr);
            }
        }
        return errorResponse(err);
    }
}
