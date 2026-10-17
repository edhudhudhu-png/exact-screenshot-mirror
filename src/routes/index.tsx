import { createFileRoute } from "@tanstack/react-router";
import { useLayoutEffect, useRef, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CinematicFrames } from "@/components/CinematicFrames";
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
  const drawFrames = useRef<((progress: number) => void) | null>(null);

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
          // Scrub the actual frame sequence with scroll, then reveal chapter one.
          tl.to({ progress: 0 }, {
            progress: 1,
            duration: 0.72,
            onUpdate() {
              drawFrames.current?.(this.targets()[0].progress);
            },
          }, 0)
            .fromTo("[data-scene2]", { clipPath: "inset(42% 34% 42% 34%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.28, ease: "power2.inOut" }, 0.72)
            .fromTo("[data-scene2-img]", { scale: 1.25 }, { scale: 1, duration: 0.28, ease: "power2.out" }, 0.72)
            .fromTo("[data-scene2-text] > *", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.15, stagger: 0.04 }, 0.88);
        },
      );

      // Mobile: natural scroll, light parallax only
      mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
        const st = { trigger: "[data-hero]", start: "top top", end: "bottom top", scrub: true };
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

        {/* Scene 1 — scroll-controlled frame animation */}
        <section data-hero className="relative h-svh min-h-[640px] w-full overflow-hidden">
          <CinematicFrames progressRef={drawFrames} />
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
