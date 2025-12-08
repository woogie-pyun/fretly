# Fretly Engineering Guide

## Commands
- **Run Dev Server:** `npm run dev` (Vite)
- **Build:** `npm run build`
- **Lint:** `npm run lint`
- **Add Component:** `npx shadcn-ui@latest add [component-name]`
- **Test:** `npm run test` (if configured)

## Architecture & Structure
- **Root:** `src/`
- **Pattern:** Layered Architecture (Not Feature-based). See `docs/tech_requirements.md` for full tree.
- **State Management:** Zustand (`src/store/useGameStore.ts` with persistence).
- **UI Components:** `shadcn/ui` in `src/components/ui`.
- **Business Logic:** Custom hooks in `src/hooks/`. Pure functions in `src/lib/`.
- **Audio Logic:** Web Audio API + Pitchfinder in `src/hooks/useAudio.ts` & `usePitchDetect.ts`.

## Tech Stack & Standards
- **Framework:** React 18+ (Vite), TypeScript 5+ (Strict).
- **Styling:** Tailwind CSS v3.4+ (Mobile-first, Dark mode default).
- **Icons:** Lucide React.
- **Conventions:**
  - Use Functional Components with Hooks.
  - **NO** `useEffect` for derived state; use `useMemo` or derived store selectors.
  - **Strictly** follow the color palette in `docs/design_requirements.md`.
  - Use `src/lib/utils.ts` (`cn`) for class merging.

## Documentation Index (Source of Truth)
Before implementing features, **ALWAYS** check the specific requirements in `/docs`:
1.  **Logic/Features:** `docs/project_requirements.md` (Game modes, Scoring, Flows).
2.  **UI/Design:** `docs/design_requirements.md` (Colors, Layouts, Feedback UX).
3.  **Tech/Setup:** `docs/tech_requirements.md` (Libraries, Versions, detailed Directory structure).

## Development Workflow (Vibe Coding)
1.  **Mobile First:** Always check logic for mobile portrait view.
2.  **Mock Logic First:** For Audio/Mic features, implement UI with *dummy logic* first to verify UX flow, then integrate Pitchfinder.
3.  **Step-by-Step:** Do not generate entire apps in one go. Build one component/hook at a time.