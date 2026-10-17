import { useEffect, useRef, type MutableRefObject } from "react";

const FRAME_NUMBERS = [
  001, 002, 003, 004, 005, 006, 007, 008, 009, 010, 011, 012, 013, 014, 015, 016, 017, 018, 019, 020, 021, 022, 023, 024, 025, 026, 027, 028, 029, 030, 031, 032, 033, 034, 035, 036, 037, 038, 039, 040, 041, 042, 043, 044, 045, 046, 047, 048, 049, 050, 051, 052, 053, 054, 055, 056, 057, 058, 059, 060, 061, 062,
  "064", "065", "068",
].map((value) => typeof value === "number" ? String(value).padStart(3, "0") : value);

type CinematicFramesProps = {
  progressRef: MutableRefObject<((progress: number) => void) | null>;
};

export function CinematicFrames({ progressRef }: CinematicFramesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: false });
    if (!canvas || !context) return;

    let disposed = false;
    let resizeObserver: ResizeObserver | undefined;
    let lastProgress = 0;
    const frames: HTMLImageElement[] = [];
    let loaded = 0;

    const draw = (progress: number) => {
      lastProgress = Math.max(0, Math.min(1, progress));
      const targetIndex = Math.round(lastProgress * (FRAME_NUMBERS.length - 1));
      let frame: HTMLImageElement | undefined;
      // Pick the closest decoded frame so asynchronous loading never reorders the shot.
      for (let distance = 0; distance < FRAME_NUMBERS.length && !frame; distance += 1) {
        const candidates = distance === 0 ? [targetIndex] : [targetIndex - distance, targetIndex + distance];
        for (const candidate of candidates) {
          const image = frames[candidate];
          if (image?.complete && image.naturalWidth > 0) {
            frame = image;
            break;
          }
        }
      }
      if (!frame) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.round(rect.width * dpr));
      const height = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      const scale = Math.max(width / frame.naturalWidth, height / frame.naturalHeight);
      const drawWidth = frame.naturalWidth * scale;
      const drawHeight = frame.naturalHeight * scale;
      context.fillStyle = "#10100f";
      context.fillRect(0, 0, width, height);
      context.drawImage(frame, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
    };

    progressRef.current = draw;
    const observer = new ResizeObserver(() => draw(lastProgress));
    observer.observe(canvas);
    resizeObserver = observer;

    FRAME_NUMBERS.forEach((number, index) => {
      const image = new Image();
      image.decoding = "async";
      image.src = `/frame_${number}.jpg`;
      frames[index] = image;
      image.onload = () => {
        if (disposed) return;
        loaded += 1;
        // Render immediately on the first frame; later frames fill in as they decode.
        if (loaded === 1 || index === Math.round(lastProgress * (FRAME_NUMBERS.length - 1))) draw(lastProgress);
      };
      image.onerror = () => {
        // Missing files are skipped rather than breaking the whole sequence.
        frames[index] = undefined as unknown as HTMLImageElement;
      };
    });

    return () => {
      disposed = true;
      observer.disconnect();
      resizeObserver = undefined;
      progressRef.current = null;
    };
  }, [progressRef]);

  return (
    <div className="absolute inset-0 bg-[#10100f]">
      <canvas
        ref={canvasRef}
        className="h-full w-full"
        role="img"
        aria-label="Sequência cinematográfica de hospedagem, controlada pela rolagem da página"
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-8 z-10 flex justify-center">
        <span className="rounded-full border border-white/20 bg-black/25 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-white/70 backdrop-blur-sm">
          Role para explorar
        </span>
      </div>
    </div>
  );
}
