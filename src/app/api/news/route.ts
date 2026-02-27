import { NextResponse } from 'next/server';
import { cachedFetch, errorResponse, CG_BASE } from '@/lib/api';

export async function GET() {
    try {
        const data = await cachedFetch(
            `${CG_BASE}/status_updates?per_page=15&page=1`,
            180_000
        );
        return NextResponse.json(data);
    } catch (err) {
        return errorResponse(err);
    }
}
