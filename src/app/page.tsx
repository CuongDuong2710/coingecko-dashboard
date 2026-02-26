'use client';

import { useEffect, useState, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Search,
  ArrowUpDown,
  Flame,
  AlertTriangle,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

// ─── Types ──────────────────────────────────────────────────────────────────

interface TrendingCoin {
  item: {
    id: string;
    name: string;
    symbol: string;
    thumb: string;
    market_cap_rank: number;
    data: {
      price: string;
      price_change_percentage_24h: { usd: number };
      market_cap: string;
      total_volume: string;
    };
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
  price_change_percentage_1h_in_currency: number;
  price_change_percentage_7d_in_currency: number;
  market_cap_rank: number;
}

interface Category {
  id: string;
  name: string;
  market_cap_change_24h: number;
  market_cap: number;
}

// ─── Helper fns ─────────────────────────────────────────────────

function fmt(n: number, digits = 2) {
  if (n === null || n === undefined) return '–';
  if (Math.abs(n) >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (Math.abs(n) >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (Math.abs(n) >= 1e3) return `$${(n / 1e3).toFixed(2)}K`;
  return `$${n.toFixed(digits)}`;
}

function pct(n: number | null) {
  if (n === null || n === undefined) return '–';
  return `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`;
}

function PctBadge({ value }: { value: number | null }) {
  if (value === null || value === undefined)
    return <span style={{ color: 'var(--text-muted)' }}>–</span>;
  const pos = value >= 0;
  return (
    <span
      className={pos ? 'positive' : 'negative'}
      style={{ display: 'flex', alignItems: 'center', gap: 3, fontWeight: 600 }}
    >
      {pos ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
      {Math.abs(value).toFixed(2)}%
    </span>
  );
}

// ─── Trending Cards ───────────────────────────────────────────────────────────

function TrendingCards({ coins }: { coins: TrendingCoin[] }) {
  return (
    <section style={{ marginBottom: 36 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <Flame size={18} color="var(--accent-orange)" />
        <h2 className="section-title" style={{ marginBottom: 0 }}>
          Trending Now
        </h2>
        <span className="badge badge-orange" style={{ marginLeft: 4 }}>TOP 7</span>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 14,
        }}
      >
        {coins.slice(0, 7).map((c, i) => {
          const change = c.item.data?.price_change_percentage_24h?.usd ?? 0;
          const pos = change >= 0;
          return (
            <div
              key={c.item.id}
              className="card fade-in"
              style={{
                animationDelay: `${i * 50}ms`,
                position: 'relative',
                overflow: 'hidden',
                cursor: 'default',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: 80,
                  height: 80,
                  background: pos
                    ? 'radial-gradient(circle at top right, rgba(16,185,129,0.08), transparent)'
                    : 'radial-gradient(circle at top right, rgba(239,68,68,0.08), transparent)',
                }}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    background: 'var(--bg-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 13,
                    fontWeight: 700,
                    color: 'var(--accent-blue)',
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.item.thumb}
                  alt={c.item.name}
                  width={28}
                  height={28}
                  style={{ borderRadius: '50%' }}
                />
                <div style={{ overflow: 'hidden' }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {c.item.name}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: 'var(--text-muted)',
                      textTransform: 'uppercase',
                    }}
                  >
                    {c.item.symbol}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 2 }}>Price</div>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>
                    {c.item.data?.price ?? '–'}
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                    fontWeight: 700,
                    fontSize: 13,
                    color: pos ? 'var(--accent-green)' : 'var(--accent-red)',
                  }}
                >
                  {pos ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                  {pct(change)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ─── Category Heatmap ────────────────────────────────────────────────────────

function CategoryHeatmap({ categories }: { categories: Category[] }) {
  const top = categories.slice(0, 12);
  return (
    <div className="card" style={{ marginBottom: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <h2 className="section-title" style={{ marginBottom: 0 }}>
          Sector Performance
        </h2>
        <span className="badge badge-blue">24H</span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={top} margin={{ top: 0, right: 0, bottom: 0, left: 0 }} barSize={28}>
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
            axisLine={false}
            tickLine={false}
            interval={0}
            angle={-30}
            textAnchor="end"
            height={50}
          />
          <YAxis
            tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}%`}
            width={40}
          />
          <Tooltip
            contentStyle={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              color: 'var(--text-primary)',
              fontSize: 12,
            }}
            formatter={(v: number) => [`${v.toFixed(2)}%`, '24h Change']}
          />
          <Bar dataKey="market_cap_change_24h" radius={[4, 4, 0, 0]}>
            {top.map((entry) => (
              <Cell
                key={entry.id}
                fill={
                  entry.market_cap_change_24h >= 0
                    ? 'var(--accent-green)'
                    : 'var(--accent-red)'
                }
                fillOpacity={0.8}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Market Table ─────────────────────────────────────────────────────────────

type SortKey = 'market_cap_rank' | 'current_price' | 'price_change_percentage_24h' | 'market_cap' | 'total_volume';

function MarketTable({ coins }: { coins: MarketCoin[] }) {
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('market_cap_rank');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 20;

  const anomalies = useMemo(
    () =>
      new Set(
        coins
          .filter(
            (c) =>
              c.total_volume / (c.market_cap || 1) > 0.5 &&
              Math.abs(c.price_change_percentage_24h) < 5
          )
          .map((c) => c.id)
      ),
    [coins]
  );

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return coins.filter(
      (c) =>
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.symbol.toLowerCase().includes(q)
    );
  }, [coins, query]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const aV = a[sortKey] ?? 0;
      const bV = b[sortKey] ?? 0;
      return sortDir === 'asc' ? (aV as number) - (bV as number) : (bV as number) - (aV as number);
    });
  }, [filtered, sortKey, sortDir]);

  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
    setPage(1);
  }

  function SortIcon({ k }: { k: SortKey }) {
    if (sortKey !== k) return <ArrowUpDown size={11} style={{ opacity: 0.3 }} />;
    return sortDir === 'asc' ? <ChevronUp size={11} /> : <ChevronDown size={11} />;
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <h2 className="section-title" style={{ marginBottom: 0 }}>
            Market Overview
          </h2>
          {anomalies.size > 0 && (
            <span
              className="badge badge-yellow"
              title="Coins with high volume but small price move (potential squeeze)"
            >
              <AlertTriangle size={10} />
              {anomalies.size} Anomal{anomalies.size > 1 ? 'ies' : 'y'}
            </span>
          )}
        </div>
        <div style={{ position: 'relative' }}>
          <Search
            size={14}
            style={{
              position: 'absolute',
              left: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
            }}
          />
          <input
            id="market-search"
            className="search-input"
            style={{ paddingLeft: 32 }}
            placeholder="Search coins…"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
          />
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th onClick={() => toggleSort('market_cap_rank')}>
                # <SortIcon k="market_cap_rank" />
              </th>
              <th>Coin</th>
              <th onClick={() => toggleSort('current_price')} style={{ textAlign: 'right' }}>
                Price <SortIcon k="current_price" />
              </th>
              <th
                onClick={() => toggleSort('price_change_percentage_24h')}
                style={{ textAlign: 'right' }}
              >
                24h % <SortIcon k="price_change_percentage_24h" />
              </th>
              <th style={{ textAlign: 'right' }}>1h %</th>
              <th style={{ textAlign: 'right' }}>7d %</th>
              <th onClick={() => toggleSort('market_cap')} style={{ textAlign: 'right' }}>
                Market Cap <SortIcon k="market_cap" />
              </th>
              <th onClick={() => toggleSort('total_volume')} style={{ textAlign: 'right' }}>
                Volume <SortIcon k="total_volume" />
              </th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((coin) => (
              <tr
                key={coin.id}
                style={{
                  background: anomalies.has(coin.id)
                    ? 'rgba(245,158,11,0.04)'
                    : undefined,
                }}
              >
                <td style={{ color: 'var(--text-muted)', fontWeight: 600 }}>
                  {coin.market_cap_rank}
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={coin.image}
                      alt={coin.name}
                      width={22}
                      height={22}
                      style={{ borderRadius: '50%', flexShrink: 0 }}
                    />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{coin.name}</div>
                      <div
                        style={{
                          fontSize: 11,
                          color: 'var(--text-muted)',
                          textTransform: 'uppercase',
                        }}
                      >
                        {coin.symbol}
                      </div>
                    </div>
                    {anomalies.has(coin.id) && (
                      <AlertTriangle
                        size={12}
                        color="var(--accent-yellow)"
                        title="Volume spike anomaly"
                      />
                    )}
                  </div>
                </td>
                <td style={{ textAlign: 'right', fontWeight: 600 }}>
                  {fmt(coin.current_price)}
                </td>
                <td style={{ textAlign: 'right' }}>
                  <PctBadge value={coin.price_change_percentage_24h} />
                </td>
                <td style={{ textAlign: 'right' }}>
                  <PctBadge value={coin.price_change_percentage_1h_in_currency} />
                </td>
                <td style={{ textAlign: 'right' }}>
                  <PctBadge value={coin.price_change_percentage_7d_in_currency} />
                </td>
                <td style={{ textAlign: 'right', color: 'var(--text-secondary)' }}>
                  {fmt(coin.market_cap)}
                </td>
                <td style={{ textAlign: 'right', color: 'var(--text-secondary)' }}>
                  {fmt(coin.total_volume)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 8,
            marginTop: 16,
          }}
        >
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`btn${page === i + 1 ? ' btn-primary' : ''}`}
              style={{ padding: '4px 10px', fontSize: 12 }}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function AlphaDashboard() {
  const [trending, setTrending] = useState<TrendingCoin[]>([]);
  const [markets, setMarkets] = useState<MarketCoin[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      fetch('/api/trending').then((r) => r.json()),
      fetch('/api/markets?per_page=100&order=market_cap_desc').then((r) => r.json()),
      fetch('/api/categories').then((r) => r.json()),
    ]).then(([t, m, c]) => {
      if (t.status === 'fulfilled') setTrending(t.value?.coins ?? []);
      if (m.status === 'fulfilled') setMarkets(Array.isArray(m.value) ? m.value : []);
      if (c.status === 'fulfilled') setCategories(Array.isArray(c.value) ? c.value : []);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="skeleton" style={{ height: 80, borderRadius: 12 }} />
        ))}
      </div>
    );
  }

  return (
    <div className="fade-in">
      {trending.length > 0 && <TrendingCards coins={trending} />}
      {categories.length > 0 && (
        <CategoryHeatmap categories={categories} />
      )}
      {markets.length > 0 && <MarketTable coins={markets} />}
    </div>
  );
}
