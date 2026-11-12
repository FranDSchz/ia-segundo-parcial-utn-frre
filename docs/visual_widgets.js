(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.VisualWidgets = factory();
  }
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const EXAM_TARGET_ISO = "2026-11-18T18:00:00-03:00";

  function escapeHtml(str) {
    return String(str === null || str === undefined ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function clamp(val, min, max) {
    return Math.max(min, Math.min(max, Number(val) || 0));
  }

  // ---------------------------------------------------------------------------
  // 1. Exam Countdown Helper (18/11/2026)
  // ---------------------------------------------------------------------------
  function getExamCountdownInfo(nowMs = Date.now()) {
    const targetMs = Date.parse(EXAM_TARGET_ISO);
    const diffMs = targetMs - nowMs;
    if (!Number.isFinite(diffMs)) {
      return { daysLeft: 0, hoursLeft: 0, label: "🎯 2do Parcial 18/11", urgencyCls: "" };
    }
    if (diffMs <= 0) {
      const daysPast = Math.floor(Math.abs(diffMs) / 86400000);
      if (daysPast === 0) {
        return { daysLeft: 0, hoursLeft: 0, label: "🎯 ¡Hoy es el 2do Parcial!", urgencyCls: "countdown-urgent" };
      }
      return { daysLeft: 0, hoursLeft: 0, label: "📘 Post 2do Parcial (Modo Finales)", urgencyCls: "" };
    }
    const totalHours = Math.ceil(diffMs / 3600000);
    const daysLeft = Math.floor(diffMs / 86400000);
    const remHours = Math.floor((diffMs % 86400000) / 3600000);
    if (daysLeft === 0) {
      return { daysLeft: 0, hoursLeft: totalHours, label: `⏳ Faltan ${Math.max(1, totalHours)}h para el Parcial`, urgencyCls: "countdown-urgent" };
    }
    return {
      daysLeft,
      hoursLeft: remHours,
      label: `⏳ Faltan ${daysLeft}d ${remHours}h al Parcial (18/11)`,
      urgencyCls: daysLeft <= 3 ? "countdown-urgent" : (daysLeft <= 7 ? "countdown-soon" : "")
    };
  }

  // ---------------------------------------------------------------------------
  // 2. Radial SVG Donut Ring & Count-up Animation
  // ---------------------------------------------------------------------------
  function renderRadialRingSvg({ pct = 0, size = 54, strokeWidth = 5, color = "var(--primary)", textColor = "var(--text-main)", centerText = null }) {
    const safePct = clamp(Math.round(pct), 0, 100);
    const r = (size - strokeWidth) / 2;
    const circ = +(2 * Math.PI * r).toFixed(2);
    const offset = +(circ * (1 - safePct / 100)).toFixed(2);
    const label = centerText !== null ? String(centerText) : `${safePct}%`;
    const fontSize = Math.max(10, Math.round(size * 0.23));

    return `
      <svg class="vw-radial-svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" aria-hidden="true">
        <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="var(--border-color)" stroke-width="${strokeWidth}" opacity="0.55" />
        <circle class="vw-radial-arc" cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none"
          stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round"
          stroke-dasharray="${circ}" stroke-dashoffset="${offset}"
          transform="rotate(-90 ${size / 2} ${size / 2})" />
        <text x="50%" y="52%" text-anchor="middle" dominant-baseline="middle"
          fill="${textColor}" font-size="${fontSize}" font-weight="800" class="vw-tabular">${escapeHtml(label)}</text>
      </svg>
    `;
  }

  function animateCountUp(el, targetVal, suffix = "%", duration = 480) {
    if (!el) return;
    const end = Math.round(Number(targetVal) || 0);
    const prefersReduced = typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || typeof requestAnimationFrame !== "function" || end <= 0) {
      el.textContent = `${end}${suffix}`;
      return;
    }
    const startMs = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - startMs) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = `${Math.round(end * eased)}${suffix}`;
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  // ---------------------------------------------------------------------------
  // 3. Progress Analytics Charts (Moodle Score Trend + Practical Pace vs Target)
  // ---------------------------------------------------------------------------
  function buildMoodleTrendChartSvg(quizHistory) {
    const recent = (Array.isArray(quizHistory) ? quizHistory : []).slice(0, 10).reverse();
    if (recent.length === 0) {
      return `
        <div class="vw-chart-empty">
          <div style="font-size:1.4rem;margin-bottom:0.25rem;">📈</div>
          <div>Aún no hay simulacros Moodle completados.</div>
          <div style="font-size:0.78rem;color:var(--text-muted);margin-top:0.2rem;">Cuando termines el primero verás tu curva hacia el 80% de promoción.</div>
        </div>
      `;
    }

    const W = 360;
    const H = 152;
    const padL = 32;
    const padR = 14;
    const padT = 14;
    const padB = 24;
    const plotW = W - padL - padR;
    const plotH = H - padT - padB;

    const yFor = (score) => padT + plotH * (1 - clamp(score, 0, 100) / 100);
    const xFor = (i) => recent.length === 1
      ? padL + plotW / 2
      : padL + (i / (recent.length - 1)) * plotW;

    const y80 = yFor(80).toFixed(1);
    const y60 = yFor(60).toFixed(1);

    const pts = recent.map((item, idx) => {
      const score = clamp(Number(item?.score || 0), 0, 100);
      return {
        x: +xFor(idx).toFixed(1),
        y: +yFor(score).toFixed(1),
        score,
        preset: String(item?.preset || "Simulacro")
      };
    });

    const linePoints = pts.map((p) => `${p.x},${p.y}`).join(" ");
    const areaPoints = pts.length >= 2
      ? `${pts[0].x},${padT + plotH} ${linePoints} ${pts[pts.length - 1].x},${padT + plotH}`
      : "";

    const dotsHtml = pts.map((p, idx) => {
      const fill = p.score >= 80 ? "var(--success)" : (p.score >= 60 ? "var(--primary)" : "var(--warning)");
      return `
        <g class="vw-chart-dot-group">
          <circle cx="${p.x}" cy="${p.y}" r="4.5" fill="${fill}" stroke="var(--bg-card)" stroke-width="2">
            <title>#${idx + 1} (${escapeHtml(p.preset)}): ${p.score}%</title>
          </circle>
          <text x="${p.x}" y="${Math.max(11, p.y - 8)}" text-anchor="middle" font-size="9.5" font-weight="700" fill="var(--text-main)">${p.score}%</text>
          <text x="${p.x}" y="${H - 6}" text-anchor="middle" font-size="9" fill="var(--text-muted)">#${idx + 1}</text>
        </g>
      `;
    }).join("");

    return `
      <svg class="vw-svg-chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Curva de puntajes en simulacros Moodle">
        <defs>
          <linearGradient id="vwScoreAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="var(--primary)" stop-opacity="0.28" />
            <stop offset="100%" stop-color="var(--primary)" stop-opacity="0.02" />
          </linearGradient>
        </defs>
        <line x1="${padL}" y1="${padT + plotH}" x2="${W - padR}" y2="${padT + plotH}" stroke="var(--border-color)" stroke-width="1" />
        <line x1="${padL}" y1="${y80}" x2="${W - padR}" y2="${y80}" stroke="var(--success)" stroke-width="1" stroke-dasharray="4 3" opacity="0.7" />
        <text x="${padL - 4}" y="${Number(y80) + 3}" text-anchor="end" font-size="8.5" font-weight="700" fill="var(--success)">80%</text>
        <line x1="${padL}" y1="${y60}" x2="${W - padR}" y2="${y60}" stroke="var(--warning)" stroke-width="1" stroke-dasharray="4 3" opacity="0.7" />
        <text x="${padL - 4}" y="${Number(y60) + 3}" text-anchor="end" font-size="8.5" font-weight="700" fill="var(--warning)">60%</text>
        ${areaPoints ? `<polygon points="${areaPoints}" fill="url(#vwScoreAreaGrad)" />` : ""}
        ${pts.length >= 2 ? `<polyline fill="none" stroke="var(--primary)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" points="${linePoints}" />` : ""}
        ${dotsHtml}
      </svg>
    `;
  }

  function buildPracticalPaceChartHtml(practicalAttempts, topicMeta) {
    const attempts = Array.isArray(practicalAttempts) ? practicalAttempts : [];
    const meta = topicMeta || (typeof window !== "undefined" && window.PracticalEngine ? window.PracticalEngine.TOPIC_META : null) || {};
    const keys = Object.keys(meta);

    if (attempts.length === 0) {
      return `
        <div class="vw-chart-empty">
          <div style="font-size:1.4rem;margin-bottom:0.25rem;">⏱️</div>
          <div>Sin splits cronometrados todavía.</div>
          <div style="font-size:0.78rem;color:var(--text-muted);margin:0.2rem 0 0.6rem;">Resolvé un ejercicio en Parciales Prácticos para comparar tu velocidad contra el tiempo ideal de cátedra.</div>
          <button type="button" class="btn btn-outline btn-sm" onclick="app.openTimedPracticalMode()">Ir a Parciales Prácticos</button>
        </div>
      `;
    }

    const byTopic = {};
    attempts.forEach((a) => {
      if (!a || !a.topic) return;
      if (!byTopic[a.topic]) byTopic[a.topic] = { sumSec: 0, count: 0, sumScore: 0 };
      byTopic[a.topic].sumSec += Number(a.elapsedSec || 0);
      byTopic[a.topic].sumScore += Number(a.scorePct || 0);
      byTopic[a.topic].count += 1;
    });

    const activeKeys = keys.filter((k) => byTopic[k]);
    const rows = activeKeys.map((tid) => {
      const m = meta[tid];
      const st = byTopic[tid];
      const avgMin = st.sumSec / 60 / st.count;
      const targetMin = m.targetMinutes || 25;
      const maxAxis = Math.max(targetMin * 1.25, avgMin * 1.15, 35);
      const barPct = clamp(Math.round((avgMin / maxAxis) * 100), 4, 100);
      const targetPct = clamp(Math.round((targetMin / maxAxis) * 100), 5, 96);
      const ratio = avgMin / targetMin;
      const barCls = ratio <= 0.85 ? "var(--success)" : (ratio <= 1.1 ? "var(--warning)" : "var(--danger)");
      const avgScore = Math.round(st.sumScore / st.count);

      return `
        <div class="vw-pace-row">
          <div class="vw-pace-head">
            <span><strong>${escapeHtml(tid)}</strong> <span style="color:var(--text-muted);font-weight:500;">(${st.count}x · ${avgScore}%)</span></span>
            <span class="vw-tabular"><strong>${avgMin.toFixed(1)}m</strong> / ${targetMin}m obj.</span>
          </div>
          <div class="vw-pace-track">
            <div class="vw-pace-fill" style="width:${barPct}%;background:${barCls};"></div>
            <div class="vw-pace-target-mark" style="left:${targetPct}%;" title="Objetivo cátedra: ${targetMin} min"></div>
          </div>
        </div>
      `;
    }).join("");

    return `<div class="vw-pace-list">${rows}</div>`;
  }

  const RADAR_TOPIC_SPECS = [
    { id: "CLUSTERING", label: "Clustering", theoryKey: "CLUSTERING", labKey: "CLUSTERING", pracKey: "CLUSTERING" },
    { id: "SOM", label: "SOM", theoryKey: "SOM", labKey: "SOM", pracKey: "SOM" },
    { id: "MLP", label: "MLP", theoryKey: "MLP", labKey: "MLP_PERCEPTRON", pracKey: "MLP" },
    { id: "AG", label: "Genéticos", theoryKey: "ALGORITMOS_GENETICOS", labKey: "ALGORITMOS_GENETICOS", pracKey: "AG" },
    { id: "NB", label: "Naïve Bayes", theoryKey: "NAIVE_BAYES", labKey: "NAIVE_BAYES", pracKey: "NB" },
    { id: "HOPFIELD", label: "Hopfield", theoryKey: "HOPFIELD", labKey: "HOPFIELD", pracKey: "HOPFIELD" },
    { id: "KNN", label: "KNN", theoryKey: "KNN", labKey: "KNN", pracKey: "KNN" }
  ];

  function buildTopicRadarChartSvg({ summary, practicalAttempts }) {
    const byTopicTheory = (summary && summary.byTopic) || {};
    const labByTopic = (summary && summary.lab && summary.lab.byTopic) || {};
    const attempts = Array.isArray(practicalAttempts) ? practicalAttempts : [];

    // Aggregate best / latest timed practice average score per topic
    const pracBestByTopic = {};
    attempts.forEach((a) => {
      if (!a || !a.topic) return;
      const pct = Number(a.scorePct);
      if (!Number.isFinite(pct)) return;
      if (!pracBestByTopic[a.topic] || pct > pracBestByTopic[a.topic]) {
        pracBestByTopic[a.topic] = clamp(pct, 0, 100);
      }
    });

    const axes = RADAR_TOPIC_SPECS.map((spec, idx) => {
      const th = byTopicTheory[spec.theoryKey];
      let theoryPct = 0;
      if (th && Number(th.total) > 0) {
        const mastered = Number(th.mastered || 0);
        const learning = Number(th.learning || 0);
        theoryPct = clamp(Math.round(((mastered + learning * 0.45) / th.total) * 100), 0, 100);
      }

      const lb = labByTopic[spec.labKey];
      let labPct = 0;
      if (lb && Number(lb.stepsTotal) > 0) {
        labPct = clamp(Math.round((Number(lb.stepsDone || 0) / lb.stepsTotal) * 100), 0, 100);
      }

      const timedBest = pracBestByTopic[spec.pracKey];
      const practicePct = Number.isFinite(timedBest)
        ? clamp(Math.round(labPct > 0 ? labPct * 0.5 + timedBest * 0.5 : timedBest), 0, 100)
        : labPct;

      return {
        idx,
        label: spec.label,
        theoryPct,
        practicePct
      };
    });

    const hasAnyData = axes.some((a) => a.theoryPct > 0 || a.practicePct > 0);
    const W = 380;
    const H = 264;
    const cx = 190;
    const cy = 132;
    const R = 82;
    const N = axes.length;

    const ptFor = (i, pct) => {
      const ang = -Math.PI / 2 + (2 * Math.PI * i) / N;
      const rad = (clamp(pct, 0, 100) / 100) * R;
      return {
        x: Number((cx + rad * Math.cos(ang)).toFixed(1)),
        y: Number((cy + rad * Math.sin(ang)).toFixed(1))
      };
    };

    const ringsHtml = [25, 50, 75, 100].map((lvl) => {
      const pts = axes.map((_, i) => {
        const p = ptFor(i, lvl);
        return `${p.x},${p.y}`;
      }).join(" ");
      return `<polygon points="${pts}" fill="none" stroke="var(--border-color)" stroke-width="1" stroke-dasharray="${lvl === 100 ? "none" : "3 3"}" opacity="${lvl === 100 ? "0.9" : "0.65"}" />`;
    }).join("");

    const spokesHtml = axes.map((a, i) => {
      const outer = ptFor(i, 100);
      const ang = -Math.PI / 2 + (2 * Math.PI * i) / N;
      const lblR = R + 21;
      const lx = Number((cx + lblR * Math.cos(ang)).toFixed(1));
      const ly = Number((cy + lblR * Math.sin(ang)).toFixed(1));
      const cosA = Math.cos(ang);
      const anchor = cosA > 0.25 ? "start" : (cosA < -0.25 ? "end" : "middle");
      const dy = Math.sin(ang) > 0.7 ? "8" : (Math.sin(ang) < -0.7 ? "-2" : "3");
      return `
        <line x1="${cx}" y1="${cy}" x2="${outer.x}" y2="${outer.y}" stroke="var(--border-color)" stroke-width="1" opacity="0.7" />
        <text x="${lx}" y="${ly}" dy="${dy}" text-anchor="${anchor}" font-size="10" font-weight="700" fill="var(--text-main)">${escapeHtml(a.label)}</text>
      `;
    }).join("");

    const polyPoints = (field) => axes.map((a, i) => {
      const p = ptFor(i, a[field]);
      return `${p.x},${p.y}`;
    }).join(" ");

    const dotsFor = (field, color, labelName) => axes.map((a, i) => {
      const p = ptFor(i, a[field]);
      return `<circle cx="${p.x}" cy="${p.y}" r="3.2" fill="${color}" stroke="var(--bg-card)" stroke-width="1.3"><title>${escapeHtml(a.label)} · ${labelName}: ${a[field]}%</title></circle>`;
    }).join("");

    const ringScaleLabels = `
      <text x="${cx + 4}" y="${cy - R * 0.5 + 3}" font-size="8" font-weight="700" fill="var(--text-muted)">50%</text>
      <text x="${cx + 4}" y="${cy - R + 3}" font-size="8" font-weight="700" fill="var(--text-muted)">100%</text>
    `;

    const weakest = axes.slice().sort((a, b) => (a.theoryPct + a.practicePct) - (b.theoryPct + b.practicePct))[0];
    const weakestSpec = weakest ? RADAR_TOPIC_SPECS[weakest.idx] : null;
    const breakdownHtml = axes.map((a) => `
      <div class="vw-radar-chip">
        <div class="vw-radar-chip-head">
          <span>${escapeHtml(a.label)}</span>
          <span class="vw-tabular" style="color:var(--text-muted);">${a.theoryPct}% / ${a.practicePct}%</span>
        </div>
        <div class="vw-radar-dual-bar">
          <div class="vw-radar-mini-track"><div class="vw-radar-mini-fill" style="width:${a.theoryPct}%;background:var(--primary);"></div></div>
          <div class="vw-radar-mini-track"><div class="vw-radar-mini-fill" style="width:${a.practicePct}%;background:var(--success);"></div></div>
        </div>
      </div>
    `).join("");

    return `
      <div class="vw-radar-box">
        <svg class="vw-svg-chart vw-radar-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Mapa radar de dominio en los 7 temas del Segundo Parcial">
          ${ringsHtml}
          ${spokesHtml}
          ${ringScaleLabels}
          ${hasAnyData ? `
            <polygon points="${polyPoints("theoryPct")}" fill="rgba(59, 130, 246, 0.20)" stroke="var(--primary)" stroke-width="2" stroke-linejoin="round" />
            <polygon points="${polyPoints("practicePct")}" fill="rgba(16, 185, 129, 0.20)" stroke="var(--success)" stroke-width="2" stroke-linejoin="round" />
            ${dotsFor("theoryPct", "var(--primary)", "Teoría")}
            ${dotsFor("practicePct", "var(--success)", "Práctica")}
          ` : `
            <text x="${cx}" y="${cy + 3}" text-anchor="middle" font-size="10.5" font-weight="700" fill="var(--text-muted)">Respondé preguntas o guías para poblar tu radar</text>
          `}
        </svg>
        <div class="vw-radar-legend">
          <span class="vw-legend-item"><span class="vw-legend-swatch" style="background:var(--primary);"></span>Teoría (Anki SM-2)</span>
          <span class="vw-legend-item"><span class="vw-legend-swatch" style="background:var(--success);"></span>Práctica (Guías + Cronometrados)</span>
        </div>
        <div class="vw-radar-breakdown">${breakdownHtml}</div>
        ${weakest && weakestSpec ? `
          <div class="vw-radar-alert">
            <span>🎯 <strong>Brecha prioritaria:</strong> ${escapeHtml(weakest.label)} (Teoría ${weakest.theoryPct}% · Práctica ${weakest.practicePct}%)</span>
            <button type="button" class="btn btn-outline btn-sm" onclick="app.selectLabTopic('${escapeHtml(weakestSpec.labKey)}'); app.navigate('lab');">Reforzar en Práctica →</button>
          </div>
        ` : ""}
      </div>
    `;
  }

  function renderProgressChartsHtml({ quizHistory, practicalAttempts, topicMeta, summary }) {
    return `
      <div class="vw-charts-header">
        <div>
          <h3 style="margin:0;">📈 Analítica Visual de Rendimiento</h3>
          <p style="margin:0.15rem 0 0;font-size:0.82rem;color:var(--text-muted);">Tendencia reciente en simulacros Moodle, velocidad por ejercicio y equilibrio Teoría vs. Práctica en los 7 temas del P2.</p>
        </div>
      </div>
      <div class="vw-charts-grid">
        <div class="vw-chart-panel">
          <div class="vw-chart-title">Tendencia Simulacros Moodle (últimos 10)</div>
          ${buildMoodleTrendChartSvg(quizHistory)}
        </div>
        <div class="vw-chart-panel">
          <div class="vw-chart-title">Velocidad Práctica vs. Objetivo (línea punteada)</div>
          ${buildPracticalPaceChartHtml(practicalAttempts, topicMeta)}
        </div>
        <div class="vw-chart-panel vw-chart-panel-wide">
          <div class="vw-chart-title">Radar 7 Temas del 2do Parcial · Teoría vs. Práctica</div>
          ${buildTopicRadarChartSvg({ summary, practicalAttempts })}
        </div>
      </div>
    `;
  }

  // ---------------------------------------------------------------------------
  // 4. Interactive Step-by-Step Animated Visualizers for #lab Guides (SVG)
  // ---------------------------------------------------------------------------
  const VISUALIZER_SPECS = {
    MLP_PERCEPTRON: {
      title: "Red MLP 2×2×1 — Forward & Backprop Sigmoide",
      subtitle: "Seguí el flujo de señales azules (Forward) y gradientes δ ámbar (Backward sin momento).",
      steps: [
        {
          label: "1. Pesos",
          comment: "Inicializo pesos pequeños y sesgos b en oculta y salida.",
          renderSvg: () => renderMlpSvg({ phase: "init" })
        },
        {
          label: "2. Forward Oculta",
          comment: "Calculo net_h = Σ w·x + b y aplico σ(net) hacia las neuronas ocultas.",
          renderSvg: () => renderMlpSvg({ phase: "fwd_hidden" })
        },
        {
          label: "3. Salida y Error",
          comment: "Calculo o_y = σ(net_y) y comparo con la salida deseada d.",
          renderSvg: () => renderMlpSvg({ phase: "fwd_out" })
        },
        {
          label: "4. Backward δ",
          comment: "Retropropago el error multiplicando por derivada sigmoidal o(1−o).",
          renderSvg: () => renderMlpSvg({ phase: "backward" })
        },
        {
          label: "5. Actualizar W",
          comment: "Ajusto w_nuevo = w + α · δ · entrada (sin momento en 2026).",
          renderSvg: () => renderMlpSvg({ phase: "update" })
        }
      ]
    },
    SOM: {
      title: "SOM Kohonen — Competencia y Vecindad Continua",
      subtitle: "Mirá cómo la BMU y sus vecinas se desplazan hacia p1 para formar W(1) antes de evaluar p2.",
      steps: [
        {
          label: "1. Distancias p1",
          comment: "Mido la distancia euclídea entre p1 y los pesos iniciales W(0).",
          renderSvg: () => renderSomSvg({ step: 0 })
        },
        {
          label: "2. Ganadora BMU",
          comment: "Elijo N2 como BMU (menor distancia) y trazo la vecindad continua h = 1/(1+d).",
          renderSvg: () => renderSomSvg({ step: 1 })
        },
        {
          label: "3. Ajuste W(1)",
          comment: "Muevo N2 completo (h=1) y a sus vecinas en proporción a α·h hacia p1.",
          renderSvg: () => renderSomSvg({ step: 2 })
        },
        {
          label: "4. Evaluar p2",
          comment: "Uso siempre W(1) actualizado (no W(0)) para encontrar la BMU de p2.",
          renderSvg: () => renderSomSvg({ step: 3 })
        }
      ]
    },
    CLUSTERING: {
      title: "Clustering Jerárquico — Fusión y Dendrograma UPGMA",
      subtitle: "Cada mínimo de la matriz une dos clusters y dibuja su rama a altura exacta d_k.",
      steps: [
        {
          label: "1. Puntos iniciales",
          comment: "Parto con 5 clusters individuales {A}, {B}, {C}, {D}, {E}.",
          renderSvg: () => renderClusteringSvg({ step: 0 })
        },
        {
          label: "2. 1ra Fusión (C,E)",
          comment: "Busco el mínimo d(C,E)=1.40 y recalculo distancias por pares UPGMA.",
          renderSvg: () => renderClusteringSvg({ step: 1 })
        },
        {
          label: "3. 2da Fusión (A,D)",
          comment: "El menor valor en D1 une {A,D} a altura d2=2.10.",
          renderSvg: () => renderClusteringSvg({ step: 2 })
        },
        {
          label: "4. Ponderar |C1|·|C2|",
          comment: "Al unir tamaños distintos, promedio todos los pares divididos por |C1|·|C2|.",
          renderSvg: () => renderClusteringSvg({ step: 3 })
        }
      ]
    },
    HOPFIELD: {
      title: "Hopfield N=5 — Recuperación y Energía de Lyapunov",
      subtitle: "Con w_ii = 0 en diagonal, la red iterativamente alinea cada bit hasta el atractor.",
      steps: [
        {
          label: "1. Matriz Hebb",
          comment: "Armo W = Σ E_k E_k^T con diagonal w_ii = 0 obligatorio.",
          renderSvg: () => renderHopfieldSvg({ step: 0 })
        },
        {
          label: "2. Entrada con ruido",
          comment: "Presento el patrón corrupto (1 bit invertido) y calculo net_i = Σ w_ij·s_j.",
          renderSvg: () => renderHopfieldSvg({ step: 1 })
        },
        {
          label: "3. Regla de signo",
          comment: "Actualizo s_i = +1 si net>0, −1 si net<0, y conservo s_i si net=0.",
          renderSvg: () => renderHopfieldSvg({ step: 2 })
        },
        {
          label: "4. Energía mínima",
          comment: "Verifico convergencia: la energía E = −½ s^T W s desciende al atractor.",
          renderSvg: () => renderHopfieldSvg({ step: 3 })
        }
      ]
    },
    ALGORITMOS_GENETICOS: {
      title: "Algoritmos Genéticos — Ruleta [00–99] y Cruza",
      subtitle: "Probabilidad acumulada asigna rangos enteros; luego el punto de corte intercambia bloques.",
      steps: [
        {
          label: "1. Ruleta [00-99]",
          comment: "Calculo p_i = f_i / Σf y asigno rangos acumulados continuos de 00 a 99.",
          renderSvg: () => renderAgSvg({ step: 0 })
        },
        {
          label: "2. Sorteo r1, r2",
          comment: "Ubico cada número aleatorio en su intervalo y tomo parte entera + mayor resto.",
          renderSvg: () => renderAgSvg({ step: 1 })
        },
        {
          label: "3. Cruza Simple/Múltiple",
          comment: "Divido padres en puntos de corte e intercambio segmentos para generar hijos.",
          renderSvg: () => renderAgSvg({ step: 2 })
        }
      ]
    },
    KNN: {
      title: "KNN Ponderado (1/d²) vs. Mayoría Simple",
      subtitle: "Mirá cómo un único vecino muy cercano puede revertir el empate o mayoría simple.",
      steps: [
        {
          label: "1. Medir d(q, x_i)",
          comment: "Calculo distancias desde la consulta q hacia cada punto rotulado.",
          renderSvg: () => renderKnnSvg({ step: 0 })
        },
        {
          label: "2. Tomar k=3 vecinos",
          comment: "Encierro los k=3 más cercanos: por mayoría simple gana Clase B (2 vs 1).",
          renderSvg: () => renderKnnSvg({ step: 1 })
        },
        {
          label: "3. Ponderar 1/d²",
          comment: "Como el vecino A está pegado a q, su peso w=1/d² domina y revierte a Clase A.",
          renderSvg: () => renderKnnSvg({ step: 2 })
        }
      ]
    },
    NAIVE_BAYES: {
      title: "Naïve Bayes — Verosimilitud Gaussiana & MAP",
      subtitle: "Evaluamos las campanas N(μ, σ²) en x* y normalizamos las verosimilitudes por clase.",
      steps: [
        {
          label: "1. Curvas N(μ,σ²)",
          comment: "Grafico la densidad normal de cada clase C1 y C2 según su media y desvío.",
          renderSvg: () => renderNbSvg({ step: 0 })
        },
        {
          label: "2. Evaluar en x*",
          comment: "Calculo P(x*|C_k) multiplicado por el prior P(C_k) bajo independencia.",
          renderSvg: () => renderNbSvg({ step: 1 })
        },
        {
          label: "3. Normalizar MAP",
          comment: "Divido cada score por la evidencia total para obtener P(C_k|x*) ∈ [0,1].",
          renderSvg: () => renderNbSvg({ step: 2 })
        }
      ]
    }
  };

  function renderMlpSvg({ phase }) {
    const isFwdH = phase === "fwd_hidden";
    const isFwdY = phase === "fwd_out";
    const isBack = phase === "backward";
    const isUpd = phase === "update";

    const edgeColor1 = isFwdH ? "var(--primary)" : (isBack ? "var(--warning)" : (isUpd ? "var(--success)" : "var(--border-color)"));
    const edgeColor2 = isFwdY ? "var(--primary)" : (isBack ? "var(--warning)" : (isUpd ? "var(--success)" : "var(--border-color)"));
    const cls1 = isFwdH ? "vw-edge-flow" : (isBack ? "vw-edge-flow-rev" : "");
    const cls2 = isFwdY ? "vw-edge-flow" : (isBack ? "vw-edge-flow-rev" : "");

    const nodeFill = (active, color = "var(--primary)") => active ? color : "var(--bg-subtle)";
    const nodeText = (active) => active ? "#ffffff" : "var(--text-main)";

    return `
      <svg viewBox="0 0 460 180" class="vw-algo-svg" role="img" aria-label="Animación MLP 2x2x1">
        <g stroke-width="${isFwdH || isBack || isUpd ? 2.6 : 1.7}">
          <line x1="85" y1="52" x2="215" y2="52" stroke="${edgeColor1}" class="${cls1}" />
          <line x1="85" y1="52" x2="215" y2="128" stroke="${edgeColor1}" class="${cls1}" />
          <line x1="85" y1="128" x2="215" y2="52" stroke="${edgeColor1}" class="${cls1}" />
          <line x1="85" y1="128" x2="215" y2="128" stroke="${edgeColor1}" class="${cls1}" />
          <line x1="245" y1="52" x2="375" y2="90" stroke="${edgeColor2}" class="${cls2}" />
          <line x1="245" y1="128" x2="375" y2="90" stroke="${edgeColor2}" class="${cls2}" />
        </g>
        <g>
          <circle cx="70" cy="52" r="17" fill="${nodeFill(phase === "init" || isFwdH)}" stroke="var(--primary)" stroke-width="2" />
          <text x="70" y="56" text-anchor="middle" font-size="11" font-weight="700" fill="${nodeText(phase === "init" || isFwdH)}">x₁</text>
          <circle cx="70" cy="128" r="17" fill="${nodeFill(phase === "init" || isFwdH)}" stroke="var(--primary)" stroke-width="2" />
          <text x="70" y="132" text-anchor="middle" font-size="11" font-weight="700" fill="${nodeText(phase === "init" || isFwdH)}">x₂</text>

          <circle cx="230" cy="52" r="18" fill="${nodeFill(isFwdH || isBack, isBack ? "var(--warning)" : "var(--primary)")}" stroke="var(--primary)" stroke-width="2" />
          <text x="230" y="56" text-anchor="middle" font-size="11" font-weight="700" fill="${nodeText(isFwdH || isBack)}">h₁</text>
          <circle cx="230" cy="128" r="18" fill="${nodeFill(isFwdH || isBack, isBack ? "var(--warning)" : "var(--primary)")}" stroke="var(--primary)" stroke-width="2" />
          <text x="230" y="132" text-anchor="middle" font-size="11" font-weight="700" fill="${nodeText(isFwdH || isBack)}">h₂</text>

          <circle cx="390" cy="90" r="20" fill="${nodeFill(isFwdY || isBack || isUpd, isBack ? "var(--warning)" : (isUpd ? "var(--success)" : "var(--primary)"))}" stroke="var(--primary)" stroke-width="2" />
          <text x="390" y="94" text-anchor="middle" font-size="12" font-weight="800" fill="${nodeText(isFwdY || isBack || isUpd)}">o_y</text>
        </g>
        <text x="70" y="166" text-anchor="middle" font-size="10" fill="var(--text-muted)">Entrada</text>
        <text x="230" y="166" text-anchor="middle" font-size="10" fill="var(--text-muted)">Oculta σ(net)</text>
        <text x="390" y="166" text-anchor="middle" font-size="10" fill="var(--text-muted)">Salida vs d</text>
      </svg>
    `;
  }

  function renderSomSvg({ step }) {
    const moved = step >= 2;
    const evalP2 = step >= 3;
    const n1 = moved ? { x: 112, y: 58 } : { x: 96, y: 48 };
    const n2 = moved ? { x: 215, y: 88 } : { x: 190, y: 92 };
    const n3 = moved ? { x: 318, y: 122 } : { x: 330, y: 132 };
    const p1 = { x: 235, y: 85 };
    const p2 = { x: 325, y: 108 };

    return `
      <svg viewBox="0 0 460 180" class="vw-algo-svg" role="img" aria-label="Animación SOM Kohonen">
        <line x1="${n1.x}" y1="${n1.y}" x2="${n2.x}" y2="${n2.y}" stroke="var(--border-color)" stroke-width="2" />
        <line x1="${n2.x}" y1="${n2.y}" x2="${n3.x}" y2="${n3.y}" stroke="var(--border-color)" stroke-width="2" />
        ${step === 0 ? `
          <line x1="${p1.x}" y1="${p1.y}" x2="${n1.x}" y2="${n1.y}" stroke="var(--primary)" stroke-dasharray="4 3" opacity="0.65" />
          <line x1="${p1.x}" y1="${p1.y}" x2="${n2.x}" y2="${n2.y}" stroke="var(--success)" stroke-width="2" stroke-dasharray="4 3" />
          <line x1="${p1.x}" y1="${p1.y}" x2="${n3.x}" y2="${n3.y}" stroke="var(--primary)" stroke-dasharray="4 3" opacity="0.65" />
        ` : ""}
        ${step === 1 || step === 2 ? `
          <circle cx="${n2.x}" cy="${n2.y}" r="42" fill="var(--primary-light)" stroke="var(--primary)" stroke-dasharray="4 3" class="vw-pulse-ring" />
        ` : ""}
        ${evalP2 ? `
          <line x1="${p2.x}" y1="${p2.y}" x2="${n3.x}" y2="${n3.y}" stroke="var(--success)" stroke-width="2.2" />
        ` : ""}
        <g>
          <circle cx="${n1.x}" cy="${n1.y}" r="14" fill="var(--bg-subtle)" stroke="var(--primary)" stroke-width="2" />
          <text x="${n1.x}" y="${n1.y + 4}" text-anchor="middle" font-size="10" font-weight="700" fill="var(--text-main)">N1</text>
          <circle cx="${n2.x}" cy="${n2.y}" r="15" fill="${step >= 1 ? "var(--primary)" : "var(--bg-subtle)"}" stroke="var(--primary)" stroke-width="2" />
          <text x="${n2.x}" y="${n2.y + 4}" text-anchor="middle" font-size="10" font-weight="700" fill="${step >= 1 ? "#fff" : "var(--text-main)"}">N2</text>
          <circle cx="${n3.x}" cy="${n3.y}" r="14" fill="${evalP2 ? "var(--success)" : "var(--bg-subtle)"}" stroke="${evalP2 ? "var(--success)" : "var(--primary)"}" stroke-width="2" />
          <text x="${n3.x}" y="${n3.y + 4}" text-anchor="middle" font-size="10" font-weight="700" fill="${evalP2 ? "#fff" : "var(--text-main)"}">N3</text>
        </g>
        <g>
          <polygon points="${p1.x},${p1.y - 7} ${p1.x + 7},${p1.y + 6} ${p1.x - 7},${p1.y + 6}" fill="var(--warning)" />
          <text x="${p1.x + 12}" y="${p1.y + 4}" font-size="10" font-weight="700" fill="var(--warning)">p1</text>
          ${evalP2 ? `
            <polygon points="${p2.x},${p2.y - 7} ${p2.x + 7},${p2.y + 6} ${p2.x - 7},${p2.y + 6}" fill="var(--danger)" />
            <text x="${p2.x + 12}" y="${p2.y + 4}" font-size="10" font-weight="700" fill="var(--danger)">p2 (usa W(1))</text>
          ` : ""}
        </g>
      </svg>
    `;
  }

  function renderClusteringSvg({ step }) {
    return `
      <svg viewBox="0 0 460 180" class="vw-algo-svg" role="img" aria-label="Animación Clustering UPGMA">
        <text x="105" y="18" text-anchor="middle" font-size="10.5" font-weight="700" fill="var(--text-muted)">Espacio 2D</text>
        <text x="340" y="18" text-anchor="middle" font-size="10.5" font-weight="700" fill="var(--text-muted)">Dendrograma</text>
        <line x1="215" y1="15" x2="215" y2="168" stroke="var(--border-color)" stroke-dasharray="3 3" />
        ${step >= 1 ? `<ellipse cx="145" cy="122" rx="30" ry="18" fill="var(--primary-light)" stroke="var(--primary)" stroke-width="1.8" />` : ""}
        ${step >= 2 ? `<ellipse cx="62" cy="56" rx="28" ry="20" fill="var(--success-bg)" stroke="var(--success)" stroke-width="1.8" />` : ""}
        ${step >= 3 ? `<ellipse cx="128" cy="108" rx="54" ry="42" fill="none" stroke="var(--warning)" stroke-width="1.8" stroke-dasharray="4 3" />` : ""}
        <g font-size="10" font-weight="700">
          <circle cx="50" cy="48" r="10" fill="var(--bg-subtle)" stroke="var(--primary)" /><text x="50" y="52" text-anchor="middle" fill="var(--text-main)">A</text>
          <circle cx="74" cy="64" r="10" fill="var(--bg-subtle)" stroke="var(--primary)" /><text x="74" y="68" text-anchor="middle" fill="var(--text-main)">D</text>
          <circle cx="110" cy="84" r="10" fill="var(--bg-subtle)" stroke="var(--primary)" /><text x="110" y="88" text-anchor="middle" fill="var(--text-main)">B</text>
          <circle cx="134" cy="124" r="10" fill="var(--bg-subtle)" stroke="var(--primary)" /><text x="134" y="128" text-anchor="middle" fill="var(--text-main)">C</text>
          <circle cx="156" cy="120" r="10" fill="var(--bg-subtle)" stroke="var(--primary)" /><text x="156" y="124" text-anchor="middle" fill="var(--text-main)">E</text>
        </g>
        <g font-size="10" font-weight="700" fill="var(--text-main)" text-anchor="middle">
          <text x="255" y="162">A</text><text x="295" y="162">D</text><text x="335" y="162">B</text><text x="375" y="162">C</text><text x="415" y="162">E</text>
        </g>
        <g fill="none" stroke-width="2.2">
          ${step >= 1 ? `<path d="M375,148 V120 H415 V148" stroke="var(--primary)" class="vw-draw-line" />` : ""}
          ${step >= 2 ? `<path d="M255,148 V104 H295 V148" stroke="var(--success)" class="vw-draw-line" />` : ""}
          ${step >= 3 ? `<path d="M335,148 V78 H395 V120" stroke="var(--warning)" class="vw-draw-line" /><path d="M275,104 V42 H365 V78" stroke="var(--text-muted)" class="vw-draw-line" />` : ""}
        </g>
      </svg>
    `;
  }

  function renderHopfieldSvg({ step }) {
    const bitsIn = [1, -1, 1, -1, 1];
    const bitsNoisy = [1, -1, -1, -1, 1];
    const shown = step === 1 ? bitsNoisy : bitsIn;
    const angles = [0, 1, 2, 3, 4].map((k) => -Math.PI / 2 + (k * 2 * Math.PI) / 5);
    const pts = angles.map((a) => ({ x: +(135 + 56 * Math.cos(a)).toFixed(1), y: +(94 + 56 * Math.sin(a)).toFixed(1) }));
    const edges = [];
    for (let i = 0; i < 5; i++) {
      for (let j = i + 1; j < 5; j++) {
        edges.push(`<line x1="${pts[i].x}" y1="${pts[i].y}" x2="${pts[j].x}" y2="${pts[j].y}" stroke="var(--border-color)" stroke-width="${step === 2 ? 1.8 : 1.1}" opacity="${step >= 1 ? 0.85 : 0.4}" />`);
      }
    }
    const energy = step === 1 ? -2.0 : -6.0;
    const eBar = step === 1 ? 35 : 85;
    return `
      <svg viewBox="0 0 460 180" class="vw-algo-svg" role="img" aria-label="Animación Hopfield N=5">
        ${edges.join("")}
        ${pts.map((p, idx) => {
          const corrupted = step === 1 && idx === 2;
          const fill = corrupted ? "var(--danger)" : (shown[idx] > 0 ? "var(--primary)" : "var(--bg-subtle)");
          const fg = (corrupted || shown[idx] > 0) ? "#ffffff" : "var(--text-main)";
          return `<circle cx="${p.x}" cy="${p.y}" r="14" fill="${fill}" stroke="var(--primary)" stroke-width="2" />
            <text x="${p.x}" y="${p.y + 4}" text-anchor="middle" font-size="10" font-weight="800" fill="${fg}">${shown[idx] > 0 ? "+1" : "-1"}</text>`;
        }).join("")}
        <text x="335" y="42" text-anchor="middle" font-size="11" font-weight="800" fill="var(--text-main)">Energía de Lyapunov E(s)</text>
        <rect x="255" y="60" width="160" height="18" rx="9" fill="var(--bg-subtle)" stroke="var(--border-color)" />
        <rect x="255" y="60" width="${Math.round(1.6 * eBar)}" height="18" rx="9" fill="${step === 1 ? "var(--warning)" : "var(--success)"}" />
        <text x="335" y="102" text-anchor="middle" font-size="11" font-weight="700" fill="var(--text-muted)">E = ${energy.toFixed(1)} (${step === 1 ? "Estado excitado" : "Mínimo atractor"})</text>
        <text x="335" y="132" text-anchor="middle" font-size="10" fill="var(--primary)">Diagonal w_ii = 0 · Si net_i = 0 conserva s_i(t)</text>
      </svg>
    `;
  }

  function renderAgSvg({ step }) {
    const deg = step >= 1 ? 215 : 20;
    return `
      <svg viewBox="0 0 460 180" class="vw-algo-svg" role="img" aria-label="Animación Algoritmos Genéticos">
        <g transform="translate(95 92)">
          <circle r="56" fill="var(--primary-light)" stroke="var(--primary)" stroke-width="2" />
          <path d="M0,0 L0,-56 A56,56 0 0,1 52,-20 Z" fill="var(--success)" opacity="0.45" />
          <path d="M0,0 L52,-20 A56,56 0 0,1 18,53 Z" fill="var(--warning)" opacity="0.45" />
          <g transform="rotate(${deg})" style="transition:transform 0.6s ease;">
            <line x1="0" y1="0" x2="0" y2="-48" stroke="var(--danger)" stroke-width="3" stroke-linecap="round" />
            <circle r="5" fill="var(--danger)" />
          </g>
        </g>
        <text x="95" y="166" text-anchor="middle" font-size="10" font-weight="700" fill="var(--text-muted)">Ruleta [00–99]</text>
        <g font-family="var(--font-mono)" font-size="12" font-weight="800">
          <text x="235" y="45" fill="var(--text-muted)" font-size="10">Cruce en punto k=2:</text>
          <rect x="235" y="56" width="68" height="24" rx="4" fill="var(--primary-light)" stroke="var(--primary)" />
          <text x="269" y="72" text-anchor="middle" fill="var(--primary)">1 0</text>
          <rect x="307" y="56" width="96" height="24" rx="4" fill="var(--bg-subtle)" stroke="var(--border-color)" />
          <text x="355" y="72" text-anchor="middle" fill="var(--text-main)">1 1 0</text>
          <rect x="235" y="92" width="68" height="24" rx="4" fill="var(--warning-bg)" stroke="var(--warning)" />
          <text x="269" y="108" text-anchor="middle" fill="var(--warning)">0 1</text>
          <rect x="307" y="92" width="96" height="24" rx="4" fill="var(--bg-subtle)" stroke="var(--border-color)" />
          <text x="355" y="108" text-anchor="middle" fill="var(--text-main)">0 0 1</text>
          ${step >= 2 ? `
            <text x="235" y="138" fill="var(--success)" font-size="11">Hijo 1: [1 0 | 0 0 1] · Hijo 2: [0 1 | 1 1 0]</text>
          ` : ""}
        </g>
      </svg>
    `;
  }

  function renderKnnSvg({ step }) {
    const wBarA = step === 2 ? 128 : 42;
    const wBarB = step === 2 ? 40 : 88;
    return `
      <svg viewBox="0 0 460 180" class="vw-algo-svg" role="img" aria-label="Animación KNN Ponderado">
        ${step >= 1 ? `<circle cx="118" cy="94" r="56" fill="var(--primary-light)" stroke="var(--primary)" stroke-dasharray="4 3" />` : ""}
        <circle cx="105" cy="96" r="7" fill="var(--success)" /><text x="90" y="90" font-size="9.5" font-weight="700" fill="var(--success)">A</text>
        <circle cx="152" cy="64" r="7" fill="var(--warning)" /><text x="163" y="64" font-size="9.5" font-weight="700" fill="var(--warning)">B</text>
        <circle cx="155" cy="126" r="7" fill="var(--warning)" /><text x="166" y="129" font-size="9.5" font-weight="700" fill="var(--warning)">B</text>
        <circle cx="52" cy="40" r="6" fill="var(--success)" opacity="0.45" />
        <polygon points="118,86 125,99 111,99" fill="var(--danger)" />
        <text x="128" y="106" font-size="10" font-weight="800" fill="var(--danger)">q</text>

        <text x="330" y="42" text-anchor="middle" font-size="11" font-weight="800" fill="var(--text-main)">
          ${step === 2 ? "Pesos Ponderados 1/d²" : "Votos por Mayoría Simple"}
        </text>
        <text x="245" y="74" font-size="10.5" font-weight="700" fill="var(--success)">Clase A</text>
        <rect x="245" y="80" width="${wBarA}" height="16" rx="5" fill="var(--success)" style="transition:width 0.45s ease;" />
        <text x="245" y="120" font-size="10.5" font-weight="700" fill="var(--warning)">Clase B</text>
        <rect x="245" y="126" width="${wBarB}" height="16" rx="5" fill="var(--warning)" style="transition:width 0.45s ease;" />
        <text x="245" y="162" font-size="10" font-weight="700" fill="var(--text-muted)">
          ${step === 2 ? "Gana A porque 1/d² premia cercanía" : (step === 1 ? "Mayoría simple (2 vs 1): B" : "Midiendo distancias a q")}
        </text>
      </svg>
    `;
  }

  function renderNbSvg({ step }) {
    const p1 = step === 2 ? 120 : 60;
    const p2 = step === 2 ? 45 : 60;
    return `
      <svg viewBox="0 0 460 180" class="vw-algo-svg" role="img" aria-label="Animación Naïve Bayes Gaussiano">
        <line x1="28" y1="146" x2="238" y2="146" stroke="var(--border-color)" stroke-width="1.5" />
        <path d="M35,145 Q75,142 98,52 Q121,142 165,145" fill="var(--primary)" fill-opacity="0.18" stroke="var(--primary)" stroke-width="2.2" />
        <path d="M105,145 Q148,142 174,66 Q200,142 232,145" fill="var(--warning)" fill-opacity="0.18" stroke="var(--warning)" stroke-width="2.2" />
        ${step >= 1 ? `
          <line x1="116" y1="30" x2="116" y2="146" stroke="var(--danger)" stroke-width="2" stroke-dasharray="4 3" />
          <text x="116" y="24" text-anchor="middle" font-size="10" font-weight="800" fill="var(--danger)">x*</text>
        ` : ""}
        <text x="98" y="162" text-anchor="middle" font-size="9.5" fill="var(--primary)" font-weight="700">N(μ1, σ1²)</text>
        <text x="174" y="162" text-anchor="middle" font-size="9.5" fill="var(--warning)" font-weight="700">N(μ2, σ2²)</text>
        <text x="345" y="48" text-anchor="middle" font-size="11" font-weight="800" fill="var(--text-main)">Posterior MAP</text>
        <text x="275" y="76" font-size="10" font-weight="700" fill="var(--primary)">P(C1|x*)</text>
        <rect x="275" y="82" width="${p1}" height="14" rx="4" fill="var(--primary)" style="transition:width 0.45s ease;" />
        <text x="275" y="118" font-size="10" font-weight="700" fill="var(--warning)">P(C2|x*)</text>
        <rect x="275" y="124" width="${p2}" height="14" rx="4" fill="var(--warning)" style="transition:width 0.45s ease;" />
      </svg>
    `;
  }

  let activeTimer = null;
  let activeStopUi = null;

  function clearActiveVisualizerTimer() {
    if (activeTimer) {
      clearInterval(activeTimer);
      activeTimer = null;
    }
    if (typeof activeStopUi === "function") {
      activeStopUi();
      activeStopUi = null;
    }
  }

  function mountLabVisualizer(container, topicId) {
    if (!container) return;
    clearActiveVisualizerTimer();

    const spec = VISUALIZER_SPECS[topicId];
    if (!spec || !Array.isArray(spec.steps) || spec.steps.length === 0) {
      container.innerHTML = "";
      return;
    }

    let stepIdx = 0;
    let isPlaying = false;

    const renderFrame = () => {
      const s = spec.steps[stepIdx];
      const pillsHtml = spec.steps.map((st, idx) => `
        <button type="button" class="vw-step-pill ${idx === stepIdx ? "active" : ""}" data-step="${idx}">
          ${escapeHtml(st.label)}
        </button>
      `).join("");

      container.innerHTML = `
        <div class="card vw-visualizer-card">
          <div class="vw-vis-top">
            <div>
              <div class="vw-vis-title">🎬 ${escapeHtml(spec.title)}</div>
              <div class="vw-vis-sub">${escapeHtml(spec.subtitle)}</div>
            </div>
            <div class="vw-vis-controls">
              <button type="button" class="btn btn-primary btn-sm" data-act="toggle">${isPlaying ? "⏸ Pausar" : "▶ Animar"}</button>
              <button type="button" class="btn btn-outline btn-sm" data-act="prev" title="Paso anterior">◀</button>
              <button type="button" class="btn btn-outline btn-sm" data-act="next" title="Siguiente paso">▶</button>
              <button type="button" class="btn btn-outline btn-sm" data-act="reset" title="Reiniciar">↺</button>
            </div>
          </div>
          <div class="vw-vis-pills">${pillsHtml}</div>
          <div class="vw-vis-stage">${s.renderSvg()}</div>
          <div class="vw-vis-comment">
            <strong>💬 Qué decir en la hoja (Paso ${stepIdx + 1}/${spec.steps.length}):</strong> ${escapeHtml(s.comment)}
          </div>
        </div>
      `;

      container.querySelectorAll(".vw-step-pill").forEach((btn) => {
        btn.addEventListener("click", () => {
          stopPlay();
          stepIdx = Number(btn.getAttribute("data-step")) || 0;
          renderFrame();
        });
      });

      const act = (name, fn) => {
        const el = container.querySelector(`[data-act="${name}"]`);
        if (el) el.addEventListener("click", fn);
      };
      act("toggle", () => {
        if (isPlaying) {
          stopPlay();
        } else {
          isPlaying = true;
          clearActiveVisualizerTimer();
          activeStopUi = () => {
            isPlaying = false;
            const b = container.querySelector('[data-act="toggle"]');
            if (b) b.textContent = "▶ Animar";
          };
          activeTimer = setInterval(() => {
            if (!document.body.contains(container)) {
              stopPlay();
              return;
            }
            stepIdx = (stepIdx + 1) % spec.steps.length;
            renderFrame();
          }, 1900);
          renderFrame();
        }
      });
      act("prev", () => {
        stopPlay();
        stepIdx = (stepIdx - 1 + spec.steps.length) % spec.steps.length;
        renderFrame();
      });
      act("next", () => {
        stopPlay();
        stepIdx = (stepIdx + 1) % spec.steps.length;
        renderFrame();
      });
      act("reset", () => {
        stopPlay();
        stepIdx = 0;
        renderFrame();
      });
    };

    const stopPlay = () => {
      isPlaying = false;
      clearActiveVisualizerTimer();
      const btn = container.querySelector('[data-act="toggle"]');
      if (btn) btn.textContent = "▶ Animar";
    };

    renderFrame();
  }

  return {
    VISUALIZER_SPECS,
    getExamCountdownInfo,
    renderRadialRingSvg,
    animateCountUp,
    buildTopicRadarChartSvg,
    renderProgressChartsHtml,
    mountLabVisualizer,
    clearActiveVisualizerTimer
  };
});
