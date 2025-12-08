## 1. Design System Specification

### 1.1. Color Palette (Dark Mode Default)
* **Background:** `bg-slate-900` (Deep dark blue/grey)
* **Surface (Card/Container):** `bg-slate-800`
* **Primary Action:** `bg-indigo-600` hover: `bg-indigo-500` (Text: White)
* **Text Main:** `text-slate-100` (High readability)
* **Text Muted:** `text-slate-400` (Labels, hints)
* **Feedback - Correct:** `text-emerald-400` / `bg-emerald-500/20` (Subtle glow)
* **Feedback - Incorrect:** `text-rose-500` / `bg-rose-500/20`
* **Accent:** `text-amber-400` (Stars, streaks)

### 1.2. Typography
* **Font Family:** Inter or system-ui (Clean sans-serif).
* **Quiz Text:** Extra Large, Bold, Monospace for Note Names to ensure clarity (e.g., "F#").
    * *Example:* `text-6xl font-bold font-mono tracking-tighter`

### 1.3. Layout & UX Principles
* **Mobile-First:** Optimized for Portrait mode. Elements should be vertically stacked.
* **Thumb Zone Friendly:** Place primary buttons (Start, Stop, Next) in the bottom 30% of the screen.
* **High Contrast:** Ensure the "Question" (e.g., "5번줄 - G") is visible from 1 meter away.

## 2. Component Implementation Details

### A. Main Screen (Settings)
* **Container:** A clean card centered on the screen.
* **String Selection:** Use a row of circular toggle buttons (like guitar string ends).
    * *Active:* Filled color with the string number.
    * *Inactive:* Outlined, muted color.
* **Timer Slider:** A sleek styled range input with the current value shown clearly above it.
* **Mode Buttons:** Two large block buttons. Use distinct icons (Mic for Mode A, Eye for Mode B).

### B. Game Screen (The "Stage")
* **Header:** Minimalist.
    * *Streak:* Display as `🔥 12` in amber color.
    * *Progress Bar:* A thin line at the very top that shrinks over time.
* **Center Stage (The Question):**
    * Display the **String Number** (e.g., "String 6") in small muted text.
    * Display the **Target Note** (e.g., "G#") in massive, center-aligned text.
* **Visualizer (Mode A only):**
    * Place a small audio wave animation or a pulsating microphone icon below the note to indicate "Listening".
* **Feedback Area:**
    * When feedback occurs, show the **Fret Number** (e.g., "3 Fret") clearly.
    * If correct, trigger a green confetti effect or a screen flash (green border).
    * If wrong, shake the screen slightly and show the correct answer in red.

### C. Bottom Controls
* A "Stop" button that is easily accessible but visually distinct from the game elements (e.g., a simple outline button or icon button at the bottom right).

## 3. Interaction & Animation Requirements
* **Transitions:** Smooth transitions between screens (Fade in/out).
* **Feedback:** The entire background should briefly tint Green (Correct) or Red (Incorrect) for 300ms to give peripheral vision feedback so the user doesn't have to stare directly at the screen while playing.
* **Micro-interactions:** Buttons should have a `scale-95` effect on click to feel tactile.

---
**Task:**
Please implement the `MainScreen` and `GameScreen` components based on this design spec. Use dummy logic for the audio processing part for now, but ensure the UI states (Listening, Success, Fail) are fully visually implemented.