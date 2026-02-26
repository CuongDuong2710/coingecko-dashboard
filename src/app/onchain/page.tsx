'use client';

import { useEffect, useState } from 'react';
import { Activity, Clock, Droplets, RefreshCw } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Pool {
    id: string;
    attributes: {
        name: string;
        address: string;
        base_token_price_usd: string;
        quote_token_price_usd: string;
        pool_created_at: string;
        reserve_in_usd: string;
        volume_usd: { h24: string; h6: string; h1: string };
        price_change_percentage: { h24: string; h6: string; h1: string };
        transactions: { h24: { buys: number; sells: number } };
        fdv_usd: string;
    };
    relationships: {
        base_token?: { data: { id: string } };
        dex?: { data: { id: string } };
        network?: { data: { id: string } };
    };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function age(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60_000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
}

function fmtUsd(s: string | null) {
    const n = parseFloat(s ?? '0');
    if (isNaN(n)) return '–';
    if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
    if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
    if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}K`;
    return `$${n.toFixed(2)}`;
}

function pctColor(s: string | null) {
    const n = parseFloat(s ?? '0');
    if (isNaN(n)) return 'var(--text-muted)';
    return n >= 0 ? 'var(--accent-green)' : 'var(--accent-red)';
}

function pctFmt(s: string | null) {
    const n = parseFloat(s ?? '0');
    if (isNaN(n)) return '–';
    return `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`;
}

// ─── Pool Table ──────────────────────────────────────────────────────────────

function PoolTable({ pools, title, icon }: { pools: Pool[]; title: string; icon: React.ReactNode }) {
    return (
        <div className="card" style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                {icon}
                <h2 className="section-title" style={{ marginBottom: 0 }}>
                    {title}
                </h2>
                <span className="badge badge-blue">{pools.length} pools</span>
            </div>
            <div className="table-container" style={{ background: 'transparent', border: 'none' }}>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Pool</th>
                            <th>Network / DEX</th>
                            <th style={{ textAlign: 'right' }}>Liquidity</th>
                            <th style={{ textAlign: 'right' }}>Vol 24h</th>
                            <th style={{ textAlign: 'right' }}>Price Δ 1h</th>
                            <th style={{ textAlign: 'right' }}>Price Δ 24h</th>
                            <th style={{ textAlign: 'right' }}>Buys / Sells</th>
                            <th style={{ textAlign: 'right' }}>Age</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pools.slice(0, 20).map((pool) => {
                            const attr = pool.attributes;
                            const networkId = pool.relationships?.network?.data?.id ?? '–';
                            const dexId = pool.relationships?.dex?.data?.id ?? '–';
                            return (
                                <tr key={pool.id}>
                                    <td>
                                        <div style={{ fontWeight: 600, fontSize: 13 }}>
                                            {attr.name?.split(' / ')[0] ?? '–'}
                                        </div>
                                        <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                                            {attr.address?.slice(0, 12)}…
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                            <span className="badge badge-purple" style={{ width: 'fit-content' }}>
                                                {networkId}
                                            </span>
                                            <span className="badge badge-gray" style={{ width: 'fit-content' }}>
                                                {dexId}
                                            </span>
                                        </div>
                                    </td>
                                    <td style={{ textAlign: 'right', fontWeight: 600 }}>
                                        {fmtUsd(attr.reserve_in_usd)}
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        {fmtUsd(attr.volume_usd?.h24)}
                                    </td>
                                    <td
                                        style={{
                                            textAlign: 'right',
                                            color: pctColor(attr.price_change_percentage?.h1),
                                            fontWeight: 600,
                                        }}
                                    >
                                        {pctFmt(attr.price_change_percentage?.h1)}
                                    </td>
                                    <td
                                        style={{
                                            textAlign: 'right',
                                            color: pctColor(attr.price_change_percentage?.h24),
                                            fontWeight: 600,
                                        }}
                                    >
                                        {pctFmt(attr.price_change_percentage?.h24)}
                                    </td>
                                    <td style={{ textAlign: 'right', fontSize: 12 }}>
                                        <span style={{ color: 'var(--accent-green)' }}>
                                            {attr.transactions?.h24?.buys ?? '–'}B
                                        </span>
                                        {' / '}
                                        <span style={{ color: 'var(--accent-red)' }}>
                                            {attr.transactions?.h24?.sells ?? '–'}S
                                        </span>
                                    </td>
                                    <td style={{ textAlign: 'right', color: 'var(--text-muted)', fontSize: 12 }}>
                                        {attr.pool_created_at ? age(attr.pool_created_at) : '–'}
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

// ─── Network selector ────────────────────────────────────────────────────────

const NETWORKS = [
    { id: 'eth', label: 'Ethereum' },
    { id: 'bsc', label: 'BNB Chain' },
    { id: 'solana', label: 'Solana' },
    { id: 'base', label: 'Base' },
    { id: 'arbitrum', label: 'Arbitrum' },
    { id: 'polygon_pos', label: 'Polygon' },
    { id: 'avax', label: 'Avalanche' },
];

// ─── Page ────────────────────────────────────────────────────────────────────

export default function OnchainPage() {
    const [newPools, setNewPools] = useState<Pool[]>([]);
    const [trendingPools, setTrendingPools] = useState<Pool[]>([]);
    const [network, setNetwork] = useState('eth');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    async function loadData(net: string) {
        setRefreshing(true);
        const [np, tp] = await Promise.allSettled([
            fetch('/api/new-pools').then((r) => r.json()),
            fetch(`/api/trending-pools?network=${net}`).then((r) => r.json()),
        ]);
        if (np.status === 'fulfilled') setNewPools(np.value?.data ?? []);
        if (tp.status === 'fulfilled') setTrendingPools(tp.value?.data ?? []);
        setLoading(false);
        setRefreshing(false);
    }

    useEffect(() => { loadData(network); }, [network]);

    if (loading)
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {[1, 2].map((i) => (
                    <div key={i} className="skeleton" style={{ height: 300, borderRadius: 12 }} />
                ))}
            </div>
        );

    return (
        <div className="fade-in">
            {/* Header */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 28,
                    flexWrap: 'wrap',
                    gap: 12,
                }}
            >
                <div>
                    <h1
                        style={{
                            fontSize: 24,
                            fontWeight: 800,
                            color: 'var(--text-primary)',
                            marginBottom: 4,
                        }}
                    >
                        On-chain DEX
                    </h1>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                        Real-time pool tracker powered by GeckoTerminal
                    </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <select
                        id="network-select"
                        className="select-input"
                        value={network}
                        onChange={(e) => setNetwork(e.target.value)}
                    >
                        {NETWORKS.map((n) => (
                            <option key={n.id} value={n.id}>
                                {n.label}
                            </option>
                        ))}
                    </select>
                    <button
                        className="btn"
                        onClick={() => loadData(network)}
                        disabled={refreshing}
                    >
                        <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
                        Refresh
                    </button>
                </div>
            </div>

            <PoolTable
                pools={newPools}
                title="Newly Deployed Pools"
                icon={<Clock size={18} color="var(--accent-cyan)" />}
            />

            <PoolTable
                pools={trendingPools}
                title={`Whale Radar — ${NETWORKS.find((n) => n.id === network)?.label ?? network}`}
                icon={<Activity size={18} color="var(--accent-purple)" />}
            />
        </div>
    );
}
