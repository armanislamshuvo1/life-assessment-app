# LifeSync — AI Holistic Life & Career Assessment App (Powered by Gemini 2.5 Flash)

An intelligent, AI-powered diagnostic web application that audits **6 fundamental pillars of life**:
1. **💼 Career & Ambition** (Direction, intellectual engagement, culture, future-proofing)
2. **⚡ Health & Vitality** (Restorative sleep, regular movement, sustained energy, recovery)
3. **🧠 Mind & Emotional State** (Stress resilience, healthy boundaries, calm, presence)
4. **💰 Finance & Wealth** (Cashflow visibility, emergency reserves, long-term assets, financial calm)
5. **❤️ Relationships & Community** (Deep confidants, family/romantic harmony, communication)
6. **🌱 Lifestyle, Growth & Joy** (Creative hobbies, continuous learning, organized environment, purpose)

---

## 🤖 Gemini 2.5 Flash AI Integration
- **Personalized Context Intake:** Optionally provide notes on your current career challenges, transitions, or family goals before taking the quiz.
- **Dynamic Archetype Generation:** Gemini synthesizes your quantitative responses and personal context into a tailored archetype profile (e.g. *The Focused Ascendant: Purpose-Driven, Personally Depleted*).
- **🧬 AI Root-Cause System Interplay:** Analyzes how pressure in one area (e.g., career or finances) is causing hidden friction in another (sleep or relationships).
- **📅 4-Week Custom Action Protocol:** Week-by-week sequencing with target micro-habits and expected outcomes.
- **🤔 Provocative Coaching Reflections:** Introspective questions crafted to spark breakthrough clarity.
- **💬 Live Conversational AI Coach:** An interactive chatbox embedded directly on your results dashboard where you can ask follow-up questions, seek advice on specific habits, or dig deeper into your scores.

---

## 🚀 How to Run

1. Verify `.env` has your `GEMINI_API_KEY`:
   ```bash
   GEMINI_API_KEY=your_key_here
   ```
2. Start the server:
   ```bash
   node server.js
   ```
3. Open your browser:
   ```
   http://localhost:3000
   ```

---

## 📁 Architecture
- [`server.js`](file:///C:/Users/arman/.gemini/antigravity/scratch/life-assessment-app/server.js) — Backend server with `/api/ai-assess` and `/api/ai-chat` powered by Gemini 2.5 Flash
- [`index.html`](file:///C:/Users/arman/.gemini/antigravity/scratch/life-assessment-app/index.html) — Modern semantic UI with AI badges, loading state, and chat interface
- [`style.css`](file:///C:/Users/arman/.gemini/antigravity/scratch/life-assessment-app/style.css) — Design system, glassmorphic cards, responsive layout, print-to-PDF styles
- [`app.js`](file:///C:/Users/arman/.gemini/antigravity/scratch/life-assessment-app/app.js) — Frontend state machine, Gemini API integration, Chart.js radar chart, live chat
- [`questions.js`](file:///C:/Users/arman/.gemini/antigravity/scratch/life-assessment-app/questions.js) — Diagnostic questions dataset
- [`assessment-engine.js`](file:///C:/Users/arman/.gemini/antigravity/scratch/life-assessment-app/assessment-engine.js) — Baseline quantitative scoring engine
