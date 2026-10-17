import { createFileRoute } from "@tanstack/react-router";
import type { CSSProperties } from "react";
import hero from "@/assets/hero-hotel.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Uma nova forma de se hospedar — Hotéis e apartamentos" },
      { name: "description", content: "Encontre lugares extraordinários para viver sua próxima experiência." },
      { property: "og:title", content: "Seu próximo destino começa aqui." },
      { property: "og:description", content: "Encontre lugares extraordinários para viver sua próxima experiência." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const d = (ms: number): CSSProperties => ({ animationDelay: `${ms}ms` });

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 transition-transform duration-500 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}

function Index() {
  return (
    <main className="relative h-svh min-h-[640px] w-full overflow-hidden bg-ink text-ivory">
      <img
        src={hero}
        alt="Hotel sobre penhasco com piscina de borda infinita ao pôr do sol"
        width={1920}
        height={1088}
        className="animate-hero-zoom absolute inset-0 h-full w-full object-cover object-[72%_center] md:object-[60%_center] lg:object-center"
      />
      <div className="hero-veil absolute inset-0" />

      <header className="animate-fade-up relative z-10 flex items-center justify-between px-6 py-6 md:px-12 md:py-8" style={d(300)}>
        <span className="text-[11px] font-medium uppercase tracking-[0.4em] text-ivory/90">Coleção · Hospedagens</span>
        <nav className="flex items-center gap-8 text-sm">
          {["Explorar", "Destinos", "Entrar"].map((l) => (
            <a key={l} href="#" className="hidden text-ivory/80 transition-colors hover:text-ivory md:inline">{l}</a>
          ))}
          <a href="#" className="rounded-full border border-ivory/30 px-5 py-2.5 text-xs tracking-wide backdrop-blur-sm transition-all duration-500 hover:border-ivory/70 hover:bg-ivory/10">
            Começar uma reserva
          </a>
        </nav>
      </header>

      <section className="absolute inset-x-0 bottom-0 z-10 px-6 pb-14 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:px-12 md:pb-0 lg:px-20">
        <p className="animate-fade-up mb-6 flex items-center gap-4 text-[11px] font-medium uppercase tracking-[0.42em] text-gold" style={d(700)}>
          <span className="h-px w-10 bg-gold/70" />
          Uma nova forma de se hospedar
        </p>
        <h1 className="text-soft-shadow font-display text-[3.25rem] font-light leading-[0.95] tracking-[-0.02em] sm:text-7xl lg:text-[7.5rem]">
          <span className="block overflow-hidden pb-2"><span className="animate-rise block" style={d(900)}>Seu próximo destino</span></span>
          <span className="block overflow-hidden pb-2"><span className="animate-rise block italic text-ivory/95" style={d(1050)}>começa aqui.</span></span>
        </h1>
        <p className="animate-fade-up mt-8 max-w-sm text-base leading-relaxed text-ivory/75 md:text-lg" style={d(1400)}>
          Encontre lugares extraordinários para viver sua próxima experiência.
        </p>
        <div className="animate-fade-up mt-10" style={d(1600)}>
          <a href="#" className="group inline-flex items-center gap-4 rounded-full bg-ivory py-4 pl-8 pr-6 text-sm font-medium text-ink transition-all duration-500 hover:bg-gold hover:shadow-[0_20px_50px_-20px_var(--gold)]">
            Explorar hospedagens <Arrow />
          </a>
        </div>
      </section>

      <div className="animate-fade-up absolute bottom-8 right-12 z-10 hidden text-[11px] uppercase tracking-[0.35em] text-ivory/60 md:block" style={d(1900)}>
        Costa Mediterrânea — 19:42
      </div>
    </main>
  );
}
