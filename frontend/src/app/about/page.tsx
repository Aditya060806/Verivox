"use client";

import { Shield, Brain, Eye, Globe, Zap, Lock, ChevronRight, Layers } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";
import Link from "next/link";

const techStack = [
    { category: "Frontend", color: "var(--pastel-blue)", items: ["Next.js 16", "Tailwind CSS", "Framer Motion", "Radix UI"] },
    { category: "Backend", color: "var(--pastel-green)", items: ["Express.js", "Prisma ORM", "OpenAI GPT-4.1", "Bull Queue"] },
    { category: "AI Engine", color: "var(--pastel-purple)", items: ["FastAPI", "HuggingFace", "EfficientNet-B0", "PyTorch"] },
    { category: "Database", color: "var(--pastel-yellow)", items: ["Neon PostgreSQL", "Supabase pgvector", "Redis Cache"] },
];

const features = [
    {
        icon: Brain,
        title: "LLM-Powered Fact Checking",
        desc: "GPT-4.1 extracts and verifies claims against a curated knowledge base, providing detailed explanations for every verdict.",
        color: "var(--pastel-green)",
    },
    {
        icon: Eye,
        title: "Deepfake Detection",
        desc: "A fine-tuned EfficientNet-B0 model trained on thousands of manipulated images detects AI-generated and face-swapped media.",
        color: "var(--pastel-blue)",
    },
    {
        icon: Globe,
        title: "Full Page Scanning",
        desc: "Paste any URL and Verivox scrapes and analyzes the entire article — headlines, body text, and embedded images at once.",
        color: "var(--pastel-purple)",
    },
    {
        icon: Zap,
        title: "Browser Extension",
        desc: "Verify content without leaving the page. One click in your toolbar triggers a full credibility analysis of what you're reading.",
        color: "var(--pastel-yellow)",
    },
    {
        icon: Shield,
        title: "Multi-Signal Scoring",
        desc: "Three independent signals — Fact-Check accuracy, Source Credibility, and Sentiment/Bias — combine into a transparent 0-100 Trust Score.",
        color: "var(--pastel-red)",
    },
    {
        icon: Lock,
        title: "RAG Pipeline",
        desc: "Retrieval-Augmented Generation cross-references claims against trusted fact-checking outlets (Reuters, AP, Snopes) in real-time.",
        color: "var(--pastel-blue)",
    },
];

const stats = [
    { value: "93%", label: "Accuracy Rate", sub: "on benchmark datasets" },
    { value: "3", label: "Analysis Modes", sub: "Text, Image, Full Page" },
    { value: "<3s", label: "Avg Response", sub: "for text analysis" },
    { value: "GPT-4.1", label: "AI Model", sub: "powering the engine" },
];

export default function AboutPage() {
    return (
        <div className="relative min-h-screen flex flex-col">
            {/* Aurora background */}
            <div className="aurora-bg" aria-hidden="true">
                <div className="aurora-orb-3" />
            </div>
            <div className="grid-overlay" aria-hidden="true" />

            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-white/5 bg-background/60 backdrop-blur-xl">
                <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
                    <Link href="/" className="flex items-center gap-2.5 group">
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
                        <Link href="/history" className="px-3 py-1.5 rounded-md hover:text-white hover:bg-white/5 transition-colors">History</Link>
                        <Link href="/about" className="px-3 py-1.5 rounded-md text-white bg-white/8 transition-colors">About</Link>
                    </nav>
                </div>
            </header>

            <main className="flex-1 mx-auto w-full max-w-5xl px-4 sm:px-6 py-16 space-y-24 relative z-10">

                {/* Hero text */}
                <ScrollReveal direction="up">
                    <div className="text-center space-y-5 max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-widest bg-white/5 border border-white/10 text-white/50">
                            <Shield className="h-3 w-3" />
                            About Verivox
                        </div>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter leading-none text-gradient">
                            Fighting Misinformation<br />with AI.
                        </h1>
                        <p className="text-base text-white/45 leading-relaxed max-w-2xl mx-auto">
                            Verivox (Verified Voice — Veracity Optimized eXtended) is an end-to-end misinformation detection platform
                            that combines cutting-edge language models, computer vision, and retrieval systems to give you a clear,
                            honest truth score for any content.
                        </p>
                    </div>
                </ScrollReveal>

                {/* Stats row */}
                <ScrollReveal direction="up" delay={0.1}>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {stats.map((s) => (
                            <div key={s.value} className="glass-card rounded-xl p-5 text-center space-y-1">
                                <p className="text-3xl font-black text-gradient-accent">{s.value}</p>
                                <p className="text-sm font-semibold text-white/80">{s.label}</p>
                                <p className="text-[11px] text-white/35">{s.sub}</p>
                            </div>
                        ))}
                    </div>
                </ScrollReveal>

                {/* Features grid */}
                <div className="space-y-8">
                    <ScrollReveal direction="up">
                        <h2 className="text-2xl font-bold tracking-tight text-white/90 text-center">Core Capabilities</h2>
                    </ScrollReveal>
                    <StaggerContainer className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {features.map(({ icon: Icon, title, desc, color }) => (
                            <StaggerItem key={title}>
                                <div className="glass-card rounded-xl p-5 h-full space-y-3 group hover:border-white/15 transition-colors">
                                    <div
                                        className="inline-flex h-10 w-10 items-center justify-center rounded-lg"
                                        style={{ background: `${color}15`, border: `1px solid ${color}30` }}
                                    >
                                        <Icon className="h-5 w-5" style={{ color }} />
                                    </div>
                                    <h3 className="text-sm font-semibold text-white/90">{title}</h3>
                                    <p className="text-[13px] text-white/45 leading-relaxed">{desc}</p>
                                </div>
                            </StaggerItem>
                        ))}
                    </StaggerContainer>
                </div>

                {/* Architecture section */}
                <ScrollReveal direction="up">
                    <div className="glass-card rounded-2xl p-8 space-y-6">
                        <h2 className="text-xl font-bold text-white/90">How the Pipeline Works</h2>
                        <div className="flex flex-col gap-0">
                            {[
                                { step: "01", title: "Content Ingestion", desc: "Text, image URL, or uploaded file is received and validated. URLs are scraped with Cheerio." },
                                { step: "02", title: "Claim Extraction", desc: "GPT-4.1 extracts verifiable claims from the input, separating facts from opinions." },
                                { step: "03", title: "Multi-Signal Analysis", desc: "Simultaneously: ML fake news classifier, RAG fact-check retrieval, and bias/sentiment analysis run in parallel." },
                                { step: "04", title: "Credibility Scoring", desc: "Three signals are weighted and combined into a 0–100 Trust Score with a clear verdict." },
                                { step: "05", title: "Result Delivery", desc: "Full explanation with cited sources returned in < 3 seconds via the REST API." },
                            ].map(({ step, title, desc }, i, arr) => (
                                <div key={step} className="flex gap-5">
                                    <div className="flex flex-col items-center">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/6 border border-white/10 text-xs font-bold text-white/60">
                                            {step}
                                        </div>
                                        {i < arr.length - 1 && <div className="w-px flex-1 bg-white/8 my-1" />}
                                    </div>
                                    <div className="pb-6">
                                        <p className="text-sm font-semibold text-white/85 mb-1">{title}</p>
                                        <p className="text-[13px] text-white/40 leading-relaxed">{desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </ScrollReveal>

                {/* Tech stack */}
                <div className="space-y-8">
                    <ScrollReveal direction="up">
                        <h2 className="text-2xl font-bold tracking-tight text-white/90 text-center">Tech Stack</h2>
                    </ScrollReveal>
                    <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {techStack.map(({ category, color, items }) => (
                            <StaggerItem key={category}>
                                <div className="glass-card rounded-xl p-5 space-y-3">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full" style={{ background: color }} />
                                        <span className="text-xs font-semibold uppercase tracking-widest text-white/50">{category}</span>
                                    </div>
                                    <ul className="space-y-1.5">
                                        {items.map((item) => (
                                            <li key={item} className="text-sm text-white/75 flex items-center gap-2">
                                                <ChevronRight className="h-3 w-3 text-white/25 shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </StaggerItem>
                        ))}
                    </StaggerContainer>
                </div>

                {/* Author / CTA */}
                <ScrollReveal direction="up">
                    <div className="glass-card rounded-2xl p-8 text-center space-y-5">
                        <h2 className="text-xl font-bold text-white/90">Built by</h2>
                        <div className="inline-flex flex-col items-center gap-2">
                            <div className="h-14 w-14 rounded-full bg-gradient-to-br from-pastel-green/30 to-pastel-blue/30 border border-white/10 flex items-center justify-center text-xl font-black text-white/70">
                                AP
                            </div>
                            <p className="text-base font-semibold text-white/80">Aditya Pandey</p>
                            <div className="flex items-center gap-3 text-xs">
                                <a
                                    href="https://github.com/Aditya060806"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 text-white/45 hover:text-white/80 transition-colors"
                                >
                                    GitHub
                                </a>
                                <span className="text-white/20">·</span>
                                <a
                                    href="https://www.linkedin.com/in/aditya-pandey-p1002/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 text-white/45 hover:text-white/80 transition-colors"
                                >
                                    LinkedIn
                                </a>
                            </div>
                        </div>
                        <div className="pt-2">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black text-sm font-semibold hover:bg-white/90 transition-all hover:scale-105"
                            >
                                Try Verivox Now
                                <ChevronRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </ScrollReveal>
            </main>

            {/* Footer */}
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
        .text-gradient {
          background: linear-gradient(160deg, #ffffff 0%, rgba(255,255,255,0.55) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .text-gradient-accent {
          background: linear-gradient(135deg, #8ecfaa 0%, #8eb8cf 50%, #b49ecf 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .from-pastel-green\\/30 { --tw-gradient-from: rgba(142,207,170,0.3); }
        .to-pastel-blue\\/30 { --tw-gradient-to: rgba(142,184,207,0.3); }
      `}} />
        </div>
    );
}
