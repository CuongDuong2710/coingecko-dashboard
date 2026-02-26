import { NextResponse, NextRequest } from 'next/server';
import { cachedFetch, errorResponse, GT_BASE } from '@/lib/api';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const network = searchParams.get('network') ?? 'eth';
        const data = await cachedFetch(
            `${GT_BASE}/networks/${network}/trending_pools?include=base_token,dex`,
            60_000
        );
        return NextResponse.json(data);
    } catch (err) {
        return errorResponse(err);
    }
}
