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
        return errorResponse(err);
    }
}
