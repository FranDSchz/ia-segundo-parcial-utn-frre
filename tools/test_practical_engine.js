const assert = require("assert");
const PE = require("../docs/practical_engine.js");

function assertBalancedDollars(str, context) {
  if (!str) return;
  const cleaned = String(str).replace(/\\\$/g, "");
  // Strip $$ pairs first, then check single $ pairs
  const noDisplay = cleaned.replace(/\$\$/g, "");
  const count = (noDisplay.match(/\$/g) || []).length;
  assert.strictEqual(
    count % 2,
    0,
    `Unbalanced $ delimiters (${count}) in ${context}`
  );
}

function assertNoBadTokens(str, context) {
  const s = String(str || "");
  assert.ok(!/\bNaN\b/.test(s), `Found NaN in ${context}`);
  assert.ok(!/\bundefined\b/.test(s), `Found undefined in ${context}`);
  assert.ok(!/\bInfinity\b/.test(s), `Found Infinity in ${context}`);
}

function buildAnswerMaps(exercise) {
  const exactMap = {};
  const calcMap = {};
  const wrongMap = {};

  for (const stage of exercise.stages) {
    assert.ok(stage.id && stage.title, `Stage missing id/title in ${exercise.topic}`);
    assert.ok(stage.paperCommentTip && stage.paperCommentTip.length > 10, `Missing paperCommentTip in ${exercise.topic}:${stage.id}`);
    assertNoBadTokens(stage.title, `${exercise.topic}:${stage.id}:title`);
    assertNoBadTokens(stage.solutionHtml, `${exercise.topic}:${stage.id}:solution`);
    assertBalancedDollars(stage.title, `${exercise.topic}:${stage.id}:title`);
    assertBalancedDollars(stage.solutionHtml, `${exercise.topic}:${stage.id}:solution`);

    for (const f of stage.fields) {
      assertNoBadTokens(f.label, `${exercise.topic}:${f.id}:label`);
      assertNoBadTokens(f.expectedDisplay, `${exercise.topic}:${f.id}:expectedDisplay`);
      assertBalancedDollars(f.label, `${exercise.topic}:${f.id}:label`);

      if (f.type === "number") {
        assert.ok(Number.isFinite(Number(f.expected)), `Non-finite expected on ${exercise.topic}:${f.id}`);
        exactMap[f.id] = String(f.expected);

        const cVal = Array.isArray(f.altExpected) && f.altExpected.length > 0
          ? Number(f.altExpected[0])
          : PE.roundN(Number(f.expected), f.decimals ?? 3);
        assert.ok(Number.isFinite(cVal), `Non-finite altExpected on ${exercise.topic}:${f.id}`);
        // Format with Spanish decimal comma to stress comma parsing too
        calcMap[f.id] = String(PE.roundN(cVal, f.decimals ?? 3)).replace(".", ",");
        wrongMap[f.id] = String(Number(f.expected) + 9.99);
      } else if (f.type === "select") {
        assert.ok(Array.isArray(f.options) && f.options.includes(f.expected), `Expected option missing from select list in ${exercise.topic}:${f.id}`);
        exactMap[f.id] = String(f.expected);
        calcMap[f.id] = String(f.expected).toLowerCase();
        const wrongOpt = f.options.find((o) => o !== f.expected) || "INVALID_OPT";
        wrongMap[f.id] = wrongOpt;
      } else if (f.type === "pair") {
        const expStr = String(f.expected);
        const parts = PE.normalizePairString(expStr).split("-");
        assert.strictEqual(parts.length, 2, `Invalid pair expected ${expStr} in ${exercise.topic}:${f.id}`);
        exactMap[f.id] = expStr;
        // Reversed pair with lowercase and braces
        calcMap[f.id] = `{${parts[1].toLowerCase()}, ${parts[0].toLowerCase()}}`;
        wrongMap[f.id] = "Z, Q";
      } else if (f.type === "bitstring") {
        const expStr = PE.normalizeBitstring(f.expected);
        assert.ok(expStr.length >= 4, `Short bitstring in ${exercise.topic}:${f.id}`);
        exactMap[f.id] = expStr;
        calcMap[f.id] = expStr.split("").join(" ");
        wrongMap[f.id] = expStr.split("").map((b) => (b === "1" ? "0" : "1")).join("");
      } else if (f.type === "vector") {
        assert.ok(Array.isArray(f.expected) && f.expected.length > 0, `Empty vector in ${exercise.topic}:${f.id}`);
        f.expected.forEach((v) => assert.ok(Number.isFinite(v), `Non-finite vector component in ${exercise.topic}:${f.id}`));
        exactMap[f.id] = f.expected.join(",");
        calcMap[f.id] = `[${f.expected.join(" ")}]`;
        wrongMap[f.id] = f.expected.map((v) => v + 5).join(",");
      } else {
        assert.fail(`Unsupported field type ${f.type}`);
      }
    }
  }
  return { exactMap, calcMap, wrongMap };
}

function verifyExercise(ex, context) {
  assert.ok(ex && ex.topic && ex.title && ex.introHtml, `Invalid exercise object (${context})`);
  assert.notStrictEqual(ex.topic, "SVM", `SVM must NOT appear (${context})`);
  assert.ok(!/\bSVM\b|Support Vector Machine/i.test(ex.introHtml + ex.title), `Unexpected SVM reference in ${context}`);
  assertNoBadTokens(ex.introHtml, `${context}:introHtml`);
  assertBalancedDollars(ex.title, `${context}:title`);
  assertBalancedDollars(ex.introHtml, `${context}:introHtml`);
  assert.ok(ex.weight > 0 && ex.targetMinutes > 0, `Invalid budget/weight in ${context}`);

  const { exactMap, calcMap, wrongMap } = buildAnswerMaps(ex);

  const exactRes = PE.evaluateExercise(ex, exactMap);
  assert.strictEqual(exactRes.correctCount, exactRes.totalFields, `Exact answers failed in ${context}: ${JSON.stringify(exactRes)}`);
  assert.strictEqual(exactRes.scorePct, 100, `Exact scorePct != 100 in ${context}`);

  const calcRes = PE.evaluateExercise(ex, calcMap);
  assert.strictEqual(calcRes.correctCount, calcRes.totalFields, `3-dec/comma calculator answers failed in ${context}: ${JSON.stringify(calcRes.stageResults.flatMap((s) => s.results.filter((r) => !r.isCorrect)))}`);
  assert.strictEqual(calcRes.scorePct, 100, `Calc scorePct != 100 in ${context}`);

  const wrongRes = PE.evaluateExercise(ex, wrongMap);
  assert.strictEqual(wrongRes.correctCount, 0, `Wrong answers unexpectedly passed in ${context}`);
  assert.strictEqual(wrongRes.scorePct, 0, `Wrong scorePct != 0 in ${context}`);

  const emptyRes = PE.evaluateExercise(ex, {});
  assert.strictEqual(emptyRes.answeredCount, 0, `Empty answers counted as answered in ${context}`);
  assert.strictEqual(emptyRes.correctCount, 0, `Empty answers marked correct in ${context}`);
}

console.log("1. Testing parsers & timing helpers...");
assert.strictEqual(PE.parseFlexibleNumber("0,625"), 0.625);
assert.strictEqual(PE.parseFlexibleNumber(" -1,50 "), -1.5);
assert.strictEqual(PE.parseFlexibleNumber("3/4"), 0.75);
assert.ok(Number.isNaN(PE.parseFlexibleNumber("1/0")));
assert.ok(Number.isNaN(PE.parseFlexibleNumber("abc")));
assert.ok(Number.isNaN(PE.parseFlexibleNumber("")));

assert.deepStrictEqual(PE.parseVectorInput("[1, -1, 1, -1, 1]"), [1, -1, 1, -1, 1]);
assert.deepStrictEqual(PE.parseVectorInput("+1 -1 +1"), [1, -1, 1]);
assert.strictEqual(PE.parseVectorInput(""), null);
assert.strictEqual(PE.parseVectorInput("a, b"), null);

assert.strictEqual(PE.normalizePairString("E, C"), "C-E");
assert.strictEqual(PE.normalizePairString("{ c ; e }"), "C-E");
assert.strictEqual(PE.normalizePairString("EC"), "C-E");
assert.strictEqual(PE.normalizePairString("onlyone"), "");

assert.strictEqual(PE.normalizeBitstring("1 0 1 1 0"), "10110");
assert.strictEqual(PE.normalizeBitstring("10-11"), "1011");

assert.strictEqual(PE.formatDuration(65), "01:05");
assert.strictEqual(PE.formatDuration(3661), "1:01:01");
assert.strictEqual(PE.getPaceStatus(15 * 60, 20).code, "good");
assert.strictEqual(PE.getPaceStatus(20 * 60, 20).code, "warn");
assert.strictEqual(PE.getPaceStatus(25 * 60, 20).code, "over");

console.log("2. Testing curated exam models (modelo_2025 & modelo_integrador)...");
assert.ok(!PE.TOPIC_META.SVM, "TOPIC_META must exclude SVM");
assert.strictEqual(Object.keys(PE.TOPIC_META).length, 7, "Expected 7 practical topics");

const m1 = PE.buildExamModel("modelo_2025");
assert.strictEqual(m1.totalMinutes, 120);
assert.strictEqual(m1.exercises.length, 4);
assert.strictEqual(m1.exercises.reduce((a, e) => a + e.weight, 0), 100);
m1.exercises.forEach((ex, i) => verifyExercise(ex, `modelo_2025:E${i + 1}:${ex.topic}`));

const m2 = PE.buildExamModel("modelo_integrador");
assert.strictEqual(m2.totalMinutes, 120);
assert.strictEqual(m2.exercises.length, 4);
assert.strictEqual(m2.exercises.reduce((a, e) => a + e.weight, 0), 100);
m2.exercises.forEach((ex, i) => verifyExercise(ex, `modelo_integrador:E${i + 1}:${ex.topic}`));

console.log("3. Testing random exam generator across seeds 1..15...");
for (let s = 1; s <= 15; s++) {
  const mr = PE.buildExamModel("aleatorio", s);
  assert.strictEqual(mr.exercises.length, 4);
  const uniqueTopics = new Set(mr.exercises.map((e) => e.topic));
  assert.strictEqual(uniqueTopics.size, 4, `Duplicate topic in random seed ${s}`);
  mr.exercises.forEach((ex, i) => verifyExercise(ex, `aleatorio_${s}:E${i + 1}:${ex.topic}`));
}

console.log("4. Testing all 7 topics across seeds 0..24 (175 generated exercises)...");
const topics = Object.keys(PE.TOPIC_META);
for (const topicId of topics) {
  for (let seed = 0; seed < 25; seed++) {
    const ex = PE.buildTopicExercise(topicId, seed);
    verifyExercise(ex, `${topicId}:seed_${seed}`);
  }
}

console.log("5. Verifying Hopfield N=5 and NB Laplace edge invariants...");
const hopEx = PE.buildTopicExercise("HOPFIELD", 0);
const hopVecField = hopEx.stages.flatMap((s) => s.fields).find((f) => f.type === "vector");
assert.ok(hopVecField, "Expected vector field in HOPFIELD");
const resBadText = PE.evaluateField(hopVecField, "no es vector");
assert.strictEqual(resBadText.valid, false);
assert.strictEqual(resBadText.status, "invalid");

console.log("ALL PRACTICAL ENGINE TESTS PASSED (199+ exercises verified across exact + 3-dec rounding + wrong perturbation).");
