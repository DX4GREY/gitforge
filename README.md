# GitForge — Developer Identity & GitHub Profile Customization Engine

GitForge is an all-in-one platform for developers to transform raw GitHub data into an outstanding developer identity:
- GitHub Profile README.md Builder & AI Agent
- Server-Rendered SVG Cards (Profile, Stats, Top Languages, Streak, Contributions)
- AI Profile Intelligence & Developer Archetype Score
- Interactive Web Portfolio Builder & 1-Click ZIP Exporter
- GitHub Wrapped Story & Daily Developer Cards
- 20 Original Developer Themes with Real-time Customizer
- Manifest V3 Chrome Extension Integration

100% free, dark-first, zero subscription, zero paywalls.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Edit `.env` if you wish to configure Gemini AI key (optional, fallback engine active if omitted):
```env
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
```

### 3. Run Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 🛠 Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Motion, JSZip, Canvas-Confetti
- **Backend**: Node.js, Express, Server-side SVG Renderer, Server-side Markdown Generator
- **AI Integration**: `@google/genai` (Gemini 3.6 Flash) with deterministic fallback provider
- **Extension**: Chrome Manifest V3 extension bundle (`/extension`)

---

## 📡 API Endpoints

- `GET /api/github/:username` — Normalized GitHub profile object
- `GET /api/card/profile` — Server-rendered SVG Profile Card
- `GET /api/card/stats` — Server-rendered SVG Stats Card
- `GET /api/card/languages` — Server-rendered SVG Languages Card
- `GET /api/card/streak` — Server-rendered SVG Streak Card
- `GET /api/card/contributions` — Server-rendered SVG Contribution Matrix
- `POST /api/ai/readme` — AI README Generator
- `POST /api/ai/intelligence` — AI Developer Intelligence Assessment
- `POST /api/ai/project-persona` — AI Repository Persona Engine

---

## 🔒 Security & Privacy

- All API calls to Gemini occur strictly server-side (`server.ts`).
- Secrets and API keys are never exposed in client bundles.
- SVG generation includes strict XML escaping and XSS safety.
