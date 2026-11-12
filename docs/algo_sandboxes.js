/**
 * AlgoSandboxes - High-Fidelity Interactive Visual Sandboxes & Pedagogical Lab
 * UTN FRRe - Inteligencia Artificial (Segundo Parcial)
 *
 * Modules:
 *  1. KNN 2D: Continuous pointer dragging (60 fps), expanding wave ripple (rAF),
 *     safe d -> 0 weighting (w = 1e6), paradox badge & KaTeX formulas.
 *  2. Hopfield 5x5: Freehand drag brush painting, synchronous vs asynchronous dynamics,
 *     flash pulses on flipped neurons, Lyapunov energy curve with shaded area,
 *     fixed point vs limit cycle detection & KaTeX formulas.
 *  3. SOM Kohonen 2D: Smooth mesh node interpolation (rAF), training vs post-training
 *     inference mode (read-only BMU query), canonical alpha/sigma decay & KaTeX formulas.
 *  4. Clustering UPGMA: Size-weighted average linkage |C1|*|C2|, continuous horizontal
 *     cut height slider (h -> k clusters), translucent 2D hull capsules, SVG dendrogram & KaTeX.
 *  5. Genetic Algorithms: Realistic physics roulette wheel with inertial spin & ticking needle,
 *     exact [00..99] disjoint intervals, expected copies eta_i, generational step simulator
 *     with live max/avg fitness curves & KaTeX formulas.
 *  6. Speed Controllers (0.5x, 1x, 2x, Max) with leaktight timer/rAF lifecycle cleanup.
 *  7. Mini-Game: Authentic Exam Trap Hunter.
 */

(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.AlgoSandboxes = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // ---------------------------------------------------------------------------
  // General Utilities
  // ---------------------------------------------------------------------------
  function escapeHtml(str) {
    if (str === null || str === undefined) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function readThemeColors() {
    const isDark =
      typeof document !== "undefined" &&
      (document.documentElement.getAttribute("data-theme") === "dark" ||
        document.body.classList.contains("dark-mode"));

    if (typeof window === "undefined" || typeof getComputedStyle === "undefined") {
      return {
        isDark,
        bgCard: isDark ? "#1e293b" : "#ffffff",
        bgSubtle: isDark ? "#0f172a" : "#f8fafc",
        border: isDark ? "#334155" : "#e2e8f0",
        text: isDark ? "#f8fafc" : "#0f172a",
        muted: isDark ? "#94a3b8" : "#64748b",
        primary: isDark ? "#818cf8" : "#4f46e5",
        success: isDark ? "#34d399" : "#10b981",
        warning: isDark ? "#fbbf24" : "#f59e0b",
        danger: isDark ? "#f87171" : "#ef4444"
      };
    }

    const cs = getComputedStyle(document.documentElement);
    const get = (k, fb) => (cs.getPropertyValue(k) || "").trim() || fb;
    return {
      isDark,
      bgCard: get("--bg-card", isDark ? "#1e293b" : "#ffffff"),
      bgSubtle: get("--bg-subtle", isDark ? "#0f172a" : "#f8fafc"),
      border: get("--border-color", isDark ? "#334155" : "#e2e8f0"),
      text: get("--text-main", isDark ? "#f8fafc" : "#0f172a"),
      muted: get("--text-muted", isDark ? "#94a3b8" : "#64748b"),
      primary: get("--primary", isDark ? "#818cf8" : "#4f46e5"),
      success: get("--success", isDark ? "#34d399" : "#10b981"),
      warning: get("--warning", isDark ? "#fbbf24" : "#f59e0b"),
      danger: get("--danger", isDark ? "#f87171" : "#ef4444")
    };
  }

  function renderMathInSandbox(el) {
    if (!el || typeof window === "undefined") return;
    if (window.renderMathInElement) {
      try {
        window.renderMathInElement(el, {
          delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "$", right: "$", display: false },
            { left: "\\[", right: "\\]", display: true },
            { left: "\\(", right: "\\)", display: false }
          ],
          throwOnError: false
        });
      } catch (_) {}
    }
  }

  // ---------------------------------------------------------------------------
  // Leaktight Timer & Animation Lifecycle Manager
  // ---------------------------------------------------------------------------
  const trackedIntervals = new Set();
  const trackedTimeouts = new Set();
  const trackedRafs = new Set();

  function trackInterval(fn, ms) {
    const id = setInterval(fn, ms);
    trackedIntervals.add(id);
    return id;
  }

  function clearTrackedInterval(id) {
    if (id) {
      clearInterval(id);
      trackedIntervals.delete(id);
    }
  }

  function trackTimeout(fn, ms) {
    const id = setTimeout(() => {
      trackedTimeouts.delete(id);
      fn();
    }, ms);
    trackedTimeouts.add(id);
    return id;
  }

  function clearTrackedTimeout(id) {
    if (id) {
      clearTimeout(id);
      trackedTimeouts.delete(id);
    }
  }

  function trackRaf(cb) {
    let id;
    id = requestAnimationFrame((ts) => {
      trackedRafs.delete(id);
      cb(ts);
    });
    trackedRafs.add(id);
    return id;
  }

  function clearTrackedRaf(id) {
    if (id) {
      cancelAnimationFrame(id);
      trackedRafs.delete(id);
    }
  }

  function clearAllSandboxTimers() {
    trackedIntervals.forEach((id) => clearInterval(id));
    trackedIntervals.clear();
    trackedTimeouts.forEach((id) => clearTimeout(id));
    trackedTimeouts.clear();
    trackedRafs.forEach((id) => cancelAnimationFrame(id));
    trackedRafs.clear();
  }

  function renderSpeedSelectorHtml(currentSpeed, speedKeys = ["0.5x", "1x", "2x", "max"]) {
    return `
      <div class="sb-speed-ctl" title="Velocidad de ejecución">
        <span class="sb-speed-label">⏱ Ritmo:</span>
        <div class="sb-speed-buttons">
          ${speedKeys.map((k) => `
            <button type="button" class="sb-speed-btn ${currentSpeed === k ? "active" : ""}" data-sb-speed="${k}">
              ${k === "max" ? "⚡ Máx" : k}
            </button>
          `).join("")}
        </div>
      </div>
    `;
  }

  function getSpeedDelay(speedKey, baseMs = 300) {
    switch (speedKey) {
      case "0.5x": return Math.round(baseMs * 2);
      case "1x": return baseMs;
      case "2x": return Math.max(20, Math.round(baseMs / 2));
      case "max": return Math.max(16, Math.round(baseMs / 6));
      default: return baseMs;
    }
  }

  // ---------------------------------------------------------------------------
  // Pure Math: 1. KNN 2D
  // ---------------------------------------------------------------------------
  function computeKnnDecision(points, query, k = 3, weighted = true) {
    const safePts = Array.isArray(points) ? points : [];
    if (safePts.length === 0) {
      return { winner: "A", scoreA: 0, scoreB: 0, neighbors: [] };
    }

    const sorted = safePts
      .map((p) => {
        const dx = p.x - query.x;
        const dy = p.y - query.y;
        const d2 = dx * dx + dy * dy;
        const d = Math.sqrt(d2);
        // Protection against division by zero / singularity as d -> 0
        const w = d2 < 1e-10 ? 1e6 : (1 / d2);
        return { ...p, d, d2, w };
      })
      .sort((a, b) => a.d - b.d);

    const kClamped = Math.max(1, Math.min(k, sorted.length));
    const topK = sorted.slice(0, kClamped);
    let scoreA = 0;
    let scoreB = 0;

    topK.forEach((n) => {
      const add = weighted ? n.w : 1;
      if (n.cls === "A") scoreA += add;
      else scoreB += add;
    });

    let winner;
    if (Math.abs(scoreA - scoreB) < 1e-9) {
      winner = topK[0].cls;
    } else {
      winner = scoreA > scoreB ? "A" : "B";
    }

    return { winner, scoreA, scoreB, neighbors: topK };
  }

  // ---------------------------------------------------------------------------
  // Pure Math: 2. Hopfield 5x5 (25 Neurons)
  // ---------------------------------------------------------------------------
  const HOPFIELD_PATTERNS = {
    T: [
      1,  1,  1,  1,  1,
     -1, -1,  1, -1, -1,
     -1, -1,  1, -1, -1,
     -1, -1,  1, -1, -1,
     -1, -1,  1, -1, -1
    ],
    X: [
      1, -1, -1, -1,  1,
     -1,  1, -1,  1, -1,
     -1, -1,  1, -1, -1,
     -1,  1, -1,  1, -1,
      1, -1, -1, -1,  1
    ],
    L: [
      1, -1, -1, -1, -1,
      1, -1, -1, -1, -1,
      1, -1, -1, -1, -1,
      1, -1, -1, -1, -1,
      1,  1,  1,  1,  1
    ],
    C: [
      1,  1,  1,  1,  1,
      1, -1, -1, -1, -1,
      1, -1, -1, -1, -1,
      1, -1, -1, -1, -1,
      1,  1,  1,  1,  1
    ]
  };

  function buildHopfieldWeights(patternKeys) {
    const N = 25;
    const W = Array.from({ length: N }, () => new Array(N).fill(0));
    const pats = (patternKeys || [])
      .map((k) => (Array.isArray(k) ? k : HOPFIELD_PATTERNS[k]))
      .filter((p) => Array.isArray(p) && p.length === N);

    if (pats.length === 0) return W;

    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        if (i === j) {
          W[i][j] = 0; // Strict zero diagonal
        } else {
          let sum = 0;
          for (let p = 0; p < pats.length; p++) {
            sum += pats[p][i] * pats[p][j];
          }
          W[i][j] = sum;
        }
      }
    }
    return W;
  }

  function computeHopfieldEnergy(state, W) {
    const N = state.length;
    let E = 0;
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        E += W[i][j] * state[i] * state[j];
      }
    }
    return -0.5 * E;
  }

  function stepHopfield(state, W) {
    const N = state.length;
    const next = new Array(N);
    const nets = new Array(N);
    const changedIndices = [];

    for (let i = 0; i < N; i++) {
      let net = 0;
      for (let j = 0; j < N; j++) {
        net += W[i][j] * state[j];
      }
      nets[i] = net;
      const sNew = net > 0 ? 1 : (net < 0 ? -1 : state[i]);
      next[i] = sNew;
      if (sNew !== state[i]) changedIndices.push(i);
    }

    const energy = computeHopfieldEnergy(next, W);
    return {
      nextState: next,
      changed: changedIndices.length,
      changedIndices,
      nets,
      energy,
      converged: changedIndices.length === 0
    };
  }

  function stepHopfieldAsync(state, W, neuronIdx = null) {
    const N = state.length;
    const next = [...state];
    let chosen = neuronIdx;
    if (chosen === null || chosen < 0 || chosen >= N) {
      const discordant = [];
      for (let i = 0; i < N; i++) {
        let net = 0;
        for (let j = 0; j < N; j++) net += W[i][j] * state[j];
        const sNew = net > 0 ? 1 : (net < 0 ? -1 : state[i]);
        if (sNew !== state[i]) discordant.push({ idx: i, diff: Math.abs(net) });
      }
      if (discordant.length > 0) {
        discordant.sort((a, b) => b.diff - a.diff);
        chosen = discordant[0].idx;
      } else {
        chosen = Math.floor(Math.random() * N);
      }
    }

    let net = 0;
    for (let j = 0; j < N; j++) net += W[chosen][j] * state[j];
    const sNew = net > 0 ? 1 : (net < 0 ? -1 : state[chosen]);
    const changed = sNew !== state[chosen];
    next[chosen] = sNew;
    const energy = computeHopfieldEnergy(next, W);

    return {
      nextState: next,
      changed: changed ? 1 : 0,
      changedIdx: chosen,
      net,
      energy,
      converged: !changed
    };
  }

  function detectHopfieldAttractor(state, history) {
    if (!history || history.length === 0) return { type: "transient", period: null };
    const curKey = state.join(",");
    const lastKey = history[history.length - 1];
    if (curKey === lastKey) {
      return { type: "fixed_point", period: 1 };
    }
    if (history.length >= 2 && curKey === history[history.length - 2]) {
      return { type: "cycle", period: 2 };
    }
    return { type: "transient", period: null };
  }

  // ---------------------------------------------------------------------------
  // Pure Math: 3. SOM (Kohonen 2D)
  // ---------------------------------------------------------------------------
  function somStep(neurons, p, alpha = 0.4, sigma = 0.9) {
    let bmuIdx = 0;
    let minDist = Infinity;
    neurons.forEach((n, idx) => {
      const d = Math.hypot(p.x - n.x, p.y - n.y);
      if (d < minDist) {
        minDist = d;
        bmuIdx = idx;
      }
    });

    const bmu = neurons[bmuIdx];
    const updated = neurons.map((n, idx) => {
      const gridDist = Math.hypot(n.gx - bmu.gx, n.gy - bmu.gy);
      const h = Math.exp(-(gridDist * gridDist) / (2 * sigma * sigma));
      const nx = n.x + alpha * h * (p.x - n.x);
      const ny = n.y + alpha * h * (p.y - n.y);
      return {
        ...n,
        x: Math.max(0.04, Math.min(0.96, nx)),
        y: Math.max(0.04, Math.min(0.96, ny)),
        lastH: h,
        isBmu: idx === bmuIdx
      };
    });

    return { neurons: updated, bmuIdx, bmuLabel: bmu.label, minDist };
  }

  function somInference(neurons, query) {
    if (!neurons || neurons.length === 0) return null;
    let bmuIdx = 0;
    let minDist = Infinity;
    const distances = [];

    neurons.forEach((n, idx) => {
      const d = Math.hypot(query.x - n.x, query.y - n.y);
      distances.push({ idx, label: n.label, d, x: n.x, y: n.y });
      if (d < minDist) {
        minDist = d;
        bmuIdx = idx;
      }
    });

    const bmu = neurons[bmuIdx];
    const affinity = Math.exp(-(minDist * minDist) / (2 * 0.3 * 0.3));

    return {
      bmu,
      bmuIdx,
      bmuLabel: bmu.label,
      distance: minDist,
      affinity,
      distances
    };
  }

  function computeSomDecay(step, maxSteps, alpha0 = 0.5, sigma0 = 1.2, minAlpha = 0.04, minSigma = 0.35) {
    const s = Math.max(0, Math.min(step, maxSteps));
    const factor = 1 - (s / Math.max(1, maxSteps));
    const alpha = Math.max(minAlpha, +(alpha0 * factor).toFixed(3));
    const sigma = Math.max(minSigma, +(sigma0 * factor).toFixed(3));
    return { alpha, sigma };
  }

  // ---------------------------------------------------------------------------
  // Pure Math: 4. Clustering UPGMA
  // ---------------------------------------------------------------------------
  function computeUpgmaTree(points) {
    if (!points || points.length === 0) return { root: null, merges: [] };
    const origDist = Array.from({ length: points.length }, (_, i) =>
      Array.from({ length: points.length }, (_, j) =>
        i === j ? 0 : Math.hypot(points[i].x - points[j].x, points[i].y - points[j].y)
      )
    );

    let active = points.map((p, idx) => ({
      id: p.label,
      members: [idx],
      height: 0,
      left: null,
      right: null
    }));

    const merges = [];

    while (active.length > 1) {
      let bestDist = Infinity;
      let bestI = 0;
      let bestJ = 1;

      for (let i = 0; i < active.length; i++) {
        for (let j = i + 1; j < active.length; j++) {
          let sum = 0;
          active[i].members.forEach((m1) => {
            active[j].members.forEach((m2) => {
              sum += origDist[m1][m2];
            });
          });
          const avg = sum / (active[i].members.length * active[j].members.length);
          if (avg < bestDist) {
            bestDist = avg;
            bestI = i;
            bestJ = j;
          }
        }
      }

      const c1 = active[bestI];
      const c2 = active[bestJ];
      const merged = {
        id: `{${c1.id},${c2.id}}`,
        members: [...c1.members, ...c2.members],
        height: bestDist,
        left: c1,
        right: c2,
        c1Label: c1.id,
        c2Label: c2.id,
        size1: c1.members.length,
        size2: c2.members.length
      };
      merges.push(merged);
      active = active.filter((_, idx) => idx !== bestI && idx !== bestJ);
      active.push(merged);
    }
    return { root: active[0], merges, origDist };
  }

  function computeClustersAtCutHeight(tree, nPoints, cutHeight) {
    const CLUSTER_PALETTE = ["#10b981", "#f59e0b", "#6366f1", "#ec4899", "#06b6d4", "#8b5cf6", "#ef4444"];
    if (!tree || !tree.merges) {
      const groups = Array.from({ length: nPoints }, (_, i) => [i]);
      return { groups, k: nPoints, colorByIdx: new Array(nPoints).fill(CLUSTER_PALETTE[0]) };
    }

    let groups = Array.from({ length: nPoints }, (_, i) => [i]);
    const activeMerges = tree.merges.filter((m) => m.height <= cutHeight);

    activeMerges.forEach((m) => {
      const mSet = new Set(m.members);
      groups = groups.filter((g) => !mSet.has(g[0]));
      groups.push([...m.members]);
    });

    const colorByIdx = new Array(nPoints).fill(CLUSTER_PALETTE[0]);
    groups.forEach((grp, gIdx) => {
      const col = CLUSTER_PALETTE[gIdx % CLUSTER_PALETTE.length];
      grp.forEach((ptIdx) => { colorByIdx[ptIdx] = col; });
    });

    return { groups, k: groups.length, colorByIdx };
  }

  // ---------------------------------------------------------------------------
  // Pure Math: 5. Genetic Algorithms (Ruleta [00..99] & Generaciones)
  // ---------------------------------------------------------------------------
  function computeAgRoulette(fitnessArr) {
    const f = (fitnessArr || [20, 45, 25, 10]).map((v) => Math.max(1, Number(v) || 1));
    const sum = f.reduce((a, b) => a + b, 0);
    const n = f.length;
    let cum = 0;
    let nextStart = 0;
    const rows = f.map((val, idx) => {
      const p = val / sum;
      cum += p;
      const startSlot = nextStart;
      const endSlot = idx === n - 1
        ? 99
        : Math.min(99 - (n - 1 - idx), Math.max(startSlot, Math.round(cum * 100) - 1));
      nextStart = endSlot + 1;
      const eta = p * n;
      return {
        id: `I${idx + 1}`,
        fitness: val,
        p,
        eta,
        intCopies: Math.floor(eta),
        frac: eta - Math.floor(eta),
        startSlot,
        endSlot
      };
    });
    return { sum, mean: sum / n, rows };
  }

  function computeAgExpectedCopies(fitnessArr, N = (fitnessArr ? fitnessArr.length : 4)) {
    const roulette = computeAgRoulette(fitnessArr);
    return roulette.rows.map((r) => ({
      id: r.id,
      fitness: r.fitness,
      p: r.p,
      eta: r.p * N,
      intCopies: Math.floor(r.p * N),
      frac: (r.p * N) - Math.floor(r.p * N)
    }));
  }

  function simulateAgGenerationStep(population, fitnesses, opts = {}) {
    const pop = population || ["10110", "01101", "11001", "00111"];
    const fits = fitnesses || [20, 45, 25, 10];
    const N = pop.length;
    const roulette = computeAgRoulette(fits);
    const Pc = opts.Pc !== undefined ? opts.Pc : 0.85;
    const Pm = opts.Pm !== undefined ? opts.Pm : 0.05;

    // Roulette selection for N individuals
    const selected = [];
    for (let i = 0; i < N; i++) {
      const r = Math.floor(Math.random() * 100);
      const match = roulette.rows.find((row) => r >= row.startSlot && r <= row.endSlot) || roulette.rows[0];
      const matchIdx = roulette.rows.indexOf(match);
      selected.push(pop[matchIdx]);
    }

    // Pairwise 1-point crossover
    const newPop = [];
    const crossoverLog = [];
    for (let i = 0; i < N; i += 2) {
      const p1 = selected[i];
      const p2 = selected[i + 1] || selected[0];
      if (Math.random() < Pc && p1.length > 1) {
        const cut = 1 + Math.floor(Math.random() * (p1.length - 1));
        const c1 = p1.slice(0, cut) + p2.slice(cut);
        const c2 = p2.slice(0, cut) + p1.slice(cut);
        newPop.push(c1);
        if (newPop.length < N) newPop.push(c2);
        crossoverLog.push({ p1, p2, c1, c2, cut });
      } else {
        newPop.push(p1);
        if (newPop.length < N) newPop.push(p2);
      }
    }

    // Bit mutation
    const mutated = newPop.map((chromo) => {
      let res = "";
      for (let b = 0; b < chromo.length; b++) {
        if (Math.random() < Pm) {
          res += chromo[b] === "1" ? "0" : "1";
        } else {
          res += chromo[b];
        }
      }
      return res;
    });

    const newFits = mutated.map((c) => Math.max(5, Math.min(95, Math.round(parseInt(c, 2) * 2.8 + 8))));
    const maxFitness = Math.max(...newFits);
    const avgFitness = +(newFits.reduce((a, b) => a + b, 0) / newFits.length).toFixed(1);

    return {
      newPopulation: mutated,
      newFitnesses: newFits,
      maxFitness,
      avgFitness,
      crossoverLog
    };
  }

  function simulateAgGenerations(fitnessArr, gens = 10) {
    let pop = (fitnessArr || [20, 45, 25, 10]).map((v) => Math.max(1, Number(v) || 1));
    const history = [];
    for (let g = 0; g <= gens; g++) {
      const avg = pop.reduce((a, b) => a + b, 0) / pop.length;
      const max = Math.max(...pop);
      history.push({ gen: g, avg: +avg.toFixed(1), max: +max.toFixed(1) });
      const sorted = [...pop].sort((a, b) => b - a);
      pop = [
        sorted[0],
        sorted[0],
        Math.round((sorted[0] + sorted[1]) / 2) + (g % 2 === 0 ? 2 : 1),
        Math.round((sorted[1] + sorted[2]) / 2) + 2
      ];
    }
    return history;
  }

  // ---------------------------------------------------------------------------
  // 10 Authentic Exam Trap Cases ("Cazador de Trampas de Parcial")
  // ---------------------------------------------------------------------------
  const TRAP_CASES = [
    {
      id: "trap_som_w0",
      topic: "SOM",
      title: "Actualización secuencial con 2 patrones (p1 y p2)",
      lines: [
        "1) Para p1=[0.8, 0.2], mido distancias a W(0) y gana N2 (d=0.14).",
        "2) Actualizo BMU N2 y sus vecinas N1, N3 obteniendo W(1).",
        "3) Para el segundo patrón p2=[0.2, 0.9], evalúo distancias contra W(0) inicial.",
        "4) Elijo la neurona ganadora j*2 que minimizó esa distancia."
      ],
      trapLineIdx: 2,
      explanation: "¡Trampa clásica de SOM online! Cada patrón actualiza los pesos inmediatamente: p2 DEBE evaluarse contra W(1) actualizado, nunca contra W(0)."
    },
    {
      id: "trap_hop_diag",
      topic: "HOPFIELD",
      title: "Construcción de matriz de pesos Hebbiana (N=5)",
      lines: [
        "1) Convierto patrones binarios {0, 1} a bipolares {-1, +1}.",
        "2) Sumo los productos externos W = E1·E1ᵀ + E2·E2ᵀ.",
        "3) Dejo los valores de la diagonal principal w_ii = M (cantidad de patrones).",
        "4) Presento el patrón con ruido y calculo net_i = Σ w_ij · s_j."
      ],
      trapLineIdx: 2,
      explanation: "¡Trampa fatal en Hopfield! Las neuronas NO tienen autoconexión: la diagonal principal DEBE anularse (w_ii = 0), caso contrario la red se auto-refuerza en mínimos espurios."
    },
    {
      id: "trap_clust_upgma",
      topic: "CLUSTERING",
      title: "Recálculo Average Linkage al unir {A, B} (|C1|=2) con {C} (|C2|=1)",
      lines: [
        "1) En la matriz D0 busqué el menor par y uní {A, B} a altura d1 = 1.2.",
        "2) Para la distancia del nuevo cluster {A, B} hacia {C} ya conozco d(A,C)=4.0 y d(B,C)=2.5.",
        "3) Al fusionar {A, B} con {C}, su nueva distancia a {D} es ½·[d(AB, D) + d(C, D)].",
        "4) Continúo buscando el nuevo mínimo en la matriz reducida."
      ],
      trapLineIdx: 2,
      explanation: "¡Trampa #5 UPGMA! Al unir clusters de distinto tamaño (|C1|=2, |C2|=1), NO se hace promedio simple ½(d1+d2): hay que ponderar por cantidad de elementos: (2·d(AB,D) + 1·d(C,D)) / (2+1) o promediar todos los pares originales / (|C1|·|C2|)."
    },
    {
      id: "trap_mlp_moment",
      topic: "MLP",
      title: "Regla de actualización de pesos en MLP Sigmoide (Criterio 2026)",
      lines: [
        "1) Propago hacia adelante usando σ(net) = 1 / (1 + e^(-net)).",
        "2) Calculo la derivada de salida como f'(net_y) = o_y · (1 − o_y).",
        "3) Obtengo δ_y = (d − o_y) · f'(net_y) y retropropago a la capa oculta.",
        "4) Actualizo con momento obligatorio: Δw(t) = α·δ·x + μ·Δw(t−1) con μ=0.9."
      ],
      trapLineIdx: 3,
      explanation: "¡Ojo con guías viejas! En el cursado 2026 el MLP evalúa actualización SIN término de momento (μ = 0): w_nuevo = w + α · δ · entrada."
    },
    {
      id: "trap_ag_roulette",
      topic: "AG",
      title: "Armado de tabla de ruleta [00–99] para selección",
      lines: [
        "1) Sumo los fitness: f=[20, 50, 30] -> Σf = 100.",
        "2) Calculo probabilidades p_1=0.20, p_2=0.50, p_3=0.30.",
        "3) Asigno intervalos: I1=[00–20], I2=[20–70], I3=[70–99].",
        "4) Con r=20, cae dentro del rango de selección."
      ],
      trapLineIdx: 2,
      explanation: "¡Error de bordes en Ruleta! Si I1 termina en 20 e I2 empieza en 20, el valor r=20 queda ambiguo (y suman 101 slots). Los intervalos deben ser disjuntos: [00–19], [20–69], [70–99]."
    },
    {
      id: "trap_knn_majority",
      topic: "KNN",
      title: "Clasificación con K-NN Ponderado (1/d²) para k=3",
      lines: [
        "1) Ordeno distancias a q: A (d=1.0), B1 (d=3.0), B2 (d=3.0).",
        "2) Tomo los k=3 vecinos más cercanos: {A, B1, B2}.",
        "3) Cuento 2 vecinos de B vs 1 de A, por lo tanto el KNN ponderado predice B.",
        "4) Reporto el resultado final comparando ambas clases."
      ],
      trapLineIdx: 2,
      explanation: "¡No confundas KNN simple con ponderado 1/d²! Aquí w_A = 1/1² = 1.000, mientras w_B = 1/9 + 1/9 = 0.222. Gana A ampliamente por cercanía."
    },
    {
      id: "trap_nb_laplace",
      topic: "NAIVE_BAYES",
      title: "Verosimilitud discreta cuando una combinación tiene 0 ejemplos",
      lines: [
        "1) En Clase C2 hay 4 registros totales y el atributo X toma 3 posibles valores.",
        "2) Para X='Alto' dentro de C2 encuentro 0 ocurrencias en la tabla.",
        "3) Multiplico P(C2) · (0 / 4) · P(Y|C2) = 0, descartando C2 por completo.",
        "4) Normalizo las probabilidades posteriores sobre las demás clases."
      ],
      trapLineIdx: 2,
      explanation: "¡Cero mortal en Naïve Bayes! Si hay frecuencia 0 debés aplicar Suavizado de Laplace (m-estimador): P(X|Ck) = (count + 1) / (N_k + |V|), nunca dejar 0 que anula todo el producto."
    },
    {
      id: "trap_hop_net0",
      topic: "HOPFIELD",
      title: "Evaluación de función de activación cuando net_i = 0",
      lines: [
        "1) Con estado actual s(t) = [+1, -1, +1, -1, +1], multiplico fila 2 por s(t).",
        "2) La suma ponderada da exactamente net_2 = (+1) + (-1) = 0.",
        "3) Por convención asigno s_2(t+1) = +1 por defecto aunque valga -1.",
        "4) Continúo evaluando net_3, net_4 y net_5."
      ],
      trapLineIdx: 2,
      explanation: "¡Trampa de cátedra UTN! En Hopfield cuando net_i = 0 la neurona NO cambia ni fuerza +1: CONSERVA su estado previo s_i(t+1) = s_i(t) (en este caso sigue siendo -1)."
    },
    {
      id: "trap_som_neighbor",
      topic: "SOM",
      title: "Actualización de neuronas vecinas con vecindad continua",
      lines: [
        "1) Encuentro que N1 es la BMU para el patrón p1.",
        "2) Calculo el nuevo peso W1(1) = W1(0) + α·1·(p1 − W1(0)).",
        "3) Como N2 y N3 no ganaron la competencia, sus pesos quedan idénticos a W(0).",
        "4) Paso al segundo patrón usando los nuevos pesos."
      ],
      trapLineIdx: 2,
      explanation: "¡Olvidaste la vecindad SOM! Eso sería WTA duro (K-Means/Winner-Takes-All), NO Kohonen: en SOM con vecindad continua h(j,j*) = 1/(1+d) las vecinas también se mueven hacia p1."
    },
    {
      id: "trap_nb_norm",
      topic: "NAIVE_BAYES",
      title: "Interpretación de probabilidad posterior normalizada MAP",
      lines: [
        "1) Calculo score sin normalizar L(C1) = P(C1)·P(x|C1) = 0.045.",
        "2) Calculo score sin normalizar L(C2) = P(C2)·P(x|C2) = 0.015.",
        "3) Respondo que la probabilidad posterior de C1 es 4.5%.",
        "4) Concluyo que C1 es la clase ganadora."
      ],
      trapLineIdx: 2,
      explanation: "¡Falta dividir por la evidencia! L(Ck) es el numerador conjunto (no suma 1). La posterior normalizada real es P(C1|x) = 0.045 / (0.045 + 0.015) = 0.75 (75%), no 4.5%."
    }
  ];

  // ---------------------------------------------------------------------------
  // 1. Live Interactive Sandbox: KNN 2D (Drag & Drop, Shockwave, KaTeX)
  // ---------------------------------------------------------------------------
  function mountKnnSandbox(hostEl) {
    clearAllSandboxTimers();

    const PRESETS = {
      classic: {
        points: [
          { x: 0.48, y: 0.50, cls: "A" },
          { x: 0.25, y: 0.30, cls: "A" },
          { x: 0.72, y: 0.36, cls: "B" },
          { x: 0.74, y: 0.68, cls: "B" },
          { x: 0.62, y: 0.80, cls: "B" },
          { x: 0.28, y: 0.72, cls: "A" }
        ],
        query: { x: 0.55, y: 0.52 },
        k: 3
      },
      reversal: {
        points: [
          { x: 0.46, y: 0.50, cls: "A" },
          { x: 0.72, y: 0.38, cls: "B" },
          { x: 0.70, y: 0.66, cls: "B" },
          { x: 0.16, y: 0.24, cls: "A" },
          { x: 0.85, y: 0.84, cls: "B" }
        ],
        query: { x: 0.51, y: 0.50 },
        k: 3
      },
      nonlinear: {
        points: [
          { x: 0.50, y: 0.50, cls: "A" },
          { x: 0.42, y: 0.44, cls: "A" },
          { x: 0.58, y: 0.56, cls: "A" },
          { x: 0.20, y: 0.20, cls: "B" },
          { x: 0.80, y: 0.22, cls: "B" },
          { x: 0.22, y: 0.80, cls: "B" },
          { x: 0.78, y: 0.78, cls: "B" }
        ],
        query: { x: 0.48, y: 0.53 },
        k: 5
      }
    };

    const state = {
      preset: "classic",
      points: PRESETS.classic.points.map((p) => ({ ...p })),
      query: { ...PRESETS.classic.query },
      tool: "query", // "query" | "A" | "B"
      k: PRESETS.classic.k,
      weighted: true,
      showMap: true,
      speed: "1x",
      isDragging: false,
      wave: {
        active: false,
        r: 0,
        maxR: 0,
        alpha: 0
      }
    };

    let waveRafId = null;

    const triggerShockwave = (maxRadiusPx) => {
      if (state.speed === "max") {
        state.wave.active = false;
        return;
      }
      state.wave.active = true;
      state.wave.r = 0;
      state.wave.maxR = Math.max(15, maxRadiusPx);
      state.wave.alpha = 0.75;

      const stepSpeed = state.speed === "0.5x" ? 0.035 : (state.speed === "2x" ? 0.09 : 0.055);

      if (waveRafId) cancelAnimationFrame(waveRafId);

      const animate = () => {
        if (!state.wave.active) return;
        state.wave.r += (state.wave.maxR - state.wave.r) * stepSpeed + 1.2;
        state.wave.alpha *= 0.94;
        if (state.wave.r >= state.wave.maxR * 0.96 || state.wave.alpha <= 0.05) {
          state.wave.active = false;
          draw();
          return;
        }
        draw();
        waveRafId = trackRaf(animate);
      };
      waveRafId = trackRaf(animate);
    };

    const draw = () => {
      const canvas = hostEl.querySelector("#sb-knn-canvas");
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      const W = canvas.width;
      const H = canvas.height;
      const c = readThemeColors();

      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = c.bgSubtle;
      ctx.fillRect(0, 0, W, H);

      // Decision region heatmap
      if (state.showMap) {
        const step = 8;
        for (let px = 0; px < W; px += step) {
          for (let py = 0; py < H; py += step) {
            const res = computeKnnDecision(state.points, { x: px / W, y: py / H }, state.k, state.weighted);
            ctx.fillStyle = res.winner === "A" ? "rgba(16, 185, 129, 0.16)" : "rgba(245, 158, 11, 0.16)";
            ctx.fillRect(px, py, step, step);
          }
        }
      }

      // Axis ticks
      ctx.strokeStyle = c.border;
      ctx.globalAlpha = 0.35;
      ctx.lineWidth = 1;
      for (let i = 1; i < 5; i++) {
        ctx.beginPath(); ctx.moveTo((W * i) / 5, 0); ctx.lineTo((W * i) / 5, H); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, (H * i) / 5); ctx.lineTo(W, (H * i) / 5); ctx.stroke();
      }
      ctx.globalAlpha = 0.75;
      ctx.fillStyle = c.muted;
      ctx.font = "600 9px sans-serif";
      ctx.textAlign = "center";
      for (let i = 1; i < 5; i++) {
        ctx.fillText(String(i * 2), (W * i) / 5, H - 5);
        ctx.fillText(String(10 - i * 2), 10, (H * i) / 5 + 3);
      }
      ctx.globalAlpha = 1;

      const decision = computeKnnDecision(state.points, state.query, state.k, state.weighted);
      const simpleDecision = computeKnnDecision(state.points, state.query, state.k, false);
      const weightedDecision = computeKnnDecision(state.points, state.query, state.k, true);
      const reversedByWeight = simpleDecision.winner !== weightedDecision.winner;

      const qx = state.query.x * W;
      const qy = state.query.y * H;

      // Dashed lines + radius to k-th neighbor
      let kNeighborPx = 30;
      if (decision.neighbors.length > 0) {
        const maxD = decision.neighbors[decision.neighbors.length - 1];
        kNeighborPx = Math.hypot((maxD.x - state.query.x) * W, (maxD.y - state.query.y) * H);

        ctx.beginPath();
        ctx.arc(qx, qy, kNeighborPx, 0, Math.PI * 2);
        ctx.strokeStyle = c.primary;
        ctx.setLineDash([5, 4]);
        ctx.lineWidth = 1.6;
        ctx.stroke();
        ctx.setLineDash([]);

        decision.neighbors.forEach((nb) => {
          ctx.beginPath();
          ctx.moveTo(qx, qy);
          ctx.lineTo(nb.x * W, nb.y * H);
          ctx.strokeStyle = nb.cls === "A" ? c.success : c.warning;
          ctx.lineWidth = 1.8;
          ctx.stroke();
        });
      }

      // Animated shockwave circle
      if (state.wave.active && state.wave.r > 0) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(qx, qy, state.wave.r, 0, Math.PI * 2);
        ctx.strokeStyle = c.danger;
        ctx.lineWidth = 2.4;
        ctx.globalAlpha = state.wave.alpha;
        ctx.stroke();
        ctx.restore();
      }

      // Training points
      state.points.forEach((p) => {
        const x = p.x * W;
        const y = p.y * H;
        ctx.beginPath();
        ctx.arc(x, y, 7.5, 0, Math.PI * 2);
        ctx.fillStyle = p.cls === "A" ? c.success : c.warning;
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = c.bgCard;
        ctx.stroke();
        ctx.fillStyle = "#fff";
        ctx.font = "bold 9px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(p.cls, x, y + 0.5);
      });

      // Query point diamond (highlight if dragging)
      ctx.save();
      ctx.beginPath();
      const diamondR = state.isDragging ? 12 : 9.5;
      ctx.moveTo(qx, qy - diamondR);
      ctx.lineTo(qx + diamondR, qy);
      ctx.lineTo(qx, qy + diamondR);
      ctx.lineTo(qx - diamondR, qy);
      ctx.closePath();
      ctx.fillStyle = c.danger;
      ctx.fill();
      ctx.lineWidth = state.isDragging ? 3 : 2;
      ctx.strokeStyle = "#fff";
      ctx.stroke();
      ctx.restore();

      // Side readout
      const readoutEl = hostEl.querySelector("#sb-knn-readout");
      if (readoutEl) {
        const totalScore = Math.max(0.0001, decision.scoreA + decision.scoreB);
        const pctA = Math.round((decision.scoreA / totalScore) * 100);
        const pctB = 100 - pctA;

        const sumA10 = decision.neighbors
          .filter((n) => n.cls === "A")
          .reduce((s, n) => s + (state.weighted ? n.w : 1), 0);
        const sumB10 = decision.neighbors
          .filter((n) => n.cls === "B")
          .reduce((s, n) => s + (state.weighted ? n.w : 1), 0);

        const nbRows = decision.neighbors
          .map((nb, i) => `
          <tr>
            <td>#${i + 1}</td>
            <td><span class="sb-dot-${nb.cls}">● ${nb.cls}</span></td>
            <td class="vw-tabular">${(nb.d * 10).toFixed(2)}</td>
            <td class="vw-tabular">${state.weighted ? (nb.w > 1e4 ? "10⁶ (d→0)" : (1 / Math.max(0.001, (nb.d * 10) ** 2)).toFixed(3)) : "1"}</td>
          </tr>
        `)
          .join("");

        readoutEl.innerHTML = `
          <div class="sb-verdict-box" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.45rem;">
            <span>Consulta <strong>q = (${(state.query.x * 10).toFixed(1)}, ${((1 - state.query.y) * 10).toFixed(1)})</strong> · k=${state.k}</span>
            <span class="sb-winner-pill cls-${decision.winner === "A" ? "a" : "b"}">Gana Clase ${decision.winner}</span>
          </div>
          <div class="sb-formula-box">
            <strong>${state.weighted ? "Ponderación por distancia (1/d²):" : "Conteo simple:"}</strong>
            <span class="vw-tabular"> Score(A) = ${sumA10 > 1e4 ? "10⁶" : sumA10.toFixed(state.weighted ? 3 : 0)} vs Score(B) = ${sumB10 > 1e4 ? "10⁶" : sumB10.toFixed(state.weighted ? 3 : 0)}</span>
            ${
              reversedByWeight
                ? `<div style="margin-top:0.35rem;color:var(--primary);font-weight:700;">⚖️ ¡Paradoja de Cátedra activa! Mayoría Simple da ${simpleDecision.winner} pero 1/d² revierte a ${weightedDecision.winner}.</div>`
                : ""
            }
            <div style="margin-top:0.35rem;font-size:0.78rem;color:var(--text-muted);">
              $$w_i = \\frac{1}{d(q, x_i)^2} \\quad \\text{si } d < 10^{-5} \\implies w_i = 10^6$$
            </div>
          </div>
          <div class="sb-bar-group">
            <div class="sb-bar-row">
              <div class="sb-bar-meta"><span>Clase A</span><span class="vw-tabular">${pctA}%</span></div>
              <div class="sb-bar-track"><div class="sb-bar-fill" style="width:${pctA}%;background:var(--success);"></div></div>
            </div>
            <div class="sb-bar-row">
              <div class="sb-bar-meta"><span>Clase B</span><span class="vw-tabular">${pctB}%</span></div>
              <div class="sb-bar-track"><div class="sb-bar-fill" style="width:${pctB}%;background:var(--warning);"></div></div>
            </div>
          </div>
          <div class="pe-table-wrap">
            <table class="pe-data-table">
              <thead><tr><th>Vecino</th><th>Clase</th><th>d(q,x)</th><th>Peso</th></tr></thead>
              <tbody>${nbRows}</tbody>
            </table>
          </div>
        `;
        renderMathInSandbox(readoutEl);
      }
    };

    const renderShell = () => {
      hostEl.innerHTML = `
        <div class="sb-toolbar">
          <div class="sb-btn-group">
            <button type="button" class="pe-mode-pill ${state.tool === "query" ? "active" : ""}" data-tool="query">📍 Arrastrar q</button>
            <button type="button" class="pe-mode-pill ${state.tool === "A" ? "active" : ""}" data-tool="A">🟢 Punto A</button>
            <button type="button" class="pe-mode-pill ${state.tool === "B" ? "active" : ""}" data-tool="B">🟠 Punto B</button>
            <button type="button" class="btn btn-outline btn-sm" id="sb-knn-undo" ${state.points.length <= 2 ? "disabled" : ""}>↩ Deshacer</button>
          </div>
          <div class="sb-btn-group">
            <select id="sb-knn-preset" class="inline-input" title="Cargar escenario de parcial">
              <option value="classic" ${state.preset === "classic" ? "selected" : ""}>🎯 Caso clásico</option>
              <option value="reversal" ${state.preset === "reversal" ? "selected" : ""}>⚖️ Paradoja 1/d² (Parcial)</option>
              <option value="nonlinear" ${state.preset === "nonlinear" ? "selected" : ""}>🌀 Frontera no-lineal</option>
            </select>
            <label class="sb-inline-ctl">k:
              <select id="sb-knn-k" class="inline-input">${[1, 3, 5, 7].map((v) => `<option value="${v}" ${state.k === v ? "selected" : ""}>${v}</option>`).join("")}</select>
            </label>
            <button type="button" class="pe-mode-pill ${state.weighted ? "active" : ""}" id="sb-knn-mode">${state.weighted ? "⚖️ Ponderado 1/d²" : "🗳️ Mayoría Simple"}</button>
            <label class="sb-inline-ctl"><input type="checkbox" id="sb-knn-map" ${state.showMap ? "checked" : ""}/> Fronteras</label>
            ${renderSpeedSelectorHtml(state.speed, ["0.5x", "1x", "2x", "max"])}
          </div>
        </div>
        <div class="sb-split-grid">
          <div class="sb-canvas-wrap">
            <canvas id="sb-knn-canvas" width="460" height="320" class="sb-canvas" style="touch-action:none;cursor:${state.tool === "query" ? "grab" : "crosshair"};" title="Hacé clic o arrastrá para mover q"></canvas>
            <div class="sb-canvas-hint">💡 <strong>Arrastrá interactivamente</strong> el punto ◆ q a 60 fps para ver la onda expansiva y la actualización de probabilidades en vivo.</div>
          </div>
          <div id="sb-knn-readout" class="sb-readout-panel"></div>
        </div>
      `;

      hostEl.querySelectorAll("[data-tool]").forEach((btn) => {
        btn.addEventListener("click", () => {
          state.tool = btn.getAttribute("data-tool");
          renderShell();
        });
      });

      hostEl.querySelector("#sb-knn-preset").addEventListener("change", (e) => {
        const key = e.target.value;
        const p = PRESETS[key] || PRESETS.classic;
        state.preset = key;
        state.points = p.points.map((pt) => ({ ...pt }));
        state.query = { ...p.query };
        state.k = p.k;
        renderShell();
        triggerShockwave(60);
      });

      hostEl.querySelector("#sb-knn-undo").addEventListener("click", () => {
        if (state.points.length > 2) {
          state.points.pop();
          renderShell();
        }
      });

      hostEl.querySelector("#sb-knn-k").addEventListener("change", (e) => {
        state.k = Number(e.target.value) || 3;
        draw();
        triggerShockwave(70);
      });

      hostEl.querySelector("#sb-knn-mode").addEventListener("click", () => {
        state.weighted = !state.weighted;
        renderShell();
      });

      hostEl.querySelector("#sb-knn-map").addEventListener("change", (e) => {
        state.showMap = Boolean(e.target.checked);
        draw();
      });

      hostEl.querySelectorAll("[data-sb-speed]").forEach((btn) => {
        btn.addEventListener("click", () => {
          state.speed = btn.getAttribute("data-sb-speed");
          hostEl.querySelectorAll("[data-sb-speed]").forEach((b) => b.classList.toggle("active", b === btn));
        });
      });

      const canvas = hostEl.querySelector("#sb-knn-canvas");

      const handlePointerPos = (ev) => {
        const rect = canvas.getBoundingClientRect();
        const nx = Math.max(0.04, Math.min(0.96, (ev.clientX - rect.left) / rect.width));
        const ny = Math.max(0.04, Math.min(0.96, (ev.clientY - rect.top) / rect.height));
        return { nx, ny, px: (ev.clientX - rect.left), py: (ev.clientY - rect.top) };
      };

      canvas.addEventListener("pointerdown", (ev) => {
        const { nx, ny, px, py } = handlePointerPos(ev);
        const qPxX = state.query.x * canvas.width;
        const qPxY = state.query.y * canvas.height;
        const distToQ = Math.hypot(px - qPxX, py - qPxY);

        if (state.tool === "query" || distToQ <= 24) {
          state.isDragging = true;
          state.query = { x: nx, y: ny };
          canvas.style.cursor = "grabbing";
          try { canvas.setPointerCapture(ev.pointerId); } catch (_) {}
          draw();
        } else {
          state.points.push({ x: nx, y: ny, cls: state.tool });
          renderShell();
          triggerShockwave(50);
        }
      });

      canvas.addEventListener("pointermove", (ev) => {
        if (!state.isDragging) return;
        const { nx, ny } = handlePointerPos(ev);
        state.query = { x: nx, y: ny };
        draw();
      });

      const endDrag = (ev) => {
        if (state.isDragging) {
          state.isDragging = false;
          canvas.style.cursor = state.tool === "query" ? "grab" : "crosshair";
          try { canvas.releasePointerCapture(ev.pointerId); } catch (_) {}
          const maxD = computeKnnDecision(state.points, state.query, state.k, state.weighted).neighbors;
          const rPx = maxD.length > 0 ? Math.hypot((maxD[maxD.length - 1].x - state.query.x) * canvas.width, (maxD[maxD.length - 1].y - state.query.y) * canvas.height) : 40;
          triggerShockwave(rPx);
        }
      };

      canvas.addEventListener("pointerup", endDrag);
      canvas.addEventListener("pointercancel", endDrag);

      draw();
      triggerShockwave(50);
    };

    renderShell();
  }

  // ---------------------------------------------------------------------------
  // 2. Live Interactive Sandbox: Hopfield 5x5 (Continuous Paint, Flash, Dynamics, KaTeX)
  // ---------------------------------------------------------------------------
  function mountHopfieldSandbox(hostEl) {
    clearAllSandboxTimers();

    const state = {
      stored: ["T", "X"],
      grid: [...HOPFIELD_PATTERNS.T],
      energyHistory: [],
      stateHistory: [],
      stepCount: 0,
      lastChanged: null,
      changedSet: new Set(),
      dynamicsMode: "sync", // "sync" | "async"
      speed: "1x",
      isPainting: false,
      paintVal: 1,
      runningAuto: false
    };

    // Corrupt initial state
    state.grid[0] = -1;
    state.grid[6] = 1;
    state.grid[18] = 1;

    const computeCurrentNets = (grid, W) =>
      grid.map((_, i) => {
        let sum = 0;
        for (let j = 0; j < 25; j++) sum += W[i][j] * grid[j];
        return sum;
      });

    const recalcInitEnergy = () => {
      const W = buildHopfieldWeights(state.stored);
      state.energyHistory = [computeHopfieldEnergy(state.grid, W)];
      state.stateHistory = [state.grid.join(",")];
      state.stepCount = 0;
      state.lastChanged = null;
      state.changedSet = new Set();
    };
    recalcInitEnergy();

    const buildEnergySparkline = (hist) => {
      if (!hist || hist.length === 0) return "";
      const minE = Math.min(...hist, -320);
      const maxE = Math.max(...hist, 0);
      const span = Math.max(10, maxE - minE);

      const pts = hist
        .map((val, idx) => {
          const x = hist.length === 1 ? 130 : 20 + (idx / (hist.length - 1)) * 220;
          const y = 68 - ((val - minE) / span) * 50;
          return `${x.toFixed(1)},${y.toFixed(1)}`;
        })
        .join(" ");

      const firstX = hist.length === 1 ? 130 : 20;
      const lastX = hist.length === 1 ? 130 : 240;
      const areaPts = `${pts} ${lastX},72 ${firstX},72`;

      return `
        <svg viewBox="0 0 260 92" class="vw-svg-chart" aria-label="Energía de Lyapunov E(t)">
          <defs>
            <linearGradient id="sb-hop-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="var(--success)" stop-opacity="0.32" />
              <stop offset="100%" stop-color="var(--success)" stop-opacity="0.03" />
            </linearGradient>
          </defs>
          <line x1="20" y1="72" x2="240" y2="72" stroke="var(--border-color)" stroke-width="1" />
          ${hist.length >= 2 ? `<polygon points="${areaPts}" fill="url(#sb-hop-grad)" />` : ""}
          ${hist.length >= 2 ? `<polyline fill="none" stroke="var(--success)" stroke-width="2.4" points="${pts}" />` : ""}
          ${hist
            .map((val, idx) => {
              const x = hist.length === 1 ? 130 : 20 + (idx / (hist.length - 1)) * 220;
              const y = 68 - ((val - minE) / span) * 50;
              return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.6" fill="var(--primary)"><title>t=${idx}: E=${val.toFixed(1)}</title></circle>`;
            })
            .join("")}
          <text x="130" y="87" text-anchor="middle" font-size="9" fill="var(--text-muted)">Energía de Lyapunov E(t) — actual: ${hist[hist.length - 1].toFixed(0)}</text>
        </svg>
      `;
    };

    const render = () => {
      const W = buildHopfieldWeights(state.stored);
      const nets = computeCurrentNets(state.grid, W);
      const matches = Object.keys(HOPFIELD_PATTERNS).map((k) => {
        const pat = HOPFIELD_PATTERNS[k];
        const same = pat.filter((v, i) => v === state.grid[i]).length;
        const pct = Math.round((same / 25) * 100);
        return { key: k, pct, stored: state.stored.includes(k) };
      });

      const attractor = detectHopfieldAttractor(state.grid, state.stateHistory);
      const isFixedPoint = state.lastChanged === 0 || attractor.type === "fixed_point";
      const isCycle = attractor.type === "cycle";
      const capLimit = 0.138 * 25;
      const overloaded = state.stored.length > 3;

      hostEl.innerHTML = `
        <div class="sb-toolbar">
          <div class="sb-btn-group">
            <span style="font-size:0.84rem;font-weight:700;">Memorias (w_ii = 0):</span>
            ${["T", "X", "L", "C"].map((k) => `
              <button type="button" class="pe-mode-pill ${state.stored.includes(k) ? "active" : ""}" data-store="${k}">
                ${state.stored.includes(k) ? "✓ " : ""}${k}
              </button>
            `).join("")}
          </div>
          <div class="sb-btn-group">
            <span style="font-size:0.82rem;color:var(--text-muted);">Cargar:</span>
            ${["T", "X", "L", "C"].map((k) => `<button type="button" class="btn btn-outline btn-sm" data-load="${k}">${k}</button>`).join("")}
            <button type="button" class="btn btn-outline btn-sm" id="sb-hop-noise">🎲 +20% Ruido</button>
            <div class="sb-mode-toggle">
              <button type="button" class="sb-mode-btn ${state.dynamicsMode === "sync" ? "active" : ""}" data-dyn="sync">⚡ Síncrono</button>
              <button type="button" class="sb-mode-btn ${state.dynamicsMode === "async" ? "active" : ""}" data-dyn="async">🔀 Asíncrono</button>
            </div>
            ${renderSpeedSelectorHtml(state.speed, ["0.5x", "1x", "2x", "max"])}
          </div>
        </div>
        <div class="sb-split-grid">
          <div class="sb-canvas-wrap" style="text-align:center;">
            <div class="sb-hop-grid" id="sb-hop-grid" style="user-select:none;touch-action:none;">
              ${state.grid
                .map(
                  (v, i) => `
                <button type="button" class="sb-hop-cell ${v > 0 ? "on" : ""} ${state.changedSet.has(i) ? "hop-flash-flip just-changed" : ""}" data-cell="${i}" title="N${i + 1}: s=${v > 0 ? "+1" : "-1"} · net=${nets[i]}">${v > 0 ? "+1" : "−1"}</button>
              `
                )
                .join("")}
            </div>
            <div style="display:flex;justify-content:center;gap:0.5rem;flex-wrap:wrap;margin-top:0.75rem;">
              <button type="button" class="btn btn-outline btn-sm" id="sb-hop-step">⚡ 1 Paso ${state.dynamicsMode === "sync" ? "Síncrono" : "Asíncrono"}</button>
              <button type="button" class="btn btn-primary btn-sm" id="sb-hop-auto">${state.runningAuto ? "⏸ Pausar" : "▶ Auto-Converger"}</button>
              <button type="button" class="btn btn-outline btn-sm" id="sb-hop-clear">↺ Limpiar Grilla</button>
            </div>
            <div class="sb-canvas-hint">💡 <strong>Pincel libre:</strong> Hacé clic o <strong>arrastrá sobre la grilla</strong> para dibujar cualquier patrón y probar hacia qué atractor converge.</div>
          </div>
          <div class="sb-readout-panel">
            <div class="sb-verdict-box" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.45rem;">
              <span>Paso <strong>t = ${state.stepCount}</strong>${state.lastChanged !== null ? ` (${state.lastChanged} cambio${state.lastChanged === 1 ? "" : "s"})` : ""}</span>
              <span class="sb-winner-pill ${isFixedPoint ? "cls-a" : (isCycle ? "cls-b" : "")}">
                ${isFixedPoint ? "✅ Atractor estable (Punto fijo)" : (isCycle ? "🔄 Ciclo límite oscilante" : "⚡ En transición...")}
              </span>
            </div>
            <div class="sb-cap-meter ${overloaded ? "warn" : ""}">
              <strong>Capacidad Hebbiana:</strong> ${state.stored.length}/25 neuronas (límite canónico ≈ ${capLimit.toFixed(1)} patrones)
              ${overloaded ? ` · <span style="color:var(--warning);font-weight:700;">⚠️ Sobrecarga Hebbiana</span>` : ` · <span style="color:var(--success);font-weight:700;">Dentro del límite seguro</span>`}
            </div>
            ${buildEnergySparkline(state.energyHistory)}
            <div class="sb-formula-box">
              <strong>Regla UTN de Cátedra:</strong><br>
              $$s_i(t+1) = \\begin{cases} +1 & net_i > 0 \\\\ -1 & net_i < 0 \\\\ s_i(t) & net_i = 0 \\end{cases} \\quad E = -\\frac{1}{2} \\sum_{i \\neq j} w_{ij} s_i s_j$$
            </div>
            <div style="font-size:0.82rem;font-weight:700;">Similitud con memorias guardadas:</div>
            <div class="sb-bar-group" style="margin-top:0;">
              ${matches
                .filter((m) => m.stored || m.pct >= 64)
                .map(
                  (m) => `
                <div class="sb-bar-row">
                  <div class="sb-bar-meta"><span>Patrón ${m.key} ${m.stored ? "(guardado)" : "(no guardado)"}</span><span class="vw-tabular">${m.pct}%</span></div>
                  <div class="sb-bar-track"><div class="sb-bar-fill" style="width:${m.pct}%;background:${m.pct === 100 ? "var(--success)" : "var(--primary)"};"></div></div>
                </div>
              `
                )
                .join("")}
            </div>
          </div>
        </div>
      `;

      renderMathInSandbox(hostEl);

      // Event Listeners
      hostEl.querySelectorAll("[data-store]").forEach((btn) => {
        btn.addEventListener("click", () => {
          clearAllSandboxTimers();
          state.runningAuto = false;
          const k = btn.getAttribute("data-store");
          if (state.stored.includes(k) && state.stored.length > 1) {
            state.stored = state.stored.filter((x) => x !== k);
          } else if (!state.stored.includes(k)) {
            state.stored.push(k);
          }
          recalcInitEnergy();
          render();
        });
      });

      hostEl.querySelectorAll("[data-load]").forEach((btn) => {
        btn.addEventListener("click", () => {
          clearAllSandboxTimers();
          state.runningAuto = false;
          const k = btn.getAttribute("data-load");
          state.grid = [...HOPFIELD_PATTERNS[k]];
          recalcInitEnergy();
          render();
        });
      });

      hostEl.querySelectorAll("[data-dyn]").forEach((btn) => {
        btn.addEventListener("click", () => {
          state.dynamicsMode = btn.getAttribute("data-dyn");
          render();
        });
      });

      hostEl.querySelectorAll("[data-sb-speed]").forEach((btn) => {
        btn.addEventListener("click", () => {
          state.speed = btn.getAttribute("data-sb-speed");
          if (state.runningAuto) {
            startAutoConverge();
          } else {
            render();
          }
        });
      });

      hostEl.querySelector("#sb-hop-noise").addEventListener("click", () => {
        clearAllSandboxTimers();
        state.runningAuto = false;
        for (let i = 0; i < 5; i++) {
          const idx = Math.floor(Math.random() * 25);
          state.grid[idx] = -state.grid[idx];
        }
        recalcInitEnergy();
        render();
      });

      hostEl.querySelector("#sb-hop-clear").addEventListener("click", () => {
        clearAllSandboxTimers();
        state.runningAuto = false;
        state.grid = new Array(25).fill(-1);
        recalcInitEnergy();
        render();
      });

      // Continuous brush drag on cells
      const cells = hostEl.querySelectorAll("[data-cell]");
      cells.forEach((btn) => {
        const idx = Number(btn.getAttribute("data-cell"));

        btn.addEventListener("pointerdown", (ev) => {
          clearAllSandboxTimers();
          state.runningAuto = false;
          state.isPainting = true;
          state.paintVal = state.grid[idx] > 0 ? -1 : 1;
          state.grid[idx] = state.paintVal;
          recalcInitEnergy();
          render();
        });

        btn.addEventListener("pointerenter", () => {
          if (state.isPainting && state.grid[idx] !== state.paintVal) {
            state.grid[idx] = state.paintVal;
            recalcInitEnergy();
            render();
          }
        });
      });

      window.addEventListener("pointerup", () => {
        state.isPainting = false;
      }, { once: true });

      const doOneStep = () => {
        const W = buildHopfieldWeights(state.stored);
        let res;
        if (state.dynamicsMode === "sync") {
          res = stepHopfield(state.grid, W);
          state.grid = res.nextState;
          state.stepCount += 1;
          state.lastChanged = res.changed;
          state.changedSet = new Set(res.changedIndices || []);
        } else {
          res = stepHopfieldAsync(state.grid, W);
          state.grid = res.nextState;
          state.stepCount += 1;
          state.lastChanged = res.changed;
          state.changedSet = res.changed ? new Set([res.changedIdx]) : new Set();
        }

        state.energyHistory.push(res.energy);
        state.stateHistory.push(state.grid.join(","));
        render();
        return res.changed > 0;
      };

      hostEl.querySelector("#sb-hop-step").addEventListener("click", () => {
        clearAllSandboxTimers();
        state.runningAuto = false;
        doOneStep();
      });

      const startAutoConverge = () => {
        clearAllSandboxTimers();
        state.runningAuto = true;
        let guard = 0;
        const delay = getSpeedDelay(state.speed, 360);

        trackInterval(() => {
          if (!document.body.contains(hostEl) || guard++ >= 20) {
            clearAllSandboxTimers();
            state.runningAuto = false;
            render();
            return;
          }
          const changed = doOneStep();
          const attractor = detectHopfieldAttractor(state.grid, state.stateHistory);
          if (!changed || attractor.type === "fixed_point" || attractor.type === "cycle") {
            clearAllSandboxTimers();
            state.runningAuto = false;
            render();
          }
        }, delay);
      };

      hostEl.querySelector("#sb-hop-auto").addEventListener("click", () => {
        if (state.runningAuto) {
          clearAllSandboxTimers();
          state.runningAuto = false;
          render();
        } else {
          startAutoConverge();
          render();
        }
      });
    };

    render();
  }

  // ---------------------------------------------------------------------------
  // 3. Live Interactive Sandbox: SOM Kohonen 2D (rAF Lerp, Post-Training Inferencia, KaTeX)
  // ---------------------------------------------------------------------------
  function mountSomSandbox(hostEl) {
    clearAllSandboxTimers();

    const state = {
      mode: "train", // "train" | "infer"
      topo: "grid3", // "line3" | "grid3"
      distMode: "cloud", // "cloud" | "ring" | "clusters"
      alpha: 0.45,
      sigma: 1.0,
      decayEnabled: false,
      maxSteps: 120,
      speed: "1x",
      steps: 0,
      lastPattern: null,
      lastBmu: null,
      neurons: [],
      displayNeurons: [],
      running: false,
      inferQuery: null,
      inferResult: null
    };

    let interpRafId = null;

    const initNeurons = () => {
      if (state.topo === "line3") {
        state.neurons = [
          { gx: 0, gy: 0, x: 0.25, y: 0.50, label: "N1", lastH: 0, isBmu: false },
          { gx: 1, gy: 0, x: 0.50, y: 0.50, label: "N2", lastH: 0, isBmu: false },
          { gx: 2, gy: 0, x: 0.75, y: 0.50, label: "N3", lastH: 0, isBmu: false }
        ];
      } else {
        state.neurons = [];
        let k = 1;
        for (let r = 0; r < 3; r++) {
          for (let col = 0; col < 3; col++) {
            state.neurons.push({
              gx: col,
              gy: r,
              x: 0.35 + col * 0.15,
              y: 0.35 + r * 0.15,
              label: `N${k++}`,
              lastH: 0,
              isBmu: false
            });
          }
        }
      }
      state.displayNeurons = state.neurons.map((n) => ({ ...n }));
      state.steps = 0;
      state.lastPattern = null;
      state.lastBmu = null;
      state.inferQuery = null;
      state.inferResult = null;
    };
    initNeurons();

    const samplePattern = () => {
      if (state.distMode === "ring") {
        const ang = Math.random() * Math.PI * 2;
        const r = 0.26 + Math.random() * 0.12;
        return { x: 0.5 + r * Math.cos(ang), y: 0.5 + r * Math.sin(ang) };
      }
      if (state.distMode === "clusters") {
        const centers = [
          { x: 0.22, y: 0.24 },
          { x: 0.78, y: 0.28 },
          { x: 0.5, y: 0.78 }
        ];
        const c = centers[Math.floor(Math.random() * centers.length)];
        return {
          x: Math.max(0.06, Math.min(0.94, c.x + (Math.random() - 0.5) * 0.18)),
          y: Math.max(0.06, Math.min(0.94, c.y + (Math.random() - 0.5) * 0.18))
        };
      }
      return { x: 0.12 + Math.random() * 0.76, y: 0.12 + Math.random() * 0.76 };
    };

    const animateMeshStep = (targetNeurons) => {
      if (state.speed === "max") {
        state.displayNeurons = targetNeurons.map((n) => ({ ...n }));
        state.neurons = targetNeurons;
        draw();
        return;
      }

      if (interpRafId) cancelAnimationFrame(interpRafId);
      const startPositions = state.displayNeurons.map((n) => ({ x: n.x, y: n.y }));
      let progress = 0;
      const stepInc = state.speed === "0.5x" ? 0.08 : (state.speed === "2x" ? 0.22 : 0.14);

      const stepAnimation = () => {
        progress = Math.min(1, progress + stepInc);
        const ease = 1 - Math.pow(1 - progress, 3);

        state.displayNeurons = state.displayNeurons.map((n, idx) => ({
          ...n,
          x: startPositions[idx].x + (targetNeurons[idx].x - startPositions[idx].x) * ease,
          y: startPositions[idx].y + (targetNeurons[idx].y - startPositions[idx].y) * ease,
          lastH: targetNeurons[idx].lastH,
          isBmu: targetNeurons[idx].isBmu
        }));

        draw();

        if (progress < 1) {
          interpRafId = trackRaf(stepAnimation);
        } else {
          state.neurons = targetNeurons;
        }
      };

      interpRafId = trackRaf(stepAnimation);
    };

    const draw = () => {
      const canvas = hostEl.querySelector("#sb-som-canvas");
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      const W = canvas.width;
      const H = canvas.height;
      const c = readThemeColors();

      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = c.bgSubtle;
      ctx.fillRect(0, 0, W, H);

      // Background reference manifold
      ctx.save();
      ctx.strokeStyle = c.border;
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1.2;
      if (state.distMode === "ring") {
        ctx.beginPath();
        ctx.arc(0.5 * W, 0.5 * H, 0.32 * Math.min(W, H), 0, Math.PI * 2);
        ctx.stroke();
      } else if (state.distMode === "clusters") {
        [
          { x: 0.22, y: 0.24 },
          { x: 0.78, y: 0.28 },
          { x: 0.5, y: 0.78 }
        ].forEach((ctr) => {
          ctx.beginPath();
          ctx.arc(ctr.x * W, ctr.y * H, 0.11 * Math.min(W, H), 0, Math.PI * 2);
          ctx.stroke();
        });
      } else {
        ctx.strokeRect(0.12 * W, 0.12 * H, 0.76 * W, 0.76 * H);
      }
      ctx.restore();

      // Mesh topological lines
      ctx.strokeStyle = c.border;
      ctx.lineWidth = 2;
      state.displayNeurons.forEach((a) => {
        state.displayNeurons.forEach((b) => {
          if (
            Math.abs(a.gx - b.gx) + Math.abs(a.gy - b.gy) === 1 &&
            (a.gx < b.gx || a.gy < b.gy)
          ) {
            ctx.beginPath();
            ctx.moveTo(a.x * W, a.y * H);
            ctx.lineTo(b.x * W, b.y * H);
            ctx.stroke();
          }
        });
      });

      // Training mode: last pattern link & triangle
      if (state.mode === "train" && state.lastPattern) {
        const px = state.lastPattern.x * W;
        const py = state.lastPattern.y * H;
        const bmu = state.displayNeurons.find((n) => n.isBmu);
        if (bmu) {
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(bmu.x * W, bmu.y * H);
          ctx.strokeStyle = c.warning;
          ctx.setLineDash([4, 3]);
          ctx.stroke();
          ctx.setLineDash([]);
        }
        ctx.fillStyle = c.warning;
        ctx.beginPath();
        ctx.moveTo(px, py - 7);
        ctx.lineTo(px + 7, py + 5);
        ctx.lineTo(px - 7, py + 5);
        ctx.closePath();
        ctx.fill();
      }

      // Inferencia mode: query point and winning BMU radar circle
      if (state.mode === "infer" && state.inferQuery && state.inferResult) {
        const qx = state.inferQuery.x * W;
        const qy = state.inferQuery.y * H;
        const bmu = state.inferResult.bmu;

        // Line to BMU
        ctx.beginPath();
        ctx.moveTo(qx, qy);
        ctx.lineTo(bmu.x * W, bmu.y * H);
        ctx.strokeStyle = c.danger;
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Pulsing circle around winning BMU
        ctx.beginPath();
        ctx.arc(bmu.x * W, bmu.y * H, 18, 0, Math.PI * 2);
        ctx.strokeStyle = c.warning;
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Query diamond
        ctx.beginPath();
        ctx.moveTo(qx, qy - 8);
        ctx.lineTo(qx + 8, qy);
        ctx.lineTo(qx, qy + 8);
        ctx.lineTo(qx - 8, qy);
        ctx.closePath();
        ctx.fillStyle = c.danger;
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 1.6;
        ctx.stroke();
      }

      // Neurons and halos
      state.displayNeurons.forEach((n) => {
        const nx = n.x * W;
        const ny = n.y * H;
        if (n.lastH > 0.08 && !n.isBmu && state.mode === "train") {
          ctx.beginPath();
          ctx.arc(nx, ny, 8 + n.lastH * 8, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(16, 185, 129, 0.45)";
          ctx.lineWidth = 2;
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.arc(nx, ny, n.isBmu ? 11 : 8, 0, Math.PI * 2);
        ctx.fillStyle = n.isBmu ? c.success : c.primary;
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 1.8;
        ctx.stroke();
        ctx.fillStyle = c.text;
        ctx.font = "bold 9px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(n.label, nx, ny - 13);
      });

      // Side readout
      const infoEl = hostEl.querySelector("#sb-som-info");
      if (infoEl) {
        if (state.mode === "train") {
          const coordsHtml = state.displayNeurons.slice(0, state.topo === "line3" ? 3 : 5).map((n) =>
            `<span class="vw-tabular" style="display:inline-block;margin-right:0.55rem;"><strong>${escapeHtml(n.label)}</strong>(${n.x.toFixed(2)},${(1 - n.y).toFixed(2)})</span>`
          ).join("");
          infoEl.innerHTML = `
            <div><strong>Iteraciones:</strong> ${state.steps} · <strong>Última BMU:</strong> ${state.lastBmu ? escapeHtml(state.lastBmu) : "—"}</div>
            <div><strong>Parámetros:</strong> α = ${state.alpha.toFixed(2)} · σ = ${state.sigma.toFixed(2)} ${state.decayEnabled ? "(decaimiento activo)" : ""}</div>
            <div style="font-size:0.78rem;color:var(--text-muted);margin-top:0.15rem;">Pesos activos: ${coordsHtml}${state.displayNeurons.length > 5 ? "…" : ""}</div>
          `;
        } else {
          const inf = state.inferResult;
          infoEl.innerHTML = `
            <div style="display:flex;align-items:center;gap:0.4rem;margin-bottom:0.25rem;">
              <span class="sb-infer-badge">🎯 Modo Inferencia Post-Entrenamiento</span>
            </div>
            ${inf ? `
              <div>Consulta <strong>x = (${state.inferQuery.x.toFixed(2)}, ${(1 - state.inferQuery.y).toFixed(2)})</strong></div>
              <div>BMU Ganadora: <strong style="color:var(--success);font-size:1rem;">${escapeHtml(inf.bmuLabel)}</strong> en (${inf.bmu.x.toFixed(2)}, ${(1 - inf.bmu.y).toFixed(2)})</div>
              <div>Distancia mínima: <span class="vw-tabular">d = ${(inf.distance * 10).toFixed(3)}</span> · Afinidad Gaussiana: <span class="vw-tabular">${(inf.affinity * 100).toFixed(1)}%</span></div>
            ` : `<span style="color:var(--text-muted);">Hacé clic en cualquier lugar del plano para clasificar un vector desconocido sin alterar los pesos.</span>`}
          `;
        }
      }
    };

    const feedPattern = (p) => {
      if (state.decayEnabled) {
        const decayed = computeSomDecay(state.steps, state.maxSteps, 0.5, 1.2);
        state.alpha = decayed.alpha;
        state.sigma = decayed.sigma;
      }
      const res = somStep(state.neurons, p, state.alpha, state.sigma);
      state.lastPattern = p;
      state.lastBmu = res.bmuLabel;
      state.steps += 1;
      animateMeshStep(res.neurons);
    };

    const renderShell = () => {
      hostEl.innerHTML = `
        <div class="sb-toolbar">
          <div class="sb-btn-group">
            <div class="sb-mode-toggle">
              <button type="button" class="sb-mode-btn ${state.mode === "train" ? "active" : ""}" data-som-mode="train">🏋️ Entrenamiento</button>
              <button type="button" class="sb-mode-btn ${state.mode === "infer" ? "active" : ""}" data-som-mode="infer">🎯 Inferencia</button>
            </div>
            <button type="button" class="pe-mode-pill ${state.topo === "line3" ? "active" : ""}" data-topo="line3">Cadena 1×3 (Parcial)</button>
            <button type="button" class="pe-mode-pill ${state.topo === "grid3" ? "active" : ""}" data-topo="grid3">Grilla 3×3 (Mapa 2D)</button>
            <select id="sb-som-dist" class="inline-input">
              <option value="cloud" ${state.distMode === "cloud" ? "selected" : ""}>Nube uniforme</option>
              <option value="ring" ${state.distMode === "ring" ? "selected" : ""}>Anillo / Aro</option>
              <option value="clusters" ${state.distMode === "clusters" ? "selected" : ""}>3 Clusters</option>
            </select>
          </div>
          <div class="sb-btn-group">
            <label class="sb-inline-ctl">α <input id="sb-som-alpha" type="range" min="0.05" max="0.8" step="0.05" value="${state.alpha}" /></label>
            <label class="sb-inline-ctl">σ <input id="sb-som-sigma" type="range" min="0.35" max="1.8" step="0.05" value="${state.sigma}" /></label>
            <label class="sb-inline-ctl"><input type="checkbox" id="sb-som-decay" ${state.decayEnabled ? "checked" : ""}/> Decaimiento</label>
            <button type="button" class="btn btn-outline btn-sm" id="sb-som-burst">⚡ +10 Pasos</button>
            <button type="button" class="btn btn-primary btn-sm" id="sb-som-auto">${state.running ? "⏸ Pausar" : "▶ Auto-Entrenar"}</button>
            <button type="button" class="btn btn-outline btn-sm" id="sb-som-reset">↺ Reiniciar</button>
            ${renderSpeedSelectorHtml(state.speed, ["0.5x", "1x", "2x", "max"])}
          </div>
        </div>
        <div class="sb-split-grid">
          <div class="sb-canvas-wrap">
            <canvas id="sb-som-canvas" width="460" height="320" class="sb-canvas" style="cursor:crosshair;"></canvas>
            <div class="sb-canvas-hint">
              💡 ${state.mode === "train" ? "Hacé clic en el plano para lanzar un patrón ▲ p y ver cómo la BMU y su vecindad se adaptan con suavidad." : "<strong>Modo Inferencia:</strong> Hacé clic en cualquier coordenada para clasificar el vector en tiempo real."}
            </div>
          </div>
          <div class="sb-readout-panel">
            <div id="sb-som-info" class="sb-verdict-box" style="display:flex;flex-direction:column;align-items:flex-start;gap:0.35rem;"></div>
            <div class="sb-formula-box">
              <strong>Regla Canónica de Kohonen:</strong><br>
              $$W_j(t+1) = W_j(t) + \\alpha(t) \\cdot h(j, j^*) \\cdot [x - W_j(t)]$$
              $$h(j, j^*) = \\exp\\left(-\\frac{\\|r_j - r_{j^*}\\|^2}{2\\sigma(t)^2}\\right)$$
            </div>
          </div>
        </div>
      `;

      renderMathInSandbox(hostEl);

      hostEl.querySelectorAll("[data-som-mode]").forEach((btn) => {
        btn.addEventListener("click", () => {
          clearAllSandboxTimers();
          state.running = false;
          state.mode = btn.getAttribute("data-som-mode");
          renderShell();
        });
      });

      hostEl.querySelectorAll("[data-topo]").forEach((btn) => {
        btn.addEventListener("click", () => {
          clearAllSandboxTimers();
          state.running = false;
          state.topo = btn.getAttribute("data-topo");
          initNeurons();
          renderShell();
        });
      });

      hostEl.querySelector("#sb-som-dist").addEventListener("change", (e) => {
        state.distMode = e.target.value;
        draw();
      });

      hostEl.querySelector("#sb-som-alpha").addEventListener("input", (e) => {
        state.alpha = Number(e.target.value);
        draw();
      });

      hostEl.querySelector("#sb-som-sigma").addEventListener("input", (e) => {
        state.sigma = Number(e.target.value);
        draw();
      });

      hostEl.querySelector("#sb-som-decay").addEventListener("change", (e) => {
        state.decayEnabled = Boolean(e.target.checked);
        draw();
      });

      hostEl.querySelectorAll("[data-sb-speed]").forEach((btn) => {
        btn.addEventListener("click", () => {
          state.speed = btn.getAttribute("data-sb-speed");
          if (state.running) {
            startSomAuto();
          } else {
            hostEl.querySelectorAll("[data-sb-speed]").forEach((b) => b.classList.toggle("active", b === btn));
          }
        });
      });

      hostEl.querySelector("#sb-som-burst").addEventListener("click", () => {
        for (let i = 0; i < 10; i++) feedPattern(samplePattern());
      });

      hostEl.querySelector("#sb-som-reset").addEventListener("click", () => {
        clearAllSandboxTimers();
        state.running = false;
        initNeurons();
        renderShell();
      });

      const startSomAuto = () => {
        clearAllSandboxTimers();
        state.running = true;
        const delay = getSpeedDelay(state.speed, 200);
        trackInterval(() => {
          if (!document.body.contains(hostEl)) {
            clearAllSandboxTimers();
            state.running = false;
            return;
          }
          feedPattern(samplePattern());
        }, delay);
      };

      hostEl.querySelector("#sb-som-auto").addEventListener("click", () => {
        if (state.running) {
          clearAllSandboxTimers();
          state.running = false;
          renderShell();
        } else {
          startSomAuto();
          renderShell();
        }
      });

      const canvas = hostEl.querySelector("#sb-som-canvas");
      canvas.addEventListener("click", (ev) => {
        const rect = canvas.getBoundingClientRect();
        const x = Math.max(0.04, Math.min(0.96, (ev.clientX - rect.left) / rect.width));
        const y = Math.max(0.04, Math.min(0.96, (ev.clientY - rect.top) / rect.height));

        if (state.mode === "train") {
          feedPattern({ x, y });
        } else {
          state.inferQuery = { x, y };
          state.inferResult = somInference(state.neurons, state.inferQuery);
          draw();
        }
      });

      draw();
    };

    renderShell();
  }

  // ---------------------------------------------------------------------------
  // 4. Live Interactive Sandbox: Clustering UPGMA (Cut Slider, Hull Capsules, KaTeX)
  // ---------------------------------------------------------------------------
  function mountClusteringSandbox(hostEl) {
    clearAllSandboxTimers();
    const CLUSTER_PALETTE = ["#10b981", "#f59e0b", "#6366f1", "#ec4899", "#06b6d4", "#8b5cf6", "#ef4444"];

    const state = {
      points: [
        { label: "A", x: 1.8, y: 7.4 },
        { label: "B", x: 4.5, y: 5.5 },
        { label: "C", x: 6.8, y: 3.1 },
        { label: "D", x: 2.3, y: 5.6 },
        { label: "E", x: 7.6, y: 2.8 }
      ],
      cutHeight: 3.2,
      visibleStep: 4,
      speed: "1x",
      autoFusing: false
    };

    const drawDendrogramSvg = (tree, cutH) => {
      const { root, merges } = tree;
      if (!root) return "";
      const leafOrder = [];
      const collectLeaves = (node) => {
        if (!node.left && !node.right) leafOrder.push(node);
        else { collectLeaves(node.left); collectLeaves(node.right); }
      };
      collectLeaves(root);

      const W = 320;
      const H = 210;
      const padL = 36;
      const padR = 16;
      const padT = 18;
      const padB = 26;
      const maxH = Math.max(0.5, root.height * 1.15);

      const xPos = new Map();
      leafOrder.forEach((lf, i) => {
        xPos.set(lf, padL + (i / Math.max(1, leafOrder.length - 1)) * (W - padL - padR));
      });
      const yFor = (h) => H - padB - (h / maxH) * (H - padT - padB);

      const getCoord = (node) => {
        if (!node.left && !node.right) return { x: xPos.get(node), y: yFor(0) };
        const L = getCoord(node.left);
        const R = getCoord(node.right);
        return { x: (L.x + R.x) / 2, y: yFor(node.height) };
      };

      const paths = [];
      const walkPaths = (node) => {
        if (!node.left || !node.right) return;
        walkPaths(node.left);
        walkPaths(node.right);
        const L = getCoord(node.left);
        const R = getCoord(node.right);
        const yTop = yFor(node.height);
        const isBelowCut = node.height <= cutH;
        const strokeCol = isBelowCut ? "var(--primary)" : "var(--border-color)";

        paths.push(`<path d="M${L.x.toFixed(1)},${L.y.toFixed(1)} V${yTop.toFixed(1)} H${R.x.toFixed(1)} V${R.y.toFixed(1)}" fill="none" stroke="${strokeCol}" stroke-width="${isBelowCut ? 2.4 : 1.4}" />`);
        paths.push(`<text x="${((L.x + R.x) / 2).toFixed(1)}" y="${(yTop - 4).toFixed(1)}" text-anchor="middle" font-size="8.5" font-weight="700" fill="${isBelowCut ? "var(--success)" : "var(--text-muted)"}">${node.height.toFixed(2)}</text>`);
      };
      walkPaths(root);

      // Horizontal cut line
      const cutY = yFor(cutH);
      const cutLineHtml = `
        <line x1="${padL}" y1="${cutY.toFixed(1)}" x2="${W - padR}" y2="${cutY.toFixed(1)}" stroke="var(--danger)" stroke-width="1.8" stroke-dasharray="5 3" />
        <text x="${W - padR}" y="${(cutY - 4).toFixed(1)}" text-anchor="end" font-size="9" font-weight="800" fill="var(--danger)">Corte h=${cutH.toFixed(2)}</text>
      `;

      const ticks = [0, 0.5, 1].map((f) => {
        const val = maxH * f;
        const y = yFor(val);
        return `<line x1="${padL - 4}" y1="${y.toFixed(1)}" x2="${W - padR}" y2="${y.toFixed(1)}" stroke="var(--border-color)" stroke-dasharray="3 3" opacity="0.45" />
          <text x="${padL - 6}" y="${(y + 3).toFixed(1)}" text-anchor="end" font-size="8" fill="var(--text-muted)">${val.toFixed(1)}</text>`;
      }).join("");

      const leafLabels = leafOrder.map((lf) =>
        `<text x="${xPos.get(lf).toFixed(1)}" y="${H - 8}" text-anchor="middle" font-size="11" font-weight="800" fill="var(--text-main)">${escapeHtml(lf.id)}</text>`
      ).join("");

      return `
        <svg viewBox="0 0 ${W} ${H}" class="vw-svg-chart" role="img" aria-label="Dendrograma UPGMA en tiempo real">
          ${ticks}
          ${paths.join("")}
          ${cutLineHtml}
          ${leafLabels}
        </svg>
      `;
    };

    const render = () => {
      const tree = computeUpgmaTree(state.points);
      const maxH = tree.root ? tree.root.height * 1.08 : 5;
      state.cutHeight = Math.max(0.1, Math.min(maxH, state.cutHeight));

      const clusterInfo = computeClustersAtCutHeight(tree, state.points.length, state.cutHeight);
      const kClusters = clusterInfo.k;

      hostEl.innerHTML = `
        <div class="sb-toolbar">
          <div class="sb-btn-group">
            <span style="font-size:0.84rem;font-weight:700;">k = ${kClusters} Clúster${kClusters > 1 ? "es" : ""}</span>
            <button type="button" class="btn btn-outline btn-sm" id="sb-clu-pop" ${state.points.length <= 3 ? "disabled" : ""}>↩ Quitar punto</button>
            <button type="button" class="btn btn-outline btn-sm" id="sb-clu-reset">↺ Caso Base</button>
          </div>
          <div class="sb-btn-group">
            <span style="font-size:0.78rem;color:var(--text-muted);">Corte rápido:</span>
            ${[1, 2, 3, 4].filter((k) => k <= state.points.length).map((targetK) =>
              `<button type="button" class="sb-pill-btn ${kClusters === targetK ? "active" : ""}" data-cutk="${targetK}">k=${targetK}</button>`
            ).join("")}
            ${renderSpeedSelectorHtml(state.speed, ["0.5x", "1x", "2x"])}
          </div>
        </div>
        <div class="sb-split-grid">
          <div class="sb-canvas-wrap">
            <canvas id="sb-clu-canvas" width="400" height="270" class="sb-canvas" style="cursor:crosshair;"></canvas>
            <div class="sb-canvas-hint">💡 Hacé clic en el plano para agregar puntos hasta 7. Usá el <strong>slider inferior</strong> para variar la altura de corte $h$ a 60 fps.</div>
            <div class="sb-cut-slider-wrap">
              <span style="font-weight:700;color:var(--danger);white-space:nowrap;">✂ Altura h = ${(state.cutHeight).toFixed(2)}</span>
              <input type="range" id="sb-clu-cut-h" class="sb-cut-slider" min="0.1" max="${maxH.toFixed(2)}" step="0.05" value="${state.cutHeight.toFixed(2)}" />
            </div>
          </div>
          <div class="sb-readout-panel">
            <div class="vw-chart-title" style="margin-bottom:0.2rem;">Dendrograma UPGMA (altura exacta $|C_1| \\cdot |C_2|$)</div>
            ${drawDendrogramSvg(tree, state.cutHeight)}
            <div class="sb-formula-box">
              <strong>Fórmula UPGMA de Cátedra:</strong><br>
              $$d(C_1 \\cup C_2, C_3) = \\frac{|C_1| \\cdot d(C_1, C_3) + |C_2| \\cdot d(C_2, C_3)}{|C_1| + |C_2|}$$
            </div>
            <div style="font-size:0.8rem;">
              <strong>Clústeres formados a corte h = ${state.cutHeight.toFixed(2)}:</strong>
              <div style="display:flex;flex-wrap:wrap;gap:0.35rem;margin-top:0.3rem;">
                ${clusterInfo.groups.map((grp, gIdx) => {
                  const labels = grp.map((pIdx) => state.points[pIdx].label).join(", ");
                  const col = CLUSTER_PALETTE[gIdx % CLUSTER_PALETTE.length];
                  return `<span style="background:${col}22;border:1px solid ${col};color:${col};padding:0.15rem 0.45rem;border-radius:4px;font-weight:700;">G${gIdx + 1}: {${labels}}</span>`;
                }).join("")}
              </div>
            </div>
          </div>
        </div>
      `;

      renderMathInSandbox(hostEl);

      // Canvas rendering
      const canvas = hostEl.querySelector("#sb-clu-canvas");
      const ctx = canvas.getContext("2d");
      const W = canvas.width;
      const H = canvas.height;
      const c = readThemeColors();

      ctx.fillStyle = c.bgSubtle;
      ctx.fillRect(0, 0, W, H);
      const sx = (x) => (x / 10) * (W - 36) + 18;
      const sy = (y) => H - 18 - (y / 10) * (H - 36);

      // Translucent capsule/hull fills for active clusters
      clusterInfo.groups.forEach((grp, gIdx) => {
        if (grp.length < 2) return;
        const col = CLUSTER_PALETTE[gIdx % CLUSTER_PALETTE.length];
        const xs = grp.map((idx) => sx(state.points[idx].x));
        const ys = grp.map((idx) => sy(state.points[idx].y));
        const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
        const cy = (Math.min(...ys) + Math.max(...ys)) / 2;
        const rx = Math.max(26, (Math.max(...xs) - Math.min(...xs)) / 2 + 20);
        const ry = Math.max(24, (Math.max(...ys) - Math.min(...ys)) / 2 + 18);

        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        ctx.fillStyle = `${col}18`;
        ctx.fill();
        ctx.strokeStyle = col;
        ctx.setLineDash([5, 3]);
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Draw points
      state.points.forEach((p, ptIdx) => {
        const px = sx(p.x);
        const py = sy(p.y);
        ctx.beginPath();
        ctx.arc(px, py, 11, 0, Math.PI * 2);
        ctx.fillStyle = clusterInfo.colorByIdx[ptIdx] || c.primary;
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = "#fff";
        ctx.font = "bold 10px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(p.label, px, py + 0.5);
      });

      // Events
      const slider = hostEl.querySelector("#sb-clu-cut-h");
      slider.addEventListener("input", (e) => {
        state.cutHeight = Number(e.target.value);
        render();
      });

      hostEl.querySelectorAll("[data-cutk]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const targetK = Number(btn.getAttribute("data-cutk")) || 1;
          const targetMergeIdx = state.points.length - targetK;
          if (targetMergeIdx > 0 && targetMergeIdx <= tree.merges.length) {
            const m = tree.merges[targetMergeIdx - 1];
            state.cutHeight = m.height + 0.05;
          } else {
            state.cutHeight = 0.2;
          }
          render();
        });
      });

      canvas.addEventListener("click", (ev) => {
        if (state.points.length >= 7) return;
        const rect = canvas.getBoundingClientRect();
        const nx = Math.max(0.5, Math.min(9.5, ((ev.clientX - rect.left) / rect.width) * 10));
        const ny = Math.max(0.5, Math.min(9.5, (1 - (ev.clientY - rect.top) / rect.height) * 10));
        const nextLabel = String.fromCharCode(65 + state.points.length);
        state.points.push({ label: nextLabel, x: nx, y: ny });
        render();
      });

      hostEl.querySelector("#sb-clu-pop").addEventListener("click", () => {
        if (state.points.length > 3) {
          state.points.pop();
          render();
        }
      });

      hostEl.querySelector("#sb-clu-reset").addEventListener("click", () => {
        mountClusteringSandbox(hostEl);
      });
    };

    render();
  }

  // ---------------------------------------------------------------------------
  // 5. Live Interactive Sandbox: Algoritmos Genéticos (Physics Roulette, Generations, KaTeX)
  // ---------------------------------------------------------------------------
  function mountAgSandbox(hostEl) {
    clearAllSandboxTimers();
    const CHROMOS = ["10110", "01101", "11001", "00111"];
    const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ec4899"];

    const state = {
      fitness: [20, 45, 25, 10],
      wheelAngle: 0,
      needleWobble: 0,
      isSpinning: false,
      lastR: null,
      lastWinner: null,
      spinCount: 0,
      crossover: null,
      speed: "1x",
      generation: 0,
      genHistory: [{ gen: 0, max: 45, avg: 25 }]
    };

    let spinRafId = null;

    const buildWheelSvg = (roulette) => {
      const r = 76;
      let startAng = 0;
      const slices = roulette.rows
        .map((row, idx) => {
          const sweep = row.p * Math.PI * 2;
          const endAng = startAng + sweep;
          const x1 = +(r * Math.sin(startAng)).toFixed(2);
          const y1 = +(-r * Math.cos(startAng)).toFixed(2);
          const x2 = +(r * Math.sin(endAng)).toFixed(2);
          const y2 = +(-r * Math.cos(endAng)).toFixed(2);
          const largeArc = sweep > Math.PI ? 1 : 0;
          const midAng = startAng + sweep / 2;
          const lx = +(r * 0.62 * Math.sin(midAng)).toFixed(1);
          const ly = +(-r * 0.62 * Math.cos(midAng)).toFixed(1);
          startAng = endAng;
          return `
          <path d="M0,0 L${x1},${y1} A${r},${r} 0 ${largeArc},1 ${x2},${y2} Z" fill="${COLORS[idx]}" opacity="0.86" stroke="var(--bg-card)" stroke-width="2" />
          <text x="${lx}" y="${ly}" text-anchor="middle" dominant-baseline="middle" font-size="11" font-weight="800" fill="#ffffff">${row.id}</text>
        `;
        })
        .join("");

      return `
        <svg viewBox="0 0 210 190" class="vw-algo-svg" style="max-width:210px;" role="img" aria-label="Ruleta genética">
          <g transform="translate(105 100)">
            <g id="sb-wheel-rotor" style="transform: rotate(${state.wheelAngle}deg);">
              ${slices}
              <circle r="11" fill="var(--bg-card)" stroke="var(--text-main)" stroke-width="2" />
            </g>
          </g>
          <!-- Realistic pointer needle with spring bounce -->
          <g id="sb-wheel-needle" transform="translate(105 16) rotate(${state.needleWobble})">
            <polygon points="0,14 -7,-4 7,-4" fill="var(--danger)" />
            <circle cx="0" cy="-4" r="3.5" fill="var(--text-main)" />
          </g>
        </svg>
      `;
    };

    const buildEvolutionChart = (history) => {
      const maxVal = Math.max(...history.map((h) => h.max), 10);
      const span = Math.max(1, history.length - 1);
      const ptsAvg = history.map((h, i) => `${(24 + (i / span) * 218).toFixed(1)},${(74 - (h.avg / maxVal) * 56).toFixed(1)}`).join(" ");
      const ptsMax = history.map((h, i) => `${(24 + (i / span) * 218).toFixed(1)},${(74 - (h.max / maxVal) * 56).toFixed(1)}`).join(" ");

      return `
        <svg viewBox="0 0 260 92" class="vw-svg-chart" aria-label="Curva de fitness promedio y máximo">
          <line x1="22" y1="76" x2="246" y2="76" stroke="var(--border-color)" stroke-width="1" />
          <polyline fill="none" stroke="var(--success)" stroke-width="2.4" points="${ptsMax}" />
          <polyline fill="none" stroke="var(--primary)" stroke-width="2.2" stroke-dasharray="4 2" points="${ptsAvg}" />
          ${history.map((h, i) => `<circle cx="${(24 + (i / span) * 218).toFixed(1)}" cy="${(74 - (h.max / maxVal) * 56).toFixed(1)}" r="3" fill="var(--success)"><title>Gen ${h.gen}: Max ${h.max}</title></circle>`).join("")}
          <text x="132" y="88" text-anchor="middle" font-size="9" fill="var(--text-muted)">Evolución Gen ${state.generation}: Máx (verde) vs Promedio (azul)</text>
        </svg>
      `;
    };

    const renderBitsRow = (label, bits, originFlags, cutK) => {
      const items = bits
        .split("")
        .map((b, i) => {
          const cls = originFlags[i] === 1 ? "p1" : "p2";
          return `${i === cutK ? `<span class="sb-cut-divider" title="Punto de corte k=${cutK}"></span>` : ""}<span class="sb-bit ${cls}">${b}</span>`;
        })
        .join("");
      const dec = parseInt(bits, 2);
      return `<div class="sb-bits-row"><strong style="min-width:68px;">${escapeHtml(label)}:</strong>${items}<span class="vw-tabular" style="color:var(--text-muted);margin-left:0.25rem;">(x=${dec})</span></div>`;
    };

    const spinWheelPhysics = (targetR, onComplete) => {
      if (state.speed === "max") {
        const slotMidPct = (targetR + 0.5) / 100;
        state.wheelAngle = 360 - slotMidPct * 360;
        state.isSpinning = false;
        if (onComplete) onComplete();
        render();
        return;
      }

      state.isSpinning = true;
      const slotMidPct = (targetR + 0.5) / 100;
      const targetDeg = 360 - slotMidPct * 360;
      const currentMod = state.wheelAngle % 360;
      const delta = ((targetDeg - currentMod) + 360) % 360;
      const totalSpin = 1080 + delta;

      const startAngle = state.wheelAngle;
      const finalAngle = startAngle + totalSpin;
      const startTime = performance.now();
      const duration = state.speed === "0.5x" ? 2200 : (state.speed === "2x" ? 700 : 1300);

      const animate = (now) => {
        const elapsed = now - startTime;
        const t = Math.min(1, elapsed / duration);
        // Smooth inertial cubic-bezier deceleration
        const ease = 1 - Math.pow(1 - t, 4);
        state.wheelAngle = startAngle + totalSpin * ease;
        // Needle wiggling physics
        state.needleWobble = Math.sin(t * 35) * (1 - t) * 14;

        const rotor = hostEl.querySelector("#sb-wheel-rotor");
        const needle = hostEl.querySelector("#sb-wheel-needle");
        if (rotor) rotor.style.transform = `rotate(${state.wheelAngle}deg)`;
        if (needle) needle.setAttribute("transform", `translate(105 16) rotate(${state.needleWobble.toFixed(1)})`);

        if (t < 1) {
          spinRafId = trackRaf(animate);
        } else {
          state.wheelAngle = finalAngle;
          state.needleWobble = 0;
          state.isSpinning = false;
          if (rotor) rotor.style.transform = `rotate(${finalAngle}deg)`;
          if (needle) needle.setAttribute("transform", "translate(105 16) rotate(0)");
          if (onComplete) onComplete();
          render();
        }
      };

      if (spinRafId) cancelAnimationFrame(spinRafId);
      spinRafId = trackRaf(animate);
    };

    const render = () => {
      const roulette = computeAgRoulette(state.fitness);
      const xo = state.crossover;

      hostEl.innerHTML = `
        <div class="sb-toolbar">
          <div class="sb-btn-group">
            <button type="button" class="btn btn-primary btn-sm" id="sb-ag-spin" ${state.isSpinning ? "disabled" : ""}>🎰 Girar Ruleta [00–99]</button>
            <button type="button" class="btn btn-outline btn-sm" id="sb-ag-cross" ${state.isSpinning ? "disabled" : ""}>🧬 Sortear Par &amp; Cruce</button>
            <button type="button" class="btn btn-outline btn-sm" id="sb-ag-next-gen" ${state.isSpinning ? "disabled" : ""}>⏩ Avanzar 1 Gen</button>
            <button type="button" class="btn btn-outline btn-sm" id="sb-ag-reset">↺ Caso Base</button>
          </div>
          <div class="sb-btn-group">
            ${renderSpeedSelectorHtml(state.speed, ["0.5x", "1x", "2x", "max"])}
          </div>
        </div>
        <div class="sb-split-grid">
          <div class="sb-canvas-wrap" style="text-align:center;">
            ${buildWheelSvg(roulette)}
            <div style="margin-top:0.45rem;font-size:0.85rem;">
              ${
                state.lastR !== null
                  ? `Sorteo #${state.spinCount}: <strong>r = ${String(state.lastR).padStart(2, "0")}</strong> → Seleccionado <span class="sb-winner-pill cls-a">${escapeHtml(state.lastWinner)}</span>`
                  : `<span style="color:var(--text-muted);">Girá la ruleta física con inercia para seleccionar padres según $p_i = \\frac{f_i}{\\sum f}$.</span>`
              }
            </div>
            ${
              xo
                ? `
              <div class="sb-chromo-card" style="text-align:left;margin-top:0.45rem;">
                <div style="font-size:0.79rem;font-weight:700;">Cruce 1-Punto (corte k=${xo.cutK}) · r₁=${String(xo.r1).padStart(2, "0")} (${xo.p1Id}), r₂=${String(xo.r2).padStart(2, "0")} (${xo.p2Id})</div>
                ${renderBitsRow("Padre 1", xo.b1, [1, 1, 1, 1, 1], xo.cutK)}
                ${renderBitsRow("Padre 2", xo.b2, [2, 2, 2, 2, 2], xo.cutK)}
                ${renderBitsRow("Hijo 1", xo.c1, xo.c1Flags, xo.cutK)}
                ${renderBitsRow("Hijo 2", xo.c2, xo.c2Flags, xo.cutK)}
              </div>
            `
                : ""
            }
          </div>
          <div class="sb-readout-panel">
            <div class="sb-ag-sliders">
              ${roulette.rows
                .map(
                  (row, idx) => `
                <label class="sb-ag-row">
                  <span style="color:${COLORS[idx]};font-weight:800;">${row.id}</span>
                  <input type="range" class="sb-ag-range" min="5" max="90" value="${row.fitness}" data-ag-idx="${idx}" />
                  <span class="vw-tabular" style="text-align:right;">f=${row.fitness} · [${String(row.startSlot).padStart(2, "0")}–${String(row.endSlot).padStart(2, "0")}]</span>
                </label>
              `
                )
                .join("")}
            </div>
            <div class="pe-table-wrap">
              <table class="pe-data-table">
                <thead><tr><th>Crom.</th><th>Bits</th><th>f_i</th><th>p_i</th><th>η_i</th><th>Copias</th><th>Slot</th></tr></thead>
                <tbody>
                  ${roulette.rows
                    .map(
                      (row, idx) => `
                    <tr style="${state.lastWinner === row.id ? "background:rgba(16,185,129,0.14);font-weight:700;" : ""}">
                      <td style="color:${COLORS[idx]};font-weight:800;">${row.id}</td>
                      <td class="vw-tabular"><code>${CHROMOS[idx]}</code></td>
                      <td class="vw-tabular">${row.fitness}</td>
                      <td class="vw-tabular">${row.p.toFixed(2)}</td>
                      <td class="vw-tabular">${row.eta.toFixed(2)}</td>
                      <td class="vw-tabular">${row.intCopies} + ${row.frac.toFixed(2)}</td>
                      <td class="vw-tabular">[${String(row.startSlot).padStart(2, "0")}–${String(row.endSlot).padStart(2, "0")}]</td>
                    </tr>
                  `
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
            ${buildEvolutionChart(state.genHistory)}
            <div class="sb-formula-box" style="margin-top:0.35rem;">
              <strong>Rigor de Cátedra:</strong> Intervalos $[00..99]$ disjuntos y contiguos: $\sum \\text{slots} = 100$.<br>
              $$p_i = \\frac{f_i}{\\sum_{j} f_j} \\quad \\eta_i = p_i \\cdot N = \\lfloor \\eta_i \\rfloor + d_i$$
            </div>
          </div>
        </div>
      `;

      renderMathInSandbox(hostEl);

      hostEl.querySelectorAll("[data-ag-idx]").forEach((inp) => {
        inp.addEventListener("change", (e) => {
          const idx = Number(e.target.getAttribute("data-ag-idx"));
          state.fitness[idx] = Number(e.target.value) || 10;
          render();
        });
      });

      hostEl.querySelectorAll("[data-sb-speed]").forEach((btn) => {
        btn.addEventListener("click", () => {
          state.speed = btn.getAttribute("data-sb-speed");
          hostEl.querySelectorAll("[data-sb-speed]").forEach((b) => b.classList.toggle("active", b === btn));
        });
      });

      const pickRandomSlot = () => {
        const r = Math.floor(Math.random() * 100);
        const match = roulette.rows.find((row) => r >= row.startSlot && r <= row.endSlot) || roulette.rows[0];
        return { r, match };
      };

      hostEl.querySelector("#sb-ag-spin").addEventListener("click", () => {
        if (state.isSpinning) return;
        const { r, match } = pickRandomSlot();
        spinWheelPhysics(r, () => {
          state.lastR = r;
          state.lastWinner = match.id;
          state.spinCount += 1;
        });
      });

      hostEl.querySelector("#sb-ag-cross").addEventListener("click", () => {
        if (state.isSpinning) return;
        const s1 = pickRandomSlot();
        const s2 = pickRandomSlot();
        const i1 = roulette.rows.indexOf(s1.match);
        const i2 = roulette.rows.indexOf(s2.match);
        const b1 = CHROMOS[i1];
        const b2 = CHROMOS[i2];
        const cutK = 1 + Math.floor(Math.random() * 4);
        const c1 = b1.slice(0, cutK) + b2.slice(cutK);
        const c2 = b2.slice(0, cutK) + b1.slice(cutK);
        const c1Flags = [0, 1, 2, 3, 4].map((idx) => (idx < cutK ? 1 : 2));
        const c2Flags = [0, 1, 2, 3, 4].map((idx) => (idx < cutK ? 2 : 1));

        spinWheelPhysics(s2.r, () => {
          state.lastR = s2.r;
          state.lastWinner = s2.match.id;
          state.spinCount += 1;
          state.crossover = {
            r1: s1.r,
            r2: s2.r,
            p1Id: s1.match.id,
            p2Id: s2.match.id,
            b1,
            b2,
            c1,
            c2,
            c1Flags,
            c2Flags,
            cutK
          };
        });
      });

      hostEl.querySelector("#sb-ag-next-gen").addEventListener("click", () => {
        const stepRes = simulateAgGenerationStep(CHROMOS, state.fitness);
        state.generation += 1;
        state.fitness = stepRes.newFitnesses;
        state.genHistory.push({
          gen: state.generation,
          max: stepRes.maxFitness,
          avg: stepRes.avgFitness
        });
        render();
      });

      hostEl.querySelector("#sb-ag-reset").addEventListener("click", () => {
        mountAgSandbox(hostEl);
      });
    };

    render();
  }

  // ---------------------------------------------------------------------------
  // Sandboxes Hub (Tab Strip & Submode Controller)
  // ---------------------------------------------------------------------------
  function mountSandboxesHub(container) {
    if (!container) return;
    clearAllSandboxTimers();
    let activeSandbox = "KNN";

    const specs = [
      { id: "KNN", label: "📍 KNN 2D (Fronteras + 1/d²)" },
      { id: "HOPFIELD", label: "🧲 Hopfield 5×5 + Energía" },
      { id: "SOM", label: "🗺️ SOM Kohonen 2D" },
      { id: "CLUSTERING", label: "🌲 Clustering + Dendrograma" },
      { id: "AG", label: "🧬 Ruleta AG [00–99]" }
    ];

    const renderHub = () => {
      clearAllSandboxTimers();
      container.innerHTML = `
        <div class="card">
          <div style="margin-bottom:0.8rem;">
            <h2 style="font-size:1.15rem;margin-bottom:0.25rem;">🧪 Simuladores Interactivos en Vivo</h2>
            <p style="font-size:0.88rem;color:var(--text-muted);">Experimentá en tiempo real con datos de parcial (arrastre 60 fps, ruido en neuronas, corte continuo de dendrogramas y ruletas físicas) con rigor matemático y fórmulas de cátedra.</p>
          </div>
          <div class="sb-tab-strip">
            ${specs.map((s) => `<button type="button" class="lab-topic-btn ${s.id === activeSandbox ? "active" : ""}" data-sb="${s.id}">${escapeHtml(s.label)}</button>`).join("")}
          </div>
          <div id="sb-active-stage"></div>
        </div>
      `;

      container.querySelectorAll("[data-sb]").forEach((btn) => {
        btn.addEventListener("click", () => {
          activeSandbox = btn.getAttribute("data-sb");
          renderHub();
        });
      });

      const stage = container.querySelector("#sb-active-stage");
      if (activeSandbox === "KNN") mountKnnSandbox(stage);
      else if (activeSandbox === "HOPFIELD") mountHopfieldSandbox(stage);
      else if (activeSandbox === "SOM") mountSomSandbox(stage);
      else if (activeSandbox === "CLUSTERING") mountClusteringSandbox(stage);
      else if (activeSandbox === "AG") mountAgSandbox(stage);

      renderMathInSandbox(container);
    };

    renderHub();
  }

  // ---------------------------------------------------------------------------
  // Mini-Game: "Cazador de Trampas de Parcial"
  // ---------------------------------------------------------------------------
  function mountTrapHunterGame(container, { onAwardXp } = {}) {
    if (!container) return;
    clearAllSandboxTimers();

    const state = {
      topicFilter: "ALL",
      idx: 0,
      selectedLine: null,
      score: 0,
      streak: 0,
      bestStreak: 0,
      resultsById: {},
      sprintActive: false,
      sprintTimeLeft: 60,
      sprintFinished: false
    };

    const getFilteredCases = () => {
      if (state.topicFilter === "ALL") return TRAP_CASES;
      return TRAP_CASES.filter((c) => c.topic === state.topicFilter);
    };

    const renderGame = () => {
      const cases = getFilteredCases();
      if (state.idx >= cases.length) state.idx = 0;
      const curCase = cases[state.idx];
      const prevResult = curCase ? state.resultsById[curCase.id] : null;

      container.innerHTML = `
        <div class="card trap-shell">
          <div class="trap-hud-bar">
            <div>
              <h2 style="font-size:1.15rem;margin-bottom:0.2rem;">🕵️ Cazador de Trampas de Parcial</h2>
              <p style="font-size:0.86rem;color:var(--text-muted);margin:0;">Identificá la línea exacta con el error conceptual o trampa típica de examen.</p>
            </div>
            <div class="trap-stats-pills">
              <span class="trap-hud-pill">Aciertos: <strong>${state.score}</strong></span>
              <span class="trap-hud-pill">Racha: <strong>${state.streak}🔥</strong></span>
              ${state.sprintActive ? `<span class="trap-hud-pill" style="background:var(--danger);color:#fff;">⏱ ${state.sprintTimeLeft}s</span>` : ""}
            </div>
          </div>
          <div class="sb-toolbar" style="margin-bottom:0.8rem;">
            <div class="sb-btn-group">
              ${["ALL", "HOPFIELD", "SOM", "CLUSTERING", "AG", "KNN", "NAIVE_BAYES", "MLP"].map((t) =>
                `<button type="button" class="pe-mode-pill ${state.topicFilter === t ? "active" : ""}" data-trap-topic="${t}">${t === "ALL" ? "Todos" : t}</button>`
              ).join("")}
            </div>
            <div class="sb-btn-group">
              <button type="button" class="btn btn-outline btn-sm" id="trap-btn-sprint">${state.sprintActive ? "Detener Sprint" : "⚡ Sprint 60s"}</button>
              <button type="button" class="btn btn-outline btn-sm" id="trap-restart-all">↺ Reiniciar</button>
            </div>
          </div>

          ${curCase ? `
            <div class="trap-card-box">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem;">
                <span class="trap-topic-tag">${escapeHtml(curCase.topic)}</span>
                <span style="font-size:0.82rem;color:var(--text-muted);">Caso ${state.idx + 1} de ${cases.length}</span>
              </div>
              <h3 style="font-size:1rem;margin-bottom:0.6rem;">${escapeHtml(curCase.title)}</h3>
              <div class="trap-lines-list">
                ${curCase.lines.map((l, lIdx) => {
                  let statusCls = "";
                  if (prevResult) {
                    if (lIdx === curCase.trapLineIdx) statusCls = "trap-line-correct";
                    else if (lIdx === prevResult.picked && !prevResult.ok) statusCls = "trap-line-wrong";
                  }
                  return `<button type="button" class="trap-line-btn ${statusCls}" data-line="${lIdx}" ${prevResult ? "disabled" : ""}>${escapeHtml(l)}</button>`;
                }).join("")}
              </div>
              ${prevResult ? `
                <div class="trap-feedback ${prevResult.ok ? "ok" : "fail"}">
                  <div style="font-weight:800;font-size:0.95rem;margin-bottom:0.25rem;">
                    ${prevResult.ok ? "🎯 ¡Excelente! Descubriste la trampa de cátedra:" : "❌ ¡Caíste en la trampa! El error estaba en:"}
                  </div>
                  <div>${escapeHtml(curCase.explanation)}</div>
                  <div style="margin-top:0.6rem;">
                    <button type="button" class="btn btn-primary btn-sm" id="trap-next-case">Siguiente Caso ▶</button>
                  </div>
                </div>
              ` : ""}
            </div>
          ` : `
            <div class="empty-state">No hay casos para el tema seleccionado.</div>
          `}
        </div>
      `;

      renderMathInSandbox(container);

      container.querySelectorAll("[data-trap-topic]").forEach((btn) => {
        btn.addEventListener("click", () => {
          state.topicFilter = btn.getAttribute("data-trap-topic");
          state.idx = 0;
          renderGame();
        });
      });

      container.querySelectorAll("[data-line]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const picked = Number(btn.getAttribute("data-line"));
          const ok = picked === curCase.trapLineIdx;
          state.resultsById[curCase.id] = { picked, ok };
          if (ok) {
            state.score += 10;
            state.streak += 1;
            if (state.streak > state.bestStreak) state.bestStreak = state.streak;
            if (typeof onAwardXp === "function") onAwardXp(curCase.id, true);
          } else {
            state.streak = 0;
            if (typeof onAwardXp === "function") onAwardXp(curCase.id, false);
          }
          renderGame();
        });
      });

      const nextBtn = container.querySelector("#trap-next-case");
      if (nextBtn) {
        nextBtn.addEventListener("click", () => {
          state.idx = (state.idx + 1) % cases.length;
          renderGame();
        });
      }

      const sprintBtn = container.querySelector("#trap-btn-sprint");
      if (sprintBtn) {
        sprintBtn.addEventListener("click", () => {
          if (state.sprintActive) {
            clearAllSandboxTimers();
            state.sprintActive = false;
            renderGame();
          } else {
            clearAllSandboxTimers();
            state.sprintActive = true;
            state.sprintTimeLeft = 60;
            state.score = 0;
            state.streak = 0;
            trackInterval(() => {
              state.sprintTimeLeft -= 1;
              if (state.sprintTimeLeft <= 0) {
                clearAllSandboxTimers();
                state.sprintActive = false;
                state.sprintFinished = true;
              }
              renderGame();
            }, 1000);
            renderGame();
          }
        });
      }

      const restartAllBtn = container.querySelector("#trap-restart-all");
      if (restartAllBtn) {
        restartAllBtn.addEventListener("click", () => {
          clearAllSandboxTimers();
          state.sprintActive = false;
          state.sprintFinished = false;
          state.score = 0;
          state.streak = 0;
          state.idx = 0;
          state.selectedLine = null;
          state.resultsById = {};
          renderGame();
        });
      }
    };

    renderGame();
  }

  return {
    escapeHtml,
    readThemeColors,
    renderMathInSandbox,
    clearAllSandboxTimers,
    renderSpeedSelectorHtml,
    getSpeedDelay,
    computeKnnDecision,
    HOPFIELD_PATTERNS,
    buildHopfieldWeights,
    computeHopfieldEnergy,
    stepHopfield,
    stepHopfieldAsync,
    detectHopfieldAttractor,
    somStep,
    somInference,
    computeSomDecay,
    computeUpgmaTree,
    computeClustersAtCutHeight,
    computeAgRoulette,
    computeAgExpectedCopies,
    simulateAgGenerationStep,
    simulateAgGenerations,
    TRAP_CASES,
    mountKnnSandbox,
    mountHopfieldSandbox,
    mountSomSandbox,
    mountClusteringSandbox,
    mountAgSandbox,
    mountSandboxesHub,
    mountTrapHunterGame
  };
});
