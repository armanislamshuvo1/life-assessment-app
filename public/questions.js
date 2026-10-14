// Comprehensive 24-Question Holistic Life & Career Assessment dataset
export const CATEGORIES = {
  career: {
    id: "career",
    name: "Career & Ambition",
    icon: "💼",
    color: "#6366f1",
    description: "Professional satisfaction, career progression, purpose in work, and long-term direction."
  },
  health: {
    id: "health",
    name: "Health & Vitality",
    icon: "⚡",
    color: "#10b981",
    description: "Physical stamina, consistent sleep, nourishing diet, exercise, and physical body wellness."
  },
  mental: {
    id: "mental",
    name: "Mind & Emotional State",
    icon: "🧠",
    color: "#8b5cf6",
    description: "Stress resilience, inner peace, emotional regulation, clarity, and boundaries."
  },
  finance: {
    id: "finance",
    name: "Finance & Wealth",
    icon: "💰",
    color: "#f59e0b",
    description: "Financial stability, savings discipline, budgeting comfort, and confidence in the future."
  },
  relationships: {
    id: "relationships",
    name: "Relationships & Community",
    icon: "❤️",
    color: "#ec4899",
    description: "Quality of friendships, intimate partnerships, family connection, and mutual support."
  },
  lifestyle: {
    id: "lifestyle",
    name: "Lifestyle, Growth & Joy",
    icon: "🌱",
    color: "#06b6d4",
    description: "Hobbies, learning new things, personal space/environment, play, and everyday life satisfaction."
  }
};

export const QUESTIONS = [
  // 1. CAREER & AMBITION
  {
    id: "c1",
    category: "career",
    question: "I have a clear sense of direction and meaningful goals for my professional life.",
    context: "Reflect on whether your daily work aligns with where you want to be in the next 1-3 years.",
    actionTip: "Set aside a 60-minute quarterly career vision session to define 2 concrete milestones for the next 6 months."
  },
  {
    id: "c2",
    category: "career",
    question: "I feel intellectually challenged, engaged, and able to utilize my core skills.",
    context: "Consider whether your tasks spark flow or if you feel consistently stagnant and underutilized.",
    actionTip: "Identify one stretch project or skill gap at work and propose taking ownership of a new initiative."
  },
  {
    id: "c3",
    category: "career",
    question: "My work environment provides fair recognition, healthy culture, and growth opportunities.",
    context: "Think about your teammates, leadership, psychological safety, and growth paths.",
    actionTip: "Schedule regular 1-on-1 alignment talks with your manager or explore mentorship in your field."
  },
  {
    id: "c4",
    category: "career",
    question: "I feel confident in my ability to adapt to industry changes and future-proof my career.",
    context: "Consider how proactively you learn new tools, technologies, and market developments.",
    actionTip: "Dedicate 2 hours each weekend or Friday afternoon purely for hands-on upskilling."
  },

  // 2. HEALTH & VITALITY
  {
    id: "h1",
    category: "health",
    question: "I consistently get 7-8 hours of restorative sleep and wake up refreshed.",
    context: "Assess your bedtime regularity, screen habits before sleep, and morning energy levels.",
    actionTip: "Establish a fixed sleep routine: no screens 45 minutes before bed and keep bedroom temperature cool."
  },
  {
    id: "h2",
    category: "health",
    question: "I engage in intentional physical exercise or brisk movement at least 3 to 4 times a week.",
    context: "This includes strength training, cardio, brisk walks, sports, or active mobility.",
    actionTip: "Start with non-negotiable 25-minute workouts 3 days a week, scheduled on your calendar like meetings."
  },
  {
    id: "h3",
    category: "health",
    question: "My daily nutrition and hydration sustain steady energy without heavy afternoon crashes.",
    context: "Evaluate your water intake, whole food choices, and reliance on excessive sugar/caffeine.",
    actionTip: "Prioritize 25-30g of protein at breakfast and keep a 1-liter water bottle beside your workstation."
  },
  {
    id: "h4",
    category: "health",
    question: "I listen to my body's warning signals (fatigue, aches, eye strain) and take proactive breaks.",
    context: "Do you push through exhaustion until breakdown, or practice active recovery?",
    actionTip: "Use the 50/10 work rhythm: 50 minutes focused work followed by 10 minutes standing, stretching, or walking."
  },

  // 3. MIND & EMOTIONAL STATE
  {
    id: "m1",
    category: "mental",
    question: "I manage stress and pressure without feeling chronic anxiety or emotional burnout.",
    context: "Think about how you respond when deadlines loom or unexpected crises arise.",
    actionTip: "Practice physiological sigh breathing (two quick inhales through the nose, one long slow exhale) during stressful moments."
  },
  {
    id: "m2",
    category: "mental",
    question: "I am able to establish healthy mental boundaries and disconnect from work after hours.",
    context: "Can you stop checking messages, ruminating about tasks, and be present during your off time?",
    actionTip: "Implement a hard 'digital shutdown' at a designated time each evening, silencing work notifications."
  },
  {
    id: "m3",
    category: "mental",
    question: "I maintain an optimistic, solution-oriented mindset when confronting setbacks.",
    context: "Reflect on your inner dialogue: is it constructive and resilient, or excessively self-critical?",
    actionTip: "Reframe challenges by asking: 'What is the one constructive action I can take in the next 15 minutes?'"
  },
  {
    id: "m4",
    category: "mental",
    question: "I regularly experience calm, presence, and moments of genuine stillness.",
    context: "Whether through meditation, walks without headphones, or quiet reflection.",
    actionTip: "Dedicate 5-10 minutes each morning to screen-free contemplation, journaling, or quiet breathing."
  },

  // 4. FINANCE & WEALTH
  {
    id: "f1",
    category: "finance",
    question: "I have a clear view of my monthly cashflow (income, necessary expenses, discretionary spending).",
    context: "Do you know where your money goes every month without guesswork or avoidance?",
    actionTip: "Set up a clean 50/30/20 budget or spend 20 minutes monthly auditing your recurring subscriptions."
  },
  {
    id: "f2",
    category: "finance",
    question: "I have an emergency fund covering at least 3 to 6 months of essential living costs.",
    context: "Could an unexpected expense (car repair, medical, career transition) be absorbed without panic?",
    actionTip: "Automate a modest transfer into a dedicated high-yield emergency savings account right on payday."
  },
  {
    id: "f3",
    category: "finance",
    question: "I am actively building investments and long-term financial security (retirement, assets).",
    context: "Think about your compounding vehicles: index funds, retirement accounts, or revenue-producing assets.",
    actionTip: "Automate monthly recurring investments in diversified index funds, even in small consistent sums."
  },
  {
    id: "f4",
    category: "finance",
    question: "I feel in control of debt and experience little to no financial anxiety in daily life.",
    context: "Does thinking about money bring a sense of security and freedom, or knot your stomach?",
    actionTip: "If carrying high-interest debt, apply the Avalanche (highest interest first) or Snowball method immediately."
  },

  // 5. RELATIONSHIPS & COMMUNITY
  {
    id: "r1",
    category: "relationships",
    question: "I have at least 2 or 3 deep, trusted confidants who I can call in any crisis without hesitation.",
    context: "True vulnerability and deep connection vs superficial surface acquaintances.",
    actionTip: "Reach out to one close friend this week for an uninterrupted catch-up or honest conversation."
  },
  {
    id: "r2",
    category: "relationships",
    question: "I invest quality, attentive time into my close family and/or romantic partnership.",
    context: "Are you fully attentive, phone-free, and engaged when spending time with loved ones?",
    actionTip: "Institute weekly device-free meals or a sacred recurring date night/family check-in."
  },
  {
    id: "r3",
    category: "relationships",
    question: "I communicate openly, resolve conflicts constructively, and express appreciation freely.",
    context: "Do you harbor resentment or avoid difficult conversations, or resolve tensions with empathy?",
    actionTip: "Practice the 5:1 positivity ratio: express 5 sincere affirmations or appreciations for every critique."
  },
  {
    id: "r4",
    category: "relationships",
    question: "I have a supportive social circle or community that uplifts and energizes me.",
    context: "Do the people around you inspire you to grow, or drain your emotional energy?",
    actionTip: "Prune one-sided energy-draining relationships and join a club, meetup, or interest group that inspires you."
  },

  // 6. LIFESTYLE, GROWTH & JOY
  {
    id: "l1",
    category: "lifestyle",
    question: "I actively pursue hobbies, creative projects, or activities purely for the fun of it.",
    context: "Things you do without monetizing or proving yourself, purely for the joy of creation or play.",
    actionTip: "Block out 2 hours of uncompromised 'creative play' or hobby time on your weekly calendar."
  },
  {
    id: "l2",
    category: "lifestyle",
    question: "I am a continuous learner, regularly reading books, acquiring skills, or exploring new ideas.",
    context: "When was the last time you explored a new domain, read an insightful book, or took a course?",
    actionTip: "Commit to 15 pages of non-fiction reading or 20 minutes of educational audio/podcasts daily."
  },
  {
    id: "l3",
    category: "lifestyle",
    question: "My living and work spaces are organized, inspiring, and promote peace of mind.",
    context: "Does your environment bring calm focus, or is it cluttered and chaotic?",
    actionTip: "Do a ruthless 20-minute declutter of your desk and bedroom to restore mental clarity."
  },
  {
    id: "l4",
    category: "lifestyle",
    question: "Looking at my overall life, I feel a deep sense of alignment, gratitude, and purpose.",
    context: "Do you feel you are actively living your own authentic life rather than reacting on autopilot?",
    actionTip: "Write down 3 specific things you are grateful for each evening to rewire focus toward positive agency."
  }
];

export const SCALE_OPTIONS = [
  { value: 1, label: "Strongly Disagree", detail: "Critical area of friction / rarely true" },
  { value: 2, label: "Disagree", detail: "Inconsistent or below my expectations" },
  { value: 3, label: "Neutral / Moderate", detail: "Acceptable but significant room to grow" },
  { value: 4, label: "Agree", detail: "Consistent, positive, and mostly steady" },
  { value: 5, label: "Strongly Agree", detail: "Thriving mastery / fully aligned" }
];
