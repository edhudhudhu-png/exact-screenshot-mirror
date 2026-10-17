import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Coleção — Hospedagens com história" },
      { name: "description", content: "Lugares extraordinários, escolhidos para transformar a forma de viajar." },
      { property: "og:title", content: "Coleção — Hospedagens com história" },
      { property: "og:description", content: "Arquitetura, calma e lugares que ficam na memória." },
      { property: "og:type", content: "website" },
      { name: "theme-color", content: "#171916" },
    ],
  }),
  component: Index,
});

function Arrow({ light = false }: { light?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={`h-4 w-4 transition-transform duration-500 group-hover:translate-x-1 ${light ? "text-[#292b25]" : "text-[#e4d3b2]"}`} fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}

function Index() {
  const root = useRef<HTMLElement>(null);
  const frameCanvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = frameCanvas.current;
    if (!canvas) return;
    const context = canvas.getContext("2d", { alpha: false });
    if (!context) return;

    // Sequência real de frames presente em /public (os números 063, 066 e 067 não existem).
    const frameNumbers = Array.from({ length: 48 }, (_, i) => i + 15).concat([64, 65, 68]);
    const frames = frameNumbers.map((number) => {
      const image = new Image();
      image.src = `/frame_${String(number).padStart(3, "0")}.jpg`;
      return image;
    });
    let currentFrame = 0;
    let disposed = false;

    const drawFrame = (index: number) => {
      if (disposed || !canvas || !context) return;
      const image = frames[Math.max(0, Math.min(frames.length - 1, Math.round(index)))];
      if (!image?.complete || !image.naturalWidth) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;
      const pixelWidth = Math.round(width * dpr);
      const pixelHeight = Math.round(height * dpr);
      if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
        canvas.width = pixelWidth;
        canvas.height = pixelHeight;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
      }
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.fillStyle = "#111410";
      context.fillRect(0, 0, width, height);
      const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
      const drawWidth = image.naturalWidth * scale;
      const drawHeight = image.naturalHeight * scale;
      context.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
    };

    frames.forEach((image, index) => {
      image.onload = () => { if (index === currentFrame || index === 0) drawFrame(currentFrame); };
    });
    const resize = () => drawFrame(currentFrame);
    window.addEventListener("resize", resize);
    if (frames[0].complete) drawFrame(0);

    const ctx = gsap.context(() => {
      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      intro.fromTo(".topbar", { y: -22, opacity: 0 }, { y: 0, opacity: 1, duration: .9 })
        .fromTo(".story-kicker", { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: .7 }, "-=.4")
        .fromTo(".story-word", { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1, stagger: .12, ease: "power4.out" }, "-=.35")
        .fromTo(".story-subtitle", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: .8 }, "-=.45");

      const sequence = gsap.timeline({
        scrollTrigger: {
          trigger: ".story-scroll",
          start: "top top",
          end: "bottom bottom",
          scrub: 0.7,
          pin: ".story-stage",
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
      const playhead = { frame: 0 };
      sequence.to(playhead, {
        frame: frames.length - 1,
        duration: 6,
        ease: "none",
        onUpdate: () => {
          currentFrame = playhead.frame;
          drawFrame(currentFrame);
        },
      }, 0);
      sequence.to(".story-hero-copy", { autoAlpha: 0, y: -36, duration: .35, ease: "none" }, .38);
      sequence.to(".story-overlay", { opacity: .2, duration: .3, ease: "none" }, 0.8);
      sequence.fromTo(".scroll-copy-1", { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .55, ease: "power2.out" }, .65)
        .to(".scroll-copy-1", { y: -35, autoAlpha: 0, duration: .45, ease: "power2.in" }, 1.65)
        .fromTo(".scroll-copy-2", { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .55, ease: "power2.out" }, 1.8)
        .to(".scroll-copy-2", { y: -35, autoAlpha: 0, duration: .45, ease: "power2.in" }, 2.8)
        .fromTo(".scroll-copy-3", { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .55, ease: "power2.out" }, 3)
        .to(".scroll-copy-3", { y: -35, autoAlpha: 0, duration: .45, ease: "power2.in" }, 4)
        .fromTo(".scroll-copy-4", { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .55, ease: "power2.out" }, 4.2)
        .to(".scroll-copy-4", { y: -20, autoAlpha: 0, duration: .4, ease: "power2.in" }, 5.7);
    }, root);

    return () => {
      disposed = true;
      window.removeEventListener("resize", resize);
      ctx.revert();
    };
  }, []);

  return (
    <main ref={root} className="overflow-hidden bg-[#171916] text-[#f1eee6] selection:bg-[#d9c39c] selection:text-[#171916]">
      <header className="topbar absolute left-0 right-0 top-0 z-30 flex items-center justify-between px-5 py-5 sm:px-8 md:px-12 md:py-7">
        <a href="#" aria-label="Coleção — início" className="group flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full border border-white/35 text-[10px] tracking-widest transition-colors group-hover:bg-[#e4d3b2] group-hover:text-[#171916]">C.</span>
          <span className="text-[10px] uppercase tracking-[.3em] sm:text-[11px]">Coleção <span className="text-white/45">/ hospedagens</span></span>
        </a>
        <nav className="flex items-center gap-5 sm:gap-8">
          <a href="#filosofia" className="hidden text-[10px] uppercase tracking-[.2em] text-white/75 transition-colors hover:text-white sm:block">Filosofia</a>
          <a href="#lugares" className="hidden text-[10px] uppercase tracking-[.2em] text-white/75 transition-colors hover:text-white sm:block">Lugares</a>
          <a href="#contato" className="group inline-flex items-center gap-3 rounded-full border border-white/35 px-4 py-2.5 text-[10px] uppercase tracking-[.16em] transition-all duration-500 hover:border-[#e4d3b2] hover:bg-[#e4d3b2] hover:text-[#171916] sm:px-5">
            Planejar viagem <Arrow />
          </a>
        </nav>
      </header>

      <section className="story-scroll relative h-[520vh] bg-[#111410]">
        <div className="story-stage relative h-[100svh] min-h-[620px] w-full overflow-hidden">
          <canvas ref={frameCanvas} className="absolute inset-0 h-full w-full" aria-label="Animação cinematográfica de hospedagem controlada pela rolagem" />
          <div className="story-overlay pointer-events-none absolute inset-0 bg-gradient-to-r from-[#10130f]/75 via-[#10130f]/20 to-transparent" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#111410]/75 via-transparent to-[#111410]/30" />

          <div className="story-hero-copy absolute inset-0 z-10 flex flex-col justify-center px-6 pb-10 pt-24 sm:px-10 md:px-16 lg:px-[10vw]">
            <p className="story-kicker mb-7 flex items-center gap-4 text-[9px] uppercase tracking-[.36em] text-[#e4d3b2] sm:text-[10px]">
              <span className="h-px w-9 bg-[#e4d3b2]" /> Uma curadoria de lugares singulares
            </p>
            <h1 className="max-w-5xl font-display text-[clamp(3.5rem,9.3vw,9rem)] font-light leading-[.88] tracking-[-.065em]">
              <span className="block overflow-hidden pb-2"><span className="story-word block">O luxo de</span></span>
              <span className="block overflow-hidden pb-3"><span className="story-word block font-normal italic text-[#e4d3b2]">desacelerar.</span></span>
            </h1>
            <p className="story-subtitle mt-8 max-w-sm text-sm font-light leading-7 text-white/80 sm:text-base">
              Hospedagens onde a arquitetura encontra a natureza — e cada detalhe convida você a ficar mais um pouco.
            </p>
          </div>

          <div className="absolute inset-0 z-10 flex items-center justify-center px-6 text-center sm:px-12">
            <div className="scroll-copy-1 max-w-4xl opacity-0">
              <p className="mb-5 text-[10px] uppercase tracking-[.35em] text-[#e4d3b2]">01 — A chegada</p>
              <h2 className="font-display text-[clamp(2.8rem,7vw,7rem)] font-light leading-[.92] tracking-[-.055em]">Deixe o mundo <span className="italic text-[#e4d3b2]">lá fora.</span></h2>
              <p className="mx-auto mt-6 max-w-md text-sm font-light leading-7 text-white/80 sm:text-base">Respire fundo. O seu tempo começa a mudar aqui.</p>
            </div>
            <div className="scroll-copy-2 absolute max-w-4xl px-6 opacity-0">
              <p className="mb-5 text-[10px] uppercase tracking-[.35em] text-[#e4d3b2]">02 — A atmosfera</p>
              <h2 className="font-display text-[clamp(2.8rem,7vw,7rem)] font-light leading-[.92] tracking-[-.055em]">Feito de luz, <span className="italic text-[#e4d3b2]">matéria e calma.</span></h2>
              <p className="mx-auto mt-6 max-w-md text-sm font-light leading-7 text-white/80 sm:text-base">Texturas honestas, arquitetura com intenção e silêncio na medida certa.</p>
            </div>
            <div className="scroll-copy-3 absolute max-w-4xl px-6 opacity-0">
              <p className="mb-5 text-[10px] uppercase tracking-[.35em] text-[#e4d3b2]">03 — O tempo</p>
              <h2 className="font-display text-[clamp(2.8rem,7vw,7rem)] font-light leading-[.92] tracking-[-.055em]">Menos pressa. <span className="italic text-[#e4d3b2]">Mais presença.</span></h2>
              <p className="mx-auto mt-6 max-w-md text-sm font-light leading-7 text-white/80 sm:text-base">Momentos simples que se tornam a melhor parte da viagem.</p>
            </div>
            <div className="scroll-copy-4 absolute max-w-4xl px-6 opacity-0">
              <p className="mb-5 text-[10px] uppercase tracking-[.35em] text-[#e4d3b2]">04 — A memória</p>
              <h2 className="font-display text-[clamp(2.8rem,7vw,7rem)] font-light leading-[.92] tracking-[-.055em]">Fique com o que <span className="italic text-[#e4d3b2]">importa.</span></h2>
              <p className="mx-auto mt-6 max-w-md text-sm font-light leading-7 text-white/80 sm:text-base">Não é só um lugar para ficar. É uma sensação para levar.</p>
            </div>
          </div>

          <div className="absolute bottom-7 left-6 right-6 z-20 flex items-center justify-between border-t border-white/25 pt-4 text-[9px] uppercase tracking-[.22em] text-white/70 sm:left-10 sm:right-10 md:left-16 md:right-16 lg:left-[10vw] lg:right-[10vw]">
            <span>Uma viagem para sentir</span>
            <span className="flex items-center gap-3"><span className="h-8 w-px bg-[#e4d3b2]/70" /> Role para explorar</span>
            <span className="hidden sm:block">01 — 04</span>
          </div>
        </div>
      </section>

      <section className="marquee overflow-hidden border-y border-white/10 py-6 sm:py-8" aria-label="Nossa curadoria">
        <div className="marquee-track flex w-max items-center gap-7 whitespace-nowrap text-[clamp(1.3rem,3vw,2.7rem)] font-light uppercase tracking-[.14em] text-[#e4d3b2]/90">
          {Array.from({ length: 4 }, (_, i) => <span key={i} className="flex items-center gap-7">Lugares com alma <span className="text-xs">✳</span> Tempo para sentir <span className="text-xs">✳</span> Memórias para levar <span className="text-xs">✳</span></span>)}
        </div>
      </section>

      <section id="filosofia" className="grid gap-12 px-6 py-24 sm:px-10 sm:py-32 md:grid-cols-[.8fr_1.2fr] md:gap-20 md:px-16 lg:px-[10vw]">
        <div data-reveal>
          <p className="mb-6 flex items-center gap-3 text-[10px] uppercase tracking-[.3em] text-[#c7ae84]"><span className="h-px w-7 bg-[#c7ae84]" /> Nossa filosofia</p>
          <p className="font-display text-4xl font-light leading-[1.08] tracking-[-.04em] sm:text-5xl lg:text-6xl">Não é só onde você fica. <span className="italic text-[#c7ae84]">É como você se sente.</span></p>
        </div>
        <div data-reveal className="flex flex-col justify-end md:pl-[12%]">
          <p className="max-w-lg text-base font-light leading-8 text-white/65 sm:text-lg sm:leading-9">Selecionamos espaços com identidade, calma e personalidade. Da primeira luz da manhã ao silêncio do fim do dia, cada lugar é um convite para viver a viagem de um jeito mais presente.</p>
          <a href="#lugares" className="group mt-8 inline-flex w-fit items-center gap-4 border-b border-[#c7ae84]/60 pb-3 text-[10px] uppercase tracking-[.2em] text-[#e4d3b2]">Conheça a curadoria <Arrow /></a>
        </div>
      </section>

      <section id="lugares" className="px-6 pb-24 sm:px-10 sm:pb-32 md:px-16 lg:px-[10vw]">
        <div data-reveal className="mb-10 flex flex-col justify-between gap-5 sm:mb-14 sm:flex-row sm:items-end">
          <div>
            <p className="mb-4 text-[10px] uppercase tracking-[.3em] text-[#c7ae84]">Uma seleção cuidadosa</p>
            <h2 className="font-display text-4xl font-light tracking-[-.045em] sm:text-6xl">Fique onde a vida acontece.</h2>
          </div>
          <p className="max-w-xs text-sm font-light leading-6 text-white/55">Arquitetura marcante. Materiais naturais. A sensação de estar exatamente onde deveria.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-[1.15fr_.85fr] md:gap-7">
          <article data-reveal className="group relative min-h-[430px] overflow-hidden bg-[#33382f] sm:min-h-[590px]">
            <img src="/frame_035.jpg" alt="Sala de estar com luz dourada, texturas naturais e arquitetura contemporânea" className="gallery-image absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111410]/90 via-transparent to-[#111410]/10" />
            <div className="absolute left-6 top-6 flex items-center gap-3 text-[9px] uppercase tracking-[.25em] text-white/80 sm:left-8 sm:top-8"><span className="h-px w-6 bg-[#e4d3b2]" /> 01 / Refúgios</div>
            <div className="absolute bottom-7 left-6 right-6 flex items-end justify-between gap-4 sm:bottom-9 sm:left-8 sm:right-8">
              <div><p className="mb-2 text-[10px] uppercase tracking-[.22em] text-[#e4d3b2]">Calma, em cada detalhe</p><h3 className="font-display text-3xl font-light sm:text-4xl">O tempo é seu.</h3></div>
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/50 transition-all duration-500 group-hover:border-[#e4d3b2] group-hover:bg-[#e4d3b2]"><Arrow /></span>
            </div>
          </article>
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-1 md:gap-7">
            <article data-reveal className="group relative min-h-[270px] overflow-hidden border border-white/10 bg-[#252923] p-7 sm:min-h-[285px] sm:p-9">
              <span className="text-[9px] uppercase tracking-[.25em] text-[#c7ae84]">02 / Experiências</span>
              <div className="absolute -right-8 -top-10 h-56 w-56 rounded-full border border-[#c7ae84]/20 transition-transform duration-1000 group-hover:scale-125"><div className="absolute inset-7 rounded-full border border-[#c7ae84]/20"><div className="absolute inset-7 rounded-full border border-[#c7ae84]/20" /></div></div>
              <div className="relative mt-16 max-w-xs"><h3 className="font-display text-3xl font-light sm:text-4xl">Menos pressa. Mais presença.</h3><p className="mt-4 text-sm leading-6 text-white/55">Espaços que fazem o simples parecer extraordinário.</p></div>
            </article>
            <article data-reveal className="relative flex min-h-[230px] flex-col justify-between overflow-hidden bg-[#d7c7aa] p-7 text-[#252720] sm:min-h-[270px] sm:p-9">
              <p className="text-[9px] uppercase tracking-[.25em]">03 / A sua próxima história</p>
              <div><p className="font-display text-3xl font-light leading-tight sm:text-4xl">O lugar certo muda tudo.</p><a href="#contato" className="group mt-6 inline-flex items-center gap-4 border-b border-[#252720]/35 pb-2 text-[10px] uppercase tracking-[.2em]">Comece por aqui <Arrow light /></a></div>
            </article>
          </div>
        </div>
      </section>

      <section id="contato" className="relative overflow-hidden border-t border-white/10 px-6 py-24 text-center sm:px-10 sm:py-36">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#c7ae84]/10 sm:h-[680px] sm:w-[680px]"><div className="absolute inset-10 rounded-full border border-[#c7ae84]/10 sm:inset-16" /></div>
        <div data-reveal className="relative">
          <p className="mb-6 text-[10px] uppercase tracking-[.32em] text-[#c7ae84]">Sua próxima viagem começa aqui</p>
          <h2 className="mx-auto max-w-4xl font-display text-5xl font-light leading-[.98] tracking-[-.05em] sm:text-7xl lg:text-8xl">Vá além do <span className="italic text-[#e4d3b2]">destino.</span></h2>
          <p className="mx-auto mt-7 max-w-md text-sm font-light leading-7 text-white/60 sm:text-base">Descubra hospedagens que transformam alguns dias fora em lembranças que ficam.</p>
          <a href="#lugares" className="group mx-auto mt-9 inline-flex items-center gap-5 rounded-full border border-[#e4d3b2]/60 px-7 py-4 text-[10px] uppercase tracking-[.18em] transition-all duration-500 hover:bg-[#e4d3b2] hover:text-[#171916]">Explorar hospedagens <Arrow /></a>
        </div>
      </section>

      <footer className="flex flex-col gap-4 border-t border-white/10 px-6 py-7 text-[9px] uppercase tracking-[.2em] text-white/45 sm:flex-row sm:items-center sm:justify-between sm:px-10 md:px-16 lg:px-[10vw]">
        <span>© 2026 Coleção — Hospedagens com história</span>
        <span>Feito para viajar com intenção.</span>
        <a href="#" className="transition-colors hover:text-white">Voltar ao início ↑</a>
      </footer>
    </main>
  );
}
