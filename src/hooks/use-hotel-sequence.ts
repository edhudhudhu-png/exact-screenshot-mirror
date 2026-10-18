import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HOTEL_FRAMES, frameAtProgress, nearestReadyFrame, sequenceScrollDistance } from "@/lib/hotel-sequence";

export function useHotelSequence(
  sectionRef: RefObject<HTMLElement | null>,
  sceneRef: RefObject<HTMLDivElement | null>,
  canvasRef: RefObject<HTMLCanvasElement | null>,
) {
  useEffect(() => {
    const section = sectionRef.current;
    const scene = sceneRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: false });
    if (!section || !scene || !canvas || !context) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add({ motion: "(prefers-reduced-motion: no-preference)", reduced: "(prefers-reduced-motion: reduce)" }, (match) => {
      const reduced = Boolean(match.conditions?.["reduced"]);
      const sources = reduced ? HOTEL_FRAMES.slice(0, 1) : HOTEL_FRAMES;
      const images = sources.map(() => new Image());
      const ready = sources.map(() => false);
      let desired = 0;
      let rendered = -1;
      let disposed = false;
      let queueIndex = 0;
      let active = 0;

      // A single reversible architectural aperture, driven by the same native
      // progress as the audited sequence. No second pin or playback clock.
      const motion = reduced ? undefined : gsap.timeline({ paused: true });
      if (motion) {
        const select = (selector: string) => scene.querySelectorAll(selector);
        motion
          .fromTo(select(".story-courtyard"), { scale: 1 }, { scale: 1.16, duration: .52, ease: "none" }, 0)
          .fromTo(select(".story-aperture"), { clipPath: "inset(16% 50% 16% 50%)", opacity: 0 }, { opacity: 1, duration: .04 }, .08)
          .to(select(".story-aperture"), { clipPath: "inset(16% 36% 16% 36%)", duration: .18, ease: "power2.inOut" }, .1)
          .to(select(".story-aperture"), { clipPath: "inset(0% 0% 0% 0%)", duration: .26, ease: "power2.inOut" }, .28)
          .to(select(".story-word"), { xPercent: (index) => index === 0 ? -14 : 14, yPercent: -25, duration: .26, ease: "power2.in" }, .02)
          .to(select(".story-hero-copy"), { autoAlpha: 0, y: -40, duration: .2, ease: "none" }, .04)
          .fromTo(select(".story-door-outline"), { opacity: 0, clipPath: "inset(100% 0% 0% 0%)" }, { opacity: .7, clipPath: "inset(0% 0% 0% 0%)", duration: .16 }, .02)
          .to(select(".story-door-outline"), { scaleX: 3.6, scaleY: 1.6, opacity: 0, duration: .3, ease: "power2.in" }, .24)
          .to(select(".story-light-veil"), { opacity: .35, duration: .35 }, .18)
          .fromTo(select(".story-arrival"), { autoAlpha: 0, y: 32 }, { autoAlpha: 1, y: 0, duration: .12, ease: "power2.out" }, .78)
          .to(select(".story-bottom-label"), { opacity: 0, duration: .1 }, .76)
          .fromTo(select(".story-progress-fill"), { scaleX: 0 }, { scaleX: 1, duration: 1, ease: "none" }, 0);
      }

      const draw = (force = false) => {
        if (disposed) return;
        const index = nearestReadyFrame(desired, ready);
        const image = images[index];
        if (!image || !image.naturalWidth) return;
        const width = scene.clientWidth;
        const height = scene.clientHeight;
        if (!width || !height) return;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const physicalWidth = Math.round(width * dpr);
        const physicalHeight = Math.round(height * dpr);
        const resized = canvas.width !== physicalWidth || canvas.height !== physicalHeight;
        if (!force && !resized && index === rendered) return;
        if (resized) { canvas.width = physicalWidth; canvas.height = physicalHeight; }
        context.setTransform(dpr, 0, 0, dpr, 0, 0);
        const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
        const drawWidth = image.naturalWidth * scale;
        const drawHeight = image.naturalHeight * scale;
        context.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
        rendered = index;
        canvas.dataset["frame"] = String(index);
        canvas.dataset["source"] = sources[index];
      };

      // Load the first scene alone, then a bounded queue; retain decoded frames.
      const pump = () => {
        if (disposed) return;
        const limit = ready[0] || queueIndex > 1 ? 4 : 1;
        while (active < limit && queueIndex < sources.length) {
          const index = queueIndex++;
          const image = images[index];
          const source = sources[index];
          if (!image || !source) continue;
          active++;
          image.decoding = "async";
          image.fetchPriority = index === 0 ? "high" : "low";
          const finish = (loaded: boolean) => {
            if (disposed) return;
            ready[index] = loaded;
            active--;
            if (!loaded) console.warn("Hotel sequence: unable to load", source);
            // Always honor the current scroll request, never the loading index.
            draw();
            pump();
          };
          image.onload = () => finish(true);
          image.onerror = () => finish(false);
          image.src = source;
        }
      };

      const trigger = reduced ? undefined : ScrollTrigger.create({
        id: "hotel-sequence",
        trigger: section,
        pin: scene,
        start: "top top",
        end: () => `+=${sequenceScrollDistance(scene.clientWidth, scene.clientHeight)}`,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          motion?.progress(self.progress);
          desired = frameAtProgress(self.progress, sources.length);
          canvas.dataset["desiredFrame"] = String(desired);
          draw();
        },
        onRefresh: (self) => {
          motion?.progress(self.progress);
          desired = frameAtProgress(self.progress, sources.length);
          canvas.dataset["desiredFrame"] = String(desired);
          draw(true);
        },
      });
      // Direct progress updates provide zero-lag scrub, including the release boundary.
      canvas.dataset["desiredFrame"] = "0";
      const observer = new ResizeObserver(() => draw(true));
      observer.observe(scene);
      pump();
      ScrollTrigger.refresh();
      return () => {
        disposed = true;
        observer.disconnect();
        trigger?.kill();
        motion?.kill();
        for (const image of images) { image.onload = null; image.onerror = null; }
      };
    });
    return () => media.revert();
  }, [sectionRef, sceneRef, canvasRef]);
}