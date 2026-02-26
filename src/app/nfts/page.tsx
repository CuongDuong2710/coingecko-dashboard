'use client';

import { useEffect, useState } from 'react';
import { Image as ImageIcon, ChevronUp, ChevronDown, ArrowUpDown } from 'lucide-react';

interface NFT {
    id: string;
    name: string;
    image: { small: string };
    native_currency_symbol: string;
    floor_price: { native_currency: number; usd: number };
    market_cap: { usd: number };
    volume_24h: { usd: number; native_currency: number };
    floor_price_in_usd_24h_percentage_change: number;
}

function fmt(n: number | null, digits = 2): string {
    if (n === null || n === undefined) return '–';
    if (Math.abs(n) >= 1e9) return `$${(n / 1e9).toFixed(digits)}B`;
    if (Math.abs(n) >= 1e6) return `$${(n / 1e6).toFixed(digits)}M`;
    if (Math.abs(n) >= 1e3) return `$${(n / 1e3).toFixed(1)}K`;
    return `$${n.toFixed(digits)}`;
}

type SortKey = 'floor_price_usd' | 'volume_24h_usd' | 'market_cap_usd' | 'floor_price_24h_change';

export default function NFTPage() {
    const [nfts, setNfts] = useState<NFT[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortKey, setSortKey] = useState<SortKey>('market_cap_usd');
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
    const [query, setQuery] = useState('');

    useEffect(() => {
        fetch('/api/nfts')
            .then((r) => r.json())
            .then((d) => { setNfts(Array.isArray(d) ? d : []); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    function getVal(n: NFT, k: SortKey) {
        if (k === 'floor_price_usd') return n.floor_price?.usd ?? 0;
        if (k === 'volume_24h_usd') return n.volume_24h?.usd ?? 0;
        if (k === 'market_cap_usd') return n.market_cap?.usd ?? 0;
        if (k === 'floor_price_24h_change') return n.floor_price_in_usd_24h_percentage_change ?? 0;
        return 0;
    }

    function toggleSort(k: SortKey) {
        if (sortKey === k) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
        else { setSortKey(k); setSortDir('desc'); }
    }

    function SortIcon({ k }: { k: SortKey }) {
        if (sortKey !== k) return <ArrowUpDown size={11} style={{ opacity: 0.3 }} />;
        return sortDir === 'asc' ? <ChevronUp size={11} /> : <ChevronDown size={11} />;
    }

    const filtered = nfts
        .filter((n) => !query || n.name.toLowerCase().includes(query.toLowerCase()))
        .sort((a, b) => {
            const av = getVal(a, sortKey), bv = getVal(b, sortKey);
            return sortDir === 'asc' ? av - bv : bv - av;
        });

    if (loading)
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="skeleton" style={{ height: 60, borderRadius: 10 }} />
                ))}
            </div>
        );

    return (
        <div className="fade-in">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
                <div>
                    <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>
                        <ImageIcon size={22} style={{ display: 'inline', marginRight: 8, color: 'var(--accent-purple)' }} />
                        NFT Markets
                    </h1>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Floor prices, volume, and market cap rankings</p>
                </div>
                <input
                    id="nft-search"
                    className="search-input"
                    placeholder="Search NFTs…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Collection</th>
                            <th onClick={() => toggleSort('floor_price_usd')} style={{ textAlign: 'right', cursor: 'pointer' }}>
                                Floor (USD) <SortIcon k="floor_price_usd" />
                            </th>
                            <th style={{ textAlign: 'right' }}>Floor (Native)</th>
                            <th onClick={() => toggleSort('floor_price_24h_change')} style={{ textAlign: 'right', cursor: 'pointer' }}>
                                24h Δ <SortIcon k="floor_price_24h_change" />
                            </th>
                            <th onClick={() => toggleSort('volume_24h_usd')} style={{ textAlign: 'right', cursor: 'pointer' }}>
                                Vol 24h <SortIcon k="volume_24h_usd" />
                            </th>
                            <th onClick={() => toggleSort('market_cap_usd')} style={{ textAlign: 'right', cursor: 'pointer' }}>
                                Market Cap <SortIcon k="market_cap_usd" />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((nft, i) => {
                            const pct = nft.floor_price_in_usd_24h_percentage_change;
                            const pos = pct >= 0;
                            return (
                                <tr key={nft.id}>
                                    <td style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{i + 1}</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            {nft.image?.small ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={nft.image.small} alt={nft.name} width={28} height={28} style={{ borderRadius: 6 }} />
                                            ) : (
                                                <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <ImageIcon size={14} color="var(--text-muted)" />
                                                </div>
                                            )}
                                            <div style={{ fontWeight: 600, fontSize: 13 }}>{nft.name}</div>
                                        </div>
                                    </td>
                                    <td style={{ textAlign: 'right', fontWeight: 700 }}>
                                        {nft.floor_price?.usd != null ? `$${nft.floor_price.usd.toLocaleString()}` : '–'}
                                    </td>
                                    <td style={{ textAlign: 'right', color: 'var(--text-secondary)' }}>
                                        {nft.floor_price?.native_currency != null
                                            ? `${nft.floor_price.native_currency} ${nft.native_currency_symbol?.toUpperCase() ?? ''}`
                                            : '–'}
                                    </td>
                                    <td style={{ textAlign: 'right', fontWeight: 600, color: pos ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                                        {pct != null ? `${pos ? '+' : ''}${pct.toFixed(2)}%` : '–'}
                                    </td>
                                    <td style={{ textAlign: 'right', color: 'var(--text-secondary)' }}>{fmt(nft.volume_24h?.usd)}</td>
                                    <td style={{ textAlign: 'right', color: 'var(--text-secondary)' }}>{fmt(nft.market_cap?.usd)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {filtered.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
                        No NFTs found
                    </div>
                )}
            </div>
        </div>
    );
}
