import { CATEGORIES } from './questions.js';

export function calculateAssessment(answers, questions) {
  // answers is an object: { [questionId]: number (1-5) }
  const categoryScores = {
    career: { total: 0, max: 0, count: 0 },
    health: { total: 0, max: 0, count: 0 },
    mental: { total: 0, max: 0, count: 0 },
    finance: { total: 0, max: 0, count: 0 },
    relationships: { total: 0, max: 0, count: 0 },
    lifestyle: { total: 0, max: 0, count: 0 }
  };

  const lowScoringQuestions = [];

  questions.forEach(q => {
    const val = answers[q.id] || 3;
    if (categoryScores[q.category]) {
      categoryScores[q.category].total += val;
      categoryScores[q.category].max += 5;
      categoryScores[q.category].count += 1;
    }

    if (val <= 3) {
      lowScoringQuestions.push({
        ...q,
        score: val
      });
    }
  });

  // Calculate percentages per category
  const pillarResults = {};
  let overallSum = 0;
  let overallMax = 0;

  for (const catKey in categoryScores) {
    const data = categoryScores[catKey];
    const percentage = Math.round((data.total / data.max) * 100);
    overallSum += data.total;
    overallMax += data.max;

    let status = 'Balanced';
    let statusClass = 'status-balanced';
    if (percentage >= 80) {
      status = 'Thriving';
      statusClass = 'status-thriving';
    } else if (percentage >= 60) {
      status = 'Stable';
      statusClass = 'status-stable';
    } else if (percentage >= 40) {
      status = 'Attention Needed';
      statusClass = 'status-attention';
    } else {
      status = 'Critical Friction';
      statusClass = 'status-critical';
    }

    pillarResults[catKey] = {
      ...CATEGORIES[catKey],
      score: percentage,
      rawTotal: data.total,
      rawMax: data.max,
      status,
      statusClass
    };
  }

  const overallScore = Math.round((overallSum / overallMax) * 100);

  // Determine Archetype
  const archetype = determineArchetype(pillarResults, overallScore);

  // Sort categories by score to find Superpowers and Growth Levers
  const sortedPillars = Object.values(pillarResults).sort((a, b) => b.score - a.score);
  const superpowers = sortedPillars.slice(0, 2);
  const growthLevers = sortedPillars.slice(-2).reverse();

  // Sort low-scoring questions for targeted 30-day action plan
  lowScoringQuestions.sort((a, b) => a.score - b.score);
  const priorityActionItems = lowScoringQuestions.slice(0, 4);

  return {
    overallScore,
    archetype,
    pillarResults,
    superpowers,
    growthLevers,
    priorityActionItems,
    timestamp: new Date().toISOString()
  };
}

function determineArchetype(pillars, overallScore) {
  const c = pillars.career.score;
  const h = pillars.health.score;
  const m = pillars.mental.score;
  const f = pillars.finance.score;
  const r = pillars.relationships.score;
  const l = pillars.lifestyle.score;

  if (overallScore >= 82) {
    return {
      title: "The Harmonious Dynamo",
      tagline: "High impact across both career and personal vitality",
      description: "You have mastered the rare art of multi-dimensional balance. You drive forward with professional excellence while actively maintaining your physiological health, relational bonds, and inner peace. Your challenge now is to protect this equilibrium and mentor others.",
      color: "#10b981",
      badge: "🌟 Exemplary Equilibrium"
    };
  }

  if (c >= 70 && f >= 65 && (h <= 55 || m <= 55)) {
    return {
      title: "The High-Powered Striver",
      tagline: "High achievement fueled by biological debt",
      description: "You exhibit immense dedication, career grit, and financial focus. However, your nervous system, sleep, and physical vitality are footing the bill. If left unaddressed, this imbalance creates diminishing returns and burnout risk. Prioritize physical recovery as a strategic performance multiplier.",
      color: "#f59e0b",
      badge: "⚡ High Ambition / Energy Leak"
    };
  }

  if (m >= 70 && l >= 70 && (c <= 55 || f <= 55)) {
    return {
      title: "The Mindful Explorer",
      tagline: "Rich inner life and personal joy, untapped practical leverage",
      description: "You have done wonderful work cultivating peace of mind, self-reflection, and genuine enjoyment in daily life. Translating your clarity into structured career milestones and financial compounding will grant you even greater autonomy and freedom.",
      color: "#06b6d4",
      badge: "🌱 Mindful / Growth Potential"
    };
  }

  if (r >= 70 && c >= 65 && (m <= 50 || h <= 50)) {
    return {
      title: "The Overextended Pillar",
      tagline: "Deeply loyal and hardworking, but running on fumes",
      description: "You are the reliable anchor for your colleagues, family, and friends. You consistently show up for everyone else, frequently sacrificing your own sleep, quiet hours, and personal boundaries. It is time to treat your own recovery with the same loyalty.",
      color: "#ec4899",
      badge: "❤️ High Compassion / Needs Boundaries"
    };
  }

  if (h >= 70 && m >= 65 && r >= 65 && c <= 55) {
    return {
      title: "The Grounded Haven",
      tagline: "Strong personal wellness and connection, ready for career acceleration",
      description: "Your health, mental baseline, and social relationships provide an exceptional safety net. You have the stability required to take calculated career risks, tackle bolder ambitions, or build new revenue streams.",
      color: "#8b5cf6",
      badge: "🛡️ Solid Foundation"
    };
  }

  // Default balanced/builder
  return {
    title: "The Adaptive Builder",
    tagline: "Solid core foundation with clear strategic levers to unlock",
    description: "You possess a balanced baseline across life's key pillars without extreme collapses. By picking 1 or 2 specific 'keystone habits' in your lowest-scoring areas, you will generate positive spillover that elevates all other dimensions simultaneously.",
    color: "#6366f1",
    badge: "🚀 Momentum in Motion"
  };
}
