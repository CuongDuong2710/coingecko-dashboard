import { NextResponse } from 'next/server';
import { cachedFetch, errorResponse, CG_BASE } from '@/lib/api';

export async function GET() {
    try {
        const data = await cachedFetch(
            `${CG_BASE}/coins/categories?order=market_cap_change_24h_desc`,
            300_000
        );
        return NextResponse.json(data);
    } catch (err) {
        return errorResponse(err);
    }
}
