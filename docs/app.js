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
        this.renderStaticMath();
      } else if (viewName === "history") {
        this.renderHistory();
      } else if (viewName === "qa") {
        this.renderQAMode();
      } else if (viewName === "practice") {
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

      // Render Results View
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
    // Practice Mode Engine
    // -------------------------------------------------------------
    initPracticeMode() {
      const filterBar = document.getElementById("practice-filter-bar");
      if (!filterBar) return;
      filterBar.innerHTML = "";

      // Compute topic counts
      const counts = { ALL: this.allQuestions.length };
      this.allQuestions.forEach((q) => {
        counts[q.tema] = (counts[q.tema] || 0) + 1;
      });

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

      document.querySelectorAll(".filter-btn").forEach((btn) => {
        btn.classList.toggle("active", btn.id === `practice-btn-${topicKey}`);
      });

      if (topicKey === "ALL") {
        this.practiceQuestions = [...this.allQuestions];
      } else if (topicKey === "YEAR_2025") {
        this.practiceQuestions = this.allQuestions.filter((q) => this.matchesYearFilter(q, "PARCIAL_2025"));
      } else {
        this.practiceQuestions = this.allQuestions.filter((q) => q.tema === topicKey);
      }

      this.practiceIndex = 0;
      this.practiceAnswers = {};
      this.practiceEvaluated = {};
      this.renderPracticeQuestion();
    },

    renderPracticeQuestion() {
      const container = document.getElementById("practice-container");
      if (!container) return;

      if (this.practiceQuestions.length === 0) {
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
      this.practiceEvaluated[this.practiceIndex] = true;
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
        this.renderPracticeQuestion();
      }
    },

    nextPracticeQuestion() {
      if (this.practiceIndex < this.practiceQuestions.length - 1) {
        this.practiceIndex++;
        this.renderPracticeQuestion();
      }
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
      if (this.labCompletedSteps.has(key)) {
        this.labCompletedSteps.delete(key);
      } else {
        this.labCompletedSteps.add(key);
      }
      this.saveLabSteps();
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

      // 3. Topic Header + Checklist Progress
      const totalSteps = activeTema.items.reduce((acc, it) => acc + (Array.isArray(it.pasos) ? it.pasos.length : 0), 0);
      const doneSteps = activeTema.items.reduce((acc, it) => {
        if (!Array.isArray(it.pasos)) return acc;
        return acc + it.pasos.filter((p) => this.labCompletedSteps.has(`${it.id}:${p.nro}`)).length;
      }, 0);

      if (topicHeaderEl) {
        topicHeaderEl.innerHTML = `
          <div class="lab-topic-header-top">
            <h2 class="lab-topic-title"><span>${activeTema.icono || "🛠️"}</span> ${activeTema.nombre}</h2>
            <span class="badge badge-lab-nature">${activeTema.badge || "SOLO PRÁCTICA · NO ES PARCIAL"}</span>
          </div>
          <div class="lab-topic-meta">
            <span class="lab-meta-chip">⚖️ Ponderación típica: ${activeTema.ponderacion || "N/A"}</span>
            <span class="lab-meta-chip">⏱️ Tiempo sugerido: ${activeTema.tiempoSugerido || "N/A"}</span>
            <span class="lab-meta-chip progress">☑️ Pasos practicados: ${doneSteps} / ${totalSteps}</span>
          </div>
          ${activeTema.referenciaCatedra ? `
            <div class="lab-catedra-ref">
              <div><strong>📚 Referencia de Cátedra:</strong> ${this.escapeHtml(activeTema.referenciaCatedra)}</div>
              ${this.renderRepoLinksHtml(activeTema.referenciaLinks, "🔗 Guías y modelos originales:")}
            </div>` : ""}
          <div class="lab-topic-objetivo">${this.formatLabText(activeTema.objetivo)}</div>
        `;
      }

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

    renderLabFormulaBody(item) {
      const isOpen = this.labRevealedCards.has(item.id);
      return `
        <div class="lab-flashcard-front">${this.formatLabText(item.preguntaFrente)}</div>
        <div class="lab-flashcard-actions">
          <button class="btn btn-primary btn-sm lab-flashcard-toggle" onclick="app.toggleFlashcard('${item.id}')">
            ${isOpen ? "🙈 Ocultar fórmula" : "👁️ Revelar fórmula"}
          </button>
        </div>
        <div class="lab-flashcard-back ${isOpen ? "" : "hidden"}">
          ${this.formatLabText(item.respuestaDorso)}
          ${item.svgDiagram ? `<div class="lab-svg-wrap lab-svg-inline">${item.svgDiagram}</div>` : ""}
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
