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
- **Language:** 한국어 (Korean). 모든 UI 텍스트는 한국어로 작성.
- **Conventions:**
  - Use Functional Components with Hooks.
  - **NO** `useEffect` for derived state; use `useMemo` or derived store selectors.
  - **Strictly** follow the color palette in `docs/design_requirements.md`.
  - Use `src/lib/utils.ts` (`cn`) for class merging.
  - **Context7 사용:** 코드 생성, 설정/구성 단계, 라이브러리/API 문서가 필요할 때 Context7 MCP 도구를 자동으로 사용하여 라이브러리 ID를 확인하고 문서를 가져올 것.

## Documentation Index (Source of Truth)
Before implementing features, **ALWAYS** check the specific requirements in `/docs`:
1.  **Logic/Features:** `docs/project_requirements.md` (Game modes, Scoring, Flows).
2.  **UI/Design:** `docs/design_requirements.md` (Colors, Layouts, Feedback UX).
3.  **Tech/Setup:** `docs/tech_requirements.md` (Libraries, Versions, detailed Directory structure).

## Development Workflow (Vibe Coding)
1.  **Mobile First:** Always check logic for mobile portrait view.
2.  **Mock Logic First:** For Audio/Mic features, implement UI with *dummy logic* first to verify UX flow, then integrate Pitchfinder.
3.  **Step-by-Step:** Do not generate entire apps in one go. Build one component/hook at a time.