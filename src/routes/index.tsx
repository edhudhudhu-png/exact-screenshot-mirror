import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useHotelSequence } from "@/hooks/use-hotel-sequence";
import { HOTEL_FRAMES } from "@/lib/hotel-sequence";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Coleção — Hospedagens com história" },
      { name: "description", content: "Lugares extraordinários, escolhidos para transformar a forma de viajar." },
      { property: "og:title", content: "Coleção — Hospedagens com história" },
      { property: "og:description", content: "Arquitetura, calma e lugares que ficam na memória." },
      { property: "og:type", content: "website" },
      { name: "theme-color", content: "#171916" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Arrow({ light = false }: { light?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={`h-4 w-4 transition-transform duration-500 group-hover:translate-x-1 ${light ? "text-collection-dark" : "text-collection-gold"}`} fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}

function Index() {
  const root = useRef<HTMLElement>(null);
  const frameCanvas = useRef<HTMLCanvasElement>(null);
  const frameSection = useRef<HTMLElement>(null);
  const frameScene = useRef<HTMLDivElement>(null);
  useHotelSequence(frameSection, frameScene, frameCanvas);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      intro.fromTo(".topbar", { y: -22, opacity: 0 }, { y: 0, opacity: 1, duration: .9 })
        .fromTo(".story-kicker", { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: .7 }, "-=.4")
        .fromTo(".story-word", { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1, stagger: .12, ease: "power4.out" }, "-=.35")
        .fromTo(".story-subtitle", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: .8 }, "-=.45");

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        gsap.fromTo(element, { y: 28, autoAlpha: 0 }, {
          y: 0,
          autoAlpha: 1,
          duration: .9,
          ease: "power2.out",
          scrollTrigger: { trigger: element, start: "top 88%", once: true },
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return () => {
      disposed = true;
      window.removeEventListener("resize", onResize);
      animation.scrollTrigger?.kill();
      animation.kill();
      frames.forEach((image) => { image.onload = null; });
    };
  }, []);
  return (
    <main ref={root} className="collection-page bg-collection-bg text-collection-text selection:bg-collection-selection selection:text-collection-bg">
      <header className="topbar absolute left-0 right-0 top-0 z-30 flex items-center justify-between px-5 py-5 sm:px-8 md:px-12 md:py-7">
        <a href="#" aria-label="Coleção — início" className="group flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full border border-collection-bright/35 text-[10px] tracking-widest transition-colors group-hover:bg-collection-gold group-hover:text-collection-bg">C.</span>
          <span className="text-[10px] uppercase tracking-[.3em] sm:text-[11px]">Coleção <span className="text-collection-bright/45">/ hospedagens</span></span>
        </a>
        <nav className="flex items-center gap-5 sm:gap-8">
          <a href="#filosofia" className="hidden text-[10px] uppercase tracking-[.2em] text-collection-bright/75 transition-colors hover:text-collection-bright sm:block">Filosofia</a>
          <a href="#lugares" className="hidden text-[10px] uppercase tracking-[.2em] text-collection-bright/75 transition-colors hover:text-collection-bright sm:block">Lugares</a>
          <a href="#contato" className="group inline-flex items-center gap-3 rounded-full border border-collection-bright/35 px-4 py-2.5 text-[10px] uppercase tracking-[.16em] transition-all duration-500 hover:border-collection-gold hover:bg-collection-gold hover:text-collection-bg sm:px-5">
            Planejar viagem <Arrow />
          </a>
        </nav>
      </header>

      <section ref={frameSection} className="story-frame-section relative w-full bg-collection-bg">
        <div ref={frameScene} className="story-scene relative w-full overflow-hidden bg-collection-bg">
          <img src={HOTEL_FRAMES[0]} alt="Hotel contemporâneo à beira de uma piscina ao pôr do sol" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover" />
          <canvas ref={frameCanvas} className="absolute inset-0 h-full w-full" aria-hidden="true" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-collection-bg/55 via-collection-bg/20 to-transparent" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-collection-bg/45 via-transparent to-collection-bg/15" />
          <div className="story-hero-copy relative z-10 flex h-full flex-col justify-center px-6 pb-10 pt-24 sm:px-10 md:px-16 lg:px-[10vw]">
            <p className="story-kicker mb-7 flex items-center gap-4 text-[9px] uppercase tracking-[.36em] text-collection-gold sm:text-[10px]"><span className="h-px w-9 bg-collection-gold" /> Uma curadoria de lugares singulares</p>
            <h1 className="max-w-5xl font-display story-title font-light leading-[.88]">
              <span className="block overflow-hidden pb-2"><span className="story-word block">O luxo de</span></span>
              <span className="block overflow-hidden pb-3"><span className="story-word block font-normal italic text-collection-gold">desacelerar.</span></span>
            </h1>
            <p className="story-subtitle mt-8 max-w-sm text-sm font-light leading-7 text-collection-bright sm:text-base">Hospedagens onde a arquitetura encontra a natureza — e cada detalhe convida você a ficar mais um pouco.</p>
            <a href="#lugares" className="group mt-9 inline-flex w-fit items-center gap-4 border-b border-collection-gold/60 pb-3 text-[10px] uppercase tracking-[.2em] text-collection-bright transition-colors hover:text-collection-gold">Descobrir a curadoria <Arrow /></a>
          </div>
          <div className="absolute bottom-7 left-6 right-6 z-20 flex items-center justify-between border-t border-collection-bright/40 pt-4 text-[9px] font-semibold uppercase tracking-[.2em] text-collection-bright sm:left-10 sm:right-10 md:left-16 md:right-16 lg:left-[10vw] lg:right-[10vw]"><span>Uma viagem para sentir</span><span>Hospedagens com história</span></div>
        </div>
      </section>
      <section className="marquee overflow-hidden border-y border-collection-bright/10 py-6 sm:py-8" aria-label="Nossa curadoria">
        <div className="marquee-track flex w-max items-center gap-7 whitespace-nowrap text-xl sm:text-3xl lg:text-4xl font-light uppercase tracking-[.14em] text-collection-gold/90">
          {Array.from({ length: 4 }, (_, i) => <span key={i} className="flex items-center gap-7">Lugares com alma <span className="text-xs">✳</span> Tempo para sentir <span className="text-xs">✳</span> Memórias para levar <span className="text-xs">✳</span></span>)}
        </div>
      </section>

      <section id="filosofia" className="grid gap-12 px-6 py-24 sm:px-10 sm:py-32 md:grid-cols-[.8fr_1.2fr] md:gap-20 md:px-16 lg:px-[10vw]">
        <div data-reveal>
          <p className="mb-6 flex items-center gap-3 text-[10px] uppercase tracking-[.3em] text-collection-accent"><span className="h-px w-7 bg-collection-accent" /> Nossa filosofia</p>
          <p className="font-display text-4xl font-light leading-[1.08] tracking-[-.04em] sm:text-5xl lg:text-6xl">Não é só onde você fica. <span className="italic text-collection-accent">É como você se sente.</span></p>
        </div>
        <div data-reveal className="flex flex-col justify-end md:pl-[12%]">
          <p className="max-w-lg text-base font-light leading-8 text-collection-bright/65 sm:text-lg sm:leading-9">Selecionamos espaços com identidade, calma e personalidade. Da primeira luz da manhã ao silêncio do fim do dia, cada lugar é um convite para viver a viagem de um jeito mais presente.</p>
          <a href="#lugares" className="group mt-8 inline-flex w-fit items-center gap-4 border-b border-collection-accent/60 pb-3 text-[10px] uppercase tracking-[.2em] text-collection-gold">Conheça a curadoria <Arrow /></a>
        </div>
      </section>

      <section id="lugares" className="px-6 pb-24 sm:px-10 sm:pb-32 md:px-16 lg:px-[10vw]">
        <div data-reveal className="mb-10 flex flex-col justify-between gap-5 sm:mb-14 sm:flex-row sm:items-end">
          <div>
            <p className="mb-4 text-[10px] uppercase tracking-[.3em] text-collection-accent">Uma seleção cuidadosa</p>
            <h2 className="font-display text-4xl font-light tracking-[-.045em] sm:text-6xl">Fique onde a vida acontece.</h2>
          </div>
          <p className="max-w-xs text-sm font-light leading-6 text-collection-bright/55">Arquitetura marcante. Materiais naturais. A sensação de estar exatamente onde deveria.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-[1.15fr_.85fr] md:gap-7">
          <article data-reveal className="group relative min-h-[430px] overflow-hidden bg-collection-photo sm:min-h-[590px]">
            <img src="/hero-suite.svg" alt="Sala de estar com luz dourada, texturas naturais e arquitetura contemporânea" className="gallery-image absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
            <div className="absolute inset-0 bg-gradient-to-t from-collection-shade/90 via-transparent to-collection-shade/10" />
            <div className="absolute left-6 top-6 flex items-center gap-3 text-[9px] uppercase tracking-[.25em] text-collection-bright/80 sm:left-8 sm:top-8"><span className="h-px w-6 bg-collection-gold" /> 01 / Refúgios</div>
            <div className="absolute bottom-7 left-6 right-6 flex items-end justify-between gap-4 sm:bottom-9 sm:left-8 sm:right-8">
              <div><p className="mb-2 text-[10px] uppercase tracking-[.22em] text-collection-gold">Calma, em cada detalhe</p><h3 className="font-display text-3xl font-light sm:text-4xl">O tempo é seu.</h3></div>
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-collection-bright/50 transition-all duration-500 group-hover:border-collection-gold group-hover:bg-collection-gold"><Arrow /></span>
            </div>
          </article>
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-1 md:gap-7">
            <article data-reveal className="group relative min-h-[270px] overflow-hidden border border-collection-bright/10 bg-collection-panel p-7 sm:min-h-[285px] sm:p-9">
              <span className="text-[9px] uppercase tracking-[.25em] text-collection-accent">02 / Experiências</span>
              <div className="absolute -right-8 -top-10 h-56 w-56 rounded-full border border-collection-accent/20 transition-transform duration-1000 group-hover:scale-125"><div className="absolute inset-7 rounded-full border border-collection-accent/20"><div className="absolute inset-7 rounded-full border border-collection-accent/20" /></div></div>
              <div className="relative mt-16 max-w-xs"><h3 className="font-display text-3xl font-light sm:text-4xl">Menos pressa. Mais presença.</h3><p className="mt-4 text-sm leading-6 text-collection-bright/55">Espaços que fazem o simples parecer extraordinário.</p></div>
            </article>
            <article data-reveal className="relative flex min-h-[230px] flex-col justify-between overflow-hidden bg-collection-paper p-7 text-collection-paper-ink sm:min-h-[270px] sm:p-9">
              <p className="text-[9px] uppercase tracking-[.25em]">03 / A sua próxima história</p>
              <div><p className="font-display text-3xl font-light leading-tight sm:text-4xl">O lugar certo muda tudo.</p><a href="#contato" className="group mt-6 inline-flex items-center gap-4 border-b border-collection-paper-ink/35 pb-2 text-[10px] uppercase tracking-[.2em]">Comece por aqui <Arrow light /></a></div>
            </article>
          </div>
        </div>
      </section>

      <section id="contato" className="relative overflow-hidden border-t border-collection-bright/10 px-6 py-24 text-center sm:px-10 sm:py-36">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-collection-accent/10 sm:h-[680px] sm:w-[680px]"><div className="absolute inset-10 rounded-full border border-collection-accent/10 sm:inset-16" /></div>
        <div data-reveal className="relative">
          <p className="mb-6 text-[10px] uppercase tracking-[.32em] text-collection-accent">Sua próxima viagem começa aqui</p>
          <h2 className="mx-auto max-w-4xl font-display text-5xl font-light leading-[.98] tracking-[-.05em] sm:text-7xl lg:text-8xl">Vá além do <span className="italic text-collection-gold">destino.</span></h2>
          <p className="mx-auto mt-7 max-w-md text-sm font-light leading-7 text-collection-bright/60 sm:text-base">Descubra hospedagens que transformam alguns dias fora em lembranças que ficam.</p>
          <a href="#lugares" className="group mx-auto mt-9 inline-flex items-center gap-5 rounded-full border border-collection-gold/60 px-7 py-4 text-[10px] uppercase tracking-[.18em] transition-all duration-500 hover:bg-collection-gold hover:text-collection-bg">Explorar hospedagens <Arrow /></a>
        </div>
      </section>

      <footer className="flex flex-col gap-4 border-t border-collection-bright/10 px-6 py-7 text-[9px] uppercase tracking-[.2em] text-collection-bright/45 sm:flex-row sm:items-center sm:justify-between sm:px-10 md:px-16 lg:px-[10vw]">
        <span>© 2026 Coleção — Hospedagens com história</span>
        <span>Feito para viajar com intenção.</span>
        <a href="#" className="transition-colors hover:text-collection-bright">Voltar ao início ↑</a>
      </footer>
    </main>
  );
}
