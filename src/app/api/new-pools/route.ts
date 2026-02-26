import { NextResponse } from 'next/server';
import { cachedFetch, errorResponse, GT_BASE } from '@/lib/api';

export async function GET() {
    try {
        const data = await cachedFetch(`${GT_BASE}/networks/new_pools?include=base_token,dex,network`, 30_000);
        return NextResponse.json(data);
    } catch (err) {
        return errorResponse(err);
    }
}
