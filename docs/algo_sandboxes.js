(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.AlgoSandboxes = factory();
  }
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  function escapeHtml(str) {
    return String(str === null || str === undefined ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function readThemeColors() {
    if (typeof window === "undefined" || !window.getComputedStyle) {
      return {
        bgCard: "#1e293b",
        bgSubtle: "#111827",
        border: "#334155",
        text: "#f8fafc",
        muted: "#94a3b8",
        primary: "#6366f1",
        success: "#10b981",
        warning: "#f59e0b",
        danger: "#ef4444"
      };
    }
    const cs = getComputedStyle(document.documentElement);
    const get = (k, fb) => (cs.getPropertyValue(k) || "").trim() || fb;
    return {
      bgCard: get("--bg-card", "#1e293b"),
      bgSubtle: get("--bg-subtle", "#111827"),
      border: get("--border-color", "#334155"),
      text: get("--text-main", "#f8fafc"),
      muted: get("--text-muted", "#94a3b8"),
      primary: get("--primary", "#6366f1"),
      success: get("--success", "#10b981"),
      warning: get("--warning", "#f59e0b"),
      danger: get("--danger", "#ef4444")
    };
  }

  // ---------------------------------------------------------------------------
  // Pure Math Engines (Testable in Node)
  // ---------------------------------------------------------------------------
  function computeKnnDecision(points, query, k = 3, weighted = true) {
    const safePts = Array.isArray(points) ? points : [];
    if (safePts.length === 0) {
      return { neighbors: [], scoreA: 0, scoreB: 0, winner: "A" };
    }
    const sorted = safePts
      .map((p, idx) => {
        const d2 = Math.pow(p.x - query.x, 2) + Math.pow(p.y - query.y, 2);
        const d = Math.sqrt(d2);
        const w = d2 < 1e-6 ? 1e6 : 1 / d2;
        return { ...p, idx, d2, d, w };
      })
      .sort((a, b) => a.d2 - b.d2);

    const kClamped = Math.max(1, Math.min(k, sorted.length));
    const topK = sorted.slice(0, kClamped);
    let scoreA = 0;
    let scoreB = 0;
    topK.forEach((n) => {
      const add = weighted ? n.w : 1;
      if (n.cls === "A") scoreA += add;
      else scoreB += add;
    });
    return {
      neighbors: topK,
      scoreA,
      scoreB,
      winner: scoreA >= scoreB ? "A" : "B"
    };
  }

  // Hopfield 5x5 (25 neurons)
  const HOPFIELD_PATTERNS = {
    T: [
      1, 1, 1, 1, 1,
      -1, -1, 1, -1, -1,
      -1, -1, 1, -1, -1,
      -1, -1, 1, -1, -1,
      -1, -1, 1, -1, -1
    ],
    X: [
      1, -1, -1, -1, 1,
      -1, 1, -1, 1, -1,
      -1, -1, 1, -1, -1,
      -1, 1, -1, 1, -1,
      1, -1, -1, -1, 1
    ],
    L: [
      1, -1, -1, -1, -1,
      1, -1, -1, -1, -1,
      1, -1, -1, -1, -1,
      1, -1, -1, -1, -1,
      1, 1, 1, 1, 1
    ],
    C: [
      1, 1, 1, 1, 1,
      1, -1, -1, -1, -1,
      1, -1, -1, -1, -1,
      1, -1, -1, -1, -1,
      1, 1, 1, 1, 1
    ]
  };

  function buildHopfieldWeights(patternKeys) {
    const N = 25;
    const W = Array.from({ length: N }, () => new Array(N).fill(0));
    const pats = (patternKeys || [])
      .map((k) => (typeof k === "string" ? HOPFIELD_PATTERNS[k] : (Array.isArray(k) ? k : null)))
      .filter(Boolean);
    if (pats.length === 0) return W;
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        if (i === j) {
          W[i][j] = 0; // w_ii = 0 obligatorio
          continue;
        }
        let sum = 0;
        for (const p of pats) sum += p[i] * p[j];
        W[i][j] = sum;
      }
    }
    return W;
  }

  function computeHopfieldEnergy(state, W) {
    const N = state.length;
    let sum = 0;
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        sum += W[i][j] * state[i] * state[j];
      }
    }
    return -0.5 * sum;
  }

  function stepHopfield(state, W) {
    const N = state.length;
    const next = new Array(N);
    let changed = 0;
    for (let i = 0; i < N; i++) {
      let net = 0;
      for (let j = 0; j < N; j++) net += W[i][j] * state[j];
      // UTN rule: preserve s_i(t) if net_i === 0
      const sNew = net > 0 ? 1 : (net < 0 ? -1 : state[i]);
      next[i] = sNew;
      if (sNew !== state[i]) changed++;
    }
    return {
      nextState: next,
      changed,
      converged: changed === 0,
      energy: computeHopfieldEnergy(next, W)
    };
  }

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
      // Continuous neighborhood Gaussian / rational kernel
      const h = Math.exp(-(gridDist * gridDist) / (2 * sigma * sigma));
      return {
        ...n,
        x: n.x + alpha * h * (p.x - n.x),
        y: n.y + alpha * h * (p.y - n.y),
        lastH: h,
        isBmu: idx === bmuIdx
      };
    });
    return { neurons: updated, bmuIdx, bmuLabel: bmu.label, minDist };
  }

  function computeUpgmaTree(points) {
    if (!Array.isArray(points) || points.length === 0) return { nodes: [], merges: [] };
    const origDist = Array.from({ length: points.length }, (_, i) =>
      Array.from({ length: points.length }, (__, j) =>
        Math.hypot(points[i].x - points[j].x, points[i].y - points[j].y)
      )
    );
    let active = points.map((p, idx) => ({
      id: p.label,
      members: [idx],
      height: 0,
      left: null,
      right: null,
      leafOrder: idx
    }));
    const merges = [];
    while (active.length > 1) {
      let bestI = 0;
      let bestJ = 1;
      let bestD = Infinity;
      for (let i = 0; i < active.length; i++) {
        for (let j = i + 1; j < active.length; j++) {
          let sum = 0;
          for (const m1 of active[i].members) {
            for (const m2 of active[j].members) sum += origDist[m1][m2];
          }
          const avg = sum / (active[i].members.length * active[j].members.length);
          if (avg < bestD) {
            bestD = avg;
            bestI = i;
            bestJ = j;
          }
        }
      }
      const c1 = active[bestI];
      const c2 = active[bestJ];
      const merged = {
        id: `${c1.id}+${c2.id}`,
        members: [...c1.members, ...c2.members],
        height: bestD,
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
    return { root: active[0], merges };
  }

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

  function simulateAgGenerations(fitnessArr, gens = 10) {
    let pop = (fitnessArr || [20, 45, 25, 10]).map((v) => Math.max(1, Number(v) || 1));
    const history = [];
    for (let g = 0; g <= gens; g++) {
      const avg = pop.reduce((a, b) => a + b, 0) / pop.length;
      const max = Math.max(...pop);
      history.push({ gen: g, avg: +avg.toFixed(1), max: +max.toFixed(1) });
      // Deterministic roulette/tournament selection + slight improvement drift
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
  // 10 Authentic UTN Exam Trap Cases ("Cazador de Trampas de Parcial")
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
  // State & Controllers for Live UI Mounting
  // ---------------------------------------------------------------------------
  let somAutoTimer = null;
  let hopAutoTimer = null;
  let trapSprintTimer = null;

  function clearAllSandboxTimers() {
    if (somAutoTimer) { clearInterval(somAutoTimer); somAutoTimer = null; }
    if (hopAutoTimer) { clearInterval(hopAutoTimer); hopAutoTimer = null; }
    if (trapSprintTimer) { clearInterval(trapSprintTimer); trapSprintTimer = null; }
  }

  // 1. KNN Interactive Canvas Sandbox
  function mountKnnSandbox(hostEl) {
    const state = {
      points: [
        { x: 0.48, y: 0.50, cls: "A" },
        { x: 0.25, y: 0.30, cls: "A" },
        { x: 0.72, y: 0.36, cls: "B" },
        { x: 0.74, y: 0.68, cls: "B" },
        { x: 0.62, y: 0.80, cls: "B" },
        { x: 0.28, y: 0.72, cls: "A" }
      ],
      query: { x: 0.55, y: 0.52 },
      tool: "query", // "query" | "A" | "B"
      k: 3,
      weighted: true,
      showMap: true
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

      // Decision region heatmap (6px step)
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

      // Subtle grid
      ctx.strokeStyle = c.border;
      ctx.globalAlpha = 0.35;
      ctx.lineWidth = 1;
      for (let i = 1; i < 4; i++) {
        ctx.beginPath(); ctx.moveTo((W * i) / 4, 0); ctx.lineTo((W * i) / 4, H); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, (H * i) / 4); ctx.lineTo(W, (H * i) / 4); ctx.stroke();
      }
      ctx.globalAlpha = 1;

      const decision = computeKnnDecision(state.points, state.query, state.k, state.weighted);
      const qx = state.query.x * W;
      const qy = state.query.y * H;

      // Dashed lines + radius to k-th neighbor
      if (decision.neighbors.length > 0) {
        const maxD = decision.neighbors[decision.neighbors.length - 1];
        const rPx = Math.hypot((maxD.x - state.query.x) * W, (maxD.y - state.query.y) * H);
        ctx.beginPath();
        ctx.arc(qx, qy, rPx, 0, Math.PI * 2);
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

      // Training points
      state.points.forEach((p) => {
        const x = p.x * W;
        const y = p.y * H;
        ctx.beginPath();
        ctx.arc(x, y, 7, 0, Math.PI * 2);
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

      // Query point diamond
      ctx.beginPath();
      ctx.moveTo(qx, qy - 9);
      ctx.lineTo(qx + 9, qy);
      ctx.lineTo(qx, qy + 9);
      ctx.lineTo(qx - 9, qy);
      ctx.closePath();
      ctx.fillStyle = c.danger;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#fff";
      ctx.stroke();

      // Update side readout
      const readoutEl = hostEl.querySelector("#sb-knn-readout");
      if (readoutEl) {
        const totalScore = Math.max(0.0001, decision.scoreA + decision.scoreB);
        const pctA = Math.round((decision.scoreA / totalScore) * 100);
        const pctB = 100 - pctA;
        const nbRows = decision.neighbors.map((nb, i) => `
          <tr>
            <td>#${i + 1}</td>
            <td><span class="sb-dot-${nb.cls}">● Clase ${nb.cls}</span></td>
            <td class="vw-tabular">${(nb.d * 10).toFixed(2)}</td>
            <td class="vw-tabular">${state.weighted ? (1 / Math.max(0.01, (nb.d * 10) ** 2)).toFixed(3) : "1"}</td>
          </tr>
        `).join("");

        readoutEl.innerHTML = `
          <div class="sb-verdict-box">
            <span>Clasificación de consulta <strong>q</strong> (k=${state.k}):</span>
            <span class="sb-winner-pill cls-${decision.winner}">Gana Clase ${decision.winner}</span>
          </div>
          <div class="sb-bar-group">
            <div class="sb-bar-row"><span>Clase A (${pctA}%)</span><div class="sb-bar-track"><div style="width:${pctA}%;background:var(--success);"></div></div></div>
            <div class="sb-bar-row"><span>Clase B (${pctB}%)</span><div class="sb-bar-track"><div style="width:${pctB}%;background:var(--warning);"></div></div></div>
          </div>
          <div class="pe-table-wrap">
            <table class="pe-data-table">
              <thead><tr><th>Vecino</th><th>Clase</th><th>d(q,x)</th><th>Peso</th></tr></thead>
              <tbody>${nbRows}</tbody>
            </table>
          </div>
        `;
      }
    };

    const renderShell = () => {
      hostEl.innerHTML = `
        <div class="sb-toolbar">
          <div class="sb-btn-group">
            <button type="button" class="pe-mode-pill ${state.tool === "query" ? "active" : ""}" data-tool="query">📍 Mover q</button>
            <button type="button" class="pe-mode-pill ${state.tool === "A" ? "active" : ""}" data-tool="A">🟢 Punto A</button>
            <button type="button" class="pe-mode-pill ${state.tool === "B" ? "active" : ""}" data-tool="B">🟠 Punto B</button>
            <button type="button" class="btn btn-outline btn-sm" id="sb-knn-reset">↺ Caso clásico</button>
          </div>
          <div class="sb-btn-group">
            <label class="sb-inline-ctl">k:
              <select id="sb-knn-k" class="inline-input">${[1, 3, 5, 7].map((v) => `<option value="${v}" ${state.k === v ? "selected" : ""}>${v}</option>`).join("")}</select>
            </label>
            <button type="button" class="pe-mode-pill ${state.weighted ? "active" : ""}" id="sb-knn-mode">${state.weighted ? "⚖️ Ponderado 1/d²" : "🗳️ Mayoría Simple"}</button>
            <label class="sb-inline-ctl"><input type="checkbox" id="sb-knn-map" ${state.showMap ? "checked" : ""}/> Fronteras</label>
          </div>
        </div>
        <div class="sb-split-grid">
          <div class="sb-canvas-wrap">
            <canvas id="sb-knn-canvas" width="460" height="320" class="sb-canvas" title="Hacé clic para mover q o agregar puntos"></canvas>
            <div class="sb-canvas-hint">💡 Hacé clic sobre el plano para ${state.tool === "query" ? "mover la consulta ◆ q" : `agregar un punto Clase ${state.tool}`}. Probá alternar <strong>1/d²</strong> vs <strong>Mayoría Simple</strong>.</div>
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
      hostEl.querySelector("#sb-knn-k").addEventListener("change", (e) => {
        state.k = Number(e.target.value) || 3;
        draw();
      });
      hostEl.querySelector("#sb-knn-mode").addEventListener("click", () => {
        state.weighted = !state.weighted;
        renderShell();
      });
      hostEl.querySelector("#sb-knn-map").addEventListener("change", (e) => {
        state.showMap = Boolean(e.target.checked);
        draw();
      });
      hostEl.querySelector("#sb-knn-reset").addEventListener("click", () => {
        mountKnnSandbox(hostEl);
      });

      const canvas = hostEl.querySelector("#sb-knn-canvas");
      canvas.addEventListener("click", (ev) => {
        const rect = canvas.getBoundingClientRect();
        const nx = Math.max(0.05, Math.min(0.95, (ev.clientX - rect.left) / rect.width));
        const ny = Math.max(0.05, Math.min(0.95, (ev.clientY - rect.top) / rect.height));
        if (state.tool === "query") {
          state.query = { x: nx, y: ny };
        } else {
          state.points.push({ x: nx, y: ny, cls: state.tool });
        }
        draw();
      });

      draw();
    };

    renderShell();
  }

  // 2. Hopfield 5x5 Visual Sandbox + Lyapunov Energy Curve
  function mountHopfieldSandbox(hostEl) {
    const state = {
      stored: ["T", "X"],
      grid: [...HOPFIELD_PATTERNS.T],
      energyHistory: [],
      stepCount: 0,
      lastChanged: null
    };
    // Start with 2 corrupted bits so recovery is immediate
    state.grid[0] = -1;
    state.grid[6] = 1;
    state.grid[18] = 1;

    const recalcInitEnergy = () => {
      const W = buildHopfieldWeights(state.stored);
      state.energyHistory = [computeHopfieldEnergy(state.grid, W)];
      state.stepCount = 0;
      state.lastChanged = null;
    };
    recalcInitEnergy();

    const buildEnergySparkline = (hist) => {
      if (!hist || hist.length === 0) return "";
      const minE = Math.min(...hist, -300);
      const maxE = Math.max(...hist, 0);
      const span = Math.max(10, maxE - minE);
      const pts = hist.map((val, idx) => {
        const x = hist.length === 1 ? 130 : 18 + (idx / (hist.length - 1)) * 224;
        const y = 70 - ((val - minE) / span) * 52;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      }).join(" ");
      return `
        <svg viewBox="0 0 260 88" class="vw-svg-chart" aria-label="Energía de Lyapunov E(t)">
          <line x1="18" y1="74" x2="244" y2="74" stroke="var(--border-color)" stroke-width="1" />
          ${hist.length >= 2 ? `<polyline fill="none" stroke="var(--success)" stroke-width="2.4" points="${pts}" />` : ""}
          ${hist.map((val, idx) => {
            const x = hist.length === 1 ? 130 : 18 + (idx / (hist.length - 1)) * 224;
            const y = 70 - ((val - minE) / span) * 52;
            return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.6" fill="var(--primary)"><title>t=${idx}: E=${val.toFixed(1)}</title></circle>`;
          }).join("")}
          <text x="130" y="85" text-anchor="middle" font-size="9" fill="var(--text-muted)">Energía de Lyapunov E(t) — actual: ${hist[hist.length - 1].toFixed(0)}</text>
        </svg>
      `;
    };

    const render = () => {
      const W = buildHopfieldWeights(state.stored);
      const matches = Object.keys(HOPFIELD_PATTERNS).map((k) => {
        const pat = HOPFIELD_PATTERNS[k];
        const same = pat.filter((v, i) => v === state.grid[i]).length;
        const pct = Math.round((same / 25) * 100);
        return { key: k, pct, stored: state.stored.includes(k) };
      });
      const converged = state.lastChanged === 0;

      hostEl.innerHTML = `
        <div class="sb-toolbar">
          <div class="sb-btn-group">
            <span style="font-size:0.84rem;font-weight:700;">Memorias guardadas (W Hebbiana, w_ii=0):</span>
            ${["T", "X", "L", "C"].map((k) => `
              <button type="button" class="pe-mode-pill ${state.stored.includes(k) ? "active" : ""}" data-store="${k}">
                ${state.stored.includes(k) ? "✓ " : ""}${k}
              </button>
            `).join("")}
          </div>
          <div class="sb-btn-group">
            <span style="font-size:0.82rem;color:var(--text-muted);">Cargar patrón:</span>
            ${["T", "X", "L", "C"].map((k) => `<button type="button" class="btn btn-outline btn-sm" data-load="${k}">${k}</button>`).join("")}
            <button type="button" class="btn btn-outline btn-sm" id="sb-hop-noise">🎲 +20% Ruido</button>
          </div>
        </div>
        <div class="sb-split-grid">
          <div class="sb-canvas-wrap" style="text-align:center;">
            <div class="sb-hop-grid" id="sb-hop-grid">
              ${state.grid.map((v, i) => `
                <button type="button" class="sb-hop-cell ${v > 0 ? "on" : ""}" data-cell="${i}" title="Neurona ${i + 1}: ${v > 0 ? "+1" : "-1"}">${v > 0 ? "+1" : "−1"}</button>
              `).join("")}
            </div>
            <div style="display:flex;justify-content:center;gap:0.5rem;flex-wrap:wrap;margin-top:0.75rem;">
              <button type="button" class="btn btn-outline btn-sm" id="sb-hop-step">⚡ 1 Paso Síncrono</button>
              <button type="button" class="btn btn-primary btn-sm" id="sb-hop-auto">▶ Auto-Converger</button>
            </div>
            <div class="sb-canvas-hint">💡 Hacé clic en las celdas para invertir bits y probá activar 3 o 4 letras para ver la saturación por mínimos espurios.</div>
          </div>
          <div class="sb-readout-panel">
            <div class="sb-verdict-box">
              <span>Paso <strong>t = ${state.stepCount}</strong></span>
              <span class="sb-winner-pill ${converged ? "cls-A" : ""}">${converged ? "✅ Atractor estable" : "⚡ Listo para actualizar"}</span>
            </div>
            ${buildEnergySparkline(state.energyHistory)}
            <div style="font-size:0.82rem;font-weight:700;margin-top:0.4rem;">Similitud con patrones:</div>
            <div class="sb-bar-group">
              ${matches.filter((m) => m.stored || m.pct >= 68).map((m) => `
                <div class="sb-bar-row">
                  <span>Patrón ${m.key} ${m.stored ? "(guardado)" : "(no guardado)"}: ${m.pct}%</span>
                  <div class="sb-bar-track"><div style="width:${m.pct}%;background:${m.pct === 100 ? "var(--success)" : "var(--primary)"};"></div></div>
                </div>
              `).join("")}
            </div>
          </div>
        </div>
      `;

      hostEl.querySelectorAll("[data-store]").forEach((btn) => {
        btn.addEventListener("click", () => {
          clearAllSandboxTimers();
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
          const k = btn.getAttribute("data-load");
          state.grid = [...HOPFIELD_PATTERNS[k]];
          recalcInitEnergy();
          render();
        });
      });

      hostEl.querySelector("#sb-hop-noise").addEventListener("click", () => {
        clearAllSandboxTimers();
        for (let i = 0; i < 5; i++) {
          const idx = Math.floor(Math.random() * 25);
          state.grid[idx] = -state.grid[idx];
        }
        recalcInitEnergy();
        render();
      });

      hostEl.querySelectorAll("[data-cell]").forEach((btn) => {
        btn.addEventListener("click", () => {
          clearAllSandboxTimers();
          const i = Number(btn.getAttribute("data-cell"));
          state.grid[i] = -state.grid[i];
          recalcInitEnergy();
          render();
        });
      });

      const doOneStep = () => {
        const res = stepHopfield(state.grid, buildHopfieldWeights(state.stored));
        state.grid = res.nextState;
        state.stepCount += 1;
        state.lastChanged = res.changed;
        state.energyHistory.push(res.energy);
        render();
        return res.changed > 0;
      };

      hostEl.querySelector("#sb-hop-step").addEventListener("click", () => {
        clearAllSandboxTimers();
        doOneStep();
      });

      hostEl.querySelector("#sb-hop-auto").addEventListener("click", () => {
        clearAllSandboxTimers();
        let guard = 0;
        hopAutoTimer = setInterval(() => {
          if (!document.body.contains(hostEl) || guard++ >= 10) {
            clearAllSandboxTimers();
            return;
          }
          const changed = doOneStep();
          if (!changed) clearAllSandboxTimers();
        }, 420);
      });
    };

    render();
  }

  // 3. SOM Kohonen 2D Live Topological Mesh
  function mountSomSandbox(hostEl) {
    const state = {
      topo: "grid3", // "line3" | "grid3"
      distMode: "cloud", // "cloud" | "ring" | "clusters"
      alpha: 0.45,
      sigma: 1.0,
      steps: 0,
      lastPattern: null,
      lastBmu: null,
      neurons: [],
      running: false
    };

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
      state.steps = 0;
      state.lastPattern = null;
      state.lastBmu = null;
    };
    initNeurons();

    const samplePattern = () => {
      if (state.distMode === "ring") {
        const ang = Math.random() * Math.PI * 2;
        const r = 0.26 + Math.random() * 0.12;
        return { x: 0.5 + r * Math.cos(ang), y: 0.5 + r * Math.sin(ang) };
      }
      if (state.distMode === "clusters") {
        const centers = [{ x: 0.22, y: 0.24 }, { x: 0.78, y: 0.28 }, { x: 0.5, y: 0.78 }];
        const c = centers[Math.floor(Math.random() * centers.length)];
        return {
          x: Math.max(0.06, Math.min(0.94, c.x + (Math.random() - 0.5) * 0.18)),
          y: Math.max(0.06, Math.min(0.94, c.y + (Math.random() - 0.5) * 0.18))
        };
      }
      return { x: 0.12 + Math.random() * 0.76, y: 0.12 + Math.random() * 0.76 };
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

      // Draw topological mesh links
      ctx.strokeStyle = c.border;
      ctx.lineWidth = 2;
      state.neurons.forEach((a) => {
        state.neurons.forEach((b) => {
          if (Math.abs(a.gx - b.gx) + Math.abs(a.gy - b.gy) === 1 && (a.gx < b.gx || a.gy < b.gy)) {
            ctx.beginPath();
            ctx.moveTo(a.x * W, a.y * H);
            ctx.lineTo(b.x * W, b.y * H);
            ctx.stroke();
          }
        });
      });

      // Last input pattern + BMU neighborhood ring
      if (state.lastPattern) {
        const px = state.lastPattern.x * W;
        const py = state.lastPattern.y * H;
        const bmu = state.neurons.find((n) => n.isBmu);
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

      // Neurons
      state.neurons.forEach((n) => {
        const nx = n.x * W;
        const ny = n.y * H;
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

      const infoEl = hostEl.querySelector("#sb-som-info");
      if (infoEl) {
        infoEl.innerHTML = `
          <div><strong>Iteraciones:</strong> ${state.steps}</div>
          <div><strong>Última BMU:</strong> ${state.lastBmu ? escapeHtml(state.lastBmu) : "—"}</div>
          <div><strong>α =</strong> ${state.alpha.toFixed(2)} · <strong>σ =</strong> ${state.sigma.toFixed(2)}</div>
        `;
      }
    };

    const feedPattern = (p) => {
      const res = somStep(state.neurons, p, state.alpha, state.sigma);
      state.neurons = res.neurons;
      state.lastPattern = p;
      state.lastBmu = res.bmuLabel;
      state.steps += 1;
      draw();
    };

    const renderShell = () => {
      hostEl.innerHTML = `
        <div class="sb-toolbar">
          <div class="sb-btn-group">
            <button type="button" class="pe-mode-pill ${state.topo === "line3" ? "active" : ""}" data-topo="line3">Cadena 1×3 (Parcial)</button>
            <button type="button" class="pe-mode-pill ${state.topo === "grid3" ? "active" : ""}" data-topo="grid3">Grilla 3×3 (Mapa 2D)</button>
            <select id="sb-som-dist" class="inline-input">
              <option value="cloud" ${state.distMode === "cloud" ? "selected" : ""}>Nube uniforme</option>
              <option value="ring" ${state.distMode === "ring" ? "selected" : ""}>Anillo / Aro</option>
              <option value="clusters" ${state.distMode === "clusters" ? "selected" : ""}>3 Clusters</option>
            </select>
          </div>
          <div class="sb-btn-group">
            <label class="sb-inline-ctl">α <input id="sb-som-alpha" type="range" min="0.1" max="0.8" step="0.05" value="${state.alpha}" /></label>
            <label class="sb-inline-ctl">σ <input id="sb-som-sigma" type="range" min="0.4" max="1.8" step="0.1" value="${state.sigma}" /></label>
            <button type="button" class="btn btn-primary btn-sm" id="sb-som-auto">${state.running ? "⏸ Pausar" : "▶ Auto-Entrenar"}</button>
            <button type="button" class="btn btn-outline btn-sm" id="sb-som-reset">↺ Reiniciar</button>
          </div>
        </div>
        <div class="sb-split-grid">
          <div class="sb-canvas-wrap">
            <canvas id="sb-som-canvas" width="460" height="320" class="sb-canvas"></canvas>
            <div class="sb-canvas-hint">💡 Hacé clic para lanzar un patrón ▲ p y ver cómo la BMU arrastra a sus vecinas según h(j,j*).</div>
          </div>
          <div class="sb-readout-panel">
            <div id="sb-som-info" class="sb-verdict-box" style="flex-direction:column;align-items:flex-start;gap:0.35rem;"></div>
            <p style="font-size:0.83rem;color:var(--text-muted);margin-top:0.6rem;line-height:1.45;">
              En <strong>Grilla 3×3</strong> con distribución <em>Anillo</em> o <em>3 Clusters</em> podés ver cómo la red se despliega tratando de preservar la topología vecina mientras cubre los datos.
            </p>
          </div>
        </div>
      `;

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
      });
      hostEl.querySelector("#sb-som-alpha").addEventListener("input", (e) => {
        state.alpha = Number(e.target.value);
        draw();
      });
      hostEl.querySelector("#sb-som-sigma").addEventListener("input", (e) => {
        state.sigma = Number(e.target.value);
        draw();
      });
      hostEl.querySelector("#sb-som-reset").addEventListener("click", () => {
        clearAllSandboxTimers();
        state.running = false;
        initNeurons();
        renderShell();
      });
      hostEl.querySelector("#sb-som-auto").addEventListener("click", () => {
        if (state.running) {
          clearAllSandboxTimers();
          state.running = false;
          renderShell();
        } else {
          clearAllSandboxTimers();
          state.running = true;
          renderShell();
          somAutoTimer = setInterval(() => {
            if (!document.body.contains(hostEl)) {
              clearAllSandboxTimers();
              return;
            }
            feedPattern(samplePattern());
          }, 160);
        }
      });

      const canvas = hostEl.querySelector("#sb-som-canvas");
      canvas.addEventListener("click", (ev) => {
        const rect = canvas.getBoundingClientRect();
        const x = Math.max(0.04, Math.min(0.96, (ev.clientX - rect.left) / rect.width));
        const y = Math.max(0.04, Math.min(0.96, (ev.clientY - rect.top) / rect.height));
        feedPattern({ x, y });
      });

      draw();
    };

    renderShell();
  }

  // 4. Clustering Jerárquico UPGMA + Real Proportional Dendrogram
  function mountClusteringSandbox(hostEl) {
    const state = {
      points: [
        { label: "A", x: 1.8, y: 7.4 },
        { label: "B", x: 4.5, y: 5.5 },
        { label: "C", x: 6.8, y: 3.1 },
        { label: "D", x: 2.3, y: 5.6 },
        { label: "E", x: 7.6, y: 2.8 }
      ],
      visibleStep: 4
    };

    const drawDendrogramSvg = (tree, shownSteps) => {
      const { root, merges } = tree;
      if (!root) return "";
      const leafOrder = [];
      const collectLeaves = (node) => {
        if (!node.left && !node.right) leafOrder.push(node);
        else { collectLeaves(node.left); collectLeaves(node.right); }
      };
      collectLeaves(root);

      const W = 320;
      const H = 220;
      const padL = 36;
      const padR = 16;
      const padT = 18;
      const padB = 28;
      const maxH = Math.max(0.5, root.height * 1.12);
      const xPos = new Map();
      leafOrder.forEach((lf, i) => {
        xPos.set(lf, padL + (i / Math.max(1, leafOrder.length - 1)) * (W - padL - padR));
      });
      const yFor = (h) => H - padB - (h / maxH) * (H - padT - padB);

      const activeMerges = new Set(merges.slice(0, shownSteps));
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
        if (!activeMerges.has(node)) return;
        const L = getCoord(node.left);
        const R = getCoord(node.right);
        const yTop = yFor(node.height);
        paths.push(`<path d="M${L.x.toFixed(1)},${L.y.toFixed(1)} V${yTop.toFixed(1)} H${R.x.toFixed(1)} V${R.y.toFixed(1)}" fill="none" stroke="var(--primary)" stroke-width="2.2" />`);
        paths.push(`<text x="${((L.x + R.x) / 2).toFixed(1)}" y="${(yTop - 4).toFixed(1)}" text-anchor="middle" font-size="9" font-weight="700" fill="var(--success)">${node.height.toFixed(2)}</text>`);
      };
      walkPaths(root);

      const ticks = [0, 0.5, 1].map((f) => {
        const val = maxH * f;
        const y = yFor(val);
        return `<line x1="${padL - 4}" y1="${y.toFixed(1)}" x2="${W - padR}" y2="${y.toFixed(1)}" stroke="var(--border-color)" stroke-dasharray="3 3" opacity="0.5" />
          <text x="${padL - 6}" y="${(y + 3).toFixed(1)}" text-anchor="end" font-size="8.5" fill="var(--text-muted)">${val.toFixed(1)}</text>`;
      }).join("");

      const leafLabels = leafOrder.map((lf) =>
        `<text x="${xPos.get(lf).toFixed(1)}" y="${H - 10}" text-anchor="middle" font-size="11" font-weight="800" fill="var(--text-main)">${escapeHtml(lf.id)}</text>`
      ).join("");

      return `
        <svg viewBox="0 0 ${W} ${H}" class="vw-svg-chart" role="img" aria-label="Dendrograma UPGMA en tiempo real">
          ${ticks}
          ${paths.join("")}
          ${leafLabels}
        </svg>
      `;
    };

    const render = () => {
      const tree = computeUpgmaTree(state.points);
      state.visibleStep = Math.max(0, Math.min(tree.merges.length, state.visibleStep));
      const c = readThemeColors();

      hostEl.innerHTML = `
        <div class="sb-toolbar">
          <div class="sb-btn-group">
            <span style="font-size:0.84rem;font-weight:700;">Fusiones visibles: ${state.visibleStep}/${tree.merges.length}</span>
            <button type="button" class="btn btn-outline btn-sm" id="sb-clu-prev">◀</button>
            <button type="button" class="btn btn-primary btn-sm" id="sb-clu-next">▶ Siguiente Fusión</button>
            <button type="button" class="btn btn-outline btn-sm" id="sb-clu-reset">↺ Caso Base (5 pts)</button>
          </div>
          <div style="font-size:0.78rem;color:var(--text-muted);">Hacé clic en el plano para agregar puntos hasta G (${state.points.length}/7)</div>
        </div>
        <div class="sb-split-grid">
          <div class="sb-canvas-wrap">
            <canvas id="sb-clu-canvas" width="400" height="270" class="sb-canvas"></canvas>
          </div>
          <div class="sb-readout-panel">
            <div class="vw-chart-title" style="margin-bottom:0.35rem;">Dendrograma UPGMA (altura exacta |C1|·|C2|)</div>
            ${drawDendrogramSvg(tree, state.visibleStep)}
            <div style="font-size:0.8rem;margin-top:0.5rem;">
              ${tree.merges.slice(0, state.visibleStep).map((m, idx) =>
                `<div><strong>Fusión ${idx + 1}:</strong> {${escapeHtml(m.c1Label)}} + {${escapeHtml(m.c2Label)}} → d = <strong>${m.height.toFixed(3)}</strong></div>`
              ).join("") || `<span style="color:var(--text-muted);">Usá "▶ Siguiente Fusión" para armar el árbol.</span>`}
            </div>
          </div>
        </div>
      `;

      const canvas = hostEl.querySelector("#sb-clu-canvas");
      const ctx = canvas.getContext("2d");
      const W = canvas.width;
      const H = canvas.height;
      ctx.fillStyle = c.bgSubtle;
      ctx.fillRect(0, 0, W, H);
      const sx = (x) => (x / 10) * (W - 36) + 18;
      const sy = (y) => H - 18 - (y / 10) * (H - 36);

      // Draw bounding ellipses around merged clusters up to visibleStep
      tree.merges.slice(0, state.visibleStep).forEach((m) => {
        const xs = m.members.map((idx) => sx(state.points[idx].x));
        const ys = m.members.map((idx) => sy(state.points[idx].y));
        const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
        const cy = (Math.min(...ys) + Math.max(...ys)) / 2;
        const rx = Math.max(22, (Math.max(...xs) - Math.min(...xs)) / 2 + 18);
        const ry = Math.max(20, (Math.max(...ys) - Math.min(...ys)) / 2 + 16);
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        ctx.strokeStyle = c.primary;
        ctx.setLineDash([4, 3]);
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.setLineDash([]);
      });

      state.points.forEach((p) => {
        const px = sx(p.x);
        const py = sy(p.y);
        ctx.beginPath();
        ctx.arc(px, py, 10, 0, Math.PI * 2);
        ctx.fillStyle = c.primary;
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 1.8;
        ctx.stroke();
        ctx.fillStyle = "#fff";
        ctx.font = "bold 10px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(p.label, px, py + 0.5);
      });

      canvas.addEventListener("click", (ev) => {
        if (state.points.length >= 7) return;
        const rect = canvas.getBoundingClientRect();
        const nx = Math.max(0.5, Math.min(9.5, ((ev.clientX - rect.left) / rect.width) * 10));
        const ny = Math.max(0.5, Math.min(9.5, (1 - (ev.clientY - rect.top) / rect.height) * 10));
        const nextLabel = String.fromCharCode(65 + state.points.length);
        state.points.push({ label: nextLabel, x: nx, y: ny });
        state.visibleStep = state.points.length - 1;
        render();
      });

      hostEl.querySelector("#sb-clu-prev").addEventListener("click", () => {
        state.visibleStep = Math.max(0, state.visibleStep - 1);
        render();
      });
      hostEl.querySelector("#sb-clu-next").addEventListener("click", () => {
        state.visibleStep = Math.min(tree.merges.length, state.visibleStep + 1);
        render();
      });
      hostEl.querySelector("#sb-clu-reset").addEventListener("click", () => {
        mountClusteringSandbox(hostEl);
      });
    };

    render();
  }

  // 5. Algoritmos Genéticos: Ruleta Física [00-99] & Evolución
  function mountAgSandbox(hostEl) {
    const state = {
      fitness: [20, 45, 25, 10],
      wheelAngle: 0,
      lastR: null,
      lastWinner: null,
      spinCount: 0,
      colors: ["#6366f1", "#10b981", "#f59e0b", "#ec4899"]
    };

    const buildWheelSvg = (roulette) => {
      const r = 74;
      let startAng = 0;
      const slices = roulette.rows.map((row, idx) => {
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
          <path d="M0,0 L${x1},${y1} A${r},${r} 0 ${largeArc},1 ${x2},${y2} Z" fill="${state.colors[idx]}" opacity="0.82" stroke="var(--bg-card)" stroke-width="2" />
          <text x="${lx}" y="${ly}" text-anchor="middle" dominant-baseline="middle" font-size="11" font-weight="800" fill="#ffffff">${row.id}</text>
        `;
      }).join("");

      return `
        <svg viewBox="0 0 210 190" class="vw-algo-svg" style="max-width:220px;" role="img" aria-label="Ruleta genética">
          <g transform="translate(105 100)">
            <g style="transform: rotate(${state.wheelAngle}deg); transition: transform 1.1s cubic-bezier(0.16, 1, 0.3, 1);">
              ${slices}
              <circle r="10" fill="var(--bg-card)" stroke="var(--text-main)" stroke-width="2" />
            </g>
          </g>
          <polygon points="105,22 97,8 113,8" fill="var(--danger)" />
        </svg>
      `;
    };

    const buildEvolutionChart = (fitnessArr) => {
      const hist = simulateAgGenerations(fitnessArr, 8);
      const maxVal = Math.max(...hist.map((h) => h.max), 10);
      const ptsAvg = hist.map((h, i) => `${(24 + (i / 8) * 218).toFixed(1)},${(74 - (h.avg / maxVal) * 56).toFixed(1)}`).join(" ");
      const ptsMax = hist.map((h, i) => `${(24 + (i / 8) * 218).toFixed(1)},${(74 - (h.max / maxVal) * 56).toFixed(1)}`).join(" ");
      return `
        <svg viewBox="0 0 260 92" class="vw-svg-chart" aria-label="Curva de fitness promedio y máximo">
          <line x1="22" y1="76" x2="246" y2="76" stroke="var(--border-color)" stroke-width="1" />
          <polyline fill="none" stroke="var(--success)" stroke-width="2.2" points="${ptsMax}" />
          <polyline fill="none" stroke="var(--primary)" stroke-width="2.2" stroke-dasharray="4 2" points="${ptsAvg}" />
          <text x="132" y="88" text-anchor="middle" font-size="9" fill="var(--text-muted)">Evolución 8 gen: Máx (verde) vs Promedio (azul)</text>
        </svg>
      `;
    };

    const render = () => {
      const roulette = computeAgRoulette(state.fitness);
      hostEl.innerHTML = `
        <div class="sb-split-grid">
          <div class="sb-canvas-wrap" style="text-align:center;">
            ${buildWheelSvg(roulette)}
            <div style="margin-top:0.5rem;">
              <button type="button" class="btn btn-primary btn-sm" id="sb-ag-spin">🎰 Girar Ruleta [00–99]</button>
            </div>
            <div style="margin-top:0.45rem;font-size:0.86rem;">
              ${state.lastR !== null
                ? `Sorteo #${state.spinCount}: <strong>r = ${String(state.lastR).padStart(2, "0")}</strong> → Seleccionado <span class="sb-winner-pill cls-A">${escapeHtml(state.lastWinner)}</span>`
                : `<span style="color:var(--text-muted);">Ajustá los fitness y girá para sortear padres.</span>`}
            </div>
          </div>
          <div class="sb-readout-panel">
            <div class="sb-ag-sliders">
              ${roulette.rows.map((row, idx) => `
                <label class="sb-ag-row">
                  <span style="color:${state.colors[idx]};font-weight:800;">${row.id}</span>
                  <input type="range" min="5" max="90" value="${row.fitness}" data-ag-idx="${idx}" />
                  <span class="vw-tabular" style="min-width:118px;text-align:right;">f=${row.fitness} · [${String(row.startSlot).padStart(2, "0")}–${String(row.endSlot).padStart(2, "0")}]</span>
                </label>
              `).join("")}
            </div>
            ${buildEvolutionChart(state.fitness)}
          </div>
        </div>
      `;

      hostEl.querySelectorAll("[data-ag-idx]").forEach((inp) => {
        inp.addEventListener("change", (e) => {
          const idx = Number(e.target.getAttribute("data-ag-idx"));
          state.fitness[idx] = Number(e.target.value) || 10;
          render();
        });
      });

      hostEl.querySelector("#sb-ag-spin").addEventListener("click", () => {
        const r = Math.floor(Math.random() * 100);
        const match = roulette.rows.find((row) => r >= row.startSlot && r <= row.endSlot) || roulette.rows[0];
        const slotMidPct = (r + 0.5) / 100;
        const targetDeg = 360 - slotMidPct * 360;
        const currentMod = state.wheelAngle % 360;
        const delta = ((targetDeg - currentMod) + 360) % 360;
        state.wheelAngle += 720 + delta;
        state.lastR = r;
        state.lastWinner = match.id;
        state.spinCount += 1;
        render();
      });
    };

    render();
  }

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
            <p style="font-size:0.88rem;color:var(--text-muted);">Experimentá en tiempo real con datos reales (clic para agregar puntos, meter ruido o girar la ruleta) para consolidar la intuición antes del parcial.</p>
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
      idx: 0,
      selectedLine: null,
      score: 0,
      streak: 0,
      bestStreak: 0,
      answeredSet: new Set(),
      sprintActive: false,
      timeLeft: 60
    };

    const renderGame = () => {
      const c = TRAP_CASES[state.idx % TRAP_CASES.length];
      const hasPicked = state.selectedLine !== null;
      const isRight = hasPicked && state.selectedLine === c.trapLineIdx;

      container.innerHTML = `
        <div class="card">
          <div class="vw-vis-top">
            <div>
              <h2 style="font-size:1.15rem;margin-bottom:0.2rem;">🎯 Cazador de Trampas de Parcial</h2>
              <p style="font-size:0.86rem;color:var(--text-muted);">Cada desarrollo tiene <strong>1 error sutil típico de parcial</strong>. Hacé clic en la línea tramposa antes de caer en ella en tu hoja.</p>
            </div>
            <div class="hud-stat-pills">
              <span class="hud-pill">🎯 Aciertos: ${state.score}/${TRAP_CASES.length}</span>
              <span class="hud-pill ${state.streak >= 3 ? "streak-hot" : ""}">🔥 Racha: ${state.streak}</span>
              ${state.sprintActive
                ? `<span class="badge badge-timer ${state.timeLeft <= 15 ? "danger" : ""}" id="trap-sprint-timer">⏱ ${state.timeLeft}s</span>`
                : `<button type="button" class="btn btn-outline btn-sm" id="trap-sprint-btn">⏱️ Reto 60s</button>`}
            </div>
          </div>

          <div class="trap-card-box">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:0.5rem;margin-bottom:0.65rem;flex-wrap:wrap;">
              <span class="badge badge-topic">${escapeHtml(c.topic)}</span>
              <span style="font-size:0.82rem;color:var(--text-muted);">Caso ${state.idx + 1} de ${TRAP_CASES.length}</span>
            </div>
            <h3 style="font-size:1.02rem;margin-bottom:0.7rem;">${escapeHtml(c.title)}</h3>
            <div class="trap-lines-list">
              ${c.lines.map((ln, lIdx) => {
                let cls = "trap-line-btn";
                if (hasPicked) {
                  if (lIdx === c.trapLineIdx) cls += " is-trap-correct";
                  else if (lIdx === state.selectedLine) cls += " is-trap-wrong";
                }
                return `<button type="button" class="${cls}" data-line="${lIdx}" ${hasPicked ? "disabled" : ""}>${escapeHtml(ln)}</button>`;
              }).join("")}
            </div>

            ${hasPicked ? `
              <div class="trap-feedback ${isRight ? "ok" : "bad"}">
                <strong>${isRight ? "✅ ¡Trampa detectada!" : "❌ Era la línea " + (c.trapLineIdx + 1) + ":"}</strong>
                <span>${escapeHtml(c.explanation)}</span>
              </div>
              <div style="display:flex;justify-content:flex-end;margin-top:0.85rem;gap:0.5rem;">
                <button type="button" class="btn btn-primary btn-sm" id="trap-next-btn">Siguiente Caso →</button>
              </div>
            ` : ""}
          </div>
        </div>
      `;

      const sprintBtn = container.querySelector("#trap-sprint-btn");
      if (sprintBtn) {
        sprintBtn.addEventListener("click", () => {
          clearAllSandboxTimers();
          state.sprintActive = true;
          state.timeLeft = 60;
          state.score = 0;
          state.streak = 0;
          state.idx = 0;
          state.selectedLine = null;
          state.answeredSet.clear();
          trapSprintTimer = setInterval(() => {
            if (!document.body.contains(container)) {
              clearAllSandboxTimers();
              return;
            }
            state.timeLeft -= 1;
            const timerEl = container.querySelector("#trap-sprint-timer");
            if (timerEl) {
              timerEl.textContent = `⏱ ${Math.max(0, state.timeLeft)}s`;
              if (state.timeLeft <= 15) timerEl.classList.add("danger");
            }
            if (state.timeLeft <= 0) {
              clearAllSandboxTimers();
              state.sprintActive = false;
              renderGame();
            }
          }, 1000);
          renderGame();
        });
      }

      container.querySelectorAll("[data-line]").forEach((btn) => {
        btn.addEventListener("click", () => {
          if (state.selectedLine !== null) return;
          const picked = Number(btn.getAttribute("data-line"));
          state.selectedLine = picked;
          const ok = picked === c.trapLineIdx;
          if (ok) {
            state.streak += 1;
            state.bestStreak = Math.max(state.bestStreak, state.streak);
            if (!state.answeredSet.has(c.id)) {
              state.score += 1;
              state.answeredSet.add(c.id);
              if (typeof onAwardXp === "function") onAwardXp(c.id, true);
            }
          } else {
            state.streak = 0;
            if (typeof onAwardXp === "function") onAwardXp(c.id, false);
          }
          renderGame();
        });
      });

      const nextBtn = container.querySelector("#trap-next-btn");
      if (nextBtn) {
        nextBtn.addEventListener("click", () => {
          state.idx = (state.idx + 1) % TRAP_CASES.length;
          state.selectedLine = null;
          renderGame();
        });
      }
    };

    renderGame();
  }

  return {
    computeKnnDecision,
    HOPFIELD_PATTERNS,
    buildHopfieldWeights,
    computeHopfieldEnergy,
    stepHopfield,
    somStep,
    computeUpgmaTree,
    computeAgRoulette,
    simulateAgGenerations,
    TRAP_CASES,
    clearAllSandboxTimers,
    mountSandboxesHub,
    mountTrapHunterGame
  };
});
