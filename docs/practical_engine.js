(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.PracticalEngine = factory();
  }
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const TOPIC_META = {
    CLUSTERING: {
      id: "CLUSTERING",
      nombre: "Clustering Jerárquico (Average Linkage)",
      icono: "🧬",
      targetMinutes: 20,
      defaultWeight: 20
    },
    SOM: {
      id: "SOM",
      nombre: "Mapas Auto-organizados (SOM Kohonen)",
      icono: "🗺️",
      targetMinutes: 25,
      defaultWeight: 30
    },
    MLP: {
      id: "MLP",
      nombre: "Perceptrón Multicapa (MLP Sigmoide)",
      icono: "🧠",
      targetMinutes: 30,
      defaultWeight: 30
    },
    AG: {
      id: "AG",
      nombre: "Algoritmos Genéticos (Cruza, Ruleta y Copias)",
      icono: "🧬",
      targetMinutes: 20,
      defaultWeight: 20
    },
    NB: {
      id: "NB",
      nombre: "Clasificador Naïve Bayes (Gaussiano / Laplace)",
      icono: "📊",
      targetMinutes: 20,
      defaultWeight: 25
    },
    HOPFIELD: {
      id: "HOPFIELD",
      nombre: "Redes Asociativas de Hopfield (N=5)",
      icono: "🧲",
      targetMinutes: 20,
      defaultWeight: 25
    },
    KNN: {
      id: "KNN",
      nombre: "K-NN Ponderado (1/d²) y Distancias",
      icono: "📍",
      targetMinutes: 20,
      defaultWeight: 25
    }
  };

  // ---------------------------------------------------------------------------
  // Deterministic PRNG & Numeric / Formatting Helpers
  // ---------------------------------------------------------------------------
  function mulberry32(seed) {
    let t = (Number(seed) >>> 0) || 1;
    return function () {
      t += 0x6d2b79f5;
      let x = Math.imul(t ^ (t >>> 15), t | 1);
      x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
      return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
    };
  }

  function randInt(rng, min, max) {
    return Math.floor(rng() * (max - min + 1)) + min;
  }

  function randChoice(rng, arr) {
    return arr[Math.floor(rng() * arr.length)];
  }

  function roundN(val, decimals = 3) {
    const f = Math.pow(10, decimals);
    const r = Math.round((Number(val) + Number.EPSILON) * f) / f;
    return r === 0 ? 0 : r;
  }

  function fmt(val, decimals = 3) {
    return roundN(val, decimals).toFixed(decimals);
  }

  function fmtSigned(val, decimals = 3) {
    const n = roundN(val, decimals);
    return (n >= 0 ? "+" : "") + n.toFixed(decimals);
  }

  function sigmoid(z) {
    return 1 / (1 + Math.exp(-z));
  }

  function normPdf(x, mu, sigma) {
    const coef = 1 / (sigma * Math.sqrt(2 * Math.PI));
    const exponent = -Math.pow(x - mu, 2) / (2 * sigma * sigma);
    return { coef, exponent, expVal: Math.exp(exponent), pdf: coef * Math.exp(exponent) };
  }

  function formatDuration(totalSeconds) {
    const s = Math.max(0, Math.floor(Number(totalSeconds) || 0));
    const hrs = Math.floor(s / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const secs = s % 60;
    const pad = (n) => String(n).padStart(2, "0");
    if (hrs > 0) return `${hrs}:${pad(mins)}:${pad(secs)}`;
    return `${pad(mins)}:${pad(secs)}`;
  }

  function getPaceStatus(elapsedSeconds, targetMinutes) {
    const budget = Math.max(60, Number(targetMinutes || 20) * 60);
    const ratio = (Number(elapsedSeconds) || 0) / budget;
    if (ratio <= 0.85) return { code: "good", label: "Buen ritmo", cls: "pace-good" };
    if (ratio <= 1.1) return { code: "warn", label: "Al límite del presupuesto", cls: "pace-warn" };
    return { code: "over", label: "Excedido vs objetivo", cls: "pace-over" };
  }

  function buildHtmlTable(headers, rows) {
    const ths = headers.map((h) => `<th>${h}</th>`).join("");
    const trs = rows
      .map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`)
      .join("");
    return `<div class="pe-table-wrap"><table class="pe-data-table"><thead><tr>${ths}</tr></thead><tbody>${trs}</tbody></table></div>`;
  }

  // ---------------------------------------------------------------------------
  // Flexible Input Parsers & Checkpoint Evaluators
  // ---------------------------------------------------------------------------
  function parseFlexibleNumber(raw) {
    if (raw === null || raw === undefined) return NaN;
    let s = String(raw).trim();
    if (!s) return NaN;
    s = s.replace(/\s+/g, "").replace(/,/g, ".");
    if (/^[+-]?\d+(?:\.\d+)?\/[+-]?\d+(?:\.\d+)?$/.test(s)) {
      const [numStr, denStr] = s.split("/");
      const num = Number(numStr);
      const den = Number(denStr);
      if (!Number.isFinite(num) || !Number.isFinite(den) || den === 0) return NaN;
      return num / den;
    }
    if (!/^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(s)) return NaN;
    const n = Number(s);
    return Number.isFinite(n) ? n : NaN;
  }

  function parseVectorInput(raw) {
    if (raw === null || raw === undefined) return null;
    const cleaned = String(raw)
      .trim()
      .replace(/[\[\]()]/g, " ")
      .replace(/;/g, " ");
    if (!cleaned) return null;
    // Support comma-separated ("1,-1,0") or whitespace-separated ("+1 -1 +1")
    const parts = cleaned.includes(",")
      ? cleaned.split(",").map((x) => x.trim()).filter(Boolean)
      : cleaned.split(/\s+/).map((x) => x.trim()).filter(Boolean);
    if (parts.length === 0) return null;
    const nums = parts.map(parseFlexibleNumber);
    if (nums.some((n) => !Number.isFinite(n))) return null;
    return nums;
  }

  function normalizePairString(raw) {
    if (raw === null || raw === undefined) return "";
    const cleaned = String(raw)
      .toUpperCase()
      .replace(/[{}\[\]()]/g, " ")
      .trim();
    if (!cleaned) return "";
    let tokens = cleaned
      .split(/[,;\-\s+&/]+/)
      .map((t) => t.trim())
      .filter(Boolean);
    if (tokens.length === 1 && /^[A-Z]{2}$/.test(tokens[0])) {
      tokens = [tokens[0][0], tokens[0][1]];
    }
    if (tokens.length !== 2) return "";
    return tokens.sort().join("-");
  }

  function normalizeBitstring(raw) {
    return String(raw || "").replace(/[^01]/g, "");
  }

  function evaluateField(field, rawValue) {
    const rawStr = rawValue === null || rawValue === undefined ? "" : String(rawValue).trim();
    if (!rawStr) {
      return {
        fieldId: field.id,
        valid: false,
        isCorrect: false,
        status: "missing",
        userDisplay: "Sin completar",
        expectedDisplay: field.expectedDisplay || String(field.expected),
        detail: "Falta ingresar este valor."
      };
    }

    if (field.type === "number") {
      const parsed = parseFlexibleNumber(rawStr);
      if (!Number.isFinite(parsed)) {
        return {
          fieldId: field.id,
          valid: false,
          isCorrect: false,
          status: "invalid",
          userDisplay: rawStr,
          expectedDisplay: field.expectedDisplay || fmt(field.expected, field.decimals ?? 3),
          detail: "Formato numérico no reconocido (usá punto o coma decimal)."
        };
      }
      const candidates = [Number(field.expected)];
      if (Array.isArray(field.altExpected)) {
        field.altExpected.forEach((v) => {
          if (Number.isFinite(Number(v))) candidates.push(Number(v));
        });
      }
      const tol = Number.isFinite(field.tol) ? Number(field.tol) : 0.008;
      let minDiff = Infinity;
      candidates.forEach((t) => {
        const d = Math.abs(parsed - t);
        if (d < minDiff) minDiff = d;
      });
      const isCorrect = minDiff <= tol;
      const status = isCorrect ? (minDiff <= 0.0006 ? "exact" : "tolerance") : "wrong";
      return {
        fieldId: field.id,
        valid: true,
        isCorrect,
        status,
        parsed,
        minDiff,
        userDisplay: rawStr,
        expectedDisplay: field.expectedDisplay || fmt(field.expected, field.decimals ?? 3),
        detail: isCorrect
          ? status === "exact"
            ? "Coincide con el valor exacto."
            : `Dentro de tolerancia (±${tol}, desvío ${roundN(minDiff, 4)}).`
          : `Fuera de tolerancia (desvío ${roundN(minDiff, 4)} > ±${tol}).`
      };
    }

    if (field.type === "select") {
      const normUser = rawStr.toUpperCase();
      const normExp = String(field.expected).toUpperCase();
      const isCorrect = normUser === normExp;
      return {
        fieldId: field.id,
        valid: true,
        isCorrect,
        status: isCorrect ? "exact" : "wrong",
        userDisplay: rawStr,
        expectedDisplay: field.expectedDisplay || String(field.expected),
        detail: isCorrect ? "Selección correcta." : `Se esperaba ${field.expectedDisplay || field.expected}.`
      };
    }

    if (field.type === "bitstring") {
      const normUser = normalizeBitstring(rawStr);
      const normExp = normalizeBitstring(field.expected);
      if (!normUser) {
        return {
          fieldId: field.id,
          valid: false,
          isCorrect: false,
          status: "invalid",
          userDisplay: rawStr,
          expectedDisplay: normExp,
          detail: "Ingresá la cadena binaria usando 0 y 1."
        };
      }
      const isCorrect = normUser === normExp;
      return {
        fieldId: field.id,
        valid: true,
        isCorrect,
        status: isCorrect ? "exact" : "wrong",
        userDisplay: normUser,
        expectedDisplay: normExp,
        detail: isCorrect ? "Cadena binaria exacta." : `Esperado: ${normExp}.`
      };
    }

    if (field.type === "pair") {
      const normUser = normalizePairString(rawStr);
      const normExp = normalizePairString(field.expected);
      if (!normUser) {
        return {
          fieldId: field.id,
          valid: false,
          isCorrect: false,
          status: "invalid",
          userDisplay: rawStr,
          expectedDisplay: `{${normExp.replace("-", ", ")}}`,
          detail: "Ingresá el par de etiquetas separadas por coma (ej: C, E)."
        };
      }
      const isCorrect = normUser === normExp;
      return {
        fieldId: field.id,
        valid: true,
        isCorrect,
        status: isCorrect ? "exact" : "wrong",
        userDisplay: `{${normUser.replace("-", ", ")}}`,
        expectedDisplay: `{${normExp.replace("-", ", ")}}`,
        detail: isCorrect ? "Par fusionado correcto (orden invariante)." : `El par mínimo era {${normExp.replace("-", ", ")}}.`
      };
    }

    if (field.type === "vector") {
      const vec = parseVectorInput(rawStr);
      const exp = Array.isArray(field.expected) ? field.expected : [];
      if (!vec || vec.length !== exp.length) {
        return {
          fieldId: field.id,
          valid: false,
          isCorrect: false,
          status: "invalid",
          userDisplay: rawStr,
          expectedDisplay: `[${exp.join(", ")}]`,
          detail: `Se esperaba un vector de ${exp.length} componentes separados por coma o espacio.`
        };
      }
      const tol = Number.isFinite(field.tol) ? Number(field.tol) : 0.01;
      const isCorrect = vec.every((v, idx) => Math.abs(v - exp[idx]) <= tol);
      return {
        fieldId: field.id,
        valid: true,
        isCorrect,
        status: isCorrect ? "exact" : "wrong",
        userDisplay: `[${vec.join(", ")}]`,
        expectedDisplay: `[${exp.join(", ")}]`,
        detail: isCorrect ? "Vector correcto en todas sus componentes." : `Esperado: [${exp.join(", ")}].`
      };
    }

    return {
      fieldId: field.id,
      valid: false,
      isCorrect: false,
      status: "invalid",
      userDisplay: rawStr,
      expectedDisplay: String(field.expected),
      detail: "Tipo de campo no soportado."
    };
  }

  function evaluateStage(stage, valuesMap) {
    const results = (stage.fields || []).map((f) => evaluateField(f, valuesMap ? valuesMap[f.id] : ""));
    const correctCount = results.filter((r) => r.isCorrect).length;
    const total = results.length;
    return {
      stageId: stage.id,
      correctCount,
      total,
      scorePct: total > 0 ? Math.round((correctCount / total) * 100) : 0,
      results
    };
  }

  function evaluateExercise(exercise, valuesMap) {
    const stageResults = (exercise.stages || []).map((st) => evaluateStage(st, valuesMap));
    const totalFields = stageResults.reduce((acc, s) => acc + s.total, 0);
    const correctCount = stageResults.reduce((acc, s) => acc + s.correctCount, 0);
    const answeredCount = stageResults.reduce(
      (acc, s) => acc + s.results.filter((r) => r.status !== "missing").length,
      0
    );
    return {
      totalFields,
      correctCount,
      answeredCount,
      scorePct: totalFields > 0 ? Math.round((correctCount / totalFields) * 100) : 0,
      stageResults
    };
  }

  // ---------------------------------------------------------------------------
  // Topic 1: MLP Backpropagation (2x2x1, Sigmoidal Unipolar, sin momento)
  // ---------------------------------------------------------------------------
  function solveMlp221(cfg) {
    const { x, d, alpha, wh1, wh2, wy } = cfg;

    // Exact floating-point trajectory
    const exactNetH1 = x[0] * wh1[0] + x[1] * wh1[1] + wh1[2];
    const exactOH1 = sigmoid(exactNetH1);
    const exactNetH2 = x[0] * wh2[0] + x[1] * wh2[1] + wh2[2];
    const exactOH2 = sigmoid(exactNetH2);
    const exactNetY = exactOH1 * wy[0] + exactOH2 * wy[1] + wy[2];
    const exactOY = sigmoid(exactNetY);

    const exactErrY = d - exactOY;
    const exactDerivY = exactOY * (1 - exactOY);
    const exactDeltaY = exactErrY * exactDerivY;
    const exactDerivH1 = exactOH1 * (1 - exactOH1);
    const exactDeltaH1 = exactDerivH1 * (exactDeltaY * wy[0]);
    const exactDerivH2 = exactOH2 * (1 - exactOH2);
    const exactDeltaH2 = exactDerivH2 * (exactDeltaY * wy[1]);

    const exactWyH1New = wy[0] + alpha * exactDeltaY * exactOH1;
    const exactWh1X1New = wh1[0] + alpha * exactDeltaH1 * x[0];
    const exactE = 0.5 * Math.pow(d - exactOY, 2);

    // 3-decimal intermediate calculator trajectory (UTN FRRe standard on paper)
    const cNetH1 = roundN(exactNetH1, 3);
    const cOH1 = roundN(sigmoid(cNetH1), 3);
    const cNetH2 = roundN(exactNetH2, 3);
    const cOH2 = roundN(sigmoid(cNetH2), 3);
    const cNetY = roundN(cOH1 * wy[0] + cOH2 * wy[1] + wy[2], 3);
    const cOY = roundN(sigmoid(cNetY), 3);

    const cErrY = roundN(d - cOY, 3);
    const cDerivY = roundN(cOY * (1 - cOY), 3);
    const cDeltaY = roundN(cErrY * cDerivY, 3);
    const cDerivH1 = roundN(cOH1 * (1 - cOH1), 3);
    const cDeltaH1 = roundN(cDerivH1 * roundN(cDeltaY * wy[0], 3), 3);
    const cDerivH2 = roundN(cOH2 * (1 - cOH2), 3);
    const cDeltaH2 = roundN(cDerivH2 * roundN(cDeltaY * wy[1], 3), 3);

    const cWyH1New = roundN(wy[0] + alpha * cDeltaY * cOH1, 3);
    const cWh1X1New = roundN(wh1[0] + alpha * cDeltaH1 * x[0], 3);
    const cE = roundN(0.5 * Math.pow(d - cOY, 2), 3);

    return {
      exact: {
        netH1: exactNetH1, oH1: exactOH1, netH2: exactNetH2, oH2: exactOH2, netY: exactNetY, oY: exactOY,
        errY: exactErrY, derivY: exactDerivY, deltaY: exactDeltaY, derivH1: exactDerivH1, deltaH1: exactDeltaH1,
        derivH2: exactDerivH2, deltaH2: exactDeltaH2, wyH1New: exactWyH1New, wh1X1New: exactWh1X1New, errorE: exactE
      },
      calc3: {
        netH1: cNetH1, oH1: cOH1, netH2: cNetH2, oH2: cOH2, netY: cNetY, oY: cOY,
        errY: cErrY, derivY: cDerivY, deltaY: cDeltaY, derivH1: cDerivH1, deltaH1: cDeltaH1,
        derivH2: cDerivH2, deltaH2: cDeltaH2, wyH1New: cWyH1New, wh1X1New: cWh1X1New, errorE: cE
      }
    };
  }

  function buildMlpExercise(seedOrCfg = 0, meta = {}) {
    let cfg;
    if (seedOrCfg && typeof seedOrCfg === "object") {
      cfg = seedOrCfg;
    } else if (seedOrCfg === 0) {
      cfg = {
        x: [1.5, -1.0],
        d: 1,
        alpha: 0.6,
        wh1: [0.4, -0.3, 0.2],
        wh2: [-0.5, 0.6, -0.1],
        wy: [0.7, -0.4, 0.1]
      };
    } else {
      const rng = mulberry32(seedOrCfg * 9173 + 17);
      const nonZeroW = () => randChoice(rng, [-0.8, -0.6, -0.5, -0.4, -0.3, -0.2, 0.2, 0.3, 0.4, 0.5, 0.6, 0.8]);
      const anyB = () => randChoice(rng, [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3]);
      for (let tries = 0; tries < 50; tries++) {
        const candidate = {
          x: [randChoice(rng, [-1.5, -1.0, 1.0, 1.5, 2.0]), randChoice(rng, [-1.5, -1.0, 1.0, 1.5, 2.0])],
          d: randChoice(rng, [0, 1]),
          alpha: randChoice(rng, [0.4, 0.5, 0.6, 0.8]),
          wh1: [nonZeroW(), nonZeroW(), anyB()],
          wh2: [nonZeroW(), nonZeroW(), anyB()],
          wy: [nonZeroW(), nonZeroW(), anyB()]
        };
        const sol = solveMlp221(candidate).exact;
        if (
          Math.abs(sol.netH1) >= 0.08 && Math.abs(sol.netH1) <= 1.9 &&
          Math.abs(sol.netH2) >= 0.08 && Math.abs(sol.netH2) <= 1.9 &&
          Math.abs(sol.deltaY) >= 0.02 && Math.abs(sol.deltaH1) >= 0.008 && Math.abs(sol.deltaH2) >= 0.008
        ) {
          cfg = candidate;
          break;
        }
      }
      if (!cfg) cfg = { x: [1.0, 2.0], d: 1, alpha: 0.5, wh1: [0.3, -0.4, 0.1], wh2: [-0.2, 0.5, -0.1], wy: [0.6, -0.5, 0.2] };
    }

    const sol = solveMlp221(cfg);
    const { exact: ex, calc3: c3 } = sol;
    const { x, d, alpha, wh1, wh2, wy } = cfg;

    const paramsTable = buildHtmlTable(
      ["Componente", "Pesos iniciales", "Sesgo (bias)"],
      [
        ["Oculta $h_1$", `$w_{h1,x1} = ${fmt(wh1[0], 2)}$, $w_{h1,x2} = ${fmt(wh1[1], 2)}$`, `$b_{h1} = ${fmt(wh1[2], 2)}$`],
        ["Oculta $h_2$", `$w_{h2,x1} = ${fmt(wh2[0], 2)}$, $w_{h2,x2} = ${fmt(wh2[1], 2)}$`, `$b_{h2} = ${fmt(wh2[2], 2)}$`],
        ["Salida $y$", `$w_{y,h1} = ${fmt(wy[0], 2)}$, $w_{y,h2} = ${fmt(wy[1], 2)}$`, `$b_y = ${fmt(wy[2], 2)}$`]
      ]
    );

    return {
      uid: meta.uid || `MLP:${typeof seedOrCfg === "number" ? seedOrCfg : "custom"}`,
      topic: "MLP",
      topicLabel: TOPIC_META.MLP.nombre,
      weight: meta.weight || TOPIC_META.MLP.defaultWeight,
      targetMinutes: meta.targetMinutes || TOPIC_META.MLP.targetMinutes,
      sourceTag: meta.sourceTag || (seedOrCfg === 0 ? "Modelo Curado IA (Verificado)" : `Variante Numérica #${seedOrCfg} (Verificada)`),
      title: meta.title || "Perceptrón Multicapa ($2 \\times 2 \\times 1$) — Backpropagation Sigmoidal",
      introHtml: `
        <p>Considere una red neuronal MLP $2 \\times 2 \\times 1$ donde <strong>todas las neuronas utilizan activación sigmoide unipolar</strong> $\\sigma(net) = \\frac{1}{1+e^{-net}}$ (sin término de momento, criterio 2026).</p>
        <ul>
          <li><strong>Patrón de entrada:</strong> $\\mathbf{x} = [${fmt(x[0], 2)},\\; ${fmt(x[1], 2)}]^T$ con <strong>salida deseada</strong> $d = ${d}$</li>
          <li><strong>Tasa de aprendizaje:</strong> $\\alpha = ${fmt(alpha, 2)}$ (usar redondeo a <strong>3 decimales</strong> en calculadora)</li>
        </ul>
        ${paramsTable}
      `,
      stages: [
        {
          id: "mlp_forward",
          title: "Etapa 1 · Propagación Hacia Adelante (Forward Pass)",
          paperCommentTip: "💬 Comentá en hoja (1 línea): \"Calculo la suma ponderada net y aplico la sigmoide capa por capa desde la entrada hasta obtener la salida de la red.\"",
          fields: [
            { id: "o_h1", label: "Activación $o_{h1}$", type: "number", placeholder: "Ej: 0.622", hint: "±0.006", expected: ex.oH1, altExpected: [c3.oH1], tol: 0.006 },
            { id: "o_h2", label: "Activación $o_{h2}$", type: "number", placeholder: "Ej: 0.475", hint: "±0.006", expected: ex.oH2, altExpected: [c3.oH2], tol: 0.006 },
            { id: "o_y", label: "Salida de red $o_y$", type: "number", placeholder: "Ej: 0.543", hint: "±0.006", expected: ex.oY, altExpected: [c3.oY], tol: 0.006 }
          ],
          solutionHtml: `
            <p><strong>Paso Forward ($o_j = \\sigma(net_j)$):</strong></p>
            <ul>
              <li>$net_{h1} = (${fmt(x[0],2)})(${fmt(wh1[0],2)}) + (${fmt(x[1],2)})(${fmt(wh1[1],2)}) + (${fmt(wh1[2],2)}) = ${fmt(ex.netH1, 3)} \\implies o_{h1} = \\frac{1}{1+e^{-(${fmt(ex.netH1,3)})}} = \\mathbf{${fmt(ex.oH1, 4)}}$ (3 dec: <code>${fmt(c3.oH1, 3)}</code>)</li>
              <li>$net_{h2} = (${fmt(x[0],2)})(${fmt(wh2[0],2)}) + (${fmt(x[1],2)})(${fmt(wh2[1],2)}) + (${fmt(wh2[2],2)}) = ${fmt(ex.netH2, 3)} \\implies o_{h2} = \\frac{1}{1+e^{-(${fmt(ex.netH2,3)})}} = \\mathbf{${fmt(ex.oH2, 4)}}$ (3 dec: <code>${fmt(c3.oH2, 3)}</code>)</li>
              <li>$net_y = (${fmt(ex.oH1,3)})(${fmt(wy[0],2)}) + (${fmt(ex.oH2,3)})(${fmt(wy[1],2)}) + (${fmt(wy[2],2)}) = ${fmt(ex.netY, 3)} \\implies o_y = \\mathbf{${fmt(ex.oY, 4)}}$ (3 dec: <code>${fmt(c3.oY, 3)}</code>)</li>
            </ul>
          `
        },
        {
          id: "mlp_backward",
          title: "Etapa 2 · Términos de Error / Gradientes Locales ($\\delta$)",
          paperCommentTip: "💬 Comentá en hoja (1 línea): \"Retropropago el error desde la salida hacia la capa oculta multiplicando por la derivada sigmoidal o(1-o).\"",
          fields: [
            { id: "delta_y", label: "Gradiente de salida $\\delta_y$", type: "number", placeholder: "Ej: 0.085", hint: "±0.008", expected: ex.deltaY, altExpected: [c3.deltaY], tol: 0.008 },
            { id: "delta_h1", label: "Gradiente oculto $\\delta_{h1}$", type: "number", placeholder: "Ej: 0.014", hint: "±0.008", expected: ex.deltaH1, altExpected: [c3.deltaH1], tol: 0.008 },
            { id: "delta_h2", label: "Gradiente oculto $\\delta_{h2}$", type: "number", placeholder: "Ej: -0.008", hint: "±0.008", expected: ex.deltaH2, altExpected: [c3.deltaH2], tol: 0.008 }
          ],
          solutionHtml: `
            <p><strong>Paso Backward con $\\sigma'(net) = o(1-o)$:</strong></p>
            <ul>
              <li><strong>Salida:</strong> $e_y = d - o_y = ${d} - ${fmt(ex.oY,4)} = ${fmt(ex.errY,4)}$; $f'(net_y) = ${fmt(ex.oY,3)}(1-${fmt(ex.oY,3)}) = ${fmt(ex.derivY,4)}$ $\\implies \\delta_y = e_y \\cdot f'(net_y) = \\mathbf{${fmt(ex.deltaY, 4)}}$ (3 dec: <code>${fmt(c3.deltaY, 3)}</code>)</li>
              <li><strong>Oculta $h_1$:</strong> $f'(net_{h1}) = ${fmt(ex.derivH1,4)}$; $\\delta_{h1} = f'(net_{h1}) \\cdot (\\delta_y \\cdot w_{y,h1}) = ${fmt(ex.derivH1,3)} \\cdot (${fmt(ex.deltaY,3)} \\cdot ${fmt(wy[0],2)}) = \\mathbf{${fmt(ex.deltaH1, 4)}}$ (3 dec: <code>${fmt(c3.deltaH1, 3)}</code>)</li>
              <li><strong>Oculta $h_2$:</strong> $f'(net_{h2}) = ${fmt(ex.derivH2,4)}$; $\\delta_{h2} = f'(net_{h2}) \\cdot (\\delta_y \\cdot w_{y,h2}) = ${fmt(ex.derivH2,3)} \\cdot (${fmt(ex.deltaY,3)} \\cdot ${fmt(wy[1],2)}) = \\mathbf{${fmt(ex.deltaH2, 4)}}$ (3 dec: <code>${fmt(c3.deltaH2, 3)}</code>)</li>
            </ul>
          `
        },
        {
          id: "mlp_update",
          title: "Etapa 3 · Actualización de Pesos y Error Cuadrático",
          paperCommentTip: "💬 Comentá en hoja (1 línea): \"Ajusto los pesos en dirección al gradiente de descenso con tasa α y evalúo el error cuadrático del patrón.\"",
          fields: [
            { id: "wy_h1_new", label: "Peso actualizado $w_{y,h1}^{\\text{nuevo}}$", type: "number", placeholder: "Ej: 0.728", hint: "±0.008", expected: ex.wyH1New, altExpected: [c3.wyH1New], tol: 0.008 },
            { id: "wh1_x1_new", label: "Peso actualizado $w_{h1,x1}^{\\text{nuevo}}$", type: "number", placeholder: "Ej: 0.412", hint: "±0.008", expected: ex.wh1X1New, altExpected: [c3.wh1X1New], tol: 0.008 },
            { id: "error_E", label: "Error cuadrático $E = \\frac{1}{2}(d - o_y)^2$", type: "number", placeholder: "Ej: 0.095", hint: "±0.008", expected: ex.errorE, altExpected: [c3.errorE], tol: 0.008 }
          ],
          solutionHtml: `
            <p><strong>Actualización sin momento ($w^{\\text{nuevo}} = w + \\alpha \\cdot \\delta_{\\text{dest}} \\cdot \\text{entrada}$):</strong></p>
            <ul>
              <li>$w_{y,h1}^{\\text{nuevo}} = ${fmt(wy[0],2)} + (${fmt(alpha,2)})(${fmt(ex.deltaY,4)})(${fmt(ex.oH1,4)}) = \\mathbf{${fmt(ex.wyH1New, 4)}}$ (3 dec: <code>${fmt(c3.wyH1New, 3)}</code>)</li>
              <li>$w_{h1,x1}^{\\text{nuevo}} = ${fmt(wh1[0],2)} + (${fmt(alpha,2)})(${fmt(ex.deltaH1,4)})(${fmt(x[0],2)}) = \\mathbf{${fmt(ex.wh1X1New, 4)}}$ (3 dec: <code>${fmt(c3.wh1X1New, 3)}</code>)</li>
              <li><strong>Error del patrón:</strong> $E = \\frac{1}{2}(${d} - ${fmt(ex.oY,4)})^2 = \\mathbf{${fmt(ex.errorE, 4)}}$ (3 dec: <code>${fmt(c3.errorE, 3)}</code>)</li>
            </ul>
          `
        }
      ]
    };
  }

  // ---------------------------------------------------------------------------
  // Topic 2: SOM Kohonen (Vecindad continua + actualización online p1 -> p2)
  // ---------------------------------------------------------------------------
  function solveSom(cfg) {
    const { weights, alpha, p1, p2, probeNeighborIdx } = cfg;
    const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);

    // Exact path for p1
    const dP1 = weights.map((w) => dist(p1, w));
    let bmu1 = 0;
    for (let i = 1; i < dP1.length; i++) if (dP1[i] < dP1[bmu1]) bmu1 = i;

    const dW_bmu1 = weights.map((w) => dist(w, weights[bmu1]));
    const h1 = dW_bmu1.map((dw) => 1 / (1 + dw));
    const wAfter1 = weights.map((w, i) => [
      w[0] + alpha * h1[i] * (p1[0] - w[0]),
      w[1] + alpha * h1[i] * (p1[1] - w[1])
    ]);

    // p2 evaluated against updated W(1) (Trampa 3!)
    const dP2 = wAfter1.map((w) => dist(p2, w));
    let bmu2 = 0;
    for (let i = 1; i < dP2.length; i++) if (dP2[i] < dP2[bmu2]) bmu2 = i;

    // 3-decimal calculator path
    const cdP1 = weights.map((w) => roundN(dist(p1, w), 3));
    const cdW_bmu1 = weights.map((w) => roundN(dist(w, weights[bmu1]), 3));
    const ch1 = cdW_bmu1.map((dw) => roundN(1 / (1 + dw), 3));
    const cwAfter1 = weights.map((w, i) => [
      roundN(w[0] + alpha * ch1[i] * roundN(p1[0] - w[0], 3), 3),
      roundN(w[1] + alpha * ch1[i] * roundN(p1[1] - w[1], 3), 3)
    ]);
    const cdP2 = cwAfter1.map((w) => roundN(dist(p2, w), 3));

    const neighborIdx = probeNeighborIdx !== undefined && probeNeighborIdx !== bmu1
      ? probeNeighborIdx
      : (bmu1 === 0 ? 1 : 0);

    return {
      bmu1, bmu2, neighborIdx,
      exact: { dP1, h1, wAfter1, dP2, dW_bmu1 },
      calc3: { dP1: cdP1, h1: ch1, wAfter1: cwAfter1, dP2: cdP2 }
    };
  }

  function buildSomExercise(seedOrCfg = 0, meta = {}) {
    let cfg;
    if (seedOrCfg && typeof seedOrCfg === "object") {
      cfg = seedOrCfg;
    } else if (seedOrCfg === 0) {
      cfg = {
        weights: [[0.2, 0.8], [0.6, 0.3], [0.9, 0.7]],
        alpha: 0.5,
        p1: [0.5, 0.4],
        p2: [0.1, 0.9]
      };
    } else {
      const rng = mulberry32(seedOrCfg * 6299 + 31);
      const rDec = () => randInt(rng, 1, 9) / 10;
      for (let tries = 0; tries < 60; tries++) {
        const candidate = {
          weights: [[rDec(), rDec()], [rDec(), rDec()], [rDec(), rDec()]],
          alpha: randChoice(rng, [0.4, 0.5, 0.6, 0.7]),
          p1: [rDec(), rDec()],
          p2: [rDec(), rDec()]
        };
        const sol = solveSom(candidate);
        const s1 = [...sol.exact.dP1].sort((a, b) => a - b);
        const s2 = [...sol.exact.dP2].sort((a, b) => a - b);
        const minDw = sol.exact.dW_bmu1.filter((_, i) => i !== sol.bmu1).reduce((m, v) => Math.min(m, v), Infinity);
        if (s1[1] - s1[0] >= 0.08 && s2[1] - s2[0] >= 0.08 && minDw >= 0.15) {
          cfg = candidate;
          break;
        }
      }
      if (!cfg) cfg = { weights: [[0.2, 0.8], [0.6, 0.3], [0.9, 0.7]], alpha: 0.5, p1: [0.5, 0.4], p2: [0.1, 0.9] };
    }

    const sol = solveSom(cfg);
    const { bmu1, bmu2, neighborIdx, exact: ex, calc3: c3 } = sol;
    const { weights, alpha, p1, p2 } = cfg;
    const nLabel = (idx) => `N${idx + 1}`;

    const wTable = buildHtmlTable(
      ["Neurona", "Peso inicial $w_1(0)$", "Peso inicial $w_2(0)$"],
      weights.map((w, i) => [`**$N_${i + 1}$**`, `$${fmt(w[0], 2)}$`, `$${fmt(w[1], 2)}$`])
    );

    return {
      uid: meta.uid || `SOM:${typeof seedOrCfg === "number" ? seedOrCfg : "custom"}`,
      topic: "SOM",
      topicLabel: TOPIC_META.SOM.nombre,
      weight: meta.weight || TOPIC_META.SOM.defaultWeight,
      targetMinutes: meta.targetMinutes || TOPIC_META.SOM.targetMinutes,
      sourceTag: meta.sourceTag || (seedOrCfg === 0 ? "Modelo Curado IA (Verificado)" : `Variante Numérica #${seedOrCfg} (Verificada)`),
      title: meta.title || "Mapa Autoorganizado (SOM) — Vecindad Continua y Aprendizaje Online",
      introHtml: `
        <p>Considere una red SOM de 2 entradas y 3 neuronas competitivas ($N_1, N_2, N_3$) con aprendizaje <strong>online secuencial</strong>, tasa $\\alpha = ${fmt(alpha, 2)}$ y vecindad topológica en el <strong>espacio de pesos</strong>:</p>
        $$h(i, j^*) = \\frac{1}{1 + \\operatorname{dist}(W_i, W_{j^*})}$$
        ${wTable}
        <p>Se presentan secuencialmente los patrones: $\\mathbf{p_1} = [${fmt(p1[0], 2)},\\; ${fmt(p1[1], 2)}]^T$ y luego $\\mathbf{p_2} = [${fmt(p2[0], 2)},\\; ${fmt(p2[1], 2)}]^T$.</p>
      `,
      stages: [
        {
          id: "som_bmu1",
          title: "Etapa 1 · Competencia con $p_1$ y Vecindad Topológica",
          paperCommentTip: "💬 Comentá en hoja (1 línea): \"Mido distancia euclídea de p1 a cada neurona, elijo la ganadora de menor distancia y calculo vecindad continua (no nula) para todas.\"",
          fields: [
            {
              id: "bmu1", label: "Neurona ganadora para $p_1$ ($j^*_1$)", type: "select",
              options: ["N1", "N2", "N3"], expected: nLabel(bmu1), expectedDisplay: nLabel(bmu1)
            },
            {
              id: "d_bmu1", label: "Menor distancia $d(p_1, W_{j^*_1}(0))$", type: "number",
              placeholder: "Ej: 0.141", hint: "±0.008", expected: ex.dP1[bmu1], altExpected: [c3.dP1[bmu1]], tol: 0.008
            },
            {
              id: "h_neigh", label: `Factor de vecindad de la vecina $N_${neighborIdx + 1}$: $h(${neighborIdx + 1}, j^*_1)$`, type: "number",
              placeholder: "Ej: 0.610", hint: "±0.008", expected: ex.h1[neighborIdx], altExpected: [c3.h1[neighborIdx]], tol: 0.008
            }
          ],
          solutionHtml: `
            <p><strong>Distancias euclídeas a $p_1 = [${fmt(p1[0],2)}, ${fmt(p1[1],2)}]^T$:</strong></p>
            <ul>
              ${weights.map((w, i) => `<li>$d(p_1, W_${i + 1}) = \\sqrt{(${fmt(p1[0],2)}-${fmt(w[0],2)})^2 + (${fmt(p1[1],2)}-${fmt(w[1],2)})^2} = \\mathbf{${fmt(ex.dP1[i], 3)}}$</li>`).join("")}
            </ul>
            <p>Gana <strong>$N_${bmu1 + 1}$</strong> ($d = ${fmt(ex.dP1[bmu1], 3)}$). Distancias desde pesos de $N_${bmu1 + 1}$:</p>
            <ul>
              <li>$h(${bmu1 + 1}, ${bmu1 + 1}) = \\frac{1}{1+0} = 1.000$</li>
              <li>$d(W_${neighborIdx + 1}, W_${bmu1 + 1}) = ${fmt(ex.dW_bmu1[neighborIdx], 3)} \\implies h(${neighborIdx + 1}, ${bmu1 + 1}) = \\frac{1}{1 + ${fmt(ex.dW_bmu1[neighborIdx], 3)}} = \\mathbf{${fmt(ex.h1[neighborIdx], 3)}}$</li>
            </ul>
          `
        },
        {
          id: "som_update",
          title: "Etapa 2 · Actualización Cooperativa de Pesos $W(1)$",
          paperCommentTip: "💬 Comentá en hoja (1 línea): \"Actualizo TODOS los pesos (ganadora y vecinas) según su factor h(i, j*) antes de presentar el patrón p2.\"",
          fields: [
            { id: "w_bmu_1", label: `Peso $w_1$ actualizado de ganadora $N_${bmu1 + 1}(1)$`, type: "number", placeholder: "Ej: 0.550", hint: "±0.008", expected: ex.wAfter1[bmu1][0], altExpected: [c3.wAfter1[bmu1][0]], tol: 0.008 },
            { id: "w_bmu_2", label: `Peso $w_2$ actualizado de ganadora $N_${bmu1 + 1}(1)$`, type: "number", placeholder: "Ej: 0.350", hint: "±0.008", expected: ex.wAfter1[bmu1][1], altExpected: [c3.wAfter1[bmu1][1]], tol: 0.008 },
            { id: "w_neigh_1", label: `Peso $w_1$ actualizado de vecina $N_${neighborIdx + 1}(1)$`, type: "number", placeholder: "Ej: 0.292", hint: "±0.010", expected: ex.wAfter1[neighborIdx][0], altExpected: [c3.wAfter1[neighborIdx][0]], tol: 0.01 },
            { id: "w_neigh_2", label: `Peso $w_2$ actualizado de vecina $N_${neighborIdx + 1}(1)$`, type: "number", placeholder: "Ej: 0.678", hint: "±0.010", expected: ex.wAfter1[neighborIdx][1], altExpected: [c3.wAfter1[neighborIdx][1]], tol: 0.01 }
          ],
          solutionHtml: `
            <p><strong>Regla de Kohonen $W_i(1) = W_i(0) + \\alpha \\cdot h(i, j^*_1) \\cdot [p_1 - W_i(0)]$:</strong></p>
            <ul>
              ${weights.map((_, i) => `<li>$W_${i + 1}(1) = [\\mathbf{${fmt(ex.wAfter1[i][0], 3)}},\\; \\mathbf{${fmt(ex.wAfter1[i][1], 3)}}]^T$ (3 dec paso: <code>[${fmt(c3.wAfter1[i][0], 3)}, ${fmt(c3.wAfter1[i][1], 3)}]</code>)</li>`).join("")}
            </ul>
          `
        },
        {
          id: "som_p2",
          title: "Etapa 3 · Segundo Patrón $p_2$ sobre Pesos Persistidos $W(1)$",
          paperCommentTip: "💬 Comentá en hoja (1 línea): \"Por aprendizaje online, evalúo p2 contra los pesos ya actualizados W(1) y no contra W(0).\"",
          fields: [
            { id: "bmu2", label: "Neurona ganadora para $p_2$ ($j^*_2$)", type: "select", options: ["N1", "N2", "N3"], expected: nLabel(bmu2), expectedDisplay: nLabel(bmu2) },
            { id: "d_bmu2", label: "Menor distancia $d(p_2, W_{j^*_2}(1))$", type: "number", placeholder: "Ej: 0.310", hint: "±0.012", expected: ex.dP2[bmu2], altExpected: [c3.dP2[bmu2]], tol: 0.012 }
          ],
          solutionHtml: `
            <p><strong>Distancias de $p_2 = [${fmt(p2[0],2)}, ${fmt(p2[1],2)}]^T$ contra $W(1)$:</strong></p>
            <ul>
              ${ex.wAfter1.map((_, i) => `<li>$d(p_2, W_${i + 1}(1)) = \\mathbf{${fmt(ex.dP2[i], 3)}}$</li>`).join("")}
            </ul>
            <p>Nueva neurona ganadora: <strong>$N_${bmu2 + 1}$</strong> ($d = ${fmt(ex.dP2[bmu2], 3)}$).</p>
          `
        }
      ]
    };
  }

  // ---------------------------------------------------------------------------
  // Topic 3: Clustering Jerárquico (UPGMA / Average Linkage ponderado por cardinal)
  // ---------------------------------------------------------------------------
  function solveClusteringAverageLink(labels, origDistMatrix) {
    // origDistMatrix: NxN symmetric array
    const idxMap = new Map();
    labels.forEach((lbl, i) => idxMap.set(lbl, i));

    let clusters = labels.map((lbl) => ({ label: lbl, members: [idxMap.get(lbl)] }));

    const avgDist = (cA, cB) => {
      let sum = 0;
      for (const a of cA.members) {
        for (const b of cB.members) sum += origDistMatrix[a][b];
      }
      return sum / (cA.members.length * cB.members.length);
    };

    const unweightedWrongDist = (cA, cB, prevMatrix, iA, iB) => {
      // Used ONLY in generator check to verify Trampa 5 differs significantly when sizes >= 2
      return prevMatrix ? (prevMatrix[iA][0] + prevMatrix[iB][0]) / 2 : 0;
    };

    const steps = [];
    while (clusters.length > 1) {
      let bestI = 0;
      let bestJ = 1;
      let bestD = Infinity;
      let secondD = Infinity;
      const curMatrix = Array.from({ length: clusters.length }, (_, i) =>
        Array.from({ length: clusters.length }, (_, j) => (i === j ? 0 : avgDist(clusters[i], clusters[j])))
      );

      for (let i = 0; i < clusters.length; i++) {
        for (let j = i + 1; j < clusters.length; j++) {
          const d = curMatrix[i][j];
          if (d < bestD) {
            secondD = bestD;
            bestD = d;
            bestI = i;
            bestJ = j;
          } else if (d < secondD) {
            secondD = d;
          }
        }
      }

      const c1 = clusters[bestI];
      const c2 = clusters[bestJ];
      const mergedMembers = [...c1.members, ...c2.members];
      const mergedLabel = `(${c1.members.map((m) => labels[m]).concat(c2.members.map((m) => labels[m])).sort().join("")})`;

      const nextClusters = [];
      for (let i = 0; i < clusters.length; i++) {
        if (i !== bestI && i !== bestJ) nextClusters.push(clusters[i]);
      }
      nextClusters.push({ label: mergedLabel, members: mergedMembers });

      // Recalculated distances from merged cluster to remaining clusters
      const recalcs = nextClusters.slice(0, -1).map((other) => {
        const dExact = avgDist({ members: mergedMembers }, other);
        const unweightedDemo = (avgDist(c1, other) + avgDist(c2, other)) / 2;
        return {
          otherLabel: other.label,
          otherSize: other.members.length,
          dExact,
          dRounded: roundN(dExact, 3),
          unweightedDemo
        };
      });

      steps.push({
        stepNum: steps.length + 1,
        leftLabel: c1.label,
        rightLabel: c2.label,
        leftSize: c1.members.length,
        rightSize: c2.members.length,
        pairKey: `${c1.members.length === 1 ? c1.label : c1.label},${c2.members.length === 1 ? c2.label : c2.label}`,
        pairAtoms: [labels[c1.members[0]], labels[c2.members[0]]],
        mergedLabel,
        dist: bestD,
        gapToSecond: secondD - bestD,
        recalcs,
        clusterLabelsBefore: clusters.map((c) => c.label),
        matrixBefore: curMatrix
      });

      clusters = nextClusters;
    }

    return { steps, ignore: unweightedWrongDist };
  }

  function buildClusteringExercise(seedOrCfg = 0, meta = {}) {
    const labels = ["A", "B", "C", "D", "E"];
    let matrix;
    if (seedOrCfg && typeof seedOrCfg === "object") {
      matrix = seedOrCfg.matrix;
    } else if (seedOrCfg === 0) {
      matrix = [
        [0.0, 3.2, 4.5, 2.1, 5.0],
        [3.2, 0.0, 2.8, 3.6, 2.4],
        [4.5, 2.8, 0.0, 4.2, 1.4],
        [2.1, 3.6, 4.2, 0.0, 4.8],
        [5.0, 2.4, 1.4, 4.8, 0.0]
      ];
    } else {
      const rng = mulberry32(seedOrCfg * 4999 + 11);
      for (let tries = 0; tries < 80; tries++) {
        const m = Array.from({ length: 5 }, () => Array(5).fill(0));
        const used = new Set();
        for (let i = 0; i < 5; i++) {
          for (let j = i + 1; j < 5; j++) {
            let v;
            do {
              v = randInt(rng, 12, 58) / 10;
            } while (used.has(v));
            used.add(v);
            m[i][j] = v;
            m[j][i] = v;
          }
        }
        const sol = solveClusteringAverageLink(labels, m);
        const s = sol.steps;
        const step0Singletons = s[0].leftSize === 1 && s[0].rightSize === 1;
        const clearGaps = s.slice(0, 3).every((st) => st.gapToSecond >= 0.08);
        const hasWeightedDiff = s.some((st) => st.recalcs.some((r) => Math.abs(r.dExact - r.unweightedDemo) >= 0.08));
        if (step0Singletons && clearGaps && hasWeightedDiff) {
          matrix = m;
          break;
        }
      }
      if (!matrix) {
        matrix = [
          [0.0, 3.2, 4.5, 2.1, 5.0],
          [3.2, 0.0, 2.8, 3.6, 2.4],
          [4.5, 2.8, 0.0, 4.2, 1.4],
          [2.1, 3.6, 4.2, 0.0, 4.8],
          [5.0, 2.4, 1.4, 4.8, 0.0]
        ];
      }
    }

    const { steps } = solveClusteringAverageLink(labels, matrix);
    const s1 = steps[0];
    const s2 = steps[1];
    const s3 = steps[2];
    const s4 = steps[3];

    // Pick a clean remaining node after Step 1 for checking UPGMA recalc formula
    const probeRecalc = s1.recalcs[0];

    const renderMatHtml = (lbls, mat) => buildHtmlTable(
      ["", ...lbls.map((l) => `<strong>${l}</strong>`)],
      lbls.map((l, r) => [`<strong>${l}</strong>`, ...mat[r].map((v) => fmt(v, 2))])
    );

    const step1PairExpected = [s1.leftLabel, s1.rightLabel].sort().join(",");
    const step2OtherOptions = s2.clusterLabelsBefore.filter((l) => l !== s2.leftLabel && l !== s2.rightLabel);
    const s2Desc = `${s2.leftLabel} + ${s2.rightLabel}`;
    const s2ChoiceList = [s2Desc, ...step2OtherOptions.slice(0, 2).map((o) => `${s2.leftLabel} + ${o}`)];

    return {
      uid: meta.uid || `CLUSTERING:${typeof seedOrCfg === "number" ? seedOrCfg : "custom"}`,
      topic: "CLUSTERING",
      topicLabel: TOPIC_META.CLUSTERING.nombre,
      weight: meta.weight || TOPIC_META.CLUSTERING.defaultWeight,
      targetMinutes: meta.targetMinutes || TOPIC_META.CLUSTERING.targetMinutes,
      sourceTag: meta.sourceTag || (seedOrCfg === 0 ? "Modelo Curado IA (Verificado)" : `Variante Numérica #${seedOrCfg} (Verificada)`),
      title: meta.title || "Clustering Jerárquico Aglomerativo — Average Linkage (UPGMA)",
      introHtml: `
        <p>Aplique <strong>Clustering Jerárquico Aglomerativo</strong> con criterio <strong>Average Linkage ponderado por cardinal</strong> sobre la siguiente matriz de distancias $D_0$ ($5 \\times 5$):</p>
        $$d(C_1, C_2) = \\frac{1}{|C_1|\\cdot|C_2|} \\sum_{x \\in C_1} \\sum_{y \\in C_2} d(x, y)$$
        ${renderMatHtml(labels, matrix)}
      `,
      stages: [
        {
          id: "clu_step1",
          title: "Paso 1 · Primera Fusión y Recálculo UPGMA",
          paperCommentTip: "💬 Comentá en hoja (1 línea): \"Busco el mínimo en la matriz para unir el primer par y recalculo distancias promediando todos los pares individuales (sin promediar centroides).\"",
          fields: [
            { id: "pair1", label: "Primer par fusionado (ej: C, E)", type: "pair", placeholder: "Ej: C, E", expected: step1PairExpected, expectedDisplay: `{${step1PairExpected.replace(",", ", ")}}` },
            { id: "dist1", label: "Altura de 1ra fusión $d_1$", type: "number", placeholder: "Ej: 1.400", hint: "±0.005", expected: s1.dist, altExpected: [roundN(s1.dist, 3)], tol: 0.005 },
            { id: "recalc_probe", label: `Distancia recalculada $d(${s1.mergedLabel}, ${probeRecalc.otherLabel})$`, type: "number", placeholder: "Ej: 4.750", hint: "±0.008", expected: probeRecalc.dExact, altExpected: [probeRecalc.dRounded], tol: 0.008 }
          ],
          solutionHtml: `
            <p><strong>1ra Fusión:</strong> Menor entrada de $D_0$ es <strong>{${s1.leftLabel}, ${s1.rightLabel}}</strong> con $d_1 = \\mathbf{${fmt(s1.dist, 3)}}$ $\\to$ Cluster $${s1.mergedLabel}$.</p>
            <p><strong>Recálculo de distancias desde $${s1.mergedLabel}$:</strong></p>
            <ul>
              ${s1.recalcs.map((r) => `<li>$d(${s1.mergedLabel}, ${r.otherLabel}) = \\mathbf{${fmt(r.dExact, 3)}}$</li>`).join("")}
            </ul>
            ${renderMatHtml(steps[1].clusterLabelsBefore, steps[1].matrixBefore)}
          `
        },
        {
          id: "clu_step2",
          title: "Paso 2 · Segunda Fusión del Dendrograma",
          paperCommentTip: "💬 Comentá en hoja (1 línea): \"Selecciono nuevamente la distancia mínima en la matriz reducida D1 y vuelvo a aplicar Average Linkage ponderado por cantidad de elementos.\"",
          fields: [
            { id: "fusion2", label: "Clusters que se unen en la 2da fusión", type: "select", options: s2ChoiceList, expected: s2Desc, expectedDisplay: s2Desc },
            { id: "dist2", label: "Altura de 2da fusión $d_2$", type: "number", placeholder: "Ej: 2.100", hint: "±0.008", expected: s2.dist, altExpected: [roundN(s2.dist, 3)], tol: 0.008 }
          ],
          solutionHtml: `
            <p><strong>2da Fusión:</strong> En $D_1$, la distancia mínima une <strong>${s2Desc}</strong> $\\to ${s2.mergedLabel}$ a altura $d_2 = \\mathbf{${fmt(s2.dist, 3)}}$.</p>
            ${renderMatHtml(steps[2].clusterLabelsBefore, steps[2].matrixBefore)}
          `
        },
        {
          id: "clu_step3",
          title: "Paso 3 · Fusiones Superiores y Altura Raíz del Dendrograma",
          paperCommentTip: "💬 Comentá en hoja (1 línea): \"Al unir clusters de distinto tamaño, pondero sumando todas las distancias originales entre miembros dividida por |C1|·|C2| (evita Trampa 5).\"",
          fields: [
            { id: "dist3", label: `Altura de 3ra fusión (${s3.leftLabel} + ${s3.rightLabel}) $d_3$`, type: "number", placeholder: "Ej: 2.600", hint: "±0.012", expected: s3.dist, altExpected: [roundN(s3.dist, 3)], tol: 0.012 },
            { id: "dist4", label: `Altura de fusión raíz final (${s4.leftLabel} + ${s4.rightLabel}) $d_4$`, type: "number", placeholder: "Ej: 4.100", hint: "±0.015", expected: s4.dist, altExpected: [roundN(s4.dist, 3)], tol: 0.015 }
          ],
          solutionHtml: `
            <ul>
              <li><strong>3ra Fusión:</strong> Une $${s3.leftLabel}$ ($|C|=${s3.leftSize}$) con $${s3.rightLabel}$ ($|C|=${s3.rightSize}$) $\\to ${s3.mergedLabel}$ a altura $d_3 = \\mathbf{${fmt(s3.dist, 3)}}$.</li>
              <li><strong>4ta Fusión (Raíz):</strong> Une $${s4.leftLabel}$ ($|C|=${s4.leftSize}$) con $${s4.rightLabel}$ ($|C|=${s4.rightSize}$) a altura $d_4 = \\mathbf{${fmt(s4.dist, 3)}}$.</li>
            </ul>
          `
        }
      ]
    };
  }

  // ---------------------------------------------------------------------------
  // Topic 4: Algoritmos Genéticos (Ruleta [00-99], Copias, Cruzas)
  // ---------------------------------------------------------------------------
  function solveAg(cfg) {
    const { pop, randoms } = cfg; // 6 individuals: { id, bits, f }
    const N = pop.length;
    const sumF = pop.reduce((s, ind) => s + ind.f, 0);
    const meanF = sumF / N;

    let cum = 0;
    const rows = pop.map((ind, idx) => {
      const p = ind.f / sumF;
      const start = Math.round(cum * 100);
      cum += p;
      const end = idx === N - 1 ? 99 : Math.round(cum * 100) - 1;
      const eta = ind.f / meanF;
      const intPart = Math.floor(eta);
      const fracPart = eta - intPart;
      return { ...ind, p, cum, start, end, eta, intPart, fracPart };
    });

    const picks = randoms.map((r) => {
      const found = rows.find((row) => r >= row.start && r <= row.end) || rows[rows.length - 1];
      return found.id;
    });

    const totalIntCopies = rows.reduce((s, r) => s + r.intPart, 0);
    let bestRow = rows[0];
    let bestFracRow = rows[0];
    rows.forEach((r) => {
      if (r.f > bestRow.f) bestRow = r;
      if (r.fracPart > bestFracRow.fracPart) bestFracRow = r;
    });

    // Crossover 1: Simple at G4 between I1 and I2 -> Child 1 (first 4 bits I1 + last 4 bits I2)
    const pA = pop[0].bits;
    const pB = pop[1].bits;
    const childSimple = pA.slice(0, 4) + pB.slice(4);

    // Crossover 2: Multipunto at G2, G5, G7 between I3 and I4 -> Child A (seg1:0..2 I3, seg2:2..5 I4, seg3:5..7 I3, seg4:7..8 I4)
    const pC = pop[2].bits;
    const pD = pop[3].bits;
    const childMulti = pC.slice(0, 2) + pD.slice(2, 5) + pC.slice(5, 7) + pD.slice(7, 8);

    return { sumF, meanF, rows, picks, totalIntCopies, bestRow, bestFracRow, childSimple, childMulti };
  }

  function buildAgExercise(seedOrCfg = 0, meta = {}) {
    let cfg;
    if (seedOrCfg && typeof seedOrCfg === "object") {
      cfg = seedOrCfg;
    } else if (seedOrCfg === 0) {
      cfg = {
        pop: [
          { id: "I1", bits: "10110010", f: 18 },
          { id: "I2", bits: "01001101", f: 12 },
          { id: "I3", bits: "11100101", f: 30 },
          { id: "I4", bits: "00111010", f: 24 },
          { id: "I5", bits: "10011100", f: 21 },
          { id: "I6", bits: "01100011", f: 15 }
        ],
        randoms: [10, 62]
      };
    } else {
      const rng = mulberry32(seedOrCfg * 7919 + 43);
      const randBits = () => Array.from({ length: 8 }, () => (rng() < 0.5 ? "0" : "1")).join("");
      for (let tries = 0; tries < 60; tries++) {
        const pop = Array.from({ length: 6 }, (_, i) => ({
          id: `I${i + 1}`,
          bits: randBits(),
          f: randInt(rng, 8, 42)
        }));
        const provisional = solveAg({ pop, randoms: [5, 50] });
        const bestRow = provisional.bestRow;
        const fracs = [...provisional.rows].sort((a, b) => b.fracPart - a.fracPart);
        const clearBestF = provisional.rows.filter((r) => r.f === bestRow.f).length === 1;
        const clearFracGap = fracs[0].fracPart - fracs[1].fracPart >= 0.03;
        const wideFirstInterval = provisional.rows[0].end >= 8;
        const safeSlots = provisional.rows.filter((r) => r.end - r.start >= 6);
        if (clearBestF && clearFracGap && wideFirstInterval && safeSlots.length >= 2) {
          const r1 = Math.floor((safeSlots[0].start + safeSlots[0].end) / 2);
          const r2 = Math.floor((safeSlots[1].start + safeSlots[1].end) / 2);
          cfg = { pop, randoms: [r1, r2] };
          break;
        }
      }
      if (!cfg) {
        cfg = {
          pop: [
            { id: "I1", bits: "10110010", f: 18 },
            { id: "I2", bits: "01001101", f: 12 },
            { id: "I3", bits: "11100101", f: 30 },
            { id: "I4", bits: "00111010", f: 24 },
            { id: "I5", bits: "10011100", f: 21 },
            { id: "I6", bits: "01100011", f: 15 }
          ],
          randoms: [10, 62]
        };
      }
    }

    const sol = solveAg(cfg);
    const indIds = cfg.pop.map((p) => p.id);

    const popTable = buildHtmlTable(
      ["Individuo", "Cromosoma (8 bits)", "Aptitud ($f_i$)"],
      cfg.pop.map((p) => [`**${p.id}**`, `<code>${p.bits}</code>`, `${p.f}`])
    );

    const solTable = buildHtmlTable(
      ["Indiv.", "$f_i$", "$P_i$", "Rango $[00-99]$", "$\\eta_i = f_i / \\bar{f}$", "Entera", "Resto dec."],
      sol.rows.map((r) => [
        r.id, r.f, fmt(r.p, 3),
        `[${String(r.start).padStart(2, "0")} - ${String(r.end).padStart(2, "0")}]`,
        fmt(r.eta, 3), r.intPart, fmt(r.fracPart, 3)
      ])
    );

    return {
      uid: meta.uid || `AG:${typeof seedOrCfg === "number" ? seedOrCfg : "custom"}`,
      topic: "AG",
      topicLabel: TOPIC_META.AG.nombre,
      weight: meta.weight || TOPIC_META.AG.defaultWeight,
      targetMinutes: meta.targetMinutes || TOPIC_META.AG.targetMinutes,
      sourceTag: meta.sourceTag || (seedOrCfg === 0 ? "Modelo Curado IA (Verificado)" : `Variante Numérica #${seedOrCfg} (Verificada)`),
      title: meta.title || "Algoritmos Genéticos — Ruleta, Control de Copias y Cruzas",
      introHtml: `
        <p>Considere la siguiente población inicial de $N = 6$ individuos con cromosomas binarios de 8 bits:</p>
        ${popTable}
        <p><strong>Se solicita:</strong> (1) Armar tabla de probabilidades, rangos acumulados enteros $[00-99]$ y sortear con aleatorios $r_1 = ${String(cfg.randoms[0]).padStart(2, "0")}$, $r_2 = ${String(cfg.randoms[1]).padStart(2, "0")}$; (2) Calcular control de copias esperadas $\\eta_i = f_i / \\bar{f}$; (3) Ejecutar cruza simple en $G_4$ sobre $(I_1, I_2)$ y cruza multipunto en $G_2, G_5, G_7$ sobre $(I_3, I_4)$.</p>
      `,
      stages: [
        {
          id: "ag_roulette",
          title: "Etapa 1 · Aptitud Media y Selección por Ruleta $[00 - 99]$",
          paperCommentTip: "💬 Comentá en hoja (1 línea): \"Normalizo cada aptitud sobre el total poblacional para asignar intervalos proporcionales de 00 a 99 y ubico los aleatorios.\"",
          fields: [
            { id: "f_mean", label: "Aptitud media $\\bar{f} = \\frac{1}{N}\\sum f_i$", type: "number", placeholder: "Ej: 20.000", hint: "±0.01", expected: sol.meanF, altExpected: [roundN(sol.meanF, 3)], tol: 0.01 },
            { id: "rango1_fin", label: "Fin del rango $[00 - \\_\\_]$ para $I_1$", type: "number", placeholder: "Ej: 14", hint: "Entero", expected: sol.rows[0].end, tol: 0 },
            { id: "sorteo1", label: `Individuo seleccionado por $r_1 = ${String(cfg.randoms[0]).padStart(2, "0")}$`, type: "select", options: indIds, expected: sol.picks[0], expectedDisplay: sol.picks[0] }
          ],
          solutionHtml: `
            <p>$\\sum f_i = ${sol.sumF} \\implies \\bar{f} = \\frac{${sol.sumF}}{6} = \\mathbf{${fmt(sol.meanF, 3)}}$.</p>
            ${solTable}
            <p>Para $r_1 = ${String(cfg.randoms[0]).padStart(2, "0")}$ queda seleccionado <strong>${sol.picks[0]}</strong> (y para $r_2 = ${String(cfg.randoms[1]).padStart(2, "0")}$ queda <strong>${sol.picks[1]}</strong>).</p>
          `
        },
        {
          id: "ag_copies",
          title: "Etapa 2 · Control de Copias Esperadas ($\\eta_i$)",
          paperCommentTip: "💬 Comentá en hoja (1 línea): \"Asigno primero copias enteras determinísticas según f_i/f_media y reparto las vacantes faltantes ordenando por mayor resto decimal.\"",
          fields: [
            { id: "eta_best", label: `Copias esperadas $\\eta$ del más apto (${sol.bestRow.id})`, type: "number", placeholder: "Ej: 1.500", hint: "±0.008", expected: sol.bestRow.eta, altExpected: [roundN(sol.bestRow.eta, 3)], tol: 0.008 },
            { id: "copias_enteras", label: "Suma de copias enteras fijas $\\sum \\lfloor \\eta_i \\rfloor$", type: "number", placeholder: "Ej: 3", hint: "Entero", expected: sol.totalIntCopies, tol: 0 },
            { id: "mayor_resto", label: "Individuo con mayor resto decimal (1ra copia extra)", type: "select", options: indIds, expected: sol.bestFracRow.id, expectedDisplay: sol.bestFracRow.id }
          ],
          solutionHtml: `
            <ul>
              <li>El más apto es <strong>${sol.bestRow.id}</strong> con $\\eta = \\frac{${sol.bestRow.f}}{${fmt(sol.meanF, 3)}} = \\mathbf{${fmt(sol.bestRow.eta, 3)}}$.</li>
              <li>Total de copias enteras directas: $\\sum \\lfloor \\eta_i \\rfloor = \\mathbf{${sol.totalIntCopies}}$ (quedan $${cfg.pop.length - sol.totalIntCopies}$ vacantes para restos decimales).</li>
              <li>El mayor resto decimal corresponde a <strong>${sol.bestFracRow.id}</strong> (resto <code>${fmt(sol.bestFracRow.fracPart, 3)}</code>).</li>
            </ul>
          `
        },
        {
          id: "ag_crossover",
          title: "Etapa 3 · Recombinación: Cruza Simple y Multipunto",
          paperCommentTip: "💬 Comentá en hoja (1 línea): \"Segmento los cromosomas en los puntos de corte G_k dados y alterno los bloques de ambos progenitores.\"",
          fields: [
            { id: "hijo_simple", label: "Cruza Simple en $G_4$ ($I_1 \\times I_2$) — Hijo 1 (8 bits)", type: "bitstring", placeholder: "Ej: 10111101", expected: sol.childSimple },
            { id: "hijo_multi", label: "Cruza Multipunto en $G_2, G_5, G_7$ ($I_3 \\times I_4$) — Hijo A (8 bits)", type: "bitstring", placeholder: "Ej: 11111100", expected: sol.childMulti }
          ],
          solutionHtml: `
            <ul>
              <li><strong>Cruza Simple $G_4$ ($I_1 \\times I_2$):</strong> <code>${cfg.pop[0].bits.slice(0,4)}</code> ($I_1$) + <code>${cfg.pop[1].bits.slice(4)}</code> ($I_2$) = <code><strong>${sol.childSimple}</strong></code>.</li>
              <li><strong>Cruza Multipunto $G_2, G_5, G_7$ ($I_3 \\times I_4$):</strong> <code>${cfg.pop[2].bits.slice(0,2)}</code> ($I_3$) + <code>${cfg.pop[3].bits.slice(2,5)}</code> ($I_4$) + <code>${cfg.pop[2].bits.slice(5,7)}</code> ($I_3$) + <code>${cfg.pop[3].bits.slice(7)}</code> ($I_4$) = <code><strong>${sol.childMulti}</strong></code>.</li>
            </ul>
          `
        }
      ]
    };
  }

  // ---------------------------------------------------------------------------
  // Topic 5: Naïve Bayes (Gaussiano Continuo y Bins/Laplace)
  // ---------------------------------------------------------------------------
  function buildNbExercise(seedOrCfg = 0, meta = {}) {
    const useLaplace = typeof seedOrCfg === "number" && seedOrCfg % 2 === 1;
    if (useLaplace) {
      return buildNbLaplaceExercise(seedOrCfg, meta);
    }
    return buildNbGaussianExercise(seedOrCfg, meta);
  }

  function solveNbGaussian(cfg) {
    const { x, pC1, pC2, c1, c2 } = cfg;
    const g11 = normPdf(x[0], c1.mu[0], c1.sd[0]);
    const g12 = normPdf(x[1], c1.mu[1], c1.sd[1]);
    const g21 = normPdf(x[0], c2.mu[0], c2.sd[0]);
    const g22 = normPdf(x[1], c2.mu[1], c2.sd[1]);

    const exVC1 = pC1 * g11.pdf * g12.pdf;
    const exVC2 = pC2 * g21.pdf * g22.pdf;
    const winner = exVC1 >= exVC2 ? "C1" : "C2";
    const exPWin = (winner === "C1" ? exVC1 : exVC2) / (exVC1 + exVC2);

    // 3-decimal calculator path
    const cg11 = roundN(roundN(g11.coef, 3) * roundN(Math.exp(roundN(g11.exponent, 3)), 3), 3);
    const cg12 = roundN(roundN(g12.coef, 3) * roundN(Math.exp(roundN(g12.exponent, 3)), 3), 3);
    const cg21 = roundN(roundN(g21.coef, 3) * roundN(Math.exp(roundN(g21.exponent, 3)), 3), 3);
    const cg22 = roundN(roundN(g22.coef, 3) * roundN(Math.exp(roundN(g22.exponent, 3)), 3), 3);
    const cVC1 = roundN(pC1 * cg11 * cg12, 3);
    const cVC2 = roundN(pC2 * cg21 * cg22, 3);
    const cPWin = roundN((winner === "C1" ? cVC1 : cVC2) / Math.max(1e-9, cVC1 + cVC2), 3);

    return {
      exact: { p11: g11.pdf, p12: g12.pdf, p21: g21.pdf, p22: g22.pdf, vC1: exVC1, vC2: exVC2, winner, pWin: exPWin, raw: { g11, g12, g21, g22 } },
      calc3: { p11: cg11, p12: cg12, p21: cg21, p22: cg22, vC1: cVC1, vC2: cVC2, pWin: cPWin }
    };
  }

  function buildNbGaussianExercise(seedOrCfg = 0, meta = {}) {
    let cfg;
    if (seedOrCfg && typeof seedOrCfg === "object") {
      cfg = seedOrCfg;
    } else if (seedOrCfg === 0) {
      cfg = {
        x: [4.6, 2.2],
        pC1: 0.6,
        pC2: 0.4,
        c1: { mu: [4.2, 2.0], sd: [0.5, 0.4] },
        c2: { mu: [5.8, 2.8], sd: [0.5, 0.5] }
      };
    } else {
      const rng = mulberry32(seedOrCfg * 8209 + 53);
      for (let tries = 0; tries < 60; tries++) {
        const pC1 = randChoice(rng, [0.4, 0.5, 0.6]);
        const c1 = {
          mu: [randInt(rng, 30, 50) / 10, randInt(rng, 12, 22) / 10],
          sd: [randChoice(rng, [0.4, 0.5, 0.6]), randChoice(rng, [0.3, 0.4, 0.5])]
        };
        const c2 = {
          mu: [randInt(rng, 55, 72) / 10, randInt(rng, 24, 35) / 10],
          sd: [randChoice(rng, [0.4, 0.5, 0.6]), randChoice(rng, [0.4, 0.5, 0.6])]
        };
        const x = [randInt(rng, 38, 62) / 10, randInt(rng, 15, 30) / 10];
        const cand = { x, pC1, pC2: roundN(1 - pC1, 2), c1, c2 };
        const s = solveNbGaussian(cand).exact;
        const ratio = Math.max(s.vC1, s.vC2) / Math.max(1e-9, Math.min(s.vC1, s.vC2));
        if (s.vC1 >= 0.015 && s.vC2 >= 0.015 && ratio >= 1.4 && s.p11 >= 0.05 && s.p12 >= 0.05) {
          cfg = cand;
          break;
        }
      }
      if (!cfg) cfg = { x: [4.6, 2.2], pC1: 0.6, pC2: 0.4, c1: { mu: [4.2, 2.0], sd: [0.5, 0.4] }, c2: { mu: [5.8, 2.8], sd: [0.5, 0.5] } };
    }

    const sol = solveNbGaussian(cfg);
    const { exact: ex, calc3: c3 } = sol;

    const paramTable = buildHtmlTable(
      ["Clase", "Prior $P(C_k)$", "Atributo $a_1$ ($\\mu, \\sigma$)", "Atributo $a_2$ ($\\mu, \\sigma$)"],
      [
        ["**$C_1$**", fmt(cfg.pC1, 2), `$\\mu = ${fmt(cfg.c1.mu[0], 1)}$, $\\sigma = ${fmt(cfg.c1.sd[0], 1)}$`, `$\\mu = ${fmt(cfg.c1.mu[1], 1)}$, $\\sigma = ${fmt(cfg.c1.sd[1], 1)}$`],
        ["**$C_2$**", fmt(cfg.pC2, 2), `$\\mu = ${fmt(cfg.c2.mu[0], 1)}$, $\\sigma = ${fmt(cfg.c2.sd[0], 1)}$`, `$\\mu = ${fmt(cfg.c2.mu[1], 1)}$, $\\sigma = ${fmt(cfg.c2.sd[1], 1)}$`]
      ]
    );

    return {
      uid: meta.uid || `NB_GAUSS:${typeof seedOrCfg === "number" ? seedOrCfg : "custom"}`,
      topic: "NB",
      topicLabel: TOPIC_META.NB.nombre,
      weight: meta.weight || TOPIC_META.NB.defaultWeight,
      targetMinutes: meta.targetMinutes || TOPIC_META.NB.targetMinutes,
      sourceTag: meta.sourceTag || (seedOrCfg === 0 ? "Modelo Curado IA (Verificado)" : `Variante Gaussiana #${seedOrCfg} (Verificada)`),
      title: meta.title || "Clasificador Naïve Bayes Continuo (Densidad Gaussiana)",
      introHtml: `
        <p>Clasifique la nueva instancia $X = (a_1 = ${fmt(cfg.x[0], 1)},\\; a_2 = ${fmt(cfg.x[1], 1)})$ utilizando Naïve Bayes Gaussiano:</p>
        $$P(a_j \\mid C_k) = \\frac{1}{\\sigma\\sqrt{2\\pi}} e^{-\\frac{(a_j - \\mu)^2}{2\\sigma^2}}$$
        ${paramTable}
      `,
      stages: [
        {
          id: "nb_pdf_c1",
          title: "Etapa 1 · Densidades Condicionales en $C_1$",
          paperCommentTip: "💬 Comentá en hoja (1 línea): \"Evalúo la campana gaussiana para cada atributo usando la media y desvío propios de la clase C1.\"",
          fields: [
            { id: "p_a1_c1", label: "$P(a_1 \\mid C_1)$", type: "number", placeholder: "Ej: 0.580", hint: "±0.008", expected: ex.p11, altExpected: [c3.p11], tol: 0.008 },
            { id: "p_a2_c1", label: "$P(a_2 \\mid C_1)$", type: "number", placeholder: "Ej: 0.880", hint: "±0.010", expected: ex.p12, altExpected: [c3.p12], tol: 0.01 }
          ],
          solutionHtml: `
            <ul>
              <li>$P(a_1=${fmt(cfg.x[0],1)} \\mid C_1) = ${fmt(ex.raw.g11.coef,4)} \\cdot e^{${fmt(ex.raw.g11.exponent,4)}} = \\mathbf{${fmt(ex.p11, 4)}}$ (3 dec: <code>${fmt(c3.p11, 3)}</code>)</li>
              <li>$P(a_2=${fmt(cfg.x[1],1)} \\mid C_1) = ${fmt(ex.raw.g12.coef,4)} \\cdot e^{${fmt(ex.raw.g12.exponent,4)}} = \\mathbf{${fmt(ex.p12, 4)}}$ (3 dec: <code>${fmt(c3.p12, 3)}</code>)</li>
            </ul>
          `
        },
        {
          id: "nb_scores",
          title: "Etapa 2 · Verosimilitudes en $C_2$ y Productos Posteriores",
          paperCommentTip: "💬 Comentá en hoja (1 línea): \"Bajo independencia condicional multiplico el prior por las densidades de cada atributo en cada clase.\"",
          fields: [
            { id: "v_c1", label: "Score no normalizado $V(C_1) = P(C_1) P(a_1|C_1) P(a_2|C_1)$", type: "number", placeholder: "Ej: 0.306", hint: "±0.012", expected: ex.vC1, altExpected: [c3.vC1], tol: 0.012 },
            { id: "v_c2", label: "Score no normalizado $V(C_2) = P(C_2) P(a_1|C_2) P(a_2|C_2)$", type: "number", placeholder: "Ej: 0.008", hint: "±0.010", expected: ex.vC2, altExpected: [c3.vC2], tol: 0.01 }
          ],
          solutionHtml: `
            <ul>
              <li>$P(a_1 \\mid C_2) = ${fmt(ex.p21, 4)}$, $P(a_2 \\mid C_2) = ${fmt(ex.p22, 4)}$</li>
              <li>$V(C_1) = ${fmt(cfg.pC1,2)} \\times ${fmt(ex.p11,4)} \\times ${fmt(ex.p12,4)} = \\mathbf{${fmt(ex.vC1, 4)}}$ (3 dec: <code>${fmt(c3.vC1, 3)}</code>)</li>
              <li>$V(C_2) = ${fmt(cfg.pC2,2)} \\times ${fmt(ex.p21,4)} \\times ${fmt(ex.p22,4)} = \\mathbf{${fmt(ex.vC2, 4)}}$ (3 dec: <code>${fmt(c3.vC2, 3)}</code>)</li>
            </ul>
          `
        },
        {
          id: "nb_decision",
          title: "Etapa 3 · Decisión y Probabilidad Normalizada",
          paperCommentTip: "💬 Comentá en hoja (1 línea): \"Comparo los puntajes posteriores y normalizo sobre la suma total para obtener la confianza de clasificación.\"",
          fields: [
            { id: "winner", label: "Clase ganadora (MAP)", type: "select", options: ["C1", "C2"], expected: ex.winner, expectedDisplay: ex.winner },
            { id: "p_norm", label: "Probabilidad posterior normalizada de la clase ganadora (en [0, 1])", type: "number", placeholder: "Ej: 0.960", hint: "±0.015", expected: ex.pWin, altExpected: [c3.pWin], tol: 0.015 }
          ],
          solutionHtml: `
            <p>Gana <strong>${ex.winner}</strong> con probabilidad normalizada $P(${ex.winner} \\mid X) = \\frac{${fmt(ex.winner==="C1"?ex.vC1:ex.vC2, 4)}}{${fmt(ex.vC1,4)} + ${fmt(ex.vC2,4)}} = \\mathbf{${fmt(ex.pWin, 4)}}$ (${fmt(ex.pWin * 100, 1)}%).</p>
          `
        }
      ]
    };
  }

  function buildNbLaplaceExercise(seed, meta = {}) {
    const rng = mulberry32(seed * 5113 + 7);
    const B = 3; // 3 bins per attribute
    let cfg;
    for (let tries = 0; tries < 40; tries++) {
      const n1 = randInt(rng, 10, 16);
      const n2 = randInt(rng, 8, 14);
      const cand = {
        n1, n2, B,
        c1Counts: [randInt(rng, 4, n1 - 2), randInt(rng, 5, n1 - 1), 0], // Zero frequency forces Laplace!
        c2Counts: [randInt(rng, 2, n2 - 3), randInt(rng, 2, n2 - 3), randInt(rng, 3, n2 - 2)]
      };
      const N = n1 + n2;
      const pC1 = n1 / N;
      const pC2 = n2 / N;
      const v1 = pC1 * cand.c1Counts.reduce((acc, f) => acc * ((f + 1) / (n1 + B)), 1);
      const v2 = pC2 * cand.c2Counts.reduce((acc, f) => acc * ((f + 1) / (n2 + B)), 1);
      const ratio = Math.max(v1, v2) / Math.max(1e-9, Math.min(v1, v2));
      if (ratio >= 1.25 && Math.min(v1, v2) >= 0.002) {
        cfg = cand;
        break;
      }
    }
    if (!cfg) cfg = { n1: 12, n2: 8, B: 3, c1Counts: [8, 9, 0], c2Counts: [3, 2, 5] };

    const { n1, n2, c1Counts, c2Counts } = cfg;
    const N = n1 + n2;
    const pC1 = n1 / N;
    const pC2 = n2 / N;
    const lap = (f, nk) => (f + 1) / (nk + B);
    const lc1 = c1Counts.map((f) => lap(f, n1));
    const lc2 = c2Counts.map((f) => lap(f, n2));
    const vC1 = pC1 * lc1[0] * lc1[1] * lc1[2];
    const vC2 = pC2 * lc2[0] * lc2[1] * lc2[2];
    const winner = vC1 >= vC2 ? "C1" : "C2";
    const pWin = (winner === "C1" ? vC1 : vC2) / (vC1 + vC2);

    const clc1 = lc1.map((v) => roundN(v, 3));
    const clc2 = lc2.map((v) => roundN(v, 3));
    const cvC1 = roundN(roundN(pC1, 3) * clc1[0] * clc1[1] * clc1[2], 4);
    const cvC2 = roundN(roundN(pC2, 3) * clc2[0] * clc2[1] * clc2[2], 4);
    const cpWin = roundN((winner === "C1" ? cvC1 : cvC2) / Math.max(1e-9, cvC1 + cvC2), 3);

    const freqTable = buildHtmlTable(
      ["Clase", "Instancias $N_k$", "$f(x_1 \\in \\text{Bin}_a)$", "$f(x_2 \\in \\text{Bin}_b)$", "$f(x_3 \\in \\text{Bin}_c)$"],
      [
        ["**$C_1$**", n1, c1Counts[0], c1Counts[1], c1Counts[2]],
        ["**$C_2$**", n2, c2Counts[0], c2Counts[1], c2Counts[2]]
      ]
    );

    return {
      uid: meta.uid || `NB_LAP:${seed}`,
      topic: "NB",
      topicLabel: TOPIC_META.NB.nombre,
      weight: meta.weight || TOPIC_META.NB.defaultWeight,
      targetMinutes: meta.targetMinutes || TOPIC_META.NB.targetMinutes,
      sourceTag: meta.sourceTag || `Variante Bins + Laplace #${seed} (Verificada)`,
      title: meta.title || "Naïve Bayes Discretizado en Histogramas con Suavizado de Laplace (+1)",
      introHtml: `
        <p>Un dataset de $N = ${N}$ instancias discretizado en <strong>$B = ${B}$ intervalos (bins) por atributo</strong> arrojó las siguientes frecuencias para los bins observados en la consulta $X$:</p>
        ${freqTable}
        <p>Como $f(x_3 \\mid C_1) = 0$ anularía el producto, aplique <strong>Suavizado de Laplace ($+1$)</strong> en todas las verosimilitudes: $P(x_j \\mid C_k) = \\frac{f + 1}{N_k + B}$.</p>
      `,
      stages: [
        {
          id: "nb_lap_1",
          title: "Etapa 1 · Probabilidades Suavizadas de $C_1$",
          paperCommentTip: "💬 Comentá en hoja (1 línea): \"Detecto frecuencia nula en un bin y aplico Laplace +1 sumando B intervalos en el denominador para evitar anular el producto.\"",
          fields: [
            { id: "lap_c1_x3", label: "Verosimilitud suavizada $P(x_3 \\mid C_1)$", type: "number", placeholder: "Ej: 0.067", hint: "±0.005", expected: lc1[2], altExpected: [clc1[2]], tol: 0.005 },
            { id: "lap_c1_x1", label: "Verosimilitud suavizada $P(x_1 \\mid C_1)$", type: "number", placeholder: "Ej: 0.600", hint: "±0.005", expected: lc1[0], altExpected: [clc1[0]], tol: 0.005 }
          ],
          solutionHtml: `
            <ul>
              <li>$P(C_1) = \\frac{${n1}}{${N}} = ${fmt(pC1, 3)}$, $P(C_2) = \\frac{${n2}}{${N}} = ${fmt(pC2, 3)}$</li>
              <li>$C_1$: $P(x_1|C_1) = \\frac{${c1Counts[0]}+1}{${n1}+${B}} = \\mathbf{${fmt(lc1[0], 4)}}$; $P(x_2|C_1) = \\frac{${c1Counts[1]}+1}{${n1}+${B}} = ${fmt(lc1[1], 4)}$; $P(x_3|C_1) = \\frac{0+1}{${n1}+${B}} = \\mathbf{${fmt(lc1[2], 4)}}$</li>
            </ul>
          `
        },
        {
          id: "nb_lap_2",
          title: "Etapa 2 · Scores Posteriores con Laplace",
          paperCommentTip: "💬 Comentá en hoja (1 línea): \"Multiplico el prior por las tres verosimilitudes suavizadas en C1 y C2 para comparar evidencia.\"",
          fields: [
            { id: "v_c1", label: "Score posterior $V(C_1)$", type: "number", placeholder: "Ej: 0.015", hint: "±0.004", expected: vC1, altExpected: [cvC1], tol: 0.004 },
            { id: "v_c2", label: "Score posterior $V(C_2)$", type: "number", placeholder: "Ej: 0.025", hint: "±0.004", expected: vC2, altExpected: [cvC2], tol: 0.004 }
          ],
          solutionHtml: `
            <ul>
              <li>$V(C_1) = ${fmt(pC1,3)} \\times ${fmt(lc1[0],3)} \\times ${fmt(lc1[1],3)} \\times ${fmt(lc1[2],3)} = \\mathbf{${fmt(vC1, 4)}}$</li>
              <li>$V(C_2) = ${fmt(pC2,3)} \\times ${fmt(lc2[0],3)} \\times ${fmt(lc2[1],3)} \\times ${fmt(lc2[2],3)} = \\mathbf{${fmt(vC2, 4)}}$</li>
            </ul>
          `
        },
        {
          id: "nb_lap_3",
          title: "Etapa 3 · Clasificación Final",
          paperCommentTip: "💬 Comentá en hoja (1 línea): \"Asigno la clase de mayor puntaje posterior y normalizo su probabilidad.\"",
          fields: [
            { id: "winner", label: "Clase ganadora", type: "select", options: ["C1", "C2"], expected: winner, expectedDisplay: winner },
            { id: "p_norm", label: "Probabilidad normalizada ganadora (en [0, 1])", type: "number", placeholder: "Ej: 0.625", hint: "±0.015", expected: pWin, altExpected: [cpWin], tol: 0.015 }
          ],
          solutionHtml: `<p>Gana <strong>${winner}</strong> con probabilidad normalizada $\\mathbf{${fmt(pWin, 4)}}$.</p>`
        }
      ]
    };
  }

  // ---------------------------------------------------------------------------
  // Topic 6: Redes de Hopfield (N=5 bipolares, diagonal nula, recuperación 1 paso)
  // ---------------------------------------------------------------------------
  function solveHopfield(e1, e2, ed) {
    const N = e1.length;
    const dot = e1.reduce((s, v, i) => s + v * e2[i], 0);
    const W = Array.from({ length: N }, (_, i) =>
      Array.from({ length: N }, (_, j) => (i === j ? 0 : e1[i] * e1[j] + e2[i] * e2[j]))
    );
    const net1 = Array.from({ length: N }, (_, j) => ed.reduce((s, v, i) => s + v * W[i][j], 0));
    const s1 = net1.map((v, j) => (v > 0 ? 1 : v < 0 ? -1 : ed[j]));
    const net2 = Array.from({ length: N }, (_, j) => s1.reduce((s, v, i) => s + v * W[i][j], 0));
    const s2 = net2.map((v, j) => (v > 0 ? 1 : v < 0 ? -1 : s1[j]));

    const energy = (s) => {
      let sum = 0;
      for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) sum += s[i] * W[i][j] * s[j];
      return -0.5 * sum;
    };

    return { dot, W, net1, s1, net2, s2, eInit: energy(ed), eRec: energy(s1) };
  }

  function buildHopfieldExercise(seedOrCfg = 0, meta = {}) {
    let cfg;
    if (seedOrCfg && typeof seedOrCfg === "object") {
      cfg = seedOrCfg;
    } else if (seedOrCfg === 0) {
      cfg = {
        e1: [1, 1, -1, 1, -1],
        e2: [1, -1, 1, -1, -1],
        ed: [1, -1, -1, 1, -1]
      };
    } else {
      const rng = mulberry32(seedOrCfg * 9973 + 67);
      const vecs = [];
      for (let mask = 0; mask < 32; mask++) {
        const v = Array.from({ length: 5 }, (_, b) => ((mask >> b) & 1 ? 1 : -1));
        const pos = v.filter((x) => x === 1).length;
        if (pos === 2 || pos === 3) vecs.push(v); // Non-trivial mixed vectors only!
      }
      for (let tries = 0; tries < 120; tries++) {
        const e1 = randChoice(rng, vecs);
        const candidatesE2 = vecs.filter((v) => {
          const d = e1.reduce((s, x, i) => s + x * v[i], 0);
          return Math.abs(d) === 1;
        });
        const e2 = randChoice(rng, candidatesE2);
        const bit = randInt(rng, 0, 4);
        const ed = [...e1];
        ed[bit] *= -1;
        const s = solveHopfield(e1, e2, ed);
        if (
          s.net1[bit] !== 0 &&
          s.s1.every((v, i) => v === e1[i]) &&
          s.s2.every((v, i) => v === e1[i])
        ) {
          cfg = { e1, e2, ed };
          break;
        }
      }
      if (!cfg) cfg = { e1: [1, 1, -1, 1, -1], e2: [1, -1, 1, -1, -1], ed: [1, -1, -1, 1, -1] };
    }

    const sol = solveHopfield(cfg.e1, cfg.e2, cfg.ed);
    const fmtVec = (v) => `[${v.map((x) => (x > 0 ? "+1" : String(x))).join(", ")}]`;

    const wTable = buildHtmlTable(
      ["W", "1", "2", "3", "4", "5"],
      sol.W.map((row, r) => [`<strong>${r + 1}</strong>`, ...row.map((v) => String(v))])
    );

    return {
      uid: meta.uid || `HOPFIELD:${typeof seedOrCfg === "number" ? seedOrCfg : "custom"}`,
      topic: "HOPFIELD",
      topicLabel: TOPIC_META.HOPFIELD.nombre,
      weight: meta.weight || TOPIC_META.HOPFIELD.defaultWeight,
      targetMinutes: meta.targetMinutes || TOPIC_META.HOPFIELD.targetMinutes,
      sourceTag: meta.sourceTag || (seedOrCfg === 0 ? "Modelo Curado IA (Verificado)" : `Variante Numérica #${seedOrCfg} (Verificada)`),
      title: meta.title || "Redes de Hopfield ($N=5$) — Matriz Hebbiana y Recuperación",
      introHtml: `
        <p>Se memorizan dos patrones bipolares de dimensión $N = 5$ en una red de Hopfield con actualización síncrona:</p>
        <ul>
          <li>$\\mathbf{E}_1 = ${fmtVec(cfg.e1)}$</li>
          <li>$\\mathbf{E}_2 = ${fmtVec(cfg.e2)}$</li>
        </ul>
        <p>Luego se presenta el patrón ruidoso inicial: $\\mathbf{E}_d = ${fmtVec(cfg.ed)}$.</p>
      `,
      stages: [
        {
          id: "hop_matrix",
          title: "Etapa 1 · Cuasi-Ortogonalidad y Matriz Hebbiana $W$",
          paperCommentTip: "💬 Comentá en hoja (1 línea): \"Verifico ortogonalidad entre patrones, sumo productos exteriores E^T·E y anulo la diagonal principal (w_ii = 0) para garantizar estabilidad.\"",
          fields: [
            { id: "dot_e1_e2", label: "Producto escalar $\\mathbf{E}_1 \\cdot \\mathbf{E}_2$", type: "number", placeholder: "Ej: -1", hint: "Entero", expected: sol.dot, tol: 0 },
            { id: "w_11", label: "Elemento diagonal $w_{1,1}$ de $W$", type: "number", placeholder: "Ej: 0", hint: "Entero", expected: sol.W[0][0], tol: 0 },
            { id: "w_12", label: "Elemento $w_{1,2}$ de $W$", type: "number", placeholder: "Ej: 0 o -2", hint: "Entero", expected: sol.W[0][1], tol: 0 }
          ],
          solutionHtml: `
            <p>Producto escalar $\\mathbf{E}_1 \\cdot \\mathbf{E}_2 = \\mathbf{${sol.dot}}$ (cuasi-ortogonal en $N=5$). Matriz $W = E_1^T E_1 + E_2^T E_2 - 2I$ (con $w_{ii}=0$):</p>
            ${wTable}
          `
        },
        {
          id: "hop_recover",
          title: "Etapa 2 · Dinámica de Recuperación $S(1)$",
          paperCommentTip: "💬 Comentá en hoja (1 línea): \"Multiplico el estado ruidoso por W; si alguna entrada neta da 0 la neurona mantiene su estado anterior s_i(0).\"",
          fields: [
            { id: "net1_vec", label: "Vector neto $\\mathbf{Net}(1) = \\mathbf{E}_d \\cdot W$ (5 valores)", type: "vector", placeholder: "Ej: 2, 4, -2, 0, -2", expected: sol.net1, expectedDisplay: `[${sol.net1.join(", ")}]`, tol: 0 },
            { id: "s1_vec", label: "Estado recuperado $\\mathbf{S}(1) = \\operatorname{sgn}(\\mathbf{Net}(1))$", type: "vector", placeholder: "Ej: +1, +1, -1, +1, -1", expected: sol.s1, expectedDisplay: fmtVec(sol.s1), tol: 0 }
          ],
          solutionHtml: `
            <ul>
              <li>$\\mathbf{Net}(1) = \\mathbf{E}_d \\cdot W = \\mathbf{[${sol.net1.join(", ")}]}$</li>
              <li>Aplicando signo bipolar (y conservando $s_i(0)$ cuando $Net_i = 0$): $\\mathbf{S}(1) = \\mathbf{${fmtVec(sol.s1)}} \\equiv \\mathbf{E}_1$ (punto fijo en paso siguiente $\\mathbf{S}(2) = \\mathbf{S}(1)$).</li>
            </ul>
          `
        },
        {
          id: "hop_energy",
          title: "Etapa 3 · Función de Energía de Lyapunov",
          paperCommentTip: "💬 Comentá en hoja (1 línea): \"Compruebo que la energía del patrón recuperado es estrictamente menor o igual que la del patrón ruidoso.\"",
          fields: [
            { id: "e_init", label: "Energía inicial $E(\\mathbf{E}_d) = -\\frac{1}{2} \\mathbf{E}_d W \\mathbf{E}_d^T$", type: "number", placeholder: "Ej: -4", hint: "±0.01", expected: sol.eInit, tol: 0.01 },
            { id: "e_rec", label: "Energía recuperada $E(\\mathbf{S}(1))$", type: "number", placeholder: "Ej: -8", hint: "±0.01", expected: sol.eRec, tol: 0.01 }
          ],
          solutionHtml: `
            <ul>
              <li>$E(\\mathbf{E}_d) = \\mathbf{${sol.eInit}}$</li>
              <li>$E(\\mathbf{S}(1)) = \\mathbf{${sol.eRec}}$ ($E(\\mathbf{S}(1)) < E(\\mathbf{E}_d)$, mínimo local estable alcanzado).</li>
            </ul>
          `
        }
      ]
    };
  }

  // ---------------------------------------------------------------------------
  // Topic 7: KNN Ponderado por Inverso del Cuadrado (1/d²)
  // ---------------------------------------------------------------------------
  function solveKnnWeighted(cfg) {
    const { pts, q, k } = cfg;
    const withD = pts
      .map((p) => {
        const d2 = Math.pow(q[0] - p.x[0], 2) + Math.pow(q[1] - p.x[1], 2);
        return { ...p, d2, d: Math.sqrt(d2), w: 1 / d2 };
      })
      .sort((a, b) => a.d2 - b.d2);

    const topK = withD.slice(0, k);
    const votesSimple = { A: 0, B: 0 };
    const weightsSum = { A: 0, B: 0 };
    let calcWeightsSum = { A: 0, B: 0 };

    topK.forEach((n) => {
      votesSimple[n.cls] += 1;
      weightsSum[n.cls] += n.w;
      calcWeightsSum[n.cls] = roundN(calcWeightsSum[n.cls] + roundN(n.w, 3), 3);
    });

    const majWinner = votesSimple.A >= votesSimple.B ? "A" : "B";
    const weightedWinner = weightsSum.A >= weightsSum.B ? "A" : "B";

    return { withD, topK, votesSimple, weightsSum, calcWeightsSum, majWinner, weightedWinner };
  }

  function buildKnnExercise(seedOrCfg = 0, meta = {}) {
    let cfg;
    if (seedOrCfg && typeof seedOrCfg === "object") {
      cfg = seedOrCfg;
    } else if (seedOrCfg === 0) {
      cfg = {
        k: 3,
        q: [3.0, 2.0],
        pts: [
          { id: "P1", x: [3.2, 2.0], cls: "A" },
          { id: "P2", x: [1.0, 2.0], cls: "B" },
          { id: "P3", x: [3.0, 4.5], cls: "B" },
          { id: "P4", x: [7.0, 6.0], cls: "A" },
          { id: "P5", x: [6.0, 1.0], cls: "B" }
        ]
      };
    } else {
      const rng = mulberry32(seedOrCfg * 6131 + 89);
      for (let tries = 0; tries < 70; tries++) {
        const q = [randInt(rng, 2, 5), randInt(rng, 2, 5)];
        const dClose = randChoice(rng, [0.2, 0.4, 0.5]);
        const cand = {
          k: 3,
          q,
          pts: [
            { id: "P1", x: [roundN(q[0] + dClose, 1), q[1]], cls: "A" },
            { id: "P2", x: [q[0] + 2, q[1]], cls: "B" },
            { id: "P3", x: [q[0], roundN(q[1] + randChoice(rng, [2.5, 3.0]), 1)], cls: "B" },
            { id: "P4", x: [q[0] + 4, q[1] + 4], cls: "A" },
            { id: "P5", x: [q[0] - 3, q[1] - 3], cls: "B" }
          ]
        };
        const sol = solveKnnWeighted(cand);
        const sortedD2 = sol.withD.map((p) => p.d2);
        const distinctD2 = sortedD2.every((v, i) => i === 0 || v - sortedD2[i - 1] >= 0.4);
        if (distinctD2 && sol.majWinner === "B" && sol.weightedWinner === "A") {
          cfg = cand;
          break;
        }
      }
      if (!cfg) {
        cfg = {
          k: 3, q: [3.0, 2.0],
          pts: [
            { id: "P1", x: [3.2, 2.0], cls: "A" },
            { id: "P2", x: [1.0, 2.0], cls: "B" },
            { id: "P3", x: [3.0, 4.5], cls: "B" },
            { id: "P4", x: [7.0, 6.0], cls: "A" },
            { id: "P5", x: [6.0, 1.0], cls: "B" }
          ]
        };
      }
    }

    const sol = solveKnnWeighted(cfg);
    const dataTable = buildHtmlTable(
      ["Punto", "$x_1$", "$x_2$", "Clase"],
      cfg.pts.map((p) => [`**${p.id}**`, fmt(p.x[0], 1), fmt(p.x[1], 1), `Clase ${p.cls}`])
    );

    return {
      uid: meta.uid || `KNN:${typeof seedOrCfg === "number" ? seedOrCfg : "custom"}`,
      topic: "KNN",
      topicLabel: TOPIC_META.KNN.nombre,
      weight: meta.weight || TOPIC_META.KNN.defaultWeight,
      targetMinutes: meta.targetMinutes || TOPIC_META.KNN.targetMinutes,
      sourceTag: meta.sourceTag || (seedOrCfg === 0 ? "Modelo Curado IA (Verificado)" : `Variante Numérica #${seedOrCfg} (Verificada)`),
      title: meta.title || "Clasificador $K$-NN Ponderado por Inverso de Distancia ($w_i = 1/d^2$)",
      introHtml: `
        <p>Clasifique la muestra de consulta $\\mathbf{x}_q = [${fmt(cfg.q[0], 1)},\\; ${fmt(cfg.q[1], 1)}]^T$ usando los <strong>$K = 3$ vecinos más cercanos</strong>:</p>
        ${dataTable}
      `,
      stages: [
        {
          id: "knn_dist",
          title: "Etapa 1 · Distancias Cuadradas y Voto por Mayoría Simple",
          paperCommentTip: "💬 Comentá en hoja (1 línea): \"Calculo d² respecto a x_q, ordeno de menor a mayor para tomar los K=3 vecinos y verifico qué gana por voto simple.\"",
          fields: [
            { id: "d2_n1", label: `Menor distancia cuadrada $d^2(x_q, ${sol.topK[0].id})$`, type: "number", placeholder: "Ej: 0.040", hint: "±0.005", expected: sol.topK[0].d2, altExpected: [roundN(sol.topK[0].d2, 3)], tol: 0.005 },
            { id: "d2_n3", label: `Distancia cuadrada del 3er vecino $d^2(x_q, ${sol.topK[2].id})$`, type: "number", placeholder: "Ej: 6.250", hint: "±0.01", expected: sol.topK[2].d2, altExpected: [roundN(sol.topK[2].d2, 3)], tol: 0.01 },
            { id: "maj_winner", label: "Clase ganadora por MAYORÍA SIMPLE (sin ponderar)", type: "select", options: ["A", "B"], expected: sol.majWinner, expectedDisplay: `Clase ${sol.majWinner}` }
          ],
          solutionHtml: `
            <ul>
              ${sol.withD.map((p, i) => `<li>${p.id} (Clase ${p.cls}): $d^2 = \\mathbf{${fmt(p.d2, 3)}}$ ${i < 3 ? "← <strong>Top 3</strong>" : "(descartado)"}</li>`).join("")}
            </ul>
            <p>Por mayoría simple: $A=${sol.votesSimple.A}$, $B=${sol.votesSimple.B} \\implies$ ganaría <strong>Clase ${sol.majWinner}</strong>.</p>
          `
        },
        {
          id: "knn_weights",
          title: "Etapa 2 · Pesos Inversos $w_i = 1 / d_i^2$",
          paperCommentTip: "💬 Comentá en hoja (1 línea): \"Pondero cada vecino por 1/d² para que la cercanía pese más que dos vecinos alejados.\"",
          fields: [
            { id: "va", label: "Peso acumulado Clase A ($V_A$)", type: "number", placeholder: "Ej: 25.000", hint: "±0.05", expected: sol.weightsSum.A, altExpected: [sol.calcWeightsSum.A], tol: 0.05 },
            { id: "vb", label: "Peso acumulado Clase B ($V_B$)", type: "number", placeholder: "Ej: 0.410", hint: "±0.015", expected: sol.weightsSum.B, altExpected: [sol.calcWeightsSum.B], tol: 0.015 }
          ],
          solutionHtml: `
            <ul>
              <li>$V_A = ${sol.topK.filter(n=>n.cls==="A").map(n=>`1/${fmt(n.d2,3)}`).join(" + ") || "0"} = \\mathbf{${fmt(sol.weightsSum.A, 3)}}$</li>
              <li>$V_B = ${sol.topK.filter(n=>n.cls==="B").map(n=>`1/${fmt(n.d2,3)}`).join(" + ") || "0"} = \\mathbf{${fmt(sol.weightsSum.B, 3)}}$</li>
            </ul>
          `
        },
        {
          id: "knn_final",
          title: "Etapa 3 · Decisión Final Ponderada",
          paperCommentTip: "💬 Comentá en hoja (1 línea): \"Elijo la clase con mayor suma de pesos 1/d² y concluyo cómo la ponderación evita la sensibilidad a vecinos lejanos.\"",
          fields: [
            { id: "weighted_winner", label: "Clase ganadora por KNN PONDERADO", type: "select", options: ["A", "B"], expected: sol.weightedWinner, expectedDisplay: `Clase ${sol.weightedWinner}` }
          ],
          solutionHtml: `<p>Como $V_A = ${fmt(sol.weightsSum.A, 3)} \\gg V_B = ${fmt(sol.weightsSum.B, 3)}$, gana la <strong>Clase ${sol.weightedWinner}</strong> (revirtiendo la mayoría simple).</p>`
        }
      ]
    };
  }

  // ---------------------------------------------------------------------------
  // Public Builders: Single Topic Drills & Complete Exam Models (0 SVM!)
  // ---------------------------------------------------------------------------
  const TOPIC_BUILDERS = {
    CLUSTERING: buildClusteringExercise,
    SOM: buildSomExercise,
    MLP: buildMlpExercise,
    AG: buildAgExercise,
    NB: buildNbExercise,
    HOPFIELD: buildHopfieldExercise,
    KNN: buildKnnExercise
  };

  function buildTopicExercise(topicId, seed = 0, meta = {}) {
    const fn = TOPIC_BUILDERS[topicId];
    if (!fn) return null;
    return fn(seed, meta);
  }

  function buildExamModel(modelId, customSeed = 1) {
    if (modelId === "modelo_2025") {
      return {
        id: "modelo_2025",
        title: "Parcial Práctico Modelo 1 — Estilo 19/11/2025 (4 Ejercicios · Sin SVM)",
        subtitle: "Ponderación real 20% – 30% – 30% – 20%: Clustering, SOM, MLP (sigmoide sin momento) y Algoritmos Genéticos.",
        totalMinutes: 120,
        exercises: [
          buildClusteringExercise(0, { uid: "M25:E1", weight: 20, targetMinutes: 20, sourceTag: "Parcial Modelo 1 · Ej. 1 (20%)" }),
          buildSomExercise(0, { uid: "M25:E2", weight: 30, targetMinutes: 25, sourceTag: "Parcial Modelo 1 · Ej. 2 (30%)" }),
          buildMlpExercise(0, { uid: "M25:E3", weight: 30, targetMinutes: 35, sourceTag: "Parcial Modelo 1 · Ej. 3 (30%)" }),
          buildAgExercise(0, { uid: "M25:E4", weight: 20, targetMinutes: 25, sourceTag: "Parcial Modelo 1 · Ej. 4 (20%)" })
        ]
      };
    }

    if (modelId === "modelo_integrador") {
      return {
        id: "modelo_integrador",
        title: "Parcial Práctico Modelo 2 — Cobertura Integradora (4 Ejercicios · Sin SVM)",
        subtitle: "Esquema equitativo 25% c/u cubriendo Naïve Bayes Gaussiano, Hopfield (N=5), KNN Ponderado y MLP.",
        totalMinutes: 120,
        exercises: [
          buildNbExercise(0, { uid: "MINT:E1", weight: 25, targetMinutes: 25, sourceTag: "Parcial Modelo 2 · Ej. 1 (25%)" }),
          buildHopfieldExercise(0, { uid: "MINT:E2", weight: 25, targetMinutes: 20, sourceTag: "Parcial Modelo 2 · Ej. 2 (25%)" }),
          buildKnnExercise(0, { uid: "MINT:E3", weight: 25, targetMinutes: 25, sourceTag: "Parcial Modelo 2 · Ej. 3 (25%)" }),
          buildMlpExercise(2, { uid: "MINT:E4", weight: 25, targetMinutes: 35, sourceTag: "Parcial Modelo 2 · Ej. 4 (25%)" })
        ]
      };
    }

    // Random verified exam: 4 distinct topics from the 7 P2 practical topics
    const seedInt = Math.max(1, Number(customSeed) || 1);
    const rng = mulberry32(seedInt * 104729 + 3);
    const keys = Object.keys(TOPIC_BUILDERS);
    for (let i = keys.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [keys[i], keys[j]] = [keys[j], keys[i]];
    }
    const chosen = keys.slice(0, 4);
    const exercises = chosen.map((topicId, idx) =>
      buildTopicExercise(topicId, seedInt + idx * 17, {
        uid: `RAND_${seedInt}:E${idx + 1}`,
        weight: 25,
        targetMinutes: TOPIC_META[topicId].targetMinutes,
        sourceTag: `Parcial Aleatorio Semilla #${seedInt} · Ej. ${idx + 1} (25%)`
      })
    );

    return {
      id: `aleatorio_${seedInt}`,
      seed: seedInt,
      title: `Parcial Práctico Aleatorio Verificado (#${seedInt})`,
      subtitle: "4 temas distintos sorteados del temario vigente (sin SVM) con solución recalculada en vivo.",
      totalMinutes: 120,
      exercises
    };
  }

  return {
    TOPIC_META,
    roundN,
    fmt,
    fmtSigned,
    formatDuration,
    getPaceStatus,
    parseFlexibleNumber,
    parseVectorInput,
    normalizePairString,
    normalizeBitstring,
    evaluateField,
    evaluateStage,
    evaluateExercise,
    buildTopicExercise,
    buildExamModel
  };
});
