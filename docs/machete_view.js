/**
 * Machete Maestro & Ejemplos Resueltos de Cátedra — Vista de Consulta Rápida (#view-machete)
 * Pure UMD module (Browser + Node testable, zero external dependencies).
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.MacheteView = factory();
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const R = String.raw;

  function escapeHtml(str) {
    return String(str === null || str === undefined ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  const MACHETE_METHODS = [
    {
      id: "AG",
      labKey: "ALGORITMOS_GENETICOS",
      order: 1,
      badge: "AG",
      inP2Scope: true,
      scopeLabel: "✅ Entra en 2do Parcial",
      title: "1. Algoritmos Genéticos (AG)",
      subtitle: R`Individuos $I_{01}, I_{02}, \dots$ · Aptitud $f_i$ · Genes $G_1, G_2, \dots$ contando desde la izquierda.`,
      svgDiagram: `
        <svg viewBox="0 0 560 190" class="mc-svg-diagram" role="img" aria-label="Flujo de Selección, Cruza y Mutación en Algoritmos Genéticos">
          <defs>
            <marker id="mc-ag-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="var(--primary)" />
            </marker>
          </defs>
          <!-- 1. Selección -->
          <rect x="12" y="22" width="155" height="146" rx="10" fill="var(--bg-card)" stroke="var(--primary)" stroke-width="1.6"/>
          <text x="89" y="44" text-anchor="middle" fill="var(--primary)" font-size="11.5" font-weight="800">1. SELECCIÓN</text>
          <text x="89" y="64" text-anchor="middle" fill="var(--text-main)" font-size="10" font-weight="700">Elitista: Top % directo</text>
          <text x="89" y="84" text-anchor="middle" fill="var(--text-main)" font-size="10">Ruleta [00–99]: fi / Σf</text>
          <text x="89" y="104" text-anchor="middle" fill="var(--text-main)" font-size="10">Copias: ci = fi / f̄</text>
          <text x="89" y="122" text-anchor="middle" fill="var(--text-muted)" font-size="9">⌊ci⌋ + mayor decimal/ruleta</text>
          <text x="89" y="144" text-anchor="middle" fill="var(--text-main)" font-size="10">Ranking: i=1..n ordenado</text>

          <line x1="169" y1="95" x2="195" y2="95" stroke="var(--primary)" stroke-width="2" marker-end="url(#mc-ag-arr)"/>

          <!-- 2. Cruza -->
          <rect x="199" y="22" width="182" height="146" rx="10" fill="var(--bg-card)" stroke="#10b981" stroke-width="1.6"/>
          <text x="290" y="44" text-anchor="middle" fill="#10b981" font-size="11.5" font-weight="800">2. CRUZA (desde izq. G₁)</text>
          <!-- Bits visual -->
          <rect x="215" y="56" width="70" height="20" rx="4" fill="rgba(99,102,241,0.22)" stroke="#6366f1"/>
          <text x="250" y="70" text-anchor="middle" fill="var(--text-main)" font-size="10" font-weight="700">P: 0011</text>
          <rect x="295" y="56" width="70" height="20" rx="4" fill="rgba(16,185,129,0.22)" stroke="#10b981"/>
          <text x="330" y="70" text-anchor="middle" fill="var(--text-main)" font-size="10" font-weight="700">M: 1010</text>
          <line x1="290" y1="52" x2="290" y2="82" stroke="var(--danger)" stroke-width="2" stroke-dasharray="3 2"/>
          <text x="290" y="96" text-anchor="middle" fill="var(--text-main)" font-size="9.5" font-weight="700">Simple G_k · Multipunto · Binomial</text>
          <text x="290" y="114" text-anchor="middle" fill="var(--text-muted)" font-size="9">Hijo 2: clásico, no elegidos</text>
          <text x="290" y="130" text-anchor="middle" fill="var(--warning)" font-size="9" font-weight="700">o complemento binario (0↔1)</text>
          <text x="290" y="152" text-anchor="middle" fill="var(--text-muted)" font-size="9">Binomial: [0..100p−1] P | [100p..99] M</text>

          <line x1="383" y1="95" x2="409" y2="95" stroke="var(--primary)" stroke-width="2" marker-end="url(#mc-ag-arr)"/>

          <!-- 3. Mutación -->
          <rect x="413" y="22" width="135" height="146" rx="10" fill="var(--bg-card)" stroke="#f59e0b" stroke-width="1.6"/>
          <text x="480" y="44" text-anchor="middle" fill="#f59e0b" font-size="11.5" font-weight="800">3. MUTACIÓN</text>
          <text x="480" y="68" text-anchor="middle" fill="var(--text-main)" font-size="10" font-weight="700">Simple: bit 0 ↔ 1</text>
          <text x="480" y="92" text-anchor="middle" fill="var(--text-main)" font-size="10">Temp. Ascendente:</text>
          <text x="480" y="108" text-anchor="middle" fill="var(--text-muted)" font-size="9.5">Pm(t) = min(max, min+λt)</text>
          <text x="480" y="130" text-anchor="middle" fill="var(--text-main)" font-size="10">Temp. Descendente:</text>
          <text x="480" y="146" text-anchor="middle" fill="var(--text-muted)" font-size="9.5">Pm(t) = max(min, max−λt)</text>
        </svg>
      `,
      coreSteps: [
        R`<strong>1. Selección Elitista:</strong> Copiar directo el porcentaje pedido (ej. <code>30%</code>) de los individuos con mayor $f_i$ hacia $t+1$ (no pasan por cruza).`,
        R`<strong>2. Selección por Ruleta <code>[00-99]</code>:</strong> $\text{Norm}_i = \frac{f_i}{\sum f_j} \times 100$ (redondear a ranuras enteras que sumen <code>100</code>), armar rangos acumulados y asignar cada número aleatorio.`,
        R`<strong>3. Control de Copias Esperadas:</strong> $c_i = \frac{f_i}{\bar{f}}$ donde $\bar{f} = \frac{\sum f_j}{n}$. Asignar $\lfloor c_i \rfloor$ copias y completar el cupo con <strong>mayor parte decimal</strong> (o ruleta decimal si lo pide).`,
        R`<strong>4. Selección por Ranking Lineal:</strong> Ordenar de mayor a menor aptitud ($i=1$ mejor, $i=n$ peor) y calcular $\text{Copias}(i) = R_{\min} + 2 \cdot \frac{(n - i)(1 - R_{\min})}{n - 1}$.`,
        R`<strong>5. Cruzas &amp; Mutación:</strong> Contar $G_1$ desde la izquierda. Aplicar Cruza Simple/Multipunto/Binomial (verificando qué variante de Hijo 2 pide el enunciado) y luego la Mutación indicada.`
      ],
      variants: [
        {
          name: "Cruza Simple (en gen k)",
          badge: "Clásico vs Complemento",
          formula: R`Corte entre $G_k$ y $G_{k+1}$: Hijo 1 = $\text{cab}(P) + \text{cola}(M)$`,
          detail: R`<strong>Hijo 2 clásico:</strong> $\text{cab}(M) + \text{cola}(P)$. <strong>Variante Complemento:</strong> Hijo 2 = invertir bit a bit (<code>0 ↔ 1</code>) del Hijo 1.`
        },
        {
          name: "Cruza Multipunto",
          badge: "Cortes a, b, ...",
          formula: R`Cortar tras $G_a, G_b, \dots$ y alternar bloques`,
          detail: R`En cada segmento entre cortes se alterna Padre y Madre para Hijo 1 (y el patrón inverso para Hijo 2).`
        },
        {
          name: "Cruza Binomial (y Uniforme)",
          badge: "Prob. p y m = 1 − p",
          formula: R`Padre: <code>00</code> a $100p - 1$ · Madre: $100p$ a <code>99</code>`,
          detail: R`Si $p=0.5$ es <strong>cruza uniforme</strong>. Leer un aleatorio por cada gen $G_1 \dots G_L \to$ Hijo 1. Para <strong>Hijo 2</strong> hay 2 variantes: <em>genes no seleccionados</em> o <em>complemento binario</em>.`
        },
        {
          name: "Mutación Adaptativa",
          badge: "Temperatura / Convergencia",
          formula: R`Asc: $\min(P_m^{\max}, P_m^{\min} + \lambda t)$ · Desc: $\max(P_m^{\min}, P_m^{\max} - \lambda t)$`,
          detail: R`Paso a paso: $P_m[t+1] = P_m[t] \pm |\lambda|$. En adaptativa por <strong>convergencia</strong>, si la población pierde diversidad (muchos idénticos), sube $P_m$.`
        }
      ],
      traps: [
        R`Contar los genes desde la derecha en lugar de la <strong>izquierda ($G_1, G_2, \dots$)</strong>.`,
        R`Solapar bordes en Ruleta (<code>00-06</code> y <code>06-09</code>): los intervalos deben ser disjuntos y sumar exactamente 100 ranuras (<code>00</code> a <code>99</code>).`,
        R`No leer si el enunciado pide <strong>Hijo 2 por complemento</strong> o por <strong>genes no seleccionados / clásico</strong>.`
      ],
      examples: [
        {
          id: "ex_ag_1a",
          title: "Ejemplo 1A — Ruleta [00–99] completa con 9 individuos (Slide 14)",
          meta: "Fuente: Slide 14 Cátedra",
          problemHtml: R`
            Población inicial de $9$ individuos con aptitudes $f = [20, 10, 50, 70, 80, 10, 40, 30, 15]$.
            Se pide seleccionar $4$ padres usando el método de <strong>Ruleta <code>[00–99]</code></strong> y la tira de números aleatorios: <code>32, 05, 99, 65</code>.
          `,
          steps: [
            {
              title: "Sumar aptitudes y normalizar proporciones",
              paperComment: "Sumo las aptitudes totales de la población y calculo la fracción de ruleta que le corresponde a cada individuo.",
              mathHtml: R`
                $$\sum_{j=0}^{8} f_j = 20+10+50+70+80+10+40+30+15 = \mathbf{325}$$
                Por ejemplo: $\text{Norm}_0 = \frac{20}{325} = 0.0615 \implies 6.15\% \approx \mathbf{6\text{ ranuras}}$; $\;\text{Norm}_4 = \frac{80}{325} = 0.2462 \implies \mathbf{25\text{ ranuras}}$.
              `,
              note: "Las ranuras enteras redondeadas de los 9 individuos deben sumar exactamente 100 (ajuste de ±1 en el mayor resto si hiciera falta)."
            },
            {
              title: "Armar tabla acumulada de intervalos disjuntos [00–99]",
              paperComment: "Construyo los rangos acumulados sin solapar bordes, empezando en 00 y cerrando en 99.",
              mathHtml: R`
                <div class="mc-table-wrap">
                  <table class="pe-data-table">
                    <thead><tr><th>Indiv</th><th>$f_i$</th><th>$f_i/325$</th><th>Ranuras</th><th>Intervalo <code>[lo–hi]</code></th><th>¿Sorteado?</th></tr></thead>
                    <tbody>
                      <tr class="mc-row-highlight"><td>$I_0$</td><td>20</td><td>0.0615</td><td>6</td><td><code>00–05</code></td><td><strong>✓ con <code>05</code></strong></td></tr>
                      <tr><td>$I_1$</td><td>10</td><td>0.0308</td><td>3</td><td><code>06–08</code></td><td>—</td></tr>
                      <tr><td>$I_2$</td><td>50</td><td>0.1538</td><td>15</td><td><code>09–23</code></td><td>—</td></tr>
                      <tr class="mc-row-highlight"><td>$I_3$</td><td>70</td><td>0.2154</td><td>22</td><td><code>24–45</code></td><td><strong>✓ con <code>32</code></strong></td></tr>
                      <tr class="mc-row-highlight"><td>$I_4$</td><td>80</td><td>0.2462</td><td>25</td><td><code>46–70</code></td><td><strong>✓ con <code>65</code></strong></td></tr>
                      <tr><td>$I_5$</td><td>10</td><td>0.0308</td><td>3</td><td><code>71–73</code></td><td>—</td></tr>
                      <tr><td>$I_6$</td><td>40</td><td>0.1231</td><td>12</td><td><code>74–85</code></td><td>—</td></tr>
                      <tr><td>$I_7$</td><td>30</td><td>0.0923</td><td>9</td><td><code>86–94</code></td><td>—</td></tr>
                      <tr class="mc-row-highlight"><td>$I_8$</td><td>15</td><td>0.0462</td><td>5</td><td><code>95–99</code></td><td><strong>✓ con <code>99</code></strong></td></tr>
                    </tbody>
                  </table>
                </div>
              `,
              note: "Observá cómo I0 termina en 05 e I1 empieza en 06 (nunca ambos en 06). Así cada número de 00 a 99 cae en un único individuo."
            },
            {
              title: "Ubicar los aleatorios 32, 05, 99, 65 en la recta de ruleta",
              paperComment: "Con la secuencia de aleatorios dada, identifico el individuo cuyo intervalo contiene a cada valor.",
              mathHtml: R`
                <ul>
                  <li><code>r = 32</code> cae en <code>[24–45]</code> $\implies$ selecciona <strong>$I_3$</strong></li>
                  <li><code>r = 05</code> cae en el borde superior de <code>[00–05]</code> $\implies$ selecciona <strong>$I_0$</strong></li>
                  <li><code>r = 99</code> cae en el cierre <code>[95–99]</code> $\implies$ selecciona <strong>$I_8$</strong></li>
                  <li><code>r = 65</code> cae en <code>[46–70]</code> $\implies$ selecciona <strong>$I_4$</strong></li>
                </ul>
              `,
              visualHtml: `
                <svg viewBox="0 0 520 96" role="img" aria-label="Recta [00-99] de Ruleta con disparos en 05, 32, 65 y 99">
                  <rect x="20" y="34" width="28" height="22" fill="rgba(16,185,129,0.28)" stroke="#10b981"/>
                  <rect x="48" y="34" width="84" height="22" fill="var(--bg-subtle)" stroke="var(--border-color)"/>
                  <rect x="132" y="34" width="106" height="22" fill="rgba(99,102,241,0.26)" stroke="var(--primary)"/>
                  <rect x="238" y="34" width="120" height="22" fill="rgba(245,158,11,0.26)" stroke="#f59e0b"/>
                  <rect x="358" y="34" width="114" height="22" fill="var(--bg-subtle)" stroke="var(--border-color)"/>
                  <rect x="472" y="34" width="28" height="22" fill="rgba(236,72,153,0.28)" stroke="#ec4899"/>
                  <text x="34" y="49" text-anchor="middle" fill="var(--text-main)" font-size="9" font-weight="700">I₀</text>
                  <text x="185" y="49" text-anchor="middle" fill="var(--text-main)" font-size="9.5" font-weight="700">I₃ [24–45]</text>
                  <text x="298" y="49" text-anchor="middle" fill="var(--text-main)" font-size="9.5" font-weight="700">I₄ [46–70]</text>
                  <text x="486" y="49" text-anchor="middle" fill="var(--text-main)" font-size="9" font-weight="700">I₈</text>
                  <!-- Pins -->
                  <circle cx="44" cy="24" r="4" fill="#10b981"/><text x="44" y="14" text-anchor="middle" fill="#10b981" font-size="9.5" font-weight="800">05</text>
                  <circle cx="174" cy="24" r="4" fill="var(--primary)"/><text x="174" y="14" text-anchor="middle" fill="var(--primary)" font-size="9.5" font-weight="800">32</text>
                  <circle cx="332" cy="24" r="4" fill="#f59e0b"/><text x="332" y="14" text-anchor="middle" fill="#f59e0b" font-size="9.5" font-weight="800">65</text>
                  <circle cx="496" cy="24" r="4" fill="#ec4899"/><text x="496" y="14" text-anchor="middle" fill="#ec4899" font-size="9.5" font-weight="800">99</text>
                  <text x="20" y="76" fill="var(--text-muted)" font-size="8.5">00</text>
                  <text x="132" y="76" text-anchor="middle" fill="var(--text-muted)" font-size="8.5">24</text>
                  <text x="238" y="76" text-anchor="middle" fill="var(--text-muted)" font-size="8.5">46</text>
                  <text x="472" y="76" text-anchor="middle" fill="var(--text-muted)" font-size="8.5">95</text>
                  <text x="500" y="76" text-anchor="end" fill="var(--text-muted)" font-size="8.5">99</text>
                </svg>
              `,
              note: "Incluso los individuos de poca aptitud (I8 con solo 5%) tienen chances si toca un aleatorio alto como 99."
            }
          ],
          conclusionHtml: R`Padres seleccionados por Ruleta: <strong><code>{I0, I3, I4, I8}</code></strong>.`
        },
        {
          id: "ex_ag_1b",
          title: "Ejemplo 1B — Control de Copias Esperadas (Parcial 2025) y Ranking Lineal",
          meta: "Fuente: Parcial 2025 & Slide 20",
          problemHtml: R`
            <strong>Parte A (Parcial 2025):</strong> De 8 individuos ($I_{01}\dots I_{08}$) cuya suma de aptitud es $\sum f = 188$, seleccionar el <code>50%</code> ($4$ copias) por <strong>Control de Copias Esperadas</strong> (con $f_{06}=44, f_{07}=41, f_{04}=22, f_{03}=21$ entre ellos).<br>
            <strong>Parte B (Slide 20):</strong> Calcular las copias esperadas por <strong>Ranking Lineal</strong> para $n = 7$ individuos ordenados con $R_{\min} = 0$.
          `,
          steps: [
            {
              title: "Control de Copias: calcular aptitud media f̄ y valor esperado c_i",
              paperComment: "Calculo el promedio de aptitud poblacional y divido cada aptitud por ese promedio para hallar las copias esperadas c_i.",
              mathHtml: R`
                $$\bar{f} = \frac{\sum f_j}{n} = \frac{188}{8} = \mathbf{23.5} \qquad\Longrightarrow\qquad c_i = \frac{f_i}{23.5}$$
                <ul>
                  <li>$I_{06}$: $c = 44 / 23.5 = \mathbf{1.87}$ ($\lfloor c \rfloor = 1$, dec. <code>0.87</code>)</li>
                  <li>$I_{07}$: $c = 41 / 23.5 = \mathbf{1.74}$ ($\lfloor c \rfloor = 1$, dec. <code>0.74</code>)</li>
                  <li>$I_{04}$: $c = 22 / 23.5 = \mathbf{0.94}$ ($\lfloor c \rfloor = 0$, dec. <code>0.94</code>)</li>
                  <li>$I_{03}$: $c = 21 / 23.5 = \mathbf{0.89}$ ($\lfloor c \rfloor = 0$, dec. <code>0.89</code>)</li>
                  <li>Restantes ($I_{01},I_{02},I_{05},I_{08}$): tienen $\lfloor c \rfloor = 0$ y decimales menores a <code>0.89</code>.</li>
                </ul>
              `,
              note: "La suma de todos los c_i siempre es n (= 8). Como solo elegimos 4 individuos, primero aseguramos las partes enteras."
            },
            {
              title: "Asignar partes enteras y completar cupo con mayores decimales",
              paperComment: "Otorgo copias seguras según parte entera ⌊c_i⌋ y completo las vacantes restantes tomando los individuos con mayor parte decimal.",
              mathHtml: R`
                <ol>
                  <li><strong>Partes enteras $\ge 1$:</strong> $I_{06}$ (1 copia) e $I_{07}$ (1 copia) $\implies 2$ cupos cubiertos.</li>
                  <li><strong>Faltan $4 - 2 = 2$ cupos:</strong> ordeno las partes decimales restantes (ojo: ya usados sus enteros, comparo <code>0.94, 0.89, 0.87, 0.74...</code>). Las dos mayores son <strong>$I_{04}$ (<code>0.94</code>)</strong> y <strong>$I_{03}$ (<code>0.89</code>)</strong>.</li>
                </ol>
              `,
              note: "Si la consigna dijera 'armar ruleta con las partes decimales', normalizás esas fracciones (sin el entero) a [00–99] y sorteás con aleatorios."
            },
            {
              title: "Ranking Lineal: ordenar mejor → peor y evaluar fórmula",
              paperComment: "Ordeno la población de mejor aptitud (i = 1) a peor (i = n) y aplico la fórmula de Ranking Lineal con R_min = 0.",
              mathHtml: R`
                $$\text{Copias}(i) = R_{\min} + 2 \cdot \frac{(n - i)(1 - R_{\min})}{n - 1} = 0 + 2 \cdot \frac{7 - i}{6} = \frac{7 - i}{3}$$
                <div class="mc-table-wrap">
                  <table class="pe-data-table">
                    <thead><tr><th>Orden $i$</th><th>1 (Mejor)</th><th>2</th><th>3</th><th>4 (Mediana)</th><th>5</th><th>6</th><th>7 (Peor)</th></tr></thead>
                    <tbody><tr><td><strong>Copias</strong></td><td><strong>2.00</strong></td><td>1.67</td><td>1.33</td><td>1.00</td><td>0.67</td><td>0.33</td><td>0.00</td></tr></tbody>
                  </table>
                </div>
              `,
              visualHtml: `
                <svg viewBox="0 0 500 105" role="img" aria-label="Copias asignadas por Ranking Lineal de i=1 a i=7">
                  <line x1="30" y1="82" x2="480" y2="82" stroke="var(--border-color)" stroke-width="1.2"/>
                  <rect x="48" y="16" width="38" height="66" rx="3" fill="var(--primary)"/><text x="67" y="12" text-anchor="middle" fill="var(--text-main)" font-size="9" font-weight="700">2.00</text>
                  <rect x="108" y="27" width="38" height="55" rx="3" fill="var(--primary)" opacity="0.88"/><text x="127" y="23" text-anchor="middle" fill="var(--text-main)" font-size="9">1.67</text>
                  <rect x="168" y="38" width="38" height="44" rx="3" fill="var(--primary)" opacity="0.76"/><text x="187" y="34" text-anchor="middle" fill="var(--text-main)" font-size="9">1.33</text>
                  <rect x="228" y="49" width="38" height="33" rx="3" fill="#10b981"/><text x="247" y="45" text-anchor="middle" fill="#10b981" font-size="9" font-weight="700">1.00</text>
                  <rect x="288" y="60" width="38" height="22" rx="3" fill="var(--primary)" opacity="0.52"/><text x="307" y="56" text-anchor="middle" fill="var(--text-muted)" font-size="9">0.67</text>
                  <rect x="348" y="71" width="38" height="11" rx="3" fill="var(--primary)" opacity="0.38"/><text x="367" y="67" text-anchor="middle" fill="var(--text-muted)" font-size="9">0.33</text>
                  <rect x="408" y="81" width="38" height="1" fill="var(--danger)"/><text x="427" y="76" text-anchor="middle" fill="var(--danger)" font-size="9">0.00</text>
                  <text x="67" y="96" text-anchor="middle" fill="var(--text-muted)" font-size="9">i=1</text>
                  <text x="247" y="96" text-anchor="middle" fill="var(--text-muted)" font-size="9">i=4</text>
                  <text x="427" y="96" text-anchor="middle" fill="var(--text-muted)" font-size="9">i=7</text>
                </svg>
              `,
              note: "El Ranking evita que un 'súper individuo' con aptitud altísima monopolice la ruleta: las copias crecen linealmente según la posición."
            }
          ],
          conclusionHtml: R`Control de Copias: <strong><code>{I06, I07, I04, I03}</code></strong> · Ranking Lineal ($n=7$): <strong><code>2.00, 1.67, 1.33, 1.00, 0.67, 0.33, 0.00</code></strong>.`
        },
        {
          id: "ex_ag_1c",
          title: "Ejemplo 1C — Cruzas Simple, Multipunto y Binomial con ambas variantes de Hijo 2",
          meta: "Fuente: Slides 22–25 & Guías 02c/04",
          problemHtml: R`
            Sean Padre <span class="mc-bit-chip mc-bit-p">P = 00110001</span> y Madre <span class="mc-bit-chip mc-bit-m">M = 10101010</span> ($8$ genes $G_1 \dots G_8$ desde la izquierda).
            Resolver: <strong>(1)</strong> Cruza Simple en $G_4$ (clásica y complemento), <strong>(2)</strong> Multipunto en $G_1, G_4, G_7$, y <strong>(3)</strong> Binomial ($p=0.6, m=0.4$, aleatorios <code>[21, 72, 85, 43, 55, 18, 92, 33]</code>).
          `,
          steps: [
            {
              title: "Cruza Simple en G₄ (variante clásica vs variante por complemento)",
              paperComment: "Corto ambos cromosomas después del 4to gen contando desde la izquierda y recombinando cabeza y cola.",
              mathHtml: R`
                <ul>
                  <li><strong>Cabezas ($G_1\dots G_4$) y Colas ($G_5\dots G_8$):</strong> $P = \texttt{0011}\,|\,\texttt{0001}$ y $M = \texttt{1010}\,|\,\texttt{1010}$.</li>
                  <li><strong>Hijo 1 ($\text{cab } P + \text{cola } M$):</strong> <span class="mc-bit-chip mc-bit-p">0011</span> + <span class="mc-bit-chip mc-bit-m">1010</span> $= \texttt{00111010}$</li>
                  <li><strong>Hijo 2 clásico ($\text{cab } M + \text{cola } P$):</strong> <span class="mc-bit-chip mc-bit-m">1010</span> + <span class="mc-bit-chip mc-bit-p">0001</span> $= \texttt{10100001}$</li>
                  <li><strong>Hijo 2 por Complemento Binario</strong> (Guía 04/07d, invertir <code>0↔1</code> el Hijo 1): <span class="mc-bit-chip mc-bit-comp">11000101</span></li>
                </ul>
              `,
              visualHtml: `
                <svg viewBox="0 0 460 94" role="img" aria-label="Diagrama visual de corte simple tras gen G4 e inversión binaria para complemento">
                  <text x="16" y="26" fill="var(--primary)" font-size="9.5" font-weight="800">Padre (P):</text>
                  <rect x="90" y="12" width="110" height="20" rx="4" fill="rgba(99,102,241,0.22)" stroke="#6366f1"/><text x="145" y="26" text-anchor="middle" fill="var(--text-main)" font-size="10.5" font-weight="700">0 0 1 1</text>
                  <rect x="206" y="12" width="110" height="20" rx="4" fill="rgba(99,102,241,0.08)" stroke="#6366f1" stroke-dasharray="3 2"/><text x="261" y="26" text-anchor="middle" fill="var(--text-muted)" font-size="10.5">0 0 0 1</text>
                  <text x="16" y="54" fill="#10b981" font-size="9.5" font-weight="800">Madre (M):</text>
                  <rect x="90" y="40" width="110" height="20" rx="4" fill="rgba(16,185,129,0.08)" stroke="#10b981" stroke-dasharray="3 2"/><text x="145" y="54" text-anchor="middle" fill="var(--text-muted)" font-size="10.5">1 0 1 0</text>
                  <rect x="206" y="40" width="110" height="20" rx="4" fill="rgba(16,185,129,0.22)" stroke="#10b981"/><text x="261" y="54" text-anchor="middle" fill="var(--text-main)" font-size="10.5" font-weight="700">1 0 1 0</text>
                  <line x1="203" y1="6" x2="203" y2="86" stroke="var(--danger)" stroke-width="2" stroke-dasharray="4 2"/>
                  <text x="330" y="34" fill="var(--text-main)" font-size="9.2" font-weight="700">Hijo 1 = 0011 1010</text>
                  <text x="330" y="54" fill="var(--warning)" font-size="9.2" font-weight="700">Hijo 2 (comp.) = 1100 0101</text>
                  <text x="203" y="88" text-anchor="middle" fill="var(--danger)" font-size="8.5" font-weight="800">Corte tras G₄</text>
                </svg>
              `,
              note: "Leé bien el enunciado: si pide Hijo 2 por complemento NO intercambies colas de M+P, directamente invertís bit a bit el Hijo 1."
            },
            {
              title: "Cruza Multipunto en G₁, G₄, G₇",
              paperComment: "Marco cortes tras las posiciones 1, 4 y 7 desde la izquierda y alterno bloques Padre/Madre.",
              mathHtml: R`
                División de bloques: $P = \texttt{0} | \texttt{011} | \texttt{000} | \texttt{1}$ y $M = \texttt{1} | \texttt{010} | \texttt{101} | \texttt{0}$:
                <ul>
                  <li><strong>Hijo 1 ($P|M|P|M$):</strong> <span class="mc-bit-chip mc-bit-p">0</span> <span class="mc-bit-chip mc-bit-m">010</span> <span class="mc-bit-chip mc-bit-p">000</span> <span class="mc-bit-chip mc-bit-m">0</span> $= \mathbf{\texttt{00100000}}$</li>
                  <li><strong>Hijo 2 ($M|P|M|P$):</strong> <span class="mc-bit-chip mc-bit-m">1</span> <span class="mc-bit-chip mc-bit-p">011</span> <span class="mc-bit-chip mc-bit-m">101</span> <span class="mc-bit-chip mc-bit-p">1</span> $= \mathbf{\texttt{10111011}}$</li>
                </ul>
              `,
              note: "Contar siempre desde el extremo izquierdo (G1). Cada corte invierte de qué progenitor se copia el segmento siguiente."
            },
            {
              title: "Cruza Binomial (p = 0.6, m = 0.4) gen por gen",
              paperComment: "Asigno ranuras [00–59] al Padre y [60–99] a la Madre, y decido gen por gen según cada número aleatorio.",
              mathHtml: R`
                <div class="mc-table-wrap">
                  <table class="pe-data-table">
                    <thead><tr><th>Gen</th><th>$G_1$</th><th>$G_2$</th><th>$G_3$</th><th>$G_4$</th><th>$G_5$</th><th>$G_6$</th><th>$G_7$</th><th>$G_8$</th></tr></thead>
                    <tbody>
                      <tr><td>Aleatorio</td><td><code>21</code></td><td><code>72</code></td><td><code>85</code></td><td><code>43</code></td><td><code>55</code></td><td><code>18</code></td><td><code>92</code></td><td><code>33</code></td></tr>
                      <tr><td>Elige (&lt;60 P)</td><td><strong>P</strong></td><td>M</td><td>M</td><td><strong>P</strong></td><td><strong>P</strong></td><td><strong>P</strong></td><td>M</td><td><strong>P</strong></td></tr>
                      <tr class="mc-row-highlight"><td><strong>Hijo 1</strong></td><td><code>0</code></td><td><code>0</code></td><td><code>1</code></td><td><code>1</code></td><td><code>0</code></td><td><code>0</code></td><td><code>1</code></td><td><code>1</code></td></tr>
                      <tr><td><strong>Hijo 2 (no eleg.)</strong></td><td><code>1</code></td><td><code>0</code></td><td><code>1</code></td><td><code>0</code></td><td><code>1</code></td><td><code>0</code></td><td><code>0</code></td><td><code>0</code></td></tr>
                    </tbody>
                  </table>
                </div>
                Y si la consigna pide <strong>Hijo 2 por complemento</strong> del Hijo 1 ($\texttt{00110011}$): <span class="mc-bit-chip mc-bit-comp">11001100</span>.
              `,
              note: "Si p = 0.5 y m = 0.5 se llama Cruza Uniforme (ranuras 00–49 Padre, 50–99 Madre)."
            }
          ],
          conclusionHtml: R`Simple ($G_4$): H1=<code>00111010</code> (H2 clás.=<code>10100001</code> / comp.=<code>11000101</code>) · Multipunto: <code>00100000</code> / <code>10111011</code> · Binomial: H1=<code>00110011</code> (H2 no eleg.=<code>10101000</code> / comp.=<code>11001100</code>).`
        },
        {
          id: "ex_ag_1d",
          title: "Ejemplo 1D — Mutación Simple y Mutación Adaptativa por Temperatura",
          meta: "Fuente: Guías 03–05",
          problemHtml: R`
            <strong>(1) Simple:</strong> Mutar $I_{01} = \texttt{00110011}$ en el gen $G_2$.<br>
            <strong>(2) Adaptativa por Temperatura:</strong> Dados $P_m^{\min} = 0.02$, $P_m^{\max} = 0.30$ y pendiente $\lambda = 0.0001$, calcular $P_m$ en las generaciones $t=300$ y $t=400$ tanto para variante <em>Ascendente</em> como <em>Descendente</em>.
          `,
          steps: [
            {
              title: "Aplicar Mutación Simple en el gen G₂",
              paperComment: "Identifico el segundo gen contando desde la izquierda e invierto su valor binario (0 ↔ 1).",
              mathHtml: R`
                Posición $G_2$ en <span class="mc-bit-chip mc-bit-p">0<strong>0</strong>110011</span> vale <code>0</code> $\implies$ pasa a <code>1</code> $\implies$ resultado: <span class="mc-bit-chip mc-bit-comp">0<strong>1</strong>110011</span>.
              `,
              note: "Nunca mutes desde la derecha (el 2do desde la derecha sería G7)."
            },
            {
              title: "Calcular P_m(t) por Temperatura Ascendente y Descendente",
              paperComment: "Evalúo la fórmula lineal de temperatura verificando que no supere el techo P_m^max ni baje del piso P_m^min.",
              mathHtml: R`
                <ul>
                  <li><strong>Ascendente</strong> ($P_m(t) = \min(P_m^{\max}, P_m^{\min} + \lambda \cdot t)$):
                    <br>$P_m(300) = \min(0.30,\; 0.02 + 0.0001 \cdot 300) = \mathbf{0.05}$
                    <br>$P_m(400) = \min(0.30,\; 0.02 + 0.0001 \cdot 400) = \mathbf{0.06}$</li>
                  <li><strong>Descendente</strong> ($P_m(t) = \max(P_m^{\min}, P_m^{\max} - \lambda \cdot t)$):
                    <br>$P_m(300) = \max(0.02,\; 0.30 - 0.0001 \cdot 300) = \mathbf{0.27}$</li>
                </ul>
              `,
              visualHtml: `
                <svg viewBox="0 0 460 110" role="img" aria-label="Curvas de probabilidad de mutación ascendente y descendente con cotas">
                  <line x1="40" y1="90" x2="430" y2="90" stroke="var(--border-color)" stroke-width="1.2"/>
                  <line x1="40" y1="20" x2="430" y2="20" stroke="var(--border-color)" stroke-dasharray="4 3"/>
                  <text x="34" y="24" text-anchor="end" fill="var(--text-muted)" font-size="8.5">0.30</text>
                  <text x="34" y="88" text-anchor="end" fill="var(--text-muted)" font-size="8.5">0.02</text>
                  <!-- Ascendente -->
                  <polyline points="40,86 300,48 340,20 420,20" fill="none" stroke="#10b981" stroke-width="2.2"/>
                  <text x="200" y="72" fill="#10b981" font-size="9.5" font-weight="700">Ascendente (sube diversidad si converge)</text>
                  <!-- Descendente -->
                  <polyline points="40,20 300,58 340,86 420,86" fill="none" stroke="var(--primary)" stroke-width="2.2"/>
                  <text x="220" y="34" fill="var(--primary)" font-size="9.5" font-weight="700">Descendente (explota al final)</text>
                </svg>
              `,
              note: "Siempre aplicá el tope min() o piso max(): si t fuera muy grande (ej. t=4000), Ascendente quedaría clavado en 0.30 y Descendente en 0.02."
            },
            {
              title: "Variante por Convergencia (medición de diversidad)",
              paperComment: "Evalúo el grado de homogeneidad poblacional para ajustar dinámicamente la probabilidad de mutación.",
              mathHtml: R`
                Se mide cuántas configuraciones repetidas hay (o $\frac{\text{individuos distintos}}{N}$).
                Si casi toda la población converge al mismo individuo (ej. 85% idénticos), la diversidad cayó y se <strong>incrementa $P_m$</strong> para escapar de mínimos locales.
              `,
              note: "A diferencia de Temperatura (que solo depende del número de generación t), Convergencia reacciona al contenido genético real de la población."
            }
          ],
          conclusionHtml: R`Mutación G₂: <strong><code>01110011</code></strong> · Temp. Ascendente: $P_m(300)=0.05, P_m(400)=0.06$ · Temp. Descendente: $P_m(300)=0.27$.`
        }
      ]
    },
    {
      id: "NAIVE_BAYES",
      labKey: "NAIVE_BAYES",
      order: 2,
      badge: "NB",
      inP2Scope: true,
      scopeLabel: "✅ Entra en 2do Parcial",
      title: "2. Clasificador Naïve Bayes",
      subtitle: R`Regla MAP: $P(e_k \mid x_1, \dots, x_n) \propto P(e_k) \prod_{j=1}^{n} P(x_j \mid e_k)$ — elegir $\arg\max$.`,
      svgDiagram: `
        <svg viewBox="0 0 560 190" class="mc-svg-diagram" role="img" aria-label="Variante Gaussiana continua vs Variante Histogramas con suavizado de Laplace">
          <!-- Left: Gaussiano -->
          <rect x="12" y="16" width="260" height="158" rx="10" fill="var(--bg-card)" stroke="var(--primary)" stroke-width="1.6"/>
          <text x="142" y="38" text-anchor="middle" fill="var(--primary)" font-size="11.5" font-weight="800">VARIANTE A: CONTINUAS (GAUSS)</text>
          <line x1="30" y1="138" x2="254" y2="138" stroke="var(--border-color)" stroke-width="1.2"/>
          <path d="M 35 138 Q 75 136 98 70 Q 112 36 126 70 Q 149 136 190 138" fill="rgba(59,130,246,0.18)" stroke="var(--primary)" stroke-width="2"/>
          <path d="M 105 138 Q 145 136 168 82 Q 182 54 196 82 Q 219 136 250 138" fill="rgba(16,185,129,0.18)" stroke="#10b981" stroke-width="2"/>
          <line x1="154" y1="54" x2="154" y2="138" stroke="var(--warning)" stroke-width="1.6" stroke-dasharray="4 3"/>
          <text x="154" y="152" text-anchor="middle" fill="var(--warning)" font-size="10" font-weight="700">dato x nuevo</text>
          <text x="142" y="167" text-anchor="middle" fill="var(--text-muted)" font-size="9.2">σ poblacional = √[Σ(xi−μ)² / N]</text>

          <!-- Right: Histogramas + Laplace -->
          <rect x="288" y="16" width="260" height="158" rx="10" fill="var(--bg-card)" stroke="#10b981" stroke-width="1.6"/>
          <text x="418" y="38" text-anchor="middle" fill="#10b981" font-size="11.5" font-weight="800">VARIANTE B: BINS + LAPLACE</text>
          <rect x="312" y="76" width="38" height="62" fill="rgba(16,185,129,0.35)" stroke="#10b981"/>
          <rect x="358" y="96" width="38" height="42" fill="rgba(16,185,129,0.35)" stroke="#10b981"/>
          <!-- Empty bin trap -->
          <rect x="404" y="132" width="38" height="6" fill="rgba(239,68,68,0.45)" stroke="var(--danger)" stroke-dasharray="3 2"/>
          <text x="423" y="124" text-anchor="middle" fill="var(--danger)" font-size="10" font-weight="800">0!</text>
          <rect x="450" y="66" width="38" height="72" fill="rgba(16,185,129,0.35)" stroke="#10b981"/>
          <line x1="304" y1="138" x2="528" y2="138" stroke="var(--border-color)" stroke-width="1.2"/>
          <text x="418" y="154" text-anchor="middle" fill="var(--danger)" font-size="9.5" font-weight="700">⚠️ Si bin=0 → Laplace: (0+1)/(Nk+B)</text>
          <text x="418" y="167" text-anchor="middle" fill="var(--text-muted)" font-size="9.2">B = cantidad total de bins del atributo</text>
        </svg>
      `,
      coreSteps: [
        R`<strong>1. Probabilidad a priori:</strong> $P(e_k) = \frac{N_k}{N}$ (frecuencia de cada clase sobre el total).`,
        R`<strong>2. Verosimilitudes condicionales:</strong> Calcular $P(x_j \mid e_k)$ para cada atributo $j$ usando el modelo pedido (Gaussiano o Histograma/Discreto).`,
        R`<strong>3. Producto por clase:</strong> $L(e_k) = P(e_k) \cdot \prod_{j=1}^n P(x_j \mid e_k)$. Elegir la clase con mayor $L(e_k)$.`,
        R`<strong>4. Normalización (si piden probabilidad exacta):</strong> $P(e_k \mid x) = \frac{L(e_k)}{\sum_m L(e_m)}$ (así las posteriores suman <code>1</code> o <code>100%</code>).`
      ],
      variants: [
        {
          name: "Variante A — Continuas (Gaussiano)",
          badge: "Datos numéricos",
          formula: R`$f(x) = \frac{1}{\sigma\sqrt{2\pi}} \, e^{-\frac{(x-\mu)^2}{2\sigma^2}}$`,
          detail: R`Media $\mu = \bar{X}$ y <strong>desvío poblacional</strong> $\sigma = \sqrt{\frac{\sum(x_i-\bar{X})^2}{N}}$ (dividir por $N$, no $N-1$). Si es $< 10^{-3}$, expresar en notación científica.`
        },
        {
          name: "Variante B — Histogramas (Bins)",
          badge: "Intervalos + Laplace",
          formula: R`$P(x_j \in \text{bin} \mid e_k) = \frac{\#\text{bin en } e_k}{\#e_k}$`,
          detail: R`Ubicar en qué bin cae cada atributo. <strong>Si una celda da <code>0</code>:</strong> aplicar <strong>Laplace</strong> sumando $+1$ al numerador y $+B$ al denominador ($B =$ total de bins del atributo).`
        }
      ],
      traps: [
        R`Reportar $L(e_k)$ sin normalizar como si fuera "la probabilidad porcentual posterior" (ej. decir 4.5% cuando falta dividir por la evidencia total).`,
        R`Multiplicar por <code>0</code> en un bin vacío y anular toda la clase sin aplicar suavizado de Laplace $(+1)/(N_k+B)$.`,
        R`Usar $N-1$ en lugar de $N$ al calcular el desvío estándar poblacional $\sigma$.`
      ],
      examples: [
        {
          id: "ex_nb_2a",
          title: "Ejemplo 2A — Naïve Bayes Gaussiano desde datos crudos (Guía 03.1)",
          meta: "Fuente: guia_practica_naive_bayes.pdf pág. 3",
          problemHtml: R`
            Se tienen $N = 6$ instancias de entrenamiento ($3$ de Clase <code>0</code> y $3$ de Clase <code>1</code>) con dos atributos numéricos continuos $(x, y)$.<br>
            Se pide clasificar la nueva instancia <strong>$N_{\text{nuevo}} = (1, 1)$</strong> usando Naïve Bayes Gaussiano.
          `,
          steps: [
            {
              title: "Calcular probabilidades a priori P(C)",
              paperComment: "Calculo la probabilidad a priori de cada clase contando cuántas instancias pertenecen a cada una sobre el total.",
              mathHtml: R`
                $$P(C = 0) = \frac{3}{6} = \mathbf{0.5} \qquad\qquad P(C = 1) = \frac{3}{6} = \mathbf{0.5}$$
              `,
              note: "Como ambas clases están balanceadas (3 y 3), la decisión va a depender por completo del producto de verosimilitudes gaussianas."
            },
            {
              title: "Calcular media μ y desvío poblacional σ por clase y atributo",
              paperComment: "Calculo la media aritmética y el desvío estándar poblacional (dividiendo por N) para cada atributo dentro de cada clase.",
              mathHtml: R`
                $$\mu = \frac{1}{N}\sum x_i \qquad \sigma = \sqrt{\frac{\sum (x_i - \mu)^2}{N}}$$
                <div class="mc-table-wrap">
                  <table class="pe-data-table">
                    <thead><tr><th>Clase</th><th>$\mu_x$</th><th>$\sigma_x$</th><th>$\mu_y$</th><th>$\sigma_y$</th></tr></thead>
                    <tbody>
                      <tr class="mc-row-highlight"><td><strong>Clase 0</strong></td><td>$-6.6$</td><td>$1.22$</td><td>$-2.0$</td><td>$0.82$</td></tr>
                      <tr><td><strong>Clase 1</strong></td><td>$-3.0$</td><td>$0.82$</td><td>$-8.0$</td><td>$0.82$</td></tr>
                    </tbody>
                  </table>
                </div>
              `,
              note: "Recordá el criterio de cátedra: σ es poblacional (divisor N = 3 por clase), NO muestral (N - 1)."
            },
            {
              title: "Evaluar densidades f(1) en la campana normal",
              paperComment: "Sustituyo las coordenadas del punto nuevo (x=1, y=1) en la densidad normal de cada atributo por clase.",
              mathHtml: R`
                $$f(x) = \frac{1}{\sigma\sqrt{2\pi}} \, e^{-\frac{(x-\mu)^2}{2\sigma^2}}$$
                <ul>
                  <li><strong>Para Clase 0 ($x=1, y=1$):</strong> $f_x(1) \approx 4.19 \times 10^{-10}$, $f_y(1) \approx 5.98 \times 10^{-4}$ (aunque lejos en $x$, está relativamente cerca en $y$: distancia $(1 - (-2)) / 0.82 = 3.66\,\sigma$).</li>
                  <li><strong>Para Clase 1 ($x=1, y=1$):</strong> en $y$, la distancia es $(1 - (-8)) / 0.82 = 10.98\,\sigma$, ¡casi nula!</li>
                </ul>
              `,
              visualHtml: `
                <svg viewBox="0 0 500 112" role="img" aria-label="Comparación de distancia del dato nuevo x=1, y=1 respecto a las campanas de Clase 0 y Clase 1">
                  <line x1="25" y1="90" x2="475" y2="90" stroke="var(--border-color)" stroke-width="1.2"/>
                  <!-- C1 curve around -8 (far left) -->
                  <path d="M 45 90 Q 75 88 92 32 Q 108 88 138 90" fill="rgba(99,102,241,0.22)" stroke="var(--primary)" stroke-width="2"/>
                  <text x="92" y="24" text-anchor="middle" fill="var(--primary)" font-size="9.5" font-weight="700">Clase 1 (μy = −8)</text>
                  <!-- C0 curve around -2 -->
                  <path d="M 215 90 Q 250 88 270 30 Q 290 88 325 90" fill="rgba(16,185,129,0.25)" stroke="#10b981" stroke-width="2"/>
                  <text x="270" y="24" text-anchor="middle" fill="#10b981" font-size="9.5" font-weight="700">Clase 0 (μy = −2)</text>
                  <!-- Query at +1 -->
                  <line x1="395" y1="22" x2="395" y2="90" stroke="var(--warning)" stroke-width="2" stroke-dasharray="4 3"/>
                  <circle cx="395" cy="84" r="4" fill="var(--warning)"/>
                  <text x="395" y="15" text-anchor="middle" fill="var(--warning)" font-size="9.5" font-weight="800">Dato y = +1</text>
                  <text x="395" y="103" text-anchor="middle" fill="var(--text-muted)" font-size="8.5">11σ lejos de C1 vs 3.6σ de C0</text>
                </svg>
              `,
              note: "En exponentes grandes negativos, una diferencia de pocos σ produce órdenes de magnitud (10⁻³ vs 10⁻³³) a favor de la clase más cercana."
            },
            {
              title: "Multiplicar factores, comparar y concluir",
              paperComment: "Multiplico la probabilidad a priori por las densidades de cada atributo y elijo la clase con mayor producto.",
              mathHtml: R`
                <ul>
                  <li>$L(C=0) = 0.5 \cdot f_{x\mid 0}(1) \cdot f_{y\mid 0}(1) = \mathbf{3.67 \times 10^{-3}}$</li>
                  <li>$L(C=1) = 0.5 \cdot f_{x\mid 1}(1) \cdot f_{y\mid 1}(1) = 5.57 \times 10^{-33}$</li>
                </ul>
                <p>Como $3.67 \times 10^{-3} \gg 5.57 \times 10^{-33}$, resulta ganadora la <strong>Clase 0</strong>.</p>
              `,
              note: "Si el valor es < 10⁻³, la cátedra exige escribirlo en notación científica para no truncarlo en 0.000."
            }
          ],
          conclusionHtml: R`La instancia $N=(1,1)$ clasifica como <strong>Clase 0</strong> ($L(0) = 3.67 \times 10^{-3} \gg L(1) = 5.57 \times 10^{-33}$).`
        },
        {
          id: "ex_nb_2b",
          title: "Ejemplo 2B — Histogramas / Bins y Trampa de Bin Vacío con Laplace (Guía 05)",
          meta: "Fuente: guia_practica_naive_bayes.pdf pág. 4–5",
          problemHtml: R`
            Dataset con $125\,000$ registros en $3$ clases: $T_1 (30\%, N_1=37\,500)$, $T_2 (20\%, N_2=25\,000)$ y $T_3 (50\%, N_3=62\,500)$.
            Se presenta $I_{n1} = (v_1=2.8,\; v_2=3.5)$. ¿Qué clase predice Naïve Bayes por Histogramas y cómo actuar si un bin tuviera frecuencia <code>0</code>?
          `,
          steps: [
            {
              title: "Ubicar cada atributo del dato nuevo en su bin correspondiente",
              paperComment: "Identifico en qué intervalo (bin) del histograma cae cada valor numérico de la nueva instancia.",
              mathHtml: R`
                <ul>
                  <li>Atributo $v_1 = 2.8$ cae dentro del intervalo <strong>$(2, 5]$</strong> (frecuencias: $5500$ en $T_1$, $5000$ en $T_2$, $10000$ en $T_3$).</li>
                  <li>Atributo $v_2 = 3.5$ cae dentro del intervalo <strong>$(-2, 5]$</strong> (frecuencias: $5000$ en $T_1$, $9000$ en $T_2$, $15000$ en $T_3$).</li>
                </ul>
              `,
              visualHtml: `
                <svg viewBox="0 0 500 95" role="img" aria-label="Ubicación del valor en el bin correspondiente del histograma">
                  <rect x="40" y="32" width="120" height="36" fill="var(--bg-subtle)" stroke="var(--border-color)"/><text x="100" y="54" text-anchor="middle" fill="var(--text-muted)" font-size="9.5">(−5, 2]</text>
                  <rect x="160" y="20" width="140" height="48" fill="rgba(16,185,129,0.22)" stroke="#10b981" stroke-width="2"/><text x="230" y="48" text-anchor="middle" fill="#10b981" font-size="10" font-weight="800">(2, 5] ✓ v₁=2.8</text>
                  <rect x="300" y="40" width="120" height="28" fill="var(--bg-subtle)" stroke="var(--border-color)"/><text x="360" y="58" text-anchor="middle" fill="var(--text-muted)" font-size="9.5">(5, 10]</text>
                  <text x="250" y="84" text-anchor="middle" fill="var(--text-muted)" font-size="9">Se leen solo las frecuencias de los bins donde cae (2.8, 3.5)</text>
                </svg>
              `,
              note: "Respetá los extremos abiertos '(' vs cerrados ']': por ejemplo, 2.0 exacto entra en (−5, 2] y NO en (2, 5]."
            },
            {
              title: "Calcular producto P(Tk) · P(bin v1|Tk) · P(bin v2|Tk) y normalizar",
              paperComment: "Calculo cada probabilidad condicional dividiendo la frecuencia del bin por el total de su clase y multiplico por el a priori.",
              mathHtml: R`
                <ul>
                  <li>$L(T_1) = 0.30 \cdot \frac{5500}{37500} \cdot \frac{5000}{37500} = 0.30 \cdot 0.1467 \cdot 0.1333 = 5.87 \times 10^{-3}$</li>
                  <li>$L(T_2) = 0.20 \cdot \frac{5000}{25000} \cdot \frac{9000}{25000} = 0.20 \cdot 0.20 \cdot 0.36 = 0.0144$</li>
                  <li>$L(T_3) = 0.50 \cdot \frac{10000}{62500} \cdot \frac{15000}{62500} = 0.50 \cdot 0.16 \cdot 0.24 = \mathbf{0.0192}$</li>
                </ul>
                <p><strong>Normalizado (si piden probabilidad exacta):</strong> $\text{Total} = 0.00587 + 0.0144 + 0.0192 = 0.03947 \implies P(T_3 \mid I_{n1}) = \frac{0.0192}{0.03947} = \mathbf{48.6\%}$.</p>
              `,
              note: "Sin normalizar ya sabés quién gana (0.0192 es el mayor), pero solo dividiendo por la suma total obtenés probabilidades reales que suman 100%."
            },
            {
              title: "Manejo de Trampa Clásica: Bin Vacío (Suavizado de Laplace)",
              paperComment: "Como un bin tiene frecuencia cero, aplico corrección de Laplace sumando 1 al numerador y B al denominador para evitar que se anule el producto.",
              mathHtml: R`
                Si $v_1$ tiene $B = 6$ bins totales y en la clase $T_k$ aparecen <code>0</code> ejemplos en ese bin:
                $$P(x_j \in \text{bin} \mid T_k) = \frac{0}{N_k} \;\longrightarrow\; \text{usar Laplace: } \frac{0 + 1}{N_k + B} = \frac{1}{N_k + 6}$$
              `,
              note: "Para mantener coherencia probabilística en ese atributo, aplicá +1/(N_k+B) a las demás probabilidades de ese atributo si el ejercicio te lo pide."
            }
          ],
          conclusionHtml: R`Clasifica como <strong>$T_3$</strong> ($L(T_3) = 0.0192$, posterior normalizada $\mathbf{48.6\%}$).`
        }
      ]
    },
    {
      id: "PERCEPTRON",
      labKey: "MLP_PERCEPTRON",
      order: 3,
      badge: "PERC",
      inP2Scope: true,
      scopeLabel: "✅ Entra en 2do Parcial",
      title: "3. Perceptrón Simple y ADALINE",
      subtitle: R`Modelo ($x_0 = 1, w_0 = -\theta$): $\text{Net} = \sum_{i=0}^{n} x_i w_i$ · Escalón $f(\text{Net})=1$ si $\text{Net}\ge 0$, else $0$.`,
      svgDiagram: `
        <svg viewBox="0 0 560 190" class="mc-svg-diagram" role="img" aria-label="Método analítico con recta separadora vs Método iterativo del Perceptrón Simple">
          <!-- Left: Analítico -->
          <rect x="12" y="16" width="260" height="158" rx="10" fill="var(--bg-card)" stroke="var(--primary)" stroke-width="1.6"/>
          <text x="142" y="38" text-anchor="middle" fill="var(--primary)" font-size="11.5" font-weight="800">MÉTODO ANALÍTICO (x₁, x₂)</text>
          <line x1="40" y1="115" x2="245" y2="115" stroke="var(--border-color)" stroke-width="1.3"/>
          <line x1="142" y1="48" x2="142" y2="156" stroke="var(--border-color)" stroke-width="1.3"/>
          <!-- Decision line -->
          <line x1="62" y1="145" x2="220" y2="55" stroke="var(--warning)" stroke-width="2.2"/>
          <circle cx="115" cy="115" r="4" fill="var(--danger)"/><text x="112" y="128" text-anchor="middle" fill="var(--danger)" font-size="9.5" font-weight="800">A=(x1c,0)</text>
          <circle cx="142" cy="99" r="4" fill="var(--danger)"/><text x="172" y="96" text-anchor="middle" fill="var(--danger)" font-size="9.5" font-weight="800">B=(0,x2c)</text>
          <!-- Points class 1 / 0 -->
          <circle cx="75" cy="70" r="5" fill="#10b981"/><text x="86" y="73" fill="#10b981" font-size="9.5" font-weight="700">1</text>
          <circle cx="185" cy="134" r="5" fill="#6366f1"/><text x="196" y="137" fill="#6366f1" font-size="9.5" font-weight="700">0</text>
          <text x="142" y="166" text-anchor="middle" fill="var(--warning)" font-size="9.2" font-weight="700">⚠️ Verificar Net en TODOS: si falla, invertir θ</text>

          <!-- Right: Iterativo -->
          <rect x="288" y="16" width="260" height="158" rx="10" fill="var(--bg-card)" stroke="#10b981" stroke-width="1.6"/>
          <text x="418" y="38" text-anchor="middle" fill="#10b981" font-size="11.5" font-weight="800">MÉTODO ITERATIVO (ÉPOCAS)</text>
          <text x="418" y="62" text-anchor="middle" fill="var(--text-main)" font-size="10.2" font-weight="700">Patrón Pk = (x₀=1, x₁, x₂)</text>
          <text x="418" y="84" text-anchor="middle" fill="var(--text-main)" font-size="10">Error E = Sd − f(Net)</text>
          <rect x="308" y="96" width="102" height="44" rx="6" fill="rgba(16,185,129,0.14)" stroke="#10b981"/>
          <text x="359" y="114" text-anchor="middle" fill="#10b981" font-size="10" font-weight="800">Si E = 0</text>
          <text x="359" y="130" text-anchor="middle" fill="var(--text-muted)" font-size="9.2">No tocar pesos</text>
          <rect x="424" y="96" width="110" height="44" rx="6" fill="rgba(245,158,11,0.14)" stroke="var(--warning)"/>
          <text x="479" y="114" text-anchor="middle" fill="var(--warning)" font-size="10" font-weight="800">Si E ≠ 0</text>
          <text x="479" y="130" text-anchor="middle" fill="var(--text-main)" font-size="9.2">wi += α · E · xi</text>
          <text x="418" y="162" text-anchor="middle" fill="var(--text-muted)" font-size="9.2">También se actualiza w₀ con x₀ = 1</text>
        </svg>
      `,
      coreSteps: [
        R`<strong>Convención de Bias/Umbral:</strong> Agregar entrada fija $x_0 = 1$ con peso $w_0 = -\theta$. Calcular $\text{Net} = w_0(1) + w_1 x_1 + w_2 x_2$.`,
        R`<strong>Función Escalón:</strong> $S_o = f(\text{Net}) = 1$ si $\text{Net} \ge 0$, o $0$ si $\text{Net} < 0$. (Si las clases son texto, codificar a <code>1 / 0</code>).`,
        R`<strong>Regla de Aprendizaje (Iterativo):</strong> $E = S_d - S_o$. Si $E \neq 0$, actualizar todos los pesos incluyendo $w_0$: $w_i(t+1) = w_i(t) + \alpha \cdot E \cdot x_i$.`
      ],
      variants: [
        {
          name: "Variante A — Método Analítico (recta separadora)",
          badge: "Geometría 2D",
          formula: R`$x_2 = -\frac{w_1}{w_2}\,x_1 + \frac{\theta}{w_2}$`,
          detail: R`1) Trazar recta separadora y leer cortes $A=(x_{1,\text{corte}}, 0)$ y $B=(0, x_{2,\text{corte}})$. 2) Con $\theta$ dado, despejar $w_2$ usando $B$ y luego $w_1$ usando $A$. 3) <strong>Evaluar en todos los puntos</strong>; si da error, invertir signo de $\theta$ y recalcular.`
        },
        {
          name: "Variante B — Método Iterativo (por épocas)",
          badge: "Online por patrón",
          formula: R`$w_i(t+1) = w_i(t) + \alpha \cdot (S_d - S_o) \cdot x_i$`,
          detail: R`Repetir épocas presentando $P_1, P_2, \dots$ hasta completar una época entera con $E=0$ en todos los patrones.`
        },
        {
          name: "Variante C — ADALINE (LMS)",
          badge: "Salida lineal",
          formula: R`$f(\text{Net}) = \text{Net} \implies E = S_d - \text{Net}$`,
          detail: R`La actualización de pesos usa el error lineal continuo $(S_d - \text{Net})$ antes del escalón (regla Delta / LMS).`
        }
      ],
      traps: [
        R`En Método Analítico, hallar los pesos de la recta sin verificar los signos en al menos un punto de cada clase ($\text{Net} \ge 0$ vs $< 0$).`,
        R`Olvidar que $x_0 = 1$ también actualiza $w_0(t+1) = w_0(t) + \alpha \cdot E \cdot 1$ cuando $E \neq 0$.`
      ],
      examples: [
        {
          id: "ex_perc_3a",
          title: "Ejemplo 3A — Método Analítico con inversión obligatoria de θ",
          meta: "Fuente: guia_practica_perceptron_simple.pdf pág. 10–11",
          problemHtml: R`
            Puntos Clase <code>1</code>: $(-3,-1), (-3.5,-0.2), (-2,-0.5)$. Puntos Clase <code>0</code>: $(-1,-1), (-2,-2), (-2,-3)$.
            Se da como parámetro inicial el umbral <strong>$\theta = -1.3$</strong> (con $x_0 = 1, w_0 = -\theta$). Hallar $w_0, w_1, w_2$ por el método analítico.
          `,
          steps: [
            {
              title: "Graficar puntos, trazar recta separadora y leer cortes con ejes",
              paperComment: "Represento los patrones en el plano (x₁, x₂), verifico separabilidad lineal y leo dos cortes cómodos A y B de la recta frontera.",
              mathHtml: R`
                Trazamos una recta limpia entre ambas nubes de puntos que corta en:
                $$A = (-1,\; 0) \qquad\text{y}\qquad B = (0,\; 1)$$
              `,
              visualHtml: `
                <svg viewBox="0 0 460 135" role="img" aria-label="Recta separadora en plano (x1, x2) pasando por A=(-1,0) y B=(0,1)">
                  <line x1="30" y1="90" x2="430" y2="90" stroke="var(--border-color)" stroke-width="1.2"/>
                  <line x1="310" y1="12" x2="310" y2="128" stroke="var(--border-color)" stroke-width="1.2"/>
                  <!-- Line x2 = x1 + 1 -->
                  <line x1="90" y1="120" x2="370" y2="40" stroke="var(--warning)" stroke-width="2.2"/>
                  <!-- Intercepts -->
                  <circle cx="240" cy="90" r="4.5" fill="var(--danger)"/><text x="235" y="106" text-anchor="middle" fill="var(--danger)" font-size="9.5" font-weight="800">A=(−1,0)</text>
                  <circle cx="310" cy="70" r="4.5" fill="var(--danger)"/><text x="342" y="68" fill="var(--danger)" font-size="9.5" font-weight="800">B=(0,1)</text>
                  <!-- Class 1 points (above/left) -->
                  <circle cx="100" cy="98" r="5" fill="#10b981"/>
                  <circle cx="170" cy="94" r="5" fill="#10b981"/>
                  <circle cx="80" cy="82" r="5" fill="#10b981"/>
                  <text x="120" y="65" fill="#10b981" font-size="9.5" font-weight="800">Clase 1 (Sd=1)</text>
                  <!-- Class 0 points (below/right) -->
                  <circle cx="240" cy="110" r="5" fill="#6366f1"/>
                  <circle cx="190" cy="116" r="5" fill="#6366f1"/>
                  <circle cx="205" cy="124" r="5" fill="#6366f1"/>
                  <text x="285" y="120" fill="#6366f1" font-size="9.5" font-weight="800">Clase 0 (Sd=0)</text>
                </svg>
              `,
              note: "Cualquier par de cortes que separe los dos conjuntos sirve, pero cortes simples como (−1, 0) y (0, 1) simplifican todo el despeje."
            },
            {
              title: "Despejar w₂ y w₁ en la recta frontera usando θ dado",
              paperComment: "Reemplazo los puntos de corte A y B en la ecuación de la recta Net = 0 con el valor de θ proporcionado.",
              mathHtml: R`
                Con $\theta = -1.3$ ($w_0 = -\theta = +1.3$), partimos de $x_2 = -\frac{w_1}{w_2} x_1 + \frac{\theta}{w_2}$:
                <ul>
                  <li>En $B=(0, 1)$: $1 = 0 + \frac{-1.3}{w_2} \implies \mathbf{w_2 = -1.3}$.</li>
                  <li>En $A=(-1, 0)$: $0 = -\frac{w_1}{-1.3}(-1) + \frac{-1.3}{-1.3} \implies 0 = -\frac{w_1}{1.3} + 1 \implies \mathbf{w_1 = +1.3}$.</li>
                </ul>
              `,
              note: "Hasta acá la recta coincide geométricamente, pero todavía NO sabemos de qué lado da Net ≥ 0 (Clase 1) y de cuál da Net < 0 (Clase 0)."
            },
            {
              title: "Verificar Net en patrones de prueba (detectando semiplano invertido)",
              paperComment: "Evalúo Net en un patrón de prueba de Clase 1 para comprobar que la orientación del umbral coincide con las salidas deseadas.",
              mathHtml: R`
                Pruebo $(-3, -1)$ que pertenece a <strong>Clase 1 ($S_d = 1$)</strong>:
                $$\text{Net} = 1(1.3) + (-3)(1.3) + (-1)(-1.3) = 1.3 - 3.9 + 1.3 = \mathbf{-1.3} < 0 \implies S_o = 0$$
                $$E = S_d - S_o = 1 - 0 = \mathbf{1} \neq 0 \quad (\text{¡El semiplano quedó al revés!})$$
              `,
              note: "¡Trampa fatal de parcial! Si te quedás en el paso 2 sin verificar, perdés la mitad del ejercicio. La recta separa bien, solo apunta al lado contrario."
            },
            {
              title: "Invertir signo de θ, recalcular y confirmar E = 0 en todos",
              paperComment: "Invierto el signo de θ (a +1.3), recalculo w₀, w₁, w₂ y verifico que E = 0 en todas las instancias.",
              mathHtml: R`
                Tomo $\theta = +1.3 \implies \mathbf{w_0 = -1.3,\; w_1 = -1.3,\; w_2 = +1.3}$. Reverifico:
                <div class="mc-table-wrap">
                  <table class="pe-data-table">
                    <thead><tr><th>Patrón $(x_1,x_2)$</th><th>$\text{Net} = -1.3 - 1.3x_1 + 1.3x_2$</th><th>$S_o$</th><th>$S_d$</th><th>Error $E$</th></tr></thead>
                    <tbody>
                      <tr class="mc-row-highlight"><td>$(-3, -1)$</td><td>$+1.30 \ge 0$</td><td><code>1</code></td><td><code>1</code></td><td><strong>0 ✓</strong></td></tr>
                      <tr class="mc-row-highlight"><td>$(-3.5, -0.2)$</td><td>$+2.99 \ge 0$</td><td><code>1</code></td><td><code>1</code></td><td><strong>0 ✓</strong></td></tr>
                      <tr><td>$(-1, -1)$</td><td>$-1.30 < 0$</td><td><code>0</code></td><td><code>0</code></td><td><strong>0 ✓</strong></td></tr>
                      <tr><td>$(-2, -3)$</td><td>$-2.60 < 0$</td><td><code>0</code></td><td><code>0</code></td><td><strong>0 ✓</strong></td></tr>
                    </tbody>
                  </table>
                </div>
              `,
              note: "Invertir el signo de θ (y en consecuencia de w₁ y w₂) conserva exactamente la misma recta pero da vuelta todos los signos de Net."
            }
          ],
          conclusionHtml: R`Pesos finales validados: <strong>$w_0 = -1.3,\; w_1 = -1.3,\; w_2 = +1.3$</strong> (equivale a $\theta = +1.3$).`
        },
        {
          id: "ex_perc_3b",
          title: "Ejemplo 3B — Método Iterativo: patrón con error vs sin error",
          meta: "Fuente: Guía 01.1 pág. 3",
          problemHtml: R`
            Pesos iniciales: $w_0 = 0.4, w_1 = 0.2, w_2 = 0.1$, tasa $\alpha = 0.5$ ($x_0 = 1$ siempre).
            Presentar $P_1 = (1, 1, 2)$ con $S_d = 0$, y luego $P_2 = (1, 3, 2)$ con $S_d = 0$.
          `,
          steps: [
            {
              title: "Evaluar P₁ y calcular error E",
              paperComment: "Calculo la suma ponderada Net para el patrón P₁, aplico la función escalón y obtengo el error E = Sd − So.",
              mathHtml: R`
                $$\text{Net} = 1(0.4) + 1(0.2) + 2(0.1) = \mathbf{0.8} \ge 0 \implies S_o = 1$$
                $$E = S_d - S_o = 0 - 1 = \mathbf{-1} \neq 0$$
              `,
              note: "Como E ≠ 0, la red clasificó mal a P₁ (predijo 1 cuando debía ser 0), por lo tanto debemos ajustar TODOS los pesos."
            },
            {
              title: "Actualizar w₀, w₁, w₂ usando Δw = α · E · xᵢ",
              paperComment: "Como el error fue no nulo, actualizo los tres pesos (incluido el umbral w₀ con x₀ = 1) con la regla del perceptrón.",
              mathHtml: R`
                $$w_i(t+1) = w_i(t) + \alpha \cdot E \cdot x_i = w_i(t) + 0.5 \cdot (-1) \cdot x_i$$
                <ul>
                  <li>$w_0 = 0.4 + (-0.5)(1) = \mathbf{-0.1}$</li>
                  <li>$w_1 = 0.2 + (-0.5)(1) = \mathbf{-0.3}$</li>
                  <li>$w_2 = 0.1 + (-0.5)(2) = \mathbf{-0.9}$</li>
                </ul>
              `,
              note: "¡No te olvides de actualizar w₀ con x₀ = 1! Es un error clásico dejar w₀ fijo durante el método iterativo."
            },
            {
              title: "Evaluar P₂ con los nuevos pesos (caso E = 0)",
              paperComment: "Presento P₂ evaluando con el vector de pesos actualizado y verifico si requiere ajuste.",
              mathHtml: R`
                $$\text{Net} = 1(-0.1) + 3(-0.3) + 2(-0.9) = -0.1 - 0.9 - 1.8 = \mathbf{-2.8} < 0 \implies S_o = 0$$
                $$E = S_d - S_o = 0 - 0 = \mathbf{0} \implies \text{NO se modifican los pesos}$$
              `,
              visualHtml: `
                <svg viewBox="0 0 460 88" role="img" aria-label="Flujo de decisión del método iterativo entre P1 con error y P2 sin error">
                  <rect x="16" y="16" width="195" height="56" rx="8" fill="rgba(245,158,11,0.12)" stroke="var(--warning)"/>
                  <text x="113" y="36" text-anchor="middle" fill="var(--warning)" font-size="9.5" font-weight="800">P₁: E = −1 ≠ 0</text>
                  <text x="113" y="54" text-anchor="middle" fill="var(--text-main)" font-size="8.8">Actualiza w₀, w₁, w₂ con x₀=1</text>
                  <line x1="215" y1="44" x2="245" y2="44" stroke="var(--text-muted)" stroke-width="1.8"/>
                  <rect x="249" y="16" width="195" height="56" rx="8" fill="rgba(16,185,129,0.14)" stroke="#10b981"/>
                  <text x="346" y="36" text-anchor="middle" fill="#10b981" font-size="9.5" font-weight="800">P₂: E = 0</text>
                  <text x="346" y="54" text-anchor="middle" fill="var(--text-main)" font-size="8.8">Mantiene [−0.1, −0.3, −0.9]</text>
                </svg>
              `,
              note: "Cuando E = 0, simplemente indicás 'No actualizo pesos' y conservás [-0.1, -0.3, -0.9] para el patrón siguiente."
            }
          ],
          conclusionHtml: R`Tras $P_1$ y $P_2$, los pesos quedan en <strong>$w_0 = -0.1,\; w_1 = -0.3,\; w_2 = -0.9$</strong>.`
        }
      ]
    },
    {
      id: "MLP",
      labKey: "MLP_PERCEPTRON",
      order: 4,
      badge: "MLP",
      inP2Scope: true,
      scopeLabel: "✅ Entra en 2do Parcial",
      title: "4. MLP / BPN (Backpropagation)",
      subtitle: R`Criterio 2026: activación sigmoidal y actualización estándar <strong>sin</strong> término de momento.`,
      svgDiagram: `
        <svg viewBox="0 0 560 190" class="mc-svg-diagram" role="img" aria-label="Flujo Forward, Backward y Early Stopping en MLP Backpropagation">
          <defs>
            <marker id="mc-mlp-f" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8"/></marker>
            <marker id="mc-mlp-b" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 1 L 10 5 L 0 9 z" fill="#fb7185"/></marker>
          </defs>
          <!-- Network -->
          <rect x="12" y="16" width="335" height="158" rx="10" fill="var(--bg-card)" stroke="var(--primary)" stroke-width="1.6"/>
          <text x="179" y="36" text-anchor="middle" fill="#38bdf8" font-size="10.5" font-weight="800">FORWARD (→) y BACKWARD (←)</text>
          <circle cx="54" cy="74" r="16" fill="var(--bg-subtle)" stroke="#38bdf8" stroke-width="1.6"/><text x="54" y="78" text-anchor="middle" fill="var(--text-main)" font-size="11" font-weight="700">x₁</text>
          <circle cx="54" cy="134" r="16" fill="var(--bg-subtle)" stroke="#38bdf8" stroke-width="1.6"/><text x="54" y="138" text-anchor="middle" fill="var(--text-main)" font-size="11" font-weight="700">x₂</text>
          <circle cx="174" cy="74" r="18" fill="var(--bg-subtle)" stroke="var(--primary)" stroke-width="1.8"/><text x="174" y="78" text-anchor="middle" fill="var(--text-main)" font-size="11" font-weight="700">h₁</text>
          <circle cx="174" cy="134" r="18" fill="var(--bg-subtle)" stroke="var(--primary)" stroke-width="1.8"/><text x="174" y="138" text-anchor="middle" fill="var(--text-main)" font-size="11" font-weight="700">h₂</text>
          <circle cx="304" cy="104" r="19" fill="var(--bg-subtle)" stroke="#10b981" stroke-width="1.8"/><text x="304" y="108" text-anchor="middle" fill="var(--text-main)" font-size="11" font-weight="700">y₃</text>

          <line x1="71" y1="74" x2="152" y2="74" stroke="#38bdf8" stroke-width="1.6" marker-end="url(#mc-mlp-f)"/>
          <line x1="71" y1="130" x2="152" y2="82" stroke="#38bdf8" stroke-width="1.4" marker-end="url(#mc-mlp-f)"/>
          <line x1="71" y1="78" x2="152" y2="128" stroke="#38bdf8" stroke-width="1.4" marker-end="url(#mc-mlp-f)"/>
          <line x1="71" y1="134" x2="152" y2="134" stroke="#38bdf8" stroke-width="1.6" marker-end="url(#mc-mlp-f)"/>
          <line x1="193" y1="78" x2="282" y2="98" stroke="#38bdf8" stroke-width="1.6" marker-end="url(#mc-mlp-f)"/>
          <line x1="193" y1="130" x2="282" y2="110" stroke="#38bdf8" stroke-width="1.6" marker-end="url(#mc-mlp-f)"/>
          <!-- Backward dashed arrow -->
          <line x1="283" y1="88" x2="195" y2="66" stroke="#fb7185" stroke-width="1.6" stroke-dasharray="4 2" marker-end="url(#mc-mlp-b)"/>
          <text x="242" y="64" text-anchor="middle" fill="#fb7185" font-size="9.5" font-weight="800">δ₃ · w₃₁</text>
          <text x="179" y="165" text-anchor="middle" fill="var(--text-muted)" font-size="9.2">w_ji(t+1) = w_ji(t) + α · δj · yi</text>

          <!-- Early Stopping -->
          <rect x="358" y="16" width="190" height="158" rx="10" fill="var(--bg-card)" stroke="#f59e0b" stroke-width="1.6"/>
          <text x="453" y="36" text-anchor="middle" fill="#f59e0b" font-size="11" font-weight="800">EARLY STOPPING</text>
          <line x1="378" y1="142" x2="532" y2="142" stroke="var(--border-color)"/>
          <line x1="378" y1="48" x2="378" y2="142" stroke="var(--border-color)"/>
          <path d="M 382 62 Q 430 120 526 136" fill="none" stroke="#38bdf8" stroke-width="2"/>
          <path d="M 382 56 Q 435 106 462 104 Q 492 102 526 68" fill="none" stroke="#fb7185" stroke-width="2"/>
          <line x1="462" y1="54" x2="462" y2="142" stroke="var(--success)" stroke-width="1.6" stroke-dasharray="4 3"/>
          <text x="462" y="154" text-anchor="middle" fill="var(--success)" font-size="9.2" font-weight="800">Parar acá (mín. Valid.)</text>
          <text x="506" y="128" fill="#38bdf8" font-size="8.5">Train</text>
          <text x="514" y="62" fill="#fb7185" font-size="8.5">Valid</text>
        </svg>
      `,
      coreSteps: [
        R`<strong>1. Feedforward (entrada $\to$ ocultas $\to$ salida):</strong> Para cada neurona $j$, $\text{Net}_j = \sum_i w_{ji} y_i$ y salida sigmoidal $f(\text{Net}_j) = \frac{1}{1 + e^{-\text{Net}_j}}$, con derivada $f'(\text{Net}_j) = f(\text{Net}_j)(1 - f(\text{Net}_j))$.`,
        R`<strong>2. Error en Capa de Salida ($k$):</strong> $\delta_k = \left(S_{dk} - f(\text{Net}_k)\right) \cdot f'(\text{Net}_k)$. <em>(Si la salida fuera lineal: $f(\text{Net}_k) = \text{Net}_k$ y $f'=1$).</em>`,
        R`<strong>3. Error en Capa Oculta ($j$):</strong> $\delta_j = f'(\text{Net}_j) \cdot \sum_k (\delta_k \cdot w_{kj})$.`,
        R`<strong>4. Actualización de Pesos:</strong> $w_{ji}(t+1) = w_{ji}(t) + \alpha \cdot \delta_j \cdot y_i$ <em>(actualizar solo los pesos que pida el enunciado para ahorrar tiempo)</em>.`,
        R`<strong>5. Errores y Parada:</strong> $E_p = \frac{1}{2}\sum_{k=1}^M (S_{dk} - f(\text{Net}_k))^2$ y $E_G = \frac{1}{L}\sum_{p=1}^L E_p$.`
      ],
      variants: [
        {
          name: "Sin Momento (2026) vs Con Momento β",
          badge: "Actualización",
          formula: R`Con momento: $+\,\beta \cdot \left(w_{ji}(t) - w_{ji}(t-1)\right)$`,
          detail: R`Confirmado para 2026: actualizar sin momento ($\beta=0$). Si un modelo viejo da $\beta$ y pesos en $t-1$, sumar $\beta \cdot \Delta w_{ji}(t)$.`
        },
        {
          name: "Error Global vs Early Stopping",
          badge: "Criterio de parada",
          formula: R`Parar si $E_G \le E_{\min}$ o cuando $E_{\text{val}}$ sube`,
          detail: R`En tablas de validación temprana, detener exactamente antes de que el <strong>error de validación</strong> empiece a subir (aunque el de entrenamiento siga bajando).`
        }
      ],
      traps: [
        R`Olvidar multiplicar por $f'(\text{Net}) = y(1-y)$ tanto en $\delta_k$ (cuando la salida es sigmoidal) como en $\delta_j$.`,
        R`Usar $w_{ji}(t+1)$ recién actualizado al calcular $\delta_j$ oculta: siempre se usa el peso $w_{kj}(t)$ previo al ajuste.`
      ],
      examples: [
        {
          id: "ex_mlp_4a",
          title: "Ejemplo 4A — Propagación Sigmoidal Completa (Guía 01.1 pág. 1–2)",
          meta: "Fuente: guia_practica_mlp.pdf",
          problemHtml: R`
            Entradas $x_1 = 2, x_2 = 3$; salida deseada $S_d = 1$; tasa de aprendizaje $\alpha = 0.5$ (sin momento).
            Neuronas ocultas <code>1, 2</code> y salida <code>3</code> (todas <strong>sigmoidales</strong>). Pesos: $w_{11}=0.4, w_{12}=0.5, w_{21}=0.6, w_{22}=0.8, w_{31}=0.7, w_{32}=0.2$.
            Calcular salidas, errores $\delta$ y actualizar $w_{31}$ y $w_{11}$.
          `,
          steps: [
            {
              title: "Forward en Capa Oculta (Net₁, y₁, Net₂, y₂ y sus derivadas)",
              paperComment: "Propago las entradas hacia adelante hasta las neuronas ocultas calculando su activación sigmoidal y su derivada f'(Net) = y(1 − y).",
              mathHtml: R`
                <ul>
                  <li><strong>Oculta 1:</strong> $\text{Net}_1 = 0.4(2) + 0.5(3) = 2.3 \implies y_1 = \frac{1}{1+e^{-2.3}} = \mathbf{0.908}$
                    <br>$f'(\text{Net}_1) = 0.908 \cdot (1 - 0.908) = \mathbf{0.083}$</li>
                  <li><strong>Oculta 2:</strong> $\text{Net}_2 = 0.6(2) + 0.8(3) = 3.6 \implies y_2 = \frac{1}{1+e^{-3.6}} = \mathbf{0.973}$
                    <br>$f'(\text{Net}_2) = 0.973 \cdot (1 - 0.973) = \mathbf{0.026}$</li>
                </ul>
              `,
              note: "Guardá tanto y₁, y₂ como sus derivadas f' porque los vas a volver a necesitar al retropropagar δ hacia atrás."
            },
            {
              title: "Forward en Capa de Salida (Net₃, y₃, f'₃) y Error de Patrón Ep",
              paperComment: "Calculo la activación final de la neurona de salida y₃ usando como entradas las salidas ocultas y₁, y₂.",
              mathHtml: R`
                $$\text{Net}_3 = 0.7(0.908) + 0.2(0.973) = 0.6356 + 0.1946 = \mathbf{0.830}$$
                $$y_3 = \frac{1}{1+e^{-0.830}} = \mathbf{0.696} \qquad\qquad f'(\text{Net}_3) = 0.696(1 - 0.696) = \mathbf{0.211}$$
                Error cuadrático del patrón: $E_p = \frac{1}{2}(1 - 0.696)^2 = \mathbf{0.0462}$.
              `,
              visualHtml: `
                <svg viewBox="0 0 500 115" role="img" aria-label="Valores forward y backward calculados sobre la red MLP">
                  <circle cx="55" cy="36" r="14" fill="var(--bg-subtle)" stroke="#38bdf8"/><text x="55" y="40" text-anchor="middle" fill="var(--text-main)" font-size="10" font-weight="700">x₁=2</text>
                  <circle cx="55" cy="84" r="14" fill="var(--bg-subtle)" stroke="#38bdf8"/><text x="55" y="88" text-anchor="middle" fill="var(--text-main)" font-size="10" font-weight="700">x₂=3</text>
                  <circle cx="225" cy="36" r="20" fill="var(--bg-subtle)" stroke="var(--primary)" stroke-width="1.8"/><text x="225" y="34" text-anchor="middle" fill="var(--text-main)" font-size="9.5" font-weight="800">y₁=0.908</text><text x="225" y="46" text-anchor="middle" fill="#fb7185" font-size="8.2">δ₁=0.0037</text>
                  <circle cx="225" cy="84" r="20" fill="var(--bg-subtle)" stroke="var(--primary)" stroke-width="1.8"/><text x="225" y="82" text-anchor="middle" fill="var(--text-main)" font-size="9.5" font-weight="800">y₂=0.973</text><text x="225" y="94" text-anchor="middle" fill="#fb7185" font-size="8.2">δ₂=0.00033</text>
                  <circle cx="405" cy="60" r="24" fill="var(--bg-subtle)" stroke="#10b981" stroke-width="2"/><text x="405" y="57" text-anchor="middle" fill="#10b981" font-size="10" font-weight="800">y₃=0.696</text><text x="405" y="70" text-anchor="middle" fill="#fb7185" font-size="8.5" font-weight="700">δ₃=0.064</text>
                  <line x1="70" y1="36" x2="203" y2="36" stroke="#38bdf8"/><line x1="70" y1="84" x2="203" y2="84" stroke="#38bdf8"/>
                  <line x1="70" y1="40" x2="203" y2="78" stroke="var(--border-color)"/><line x1="70" y1="80" x2="203" y2="42" stroke="var(--border-color)"/>
                  <line x1="246" y1="39" x2="380" y2="55" stroke="#38bdf8" stroke-width="1.8"/>
                  <text x="315" y="41" text-anchor="middle" fill="var(--primary)" font-size="9">w₃₁=0.7→0.729</text>
                  <line x1="246" y1="81" x2="380" y2="65" stroke="#38bdf8" stroke-width="1.4"/>
                </svg>
              `,
              note: "Si la salida fuera lineal en un modelo viejo, f'(Net₃) valdría 1 en vez de 0.211."
            },
            {
              title: "Retropropagación de errores (δ₃ en salida y δ₁, δ₂ ocultas)",
              paperComment: "Calculo el error delta de la capa de salida y lo retropropago ponderado por los pesos actuales hacia las neuronas ocultas.",
              mathHtml: R`
                <ul>
                  <li><strong>Salida:</strong> $\delta_3 = (S_d - y_3)\cdot f'(\text{Net}_3) = (1 - 0.696)\cdot 0.211 = \mathbf{0.064}$</li>
                  <li><strong>Oculta 1:</strong> $\delta_1 = f'(\text{Net}_1)\cdot(w_{31}\cdot\delta_3) = 0.083 \cdot (0.7 \cdot 0.064) = \mathbf{0.0037}$</li>
                  <li><strong>Oculta 2:</strong> $\delta_2 = f'(\text{Net}_2)\cdot(w_{32}\cdot\delta_3) = 0.026 \cdot (0.2 \cdot 0.064) = \mathbf{0.00033}$</li>
                </ul>
              `,
              note: "Si hubiera más neuronas de salida k, sumás Σ(w_{kj} · δ_k) antes de multiplicar por f'(Net_j)."
            },
            {
              title: "Actualizar los pesos solicitados (sin momento)",
              paperComment: "Aplico la regla delta w_nuevo = w_actual + α · δ_destino · y_origen únicamente sobre los pesos pedidos.",
              mathHtml: R`
                <ul>
                  <li>$w_{31}(t+1) = w_{31}(t) + \alpha \cdot \delta_3 \cdot y_1 = 0.7 + 0.5(0.064)(0.908) = \mathbf{0.729}$</li>
                  <li>$w_{11}(t+1) = w_{11}(t) + \alpha \cdot \delta_1 \cdot x_1 = 0.4 + 0.5(0.0037)(2) = \mathbf{0.4037}$</li>
                </ul>
              `,
              note: "Fijate qué fácil es verificar el signo: como y₃=0.696 estaba por debajo de Sd=1 (δ₃ > 0), todos los pesos conectados positivamente crecen levemente."
            }
          ],
          conclusionHtml: R`$\delta_3 = 0.064$, $\delta_1 = 0.0037$, $\delta_2 = 0.00033$ · Pesos actualizados: <strong>$w_{31} = 0.729$</strong> y <strong>$w_{11} = 0.4037$</strong>.`
        },
        {
          id: "ex_mlp_4b",
          title: "Ejemplo 4B — Criterio de Parada por Early Stopping (Guía 02)",
          meta: "Fuente: Guía 02 MLP",
          problemHtml: R`
            En una corrida de entrenamiento con validación cruzada se registran los errores globales de Entrenamiento ($E_{\text{train}}$) y Validación ($E_{\text{val}}$) entre las iteraciones $i_{12}$ e $i_{16}$. ¿En qué iteración conviene detener la red y por qué?
          `,
          steps: [
            {
              title: "Analizar la tabla de evolución Entrenamiento vs Validación",
              paperComment: "Comparo la tendencia del error de entrenamiento frente al error de validación iteración por iteración.",
              mathHtml: R`
                <div class="mc-table-wrap">
                  <table class="pe-data-table">
                    <thead><tr><th>Iteración</th><th>$i_{11}$</th><th>$i_{12}$</th><th>$i_{13}$</th><th>$i_{14}$</th><th>$i_{15}$</th><th>$i_{16}$</th></tr></thead>
                    <tbody>
                      <tr><td>$E_{\text{train}}$</td><td>1.80</td><td>0.51</td><td>0.44</td><td>0.26</td><td>0.19</td><td>0.11</td></tr>
                      <tr class="mc-row-highlight"><td><strong>$E_{\text{val}}$</strong></td><td>2.452</td><td>0.588</td><td>0.521</td><td>0.306</td><td><strong>0.249 (mín)</strong></td><td><strong style="color:var(--danger);">0.989 ↑</strong></td></tr>
                    </tbody>
                  </table>
                </div>
              `,
              note: "Aunque E_train sigue bajando en i₁₆ (0.19 → 0.11), E_val rebota bruscamente (0.249 → 0.989)."
            },
            {
              title: "Identificar punto de quiebre y evitar sobreajuste (curva E_train vs E_val)",
              paperComment: "Detengo el entrenamiento en la iteración mínima de validación (i₁₅) previa a la subida del error, para prevenir memorización.",
              mathHtml: R`
                En $i_{15}$ la red alcanza su mejor capacidad de generalización ($E_{\text{val}} = \mathbf{0.249}$). Si continuara hasta $i_{16}$, memorizaría ruido del conjunto de entrenamiento (<em>overfitting</em>).
              `,
              visualHtml: `
                <svg viewBox="0 0 460 112" role="img" aria-label="Curva Early Stopping mostrando mínimo de E_val en i15 y salto en i16">
                  <line x1="35" y1="90" x2="430" y2="90" stroke="var(--border-color)" stroke-width="1.2"/>
                  <line x1="35" y1="16" x2="35" y2="90" stroke="var(--border-color)" stroke-width="1.2"/>
                  <!-- E_train descending -->
                  <polyline points="60,24 140,62 220,72 300,78 360,82 410,85" fill="none" stroke="#38bdf8" stroke-width="2"/>
                  <!-- E_val U-shape -->
                  <polyline points="60,20 140,56 220,62 300,70 360,74 410,30" fill="none" stroke="#fb7185" stroke-width="2.2"/>
                  <line x1="360" y1="16" x2="360" y2="90" stroke="#10b981" stroke-width="1.6" stroke-dasharray="4 3"/>
                  <circle cx="360" cy="74" r="4.5" fill="#10b981"/>
                  <text x="355" y="102" text-anchor="middle" fill="#10b981" font-size="9" font-weight="800">i₁₅ (parar: 0.249)</text>
                  <circle cx="410" cy="30" r="4" fill="var(--danger)"/>
                  <text x="412" y="23" text-anchor="middle" fill="var(--danger)" font-size="8.5" font-weight="700">i₁₆: 0.989</text>
                </svg>
              `,
              note: "Recordá también: el conjunto de validación NUNCA se usa para modificar pesos por Backpropagation; solo monitorea cuándo frenar."
            },
            {
              title: "Redactar conclusión oficial de parada",
              paperComment: "Concluyo indicando la iteración exacta donde se detiene y aclaro que los datos de validación no modifican pesos.",
              mathHtml: R`
                Se conserva el juego de pesos alcanzado en la época <strong>$i_{15}$</strong> ($E_{\text{val}} = 0.249$) porque a partir de $i_{16}$ comienza el sobreajuste sobre los datos de entrenamiento.
              `,
              note: "Si el examen da dos tablas posibles (una que baja constante sin validar y otra con validación subiendo), la validación siempre define cuándo cortar."
            }
          ],
          conclusionHtml: R`Detener en la iteración <strong>$i_{15}$ ($E_{\text{val}} = 0.249$)</strong>, justo antes de que el error de validación empiece a subir en $i_{16}$.`
        }
      ]
    },
    {
      id: "SOM",
      labKey: "SOM",
      order: 5,
      badge: "SOM",
      inP2Scope: true,
      scopeLabel: "✅ Entra en 2do Parcial",
      title: "5. SOM — Mapas de Kohonen",
      subtitle: R`Notación: patrón $P_k = [x_1, \dots, x_n]^T$ · pesos $W_j = [w_{j1}, \dots, w_{jn}]^T$.`,
      svgDiagram: `
        <svg viewBox="0 0 560 190" class="mc-svg-diagram" role="img" aria-label="Arquitectura oficial Kohonen SOM requerida por la cátedra">
          <defs>
            <marker id="mc-som-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 1 L 10 5 L 0 9 z" fill="var(--primary)"/></marker>
          </defs>
          <rect x="12" y="14" width="536" height="162" rx="10" fill="var(--bg-card)" stroke="#10b981" stroke-width="1.6"/>
          <text x="280" y="34" text-anchor="middle" fill="#10b981" font-size="11" font-weight="800">ARQUITECTURA DE CÁTEDRA (5% DEL PUNTAJE EN PARCIAL)</text>
          <!-- Salidas arriba -->
          <circle cx="195" cy="68" r="20" fill="var(--bg-subtle)" stroke="#10b981" stroke-width="2"/><text x="195" y="72" text-anchor="middle" fill="var(--text-main)" font-size="11.5" font-weight="800">W₁</text>
          <circle cx="365" cy="68" r="20" fill="var(--bg-subtle)" stroke="var(--warning)" stroke-width="2.2"/><text x="365" y="72" text-anchor="middle" fill="var(--warning)" font-size="11.5" font-weight="800">W₂*</text>
          <!-- Arco de vecindad -->
          <path d="M 216 58 Q 280 34 344 58" fill="none" stroke="#f59e0b" stroke-width="1.8" stroke-dasharray="4 3"/>
          <text x="280" y="47" text-anchor="middle" fill="#f59e0b" font-size="9.5" font-weight="700">vecindad h(j, j*)</text>

          <!-- Entradas abajo -->
          <circle cx="195" cy="144" r="17" fill="var(--bg-subtle)" stroke="var(--primary)" stroke-width="1.6"/><text x="195" y="148" text-anchor="middle" fill="var(--text-main)" font-size="11.5" font-weight="700">x₁</text>
          <circle cx="365" cy="144" r="17" fill="var(--bg-subtle)" stroke="var(--primary)" stroke-width="1.6"/><text x="365" y="148" text-anchor="middle" fill="var(--text-main)" font-size="11.5" font-weight="700">x₂</text>

          <!-- Flechas con valor numérico -->
          <line x1="195" y1="126" x2="195" y2="91" stroke="var(--primary)" stroke-width="1.6" marker-end="url(#mc-som-arr)"/>
          <text x="172" y="112" fill="var(--primary)" font-size="9.5" font-weight="700">w₁₁=0.7</text>
          <line x1="208" y1="132" x2="346" y2="82" stroke="var(--primary)" stroke-width="1.4" marker-end="url(#mc-som-arr)"/>
          <text x="242" y="96" fill="var(--text-muted)" font-size="9.2">w₂₁=−0.3</text>
          <line x1="352" y1="132" x2="214" y2="82" stroke="var(--primary)" stroke-width="1.4" marker-end="url(#mc-som-arr)"/>
          <text x="316" y="96" fill="var(--text-muted)" font-size="9.2">w₁₂=−0.6</text>
          <line x1="365" y1="126" x2="365" y2="91" stroke="var(--primary)" stroke-width="1.6" marker-end="url(#mc-som-arr)"/>
          <text x="394" y="112" fill="var(--primary)" font-size="9.5" font-weight="700">w₂₂=0.4</text>

          <text x="280" y="169" text-anchor="middle" fill="var(--text-muted)" font-size="9.2">Entradas abajo, pesos en las flechas, salidas arriba + arco de vecindad</text>
        </svg>
      `,
      coreSteps: [
        R`<strong>1. Inicialización:</strong> Fijar pesos iniciales $W_j$ y radio/fórmula de vecindad.`,
        R`<strong>2. Presentación:</strong> Presentar el vector de entrada $P_k = [x_1, \dots, x_n]^T$.`,
        R`<strong>3. Competencia (BMU $j^*$):</strong> Calcular distancia euclídea $d(P_k, W_j) = \sqrt{\sum_{i=1}^n (x_i - w_{ji})^2}$; gana la <strong>menor</strong>.`,
        R`<strong>4. Cooperación y Adaptación:</strong> $w_{ji}(t+1) = w_{ji}(t) + \alpha \cdot h(j, j^*) \cdot [x_i - w_{ji}(t)]$.`,
        R`<strong>5. Iteración:</strong> Al presentar el siguiente patrón $P_2$, usar los pesos recién actualizados $W(t+1)$.`
      ],
      variants: [
        {
          name: "Vecindad Nula (WTA puro)",
          badge: "h = 1 o 0",
          formula: R`$h(j, j^*) = 1$ solo para $j = j^*$ · $0$ para el resto`,
          detail: R`Solo se actualiza la neurona ganadora $W_{j^*}$; las demás conservan exactamente sus pesos anteriores.`
        },
        {
          name: "Vecindad Continua No Nula",
          badge: "Competencia + Vecinos",
          formula: R`$h = \frac{1}{1 + \text{dist}(W_j, W_{j^*})}$ o $\frac{1}{1 + \text{dist}^2}$`,
          detail: R`La distancia $\text{dist}(W_j, W_{j^*})$ entre pesos de neuronas se calcula con los pesos <strong>antes</strong> de actualizar el paso actual.`
        }
      ],
      traps: [
        R`Evaluar $P_2$ contra los pesos iniciales $W(0)$ en lugar de usar $W(1)$ recién actualizado tras $P_1$.`,
        R`Calcular $\text{dist}(W_j, W_{j^*})$ usando $W_{j^*}$ ya movida hacia $P_k$ en vez de usar $W_{j^*}(t)$ del inicio del paso.`,
        R`Dibujar la arquitectura sin escribir los valores numéricos de cada peso sobre las flechas.`
      ],
      examples: [
        {
          id: "ex_som_5a",
          title: "Ejemplo 5A — Vecindad No Nula vs Vecindad Nula (Guía Oficial pág. 4)",
          meta: "Fuente: Guía Oficial SOM / Excel 2020",
          problemHtml: R`
            Mapa Kohonen de $2$ neuronas de salida con pesos iniciales $W_1 = [0.7,\; -0.6]^T$ y $W_2 = [-0.3,\; 0.4]^T$.
            Tasa de aprendizaje $\alpha = 1$, vecindad continua $h(W_i, W_{j^*}) = \frac{1}{1 + \text{dist}(W_i, W_{j^*})}$. Presentar el patrón <strong>$P_1 = [0.17,\; 0.86]^T$</strong>.
          `,
          steps: [
            {
              title: "Competencia: medir distancias euclídeas a cada neurona",
              paperComment: "Calculo la distancia euclídea entre el patrón P₁ y cada vector de pesos W_j para determinar la neurona ganadora (BMU).",
              mathHtml: R`
                <ul>
                  <li>$d(P_1, W_1) = \sqrt{(0.17 - 0.7)^2 + (0.86 - (-0.6))^2} = \sqrt{(-0.53)^2 + (1.46)^2} = \mathbf{1.553}$</li>
                  <li>$d(P_1, W_2) = \sqrt{(0.17 - (-0.3))^2 + (0.86 - 0.4)^2} = \sqrt{(0.47)^2 + (0.46)^2} = \mathbf{0.658} \leftarrow \textbf{Ganadora } W_2$</li>
                </ul>
              `,
              note: "Siempre gana la distancia MENOR (0.658 < 1.553), por lo tanto j* = W₂."
            },
            {
              title: "Cooperación: calcular vecindad h(W_i, W₂) con los pesos actuales",
              paperComment: "Manteniendo los pesos originales de la red sin modificar aún, calculo la distancia entre la vecina W₁ y la ganadora W₂ para obtener h.",
              mathHtml: R`
                <ul>
                  <li>Para la ganadora $W_2$: siempre $h(W_2, W_2) = \mathbf{1}$.</li>
                  <li>Para la vecina $W_1$: $\text{dist}(W_1, W_2) = \sqrt{(0.7 - (-0.3))^2 + (-0.6 - 0.4)^2} = \sqrt{1^2 + (-1)^2} = \sqrt{2} \approx 1.414$
                    <br>$$h(W_1, W_2) = \frac{1}{1 + 1.414} = \mathbf{0.414}$$</li>
                </ul>
              `,
              note: "¡Regla crítica UTN! No actualices W₂ primero y luego midas dist(W₁, W₂_nuevo): la vecindad se calcula contra W₂(t) previo."
            },
            {
              title: "Adaptación: mover W₂ hacia P₁ y arrastrar a su vecina W₁",
              paperComment: "Aplico la regla de actualización w_ji(t+1) = w_ji(t) + α · h · [x_i − w_ji(t)] en ambas neuronas.",
              mathHtml: R`
                <ul>
                  <li><strong>Ganadora $W_2$ ($h=1$):</strong>
                    <br>$w_{21}(t+1) = -0.3 + 1(1)(0.17 - (-0.3)) = \mathbf{0.17}$
                    <br>$w_{22}(t+1) = 0.4 + 1(1)(0.86 - 0.4) = \mathbf{0.86}$</li>
                  <li><strong>Vecina $W_1$ ($h=0.414$):</strong>
                    <br>$w_{11}(t+1) = 0.7 + 1(0.414)(0.17 - 0.7) = \mathbf{0.480}$
                    <br>$w_{12}(t+1) = -0.6 + 1(0.414)(0.86 - (-0.6)) = \mathbf{0.004}$</li>
                </ul>
              `,
              visualHtml: `
                <svg viewBox="0 0 460 130" role="img" aria-label="Desplazamiento geométrico de W2 (BMU) y arrastre vecinal de W1 hacia P1">
                  <line x1="30" y1="78" x2="430" y2="78" stroke="var(--border-color)" stroke-width="1"/>
                  <line x1="210" y1="10" x2="210" y2="122" stroke="var(--border-color)" stroke-width="1"/>
                  <!-- P1 -->
                  <polygon points="242,18 249,29 235,29" fill="var(--warning)"/><text x="275" y="26" fill="var(--warning)" font-size="9.5" font-weight="800">P₁=(0.17, 0.86)</text>
                  <!-- W2 old -> new -->
                  <circle cx="170" cy="52" r="4.5" fill="var(--text-muted)"/><text x="148" y="47" text-anchor="end" fill="var(--text-muted)" font-size="8.5">W₂(0)</text>
                  <line x1="170" y1="52" x2="240" y2="26" stroke="#10b981" stroke-width="2" stroke-dasharray="4 2"/>
                  <circle cx="242" cy="25" r="5" fill="#10b981"/><text x="195" y="23" fill="#10b981" font-size="8.5" font-weight="800">W₂(1)=P₁ (α=1)</text>
                  <!-- W1 old -> new -->
                  <circle cx="320" cy="112" r="4.5" fill="var(--text-muted)"/><text x="330" y="116" fill="var(--text-muted)" font-size="8.5">W₁(0)=(0.7, −0.6)</text>
                  <line x1="320" y1="112" x2="288" y2="78" stroke="var(--primary)" stroke-width="2" stroke-dasharray="4 2"/>
                  <circle cx="288" cy="77" r="5" fill="var(--primary)"/><text x="300" y="73" fill="var(--primary)" font-size="9" font-weight="800">W₁(1)=(0.48, 0.004)</text>
                </svg>
              `,
              note: "Con α = 1 y h = 1, W₂ alcanza exactamente a P₁. Si el ejercicio fuera de Vecindad Nula (h=0 para vecinas), W₁ quedaría quieto en [0.7, −0.6]ᵀ. Recordá además usar W₁(1), W₂(1) si luego te presentan un P₂."
            }
          ],
          conclusionHtml: R`Con vecindad no nula: <strong>$W_2(1) = [0.17,\; 0.86]^T$</strong> y <strong>$W_1(1) = [0.480,\; 0.004]^T$</strong>.`
        }
      ]
    },
    {
      id: "KNN",
      labKey: "KNN",
      order: 6,
      badge: "KNN",
      inP2Scope: true,
      scopeLabel: "✅ Entra en 2do Parcial",
      title: "6. KNN — K-Vecinos Próximos y LOOCV",
      subtitle: R`Distancia euclídea entre consulta $x_q$ e instancias: $d(x_q, x_i) = \sqrt{\sum_{r=1}^n (a_r(x_q) - a_r(x_i))^2}$.`,
      svgDiagram: `
        <svg viewBox="0 0 560 190" class="mc-svg-diagram" role="img" aria-label="Comparación entre KNN por mayoría simple vs ponderado 1/d² y tabla Leave-One-Out">
          <!-- Left: Simple vs 1/d² -->
          <rect x="12" y="16" width="275" height="158" rx="10" fill="var(--bg-card)" stroke="var(--primary)" stroke-width="1.6"/>
          <text x="149" y="36" text-anchor="middle" fill="var(--primary)" font-size="11" font-weight="800">PARADOJA CLÁSICO vs PONDERADO (k=3)</text>
          <circle cx="149" cy="100" r="60" fill="none" stroke="var(--primary)" stroke-width="1.4" stroke-dasharray="4 3"/>
          <!-- query -->
          <polygon points="149,92 157,100 149,108 141,100" fill="var(--danger)"/>
          <text x="149" y="121" text-anchor="middle" fill="var(--danger)" font-size="9.5" font-weight="800">xq</text>
          <!-- close C2 -->
          <circle cx="128" cy="90" r="6" fill="#f59e0b"/><text x="115" y="84" fill="#f59e0b" font-size="9" font-weight="700">C2 (d=2.6)</text>
          <!-- two far C1 -->
          <circle cx="188" cy="70" r="6" fill="#10b981"/><text x="206" y="73" fill="#10b981" font-size="9" font-weight="700">C1 (3.3)</text>
          <circle cx="185" cy="136" r="6" fill="#10b981"/><text x="204" y="140" fill="#10b981" font-size="9" font-weight="700">C1 (4.8)</text>
          <text x="149" y="166" text-anchor="middle" fill="var(--text-main)" font-size="9.2">Simple: gana C1 (2 vs 1) · 1/d²: gana C2 (0.145 &gt; 0.136)</text>

          <!-- Right: LOOCV -->
          <rect x="302" y="16" width="246" height="158" rx="10" fill="var(--bg-card)" stroke="#10b981" stroke-width="1.6"/>
          <text x="425" y="36" text-anchor="middle" fill="#10b981" font-size="11" font-weight="800">SELECCIÓN DE k (LEAVE-ONE-OUT)</text>
          <text x="425" y="58" text-anchor="middle" fill="var(--text-muted)" font-size="9.5">Cada Pm se evalúa contra las N − 1 restantes</text>
          <rect x="318" y="68" width="214" height="22" rx="4" fill="var(--bg-subtle)" stroke="var(--border-color)"/>
          <text x="425" y="83" text-anchor="middle" fill="var(--text-main)" font-size="9.5" font-weight="700">k  |  P₁  P₂  P₃  P₄  P₅  P₆  |  Xk</text>
          <rect x="318" y="94" width="214" height="22" rx="4" fill="rgba(16,185,129,0.16)" stroke="#10b981"/>
          <text x="425" y="109" text-anchor="middle" fill="#10b981" font-size="9.5" font-weight="800">1  |  ✓   ✓   ✓   ✓   ✓   ✓  |  6 ★</text>
          <rect x="318" y="120" width="214" height="22" rx="4" fill="rgba(239,68,68,0.1)" stroke="var(--border-color)"/>
          <text x="425" y="135" text-anchor="middle" fill="var(--text-muted)" font-size="9.5">4  |  ✕   ✕   ✕   ✕   ✕   ✕  |  0</text>
          <text x="425" y="163" text-anchor="middle" fill="var(--text-main)" font-size="9.2">Elegir el k con mayor aciertos Xk</text>
        </svg>
      `,
      coreSteps: [
        R`<strong>1. Calcular distancias:</strong> $d(x_q, x_i) = \sqrt{\sum_r (a_r(x_q) - a_r(x_i))^2}$ hacia todas las instancias de entrenamiento.`,
        R`<strong>2. Ordenar y seleccionar:</strong> Tomar únicamente los $k$ vecinos con menor distancia.`,
        R`<strong>3. Votar (según variante):</strong> Conteo directo en clásico, o suma de pesos $\omega_i = 1/d^2$ (o $1/d$) en ponderado.`
      ],
      variants: [
        {
          name: "Variante A — Clásico (Mayoría simple)",
          badge: "Peso = 1",
          formula: R`$f(x_q) \leftarrow \arg\max_{v \in V} \sum_{i=1}^{k} \delta(v, f(x_i))$`,
          detail: R`Cada uno de los $k$ vecinos aporta exactamente $1$ voto. Conviene $k$ impar en problemas binarios para evitar empates.`
        },
        {
          name: "Variante B — Ponderado por Distancia",
          badge: "ω = 1/d² o 1/d",
          formula: R`$f(x_q) \leftarrow \arg\max_{v \in V} \sum_{i=1}^{k} \omega_i \cdot \delta(v, f(x_i)), \quad \omega_i = \frac{1}{d(x_q, x_i)^2}$`,
          detail: R`Usar $\omega_i = 1/d^2$ por defecto (o $1/d$ si lo pide el enunciado). Si aparece $d = 0$, asignar directamente esa clase.`
        },
        {
          name: "Variante C — Selección de k óptimo (LOOCV)",
          badge: "Validación cruzada",
          formula: R`Matriz $k=1 \dots N-1 \times P_1 \dots P_N \implies \max X_k$`,
          detail: R`Cada punto $P_m$ queda fuera como consulta frente a los $N-1$ restantes. Si hay empate entre vecinos al probar $k$, seguir criterio de desempate uniforme.`
        }
      ],
      traps: [
        R`Usar todos los $N$ puntos al calcular suma $1/d^2$ cuando el enunciado pide <strong>$k=3$ vecinos más cercanos</strong>.`,
        R`En Leave-One-Out, olvidarse de excluir el propio $P_m$ cuando clasificás $P_m$ (daría $d=0$ siempre).`
      ],
      examples: [
        {
          id: "ex_knn_6a",
          title: "Ejemplo 6A — KNN Ponderado 1/d² vs Mayoría Simple (Guía 03.1)",
          meta: "Fuente: guia_practica_knn.pdf pág. 9–10",
          problemHtml: R`
            Dada la instancia nueva <strong>$N = (1.2,\; 1.3,\; 1.4)$</strong> y parámetro <strong>$k = 3$</strong>, clasificarla usando KNN ponderado por distancia ($\omega_i = 1/d^2$) y comparar qué habría predicho KNN clásico por mayoría simple.
          `,
          steps: [
            {
              title: "Calcular distancias euclídeas a todas las muestras y elegir las k=3 menores",
              paperComment: "Calculo la distancia euclídea entre N y cada instancia de entrenamiento, ordeno de menor a mayor y me quedo solo con los 3 vecinos más cercanos.",
              mathHtml: R`
                <div class="mc-table-wrap">
                  <table class="pe-data-table">
                    <thead><tr><th>Ranking</th><th>Instancia</th><th>Clase</th><th>Distancia $d(N, P_i)$</th></tr></thead>
                    <tbody>
                      <tr class="mc-row-highlight"><td><strong>#1</strong></td><td>$P_8$</td><td><strong>Clase 2</strong></td><td>$2.624$</td></tr>
                      <tr class="mc-row-highlight"><td><strong>#2</strong></td><td>$P_1$</td><td>Clase 1</td><td>$3.300$</td></tr>
                      <tr class="mc-row-highlight"><td><strong>#3</strong></td><td>$P_2$</td><td>Clase 1</td><td>$4.784$</td></tr>
                      <tr><td>#4..</td><td>$P_3\dots$</td><td>…</td><td>$&gt; 5.0$ (descartados por $k=3$)</td></tr>
                    </tbody>
                  </table>
                </div>
              `,
              note: "Observá que por mayoría simple habría ganado Clase 1 (2 vecinos contra 1 de Clase 2)."
            },
            {
              title: "Calcular pesos ωᵢ = 1 / dᵢ² para cada uno de los k=3 vecinos",
              paperComment: "Aplico ponderación cuadrática inversa sobre los 3 vecinos seleccionados para darle mayor peso a los más próximos.",
              mathHtml: R`
                <ul>
                  <li>$P_8$ (Clase 2): $\omega_1 = \frac{1}{(2.624)^2} = \frac{1}{6.885} = \mathbf{0.145}$</li>
                  <li>$P_1$ (Clase 1): $\omega_2 = \frac{1}{(3.300)^2} = \frac{1}{10.890} = \mathbf{0.092}$</li>
                  <li>$P_2$ (Clase 1): $\omega_3 = \frac{1}{(4.784)^2} = \frac{1}{22.887} = \mathbf{0.044}$</li>
                </ul>
              `,
              note: "Si el enunciado pidiera peso lineal ω = 1/d en vez de 1/d², simplemente no eleves d al cuadrado."
            },
            {
              title: "Sumar los pesos por clase y decidir el ganador",
              paperComment: "Sumo los pesos ωᵢ agrupados por clase y clasifico a N según la mayor suma obtenida.",
              mathHtml: R`
                <ul>
                  <li>$\text{Voto ponderado}(\text{Clase 1}) = 0.092 + 0.044 = 0.136$</li>
                  <li>$\text{Voto ponderado}(\text{Clase 2}) = \mathbf{0.145}$</li>
                </ul>
              `,
              visualHtml: `
                <svg viewBox="0 0 460 90" role="img" aria-label="Comparación de barras: Mayoría Simple vs Ponderado 1/d²">
                  <text x="15" y="28" fill="var(--text-main)" font-size="9.5" font-weight="700">Clase 2 (1 vecino: P₈)</text>
                  <rect x="175" y="16" width="210" height="16" rx="4" fill="#f59e0b"/>
                  <text x="394" y="28" fill="#f59e0b" font-size="10" font-weight="800">0.145 ★ GANA</text>

                  <text x="15" y="62" fill="var(--text-main)" font-size="9.5" font-weight="700">Clase 1 (2 vecinos: P₁+P₂)</text>
                  <rect x="175" y="50" width="134" height="16" rx="4" fill="#10b981"/>
                  <rect x="311" y="50" width="63" height="16" rx="4" fill="rgba(16,185,129,0.55)"/>
                  <text x="384" y="62" fill="#10b981" font-size="10" font-weight="700">0.136 (0.092 + 0.044)</text>
                </svg>
              `,
              note: "El vecino P₈ está tan cerca que su peso 0.145 supera por sí solo a la suma de P₁ y P₂ más lejanos, revirtiendo la decisión de mayoría simple."
            }
          ],
          conclusionHtml: R`Por KNN Ponderado ($1/d^2, k=3$) clasifica como <strong>Clase 2</strong> ($\text{0.145} &gt; \text{0.136}$).`
        },
        {
          id: "ex_knn_6b",
          title: "Ejemplo 6B — Tabla Leave-One-Out para k óptimo (Guía 02 pág. 7)",
          meta: "Fuente: Guía 02 KNN",
          problemHtml: R`
            Se tienen $N = 6$ instancias $P_1 \dots P_6$ etiquetadas. Hallar el <strong>$k$ óptimo</strong> entre $k=1 \dots 5$ usando validación cruzada <em>Leave-One-Out</em> (LOOCV).
          `,
          steps: [
            {
              title: "Calcular matriz de distancias entre las N instancias",
              paperComment: "Armo la matriz de distancias entre los 6 puntos para poder ocultar una muestra por vez y buscar sus k vecinos entre los 5 restantes.",
              mathHtml: R`
                Para cada fila de prueba $P_m$, tachamos la diagonal $d(P_m, P_m) = 0$ y ordenamos únicamente los $N - 1 = 5$ vecinos restantes de menor a mayor distancia.
              `,
              note: "¡Trampa clásica: nunca incluyas al propio P_m como su vecino más cercano!"
            },
            {
              title: "Evaluar cada P_m variando k y registrar aciertos",
              paperComment: "Para cada valor de k, determino la clase predicha para cada instancia P₁..P₆ y verifico si coincide con su etiqueta real.",
              mathHtml: R`
                <div class="mc-table-wrap">
                  <table class="pe-data-table">
                    <thead><tr><th>$k$</th><th>$P_1$</th><th>$P_2$</th><th>$P_3$</th><th>$P_4$</th><th>$P_5$</th><th>$P_6$</th><th>Aciertos $X_k$</th></tr></thead>
                    <tbody>
                      <tr class="mc-row-highlight"><td><strong>$k=1$</strong></td><td>acierta ✓</td><td>acierta ✓</td><td>acierta ✓</td><td>acierta ✓</td><td>acierta ✓</td><td>acierta ✓</td><td><strong>6 / 6 (óptimo)</strong></td></tr>
                      <tr><td>$k=2$</td><td>empate/ok</td><td>…</td><td>…</td><td>…</td><td>…</td><td>…</td><td>&lt; 6</td></tr>
                      <tr><td>$k=4$</td><td>falla ✕</td><td>falla ✕</td><td>falla ✕</td><td>falla ✕</td><td>falla ✕</td><td>falla ✕</td><td>0 / 6</td></tr>
                    </tbody>
                  </table>
                </div>
              `,
              note: "Con k=4 sobre 5 vecinos disponibles de 2 clases (ej. 3 de una clase y 3 de otra en total, al sacar 1 quedan solo 2 de la misma clase vs 3 de la otra), la mayoría vota la clase opuesta."
            },
            {
              title: "Seleccionar el k con mayor cantidad de aciertos X_k",
              paperComment: "Comparo el total de clasificaciones correctas X_k de cada fila y selecciono el parámetro k máximo.",
              mathHtml: R`
                $$k^* = \arg\max_{k} X_k = \mathbf{1} \quad (\text{logra } 100\%\text{ de acierto})$$
              `,
              visualHtml: `
                <svg viewBox="0 0 460 88" role="img" aria-label="Comparación visual de aciertos por cada k en Leave-One-Out">
                  <line x1="35" y1="68" x2="430" y2="68" stroke="var(--border-color)" stroke-width="1.2"/>
                  <rect x="65" y="14" width="60" height="54" rx="4" fill="#10b981"/>
                  <text x="95" y="38" text-anchor="middle" fill="#fff" font-size="10.5" font-weight="800">6 / 6 ★</text>
                  <text x="95" y="80" text-anchor="middle" fill="var(--text-main)" font-size="9" font-weight="700">k = 1</text>
                  <rect x="195" y="42" width="60" height="26" rx="4" fill="var(--primary)" opacity="0.5"/>
                  <text x="225" y="80" text-anchor="middle" fill="var(--text-muted)" font-size="9">k = 2..3</text>
                  <rect x="325" y="65" width="60" height="3" fill="var(--danger)"/>
                  <text x="355" y="56" text-anchor="middle" fill="var(--danger)" font-size="9.5" font-weight="700">0 / 6</text>
                  <text x="355" y="80" text-anchor="middle" fill="var(--text-muted)" font-size="9">k = 4</text>
                </svg>
              `,
              note: "Si hay empate máximo entre varios k (ej. k=1 y k=3 aciertan 6/6), indicá ambos o elegí el k impar menor / criterio de la consigna."
            }
          ],
          conclusionHtml: R`El valor óptimo por Leave-One-Out es <strong>$k = 1$ ($X_1 = 6$ aciertos de $6$)</strong>.`
        }
      ]
    },
    {
      id: "CLUSTERING",
      labKey: "CLUSTERING",
      order: 7,
      badge: "CLUST",
      inP2Scope: true,
      scopeLabel: "✅ Entra en 2do Parcial",
      title: "7. Clustering (K-Means y Jerárquico)",
      subtitle: R`Particional (<strong>k-means / k-modes</strong>) + Aglomerativo (<strong>Single / Complete / Average UPGMA</strong>).`,
      svgDiagram: `
        <svg viewBox="0 0 560 190" class="mc-svg-diagram" role="img" aria-label="Heurística de semillas en K-Means y estrategias de enlace en Clustering Jerárquico">
          <!-- Left: K-means seeds -->
          <rect x="12" y="16" width="260" height="158" rx="10" fill="var(--bg-card)" stroke="var(--primary)" stroke-width="1.6"/>
          <text x="142" y="36" text-anchor="middle" fill="var(--primary)" font-size="11" font-weight="800">K-MEANS (SEMILLAS SI NO TE LAS DAN)</text>
          <circle cx="142" cy="96" r="5" fill="var(--warning)"/><text x="142" y="86" text-anchor="middle" fill="var(--warning)" font-size="9.5" font-weight="800">Media X̄</text>
          <circle cx="52" cy="66" r="6" fill="#10b981"/><text x="52" y="54" text-anchor="middle" fill="#10b981" font-size="9.5" font-weight="800">s₁ (más lejos X̄)</text>
          <circle cx="228" cy="128" r="6" fill="#6366f1"/><text x="206" y="144" text-anchor="middle" fill="#6366f1" font-size="9.5" font-weight="800">s₂ (más lejos s₁)</text>
          <line x1="142" y1="96" x2="58" y2="68" stroke="var(--warning)" stroke-dasharray="4 3"/>
          <line x1="58" y1="68" x2="222" y2="126" stroke="#10b981" stroke-dasharray="4 3"/>
          <text x="142" y="165" text-anchor="middle" fill="var(--text-muted)" font-size="9.2">k-modes (categórico): usa moda en vez de media</text>

          <!-- Right: Dendrogram -->
          <rect x="288" y="16" width="260" height="158" rx="10" fill="var(--bg-card)" stroke="#f59e0b" stroke-width="1.6"/>
          <text x="418" y="36" text-anchor="middle" fill="#f59e0b" font-size="11" font-weight="800">JERÁRQUICO AGLOMERATIVO</text>
          <path d="M 332 135 V 80 H 410 V 135 M 370 135 V 105 H 410" fill="none" stroke="var(--primary)" stroke-width="2"/>
          <path d="M 371 80 V 58 H 480 V 135 M 456 135 V 115 H 504 V 135" fill="none" stroke="var(--primary)" stroke-width="2"/>
          <text x="332" y="148" text-anchor="middle" fill="var(--text-main)" font-size="10" font-weight="800">A</text>
          <text x="370" y="148" text-anchor="middle" fill="var(--text-main)" font-size="10" font-weight="800">B</text>
          <text x="410" y="148" text-anchor="middle" fill="var(--text-main)" font-size="10" font-weight="800">D</text>
          <text x="456" y="148" text-anchor="middle" fill="var(--text-main)" font-size="10" font-weight="800">C</text>
          <text x="504" y="148" text-anchor="middle" fill="var(--text-main)" font-size="10" font-weight="800">E</text>
          <text x="418" y="166" text-anchor="middle" fill="var(--text-muted)" font-size="9.2">Single (min) · Complete (max) · UPGMA ponderado</text>
        </svg>
      `,
      coreSteps: [
        R`<strong>K-Means (Semillas y Asignación):</strong> Tomar $k$ semillas dadas (o aplicar heurística $\bar{X} \to s_1 \to s_2$) y asignar cada punto al centroide con menor distancia euclídea.`,
        R`<strong>K-Means (Centroides y Parada):</strong> Recalcular la media por clúster (o moda en <em>k-modes</em>) y repetir hasta lograr una iteración sin reasignaciones.`,
        R`<strong>Jerárquico (Matriz y Fusión):</strong> Partir de la matriz euclídea (triangular inferior), buscar el par con menor distancia y unirlo en un nuevo clúster.`,
        R`<strong>Jerárquico (Recálculo y Árbol):</strong> Actualizar distancias según <em>Single Link</em> ($\min$), <em>Complete Link</em> ($\max$) o <em>Average Link</em> ponderado hasta completar el dendrograma.`
      ],
      variants: [
        {
          name: "Heurística K-Means (sin semillas)",
          badge: "Slide 18 / Guía 02",
          formula: R`$s_1 = \arg\max d(x, \bar{X})$, $s_2 = \arg\max d(x, s_1)$`,
          detail: R`Primero calcular la media $\bar{X}$ de todo el dataset; $s_1$ es el más lejano a $\bar{X}$, $s_2$ el más lejano a $s_1$, $s_3$ el más lejano a $s_2$. Para datos categóricos, usar <strong>k-modes</strong> (moda por atributo).`
        },
        {
          name: "Single Link vs Complete Link",
          badge: "Jerárquico",
          formula: R`Single: $\min\{d(u,v)\}$ · Complete: $\max\{d(u,v)\}$`,
          detail: R`Se evalúa siempre mirando todos los elementos entre ambos clústeres en la matriz original.`
        },
        {
          name: "Average Link (UPGMA ponderado)",
          badge: "Trampa clásica",
          formula: R`$d(C_1 \cup C_2, X) = \frac{|C_1|\cdot d(C_1, X) + |C_2|\cdot d(C_2, X)}{|C_1| + |C_2|}$`,
          detail: R`¡Nunca hacer $\frac{1}{2}(d_1+d_2)$ si $|C_1| \neq |C_2|$! Ponderar por la cantidad de elementos equivale a promediar todos los pares originales dividido $|C_1 \cup C_2|\cdot|X|$.`
        }
      ],
      traps: [
        R`En Average Link, promediar $\frac{1}{2}[d(AB, X) + d(C, X)]$ sin ponderar $|AB|=2$ y $|C|=1$: debe ser $\frac{2\cdot d(AB,X) + 1\cdot d(C,X)}{3}$.`,
        R`En K-Means, detenerse al finalizar la iteración 1 cuando recién cambiaron los centroides sin hacer la iteración de verificación sin reasignación.`
      ],
      examples: [
        {
          id: "ex_clust_7a",
          title: "Ejemplo 7A — K-Means completo + Heurística si no dan semillas (Guía Final pág. 6–7)",
          meta: "Fuente: Guía Final Clustering & Slide 18",
          problemHtml: R`
            Instancias en $\mathbb{R}^2$: $I_1=(1,1), I_2=(3,4), I_3=(2,3), I_4=(3,5), I_5=(4,2)$ ($k = 2$ clústeres). Semillas iniciales dadas: $C_1 = I_1 = (1,1)$ y $C_2 = I_2 = (3,4)$. (También se explica qué hacer si no las dieran).
          `,
          steps: [
            {
              title: "Heurística de Cátedra si NO te dan las semillas (recordatorio)",
              paperComment: "Si el problema no especifica centroides iniciales, calculo primero la media global y elijo semillas máximamente separadas.",
              mathHtml: R`
                En este ejemplo ya te dan $C_1=I_1, C_2=I_2$. Pero si no te las dieran:
                <br>Media global $\bar{X} = \left(\frac{1+3+2+3+4}{5}, \frac{1+4+3+5+2}{5}\right) = (2.6, 3.0) \implies s_1 = \arg\max d(I_j, \bar{X}) \implies s_2 = \arg\max d(I_j, s_1)$.
              `,
              note: "Nunca elijas semillas al azar en el examen si el enunciado omitió las iniciales: usá esta heurística oficial (Slide 18 / Guía 02)."
            },
            {
              title: "Iteración 1: calcular distancias euclídeas y asignar clústeres",
              paperComment: "Calculo la distancia de cada instancia a los centroides iniciales y la asigno al grupo del centroide más cercano.",
              mathHtml: R`
                <div class="mc-table-wrap">
                  <table class="pe-data-table">
                    <thead><tr><th>Instancia</th><th>$d(\cdot, C_1=(1,1))$</th><th>$d(\cdot, C_2=(3,4))$</th><th>Clúster asignado</th></tr></thead>
                    <tbody>
                      <tr class="mc-row-highlight"><td>$I_1=(1,1)$</td><td><strong>0.00</strong></td><td>3.61</td><td><strong>$C_1$</strong></td></tr>
                      <tr><td>$I_2=(3,4)$</td><td>3.61</td><td><strong>0.00</strong></td><td><strong>$C_2$</strong></td></tr>
                      <tr><td>$I_3=(2,3)$</td><td>2.24</td><td><strong>1.41</strong></td><td><strong>$C_2$</strong></td></tr>
                      <tr><td>$I_4=(3,5)$</td><td>4.47</td><td><strong>1.00</strong></td><td><strong>$C_2$</strong></td></tr>
                      <tr><td>$I_5=(4,2)$</td><td>3.16</td><td><strong>2.24</strong></td><td><strong>$C_2$</strong></td></tr>
                    </tbody>
                  </table>
                </div>
              `,
              note: "En esta primera pasada quedaron: C₁ = {I₁} y C₂ = {I₂, I₃, I₄, I₅}."
            },
            {
              title: "Recalcular los nuevos centroides promediando coordenadas",
              paperComment: "Calculo la media componente a componente de las instancias agrupadas en cada clúster para mover los centroides.",
              mathHtml: R`
                <ul>
                  <li><strong>$C_1 = \{I_1\}$:</strong> $m_1 = (1, 1)$ (único miembro).</li>
                  <li><strong>$C_2 = \{I_2, I_3, I_4, I_5\}$:</strong> $m_2 = \left(\frac{3+2+3+4}{4},\; \frac{4+3+5+2}{4}\right) = \mathbf{(3.0,\; 3.5)}$.</li>
                </ul>
              `,
              visualHtml: `
                <svg viewBox="0 0 460 120" role="img" aria-label="Desplazamiento del centroide C2 hacia (3.0, 3.5) en Iteración 1">
                  <circle cx="80" cy="92" r="16" fill="none" stroke="#10b981" stroke-dasharray="4 3" stroke-width="1.5"/>
                  <circle cx="80" cy="92" r="5" fill="#10b981"/><text x="98" y="96" fill="#10b981" font-size="9.5" font-weight="800">I₁ = C₁(1,1)</text>
                  <ellipse cx="290" cy="52" rx="95" ry="42" fill="none" stroke="var(--primary)" stroke-dasharray="4 3" stroke-width="1.5"/>
                  <circle cx="285" cy="40" r="4.5" fill="var(--primary)"/><text x="275" y="32" fill="var(--text-muted)" font-size="8.5">I₂(3,4) viejo C₂</text>
                  <circle cx="220" cy="60" r="4.5" fill="var(--primary)"/><text x="200" y="64" fill="var(--text-muted)" font-size="8.5">I₃</text>
                  <circle cx="285" cy="22" r="4.5" fill="var(--primary)"/><text x="300" y="25" fill="var(--text-muted)" font-size="8.5">I₄</text>
                  <circle cx="355" cy="78" r="4.5" fill="var(--primary)"/><text x="366" y="82" fill="var(--text-muted)" font-size="8.5">I₅</text>
                  <line x1="285" y1="40" x2="285" y2="54" stroke="var(--warning)" stroke-width="2"/>
                  <polygon points="285,48 291,55 285,62 279,55" fill="var(--warning)"/><text x="300" y="59" fill="var(--warning)" font-size="9.5" font-weight="800">Nuevo m₂=(3, 3.5)</text>
                </svg>
              `,
              note: "Si los datos fueran atributos discretos/categóricos (ej. Rojo/Azul), se usa k-modes reemplazando la media aritmética por la moda."
            },
            {
              title: "Iteración 2: verificar reasignaciones y criterio de parada",
              paperComment: "Recalculo distancias contra los nuevos centroides (1,1) y (3, 3.5) para comprobar si algún punto cambia de grupo.",
              mathHtml: R`
                Al recalcular: $I_1$ sigue más cerca de $(1,1)$ que de $(3, 3.5)$ ($0 &lt; 3.20$); $I_2, I_3, I_4, I_5$ siguen todos más cerca de $(3, 3.5)$ que de $(1,1)$.
                <br><strong>Cero reasignaciones</strong> $\implies$ los centroides no vuelven a cambiar y el algoritmo converge.
              `,
              note: "No detengas el ejercicio al calcular los nuevos centroides en Iteración 1: siempre hacé una última iteración de verificación."
            }
          ],
          conclusionHtml: R`Convergencia en 2 iteraciones: <strong>$C_1 = \{I_1\}$ centroide $(1,1)$</strong> · <strong>$C_2 = \{I_2, I_3, I_4, I_5\}$ centroide $(3, 3.5)$</strong>.`
        },
        {
          id: "ex_clust_7b",
          title: "Ejemplo 7B — Jerárquico: Complete Link vs Average Link UPGMA (Guía pág. 3–4)",
          meta: "Fuente: Guía Jerárquico",
          problemHtml: R`
            Dada la matriz inicial de distancias entre $5$ elementos $\{A, B, C, D, E\}$ donde $d(C,E)=2$, $d(A,C)=3, d(A,E)=11$, $d(B,D)=5$, $d(B,C)=7, d(B,E)=10$, $d(D,C)=4, d(D,E)=8$, $d(A,B)=9, d(A,D)=6$. Construir el dendrograma por <strong>Complete Link</strong> y por <strong>Average Link (UPGMA)</strong>.
          `,
          steps: [
            {
              title: "Paso 1: Buscar menor distancia inicial y unir CE",
              paperComment: "Busco la mínima distancia en la matriz inicial y fusiono el primer par de elementos.",
              mathHtml: R`
                El mínimo global de la matriz $5\times 5$ es $d(C, E) = \mathbf{2} \implies$ primera fusión: <code>CE</code> a altura <strong>2</strong>.
              `,
              note: "A partir de acá reducimos la matriz de 5×5 a 4×4 sobre {A, B, CE, D}."
            },
            {
              title: "Paso 2: Comparar Complete Link (max) vs Average Link tras unir CE",
              paperComment: "Recalculo las distancias del nuevo clúster CE hacia A, B y D según Complete Link y Average Link.",
              mathHtml: R`
                <div class="mc-table-wrap">
                  <table class="pe-data-table">
                    <thead><tr><th>Par con <code>CE</code></th><th>Originales</th><th>Complete Link (<code>max</code>)</th><th>Average Link (<code>prom</code>)</th></tr></thead>
                    <tbody>
                      <tr><td>$(CE, A)$</td><td>$3,\; 11$</td><td>$\max(3, 11) = 11$</td><td>$(3+11)/2 = 7.0$</td></tr>
                      <tr><td>$(CE, B)$</td><td>$7,\; 10$</td><td>$\max(7, 10) = 10$</td><td>$(7+10)/2 = 8.5$</td></tr>
                      <tr><td>$(CE, D)$</td><td>$4,\; 8$</td><td>$\max(4, 8) = 8$</td><td>$(4+8)/2 = \mathbf{6.0}$</td></tr>
                    </tbody>
                  </table>
                </div>
                En ambos métodos el mínimo siguiente de la matriz $4\times 4$ sigue siendo $d(B, D) = \mathbf{5} \implies$ segunda fusión: <code>BD</code> a altura <strong>5</strong>.
              `,
              note: "Observá cómo ya en la fusión CE se empiezan a separar los valores de la matriz entre Complete Link y Average Link."
            },
            {
              title: "Paso 3: Trampa UPGMA en fusiones de distinto tamaño (|C₁| ≠ |C₂|)",
              paperComment: "Recalculo distancias en matriz reducida ponderando por el tamaño |C| de cada clúster al aplicar Average Link.",
              mathHtml: R`
                <ul>
                  <li><strong>Complete Link (<code>max</code>):</strong> $d(BD, A) = \max(9, 6) = \mathbf{9}$ y $d(BD, CE) = \max(7, 10, 4, 8) = 10 \implies$ une <code>ABD</code> a nivel <strong>9</strong> y por último <code>(ABD)(CE)</code> a nivel <strong>11</strong>.</li>
                  <li><strong>Average Link UPGMA:</strong>
                    <br>$d(BD, A) = \frac{9+6}{2} = 7.5$ · $d(BD, CE) = \frac{1\cdot d(B,CE) + 1\cdot d(D,CE)}{2} = \frac{8.5 + 6.0}{2} = \mathbf{7.25}$ (promedio de las 4 distancias originales).
                    <br>Mínimo en <code>{A, BD, CE}</code>: $d(A, CE) = \mathbf{7.0} \implies$ une <code>ACE</code> a nivel <strong>7</strong>!
                    <br><strong>¡Fusión final <code>ACE</code> ($|C_1|=3$) o vs tamaños ponderados <code>(A + CE)</code> con <code>BD</code>:</strong>
                    $$d(ACE, BD) = \frac{|A|\cdot d(A,BD) + |CE|\cdot d(CE,BD)}{|A| + |CE|} = \frac{1\cdot 7.5 + 2\cdot 7.25}{1 + 2} = \frac{22.0}{3} = \mathbf{7.33}$$</li>
                </ul>
              `,
              note: "¡Acá cae el 80% de los alumnos! Si hacías ½(7.5 + 7.25) = 7.375 daba MAL porque |ACE|=3 tiene |A|=1 y |CE|=2 (no pesan igual)."
            },
            {
              title: "Paso 4: Dibujar ambos dendrogramas proporcionales",
              paperComment: "Trazo las ramas uniendo cada par de clústeres exactamente a la altura de fusión obtenida en cada paso.",
              mathHtml: R`
                Mirá cómo cambia la topología entre estrategias: Complete Link agrupa primero <code>ABD</code> (altura 9), mientras Average Link agrupa primero <code>ACE</code> (altura 7.0).
              `,
              visualHtml: `
                <pre class="mc-pre-dendro">Complete Link:                     Average Link (UPGMA):
11 |--------(ABD)(CE)--------|     7.33 |-------(ACE)(BD)-------|
 9 |---(ABD)---|             |      7.0 |---(ACE)---|           |
 5 |      |--BD--|           |      5.0 |           |     |--BD-|
 2 |      |      |      |-CE-|      2.0 |      |-CE-|     |     |
   A      B      D      C    E          A      C    E     B     D</pre>
              `,
              note: "Indicá siempre sobre el eje vertical los niveles exactos de fusión (2, 5, 9, 11 o 2, 5, 7, 7.33)."
            }
          ],
          conclusionHtml: R`Complete Link: fusiones a niveles <strong>2 → 5 → 9 → 11</strong> · Average Link (UPGMA): fusiones a niveles <strong>2 → 5 → 7.0 → 7.33</strong>.`
        }
      ]
    },
    {
      id: "HOPFIELD",
      labKey: "HOPFIELD",
      order: 8,
      badge: "HOP",
      inP2Scope: false,
      scopeLabel: "📚 Complemento Teórico / Finales (no entra en P2 16/11)",
      title: "8. Redes de Hopfield Autoasociativas",
      subtitle: R`Complemento del banco teórico / finales: memoria bipolar $\{-1, +1\}^N$ con $w_{ii} = 0$.`,
      svgDiagram: `
        <svg viewBox="0 0 560 150" class="mc-svg-diagram" role="img" aria-label="Regla Hebbiana y conservación de estado en Hopfield">
          <rect x="12" y="14" width="536" height="122" rx="10" fill="var(--bg-card)" stroke="var(--border-color)" stroke-width="1.5"/>
          <text x="280" y="36" text-anchor="middle" fill="var(--text-main)" font-size="11" font-weight="800">HOPFIELD DISCRETA — MATRIZ SIMÉTRICA SIN AUTOCONEXIÓN</text>
          <text x="150" y="64" text-anchor="middle" fill="var(--primary)" font-size="10.2" font-weight="700">W = Σ Ep · Epᵀ − M · I</text>
          <text x="150" y="84" text-anchor="middle" fill="var(--text-muted)" font-size="9.5">Diagonal principal w_ii = 0 obligatorio</text>
          <text x="150" y="106" text-anchor="middle" fill="var(--text-muted)" font-size="9.5">Capacidad segura ≈ 0.138 · N</text>

          <line x1="286" y1="46" x2="286" y2="122" stroke="var(--border-color)"/>
          <text x="418" y="64" text-anchor="middle" fill="#10b981" font-size="10.2" font-weight="700">net_i = Σ w_ij · s_j</text>
          <text x="418" y="86" text-anchor="middle" fill="var(--text-main)" font-size="9.5">&gt; 0 → +1 · &lt; 0 → −1</text>
          <text x="418" y="108" text-anchor="middle" fill="var(--warning)" font-size="9.8" font-weight="800">⚠️ Si net_i = 0 → CONSERVA s_i(t)</text>
        </svg>
      `,
      coreSteps: [
        R`<strong>1. Codificar en bipolar:</strong> Convertir patrones a $\{-1, +1\}^N$ (nunca <code>0</code>).`,
        R`<strong>2. Matriz Hebbiana:</strong> $W = \sum_{p=1}^P E_p E_p^T$ anulando la diagonal principal ($w_{ii} = 0$).`,
        R`<strong>3. Actualización:</strong> $\text{Net}_i = \sum_{j\neq i} w_{ij} s_j$. Si $\text{Net}_i > 0 \to +1$, si $< 0 \to -1$, y si <code>Net_i = 0</code> <strong>conserva $s_i(t)$</strong>.`
      ],
      variants: [
        {
          name: "Energía de Lyapunov & Mínimos Espurios",
          badge: "Estabilidad",
          formula: R`$E(S) = -\frac{1}{2} \sum_{i}\sum_{j} w_{ij} s_i s_j$`,
          detail: R`La energía nunca crece al evolucionar hacia un punto fijo. Al almacenar $> 0.138 N$ patrones aparecen mínimos espurios.`
        }
      ],
      traps: [
        R`Dejar $w_{ii} \neq 0$ en la diagonal principal o forzar $+1$ cuando $\text{Net}_i = 0$ (debe conservar su estado anterior).`
      ],
      examples: [
        {
          id: "ex_hop_8a",
          title: "Ejemplo 8A — Matriz Hebbiana (w_ii = 0) y empate Net_i = 0",
          meta: "Fuente: Guía Práctica Hopfield",
          problemHtml: R`
            Se desea memorizar el patrón binario <code>[1, 0, 1]</code> en una red de Hopfield de $N=3$ neuronas, y luego evaluar la evolución desde el estado ruidoso $s(t) = [+1,\; -1,\; +1]^T$.
          `,
          steps: [
            {
              title: "Codificar patrón en forma bipolar {-1, +1}",
              paperComment: "Convierto cada componente binaria 0/1 en representación bipolar (−1 / +1).",
              mathHtml: R`
                $$E_1^{\text{bin}} = [1,\; 0,\; 1]^T \quad\longrightarrow\quad E_1 = [+1,\; -1,\; +1]^T$$
              `,
              note: "Hopfield discreta clásica exige trabajar siempre en {-1, +1}; dejar ceros rompe el aprendizaje Hebbiano."
            },
            {
              title: "Construir matriz Hebbiana W = E₁ · E₁ᵀ y anular diagonal w_ii = 0",
              paperComment: "Calculo el producto externo E₁ · E₁ᵀ y anulo todos los elementos de la diagonal principal porque no hay autoconexiones.",
              mathHtml: R`
                $$W = \begin{bmatrix}+1\\-1\\+1\end{bmatrix}\begin{bmatrix}+1 & -1 & +1\end{bmatrix} - I_3 = \begin{bmatrix}\mathbf{0} & -1 & +1\\-1 & \mathbf{0} & -1\\+1 & -1 & \mathbf{0}\end{bmatrix}$$
              `,
              note: "Si hay M patrones guardados, primero sumás E₁E₁ᵀ + E₂E₂ᵀ + … y al final hacés cero toda la diagonal principal."
            },
            {
              title: "Evaluar actualización con regla UTN cuando Net_i = 0",
              paperComment: "Multiplico cada fila de W por s(t) y evalúo la función escalón conservando el estado anterior si Net_i = 0.",
              mathHtml: R`
                Sea una prueba donde la fila 2 de $W$ (ej. con varios patrones) resulta $[+1,\; 0,\; -1]$ sobre $s(t) = [+1,\; -1,\; +1]^T$:
                $$\text{Net}_2 = (+1)(+1) + (0)(-1) + (-1)(+1) = +1 + 0 - 1 = \mathbf{0}$$
                Como $\text{Net}_2 = 0$, la neurona 2 <strong>conserva su estado anterior</strong>: $s_2(t+1) = s_2(t) = \mathbf{-1}$.
              `,
              visualHtml: `
                <svg viewBox="0 0 460 88" role="img" aria-label="Producto fila 2 por vector s(t) dando Net2=0 y conservando estado s2=-1">
                  <rect x="20" y="18" width="165" height="52" rx="6" fill="var(--bg-subtle)" stroke="var(--primary)"/>
                  <text x="102" y="38" text-anchor="middle" fill="var(--primary)" font-size="9.5" font-weight="800">Fila 2 W = [+1, 0, −1]</text>
                  <text x="102" y="56" text-anchor="middle" fill="var(--text-muted)" font-size="8.8">· s(t) = [+1, −1, +1]</text>
                  <text x="220" y="48" text-anchor="middle" fill="var(--text-main)" font-size="13" font-weight="800">→</text>
                  <rect x="250" y="18" width="190" height="52" rx="6" fill="rgba(245,158,11,0.14)" stroke="var(--warning)"/>
                  <text x="345" y="38" text-anchor="middle" fill="var(--warning)" font-size="9.5" font-weight="800">Net₂ = 0 (empate)</text>
                  <text x="345" y="56" text-anchor="middle" fill="var(--text-main)" font-size="9" font-weight="700">s₂(t+1) = s₂(t) = −1 ✓</text>
                </svg>
              `,
              note: "¡Trampa clásica! Cuando Net_i = 0 NO pongas +1 por defecto: dejás s_i(t+1) = s_i(t)."
            }
          ],
          conclusionHtml: R`Matriz simétrica con $w_{ii}=0$, y ante $\text{Net}_2 = 0$ la neurona <strong>conserva $s_2(t+1) = -1$</strong>.`
        }
      ]
    }
  ];

  function normalizeSearchText(str) {
    return String(str || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function findExampleById(exId) {
    for (const m of MACHETE_METHODS) {
      for (const ex of (m.examples || [])) {
        if (ex.id === exId) return ex;
      }
    }
    return null;
  }

  function filterMacheteMethods(query, topicFilter) {
    const tf = topicFilter || "ALL";
    const q = normalizeSearchText(query).trim();
    return MACHETE_METHODS.filter((m) => {
      if (tf === "P2_ONLY" && !m.inP2Scope) return false;
      if (tf !== "ALL" && tf !== "P2_ONLY" && m.id !== tf) return false;
      if (!q) return true;
      const haystack = normalizeSearchText([
        m.title,
        m.subtitle,
        ...(m.coreSteps || []),
        ...(m.variants || []).flatMap((v) => [v.name, v.badge, v.formula, v.detail]),
        ...(m.traps || []),
        ...(m.examples || []).flatMap((ex) => [
          ex.title,
          ex.meta,
          ex.problemHtml,
          ex.conclusionHtml,
          ...(ex.steps || []).flatMap((s) => [s.title, s.paperComment, s.mathHtml, s.note])
        ])
      ].join(" "));
      return haystack.includes(q);
    });
  }

  function renderStepCardHtml(step, idx, total) {
    return `
      <div class="mc-wt-step-card">
        <div class="mc-wt-step-head">
          <span class="mc-wt-badge">Paso ${idx + 1} de ${total}</span>
          <strong>${escapeHtml(step.title)}</strong>
        </div>
        <div class="mc-paper-quote"><strong>💬 En tu hoja escribí:</strong> ${step.paperComment}</div>
        <div class="mc-step-math">${step.mathHtml}</div>
        ${step.visualHtml ? `<div class="mc-step-visual">${step.visualHtml}</div>` : ""}
        <div class="mc-step-note"><strong>💡 Por qué / Atención:</strong> ${step.note}</div>
      </div>
    `;
  }

  function renderExampleBodyHtml(ex, exState) {
    const steps = Array.isArray(ex.steps) ? ex.steps : [];
    const total = steps.length;
    const showAll = Boolean(exState && exState.showAll);
    const stepIdx = Math.max(0, Math.min(Math.max(0, total - 1), (exState && exState.stepIdx) || 0));

    const pillsHtml = steps.map((s, i) => `
      <button type="button" class="mc-wt-pill ${!showAll && i === stepIdx ? "active" : ""}" data-wt-ex="${escapeHtml(ex.id)}" data-wt-jump="${i}" title="${escapeHtml(s.title)}">
        Paso ${i + 1}
      </button>
    `).join("");

    const stepsHtml = showAll
      ? steps.map((s, i) => renderStepCardHtml(s, i, total)).join("")
      : (steps[stepIdx] ? renderStepCardHtml(steps[stepIdx], stepIdx, total) : "");

    const atEnd = showAll || stepIdx === total - 1;

    return `
      <div class="mc-ex-problem">
        <div class="mc-ex-problem-lbl">📋 Enunciado y Datos Iniciales</div>
        <div>${ex.problemHtml}</div>
      </div>

      <div class="mc-wt-bar">
        <div class="mc-wt-nav">
          <button type="button" class="btn btn-outline btn-sm" data-wt-ex="${escapeHtml(ex.id)}" data-wt-act="prev" ${showAll || stepIdx === 0 ? "disabled" : ""}>◀ Anterior</button>
          ${pillsHtml}
          <button type="button" class="btn btn-primary btn-sm" data-wt-ex="${escapeHtml(ex.id)}" data-wt-act="next" ${showAll || stepIdx >= total - 1 ? "disabled" : ""}>Siguiente ▶</button>
        </div>
        <button type="button" class="btn btn-outline btn-sm" data-wt-ex="${escapeHtml(ex.id)}" data-wt-act="toggleAll">
          ${showAll ? "🔎 Paso a paso (1 por vez)" : `👁️ Ver todos (${total} pasos)`}
        </button>
      </div>

      <div class="mc-wt-steps-host">${stepsHtml}</div>

      ${atEnd
        ? `<div class="mc-ex-conclusion"><strong>✅ Respuesta Final de Parcial:</strong> ${ex.conclusionHtml}</div>`
        : `<div class="mc-ex-meta" style="margin-top:0.35rem;">Avanzá con <strong>Siguiente ▶</strong> hasta el Paso ${total} (o tocá <em>Ver todos</em>) para ver el resultado final cerrado.</div>`}
    `;
  }

  function renderMethodCardHtml(m, expandAll, walkStates = {}) {
    const scopeCls = m.inP2Scope ? "mc-scope-p2" : "mc-scope-extra";
    const stepsHtml = (m.coreSteps || []).map((st) => `<li>${st}</li>`).join("");
    const variantsHtml = (m.variants || []).map((v) => `
      <div class="mc-variant-card">
        <div class="mc-variant-head">
          <strong>${escapeHtml(v.name)}</strong>
          <span class="badge">${escapeHtml(v.badge)}</span>
        </div>
        <div class="mc-variant-formula">${v.formula}</div>
        <div class="mc-variant-detail">${v.detail}</div>
      </div>
    `).join("");
    const trapsHtml = (m.traps || []).map((t) => `<li>${t}</li>`).join("");
    const examplesHtml = (m.examples || []).map((ex) => {
      const exState = walkStates[ex.id] || { stepIdx: 0, showAll: false };
      return `
        <details class="mc-example-acc" data-ex-id="${escapeHtml(ex.id)}" ${expandAll ? "open" : ""}>
          <summary class="mc-example-summary">
            <span class="mc-ex-title">📝 ${escapeHtml(ex.title)}</span>
            <span class="mc-ex-meta">${escapeHtml(ex.meta)} · ${(ex.steps || []).length} pasos · <span class="mc-ex-cta">Ver paso a paso ▾</span></span>
          </summary>
          <div class="mc-example-body" id="mc-ex-body-${escapeHtml(ex.id)}">${renderExampleBodyHtml(ex, exState)}</div>
        </details>
      `;
    }).join("");

    return `
      <article class="card mc-method-card" id="mc-card-${escapeHtml(m.id)}">
        <div class="mc-card-head">
          <div>
            <div style="display:flex;align-items:center;gap:0.45rem;flex-wrap:wrap;margin-bottom:0.25rem;">
              <span class="badge badge-topic">${escapeHtml(m.badge)}</span>
              <span class="mc-scope-pill ${scopeCls}">${escapeHtml(m.scopeLabel)}</span>
            </div>
            <h2 class="mc-method-title">${escapeHtml(m.title)}</h2>
            <p class="mc-method-sub">${m.subtitle}</p>
          </div>
          ${m.labKey ? `<button type="button" class="btn btn-outline btn-sm" data-mc-lab="${escapeHtml(m.labKey)}">🛠️ Practicar ${escapeHtml(m.badge)} →</button>` : ""}
        </div>

        <div class="mc-method-top-grid">
          <div class="mc-steps-pane">
            <div class="mc-sec-label">📌 Pasos Clave de Resolución</div>
            <ol class="mc-steps-list">${stepsHtml}</ol>
          </div>
          <div class="mc-diagram-box">
            ${m.svgDiagram}
          </div>
        </div>

        <div class="mc-sec-label" style="margin-top:0.95rem;">🔀 Variantes y Alternativas de Parcial</div>
        <div class="mc-variants-grid">${variantsHtml}</div>

        <div class="mc-trap-box">
          <div class="mc-sec-label" style="color:var(--warning);margin-bottom:0.35rem;">⚠️ Errores Clásicos a Evitar</div>
          <ul class="mc-traps-list">${trapsHtml}</ul>
        </div>

        <div class="mc-examples-wrap">
          <div class="mc-sec-label" style="margin-bottom:0.45rem;">🎓 Ejemplos Resueltos de Cátedra (${(m.examples || []).length}) — clic para expandir</div>
          <div class="mc-examples-list">${examplesHtml}</div>
        </div>
      </article>
    `;
  }

  function mountMacheteView(container, callbacks = {}) {
    if (!container) return;
    const state = {
      topicFilter: callbacks.initialTopic || "P2_ONLY",
      query: "",
      expandAll: false,
      walkStates: {}
    };

    const refreshExampleBody = (exId) => {
      const ex = findExampleById(exId);
      const bodyEl = container.querySelector(`#mc-ex-body-${exId}`);
      if (!ex || !bodyEl) return;
      const exState = state.walkStates[exId] || { stepIdx: 0, showAll: false };
      bodyEl.innerHTML = renderExampleBodyHtml(ex, exState);
      if (typeof callbacks.onRenderMath === "function") {
        callbacks.onRenderMath(bodyEl);
      }
    };

    const renderListOnly = () => {
      const host = container.querySelector("#mc-cards-container");
      const countEl = container.querySelector("#mc-results-count");
      if (!host) return;
      const list = filterMacheteMethods(state.query, state.topicFilter);
      if (countEl) {
        countEl.textContent = `${list.length} método${list.length === 1 ? "" : "s"}`;
      }
      if (list.length === 0) {
        host.innerHTML = `
          <div class="card" style="text-align:center;padding:2rem;">
            <p style="margin:0 0 0.75rem;color:var(--text-muted);">No hay coincidencias para "<strong>${escapeHtml(state.query)}</strong>".</p>
            <button type="button" class="btn btn-outline btn-sm" id="mc-reset-filters">Mostrar todos los métodos</button>
          </div>
        `;
        const resetBtn = host.querySelector("#mc-reset-filters");
        if (resetBtn) {
          resetBtn.addEventListener("click", () => {
            state.topicFilter = "ALL";
            state.query = "";
            renderShell();
          });
        }
        return;
      }

      host.innerHTML = list.map((m) => renderMethodCardHtml(m, state.expandAll, state.walkStates)).join("");
      host.querySelectorAll("[data-mc-lab]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const key = btn.getAttribute("data-mc-lab");
          if (typeof callbacks.onJumpToLab === "function") callbacks.onJumpToLab(key);
        });
      });

      if (typeof callbacks.onRenderMath === "function") {
        callbacks.onRenderMath(host);
      }
    };

    const renderShell = () => {
      const pills = [
        { id: "P2_ONLY", label: "✅ Oficiales 2do Parcial (7)" },
        { id: "ALL", label: "📚 Todos (8)" },
        ...MACHETE_METHODS.map((m) => ({ id: m.id, label: m.badge }))
      ];

      container.innerHTML = `
        <div class="mc-hero-banner card">
          <div class="mc-hero-top">
            <div>
              <div class="mc-scope-pill mc-scope-p2" style="margin-bottom:0.45rem;">⚡ CONSULTA RÁPIDA + EJEMPLOS DE CÁTEDRA</div>
              <h1 style="margin:0 0 0.3rem;font-size:1.45rem;">Machete Maestro — Segundo Parcial IA</h1>
              <p style="margin:0;color:var(--text-muted);font-size:0.9rem;line-height:1.45;">
                Resumen completo y concentrado de cada algoritmo, sus variantes, fórmulas exactas, trampas de parcial y ejemplos resueltos paso a paso con el criterio de la cátedra.
              </p>
            </div>
            <div style="display:flex;gap:0.5rem;flex-wrap:wrap;align-items:center;">
              <button type="button" class="btn btn-outline btn-sm" id="mc-open-print">🖨️ Hoja A4 Imprimible</button>
            </div>
          </div>
          <div class="mc-golden-rule">
            <strong>💡 Regla de Oro en Papel:</strong> al inicio de cada bloque de cálculo, escribí <strong>1 línea breve en palabras propias</strong> explicando qué paso estás ejecutando.
            <span style="color:var(--text-muted);margin-left:0.35rem;">(Alcance 16/11: AG · Naïve Bayes · Perceptrón + MLP · SOM · KNN + Clustering. SVM y Hopfield no entran).</span>
          </div>
        </div>

        <div class="mc-toolbar card">
          <div class="mc-search-row">
            <div class="mc-search-box">
              <input type="text" id="mc-search-input" class="mc-search-input" placeholder="Buscar fórmula, variante o palabra clave (ej. Laplace, complemento, ranking, UPGMA, recta)..." value="${escapeHtml(state.query)}" autocomplete="off" />
              <button type="button" class="btn btn-outline btn-sm" id="mc-search-clear" title="Limpiar búsqueda">✕</button>
            </div>
            <div class="mc-expand-actions">
              <span id="mc-results-count" class="badge" style="background:var(--bg-subtle);color:var(--text-muted);"></span>
              <button type="button" class="btn btn-outline btn-sm" id="mc-expand-all">📂 Expandir ejemplos</button>
              <button type="button" class="btn btn-outline btn-sm" id="mc-collapse-all">📁 Colapsar ejemplos</button>
            </div>
          </div>
          <div class="mc-topic-pills">
            ${pills.map((p) => `<button type="button" class="sb-pill-btn ${state.topicFilter === p.id ? "active" : ""}" data-mc-filter="${escapeHtml(p.id)}">${escapeHtml(p.label)}</button>`).join("")}
          </div>
        </div>

        <div id="mc-cards-container" class="mc-cards-container"></div>
      `;

      const searchInp = container.querySelector("#mc-search-input");
      searchInp.addEventListener("input", (e) => {
        state.query = e.target.value;
        renderListOnly();
      });

      container.querySelector("#mc-search-clear").addEventListener("click", () => {
        state.query = "";
        searchInp.value = "";
        renderListOnly();
        searchInp.focus();
      });

      container.querySelector("#mc-expand-all").addEventListener("click", () => {
        state.expandAll = true;
        container.querySelectorAll(".mc-example-acc").forEach((d) => { d.open = true; });
      });

      container.querySelector("#mc-collapse-all").addEventListener("click", () => {
        state.expandAll = false;
        container.querySelectorAll(".mc-example-acc").forEach((d) => { d.open = false; });
      });

      container.querySelector("#mc-open-print").addEventListener("click", () => {
        if (typeof callbacks.onOpenPrintSheet === "function") callbacks.onOpenPrintSheet();
      });

      container.querySelectorAll("[data-mc-filter]").forEach((btn) => {
        btn.addEventListener("click", () => {
          state.topicFilter = btn.getAttribute("data-mc-filter");
          container.querySelectorAll("[data-mc-filter]").forEach((b) => {
            b.classList.toggle("active", b.getAttribute("data-mc-filter") === state.topicFilter);
          });
          renderListOnly();
        });
      });

      const cardsHost = container.querySelector("#mc-cards-container");
      cardsHost.addEventListener("click", (ev) => {
        const btn = ev.target && ev.target.closest ? ev.target.closest("[data-wt-ex]") : null;
        if (!btn) return;
        const exId = btn.getAttribute("data-wt-ex");
        const ex = findExampleById(exId);
        if (!ex) return;
        const maxIdx = Math.max(0, (ex.steps || []).length - 1);
        const cur = state.walkStates[exId] || { stepIdx: 0, showAll: false };

        if (btn.hasAttribute("data-wt-jump")) {
          cur.showAll = false;
          cur.stepIdx = Math.max(0, Math.min(maxIdx, Number(btn.getAttribute("data-wt-jump")) || 0));
        } else {
          const act = btn.getAttribute("data-wt-act");
          if (act === "prev") {
            cur.showAll = false;
            cur.stepIdx = Math.max(0, cur.stepIdx - 1);
          } else if (act === "next") {
            cur.showAll = false;
            cur.stepIdx = Math.min(maxIdx, cur.stepIdx + 1);
          } else if (act === "toggleAll") {
            cur.showAll = !cur.showAll;
          }
        }
        state.walkStates[exId] = cur;
        refreshExampleBody(exId);
      });

      if (typeof callbacks.onRenderMath === "function") {
        callbacks.onRenderMath(container.querySelector(".mc-hero-banner"));
      }
      renderListOnly();
    };

    renderShell();
  }

  return {
    MACHETE_METHODS,
    filterMacheteMethods,
    mountMacheteView
  };
});
