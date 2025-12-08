# Fretly Documentation Map

Use this map to find the detailed specifications for your current task.

## 🎯 IF You are working on...

### 1. Game Logic & Rules (Mode A / Mode B)
* **Read:** `docs/project_requirements.md` -> Section 2 (Core Features)
* **Key Info:**
    * Mode A: Listening Challenge (Mic input, Pitch detection).
    * Mode B: Image Training (No mic, Timer based).
    * Scoring: Streak calculation, Correct/Incorrect triggers.

### 2. UI Styling & Components
* **Read:** `docs/design_requirements.md`
* **Key Info:**
    * **Colors:** `bg-slate-900` (Main), `text-emerald-400` (Correct), `text-rose-500` (Incorrect).
    * **Typography:** Large Monospace for Notes.
    * **Layout:** Thumb-zone friendly, Bottom controls.

### 3. Technical Implementation & Files
* **Read:** `docs/tech_requirements.md`
* **Key Info:**
    * **Stack:** React + Vite + Zustand + Tailwind.
    * **Audio:** Pitchfinder (YIN algorithm).
    * **Directory:** Strict adherence to Layered Architecture defined in Section 3.

## ⚠️ Critical Constraints
* **Serverless:** No backend code. Logic is client-side.
* **Persistence:** Use `localStorage` via Zustand persist middleware.
* **Wake Lock:** Must implement screen wake lock for mobile.