import { createFileRoute } from "@tanstack/react-router";
import { useLayoutEffect, useRef, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import hero from "@/assets/hero-hotel.jpg";
import heroFg from "@/assets/hero-foreground.png";
import apartment from "@/assets/scene-apartment.jpg";

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
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Desktop / tablet: pinned cinematic camera move
      mm.add(
        {
          desktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
          tablet: "(min-width: 768px) and (max-width: 1023px) and (prefers-reduced-motion: no-preference)",
        },
        (c) => {
          const k = c.conditions?.["desktop"] ? 1 : 0.6;
          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: "[data-stage]",
              start: "top top",
              end: `+=${c.conditions?.["desktop"] ? 220 : 160}%`,
              pin: true,
              scrub: 0.8,
              anticipatePin: 1,
            },
          });
          // Hold, then the camera pushes in
          tl.to("[data-bg]", { scale: 1 + 0.18 * k, duration: 0.6 }, 0.08)
            .to("[data-fg]", { scale: 1 + 0.32 * k, xPercent: -4 * k, duration: 0.6 }, 0.08)
            .to("[data-title]", { xPercent: 38 * k, yPercent: -18 * k, scale: 0.92, duration: 0.5 }, 0.1)
            .to("[data-title]", { opacity: 0, duration: 0.15 }, 0.45)
            .to("[data-near]", { y: -160 * k, opacity: 0, duration: 0.3, stagger: 0.03 }, 0.06)
            .to("[data-meta]", { opacity: 0, duration: 0.15 }, 0.05)
            // Scene 1 recedes, scene 2 opens
            .to("[data-hero]", { opacity: 0.25, duration: 0.35 }, 0.55)
            .fromTo("[data-scene2]", { clipPath: "inset(42% 34% 42% 34%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.4, ease: "power2.inOut" }, 0.6)
            .fromTo("[data-scene2-img]", { scale: 1.35 }, { scale: 1, duration: 0.4, ease: "power2.out" }, 0.6)
            .fromTo("[data-scene2-text] > *", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.15, stagger: 0.04 }, 0.82);
        },
      );

      // Mobile: natural scroll, light parallax only
      mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
        const st = { trigger: "[data-hero]", start: "top top", end: "bottom top", scrub: true };
        gsap.to("[data-bg]", { scale: 1.1, yPercent: 8, ease: "none", scrollTrigger: st });
        gsap.to("[data-near]", { y: -60, opacity: 0, ease: "none", stagger: 0.05, scrollTrigger: st });
        gsap.fromTo("[data-scene2-img]", { scale: 1.2 }, {
          scale: 1, ease: "none",
          scrollTrigger: { trigger: "[data-scene2]", start: "top bottom", end: "top top", scrub: true },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <main ref={root} className="bg-ink text-ivory">
      <div data-stage className="relative w-full md:h-svh md:min-h-[640px] md:overflow-hidden">
        {/* Header stays above every layer */}
        <header className="animate-fade-up absolute inset-x-0 top-0 z-30 flex items-center justify-between px-6 py-6 md:px-12 md:py-8" style={d(300)}>
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

        {/* Scene 1 — hero */}
        <section data-hero className="relative h-svh min-h-[640px] w-full overflow-hidden will-change-[opacity]">
          <div data-bg className="absolute inset-0 will-change-transform">
            <img src={hero} alt="Hotel sobre penhasco com piscina de borda infinita ao pôr do sol" width={1920} height={1088}
              className="animate-hero-zoom absolute inset-0 h-full w-full object-cover object-[72%_center] md:object-[60%_center] lg:object-center" />
          </div>
          <div className="hero-veil absolute inset-0" />

          <div className="absolute inset-x-0 bottom-0 z-10 px-6 pb-14 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:px-12 md:pb-0 lg:px-20">
            <div data-near>
              <p className="animate-fade-up mb-6 flex items-center gap-4 text-[11px] font-medium uppercase tracking-[0.42em] text-gold" style={d(700)}>
                <span className="h-px w-10 bg-gold/70" />
                Uma nova forma de se hospedar
              </p>
            </div>
            <div data-title className="origin-left will-change-transform">
              <h1 className="text-soft-shadow font-display text-[3.25rem] font-light leading-[0.95] tracking-[-0.02em] sm:text-7xl lg:text-[7.5rem]">
                <span className="block overflow-hidden pb-2"><span className="animate-rise block" style={d(900)}>Seu próximo destino</span></span>
                <span className="block overflow-hidden pb-2"><span className="animate-rise block italic text-ivory/95" style={d(1050)}>começa aqui.</span></span>
              </h1>
            </div>
            <div data-near>
              <p className="animate-fade-up mt-8 max-w-sm text-base leading-relaxed text-ivory/75 md:text-lg" style={d(1400)}>
                Encontre lugares extraordinários para viver sua próxima experiência.
              </p>
            </div>
            <div data-near className="relative z-30">
              <div className="animate-fade-up mt-10" style={d(1600)}>
                <a href="#" className="group inline-flex items-center gap-4 rounded-full bg-ivory py-4 pl-8 pr-6 text-sm font-medium text-ink transition-all duration-500 hover:bg-gold hover:shadow-[0_20px_50px_-20px_var(--gold)]">
                  Explorar hospedagens <Arrow />
                </a>
              </div>
            </div>
          </div>

          {/* Architecture cut-out: the title slides behind it */}
          <div data-fg aria-hidden className="pointer-events-none absolute inset-0 z-20 hidden origin-[75%_60%] will-change-transform md:block">
            <img src={heroFg} alt="" width={1920} height={1088}
              className="animate-hero-zoom absolute inset-0 h-full w-full object-cover md:object-[60%_center] lg:object-center" />
          </div>

          <div data-meta className="animate-fade-up absolute bottom-8 right-12 z-20 hidden text-[11px] uppercase tracking-[0.35em] text-ivory/60 md:block" style={d(1900)}>
            Costa Mediterrânea — 19:42
          </div>
        </section>

        {/* Scene 2 — introduction to exploring stays */}
        <section data-scene2 className="relative z-25 h-svh min-h-[640px] w-full overflow-hidden md:motion-safe:absolute md:motion-safe:inset-0">
          <div data-scene2-img className="absolute inset-0 will-change-transform">
            <img src={apartment} alt="Apartamento de arquitetura marcante com vista para a cidade e o mar ao entardecer" width={1920} height={1088} loading="lazy"
              className="h-full w-full object-cover object-[65%_center] md:object-center" />
          </div>
          <div className="hero-veil absolute inset-0" />
          <div data-scene2-text className="absolute inset-x-0 bottom-0 px-6 pb-16 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:px-12 md:pb-0 lg:px-20">
            <p className="mb-6 flex items-center gap-4 text-[11px] font-medium uppercase tracking-[0.42em] text-gold">
              <span className="h-px w-10 bg-gold/70" />
              Capítulo I — Explorar
            </p>
            <h2 className="text-soft-shadow font-display text-5xl font-light leading-[0.95] tracking-[-0.02em] sm:text-6xl lg:text-8xl">
              Espaços que
              <br />
              <span className="italic">contam histórias.</span>
            </h2>
            <p className="mt-8 max-w-sm text-base leading-relaxed text-ivory/75 md:text-lg">
              Apartamentos e hotéis escolhidos pela arquitetura, pela luz e pela forma de receber.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
