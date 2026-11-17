/**
 * Sync Engine — Zero-Backend Cross-Device Progress Sync (QR + Link + Smart Merge).
 * Pure UMD module (Browser + Node testable, zero external dependencies).
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.SyncEngine = factory();
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const STATUS_TO_CODE = { new: 0, learning: 1, mastered: 2 };
  const CODE_TO_STATUS = ["new", "learning", "mastered"];
  const MIN_EPOCH_MIN = 1;

  function round2(n) {
    return Math.round((Number(n) || 0) * 100) / 100;
  }

  // ---------------------------------------------------------------------------
  // Base64URL + UTF-8 helpers (Browser + Node safe)
  // ---------------------------------------------------------------------------
  function bytesToBase64Url(bytes) {
    let bin = "";
    for (let i = 0; i < bytes.length; i++) {
      bin += String.fromCharCode(bytes[i]);
    }
    const b64 = typeof btoa === "function"
      ? btoa(bin)
      : Buffer.from(bytes).toString("base64");
    return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  }

  function base64UrlToBytes(str) {
    const clean = String(str || "").trim().replace(/-/g, "+").replace(/_/g, "/");
    const pad = clean.length % 4 === 0 ? "" : "=".repeat(4 - (clean.length % 4));
    const b64 = clean + pad;
    if (typeof Buffer !== "undefined" && typeof atob !== "function") {
      return new Uint8Array(Buffer.from(b64, "base64"));
    }
    const bin = atob(b64);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) {
      out[i] = bin.charCodeAt(i);
    }
    return out;
  }

  function encodeUtf8(str) {
    if (typeof TextEncoder !== "undefined") {
      return new TextEncoder().encode(str);
    }
    return new Uint8Array(Buffer.from(String(str), "utf8"));
  }

  function decodeUtf8(bytes) {
    if (typeof TextDecoder !== "undefined") {
      return new TextDecoder().decode(bytes);
    }
    return Buffer.from(bytes).toString("utf8");
  }

  async function deflateRaw(bytes) {
    if (typeof CompressionStream === "function") {
      const cs = new CompressionStream("deflate-raw");
      const writer = cs.writable.getWriter();
      writer.write(bytes);
      writer.close();
      const buf = await new Response(cs.readable).arrayBuffer();
      return new Uint8Array(buf);
    }
    if (typeof require === "function") {
      try {
        const zlib = require("zlib");
        return new Uint8Array(zlib.deflateRawSync(bytes, { level: 9 }));
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  async function inflateRaw(bytes) {
    if (typeof DecompressionStream === "function") {
      const ds = new DecompressionStream("deflate-raw");
      const writer = ds.writable.getWriter();
      writer.write(bytes);
      writer.close();
      const buf = await new Response(ds.readable).arrayBuffer();
      return new Uint8Array(buf);
    }
    if (typeof require === "function") {
      try {
        const zlib = require("zlib");
        return new Uint8Array(zlib.inflateRawSync(bytes));
      } catch (e) {
        throw new Error("No se pudo descomprimir el código en este entorno");
      }
    }
    throw new Error("Este navegador no soporta DecompressionStream");
  }

  // ---------------------------------------------------------------------------
  // Payload Compaction & Expansion (Shrinks JSON ~70% before deflate)
  // ---------------------------------------------------------------------------
  function compactPayload(payload, options = {}) {
    const p = payload || {};
    const light = Boolean(options.light);

    const srsOut = {};
    const srsIn = (p.srsMap && typeof p.srsMap === "object" && !Array.isArray(p.srsMap)) ? p.srsMap : {};
    Object.keys(srsIn).forEach((id) => {
      const c = srsIn[id];
      if (!c) return;
      // Skip untouched default cards to keep QR payloads compact
      if (!c.reps && !c.lapses && !c.lastReviewedAt && (!c.status || c.status === "new")) return;
      const dueMin = c.dueAt ? Math.max(MIN_EPOCH_MIN, Math.round(Number(c.dueAt) / 60000)) : 0;
      const revMin = c.lastReviewedAt ? Math.max(MIN_EPOCH_MIN, Math.round(Number(c.lastReviewedAt) / 60000)) : 0;
      const int10 = Math.round((Number(c.intervalHours) || 0) * 10);
      const ease100 = Math.round((Number(c.ease) || 2.5) * 100);
      const st = STATUS_TO_CODE[c.status] !== undefined ? STATUS_TO_CODE[c.status] : 0;
      srsOut[id] = [
        Number(c.reps) || 0,
        Number(c.lapses) || 0,
        ease100,
        int10,
        dueMin,
        revMin,
        c.lastScore === null || c.lastScore === undefined ? -1 : Number(c.lastScore),
        c.lastRating === null || c.lastRating === undefined ? -1 : Number(c.lastRating),
        st
      ];
    });

    const gIn = p.gamif || {};
    const daIn = (gIn.dailyActions && typeof gIn.dailyActions === "object") ? gIn.dailyActions : {};
    const daKeys = Object.keys(daIn).sort().slice(light ? -14 : -45);
    const daOut = {};
    daKeys.forEach((k) => { if (daIn[k] > 0) daOut[k] = daIn[k]; });

    const xtIn = (gIn.xpAwardedToday && typeof gIn.xpAwardedToday === "object") ? gIn.xpAwardedToday : {};
    const xtKeys = Object.keys(xtIn).slice(light ? -30 : -120);
    const xtOut = {};
    xtKeys.forEach((k) => { if (xtIn[k]) xtOut[k] = 1; });

    const gOut = {
      a: String(gIn.alias || "Estudiante UTN").slice(0, 28),
      dg: Number(gIn.dailyGoal) || 15,
      x: Number(gIn.xp) || 0,
      cs: Number(gIn.currentStreakDays) || 0,
      bs: Number(gIn.bestStreakDays) || 0,
      ls: gIn.lastStudyDate || null,
      da: daOut,
      pc: Number(gIn.practiceCombo) || 0,
      bc: Number(gIn.bestPracticeCombo) || 0,
      rc: Number(gIn.recoveredCount) || 0,
      tr: Number(gIn.totalReviews) || 0,
      te: Number(gIn.totalExams) || 0,
      be: Number(gIn.bestExamScore) || 0,
      b25: Number(gIn.best2025Score) || 0,
      sc: Number(gIn.sourceClicks) || 0,
      ua: gIn.unlockedAchievements || {},
      xt: xtOut
    };

    const histLimit = light ? 5 : 25;
    const pracLimit = light ? 8 : 40;

    return {
      v: 2,
      t: Date.now(),
      srs: srsOut,
      g: gOut,
      l: Array.isArray(p.labSteps) ? p.labSteps.map(String) : [],
      p: Array.isArray(p.practicalAttempts) ? p.practicalAttempts.slice(0, pracLimit) : [],
      h: Array.isArray(p.history) ? p.history.slice(0, histLimit) : [],
      f: Array.isArray(p.failedIds) ? p.failedIds.slice(0, 120) : [],
      r: Array.isArray(p.groupLeaderboard) ? p.groupLeaderboard.slice(0, 20) : []
    };
  }

  function expandPayload(obj) {
    if (!obj || typeof obj !== "object") {
      throw new Error("Formato de sincronización inválido");
    }
    // Accept full JSON backup (v1) transparently
    if (obj.srsMap || obj.gamif || Array.isArray(obj.labSteps)) {
      return {
        version: Number(obj.version || 1),
        exportedAt: obj.exportedAt || new Date().toISOString(),
        srsMap: (obj.srsMap && typeof obj.srsMap === "object" && !Array.isArray(obj.srsMap)) ? obj.srsMap : {},
        gamif: (obj.gamif && typeof obj.gamif === "object") ? obj.gamif : {},
        labSteps: Array.isArray(obj.labSteps) ? obj.labSteps.map(String) : [],
        practicalAttempts: Array.isArray(obj.practicalAttempts) ? obj.practicalAttempts : [],
        history: Array.isArray(obj.history) ? obj.history : [],
        failedIds: Array.isArray(obj.failedIds) ? obj.failedIds : [],
        groupLeaderboard: Array.isArray(obj.groupLeaderboard) ? obj.groupLeaderboard : []
      };
    }

    if (obj.v !== 2) {
      throw new Error("Versión de código de sincronización desconocida");
    }

    const srsMap = {};
    const srsCompact = obj.srs || {};
    Object.keys(srsCompact).forEach((id) => {
      const arr = srsCompact[id];
      if (!Array.isArray(arr)) return;
      srsMap[id] = {
        reps: Number(arr[0]) || 0,
        lapses: Number(arr[1]) || 0,
        ease: round2((Number(arr[2]) || 250) / 100),
        intervalHours: round2((Number(arr[3]) || 0) / 10),
        dueAt: arr[4] ? Number(arr[4]) * 60000 : 0,
        lastReviewedAt: arr[5] ? Number(arr[5]) * 60000 : 0,
        lastScore: arr[6] === -1 || arr[6] === undefined ? null : Number(arr[6]),
        lastRating: arr[7] === -1 || arr[7] === undefined ? null : Number(arr[7]),
        status: CODE_TO_STATUS[arr[8]] || "new"
      };
    });

    const g = obj.g || {};
    const xtExpanded = {};
    if (g.xt && typeof g.xt === "object") {
      Object.keys(g.xt).forEach((k) => {
        if (g.xt[k]) xtExpanded[k] = true;
      });
    }

    return {
      version: 2,
      exportedAt: obj.t ? new Date(obj.t).toISOString() : new Date().toISOString(),
      srsMap,
      gamif: {
        alias: g.a || "Estudiante UTN",
        dailyGoal: Number(g.dg) || 15,
        xp: Number(g.x) || 0,
        currentStreakDays: Number(g.cs) || 0,
        bestStreakDays: Number(g.bs) || 0,
        lastStudyDate: g.ls || null,
        dailyActions: (g.da && typeof g.da === "object") ? g.da : {},
        practiceCombo: Number(g.pc) || 0,
        bestPracticeCombo: Number(g.bc) || 0,
        recoveredCount: Number(g.rc) || 0,
        totalReviews: Number(g.tr) || 0,
        totalExams: Number(g.te) || 0,
        bestExamScore: Number(g.be) || 0,
        best2025Score: Number(g.b25) || 0,
        sourceClicks: Number(g.sc) || 0,
        unlockedAchievements: (g.ua && typeof g.ua === "object") ? g.ua : {},
        xpAwardedToday: xtExpanded
      },
      labSteps: Array.isArray(obj.l) ? obj.l.map(String) : [],
      practicalAttempts: Array.isArray(obj.p) ? obj.p : [],
      history: Array.isArray(obj.h) ? obj.h : [],
      failedIds: Array.isArray(obj.f) ? obj.f : [],
      groupLeaderboard: Array.isArray(obj.r) ? obj.r : []
    };
  }

  function extractSyncToken(rawInput) {
    const txt = String(rawInput || "").trim();
    if (!txt) return "";
    const hashIdx = txt.indexOf("#sync=");
    if (hashIdx !== -1) {
      const after = txt.slice(hashIdx + 6);
      const amp = after.indexOf("&");
      return decodeURIComponent(amp !== -1 ? after.slice(0, amp) : after).trim();
    }
    const queryIdx = txt.indexOf("sync=");
    if (queryIdx !== -1) {
      const after = txt.slice(queryIdx + 5);
      const amp = after.indexOf("&");
      return decodeURIComponent(amp !== -1 ? after.slice(0, amp) : after).trim();
    }
    return txt;
  }

  async function encodeSyncToken(rawPayload, options = {}) {
    const compact = compactPayload(rawPayload, options);
    const jsonBytes = encodeUtf8(JSON.stringify(compact));
    const compressed = await deflateRaw(jsonBytes);
    if (compressed && compressed.length < jsonBytes.length) {
      return "IAS2:" + bytesToBase64Url(compressed);
    }
    return "IAS0:" + bytesToBase64Url(jsonBytes);
  }

  async function decodeSyncToken(rawInput) {
    const token = extractSyncToken(rawInput);
    if (!token) throw new Error("Código o link vacío");

    if (token.startsWith("IAS2:")) {
      const bytes = base64UrlToBytes(token.slice(5));
      const inflated = await inflateRaw(bytes);
      const parsed = JSON.parse(decodeUtf8(inflated));
      return expandPayload(parsed);
    }
    if (token.startsWith("IAS0:")) {
      const bytes = base64UrlToBytes(token.slice(5));
      const parsed = JSON.parse(decodeUtf8(bytes));
      return expandPayload(parsed);
    }
    if (token.startsWith("{")) {
      return expandPayload(JSON.parse(token));
    }
    throw new Error("El texto no contiene un código válido (debe empezar con IAS2: o #sync=)");
  }

  // ---------------------------------------------------------------------------
  // Smart Non-Destructive Merge (PC <-> Mobile)
  // ---------------------------------------------------------------------------
  function mergeCard(a, b) {
    if (!a) return b;
    if (!b) return a;
    const revA = Number(a.lastReviewedAt) || 0;
    const revB = Number(b.lastReviewedAt) || 0;
    if (revB > revA) return b;
    if (revA > revB) return a;
    if ((Number(b.reps) || 0) > (Number(a.reps) || 0)) return b;
    if ((Number(a.reps) || 0) > (Number(b.reps) || 0)) return a;
    return (Number(b.dueAt) || 0) > (Number(a.dueAt) || 0) ? b : a;
  }

  function mergeGamif(localG, incG) {
    const a = localG || {};
    const b = incG || {};

    const da = Object.assign({}, a.dailyActions || {});
    Object.keys(b.dailyActions || {}).forEach((k) => {
      da[k] = Math.max(Number(da[k]) || 0, Number(b.dailyActions[k]) || 0);
    });

    const ua = Object.assign({}, a.unlockedAchievements || {});
    Object.keys(b.unlockedAchievements || {}).forEach((k) => {
      if (!ua[k]) {
        ua[k] = b.unlockedAchievements[k];
      } else if (typeof ua[k] === "number" && typeof b.unlockedAchievements[k] === "number") {
        ua[k] = Math.min(ua[k], b.unlockedAchievements[k]);
      }
    });

    const xt = Object.assign({}, a.xpAwardedToday || {}, b.xpAwardedToday || {});

    const dateA = String(a.lastStudyDate || "");
    const dateB = String(b.lastStudyDate || "");
    let lastStudyDate = dateA || dateB || null;
    let currentStreakDays = Number(a.currentStreakDays) || 0;
    if (dateB > dateA) {
      lastStudyDate = dateB;
      currentStreakDays = Number(b.currentStreakDays) || 0;
    } else if (dateA === dateB) {
      currentStreakDays = Math.max(Number(a.currentStreakDays) || 0, Number(b.currentStreakDays) || 0);
    }

    const aliasLocal = String(a.alias || "").trim();
    const aliasInc = String(b.alias || "").trim();
    const alias = (aliasLocal && aliasLocal !== "Estudiante UTN")
      ? aliasLocal
      : (aliasInc || aliasLocal || "Estudiante UTN");

    return {
      alias,
      dailyGoal: Number(a.dailyGoal) || Number(b.dailyGoal) || 15,
      xp: Math.max(Number(a.xp) || 0, Number(b.xp) || 0),
      currentStreakDays,
      bestStreakDays: Math.max(Number(a.bestStreakDays) || 0, Number(b.bestStreakDays) || 0),
      lastStudyDate,
      dailyActions: da,
      practiceCombo: Math.max(Number(a.practiceCombo) || 0, Number(b.practiceCombo) || 0),
      bestPracticeCombo: Math.max(Number(a.bestPracticeCombo) || 0, Number(b.bestPracticeCombo) || 0),
      recoveredCount: Math.max(Number(a.recoveredCount) || 0, Number(b.recoveredCount) || 0),
      totalReviews: Math.max(Number(a.totalReviews) || 0, Number(b.totalReviews) || 0),
      totalExams: Math.max(Number(a.totalExams) || 0, Number(b.totalExams) || 0),
      bestExamScore: Math.max(Number(a.bestExamScore) || 0, Number(b.bestExamScore) || 0),
      best2025Score: Math.max(Number(a.best2025Score) || 0, Number(b.best2025Score) || 0),
      sourceClicks: Math.max(Number(a.sourceClicks) || 0, Number(b.sourceClicks) || 0),
      unlockedAchievements: ua,
      xpAwardedToday: xt
    };
  }

  function mergeArraysUnique(arrA, arrB, keyFn, sortFn, maxLen) {
    const map = new Map();
    [...(arrA || []), ...(arrB || [])].forEach((item) => {
      if (!item) return;
      const k = keyFn(item);
      if (!map.has(k)) map.set(k, item);
    });
    const list = Array.from(map.values());
    if (sortFn) list.sort(sortFn);
    return maxLen ? list.slice(0, maxLen) : list;
  }

  function mergeProgressPayloads(localRaw, incomingRaw) {
    const local = expandPayload(localRaw || {});
    const inc = expandPayload(incomingRaw || {});

    const srsMap = {};
    const allCardIds = new Set([...Object.keys(local.srsMap || {}), ...Object.keys(inc.srsMap || {})]);
    allCardIds.forEach((id) => {
      srsMap[id] = mergeCard(local.srsMap[id], inc.srsMap[id]);
    });

    const labSteps = Array.from(new Set([...(local.labSteps || []), ...(inc.labSteps || [])].map(String)));

    const practicalAttempts = mergeArraysUnique(
      local.practicalAttempts,
      inc.practicalAttempts,
      (x) => `${x.id || ""}|${x.ts || x.date || ""}|${x.modelId || ""}|${x.topic || ""}|${x.scorePct ?? ""}|${x.elapsedSec ?? ""}`,
      (x, y) => (Number(y.ts || Date.parse(y.date) || 0)) - (Number(x.ts || Date.parse(x.date) || 0)),
      60
    );

    const history = mergeArraysUnique(
      local.history,
      inc.history,
      (h) => `${h.date || ""}|${h.preset || ""}|${h.score ?? ""}|${h.totalQuestions ?? ""}`,
      (x, y) => (Date.parse(y.date || 0) || 0) - (Date.parse(x.date || 0) || 0),
      30
    );

    const failedIds = Array.from(new Set([...(local.failedIds || []), ...(inc.failedIds || [])]));

    const lbMap = new Map();
    [...(local.groupLeaderboard || []), ...(inc.groupLeaderboard || [])].forEach((entry) => {
      if (!entry || !entry.code) return;
      const key = String(entry.code);
      const prev = lbMap.get(key);
      if (!prev || Number(entry.xp || 0) >= Number(prev.xp || 0)) {
        lbMap.set(key, entry);
      }
    });

    return {
      version: 2,
      exportedAt: new Date().toISOString(),
      srsMap,
      gamif: mergeGamif(local.gamif, inc.gamif),
      labSteps,
      practicalAttempts,
      history,
      failedIds,
      groupLeaderboard: Array.from(lbMap.values()).slice(0, 30)
    };
  }

  // ---------------------------------------------------------------------------
  // Zero-Dependency ISO/IEC 18004 QR Code Generator (Byte mode, ECC-L, V1..V24)
  // ---------------------------------------------------------------------------
  const QR_DATA_CW_L = [
    0,
    19, 34, 55, 80, 108, 136, 156, 194, 232, 274,
    324, 370, 428, 461, 523, 589, 647, 721, 795, 861,
    932, 1006, 1094, 1174
  ];

  const QR_BLOCKS_L = [
    null,
    [[1, 19, 7]],
    [[1, 34, 10]],
    [[1, 55, 15]],
    [[1, 80, 20]],
    [[1, 108, 26]],
    [[2, 68, 18]],
    [[2, 78, 20]],
    [[2, 97, 24]],
    [[2, 116, 30]],
    [[2, 68, 18], [2, 69, 18]],
    [[4, 81, 20]],
    [[2, 92, 24], [2, 93, 24]],
    [[4, 107, 26]],
    [[3, 115, 30], [1, 116, 30]],
    [[5, 87, 22], [1, 88, 22]],
    [[5, 98, 24], [1, 99, 24]],
    [[1, 107, 28], [5, 108, 28]],
    [[5, 120, 30], [1, 121, 30]],
    [[3, 113, 28], [4, 114, 28]],
    [[3, 107, 28], [5, 108, 28]],
    [[4, 116, 28], [4, 117, 28]],
    [[2, 111, 28], [7, 112, 28]],
    [[4, 121, 30], [5, 122, 30]],
    [[6, 117, 30], [4, 118, 30]]
  ];

  const QR_ALIGN_POS = [
    [],
    [],
    [6, 18],
    [6, 22],
    [6, 26],
    [6, 30],
    [6, 34],
    [6, 22, 38],
    [6, 24, 42],
    [6, 26, 46],
    [6, 28, 50],
    [6, 30, 54],
    [6, 32, 58],
    [6, 34, 62],
    [6, 26, 46, 66],
    [6, 26, 48, 70],
    [6, 26, 50, 74],
    [6, 30, 54, 78],
    [6, 30, 56, 82],
    [6, 30, 58, 86],
    [6, 34, 62, 90],
    [6, 28, 50, 72, 94],
    [6, 26, 50, 74, 98],
    [6, 30, 54, 78, 102],
    [6, 28, 54, 80, 106]
  ];

  const GF_EXP = new Uint8Array(512);
  const GF_LOG = new Uint8Array(256);
  (function initGalois() {
    let x = 1;
    for (let i = 0; i < 255; i++) {
      GF_EXP[i] = x;
      GF_LOG[x] = i;
      x <<= 1;
      if (x & 0x100) x ^= 0x11d;
    }
    for (let i = 255; i < 512; i++) {
      GF_EXP[i] = GF_EXP[i - 255];
    }
  })();

  function gfMul(a, b) {
    if (a === 0 || b === 0) return 0;
    return GF_EXP[GF_LOG[a] + GF_LOG[b]];
  }

  function rsGeneratorPoly(deg) {
    let poly = [1];
    for (let i = 0; i < deg; i++) {
      const factor = [1, GF_EXP[i]];
      const next = new Array(poly.length + 1).fill(0);
      for (let j = 0; j < poly.length; j++) {
        next[j] ^= poly[j];
        next[j + 1] ^= gfMul(poly[j], factor[1]);
      }
      poly = next;
    }
    return poly;
  }

  function rsComputeEcc(data, eccLen) {
    const gen = rsGeneratorPoly(eccLen);
    const res = new Uint8Array(data.length + eccLen);
    res.set(data, 0);
    for (let i = 0; i < data.length; i++) {
      const factor = res[i];
      if (factor !== 0) {
        for (let j = 0; j < gen.length; j++) {
          res[i + j] ^= gfMul(gen[j], factor);
        }
      }
    }
    return res.slice(data.length);
  }

  function bchFormatBits(data5) {
    let d = data5 << 10;
    const poly = 0x537;
    for (let bit = 14; bit >= 10; bit--) {
      if ((d >>> bit) & 1) d ^= (poly << (bit - 10));
    }
    return ((data5 << 10) | d) ^ 0x5412;
  }

  function bchVersionBits(ver) {
    let d = ver << 12;
    const poly = 0x1f25;
    for (let bit = 17; bit >= 12; bit--) {
      if ((d >>> bit) & 1) d ^= (poly << (bit - 12));
    }
    return (ver << 12) | d;
  }

  function buildQrMatrix(text) {
    const bytes = encodeUtf8(String(text || ""));
    let ver = 1;
    while (ver <= 24) {
      const ccBits = ver < 10 ? 8 : 16;
      const totalBits = 4 + ccBits + bytes.length * 8;
      if (Math.ceil(totalBits / 8) <= QR_DATA_CW_L[ver]) break;
      ver++;
    }
    if (ver > 24) {
      throw new Error("El enlace excede la capacidad máxima del QR (V24)");
    }

    const totalDataCw = QR_DATA_CW_L[ver];
    const bits = [];
    const pushBits = (val, len) => {
      for (let i = len - 1; i >= 0; i--) bits.push((val >>> i) & 1);
    };

    // Mode 0100 (Byte), Char count, Payload bytes, Terminator & padding
    pushBits(0b0100, 4);
    pushBits(bytes.length, ver < 10 ? 8 : 16);
    for (let i = 0; i < bytes.length; i++) pushBits(bytes[i], 8);
    const maxBits = totalDataCw * 8;
    const termLen = Math.min(4, maxBits - bits.length);
    pushBits(0, termLen);
    while (bits.length % 8 !== 0) bits.push(0);
    const padBytes = [0xec, 0x11];
    let padIdx = 0;
    while (bits.length < maxBits) {
      pushBits(padBytes[padIdx++ & 1], 8);
    }

    const dataCw = new Uint8Array(totalDataCw);
    for (let i = 0; i < totalDataCw; i++) {
      let b = 0;
      for (let k = 0; k < 8; k++) b = (b << 1) | bits[i * 8 + k];
      dataCw[i] = b;
    }

    // Split into RS blocks and interleave data + ecc
    const spec = QR_BLOCKS_L[ver];
    const dataBlocks = [];
    const eccBlocks = [];
    let offset = 0;
    spec.forEach(([count, dLen, eLen]) => {
      for (let c = 0; c < count; c++) {
        const blk = dataCw.slice(offset, offset + dLen);
        offset += dLen;
        dataBlocks.push(blk);
        eccBlocks.push(rsComputeEcc(blk, eLen));
      }
    });

    const interleaved = [];
    const maxDataLen = Math.max(...dataBlocks.map((b) => b.length));
    for (let i = 0; i < maxDataLen; i++) {
      for (let b = 0; b < dataBlocks.length; b++) {
        if (i < dataBlocks[b].length) interleaved.push(dataBlocks[b][i]);
      }
    }
    const maxEccLen = Math.max(...eccBlocks.map((b) => b.length));
    for (let i = 0; i < maxEccLen; i++) {
      for (let b = 0; b < eccBlocks.length; b++) {
        if (i < eccBlocks[b].length) interleaved.push(eccBlocks[b][i]);
      }
    }

    const streamBits = [];
    interleaved.forEach((byte) => {
      for (let k = 7; k >= 0; k--) streamBits.push((byte >>> k) & 1);
    });

    const size = ver * 4 + 17;
    const mod = Array.from({ length: size }, () => new Int8Array(size));
    const isFunc = Array.from({ length: size }, () => new Uint8Array(size));

    const setFunc = (r, c, dark) => {
      if (r < 0 || r >= size || c < 0 || c >= size) return;
      mod[r][c] = dark ? 1 : 0;
      isFunc[r][c] = 1;
    };

    const drawFinder = (r0, c0) => {
      for (let dr = -1; dr <= 7; dr++) {
        for (let dc = -1; dc <= 7; dc++) {
          const r = r0 + dr;
          const c = c0 + dc;
          if (r < 0 || r >= size || c < 0 || c >= size) continue;
          const on = (dr >= 0 && dr <= 6 && dc >= 0 && dc <= 6) &&
            (dr === 0 || dr === 6 || dc === 0 || dc === 6 || (dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4));
          setFunc(r, c, on);
        }
      }
    };

    drawFinder(0, 0);
    drawFinder(0, size - 7);
    drawFinder(size - 7, 0);

    // Timing patterns
    for (let i = 8; i < size - 8; i++) {
      setFunc(6, i, i % 2 === 0);
      setFunc(i, 6, i % 2 === 0);
    }

    // Alignment patterns (skip only the 3 corners occupied by Finder patterns)
    const pos = QR_ALIGN_POS[ver];
    for (let i = 0; i < pos.length; i++) {
      for (let j = 0; j < pos.length; j++) {
        if ((i === 0 && j === 0) || (i === 0 && j === pos.length - 1) || (i === pos.length - 1 && j === 0)) continue;
        const cr = pos[i];
        const cc = pos[j];
        for (let dr = -2; dr <= 2; dr++) {
          for (let dc = -2; dc <= 2; dc++) {
            const on = Math.abs(dr) === 2 || Math.abs(dc) === 2 || (dr === 0 && dc === 0);
            setFunc(cr + dr, cc + dc, on);
          }
        }
      }
    }

    // Reserve format areas + dark module
    for (let i = 0; i < 9; i++) {
      if (i !== 6) {
        isFunc[8][i] = 1;
        isFunc[i][8] = 1;
      }
      if (i < 8) {
        isFunc[8][size - 1 - i] = 1;
        isFunc[size - 1 - i][8] = 1;
      }
    }
    setFunc(ver * 4 + 9, 8, true);

    // Version info (>= V7)
    if (ver >= 7) {
      const vb = bchVersionBits(ver);
      for (let i = 0; i < 18; i++) {
        const bit = ((vb >>> i) & 1) === 1;
        const r = Math.floor(i / 3);
        const c = size - 11 + (i % 3);
        setFunc(r, c, bit);
        setFunc(c, r, bit);
      }
    }

    // Zigzag placement
    let bitIdx = 0;
    let up = true;
    for (let c = size - 1; c > 0; c -= 2) {
      if (c === 6) c--;
      for (let step = 0; step < size; step++) {
        const r = up ? size - 1 - step : step;
        for (let dc = 0; dc < 2; dc++) {
          const col = c - dc;
          if (!isFunc[r][col]) {
            mod[r][col] = bitIdx < streamBits.length ? streamBits[bitIdx++] : 0;
          }
        }
      }
      up = !up;
    }

    const maskPredicates = [
      (r, c) => (r + c) % 2 === 0,
      (r) => r % 2 === 0,
      (r, c) => c % 3 === 0,
      (r, c) => (r + c) % 3 === 0,
      (r, c) => (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0,
      (r, c) => ((r * c) % 2) + ((r * c) % 3) === 0,
      (r, c) => (((r * c) % 2) + ((r * c) % 3)) % 2 === 0,
      (r, c) => (((r + c) % 2) + ((r * c) % 3)) % 2 === 0
    ];

    const writeFormatBits = (grid, maskId) => {
      // ECC Level L = 01 (ISO/IEC 18004 Fig. 25: MSB bit 14 at (8,0) & (size-1,8) -> LSB bit 0 at (0,8) & (8,size-1))
      const fmt = bchFormatBits((0b01 << 3) | maskId);
      const getBit = (idxFromMsb) => (fmt >>> (14 - idxFromMsb)) & 1;
      for (let i = 0; i < 6; i++) grid[8][i] = getBit(i);
      grid[8][7] = getBit(6);
      grid[8][8] = getBit(7);
      grid[7][8] = getBit(8);
      for (let i = 9; i < 15; i++) grid[14 - i][8] = getBit(i);
      for (let i = 0; i < 7; i++) grid[size - 1 - i][8] = getBit(i);
      for (let i = 7; i < 15; i++) grid[8][size - 15 + i] = getBit(i);
    };

    const scorePenalty = (grid) => {
      let pen = 0;
      for (let r = 0; r < size; r++) {
        let run = 1;
        for (let c = 1; c < size; c++) {
          if (grid[r][c] === grid[r][c - 1]) run++;
          else {
            if (run >= 5) pen += 3 + (run - 5);
            run = 1;
          }
        }
        if (run >= 5) pen += 3 + (run - 5);
      }
      for (let c = 0; c < size; c++) {
        let run = 1;
        for (let r = 1; r < size; r++) {
          if (grid[r][c] === grid[r - 1][c]) run++;
          else {
            if (run >= 5) pen += 3 + (run - 5);
            run = 1;
          }
        }
        if (run >= 5) pen += 3 + (run - 5);
      }
      for (let r = 0; r < size - 1; r++) {
        for (let c = 0; c < size - 1; c++) {
          const s = grid[r][c] + grid[r + 1][c] + grid[r][c + 1] + grid[r + 1][c + 1];
          if (s === 0 || s === 4) pen += 3;
        }
      }
      return pen;
    };

    let bestMask = 0;
    let bestPen = Infinity;
    let bestGrid = null;

    for (let m = 0; m < 8; m++) {
      const cand = mod.map((row) => new Int8Array(row));
      const fn = maskPredicates[m];
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          if (!isFunc[r][c] && fn(r, c)) cand[r][c] ^= 1;
        }
      }
      writeFormatBits(cand, m);
      const p = scorePenalty(cand);
      if (p < bestPen) {
        bestPen = p;
        bestMask = m;
        bestGrid = cand;
      }
    }

    return { version: ver, size, mask: bestMask, matrix: bestGrid, byteLength: bytes.length };
  }

  function renderQrSvg(text, options = {}) {
    const quiet = Number.isFinite(options.quiet) ? options.quiet : 4;
    const qr = buildQrMatrix(text);
    const total = qr.size + quiet * 2;
    let pathD = "";
    for (let r = 0; r < qr.size; r++) {
      for (let c = 0; c < qr.size; c++) {
        if (qr.matrix[r][c] === 1) {
          pathD += `M${c + quiet},${r + quiet}h1v1h-1z`;
        }
      }
    }
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} ${total}" class="sync-qr-svg" shape-rendering="crispEdges" role="img" aria-label="Código QR de sincronización (v${qr.version})"><rect width="${total}" height="${total}" fill="#ffffff"/><path d="${pathD}" fill="#0f172a"/></svg>`;
    return {
      svg,
      version: qr.version,
      size: qr.size,
      byteLength: qr.byteLength
    };
  }

  return {
    compactPayload,
    expandPayload,
    extractSyncToken,
    encodeSyncToken,
    decodeSyncToken,
    mergeProgressPayloads,
    buildQrMatrix,
    renderQrSvg
  };
});
