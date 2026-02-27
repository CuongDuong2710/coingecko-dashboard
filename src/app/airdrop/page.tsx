'use client';

import { useEffect, useState, useMemo } from 'react';
import { Rocket, Globe, Star, Zap } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Network {
    id: string;
    attributes: {
        name: string;
        coingecko_asset_platform_id: string | null;
        native_coin_id: string | null;
        chain_identifier: number | null;
    };
}

interface MarketCoin {
    id: string;
    name: string;
    symbol: string;
    image: string;
    current_price: number;
    market_cap: number;
    total_volume: number;
    price_change_percentage_24h: number;
    market_cap_rank: number;
    price_change_percentage_7d_in_currency: number;
}

interface TrendingCoin {
    item: {
        id: string;
        name: string;
        symbol: string;
        thumb: string;
        score: number;
        market_cap_rank: number;
        data: { market_cap: string };
    };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmt(n: number | null, digits = 2): string {
    if (n === null || n === undefined) return '–';
    if (n === 0) return '$0';
    if (Math.abs(n) >= 1e9) return `$${(n / 1e9).toFixed(digits)}B`;
    if (Math.abs(n) >= 1e6) return `$${(n / 1e6).toFixed(digits)}M`;
    if (Math.abs(n) >= 1e3) return `$${(n / 1e3).toFixed(1)}K`;
    return `$${n.toFixed(digits)}`;
}

function scoreBadge(score: number) {
    if (score >= 70) return { label: '🔥 High', cls: 'badge-green' };
    if (score >= 40) return { label: '⚡ Medium', cls: 'badge-yellow' };
    return { label: '🌱 Low', cls: 'badge-gray' };
}

// ─── Components ──────────────────────────────────────────────────────────────

function NetworkList({ networks }: { networks: Network[] }) {
    return (
        <div className="card" style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <Globe size={18} color="var(--accent-cyan)" />
                <h2 className="section-title" style={{ marginBottom: 0 }}>New Networks</h2>
                <span className="badge badge-blue">Recently Added</span>
            </div>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
                    gap: 10,
                }}
            >
                {networks.slice(0, 24).map((net, i) => (
                    <div
                        key={net.id}
                        className="fade-in"
                        style={{
                            animationDelay: `${i * 30}ms`,
                            background: 'var(--bg-primary)',
                            border: '1px solid var(--border)',
                            borderRadius: 8,
                            padding: '10px 14px',
                        }}
                    >
                        <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2 }}>{net.attributes.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                            {net.attributes.coingecko_asset_platform_id ?? net.id}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function OpportunityTable({
    coins,
    trendingIds,
}: {
    coins: MarketCoin[];
    trendingIds: Set<string>;
}) {
    const scored = useMemo(() => {
        return coins
            .map((c) => {
                const trendScore = trendingIds.has(c.id) ? 40 : 0;
                const mcapScore = c.market_cap < 1e8 ? 40 : c.market_cap < 1e9 ? 20 : 0;
                const mom7d = c.price_change_percentage_7d_in_currency ?? 0;
                const momScore = mom7d > 10 ? 20 : mom7d > 0 ? 10 : 0;
                const total = trendScore + mcapScore + momScore;
                return { ...c, score: total };
            })
            .filter((c) => c.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 50);
    }, [coins, trendingIds]);

    if (scored.length === 0) return null;

    return (
        <div className="card" style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <Zap size={18} color="var(--accent-yellow)" />
                <h2 className="section-title" style={{ marginBottom: 0 }}>Opportunity Scores</h2>
                <span className="badge badge-yellow">{scored.length} hits</span>
            </div>
            <div className="table-container" style={{ background: 'transparent', border: 'none' }}>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Coin</th>
                            <th style={{ textAlign: 'right' }}>Price</th>
                            <th style={{ textAlign: 'right' }}>24h %</th>
                            <th style={{ textAlign: 'right' }}>7d %</th>
                            <th style={{ textAlign: 'right' }}>Market Cap</th>
                            <th>Signals</th>
                            <th style={{ textAlign: 'center' }}>Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {scored.map((coin) => {
                            const badge = scoreBadge(coin.score);
                            return (
                                <tr key={coin.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={coin.image} alt={coin.name} width={20} height={20} style={{ borderRadius: '50%' }} />
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: 13 }}>{coin.name}</div>
                                                <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{coin.symbol}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ textAlign: 'right', fontWeight: 600 }}>{fmt(coin.current_price)}</td>
                                    <td
                                        style={{
                                            textAlign: 'right',
                                            fontWeight: 600,
                                            color: coin.price_change_percentage_24h >= 0 ? 'var(--accent-green)' : 'var(--accent-red)',
                                        }}
                                    >
                                        {coin.price_change_percentage_24h >= 0 ? '+' : ''}
                                        {coin.price_change_percentage_24h?.toFixed(2) ?? '–'}%
                                    </td>
                                    <td
                                        style={{
                                            textAlign: 'right',
                                            fontWeight: 600,
                                            color: (coin.price_change_percentage_7d_in_currency ?? 0) >= 0 ? 'var(--accent-green)' : 'var(--accent-red)',
                                        }}
                                    >
                                        {(coin.price_change_percentage_7d_in_currency ?? 0) >= 0 ? '+' : ''}
                                        {(coin.price_change_percentage_7d_in_currency ?? 0).toFixed(2)}%
                                    </td>
                                    <td style={{ textAlign: 'right', color: 'var(--text-secondary)' }}>{fmt(coin.market_cap)}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                                            {trendingIds.has(coin.id) && (
                                                <span className="badge badge-orange">🔥 Trending</span>
                                            )}
                                            {coin.market_cap < 1e8 && (
                                                <span className="badge badge-purple">💎 Low Cap</span>
                                            )}
                                            {(coin.price_change_percentage_7d_in_currency ?? 0) > 10 && (
                                                <span className="badge badge-green">📈 Momentum</span>
                                            )}
                                        </div>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <span className={`badge ${badge.cls}`}>{badge.label}</span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function ZeroCapCoins({ coins }: { coins: MarketCoin[] }) {
    const zeroCap = coins
        .filter((c) => c.market_cap < 1_000_000 && c.market_cap >= 0)
        .sort((a, b) => b.total_volume - a.total_volume)
        .slice(0, 20);

    if (zeroCap.length === 0) return null;

    return (
        <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <Star size={18} color="var(--accent-purple)" />
                <h2 className="section-title" style={{ marginBottom: 0 }}>Zero/Micro Cap Tokens</h2>
                <span className="badge badge-purple">Potential Testnet Projects</span>
            </div>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                    gap: 10,
                }}
            >
                {zeroCap.map((coin) => (
                    <div
                        key={coin.id}
                        style={{
                            background: 'var(--bg-primary)',
                            border: '1px solid var(--border)',
                            borderRadius: 8,
                            padding: '12px 14px',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={coin.image} alt={coin.name} width={20} height={20} style={{ borderRadius: '50%' }} />
                            <div style={{ fontWeight: 600, fontSize: 13 }}>{coin.name}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{coin.symbol}</div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                            <span style={{ color: 'var(--text-muted)' }}>MCap</span>
                            <span style={{ fontWeight: 600, color: 'var(--accent-purple)' }}>{fmt(coin.market_cap)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginTop: 4 }}>
                            <span style={{ color: 'var(--text-muted)' }}>Vol 24h</span>
                            <span style={{ fontWeight: 600 }}>{fmt(coin.total_volume)}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function AirdropPage() {
    const [networks, setNetworks] = useState<Network[]>([]);
    const [coins, setCoins] = useState<MarketCoin[]>([]);
    const [trendingIds, setTrendingIds] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.allSettled([
            fetch('/api/networks').then((r) => r.json()),
            fetch('/api/markets?per_page=250&order=market_cap_asc').then((r) => r.json()),
            fetch('/api/trending').then((r) => r.json()),
        ]).then(([nets, mkts, trnd]) => {
            if (nets.status === 'fulfilled') setNetworks(nets.value?.data ?? []);
            if (mkts.status === 'fulfilled') setCoins(Array.isArray(mkts.value) ? mkts.value : []);
            if (trnd.status === 'fulfilled') {
                const coins: TrendingCoin[] = trnd.value?.coins ?? [];
                setTrendingIds(new Set(coins.map((c) => c.item.id)));
            }
            setLoading(false);
        });
    }, []);

    if (loading)
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {[1, 2, 3].map((i) => (
                    <div key={i} className="skeleton" style={{ height: 200, borderRadius: 12 }} />
                ))}
            </div>
        );

    return (
        <div className="fade-in">
            <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>
                    <Rocket size={22} style={{ display: 'inline', marginRight: 8, color: 'var(--accent-orange)' }} />
                    Airdrop Radar
                </h1>
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                    Heuristic scoring to surface potential airdrop & testnet opportunities
                </p>
            </div>

            {networks.length > 0 && <NetworkList networks={networks} />}
            {coins.length > 0 && <OpportunityTable coins={coins} trendingIds={trendingIds} />}
            {coins.length > 0 && <ZeroCapCoins coins={coins} />}
        </div>
    );
}
