<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the audited image manifest and pure frame-selection rules in `src/lib/hotel-sequence.ts`; intentional filename gaps must never become fabricated requests.
- Use `useHotelSequence` as the sole owner of scene pinning, progressive image loading and cleanup; never combine sticky positioning with GSAP pinning.
- Map native ScrollTrigger progress directly to the canvas and hold the final frame before release; reduced motion skips pinning and loads one scene.
- Keep architectural aperture, typography separation and arrival transitions in the sequence hook's paused timeline, driven by the same ScrollTrigger progress, so every layer reverses together without extra pins.
