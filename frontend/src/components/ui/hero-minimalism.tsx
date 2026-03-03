"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, Shield, Zap, Eye } from "lucide-react";

export default function MinimalHero() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setSize();

    type Particle = {
      x: number; y: number;
      vx: number; vy: number;
      opacity: number; maxOpacity: number;
      size: number;
      life: number; maxLife: number;
      color: string;
    };

    const colors = ["rgba(142,207,170,", "rgba(142,184,207,", "rgba(180,158,207,", "rgba(255,255,255,"];
    let particles: Particle[] = [];
    let raf = 0;

    const make = (): Particle => {
      const maxLife = Math.random() * 200 + 100;
      const color = colors[Math.floor(Math.random() * colors.length)];
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -Math.random() * 0.4 - 0.1,
        opacity: 0,
        maxOpacity: Math.random() * 0.5 + 0.15,
        size: Math.random() * 1.5 + 0.5,
        life: 0,
        maxLife,
        color,
      };
    };

    const init = () => {
      const count = Math.floor((canvas.width * canvas.height) / 9000);
      particles = Array.from({ length: count }, make);
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.life++;
        p.x += p.vx;
        p.y += p.vy;

        const halfLife = p.maxLife / 2;
        if (p.life < halfLife) {
          p.opacity = (p.life / halfLife) * p.maxOpacity;
        } else {
          p.opacity = ((p.maxLife - p.life) / halfLife) * p.maxOpacity;
        }

        if (p.life >= p.maxLife || p.y < 0) {
          particles[i] = make();
          particles[i].x = Math.random() * canvas.width;
          particles[i].y = canvas.height + 10;
          particles[i].life = 0;
          particles[i].opacity = 0;
          return;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.opacity})`;
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };

    const onResize = () => { setSize(); init(); };
    window.addEventListener("resize", onResize);
    init();
    raf = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  const scrollToAnalyzer = () => {
    document.getElementById("analyzer-section")?.scrollIntoView({ behavior: "smooth" });
  };

  const pills = [
    { icon: Shield, label: "GPT-4.1 Powered" },
    { icon: Zap, label: "Real-time Analysis" },
    { icon: Eye, label: "Deepfake Detection" },
  ];

  return (
    <>
      {/* Aurora background orbs */}
      <div className="aurora-bg" aria-hidden="true">
        <div className="aurora-orb-3" />
      </div>

      {/* Grid overlay */}
      <div className="grid-overlay" aria-hidden="true" />

      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: -1, opacity: 0.7 }}
        aria-hidden="true"
      />

      <section
        className="relative w-full min-h-screen flex flex-col items-center justify-center text-center px-4 py-20"
        aria-label="Hero section"
      >
        <div
          className="flex flex-col items-center max-w-5xl mx-auto"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.8s ease, transform 0.8s ease",
          }}
        >
          {/* Pill badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {pills.map(({ icon: Icon, label }, i) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-widest bg-white/5 border border-white/10 text-white/60 backdrop-blur-sm"
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <Icon className="h-3 w-3" />
                {label}
              </span>
            ))}
          </div>

          {/* Main heading */}
          <h1 className="relative text-[5rem] sm:text-[8rem] md:text-[10rem] lg:text-[12rem] leading-none font-black tracking-tighter select-none">
            <span className="text-gradient">VERIVOX</span>
            {/* Glow echo */}
            <span
              className="absolute inset-0 text-[5rem] sm:text-[8rem] md:text-[10rem] lg:text-[12rem] leading-none font-black tracking-tighter text-white/5 blur-2xl select-none pointer-events-none"
              aria-hidden="true"
            >
              VERIVOX
            </span>
          </h1>

          {/* Tagline */}
          <p className="mt-6 text-base sm:text-xl md:text-2xl font-semibold uppercase tracking-[0.2em] text-white/50">
            Verify Anything,{" "}
            <span className="text-gradient-accent">Instantly.</span>
          </p>

          {/* Description */}
          <p className="mt-5 max-w-2xl text-sm sm:text-base text-white/40 leading-relaxed font-light">
            An advanced AI-powered credibility engine that fact-checks claims, detects deepfake images,
            and scans full web pages for misinformation — in real-time.
          </p>

          {/* CTA buttons */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={scrollToAnalyzer}
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black text-sm font-semibold transition-all hover:bg-white/90 hover:scale-105 active:scale-95"
            >
              Try it now
              <ChevronDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
            </button>
            <a
              href="/about"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/15 text-white/70 text-sm font-medium transition-all hover:border-white/30 hover:text-white hover:bg-white/5"
            >
              Learn more
            </a>
          </div>

          {/* Decorative divider */}
          <div className="mt-16 flex flex-col items-center gap-3 text-white/25">
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
            <span className="text-[10px] uppercase tracking-[0.3em] font-semibold">Scroll to explore</span>
            <ChevronDown className="h-4 w-4 animate-bounce" />
          </div>
        </div>
      </section>

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
      `}} />
    </>
  );
}
