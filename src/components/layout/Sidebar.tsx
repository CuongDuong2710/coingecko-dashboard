'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    TrendingUp,
    Activity,
    Droplets,
    Rocket,
    Image as ImageIcon,
    Zap,
} from 'lucide-react';

const navItems = [
    { label: 'Alpha Dashboard', href: '/', icon: TrendingUp },
    { label: 'On-chain DEX', href: '/onchain', icon: Activity },
    { label: 'Airdrop Radar', href: '/airdrop', icon: Rocket },
    { label: 'NFT Markets', href: '/nfts', icon: ImageIcon },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside
            style={{
                width: 'var(--sidebar-width)',
                background: 'var(--bg-secondary)',
                borderRight: '1px solid var(--border)',
                position: 'fixed',
                top: 0,
                left: 0,
                bottom: 0,
                display: 'flex',
                flexDirection: 'column',
                zIndex: 50,
            }}
        >
            {/* Logo */}
            <div
                style={{
                    padding: '20px 20px 16px',
                    borderBottom: '1px solid var(--border)',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                        style={{
                            width: 34,
                            height: 34,
                            borderRadius: 9,
                            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                        }}
                    >
                        <Zap size={18} color="white" />
                    </div>
                    <div>
                        <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                            CryptoAlpha
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>
                            Market Intelligence
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav style={{ flex: 1, padding: '12px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '8px 8px 4px' }}>
                    Explore
                </div>
                {navItems.map(({ label, href, icon: Icon }) => {
                    const isActive = pathname === href;
                    return (
                        <Link
                            key={href}
                            href={href}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                                padding: '9px 12px',
                                borderRadius: 8,
                                fontSize: 13,
                                fontWeight: isActive ? 600 : 500,
                                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                                background: isActive ? 'var(--bg-card-hover)' : 'transparent',
                                textDecoration: 'none',
                                transition: 'all 0.15s ease',
                                position: 'relative',
                            }}
                            className="sidebar-link"
                        >
                            {isActive && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        left: 0,
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        width: 3,
                                        height: 18,
                                        background: 'var(--accent-blue)',
                                        borderRadius: '0 3px 3px 0',
                                    }}
                                />
                            )}
                            <Icon
                                size={16}
                                color={isActive ? 'var(--accent-blue)' : 'var(--text-muted)'}
                                style={{ flexShrink: 0 }}
                            />
                            {label}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div
                style={{
                    padding: '16px 20px',
                    borderTop: '1px solid var(--border)',
                    fontSize: 11,
                    color: 'var(--text-muted)',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <span className="live-dot" />
                    <span style={{ color: 'var(--accent-green)', fontWeight: 500 }}>Live Data</span>
                </div>
                <div>Powered by CoinGecko API</div>
            </div>
        </aside>
    );
}
