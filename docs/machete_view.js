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
          bodyHtml: R`
            <p>Aleatorios sorteados: <code>32, 05, 99, 65</code>. Total $\sum f_i = 325$.</p>
            <div class="mc-table-wrap">
              <table class="pe-data-table">
                <thead><tr><th>Indiv</th><th>Aptitud</th><th>Norm ($f_i/325$)</th><th>Ranuras</th><th>Intervalo</th><th>Resultado</th></tr></thead>
                <tbody>
                  <tr><td>$I_0$</td><td>20</td><td>0.0615</td><td>6</td><td><code>00-05</code></td><td><strong>1 copia (<code>05</code>)</strong></td></tr>
                  <tr><td>$I_1$</td><td>10</td><td>0.0308</td><td>3</td><td><code>06-08</code></td><td>—</td></tr>
                  <tr><td>$I_2$</td><td>50</td><td>0.1538</td><td>15</td><td><code>09-23</code></td><td>—</td></tr>
                  <tr><td>$I_3$</td><td>70</td><td>0.2154</td><td>22</td><td><code>24-45</code></td><td><strong>1 copia (<code>32</code>)</strong></td></tr>
                  <tr><td>$I_4$</td><td>80</td><td>0.2462</td><td>25</td><td><code>46-70</code></td><td><strong>1 copia (<code>65</code>)</strong></td></tr>
                  <tr><td>$I_5$</td><td>10</td><td>0.0308</td><td>3</td><td><code>71-73</code></td><td>—</td></tr>
                  <tr><td>$I_6$</td><td>40</td><td>0.1231</td><td>12</td><td><code>74-85</code></td><td>—</td></tr>
                  <tr><td>$I_7$</td><td>30</td><td>0.0923</td><td>9</td><td><code>86-94</code></td><td>—</td></tr>
                  <tr><td>$I_8$</td><td>15</td><td>0.0462</td><td>5</td><td><code>95-99</code></td><td><strong>1 copia (<code>99</code>)</strong></td></tr>
                </tbody>
              </table>
            </div>
            <p><strong>Conclusión:</strong> Seleccionados 4 individuos: <code>{I0, I3, I4, I8}</code>.</p>
          `
        },
        {
          id: "ex_ag_1b",
          title: "Ejemplo 1B — Control de Copias Esperadas (Parcial 2025) y Ranking Lineal",
          meta: "Fuente: Parcial 2025 & Slide 20",
          bodyHtml: R`
            <p><strong>Control de Copias (seleccionar 50% = 4 de 8 individuos, $\sum f = 188 \implies \bar{f} = 23.5$):</strong></p>
            <ol>
              <li>Calculo $c_i = f_i / 23.5$: solo $I_{06}$ ($1.87 \to \lfloor c\rfloor = 1$, dec. <code>0.87</code>) e $I_{07}$ ($1.74 \to \lfloor c\rfloor = 1$, dec. <code>0.74</code>) tienen parte entera $\ge 1$.</li>
              <li>Faltan 2 cupos para llegar a 4 $\implies$ se toman las <strong>2 mayores partes decimales</strong> entre los restantes: $I_{04}$ (<code>0.94</code>) e $I_{03}$ (<code>0.89</code>).</li>
              <li><strong>Resultado:</strong> <code>{I06, I07, I04, I03}</code>. <em>(Si pidiera "ruleta con parte decimal", normalizás las decimales a <code>[00-99]</code>).</em></li>
            </ol>
            <p style="margin-top:0.5rem;"><strong>Ranking Lineal ($n=7, R_{\min}=0$):</strong> ordenados de mejor ($i=1$) a peor ($i=7$), $\text{Copias}(i) = 0 + 2\cdot\frac{(7-i)(1-0)}{6} \implies$ <code>2.00, 1.67, 1.33, 1.00, 0.67, 0.33, 0.00</code>.</p>
          `
        },
        {
          id: "ex_ag_1c",
          title: "Ejemplo 1C — Cruzas Simple, Multipunto y Binomial comparadas",
          meta: "Fuente: Slides 22–25 & Guías 02c/04",
          bodyHtml: R`
            <p>Sean Padre $P = \texttt{00110001}$ y Madre $M = \texttt{10101010}$:</p>
            <ul>
              <li><strong>Cruza Simple en $G_4$ (tras bit 4 desde la izquierda):</strong>
                <ul>
                  <li>Hijo 1 ($\text{cab } P + \text{cola } M$): <code>0011</code><code>1010</code> $= \texttt{00111010}$</li>
                  <li>Hijo 2 clásico ($\text{cab } M + \text{cola } P$): <code>1010</code><code>0001</code> $= \texttt{10100001}$</li>
                  <li>Hijo 2 <strong>por complemento binario</strong> de Hijo 1: <code>1100</code><code>0101</code> $= \texttt{11000101}$</li>
                </ul>
              </li>
              <li><strong>Cruza Multipunto en $G_1, G_4, G_7$:</strong> alterno segmentos tras posiciones 1, 4 y 7:
                <br>Hijo 1: <code>0 | 010 | 000 | 0</code> $\to \texttt{00100000}$ · Hijo 2: <code>1 | 011 | 101 | 1</code> $\to \texttt{10111011}$
              </li>
              <li><strong>Cruza Binomial ($p=0.6 \to \texttt{00-59}$, $m=0.4 \to \texttt{60-99}$, aleatorios <code>[21, 72, 85, 43, 55, 18, 92, 33]</code>):</strong>
                <ul>
                  <li>Elección: <code>P, M, M, P, P, P, M, P</code> $\implies$ <strong>Hijo 1</strong> $= \texttt{00110011}$</li>
                  <li>Hijo 2 (genes no seleccionados): <code>M, P, P, M, M, M, P, M</code> $\implies \texttt{10101000}$</li>
                  <li>Hijo 2 (complemento binario de Hijo 1): invertir <code>00110011</code> $\implies \texttt{11001100}$</li>
                </ul>
              </li>
            </ul>
          `
        },
        {
          id: "ex_ag_1d",
          title: "Ejemplo 1D — Mutación Simple y Temperatura Ascendente / Descendente",
          meta: "Fuente: Guías 03–05",
          bodyHtml: R`
            <ul>
              <li><strong>Simple:</strong> $I_{01} = \texttt{00110011}$ en $G_2$ (2do bit desde la izq.) $\implies \texttt{01110011}$.</li>
              <li><strong>Temperatura Ascendente ($P_m^{\min}=0.02, P_m^{\max}=0.3, \lambda=0.0001$):</strong>
                $P_m(300) = 0.02 + 0.0001 \cdot 300 = 0.05$; en gen 400: $0.02 + 0.0001 \cdot 400 = 0.06$.</li>
              <li><strong>Temperatura Descendente:</strong> $P_m(300) = 0.3 - 0.0001 \cdot 300 = 0.27$ (con piso en $P_m^{\min}$).</li>
            </ul>
          `
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
          bodyHtml: R`
            <p>6 instancias (3 de clase <code>0</code>, 3 de clase <code>1</code>) con atributos $x, y$.</p>
            <ol>
              <li><strong>Parámetros por clase:</strong>
                Clase <code>0</code>: $\mu_x = -6.6, \sigma_x = 1.22$; $\mu_y = -2, \sigma_y = 0.82$.
                Clase <code>1</code>: $\mu_x = -3, \sigma_x = 0.82$; $\mu_y = -8, \sigma_y = 0.82$.</li>
              <li><strong>Evaluar dato nuevo $N = (1, 1)$:</strong>
                <br>$L(C=0) = \frac{1}{2} \cdot \frac{1}{1.22\sqrt{2\pi}}e^{-\frac{(1+6.6)^2}{2(1.22)^2}} \cdot \frac{1}{0.82\sqrt{2\pi}}e^{-\frac{(1+2)^2}{2(0.82)^2}} = 3.67 \times 10^{-3}$
                <br>$L(C=1) = 5.57 \times 10^{-33}$</li>
              <li><strong>Decisión:</strong> $3.67 \times 10^{-3} \gg 5.57 \times 10^{-33} \implies$ <strong>Clasifica como Clase 0</strong>.</li>
            </ol>
          `
        },
        {
          id: "ex_nb_2b",
          title: "Ejemplo 2B — Histogramas / Bins y Corrección por Bin Vacío (Guía 05)",
          meta: "Fuente: guia_practica_naive_bayes.pdf pág. 4–5",
          bodyHtml: R`
            <p>Clases: $T_1 (30\%, N_1=37500)$, $T_2 (20\%, N_2=25000)$, $T_3 (50\%, N_3=62500)$. Instancia $I_{n1} = (v_1=2.8, v_2=3.5)$ cae en bins $(2, 5]$ y $(-2, 5]$:</p>
            <ul>
              <li>$L(T_1) = 0.30 \cdot \frac{5500}{37500} \cdot \frac{5000}{37500} = 5.87 \times 10^{-3}$</li>
              <li>$L(T_2) = 0.20 \cdot \frac{5000}{25000} \cdot \frac{9000}{25000} = 0.0144$</li>
              <li>$L(T_3) = 0.50 \cdot \frac{10000}{62500} \cdot \frac{15000}{62500} = \mathbf{0.0192} \leftarrow \text{Gana } T_3$</li>
            </ul>
            <p><strong>Nota Laplace:</strong> Si un atributo tiene $B=6$ bins y una clase tiene $0$ ejemplos en ese bin, reemplazar $\frac{0}{N_k}$ por $\frac{0+1}{N_k+6}$ (y también se puede suavizar todo el atributo para mantener coherencia).</p>
          `
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
          bodyHtml: R`
            <p>Clase <code>1</code>: $(-3,-1), (-3.5,-0.2), (-2,-0.5)$. Clase <code>0</code>: $(-1,-1), (-2,-2), (-2,-3)$. Dado $\theta = -1.3$.</p>
            <ol>
              <li>Recta con cortes $A = (-1, 0)$ y $B = (0, 1)$. Con $\theta = -1.3$ ($w_0 = 1.3$):
                en $B$: $\frac{-1.3}{w_2} = 1 \implies w_2 = -1.3$; en $A$: $-\frac{w_1}{-1.3}(-1) + 1 = 0 \implies w_1 = 1.3$.</li>
              <li><strong>Verificación:</strong> en $(-3, -1)$ ($S_d = 1$): $\text{Net} = 1.3 + (-3)(1.3) + (-1)(-1.3) = -1.3 \implies S_o = 0 \implies E = 1 \neq 0$ (el semiplano quedó al revés).</li>
              <li><strong>Invierto el signo de $\theta$:</strong> tomo $\theta = +1.3 \implies w_0 = -1.3, w_1 = -1.3, w_2 = +1.3$.</li>
              <li><strong>Reverificación:</strong> en $(-3, -1)$, $\text{Net} = -1.3 + (-3)(-1.3) + (-1)(1.3) = +1.3 \ge 0 \implies S_o = 1 \implies E = 0$ en todos.</li>
            </ol>
          `
        },
        {
          id: "ex_perc_3b",
          title: "Ejemplo 3B — Método Iterativo: patrón con error vs sin error",
          meta: "Fuente: Guía 01.1 pág. 3",
          bodyHtml: R`
            <p>Pesos iniciales: $w_0 = 0.4, w_1 = 0.2, w_2 = 0.1, \alpha = 0.5$.</p>
            <ul>
              <li><strong>Patrón $P_1 = (1, 1, 2)$ con $S_d = 0$:</strong>
                $\text{Net} = 1(0.4) + 1(0.2) + 2(0.1) = 0.8 \ge 0 \implies S_o = 1 \implies E = 0 - 1 = -1 \neq 0$.
                <br><strong>Actualizo todos:</strong> $w_0 = 0.4 + 0.5(-1)(1) = -0.1$ · $w_1 = 0.2 + 0.5(-1)(1) = -0.3$ · $w_2 = 0.1 + 0.5(-1)(2) = -0.9$.</li>
              <li><strong>Patrón $P_2 = (1, 3, 2)$ con $S_d = 0$:</strong>
                $\text{Net} = -0.1 + 3(-0.3) + 2(-0.9) = -2.8 < 0 \implies S_o = 0 \implies E = 0$ (<strong>no actualizo pesos</strong>).</li>
            </ul>
          `
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
          title: "Ejemplo 4A — Propagación sigmoidal completa (Guía 01.1 pág. 1–2)",
          meta: "Fuente: guia_practica_mlp.pdf",
          bodyHtml: R`
            <p>Entradas $x_1 = 2, x_2 = 3$; deseada $S_d = 1$; $\alpha = 0.5$. Ocultas <code>1, 2</code> y Salida <code>3</code> (todas sigmoidales). Pesos iniciales: $w_{11}=0.4, w_{12}=0.5, w_{21}=0.6, w_{22}=0.8, w_{31}=0.7, w_{32}=0.2$.</p>
            <ol>
              <li><strong>Forward:</strong>
                <br>$\text{Net}_1 = 0.4(2) + 0.5(3) = 2.3 \implies y_1 = \frac{1}{1+e^{-2.3}} = 0.908$, $f'(\text{Net}_1) = 0.908(1-0.908) = 0.083$.
                <br>$\text{Net}_2 = 0.6(2) + 0.8(3) = 3.6 \implies y_2 = 0.973$, $f'(\text{Net}_2) = 0.026$.
                <br>$\text{Net}_3 = 0.7(0.908) + 0.2(0.973) = 0.830 \implies y_3 = 0.696$, $f'(\text{Net}_3) = 0.211$.</li>
              <li><strong>Retropropagación ($\delta$):</strong>
                <br>Salida: $\delta_3 = (1 - 0.696)\cdot 0.211 = 0.064$.
                <br>Ocultas: $\delta_1 = (0.7\cdot 0.064)\cdot 0.083 = 0.0037$; $\;\delta_2 = (0.2\cdot 0.064)\cdot 0.026 = 0.00033$.</li>
              <li><strong>Actualización:</strong>
                <br>$w_{31}(t+1) = 0.7 + 0.5(0.064)(0.908) = \mathbf{0.729}$.
                <br>$w_{11}(t+1) = 0.4 + 0.5(0.0037)(2) = \mathbf{0.4037}$.</li>
            </ol>
          `
        },
        {
          id: "ex_mlp_4b",
          title: "Ejemplo 4B — Criterio de Parada por Early Stopping (Guía 02)",
          meta: "Fuente: Guía 02 MLP",
          bodyHtml: R`
            <p>En tabla de épocas donde el Error de Entrenamiento baja monótonamente y el Error de Validación evoluciona: <code>2.452 → 0.588 → 0.521 → 0.306 → 0.249</code> (en $i_{15}$) y sube a <code>0.989</code> (en $i_{16}$), <strong>se detiene el entrenamiento antes de ese quiebre (en el mínimo $i_{15}$)</strong> para evitar sobreajuste (overfitting).</p>
          `
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
          bodyHtml: R`
            <p>Dados $W_1 = [0.7, -0.6]^T$, $W_2 = [-0.3, 0.4]^T$, $\alpha = 1$, patrón $P_1 = [0.17, 0.86]^T$, y $h = \frac{1}{1 + \text{dist}(W_i, W_{j^*})}$.</p>
            <ol>
              <li><strong>Competencia:</strong>
                <br>$d(P_1, W_1) = \sqrt{(0.17 - 0.7)^2 + (0.86 + 0.6)^2} = 1.553$
                <br>$d(P_1, W_2) = \sqrt{(0.17 + 0.3)^2 + (0.86 - 0.4)^2} = \mathbf{0.658} \leftarrow \text{Ganadora } W_2$</li>
              <li><strong>Vecindad:</strong> $h(W_2, W_2) = 1$. Para la vecina $W_1$: $\text{dist}(W_1, W_2) = \sqrt{(0.7+0.3)^2 + (-0.6-0.4)^2} = \sqrt{2} = 1.414 \implies h(W_1, W_2) = \frac{1}{1+1.414} = 0.414$.</li>
              <li><strong>Actualización:</strong>
                <br>$w_{21}(t+1) = -0.3 + 1(1)(0.17 - (-0.3)) = \mathbf{0.17}$ · $w_{22}(t+1) = 0.4 + 1(1)(0.86 - 0.4) = \mathbf{0.86}$.
                <br>$w_{11}(t+1) = 0.7 + 1(0.414)(0.17 - 0.7) = \mathbf{0.480}$ · $w_{12}(t+1) = -0.6 + 1(0.414)(0.86 + 0.6) = \mathbf{0.004}$.</li>
            </ol>
            <p><em>Nota: si la consigna fuera con <strong>vecindad nula</strong>, solo actualizás $W_2$ y dejás $W_1 = [0.7, -0.6]^T$ intacto.</em></p>
          `
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
          bodyHtml: R`
            <p>Para $N=(1.2, 1.3, 1.4)$ y $k=3$, los 3 vecinos más cercanos son:</p>
            <ol>
              <li>$P_8$ (Clase 2): $d = 2.624 \implies \omega = 1/2.624^2 = 0.145$</li>
              <li>$P_1$ (Clase 1): $d = 3.300 \implies \omega = 1/3.300^2 = 0.092$</li>
              <li>$P_2$ (Clase 1): $d = 4.784 \implies \omega = 1/4.784^2 = 0.044$</li>
            </ol>
            <p><strong>Suma ponderada:</strong> Clase 1 $= 0.092 + 0.044 = 0.136$ · Clase 2 $= \mathbf{0.145} \implies$ <strong>Gana Clase 2</strong> <em>(por mayoría simple habría ganado Clase 1 por 2 votos vs 1).</em></p>
          `
        },
        {
          id: "ex_knn_6b",
          title: "Ejemplo 6B — Tabla Leave-One-Out para k óptimo (Guía 02 pág. 7)",
          meta: "Fuente: Guía 02 KNN",
          bodyHtml: R`
            <p>Se evalúa cada instancia $P_1 \dots P_6$ dejando fuera a sí misma frente a las 5 restantes:</p>
            <div class="mc-table-wrap">
              <table class="pe-data-table">
                <thead><tr><th>$k$</th><th>$P_1$</th><th>$P_2$</th><th>$P_3$</th><th>$P_4$</th><th>$P_5$</th><th>$P_6$</th><th>Aciertos $X_k$</th></tr></thead>
                <tbody>
                  <tr><td><strong>$k=1$</strong></td><td>acierta</td><td>acierta</td><td>acierta</td><td>acierta</td><td>acierta</td><td>acierta</td><td><strong>6 (óptimo)</strong></td></tr>
                  <tr><td>$k=4$</td><td>falla</td><td>falla</td><td>falla</td><td>falla</td><td>falla</td><td>falla</td><td>0</td></tr>
                </tbody>
              </table>
            </div>
          `
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
          title: "Ejemplo 7A — K-Means completo hasta convergencia (Guía Final pág. 6–7)",
          meta: "Fuente: Guía Final Clustering",
          bodyHtml: R`
            <p>Instancias: $I_1=(1,1), I_2=(3,4), I_3=(2,3), I_4=(3,5), I_5=(4,2)$. Semillas: $C_1 = I_1=(1,1)$, $C_2 = I_2=(3,4)$.</p>
            <ol>
              <li><strong>Iteración 1 (distancias):</strong> $I_1(0, 3.61)\to C_1$; $I_2(3.61, 0)\to C_2$; $I_3(2.24, 1.41)\to C_2$; $I_4(4.47, 1.00)\to C_2$; $I_5(3.16, 2.24)\to C_2$.</li>
              <li><strong>Nuevos centroides:</strong> $C_1=\{I_1\}\implies(1,1)$; $C_2=\{I_2,I_3,I_4,I_5\}\implies\left(\frac{3+2+3+4}{4}, \frac{4+3+5+2}{4}\right)=(3, 3.5)$.</li>
              <li><strong>Iteración 2:</strong> Todas las instancias mantienen su mismo clúster $\implies$ <strong>sin reasignaciones, finaliza</strong>.</li>
            </ol>
          `
        },
        {
          id: "ex_clust_7b",
          title: "Ejemplo 7B — Jerárquico: Complete Link vs Average Link UPGMA (Guía pág. 3–4)",
          meta: "Fuente: Guía Jerárquico",
          bodyHtml: R`
            <p>Matriz inicial ($A, B, C, D, E$): menor distancia $d(C, E) = 2 \implies$ fusiono <code>CE</code>.</p>
            <ul>
              <li><strong>Complete Link (<code>max</code>):</strong>
                $d(CE,A)=\max(3,11)=11$, $d(CE,B)=\max(7,10)=10$, $d(CE,D)=\max(4,8)=8$. Mínimo siguiente: $d(B,D)=5 \to BD$. Luego $d(BD,A)=\max(9,6)=9$ y $d(BD,CE)=10 \implies$ fusiono <code>ABD</code> (altura 9) y finalmente <code>(ABD)(CE)</code> a altura <strong>11</strong>.</li>
              <li><strong>Average Link ponderado (UPGMA):</strong>
                $d(CE,A)=\frac{3+11}{2}=7$, $d(CE,B)=8.5$, $d(CE,D)=6$. Luego $d(B,D)=5 \to BD$.
                $d(BD,A)=7.5$; $d(BD,CE)=\frac{8.5+6}{2}=7.25$.
                Siguiente mínimo: $d(A,CE)=7 \to ACE$.
                Última fusión $(ACE)(BD)$: $\frac{1\cdot 7.5 + 2\cdot 7.25}{1+2} = \mathbf{7.33}$.</li>
            </ul>
            <pre class="mc-pre-dendro">11  |-------------(ABD)(CE)-------------|
 9  |------(ABD)------|               |
 5  |         |---(BD)--|             |
 2  |         |         |        |---(CE)---|
    A         B         D        C          E</pre>
          `
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
          title: "Ejemplo 8A — Peso diagonal cero y empate en Net_i = 0",
          meta: "Fuente: Guía Práctica Hopfield",
          bodyHtml: R`
            <p>Si el estado actual es $s(t) = [+1, -1, +1]$ y la fila 2 de $W$ es $[+1, 0, -1]$, entonces $\text{Net}_2 = (+1)(+1) + 0(-1) + (-1)(+1) = 0$. Como dio <code>0</code>, la neurona 2 <strong>mantiene $s_2(t+1) = -1$</strong>.</p>
          `
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
        ...(m.examples || []).flatMap((ex) => [ex.title, ex.meta, ex.bodyHtml])
      ].join(" "));
      return haystack.includes(q);
    });
  }

  function renderMethodCardHtml(m, expandAll) {
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
    const examplesHtml = (m.examples || []).map((ex) => `
      <details class="mc-example-acc" ${expandAll ? "open" : ""}>
        <summary class="mc-example-summary">
          <span class="mc-ex-title">📝 ${escapeHtml(ex.title)}</span>
          <span class="mc-ex-meta">${escapeHtml(ex.meta)} · <span class="mc-ex-cta">Ver desarrollo ▾</span></span>
        </summary>
        <div class="mc-example-body">${ex.bodyHtml}</div>
      </details>
    `).join("");

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
      expandAll: false
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

      host.innerHTML = list.map((m) => renderMethodCardHtml(m, state.expandAll)).join("");
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
