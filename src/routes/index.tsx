import { createFileRoute } from "@tanstack/react-router";

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

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}

function Index() {
  return (
    <main className="min-h-screen bg-ink text-ivory">
      <header className="relative z-30 flex items-center justify-between px-6 py-6 md:px-12 md:py-8">
        <span className="text-[11px] font-medium uppercase tracking-[0.4em] text-ivory/90">Coleção · Hospedagens</span>
        <nav className="flex items-center gap-8 text-sm">
          {["Explorar", "Destinos", "Entrar"].map((l) => (
            <a key={l} href="#" className="hidden text-ivory/80 transition-colors hover:text-ivory md:inline">{l}</a>
          ))}
          <a href="#" className="rounded-full border border-ivory/30 px-5 py-2.5 text-xs tracking-wide transition-colors duration-300 hover:border-ivory/70 hover:bg-ivory/10">
            Começar uma reserva
          </a>
        </nav>
      </header>

      <section className="relative flex min-h-[78vh] items-end overflow-hidden bg-ink px-6 pb-16 pt-20 md:min-h-[82vh] md:items-center md:px-12 md:pb-0 lg:px-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_35%,rgba(174,143,91,0.14),transparent_55%)]" />
        <div className="relative max-w-5xl">
          <p className="mb-6 flex items-center gap-4 text-[11px] font-medium uppercase tracking-[0.42em] text-gold">
            <span className="h-px w-10 bg-gold/70" />
            Hospedagens selecionadas
          </p>
          <h1 className="font-display text-5xl font-light leading-[0.95] tracking-[-0.02em] sm:text-6xl lg:text-8xl">
            Espaços que
            <br />
            <span className="italic">contam histórias.</span>
          </h1>
          <p className="mt-8 max-w-sm text-base leading-relaxed text-ivory/75 md:text-lg">
            Apartamentos e hotéis escolhidos pela arquitetura, pela luz e pela forma de receber.
          </p>
          <a href="#explorar" className="group mt-10 inline-flex items-center gap-4 rounded-full border border-ivory/30 px-6 py-3 text-sm transition-colors duration-300 hover:border-ivory/70 hover:bg-ivory/10">
            Explorar hospedagens <Arrow />
          </a>
        </div>
      </section>
      <section id="explorar" className="border-t border-ivory/10 px-6 py-16 md:px-12 lg:px-20">
        <p className="text-xs uppercase tracking-[0.35em] text-gold">Sua próxima experiência</p>
        <p className="mt-4 max-w-2xl font-display text-2xl font-light text-ivory/80 md:text-4xl">
          Encontre um lugar que transforme a sua próxima viagem em uma boa história.
        </p>
      </section>
    </main>
  );
}
