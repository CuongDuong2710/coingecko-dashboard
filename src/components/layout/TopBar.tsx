'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Globe } from 'lucide-react';

interface GlobalData {
    total_market_cap_usd: number;
    btc_dominance: number;
    market_cap_change_24h: number;
    active_cryptocurrencies: number;
    total_volume_usd: number;
}

function formatMarketCap(num: number): string {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    return `$${(num / 1e6).toFixed(2)}M`;
}

function formatVolume(num: number): string {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    return `$${(num / 1e6).toFixed(0)}M`;
}

export default function TopBar() {
    const [data, setData] = useState<GlobalData | null>(null);
    const [time, setTime] = useState<string>('');

    useEffect(() => {
        const updateTime = () =>
            setTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
        updateTime();
        const t = setInterval(updateTime, 1000);

        fetch('/api/global')
            .then((r) => r.json())
            .then((d) => setData(d.data))
            .catch(() => null);

        return () => clearInterval(t);
    }, []);

    const up = data ? (data.market_cap_change_24h ?? 0) >= 0 : false;

    return (
        <header
            style={{
                height: 56,
                background: 'var(--bg-secondary)',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                padding: '0 24px',
                gap: 32,
                position: 'sticky',
                top: 0,
                zIndex: 40,
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginRight: 8 }}>
                <Globe size={14} color="var(--text-muted)" />
                <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>
                    Global Markets
                </span>
            </div>

            {data ? (
                <>
                    <StatItem
                        label="Market Cap"
                        value={formatMarketCap(data.total_market_cap_usd ?? 0)}
                        change={`${(data.market_cap_change_24h ?? 0) >= 0 ? '+' : ''}${(data.market_cap_change_24h ?? 0).toFixed(2)}%`}
                        positive={up}
                    />
                    <StatItem
                        label="24h Volume"
                        value={formatVolume(data.total_volume_usd ?? 0)}
                    />
                    <StatItem
                        label="BTC Dominance"
                        value={`${(data.btc_dominance ?? 0).toFixed(1)}%`}
                    />
                    <StatItem
                        label="Coins"
                        value={(data.active_cryptocurrencies ?? 0).toLocaleString()}
                    />
                </>
            ) : (
                <div style={{ display: 'flex', gap: 32 }}>
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <div className="skeleton" style={{ width: 60, height: 10 }} />
                            <div className="skeleton" style={{ width: 80, height: 15 }} />
                        </div>
                    ))}
                </div>
            )}

            <div style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-muted)', fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>
                {time}
            </div>
        </header>
    );
}

function StatItem({
    label,
    value,
    change,
    positive,
}: {
    label: string;
    value: string;
    change?: string;
    positive?: boolean;
}) {
    return (
        <div className="topbar-stat">
            <div className="topbar-stat-label">{label}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="topbar-stat-value">{value}</span>
                {change && (
                    <span
                        style={{
                            fontSize: 11,
                            fontWeight: 600,
                            color: positive ? 'var(--accent-green)' : 'var(--accent-red)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                        }}
                    >
                        {positive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                        {change}
                    </span>
                )}
            </div>
        </div>
    );
}
