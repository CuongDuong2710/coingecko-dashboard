import { NextResponse } from 'next/server';
import { cachedFetch, errorResponse, GT_BASE } from '@/lib/api';

export async function GET() {
    try {
        const data = await cachedFetch(`${GT_BASE}/networks?page=1`, 600_000);
        return NextResponse.json(data);
    } catch (err) {
        return errorResponse(err);
    }
}
