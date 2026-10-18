import { existsSync, readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { HOTEL_FRAMES, frameAtProgress, nearestReadyFrame } from "@/lib/hotel-sequence";

describe("Hotel sequence rules", () => {
  it("uses all 46 actual frames in numerical order, preserving intentional gaps", () => {
    const actual = readdirSync("public").filter((name) => /^frame_\d+\.jpg$/.test(name)).sort().map((name) => `/${name}`);
    expect([...HOTEL_FRAMES]).toEqual(actual);
    expect(HOTEL_FRAMES).toHaveLength(46);
    expect(HOTEL_FRAMES[0]).toBe("/frame_020.jpg");
    expect(HOTEL_FRAMES.at(-1)).toBe("/frame_068.jpg");
    for (const source of HOTEL_FRAMES) expect(existsSync(`public${source}`)).toBe(true);
    for (const absent of ["/frame_063.jpg", "/frame_066.jpg", "/frame_067.jpg"]) expect(HOTEL_FRAMES).not.toContain(absent);
  });
  it("reaches the last frame before release and holds it through the end", () => {
    expect(frameAtProgress(0, 46)).toBe(0);
    expect(frameAtProgress(0.46, 46)).toBe(23);
    expect(frameAtProgress(0.92, 46)).toBe(45);
    expect(frameAtProgress(1, 46)).toBe(45);
    expect(frameAtProgress(2, 46)).toBe(45);
    expect(frameAtProgress(-1, 46)).toBe(0);
  });
  it("reverses deterministically when scroll moves backward", () => {
    expect([1, 0.92, 0.46, 0].map((p) => frameAtProgress(p, 46))).toEqual([45, 45, 23, 0]);
  });
  it("uses the nearest loaded frame instead of blanking a pending or failed frame", () => {
    expect(nearestReadyFrame(3, [true, false, true, false, false, true])).toBe(2);
    expect(nearestReadyFrame(0, [false, true])).toBe(1);
    expect(nearestReadyFrame(1, [false, false])).toBe(-1);
  });
});