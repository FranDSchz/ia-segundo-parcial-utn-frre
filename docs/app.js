/**
 * Simulador de Examen Teórico — Inteligencia Artificial UTN FRRe
 * Vanilla JavaScript (Zero Build / Standalone / GitHub Pages Ready)
 */

(function () {
  "use strict";

  // Public Repository Base URL (for direct source PDF/image/bank traceability)
  const REPO_GITHUB_BASE = "https://github.com/FranDSchz/ia-segundo-parcial-utn-frre";

  // Topic Labels & Friendly Names
  const TOPIC_NAMES = {
    ALGORITMOS_GENETICOS: "Algoritmos Genéticos",
    SVM: "Support Vector Machines · SVM (Solo Finales · no entra en P2)",
    SOM: "Mapas Auto-organizados (SOM)",
    MLP: "Perceptrón Multicapa (MLP)",
    HOPFIELD: "Redes de Hopfield",
    KMEANS: "K-Means & Disk K-Means",
    KNN: "K-Nearest Neighbors (KNN)",
    NAIVE_BAYES: "Naïve Bayes",
    CLUSTERING: "Clustering Jerárquico",
    P1_REPASO: "Repaso 1er Parcial (P1)",
    GENERAL_IA: "Evaluación y Generalización"
  };

  const app = {
    allQuestions: [],
    currentView: "home",
    selectedPreset: "oficial",
    includeP1: false,
    includeSVM: false,

    // Active Exam State
    examQuestions: [],
    currentIndex: 0,
    userAnswers: {}, // index -> Set of option indices
    flagged: new Set(),
    timeRemaining: 2400,
    timerInterval: null,
    examDurationSeconds: 2400,
    startTime: null,
    examResults: null,

    // Practice Mode State
    practiceQuestions: [],
    practiceIndex: 0,
    practiceSelectedTopic: "ALL",
    practiceAnswers: {},
    practiceEvaluated: {},
    practiceTurnBaseline: {},
    practiceTurnRating: {},
    practiceXpAwardedIds: new Set(),
    practiceRequeuedTurns: new Set(),
    practiceVerifiedCount: 0,
    practiceQueueMeta: null,
    practiceAllowAllCaughtUpFallback: false,

    // Study Engine State (SM-2 Spaced Repetition, Gamification & Leaderboard)
    srsMap: {},
    gamif: null,
    groupLeaderboard: [],
    leaderboardMode: "group",
    githubLeaderboard: null,
    githubLeaderboardStatus: "",
    lastExamReward: null,

    // QA Mode State
    qaSearchQuery: "",
    qaSelectedTopic: "ALL",
    qaSelectedYear: "ALL",

    // Práctica Guiada / Laboratorio de Resolución (#lab) State
    labData: null,
    labSelectedTopic: null,
    labSelectedType: "ALL",
    labRevealedCards: new Set(),
    labCompletedSteps: new Set(),

    // Community & Feedback State
    currentFeedbackQuestion: null,

    // Init
    init() {
      // 1. Load questions from window.PREGUNTAS
      if (window.PREGUNTAS && Array.isArray(window.PREGUNTAS)) {
        this.allQuestions = window.PREGUNTAS;
      } else {
        console.error("No se encontró window.PREGUNTAS. Revisa data/preguntas.js");
        this.allQuestions = [];
      }

      this.labData = window.ENTRENAMIENTO_PRACTICO || null;
      this.initStudyState();

      // 2. Load theme
      const savedTheme = localStorage.getItem("ia_quiz_theme") || "dark";
      this.setTheme(savedTheme);

      // 3. Setup P1 and SVM filter checkboxes
      const checkP1 = document.getElementById("check-include-p1");
      const checkSVM = document.getElementById("check-include-svm");
      const updatePresetCompletoCount = () => {
        const poolCount = this.allQuestions.filter((q) => {
          if (!this.includeP1 && q.es_p1) return false;
          if (!this.includeSVM && q.tema === "SVM") return false;
          return true;
        }).length;
        const presetCompletoMeta = document.querySelector("#preset-completo .preset-meta span:nth-child(2)");
        if (presetCompletoMeta) {
          presetCompletoMeta.textContent = `📝 ${poolCount} Preguntas`;
        }
        this.renderGlobalStudyHud();
        this.updateSmartPracticeFilterLabel();
      };
      if (checkP1) {
        checkP1.checked = false;
        checkP1.addEventListener("change", (e) => {
          this.includeP1 = e.target.checked;
          updatePresetCompletoCount();
        });
      }
      if (checkSVM) {
        checkSVM.checked = false;
        checkSVM.addEventListener("change", (e) => {
          this.includeSVM = e.target.checked;
          updatePresetCompletoCount();
        });
      }
      updatePresetCompletoCount();

      // Track repo source link clicks for Auditor achievement
      document.addEventListener("click", (e) => {
        if (e.target && e.target.closest && e.target.closest(".repo-link-pill")) {
          this.recordSourceLinkClick();
        }
      });

      // Update QA select count
      const qaOptionAll = document.querySelector('#qa-topic-select option[value="ALL"]');
      if (qaOptionAll) {
        qaOptionAll.textContent = `Todos los Temas (${this.allQuestions.length})`;
      }
      const qaCountBadge = document.getElementById("qa-count-badge");
      if (qaCountBadge) {
        qaCountBadge.textContent = `${this.allQuestions.length} Preguntas Activas`;
      }
      this.updateQAYearOptions();

      // 4. Check for stored failed questions
      this.updateFailedButtonVisibility();

      // 5. Build practice topics and guided practical lab (#lab)
      this.initPracticeMode();
      this.initLabMode();

      // 6. Bind keyboard shortcuts for active exam
      this.bindKeyboardShortcuts();

      // 7. Check URL hash for direct routing and listen to back/forward/hash changes
      const handleHashRoute = () => {
        const hash = window.location.hash.replace("#", "").toLowerCase();
        if (["home", "practice", "lab", "history", "qa", "community"].includes(hash)) {
          if (this.currentView !== hash) {
            this.navigate(hash);
          }
        } else if (!window.location.hash) {
          if (this.currentView !== "home") {
            this.navigate("home");
          }
        }
      };

      window.addEventListener("hashchange", handleHashRoute);
      handleHashRoute();
      if (!window.location.hash) {
        this.navigate("home");
      }

      // 8. Render static math on initial load (e.g. checkbox label $A^*$)
      this.renderStaticMath();
    },

    bindKeyboardShortcuts() {
      document.addEventListener("keydown", (e) => {
        if (this.currentView !== "exam") return;
        const tag = (e.target && e.target.tagName) ? e.target.tagName.toUpperCase() : "";
        if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
        const modal = document.getElementById("modal-finish");
        if (modal && modal.classList.contains("open")) return;

        if (e.key >= "1" && e.key <= "6") {
          const optIdx = parseInt(e.key, 10) - 1;
          const q = this.examQuestions[this.currentIndex];
          if (q && optIdx < q.opciones.length) {
            e.preventDefault();
            this.toggleOption(optIdx);
          }
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          this.nextQuestion();
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          this.prevQuestion();
        } else if (e.key === "f" || e.key === "F") {
          e.preventDefault();
          this.toggleCurrentFlag();
        }
      });
    },

    // -------------------------------------------------------------
    // Rich Text Formatter (Markdown + KaTeX Math Protection)
    // -------------------------------------------------------------
    formatRichText(rawStr) {
      if (!rawStr) return "";
      let str = String(rawStr);

      // 1. Proteger bloques matemáticos ($$...$$ y $...$) con placeholders seguros
      const mathPlaceholders = [];
      const saveMath = (match) => {
        const token = `@@MATH_BLOCK_${mathPlaceholders.length}@@`;
        mathPlaceholders.push(match);
        return token;
      };

      // Display math ($$...$$) primero, luego inline math ($...$)
      str = str.replace(/\$\$([\s\S]+?)\$\$/g, saveMath);
      str = str.replace(/\$([^\$\n]+?)\$/g, saveMath);

      // 2. Convertir código inline `codigo`
      str = str.replace(/`([^`\n]+?)`/g, "<code>$1</code>");

      // 3. Procesar líneas y viñetas (Markdown lists y saltos de línea)
      const lines = str.split("\n");
      const processedLines = [];

      for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        if (!line) {
          processedLines.push("");
          continue;
        }

        // Detectar si la línea comienza con viñeta (* o -)
        const bulletMatch = line.match(/^[\*\-]\s+(.*)$/);
        if (bulletMatch) {
          let content = bulletMatch[1];
          // Negritas **texto**
          content = content.replace(/\*\*([^*]+?)\*\*/g, "<strong>$1</strong>");
          // Cursivas *texto* (un solo asterisco)
          content = content.replace(/(^|[^*])\*([^*]+?)\*([^*]|$)/g, "$1<em>$2</em>$3");
          processedLines.push(`<div class="rich-bullet-item"><span class="bullet-dot">•</span><span class="bullet-text">${content}</span></div>`);
        } else {
          // Línea regular
          let lineContent = line;
          lineContent = lineContent.replace(/\*\*([^*]+?)\*\*/g, "<strong>$1</strong>");
          lineContent = lineContent.replace(/(^|[^*])\*([^*]+?)\*([^*]|$)/g, "$1<em>$2</em>$3");
          processedLines.push(lineContent);
        }
      }

      // Unir líneas respetando saltos de línea limpios
      let htmlResult = "";
      for (let i = 0; i < processedLines.length; i++) {
        const line = processedLines[i];
        if (!line) {
          if (htmlResult && !htmlResult.endsWith("</div>") && !htmlResult.endsWith("<br>")) {
            htmlResult += "<br>";
          }
          continue;
        }

        if (line.startsWith('<div class="rich-bullet-item">')) {
          htmlResult += (htmlResult && !htmlResult.endsWith("</div>") ? "<br>" : "") + line;
        } else {
          if (htmlResult && !htmlResult.endsWith("</div>") && !htmlResult.endsWith("<br>")) {
            htmlResult += "<br>" + line;
          } else {
            htmlResult += line;
          }
        }
      }

      // 4. Restaurar bloques matemáticos asegurando que < y > no rompan el DOM
      for (let idx = 0; idx < mathPlaceholders.length; idx++) {
        let mathText = mathPlaceholders[idx];
        mathText = mathText.replace(/<(?=[a-zA-Z0-9\s\\=\-])/g, "\\lt ");
        mathText = mathText.replace(/>(?=[a-zA-Z0-9\s\\=\-])/g, "\\gt ");
        const token = `@@MATH_BLOCK_${idx}@@`;
        htmlResult = htmlResult.replace(token, mathText);
      }

      return htmlResult;
    },

    // -------------------------------------------------------------
    // KaTeX Math Rendering Helper (with Safe Retry and Offline Fallback)
    // -------------------------------------------------------------
    renderMath(targetElement) {
      if (!targetElement) return;

      if (window.renderMathInElement) {
        try {
          window.renderMathInElement(targetElement, {
            delimiters: [
              { left: "$$", right: "$$", display: true },
              { left: "$", right: "$", display: false },
              { left: "\\[", right: "\\]", display: true },
              { left: "\\(", right: "\\)", display: false }
            ],
            throwOnError: false
          });
          return;
        } catch (err) {
          console.warn("KaTeX error:", err);
        }
      }

      // Reintento seguro si los scripts de KaTeX están en proceso de descarga
      if (!this._mathRetryScheduled) {
        this._mathRetryScheduled = true;
        let retries = 0;
        const interval = setInterval(() => {
          retries++;
          if (window.renderMathInElement) {
            clearInterval(interval);
            this._mathRetryScheduled = false;
            // Re-renderizar la vista activa para aplicar KaTeX completo
            if (this.currentView === "qa") {
              this.renderQAMode();
            } else if (this.currentView === "practice") {
              this.renderPracticeQuestion();
            } else if (this.currentView === "exam") {
              this.renderQuestion(this.currentIndex);
            } else if (this.currentView === "results") {
              this.renderResults();
            }
            this.renderStaticMath();
          } else if (retries > 50) { // 5 segundos sin CDN
            clearInterval(interval);
            this._mathRetryScheduled = false;
            this.applyOfflineMathFallback(targetElement);
          }
        }, 100);
      }
    },

    renderStaticMath() {
      const homeSection = document.getElementById("view-home");
      if (homeSection) {
        this.renderMath(homeSection);
      }
    },

    applyOfflineMathFallback(targetElement) {
      if (!targetElement) return;
      const symMap = {
        "\\alpha": "α", "\\beta": "β", "\\gamma": "γ", "\\delta": "δ",
        "\\epsilon": "ε", "\\eta": "η", "\\theta": "θ", "\\lambda": "λ",
        "\\mu": "μ", "\\pi": "π", "\\sigma": "σ", "\\sum": "∑",
        "\\prod": "∏", "\\le": "≤", "\\ge": "≥", "\\ne": "≠",
        "\\to": "→", "\\implies": "⇒", "\\iff": "⇔", "\\cdot": "·",
        "\\times": "×", "\\pm": "±", "\\infty": "∞", "\\in": "∈",
        "\\forall": "∀", "\\mid": "|", "\\vert": "|", "\\|": "‖",
        "\\lt": "<", "\\gt": ">"
      };
      targetElement.innerHTML = targetElement.innerHTML.replace(/\$\$([\s\S]+?)\$\$|\$([^$]+?)\$/g, (fullMatch, dMath, iMath) => {
        let expr = (dMath || iMath || "").trim();
        Object.keys(symMap).forEach((k) => {
          expr = expr.split(k).join(symMap[k]);
        });
        expr = expr.replace(/\\(?:text|mathbf|overline|bar|lfloor|rfloor)\{([^}]*)\}/g, "$1");
        return `<code class="math-offline" data-raw-math="${encodeURIComponent(fullMatch)}">${expr}</code>`;
      });
    },

    // -------------------------------------------------------------
    // Theme Switcher (Dark / Light)
    // -------------------------------------------------------------
    setTheme(theme) {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("ia_quiz_theme", theme);
      const icon = document.getElementById("theme-icon");
      if (icon) {
        icon.textContent = theme === "dark" ? "🌙" : "☀️";
      }
    },

    toggleTheme() {
      const current = document.documentElement.getAttribute("data-theme") || "dark";
      const next = current === "dark" ? "light" : "dark";
      this.setTheme(next);
    },

    // -------------------------------------------------------------
    // Navigation & Views
    // -------------------------------------------------------------
    navigate(viewName) {
      // If leaving an active exam, ask confirmation
      if (this.currentView === "exam" && viewName !== "exam" && !this.examResults) {
        if (!confirm("¿Seguro que deseas salir del examen en curso? Tu progreso se perderá.")) {
          return;
        }
        clearInterval(this.timerInterval);
      }

      this.currentView = viewName;
      window.location.hash = viewName;

      // Update Nav Tabs
      document.querySelectorAll(".nav-tab-btn").forEach((btn) => {
        btn.classList.toggle("active", btn.id === `tab-${viewName}`);
      });

      // Show/Hide Sections
      document.querySelectorAll(".view-section").forEach((sec) => {
        sec.classList.remove("active");
      });
      const targetSec = document.getElementById(`view-${viewName}`);
      if (targetSec) {
        targetSec.classList.add("active");
      }

      // View-specific initializers
      if (viewName === "home") {
        this.renderGlobalStudyHud();
        this.renderStaticMath();
      } else if (viewName === "history") {
        this.renderProgressDashboard();
        this.renderHistory();
      } else if (viewName === "qa") {
        this.renderQAMode();
      } else if (viewName === "practice") {
        this.renderPracticeHud();
        this.renderPracticeQuestion();
      } else if (viewName === "lab") {
        this.renderLabView();
      } else if (viewName === "community") {
        this.initCommunityView();
      }

      window.scrollTo({ top: 0, behavior: "smooth" });
    },

    // -------------------------------------------------------------
    // Presets & Setup
    // -------------------------------------------------------------
    selectPreset(preset) {
      this.selectedPreset = preset;
      document.querySelectorAll(".preset-card").forEach((c) => c.classList.remove("selected"));
      const targetCard = document.getElementById(`preset-${preset}`);
      if (targetCard) targetCard.classList.add("selected");
    },

    updateFailedButtonVisibility() {
      const box = document.getElementById("resume-failed-box");
      const countSpan = document.getElementById("failed-count");
      if (!box || !countSpan) return;

      const failedIds = this.getStoredFailedIds();
      if (failedIds.length > 0) {
        box.style.display = "block";
        countSpan.textContent = failedIds.length;
      } else {
        box.style.display = "none";
      }
    },

    getStoredFailedIds() {
      try {
        const raw = localStorage.getItem("ia_quiz_failed_ids");
        return raw ? JSON.parse(raw) : [];
      } catch (e) {
        return [];
      }
    },

    // -------------------------------------------------------------
    // Start Exam Engine
    // -------------------------------------------------------------
    startExam() {
      // 1. Filter bank based on P1 and SVM checkboxes
      let pool = this.allQuestions.filter((q) => {
        if (!this.includeP1 && q.es_p1) return false;
        if (!this.includeSVM && q.tema === "SVM") return false;
        return true;
      });

      // 2. Determine questions count & timer duration
      let count = 25;
      let durationMinutes = 40;

      if (this.selectedPreset === "2025") {
        pool = this.allQuestions.filter((q) => this.matchesYearFilter(q, "PARCIAL_2025"));
        count = pool.length;
        durationMinutes = 20;
        this.examQuestions = [...pool];
      } else {
        if (this.selectedPreset === "rapido") {
          count = 15;
          durationMinutes = 20;
        } else if (this.selectedPreset === "completo") {
          count = pool.length;
          durationMinutes = 60;
        }
        // Shuffle pool
        const shuffled = [...pool].sort(() => 0.5 - Math.random());
        this.examQuestions = shuffled.slice(0, Math.min(count, shuffled.length));
      }

      // Reset exam state
      this.currentIndex = 0;
      this.userAnswers = {};
      this.flagged = new Set();
      this.examResults = null;
      this.examDurationSeconds = durationMinutes * 60;
      this.timeRemaining = this.examDurationSeconds;
      this.startTime = Date.now();

      // Start timer
      clearInterval(this.timerInterval);
      this.timerInterval = setInterval(() => this.timerTick(), 1000);

      // Render
      this.navigate("exam");
      this.renderQuestion(0);
      this.renderPalette();
    },

    startPracticeFailed() {
      const failedIds = new Set(this.getStoredFailedIds());
      const failedQuestions = this.allQuestions.filter((q) => failedIds.has(q.id));
      if (failedQuestions.length === 0) {
        alert("No tienes preguntas falladas guardadas.");
        return;
      }

      this.examQuestions = failedQuestions;
      this.currentIndex = 0;
      this.userAnswers = {};
      this.flagged = new Set();
      this.examResults = null;
      this.examDurationSeconds = failedQuestions.length * 90;
      this.timeRemaining = this.examDurationSeconds;
      this.startTime = Date.now();

      clearInterval(this.timerInterval);
      this.timerInterval = setInterval(() => this.timerTick(), 1000);

      this.navigate("exam");
      this.renderQuestion(0);
      this.renderPalette();
    },

    // -------------------------------------------------------------
    // Exam Timer
    // -------------------------------------------------------------
    timerTick() {
      this.timeRemaining--;

      const timerEl = document.getElementById("exam-timer");
      if (timerEl) {
        const mins = Math.floor(Math.max(0, this.timeRemaining) / 60);
        const secs = Math.max(0, this.timeRemaining) % 60;
        timerEl.textContent = `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;

        if (this.timeRemaining <= 300) {
          timerEl.classList.add("danger");
        } else {
          timerEl.classList.remove("danger");
        }
      }

      if (this.timeRemaining <= 0) {
        clearInterval(this.timerInterval);
        alert("¡Tiempo cumplido! Tu examen se entregará y calificará automáticamente.");
        this.finishExam();
      }
    },

    // -------------------------------------------------------------
    // Question Rendering (Active Exam)
    // -------------------------------------------------------------
    renderQuestion(index) {
      if (index < 0 || index >= this.examQuestions.length) return;
      this.currentIndex = index;
      const q = this.examQuestions[index];

      // Topic badge & Progress
      const topicBadge = document.getElementById("exam-topic-badge");
      if (topicBadge) {
        topicBadge.textContent = TOPIC_NAMES[q.tema] || q.tema;
      }

      const progressText = document.getElementById("exam-progress-text");
      if (progressText) {
        progressText.textContent = `Pregunta ${index + 1} de ${this.examQuestions.length}`;
      }

      const answeredEl = document.getElementById("exam-answered-text");
      if (answeredEl) {
        let answeredCount = 0;
        for (let i = 0; i < this.examQuestions.length; i++) {
          if (this.userAnswers[i] && this.userAnswers[i].size > 0) answeredCount++;
        }
        answeredEl.textContent = `Respondidas: ${answeredCount} / ${this.examQuestions.length}`;
      }

      const progressBar = document.getElementById("exam-progress-bar");
      if (progressBar) {
        const percent = ((index + 1) / this.examQuestions.length) * 100;
        progressBar.style.width = `${percent}%`;
      }

      // Title & Enunciado
      const titleEl = document.getElementById("exam-question-title");
      if (titleEl) {
        titleEl.innerHTML = this.formatRichText(q.titulo);
        this.renderMath(titleEl);
      }

      const promptEl = document.getElementById("exam-question-prompt");
      if (promptEl) {
        promptEl.innerHTML = this.formatRichText(q.enunciado);
      }

      // Multi-select hint (sin revelar cantidad de opciones correctas para fidelidad 100% con el parcial)
      const multiHint = document.getElementById("exam-multi-hint");
      if (multiHint) {
        multiHint.textContent = "Seleccione una o más opciones (penaliza errores)";
      }

      // Flag button
      const flagBtn = document.getElementById("exam-flag-btn");
      const flagLabel = document.getElementById("flag-label");
      const isFlagged = this.flagged.has(index);
      if (flagBtn) {
        flagBtn.classList.toggle("flagged", isFlagged);
      }
      if (flagLabel) {
        flagLabel.textContent = isFlagged ? "Marcada 🚩" : "Marcar";
      }

      // Options
      const optionsList = document.getElementById("exam-options-list");
      if (optionsList) {
        optionsList.innerHTML = "";
        const selectedSet = this.userAnswers[index] || new Set();

        q.opciones.forEach((optText, optIdx) => {
          const isSelected = selectedSet.has(optIdx);
          const optDiv = document.createElement("div");
          optDiv.className = `option-item ${isSelected ? "selected" : ""}`;
          optDiv.onclick = (e) => {
            // Prevent double toggle if clicking directly on checkbox
            if (e.target.tagName.toLowerCase() !== "input") {
              this.toggleOption(optIdx);
            }
          };

          optDiv.innerHTML = `
            <input type="checkbox" class="option-checkbox" ${isSelected ? "checked" : ""} onchange="app.toggleOption(${optIdx})">
            <div class="option-text">${this.formatRichText(optText)}</div>
          `;
          optionsList.appendChild(optDiv);
        });
      }

      // Prev/Next buttons state
      const btnPrev = document.getElementById("btn-prev-q");
      const btnNext = document.getElementById("btn-next-q");
      if (btnPrev) btnPrev.disabled = index === 0;
      if (btnNext) {
        if (index === this.examQuestions.length - 1) {
          btnNext.textContent = "Revisar / Entregar →";
          btnNext.className = "btn btn-danger";
          btnNext.onclick = () => this.confirmFinishExam();
        } else {
          btnNext.textContent = "Siguiente →";
          btnNext.className = "btn btn-primary";
          btnNext.onclick = () => this.nextQuestion();
        }
      }

      // Update palette active highlight
      this.updatePaletteActive();

      // Render KaTeX in prompt and options
      this.renderMath(promptEl);
      this.renderMath(optionsList);
    },

    toggleOption(optIdx) {
      if (!this.userAnswers[this.currentIndex]) {
        this.userAnswers[this.currentIndex] = new Set();
      }
      const set = this.userAnswers[this.currentIndex];
      if (set.has(optIdx)) {
        set.delete(optIdx);
      } else {
        set.add(optIdx);
      }

      // Re-render current question options and update palette
      this.renderQuestion(this.currentIndex);
      this.updatePaletteActive();
    },

    clearCurrentSelection() {
      if (this.userAnswers[this.currentIndex]) {
        this.userAnswers[this.currentIndex].clear();
        this.renderQuestion(this.currentIndex);
        this.updatePaletteActive();
      }
    },

    toggleCurrentFlag() {
      if (this.flagged.has(this.currentIndex)) {
        this.flagged.delete(this.currentIndex);
      } else {
        this.flagged.add(this.currentIndex);
      }
      this.renderQuestion(this.currentIndex);
      this.updatePaletteActive();
    },

    prevQuestion() {
      if (this.currentIndex > 0) {
        this.renderQuestion(this.currentIndex - 1);
      }
    },

    nextQuestion() {
      if (this.currentIndex < this.examQuestions.length - 1) {
        this.renderQuestion(this.currentIndex + 1);
      }
    },

    // -------------------------------------------------------------
    // Question Palette (Grid)
    // -------------------------------------------------------------
    renderPalette() {
      const grid = document.getElementById("exam-palette-grid");
      if (!grid) return;
      grid.innerHTML = "";

      this.examQuestions.forEach((_, idx) => {
        const btn = document.createElement("button");
        btn.id = `palette-btn-${idx}`;
        btn.className = "palette-btn";
        btn.textContent = idx + 1;
        btn.onclick = () => this.renderQuestion(idx);
        grid.appendChild(btn);
      });

      this.updatePaletteActive();
    },

    updatePaletteActive() {
      this.examQuestions.forEach((_, idx) => {
        const btn = document.getElementById(`palette-btn-${idx}`);
        if (!btn) return;

        btn.classList.toggle("current", idx === this.currentIndex);
        const hasAnswers = this.userAnswers[idx] && this.userAnswers[idx].size > 0;
        btn.classList.toggle("answered", Boolean(hasAnswers));
        btn.classList.toggle("flagged", this.flagged.has(idx));
      });
    },

    // -------------------------------------------------------------
    // Moodle Scoring Engine
    // -------------------------------------------------------------
    calculateMoodleScore(correctIndices, totalOptions, selectedSet) {
      const C = correctIndices.length;
      const N = totalOptions;
      const I = N - C;

      const setCorr = new Set(correctIndices);
      let a = 0; // correct selected
      let e = 0; // incorrect selected

      for (const sel of selectedSet) {
        if (setCorr.has(sel)) {
          a++;
        } else {
          e++;
        }
      }

      const frac_a = C > 0 ? a / C : 0;
      const frac_e = I > 0 ? e / I : 0;

      const neto = 100 * (frac_a - frac_e);
      return Math.max(0, Math.round(neto * 100) / 100);
    },

    // -------------------------------------------------------------
    // Modal & Finish Exam
    // -------------------------------------------------------------
    confirmFinishExam() {
      let unansweredCount = 0;
      for (let i = 0; i < this.examQuestions.length; i++) {
        if (!this.userAnswers[i] || this.userAnswers[i].size === 0) {
          unansweredCount++;
        }
      }

      const modalWarn = document.getElementById("modal-finish-warning");
      if (modalWarn) {
        if (unansweredCount > 0) {
          modalWarn.innerHTML = `⚠️ Tienes <strong>${unansweredCount}</strong> ${
            unansweredCount === 1 ? "pregunta sin responder" : "preguntas sin responder"
          } de un total de ${this.examQuestions.length}. Las preguntas en blanco sumarán 0 puntos.`;
        } else {
          modalWarn.textContent = `Has respondido las ${this.examQuestions.length} preguntas. Tu examen será evaluado inmediatamente.`;
        }
      }

      const modal = document.getElementById("modal-finish");
      if (modal) modal.classList.add("open");
    },

    openModal(modalId) {
      const modal = document.getElementById(modalId);
      if (modal) modal.classList.add("open");
    },

    closeModal(modalId) {
      const modal = document.getElementById(modalId);
      if (modal) modal.classList.remove("open");
    },

    finishExam() {
      this.closeModal("modal-finish");
      clearInterval(this.timerInterval);

      const elapsedSeconds = Math.max(1, this.examDurationSeconds - this.timeRemaining);
      const minutesSpent = Math.floor(elapsedSeconds / 60);
      const secondsSpent = elapsedSeconds % 60;

      // Calculate score for each question
      let totalPoints = 0;
      let countFull = 0;
      let countPartial = 0;
      let countZero = 0;
      const failedIds = new Set(this.getStoredFailedIds());

      const topicStats = {}; // topic -> { earned: 0, max: 0 }

      const questionReviews = this.examQuestions.map((q, idx) => {
        const selected = this.userAnswers[idx] || new Set();
        const score = this.calculateMoodleScore(q.correctas, q.opciones.length, selected);

        totalPoints += score;

        if (score === 100) {
          countFull++;
          failedIds.delete(q.id); // Mastered!
        } else if (score > 0) {
          countPartial++;
          failedIds.add(q.id);
        } else {
          countZero++;
          failedIds.add(q.id);
        }

        // Topic stats
        if (!topicStats[q.tema]) {
          topicStats[q.tema] = { earned: 0, max: 0 };
        }
        topicStats[q.tema].earned += score;
        topicStats[q.tema].max += 100;

        return {
          question: q,
          selectedIndices: Array.from(selected),
          score: score
        };
      });

      // Overall Score
      const finalScore = Math.round(totalPoints / this.examQuestions.length);

      // Store results
      this.examResults = {
        date: new Date().toISOString(),
        score: finalScore,
        preset: this.selectedPreset,
        totalQuestions: this.examQuestions.length,
        timeFormatted: `${minutesSpent}m ${secondsSpent}s`,
        countFull,
        countPartial,
        countZero,
        topicStats,
        reviews: questionReviews
      };

      // Save to localStorage history
      this.saveAttemptToHistory(this.examResults);

      // Save failed IDs
      localStorage.setItem("ia_quiz_failed_ids", JSON.stringify(Array.from(failedIds)));
      this.updateFailedButtonVisibility();

      // Update Spaced Repetition (SRS) & Gamification cleanly AFTER exam finishes
      this.lastExamReward = this.recordExamStudyOutcome(questionReviews, finalScore, this.selectedPreset);

      // Render Results View
      this.renderGlobalStudyHud();
      this.renderResults();
      this.navigate("results");
    },

    saveAttemptToHistory(res) {
      try {
        const raw = localStorage.getItem("ia_quiz_history");
        const list = raw ? JSON.parse(raw) : [];
        list.unshift({
          date: res.date,
          score: res.score,
          preset: res.preset,
          totalQuestions: res.totalQuestions,
          timeFormatted: res.timeFormatted
        });
        localStorage.setItem("ia_quiz_history", JSON.stringify(list.slice(0, 30)));
      } catch (e) {
        console.error("Error guardando historial:", e);
      }
    },

    // -------------------------------------------------------------
    // Results Rendering
    // -------------------------------------------------------------
    renderResults() {
      const res = this.examResults;
      if (!res) return;

      const scoreNum = document.getElementById("res-score-number");
      if (scoreNum) scoreNum.textContent = `${res.score}%`;

      const statusBadge = document.getElementById("res-status-badge");
      const statusText = document.getElementById("res-status-text");

      if (res.score >= 80) {
        if (statusBadge) {
          statusBadge.className = "score-badge-status score-promocionado";
          statusBadge.textContent = "¡PROMOCIONADO! 🚀";
        }
        if (statusText) {
          statusText.textContent = "Has superado con holgura el umbral del 80% exigido por la Cátedra para la Promoción Directa del Segundo Parcial.";
        }
      } else if (res.score >= 60) {
        if (statusBadge) {
          statusBadge.className = "score-badge-status score-aprobado";
          statusBadge.textContent = "¡APROBADO! 👍";
        }
        if (statusText) {
          statusText.textContent = "Alcanzaste el umbral de Aprobación / Regularidad (60%-79%). Estás muy cerca de la promoción, repasa los ejes flojos.";
        }
      } else {
        if (statusBadge) {
          statusBadge.className = "score-badge-status score-no-alcanzado";
          statusBadge.textContent = "NO ALCANZADO ⚠️";
        }
        if (statusText) {
          statusText.textContent = "Obtuviste menos del 60%. Enfócate en los temas con menor puntaje antes del examen del 18/11.";
        }
      }

      // Stats
      document.getElementById("stat-correct").textContent = res.countFull;
      document.getElementById("stat-partial").textContent = res.countPartial;
      document.getElementById("stat-wrong").textContent = res.countZero;
      document.getElementById("stat-time").textContent = res.timeFormatted;

      // Post-exam Gamification & SRS Delta Strip
      const rewardEl = document.getElementById("res-gamification-summary");
      if (rewardEl) {
        const rw = this.lastExamReward;
        if (rw) {
          const streakNow = window.StudyEngine ? StudyEngine.getEffectiveStreak(this.gamif) : 0;
          const lvl = window.StudyEngine ? StudyEngine.getLevelInfo(this.gamif.xp) : { level: 1, title: "", icon: "⭐" };
          const achBadges = (rw.newlyUnlocked || [])
            .map((a) => `<span class="badge" style="background: var(--success-bg); color: var(--success); border: 1px solid rgba(16,185,129,0.4);">🏅 Logro: ${this.escapeHtml(a.title)}</span>`)
            .join("");
          rewardEl.innerHTML = `
            <div class="study-hud-card card" style="margin-bottom: 0;">
              <div class="study-hud-top" style="margin-bottom: ${achBadges ? "0.5rem" : "0"};">
                <div class="hud-level-block">
                  <div class="hud-level-icon">${lvl.icon}</div>
                  <div>
                    <div class="hud-level-title">+${rw.xpGained} XP ganados${rw.leveledUp ? ` · ¡Subiste a Nv. ${lvl.level}: ${this.escapeHtml(lvl.title)}!` : ""}</div>
                    <div class="hud-level-sub">
                      <span>🧠 ${rw.srsUpdatedCount} tarjetas actualizadas en Repetición Espaciada</span>
                      ${rw.recoveredCount > 0 ? `<span>· ⚔️ ${rw.recoveredCount} recuperadas</span>` : ""}
                    </div>
                  </div>
                </div>
                <div class="hud-stat-pills">
                  <span class="hud-pill streak-hot">🔥 Racha: ${streakNow} ${streakNow === 1 ? "día" : "días"}</span>
                  <span class="hud-pill">⭐ ${this.gamif.xp} XP totales</span>
                </div>
              </div>
              ${achBadges ? `<div style="display:flex;flex-wrap:wrap;gap:0.4rem;">${achBadges}</div>` : ""}
            </div>
          `;
        } else {
          rewardEl.innerHTML = "";
        }
      }

      // Topic Breakdown
      const topicsList = document.getElementById("res-topics-list");
      if (topicsList) {
        topicsList.innerHTML = "";
        for (const [tema, data] of Object.entries(res.topicStats)) {
          const pct = Math.round((data.earned / data.max) * 100);
          const color = pct >= 80 ? "var(--success)" : pct >= 60 ? "var(--primary)" : "var(--danger)";

          const row = document.createElement("div");
          row.className = "topic-row";
          row.innerHTML = `
            <div class="topic-name" title="${TOPIC_NAMES[tema] || tema}">${TOPIC_NAMES[tema] || tema}</div>
            <div class="topic-bar-bg">
              <div class="topic-bar-fill" style="width: ${pct}%; background-color: ${color};"></div>
            </div>
            <div class="topic-score" style="color: ${color};">${pct}%</div>
          `;
          topicsList.appendChild(row);
        }
      }

      // Detailed Review Cards
      this.renderReviewCards("all");
    },

    renderReviewCards(filter) {
      const container = document.getElementById("res-review-container");
      if (!container || !this.examResults) return;
      container.innerHTML = "";

      const reviews = this.examResults.reviews;
      reviews.forEach((r, idx) => {
        if (filter === "failed" && r.score === 100) return;

        const q = r.question;
        const selectedSet = new Set(r.selectedIndices);
        const correctSet = new Set(q.correctas);

        const card = document.createElement("div");
        let statusClass = "fail";
        let statusLabel = "0 pts";
        if (r.score === 100) {
          statusClass = "pass";
          statusLabel = "100 pts (Correcta)";
        } else if (r.score > 0) {
          statusClass = "partial";
          statusLabel = `${r.score} pts (Parcial)`;
        }
        card.className = `review-item ${statusClass}`;

        let optionsHtml = "";
        q.opciones.forEach((optText, oIdx) => {
          const isSelected = selectedSet.has(oIdx);
          const isCorrectKey = correctSet.has(oIdx);

          let optClass = "";
          let icon = "⚪";

          if (isCorrectKey && isSelected) {
            optClass = "is-correct-key";
            icon = "✅ <strong>[Correcta Elegida]</strong>";
          } else if (isCorrectKey && !isSelected) {
            optClass = "is-correct-key";
            icon = "🟢 <strong>[Era Correcta — No la marcaste]</strong>";
          } else if (!isCorrectKey && isSelected) {
            optClass = "is-wrong-selection";
            icon = "❌ <strong>[Incorrecta Elegida — Penalizó puntos]</strong>";
          } else {
            icon = "⚪";
          }

          optionsHtml += `
            <div class="option-review ${optClass}">
              <span>${icon}</span>
              <div>${this.formatRichText(optText)}</div>
            </div>
          `;
        });

        card.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
            <div>
              <span class="badge badge-topic">${TOPIC_NAMES[q.tema] || q.tema}</span>
              ${this.renderHistoricalBadgesHtml(q)}
              <span style="font-size: 0.85rem; color: var(--text-muted); margin-left: 0.5rem;">Pregunta ${idx + 1} (${q.id})</span>
            </div>
            <span style="font-weight: 800; font-family: var(--font-mono);">${statusLabel}</span>
          </div>

          <div style="font-size: 1.05rem; font-weight: 600; margin-bottom: 1rem;">${this.formatRichText(q.enunciado)}</div>

          <div style="margin-bottom: 1rem;">
            ${optionsHtml}
          </div>

          <div class="justification-box">
            <div class="justification-title">
              <span>📖 Justificación Doctrinal Oficial de Cátedra:</span>
            </div>
            <div>${this.formatRichText(q.explicacion)}</div>
            ${this.renderHistoricalRefHtml(q)}
          </div>

          <div class="question-footer-toolbar">
            <button class="btn btn-outline btn-sm" onclick="app.openQuestionFeedback('${q.id}')">
              💬 Debatir / Reportar
            </button>
            <button class="btn btn-outline btn-sm" onclick="app.copyQuestionToClipboard('${q.id}')" title="Copiar pregunta formateada">
              📋 Copiar
            </button>
          </div>
        `;

        container.appendChild(card);
        this.renderMath(card);
      });
    },

    filterReview(filter) {
      this.renderReviewCards(filter);
    },

    // -------------------------------------------------------------
    // Practice Mode Engine (with SM-2 Spaced Repetition Queue)
    // -------------------------------------------------------------
    getSmartPracticePool() {
      if (!window.StudyEngine) return [...this.allQuestions];
      return StudyEngine.getScopedQuestions(this.allQuestions, {
        includeP1: this.includeP1,
        includeSVM: this.includeSVM
      });
    },

    updateSmartPracticeFilterLabel() {
      const btn = document.getElementById("practice-btn-SMART_SRS");
      if (!btn || !window.StudyEngine) return;
      const pool = this.getSmartPracticePool();
      const qInfo = StudyEngine.buildSmartSrsQueue(pool, this.srsMap, Date.now());
      const pending = qInfo.dueCount + qInfo.newCount;
      btn.textContent = `🧠 Repaso Espaciado (${pending})`;
    },

    startSmartPractice() {
      this.practiceAllowAllCaughtUpFallback = false;
      this.navigate("practice");
      this.filterPracticeTopic("SMART_SRS");
    },

    practiceTopicDirect(topicKey) {
      this.navigate("practice");
      this.filterPracticeTopic(topicKey || "ALL");
    },

    practiceUpcomingAnyway() {
      this.practiceAllowAllCaughtUpFallback = true;
      this.filterPracticeTopic("SMART_SRS");
    },

    initPracticeMode() {
      const filterBar = document.getElementById("practice-filter-bar");
      if (!filterBar) return;
      filterBar.innerHTML = "";

      // Compute topic counts
      const counts = { ALL: this.allQuestions.length };
      this.allQuestions.forEach((q) => {
        counts[q.tema] = (counts[q.tema] || 0) + 1;
      });

      // Botón Repaso Espaciado (Anki SM-2)
      const smartBtn = document.createElement("button");
      smartBtn.className = "filter-btn";
      smartBtn.id = "practice-btn-SMART_SRS";
      smartBtn.style.borderColor = "var(--success)";
      smartBtn.style.fontWeight = "700";
      smartBtn.onclick = () => {
        this.practiceAllowAllCaughtUpFallback = false;
        this.filterPracticeTopic("SMART_SRS");
      };
      filterBar.appendChild(smartBtn);
      this.updateSmartPracticeFilterLabel();

      // "ALL" button
      const allBtn = document.createElement("button");
      allBtn.className = "filter-btn active";
      allBtn.id = "practice-btn-ALL";
      allBtn.textContent = `Todos (${counts.ALL})`;
      allBtn.onclick = () => this.filterPracticeTopic("ALL");
      filterBar.appendChild(allBtn);

      // Botón especial Oficial 2025
      const count2025 = this.allQuestions.filter((q) => this.matchesYearFilter(q, "PARCIAL_2025")).length;
      if (count2025 > 0) {
        const btn2025 = document.createElement("button");
        btn2025.className = "filter-btn";
        btn2025.id = "practice-btn-YEAR_2025";
        btn2025.style.borderColor = "var(--primary)";
        btn2025.style.fontWeight = "700";
        btn2025.textContent = `⭐ Parcial Moodle 2025 (${count2025})`;
        btn2025.onclick = () => this.filterPracticeTopic("YEAR_2025");
        filterBar.appendChild(btn2025);
      }

      // Buttons for each topic
      Object.keys(TOPIC_NAMES).forEach((tKey) => {
        if (!counts[tKey]) return;
        const btn = document.createElement("button");
        btn.className = "filter-btn";
        btn.id = `practice-btn-${tKey}`;
        btn.textContent = `${TOPIC_NAMES[tKey]} (${counts[tKey]})`;
        btn.onclick = () => this.filterPracticeTopic(tKey);
        filterBar.appendChild(btn);
      });

      this.filterPracticeTopic("ALL");
    },

    filterPracticeTopic(topicKey) {
      this.practiceSelectedTopic = topicKey;
      this.practiceQueueMeta = null;

      document.querySelectorAll(".filter-btn").forEach((btn) => {
        btn.classList.toggle("active", btn.id === `practice-btn-${topicKey}`);
      });

      if (topicKey === "SMART_SRS" && window.StudyEngine) {
        const pool = this.getSmartPracticePool();
        const qInfo = StudyEngine.buildSmartSrsQueue(pool, this.srsMap, Date.now(), {
          includeNotDueFallback: this.practiceAllowAllCaughtUpFallback
        });
        this.practiceQueueMeta = qInfo;
        this.practiceQuestions = qInfo.queue;
      } else if (topicKey === "ALL") {
        this.practiceQuestions = [...this.allQuestions];
      } else if (topicKey === "YEAR_2025") {
        this.practiceQuestions = this.allQuestions.filter((q) => this.matchesYearFilter(q, "PARCIAL_2025"));
      } else {
        this.practiceQuestions = this.allQuestions.filter((q) => q.tema === topicKey);
      }

      this.practiceIndex = 0;
      this.practiceAnswers = {};
      this.practiceEvaluated = {};
      this.practiceTurnBaseline = {};
      this.practiceTurnRating = {};
      this.practiceXpAwardedIds = new Set();
      this.practiceRequeuedTurns = new Set();
      this.practiceVerifiedCount = 0;
      this.renderPracticeHud();
      this.renderPracticeQuestion();
    },

    renderPracticeHud() {
      const hud = document.getElementById("practice-hud");
      if (!hud || !window.StudyEngine || !this.gamif) return;

      const total = this.practiceQuestions.length;
      const pos = total > 0 ? Math.min(total, this.practiceIndex + 1) : 0;
      const pct = total > 0 ? Math.round((pos / total) * 100) : 100;
      const todayKey = StudyEngine.getLocalDateKey();
      const todayCount = (this.gamif.dailyActions && this.gamif.dailyActions[todayKey]) || 0;
      const goal = this.gamif.dailyGoal || 15;
      const streak = StudyEngine.getEffectiveStreak(this.gamif);
      const combo = this.gamif.practiceCombo || 0;
      const qMeta = this.practiceQueueMeta;

      const queueLabel = this.practiceSelectedTopic === "SMART_SRS" && qMeta
        ? `🧠 Cola Anki · ${qMeta.dueCount} vencidas/repaso · ${qMeta.newCount} nuevas · ${qMeta.rebeldesCount} rebeldes`
        : `📘 Progreso del mazo actual: ${pos} de ${total} · Verificadas en sesión: ${this.practiceVerifiedCount}`;

      hud.innerHTML = `
        <div class="practice-hud-row">
          <div><strong>${queueLabel}</strong></div>
          <div class="hud-stat-pills">
            ${combo >= 2 ? `<span class="combo-pill ${combo >= 5 ? "hot" : ""}">⚡ Racha de aciertos x${combo}</span>` : ""}
            <span class="hud-pill ${todayCount >= goal ? "goal-done" : ""}">🎯 Meta hoy: ${todayCount}/${goal}</span>
            <span class="hud-pill ${streak > 0 ? "streak-hot" : ""}">🔥 ${streak} ${streak === 1 ? "día" : "días"}</span>
          </div>
        </div>
        <div class="progress-container" style="margin-top: 0.2rem;">
          <div class="progress-bar" style="width: ${pct}%;"></div>
        </div>
      `;
    },

    renderAnkiStatusChipHtml(card) {
      if (!window.StudyEngine) return "";
      const c = card || StudyEngine.createEmptyCard();
      if (!c.lastReviewedAt || c.status === "new") {
        return `<span class="anki-status-chip">✨ Nueva en Anki</span>`;
      }
      if (StudyEngine.isCardMastered(c)) {
        return `<span class="anki-status-chip mastered">✅ Dominada · Próx. ${StudyEngine.formatIntervalLabel(c.intervalHours, 4)}</span>`;
      }
      if (c.lapses > 0) {
        return `<span class="anki-status-chip relearning">⚔️ Rebelde (${c.lapses} ${c.lapses === 1 ? "fallo" : "fallos"}) · Próx. ${StudyEngine.formatIntervalLabel(c.intervalHours, c.lastRating)}</span>`;
      }
      return `<span class="anki-status-chip learning">🧠 En aprendizaje · Próx. ${StudyEngine.formatIntervalLabel(c.intervalHours, c.lastRating)}</span>`;
    },

    buildAnkiButtonsHtml({ cardBefore, moodleScore, selectedRating, handlerName, itemArg, hintText }) {
      if (!window.StudyEngine) return "";
      const previews = StudyEngine.previewIntervals(cardBefore, moodleScore, Date.now());
      const suggested = typeof moodleScore === "number" ? StudyEngine.ratingFromMoodleScore(moodleScore) : null;
      const defs = [
        { r: 1, cls: "anki-again", icon: "🔁", label: "Otra vez" },
        { r: 2, cls: "anki-hard", icon: "😅", label: "Difícil" },
        { r: 3, cls: "anki-good", icon: "👍", label: "Bien" },
        { r: 4, cls: "anki-easy", icon: "⚡", label: "Fácil" }
      ];
      const argPrefix = (itemArg !== undefined && itemArg !== null)
        ? `'${String(itemArg).replace(/'/g, "\\'")}', `
        : "";
      const buttons = defs.map((d) => {
        const isSelected = Number(selectedRating) === d.r;
        const isSuggested = !isSelected && Number(suggested) === d.r;
        const classes = ["anki-btn", d.cls, isSelected ? "selected" : "", isSuggested ? "suggested" : ""]
          .filter(Boolean)
          .join(" ");
        return `
          <button type="button" class="${classes}" onclick="${handlerName}(${argPrefix}${d.r})">
            <span class="anki-btn-label">${d.icon} ${d.label}</span>
            <span class="anki-btn-interval">${this.escapeHtml(previews[d.r])}</span>
          </button>
        `;
      }).join("");

      const chipTarget = (selectedRating || suggested)
        ? StudyEngine.computeNextSrsState(cardBefore, selectedRating || suggested, moodleScore, Date.now())
        : null;
      const chipHtml = chipTarget
        ? this.renderAnkiStatusChipHtml(chipTarget)
        : (cardBefore && cardBefore.reps > 0)
          ? this.renderAnkiStatusChipHtml(cardBefore)
          : `<span class="anki-status-chip learning">🆕 Nueva · Elegí tu recuerdo</span>`;

      return `
        <div class="anki-rating-box">
          <div class="anki-rating-header">
            <span><strong>🧠 Repetición Espaciada (Estilo Anki)</strong> — ${this.escapeHtml(hintText || "Ajustá cuándo volver a verla según cuánto te costó:")}</span>
            ${chipHtml}
          </div>
          <div class="anki-rating-grid">${buttons}</div>
        </div>
      `;
    },

    shiftPracticeIndicesFrom(insertAt) {
      const shiftMap = (obj) => {
        const next = {};
        Object.keys(obj).forEach((kStr) => {
          const k = Number(kStr);
          next[k >= insertAt ? k + 1 : k] = obj[kStr];
        });
        return next;
      };
      this.practiceAnswers = shiftMap(this.practiceAnswers);
      this.practiceEvaluated = shiftMap(this.practiceEvaluated);
      this.practiceTurnBaseline = shiftMap(this.practiceTurnBaseline);
      this.practiceTurnRating = shiftMap(this.practiceTurnRating);
      const nextSet = new Set();
      this.practiceRequeuedTurns.forEach((k) => {
        nextSet.add(k >= insertAt ? k + 1 : k);
      });
      this.practiceRequeuedTurns = nextSet;
    },

    renderPracticeQuestion() {
      const container = document.getElementById("practice-container");
      if (!container) return;

      if (this.practiceQuestions.length === 0) {
        if (this.practiceSelectedTopic === "SMART_SRS") {
          container.innerHTML = `
            <div class="card" style="text-align: center; padding: 2.25rem 1.5rem;">
              <div style="font-size: 2.4rem; margin-bottom: 0.5rem;">🎉</div>
              <h2 style="margin-bottom: 0.5rem;">¡Mazo de Repaso Espaciado al día!</h2>
              <p style="color: var(--text-muted); max-width: 560px; margin: 0 auto 1.25rem;">
                No tenés tarjetas vencidas ni nuevas pendientes en tu alcance actual. Podés repasar igual las programadas a futuro o hacer un simulacro cronometrado.
              </p>
              <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 0.65rem;">
                <button class="btn btn-primary" onclick="app.practiceUpcomingAnyway()">🔁 Repasar tarjetas futuras igual</button>
                <button class="btn btn-outline" onclick="app.navigate('home')">🚀 Ir a Simulacro</button>
              </div>
            </div>
          `;
          return;
        }
        container.innerHTML = `<p style="color: var(--text-muted); text-align: center; padding: 2rem;">No hay preguntas para este tema.</p>`;
        return;
      }

      const q = this.practiceQuestions[this.practiceIndex];
      const selectedSet = this.practiceAnswers[this.practiceIndex] || new Set();
      const isChecked = Boolean(this.practiceEvaluated[this.practiceIndex]);

      let score = 0;
      if (isChecked) {
        score = this.calculateMoodleScore(q.correctas, q.opciones.length, selectedSet);
      }

      let optionsHtml = "";
      const correctSet = new Set(q.correctas);

      q.opciones.forEach((optText, oIdx) => {
        const isSelected = selectedSet.has(oIdx);
        let optClass = isSelected ? "selected" : "";
        let feedbackBadge = "";

        if (isChecked) {
          if (correctSet.has(oIdx) && isSelected) {
            optClass = "is-correct-key";
            feedbackBadge = `<span style="color: var(--success); font-weight: bold; margin-left: auto;">✅ +${(100 / q.correctas.length).toFixed(1)}%</span>`;
          } else if (correctSet.has(oIdx) && !isSelected) {
            optClass = "is-correct-key";
            feedbackBadge = `<span style="color: var(--success); font-weight: bold; margin-left: auto;">🟢 Clave Correcta</span>`;
          } else if (!correctSet.has(oIdx) && isSelected) {
            optClass = "is-wrong-selection";
            const pen = (100 / (q.opciones.length - q.correctas.length)).toFixed(1);
            feedbackBadge = `<span style="color: var(--danger); font-weight: bold; margin-left: auto;">❌ -${pen}%</span>`;
          }
        }

        optionsHtml += `
          <div class="option-item ${optClass}" onclick="app.togglePracticeOption(${oIdx})">
            <input type="checkbox" class="option-checkbox" ${isSelected ? "checked" : ""} ${isChecked ? "disabled" : ""}>
            <div class="option-text">${this.formatRichText(optText)}</div>
            ${feedbackBadge}
          </div>
        `;
      });

      const ankiBoxHtml = isChecked && window.StudyEngine
        ? this.buildAnkiButtonsHtml({
            cardBefore: this.practiceTurnBaseline[this.practiceIndex] || this.srsMap[q.id],
            moodleScore: score,
            selectedRating: this.practiceTurnRating[this.practiceIndex] || StudyEngine.ratingFromMoodleScore(score),
            handlerName: "app.ratePracticeAnki",
            hintText: this.practiceRequeuedTurns.has(this.practiceIndex)
              ? "Re-encolada en esta sesión para volver a practicarla:"
              : "Elegí qué tan difícil te resultó para ajustar su frecuencia:"
          })
        : "";

      const justificationHtml = isChecked
        ? `
        <div class="justification-box" style="margin-top: 1.25rem;">
          <div class="justification-title">
            <span>💡 Justificación Doctrinal de Cátedra:</span>
            <span style="margin-left: auto; font-family: var(--font-mono); font-weight: 800; font-size: 1rem; color: ${
              score >= 80 ? "var(--success)" : score > 0 ? "var(--warning)" : "var(--danger)"
            };">
              Puntaje: ${score} / 100
            </span>
          </div>
          <div>${this.formatRichText(q.explicacion)}</div>
          ${ankiBoxHtml}
          ${this.renderHistoricalRefHtml(q)}
        </div>
      `
        : "";

      container.innerHTML = `
        <div class="question-box">
          <div class="question-header">
            <div>
              <span class="badge badge-topic">${TOPIC_NAMES[q.tema] || q.tema}</span>
              ${isChecked ? this.renderHistoricalBadgesHtml(q) : ""}
              <span style="font-size: 0.85rem; color: var(--text-muted); margin-left: 0.5rem;">
                Pregunta ${this.practiceIndex + 1} de ${this.practiceQuestions.length}
              </span>
            </div>
            <span style="font-size: 0.8rem; color: var(--text-muted);">
              Seleccione una o más opciones
            </span>
          </div>

          <div class="question-prompt" id="practice-prompt">
            ${this.formatRichText(q.enunciado)}
          </div>

          <div class="options-list" id="practice-options">
            ${optionsHtml}
          </div>

          ${justificationHtml}

          <div class="question-footer-toolbar">
            <button class="btn btn-outline btn-sm" onclick="app.openQuestionFeedback('${q.id}')">
              💬 Debatir / Reportar
            </button>
            <button class="btn btn-outline btn-sm" onclick="app.copyQuestionToClipboard('${q.id}')" title="Copiar pregunta formateada">
              📋 Copiar
            </button>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid var(--border-color);">
            <button class="btn btn-outline" ${this.practiceIndex === 0 ? "disabled" : ""} onclick="app.prevPracticeQuestion()">
              ← Anterior
            </button>

            <div style="display: flex; gap: 0.5rem;">
              ${
                !isChecked
                  ? `<button class="btn btn-primary" onclick="app.checkPracticeCurrent()">Verificar Respuesta</button>`
                  : `<button class="btn btn-outline" onclick="app.resetPracticeCurrent()">Reintentar</button>`
              }
            </div>

            <button class="btn btn-outline" ${
              this.practiceIndex === this.practiceQuestions.length - 1 ? "disabled" : ""
            } onclick="app.nextPracticeQuestion()">
              Siguiente →
            </button>
          </div>
        </div>
      `;

      this.renderMath(container);
    },

    togglePracticeOption(oIdx) {
      if (this.practiceEvaluated[this.practiceIndex]) return; // lock once checked
      if (!this.practiceAnswers[this.practiceIndex]) {
        this.practiceAnswers[this.practiceIndex] = new Set();
      }
      const set = this.practiceAnswers[this.practiceIndex];
      if (set.has(oIdx)) {
        set.delete(oIdx);
      } else {
        set.add(oIdx);
      }
      this.renderPracticeQuestion();
    },

    checkPracticeCurrent() {
      const idx = this.practiceIndex;
      const q = this.practiceQuestions[idx];
      if (!q) return;

      this.practiceEvaluated[idx] = true;
      this.practiceVerifiedCount += 1;

      if (window.StudyEngine) {
        const selectedSet = this.practiceAnswers[idx] || new Set();
        const score = this.calculateMoodleScore(q.correctas, q.opciones.length, selectedSet);
        const now = Date.now();

        if (!this.practiceTurnBaseline[idx]) {
          this.practiceTurnBaseline[idx] = StudyEngine.cloneCard(this.srsMap[q.id]);
        }
        const prevCard = this.practiceTurnBaseline[idx];
        const autoRating = StudyEngine.ratingFromMoodleScore(score);
        const nextCard = StudyEngine.computeNextSrsState(prevCard, autoRating, score, now);
        this.srsMap[q.id] = nextCard;
        this.practiceTurnRating[idx] = autoRating;

        // Track failed IDs legacy sync cleanly
        const failedSet = new Set(this.getStoredFailedIds());
        if (score === 100) {
          failedSet.delete(q.id);
        } else {
          failedSet.add(q.id);
        }
        localStorage.setItem("ia_quiz_failed_ids", JSON.stringify(Array.from(failedSet)));
        this.updateFailedButtonVisibility();

        // Gamification with anti-farm guard (1 XP award per question ID per session pass, or if re-queued later)
        const xpKey = `${idx}:${q.id}`;
        if (!this.practiceXpAwardedIds.has(xpKey) && this.gamif) {
          this.practiceXpAwardedIds.add(xpKey);
          const { dailyBonusXp } = StudyEngine.applyStudyTouch(this.gamif, now, 1);
          this.gamif.totalReviews = (this.gamif.totalReviews || 0) + 1;

          let earnedXp = dailyBonusXp;
          if (score >= 100) earnedXp += 30;
          else if (score >= 80) earnedXp += 20;
          else if (score >= 60) earnedXp += 10;
          else earnedXp += 5; // effort XP for attempting & reading justification

          if ((prevCard.lapses > 0 || prevCard.status === "relearning") && score >= 80) {
            earnedXp += 10;
            this.gamif.recoveredCount = (this.gamif.recoveredCount || 0) + 1;
          }

          if (score >= 80) {
            this.gamif.practiceCombo = (this.gamif.practiceCombo || 0) + 1;
            if (this.gamif.practiceCombo > (this.gamif.bestPracticeCombo || 0)) {
              this.gamif.bestPracticeCombo = this.gamif.practiceCombo;
            }
          } else {
            this.gamif.practiceCombo = 0;
          }

          const prevLvl = StudyEngine.getLevelInfo(this.gamif.xp).level;
          this.gamif.xp = (this.gamif.xp || 0) + earnedXp;
          const nextLvl = StudyEngine.getLevelInfo(this.gamif.xp);
          const summary = this.getStudySummary(now);
          const unlocked = StudyEngine.evaluateAchievements(this.gamif, summary, now);

          if (unlocked.length > 0) {
            this.showToast(`🏅 ¡Logro desbloqueado: ${unlocked[0].title}!`);
          } else if (nextLvl.level > prevLvl) {
            this.showToast(`${nextLvl.icon} ¡Subiste al Nivel ${nextLvl.level}: ${nextLvl.title}!`);
          } else if (this.gamif.practiceCombo >= 3 && score >= 80) {
            this.showToast(`⚡ ¡Racha x${this.gamif.practiceCombo}! +${earnedXp} XP`);
          }
        }

        this.saveStudyState();
        this.renderGlobalStudyHud();
        this.updateSmartPracticeFilterLabel();
        this.renderPracticeHud();
      }

      this.renderPracticeQuestion();
    },

    ratePracticeAnki(rating) {
      const idx = this.practiceIndex;
      const q = this.practiceQuestions[idx];
      if (!q || !window.StudyEngine || !this.practiceEvaluated[idx]) return;

      const selectedSet = this.practiceAnswers[idx] || new Set();
      const score = this.calculateMoodleScore(q.correctas, q.opciones.length, selectedSet);
      const baseline = this.practiceTurnBaseline[idx] || StudyEngine.createEmptyCard();
      const now = Date.now();
      const nextCard = StudyEngine.computeNextSrsState(baseline, rating, score, now);
      this.srsMap[q.id] = nextCard;
      this.practiceTurnRating[idx] = rating;

      if (rating === 1 && this.practiceSelectedTopic === "SMART_SRS" && !this.practiceRequeuedTurns.has(idx)) {
        this.practiceRequeuedTurns.add(idx);
        const insertAt = Math.min(this.practiceQuestions.length, idx + 4);
        this.practiceQuestions.splice(insertAt, 0, q);
        this.shiftPracticeIndicesFrom(insertAt);
        this.showToast("🔁 Tarjeta re-encolada para volver a verla en esta sesión");
      } else {
        const nextTxt = StudyEngine.formatIntervalLabel(nextCard.intervalHours, rating);
        this.showToast(`🧠 Programada en Repetición Espaciada (${nextTxt})`);
      }

      this.saveStudyState();
      this.renderGlobalStudyHud();
      this.updateSmartPracticeFilterLabel();
      this.renderPracticeHud();
      this.renderPracticeQuestion();
    },

    resetPracticeCurrent() {
      delete this.practiceEvaluated[this.practiceIndex];
      if (this.practiceAnswers[this.practiceIndex]) {
        this.practiceAnswers[this.practiceIndex].clear();
      }
      this.renderPracticeQuestion();
    },

    prevPracticeQuestion() {
      if (this.practiceIndex > 0) {
        this.practiceIndex--;
        this.renderPracticeHud();
        this.renderPracticeQuestion();
      }
    },

    nextPracticeQuestion() {
      if (this.practiceIndex < this.practiceQuestions.length - 1) {
        this.practiceIndex++;
        this.renderPracticeHud();
        this.renderPracticeQuestion();
      }
    },

    // -------------------------------------------------------------
    // Study Engine, SRS Persistence, Gamification & Ranking
    // -------------------------------------------------------------
    initStudyState() {
      this.labCardSessionRating = {};
      if (!window.StudyEngine) {
        this.srsMap = {};
        this.gamif = null;
        this.groupLeaderboard = [];
        return;
      }

      const rawSrs = localStorage.getItem("ia_srs_v1");
      const rawGamif = localStorage.getItem("ia_gamification_v1");
      const rawGroup = localStorage.getItem("ia_group_leaderboard_v1");
      const rawGhCache = localStorage.getItem("ia_github_rank_cache_v1");

      try {
        const parsedSrs = rawSrs ? JSON.parse(rawSrs) : {};
        this.srsMap = parsedSrs && typeof parsedSrs === "object" && !Array.isArray(parsedSrs) ? parsedSrs : {};
      } catch (e) {
        this.srsMap = {};
      }

      try {
        const parsedGamif = rawGamif ? JSON.parse(rawGamif) : null;
        this.gamif = StudyEngine.normalizeGamification(parsedGamif);
      } catch (e) {
        this.gamif = StudyEngine.createDefaultGamification();
      }

      try {
        const parsedGroup = rawGroup ? JSON.parse(rawGroup) : [];
        this.groupLeaderboard = Array.isArray(parsedGroup)
          ? parsedGroup.filter((entry) => entry && entry.code && StudyEngine.decodeRankCode(entry.code))
          : [];
      } catch (e) {
        this.groupLeaderboard = [];
      }

      try {
        const parsedCache = rawGhCache ? JSON.parse(rawGhCache) : null;
        if (parsedCache && Array.isArray(parsedCache.rows)) {
          this.githubLeaderboard = parsedCache.rows;
          this.githubLeaderboardFetchedAt = Number(parsedCache.fetchedAt || 0);
          this.githubLeaderboardStatus = "ready";
        } else {
          this.githubLeaderboard = [];
          this.githubLeaderboardFetchedAt = 0;
          this.githubLeaderboardStatus = "idle";
        }
      } catch (e) {
        this.githubLeaderboard = [];
        this.githubLeaderboardFetchedAt = 0;
        this.githubLeaderboardStatus = "idle";
      }

      const migrated = this.migrateLegacyStudyData(!rawSrs, !rawGamif);
      const now = Date.now();
      const summary = this.getStudySummary(now);
      const newlyUnlocked = StudyEngine.evaluateAchievements(this.gamif, summary, now);
      if (migrated || newlyUnlocked.length > 0) {
        this.saveStudyState();
      }
    },

    migrateLegacyStudyData(shouldMigrateSrs, shouldMigrateGamif) {
      let changed = false;
      if (shouldMigrateSrs) {
        try {
          const failedRaw = localStorage.getItem("ia_quiz_failed_ids");
          const failedIds = failedRaw ? JSON.parse(failedRaw) : [];
          if (Array.isArray(failedIds) && failedIds.length > 0) {
            failedIds.forEach((id) => {
              if (!this.srsMap[id]) {
                this.srsMap[id] = {
                  ...StudyEngine.createEmptyCard(),
                  status: "relearning",
                  lapses: 1,
                  ease: 2.35,
                  intervalHours: 0,
                  nextReviewAt: 0,
                  lastScore: 0,
                  lastRating: 1
                };
                changed = true;
              }
            });
          }
        } catch (e) {
          // Ignore malformed legacy failed IDs
        }
      }

      if (shouldMigrateGamif && (this.gamif.totalExams || 0) === 0) {
        try {
          const histRaw = localStorage.getItem("ia_quiz_history");
          const hist = histRaw ? JSON.parse(histRaw) : [];
          if (Array.isArray(hist) && hist.length > 0) {
            this.gamif.totalExams = hist.length;
            hist.forEach((attempt) => {
              const s = Number(attempt?.score || 0);
              const preset = String(attempt?.preset || "");
              if (preset === "2025") {
                this.gamif.best2025Score = Math.max(this.gamif.best2025Score || 0, s);
              }
              if (preset === "oficial" || preset === "2025" || preset === "completo") {
                this.gamif.bestExamScore = Math.max(this.gamif.bestExamScore || 0, s);
              }
            });
            this.gamif.xp = Math.max(this.gamif.xp || 0, Math.min(hist.length * 40, 320));
            changed = true;
          }
        } catch (e) {
          // Ignore malformed legacy history
        }
      }
      return changed;
    },

    saveStudyState() {
      if (!window.StudyEngine) return;
      try {
        localStorage.setItem("ia_srs_v1", JSON.stringify(this.srsMap || {}));
        localStorage.setItem("ia_gamification_v1", JSON.stringify(this.gamif || StudyEngine.createDefaultGamification()));
        localStorage.setItem("ia_group_leaderboard_v1", JSON.stringify(this.groupLeaderboard || []));
      } catch (e) {
        // Ignore storage quota errors gracefully
      }
    },

    getStudySummary(nowMs = Date.now()) {
      if (!window.StudyEngine) return null;
      return StudyEngine.computeProgressSummary(
        this.allQuestions,
        this.srsMap,
        this.labData,
        this.labCompletedSteps,
        { includeP1: this.includeP1, includeSVM: this.includeSVM, nowMs }
      );
    },

    finalizeGamifAction({ xpGain = 0, actionIncrement = 1, reviewIncrement = 0, recoveredIncrement = 0, nowMs = Date.now(), emitToast = true }) {
      if (!window.StudyEngine || !this.gamif) return { xpGained: 0, leveledUp: false, newlyUnlocked: [] };
      const { dailyBonusXp } = StudyEngine.applyStudyTouch(this.gamif, nowMs, actionIncrement);
      this.gamif.totalReviews = (this.gamif.totalReviews || 0) + reviewIncrement;
      this.gamif.recoveredCount = (this.gamif.recoveredCount || 0) + recoveredIncrement;

      const prevLvl = StudyEngine.getLevelInfo(this.gamif.xp).level;
      const totalAdded = Math.max(0, Math.round(xpGain + dailyBonusXp));
      this.gamif.xp = (this.gamif.xp || 0) + totalAdded;
      const nextLvl = StudyEngine.getLevelInfo(this.gamif.xp);
      const summary = this.getStudySummary(nowMs);
      const newlyUnlocked = StudyEngine.evaluateAchievements(this.gamif, summary, nowMs);

      if (emitToast) {
        if (newlyUnlocked.length > 0) {
          this.showToast(`🏅 ¡Logro desbloqueado: ${newlyUnlocked[0].title}!`);
        } else if (nextLvl.level > prevLvl) {
          this.showToast(`${nextLvl.icon} ¡Subiste al Nivel ${nextLvl.level}: ${nextLvl.title}!`);
        } else if (dailyBonusXp > 0) {
          this.showToast(`🎯 ¡Meta diaria alcanzada! +${dailyBonusXp} XP bonus`);
        }
      }

      return {
        xpGained: totalAdded,
        dailyBonusXp,
        leveledUp: nextLvl.level > prevLvl,
        newlyUnlocked
      };
    },

    renderMasteryStackedBarHtml(stats) {
      const total = Math.max(1, Number(stats.total || 0));
      const mPct = Math.round(((stats.mastered || 0) / total) * 100);
      const lPct = Math.min(100 - mPct, Math.round(((stats.learning || 0) / total) * 100));
      return `
        <div class="mastery-stacked-bar">
          <div class="mastery-seg-mastered" style="width: ${mPct}%;"></div>
          <div class="mastery-seg-learning" style="width: ${lPct}%;"></div>
        </div>
      `;
    },

    renderGlobalStudyHud() {
      const hudEl = document.getElementById("home-study-hud");
      if (!hudEl || !window.StudyEngine || !this.gamif) return;

      const now = Date.now();
      const summary = this.getStudySummary(now);
      if (!summary) return;
      const lvl = StudyEngine.getLevelInfo(this.gamif.xp);
      const streak = StudyEngine.getEffectiveStreak(this.gamif, now);
      const todayKey = StudyEngine.getLocalDateKey(now);
      const todayActions = (this.gamif.dailyActions && this.gamif.dailyActions[todayKey]) || 0;
      const goalTarget = this.gamif.dailyGoal || 15;
      const goalMet = todayActions >= goalTarget;
      const xpGoalTxt = lvl.nextLevel ? `${lvl.xp} / ${lvl.nextLevel.minXp} XP` : `${lvl.xp} XP (Máximo)`;

      const scopeLabel = (!this.includeP1 && !this.includeSVM)
        ? "Banco activo 2do Parcial"
        : "Banco filtrado activo";
      const dueBadgeTxt = summary.p2.dueNow > 0
        ? `🧠 Sesión Anki (${summary.p2.dueNow} vencidas)`
        : summary.p2.newCount > 0
          ? `🧠 Sesión Anki (${summary.p2.newCount} nuevas)`
          : "🧠 Repasar Banco Activo";

      hudEl.innerHTML = `
        <div class="study-hud-top">
          <div class="hud-level-block">
            <div class="hud-level-icon">${lvl.icon}</div>
            <div>
              <div class="hud-level-title">Nv. ${lvl.level} · ${this.escapeHtml(lvl.title)} <span style="font-weight:500;color:var(--text-muted);font-size:0.82rem;">(${this.escapeHtml(this.gamif.alias || "Estudiante UTN")})</span></div>
              <div class="hud-level-sub">
                <span>⭐ ${xpGoalTxt}</span>
                <div class="xp-bar-wrap" title="${lvl.progressPct}% hacia el siguiente nivel">
                  <div class="xp-bar-fill" style="width: ${lvl.progressPct}%;"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="hud-stat-pills">
            <span class="hud-pill ${streak > 0 ? "streak-hot" : ""}">🔥 Racha: ${streak} ${streak === 1 ? "día" : "días"}</span>
            <span class="hud-pill ${goalMet ? "goal-done" : ""}">🎯 Meta hoy: ${todayActions}/${goalTarget}${goalMet ? " ✓" : ""}</span>
            <span class="hud-pill">🛠️ Lab: ${summary.lab.pct}%</span>
          </div>
        </div>

        <div class="mastery-bar-header">
          <span><strong>Dominio del ${scopeLabel}:</strong> ${summary.p2.mastered} / ${summary.p2.total} preguntas dominadas (${summary.p2.masteredPct}%)</span>
          <span style="color:var(--text-muted);">En repaso: ${summary.p2.learning} · Sin ver: ${summary.p2.newCount}</span>
        </div>
        ${this.renderMasteryStackedBarHtml(summary.p2)}
        <div class="mastery-legend">
          <span><span class="mastery-dot" style="background:var(--success);"></span>Dominadas (${summary.p2.mastered})</span>
          <span><span class="mastery-dot" style="background:var(--primary);"></span>En repaso Anki (${summary.p2.learning})</span>
          <span><span class="mastery-dot" style="background:var(--border-color);"></span>Sin ver (${summary.p2.newCount})</span>
          ${summary.p2.rebeldes > 0 ? `<span style="color:var(--danger);font-weight:700;">⚔️ ${summary.p2.rebeldes} rebeldes por recuperar</span>` : ""}
        </div>

        <div class="srs-home-cta">
          <div style="font-size:0.83rem;color:var(--text-muted);">
            <strong>Prioridad inteligente:</strong> primero vuelven las que más te costaron o están vencidas; luego las nuevas.
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:0.55rem;">
            <button type="button" class="btn btn-primary btn-sm" onclick="app.startSmartPractice()">${dueBadgeTxt}</button>
            <button type="button" class="btn btn-outline btn-sm" onclick="app.navigate('history')">🏆 Progreso y Ranking</button>
          </div>
        </div>
      `;
    },

    recordExamStudyOutcome(questionReviews, finalScore, preset) {
      if (!window.StudyEngine || !this.gamif || !Array.isArray(questionReviews) || questionReviews.length === 0) {
        return { xpGained: 0, dailyBonusXp: 0, leveledUp: false, newlyUnlocked: [], srsUpdatedCount: 0, recoveredCount: 0 };
      }

      const answeredReviews = questionReviews.filter((r) => Array.isArray(r.selectedIndices) && r.selectedIndices.length > 0);
      if (answeredReviews.length === 0) {
        return { xpGained: 0, dailyBonusXp: 0, leveledUp: false, newlyUnlocked: [], srsUpdatedCount: 0, recoveredCount: 0 };
      }

      // Guard against early-exit penalty: if < 50% was answered, only update questions the user actually attempted
      const abortedEarly = answeredReviews.length < Math.ceil(questionReviews.length * 0.5);
      const targets = abortedEarly ? answeredReviews : questionReviews;

      const now = Date.now();
      let srsUpdatedCount = 0;
      let recoveredCount = 0;
      let questionXp = 0;

      targets.forEach((r) => {
        const q = r.question;
        if (!q || q.id === undefined) return;
        const prevCard = this.srsMap[q.id] || StudyEngine.createEmptyCard();
        const rating = StudyEngine.ratingFromMoodleScore(r.score);
        this.srsMap[q.id] = StudyEngine.computeNextSrsState(prevCard, rating, r.score, now);
        srsUpdatedCount++;

        if ((prevCard.lapses > 0 || prevCard.status === "relearning") && r.score >= 80) {
          recoveredCount++;
        }

        if (r.selectedIndices && r.selectedIndices.length > 0) {
          if (r.score >= 100) questionXp += 18;
          else if (r.score >= 80) questionXp += 13;
          else if (r.score >= 60) questionXp += 7;
          else questionXp += 2;
        }
      });

      const completionBonus = abortedEarly
        ? 0
        : preset === "completo"
          ? 80
          : (preset === "oficial" || preset === "2025")
            ? 50
            : 25;

      this.gamif.totalExams = (this.gamif.totalExams || 0) + 1;
      if (!abortedEarly) {
        if (preset === "2025") {
          this.gamif.best2025Score = Math.max(this.gamif.best2025Score || 0, finalScore);
        }
        if (preset === "oficial" || preset === "2025" || preset === "completo" || questionReviews.length >= 25) {
          this.gamif.bestExamScore = Math.max(this.gamif.bestExamScore || 0, finalScore);
        }
      }

      const delta = this.finalizeGamifAction({
        xpGain: questionXp + completionBonus + recoveredCount * 10,
        actionIncrement: Math.max(1, answeredReviews.length),
        reviewIncrement: srsUpdatedCount,
        recoveredIncrement: recoveredCount,
        nowMs: now,
        emitToast: false
      });

      this.saveStudyState();
      this.updateSmartPracticeFilterLabel();

      return {
        ...delta,
        srsUpdatedCount,
        recoveredCount
      };
    },

    recordSourceLinkClick() {
      if (!window.StudyEngine || !this.gamif) return;
      const now = Date.now();
      this.gamif.sourceClicks = (this.gamif.sourceClicks || 0) + 1;
      const summary = this.getStudySummary(now);
      const newlyUnlocked = StudyEngine.evaluateAchievements(this.gamif, summary, now);
      if (newlyUnlocked.length > 0) {
        this.showToast(`🏅 ¡Logro desbloqueado: ${newlyUnlocked[0].title}!`);
      }
      this.saveStudyState();
      if (this.currentView === "history") {
        this.renderProgressDashboard();
      }
    },

    renderProgressDashboard() {
      if (!window.StudyEngine || !this.gamif) return;
      const now = Date.now();
      const summary = this.getStudySummary(now);
      if (!summary) return;

      this.renderProfileSummaryCard(summary, now);
      this.renderTopicsMasteryCard(summary);
      this.renderAchievementsCard(summary);
      this.renderLeaderboardCard(summary, now);
    },

    renderProfileSummaryCard(summary, now) {
      const el = document.getElementById("history-profile-card");
      if (!el) return;

      const lvl = StudyEngine.getLevelInfo(this.gamif.xp);
      const streak = StudyEngine.getEffectiveStreak(this.gamif, now);
      const todayKey = StudyEngine.getLocalDateKey(now);
      const todayActions = (this.gamif.dailyActions && this.gamif.dailyActions[todayKey]) || 0;
      const goalTarget = this.gamif.dailyGoal || 15;
      const goalPct = Math.min(100, Math.round((todayActions / Math.max(1, goalTarget)) * 100));
      const xpSub = lvl.nextLevel
        ? `${lvl.xp} XP · faltan ${lvl.xpToNext} XP para Nv. ${lvl.nextLevel.level} (${this.escapeHtml(lvl.nextLevel.title)})`
        : `${lvl.xp} XP · Nivel máximo alcanzado`;

      const unlockedCount = Object.keys(this.gamif.unlockedAchievements || {}).length;
      const goalOptions = [10, 15, 20, 30]
        .map((n) => `<option value="${n}" ${goalTarget === n ? "selected" : ""}>${n} acciones/día</option>`)
        .join("");

      el.innerHTML = `
        <div class="study-hud-top">
          <div class="hud-level-block">
            <div class="hud-level-icon">${lvl.icon}</div>
            <div>
              <div class="hud-level-title">Nv. ${lvl.level} · ${this.escapeHtml(lvl.title)}</div>
              <div class="hud-level-sub">
                <span>⭐ ${xpSub}</span>
                <div class="xp-bar-wrap" style="width:140px;">
                  <div class="xp-bar-fill" style="width:${lvl.progressPct}%;"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="hud-stat-pills">
            <span class="hud-pill ${streak > 0 ? "streak-hot" : ""}">🔥 Racha: ${streak} d (máx ${this.gamif.bestStreakDays || streak} d)</span>
            <span class="hud-pill ${todayActions >= goalTarget ? "goal-done" : ""}">🎯 Meta hoy: ${todayActions}/${goalTarget} (${goalPct}%)</span>
            <span class="hud-pill">⚡ Mejor combo: x${this.gamif.bestPracticeCombo || 0}</span>
          </div>
        </div>

        <div class="profile-top-grid">
          <div class="profile-stat-box">
            <div class="profile-stat-val">${summary.p2.mastered} / ${summary.p2.total} <span style="font-size:0.9rem;color:var(--success);">(${summary.p2.masteredPct}%)</span></div>
            <div class="profile-stat-lbl">Banco P2 dominado (SRS)</div>
          </div>
          <div class="profile-stat-box">
            <div class="profile-stat-val">${summary.p2.dueNow}</div>
            <div class="profile-stat-lbl">Tarjetas vencidas para hoy (${summary.p2.newCount} nuevas)</div>
          </div>
          <div class="profile-stat-box">
            <div class="profile-stat-val">${summary.lab.pct}%</div>
            <div class="profile-stat-lbl">Lab Práctico (${summary.lab.stepsDone}/${summary.lab.stepsTotal} pasos · ${summary.lab.flashcardsEvaluated}/${summary.lab.flashcardsTotal} cards)</div>
          </div>
          <div class="profile-stat-box">
            <div class="profile-stat-val">${this.gamif.best2025Score || 0}% · ${unlockedCount}/${StudyEngine.ACHIEVEMENTS.length}</div>
            <div class="profile-stat-lbl">Mejor Moodle 2025 · Logros</div>
          </div>
        </div>

        ${this.renderMasteryStackedBarHtml(summary.p2)}
        <div class="srs-deck-chips">
          <span class="badge" style="background:var(--success-bg);color:var(--success);">Dominadas: ${summary.p2.mastered}</span>
          <span class="badge badge-topic">En repaso: ${summary.p2.learning}</span>
          <span class="badge" style="background:var(--bg-subtle);color:var(--text-muted);border:1px solid var(--border-color);">Sin ver: ${summary.p2.newCount}</span>
          <span class="badge" style="background:var(--danger-bg);color:var(--danger);">Rebeldes: ${summary.p2.rebeldes}</span>
          <span class="badge" style="background:var(--bg-subtle);color:var(--text-muted);border:1px solid var(--border-color);">Evaluaciones totales: ${this.gamif.totalReviews || 0}</span>
        </div>

        <div class="profile-controls-row" style="margin-top:0.9rem;">
          <div style="display:flex;flex-wrap:wrap;gap:0.5rem;align-items:center;">
            <label for="profile-alias-input" style="font-size:0.82rem;font-weight:700;">Alias:</label>
            <input id="profile-alias-input" type="text" class="inline-input" maxlength="28" value="${this.escapeHtml(this.gamif.alias || "Estudiante UTN")}" onkeydown="if(event.key==='Enter') app.saveProfileSettings();" />
            <label for="profile-goal-select" style="font-size:0.82rem;font-weight:700;">Meta diaria:</label>
            <select id="profile-goal-select" class="inline-input">${goalOptions}</select>
            <button type="button" class="btn btn-primary btn-sm" onclick="app.saveProfileSettings()">Guardar perfil</button>
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:0.45rem;align-items:center;">
            <button type="button" class="btn btn-outline btn-sm" onclick="app.exportProgressBackup()">💾 Exportar JSON</button>
            <label class="btn btn-outline btn-sm" style="cursor:pointer;margin:0;">
              📂 Importar JSON
              <input type="file" accept=".json,application/json" style="display:none;" onchange="app.importProgressBackup(this)" />
            </label>
            <button type="button" class="btn btn-outline btn-sm" style="color:var(--danger);border-color:rgba(239,68,68,0.4);" onclick="app.resetStudyProgress()">♻️ Reiniciar progreso</button>
          </div>
        </div>
      `;
    },

    renderTopicsMasteryCard(summary) {
      const el = document.getElementById("history-topics-card");
      if (!el) return;

      const rowsHtml = Object.values(summary.byTopic)
        .sort((a, b) => a.masteredPct - b.masteredPct || b.dueNow - a.dueNow)
        .map((t) => {
          const avgTxt = t.avgScore !== null ? ` · Últ. prom: ${t.avgScore}%` : "";
          const dueTxt = t.dueNow > 0 ? ` · ${t.dueNow} vencidas` : "";
          return `
            <div class="topic-mastery-row">
              <div>
                <div style="font-weight:700;font-size:0.87rem;">${this.escapeHtml(TOPIC_NAMES[t.tema] || t.tema)}</div>
                <div style="font-size:0.75rem;color:var(--text-muted);">
                  ${t.rebeldes > 0 ? `⚔️ ${t.rebeldes} rebeldes` : "Sin rebeldes"}${dueTxt}${avgTxt}
                </div>
              </div>
              <div>${this.renderMasteryStackedBarHtml(t)}</div>
              <div style="font-family:var(--font-mono);font-size:0.82rem;font-weight:700;white-space:nowrap;">${t.mastered}/${t.total} (${t.masteredPct}%)</div>
              <div>
                <button type="button" class="btn btn-outline btn-sm" onclick="app.practiceTopicDirect('${t.tema}')">🧠 Repasar</button>
              </div>
            </div>
          `;
        })
        .join("");

      el.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.5rem;margin-bottom:0.65rem;">
          <div>
            <h3 style="margin:0;">📊 Dominio por Tema (Anki SM-2)</h3>
            <p style="margin:0.15rem 0 0;font-size:0.82rem;color:var(--text-muted);">Ordenado desde los temas con menor dominio para enfocar tu estudio antes del parcial.</p>
          </div>
          <button type="button" class="btn btn-primary btn-sm" onclick="app.startSmartPractice()">🧠 Ir al Repaso Inteligente</button>
        </div>
        ${rowsHtml || `<p style="color:var(--text-muted);">No hay temas activos en el filtro actual.</p>`}
      `;
    },

    renderAchievementsCard(summary) {
      const el = document.getElementById("history-achievements-card");
      if (!el) return;

      const ctx = { gamif: this.gamif, summary };
      const unlockedMap = this.gamif.unlockedAchievements || {};
      const unlockedTotal = Object.keys(unlockedMap).length;

      const cardsHtml = StudyEngine.ACHIEVEMENTS.map((a) => {
        const isUnlocked = Boolean(unlockedMap[a.id]);
        const rawProg = a.progress ? a.progress(ctx) : [isUnlocked ? 1 : 0, 1];
        const cur = Array.isArray(rawProg) ? Number(rawProg[0] || 0) : Number(rawProg?.current || 0);
        const tgt = Math.max(1, Array.isArray(rawProg) ? Number(rawProg[1] || 1) : Number(rawProg?.target || 1));
        const pct = Math.min(100, Math.round((cur / tgt) * 100));
        const ratioTxt = isUnlocked ? `${tgt}/${tgt}` : `${Math.min(cur, tgt)}/${tgt}`;
        return `
          <div class="achievement-card ${isUnlocked ? "unlocked" : "locked"}">
            <div class="achievement-icon">${isUnlocked ? a.icon : "🔒"}</div>
            <div style="flex:1;min-width:0;">
              <div class="achievement-title">${this.escapeHtml(a.title)} ${isUnlocked ? "✓" : ""}</div>
              <div class="achievement-desc">${this.escapeHtml(a.desc)}</div>
              <div style="margin-top:0.35rem;display:flex;align-items:center;gap:0.45rem;">
                <div class="xp-bar-wrap" style="flex:1;width:auto;">
                  <div class="xp-bar-fill" style="width:${isUnlocked ? 100 : pct}%;${isUnlocked ? "background:var(--success);" : ""}"></div>
                </div>
                <span style="font-size:0.72rem;font-family:var(--font-mono);color:var(--text-muted);">${ratioTxt}</span>
              </div>
            </div>
          </div>
        `;
      }).join("");

      el.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.5rem;">
          <h3 style="margin:0;">🏅 Logros de Preparación (${unlockedTotal} / ${StudyEngine.ACHIEVEMENTS.length})</h3>
          <span style="font-size:0.8rem;color:var(--text-muted);">Desbloqueados únicamente por progreso real (sin farmeo)</span>
        </div>
        <div class="achievements-grid">${cardsHtml}</div>
      `;
    },

    renderLeaderboardCard(summary, now) {
      const el = document.getElementById("history-leaderboard-card");
      if (!el) return;

      const myCode = StudyEngine.encodeRankCode(this.gamif, summary, now);
      const myEntry = {
        ...StudyEngine.decodeRankCode(myCode),
        isMe: true
      };

      const mode = this.leaderboardMode === "github" ? "github" : "group";
      const rows = mode === "group"
        ? [myEntry, ...(this.groupLeaderboard || []).map((p) => ({ ...p, isMe: false }))]
        : [myEntry, ...(this.githubLeaderboard || []).filter((p) => p.code !== myCode).map((p) => ({ ...p, isMe: false }))];

      rows.sort((a, b) =>
        (b.masteredCount - a.masteredCount) ||
        (b.xp - a.xp) ||
        (b.best2025Score - a.best2025Score)
      );

      const tableRowsHtml = rows.map((r, idx) => {
        const medal = idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`;
        const authorMeta = r.authorLogin
          ? `<div style="font-size:0.72rem;color:var(--text-muted);">@${this.escapeHtml(r.authorLogin)}${r.issueUrl ? ` · <a href="${this.escapeHtml(r.issueUrl)}" target="_blank" rel="noopener noreferrer">Issue</a>` : ""}</div>`
          : "";
        const removeBtn = (!r.isMe && mode === "group")
          ? `<button type="button" class="btn btn-outline btn-sm" style="padding:0.15rem 0.45rem;font-size:0.74rem;" title="Quitar del grupo" onclick="app.removePeerFromLeaderboard('${this.escapeHtml(r.code).replace(/'/g, "\\'")}')">✕</button>`
          : "";

        return `
          <tr class="${r.isMe ? "rank-row-me" : ""}">
            <td>${medal}</td>
            <td>
              <div>${r.levelIcon || "🌱"} <strong>${this.escapeHtml(r.alias || "Estudiante UTN")}</strong> ${r.isMe ? `<span class="badge badge-topic" style="margin-left:0.25rem;">TÚ</span>` : ""}</div>
              ${authorMeta}
            </td>
            <td style="font-family:var(--font-mono);">Nv.${r.level || 1} · ${r.xp || 0} XP</td>
            <td><strong>${r.masteryPct || 0}%</strong> <span style="color:var(--text-muted);font-size:0.76rem;">(${r.masteredCount || 0})</span></td>
            <td style="font-family:var(--font-mono);">${r.best2025Score || 0}%</td>
            <td>🔥 ${r.streakDays || 0}d</td>
            <td>${removeBtn}</td>
          </tr>
        `;
      }).join("");

      const groupPanel = `
        <div class="rank-code-box">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.5rem;">
            <div>
              <strong style="font-size:0.86rem;">🔗 Tu Código Verificable para Compartir</strong>
              <span style="font-size:0.78rem;color:var(--text-muted);margin-left:0.35rem;">(con checksum anti-edición · ideal para grupos de estudio)</span>
            </div>
            <button type="button" class="btn btn-primary btn-sm" onclick="app.generateAndCopyRankCode()">📋 Copiar mi código</button>
          </div>
          <code class="rank-code-preview" title="${this.escapeHtml(myCode)}">${this.escapeHtml(myCode)}</code>
          <div style="display:flex;flex-wrap:wrap;gap:0.5rem;margin-top:0.65rem;">
            <input id="peer-rank-code-input" type="text" class="inline-input" style="flex:1;min-width:220px;" placeholder="Pegá acá el código IA-RANK:v1:... de un compañero" onkeydown="if(event.key==='Enter') app.importPeerRankCode();" />
            <button type="button" class="btn btn-outline btn-sm" onclick="app.importPeerRankCode()">➕ Agregar compañero</button>
          </div>
        </div>
      `;

      const ghIssueUrl = `https://github.com/FranDSchz/ia-segundo-parcial-utn-frre/issues/new?template=ranking_puntaje.yml&title=${encodeURIComponent(`[Ranking]: ${this.gamif.alias || "Estudiante UTN"}`)}&alias=${encodeURIComponent(this.gamif.alias || "Estudiante UTN")}&rank-code=${encodeURIComponent(myCode)}`;
      const lastFetchTxt = this.githubLeaderboardFetchedAt
        ? `Última actualización: ${new Date(this.githubLeaderboardFetchedAt).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}`
        : "Sin sincronizar aún";
      const ghStatusBadge = this.githubLeaderboardStatus === "loading"
        ? "⏳ Cargando Issues públicos..."
        : this.githubLeaderboardStatus === "error"
          ? `⚠️ No se pudo conectar con GitHub (mostrando caché/local). ${lastFetchTxt}`
          : `✅ Sincronizado (${this.githubLeaderboard.length} participantes en GitHub · ${lastFetchTxt})`;

      const githubPanel = `
        <div class="rank-code-box">
          <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:0.65rem;">
            <div style="font-size:0.82rem;color:var(--text-muted);">
              <strong>🌐 Tabla Comunitaria Real via GitHub Issues:</strong> lee issues públicos abiertos con la etiqueta <code>ranking</code> y código <code>IA-RANK:v1:...</code> válido. Zero bots, zero servidor oculto.
            </div>
            <div style="display:flex;flex-wrap:wrap;gap:0.45rem;">
              <a href="${ghIssueUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">📤 Publicar mi código</a>
              <button type="button" class="btn btn-outline btn-sm" onclick="app.refreshGithubLeaderboard(true)">🔄 Actualizar</button>
            </div>
          </div>
          <div style="margin-top:0.55rem;font-size:0.78rem;color:var(--text-muted);">${ghStatusBadge}</div>
        </div>
      `;

      el.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:0.5rem;">
          <div>
            <h3 style="margin:0;">🏆 Leaderboard del Grupo y Comunidad (100% Real)</h3>
            <p style="margin:0.2rem 0 0;font-size:0.82rem;color:var(--text-muted);">Aplicación estática sin backend: nunca inventa bots. Compartí tu progreso verificable por código o publicá opcionalmente en GitHub.</p>
          </div>
        </div>

        <div class="leaderboard-tabs">
          <button type="button" class="filter-btn ${mode === "group" ? "active" : ""}" onclick="app.setLeaderboardMode('group')">👥 Mi Grupo (${1 + (this.groupLeaderboard || []).length})</button>
          <button type="button" class="filter-btn ${mode === "github" ? "active" : ""}" onclick="app.setLeaderboardMode('github')">🌐 Ranking GitHub (${this.githubLeaderboard.length})</button>
        </div>

        ${mode === "group" ? groupPanel : githubPanel}

        <div style="overflow-x:auto;">
          <table class="leaderboard-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Estudiante</th>
                <th>Nivel / XP</th>
                <th>Dominio P2</th>
                <th>2025</th>
                <th>Racha</th>
                <th></th>
              </tr>
            </thead>
            <tbody>${tableRowsHtml}</tbody>
          </table>
        </div>
      `;
    },

    saveProfileSettings() {
      if (!this.gamif) return;
      const aliasEl = document.getElementById("profile-alias-input");
      const goalEl = document.getElementById("profile-goal-select");
      if (aliasEl) {
        const cleanAlias = aliasEl.value.trim().slice(0, 28) || "Estudiante UTN";
        this.gamif.alias = cleanAlias;
      }
      if (goalEl) {
        const g = Number(goalEl.value);
        if ([10, 15, 20, 30].includes(g)) {
          this.gamif.dailyGoal = g;
        }
      }
      this.saveStudyState();
      this.renderGlobalStudyHud();
      this.renderProgressDashboard();
      this.showToast("✅ Perfil y meta diaria guardados");
    },

    setLeaderboardMode(mode) {
      this.leaderboardMode = mode === "github" ? "github" : "group";
      this.renderProgressDashboard();
      if (this.leaderboardMode === "github") {
        const stale = (Date.now() - (this.githubLeaderboardFetchedAt || 0)) > (15 * 60 * 1000);
        if (stale && this.githubLeaderboardStatus !== "loading") {
          this.refreshGithubLeaderboard(false);
        }
      }
    },

    generateAndCopyRankCode() {
      if (!window.StudyEngine || !this.gamif) return;
      const code = StudyEngine.encodeRankCode(this.gamif, this.getStudySummary(Date.now()), Date.now());
      const copyFallback = () => {
        const ta = document.createElement("textarea");
        ta.value = code;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); } catch (e) {}
        document.body.removeChild(ta);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code)
          .then(() => this.showToast("📋 Código IA-RANK copiado. ¡Compartilo con tu grupo!"))
          .catch(() => {
            copyFallback();
            this.showToast("📋 Código IA-RANK copiado");
          });
      } else {
        copyFallback();
        this.showToast("📋 Código IA-RANK copiado");
      }
    },

    importPeerRankCode() {
      if (!window.StudyEngine) return;
      const input = document.getElementById("peer-rank-code-input");
      if (!input) return;
      const raw = input.value.trim();
      if (!raw) {
        this.showToast("⚠️ Pegá un código IA-RANK:v1:... primero");
        return;
      }
      const decoded = StudyEngine.decodeRankCode(raw);
      if (!decoded) {
        this.showToast("❌ Código inválido o alterado (checksum incorrecto)");
        return;
      }

      const myCode = StudyEngine.encodeRankCode(this.gamif, this.getStudySummary(Date.now()), Date.now());
      if (decoded.code === myCode) {
        this.showToast("ℹ️ Ese es tu propio código actual (ya estás en la tabla)");
        return;
      }

      const keyAlias = decoded.alias.toLowerCase();
      this.groupLeaderboard = (this.groupLeaderboard || []).filter(
        (p) => p.code !== decoded.code && String(p.alias || "").toLowerCase() !== keyAlias
      );
      this.groupLeaderboard.push(decoded);
      this.saveStudyState();
      input.value = "";
      this.renderProgressDashboard();
      this.showToast(`✅ ${decoded.alias} agregado al Leaderboard del Grupo`);
    },

    removePeerFromLeaderboard(code) {
      this.groupLeaderboard = (this.groupLeaderboard || []).filter((p) => p.code !== code);
      this.saveStudyState();
      this.renderProgressDashboard();
      this.showToast("🗑️ Participante quitado del grupo");
    },

    async refreshGithubLeaderboard(forceRefresh = false) {
      if (!window.StudyEngine) return;
      const now = Date.now();
      const cacheAgeMs = now - (this.githubLeaderboardFetchedAt || 0);
      if (!forceRefresh && cacheAgeMs < (15 * 60 * 1000) && this.githubLeaderboard.length > 0) {
        this.githubLeaderboardStatus = "ready";
        if (this.currentView === "history") this.renderProgressDashboard();
        return;
      }

      this.githubLeaderboardStatus = "loading";
      if (this.currentView === "history") this.renderProgressDashboard();

      const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
      const timer = controller ? setTimeout(() => controller.abort(), 7000) : null;

      try {
        const res = await fetch(
          "https://api.github.com/repos/FranDSchz/ia-segundo-parcial-utn-frre/issues?labels=ranking&state=open&per_page=30",
          {
            headers: { Accept: "application/vnd.github+json" },
            signal: controller ? controller.signal : undefined
          }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const issues = await res.json();
        if (!Array.isArray(issues)) throw new Error("Respuesta inesperada");

        const byAuthor = new Map();
        issues.forEach((issue) => {
          const body = String(issue?.body || "");
          const match = body.match(/IA-RANK:v1:[A-Za-z0-9_-]+/);
          if (!match) return;
          const decoded = StudyEngine.decodeRankCode(match[0]);
          if (!decoded) return;

          const login = issue?.user?.login ? String(issue.user.login) : decoded.alias;
          const candidate = {
            ...decoded,
            authorLogin: login,
            issueUrl: issue?.html_url || ""
          };
          const prev = byAuthor.get(login);
          if (!prev || candidate.xp > prev.xp || candidate.masteredCount > prev.masteredCount) {
            byAuthor.set(login, candidate);
          }
        });

        this.githubLeaderboard = Array.from(byAuthor.values());
        this.githubLeaderboardFetchedAt = Date.now();
        this.githubLeaderboardStatus = "ready";
        try {
          localStorage.setItem("ia_github_rank_cache_v1", JSON.stringify({
            fetchedAt: this.githubLeaderboardFetchedAt,
            rows: this.githubLeaderboard
          }));
        } catch (e) {}
      } catch (e) {
        this.githubLeaderboardStatus = "error";
      } finally {
        if (timer) clearTimeout(timer);
        if (this.currentView === "history") {
          this.renderProgressDashboard();
        }
      }
    },

    exportProgressBackup() {
      try {
        const payload = {
          version: 1,
          exportedAt: new Date().toISOString(),
          srsMap: this.srsMap || {},
          gamif: this.gamif || {},
          labSteps: [...(this.labCompletedSteps || [])],
          groupLeaderboard: this.groupLeaderboard || [],
          history: JSON.parse(localStorage.getItem("ia_quiz_history") || "[]"),
          failedIds: JSON.parse(localStorage.getItem("ia_quiz_failed_ids") || "[]")
        };
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `ia-2p-progreso-${StudyEngine.getLocalDateKey(Date.now())}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        this.showToast("💾 Respaldo JSON descargado");
      } catch (e) {
        this.showToast("⚠️ No se pudo exportar el respaldo");
      }
    },

    importProgressBackup(inputEl) {
      const file = inputEl && inputEl.files && inputEl.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(String(reader.result || "{}"));
          if (!data || typeof data !== "object" || (!data.srsMap && !data.gamif && !Array.isArray(data.labSteps))) {
            throw new Error("Formato incompatible");
          }
          if (data.srsMap && typeof data.srsMap === "object" && !Array.isArray(data.srsMap)) {
            this.srsMap = data.srsMap;
          }
          if (data.gamif && typeof data.gamif === "object" && window.StudyEngine) {
            this.gamif = StudyEngine.normalizeGamification(data.gamif);
          }
          if (Array.isArray(data.labSteps)) {
            this.labCompletedSteps = new Set(data.labSteps.map(String));
            this.saveLabSteps();
          }
          if (Array.isArray(data.groupLeaderboard) && window.StudyEngine) {
            this.groupLeaderboard = data.groupLeaderboard.filter((e) => e && e.code && StudyEngine.decodeRankCode(e.code));
          }
          if (Array.isArray(data.history)) {
            localStorage.setItem("ia_quiz_history", JSON.stringify(data.history));
          }
          if (Array.isArray(data.failedIds)) {
            localStorage.setItem("ia_quiz_failed_ids", JSON.stringify(data.failedIds));
          }

          this.saveStudyState();
          this.updateFailedButtonVisibility();
          this.updateSmartPracticeFilterLabel();
          this.renderGlobalStudyHud();
          this.renderHistory();
          this.renderProgressDashboard();
          if (this.currentView === "lab") this.renderLabView();
          this.showToast("✅ Progreso restaurado desde respaldo JSON");
        } catch (e) {
          this.showToast("❌ Archivo JSON de progreso inválido");
        } finally {
          inputEl.value = "";
        }
      };
      reader.readAsText(file);
    },

    resetStudyProgress() {
      if (!confirm("¿Reiniciar todo tu progreso de Repetición Espaciada (Anki), XP, racha y logros? (Tus intentos históricos quedan aparte)")) {
        return;
      }
      const savedAlias = this.gamif && this.gamif.alias ? this.gamif.alias : "Estudiante UTN";
      this.srsMap = {};
      this.gamif = window.StudyEngine ? StudyEngine.createDefaultGamification() : {};
      if (this.gamif) this.gamif.alias = savedAlias;
      this.labCardSessionRating = {};
      localStorage.setItem("ia_srs_v1", "{}");
      localStorage.setItem("ia_gamification_v1", JSON.stringify(this.gamif));
      this.updateSmartPracticeFilterLabel();
      this.renderGlobalStudyHud();
      this.renderProgressDashboard();
      if (this.currentView === "lab") this.renderLabView();
      this.showToast("♻️ Progreso de SRS y gamificación reiniciado");
    },

    // -------------------------------------------------------------
    // History Tab
    // -------------------------------------------------------------
    renderHistory() {
      const container = document.getElementById("history-list-container");
      if (!container) return;

      try {
        const raw = localStorage.getItem("ia_quiz_history");
        const list = raw ? JSON.parse(raw) : [];

        if (list.length === 0) {
          container.innerHTML = `<p style="color: var(--text-muted); padding: 1rem 0;">Aún no hay intentos registrados.</p>`;
          return;
        }

        let html = `
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
              <thead>
                <tr style="border-bottom: 2px solid var(--border-color); text-align: left;">
                  <th style="padding: 0.6rem;">Fecha</th>
                  <th style="padding: 0.6rem;">Modo</th>
                  <th style="padding: 0.6rem;">Preguntas</th>
                  <th style="padding: 0.6rem;">Tiempo</th>
                  <th style="padding: 0.6rem;">Puntaje</th>
                  <th style="padding: 0.6rem;">Estado</th>
                </tr>
              </thead>
              <tbody>
        `;

        list.forEach((item) => {
          const d = new Date(item.date);
          const dateStr = d.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
          const statusBadge = item.score >= 80
            ? `<span class="badge" style="background-color: var(--success-bg); color: var(--success);">Promocionado</span>`
            : item.score >= 60
            ? `<span class="badge" style="background-color: var(--primary-light); color: var(--primary);">Aprobado</span>`
            : `<span class="badge" style="background-color: var(--danger-bg); color: var(--danger);">No Alcanzado</span>`;

          html += `
            <tr style="border-bottom: 1px solid var(--border-color);">
              <td style="padding: 0.6rem; color: var(--text-muted);">${dateStr}</td>
              <td style="padding: 0.6rem; text-transform: capitalize;">${item.preset}</td>
              <td style="padding: 0.6rem;">${item.totalQuestions}</td>
              <td style="padding: 0.6rem; font-family: var(--font-mono);">${item.timeFormatted}</td>
              <td style="padding: 0.6rem; font-weight: 800; font-family: var(--font-mono); font-size: 1rem;">${item.score}%</td>
              <td style="padding: 0.6rem;">${statusBadge}</td>
            </tr>
          `;
        });

        html += `</tbody></table></div>`;
        container.innerHTML = html;
      } catch (e) {
        container.innerHTML = `<p style="color: var(--danger);">Error cargando historial.</p>`;
      }
    },

    clearHistory() {
      if (confirm("¿Estás seguro de que deseas borrar todo el historial de intentos guardado?")) {
        localStorage.removeItem("ia_quiz_history");
        this.renderHistory();
      }
    },

    // -------------------------------------------------------------
    // Historical Source Traceability Helpers (Never called in active exam)
    // -------------------------------------------------------------
    escapeHtml(str) {
      if (str === null || str === undefined) return "";
      return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    },

    getHistoricalRef(q) {
      const ref = (q && q.referencia_historica) || {};
      const estado = ref.estado || "compendio_sin_fecha";
      const anios = Array.isArray(ref.anios) && ref.anios.length > 0
        ? ref.anios
        : q && q.anio
        ? [String(q.anio)]
        : [];
      return {
        estado,
        instancia: ref.instancia || (q && q.origen) || "Registro de Cátedra",
        fecha: ref.fecha || (anios.length > 0 ? anios.join(" / ") : "Sin fecha exacta registrada"),
        anios,
        archivo_origen: ref.archivo_origen || (q && q.fuente) || "",
        antecedentes: ref.antecedentes || "",
        detalle: ref.detalle || "",
        archivos_repo: Array.isArray(ref.archivos_repo) ? ref.archivos_repo : []
      };
    },

    buildRepoBlobUrl(relPath) {
      if (!relPath) return REPO_GITHUB_BASE;
      const encoded = String(relPath)
        .split("/")
        .filter(Boolean)
        .map((seg) => encodeURIComponent(seg))
        .join("/");
      return `${REPO_GITHUB_BASE}/blob/main/${encoded}`;
    },

    getRepoKindIcon(kind) {
      if (kind === "pdf") return "📄";
      if (kind === "img") return "🖼️";
      if (kind === "md") return "📝";
      return "📎";
    },

    renderRepoLinksHtml(archivos, labelText) {
      if (!Array.isArray(archivos) || archivos.length === 0) return "";
      const pills = archivos
        .map((item) => {
          const url = this.buildRepoBlobUrl(item.path);
          const icon = this.getRepoKindIcon(item.kind);
          const title = `Abrir en GitHub: ${item.path}`;
          return `<a class="repo-link-pill" href="${this.escapeHtml(url)}" target="_blank" rel="noopener noreferrer" title="${this.escapeHtml(title)}">${icon} ${this.escapeHtml(item.label || item.path)} ↗</a>`;
        })
        .join("");
      return `
        <div class="repo-links-row">
          <span class="repo-links-label">${this.escapeHtml(labelText || "🔗 Abrir fuente en el repo:")}</span>
          ${pills}
        </div>
      `;
    },

    matchesYearFilter(q, filterKey) {
      if (!filterKey || filterKey === "ALL") return true;
      const tags = q.tags || [];
      const ref = this.getHistoricalRef(q);
      if (filterKey === "PARCIAL_2025") return tags.includes("PARCIAL_2025");
      if (filterKey === "VERIFICADA") return ref.estado === "verificada_examen";
      if (filterKey === "DERIVADA") return ref.estado === "derivada_examen";
      if (filterKey === "SIN_FECHA") return ref.estado === "compendio_sin_fecha";
      if (filterKey === "P1_REPASO") return Boolean(q.es_p1) || tags.includes("P1_REPASO");
      if (/^\d{4}$/.test(filterKey)) {
        return String(q.anio || "") === filterKey || tags.includes(filterKey) || ref.anios.includes(filterKey);
      }
      if (filterKey === "HISTORICO") {
        return ref.estado === "compendio_sin_fecha" || (!ref.anios.includes("2025") && !ref.anios.includes("2023") && !q.es_p1);
      }
      return true;
    },

    updateQAYearOptions() {
      const select = document.getElementById("qa-year-select");
      if (!select || !Array.isArray(this.allQuestions) || this.allQuestions.length === 0) return;
      const countFor = (key) => this.allQuestions.filter((q) => this.matchesYearFilter(q, key)).length;
      const defs = [
        ["ALL", `📅 Todos los Orígenes / Años (${this.allQuestions.length})`],
        ["PARCIAL_2025", `⭐ Parcial Moodle 2025 (${countFor("PARCIAL_2025")})`],
        ["2025", `📅 Registro 2025 (${countFor("2025")})`],
        ["2023", `📅 Registro 2023 (${countFor("2023")})`],
        ["2021", `📅 Registro 2021 (${countFor("2021")})`],
        ["2020", `📅 Registro 2020 (${countFor("2020")})`],
        ["2019", `📅 Registro 2019 (${countFor("2019")})`],
        ["VERIFICADA", `✅ Verificada de Examen (${countFor("VERIFICADA")})`],
        ["DERIVADA", `🧪 Derivada de Examen / Guía (${countFor("DERIVADA")})`],
        ["SIN_FECHA", `📜 Compendio sin Fecha (${countFor("SIN_FECHA")})`],
        ["P1_REPASO", `📘 Repaso P1 (${countFor("P1_REPASO")})`]
      ];
      const currentVal = select.value || "ALL";
      select.innerHTML = defs
        .map(([val, label]) => `<option value="${val}">${this.escapeHtml(label)}</option>`)
        .join("");
      select.value = defs.some(([val]) => val === currentVal) ? currentVal : "ALL";
    },

    getEstadoBadgeMeta(estado) {
      if (estado === "verificada_examen") {
        return { cls: "badge-ref-verificada", boxCls: "estado-verificada", label: "✅ Verificada de Examen" };
      }
      if (estado === "derivada_examen") {
        return { cls: "badge-ref-derivada", boxCls: "estado-derivada", label: "🧪 Derivada de Examen / Guía" };
      }
      return { cls: "badge-ref-compendio", boxCls: "estado-compendio", label: "📜 Compendio sin Fecha" };
    },

    renderHistoricalBadgesHtml(q) {
      const ref = this.getHistoricalRef(q);
      const meta = this.getEstadoBadgeMeta(ref.estado);
      const yearsLabel = ref.anios.length > 0 ? ref.anios.join(" / ") : (q.anio || "");
      return `
        ${yearsLabel ? `<span class="badge badge-year" style="margin-left: 0.45rem;">📅 ${this.escapeHtml(yearsLabel)}</span>` : ""}
        <span class="badge ${meta.cls}" style="margin-left: 0.45rem;">${meta.label}</span>
      `;
    },

    renderHistoricalRefHtml(q) {
      const ref = this.getHistoricalRef(q);
      const meta = this.getEstadoBadgeMeta(ref.estado);
      return `
        <div class="historical-ref-box ${meta.boxCls}">
          <div class="historical-ref-header">
            <span class="historical-ref-title">📚 Ficha Histórica</span>
            <span class="badge ${meta.cls}">${meta.label}</span>
            <span class="historical-ref-date">📅 ${this.escapeHtml(ref.fecha)}</span>
          </div>
          <div class="historical-ref-row"><strong>Instancia:</strong> ${this.escapeHtml(ref.instancia)}</div>
          ${ref.archivo_origen ? `<div class="historical-ref-row"><strong>Archivo / Fuente:</strong> <span class="historical-ref-file">${this.escapeHtml(ref.archivo_origen)}</span></div>` : ""}
          ${ref.antecedentes ? `<div class="historical-ref-row"><strong>Antecedentes / Recurrencia:</strong> ${this.escapeHtml(ref.antecedentes)}</div>` : ""}
          ${ref.detalle ? `<div class="historical-ref-row"><strong>Nota:</strong> ${this.escapeHtml(ref.detalle)}</div>` : ""}
          ${this.renderRepoLinksHtml(ref.archivos_repo, "🔗 Ver fuentes en el repo:")}
        </div>
      `;
    },

    formatHistoricalMarkdown(q) {
      const ref = this.getHistoricalRef(q);
      const lines = [
        `**Fuente Oficial:** ${q.fuente || "No especificada"}`,
        `**Estado Histórico:** ${ref.estado} (${ref.instancia} · ${ref.fecha})`
      ];
      if (ref.archivo_origen && ref.archivo_origen !== q.fuente) {
        lines.push(`**Archivo Origen:** ${ref.archivo_origen}`);
      }
      if (ref.antecedentes) {
        lines.push(`**Antecedentes:** ${ref.antecedentes}`);
      }
      if (ref.archivos_repo.length > 0) {
        const mdLinks = ref.archivos_repo
          .map((item) => `[${item.label || item.path}](${this.buildRepoBlobUrl(item.path)})`)
          .join(" · ");
        lines.push(`**Archivos en el Repositorio:** ${mdLinks}`);
      }
      return lines.join("\n");
    },

    // -------------------------------------------------------------
    // QA Mode (Full Bank Inspection + Live Search & Topic Filter)
    // -------------------------------------------------------------
    setQASearch(query) {
      this.qaSearchQuery = (query || "").trim().toLowerCase();
      this.renderQAMode();
    },

    setQATopic(topic) {
      this.qaSelectedTopic = topic || "ALL";
      this.renderQAMode();
    },

    setQAYear(year) {
      this.qaSelectedYear = year || "ALL";
      this.renderQAMode();
    },

    renderQAMode() {
      const container = document.getElementById("qa-questions-container");
      if (!container) return;

      container.innerHTML = "";
      const query = this.qaSearchQuery;
      const topicFilter = this.qaSelectedTopic;
      const yearFilter = this.qaSelectedYear;

      const filtered = this.allQuestions.filter((q) => {
        if (topicFilter !== "ALL" && q.tema !== topicFilter) return false;
        if (yearFilter !== "ALL" && !this.matchesYearFilter(q, yearFilter)) return false;
        if (!query) return true;
        const ref = this.getHistoricalRef(q);
        const repoStr = ref.archivos_repo.map((a) => `${a.label || ""} ${a.path || ""}`).join(" ");
        const haystack = `${q.id} ${q.tema} ${TOPIC_NAMES[q.tema] || ""} ${q.titulo} ${q.enunciado} ${(q.tags || []).join(" ")} ${q.anio || ""} ${q.fuente || ""} ${q.origen || ""} ${ref.instancia} ${ref.fecha} ${ref.archivo_origen} ${ref.antecedentes} ${ref.detalle} ${ref.anios.join(" ")} ${repoStr} ${q.opciones.join(" ")} ${q.explicacion}`.toLowerCase();
        return haystack.includes(query);
      });

      const countBadge = document.getElementById("qa-count-badge");
      if (countBadge) {
        countBadge.textContent = `${filtered.length} de ${this.allQuestions.length} Preguntas`;
      }

      if (filtered.length === 0) {
        container.innerHTML = `
          <div class="card" style="text-align: center; padding: 2rem; color: var(--text-muted);">
            No se encontraron preguntas que coincidan con el filtro actual.
          </div>
        `;
        return;
      }

      filtered.forEach((q) => {
        const idx = q.nro ? q.nro - 1 : this.allQuestions.indexOf(q);
        const correctSet = new Set(q.correctas);
        const card = document.createElement("div");
        card.className = "card";
        card.style.marginBottom = "1.25rem";

        let optionsHtml = "";
        q.opciones.forEach((optText, oIdx) => {
          const isCorrect = correctSet.has(oIdx);
          optionsHtml += `
            <div style="padding: 0.5rem 0.75rem; border-radius: var(--radius-sm); margin-bottom: 0.35rem; display: flex; align-items: flex-start; gap: 0.5rem; background-color: ${
              isCorrect ? "var(--success-bg)" : "var(--bg-subtle)"
            }; border: 1px solid ${isCorrect ? "var(--success)" : "transparent"};">
              <span>${isCorrect ? "✅ [CLAVE]" : "⚪"}</span>
              <div style="flex: 1;">${this.formatRichText(optText)}</div>
            </div>
          `;
        });

        card.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 0.75rem;">
            <div style="display: flex; align-items: center; flex-wrap: wrap; gap: 0.25rem;">
              <span class="badge badge-topic">${TOPIC_NAMES[q.tema] || q.tema}</span>
              <span style="font-weight: 700; margin-left: 0.4rem;">#${idx + 1} — ${q.id}</span>
              ${this.renderHistoricalBadgesHtml(q)}
              ${q.es_p1 ? `<span class="badge" style="background: var(--warning-bg); color: var(--warning); margin-left: 0.4rem;">P1</span>` : ""}
            </div>
          </div>

          <div style="font-size: 1.05rem; font-weight: 600; margin-bottom: 0.85rem;">${this.formatRichText(q.enunciado)}</div>

          <div style="margin-bottom: 1rem;">
            ${optionsHtml}
          </div>

          <div class="justification-box">
            <div class="justification-title">📖 Justificación Oficial:</div>
            <div>${this.formatRichText(q.explicacion)}</div>
          </div>

          ${this.renderHistoricalRefHtml(q)}

          <div class="question-footer-toolbar">
            <button class="btn btn-outline btn-sm" onclick="app.openQuestionFeedback('${q.id}')">
              💬 Debatir / Reportar
            </button>
            <button class="btn btn-outline btn-sm" onclick="app.copyQuestionToClipboard('${q.id}')" title="Copiar pregunta formateada">
              📋 Copiar
            </button>
          </div>
        `;

        container.appendChild(card);
        this.renderMath(card);
      });
    },

    // -------------------------------------------------------------
    // Community & Feedback Engine (100% Nativo GitHub)
    // -------------------------------------------------------------
    initCommunityView() {
      // 100% nativo y estático: navegación y enlaces directos sin dependencias externas
    },

    showToast(message) {
      const toast = document.getElementById("toast-notification");
      if (!toast) return;
      toast.textContent = message;
      toast.classList.add("show");
      if (this._toastTimer) clearTimeout(this._toastTimer);
      this._toastTimer = setTimeout(() => {
        toast.classList.remove("show");
      }, 3200);
    },

    openQuestionFeedback(qId) {
      const q = this.allQuestions.find((item) => item.id === qId);
      if (!q) return;

      this.currentFeedbackQuestion = q;
      const topicName = TOPIC_NAMES[q.tema] || q.tema;

      const topicBadge = document.getElementById("fb-modal-topic");
      if (topicBadge) topicBadge.textContent = topicName;

      const titleEl = document.getElementById("fb-modal-title");
      if (titleEl) titleEl.textContent = `Pregunta #${q.nro || q.id} (${q.id})`;

      const previewBox = document.getElementById("fb-modal-prompt-preview");
      if (previewBox) {
        previewBox.innerHTML = `
          <div style="font-weight: 700; margin-bottom: 0.35rem;">${q.titulo}</div>
          <div style="margin-bottom: 0.5rem;">${this.formatRichText(q.enunciado)}</div>
          ${this.renderHistoricalRefHtml(q)}
        `;
        this.renderMath(previewBox);
      }

      // 1. Issue URL (Reportar Errata)
      const repoBase = "https://github.com/FranDSchz/ia-segundo-parcial-utn-frre";
      const issueTitle = `[Errata #${q.nro || q.id}] ${q.titulo}`;
      const letters = ["A", "B", "C", "D", "E", "F"];
      const formattedOptions = q.opciones
        .map((opt, i) => `${letters[i] || i + 1}) ${opt}${q.correctas.includes(i) ? " *(Clave Actual)*" : ""}`)
        .join("\n");

      const issueBody = `### 🐛 Reporte de Errata en Pregunta del Simulador

**ID de la Pregunta:** \`${q.id}\`
**Tema:** ${topicName}
${this.formatHistoricalMarkdown(q)}

---

#### ❓ Enunciado:
${q.enunciado}

#### 📋 Opciones Actuales:
${formattedOptions}

---

### 🔍 Descripción del Problema o Corrección Propuesta:
*(Explicá qué considerás incorrecto, confuso o qué opción genera dudas. Si tenés una foto o apunte, podés arrastrar la imagen aquí abajo).*

`;
      const issueUrl = `${repoBase}/issues/new?title=${encodeURIComponent(issueTitle)}&body=${encodeURIComponent(issueBody)}&labels=errata,pregunta`;
      const issueBtn = document.getElementById("fb-btn-github-issue");
      if (issueBtn) issueBtn.href = issueUrl;

      // 2. Discussion URL (Debatir Pregunta)
      const discTitle = `[Debate #${q.nro || q.id}] ${q.titulo}`;
      const discBody = `### 💬 Debate sobre Pregunta: ${q.id} — ${topicName}

**Enunciado:**
> ${q.enunciado.split("\n").join("\n> ")}

**Justificación Doctrinal Oficial:**
> ${q.explicacion.split("\n").join("\n> ")}

---

### 🤔 Mi Consulta o Planteo:
*(Escribí acá tu duda, interpretación de cátedra o cálculo a mano. Podés arrastrar capturas de pantalla).*
`;
      const discUrl = `${repoBase}/discussions/new?category=q-a&title=${encodeURIComponent(discTitle)}&body=${encodeURIComponent(discBody)}`;
      const discBtn = document.getElementById("fb-btn-github-discussion");
      if (discBtn) discBtn.href = discUrl;

      // 3. Reset Copy Button Label
      const statusSpan = document.getElementById("fb-btn-copy-status");
      if (statusSpan) statusSpan.textContent = "Copiar texto";

      this.openModal("modal-question-feedback");
    },

    copyQuestionToClipboard(qId) {
      const q = this.allQuestions.find((item) => item.id === qId);
      if (!q) return;

      const letters = ["A", "B", "C", "D", "E", "F"];
      const optionsText = q.opciones.map((opt, i) => `${letters[i] || i + 1}) ${opt}`).join("\n");
      const textToCopy = `*Pregunta [${q.id}] — ${TOPIC_NAMES[q.tema] || q.tema}*
${q.enunciado}

*Opciones:*
${optionsText}

---
Simulador IA UTN FRRe: https://frandschz.github.io/ia-segundo-parcial-utn-frre/`;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          this.showToast("¡Pregunta copiada al portapapeles! 📋 Lista para WhatsApp o Discord");
        }).catch(() => {
          this.fallbackCopyToClipboard(textToCopy);
        });
      } else {
        this.fallbackCopyToClipboard(textToCopy);
      }
    },

    copyCurrentModalQuestion() {
      if (!this.currentFeedbackQuestion) return;
      this.copyQuestionToClipboard(this.currentFeedbackQuestion.id);
      const statusSpan = document.getElementById("fb-btn-copy-status");
      if (statusSpan) statusSpan.textContent = "¡Copiado! ✅";
    },

    fallbackCopyToClipboard(text) {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        this.showToast("¡Pregunta copiada al portapapeles! 📋");
      } catch (err) {
        alert("No se pudo copiar automáticamente. Por favor seleccioná el texto manualmente.");
      }
      document.body.removeChild(ta);
    },

    // =============================================================
    // VIEW: Práctica Guiada / Laboratorio de Resolución (#lab)
    // =============================================================
    initLabMode() {
      this.labData = window.ENTRENAMIENTO_PRACTICO || null;
      if (this.labData && Array.isArray(this.labData.temas) && this.labData.temas.length > 0) {
        this.labSelectedTopic = this.labData.temas[0].id;
      }
      try {
        const saved = JSON.parse(localStorage.getItem("ia_lab_steps") || "[]");
        if (Array.isArray(saved)) {
          this.labCompletedSteps = new Set(saved);
        }
      } catch (e) {
        this.labCompletedSteps = new Set();
      }
    },

    formatLabText(rawStr) {
      if (!rawStr) return "";
      let str = String(rawStr);
      const mathBlocks = [];
      const holdMath = (m) => {
        const tok = `@@LAB_MATH_${mathBlocks.length}@@`;
        mathBlocks.push(m);
        return tok;
      };
      str = str.replace(/\$\$([\s\S]+?)\$\$/g, holdMath);
      str = str.replace(/\$([^\$\n]+?)\$/g, holdMath);
      str = str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
      mathBlocks.forEach((m, idx) => {
        str = str.replace(`@@LAB_MATH_${idx}@@`, m);
      });
      return this.formatRichText(str);
    },

    selectLabTopic(topicId) {
      this.labSelectedTopic = topicId;
      this.labSelectedType = "ALL";
      this.renderLabView();
    },

    setLabTypeFilter(tipo) {
      this.labSelectedType = tipo;
      this.renderLabView();
    },

    saveLabSteps() {
      try {
        localStorage.setItem("ia_lab_steps", JSON.stringify([...this.labCompletedSteps]));
      } catch (e) {
        // Ignore storage quota issues gracefully
      }
    },

    toggleLabStep(itemId, stepNro) {
      const key = `${itemId}:${stepNro}`;
      const wasDone = this.labCompletedSteps.has(key);
      if (wasDone) {
        this.labCompletedSteps.delete(key);
      } else {
        this.labCompletedSteps.add(key);
        if (window.StudyEngine && this.gamif) {
          const now = Date.now();
          const todayKey = StudyEngine.getLocalDateKey(now);
          const xpKey = `labstep:${key}`;
          if (!this.gamif.xpAwardedToday) this.gamif.xpAwardedToday = {};
          if (this.gamif.xpAwardedToday[xpKey] !== todayKey) {
            this.gamif.xpAwardedToday[xpKey] = todayKey;
            this.finalizeGamifAction({
              xpGain: 10,
              actionIncrement: 1,
              reviewIncrement: 0,
              recoveredIncrement: 0,
              nowMs: now,
              emitToast: true
            });
          } else {
            const summary = this.getStudySummary(now);
            StudyEngine.evaluateAchievements(this.gamif, summary, now);
          }
          this.saveStudyState();
        }
      }
      this.saveLabSteps();
      this.renderGlobalStudyHud();
      const scrollY = window.scrollY;
      this.renderLabView();
      window.scrollTo(0, scrollY);
    },

    resetLabAlgorithmSteps(itemId) {
      for (const key of [...this.labCompletedSteps]) {
        if (key.startsWith(`${itemId}:`)) {
          this.labCompletedSteps.delete(key);
        }
      }
      this.saveLabSteps();
      this.renderGlobalStudyHud();
      const scrollY = window.scrollY;
      this.renderLabView();
      window.scrollTo(0, scrollY);
    },

    getVisibleLabItems(tema) {
      if (!tema || !Array.isArray(tema.items)) return [];
      if (this.labSelectedType === "ALL") return tema.items;
      return tema.items.filter((it) => it.tipo === this.labSelectedType);
    },

    updateRevealAllBtnState(visibleItems) {
      const btn = document.getElementById("lab-reveal-all-btn");
      if (!btn) return;
      const formulaItems = (visibleItems || []).filter((it) => it.tipo === "formula");
      if (formulaItems.length === 0) {
        btn.style.display = "none";
        return;
      }
      btn.style.display = "inline-flex";
      const allRevealed = formulaItems.every((it) => this.labRevealedCards.has(it.id));
      btn.textContent = allRevealed ? "🙈 Ocultar todas las fórmulas" : "👁️ Revelar todas las fórmulas";
    },

    toggleFlashcard(itemId) {
      if (this.labRevealedCards.has(itemId)) {
        this.labRevealedCards.delete(itemId);
      } else {
        this.labRevealedCards.add(itemId);
      }
      const card = document.querySelector(`.lab-flashcard[data-lab-id="${itemId}"]`);
      if (card) {
        const back = card.querySelector(".lab-flashcard-back");
        const btn = card.querySelector(".lab-flashcard-toggle");
        const isOpen = this.labRevealedCards.has(itemId);
        if (back) back.classList.toggle("hidden", !isOpen);
        if (btn) btn.textContent = isOpen ? "🙈 Ocultar fórmula" : "👁️ Revelar fórmula";
      }
      const tema = (this.labData?.temas || []).find((t) => t.id === this.labSelectedTopic);
      this.updateRevealAllBtnState(this.getVisibleLabItems(tema));
    },

    toggleAllFlashcards() {
      if (!this.labData) return;
      const tema = this.labData.temas.find((t) => t.id === this.labSelectedTopic) || this.labData.temas[0];
      const formulaItems = this.getVisibleLabItems(tema).filter((it) => it.tipo === "formula");
      if (formulaItems.length === 0) return;

      const allRevealed = formulaItems.every((it) => this.labRevealedCards.has(it.id));
      formulaItems.forEach((it) => {
        if (allRevealed) {
          this.labRevealedCards.delete(it.id);
        } else {
          this.labRevealedCards.add(it.id);
        }
        const card = document.querySelector(`.lab-flashcard[data-lab-id="${it.id}"]`);
        if (card) {
          const back = card.querySelector(".lab-flashcard-back");
          const btn = card.querySelector(".lab-flashcard-toggle");
          if (back) back.classList.toggle("hidden", allRevealed);
          if (btn) btn.textContent = allRevealed ? "👁️ Revelar fórmula" : "🙈 Ocultar fórmula";
        }
      });
      this.updateRevealAllBtnState(this.getVisibleLabItems(tema));
    },

    renderLabGlobalProgress(summary) {
      const globalEl = document.getElementById("lab-global-progress");
      if (!globalEl) return;
      if (!summary || !summary.lab) {
        globalEl.innerHTML = "";
        return;
      }
      const lab = summary.lab;
      globalEl.innerHTML = `
        <div class="mastery-bar-header">
          <span><strong>🛠️ Progreso Global de Práctica Guiada:</strong> ${lab.pct}% completado</span>
          <span style="color:var(--text-muted);">${lab.stepsDone}/${lab.stepsTotal} pasos · ${lab.flashcardsEvaluated}/${lab.flashcardsTotal} flashcards (${lab.flashcardsMastered} dominadas) · ${lab.topicsTouched}/${lab.topicsTotal} temas</span>
        </div>
        <div class="mastery-stacked-bar">
          <div class="mastery-seg-mastered" style="width:${lab.pct}%;"></div>
        </div>
      `;
    },

    renderLabTopicHeader(activeTema, summary) {
      const topicHeaderEl = document.getElementById("lab-topic-header");
      if (!topicHeaderEl || !activeTema) return;

      const totalSteps = activeTema.items.reduce((acc, it) => acc + (Array.isArray(it.pasos) ? it.pasos.length : 0), 0);
      const doneSteps = activeTema.items.reduce((acc, it) => {
        if (!Array.isArray(it.pasos)) return acc;
        return acc + it.pasos.filter((p) => this.labCompletedSteps.has(`${it.id}:${p.nro}`)).length;
      }, 0);
      const tStat = summary && summary.lab && summary.lab.byTopic ? summary.lab.byTopic[activeTema.id] : null;
      const tPct = tStat ? tStat.pct : (totalSteps > 0 ? Math.round((doneSteps / totalSteps) * 100) : 0);
      const cardsTxt = tStat && tStat.cardsTotal > 0 ? ` · 📐 Flashcards: ${tStat.cardsEvaluated}/${tStat.cardsTotal}` : "";

      topicHeaderEl.innerHTML = `
        <div class="lab-topic-header-top">
          <h2 class="lab-topic-title"><span>${activeTema.icono || "🛠️"}</span> ${activeTema.nombre}</h2>
          <span class="badge badge-lab-nature">${activeTema.badge || "SOLO PRÁCTICA · NO ES PARCIAL"}</span>
        </div>
        <div class="lab-topic-meta">
          <span class="lab-meta-chip">⚖️ Ponderación típica: ${activeTema.ponderacion || "N/A"}</span>
          <span class="lab-meta-chip">⏱️ Tiempo sugerido: ${activeTema.tiempoSugerido || "N/A"}</span>
          <span class="lab-meta-chip progress">☑️ Pasos practicados: ${doneSteps} / ${totalSteps}${cardsTxt}</span>
        </div>
        <div class="lab-topic-progress">
          <div class="mastery-bar-header" style="margin-bottom:0.25rem;">
            <span>Progreso del tema: <strong>${tPct}%</strong></span>
            <span style="color:var(--text-muted);">${doneSteps}/${totalSteps} pasos${tStat && tStat.cardsTotal > 0 ? ` · ${tStat.cardsMastered}/${tStat.cardsTotal} flashcards dominadas` : ""}</span>
          </div>
          <div class="mastery-stacked-bar">
            <div class="mastery-seg-mastered" style="width:${tPct}%;"></div>
          </div>
        </div>
        ${activeTema.referenciaCatedra ? `
          <div class="lab-catedra-ref">
            <div><strong>📚 Referencia de Cátedra:</strong> ${this.escapeHtml(activeTema.referenciaCatedra)}</div>
            ${this.renderRepoLinksHtml(activeTema.referenciaLinks, "🔗 Guías y modelos originales:")}
          </div>` : ""}
        <div class="lab-topic-objetivo">${this.formatLabText(activeTema.objetivo)}</div>
      `;
    },

    renderLabView() {
      const container = document.getElementById("lab-content-container");
      const roadmapEl = document.getElementById("lab-roadmap-strip");
      const topicBarEl = document.getElementById("lab-topic-bar");
      const topicHeaderEl = document.getElementById("lab-topic-header");
      const filtersEl = document.getElementById("lab-type-filters");
      if (!container) return;

      if (!this.labData || !Array.isArray(this.labData.temas) || this.labData.temas.length === 0) {
        container.innerHTML = `<div class="card"><p>No se pudieron cargar los datos de Práctica Guiada (revisa <code>data/entrenamiento_practico.js</code>).</p></div>`;
        return;
      }

      const summary = this.getStudySummary(Date.now());
      this.renderLabGlobalProgress(summary);

      // 1. Roadmap strip (all 8 syllabus iterations)
      if (roadmapEl && Array.isArray(this.labData.roadmap)) {
        roadmapEl.innerHTML = this.labData.roadmap.map((r, idx) => {
          const isReady = r.estado === "completo";
          const icon = isReady ? `✅ Iter. ${idx + 1}` : `⏳ Iter. ${idx + 1}`;
          const clickAttr = isReady ? `onclick="app.selectLabTopic('${r.id}')"` : `title="Se agregará en la Iteración ${idx + 1} del plan"`;
          return `<span class="lab-roadmap-pill ${isReady ? "complete" : "pending"}" ${clickAttr}>${icon} · ${r.nombre}</span>`;
        }).join("");
      }

      // 2. Active topic selection bar
      const activeTema = this.labData.temas.find((t) => t.id === this.labSelectedTopic) || this.labData.temas[0];
      this.labSelectedTopic = activeTema.id;

      if (topicBarEl) {
        topicBarEl.innerHTML = this.labData.temas.map((t) => `
          <button class="lab-topic-btn ${t.id === activeTema.id ? "active" : ""}" onclick="app.selectLabTopic('${t.id}')">
            <span>${t.icono || "🛠️"}</span>
            <span>${t.nombre}</span>
          </button>
        `).join("");
      }

      // 3. Topic Header + Checklist + Flashcard Progress
      this.renderLabTopicHeader(activeTema, summary);

      // 4. Type Filters with counts
      const filterDefs = [
        { id: "ALL", label: "Todos", icon: "📚" },
        { id: "algoritmo", label: "Algoritmos", icon: "🔢" },
        { id: "formula", label: "Fórmulas / Flashcards", icon: "📐" },
        { id: "plantilla", label: "Plantillas", icon: "📋" },
        { id: "diagrama", label: "Diagramas", icon: "🖼️" },
        { id: "trampa", label: "Trampas", icon: "⚠️" }
      ];
      if (filtersEl) {
        filtersEl.innerHTML = filterDefs.map((f) => {
          const count = f.id === "ALL"
            ? activeTema.items.length
            : activeTema.items.filter((it) => it.tipo === f.id).length;
          if (f.id !== "ALL" && count === 0) return "";
          const activeClass = this.labSelectedType === f.id ? "active" : "";
          return `<button class="lab-filter-pill ${activeClass}" onclick="app.setLabTypeFilter('${f.id}')">${f.icon} ${f.label} (${count})</button>`;
        }).join("");
      }

      // 5. Render visible items
      const visibleItems = this.getVisibleLabItems(activeTema);
      this.updateRevealAllBtnState(visibleItems);
      container.innerHTML = visibleItems.map((item) => this.renderLabItemCard(item)).join("");

      // 6. Trigger KaTeX math rendering across all cards
      this.renderMath(container);
      if (topicHeaderEl) this.renderMath(topicHeaderEl);
    },

    renderLabItemCard(item) {
      const TYPE_META = {
        diagrama: { label: "Diagrama Ilustrativo", icon: "🖼️", extraClass: "" },
        algoritmo: { label: "Algoritmo Paso a Paso", icon: "🔢", extraClass: "" },
        plantilla: { label: "Plantilla de Hoja", icon: "📋", extraClass: "" },
        formula: { label: "Flashcard de Fórmula", icon: "📐", extraClass: "lab-flashcard" },
        trampa: { label: "Trampas de Cálculo", icon: "⚠️", extraClass: "lab-trap-card" }
      };
      const meta = TYPE_META[item.tipo] || { label: item.tipo, icon: "📌", extraClass: "" };
      const natureLabel = item.etiquetaNaturaleza || "ENTRENAMIENTO PRÁCTICO · NO ES PREGUNTA DE PARCIAL";

      let bodyHtml = "";
      if (item.tipo === "diagrama") bodyHtml = this.renderLabDiagramBody(item);
      else if (item.tipo === "algoritmo") bodyHtml = this.renderLabAlgorithmBody(item);
      else if (item.tipo === "plantilla") bodyHtml = this.renderLabPlantillaBody(item);
      else if (item.tipo === "formula") bodyHtml = this.renderLabFormulaBody(item);
      else if (item.tipo === "trampa") bodyHtml = this.renderLabTrampaBody(item);

      return `
        <article class="lab-card ${meta.extraClass}" data-lab-id="${item.id}">
          <div class="lab-card-header">
            <div class="lab-card-badges">
              <span class="badge-lab-id">${item.id}</span>
              <span class="badge-lab-type">${meta.icon} ${meta.label}</span>
              <span class="badge-lab-nature">🛠️ ${natureLabel}</span>
            </div>
          </div>
          <h3 class="lab-card-title">${this.formatLabText(item.titulo)}</h3>
          ${item.resumen ? `<div class="lab-card-resumen">${this.formatLabText(item.resumen)}</div>` : ""}
          ${bodyHtml}
        </article>
      `;
    },

    renderLabDiagramBody(item) {
      const notes = (item.notasClave || []).map((n) => `
        <div class="lab-note-item">${this.formatLabText(n)}</div>
      `).join("");
      return `
        <div class="lab-svg-wrap">${item.svgDiagram || ""}</div>
        ${item.svgDiagram2 ? `<div class="lab-svg-wrap lab-svg-extra">${item.svgDiagram2}</div>` : ""}
        ${notes ? `<div class="lab-notes-list">${notes}</div>` : ""}
      `;
    },

    renderLabAlgorithmBody(item) {
      const pasos = item.pasos || [];
      const doneCount = pasos.filter((p) => this.labCompletedSteps.has(`${item.id}:${p.nro}`)).length;
      const stepsHtml = pasos.map((p) => {
        const isDone = this.labCompletedSteps.has(`${item.id}:${p.nro}`);
        return `
          <div class="lab-step-item ${isDone ? "done" : ""}">
            <div class="lab-step-header">
              <label class="lab-step-check-label">
                <input type="checkbox" class="lab-step-checkbox" ${isDone ? "checked" : ""} onchange="app.toggleLabStep('${item.id}', ${p.nro})" />
                <span class="lab-step-num">Paso ${p.nro}</span>
                <span>${this.formatLabText(p.titulo)}</span>
              </label>
            </div>
            <div class="lab-step-body">
              <div><strong>🧠 Qué está pasando:</strong> ${this.formatLabText(p.queHago)}</div>
              ${p.svgDiagram ? `<div class="lab-svg-wrap lab-svg-inline">${p.svgDiagram}</div>` : ""}
              ${p.formula ? `<div class="lab-formula-box">${this.formatLabText(p.formula)}</div>` : ""}
              ${p.queEscriboEnHoja ? `
                <div class="lab-paper-quote">
                  <span class="lab-paper-quote-label">💬 Comentario breve en la hoja (con tus palabras)</span>
                  <div>${this.formatLabText(p.queEscriboEnHoja)}</div>
                </div>
              ` : ""}
            </div>
          </div>
        `;
      }).join("");

      return `
        <div class="lab-algo-toolbar">
          <span class="lab-algo-progress">Checklist de práctica: ${doneCount} / ${pasos.length} pasos completados</span>
          ${doneCount > 0 ? `<button class="btn btn-outline btn-sm" onclick="app.resetLabAlgorithmSteps('${item.id}')">↺ Reiniciar pasos</button>` : ""}
        </div>
        <div class="lab-steps-list">${stepsHtml}</div>
      `;
    },

    renderLabTableBlock(tbl) {
      if (!tbl || !Array.isArray(tbl.columnas)) return "";
      const thead = tbl.columnas.map((c) => `<th>${this.formatLabText(c)}</th>`).join("");
      const tbody = (tbl.filas || []).map((row) => {
        const cells = row.map((cell) => `<td>${this.formatLabText(cell)}</td>`).join("");
        return `<tr>${cells}</tr>`;
      }).join("");
      return `
        <div class="lab-table-block">
          ${tbl.tituloTabla ? `<h4 class="lab-table-title">${this.formatLabText(tbl.tituloTabla)}</h4>` : ""}
          <div class="lab-table-wrap">
            <table class="lab-table">
              <thead><tr>${thead}</tr></thead>
              <tbody>${tbody}</tbody>
            </table>
          </div>
        </div>
      `;
    },

    renderLabPlantillaBody(item) {
      const tipHtml = item.tipHoja
        ? (String(item.tipHoja).trim().startsWith("💡")
            ? `<div class="lab-tip-box">${this.formatLabText(item.tipHoja)}</div>`
            : `<div class="lab-tip-box"><strong>💡 Tip de hoja:</strong> ${this.formatLabText(item.tipHoja)}</div>`)
        : "";
      return `
        ${item.svgDiagram ? `<div class="lab-svg-wrap lab-svg-inline">${item.svgDiagram}</div>` : ""}
        ${this.renderLabTableBlock(item.tablaPlantilla)}
        ${this.renderLabTableBlock(item.tablaPlantilla2)}
        ${tipHtml}
      `;
    },

    rateLabFlashcard(itemId, rating) {
      if (!window.StudyEngine || !this.srsMap) return;
      const key = `lab:${itemId}`;
      const now = Date.now();
      if (!this.labCardSessionBaseline) this.labCardSessionBaseline = {};
      if (!this.labCardSessionRating) this.labCardSessionRating = {};
      if (!this.labCardSessionBaseline[itemId]) {
        this.labCardSessionBaseline[itemId] = StudyEngine.cloneCard(this.srsMap[key] || StudyEngine.createEmptyCard());
      }
      const baseline = this.labCardSessionBaseline[itemId];
      const nextCard = StudyEngine.computeNextSrsState(baseline, rating, null, now);
      this.srsMap[key] = nextCard;
      this.labCardSessionRating[itemId] = rating;
      this.labRevealedCards.add(itemId);

      if (this.gamif) {
        const todayKey = StudyEngine.getLocalDateKey(now);
        const xpKey = `labcard:${itemId}`;
        if (!this.gamif.xpAwardedToday) this.gamif.xpAwardedToday = {};
        if (this.gamif.xpAwardedToday[xpKey] !== todayKey) {
          this.gamif.xpAwardedToday[xpKey] = todayKey;
          this.finalizeGamifAction({
            xpGain: 15,
            actionIncrement: 1,
            reviewIncrement: 1,
            recoveredIncrement: 0,
            nowMs: now,
            emitToast: true
          });
        } else {
          this.gamif.totalReviews = (this.gamif.totalReviews || 0) + 1;
          const summary = this.getStudySummary(now);
          StudyEngine.evaluateAchievements(this.gamif, summary, now);
        }
      }

      this.saveStudyState();
      this.renderGlobalStudyHud();

      const summary = this.getStudySummary(now);
      this.renderLabGlobalProgress(summary);
      const activeTema = (this.labData?.temas || []).find((t) => t.id === this.labSelectedTopic);
      if (activeTema) {
        this.renderLabTopicHeader(activeTema, summary);
        const hdrEl = document.getElementById("lab-topic-header");
        if (hdrEl) this.renderMath(hdrEl);
      }

      const cardEl = document.querySelector(`.lab-flashcard[data-lab-id="${itemId}"]`);
      if (cardEl) {
        const chipSlot = cardEl.querySelector(".lab-flashcard-chip-slot");
        if (chipSlot) {
          chipSlot.innerHTML = this.renderAnkiStatusChipHtml(nextCard);
        }
        const srsBox = cardEl.querySelector(".lab-flashcard-srs");
        if (srsBox) {
          srsBox.innerHTML = this.buildAnkiButtonsHtml({
            cardBefore: baseline,
            moodleScore: null,
            selectedRating: rating,
            handlerName: "app.rateLabFlashcard",
            itemArg: itemId,
            hintText: "¿Qué tan bien recordaste esta fórmula/paso sin mirar?"
          });
        }
      }

      const nextTxt = StudyEngine.formatIntervalLabel(nextCard.intervalHours, rating);
      this.showToast(`🧠 Flashcard programada (${nextTxt})`);
    },

    renderLabFormulaBody(item) {
      const isOpen = this.labRevealedCards.has(item.id);
      const srsCard = (this.srsMap && this.srsMap[`lab:${item.id}`]) || null;
      const chipHtml = (srsCard && srsCard.reps > 0) ? this.renderAnkiStatusChipHtml(srsCard) : "";
      const cardBaseline = (this.labCardSessionBaseline && this.labCardSessionBaseline[item.id]) || srsCard || (window.StudyEngine ? StudyEngine.createEmptyCard() : {});
      const ratingUi = window.StudyEngine ? `
        <div class="lab-flashcard-srs">
          ${this.buildAnkiButtonsHtml({
            cardBefore: cardBaseline,
            moodleScore: null,
            selectedRating: this.labCardSessionRating ? this.labCardSessionRating[item.id] : null,
            handlerName: "app.rateLabFlashcard",
            itemArg: item.id,
            hintText: "¿Qué tan bien recordaste esta fórmula/paso sin mirar?"
          })}
        </div>
      ` : "";

      return `
        <div class="lab-flashcard-front">${this.formatLabText(item.preguntaFrente)}</div>
        <div class="lab-flashcard-actions" style="display:flex;flex-wrap:wrap;align-items:center;gap:0.65rem;">
          <button class="btn btn-primary btn-sm lab-flashcard-toggle" onclick="app.toggleFlashcard('${item.id}')">
            ${isOpen ? "🙈 Ocultar fórmula" : "👁️ Revelar fórmula"}
          </button>
          <span class="lab-flashcard-chip-slot">${chipHtml}</span>
        </div>
        <div class="lab-flashcard-back ${isOpen ? "" : "hidden"}">
          ${this.formatLabText(item.respuestaDorso)}
          ${item.svgDiagram ? `<div class="lab-svg-wrap lab-svg-inline">${item.svgDiagram}</div>` : ""}
          ${ratingUi}
        </div>
      `;
    },

    renderLabTrampaBody(item) {
      const listHtml = (item.trampas || []).map((t) => `
        <div class="lab-trap-item">
          <span class="lab-trap-icon">🚨</span>
          <div>${this.formatLabText(t)}</div>
        </div>
      `).join("");
      return `<div class="lab-trap-list">${listHtml}</div>`;
    }
  };

  // Expose to window
  window.app = app;

  // Initialize once DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => app.init());
  } else {
    app.init();
  }
})();
