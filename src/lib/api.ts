import { NextResponse } from 'next/server';

const cache = new Map<string, { data: unknown; ts: number }>();

export async function cachedFetch(url: string, ttlMs: number, headers: Record<string, string> = {}) {
    const cached = cache.get(url);
    if (cached && Date.now() - cached.ts < ttlMs) return cached.data;

    const apiKey = process.env.COINGECKO_API_KEY;
    const res = await fetch(url, {
        headers: {
            Accept: 'application/json',
            ...(apiKey ? { 'x-cg-demo-api-key': apiKey } : {}),
            ...headers,
        },
        next: { revalidate: ttlMs / 1000 },
    });

    if (!res.ok) {
        throw new Error(`API error ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    cache.set(url, { data, ts: Date.now() });
    return data;
}

export function errorResponse(err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
}

export const CG_BASE = process.env.COINGECKO_BASE_URL ?? 'https://api.coingecko.com/api/v3';
export const GT_BASE = process.env.GECKOTERMINAL_BASE_URL ?? 'https://api.geckoterminal.com/api/v2';
