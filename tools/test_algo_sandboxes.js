const assert = require("assert");
const path = require("path");

const AlgoSandboxes = require(path.join(__dirname, "..", "docs", "algo_sandboxes.js"));
const VisualWidgets = require(path.join(__dirname, "..", "docs", "visual_widgets.js"));

// 1. KNN: verify simple majority vs 1/d^2 distance-weighted reversal!
{
  const pts = [
    { x: 0.0, y: 0.0, cls: "A" },
    { x: 5.0, y: 5.0, cls: "B" },
    { x: 5.2, y: 5.0, cls: "B" }
  ];
  const q = { x: 0.1, y: 0.1 };

  const resSimple = AlgoSandboxes.computeKnnDecision(pts, q, 3, false);
  assert.strictEqual(resSimple.winner, "B", "Simple majority k=3 must pick B (2 B vs 1 A)");

  const resWeighted = AlgoSandboxes.computeKnnDecision(pts, q, 3, true);
  assert.strictEqual(resWeighted.winner, "A", "Weighted 1/d^2 k=3 must reverse decision to A when A is ultra-close");
  assert.ok(resWeighted.scoreA > resWeighted.scoreB, "Weighted scoreA must exceed scoreB");
}

// 2. Hopfield 5x5: w_ii === 0, symmetric weights, convergence from noisy T, monotonic energy drop!
{
  const patterns = [AlgoSandboxes.HOPFIELD_PATTERNS.T, AlgoSandboxes.HOPFIELD_PATTERNS.X];
  const W = AlgoSandboxes.buildHopfieldWeights(patterns);
  assert.strictEqual(W.length, 25);
  for (let i = 0; i < 25; i++) {
    assert.strictEqual(W[i][i], 0, `Diagonal w[${i}][${i}] must be zero`);
    for (let j = i + 1; j < 25; j++) {
      assert.strictEqual(W[i][j], W[j][i], "Hebbian weight matrix must be symmetric");
    }
  }

  const targetT = AlgoSandboxes.HOPFIELD_PATTERNS.T.slice();
  const noisy = targetT.slice();
  noisy[0] = -noisy[0];
  noisy[6] = -noisy[6];
  noisy[24] = -noisy[24];

  const e0 = AlgoSandboxes.computeHopfieldEnergy(noisy, W);
  let cur = noisy;
  let converged = false;
  for (let step = 0; step < 12; step++) {
    const out = AlgoSandboxes.stepHopfield(cur, W);
    cur = out.nextState;
    if (out.converged) {
      converged = true;
      break;
    }
  }
  const eFinal = AlgoSandboxes.computeHopfieldEnergy(cur, W);
  assert.ok(converged, "Hopfield network should reach fixed point within 12 synchronous steps");
  assert.ok(eFinal <= e0, "Final energy must be <= initial noisy energy");
  assert.deepStrictEqual(cur, targetT, "Corrupted T (3 bits flipped) should recover exact stored T");
  const extraCheck = AlgoSandboxes.stepHopfield(noisy, W);
  assert.ok(Array.isArray(extraCheck.changedIndices) && extraCheck.changedIndices.length >= 1, "Must expose flipped neuron indices");
  assert.ok(Array.isArray(extraCheck.nets) && extraCheck.nets.length === 25, "Must expose local fields net_i for all 25 neurons");
}

// 3. SOM Kohonen 2D: BMU moves closer to sample x
{
  const neurons = [
    { label: "N1", x: 0.2, y: 0.2, gx: 0, gy: 0 },
    { label: "N2", x: 0.8, y: 0.8, gx: 1, gy: 0 }
  ];
  const sample = { x: 0.3, y: 0.25 };
  const distBefore = Math.hypot(neurons[0].x - sample.x, neurons[0].y - sample.y);
  const res = AlgoSandboxes.somStep(neurons, sample, 0.5, 0.8);
  assert.strictEqual(res.bmuIdx, 0, "Neuron 0 must win BMU competition");
  const distAfter = Math.hypot(res.neurons[0].x - sample.x, res.neurons[0].y - sample.y);
  assert.ok(distAfter < distBefore, "BMU weight vector must move closer to input sample");
}

// 4. UPGMA Clustering: weighted centroid-size average linkage |C1|*|C2|
{
  // Hand-computed: P1(0,0), P2(0,2) -> d(P1,P2)=2. P3(3,0) has d(P1,P3)=3, d(P2,P3)=sqrt(13)=3.60555...
  // After {P1,P2} merge at h=2, UPGMA d({P1,P2}, P3) = (1*3 + 1*3.605551275)/2 = 3.3027756...
  const pts = [
    { label: "A", x: 0, y: 0 },
    { label: "B", x: 0, y: 2 },
    { label: "C", x: 3, y: 0 }
  ];
  const tree = AlgoSandboxes.computeUpgmaTree(pts);
  assert.strictEqual(tree.merges.length, 2, "3 points must produce 2 hierarchical merges");
  assert.ok(Math.abs(tree.merges[0].height - 2.0) < 1e-6, "First merge A-B at distance 2.0");
  const expectedSecond = (3 + Math.sqrt(13)) / 2;
  assert.ok(Math.abs(tree.merges[1].height - expectedSecond) < 1e-6, "Second merge must follow exact UPGMA size-weighted average");
}

// 5. AG Roulette & Generations: disjoint [00..99] intervals + evolution monotonic/valid
{
  const fitnesses = [25, 50, 15, 10];
  const roulette = AlgoSandboxes.computeAgRoulette(fitnesses);
  const slots = roulette.rows;
  assert.strictEqual(slots.length, 4);
  assert.strictEqual(slots[0].startSlot, 0, "Roulette starts at 00");
  assert.strictEqual(slots[slots.length - 1].endSlot, 99, "Roulette ends cleanly at 99");
  let covered = 0;
  for (let i = 0; i < slots.length; i++) {
    assert.ok(slots[i].endSlot >= slots[i].startSlot, "Each slot range must be non-empty");
    if (i > 0) {
      assert.strictEqual(slots[i].startSlot, slots[i - 1].endSlot + 1, "Roulette slots must be contiguous without gaps or overlaps");
    }
    covered += slots[i].endSlot - slots[i].startSlot + 1;
  }
  assert.strictEqual(covered, 100, "Total integer slots [00..99] must sum to 100");

  // Also test extreme skewed fitnesses
  const skewed = AlgoSandboxes.computeAgRoulette([1, 1, 1, 997]).rows;
  assert.strictEqual(skewed[0].startSlot, 0);
  assert.strictEqual(skewed[3].endSlot, 99);
  for (let i = 1; i < skewed.length; i++) {
    assert.strictEqual(skewed[i].startSlot, skewed[i - 1].endSlot + 1);
  }

  const gens = AlgoSandboxes.simulateAgGenerations(fitnesses, 8);
  assert.strictEqual(gens.length, 9, "Gen 0..8 yields 9 points");
  assert.ok(gens.every((g) => Number.isFinite(g.avg) && Number.isFinite(g.max)));
}

// 6. Trap Hunter cases: 10 cases, 4 lines each, valid trapLineIdx 0..3 & diagnostic text
{
  const cases = AlgoSandboxes.TRAP_CASES;
  assert.ok(Array.isArray(cases) && cases.length >= 10, "Must have >= 10 exam trap cases");
  const ids = new Set();
  cases.forEach((c) => {
    assert.ok(c.id && !ids.has(c.id), `Duplicate or missing case id: ${c.id}`);
    ids.add(c.id);
    assert.strictEqual(c.lines.length, 4, `Case ${c.id} must have 4 clickable lines`);
    assert.ok(Number.isInteger(c.trapLineIdx) && c.trapLineIdx >= 0 && c.trapLineIdx < 4, `Invalid trapLineIdx in ${c.id}`);
    assert.ok(c.explanation && c.explanation.length > 20, `Missing explanation in ${c.id}`);
  });
}

// 7. VisualWidgets 7-axis Radar SVG: clean output, zero NaN/undefined, handles empty & populated stats
{
  const emptySvg = VisualWidgets.buildTopicRadarChartSvg({ summary: null, practicalAttempts: [] });
  assert.ok(emptySvg.includes("<svg") && emptySvg.includes("</svg>"), "Radar SVG must render when empty");
  assert.ok(!emptySvg.includes("NaN") && !emptySvg.includes("undefined"), "Empty radar SVG must have zero NaN/undefined");

  const fullSvg = VisualWidgets.buildTopicRadarChartSvg({
    summary: {
      byTopic: {
        CLUSTERING: { total: 10, mastered: 7, learning: 2 },
        SOM: { total: 10, mastered: 5, learning: 3 },
        MLP: { total: 10, mastered: 8, learning: 1 },
        ALGORITMOS_GENETICOS: { total: 10, mastered: 6, learning: 2 },
        NAIVE_BAYES: { total: 10, mastered: 9, learning: 0 },
        HOPFIELD: { total: 10, mastered: 4, learning: 2 },
        KNN: { total: 10, mastered: 7, learning: 2 }
      },
      lab: {
        byTopic: {
          CLUSTERING: { stepsTotal: 4, stepsDone: 4 },
          SOM: { stepsTotal: 4, stepsDone: 3 },
          MLP_PERCEPTRON: { stepsTotal: 4, stepsDone: 2 },
          ALGORITMOS_GENETICOS: { stepsTotal: 4, stepsDone: 4 },
          NAIVE_BAYES: { stepsTotal: 4, stepsDone: 4 },
          HOPFIELD: { stepsTotal: 4, stepsDone: 1 },
          KNN: { stepsTotal: 4, stepsDone: 3 }
        }
      }
    },
    practicalAttempts: [
      { topic: "MLP", scorePct: 90, elapsedSec: 1000 },
      { topic: "SOM", scorePct: 80, elapsedSec: 900 }
    ]
  });
  assert.ok(fullSvg.includes("<polygon") && fullSvg.includes("Clustering") && fullSvg.includes("Hopfield"));
  assert.ok(!fullSvg.includes("NaN") && !fullSvg.includes("undefined"), "Populated radar SVG must have zero NaN/undefined");
}

// 8. KNN Safe Singularity Guard d -> 0:
{
  const pts = [
    { x: 1.0, y: 1.0, cls: "A" },
    { x: 1.0000000001, y: 1.0, cls: "B" },
    { x: 5.0, y: 5.0, cls: "B" }
  ];
  const qExact = { x: 1.0, y: 1.0 };
  const res = AlgoSandboxes.computeKnnDecision(pts, qExact, 1, true);
  assert.strictEqual(res.winner, "A", "Coincident point must win with safe d->0 weight");
  assert.ok(Number.isFinite(res.scoreA) && !Number.isNaN(res.scoreA), "Score must be finite");
  assert.ok(res.scoreA >= 1e6, "Score for coincident point must reach 10^6 cap");
}

// 9. Hopfield Asynchronous Step & Attractor Detection:
{
  const W = AlgoSandboxes.buildHopfieldWeights([AlgoSandboxes.HOPFIELD_PATTERNS.T]);
  const noisy = AlgoSandboxes.HOPFIELD_PATTERNS.T.slice();
  noisy[0] = -noisy[0]; // 1 bit flipped

  const asyncRes = AlgoSandboxes.stepHopfieldAsync(noisy, W);
  assert.strictEqual(asyncRes.changedIdx, 0, "Async step should identify and fix the discordant neuron 0");
  assert.strictEqual(asyncRes.nextState[0], AlgoSandboxes.HOPFIELD_PATTERNS.T[0]);

  // Test attractor detection
  const curState = [1, -1, 1];
  const historyFixed = ["1,-1,1", "1,-1,1"];
  const detectFixed = AlgoSandboxes.detectHopfieldAttractor(curState, historyFixed);
  assert.strictEqual(detectFixed.type, "fixed_point");

  const historyCycle = ["1,-1,1", "-1,1,-1"];
  const detectCycle = AlgoSandboxes.detectHopfieldAttractor(curState, historyCycle);
  assert.strictEqual(detectCycle.type, "cycle");

  const historyTransient = ["-1,-1,-1", "1,1,1"];
  const detectTransient = AlgoSandboxes.detectHopfieldAttractor(curState, historyTransient);
  assert.strictEqual(detectTransient.type, "transient");
}

// 10. SOM Post-Training Inference & Canonical Decay:
{
  const neurons = [
    { label: "N1", x: 0.1, y: 0.1, gx: 0, gy: 0 },
    { label: "N2", x: 0.9, y: 0.9, gx: 1, gy: 0 }
  ];
  const query = { x: 0.15, y: 0.12 };
  const inf = AlgoSandboxes.somInference(neurons, query);
  assert.strictEqual(inf.bmuLabel, "N1", "Query near N1 must select N1");
  assert.ok(inf.distance < 0.1, "Euclidean distance to N1 must be < 0.1");
  assert.ok(inf.affinity > 0.9, "Affinity must be high for close query");
  assert.strictEqual(neurons[0].x, 0.1, "Inference must NOT mutate neuron weights");

  // Decay test
  const decay0 = AlgoSandboxes.computeSomDecay(0, 100, 0.5, 1.2);
  assert.strictEqual(decay0.alpha, 0.5);
  assert.strictEqual(decay0.sigma, 1.2);

  const decayHalf = AlgoSandboxes.computeSomDecay(50, 100, 0.5, 1.2);
  assert.ok(decayHalf.alpha < 0.5 && decayHalf.alpha > 0.2);

  const decayEnd = AlgoSandboxes.computeSomDecay(150, 100, 0.5, 1.2, 0.04, 0.35);
  assert.strictEqual(decayEnd.alpha, 0.04, "Alpha must obey minimum bound");
  assert.strictEqual(decayEnd.sigma, 0.35, "Sigma must obey minimum bound");
}

// 11. UPGMA Clustering at Cut Height:
{
  const pts = [
    { label: "A", x: 0, y: 0 },
    { label: "B", x: 0, y: 2 },
    { label: "C", x: 3, y: 0 }
  ];
  const tree = AlgoSandboxes.computeUpgmaTree(pts);
  // Merge 1 at height 2.0 (A, B)
  // Merge 2 at height ~3.303 ({A,B}, C)

  // Cut below 2.0 -> 3 separate clusters
  const cutLow = AlgoSandboxes.computeClustersAtCutHeight(tree, 3, 1.0);
  assert.strictEqual(cutLow.k, 3, "Height < 2.0 must keep all 3 individual clusters");

  // Cut between 2.0 and 3.303 -> 2 clusters: {A, B} and {C}
  const cutMid = AlgoSandboxes.computeClustersAtCutHeight(tree, 3, 2.5);
  assert.strictEqual(cutMid.k, 2, "Height 2.5 must form 2 clusters ({A,B} and {C})");

  // Cut above 3.5 -> 1 single cluster
  const cutHigh = AlgoSandboxes.computeClustersAtCutHeight(tree, 3, 4.0);
  assert.strictEqual(cutHigh.k, 1, "Height 4.0 must merge all into 1 cluster");
}

// 12. AG Expected Copies & Generation Step:
{
  const fits = [20, 50, 30];
  const expected = AlgoSandboxes.computeAgExpectedCopies(fits, 3);
  assert.strictEqual(expected.length, 3);
  assert.strictEqual(expected[0].p, 0.2);
  assert.strictEqual(expected[1].p, 0.5);
  assert.strictEqual(expected[2].p, 0.3);
  assert.ok(Math.abs(expected[0].eta - 0.6) < 1e-6);
  assert.ok(Math.abs(expected[1].eta - 1.5) < 1e-6);
  assert.strictEqual(expected[1].intCopies, 1);
  assert.ok(Math.abs(expected[1].frac - 0.5) < 1e-6);

  const step = AlgoSandboxes.simulateAgGenerationStep(["11111", "00000"], [80, 20]);
  assert.strictEqual(step.newPopulation.length, 2);
  assert.ok(Number.isFinite(step.maxFitness) && Number.isFinite(step.avgFitness));
}

console.log("ALL ALGO SANDBOXES & RADAR TESTS PASSED!");
