# Rebuild parity checklist

When you rebuild a UI slice in JSX (instead of cropping a screenshot), the rebuilt version must match the in-app styling closely enough that a viewer can't tell. Run through this list while authoring; cross-check against the supplied screenshot.

## When to rebuild vs crop a screenshot

**Rebuild in JSX when ANY of these apply:**
- The beat shows a state change (typing, toggling, hover, focus, count incrementing)
- The slice would scale below 12px font at column size if cropped from a full screenshot
- The slice involves animated entry (modal slide, row slide-in, ripple)

**Crop the screenshot when ALL of these apply:**
- The slice is static (no per-pixel state change)
- The slice already reads cleanly at column size in the supplied screenshot
- A pixel-faithful look matters more than animation precision

## Checklist (rebuild)

Tick each before considering the slice done. Inspect the supplied screenshot, then check the rebuild against it.

- [ ] **Corner radius** matches (most VerifyWise inputs/buttons are 4px, cards are 8–12px)
- [ ] **Border color** matches (`#d0d5dd` for VerifyWise standard borders)
- [ ] **Border width** matches (1px almost always)
- [ ] **Background color** matches (white for cards, `#F9FAFB` for table headers, `#FAFAFA` for page bg)
- [ ] **Font family** matches the system stack (`-apple-system, BlinkMacSystemFont, ...`)
- [ ] **Font size** matches — measure against the screenshot proportionally
- [ ] **Font weight** matches (400 body, 500–600 labels, 700 headlines)
- [ ] **Letter spacing** matches — display headlines often use `-0.01em`, table column headers use `0.04em`
- [ ] **Line height** matches — body 1.4–1.5, headlines 1.1–1.2
- [ ] **Vertical rhythm** — gap between label and input is ~6px, between fields is ~18px in VerifyWise modals
- [ ] **Input height** is 38px in VerifyWise standard forms (NOT 40, NOT 36)
- [ ] **Button height** is 36px for secondary, 36px for primary in dialog footers
- [ ] **Icon position** — leading icons sit 8px from the left padding, not flush
- [ ] **Color of muted text** is `#475467` (textMuted), not gray-400 or whatever the LLM defaulted to
- [ ] **Placeholder color** is `#98A2B3`
- [ ] **Required-field asterisks** are inline, same color as label, no spacing tricks
- [ ] **Status pills / chips** use the same color family the app uses (compliance blue `#175CD3` on `#EFF8FF`, overdue red `#B42318` on `#FEE4E2`)
- [ ] **Shadow** on modals/cards matches — `0 8px 32px rgba(16, 24, 40, 0.08)` for cards, `0 24px 64px rgba(16, 24, 40, 0.18)` for floating modals
- [ ] **Focus ring color** for the highlighted primary button is the green token at low alpha (`rgba(19, 113, 91, 0.18)`), not pure green

## Checklist (crop)

If you cropped a screenshot:

- [ ] **Aspect ratio** of the crop is correct — don't stretch
- [ ] **DPR** — the screenshot was captured at 2× retina, not 1× (otherwise text blurs at column size)
- [ ] **Padding around the focal element** in the crop ≥ 8% of canvas
- [ ] **Caption band at top** (200–240px) is reserved — the focal slice sits below it
- [ ] **Cropped slice is readable** at the final video size — open the rendered MP4 in QuickTime at 50% page width and verify

## Red flags (these mean stop and re-do)

- Rebuilt button is taller than 36px — looks "designed by an LLM"
- Rebuilt input has rounded corners >4px in a VerifyWise context — clashes with the rest of the brand
- Rebuilt status pill uses a hex that doesn't appear in the screenshot — invented color
- Cropped screenshot has visible compression artifacts — re-capture at 2× DPR
- Rebuild has Tailwind class names like `text-gray-500` — use the token from `tokens.ts`, not arbitrary classes
