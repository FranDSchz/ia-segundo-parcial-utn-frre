const assert = require("assert");
const fs = require("fs");
const vm = require("vm");
const engine = require("../docs/study_engine.js");

const HOUR_MS = 3600 * 1000;
const DAY_MS = 24 * HOUR_MS;
const BASE_NOW = new Date(2026, 10, 12, 10, 0, 0).getTime(); // 2026-11-12 10:00 local

// Load real preguntas.js and entrenamiento_practico.js
const ctx = { window: {} };
vm.runInNewContext(fs.readFileSync(require("path").join(__dirname, "../docs/data/preguntas.js"), "utf8"), ctx);
vm.runInNewContext(fs.readFileSync(require("path").join(__dirname, "../docs/data/entrenamiento_practico.js"), "utf8"), ctx);
const allQ = ctx.window.PREGUNTAS;
const labData = ctx.window.ENTRENAMIENTO_PRACTICO;

assert.strictEqual(allQ.length, 87, "Debe cargar 87 preguntas reales");
assert.strictEqual(labData.temas.length, 7, "Debe cargar 7 temas prácticos");

// 1. Scoped P2 filter (sin P1 ni SVM por defecto)
const coreP2 = engine.getScopedQuestions(allQ, { includeP1: false, includeSVM: false });
assert(coreP2.length > 60 && coreP2.length < 87, "P2 base debe excluir P1 y SVM");
assert(!coreP2.some((q) => q.es_p1 || q.tema === "SVM"), "No debe colar P1 ni SVM");

// 2. SM-2 Sprint progression & mastery rules
let c = null;
c = engine.computeNextSrsState(c, 1, 0, BASE_NOW); // Otra vez
assert.strictEqual(c.lapses, 1);
assert.strictEqual(c.reps, 0);
assert.strictEqual(c.intervalHours, 0);
assert(!engine.isCardMastered(c), "Con 1 lapse nunca debe estar dominada");

c = engine.computeNextSrsState(c, 3, 100, BASE_NOW + HOUR_MS); // Bien #1 -> 24h
assert.strictEqual(c.reps, 1);
assert.strictEqual(c.intervalHours, 24);
assert(!engine.isCardMastered(c), "1 repetición no alcanza para dominar");

c = engine.computeNextSrsState(c, 3, 90, BASE_NOW + 25 * HOUR_MS); // Bien #2 -> 48h -> Dominada
assert.strictEqual(c.reps, 2);
assert.strictEqual(c.intervalHours, 48);
assert(engine.isCardMastered(c), "Con 2 aciertos >=80% y >=48h debe quedar Dominada");

// Lapse resets streak & breaks mastery
c = engine.computeNextSrsState(c, 1, 20, BASE_NOW + 80 * HOUR_MS);
assert.strictEqual(c.reps, 0);
assert.strictEqual(c.lapses, 2);
assert.strictEqual(c.status, "relearning");
assert(!engine.isCardMastered(c), "Recaída quita dominio");

// Fast-track on Fácil when never missed
const cEasy1 = engine.computeNextSrsState(null, 4, 100, BASE_NOW);
assert.strictEqual(cEasy1.intervalHours, 48);
const cEasy2 = engine.computeNextSrsState(cEasy1, 4, 100, BASE_NOW + 48 * HOUR_MS);
assert(cEasy2.intervalHours >= 96 && engine.isCardMastered(cEasy2));

// Preview labels sanity
const prev = engine.previewIntervals(null, 100, BASE_NOW);
assert.strictEqual(prev[1], "< 10 min");
assert.strictEqual(prev[2], "6 h");
assert.strictEqual(prev[3], "1 día");
assert.strictEqual(prev[4], "2 días");

// 3. Smart Queue Priority: overdue rebeldes -> overdue learning -> due mastered -> unseen (topic interleaved)
const srsMap = {};
const qA = coreP2[0];
const qB = coreP2[1];
const qC = coreP2[2];
const qFuture = coreP2[3];
srsMap[qA.id] = { reps: 1, lapses: 0, ease: 2.5, intervalHours: 24, dueAt: BASE_NOW - 1000, lastReviewedAt: BASE_NOW - DAY_MS, lastScore: 85, status: "learning" };
srsMap[qB.id] = { reps: 0, lapses: 3, ease: 1.9, intervalHours: 0, dueAt: BASE_NOW - 500, lastReviewedAt: BASE_NOW - HOUR_MS, lastScore: 0, status: "relearning" };
srsMap[qC.id] = { reps: 2, lapses: 0, ease: 2.5, intervalHours: 48, dueAt: BASE_NOW - 2000, lastReviewedAt: BASE_NOW - 2 * DAY_MS, lastScore: 100, status: "mastered" };
srsMap[qFuture.id] = { reps: 2, lapses: 0, ease: 2.5, intervalHours: 48, dueAt: BASE_NOW + DAY_MS, lastReviewedAt: BASE_NOW, lastScore: 100, status: "mastered" };

const queueInfo = engine.buildSmartSrsQueue(coreP2, srsMap, BASE_NOW);
assert.strictEqual(queueInfo.queue[0].id, qB.id, "Tarjeta rebelde vencida debe ir primera");
assert.strictEqual(queueInfo.queue[1].id, qA.id, "Luego tarjeta learning vencida");
assert.strictEqual(queueInfo.queue[2].id, qC.id, "Luego tarjeta dominada vencida");
assert(!queueInfo.queue.some((q) => q.id === qFuture.id), "No debe incluir tarjetas no vencidas si hay pendientes");

// 4. Local Calendar Streak math across day boundaries
const gamif = engine.createDefaultGamification();
gamif.alias = "Tester FRRe";
const d1 = new Date(2026, 10, 12, 23, 50, 0).getTime(); // 23:50 local day 12
const t1 = engine.applyStudyTouch(gamif, d1, 1);
assert.strictEqual(t1.dailyBonusXp, 25);
assert.strictEqual(gamif.currentStreakDays, 1);

const d2 = new Date(2026, 10, 13, 8, 10, 0).getTime(); // 08:10 local day 13
const t2 = engine.applyStudyTouch(gamif, d2, 1);
assert.strictEqual(t2.dailyBonusXp, 25);
assert.strictEqual(gamif.currentStreakDays, 2);

const dGap = new Date(2026, 10, 15, 9, 0, 0).getTime(); // skipped day 14
engine.applyStudyTouch(gamif, dGap, 1);
assert.strictEqual(gamif.currentStreakDays, 1);
assert.strictEqual(gamif.bestStreakDays, 2);
assert.strictEqual(engine.getEffectiveStreak(gamif, dGap + DAY_MS), 1, "1 día después sigue viva la racha");
assert.strictEqual(engine.getEffectiveStreak(gamif, dGap + 2 * DAY_MS), 0, "Pasado 1 día completo se corta visualmente");

// 5. Progress Summary & Lab Stats
srsMap["LAB:PRAC-MLP-05"] = { reps: 4, intervalHours: 72, ease: 2.5, status: "mastered", lastReviewedAt: BASE_NOW, nextReviewAt: BASE_NOW + 72 * 3600000 };
srsMap["lab:PRAC-SOM-05"] = { reps: 1, intervalHours: 12, factor: 2.1, lastReviewedAt: BASE_NOW, nextReviewAt: BASE_NOW + 12 * 3600000 };
const summary = engine.computeProgressSummary(allQ, srsMap, labData, new Set(["PRAC-MLP-02:1"]), { nowMs: BASE_NOW });
assert.strictEqual(summary.p2.total, coreP2.length);
assert.strictEqual(summary.p2.mastered, 2); // qC + qFuture
assert.strictEqual(summary.lab.stepsDone, 1);
assert.strictEqual(summary.lab.topicsTouched >= 1, true);
assert(summary.lab.flashcardsTotal > 0, "Debe contar flashcards de #lab");
assert.strictEqual(summary.lab.flashcardsEvaluated, 2, "Debe contar flashcards evaluadas tanto con prefijo LAB: como lab:");
assert.strictEqual(summary.lab.flashcardsMastered, 1, "Debe contar la flashcard dominada");

// 6. Achievements & Level Info
gamif.xp = 400;
gamif.totalExams = 1;
gamif.bestExamScore = 84;
gamif.best2025Score = 88;
const lvl = engine.getLevelInfo(gamif.xp);
assert.strictEqual(lvl.level, 3);
const unlocked = engine.evaluateAchievements(gamif, summary, BASE_NOW);
assert(unlocked.some((a) => a.id === "first_exam"));
assert(unlocked.some((a) => a.id === "promo_score"));
assert(unlocked.some((a) => a.id === "moodle_2025_master"));

// 7. Leaderboard Rank Code Encode / Decode & Checksum Integrity
const rankCode = engine.encodeRankCode(gamif, summary, BASE_NOW);
assert(rankCode.startsWith("IA-RANK:v1:"));
const decoded = engine.decodeRankCode(rankCode);
assert(decoded && decoded.alias === "Tester FRRe" && decoded.xp === 400 && decoded.best2025Score === 88);
// Tampered code must fail
const tampered = rankCode.slice(0, -3) + "XYZ";
assert.strictEqual(engine.decodeRankCode(tampered), null, "Checksum alterado debe ser rechazado");

console.log("[OK] Todos los tests unitarios de docs/study_engine.js pasaron (coreP2:", coreP2.length, "flashcardsLab:", summary.lab.flashcardsTotal, ")");
