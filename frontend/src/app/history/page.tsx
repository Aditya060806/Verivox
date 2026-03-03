"use client";

import { useState, useEffect, useCallback } from "react";
import {
    Clock, FileText, Image as ImageIcon, Globe, Layers,
    Shield, RefreshCw, ChevronRight, Search, Filter, Trash2,
    CheckCircle2, XCircle, AlertTriangle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import Link from "next/link";
import {
    getAllAnalyses,
    deleteAnalysis,
    clearAllAnalyses,
    onHistoryChange,
    type HistoryEntry,
} from "@/lib/history-store";

function formatRelativeTime(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
}

function formatAbsoluteTime(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleString("en-US", {
        month: "short", day: "numeric",
        hour: "numeric", minute: "2-digit",
        hour12: true,
    });
}

function getVerdictBg(v: string) {
    if (v === "Credible") return "vbg-green";
    if (v === "Misleading") return "vbg-red";
    return "vbg-yellow";
}
function getVerdictIcon(v: string) {
    if (v === "Credible") return <CheckCircle2 className="h-4 w-4" style={{ color: "#8ecfaa" }} />;
    if (v === "Misleading") return <XCircle className="h-4 w-4" style={{ color: "#e08c8c" }} />;
    return <AlertTriangle className="h-4 w-4" style={{ color: "#e0c97a" }} />;
}
function getTypeIcon(type: string) {
    if (type === "text") return <FileText className="h-3.5 w-3.5" />;
    if (type === "image") return <ImageIcon className="h-3.5 w-3.5" />;
    return <Globe className="h-3.5 w-3.5" />;
}
function scoreColor(s: number) {
    if (s >= 70) return "#8ecfaa";
    if (s >= 45) return "#e0c97a";
    return "#e08c8c";
}

type FilterType = "all" | "text" | "image" | "page";
type FilterVerdict = "all" | "Credible" | "Uncertain" | "Misleading";

export default function HistoryPage() {
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState<FilterType>("all");
    const [verdictFilter, setVerdictFilter] = useState<FilterVerdict>("all");
    const [confirmClear, setConfirmClear] = useState(false);

    const loadHistory = useCallback(async () => {
        setLoading(true);
        try {
            const items = await getAllAnalyses();
            setHistory(items);
        } catch {
            setHistory([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadHistory();
        const unsub = onHistoryChange(() => loadHistory());
        return unsub;
    }, [loadHistory]);

    const handleDelete = useCallback(async (id: number) => {
        await deleteAnalysis(id);
        setHistory((prev) => prev.filter((h) => h.id !== id));
    }, []);

    const handleClearAll = useCallback(async () => {
        await clearAllAnalyses();
        setHistory([]);
        setConfirmClear(false);
    }, []);

    const filtered = history.filter((item) => {
        const matchQuery = item.title.toLowerCase().includes(query.toLowerCase());
        const matchType = typeFilter === "all" || item.type === typeFilter;
        const matchVerdict = verdictFilter === "all" || item.verdict === verdictFilter;
        return matchQuery && matchType && matchVerdict;
    });

    const stats = {
        total: history.length,
        credible: history.filter((h) => h.verdict === "Credible").length,
        misleading: history.filter((h) => h.verdict === "Misleading").length,
        avgScore: history.length > 0
            ? Math.round(history.reduce((a, b) => a + b.score, 0) / history.length)
            : 0,
    };

    return (
        <div className="relative min-h-screen flex flex-col">
            <div className="aurora-bg" aria-hidden="true">
                <div className="aurora-orb-3" />
            </div>
            <div className="grid-overlay" aria-hidden="true" />

            <header className="sticky top-0 z-50 border-b border-white/5 bg-background/60 backdrop-blur-xl">
                <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
                    <Link href="/" className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/8 border border-white/10">
                            <Layers className="h-3.5 w-3.5 text-white" />
                        </div>
                        <span className="text-sm font-bold tracking-tight text-white">Verivox</span>
                        <Badge variant="outline" className="text-[9px] font-semibold uppercase tracking-widest text-white/60 border-white/15 bg-white/5">
                            Beta
                        </Badge>
                    </Link>
                    <nav className="flex items-center gap-1 text-xs text-white/50">
                        <Link href="/" className="px-3 py-1.5 rounded-md hover:text-white hover:bg-white/5 transition-colors">Dashboard</Link>
                        <Link href="/history" className="px-3 py-1.5 rounded-md text-white bg-white/8 transition-colors">History</Link>
                        <Link href="/about" className="px-3 py-1.5 rounded-md hover:text-white hover:bg-white/5 transition-colors">About</Link>
                    </nav>
                </div>
            </header>

            <main className="flex-1 mx-auto w-full max-w-5xl px-4 sm:px-6 py-10 space-y-8 relative z-10">

                <ScrollReveal direction="up">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-white/90 flex items-center gap-2">
                                <Clock className="h-5 w-5" style={{ color: "#8eb8cf" }} />
                                Analysis History
                            </h1>
                            <p className="text-sm text-white/35 mt-1">
                                {history.length > 0
                                    ? `${history.length} analyses stored locally`
                                    : "All your past verification results"}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            {history.length > 0 && (
                                confirmClear ? (
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-[11px] text-white/40">Delete all?</span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-7 text-[11px] border-red-400/30 text-red-400 hover:bg-red-400/10 hover:text-red-400"
                                            onClick={handleClearAll}
                                        >
                                            Yes, clear
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-7 text-[11px] border-white/10 text-white/50 hover:bg-white/5"
                                            onClick={() => setConfirmClear(false)}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                ) : (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-1.5 text-xs border-white/10 text-white/40 hover:text-red-400 hover:border-red-400/30 hover:bg-red-400/5"
                                        onClick={() => setConfirmClear(true)}
                                    >
                                        <Trash2 className="h-3 w-3" />
                                        Clear All
                                    </Button>
                                )
                            )}
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-1.5 text-xs border-white/10 text-white/50 hover:text-white hover:bg-white/5"
                                onClick={loadHistory}
                            >
                                <RefreshCw className="h-3.5 w-3.5" />
                                Refresh
                            </Button>
                        </div>
                    </div>
                </ScrollReveal>

                <ScrollReveal direction="up" delay={0.05}>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                            { label: "Total Analyses", value: stats.total, color: "rgba(255,255,255,0.8)" },
                            { label: "Credible", value: stats.credible, color: "#8ecfaa" },
                            { label: "Misleading", value: stats.misleading, color: "#e08c8c" },
                            { label: "Avg Trust Score", value: stats.avgScore, color: "#8eb8cf" },
                        ].map(({ label, value, color }) => (
                            <div key={label} className="glass-card rounded-xl p-4 text-center">
                                <p className="text-2xl font-black" style={{ color }}>{value}</p>
                                <p className="text-[11px] text-white/35 mt-1">{label}</p>
                            </div>
                        ))}
                    </div>
                </ScrollReveal>

                <ScrollReveal direction="up" delay={0.1}>
                    <div className="flex flex-wrap gap-3">
                        <div className="relative flex-1 min-w-[200px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
                            <Input
                                placeholder="Search analyses…"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="pl-8 bg-white/4 border-white/8 text-sm text-white/80 placeholder:text-white/25 focus:border-white/20"
                            />
                        </div>
                        <div className="flex gap-1">
                            {(["all", "text", "image", "page"] as FilterType[]).map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setTypeFilter(t)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${typeFilter === t
                                            ? "bg-white/12 text-white"
                                            : "text-white/40 hover:text-white/70 hover:bg-white/5"
                                        }`}
                                >
                                    {t === "all" ? "All Types" : t}
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-1">
                            {(["all", "Credible", "Uncertain", "Misleading"] as FilterVerdict[]).map((v) => (
                                <button
                                    key={v}
                                    onClick={() => setVerdictFilter(v)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${verdictFilter === v
                                            ? "bg-white/12 text-white"
                                            : "text-white/40 hover:text-white/70 hover:bg-white/5"
                                        }`}
                                >
                                    {v === "all" ? "All Verdicts" : v}
                                </button>
                            ))}
                        </div>
                    </div>
                </ScrollReveal>

                <ScrollReveal direction="up" delay={0.15}>
                    <div className="space-y-2">
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="glass-card rounded-xl h-16 shimmer" />
                            ))
                        ) : filtered.length === 0 ? (
                            <div className="glass-card rounded-xl py-16 text-center">
                                {history.length === 0 ? (
                                    <>
                                        <Shield className="h-10 w-10 text-white/15 mx-auto mb-3" />
                                        <p className="text-sm text-white/35">No analyses yet.</p>
                                        <p className="text-xs text-white/25 mt-1 mb-4">
                                            Go to the Dashboard and analyze some content — it will appear here automatically.
                                        </p>
                                        <Link
                                            href="/"
                                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black text-sm font-semibold hover:bg-white/90 transition-all hover:scale-105"
                                        >
                                            Go to Dashboard <ChevronRight className="h-4 w-4" />
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Filter className="h-8 w-8 text-white/20 mx-auto mb-3" />
                                        <p className="text-sm text-white/35">No analyses match your filters.</p>
                                        <button
                                            className="mt-3 text-xs text-white/40 hover:text-white/70 transition-colors underline underline-offset-2"
                                            onClick={() => { setQuery(""); setTypeFilter("all"); setVerdictFilter("all"); }}
                                        >
                                            Clear all filters
                                        </button>
                                    </>
                                )}
                            </div>
                        ) : (
                            filtered.map((item, i) => (
                                <div
                                    key={item.id}
                                    className="glass-card rounded-xl px-4 py-3.5 flex items-center gap-3 group hover:border-white/12 transition-all animate-fade-in"
                                    style={{ animationDelay: `${i * 30}ms` }}
                                >
                                    {/* Index */}
                                    <span className="text-[11px] font-mono text-white/20 w-6 text-right shrink-0">
                                        #{filtered.length - i}
                                    </span>

                                    {/* Type icon */}
                                    <div className="h-8 w-8 shrink-0 flex items-center justify-center rounded-lg bg-white/5 text-white/40 group-hover:text-white/60 transition-colors">
                                        {getTypeIcon(item.type)}
                                    </div>

                                    {/* Title + metadata */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white/80 truncate group-hover:text-white transition-colors">
                                            {item.title}
                                        </p>
                                        <div className="mt-1 flex items-center gap-2 flex-wrap">
                                            <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded font-semibold ${getVerdictBg(item.verdict)}`}>
                                                {item.verdict}
                                            </span>
                                            <span className="text-[11px] text-white/25 capitalize">{item.type}</span>
                                            <span className="text-[11px] text-white/20">·</span>
                                            <span className="text-[11px] text-white/25">{formatRelativeTime(item.time)}</span>
                                            <span className="text-[11px] text-white/20">·</span>
                                            <span className="text-[10px] text-white/20">{formatAbsoluteTime(item.time)}</span>
                                        </div>
                                    </div>

                                    {/* Verdict icon */}
                                    <div className="shrink-0">{getVerdictIcon(item.verdict)}</div>

                                    {/* Score */}
                                    <div
                                        className="shrink-0 flex h-9 w-9 items-center justify-center rounded-lg text-sm font-black"
                                        style={{ background: `${scoreColor(item.score)}15`, color: scoreColor(item.score) }}
                                    >
                                        {item.score}
                                    </div>

                                    {/* Delete */}
                                    <button
                                        onClick={() => item.id !== undefined && handleDelete(item.id)}
                                        className="shrink-0 h-7 w-7 flex items-center justify-center rounded-md text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-all opacity-0 group-hover:opacity-100"
                                        title="Delete this analysis"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </ScrollReveal>
            </main>

            <footer className="border-t border-white/5 bg-background/40 backdrop-blur-sm mt-8">
                <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
                    <span className="text-xs text-white/25">Verivox v1.0 · AI-Powered Fact Checking</span>
                    <div className="flex items-center gap-3 text-xs text-white/25">
                        <a href="https://github.com/Aditya060806" target="_blank" rel="noopener noreferrer" className="hover:text-white/60 transition-colors">GitHub</a>
                        <span>·</span>
                        <a href="https://www.linkedin.com/in/aditya-pandey-p1002/" target="_blank" rel="noopener noreferrer" className="hover:text-white/60 transition-colors">LinkedIn</a>
                    </div>
                </div>
            </footer>

            <style dangerouslySetInnerHTML={{
                __html: `
        .glass-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        .shimmer {
          background: linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .vbg-green { background: rgba(142,207,170,0.12); color: #8ecfaa; border: 1px solid rgba(142,207,170,0.2); }
        .vbg-yellow { background: rgba(224,201,122,0.12); color: #e0c97a; border: 1px solid rgba(224,201,122,0.2); }
        .vbg-red { background: rgba(224,140,140,0.12); color: #e08c8c; border: 1px solid rgba(224,140,140,0.2); }
      `}} />
        </div>
    );
}
