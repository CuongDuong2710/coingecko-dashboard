'use client';

import { useEffect, useState } from 'react';
import { Radio } from 'lucide-react';

interface StatusUpdate {
    description: string;
    created_at: string;
    project: {
        name: string;
        image: { thumb: string; small: string; large: string };
    };
}

export default function NewsWidget() {
    const [news, setNews] = useState<StatusUpdate[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/news')
            .then((r) => r.json())
            .then((d) => {
                if (d.status_updates) setNews(d.status_updates);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                    <Radio size={14} color="var(--accent-purple)" />
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Live Feed
                    </span>
                </div>
                {[1, 2, 3].map((i) => (
                    <div key={i} style={{ marginBottom: 12 }}>
                        <div className="skeleton" style={{ width: '60%', height: 12, marginBottom: 6, borderRadius: 4 }} />
                        <div className="skeleton" style={{ width: '90%', height: 10, borderRadius: 4 }} />
                    </div>
                ))}
            </div>
        );
    }

    if (!news.length) return null;

    return (
        <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
                <Radio size={14} color="var(--accent-purple)" />
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Live Feed
                </span>
            </div>

            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 16,
                    maxHeight: 280,
                    overflowY: 'auto',
                    paddingRight: 8, // space for scrollbar
                }}
            >
                {news.map((item, i) => (
                    <div key={i} className="fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={item.project?.image?.thumb}
                                alt={item.project?.name}
                                width={18}
                                height={18}
                                style={{ borderRadius: '50%' }}
                            />
                            <div style={{ fontWeight: 600, fontSize: 12, color: 'var(--text-primary)' }}>
                                {item.project?.name}
                            </div>
                            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginLeft: 'auto' }}>
                                {new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </div>
                        </div>
                        <p
                            style={{
                                fontSize: 12,
                                color: 'var(--text-secondary)',
                                lineHeight: 1.5,
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}
                            dangerouslySetInnerHTML={{
                                __html: item.description.replace(/<a /g, '<a style="color: var(--accent-blue)" target="_blank" rel="noopener noreferrer" '),
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
