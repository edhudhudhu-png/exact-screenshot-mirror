// Audited public files, in source order. Numerical gaps are intentional.
export const HOTEL_FRAMES = [
  "/frame_020.jpg", "/frame_021.jpg", "/frame_022.jpg", "/frame_023.jpg",
  "/frame_024.jpg", "/frame_025.jpg", "/frame_026.jpg", "/frame_027.jpg",
  "/frame_028.jpg", "/frame_029.jpg", "/frame_030.jpg", "/frame_031.jpg",
  "/frame_032.jpg", "/frame_033.jpg", "/frame_034.jpg", "/frame_035.jpg",
  "/frame_036.jpg", "/frame_037.jpg", "/frame_038.jpg", "/frame_039.jpg",
  "/frame_040.jpg", "/frame_041.jpg", "/frame_042.jpg", "/frame_043.jpg",
  "/frame_044.jpg", "/frame_045.jpg", "/frame_046.jpg", "/frame_047.jpg",
  "/frame_048.jpg", "/frame_049.jpg", "/frame_050.jpg", "/frame_051.jpg",
  "/frame_052.jpg", "/frame_053.jpg", "/frame_054.jpg", "/frame_055.jpg",
  "/frame_056.jpg", "/frame_057.jpg", "/frame_058.jpg", "/frame_059.jpg",
  "/frame_060.jpg", "/frame_061.jpg", "/frame_062.jpg", "/frame_064.jpg",
  "/frame_065.jpg", "/frame_068.jpg",
] as const;

// Reserve the last 8% of the pinned journey for the completed scene.
export function frameAtProgress(progress: number, count: number) {
  return Math.round(Math.max(0, Math.min(1, progress / 0.92)) * Math.max(0, count - 1));
}

export function nearestReadyFrame(desired: number, ready: readonly boolean[]) {
  for (let offset = 0; offset < ready.length; offset++) {
    if (ready[desired - offset]) return desired - offset;
    if (ready[desired + offset]) return desired + offset;
  }
  return -1;
}

export function sequenceScrollDistance(width: number, height: number) {
  return Math.max(HOTEL_FRAMES.length * (width < 640 ? 32 : 48), height * 1.5);
}