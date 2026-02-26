import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { cachedFetch, errorResponse, CG_BASE } from '@/lib/api';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const vs = searchParams.get('vs_currency') ?? 'usd';
        const perPage = searchParams.get('per_page') ?? '100';
        const page = searchParams.get('page') ?? '1';
        const order = searchParams.get('order') ?? 'market_cap_desc';

        const url = `${CG_BASE}/coins/markets?vs_currency=${vs}&order=${order}&per_page=${perPage}&page=${page}&sparkline=false&price_change_percentage=1h,24h,7d`;
        const data = await cachedFetch(url, 60_000);
        return NextResponse.json(data);
    } catch (err) {
        return errorResponse(err);
    }
}
