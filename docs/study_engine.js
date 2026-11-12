/**
 * Study Engine — Spaced Repetition (SM-2 Sprint), Progress Analytics,
 * Gamification (XP, Levels, Streaks, Achievements) & Shareable Leaderboard Codes.
 * Pure UMD module (Zero-Build Browser + Node testable).
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.StudyEngine = factory();
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const HOUR_MS = 3600 * 1000;
  const DAY_MS = 24 * HOUR_MS;

  const LEVELS = [
    { level: 1, minXp: 0, title: "Perceptrón Inicial", icon: "🌱" },
    { level: 2, minXp: 150, title: "Explorador A*", icon: "🧭" },
    { level: 3, minXp: 350, title: "Clasificador Bayesiano", icon: "📊" },
    { level: 4, minXp: 650, title: "Vecino Cercano (k-NN)", icon: "📍" },
    { level: 5, minXp: 1050, title: "Memoria de Hopfield", icon: "🧲" },
    { level: 6, minXp: 1550, title: "Mapa de Kohonen (SOM)", icon: "🗺️" },
    { level: 7, minXp: 2200, title: "Red Backpropagation (MLP)", icon: "🧠" },
    { level: 8, minXp: 3000, title: "Promoción Directa UTN", icon: "🏆" }
  ];

  const ACHIEVEMENTS = [
    {
      id: "first_exam",
      icon: "🎯",
      title: "Primer Simulacro",
      desc: "Completar al menos 1 simulacro de examen.",
      check: (ctx) => ctx.gamif.totalExams >= 1,
      progress: (ctx) => [Math.min(1, ctx.gamif.totalExams), 1]
    },
    {
      id: "promo_score",
      icon: "🏆",
      title: "Umbral Promoción (80%+)",
      desc: "Alcanzar 80% o más en un simulacro completo o de cátedra.",
      check: (ctx) => ctx.gamif.bestExamScore >= 80,
      progress: (ctx) => [Math.min(80, ctx.gamif.bestExamScore), 80]
    },
    {
      id: "moodle_2025_master",
      icon: "⭐",
      title: "Moodle 2025 Superado",
      desc: "Lograr 80%+ en el Parcial Moodle 2025 (28 preguntas).",
      check: (ctx) => ctx.gamif.best2025Score >= 80,
      progress: (ctx) => [Math.min(80, ctx.gamif.best2025Score), 80]
    },
    {
      id: "anki_20",
      icon: "🧠",
      title: "Memoria Espaciada",
      desc: "Evaluar al menos 20 tarjetas con repetición espaciada.",
      check: (ctx) => ctx.gamif.totalReviews >= 20,
      progress: (ctx) => [Math.min(20, ctx.gamif.totalReviews), 20]
    },
    {
      id: "rebel_hunter",
      icon: "⚔️",
      title: "Cazador de Rebeldes",
      desc: "Recuperar 5 preguntas en las que habías fallado antes.",
      check: (ctx) => ctx.gamif.recoveredCount >= 5,
      progress: (ctx) => [Math.min(5, ctx.gamif.recoveredCount), 5]
    },
    {
      id: "combo_5",
      icon: "⚡",
      title: "Precisión x5",
      desc: "Encadenar 5 respuestas con 80%+ seguidas en repaso teórico.",
      check: (ctx) => ctx.gamif.bestPracticeCombo >= 5,
      progress: (ctx) => [Math.min(5, ctx.gamif.bestPracticeCombo), 5]
    },
    {
      id: "streak_3",
      icon: "🔥",
      title: "Constancia Pre-Parcial",
      desc: "Mantener una racha de estudio de 3 días seguidos.",
      check: (ctx) => ctx.gamif.bestStreakDays >= 3,
      progress: (ctx) => [Math.min(3, ctx.gamif.bestStreakDays), 3]
    },
    {
      id: "p2_half_mastered",
      icon: "🎓",
      title: "Mitad del Banco Dominada",
      desc: "Dominar al menos 50% de las preguntas activas del 2do Parcial.",
      check: (ctx) => ctx.summary.p2.masteredPct >= 50,
      progress: (ctx) => [Math.min(50, ctx.summary.p2.masteredPct), 50]
    },
    {
      id: "lab_all_topics",
      icon: "🛠️",
      title: "Práctica en los 7 Temas",
      desc: "Completar pasos o flashcards en los 7 temas de Práctica Guiada.",
      check: (ctx) => ctx.summary.lab.topicsTouched >= ctx.summary.lab.topicsTotal && ctx.summary.lab.topicsTotal > 0,
      progress: (ctx) => [ctx.summary.lab.topicsTouched, Math.max(1, ctx.summary.lab.topicsTotal)]
    },
    {
      id: "source_auditor",
      icon: "📚",
      title: "Auditor de Cátedra",
      desc: "Consultar al menos 3 fuentes originales o guías en el repo.",
      check: (ctx) => ctx.gamif.sourceClicks >= 3,
      progress: (ctx) => [Math.min(3, ctx.gamif.sourceClicks), 3]
    }
  ];

  function round2(n) {
    return Math.round(n * 100) / 100;
  }

  function getLocalDateKey(input) {
    const d = input instanceof Date ? input : new Date(input || Date.now());
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  function diffLocalDays(keyA, keyB) {
    if (!keyA || !keyB) return 9999;
    const [y1, m1, d1] = keyA.split("-").map(Number);
    const [y2, m2, d2] = keyB.split("-").map(Number);
    if (!y1 || !y2) return 9999;
    const utcA = Date.UTC(y1, m1 - 1, d1);
    const utcB = Date.UTC(y2, m2 - 1, d2);
    return Math.round((utcB - utcA) / DAY_MS);
  }

  function createEmptyCard() {
    return {
      reps: 0,
      lapses: 0,
      ease: 2.5,
      intervalHours: 0,
      dueAt: 0,
      lastReviewedAt: 0,
      lastScore: null,
      lastRating: null,
      status: "new"
    };
  }

  function cloneCard(card) {
    return card ? Object.assign(createEmptyCard(), card) : createEmptyCard();
  }

  function isCardMastered(card) {
    if (!card) return false;
    const scoreOk = card.lastScore === null || card.lastScore === undefined || card.lastScore >= 80;
    return card.status === "mastered" || (card.reps >= 2 && card.intervalHours >= 48 && card.ease >= 2.1 && scoreOk);
  }

  function ratingFromMoodleScore(score) {
    if (score >= 100) return 4; // Fácil
    if (score >= 80) return 3;  // Bien
    if (score >= 60) return 2;  // Difícil
    return 1;                   // Otra vez
  }

  function computeNextSrsState(prevCard, rating, moodleScore, nowMs) {
    const prev = cloneCard(prevCard);
    const now = typeof nowMs === "number" ? nowMs : Date.now();
    const r = Math.min(4, Math.max(1, Number(rating) || 1));
    const scoreVal = typeof moodleScore === "number" ? moodleScore : prev.lastScore;

    let reps = prev.reps;
    let lapses = prev.lapses;
    let ease = prev.ease || 2.5;
    let intervalHours = prev.intervalHours || 0;
    let dueAt = now;
    let status = "learning";

    if (r === 1) {
      // Otra vez: reset repetitions & re-queue quickly
      reps = 0;
      lapses += 1;
      ease = Math.max(1.3, round2(ease - 0.2));
      intervalHours = 0;
      dueAt = now + 10 * 60 * 1000; // 10 min fallback if session closes
      status = prev.reps > 0 || prev.lapses > 0 ? "relearning" : "learning";
    } else if (r === 2) {
      // Difícil: tight pre-exam sprint step
      reps = Math.max(1, reps);
      ease = Math.max(1.3, round2(ease - 0.15));
      if (intervalHours <= 0) {
        intervalHours = 6;
      } else if (intervalHours < 24) {
        intervalHours = 12;
      } else {
        intervalHours = Math.min(120, Math.round(intervalHours * 1.25));
      }
      dueAt = now + intervalHours * HOUR_MS;
      status = "learning";
    } else if (r === 3) {
      // Bien: progressive 1d -> 2d -> scaled days (capped at 7d)
      reps += 1;
      ease = Math.max(1.3, round2(ease));
      if (reps === 1) {
        intervalHours = 24;
      } else if (reps === 2) {
        intervalHours = 48;
      } else {
        intervalHours = Math.min(168, Math.round(Math.max(24, intervalHours) * ease));
      }
      dueAt = now + intervalHours * HOUR_MS;
      const scoreOk = scoreVal === null || scoreVal === undefined || scoreVal >= 80;
      status = reps >= 2 && intervalHours >= 48 && ease >= 2.1 && scoreOk ? "mastered" : "learning";
    } else {
      // Fácil: fast-track mastery (2d -> scaled up to 10d)
      reps += 1;
      ease = Math.min(3.0, round2(ease + 0.15));
      if (reps === 1) {
        intervalHours = 48;
      } else {
        intervalHours = Math.min(240, Math.round(Math.max(48, intervalHours) * ease * 1.15));
      }
      dueAt = now + intervalHours * HOUR_MS;
      const scoreOk = scoreVal === null || scoreVal === undefined || scoreVal >= 80;
      status = (reps >= 2 || ease >= 2.6) && scoreOk ? "mastered" : "learning";
    }

    return {
      reps,
      lapses,
      ease,
      intervalHours,
      dueAt,
      lastReviewedAt: now,
      lastScore: scoreVal !== undefined ? scoreVal : null,
      lastRating: r,
      status
    };
  }

  function formatIntervalLabel(intervalHours, rating) {
    if (rating === 1 || intervalHours <= 0) return "< 10 min";
    if (intervalHours < 24) return `${Math.round(intervalHours)} h`;
    const days = Math.round((intervalHours / 24) * 10) / 10;
    return `${days} ${days === 1 ? "día" : "días"}`;
  }

  function previewIntervals(prevCard, moodleScore, nowMs) {
    return [1, 2, 3, 4].reduce((acc, r) => {
      const next = computeNextSrsState(prevCard, r, moodleScore, nowMs);
      acc[r] = formatIntervalLabel(next.intervalHours, r);
      return acc;
    }, {});
  }

  function getScopedQuestions(allQuestions, options) {
    const opts = options || {};
    const includeP1 = Boolean(opts.includeP1);
    const includeSVM = Boolean(opts.includeSVM);
    return (allQuestions || []).filter((q) => {
      if (!includeP1 && q.es_p1) return false;
      if (!includeSVM && q.tema === "SVM") return false;
      return true;
    });
  }

  function interleaveByTopic(questions) {
    const buckets = new Map();
    questions.forEach((q) => {
      const key = q.tema || "OTHER";
      if (!buckets.has(key)) buckets.set(key, []);
      buckets.get(key).push(q);
    });
    const keys = Array.from(buckets.keys());
    const result = [];
    let added = true;
    while (added) {
      added = false;
      for (const k of keys) {
        const arr = buckets.get(k);
        if (arr && arr.length > 0) {
          result.push(arr.shift());
          added = true;
        }
      }
    }
    return result;
  }

  function buildSmartSrsQueue(pool, srsMap, nowMs, options) {
    const now = typeof nowMs === "number" ? nowMs : Date.now();
    const map = srsMap || {};
    const includeNotDueFallback = Boolean(options && options.includeNotDueFallback);

    const overdueRelearning = [];
    const dueLearning = [];
    const dueMastered = [];
    const unseen = [];
    const upcomingLearning = [];
    const masteredFresh = [];

    (pool || []).forEach((q) => {
      const card = map[q.id];
      if (!card || card.status === "new" || !card.lastReviewedAt) {
        unseen.push(q);
        return;
      }
      const isDue = !card.dueAt || card.dueAt <= now;
      if (isDue) {
        if (card.status === "relearning" || card.lapses > 0) {
          overdueRelearning.push({ q, card });
        } else if (isCardMastered(card)) {
          dueMastered.push({ q, card });
        } else {
          dueLearning.push({ q, card });
        }
      } else if (isCardMastered(card)) {
        masteredFresh.push({ q, card });
      } else {
        upcomingLearning.push({ q, card });
      }
    });

    // Rebeldes & most overdue first
    overdueRelearning.sort((a, b) => {
      if (b.card.lapses !== a.card.lapses) return b.card.lapses - a.card.lapses;
      return (a.card.dueAt || 0) - (b.card.dueAt || 0);
    });
    dueLearning.sort((a, b) => (a.card.dueAt || 0) - (b.card.dueAt || 0));
    dueMastered.sort((a, b) => (a.card.dueAt || 0) - (b.card.dueAt || 0));
    upcomingLearning.sort((a, b) => (a.card.dueAt || 0) - (b.card.dueAt || 0));

    const mixedUnseen = interleaveByTopic(unseen);
    const dueList = [
      ...overdueRelearning.map((x) => x.q),
      ...dueLearning.map((x) => x.q),
      ...dueMastered.map((x) => x.q)
    ];

    const queue = [...dueList, ...mixedUnseen];
    if (queue.length === 0 && includeNotDueFallback) {
      queue.push(...upcomingLearning.map((x) => x.q), ...masteredFresh.map((x) => x.q));
    }

    return {
      queue,
      dueCount: dueList.length,
      newCount: unseen.length,
      learningCount: dueLearning.length + upcomingLearning.length + overdueRelearning.length,
      masteredCount: masteredFresh.length + dueMastered.length,
      rebeldesCount: (pool || []).filter((q) => (map[q.id]?.lapses || 0) > 0 && !isCardMastered(map[q.id])).length,
      upcomingCount: upcomingLearning.length + masteredFresh.length
    };
  }

  function createDefaultGamification() {
    return {
      alias: "Estudiante UTN",
      dailyGoal: 15,
      xp: 0,
      currentStreakDays: 0,
      bestStreakDays: 0,
      lastStudyDate: null,
      dailyActions: {},
      practiceCombo: 0,
      bestPracticeCombo: 0,
      recoveredCount: 0,
      totalReviews: 0,
      totalExams: 0,
      bestExamScore: 0,
      best2025Score: 0,
      sourceClicks: 0,
      unlockedAchievements: {},
      xpAwardedToday: {}
    };
  }

  function normalizeGamification(raw) {
    const base = createEmptySafe(createDefaultGamification(), raw);
    if (!base.dailyActions || typeof base.dailyActions !== "object") base.dailyActions = {};
    if (!base.unlockedAchievements || typeof base.unlockedAchievements !== "object") base.unlockedAchievements = {};
    if (!base.xpAwardedToday || typeof base.xpAwardedToday !== "object") base.xpAwardedToday = {};
    base.alias = String(base.alias || "Estudiante UTN").trim().slice(0, 28) || "Estudiante UTN";
    base.dailyGoal = [10, 15, 20, 30].includes(Number(base.dailyGoal)) ? Number(base.dailyGoal) : 15;
    return base;
  }

  function createEmptySafe(defaults, raw) {
    if (!raw || typeof raw !== "object") return Object.assign({}, defaults);
    return Object.assign({}, defaults, raw);
  }

  function getLevelInfo(xp) {
    const val = Math.max(0, Number(xp) || 0);
    let current = LEVELS[0];
    let next = LEVELS[1] || null;
    for (let i = 0; i < LEVELS.length; i++) {
      if (val >= LEVELS[i].minXp) {
        current = LEVELS[i];
        next = LEVELS[i + 1] || null;
      }
    }
    const progressPct = next
      ? Math.min(100, Math.max(0, Math.round(((val - current.minXp) / (next.minXp - current.minXp)) * 100)))
      : 100;
    return {
      level: current.level,
      title: current.title,
      icon: current.icon,
      xp: val,
      currentMinXp: current.minXp,
      nextLevel: next,
      xpToNext: next ? Math.max(0, next.minXp - val) : 0,
      progressPct
    };
  }

  function getEffectiveStreak(gamif, nowMs) {
    if (!gamif || !gamif.lastStudyDate) return 0;
    const today = getLocalDateKey(nowMs || Date.now());
    const diff = diffLocalDays(gamif.lastStudyDate, today);
    if (diff === 0 || diff === 1) return gamif.currentStreakDays || 0;
    return 0;
  }

  function pruneDailyMaps(gamif, todayKey) {
    // Keep only recent 14 days to avoid unbounded localStorage growth
    Object.keys(gamif.dailyActions).forEach((k) => {
      if (diffLocalDays(k, todayKey) > 14) delete gamif.dailyActions[k];
    });
    Object.keys(gamif.xpAwardedToday).forEach((k) => {
      if (!k.startsWith(`${todayKey}:`)) delete gamif.xpAwardedToday[k];
    });
  }

  function applyStudyTouch(gamif, nowMs, actionsCount) {
    const today = getLocalDateKey(nowMs || Date.now());
    let dailyBonusXp = 0;
    const prevDate = gamif.lastStudyDate;

    if (!prevDate) {
      gamif.currentStreakDays = 1;
    } else if (prevDate !== today) {
      const gap = diffLocalDays(prevDate, today);
      gamif.currentStreakDays = gap === 1 ? (gamif.currentStreakDays || 0) + 1 : 1;
    }
    if (gamif.currentStreakDays > (gamif.bestStreakDays || 0)) {
      gamif.bestStreakDays = gamif.currentStreakDays;
    }

    const prevTodayCount = gamif.dailyActions[today] || 0;
    if (prevTodayCount === 0 && (actionsCount || 0) > 0) {
      dailyBonusXp = 25;
    }
    gamif.dailyActions[today] = prevTodayCount + (actionsCount || 0);
    gamif.lastStudyDate = today;
    pruneDailyMaps(gamif, today);
    return { today, dailyBonusXp };
  }

  function computeProgressSummary(allQuestions, srsMap, labData, labCompletedSteps, options) {
    const opts = options || {};
    const p2Questions = getScopedQuestions(allQuestions, { includeP1: Boolean(opts.includeP1), includeSVM: Boolean(opts.includeSVM) });
    const map = srsMap || {};
    const now = typeof opts.nowMs === "number" ? opts.nowMs : Date.now();

    let mastered = 0;
    let learning = 0;
    let newCount = 0;
    let dueNow = 0;
    let rebeldes = 0;
    const byTopic = {};

    (allQuestions || []).forEach((q) => {
      const t = q.tema || "GENERAL_IA";
      if (!byTopic[t]) {
        byTopic[t] = {
          tema: t,
          total: 0,
          mastered: 0,
          learning: 0,
          newCount: 0,
          dueNow: 0,
          rebeldes: 0,
          masteredPct: 0,
          seenPct: 0,
          avgScore: null,
          _scoreSum: 0,
          _scoreCnt: 0
        };
      }
      const bucket = byTopic[t];
      bucket.total += 1;

      const card = map[q.id];
      const isNew = !card || card.status === "new" || !card.lastReviewedAt;
      const isMast = !isNew && isCardMastered(card);
      const isDue = isNew || !card.dueAt || card.dueAt <= now;
      const isRebel = !isNew && (card.lapses || 0) > 0 && !isMast;

      if (isNew) {
        bucket.newCount += 1;
      } else if (isMast) {
        bucket.mastered += 1;
      } else {
        bucket.learning += 1;
      }
      if (!isNew && isDue) bucket.dueNow += 1;
      if (isRebel) bucket.rebeldes += 1;
      if (card && typeof card.lastScore === "number") {
        bucket._scoreSum += card.lastScore;
        bucket._scoreCnt += 1;
      }
    });

    Object.values(byTopic).forEach((b) => {
      b.masteredPct = b.total > 0 ? Math.round((b.mastered / b.total) * 100) : 0;
      b.seenPct = b.total > 0 ? Math.round(((b.mastered + b.learning) / b.total) * 100) : 0;
      b.avgScore = b._scoreCnt > 0 ? Math.round(b._scoreSum / b._scoreCnt) : null;
      delete b._scoreSum;
      delete b._scoreCnt;
    });

    p2Questions.forEach((q) => {
      const card = map[q.id];
      if (!card || card.status === "new" || !card.lastReviewedAt) {
        newCount += 1;
      } else if (isCardMastered(card)) {
        mastered += 1;
        if (!card.dueAt || card.dueAt <= now) dueNow += 1;
      } else {
        learning += 1;
        if (!card.dueAt || card.dueAt <= now) dueNow += 1;
        if ((card.lapses || 0) > 0) rebeldes += 1;
      }
    });

    const p2Total = p2Questions.length;
    const p2MasteredPct = p2Total > 0 ? Math.round((mastered / p2Total) * 100) : 0;
    const p2SeenPct = p2Total > 0 ? Math.round(((mastered + learning) / p2Total) * 100) : 0;
    const p2LearningPct = p2Total > 0 ? Math.min(100 - p2MasteredPct, Math.round((learning / p2Total) * 100)) : 0;

    // Lab Progress across the 7 practical topics
    const temas = (labData && Array.isArray(labData.temas)) ? labData.temas : [];
    const doneSet = labCompletedSteps instanceof Set ? labCompletedSteps : new Set(labCompletedSteps || []);
    let stepsTotal = 0;
    let stepsDone = 0;
    let flashcardsTotal = 0;
    let flashcardsEvaluated = 0;
    let flashcardsMastered = 0;
    let topicsTouched = 0;
    const labByTopic = {};

    temas.forEach((t) => {
      let tStepsTotal = 0;
      let tStepsDone = 0;
      let tCardsTotal = 0;
      let tCardsEval = 0;
      let tCardsMast = 0;
      (t.items || []).forEach((it) => {
        if (Array.isArray(it.pasos)) {
          tStepsTotal += it.pasos.length;
          tStepsDone += it.pasos.filter((p) => doneSet.has(`${it.id}:${p.nro}`)).length;
        }
        if (it.tipo === "formula") {
          tCardsTotal += 1;
          const card = map[`LAB:${it.id}`] || map[`lab:${it.id}`];
          if (card && card.lastReviewedAt) {
            tCardsEval += 1;
            if (isCardMastered(card)) tCardsMast += 1;
          }
        }
      });
      stepsTotal += tStepsTotal;
      stepsDone += tStepsDone;
      flashcardsTotal += tCardsTotal;
      flashcardsEvaluated += tCardsEval;
      flashcardsMastered += tCardsMast;
      if (tStepsDone > 0 || tCardsEval > 0) topicsTouched += 1;
      const denom = tStepsTotal + tCardsTotal;
      labByTopic[t.id] = {
        stepsDone: tStepsDone,
        stepsTotal: tStepsTotal,
        cardsEvaluated: tCardsEval,
        cardsMastered: tCardsMast,
        cardsTotal: tCardsTotal,
        pct: denom > 0 ? Math.round(((tStepsDone + tCardsEval) / denom) * 100) : 0
      };
    });

    const labDenom = stepsTotal + flashcardsTotal;
    const labPct = labDenom > 0 ? Math.round(((stepsDone + flashcardsEvaluated) / labDenom) * 100) : 0;

    return {
      p2: {
        total: p2Total,
        mastered,
        learning,
        newCount,
        dueNow,
        rebeldes,
        masteredPct: p2MasteredPct,
        learningPct: p2LearningPct,
        seenPct: p2SeenPct
      },
      byTopic,
      lab: {
        topicsTotal: temas.length,
        topicsTouched,
        stepsDone,
        stepsTotal,
        flashcardsTotal,
        flashcardsEvaluated,
        flashcardsMastered,
        pct: labPct,
        byTopic: labByTopic
      }
    };
  }

  function evaluateAchievements(gamif, summary, nowMs) {
    const ctx = { gamif, summary };
    const newlyUnlocked = [];
    const ts = new Date(nowMs || Date.now()).toISOString();
    ACHIEVEMENTS.forEach((ach) => {
      if (!gamif.unlockedAchievements[ach.id] && ach.check(ctx)) {
        gamif.unlockedAchievements[ach.id] = ts;
        newlyUnlocked.push(ach);
      }
    });
    return newlyUnlocked;
  }

  function computeChecksum(str) {
    let h = 0x811c9dc5;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    return (h >>> 0).toString(36).toUpperCase().padStart(7, "0");
  }

  function toBase64Utf8(str) {
    if (typeof Buffer !== "undefined") {
      return Buffer.from(str, "utf8").toString("base64");
    }
    const bytes = new TextEncoder().encode(str);
    let bin = "";
    bytes.forEach((b) => { bin += String.fromCharCode(b); });
    return btoa(bin);
  }

  function fromBase64Utf8(b64) {
    if (typeof Buffer !== "undefined") {
      return Buffer.from(b64, "base64").toString("utf8");
    }
    const bin = atob(b64);
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  }

  function encodeRankCode(gamif, summary, nowMs) {
    const lvl = getLevelInfo(gamif.xp);
    const payload = {
      v: 1,
      a: String(gamif.alias || "Estudiante UTN").trim().slice(0, 28) || "Estudiante UTN",
      x: Math.max(0, Math.round(gamif.xp || 0)),
      l: lvl.level,
      m: Math.max(0, Math.min(100, Math.round(summary?.p2?.masteredPct || 0))),
      mc: Math.max(0, Math.round(summary?.p2?.mastered || 0)),
      b: Math.max(0, Math.min(100, Math.round(gamif.bestExamScore || 0))),
      b25: Math.max(0, Math.min(100, Math.round(gamif.best2025Score || 0))),
      s: Math.max(0, Math.round(getEffectiveStreak(gamif, nowMs))),
      lp: Math.max(0, Math.min(100, Math.round(summary?.lab?.pct || 0))),
      t: Math.floor((nowMs || Date.now()) / 1000)
    };
    const core = JSON.stringify(payload);
    const body = Object.assign({}, payload, { c: computeChecksum(core) });
    const b64 = toBase64Utf8(JSON.stringify(body))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/g, "");
    return `IA-RANK:v1:${b64}`;
  }

  function decodeRankCode(codeStr) {
    if (!codeStr || typeof codeStr !== "string") return null;
    const match = codeStr.match(/IA-RANK:v1:([A-Za-z0-9\-_]+)/);
    if (!match) return null;
    try {
      let b64 = match[1].replace(/-/g, "+").replace(/_/g, "/");
      while (b64.length % 4 !== 0) b64 += "=";
      const parsed = JSON.parse(fromBase64Utf8(b64));
      if (!parsed || parsed.v !== 1 || !parsed.a || !parsed.c) return null;
      const { c, ...rest } = parsed;
      const expected = computeChecksum(JSON.stringify(rest));
      if (c !== expected) return null;
      const alias = String(rest.a).trim().slice(0, 28);
      if (!alias) return null;
      const xp = Math.max(0, Number(rest.x) || 0);
      const lvl = getLevelInfo(xp);
      return {
        alias,
        xp,
        level: lvl.level,
        levelTitle: lvl.title,
        levelIcon: lvl.icon,
        masteryPct: Math.max(0, Math.min(100, Number(rest.m) || 0)),
        masteredCount: Math.max(0, Number(rest.mc) || 0),
        bestExamScore: Math.max(0, Math.min(100, Number(rest.b) || 0)),
        best2025Score: Math.max(0, Math.min(100, Number(rest.b25) || 0)),
        streakDays: Math.max(0, Number(rest.s) || 0),
        labPct: Math.max(0, Math.min(100, Number(rest.lp) || 0)),
        updatedAt: Number(rest.t) || 0,
        code: `IA-RANK:v1:${match[1]}`
      };
    } catch (e) {
      return null;
    }
  }

  return {
    LEVELS,
    ACHIEVEMENTS,
    getLocalDateKey,
    diffLocalDays,
    createEmptyCard,
    cloneCard,
    isCardMastered,
    ratingFromMoodleScore,
    computeNextSrsState,
    formatIntervalLabel,
    previewIntervals,
    getScopedQuestions,
    buildSmartSrsQueue,
    createDefaultGamification,
    normalizeGamification,
    getLevelInfo,
    getEffectiveStreak,
    applyStudyTouch,
    computeProgressSummary,
    evaluateAchievements,
    encodeRankCode,
    decodeRankCode
  };
});
