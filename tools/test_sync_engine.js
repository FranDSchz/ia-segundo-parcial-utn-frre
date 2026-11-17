const assert = require("assert");
const path = require("path");

const SyncEngine = require(path.join(__dirname, "..", "docs", "sync_engine.js"));

async function runTests() {
  console.log("1. Testing payload compaction, compression (IAS2) & roundtrip...");

  const samplePayload = {
    version: 1,
    exportedAt: "2026-11-17T12:00:00.000Z",
    srsMap: {
      q1: {
        reps: 3,
        lapses: 0,
        ease: 2.6,
        intervalHours: 96,
        dueAt: 1795000020000,
        lastReviewedAt: 1794654420000,
        lastScore: 100,
        lastRating: 4,
        status: "mastered"
      },
      q_untouched: {
        reps: 0,
        lapses: 0,
        ease: 2.5,
        intervalHours: 0,
        dueAt: 0,
        lastReviewedAt: 0,
        lastScore: null,
        lastRating: null,
        status: "new"
      }
    },
    gamif: {
      alias: "FranUTN",
      dailyGoal: 20,
      xp: 485,
      currentStreakDays: 4,
      bestStreakDays: 5,
      lastStudyDate: "2026-11-17",
      dailyActions: { "2026-11-16": 12, "2026-11-17": 8 },
      practiceCombo: 3,
      bestPracticeCombo: 6,
      recoveredCount: 2,
      totalReviews: 41,
      totalExams: 3,
      bestExamScore: 86.5,
      best2025Score: 82.1,
      sourceClicks: 4,
      unlockedAchievements: { first_exam: 1794500000000, promo_score: 1794600000000 },
      xpAwardedToday: { "srs:2026-11-17:q1": true }
    },
    labSteps: ["clustering_1", "som_1", "hopfield_1"],
    practicalAttempts: Array.from({ length: 15 }, (_, i) => ({
      id: `att_${i}`,
      ts: 1794600000000 - i * 100000,
      topic: "SOM",
      scorePct: 80 + (i % 20),
      elapsedSec: 640
    })),
    history: Array.from({ length: 12 }, (_, i) => ({
      date: `2026-11-${String(17 - (i % 10)).padStart(2, "0")}`,
      score: 75 + i,
      preset: i === 0 ? "2025" : "random20",
      totalQuestions: 20,
      timeFormatted: "14:22"
    })),
    failedIds: ["q_err1", "q_err2"],
    groupLeaderboard: [{ code: "UTN1-485", name: "Compa", xp: 300 }]
  };

  const fullToken = await SyncEngine.encodeSyncToken(samplePayload, { light: false });
  const lightToken = await SyncEngine.encodeSyncToken(samplePayload, { light: true });

  assert.ok(fullToken.startsWith("IAS2:"), "Compressed token must use IAS2 deflate prefix");
  assert.ok(lightToken.startsWith("IAS2:"), "Light token must use IAS2 prefix");
  assert.ok(lightToken.length < fullToken.length, `Light token (${lightToken.length}) should be shorter than full (${fullToken.length})`);

  const fullUrl = `https://frandschz.github.io/ia-segundo-parcial-utn-frre/#sync=${encodeURIComponent(fullToken)}`;
  const decodedFromUrl = await SyncEngine.decodeSyncToken(fullUrl);
  assert.strictEqual(decodedFromUrl.srsMap.q1.reps, 3);
  assert.strictEqual(decodedFromUrl.srsMap.q1.status, "mastered");
  assert.strictEqual(decodedFromUrl.srsMap.q_untouched, undefined, "Untouched new cards should be omitted to shrink QR");
  assert.strictEqual(decodedFromUrl.gamif.alias, "FranUTN");
  assert.strictEqual(decodedFromUrl.gamif.xp, 485);
  assert.deepStrictEqual(decodedFromUrl.labSteps, samplePayload.labSteps);
  assert.strictEqual(decodedFromUrl.history.length, 12);

  const decodedLight = await SyncEngine.decodeSyncToken(lightToken);
  assert.strictEqual(decodedLight.history.length, 5, "Light mode caps history to 5");
  assert.strictEqual(decodedLight.practicalAttempts.length, 8, "Light mode caps practicalAttempts to 8");

  console.log("2. Testing Smart Merge (PC <-> Mobile non-destructive combination)...");
  const pcState = {
    srsMap: {
      q1: { reps: 1, lapses: 0, ease: 2.5, intervalHours: 12, dueAt: 1000, lastReviewedAt: 5000, status: "learning" },
      q_pc_only: { reps: 4, lapses: 0, ease: 2.7, intervalHours: 120, dueAt: 9000, lastReviewedAt: 6000, status: "mastered" }
    },
    gamif: {
      alias: "FranPC",
      xp: 200,
      currentStreakDays: 2,
      bestStreakDays: 3,
      lastStudyDate: "2026-11-16",
      dailyActions: { "2026-11-16": 10 },
      unlockedAchievements: { first_exam: 1000 },
      xpAwardedToday: { "srs:2026-11-16:q1": true }
    },
    labSteps: ["clustering_1", "som_1"],
    practicalAttempts: [{ id: "p1", ts: 100, topic: "KNN", scorePct: 90, elapsedSec: 300 }],
    history: [{ date: "2026-11-16T10:00:00Z", score: 80, preset: "2025", totalQuestions: 28 }],
    failedIds: ["q_old"]
  };

  const mobileState = {
    srsMap: {
      // Newer review on mobile!
      q1: { reps: 3, lapses: 0, ease: 2.6, intervalHours: 72, dueAt: 8000, lastReviewedAt: 9500, status: "mastered" },
      q_mob_only: { reps: 2, lapses: 1, ease: 2.3, intervalHours: 24, dueAt: 7000, lastReviewedAt: 9600, status: "learning" }
    },
    gamif: {
      alias: "Estudiante UTN",
      xp: 260,
      currentStreakDays: 3,
      bestStreakDays: 3,
      lastStudyDate: "2026-11-17",
      dailyActions: { "2026-11-16": 4, "2026-11-17": 6 },
      unlockedAchievements: { anki_20: 2000 },
      xpAwardedToday: { "srs:2026-11-17:q_mob_only": true }
    },
    labSteps: ["som_1", "hopfield_1"],
    practicalAttempts: [
      { id: "p1", ts: 100, topic: "KNN", scorePct: 90, elapsedSec: 300 }, // duplicate from earlier sync
      { id: "p2", ts: 200, topic: "SOM", scorePct: 100, elapsedSec: 400 }
    ],
    history: [
      { date: "2026-11-16T10:00:00Z", score: 80, preset: "2025", totalQuestions: 28 },
      { date: "2026-11-17T09:00:00Z", score: 85, preset: "random20", totalQuestions: 20 }
    ],
    failedIds: ["q_mob_err"]
  };

  const merged = SyncEngine.mergeProgressPayloads(pcState, mobileState);
  assert.strictEqual(merged.srsMap.q1.reps, 3, "Newer mobile review of q1 must win");
  assert.strictEqual(merged.srsMap.q_pc_only.reps, 4, "PC-only card must be preserved");
  assert.strictEqual(merged.srsMap.q_mob_only.reps, 2, "Mobile-only card must be added");
  assert.strictEqual(merged.labSteps.length, 3, "Lab steps must union without duplicates");
  assert.strictEqual(merged.practicalAttempts.length, 2, "Practical attempts must deduplicate p1 and include p2");
  assert.strictEqual(merged.history.length, 2, "Quiz history must deduplicate identical exam attempt");
  assert.strictEqual(merged.gamif.xp, 260, "XP merge must take max (never inflate by summing)");
  assert.strictEqual(merged.gamif.alias, "FranPC", "Custom local alias must be preserved over default incoming alias");
  assert.strictEqual(merged.gamif.lastStudyDate, "2026-11-17");
  assert.strictEqual(merged.gamif.currentStreakDays, 3);
  assert.strictEqual(merged.gamif.dailyActions["2026-11-16"], 10);
  assert.strictEqual(merged.gamif.dailyActions["2026-11-17"], 6);
  assert.ok(merged.gamif.unlockedAchievements.first_exam && merged.gamif.unlockedAchievements.anki_20);

  console.log("3. Testing ISO/IEC 18004 QR Matrix & SVG generation...");
  for (const testText of ["HELLO WORLD", fullUrl]) {
    const res = SyncEngine.renderQrSvg(testText, { quiet: 4 });
    const qr = SyncEngine.buildQrMatrix(testText);
    const expectedSize = qr.version * 4 + 17;
    assert.strictEqual(qr.size, expectedSize);
    assert.strictEqual(qr.matrix.length, expectedSize);
    assert.strictEqual(qr.matrix[qr.version * 4 + 9][8], 1, "Dark module must be 1");
    // Check 7x7 finder corners (top-left, top-right, bottom-left) center 3x3 solid dark
    assert.strictEqual(qr.matrix[3][3], 1);
    assert.strictEqual(qr.matrix[3][expectedSize - 4], 1);
    assert.strictEqual(qr.matrix[expectedSize - 4][3], 1);
    assert.ok(res.svg.includes("<svg") && res.svg.includes('fill="#ffffff"') && res.svg.includes("</svg>"));
  }

  console.log(`ALL SYNC ENGINE TESTS PASSED! (Sample QR version: v${SyncEngine.renderQrSvg(fullUrl).version}, URL len: ${fullUrl.length})`);
}

runTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
