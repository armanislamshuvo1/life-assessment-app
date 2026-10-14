import { CATEGORIES, QUESTIONS, SCALE_OPTIONS } from './questions.js';
import { calculateAssessment } from './assessment-engine.js';

// Application State
const state = {
  currentIndex: 0,
  answers: {},
  userNotes: '',
  chartInstance: null,
  currentResults: null,
  aiAssessment: null,
  chatHistory: []
};

// DOM Elements
const welcomeScreen = document.getElementById('welcomeScreen');
const questionScreen = document.getElementById('questionScreen');
const loadingScreen = document.getElementById('loadingScreen');
const resultsScreen = document.getElementById('resultsScreen');

const userContextInput = document.getElementById('userContextInput');
const startAssessmentBtn = document.getElementById('startAssessmentBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const retakeBtn = document.getElementById('retakeBtn');
const printBtn = document.getElementById('printBtn');
const logoBtn = document.getElementById('logoBtn');

const categoryBadge = document.getElementById('categoryBadge');
const categoryIcon = document.getElementById('categoryIcon');
const categoryName = document.getElementById('categoryName');
const currentQNum = document.getElementById('currentQNum');
const totalQNum = document.getElementById('totalQNum');
const progressBar = document.getElementById('progressBar');
const questionText = document.getElementById('questionText');
const questionContext = document.getElementById('questionContext');
const optionsContainer = document.getElementById('optionsContainer');

const themeToggleBtn = document.getElementById('themeToggleBtn');
const themeIcon = document.getElementById('themeIcon');
const historyBtn = document.getElementById('historyBtn');
const historyModal = document.getElementById('historyModal');
const closeHistoryBtn = document.getElementById('closeHistoryBtn');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const historyModalBody = document.getElementById('historyModalBody');

// Chat DOM
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const chatMessages = document.getElementById('chatMessages');
const chatSendBtn = document.getElementById('chatSendBtn');

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initEvents();
  totalQNum.textContent = QUESTIONS.length;
});

function initTheme() {
  const savedTheme = localStorage.getItem('lifesync_theme') || 'dark';
  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
    document.body.classList.remove('dark-theme');
    themeIcon.textContent = '🌙';
  } else {
    document.body.classList.add('dark-theme');
    document.body.classList.remove('light-theme');
    themeIcon.textContent = '☀️';
  }
}

function toggleTheme() {
  const isLight = document.body.classList.toggle('light-theme');
  document.body.classList.toggle('dark-theme', !isLight);
  themeIcon.textContent = isLight ? '🌙' : '☀️';
  localStorage.setItem('lifesync_theme', isLight ? 'light' : 'dark');

  if (state.currentResults && state.chartInstance) {
    renderRadarChart(state.currentResults.pillarResults);
  }
}

function initEvents() {
  themeToggleBtn.addEventListener('click', toggleTheme);
  startAssessmentBtn.addEventListener('click', startAssessment);
  logoBtn.addEventListener('click', () => switchScreen(welcomeScreen));

  prevBtn.addEventListener('click', goToPreviousQuestion);
  nextBtn.addEventListener('click', handleNextQuestion);
  retakeBtn.addEventListener('click', resetAndRestart);
  printBtn.addEventListener('click', () => window.print());

  // History Modal
  historyBtn.addEventListener('click', openHistoryModal);
  closeHistoryBtn.addEventListener('click', () => historyModal.classList.remove('open'));
  clearHistoryBtn.addEventListener('click', clearHistory);
  historyModal.addEventListener('click', (e) => {
    if (e.target === historyModal) historyModal.classList.remove('open');
  });

  // Chat Form Submit
  chatForm.addEventListener('submit', handleCoachChatSubmit);

  // Keyboard navigation
  window.addEventListener('keydown', handleKeyNavigation);
}

function switchScreen(targetScreen) {
  [welcomeScreen, questionScreen, loadingScreen, resultsScreen].forEach(s => s.classList.remove('active-screen'));
  targetScreen.classList.add('active-screen');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function startAssessment() {
  state.currentIndex = 0;
  state.answers = {};
  state.userNotes = (userContextInput?.value || '').trim();
  state.chatHistory = [];
  switchScreen(questionScreen);
  renderCurrentQuestion();
}

function renderCurrentQuestion() {
  const q = QUESTIONS[state.currentIndex];
  const cat = CATEGORIES[q.category];

  categoryIcon.textContent = cat.icon;
  categoryName.textContent = cat.name;
  currentQNum.textContent = state.currentIndex + 1;
  categoryBadge.style.borderColor = cat.color;

  const progressPercent = Math.round(((state.currentIndex + 1) / QUESTIONS.length) * 100);
  progressBar.style.width = `${progressPercent}%`;

  questionText.textContent = q.question;
  questionContext.textContent = q.context;

  optionsContainer.innerHTML = '';
  const currentAnswer = state.answers[q.id];

  SCALE_OPTIONS.forEach(opt => {
    const card = document.createElement('div');
    card.className = `option-card ${currentAnswer === opt.value ? 'selected' : ''}`;
    card.setAttribute('role', 'radio');
    card.setAttribute('aria-checked', currentAnswer === opt.value);
    card.tabIndex = 0;

    card.innerHTML = `
      <div class="option-number-badge">${opt.value}</div>
      <div class="option-content">
        <span class="option-label">${opt.label}</span>
        <span class="option-detail">${opt.detail}</span>
      </div>
    `;

    card.addEventListener('click', () => selectOption(q.id, opt.value));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectOption(q.id, opt.value);
      }
    });

    optionsContainer.appendChild(card);
  });

  prevBtn.disabled = state.currentIndex === 0;
  nextBtn.disabled = !state.answers[q.id];
  nextBtn.textContent = state.currentIndex === QUESTIONS.length - 1 ? '✨ Generate AI Assessment' : 'Next →';
}

function selectOption(questionId, value) {
  state.answers[questionId] = value;
  
  const cards = optionsContainer.querySelectorAll('.option-card');
  cards.forEach((card, idx) => {
    const isSelected = SCALE_OPTIONS[idx].value === value;
    card.classList.toggle('selected', isSelected);
    card.setAttribute('aria-checked', isSelected);
  });

  nextBtn.disabled = false;
}

function handleNextQuestion() {
  const q = QUESTIONS[state.currentIndex];
  if (!state.answers[q.id]) return;

  if (state.currentIndex < QUESTIONS.length - 1) {
    state.currentIndex++;
    renderCurrentQuestion();
  } else {
    finishAssessment();
  }
}

function goToPreviousQuestion() {
  if (state.currentIndex > 0) {
    state.currentIndex--;
    renderCurrentQuestion();
  }
}

function handleKeyNavigation(e) {
  if (!questionScreen.classList.contains('active-screen')) return;

  if (['1', '2', '3', '4', '5'].includes(e.key)) {
    const q = QUESTIONS[state.currentIndex];
    const val = parseInt(e.key, 10);
    selectOption(q.id, val);
  }

  if (e.key === 'Enter') {
    const q = QUESTIONS[state.currentIndex];
    if (state.answers[q.id]) {
      handleNextQuestion();
    }
  }

  if (e.key === 'ArrowLeft') {
    goToPreviousQuestion();
  }
}

async function finishAssessment() {
  // 1. Calculate base quantitative scores
  const baseResults = calculateAssessment(state.answers, QUESTIONS);
  state.currentResults = baseResults;

  // 2. Switch to loading screen
  switchScreen(loadingScreen);

  // 3. Prepare summary for Gemini
  const answersSummary = QUESTIONS.map(q => {
    const score = state.answers[q.id] || 3;
    const cat = CATEGORIES[q.category].name;
    return `[${cat}] "${q.question}" -> Score: ${score}/5`;
  }).join('\n');

  try {
    const res = await fetch('/api/ai-assess', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pillarResults: baseResults.pillarResults,
        overallScore: baseResults.overallScore,
        answersSummary: answersSummary,
        notes: state.userNotes
      })
    });

    if (!res.ok) {
      throw new Error(`AI generation failed with status ${res.status}`);
    }

    const aiData = await res.json();
    state.aiAssessment = aiData;
  } catch (err) {
    console.warn('AI Assessment fetch error, falling back to local engine:', err);
    // Graceful fallback to deterministic engine
    state.aiAssessment = {
      archetypeTitle: baseResults.archetype.title,
      archetypeBadge: baseResults.archetype.badge,
      executiveSummary: baseResults.archetype.description,
      rootCauseInterplay: "Your assessment highlights distinct variances between your highest-performing and lowest-performing domains. Addressing your lowest baseline pillar will create compounding positive effects across your other dimensions.",
      superpowers: baseResults.superpowers.map(p => ({
        pillar: p.name,
        strength: `Strong alignment in ${p.name} (${p.score}%)`,
        leverageAdvice: "Protect this area as a core anchor while allocating surplus energy to your priority growth levers."
      })),
      blindspots: baseResults.growthLevers.map(p => ({
        area: p.name,
        frictionPoint: `Trailing score in ${p.name} (${p.score}%)`,
        solution: "Focus on establishing 1 small daily non-negotiable micro-habit."
      })),
      weeklyRoadmap: [
        { week: "Week 1", focus: "Foundation Reset", microHabit: "Implement regular sleep and digital shutdown schedule.", expectedOutcome: "Enhanced baseline energy and mental clarity." },
        { week: "Week 2", focus: "Friction Audit", microHabit: "Audit weekly calendar and eliminate 2 draining commitments.", expectedOutcome: "Recovered time and reduced anxiety." },
        { week: "Week 3", focus: "Keystone Habit", microHabit: "Dedicate 25 minutes daily to your weakest pillar.", expectedOutcome: "Measurable momentum in priority areas." },
        { week: "Week 4", focus: "Equilibrium Review", microHabit: "Reassess progress and refine routines.", expectedOutcome: "Sustained long-term balance." }
      ],
      coachingQuestion: "If you could only upgrade ONE daily habit over the next 30 days to transform your energy, which one would it be?"
    };
  }

  // Save to history
  saveAssessmentToHistory(baseResults, state.aiAssessment);

  // Switch to results screen
  switchScreen(resultsScreen);

  // Render dashboard elements
  renderResultsDashboard(baseResults, state.aiAssessment);

  // Trigger celebration confetti
  triggerConfetti();
}

function renderResultsDashboard(baseResults, aiData) {
  // Archetype & Title from Gemini
  document.getElementById('resArchetypeBadge').textContent = aiData.archetypeBadge || baseResults.archetype.badge;
  document.getElementById('resArchetypeTitle').textContent = aiData.archetypeTitle || baseResults.archetype.title;
  document.getElementById('resArchetypeDesc').textContent = aiData.executiveSummary || baseResults.archetype.description;

  // Root cause interplay
  document.getElementById('resRootCause').textContent = aiData.rootCauseInterplay;

  // Overall Score & Animated Circle
  const scoreNumEl = document.getElementById('resOverallScore');
  animateScoreCounter(scoreNumEl, baseResults.overallScore);

  const circleSvg = document.getElementById('scoreCircleSvg');
  const circumference = 2 * Math.PI * 52;
  const offset = circumference - (baseResults.overallScore / 100) * circumference;
  circleSvg.style.strokeDashoffset = offset;

  // Render Radar Chart & Pillars List
  renderRadarChart(baseResults.pillarResults);
  renderPillarsList(baseResults.pillarResults);

  // Superpowers & Blindspots from AI
  renderSuperpowersAndBlindspots(aiData.superpowers, aiData.blindspots);

  // 4-Week Action Protocol from AI
  renderWeeklyRoadmap(aiData.weeklyRoadmap);

  // Provocative Coaching Question
  document.getElementById('resCoachingQuestion').textContent = `"${aiData.coachingQuestion}"`;
}

function animateScoreCounter(element, target) {
  let current = 0;
  const duration = 1200;
  const steps = 30;
  const increment = target / steps;
  const stepTime = duration / steps;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target;
      clearInterval(timer);
    } else {
      element.textContent = Math.round(current);
    }
  }, stepTime);
}

function renderRadarChart(pillarResults) {
  const ctx = document.getElementById('radarChart').getContext('2d');
  const isLight = document.body.classList.contains('light-theme');

  const labels = [
    '💼 Career',
    '⚡ Health',
    '🧠 Mind',
    '💰 Finance',
    '❤️ Relationships',
    '🌱 Lifestyle'
  ];

  const data = [
    pillarResults.career.score,
    pillarResults.health.score,
    pillarResults.mental.score,
    pillarResults.finance.score,
    pillarResults.relationships.score,
    pillarResults.lifestyle.score
  ];

  if (state.chartInstance) {
    state.chartInstance.destroy();
  }

  const gridColor = isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.1)';
  const labelColor = isLight ? '#334155' : '#cbd5e1';

  state.chartInstance = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Balance Index (%)',
        data: data,
        fill: true,
        backgroundColor: 'rgba(99, 102, 241, 0.25)',
        borderColor: '#6366f1',
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#6366f1',
        pointHoverBackgroundColor: '#6366f1',
        pointHoverBorderColor: '#ffffff',
        borderWidth: 2.5,
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          min: 0,
          max: 100,
          ticks: {
            stepSize: 20,
            display: false
          },
          grid: { color: gridColor },
          angleLines: { color: gridColor },
          pointLabels: {
            color: labelColor,
            font: {
              family: "'Outfit', sans-serif",
              size: 13,
              weight: '600'
            }
          }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: isLight ? '#ffffff' : '#1e293b',
          titleColor: isLight ? '#0f172a' : '#f8fafc',
          bodyColor: isLight ? '#334155' : '#cbd5e1',
          borderColor: isLight ? '#e2e8f0' : 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          padding: 10,
          callbacks: {
            label: function(context) {
              return ` ${context.dataset.label}: ${context.raw}%`;
            }
          }
        }
      }
    }
  });
}

function renderPillarsList(pillarResults) {
  const container = document.getElementById('pillarsList');
  container.innerHTML = '';

  Object.values(pillarResults).forEach(p => {
    const row = document.createElement('div');
    row.className = 'pillar-row';
    row.innerHTML = `
      <div class="pillar-row-header">
        <div class="pillar-row-title">
          <span>${p.icon}</span>
          <span>${p.name}</span>
        </div>
        <div class="pillar-row-metrics">
          <span class="pillar-percentage">${p.score}%</span>
          <span class="pillar-status-tag ${p.statusClass}">${p.status}</span>
        </div>
      </div>
      <div class="pillar-bar-track">
        <div class="pillar-bar-fill" style="width: ${p.score}%; background-color: ${p.color};"></div>
      </div>
    `;
    container.appendChild(row);
  });
}

function renderSuperpowersAndBlindspots(superpowers, blindspots) {
  const superContainer = document.getElementById('superpowersContainer');
  superContainer.innerHTML = '';
  (superpowers || []).forEach(item => {
    const el = document.createElement('div');
    el.className = 'insight-item';
    el.innerHTML = `
      <div class="insight-item-title">
        <span>🌟 ${item.pillar}</span>
      </div>
      <div class="insight-item-desc" style="margin-bottom: 0.35rem; color: var(--text-primary); font-weight: 500;">
        ${item.strength}
      </div>
      <div class="insight-item-desc" style="color: var(--text-muted); font-size: 0.82rem;">
        <strong>Leverage:</strong> ${item.leverageAdvice}
      </div>
    `;
    superContainer.appendChild(el);
  });

  const blindContainer = document.getElementById('growthLeversContainer');
  blindContainer.innerHTML = '';
  (blindspots || []).forEach(item => {
    const el = document.createElement('div');
    el.className = 'insight-item';
    el.innerHTML = `
      <div class="insight-item-title">
        <span>⚠️ ${item.area}</span>
      </div>
      <div class="insight-item-desc" style="margin-bottom: 0.35rem; color: #f59e0b; font-weight: 500;">
        ${item.frictionPoint}
      </div>
      <div class="insight-item-desc" style="color: var(--text-muted); font-size: 0.82rem;">
        <strong>AI Solution:</strong> ${item.solution}
      </div>
    `;
    blindContainer.appendChild(el);
  });
}

function renderWeeklyRoadmap(weeklyRoadmap) {
  const container = document.getElementById('actionItemsList');
  container.innerHTML = '';

  (weeklyRoadmap || []).forEach(step => {
    const el = document.createElement('div');
    el.className = 'action-item';
    el.innerHTML = `
      <div class="action-step-num">${step.week}</div>
      <div class="action-body">
        <h5>Focus: ${step.focus}</h5>
        <div class="action-tip-box">
          <strong>Key Micro-Habit:</strong> ${step.microHabit}
        </div>
        <span class="action-outcome-tag">✓ Target Outcome: ${step.expectedOutcome}</span>
      </div>
    `;
    container.appendChild(el);
  });
}

// Interactive Live Coach Chat
async function handleCoachChatSubmit(e) {
  e.preventDefault();
  const msg = chatInput.value.trim();
  if (!msg) return;

  chatInput.value = '';
  chatSendBtn.disabled = true;

  // Append user bubble
  appendChatBubble('user', msg);

  // Append thinking bubble
  const thinkingBubble = appendChatBubble('coach', 'Thinking...');

  try {
    const assessmentContext = {
      overallScore: state.currentResults.overallScore,
      archetypeTitle: state.aiAssessment?.archetypeTitle || state.currentResults.archetype.title,
      pillarScores: Object.fromEntries(Object.entries(state.currentResults.pillarResults).map(([k, v]) => [k, v.score])),
      blindspots: state.aiAssessment?.blindspots || [],
      notes: state.userNotes
    };

    const res = await fetch('/api/ai-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: msg,
        assessmentContext: assessmentContext,
        history: state.chatHistory
      })
    });

    const data = await res.json();
    if (data.reply) {
      thinkingBubble.querySelector('.bubble-text').textContent = data.reply;
      state.chatHistory.push({ role: 'user', text: msg });
      state.chatHistory.push({ role: 'model', text: data.reply });
    } else {
      thinkingBubble.querySelector('.bubble-text').textContent = "I'm sorry, I couldn't process that question right now. Please try again.";
    }
  } catch (err) {
    console.error(err);
    thinkingBubble.querySelector('.bubble-text').textContent = "Connection issue communicating with AI Coach.";
  } finally {
    chatSendBtn.disabled = false;
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
}

function appendChatBubble(role, text) {
  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${role}`;
  bubble.innerHTML = `
    <div class="bubble-sender">${role === 'user' ? 'You' : 'AI Coach'}</div>
    <div class="bubble-text">${text}</div>
  `;
  chatMessages.appendChild(bubble);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return bubble;
}

function triggerConfetti() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 }
    });
  }
}

function resetAndRestart() {
  state.currentIndex = 0;
  state.answers = {};
  state.chatHistory = [];
  switchScreen(welcomeScreen);
}

// LocalStorage History
function saveAssessmentToHistory(baseResults, aiData) {
  try {
    const history = JSON.parse(localStorage.getItem('lifesync_history') || '[]');
    const record = {
      date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      overallScore: baseResults.overallScore,
      archetype: aiData?.archetypeTitle || baseResults.archetype.title,
      pillarScores: Object.fromEntries(Object.entries(baseResults.pillarResults).map(([k, v]) => [k, v.score]))
    };
    history.unshift(record);
    localStorage.setItem('lifesync_history', JSON.stringify(history.slice(0, 10)));
  } catch (e) {
    console.error('Could not save to history', e);
  }
}

function openHistoryModal() {
  try {
    const history = JSON.parse(localStorage.getItem('lifesync_history') || '[]');
    if (history.length === 0) {
      historyModalBody.innerHTML = '<p class="empty-state">No past assessments saved yet. Complete your first assessment to track your progress over time!</p>';
    } else {
      historyModalBody.innerHTML = '';
      history.forEach(item => {
        const div = document.createElement('div');
        div.className = 'history-entry';
        div.innerHTML = `
          <div>
            <strong>${item.archetype}</strong>
            <div class="history-date">${item.date}</div>
          </div>
          <div style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 800; color: var(--accent-primary);">
            ${item.overallScore} / 100
          </div>
        `;
        historyModalBody.appendChild(div);
      });
    }
    historyModal.classList.add('open');
  } catch (e) {
    console.error(e);
  }
}

function clearHistory() {
  localStorage.removeItem('lifesync_history');
  historyModalBody.innerHTML = '<p class="empty-state">History cleared.</p>';
}
