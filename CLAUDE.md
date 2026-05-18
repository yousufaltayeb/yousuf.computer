# yousuf.computer

Personal portfolio and blog for Yousuf Altayeb — software engineer based in Riyadh, Saudi Arabia.

## Tech Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS 4 + Framer Motion
- Markdown blog (gray-matter, remark, rehype)
- Bun package manager

## Design Context

### Users
Visitors are primarily developers, hiring managers, and peers exploring Yousuf's work and writing. They arrive with intent — to evaluate skills, read a post, or learn about a project. The site should reward that curiosity quickly and make browsing feel effortless.

### Brand Personality
**Honest, Technical, Warm.** The voice is personal and direct — no corporate polish, no false modesty. Technical depth presented with human warmth. The site reflects someone who codes seriously but tells stories naturally.

### Aesthetic Direction
- **Visual tone:** Clean developer portfolio — terminal-inspired monospace accents layered over warm, organic earth tones. Not sterile or cold.
- **References:** Developer portfolios like leerob.io, rauno.me, paco.me — minimal chrome, content-forward, tasteful craft.
- **Anti-references:** Over-designed agency sites, heavy illustration, generic Bootstrap templates, or anything that feels corporate or impersonal.
- **Theme:** Light/dark via `prefers-color-scheme`. Warm neutrals (ghost, vellum, stone) with acid green (`#dfff56`) as the signature accent.
- **Typography:** Space Grotesk (body), Departure Mono (display/headings/metadata), IBM Plex Sans Arabic (Arabic content). Monospace used intentionally for dates, labels, nav — not everywhere.

### Design Principles

1. **Content first** — Every design decision should make the writing and work easier to find and read. Strip away anything that competes with content.
2. **Warmth over sterility** — Avoid the cold, clinical feel of many dev portfolios. Earth tones, generous spacing, and subtle texture create an inviting space.
3. **Quiet craft** — Details should be felt, not announced. Subtle animations, considered typography, restrained color. The site should feel polished without screaming "designed."
4. **Honest simplicity** — No decoration for its own sake. If a border, shadow, or animation doesn't serve comprehension or delight, remove it.
5. **Respect the reader** — Fast loads, readable type, good contrast, keyboard navigable. Accessibility is a baseline, not a feature.

### Color Tokens
```
--stone: #282725        (dark base)
--stone-shaded: #343330 (dark elevated)
--ghost: #f7f5f1        (light base)
--ghost-shaded: #eeeae3 (light elevated)
--lichen: #d2d6c5       (dark mode accent)
--eggplant: #35313d     (light mode accent)
--vellum: #EEEAE3       (card/faint surfaces)
--acid: #dfff56          (signature highlight)
```

### Font Stack
```
--font-sans: Space Grotesk
--font-mono: Departure Mono
--font-arabic: IBM Plex Sans Arabic
```
