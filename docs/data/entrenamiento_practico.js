/**
 * Banco de Entrenamiento Práctico Guiado — Inteligencia Artificial UTN FRRe
 * MATERIAL 100% DE PRÁCTICA Y APOYO DE RESOLUCIÓN (NO CONTIENE PREGUNTAS DE PARCIAL/MOODLE).
 * Construido iterativamente tema por tema.
 */

window.ENTRENAMIENTO_PRACTICO = {
  version: "1.0",
  roadmap: [
    { id: "MLP_PERCEPTRON", nombre: "MLP, Perceptrón y ADALINE", estado: "completo" },
    { id: "ALGORITMOS_GENETICOS", nombre: "Algoritmos Genéticos", estado: "completo" },
    { id: "NAIVE_BAYES", nombre: "Naïve Bayes (Histogramas y Normal)", estado: "completo" },
    { id: "HOPFIELD", nombre: "Redes de Hopfield", estado: "completo" },
    { id: "SOM", nombre: "Mapas Auto-organizados (SOM)", estado: "completo" },
    { id: "KNN", nombre: "K-Nearest Neighbors y LOOCV", estado: "completo" },
    { id: "CLUSTERING", nombre: "Clustering y K-Means", estado: "completo" }
  ],
  temas: [
    {
      id: "MLP_PERCEPTRON",
      nombre: "Perceptrón Simple, ADALINE y Redes MLP (Backpropagation)",
      badge: "MLP & Perceptrón",
      icono: "🧠",
      ponderacion: "25% – 30% del Parcial Práctico",
      referenciaCatedra: "Guías Prácticas Perceptrón Simple y MLP · Parciales 2015, 2019 (CIN), 2020/2021, 2023 y 19/11/2025",
      referenciaLinks: [
        { label: "guia_practica_mlp.pdf", path: "MODELOS_ORIGINALES/4_GUIAS_PRACTICAS_CATEDRA/guia_practica_mlp.pdf", kind: "pdf" },
        { label: "guia_practica_perceptron_simple.pdf", path: "MODELOS_ORIGINALES/4_GUIAS_PRACTICAS_CATEDRA/guia_practica_perceptron_simple.pdf", kind: "pdf" },
        { label: "hoja_de_formulas_segundo_parcial.pdf", path: "MODELOS_ORIGINALES/4_GUIAS_PRACTICAS_CATEDRA/hoja_de_formulas_segundo_parcial.pdf", kind: "pdf" },
        { label: "parcial2_2025_11_19_oficial.pdf", path: "MODELOS_ORIGINALES/1_PARCIALES_2DO_PARCIAL/parcial2_2025_11_19_oficial.pdf", kind: "pdf" },
        { label: "03_mlp_backpropagation.md", path: "GUIAS_PASO_A_PASO/03_mlp_backpropagation.md", kind: "md" }
      ],
      tiempoSugerido: "25 - 30 min en hoja",
      objetivo: "Seguir en papel el algoritmo de 6/8 pasos de Backpropagation sin confundir neuronas lineales vs. sigmoidales, justificar el criterio de parada (EG y Early Stopping), aplicar el término de momento y verificar signos en Perceptrón analítico.",
      items: [
        {
          id: "PRAC-MLP-01",
          tema: "MLP_PERCEPTRON",
          tipo: "diagrama",
          titulo: "Arquitectura MLP, Flujo Forward/Backward y Lectura de Subíndices",
          etiquetaNaturaleza: "ENTRENAMIENTO PRÁCTICO · NO ES PREGUNTA DE PARCIAL",
          resumen: "Cómo leer los pesos en el dibujo (regla origen-destino), entender Forward/Backward y ver dónde actúa la función sigmoidal.",
          svgDiagram: `
            <svg viewBox="0 0 760 320" xmlns="http://www.w3.org/2000/svg" class="lab-svg-diagram" role="img" aria-label="Diagrama de flujo Forward y Backward en red MLP con sumatoria de errores cruzados">
              <defs>
                <marker id="mlp-arrow-fwd" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8" />
                </marker>
                <marker id="mlp-arrow-bwd" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#fb7185" />
                </marker>
              </defs>

              <!-- Leyendas Superiores -->
              <rect x="20" y="10" width="340" height="32" rx="8" fill="rgba(56, 189, 248, 0.12)" stroke="#38bdf8" stroke-width="1"/>
              <text x="190" y="31" text-anchor="middle" fill="#38bdf8" font-size="12.5" font-weight="700">1. PASO FORWARD (→): Net_j y Salidas f(Net_j)</text>

              <rect x="390" y="10" width="350" height="32" rx="8" fill="rgba(251, 113, 133, 0.12)" stroke="#fb7185" stroke-width="1"/>
              <text x="565" y="31" text-anchor="middle" fill="#fb7185" font-size="12.5" font-weight="700">2. PASO BACKWARD (←): Σ Errores Cruzados δ_k · w_kj</text>

              <!-- Capa Entrada -->
              <text x="80" y="66" text-anchor="middle" class="svg-label-muted" font-size="11.5" font-weight="700">CAPA ENTRADA</text>
              <circle cx="80" cy="110" r="22" class="svg-node svg-node-in"/>
              <text x="80" y="115" text-anchor="middle" class="svg-node-text" font-size="13" font-weight="700">x₁</text>
              <circle cx="80" cy="205" r="22" class="svg-node svg-node-in"/>
              <text x="80" y="210" text-anchor="middle" class="svg-node-text" font-size="13" font-weight="700">x₂</text>

              <!-- Capa Oculta -->
              <text x="310" y="66" text-anchor="middle" class="svg-label-muted" font-size="11.5" font-weight="700">CAPA OCULTA (o₁, o₂)</text>
              <circle cx="310" cy="110" r="26" class="svg-node svg-node-hidden"/>
              <text x="310" y="108" text-anchor="middle" class="svg-node-text" font-size="13" font-weight="700">o₁</text>
              <text x="310" y="124" text-anchor="middle" class="svg-label-muted" font-size="9.5">f(net_o1)</text>

              <circle cx="310" cy="205" r="26" class="svg-node svg-node-hidden"/>
              <text x="310" y="203" text-anchor="middle" class="svg-node-text" font-size="13" font-weight="700">o₂</text>
              <text x="310" y="219" text-anchor="middle" class="svg-label-muted" font-size="9.5">f(net_o2)</text>

              <!-- Capa Salida -->
              <text x="590" y="66" text-anchor="middle" class="svg-label-muted" font-size="11.5" font-weight="700">CAPA SALIDA (s₁, s₂)</text>
              <circle cx="590" cy="110" r="26" class="svg-node svg-node-out"/>
              <text x="590" y="108" text-anchor="middle" class="svg-node-text" font-size="13" font-weight="700">s₁</text>
              <text x="590" y="124" text-anchor="middle" class="svg-label-muted" font-size="9.5">δ_s1</text>

              <circle cx="590" cy="205" r="26" class="svg-node svg-node-out"/>
              <text x="590" y="203" text-anchor="middle" class="svg-node-text" font-size="13" font-weight="700">s₂</text>
              <text x="590" y="219" text-anchor="middle" class="svg-label-muted" font-size="9.5">δ_s2</text>

              <!-- Conexiones Forward Sólidas (Entrada -> Oculta) -->
              <line x1="102" y1="106" x2="282" y2="106" stroke="#38bdf8" stroke-width="1.8" marker-end="url(#mlp-arrow-fwd)"/>
              <text x="185" y="99" text-anchor="middle" fill="#38bdf8" font-size="10" font-weight="700">w_o1-x1</text>

              <line x1="102" y1="118" x2="283" y2="196" stroke="#38bdf8" stroke-width="1.5" marker-end="url(#mlp-arrow-fwd)"/>
              <line x1="102" y1="196" x2="283" y2="118" stroke="#38bdf8" stroke-width="1.5" marker-end="url(#mlp-arrow-fwd)"/>

              <line x1="102" y1="210" x2="282" y2="210" stroke="#38bdf8" stroke-width="1.8" marker-end="url(#mlp-arrow-fwd)"/>
              <text x="185" y="226" text-anchor="middle" fill="#38bdf8" font-size="10" font-weight="700">w_o2-x2</text>

              <!-- Conexiones Forward Sólidas (Oculta -> Salida) -->
              <line x1="337" y1="104" x2="562" y2="104" stroke="#38bdf8" stroke-width="1.8" marker-end="url(#mlp-arrow-fwd)"/>
              <text x="450" y="96" text-anchor="middle" fill="#38bdf8" font-size="10" font-weight="700">w_s1-o1</text>

              <line x1="336" y1="118" x2="563" y2="195" stroke="#38bdf8" stroke-width="1.5" marker-end="url(#mlp-arrow-fwd)"/>
              <line x1="336" y1="196" x2="563" y2="118" stroke="#38bdf8" stroke-width="1.5" marker-end="url(#mlp-arrow-fwd)"/>

              <line x1="337" y1="210" x2="562" y2="210" stroke="#38bdf8" stroke-width="1.8" marker-end="url(#mlp-arrow-fwd)"/>
              <text x="450" y="224" text-anchor="middle" fill="#38bdf8" font-size="10" font-weight="700">w_s2-o2</text>

              <!-- Retorno Backward con Suma de Errores Cruzados (Salida -> Oculta) -->
              <!-- Hacia o1: aporte directo de s1 y aporte cruzado de s2 -->
              <line x1="562" y1="112" x2="338" y2="112" stroke="#fb7185" stroke-width="2" marker-end="url(#mlp-arrow-bwd)"/>
              <line x1="563" y1="200" x2="339" y2="124" stroke="#fb7185" stroke-width="1.6" marker-end="url(#mlp-arrow-bwd)"/>

              <!-- Hacia o2: aporte cruzado de s1 y aporte directo de s2 -->
              <line x1="563" y1="120" x2="339" y2="198" stroke="#fb7185" stroke-width="1.6" marker-end="url(#mlp-arrow-bwd)"/>
              <line x1="562" y1="216" x2="338" y2="216" stroke="#fb7185" stroke-width="2" marker-end="url(#mlp-arrow-bwd)"/>

              <!-- Etiquetas analíticas de la suma de gradientes hacia o1 y o2 -->
              <rect x="200" y="44" width="220" height="18" rx="4" fill="rgba(251, 113, 133, 0.16)" stroke="#fb7185" stroke-width="0.8"/>
              <text x="310" y="57" text-anchor="middle" fill="#fb7185" font-size="9.5" font-weight="700">
                δ_o1 = o₁(1−o₁) · [δ_s1·w_s1-o1 + δ_s2·w_s2-o1]
              </text>

              <rect x="200" y="238" width="220" height="18" rx="4" fill="rgba(251, 113, 133, 0.16)" stroke="#fb7185" stroke-width="0.8"/>
              <text x="310" y="251" text-anchor="middle" fill="#fb7185" font-size="9.5" font-weight="700">
                δ_o2 = o₂(1−o₂) · [δ_s1·w_s1-o2 + δ_s2·w_s2-o2]
              </text>

              <!-- Salida final y Error Ep -->
              <line x1="618" y1="110" x2="675" y2="110" stroke="#10b981" stroke-width="2" marker-end="url(#mlp-arrow-fwd)"/>
              <text x="712" y="114" text-anchor="middle" fill="#10b981" font-size="11" font-weight="700">So₁ vs Sd₁</text>
              <line x1="618" y1="205" x2="675" y2="205" stroke="#10b981" stroke-width="2" marker-end="url(#mlp-arrow-fwd)"/>
              <text x="712" y="209" text-anchor="middle" fill="#10b981" font-size="11" font-weight="700">So₂ vs Sd₂</text>

              <!-- Regla mnemotécnica inferior de cátedra -->
              <rect x="18" y="270" width="724" height="42" rx="6" class="svg-note-bg"/>
              <text x="380" y="288" text-anchor="middle" class="svg-node-text" font-size="11.5" font-weight="700">
                ⚠️ Regla Canónica de Cátedra UTN: En capa oculta, cada neurona j SUMA los aportes de error de TODAS las salidas k:
              </text>
              <text x="380" y="304" text-anchor="middle" fill="#fb7185" font-size="11.5" font-weight="700">
                δ_j = y_j(1 − y_j) · Σ_k (δ_k · w_k-j) ➔ Los pesos activos son sólidos y nunca se omiten términos cruzados.
              </text>
            </svg>
          `,
          svgDiagram2: `
            <svg viewBox="0 0 760 280" xmlns="http://www.w3.org/2000/svg" class="lab-svg-diagram" role="img" aria-label="Curva Sigmoidal f(net) y su derivada f'(net) = y(1-y)">
              <rect x="16" y="12" width="468" height="252" rx="10" fill="rgba(15,23,42,0.55)" stroke="#334155" stroke-width="1"/>
              <text x="250" y="34" text-anchor="middle" fill="#38bdf8" font-size="13" font-weight="700">Función Sigmoidal y = 1/(1+e⁻ⁿᵉᵗ) y su Derivada y(1−y)</text>

              <!-- Zona activa net en [-2, 2] -->
              <rect x="180" y="54" width="140" height="170" fill="rgba(16,185,129,0.08)" stroke="#10b981" stroke-width="1" stroke-dasharray="4,3"/>
              <text x="250" y="70" text-anchor="middle" fill="#34d399" font-size="10" font-weight="700">ZONA ACTIVA (mayor f')</text>
              <text x="95" y="70" text-anchor="middle" fill="#94a3b8" font-size="10">Saturación → 0</text>
              <text x="415" y="70" text-anchor="middle" fill="#94a3b8" font-size="10">Saturación → 1</text>

              <!-- Ejes y grilla -->
              <line x1="40" y1="224" x2="460" y2="224" stroke="#64748b" stroke-width="1.5"/>
              <line x1="250" y1="54" x2="250" y2="232" stroke="#64748b" stroke-width="1.5"/>
              <line x1="40" y1="64" x2="460" y2="64" stroke="#334155" stroke-width="1" stroke-dasharray="3,3"/>
              <line x1="40" y1="144" x2="460" y2="144" stroke="#334155" stroke-width="1" stroke-dasharray="3,3"/>
              <line x1="40" y1="184" x2="460" y2="184" stroke="#334155" stroke-width="1" stroke-dasharray="3,3"/>

              <!-- Etiquetas de ejes -->
              <text x="34" y="68" text-anchor="end" class="svg-label-muted" font-size="10">1.0</text>
              <text x="34" y="148" text-anchor="end" class="svg-label-muted" font-size="10">0.5</text>
              <text x="34" y="188" text-anchor="end" fill="#fbbf24" font-size="10">0.25</text>
              <text x="34" y="228" text-anchor="end" class="svg-label-muted" font-size="10">0</text>
              <text x="110" y="242" text-anchor="middle" class="svg-label-muted" font-size="10">-4</text>
              <text x="180" y="242" text-anchor="middle" class="svg-label-muted" font-size="10">-2</text>
              <text x="250" y="242" text-anchor="middle" fill="#e2e8f0" font-size="11" font-weight="700">net=0</text>
              <text x="320" y="242" text-anchor="middle" class="svg-label-muted" font-size="10">+2</text>
              <text x="390" y="242" text-anchor="middle" class="svg-label-muted" font-size="10">+4</text>
              <text x="455" y="242" text-anchor="middle" class="svg-label-muted" font-size="10">net</text>

              <!-- Curva y = 1/(1+e^-net): x = 250 + 35*net, svgY = 224 - 160*y -->
              <path d="M 40 223.6 L 75 222.9 L 110 221.1 L 145 216.4 L 180 204.9 L 215 181.0 L 232.5 163.6 L 250 144.0 L 267.5 124.4 L 285 107.0 L 320 83.1 L 355 71.6 L 390 66.9 L 425 65.1 L 460 64.4" fill="none" stroke="#38bdf8" stroke-width="3" stroke-linecap="round"/>

              <!-- Curva f'(net) = y(1-y): pico 0.25 en net=0 -> svgY=184 -->
              <path d="M 40 223.6 L 75 222.9 L 110 221.2 L 145 216.8 L 180 207.2 L 215 192.5 L 232.5 186.4 L 250 184.0 L 267.5 186.4 L 285 192.5 L 320 207.2 L 355 216.8 L 390 221.2 L 425 222.9 L 460 223.6" fill="none" stroke="#fbbf24" stroke-width="2.4" stroke-dasharray="6,4"/>

              <!-- Puntos clave -->
              <circle cx="250" cy="144" r="5" fill="#38bdf8" stroke="#0f172a" stroke-width="1.5"/>
              <text x="292" y="138" fill="#7dd3fc" font-size="10" font-weight="700">y(0) = 0.50</text>
              <circle cx="250" cy="184" r="5" fill="#fbbf24" stroke="#0f172a" stroke-width="1.5"/>
              <text x="250" y="175" text-anchor="middle" fill="#fbbf24" font-size="10" font-weight="700">Pico f'=0.25</text>

              <!-- Panel derecho resumen práctico sigmoidal -->
              <rect x="498" y="12" width="246" height="252" rx="10" fill="rgba(16,185,129,0.08)" stroke="#10b981" stroke-width="1.2"/>
              <text x="621" y="38" text-anchor="middle" fill="#34d399" font-size="13" font-weight="700">Foco Parcial: Sigmoidal</text>
              <text x="514" y="68" fill="#e2e8f0" font-size="12" font-weight="700">1. Salida en Forward:</text>
              <text x="520" y="88" fill="#7dd3fc" font-size="12">y = 1 / (1 + e⁻ⁿᵉᵗ) ∈ (0, 1)</text>
              <text x="514" y="120" fill="#e2e8f0" font-size="12" font-weight="700">2. Derivada en Backward:</text>
              <text x="520" y="140" fill="#fbbf24" font-size="12">f'(net) = y · (1 − y)</text>
              <text x="520" y="158" class="svg-label-muted" font-size="10">(Usás directamente la y recién sacada)</text>
              <rect x="512" y="176" width="218" height="74" rx="6" class="svg-note-bg"/>
              <text x="621" y="196" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">Chequeo rápido en hoja:</text>
              <text x="621" y="214" text-anchor="middle" class="svg-node-text" font-size="10.5">Si y &lt; 0 o y &gt; 1 ➔ ¡error de signo!</text>
              <text x="621" y="232" text-anchor="middle" class="svg-node-text" font-size="10.5">f' siempre está entre 0 y 0.25</text>
            </svg>
          `,
          notasClave: [
            "**Lectura de pesos en la figura:** La notación de la guía puede aparecer como $w_{31}$, $w_{s1-o2}$ o $w_{1-x2}$. En **todos** los casos, el **primer símbolo es la neurona DESTINO** (la que recibe la flecha) y el **segundo símbolo es el ORIGEN** (de donde sale la señal).",
            "**Ejemplo práctico de guía:** Si actualizás $w_{31}$ (va de la neurona $1$ hacia la neurona $3$), usás el error de la neurona destino ($\\delta_3$) multiplicado por la salida de la neurona origen ($f(net_1)$)."
          ]
        },
        {
          id: "PRAC-MLP-02",
          tema: "MLP_PERCEPTRON",
          tipo: "algoritmo",
          titulo: "Algoritmo MLP (Backpropagation) en 6 Pasos + Cierre de Época (Pasos 7 y 8)",
          etiquetaNaturaleza: "ENTRENAMIENTO PRÁCTICO · NO ES PREGUNTA DE PARCIAL",
          resumen: "Guía práctica en 6 pasos para entender qué va pasando en cada cuenta (sin recitar definiciones de memoria), con foco en activación sigmoidal y comentarios cortos para tu hoja.",
          pasos: [
            {
              nro: 1,
              titulo: "Inicialización de los pesos y parámetros",
              queHago: "Anoto los pesos iniciales $w_{ji}(0)$, los sesgos/umbrales si hay, la tasa de aprendizaje $\\alpha$ y el momento $\\beta$ (si no lo mencionan, vale $0$).",
              formula: "$$W(0) = \\{w_{ji}(0)\\}, \\quad \\alpha \\in (0, 1], \\quad \\beta \\in [0, 1)$$",
              queEscriboEnHoja: "«Arranco con los pesos iniciales W(0), α = ... y β = ... que da el enunciado.»"
            },
            {
              nro: 2,
              titulo: "Presentación de datos y codificación de la salida",
              queHago: "Elijo el patrón $p$ a procesar: separo lo que entra a la red ($x_i$) de la respuesta objetivo ($S_{dk}$). Si son etiquetas o clases, dejo clara su codificación numérica.",
              formula: "$$\\text{Patrón } p: \\; (\\mathbf{E}_p; \\mathbf{S}_d) = ([x_1, x_2, \\dots]; [S_{d1}, S_{d2}, \\dots])$$",
              queEscriboEnHoja: "«Pruebo el patrón 1 con entradas x = [...] buscando que salga Sd = [...].»"
            },
            {
              nro: 3,
              titulo: "Calcular la salida actual de la red (Forward Pass)",
              queHago: "Avanzo **de izquierda a derecha** (primero capa oculta, luego salida). Sumo entradas por pesos ($net_j$) y paso el resultado por la **sigmoidal** $f(net)=\\frac{1}{1+e^{-net}}$ (o dejo $net_j$ directo si alguna neurona fuera lineal).",
              formula: "$$net_j = \\sum_{i} w_{ji} \\cdot y_i + b_j \\qquad \\Longrightarrow \\qquad y_j = f(net_j) = \\begin{cases} \\dfrac{1}{1 + e^{-net_j}} & \\text{Sigmoidal (más probable en parcial)} \\\\ net_j & \\text{si aclara Lineal} \\end{cases}$$",
              queEscriboEnHoja: "«Voy para adelante (Forward): saco net y la sigmoidal f(net) en las ocultas y con eso calculo la salida actual de la red.»"
            },
            {
              nro: 4,
              titulo: "Calcular los términos de error δ (Backward Pass)",
              queHago: "Ahora vuelvo **de derecha a izquierda** para ver cuánto aportó cada neurona al error. En la salida comparo $(S_{dk}-y_k)$ por su derivada sigmoidal $y_k(1-y_k)$; en la oculta sumo los $\\delta$ que vuelven multiplicados por cada peso que sale de ella.",
              formula: "$$\\delta_{sk} = (S_{dk} - S_{ok}) \\cdot f'(net_{sk}) \\qquad\\mid\\qquad \\delta_{oj} = f'(net_{oj}) \\cdot \\sum_{k \\in \\text{Salidas}} (\\delta_{sk} \\cdot w_{sk-oj})$$\n$$f'(net) = \\begin{cases} f(net)\\cdot(1 - f(net)) & \\text{Sigmoidal (foco de parcial)} \\\\ 1 & \\text{si es Lineal} \\end{cases}$$",
              queEscriboEnHoja: "«Vuelvo para atrás (Backward): mido cuánto erró la salida (δ_s) y lo reparto hacia las ocultas (δ_o) usando su derivada f'(net).»"
            },
            {
              nro: 5,
              titulo: "Actualización de los pesos sinápticos",
              queHago: "Corrijo cada peso en la dirección que achica el error: multiplico **$\\alpha \\cdot \\delta_{\\text{destino}} \\cdot y_{\\text{origen}}$** (y sumo $\\beta \\cdot \\Delta w_{ji}(t-1)$ si hay momento). Ojo con los signos: un $\\delta$ negativo baja el peso.",
              formula: "$$\\Delta w_{ji}(t) = \\alpha \\cdot \\delta_j \\cdot y_i + \\beta \\cdot \\Delta w_{ji}(t-1) \\qquad\\Longrightarrow\\qquad w_{ji}(t+1) = w_{ji}(t) + \\Delta w_{ji}(t)$$",
              queEscriboEnHoja: "«Actualizo cada peso corriendo un poquito con α·δ_destino·y_origen (+ momento β si pide).»"
            },
            {
              nro: 6,
              titulo: "Calcular el Error del Patrón (Ep), Error Global (EG) y Criterio de Parada",
              queHago: "Mido el error cuadrático del patrón ($E_p$). Si quedan más patrones en la época, sigo con el siguiente; al terminar los $L$ patrones promedio para sacar el **Error Global ($E_G$)** y decido si paro o hago otra iteración.",
              formula: "$$E_p = \\frac{1}{2} \\sum_{k=1}^{M} (S_{dk} - S_{ok})^2 \\qquad\\Longrightarrow\\qquad E_G = \\frac{1}{L} \\sum_{p=1}^{L} E_p$$",
              queEscriboEnHoja: "«Saco el error de este patrón Ep; al completar la época promedio en EG y como EG [<= / >] mínimo pedido, [termino / sigo otra época].»"
            }
          ]
        },
        {
          id: "PRAC-MLP-03",
          tema: "MLP_PERCEPTRON",
          tipo: "algoritmo",
          titulo: "Perceptrón Simple (Método Analítico e Iterativo) y ADALINE (LMS)",
          etiquetaNaturaleza: "ENTRENAMIENTO PRÁCTICO · NO ES PREGUNTA DE PARCIAL",
          resumen: "Cómo resolver los ejercicios clásicos de Perceptrón de la Guía 1 (hallar recta separadora, verificar semiplano e iterar) y en qué cambia respecto a ADALINE.",
          pasos: [
            {
              nro: 1,
              titulo: "Perceptrón — Método Analítico (Ecuación de la Recta Frontera)",
              queHago: "Grafico los puntos de ambas clases en $(x_1, x_2)$ y trazo **una recta que los separe** ($x_2 = m\\,x_1 + b$). Igualo con $w_1 x_1 + w_2 x_2 - \\theta = 0$ y fijo un valor simple (ej. $w_2 = 1$) para sacar $w_1$ y $\\theta$.",
              formula: "$$w_1 x_1 + w_2 x_2 - \\theta = 0 \\quad\\Longrightarrow\\quad x_2 = -\\frac{w_1}{w_2} x_1 + \\frac{\\theta}{w_2}$$",
              queEscriboEnHoja: "«Dibujo la recta x₂ = m·x₁ + b que separa las dos clases y despejo w₁, w₂ y θ.»"
            },
            {
              nro: 2,
              titulo: "Perceptrón — Verificación OBLIGATORIA del Semiplano (Invertir Signos)",
              queHago: "Pruebo un punto de Clase 1 en $net$. Si la recta separa bien pero el punto de Clase 1 me da $net < 0$ (salida $0$ en vez de $1$), el vector apunta para el lado contrario: **le doy vuelta el signo a TODOS**: $-w_0, -w_1, -w_2$.",
              svgDiagram: `
                <svg viewBox="0 0 760 215" xmlns="http://www.w3.org/2000/svg" class="lab-svg-diagram" role="img" aria-label="Inversión de signos de pesos para orientar el semiplano positivo">
                  <defs>
                    <marker id="mlp-p-red" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 1 L10 5 L0 9 z" fill="#fb7185"/></marker>
                    <marker id="mlp-p-green" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 1 L10 5 L0 9 z" fill="#34d399"/></marker>
                  </defs>
                  <!-- Panel izquierdo -->
                  <rect x="14" y="10" width="300" height="195" rx="10" fill="rgba(251,113,133,0.08)" stroke="#fb7185" stroke-width="1.2"/>
                  <text x="164" y="32" text-anchor="middle" fill="#fb7185" font-size="12" font-weight="700">1. Recta bien ubicada, signo AL REVÉS</text>
                  <line x1="45" y1="168" x2="290" y2="168" stroke="#64748b" stroke-width="1.2"/>
                  <line x1="65" y1="50" x2="65" y2="185" stroke="#64748b" stroke-width="1.2"/>
                  <line x1="80" y1="158" x2="260" y2="62" stroke="#38bdf8" stroke-width="2.5"/>
                  <circle cx="115" cy="92" r="7" fill="#34d399"/>
                  <text x="115" y="79" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">Clase 1 (da net &lt; 0 ✗)</text>
                  <circle cx="220" cy="142" r="7" fill="#fb7185"/>
                  <text x="220" y="159" text-anchor="middle" fill="#fb7185" font-size="11" font-weight="700">Clase 0 (da net &gt; 0)</text>
                  <line x1="170" y1="110" x2="200" y2="146" stroke="#fb7185" stroke-width="2.5" marker-end="url(#mlp-p-red)"/>
                  <text x="214" y="124" fill="#fb7185" font-size="11" font-weight="700">w</text>

                  <!-- Flecha cambio de signo -->
                  <rect x="330" y="76" width="100" height="60" rx="8" class="svg-note-bg"/>
                  <text x="380" y="102" text-anchor="middle" fill="#fbbf24" font-size="13" font-weight="700">× (−1)</text>
                  <text x="380" y="121" text-anchor="middle" class="svg-node-text" font-size="10.5">a w₀, w₁ y w₂</text>

                  <!-- Panel derecho -->
                  <rect x="446" y="10" width="300" height="195" rx="10" fill="rgba(52,211,153,0.08)" stroke="#34d399" stroke-width="1.2"/>
                  <text x="596" y="32" text-anchor="middle" fill="#34d399" font-size="12" font-weight="700">2. Misma recta, semiplano CORREGIDO</text>
                  <line x1="477" y1="168" x2="722" y2="168" stroke="#64748b" stroke-width="1.2"/>
                  <line x1="497" y1="50" x2="497" y2="185" stroke="#64748b" stroke-width="1.2"/>
                  <line x1="512" y1="158" x2="692" y2="62" stroke="#38bdf8" stroke-width="2.5"/>
                  <circle cx="547" cy="92" r="7" fill="#34d399"/>
                  <text x="547" y="79" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">Clase 1 (net &gt; 0 ✓)</text>
                  <circle cx="652" cy="142" r="7" fill="#fb7185"/>
                  <text x="652" y="159" text-anchor="middle" fill="#fb7185" font-size="11" font-weight="700">Clase 0 (net &lt; 0 ✓)</text>
                  <line x1="602" y1="110" x2="572" y2="74" stroke="#34d399" stroke-width="2.5" marker-end="url(#mlp-p-green)"/>
                  <text x="592" y="84" fill="#34d399" font-size="11" font-weight="700">−w</text>
                </svg>
              `,
              formula: "$$\\text{Si Clase 1 da } f(net) = 0 \\implies w_0 \\leftarrow -w_0, \\; w_1 \\leftarrow -w_1, \\; w_2 \\leftarrow -w_2$$",
              queEscriboEnHoja: "«Pruebo un punto de cada clase: como dio el signo al revés, invierto los signos de w₁, w₂ y θ para apuntar al lado correcto.»"
            },
            {
              nro: 3,
              titulo: "Perceptrón — Método Iterativo vs. ADALINE (Regla Delta / LMS)",
              queHago: "En **Perceptrón**, aplico el escalón $y \\in \\{0, 1\\}$ y comparo $S_d - y$. En **ADALINE**, el error se saca **antes del escalón** usando $net$ directo ($S_d - net$). Si el error no es $0$, corrijo todos los pesos (incluyendo $w_0 = -\\theta$) antes del siguiente patrón.",
              formula: "$$w_i(t+1) = w_i(t) + \\alpha \\cdot (S_d - y) \\cdot x_i \\qquad (x_0 = 1, \\; w_0 = -\\theta)$$",
              queEscriboEnHoja: "«Evalúo el patrón pᵢ; como hay diferencia con Sd, ajusto w₀, w₁ y w₂ antes de pasar al patrón siguiente.»"
            }
          ]
        },
        {
          id: "PRAC-MLP-04",
          tema: "MLP_PERCEPTRON",
          tipo: "plantilla",
          titulo: "Plantilla en Hoja + Ejemplo Resuelto Sigmoidal Completo (Red 2-2-1, α=0.5)",
          etiquetaNaturaleza: "ENTRENAMIENTO PRÁCTICO · NO ES PREGUNTA DE PARCIAL",
          resumen: "Cómo ordenar las cuentas en hoja con un ejemplo numérico real 100% sigmoidal verificado a 4 decimales.",
          svgDiagram: `
            <svg viewBox="0 0 760 225" xmlns="http://www.w3.org/2000/svg" class="lab-svg-diagram" role="img" aria-label="Ejemplo numérico completo MLP 2-2-1 Sigmoidal">
              <defs>
                <marker id="mlp-ex-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 1 L10 5 L0 9 z" fill="#38bdf8"/></marker>
              </defs>
              <text x="380" y="22" text-anchor="middle" fill="#34d399" font-size="12.5" font-weight="700">Ejemplo resuelto Sigmoidal: x=[1.0, 0.5] · Sd=1.0 · α=0.5 · Ep=0.1036</text>

              <!-- Entrada -->
              <circle cx="80" cy="72" r="22" class="svg-node svg-node-in"/>
              <text x="80" y="69" text-anchor="middle" class="svg-node-text" font-size="12" font-weight="700">x₁=1.0</text>
              <circle cx="80" cy="158" r="22" class="svg-node svg-node-in"/>
              <text x="80" y="155" text-anchor="middle" class="svg-node-text" font-size="12" font-weight="700">x₂=0.5</text>

              <!-- Ocultas -->
              <circle cx="290" cy="72" r="27" class="svg-node svg-node-hidden"/>
              <text x="290" y="67" text-anchor="middle" class="svg-node-text" font-size="12" font-weight="700">o₁ (b=0.1)</text>
              <text x="290" y="83" text-anchor="middle" fill="#c4b5fd" font-size="9.5">y=0.5987</text>

              <circle cx="290" cy="158" r="27" class="svg-node svg-node-hidden"/>
              <text x="290" y="153" text-anchor="middle" class="svg-node-text" font-size="12" font-weight="700">o₂ (b=0.2)</text>
              <text x="290" y="169" text-anchor="middle" fill="#c4b5fd" font-size="9.5">y=0.5498</text>

              <!-- Salida -->
              <circle cx="520" cy="115" r="30" class="svg-node svg-node-out"/>
              <text x="520" y="110" text-anchor="middle" class="svg-node-text" font-size="12" font-weight="700">s₁ (b=0.1)</text>
              <text x="520" y="126" text-anchor="middle" fill="#6ee7b7" font-size="10">y=0.5447</text>

              <!-- Flechas con pesos -->
              <line x1="103" y1="68" x2="260" y2="68" stroke="#38bdf8" stroke-width="1.8" marker-end="url(#mlp-ex-arr)"/>
              <text x="180" y="60" text-anchor="middle" fill="#7dd3fc" font-size="10">0.4</text>
              <line x1="102" y1="150" x2="262" y2="79" stroke="#38bdf8" stroke-width="1.3" stroke-dasharray="3,2" marker-end="url(#mlp-ex-arr)"/>
              <text x="150" y="112" text-anchor="middle" fill="#7dd3fc" font-size="10">−0.2</text>
              <line x1="102" y1="80" x2="262" y2="150" stroke="#38bdf8" stroke-width="1.3" stroke-dasharray="3,2" marker-end="url(#mlp-ex-arr)"/>
              <text x="150" y="135" text-anchor="middle" fill="#7dd3fc" font-size="10">−0.3</text>
              <line x1="103" y1="162" x2="260" y2="162" stroke="#38bdf8" stroke-width="1.8" marker-end="url(#mlp-ex-arr)"/>
              <text x="180" y="176" text-anchor="middle" fill="#7dd3fc" font-size="10">0.6</text>

              <line x1="319" y1="77" x2="487" y2="108" stroke="#38bdf8" stroke-width="2" marker-end="url(#mlp-ex-arr)"/>
              <text x="405" y="83" text-anchor="middle" fill="#7dd3fc" font-size="10.5" font-weight="700">w=0.5</text>
              <line x1="319" y1="152" x2="487" y2="122" stroke="#38bdf8" stroke-width="2" marker-end="url(#mlp-ex-arr)"/>
              <text x="405" y="150" text-anchor="middle" fill="#7dd3fc" font-size="10.5" font-weight="700">w=−0.4</text>

              <!-- Caja resultado Backward derecha -->
              <rect x="572" y="42" width="174" height="145" rx="8" fill="rgba(251,113,133,0.10)" stroke="#fb7185" stroke-width="1.2"/>
              <text x="659" y="64" text-anchor="middle" fill="#fb7185" font-size="11.5" font-weight="700">Backward (δ y nuevos w)</text>
              <text x="584" y="86" fill="#e2e8f0" font-size="10.5">δ_s1 = 0.1129</text>
              <text x="584" y="104" fill="#e2e8f0" font-size="10.5">δ_o1 = 0.0136</text>
              <text x="584" y="122" fill="#e2e8f0" font-size="10.5">δ_o2 = −0.0112</text>
              <line x1="584" y1="133" x2="734" y2="133" stroke="#475569" stroke-width="1"/>
              <text x="584" y="151" fill="#34d399" font-size="10.5">w_s1-o1 → 0.5338</text>
              <text x="584" y="169" fill="#34d399" font-size="10.5">w_o1-x1 → 0.4068</text>

              <rect x="14" y="192" width="732" height="24" rx="5" class="svg-note-bg"/>
              <text x="380" y="208" text-anchor="middle" class="svg-node-text" font-size="10.5">
                Chequeo: f'(s1) = 0.5447×0.4553 = 0.2480 → δ_s1 = (1 − 0.5447)×0.2480 = 0.1129 → Ep = 0.5×(1 − 0.5447)² = 0.1036
              </text>
            </svg>
          `,
          tablaPlantilla: {
            tituloTabla: "1) Forward Sigmoidal (Ejemplo resuelto + plantilla)",
            columnas: ["Neurona", "net = Σ w·y + b", "Salida y = 1/(1+e⁻ⁿᵉᵗ)", "Derivada f' = y(1−y)", "Comentario breve en hoja"],
            filas: [
              ["o₁ (oculta)", "1·0.4 + 0.5·(−0.2) + 0.1 = 0.4000", "0.5987", "0.5987·0.4013 = 0.2403", "Saco net y sigmoidal de oculta 1"],
              ["o₂ (oculta)", "1·(−0.3) + 0.5·0.6 + 0.2 = 0.2000", "0.5498", "0.5498·0.4502 = 0.2475", "Saco net y sigmoidal de oculta 2"],
              ["s₁ (salida)", "0.5987·0.5 + 0.5498·(−0.4) + 0.1 = 0.1794", "0.5447", "0.5447·0.4553 = 0.2480", "Salida obtenida (buscaba Sd = 1.0)"]
            ]
          },
          tablaPlantilla2: {
            tituloTabla: "2) Backward y Actualización de Pesos (α = 0.5, β = 0)",
            columnas: ["Elemento", "Cálculo paso a paso", "Resultado", "Comentario breve en hoja"],
            filas: [
              ["δ_s1 (salida)", "(1.0 − 0.5447) · 0.2480", "0.1129", "Mido cuánto faltó en salida por f'"],
              ["δ_o1 (oculta)", "0.2403 · (0.1129 · 0.5)", "0.0136", "Reparto error hacia atrás a o₁"],
              ["δ_o2 (oculta)", "0.2475 · (0.1129 · (−0.4))", "−0.0112", "Reparto error hacia atrás a o₂"],
              ["w_s1-o1(t+1)", "0.5 + 0.5 · 0.1129 · 0.5987", "0.5338", "Subo el peso que conecta o₁ con s₁"],
              ["w_o1-x1(t+1)", "0.4 + 0.5 · 0.0136 · 1.0", "0.4068", "Ajusto peso de entrada hacia o₁"]
            ]
          },
          tipHoja: "💡 **Tip de examen:** Fijate en los comentarios de la última columna: son cortos, naturales y muestran que entendés qué representa cada número sin escribir párrafos largos."
        },
        {
          id: "PRAC-MLP-05",
          tema: "MLP_PERCEPTRON",
          tipo: "formula",
          titulo: "Flashcard 1: Derivada f'(net) — Foco Sigmoidal vs. Lineal",
          etiquetaNaturaleza: "ENTRENAMIENTO PRÁCTICO · NO ES PREGUNTA DE PARCIAL",
          preguntaFrente: "El profesor aclaró que probablemente den neuronas sigmoidales (y a veces combinan con alguna lineal). ¿Cuánto valen f(net) y f'(net) en cada caso?",
          respuestaDorso: "1. **Si la neurona es Sigmoidal (prioritaria):**\n   $$f(net) = \\frac{1}{1 + e^{-net}} \\qquad\\Longrightarrow\\qquad f'(net) = y \\cdot (1 - y)$$\n   *(Una vez sacada la salida $y = f(net)$, su derivada es directa: multiplicás ese mismo número por $1 - y$. Nunca vuelve a necesitar exponenciales).*\n2. **Si el gráfico aclara que es Lineal (Identidad):**\n   $$f(net) = net \\qquad\\Longrightarrow\\qquad f'(net) = 1$$\n\n⚠️ **Ojo al dibujar/leer la red:** No apliques $y(1-y)$ a una neurona que el diagrama marca como lineal, ni olvides calcular $y(1-y)$ cuando es sigmoidal.",
          svgDiagram: `
            <svg viewBox="0 0 760 155" xmlns="http://www.w3.org/2000/svg" class="lab-svg-diagram" role="img" aria-label="Comparación rápida Sigmoidal vs Lineal">
              <rect x="16" y="10" width="352" height="134" rx="8" fill="rgba(56,189,248,0.08)" stroke="#38bdf8" stroke-width="1.2"/>
              <text x="192" y="32" text-anchor="middle" fill="#38bdf8" font-size="12" font-weight="700">Sigmoidal (muy probable en parcial)</text>
              <line x1="36" y1="112" x2="180" y2="112" stroke="#64748b" stroke-width="1"/>
              <line x1="108" y1="44" x2="108" y2="124" stroke="#64748b" stroke-width="1"/>
              <path d="M 40 110 C 88 109, 98 84, 108 78 C 118 72, 128 47, 176 46" fill="none" stroke="#38bdf8" stroke-width="2.5"/>
              <text x="195" y="68" fill="#e2e8f0" font-size="11.5">• Rango: (0, 1)</text>
              <text x="195" y="90" fill="#fbbf24" font-size="11.5" font-weight="700">• f' = y · (1 − y)</text>
              <text x="195" y="112" class="svg-label-muted" font-size="10.5">Ej: y=0.7 ⇒ f'=0.21</text>

              <rect x="392" y="10" width="352" height="134" rx="8" fill="rgba(167,139,250,0.08)" stroke="#a78bfa" stroke-width="1.2"/>
              <text x="568" y="32" text-anchor="middle" fill="#c4b5fd" font-size="12" font-weight="700">Lineal / Identidad (si lo aclara)</text>
              <line x1="412" y1="112" x2="556" y2="112" stroke="#64748b" stroke-width="1"/>
              <line x1="484" y1="44" x2="484" y2="124" stroke="#64748b" stroke-width="1"/>
              <line x1="428" y1="120" x2="540" y2="46" stroke="#c4b5fd" stroke-width="2.5"/>
              <text x="572" y="68" fill="#e2e8f0" font-size="11.5">• Rango: (−∞, +∞)</text>
              <text x="572" y="90" fill="#fbbf24" font-size="11.5" font-weight="700">• f' = 1 siempre</text>
              <text x="572" y="112" class="svg-label-muted" font-size="10.5">Pendiente constante</text>
            </svg>
          `
        },
        {
          id: "PRAC-MLP-06",
          tema: "MLP_PERCEPTRON",
          tipo: "formula",
          titulo: "Flashcard 2: Error del Patrón (Ep) vs. Error Global (EG)",
          etiquetaNaturaleza: "ENTRENAMIENTO PRÁCTICO · NO ES PREGUNTA DE PARCIAL",
          preguntaFrente: "¿Cuál es la diferencia exacta entre el Error del Patrón Ep y el Error Global Medio EG cuando te dan varios patrones con 2 salidas?",
          respuestaDorso: "* **Error de un patrón individual ($E_p$):** Lleva el **$\\frac{1}{2}$** adelante y suma sobre las $M$ salidas de la red:\n  $$E_p = \\frac{1}{2} \\sum_{k=1}^{M} (S_{dk} - S_{ok})^2$$\n* **Error Global de toda la época ($E_G$):** Promedia los $E_p$ de los $L$ patrones (divide por $L$, **sin volver a multiplicar por $\\frac{1}{2}$**):\n  $$E_G = \\frac{1}{L} \\sum_{p=1}^{L} E_p$$\n\n**Ejemplo rápido (de parcial):** Si 1 patrón tiene dos salidas con $(S_{d1}-S_{o1}) = 0.12$ y $(S_{d2}-S_{o2}) = 0.11$, entonces:\n$E_{p1} = 0.5 \\cdot (0.12^2 + 0.11^2) = 0.01325$. Luego promediás todos los $E_{p_i}$ dividiendo por $L$."
        },
        {
          id: "PRAC-MLP-07",
          tema: "MLP_PERCEPTRON",
          tipo: "formula",
          titulo: "Flashcard 3: ¿Cómo calculo el Término de Momento β si no me dan Δw(t-1) explícito?",
          etiquetaNaturaleza: "ENTRENAMIENTO PRÁCTICO · NO ES PREGUNTA DE PARCIAL",
          preguntaFrente: "El enunciado pide actualizar w(t+1) usando momento β = 0.5 y te da w(t) y w(t-1) en la tabla. ¿Cómo sacás Δw(t-1) y por qué puede dar negativo?",
          respuestaDorso: "La variación de la iteración anterior es simplemente **el peso actual menos el peso previo**:\n$$\\Delta w_{ji}(t-1) = w_{ji}(t) - w_{ji}(t-1)$$\nY luego aplicás la Regla Delta con Momento:\n$$\\Delta w_{ji}(t) = \\alpha \\cdot \\delta_j \\cdot y_i + \\beta \\cdot \\left[ w_{ji}(t) - w_{ji}(t-1) \\right]$$\n\n**Ojo:** Si $w(t-1) = 5$ y $w(t) = 3$, el peso venía **bajando**, entonces $\\Delta w(t-1) = 3 - 5 = -2 < 0$. Aunque $\\beta > 0$, el **término de momento completo $\\beta \\cdot \\Delta w(t-1)$ es NEGATIVO** $(-1)$ y ayuda a seguir descendiendo o frenar oscilaciones."
        },
        {
          id: "PRAC-MLP-08",
          tema: "MLP_PERCEPTRON",
          tipo: "formula",
          titulo: "Flashcard 4: Tabla de Errores (Entrenamiento, Validación, Test) — Early Stopping",
          etiquetaNaturaleza: "ENTRENAMIENTO PRÁCTICO · NO ES PREGUNTA DE PARCIAL",
          preguntaFrente: "Te dan una tabla con Error de Entrenamiento, Error de Validación y Error de Test desde I₁₁ hasta I₂₀ (como el Ej. 02 de la guía). ¿Cómo elegís la iteración exacta para detener el entrenamiento?",
          respuestaDorso: "Se mira **primero la fila de Error de Validación** (no la de Entrenamiento ni Test para decidir el corte).\n\n* Mientras el **Error de Validación** baja junto con el de entrenamiento, la red sigue generalizando bien.\n* En el instante en que el Error de Validación **alcanza su mínimo y en la iteración siguiente empieza a subir** (mientras entrenamiento sigue bajando), comenzó el **sobreajuste (overfitting)**.\n* **Comentario breve en la hoja:** «Corto acá en la iteración $I_k$ porque el error de validación toca su mínimo y después empieza a subir (sobreajuste).»\n* *Nota:* Si el ejercicio aclara expresamente «no se utiliza error de validación», recién ahí comparás **$E_G \\le E_{\\text{mínimo aceptable}}$**.",
          svgDiagram: `
            <svg viewBox="0 0 760 190" xmlns="http://www.w3.org/2000/svg" class="lab-svg-diagram" role="img" aria-label="Curvas de Early Stopping: Entrenamiento vs Validación">
              <text x="380" y="22" text-anchor="middle" fill="#fbbf24" font-size="12.5" font-weight="700">Criterio de Parada Temprana (Early Stopping): cortás donde Validación toca el mínimo</text>
              <line x1="65" y1="158" x2="700" y2="158" stroke="#64748b" stroke-width="1.4"/>
              <line x1="65" y1="36" x2="65" y2="158" stroke="#64748b" stroke-width="1.4"/>
              <text x="45" y="48" class="svg-label-muted" font-size="10.5">Error</text>
              <text x="705" y="162" class="svg-label-muted" font-size="10.5">Épocas</text>

              <!-- Zona overfitting -->
              <rect x="430" y="40" width="260" height="118" fill="rgba(251,113,133,0.10)"/>
              <line x1="430" y1="40" x2="430" y2="158" stroke="#fbbf24" stroke-width="2" stroke-dasharray="5,4"/>
              <text x="430" y="174" text-anchor="middle" fill="#fbbf24" font-size="11.5" font-weight="700">I_min (PARAR ACÁ ✓)</text>
              <text x="565" y="58" text-anchor="middle" fill="#fb7185" font-size="11" font-weight="700">Zona Overfitting ✗</text>

              <!-- Curva Validación (baja y luego sube) -->
              <path d="M 80 54 Q 260 112 430 104 T 680 68" fill="none" stroke="#fb7185" stroke-width="2.8"/>
              <circle cx="430" cy="104" r="5.5" fill="#fbbf24" stroke="#0f172a" stroke-width="1.5"/>
              <text x="645" y="60" fill="#fb7185" font-size="11" font-weight="700">Validación ↑</text>

              <!-- Curva Entrenamiento (siempre baja) -->
              <path d="M 80 62 Q 260 124 430 138 T 680 148" fill="none" stroke="#38bdf8" stroke-width="2.8"/>
              <text x="635" y="142" fill="#38bdf8" font-size="11" font-weight="700">Entrenamiento ↓</text>
            </svg>
          `
        },
        {
          id: "PRAC-MLP-09",
          tema: "MLP_PERCEPTRON",
          tipo: "trampa",
          titulo: "Las 5 Trampas Clásicas de Calculadora en Práctica de MLP y Perceptrón",
          etiquetaNaturaleza: "ENTRENAMIENTO PRÁCTICO · NO ES PREGUNTA DE PARCIAL",
          resumen: "Checklist de errores frecuentes que cuestan medio ejercicio aunque hayas entendido la teoría.",
          trampas: [
            "**Invertir $(S_d - S_o)$ por $(S_o - S_d)$:** Siempre es **Deseada menos Obtenida**. Si invertís la resta, todos los pesos se actualizan en sentido contrario y sube el error.",
            "**Multiplicar $\\delta_j$ por la entrada equivocada al actualizar $w_{ji}$:** Para actualizar $w_{s3-o1}$ (entre oculta $o_1$ y salida $s_3$), el término de activación que multiplica a $\\alpha \\cdot \\delta_{s3}$ es **$f(net_{o1})$**, jamás $x_1$ ni $f(net_{s3})$.",
            "**Usar signo $+$ con el umbral $\\theta$ en Perceptrón:** La cátedra define $w_0 = -\\theta$ con $x_0 = +1$, por lo que $net = \\sum w_i x_i - \\theta$. Si la consigna da $\\theta = 0.5$, entonces $w_0 = -0.5$.",
            "**Olvidar algún cable saliente en $\\delta_{\\text{oculta}}$:** Si la neurona oculta $o_1$ está conectada a 3 neuronas de salida ($s_1, s_2, s_3$), la sumatoria $\\sum \\delta_{sk} w_{sk-o1}$ DEBE tener los 3 términos sumados antes de multiplicar por $f'(net_{o1})$.",
            "**Omitir escribir la fórmula general en papel:** Si ponés solo el número final en calculadora sin escribir antes la ecuación simbólica y la sustitución numérica, la cátedra suele descontar puntaje de procedimiento."
          ]
        }
      ]
    },
    {
      id: "ALGORITMOS_GENETICOS",
      nombre: "Algoritmos Genéticos (Selección, Cruce y Mutación)",
      badge: "Algoritmos Genéticos",
      icono: "🧬",
      ponderacion: "20% – 30% del Parcial Práctico",
      referenciaCatedra: "Teoría Unidad AG (Apuntes de Cátedra) · Parciales 2023 (Tema 1/2), 19/11/2025 y Finales 2021",
      referenciaLinks: [
        { label: "parcial2_2025_11_19_oficial.pdf", path: "MODELOS_ORIGINALES/1_PARCIALES_2DO_PARCIAL/parcial2_2025_11_19_oficial.pdf", kind: "pdf" },
        { label: "parcial2_2023_tema1.jpeg", path: "MODELOS_ORIGINALES/1_PARCIALES_2DO_PARCIAL/parcial2_2023_tema1.jpeg", kind: "img" },
        { label: "hoja_de_formulas_segundo_parcial.pdf", path: "MODELOS_ORIGINALES/4_GUIAS_PRACTICAS_CATEDRA/hoja_de_formulas_segundo_parcial.pdf", kind: "pdf" },
        { label: "08_algoritmos_geneticos.md", path: "GUIAS_PASO_A_PASO/08_algoritmos_geneticos.md", kind: "md" },
        { label: "GUIA_MAESTRA_ALGORITMOS_GENETICOS...", path: "GUIAS_PASO_A_PASO/GUIA_MAESTRA_ALGORITMOS_GENETICOS_Y_ESTRUCTURA_EXAMEN.md", kind: "md" }
      ],
      tiempoSugerido: "15 - 20 min en hoja",
      objetivo: "Armar sin errores las tablas de Ruleta [00–99], Control de Copias Esperadas y Ranking Lineal, ejecutar cruces Simple, Multipunto (regla de anillo) y Binomial (dos formas de Hijo 2), y calcular Mutación Adaptativa por Temperatura (con o sin reinicio cíclico) diferenciándola de Convergencia.",
      items: [
        {
          id: "PRAC-AG-01",
          tema: "ALGORITMOS_GENETICOS",
          tipo: "diagrama",
          titulo: "Ciclo Evolutivo, Mapeo de Ruleta [00–99] y Cruce Multipunto en Anillo",
          etiquetaNaturaleza: "ENTRENAMIENTO PRÁCTICO · NO ES PREGUNTA DE PARCIAL",
          resumen: "Vista gráfica de cómo se reparten las 100 ranuras sin huecos y cómo alternan los bloques de cromosomas en Cruce Simple, Multipunto (3 cortes = 4 segmentos) y Binomial.",
          svgDiagram: `
            <svg viewBox="0 0 760 330" xmlns="http://www.w3.org/2000/svg" class="lab-svg-diagram" role="img" aria-label="Diagrama de Ruleta 00-99 y Operadores de Cruce en Algoritmos Genéticos">
              <defs>
                <marker id="ag-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8" />
                </marker>
              </defs>

              <!-- 1. Banda superior: Ciclo evolutivo -->
              <rect x="20" y="12" width="720" height="44" rx="8" class="svg-note-bg"/>
              <text x="85" y="38" text-anchor="middle" fill="#38bdf8" font-size="12" font-weight="700">P(t)</text>
              <line x1="108" y1="34" x2="148" y2="34" stroke="#38bdf8" stroke-width="2" marker-end="url(#ag-arrow)"/>
              <text x="208" y="38" text-anchor="middle" class="svg-node-text" font-size="12" font-weight="700">1. Fitness fᵢ</text>
              <line x1="258" y1="34" x2="298" y2="34" stroke="#38bdf8" stroke-width="2" marker-end="url(#ag-arrow)"/>
              <text x="355" y="38" text-anchor="middle" fill="#10b981" font-size="12" font-weight="700">2. Selección</text>
              <line x1="406" y1="34" x2="446" y2="34" stroke="#38bdf8" stroke-width="2" marker-end="url(#ag-arrow)"/>
              <text x="492" y="38" text-anchor="middle" fill="#fb7185" font-size="12" font-weight="700">3. Cruce</text>
              <line x1="532" y1="34" x2="572" y2="34" stroke="#38bdf8" stroke-width="2" marker-end="url(#ag-arrow)"/>
              <text x="622" y="38" text-anchor="middle" fill="#f59e0b" font-size="12" font-weight="700">4. Mutación</text>
              <line x1="668" y1="34" x2="695" y2="34" stroke="#38bdf8" stroke-width="2" marker-end="url(#ag-arrow)"/>
              <text x="718" y="38" text-anchor="middle" fill="#38bdf8" font-size="12" font-weight="700">P(t+1)</text>

              <!-- 2. Seccion Izquierda: Barra Ruleta [00-99] -->
              <rect x="20" y="72" width="345" height="205" rx="10" class="svg-node svg-node-in"/>
              <text x="192" y="96" text-anchor="middle" fill="#38bdf8" font-size="13" font-weight="800">RULETA DE 100 RANURAS [00 – 99]</text>
              <text x="192" y="114" text-anchor="middle" class="svg-label-muted" font-size="11">Ranuras = round(pᵢ · 100)  |  Fin = Inicio + Ranuras - 1</text>

              <!-- Barra proporcional -->
              <rect x="38" y="128" width="48" height="36" fill="#0284c7" stroke="#f8fafc" stroke-width="1"/>
              <text x="62" y="146" text-anchor="middle" fill="#ffffff" font-size="11" font-weight="700">I₁</text>
              <text x="62" y="159" text-anchor="middle" fill="#e0f2fe" font-size="9">00–14</text>

              <rect x="86" y="128" width="108" height="36" fill="#0d9488" stroke="#f8fafc" stroke-width="1"/>
              <text x="140" y="146" text-anchor="middle" fill="#ffffff" font-size="11" font-weight="700">I₂ (35%)</text>
              <text x="140" y="159" text-anchor="middle" fill="#ccfbf1" font-size="9">15–49</text>

              <rect x="194" y="128" width="34" height="36" fill="#d97706" stroke="#f8fafc" stroke-width="1"/>
              <text x="211" y="146" text-anchor="middle" fill="#ffffff" font-size="11" font-weight="700">I₃</text>
              <text x="211" y="159" text-anchor="middle" fill="#fef3c7" font-size="9">50–59</text>

              <rect x="228" y="128" width="120" height="36" fill="#7c3aed" stroke="#f8fafc" stroke-width="1"/>
              <text x="288" y="146" text-anchor="middle" fill="#ffffff" font-size="11" font-weight="700">I₄ (40%)</text>
              <text x="288" y="159" text-anchor="middle" fill="#ede9fe" font-size="9">60–99</text>

              <!-- Flecha de aleatorio r=64 -->
              <line x1="252" y1="194" x2="252" y2="168" stroke="#fb7185" stroke-width="2" marker-end="url(#ag-arrow)"/>
              <text x="252" y="210" text-anchor="middle" fill="#fb7185" font-size="11" font-weight="700">Ej: r = 64 ∈ [60–99] ➔ I₄</text>

              <text x="38" y="238" class="svg-node-text" font-size="11" font-weight="700">Control obligatorio en hoja:</text>
              <text x="38" y="256" class="svg-label-muted" font-size="11">• El 1° siempre arranca en 00 y el último cierra en 99.</text>
              <text x="38" y="271" class="svg-label-muted" font-size="11">• El siguiente intervalo empieza en (Fin anterior + 1).</text>

              <!-- 3. Seccion Derecha: Cruce Multipunto -->
              <rect x="385" y="72" width="355" height="205" rx="10" class="svg-node svg-node-in"/>
              <text x="562" y="96" text-anchor="middle" fill="#fb7185" font-size="13" font-weight="800">CRUCE MULTIPUNTO (Ej: G₂, G₅, G₇ en L=8)</text>
              <text x="562" y="114" text-anchor="middle" class="svg-label-muted" font-size="11">Cortes impares (3) ➔ 4 bloques alternados P₁ | P₂ | P₁ | P₂</text>

              <!-- Padres -->
              <text x="405" y="142" class="svg-label-muted" font-size="11" font-weight="700">P₁:</text>
              <rect x="435" y="126" width="56" height="24" rx="4" fill="#0284c7"/><text x="463" y="142" text-anchor="middle" fill="#fff" font-size="12" font-weight="700">1 0</text>
              <rect x="499" y="126" width="84" height="24" rx="4" fill="#0284c7" opacity="0.55"/><text x="541" y="142" text-anchor="middle" fill="#e0f2fe" font-size="12" font-weight="700">1 0 0</text>
              <rect x="591" y="126" width="56" height="24" rx="4" fill="#0284c7"/><text x="619" y="142" text-anchor="middle" fill="#fff" font-size="12" font-weight="700">1 0</text>
              <rect x="655" y="126" width="32" height="24" rx="4" fill="#0284c7" opacity="0.55"/><text x="671" y="142" text-anchor="middle" fill="#e0f2fe" font-size="12" font-weight="700">0</text>

              <text x="405" y="174" class="svg-label-muted" font-size="11" font-weight="700">P₂:</text>
              <rect x="435" y="158" width="56" height="24" rx="4" fill="#e11d48" opacity="0.55"/><text x="463" y="174" text-anchor="middle" fill="#ffe4e6" font-size="12" font-weight="700">1 1</text>
              <rect x="499" y="158" width="84" height="24" rx="4" fill="#e11d48"/><text x="541" y="174" text-anchor="middle" fill="#fff" font-size="12" font-weight="700">0 0 0</text>
              <rect x="591" y="158" width="56" height="24" rx="4" fill="#e11d48" opacity="0.55"/><text x="619" y="174" text-anchor="middle" fill="#ffe4e6" font-size="12" font-weight="700">1 0</text>
              <rect x="655" y="158" width="32" height="24" rx="4" fill="#e11d48"/><text x="671" y="174" text-anchor="middle" fill="#fff" font-size="12" font-weight="700">1</text>

              <!-- Lineas de corte G2, G5, G7 -->
              <line x1="495" y1="120" x2="495" y2="252" stroke="#fbbf24" stroke-width="1.8" stroke-dasharray="4,3"/>
              <text x="495" y="264" text-anchor="middle" fill="#fbbf24" font-size="10" font-weight="700">G₂</text>
              <line x1="587" y1="120" x2="587" y2="252" stroke="#fbbf24" stroke-width="1.8" stroke-dasharray="4,3"/>
              <text x="587" y="264" text-anchor="middle" fill="#fbbf24" font-size="10" font-weight="700">G₅</text>
              <line x1="651" y1="120" x2="651" y2="252" stroke="#fbbf24" stroke-width="1.8" stroke-dasharray="4,3"/>
              <text x="651" y="264" text-anchor="middle" fill="#fbbf24" font-size="10" font-weight="700">G₇</text>

              <!-- Hijos -->
              <text x="405" y="212" fill="#10b981" font-size="11" font-weight="700">H₁:</text>
              <rect x="435" y="196" width="56" height="24" rx="4" fill="#0284c7"/><text x="463" y="212" text-anchor="middle" fill="#fff" font-size="12" font-weight="700">1 0</text>
              <rect x="499" y="196" width="84" height="24" rx="4" fill="#e11d48"/><text x="541" y="212" text-anchor="middle" fill="#fff" font-size="12" font-weight="700">0 0 0</text>
              <rect x="591" y="196" width="56" height="24" rx="4" fill="#0284c7"/><text x="619" y="212" text-anchor="middle" fill="#fff" font-size="12" font-weight="700">1 0</text>
              <rect x="655" y="196" width="32" height="24" rx="4" fill="#e11d48"/><text x="671" y="212" text-anchor="middle" fill="#fff" font-size="12" font-weight="700">1</text>

              <text x="405" y="242" fill="#10b981" font-size="11" font-weight="700">H₂:</text>
              <rect x="435" y="226" width="56" height="24" rx="4" fill="#e11d48"/><text x="463" y="242" text-anchor="middle" fill="#fff" font-size="12" font-weight="700">1 1</text>
              <rect x="499" y="226" width="84" height="24" rx="4" fill="#0284c7"/><text x="541" y="242" text-anchor="middle" fill="#fff" font-size="12" font-weight="700">1 0 0</text>
              <rect x="591" y="226" width="56" height="24" rx="4" fill="#e11d48"/><text x="619" y="242" text-anchor="middle" fill="#fff" font-size="12" font-weight="700">1 0</text>
              <rect x="655" y="226" width="32" height="24" rx="4" fill="#0284c7"/><text x="671" y="242" text-anchor="middle" fill="#fff" font-size="12" font-weight="700">0</text>

              <!-- Regla inferior -->
              <rect x="20" y="288" width="720" height="30" rx="6" class="svg-note-bg"/>
              <text x="380" y="308" text-anchor="middle" class="svg-node-text" font-size="11.5" font-weight="600">
                Regla del corte Gₖ: se corta DESPUÉS del bit k (ej. G₄ separa bits 1..4 de bits 5..L). Con n° impar de cortes, asume corte ficticio en 0 (anillo).
              </text>
            </svg>
          `,
          svgDiagram2: `
            <svg viewBox="0 0 760 220" xmlns="http://www.w3.org/2000/svg" class="lab-svg-diagram" role="img" aria-label="Ranking lineal segun R_min y descomposicion de copias esperadas">
              <!-- Panel izquierdo: Ranking Lineal -->
              <rect x="14" y="10" width="420" height="198" rx="10" fill="rgba(56,189,248,0.07)" stroke="#38bdf8" stroke-width="1.2"/>
              <text x="224" y="32" text-anchor="middle" fill="#38bdf8" font-size="12.5" font-weight="700">Ranking Lineal: efecto de R_min sobre las copias cᵢ (N=4)</text>
              <text x="28" y="64" class="svg-node-text" font-size="11" font-weight="700">i=1 (Mejor)</text>
              <rect x="115" y="50" width="180" height="10" rx="2" fill="#38bdf8"/>
              <text x="303" y="59" fill="#7dd3fc" font-size="10">R_min=0 → 2.00</text>
              <rect x="115" y="63" width="135" height="9" rx="2" fill="#34d399"/>
              <text x="258" y="71" fill="#6ee7b7" font-size="9.5">R_min=0.5 → 1.50</text>

              <text x="28" y="104" class="svg-node-text" font-size="11" font-weight="700">i=2</text>
              <rect x="115" y="90" width="120" height="10" rx="2" fill="#38bdf8"/>
              <text x="242" y="99" fill="#7dd3fc" font-size="10">1.33</text>
              <rect x="115" y="103" width="105" height="9" rx="2" fill="#34d399"/>
              <text x="228" y="111" fill="#6ee7b7" font-size="9.5">1.17</text>

              <text x="28" y="142" class="svg-node-text" font-size="11" font-weight="700">i=3</text>
              <rect x="115" y="128" width="60" height="10" rx="2" fill="#38bdf8"/>
              <text x="182" y="137" fill="#7dd3fc" font-size="10">0.67</text>
              <rect x="115" y="141" width="75" height="9" rx="2" fill="#34d399"/>
              <text x="197" y="149" fill="#6ee7b7" font-size="9.5">0.83</text>

              <text x="28" y="180" class="svg-node-text" font-size="11" font-weight="700">i=4 (Peor)</text>
              <rect x="115" y="166" width="4" height="10" rx="1" fill="#fb7185"/>
              <text x="126" y="175" fill="#fb7185" font-size="10">R_min=0 → 0.00 (afuera)</text>
              <rect x="115" y="179" width="45" height="9" rx="2" fill="#34d399"/>
              <text x="167" y="187" fill="#6ee7b7" font-size="9.5">R_min=0.5 → 0.50</text>

              <!-- Panel derecho: Control de Copias Esperadas -->
              <rect x="448" y="10" width="298" height="198" rx="10" fill="rgba(251,191,36,0.08)" stroke="#fbbf24" stroke-width="1.2"/>
              <text x="597" y="32" text-anchor="middle" fill="#fbbf24" font-size="12.5" font-weight="700">Descomponer cᵢ = fᵢ / f̄</text>
              <text x="597" y="54" text-anchor="middle" class="svg-node-text" font-size="12">Ejemplo: cᵢ = 1.72 copias</text>
              <rect x="476" y="72" width="130" height="36" rx="6" fill="#0284c7" stroke="#7dd3fc" stroke-width="1"/>
              <text x="541" y="94" text-anchor="middle" fill="#fff" font-size="12" font-weight="700">Entera: ⌊1.72⌋ = 1</text>
              <rect x="612" y="72" width="108" height="36" rx="6" fill="#d97706" stroke="#fde68a" stroke-width="1"/>
              <text x="666" y="94" text-anchor="middle" fill="#fff" font-size="12" font-weight="700">Decimal: 0.72</text>

              <text x="470" y="136" fill="#7dd3fc" font-size="11" font-weight="700">1° Cupos fijos:</text>
              <text x="470" y="152" class="svg-label-muted" font-size="10.5">Copiás directo las partes enteras.</text>
              <text x="470" y="176" fill="#fbbf24" font-size="11" font-weight="700">2° Cupos faltantes (ΔN):</text>
              <text x="470" y="192" class="svg-label-muted" font-size="10.5">Mayor resto dᵢ o ruleta sobre dᵢ.</text>
            </svg>
          `,
          notasClave: [
            "**Vocabulario oficial UTN FRRe:** **Cromosoma** = Estructura/Individuo; **Gen** = Posición o característica; **Alelo** = Valor del gen (`0` o `1`); **Locus** = Índice de posición ($1 \\dots L$); **Genotipo** = Cadena codificada; **Fenotipo** = Solución decodificada / Aptitud $f_i$.",
            "**Salto Generacional ($G_{gap}$):** Proporción reemplazada por generación: $G_{gap} = N_{\\text{hijos}} / N_{\\text{población}}$. Si $G_{gap} = 1$, reemplazo total; si $0 < G_{gap} < 1$ (ej. con elitismo o selección del $40\\%$), es reemplazo parcial."
          ]
        },
        {
          id: "PRAC-AG-02",
          tema: "ALGORITMOS_GENETICOS",
          tipo: "algoritmo",
          titulo: "Algoritmo de Selección en Hoja: Elitista, Ruleta [00–99], Control de Copias y Ranking",
          etiquetaNaturaleza: "ENTRENAMIENTO PRÁCTICO · NO ES PREGUNTA DE PARCIAL",
          resumen: "Cómo resolver cualquiera de los 4 métodos de selección que toma la cátedra en la Guía TP-AG y parciales.",
          pasos: [
            {
              nro: 1,
              titulo: "Calcular N, Suma Total y aplicar Elitismo (si lo pide)",
              queHago: "Sumo todas las aptitudes $\\sum f_i$ y saco el promedio $\\bar{f}$. Si hay **Elitismo** del $k\\%$, ordeno de mayor a menor y paso directo a esos mejores individuos sin cruzarlos ni mutarlos.",
              formula: "$$S = \\sum_{i=1}^{N} f_i \\qquad \\bar{f} = \\frac{S}{N} \\qquad N_{\\text{elite}} = k\\% \\cdot N$$",
              queEscriboEnHoja: "«Sumo la aptitud total de la población (Σfᵢ = ...) y saco el promedio f̄. Los mejores del elitismo pasan derecho sin cruce ni mutación.»"
            },
            {
              nro: 2,
              titulo: "Método 1 — Selección por Ruleta Proporcional [00–99]",
              queHago: "Divido cada aptitud por la suma total ($p_i = f_i / S$), paso a ranuras redondeando a 100 en total, armo rangos seguidos desde `00` hasta `99` y selecciono leyendo los aleatorios.",
              formula: "$$p_i = \\frac{f_i}{\\sum_{j=1}^N f_j} \\qquad \\text{Ranuras}_i = \\text{round}(100 \\cdot p_i) \\qquad \\text{Rango}_i = [\\text{Fin}_{i-1}+1,\\; \\text{Fin}_{i-1}+\\text{Ranuras}_i]$$",
              queEscriboEnHoja: "«Saco el % de cada individuo, reparto las 100 ranuras del [00-99] sin dejar huecos y elijo mirando dónde cae cada aleatorio r_k.»"
            },
            {
              nro: 3,
              titulo: "Método 2 — Control sobre el Número Esperado de Copias",
              queHago: "Divido cada aptitud por el promedio ($c_i = f_i / \\bar{f}$). Asigno primero las copias enteras $\\lfloor c_i \\rfloor$; los lugares que falten hasta llegar al cupo $M$ se completan por mayor parte decimal (o con una ruleta sobre los decimales $d_i$ si pide azar).",
              formula: "$$c_i = \\frac{f_i}{\\bar{f}} = \\lfloor c_i \\rfloor + d_i \\qquad P_i^{\\text{dec}} = \\frac{d_i}{\\sum_{k=1}^N d_k}$$",
              queEscriboEnHoja: "«Divido cada fᵢ por f̄ para ver cuántas copias le tocan; aseguro las partes enteras y reparto lo que falta usando los restos decimales.»"
            },
            {
              nro: 4,
              titulo: "Método 3 — Selección por Ranking Lineal (Orden Descendente)",
              queHago: "Ordeno primero **de mayor a menor aptitud** ($i=1$ el mejor, $i=n$ el peor) para evitar que un súper-individuo domine todo. Calculo $c_i$ con $R_{\\min}$ (chequeo $\\sum c_i = n$) y reparto enteras + decimales.",
              formula: "$$c_i = R_{\\min} + 2 \\cdot \\frac{(n - i)(1 - R_{\\min})}{n - 1} \\qquad (i = 1:\\text{ mejor},\\; i = n:\\text{ peor})$$",
              queEscriboEnHoja: "«Ordeno del mejor (i=1) al peor (i=n), calculo las copias por Ranking con R_min = ... y reparto enteros más restos decimales.»"
            },
            {
              nro: 5,
              titulo: "Cierre: Ajuste cuando piden un % de la población (ej. 30%, 40%, 50%)",
              queHago: "Si piden seleccionar por ejemplo el $40\\%$ de $N=10$ ($M=4$ lugares), en Ruleta leo solo 4 aleatorios; en Control de Copias/Ranking asigno las enteras sin pasarme de $M$ y cubro lo que falta con los decimales.",
              formula: "$$M_{\\text{objetivo}} = \\text{Porcentaje} \\cdot N \\qquad \\Delta N = M_{\\text{objetivo}} - N_{\\text{enteras asignadas}}$$",
              queEscriboEnHoja: "«Necesito seleccionar M = ... individuos (...%); cubro ... con parte entera y completo los ΔN que faltan por decimal.»"
            }
          ]
        },
        {
          id: "PRAC-AG-03",
          tema: "ALGORITMOS_GENETICOS",
          tipo: "algoritmo",
          titulo: "Algoritmo de Operadores Genéticos: Cruces (Simple, Multipunto, Binomial) y Mutación Térmica",
          etiquetaNaturaleza: "ENTRENAMIENTO PRÁCTICO · NO ES PREGUNTA DE PARCIAL",
          resumen: "Reglas bit a bit de cada operador de recombinación y cálculo exacto de probabilidad de mutación adaptativa.",
          pasos: [
            {
              nro: 1,
              titulo: "Cruza Simple en Gen k (Gk)",
              queHago: "Corto **después del bit $k$** ($1\\dots k \\mid k+1\\dots L$). Hijo 1 toma comienzo de P1 + cola de P2. Para Hijo 2, miro bien si pide cruce clásico (comienzo P2 + cola P1) o **complemento binario** ($\\overline{H_1}$).",
              formula: "$$H_1 = P_1[1..k] \\parallel P_2[k+1..L] \\qquad H_2^{\\text{clásico}} = P_2[1..k] \\parallel P_1[k+1..L] \\quad \\text{ó} \\quad H_2^{\\text{comp}} = \\overline{H_1}$$",
              queEscriboEnHoja: "«Corto después del bit k: Hijo 1 junta la primera parte de P1 con la cola de P2, y armo Hijo 2 según lo que pide el enunciado.»"
            },
            {
              nro: 2,
              titulo: "Cruza Multipunto en Gk1, Gk2, ..., Gkm",
              queHago: "Trazo líneas verticales después de cada gen indicado. Si son cortes impares (ej. 3 cortes en `G2, G5, G7`), se asume anillo y alterno bloques entre P1 y P2 para ambos hijos.",
              formula: "$$H_1 = \\text{Seg}_1(P_1) \\parallel \\text{Seg}_2(P_2) \\parallel \\text{Seg}_3(P_1) \\parallel \\dots$$",
              queEscriboEnHoja: "«Divido en segmentos tras cada gen indicado y voy alternando bloques de P1 y P2 para sacar Hijo 1 y Hijo 2.»"
            },
            {
              nro: 3,
              titulo: "Cruza Binomial / Uniforme (Ranuras gen a gen)",
              queHago: "Reparto `[00..(100p-1)]` para Padre 1 y `[100p..99]` para Padre 2 (`00-49`/`50-99` si es Uniforme). Miro cada aleatorio $r_j$ gen por gen para armar Hijo 1; y para Hijo 2 sigo el criterio pedido (**no elegidos** vs **complemento**).",
              svgDiagram: `
                <svg viewBox="0 0 760 190" xmlns="http://www.w3.org/2000/svg" class="lab-svg-diagram" role="img" aria-label="Cruce Binomial gen a gen y dos formas de Hijo 2">
                  <text x="380" y="22" text-anchor="middle" fill="#38bdf8" font-size="12" font-weight="700">Cruce Binomial (p_Madre=0.6 → [00–59], p_Padre=0.4 → [60–99])</text>
                  <text x="26" y="54" class="svg-label-muted" font-size="11" font-weight="700">Locus / rⱼ:</text>
                  <rect x="120" y="38" width="60" height="22" rx="4" fill="#0d9488"/><text x="150" y="53" text-anchor="middle" fill="#fff" font-size="10.5" font-weight="700">j1: r=14 (M)</text>
                  <rect x="188" y="38" width="60" height="22" rx="4" fill="#7c3aed"/><text x="218" y="53" text-anchor="middle" fill="#fff" font-size="10.5" font-weight="700">j2: r=78 (P)</text>
                  <rect x="256" y="38" width="60" height="22" rx="4" fill="#0d9488"/><text x="286" y="53" text-anchor="middle" fill="#fff" font-size="10.5" font-weight="700">j3: r=42 (M)</text>
                  <rect x="324" y="38" width="60" height="22" rx="4" fill="#7c3aed"/><text x="354" y="53" text-anchor="middle" fill="#fff" font-size="10.5" font-weight="700">j4: r=65 (P)</text>

                  <text x="26" y="84" fill="#34d399" font-size="11" font-weight="700">Madre (M):</text>
                  <text x="150" y="84" text-anchor="middle" fill="#6ee7b7" font-size="13" font-weight="700">1</text>
                  <text x="218" y="84" text-anchor="middle" class="svg-label-muted" font-size="12">1</text>
                  <text x="286" y="84" text-anchor="middle" fill="#6ee7b7" font-size="13" font-weight="700">0</text>
                  <text x="354" y="84" text-anchor="middle" class="svg-label-muted" font-size="12">1</text>

                  <text x="26" y="108" fill="#c4b5fd" font-size="11" font-weight="700">Padre (P):</text>
                  <text x="150" y="108" text-anchor="middle" class="svg-label-muted" font-size="12">1</text>
                  <text x="218" y="108" text-anchor="middle" fill="#c4b5fd" font-size="13" font-weight="700">0</text>
                  <text x="286" y="108" text-anchor="middle" class="svg-label-muted" font-size="12">1</text>
                  <text x="354" y="108" text-anchor="middle" fill="#c4b5fd" font-size="13" font-weight="700">1</text>

                  <text x="26" y="138" fill="#38bdf8" font-size="11.5" font-weight="700">Hijo 1:</text>
                  <rect x="135" y="122" width="30" height="22" rx="4" fill="#0d9488"/><text x="150" y="137" text-anchor="middle" fill="#fff" font-size="12" font-weight="700">1</text>
                  <rect x="203" y="122" width="30" height="22" rx="4" fill="#7c3aed"/><text x="218" y="137" text-anchor="middle" fill="#fff" font-size="12" font-weight="700">0</text>
                  <rect x="271" y="122" width="30" height="22" rx="4" fill="#0d9488"/><text x="286" y="137" text-anchor="middle" fill="#fff" font-size="12" font-weight="700">0</text>
                  <rect x="339" y="122" width="30" height="22" rx="4" fill="#7c3aed"/><text x="354" y="137" text-anchor="middle" fill="#fff" font-size="12" font-weight="700">1</text>

                  <!-- Comparacion Hijo 2 derecha -->
                  <rect x="410" y="38" width="332" height="132" rx="8" fill="rgba(251,191,36,0.08)" stroke="#fbbf24" stroke-width="1"/>
                  <text x="576" y="60" text-anchor="middle" fill="#fbbf24" font-size="11.5" font-weight="700">¡Atención en Hijo 2! (M y P empatan en j1 y j4)</text>
                  <text x="424" y="88" fill="#34d399" font-size="11.5" font-weight="700">Opción A (genes no elegidos):</text>
                  <text x="424" y="106" fill="#e2e8f0" font-size="11.5">H₂ = [P(1), M(1), P(1), M(1)] = 1 1 1 1</text>
                  <text x="424" y="134" fill="#fb7185" font-size="11.5" font-weight="700">Opción B (complemento NOT(H₁)):</text>
                  <text x="424" y="152" fill="#e2e8f0" font-size="11.5">H₂ = NOT(1 0 0 1) = 0 1 1 0  (¡cambia!)</text>
                  <text x="26" y="170" class="svg-label-muted" font-size="10.5">H₁ = 1 0 0 1</text>
                </svg>
              `,
              formula: "$$r_j \\in [00,\\, 100p-1] \\implies H_1[j] = P_1[j], \\qquad r_j \\in [100p,\\, 99] \\implies H_1[j] = P_2[j]$$",
              queEscriboEnHoja: "«Reparto [00-..] para Madre y [..-99] para Padre; voy bit a bit con los aleatorios para armar H1 y saco H2 por [no elegidos / complemento].»"
            },
            {
              nro: 4,
              titulo: "Mutación Simple vs. Adaptativa por Temperatura (Ascendente / Descendente)",
              queHago: "En simple doy vuelta un bit. En Temperatura **arranco en $t=0$** y ajusto linealmente con $\\lambda$ sin salirme de $[P_{\\min}, P_{\\max}]$. Si aclara **reinicio cíclico**, uso $t_{\\text{rel}} = t \\pmod{T}$ donde $T = \\frac{P_{\\max}-P_{\\min}}{\\lambda}+1$.",
              formula: "$$\\text{Asc: } p_m(t) = \\min(P_{\\max},\\; P_{\\min} + \\lambda \\cdot t_{\\text{rel}}) \\qquad \\text{Desc: } p_m(t) = \\max(P_{\\min},\\; P_{\\max} - \\lambda \\cdot t_{\\text{rel}})$$",
              queEscriboEnHoja: "«Tomando t=0 como inicio, avanzo/bajo la probabilidad con paso λ dentro de [P_min, P_max] (o reinicio ciclo mod T si lo pide).»"
            },
            {
              nro: 5,
              titulo: "Justificación conceptual: Temperatura vs. Convergencia",
              queHago: "Si preguntan si Temperatura mide qué tan parecida está la población, la respuesta es **NO**: solo sigue al reloj $t$. El método que sí mide diversidad genética real es **Convergencia**.",
              formula: "$$\\text{Temperatura } \\implies f(t) \\text{ (exógena)} \\qquad \\text{Convergencia } \\implies f(\\text{diversidad}) = \\frac{N_{\\text{distintos}}}{N_{\\text{total}}}$$",
              queEscriboEnHoja: "«Temperatura NO mira la homogeneidad de la población porque solo depende del tiempo t; la que mide diversidad es Convergencia.»"
            }
          ]
        },
        {
          id: "PRAC-AG-04",
          tema: "ALGORITMOS_GENETICOS",
          tipo: "plantilla",
          titulo: "Plantillas de Tablas para la Hoja en Blanco (Ruleta y Control de Copias / Ranking)",
          etiquetaNaturaleza: "ENTRENAMIENTO PRÁCTICO · NO ES PREGUNTA DE PARCIAL",
          resumen: "Columnas exactas de la presentación oficial (`SEM08-AlgGen_2024.pptx` Slide 14 y Guía TP-AG) para copiar directo en tu hoja.",
          tablaPlantilla: {
            tituloTabla: "1) Tabla de Selección por Ruleta [00–99] (Orden original o de población)",
            columnas: [
              "Individuo",
              "Aptitud $f_i$",
              "Norm. $p_i = \\frac{f_i}{\\sum f}$",
              "Ranuras $\\text{round}(100 p_i)$",
              "Asignación $[00\\text{–}99]$",
              "Copias (Aleatorios)"
            ],
            filas: [
              ["$I_1$", "$f_1$", "$f_1 / S$", "$R_1$", "$[00\\text{ a }(R_1-1)]$", "Contar cuántos $r_k$ caen aquí"],
              ["$I_2 \\dots I_N$", "$f_i$", "$f_i / S$", "$R_i$", "$[\\text{Fin}_{i-1}+1\\text{ a }(\\text{Fin}_{i-1}+R_i)]$", "Anotar cuáles $r_k$ lo eligieron"],
              ["**Control Total**", "$\\mathbf{\\sum f_i = S}$", "$\\mathbf{\\sum p_i = 1.00}$", "$\\mathbf{\\sum R_i = 100}$", "**Termina exacto en 99**", "**Total elegidos = $M$**"]
            ]
          },
          tablaPlantilla2: {
            tituloTabla: "2) Tabla de Ranking Lineal / Control de Copias Esperadas",
            columnas: [
              "Orden $i$ (1=Mejor)",
              "Individuo",
              "Aptitud $f_i$",
              "Copias $c_i$",
              "Entera $\\lfloor c_i \\rfloor$",
              "Decimal $d_i = c_i - \\lfloor c_i \\rfloor$",
              "Extra (Orden / Ruleta $d_i$)",
              "Total"
            ],
            filas: [
              ["$1$ (Más apto)", "$I_{\\text{mejor}}$", "$\\max f$", "$2 - R_{\\min}$ (o $f/\\bar{f}$)", "$\\lfloor c_1 \\rfloor$", "$d_1$", "$+1$ si entra en $\\Delta N$", "Suma"],
              ["$\\vdots$", "$\\dots$", "$\\dots$", "$\\dots$", "$\\dots$", "$\\dots$", "$\\dots$", "$\\dots$"],
              ["$n$ (Menos apto)", "$I_{\\text{peor}}$", "$\\min f$", "$R_{\\min}$ (o $f/\\bar{f}$)", "$\\lfloor c_n \\rfloor$", "$d_n$", "$0$ o sorteo", "Suma"],
              ["**Control Total**", "—", "$\\sum f_i$", "$\\mathbf{\\sum c_i = N}$", "$\\mathbf{N_{\\text{fijas}}}$", "$\\mathbf{\\sum d_i = N - N_{\\text{fijas}}}$", "$\\mathbf{\\Delta N = M - N_{\\text{fijas}}}$", "$\\mathbf{= M}$"]
            ]
          },
          tipHoja: "💡 **Regla de control automático:** Antes de leer los aleatorios, verificá 3 sumas en tu tabla: en Ruleta $\\sum p_i = 1.00$ y $\\sum \\text{Ranuras} = 100$ (cerrando en `99`); en Control de Copias / Ranking $\\sum c_i = N$. Si algo no cierra, arreglalo antes de seguir!"
        },
        {
          id: "PRAC-AG-05",
          tema: "ALGORITMOS_GENETICOS",
          tipo: "formula",
          titulo: "Flashcard 1: Fórmula Oficial de Selección por Ranking Lineal y Efecto de R_min",
          etiquetaNaturaleza: "ENTRENAMIENTO PRÁCTICO · NO ES PREGUNTA DE PARCIAL",
          preguntaFrente: "Ordenaste la población de mayor a menor aptitud ($i=1$ el mejor, $i=n$ el peor). ¿Cuál es la fórmula de copias esperadas $c_i$ en Ranking Lineal, cuánto suman todos los $c_i$ y qué pasa si $R_{\\min} = 0$, $0.5$ o $1.0$?",
          respuestaDorso: "**Fórmula oficial de cátedra (cantidad de copias esperadas):**\n$$c_i = R_{\\min} + 2 \\cdot \\frac{(n - i)(1 - R_{\\min})}{n - 1}, \\qquad i \\in \\{1, 2, \\dots, n\\}$$\n\n* **Verificación rápida en hoja:** El mejor recibe $c_1 = 2 - R_{\\min}$, el peor recibe $c_n = R_{\\min}$ y la suma total siempre da $\\sum_{i=1}^n c_i = n$.\n* *Nota:* Si algún ejercicio pide probabilidad $P(i)$ en lugar de copias $c_i$, dividís por $n$: $P(i) = c_i / n$.\n* **Interpretación de $R_{\\min}$:**\n  * **$R_{\\min} = 0$:** Máxima presión selectiva ($c_1 = 2$, $c_n = 0$).\n  * **$R_{\\min} = 0.5$:** Presión moderada ($c_1 = 1.5$, $c_n = 0.5$).\n  * **$R_{\\min} = 1.0$:** Presión nula / uniforme ($c_i = 1$ para todos los individuos)."
        },
        {
          id: "PRAC-AG-06",
          tema: "ALGORITMOS_GENETICOS",
          tipo: "formula",
          titulo: "Flashcard 2: Control de Copias Esperadas y Criterios para la Parte Decimal",
          etiquetaNaturaleza: "ENTRENAMIENTO PRÁCTICO · NO ES PREGUNTA DE PARCIAL",
          preguntaFrente: "¿Cómo se calcula el número esperado de copias $c_i$ en Control de Copias y cuáles son las **2 formas** de repartir los cupos faltantes con la parte decimal $d_i$?",
          respuestaDorso: "**Fórmula de copias esperadas:**\n$$\\bar{f} = \\frac{1}{N} \\sum_{j=1}^N f_j \\implies c_i = \\frac{f_i}{\\bar{f}} = N \\cdot \\frac{f_i}{\\sum f_j}$$\nDescomponemos $c_i = \\lfloor c_i \\rfloor + d_i$, asignamos primero la parte entera $\\lfloor c_i \\rfloor$ y quedan $\\Delta N = M - \\sum \\lfloor c_i \\rfloor$ cupos.\n\n* **Criterio A (Determinista — Guía Ej. 07 / Parcial 19-11-2025):** Se ordenan los restos $d_i$ de **mayor a menor** y se asigna 1 copia adicional a los primeros $\\Delta N$ mayores decimales.\n* **Criterio B (Estocástico — Guía Ej. 01-e / 07-b):** Se normalizan los decimales $P_i^{\\text{dec}} = \\frac{d_i}{\\sum d_k}$, se arma una **ruleta $[00\\text{–}99]$ con esas probabilidades** y se sortean los $\\Delta N$ cupos con los aleatorios dados."
        },
        {
          id: "PRAC-AG-07",
          tema: "ALGORITMOS_GENETICOS",
          tipo: "formula",
          titulo: "Flashcard 3: Mutación Adaptativa por Temperatura — Estándar vs. Reinicio Cíclico",
          etiquetaNaturaleza: "ENTRENAMIENTO PRÁCTICO · NO ES PREGUNTA DE PARCIAL",
          preguntaFrente: "Te dan $P_{\\min} = 0.001$, $P_{\\max} = 0.1$, $\\lambda = 0.001$ y arranca en $t = 0$. ¿Cómo calculás $p_m(200)$, $p_m(320)$ y $p_m(435)$ en esquema **estándar** vs. cuando el enunciado dice **«al alcanzar $P_{\\max}$, la siguiente toma $P_{\\min}$ y reinicia»** (`Alg_gen_Adapt_Temp`)?",
          respuestaDorso: "* **Esquema Estándar (se estabiliza en el tope):**\n  * Temperatura Ascendente: $p_m(t) = \\min(P_{\\max},\\; P_{\\min} + \\lambda \\cdot t)$.\n  * Temperatura Descendente: $p_m(t) = \\max(P_{\\min},\\; P_{\\max} - \\lambda \\cdot t)$.\n  * Como se alcanza $P_{\\max} = 0.1$ en $t = \\frac{0.1 - 0.001}{0.001} = 99$, para $t \\ge 99$ quedaría fijo en $0.100$.\n* **Esquema con Reinicio Cíclico (trampa clásica de `Alg_gen_Adapt_Temp.pdf`):**\n  * De $t = 0$ a $t = 99$ hay exactamente **$T = 99 + 1 = 100$ generaciones por ciclo**. En $t = 100$ reinicia a $P_{\\min} = 0.001$.\n  * Usás aritmética modular $t_{\\text{rel}} = t \\pmod{100}$:\n    * $t = 200 \\implies t_{\\text{rel}} = 0 \\implies p_m(200) = 0.001 + 0.001(0) = \\mathbf{0.001}$\n    * $t = 320 \\implies t_{\\text{rel}} = 20 \\implies p_m(320) = 0.001 + 0.001(20) = \\mathbf{0.021}$\n    * $t = 435 \\implies t_{\\text{rel}} = 35 \\implies p_m(435) = 0.001 + 0.001(35) = \\mathbf{0.036}$",
          svgDiagram: `
            <svg viewBox="0 0 760 190" xmlns="http://www.w3.org/2000/svg" class="lab-svg-diagram" role="img" aria-label="Mutacion por Temperatura Estandar vs Reinicio Ciclico">
              <text x="380" y="22" text-anchor="middle" fill="#38bdf8" font-size="12.5" font-weight="700">Temperatura Ascendente (t=0): Estándar (techo plano) vs. Reinicio Cíclico (diente de sierra)</text>
              <line x1="65" y1="150" x2="710" y2="150" stroke="#64748b" stroke-width="1.3"/>
              <line x1="65" y1="42" x2="65" y2="155" stroke="#64748b" stroke-width="1.3"/>
              <text x="58" y="54" text-anchor="end" fill="#fb7185" font-size="10">0.100</text>
              <text x="58" y="148" text-anchor="end" fill="#34d399" font-size="10">0.001</text>
              <line x1="65" y1="50" x2="700" y2="50" stroke="#334155" stroke-width="1" stroke-dasharray="3,3"/>

              <!-- Eje t ticks: t=0 -> 80, t=100 -> 200, t=200 -> 320, t=300 -> 440, t=400 -> 560, t=500 -> 680 -->
              <text x="80" y="166" text-anchor="middle" class="svg-label-muted" font-size="10">t=0</text>
              <text x="200" y="166" text-anchor="middle" class="svg-label-muted" font-size="10">100</text>
              <text x="320" y="166" text-anchor="middle" fill="#fbbf24" font-size="10" font-weight="700">200</text>
              <text x="440" y="166" text-anchor="middle" class="svg-label-muted" font-size="10">300</text>
              <text x="560" y="166" text-anchor="middle" class="svg-label-muted" font-size="10">400</text>
              <text x="680" y="166" text-anchor="middle" class="svg-label-muted" font-size="10">500</text>

              <!-- Esquema estandar (punteado): sube 80..199 hasta y=50 y sigue plano -->
              <polyline points="80,145 198,50 690,50" fill="none" stroke="#94a3b8" stroke-width="2" stroke-dasharray="6,4"/>
              <text x="605" y="42" fill="#cbd5e1" font-size="10.5">Estándar (se clava en P_max)</text>

              <!-- Esquema ciclico: diente de sierra T=100 -->
              <polyline points="80,145 198,50 200,145 318,50 320,145 438,50 440,145 558,50 560,145 678,50" fill="none" stroke="#38bdf8" stroke-width="2.5"/>

              <!-- Puntos ejemplo: t=200 (x=320, y=145), t=320 (x=464, y=126), t=435 (x=602, y=111) -->
              <circle cx="320" cy="145" r="4.5" fill="#fbbf24"/>
              <text x="320" y="136" text-anchor="middle" fill="#fbbf24" font-size="10" font-weight="700">200 → 0.001</text>
              <circle cx="464" cy="126" r="4.5" fill="#34d399"/>
              <text x="466" y="116" text-anchor="middle" fill="#34d399" font-size="10" font-weight="700">320 → 0.021</text>
              <circle cx="602" cy="111" r="4.5" fill="#fb7185"/>
              <text x="625" y="102" text-anchor="middle" fill="#fb7185" font-size="10" font-weight="700">435 → 0.036</text>
            </svg>
          `
        },
        {
          id: "PRAC-AG-08",
          tema: "ALGORITMOS_GENETICOS",
          tipo: "formula",
          titulo: "Flashcard 4: Cruce Binomial (Ranuras y Hijo 2) + Problema Criptoaritmético (Ej. 08)",
          etiquetaNaturaleza: "ENTRENAMIENTO PRÁCTICO · NO ES PREGUNTA DE PARCIAL",
          preguntaFrente: "1) En Cruce Binomial con $(p_P = 0.6, p_M = 0.4)$, ¿cómo armás las ranuras y las dos variantes del Hijo 2? 2) Si te piden modelar `SEND + MORE = MONEY` en AG (Ej. 08), ¿qué cromosoma, fitness y cruce proponés?",
          respuestaDorso: "* **1) Cruce Binomial (`00-59` vs `60-99`):**\n  * Si $p_{\\text{Madre}} = 0.6$ $\\to$ ranuras `[00–59]`; $p_{\\text{Padre}} = 0.4$ $\\to$ ranuras `[60–99]`.\n  * Si $p = 0.5$ se llama **Cruce Uniforme**.\n  * **Segundo hijo — Variante A (genes no elegidos):** En cada bit $j$, si Hijo 1 tomó de Madre, Hijo 2 toma de Padre (ojo: si ambos padres tienen el mismo bit, Hijo 2 repite ese bit).\n  * **Segundo hijo — Variante B (complemento binario):** $H_2 = \\text{NOT}(H_1)$, invirtiendo cada bit de Hijo 1.\n* **2) Criptoaritmética (`SEND + MORE = MONEY` — Guía Ej. 08):**\n  * **Cromosoma:** Permutación de 10 posiciones con los dígitos `{0..9}` (8 letras únicas `S,E,N,D,M,O,R,Y` + 2 huecos/comodines; **restringiendo $S \\ne 0$ y $M \\ne 0$**).\n  * **Fitness:** Minimizar el error absoluto de la suma: $f = |(\\text{SEND} + \\text{MORE}) - \\text{MONEY}|$ (o maximizar $K - |\\dots|$), penalizando dígitos repetidos.\n  * **Cruce:** NO usar cruce binario clásico porque repite dígitos; usar **cruce basado en orden (OX / PMX / CX)** que preserva permutaciones sin dígitos duplicados."
        },
        {
          id: "PRAC-AG-09",
          tema: "ALGORITMOS_GENETICOS",
          tipo: "trampa",
          titulo: "Las 6 Trampas Clásicas de Examen en Algoritmos Genéticos",
          etiquetaNaturaleza: "ENTRENAMIENTO PRÁCTICO · NO ES PREGUNTA DE PARCIAL",
          resumen: "Errores mecánicos y conceptuales que aparecen en parciales y recuperatorios de UTN FRRe.",
          trampas: [
            "**Arrancar en $t = 1$ en lugar de $t = 0$ en Mutación por Temperatura:** La cátedra fija explícitamente $t = 0$ para el valor inicial (`0 -> 0.001`, `99 -> 0.1`). Si contás desde $1$, te corrés 1 paso toda la tabla (y en ciclos de 100 te desfasás en `200`, `320`, `435`).",
            "**Invertir el orden en Ranking Lineal:** Siempre se ordena de **MAYOR a MENOR** aptitud ($i=1$ es el mejor con $c_1 = 2 - R_{\\min}$, $i=n$ es el peor con $c_n = R_{\\min}$). Si ordenás ascendente, ¡le das más copias al peor!",
            "**Numerar ranuras de Ruleta como `01–100` o solapar extremos:** La ruleta usa `[00–99]`. Si un individuo tiene 6 ranuras desde `00`, su intervalo es **`00–05`** (no `00–06`, que tendría 7 ranuras) y el siguiente arranca en **`06`**.",
            "**Confundir los dos métodos de Hijo 2 en Cruce Binomial:** Obtener Hijo 2 con **genes no seleccionados** da un resultado distinto al **complemento binario del Hijo 1** en cualquier locus donde Padre y Madre tenían el mismo bit. Leé qué pide la consigna.",
            "**Decir que Temperatura mide homogeneidad de la población:** FALSO de parcial. La Temperatura (Ascendente o Descendente) solo mira la generación $t$. La única que mide diversidad real de cromosomas es la **Mutación Adaptativa por Convergencia**.",
            "**Cruzar o mutar a los individuos Elitistas:** Por definición de cátedra, los seleccionados por **elitismo** pasan directo e intactos a $t+1$ y **no participan ni de cruza ni de mutación**."
          ]
        }
      ]
    },
    {
      id: "NAIVE_BAYES",
      nombre: "Clasificador Naïve Bayes (Histogramas y Distribución Normal)",
      badge: "Naïve Bayes",
      icono: "📊",
      ponderacion: "20% – 25% del Parcial Práctico",
      referenciaCatedra: "Guía Práctica Naïve Bayes · Parciales 22/06/2015, 2020/2021, 2023 (Tema 1/2) y Cuestionario Moodle 05",
      referenciaLinks: [
        { label: "guia_practica_naive_bayes.pdf", path: "MODELOS_ORIGINALES/4_GUIAS_PRACTICAS_CATEDRA/guia_practica_naive_bayes.pdf", kind: "pdf" },
        { label: "hoja_de_formulas_segundo_parcial.pdf", path: "MODELOS_ORIGINALES/4_GUIAS_PRACTICAS_CATEDRA/hoja_de_formulas_segundo_parcial.pdf", kind: "pdf" },
        { label: "cuestionario_moodle_05_nb_perceptron_mlp.pdf", path: "MODELOS_ORIGINALES/3_CUESTIONARIOS_MOODLE_2DO_PARCIAL/cuestionario_moodle_05_nb_perceptron_mlp.pdf", kind: "pdf" },
        { label: "06_naive_bayes_histogramas.md", path: "GUIAS_PASO_A_PASO/06_naive_bayes_histogramas.md", kind: "md" }
      ],
      tiempoSugerido: "15 - 20 min en hoja",
      objetivo: "Clasificar nuevas instancias paso a paso tanto con tablas de Histogramas (bins) como con Distribución Normal Gaussiana, aplicando los denominadores correctos (N_k vs N_total), límites de intervalo (a, b], notación científica, suavizado de Laplace ante ceros y decisión MAP.",
      items: [
        {
          id: "PRAC-NB-01",
          tema: "NAIVE_BAYES",
          tipo: "diagrama",
          titulo: "Flujo Naïve Bayes: Histogramas (Bins) vs. Distribución Gaussiana Continua",
          etiquetaNaturaleza: "ENTRENAMIENTO PRÁCTICO · NO ES PREGUNTA DE PARCIAL",
          resumen: "Cómo elegir el método según el enunciado y evitar el error más frecuente: confundir el denominador N_k con N_total.",
          svgDiagram: `
            <svg viewBox="0 0 760 320" xmlns="http://www.w3.org/2000/svg" class="lab-svg-diagram" role="img" aria-label="Diagrama comparativo Naive Bayes por Histogramas vs Gaussiano">
              <defs>
                <marker id="nb-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8" />
                </marker>
                <marker id="nb-arrow-g" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#10b981" />
                </marker>
              </defs>

              <!-- Rama Izquierda: Histogramas / Bins -->
              <rect x="20" y="14" width="348" height="205" rx="10" class="svg-node svg-node-in"/>
              <text x="194" y="38" text-anchor="middle" fill="#38bdf8" font-size="13" font-weight="800">MODO A: HISTOGRAMAS (BINS)</text>
              <text x="194" y="55" text-anchor="middle" class="svg-label-muted" font-size="11">Si el enunciado da tabla de intervalos y frecuencias</text>

              <!-- Bins rect -->
              <rect x="42" y="72" width="76" height="44" fill="#1e293b" stroke="#64748b"/>
              <text x="80" y="92" text-anchor="middle" class="svg-label-muted" font-size="10">(-∞, -3]</text>
              <text x="80" y="107" text-anchor="middle" class="svg-node-text" font-size="11" font-weight="700">1</text>

              <rect x="118" y="72" width="76" height="44" fill="#1e293b" stroke="#64748b"/>
              <text x="156" y="92" text-anchor="middle" class="svg-label-muted" font-size="10">(-3, 2]</text>
              <text x="156" y="107" text-anchor="middle" class="svg-node-text" font-size="11" font-weight="700">10.500</text>

              <rect x="194" y="72" width="76" height="44" fill="#0369a1" stroke="#38bdf8" stroke-width="2"/>
              <text x="232" y="92" text-anchor="middle" fill="#e0f2fe" font-size="10" font-weight="700">(2, 5]</text>
              <text x="232" y="107" text-anchor="middle" fill="#ffffff" font-size="12" font-weight="800">5.500</text>

              <rect x="270" y="72" width="76" height="44" fill="#1e293b" stroke="#64748b"/>
              <text x="308" y="92" text-anchor="middle" class="svg-label-muted" font-size="10">(5, +∞)</text>
              <text x="308" y="107" text-anchor="middle" class="svg-node-text" font-size="11" font-weight="700">15.000</text>

              <line x1="232" y1="142" x2="232" y2="120" stroke="#38bdf8" stroke-width="2" marker-end="url(#nb-arrow)"/>
              <text x="232" y="158" text-anchor="middle" fill="#38bdf8" font-size="11" font-weight="700">Ej: x = 2.8 cae en (2, 5]</text>

              <rect x="38" y="170" width="312" height="38" rx="6" fill="rgba(251, 113, 133, 0.14)" stroke="#fb7185"/>
              <text x="194" y="186" text-anchor="middle" fill="#fb7185" font-size="11" font-weight="700">¡NO dividir por N_total!</text>
              <text x="194" y="201" text-anchor="middle" class="svg-node-text" font-size="11">P(Bin | Cₖ) = Frec(Bin, Cₖ) / Nₖ  (total de ESA clase)</text>

              <!-- Rama Derecha: Gaussiana -->
              <rect x="392" y="14" width="348" height="205" rx="10" class="svg-node svg-node-in"/>
              <text x="566" y="38" text-anchor="middle" fill="#10b981" font-size="13" font-weight="800">MODO B: GAUSSIANA CONTINUA</text>
              <text x="566" y="55" text-anchor="middle" class="svg-label-muted" font-size="11">Si te dan μ y σ (o muestras sueltas sin bins)</text>

              <!-- Curvas Gaussianas estilizadas -->
              <line x1="418" y1="145" x2="718" y2="145" stroke="#64748b" stroke-width="1.2"/>
              <path d="M 424 144 Q 465 142 488 92 Q 505 62 522 92 Q 545 142 586 144" fill="rgba(56, 189, 248, 0.18)" stroke="#38bdf8" stroke-width="2"/>
              <path d="M 526 144 Q 570 142 595 104 Q 615 76 635 104 Q 660 142 706 144" fill="rgba(16, 185, 129, 0.18)" stroke="#10b981" stroke-width="2"/>
              <text x="505" y="72" text-anchor="middle" fill="#38bdf8" font-size="10.5" font-weight="700">C₁ (μ₁, σ₁)</text>
              <text x="615" y="82" text-anchor="middle" fill="#10b981" font-size="10.5" font-weight="700">C₂ (μ₂, σ₂)</text>

              <!-- Linea vertical de consulta x_i -->
              <line x1="548" y1="68" x2="548" y2="150" stroke="#fbbf24" stroke-width="2" stroke-dasharray="4,3"/>
              <circle cx="548" cy="133" r="4" fill="#38bdf8"/>
              <circle cx="548" cy="141" r="4" fill="#10b981"/>
              <text x="548" y="164" text-anchor="middle" fill="#fbbf24" font-size="11" font-weight="700">xᵢ (consulta)</text>

              <rect x="410" y="172" width="312" height="36" rx="6" fill="rgba(16, 185, 129, 0.14)" stroke="#10b981"/>
              <text x="566" y="194" text-anchor="middle" class="svg-node-text" font-size="11.5" font-weight="600">p(xᵢ | Cₖ) = [1 / (σ√2π)] · exp(−(xᵢ − μ)² / 2σ²)</text>

              <!-- Convergencia MAP inferior -->
              <line x1="194" y1="219" x2="310" y2="245" stroke="#38bdf8" stroke-width="2" marker-end="url(#nb-arrow)"/>
              <line x1="566" y1="219" x2="450" y2="245" stroke="#10b981" stroke-width="2" marker-end="url(#nb-arrow-g)"/>

              <rect x="90" y="246" width="580" height="58" rx="8" class="svg-note-bg"/>
              <text x="380" y="269" text-anchor="middle" fill="#fbbf24" font-size="12.5" font-weight="800">
                DECISIÓN FINAL (Regla MAP — ArgMax): Score(Cₖ) = P(Cₖ) · Π p(xᵢ | Cₖ)
              </text>
              <text x="380" y="290" text-anchor="middle" class="svg-node-text" font-size="11.5">
                Se elige C* con MAYOR Score (si piden porcentaje exacto: P(Cₖ | x) = Score(Cₖ) / Σ Score(Cⱼ))
              </text>
            </svg>
          `,
          svgDiagram2: `
            <svg viewBox="0 0 760 205" xmlns="http://www.w3.org/2000/svg" class="lab-svg-diagram" role="img" aria-label="Bordes de intervalo en histogramas, suavizado de Laplace y pico de densidad mayor a 1">
              <!-- Panel 1: Bordes (a, b] -->
              <rect x="14" y="10" width="234" height="184" rx="10" fill="rgba(56,189,248,0.08)" stroke="#38bdf8" stroke-width="1"/>
              <text x="131" y="32" text-anchor="middle" fill="#38bdf8" font-size="11.5" font-weight="700">1. Bordes abiertos ( vs cerrados ]</text>
              <line x1="30" y1="95" x2="230" y2="95" stroke="#64748b" stroke-width="2"/>
              <line x1="130" y1="74" x2="130" y2="116" stroke="#fbbf24" stroke-width="1.5" stroke-dasharray="3,2"/>
              <text x="80" y="78" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">(-∞, -12]</text>
              <text x="180" y="78" text-anchor="middle" fill="#94a3b8" font-size="10.5">(-12, -1]</text>
              <circle cx="122" cy="95" r="5" fill="#34d399"/>
              <circle cx="138" cy="95" r="5" fill="#0b1120" stroke="#94a3b8" stroke-width="2"/>
              <text x="131" y="138" text-anchor="middle" fill="#fbbf24" font-size="11" font-weight="700">x = -12 entra en ]</text>
              <text x="131" y="156" text-anchor="middle" class="svg-label-muted" font-size="10">] incluye el borde</text>
              <text x="131" y="171" text-anchor="middle" class="svg-label-muted" font-size="10">( lo deja afuera</text>

              <!-- Panel 2: Cero vs Laplace -->
              <rect x="263" y="10" width="234" height="184" rx="10" fill="rgba(251,113,133,0.08)" stroke="#fb7185" stroke-width="1"/>
              <text x="380" y="32" text-anchor="middle" fill="#fb7185" font-size="11.5" font-weight="700">2. Frecuencia 0 vs Laplace (+1)</text>
              <rect x="278" y="48" width="204" height="46" rx="6" fill="rgba(251,113,133,0.14)"/>
              <text x="380" y="67" text-anchor="middle" fill="#fb7185" font-size="11" font-weight="700">Sin corregir: 0.7 · 0.8 · (0/Nₖ) = 0</text>
              <text x="380" y="84" text-anchor="middle" class="svg-label-muted" font-size="10">Un solo cero borra toda la clase</text>
              <rect x="278" y="108" width="204" height="66" rx="6" fill="rgba(52,211,153,0.12)" stroke="#10b981" stroke-width="1"/>
              <text x="380" y="128" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">Con Laplace (+1):</text>
              <text x="380" y="146" text-anchor="middle" class="svg-node-text" font-size="11">P = (Frec + 1) / (Nₖ + Bins)</text>
              <text x="380" y="163" text-anchor="middle" class="svg-label-muted" font-size="10">Evita el bloqueo multiplicativo</text>

              <!-- Panel 3: Densidad > 1 -->
              <rect x="512" y="10" width="234" height="184" rx="10" fill="rgba(52,211,153,0.08)" stroke="#10b981" stroke-width="1"/>
              <text x="629" y="32" text-anchor="middle" fill="#34d399" font-size="11.5" font-weight="700">3. ¡Densidad f(x) puede ser &gt; 1!</text>
              <line x1="532" y1="145" x2="726" y2="145" stroke="#64748b" stroke-width="1.2"/>
              <line x1="532" y1="95" x2="726" y2="95" stroke="#fbbf24" stroke-width="1" stroke-dasharray="3,3"/>
              <text x="536" y="90" fill="#fbbf24" font-size="9.5">y = 1.0</text>
              <path d="M 555 144 Q 602 140 618 75 Q 629 44 640 75 Q 656 140 703 144" fill="rgba(52,211,153,0.22)" stroke="#34d399" stroke-width="2.4"/>
              <text x="629" y="164" text-anchor="middle" class="svg-node-text" font-size="10.5">Si σ es chico (ej. 0.2), pico = 1.99</text>
              <text x="629" y="179" text-anchor="middle" class="svg-label-muted" font-size="10">¡No te asustes! Lo que vale 1 es el área.</text>
            </svg>
          `,
          notasClave: [
            "**¿Qué significa el símbolo $\\propto$ («proporcional a»)?** Como el denominador de Bayes $P(\\mathbf{x})$ es idéntico para todas las clases, la cátedra escribe $P(C_k \\mid \\mathbf{x}) \\propto P(C_k) \\prod P(x_i \\mid C_k)$ para comparar solo los numeradores (*scores*) y decidir $\\arg\\max$.",
            "**Cuidado con paréntesis vs. corchetes en Histogramas:** En un intervalo `(a, b]`, el paréntesis **`(` excluye** al extremo `a` y el corchete **`]` incluye** al extremo `b`. Ej: `-12` entra en `(-∞, -12]`, NO en `(-12, -1]`."
          ]
        },
        {
          id: "PRAC-NB-02",
          tema: "NAIVE_BAYES",
          tipo: "algoritmo",
          titulo: "Algoritmo de 5 Pasos: Naïve Bayes por Histogramas (Tablas de Bins)",
          etiquetaNaturaleza: "ENTRENAMIENTO PRÁCTICO · NO ES PREGUNTA DE PARCIAL",
          resumen: "Receta exacta de resolución en papel para los ejercicios clásicos de tablas discretizadas en intervalos (Guía Ej. 05, 06 y 07).",
          pasos: [
            {
              nro: 1,
              titulo: "Calcular las Probabilidades a Priori P(Ck) y los totales por clase Nk",
              queHago: "Saco cuántas muestras tiene cada clase ($N_k$) y su proporción inicial $P(C_k) = N_k / N_{\\text{total}}$. Si el enunciado da porcentajes (ej. `30%` de `125.000`), multiplico primero para tener $N_k = 37.500$, porque ese número va en los denominadores.",
              formula: "$$P(C_k) = \\frac{N_k}{N_{\\text{total}}} \\qquad N_k = P(C_k) \\cdot N_{\\text{total}}$$",
              queEscriboEnHoja: "«Saco primero cuántas muestras tiene cada clase (Nₖ) y su probabilidad inicial P(Cₖ) = Nₖ / Total.»"
            },
            {
              nro: 2,
              titulo: "Ubicar el bin exacto de cada atributo de la nueva instancia",
              queHago: "Miro en qué columna cae cada coordenada de la instancia nueva, cuidando el borde `(` abierto vs `]` cerrado.",
              formula: "$$x_i \\in (a, b] \\iff a < x_i \\le b$$",
              queEscriboEnHoja: "«Ubico en qué intervalo (bin) cae cada dato de la instancia nueva, respetando bordes abiertos y cerrados.»"
            },
            {
              nro: 3,
              titulo: "Extraer las Verosimilitudes Condicionales P(xi ∈ Bin | Ck)",
              queHago: "Para cada clase, divido la frecuencia de ese bin **por $N_k$ (total de ESA clase, no del dataset completo)**. Si aparece un $0$, aclaro el efecto anulador (o aplico Laplace si lo pide).",
              formula: "$$P(x_i \\in \\text{Bin}_m \\mid C_k) = \\frac{\\text{Frec}(\\text{Bin}_m,\\, C_k)}{N_k} \\qquad (\\text{con Laplace: } \\frac{\\text{Frec} + 1}{N_k + B})$$",
              queEscriboEnHoja: "«Para cada clase divido las veces que cayó en ese bin por el total de esa clase (Nₖ).»"
            },
            {
              nro: 4,
              titulo: "Multiplicar A Priori × Verosimilitudes (Score por clase)",
              queHago: "Multiplico $P(C_k)$ por todas las verosimilitudes de esa clase (como el denominador $P(\\mathbf{x})$ es igual para todas, comparo numeradores). Escribo los resultados en **notación científica** clara.",
              formula: "$$P(C_k \\mid \\mathbf{x}) \\propto \\text{Score}(C_k) = P(C_k) \\cdot \\prod_{i=1}^{D} P(x_i \\in \\text{Bin}_m \\mid C_k)$$",
              queEscriboEnHoja: "«Multiplico el P(Cₖ) por la probabilidad de cada atributo dentro de esa clase para sacar su puntaje.»"
            },
            {
              nro: 5,
              titulo: "Aplicar Regla MAP (ArgMax) y Normalizar si piden probabilidad %",
              queHago: "Elijo la clase con el puntaje más grande (cuidado mirando el exponente de las potencias negativas: $10^{-3} > 10^{-6}$). Si preguntan el porcentaje exacto, divido cada puntaje por la suma de todos.",
              formula: "$$C^* = \\arg\\max_{C_k} \\text{Score}(C_k) \\qquad P(C_k \\mid \\mathbf{x}) = \\frac{\\text{Score}(C_k)}{\\sum_j \\text{Score}(C_j)}$$",
              queEscriboEnHoja: "«Como la clase C* dio el puntaje más alto, clasifico el ejemplo ahí (y normalizo dividiendo por la suma si pide %).»"
            }
          ]
        },
        {
          id: "PRAC-NB-03",
          tema: "NAIVE_BAYES",
          tipo: "algoritmo",
          titulo: "Algoritmo de 4 Pasos: Naïve Bayes Continuo con Distribución Normal (Gaussiana)",
          etiquetaNaturaleza: "ENTRENAMIENTO PRÁCTICO · NO ES PREGUNTA DE PARCIAL",
          resumen: "Cómo resolver ejercicios donde te dan medias μ y desvíos σ (Ej. 01 y 02) o una tabla/gráfico de puntos crudos (Ej. 03 y 04).",
          pasos: [
            {
              nro: 1,
              titulo: "Estimar μ y σ por atributo y clase (solo si dan puntos crudos)",
              queHago: "Si ya te dan tabla con $\\mu$ y $\\sigma$, salteás este paso. Si dan puntos crudos, separo por clase y saco media $\\mu$ y desvío $\\sigma$ (la guía usa desvío poblacional dividiendo por $N_k$, `xσn` en Casio).",
              formula: "$$\\mu_{ik} = \\frac{1}{N_k} \\sum_{p \\in C_k} x_{pi} \\qquad \\sigma_{ik} = \\sqrt{\\frac{1}{N_k} \\sum_{p \\in C_k} (x_{pi} - \\mu_{ik})^2}$$",
              queEscriboEnHoja: "«Como me dieron los puntos sueltos, saco primero la media μ y el desvío σ de cada clase.»"
            },
            {
              nro: 2,
              titulo: "Calcular Probabilidades a Priori P(Ck)",
              queHago: "Cuento cuántas instancias tiene cada clase y divido por el total. Si las clases están repartidas iguales, todas arrancan con la misma chance.",
              formula: "$$P(C_k) = \\frac{N_k}{N_{\\text{total}}}$$",
              queEscriboEnHoja: "«Anoto cuánta chance previa tiene cada clase: P(C₁) = N₁/N_tot, P(C₂) = ...»"
            },
            {
              nro: 3,
              titulo: "Evaluar la Función de Densidad Gaussiana para cada atributo",
              queHago: "Meto cada dato de consulta $x_i$ en la campana de Gauss con el $(\\mu, \\sigma)$ de cada clase. Si el desvío $\\sigma$ es muy chico, puede dar un valor $> 1$: es normal porque es una densidad.",
              formula: "$$p(x_i \\mid C_k) = \\frac{1}{\\sigma_{ik}\\sqrt{2\\pi}} \\cdot e^{-\\frac{(x_i - \\mu_{ik})^2}{2\\sigma_{ik}^2}}$$",
              queEscriboEnHoja: "«Reemplazo cada valor en la campana de Gauss usando la media y el desvío de esa clase.»"
            },
            {
              nro: 4,
              titulo: "Multiplicar A Priori × Verosimilitudes y Clasificar (ArgMax)",
              queHago: "Multiplico $P(C_k)$ por las densidades de cada atributo para sacar el puntaje de cada clase; el mayor gana (y si pide % exacto, divido por la suma).",
              formula: "$$C^* = \\arg\\max_{C_k} \\left[ P(C_k) \\prod_{i=1}^D p(x_i \\mid C_k) \\right]$$",
              queEscriboEnHoja: "«Multiplico P(Cₖ) por todas las densidades y elijo la clase que da el puntaje más grande.»"
            }
          ]
        },
        {
          id: "PRAC-NB-04",
          tema: "NAIVE_BAYES",
          tipo: "plantilla",
          titulo: "Plantilla de Hoja en Blanco y Secuencia de Calculadora Casio",
          etiquetaNaturaleza: "ENTRENAMIENTO PRÁCTICO · NO ES PREGUNTA DE PARCIAL",
          resumen: "Cómo tabular ordenadamente el cálculo para 2, 3 o 4 clases sin perder un término en el medio de las potencias de 10.",
          tablaPlantilla: {
            tituloTabla: "Tabla de Evaluación Bayesiana para Nueva Instancia X = (x₁, x₂, ...)",
            columnas: [
              "Clase $C_k$",
              "$N_k$ y $P(C_k) = \\frac{N_k}{N_{\\text{tot}}}$",
              "Verosimilitud $x_1$",
              "Verosimilitud $x_2$",
              "Score $P(C_k) \\prod p(x_i \\mid C_k)$",
              "Normalizada ($\\%$)"
            ],
            filas: [
              ["$C_1$", "$N_1 / N_{\\text{tot}}$", "$\\text{Frec}_1/N_1$ ó $f_{\\mathcal{N}}(x_1)$", "$\\text{Frec}_2/N_1$ ó $f_{\\mathcal{N}}(x_2)$", "$S_1$ (ej. $9.70 \\times 10^{-7}$)", "$S_1 / \\sum S_j$"],
              ["$C_2$", "$N_2 / N_{\\text{tot}}$", "$\\text{Frec}_1/N_2$ ó $f_{\\mathcal{N}}(x_1)$", "$\\text{Frec}_2/N_2$ ó $f_{\\mathcal{N}}(x_2)$", "$S_2$ (ej. $4.02 \\times 10^{-12}$)", "$S_2 / \\sum S_j$"],
              ["**Control**", "$\\sum P(C_k) = 1.00$", "**Divisor siempre es $N_k$**", "**Signo $-$ en exp.**", "**Mayor $S_k$ gana**", "$\\sum = 100\\%$"]
            ]
          },
          tipHoja: "💡 **Secuencia segura en calculadora científica:** Calculá primero el exponente $E = -((x - \\mu)^2) / (2 \\cdot \\sigma^2)$ (con doble paréntesis en el denominador!), luego hacé `e^Ans` y por último multiplicá por `1 / (σ * √(2 * π))`. Así evitás el clásico error de dividir por $2$ y después multiplicar por $\\sigma^2$!"
        },
        {
          id: "PRAC-NB-05",
          tema: "NAIVE_BAYES",
          tipo: "formula",
          titulo: "Flashcard 1: ¿Por qué se escribe ∝ y cuándo SÍ hay que dividir por la suma?",
          etiquetaNaturaleza: "ENTRENAMIENTO PRÁCTICO · NO ES PREGUNTA DE PARCIAL",
          preguntaFrente: "La fórmula exacta de Bayes lleva un denominador $P(\\mathbf{x})$. ¿Por qué en los cálculos manuales casi siempre se usa el signo proporcional $\\propto$ y cuándo estás obligado a normalizar al final?",
          respuestaDorso: "**Teorema completo vs. Regla MAP:**\n$$P(C_k \\mid \\mathbf{x}) = \\frac{P(C_k) \\prod_{i=1}^D P(x_i \\mid C_k)}{P(\\mathbf{x})} \\quad \\Longrightarrow \\quad \\text{Score}(C_k) = P(C_k) \\prod_{i=1}^D P(x_i \\mid C_k)$$\n\n* **Por qué se omite $P(\\mathbf{x})$ para clasificar:** $P(\\mathbf{x}) = \\sum_j \\text{Score}(C_j)$ es una **constante positiva idéntica para todas las clases**, por lo que no cambia cuál clase resulta ganadora en el $\\arg\\max$.\n* **Cuándo SÍ normalizar:** Si el enunciado pide **«calcule la probabilidad de pertenecer a cada clase»** (en lugar de solo *«a qué clase pertenece»*), dividís cada Score por $\\sum_j \\text{Score}(C_j)$ para entregar probabilidades reales que sumen $1$ ($100\\%$)."
        },
        {
          id: "PRAC-NB-06",
          tema: "NAIVE_BAYES",
          tipo: "formula",
          titulo: "Flashcard 2: Fórmula Gaussiana Completa y la Trampa de Densidad > 1",
          etiquetaNaturaleza: "ENTRENAMIENTO PRÁCTICO · NO ES PREGUNTA DE PARCIAL",
          preguntaFrente: "1) Escribí de memoria la función de densidad normal $p(x_i \\mid C_k)$ con $\\mu$ y $\\sigma$. 2) Estás rindiendo y la cuenta te da $p(x_i \\mid C_1) = 1.76$. ¿Hiciste algo mal en la calculadora?",
          respuestaDorso: "**1) Fórmula canónica de la cátedra:**\n$$p(x_i \\mid C_k) = \\frac{1}{\\sigma_{ik}\\sqrt{2\\pi}} \\cdot e^{-\\frac{(x_i - \\mu_{ik})^2}{2\\sigma_{ik}^2}}$$\n\n**2) ¿Puede dar $> 1$?** **SÍ, está perfectamente bien.** $p(x \\mid C_k)$ es una **función de densidad de probabilidad ($f(x)$)**, NO una probabilidad discreta. Lo que debe valer $1$ es el área total bajo la curva ($\\int f(x)\\,dx = 1$). Cuando el desvío $\\sigma$ es chico (ej. $\\sigma < \\frac{1}{\\sqrt{2\\pi}} \\approx 0.3989$), el pico en $x = \\mu$ supera $1$ (por ejemplo con $\\sigma = 0.2$, el pico vale $\\approx 1.9947$)."
        },
        {
          id: "PRAC-NB-07",
          tema: "NAIVE_BAYES",
          tipo: "formula",
          titulo: "Flashcard 3: El Problema de Frecuencia Cero (Bin Vacío) y Suavizado de Laplace",
          etiquetaNaturaleza: "ENTRENAMIENTO PRÁCTICO · NO ES PREGUNTA DE PARCIAL",
          preguntaFrente: "En Naïve Bayes con Histogramas, todos los síntomas apuntan fuerte a la clase $E_1$, pero un único bin tiene frecuencia `0`. ¿Qué pasa con el Score sin corrección y cómo se resuelve formalmente?",
          respuestaDorso: "* **Efecto anulador:** Como la verosimilitud conjunta multiplica los factores, un solo $P(x_m \\mid E_1) = 0 / N_1 = 0$ **anula todo el producto**, dando $\\text{Score}(E_1) = 0$ sin importar cuán probables sean los demás atributos.\n* **Solución (Suavizado de Laplace / $+1$):** Se suma $1$ a cada frecuencia y $B$ (cantidad de intervalos/bins posibles de ese atributo) al denominador:\n$$P_{\\text{Laplace}}(x_i \\in \\text{Bin}_m \\mid C_k) = \\frac{\\text{Frec}(\\text{Bin}_m, C_k) + 1}{N_k + B}$$\n*(Aclaración en hoja: si te aparece un bin en $0$ en un ejercicio sin especificar suavizado, calculá el producto $= 0$ y dejá asentado en una nota que con suavizado de Laplace $+1$ se evita el bloqueo).* "
        },
        {
          id: "PRAC-NB-08",
          tema: "NAIVE_BAYES",
          tipo: "formula",
          titulo: "Flashcard 4: ¿Cuándo falla Naïve Bayes Gaussiano vs. Histogramas? (Pregunta de Parcial)",
          etiquetaNaturaleza: "ENTRENAMIENTO PRÁCTICO · NO ES PREGUNTA DE PARCIAL",
          preguntaFrente: "Pregunta conceptual de las diapositivas oficiales (`Slide 37` y `Slide 47`): ¿En qué datos falla Naïve Bayes con distribución Gaussiana, qué alternativa se usa y qué 3 cuidados requieren los Histogramas?",
          respuestaDorso: "* **Limitación de la Gaussiana:** Asume que cada clase y atributo sigue una única campana unimodal e independencia entre dimensiones. **Falla** si los datos son **multimodales** (varios grupos separados de la misma clase), tienen formas no convexas/entrelazadas (**espirales, anillos concéntricos**) o fuerte correlación diagonal.\n* **Alternativa:** Discretizar en **Histogramas (bins)** cuando no se conoce la distribución.\n* **3 factores clave al usar Histogramas (Slide 47):**\n  1. **No usar bins** si los datos responden claramente a una distribución paramétrica conocida.\n  2. Determinar correctamente la **amplitud (cantidad y ancho) de los bins**.\n  3. Manejar adecuadamente las probabilidades de los **bins vacíos (frecuencia cero)**.",
          svgDiagram: `
            <svg viewBox="0 0 760 165" xmlns="http://www.w3.org/2000/svg" class="lab-svg-diagram" role="img" aria-label="Casos donde falla Naive Bayes Gaussiano">
              <rect x="16" y="10" width="232" height="145" rx="8" fill="rgba(251,113,133,0.08)" stroke="#fb7185" stroke-width="1"/>
              <text x="132" y="30" text-anchor="middle" fill="#fb7185" font-size="11.5" font-weight="700">1. Datos Multimodales ✗</text>
              <line x1="34" y1="115" x2="230" y2="115" stroke="#64748b" stroke-width="1"/>
              <circle cx="62" cy="108" r="4" fill="#38bdf8"/><circle cx="72" cy="108" r="4" fill="#38bdf8"/><circle cx="82" cy="108" r="4" fill="#38bdf8"/>
              <circle cx="182" cy="108" r="4" fill="#38bdf8"/><circle cx="192" cy="108" r="4" fill="#38bdf8"/><circle cx="202" cy="108" r="4" fill="#38bdf8"/>
              <circle cx="132" cy="108" r="5" fill="#fb7185"/>
              <path d="M 40 114 Q 85 52 132 52 Q 179 52 224 114" fill="none" stroke="#38bdf8" stroke-width="2" stroke-dasharray="4,3"/>
              <text x="132" y="138" text-anchor="middle" class="svg-label-muted" font-size="9.5">La campana pone su pico donde no hay datos</text>

              <rect x="264" y="10" width="232" height="145" rx="8" fill="rgba(251,113,133,0.08)" stroke="#fb7185" stroke-width="1"/>
              <text x="380" y="30" text-anchor="middle" fill="#fb7185" font-size="11.5" font-weight="700">2. Anillos Concéntricos ✗</text>
              <circle cx="380" cy="82" r="36" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-dasharray="5,4"/>
              <circle cx="380" cy="82" r="14" fill="none" stroke="#34d399" stroke-width="2.5"/>
              <circle cx="380" cy="82" r="3" fill="#fbbf24"/>
              <text x="380" y="138" text-anchor="middle" class="svg-label-muted" font-size="9.5">Misma media μ para ambas clases</text>

              <rect x="512" y="10" width="232" height="145" rx="8" fill="rgba(52,211,153,0.08)" stroke="#10b981" stroke-width="1"/>
              <text x="628" y="30" text-anchor="middle" fill="#34d399" font-size="11.5" font-weight="700">3. Correlación Diagonal ✗</text>
              <line x1="540" y1="120" x2="710" y2="48" stroke="#38bdf8" stroke-width="2.5"/>
              <ellipse cx="625" cy="84" rx="45" ry="26" fill="none" stroke="#fbbf24" stroke-width="1.5" stroke-dasharray="4,3"/>
              <text x="628" y="138" text-anchor="middle" class="svg-label-muted" font-size="9.5">Asume ejes alineados (sin covarianza)</text>
            </svg>
          `
        },
        {
          id: "PRAC-NB-09",
          tema: "NAIVE_BAYES",
          tipo: "trampa",
          titulo: "Las 6 Trampas Clásicas de Examen en Naïve Bayes",
          etiquetaNaturaleza: "ENTRENAMIENTO PRÁCTICO · NO ES PREGUNTA DE PARCIAL",
          resumen: "Errores mecánicos que invalidan los cálculos tanto en Histogramas como en Distribución Normal.",
          trampas: [
            "**Dividir la frecuencia del bin por $N_{\\text{total}}$ en lugar de $N_k$:** En $P(x_1 \\in \\text{Bin} \\mid C_k)$, el denominador es SIEMPRE la cantidad de muestras de **esa clase $N_k$** (ej. $37.500$ para $T_1$), jamás los $125.000$ totales del dataset.",
            "**Caer en el borde equivocado del bin `(a, b]`:** Paréntesis `(` no incluye el extremo, corchete `]` sí. Si $x_1 = -12$ y los intervalos son `(-∞, -12]` y `(-12, -1]` (Guía Ej. 07), `-12` pertenece al **primer** bin.",
            "**Olvidar los paréntesis en $(2\\sigma^2)$ en la calculadora:** Escribir `-(x-μ)^2 / 2 * σ^2` hace $\\frac{-(x-\\mu)^2}{2} \\cdot \\sigma^2$ en vez de dividir por $(2\\sigma^2)$.",
            "**Doble signo negativo cuando $\\mu < 0$ o $x < 0$:** En $(x_i - \\mu_{ik})^2$, si $x = 1.6$ y $\\mu = -3.0$ (Guía Ej. 01), la diferencia es $(1.6 - (-3.0))^2 = (4.6)^2$, **no** $(1.6 - 3.0)^2$.",
            "**Comparar mal potencias negativas de 10:** Un alumno distraído ve `7.29 > 1.96` y no mira el exponente: $9.70 \\times 10^{-7}$ es **cientos de miles de veces MAYOR** que $7.29 \\times 10^{-12}$.",
            "**Omitir calcular $N_k$ cuando el enunciado da porcentajes:** Si dice $T_1 (30\\%)$ de $125.000$ muestras, primero calculá $N_1 = 37.500$, verificá que la fila de frecuencias de $T_1$ sume $37.500$, y usá ese denominador en cada bin."
          ]
        }
      ]
    },
    // =========================================================================
    // TEMA 4: REDES DE HOPFIELD (MEMORIA AUTOASOCIATIVA)
    // =========================================================================
    {
      id: "HOPFIELD",
      nombre: "Redes de Hopfield",
      badge: "Memoria Autoasociativa · Matriz W y Convergencia",
      icono: "🧲",
      ponderacion: "Cálculo matricial mecánico (sin errores de signo) + análisis de capacidad/ortogonalidad",
      referenciaCatedra: "Guía Práctica Hopfield · Parciales 22/06/2015, 2021, 2023 (Tema 1), 19/11/2025 y Cuestionario Moodle 06",
      referenciaLinks: [
        { label: "guia_practica_hopfield.pdf", path: "MODELOS_ORIGINALES/4_GUIAS_PRACTICAS_CATEDRA/guia_practica_hopfield.pdf", kind: "pdf" },
        { label: "parcial2_2025_11_19_oficial.pdf", path: "MODELOS_ORIGINALES/1_PARCIALES_2DO_PARCIAL/parcial2_2025_11_19_oficial.pdf", kind: "pdf" },
        { label: "cuestionario_moodle_06_svm_hopfield_som.pdf", path: "MODELOS_ORIGINALES/3_CUESTIONARIOS_MOODLE_2DO_PARCIAL/cuestionario_moodle_06_svm_hopfield_som.pdf", kind: "pdf" },
        { label: "05_redes_hopfield.md", path: "GUIAS_PASO_A_PASO/05_redes_hopfield.md", kind: "md" }
      ],
      tiempoSugerido: "15–20 min",
      objetivo: "Memorizar patrones bipolares {-1, +1} en una matriz simétrica W de diagonal nula, iterar el reconocimiento sincrónico cuidando el caso net_i = 0 y diagnosticar convergencia, ciclos oscilatorios o capacidad límite.",
      items: [
        {
          id: "PRAC-HOP-01",
          tema: "HOPFIELD",
          tipo: "diagrama",
          titulo: "Arquitectura Monocapa Autoasociativa y Bucle de Recuperación",
          etiquetaNaturaleza: "ENTRENAMIENTO PRÁCTICO · NO ES PREGUNTA DE PARCIAL",
          resumen: "Hopfield es una red monocapa totalmente conectada en forma lateral (sin autorrecurrencia: w_ii = 0) y con pesos simétricos (w_ij = w_ji). El aprendizaje hebbiano es off-line y luego la salida se realimenta iterativamente hasta alcanzar un mínimo (atractor) o entrar en ciclo.",
          svgDiagram: `
<svg class="lab-svg-diagram" viewBox="0 0 760 345" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Red de Hopfield monocapa sin autorrecurrencia y bucle de iteración">
  <defs>
    <marker id="hop-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8"/>
    </marker>
    <marker id="hop-arrow-accent" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#f59e0b"/>
    </marker>
    <marker id="hop-arrow-green" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#10b981"/>
    </marker>
    <marker id="hop-arrow-red" viewBox="0 0 10 10" refX="8" markerHeight="6" markerWidth="6" orient="auto-start-reverse" refY="5">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#ef4444"/>
    </marker>
  </defs>

  <text x="186" y="22" text-anchor="middle" class="svg-node-text" font-size="12" font-weight="700">1. TOPOLOGÍA (N=4, sin autorrecurrencia)</text>
  <text x="565" y="22" text-anchor="middle" class="svg-node-text" font-size="12" font-weight="700">2. DINÁMICA DE RECONOCIMIENTO SINCRÓNICO</text>

  <!-- Conexiones laterales simétricas w_ij = w_ji -->
  <line x1="133" y1="98" x2="239" y2="98" stroke="#60a5fa" stroke-width="1.8" marker-start="url(#hop-arrow)" marker-end="url(#hop-arrow)"/>
  <line x1="133" y1="206" x2="239" y2="206" stroke="#60a5fa" stroke-width="1.8" marker-start="url(#hop-arrow)" marker-end="url(#hop-arrow)"/>
  <line x1="106" y1="125" x2="106" y2="179" stroke="#60a5fa" stroke-width="1.8" marker-start="url(#hop-arrow)" marker-end="url(#hop-arrow)"/>
  <line x1="266" y1="125" x2="266" y2="179" stroke="#60a5fa" stroke-width="1.8" marker-start="url(#hop-arrow)" marker-end="url(#hop-arrow)"/>
  <line x1="124" y1="116" x2="248" y2="188" stroke="#94a3b8" stroke-width="1.4" stroke-dasharray="4 3"/>
  <line x1="248" y1="116" x2="124" y2="188" stroke="#94a3b8" stroke-width="1.4" stroke-dasharray="4 3"/>

  <!-- Autolazo tachado (sin autorrecurrencia) -->
  <path d="M 86 80 C 58 48, 128 48, 108 74" fill="none" stroke="#ef4444" stroke-width="1.6" stroke-dasharray="3 3"/>
  <line x1="78" y1="54" x2="108" y2="70" stroke="#ef4444" stroke-width="2"/>
  <text x="108" y="45" text-anchor="middle" fill="#f87171" font-size="10.5" font-weight="700">w₁₁ = 0 (prohibido)</text>

  <!-- 4 neuronas -->
  <circle cx="106" cy="98" r="24" class="svg-node svg-node-in"/>
  <text x="106" y="95" text-anchor="middle" class="svg-node-text" font-size="13" font-weight="700">s₁</text>
  <text x="106" y="110" text-anchor="middle" class="svg-label-muted" font-size="10.5">±1</text>

  <circle cx="266" cy="98" r="24" class="svg-node svg-node-in"/>
  <text x="266" y="95" text-anchor="middle" class="svg-node-text" font-size="13" font-weight="700">s₂</text>
  <text x="266" y="110" text-anchor="middle" class="svg-label-muted" font-size="10.5">±1</text>

  <circle cx="106" cy="206" r="24" class="svg-node svg-node-hidden"/>
  <text x="106" y="203" text-anchor="middle" class="svg-node-text" font-size="13" font-weight="700">s₃</text>
  <text x="106" y="218" text-anchor="middle" class="svg-label-muted" font-size="10.5">±1</text>

  <circle cx="266" cy="206" r="24" class="svg-node svg-node-hidden"/>
  <text x="266" y="203" text-anchor="middle" class="svg-node-text" font-size="13" font-weight="700">s₄</text>
  <text x="266" y="218" text-anchor="middle" class="svg-label-muted" font-size="10.5">±1</text>

  <text x="186" y="88" text-anchor="middle" class="svg-label-muted" font-size="10.5" font-weight="600">w₁₂ = w₂₁</text>
  <text x="186" y="196" text-anchor="middle" class="svg-label-muted" font-size="10.5" font-weight="600">w₃₄ = w₄₃</text>

  <rect x="16" y="256" width="340" height="72" rx="8" class="svg-note-bg"/>
  <text x="186" y="277" text-anchor="middle" class="svg-node-text" font-size="11.5" font-weight="700">Aprendizaje Hebbiano Off-Line (W = Wᵀ)</text>
  <text x="186" y="297" text-anchor="middle" class="svg-label-muted" font-size="11">W = Σ (Eₖᵀ · Eₖ − I)   con diagonal wᵢᵢ = 0</text>
  <text x="186" y="316" text-anchor="middle" fill="#fbbf24" font-size="10.5" font-weight="600">Codificación bipolar obligatoria: {−1, +1}</text>

  <!-- Separador vertical -->
  <line x1="370" y1="18" x2="370" y2="334" stroke="rgba(148,163,184,0.4)" stroke-width="1.5" stroke-dasharray="4 4"/>

  <!-- Flujo derecho -->
  <rect x="384" y="44" width="160" height="50" rx="8" class="svg-node svg-node-in"/>
  <text x="464" y="65" text-anchor="middle" class="svg-node-text" font-size="12" font-weight="700">Entrada S(0) = E_d</text>
  <text x="464" y="82" text-anchor="middle" class="svg-label-muted" font-size="10.5">Ruido o incompleto</text>

  <line x1="546" y1="69" x2="578" y2="69" stroke="#38bdf8" stroke-width="2" marker-end="url(#hop-arrow)"/>

  <rect x="582" y="44" width="164" height="50" rx="8" class="svg-node svg-node-hidden"/>
  <text x="664" y="65" text-anchor="middle" class="svg-node-text" font-size="12" font-weight="700">net = S(t) · W</text>
  <text x="664" y="82" text-anchor="middle" class="svg-label-muted" font-size="10.5">Producto fila × matriz</text>

  <line x1="664" y1="96" x2="664" y2="126" stroke="#38bdf8" stroke-width="2" marker-end="url(#hop-arrow)"/>

  <rect x="550" y="132" width="196" height="64" rx="8" class="svg-node svg-node-out"/>
  <text x="648" y="152" text-anchor="middle" class="svg-node-text" font-size="12" font-weight="700">S(t+1) = f(net)</text>
  <text x="648" y="170" text-anchor="middle" class="svg-label-muted" font-size="10.5">+1 (&gt;0)   |   −1 (&lt;0)</text>
  <text x="648" y="186" text-anchor="middle" fill="#fde68a" font-size="10.5" font-weight="600">netᵢ = 0 → conserva sᵢ(t)</text>

  <!-- Loop de realimentación si S(t+1) != S(t) -->
  <path d="M 548 164 L 464 164 L 464 100" fill="none" stroke="#f59e0b" stroke-width="2" marker-end="url(#hop-arrow-accent)"/>
  <text x="464" y="184" text-anchor="middle" fill="#fbbf24" font-size="11" font-weight="700">S(t+1) ≠ S(t)</text>
  <text x="464" y="200" text-anchor="middle" fill="#fbbf24" font-size="10.5">Realimentar S(t+1)</text>

  <!-- Decisiones finales -->
  <line x1="612" y1="198" x2="542" y2="250" stroke="#10b981" stroke-width="2" marker-end="url(#hop-arrow-green)"/>
  <line x1="688" y1="198" x2="688" y2="250" stroke="#ef4444" stroke-width="2" marker-end="url(#hop-arrow-red)"/>

  <rect x="384" y="256" width="234" height="72" rx="8" class="svg-note-bg"/>
  <text x="501" y="277" text-anchor="middle" fill="#34d399" font-size="11.5" font-weight="700">S(t+1) = S(t) → CONVERGE</text>
  <text x="501" y="296" text-anchor="middle" class="svg-label-muted" font-size="10.5">Comparar con Eₖ almacenados</text>
  <text x="501" y="314" text-anchor="middle" fill="#fbbf24" font-size="10.5">Ojo: puede caer en inverso (−Eₖ)</text>

  <rect x="630" y="256" width="116" height="72" rx="8" class="svg-note-bg"/>
  <text x="688" y="277" text-anchor="middle" fill="#f87171" font-size="11.5" font-weight="700">Ciclo n &gt; 1</text>
  <text x="688" y="296" text-anchor="middle" class="svg-label-muted" font-size="10.5">S(t) = S(t+n)</text>
  <text x="688" y="314" text-anchor="middle" fill="#f87171" font-size="10.5">NO estabiliza</text>
</svg>`,
          svgDiagram2: `
<svg class="lab-svg-diagram" viewBox="0 0 760 215" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Recuperacion visual de grilla 2x2 y pozos de atraccion en Hopfield">
  <defs>
    <marker id="hop2-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 1 L10 5 L0 9 z" fill="#34d399"/></marker>
  </defs>
  <!-- Panel izquierdo: Grilla 2x2 bipolar -->
  <rect x="14" y="10" width="380" height="195" rx="10" fill="rgba(56,189,248,0.07)" stroke="#38bdf8" stroke-width="1"/>
  <text x="204" y="32" text-anchor="middle" fill="#38bdf8" font-size="12" font-weight="700">De la Grilla (Guía TP) al Vector Bipolar {+1, −1}</text>

  <!-- Patron E1 -->
  <text x="72" y="56" text-anchor="middle" class="svg-node-text" font-size="11" font-weight="700">Patrón E₁</text>
  <rect x="44" y="64" width="28" height="28" fill="#1e293b" stroke="#94a3b8"/><text x="58" y="82" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">+1</text>
  <rect x="72" y="64" width="28" height="28" fill="#f8fafc" stroke="#94a3b8"/><text x="86" y="82" text-anchor="middle" fill="#0f172a" font-size="11" font-weight="700">−1</text>
  <rect x="44" y="92" width="28" height="28" fill="#1e293b" stroke="#94a3b8"/><text x="58" y="110" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">+1</text>
  <rect x="72" y="92" width="28" height="28" fill="#f8fafc" stroke="#94a3b8"/><text x="86" y="110" text-anchor="middle" fill="#0f172a" font-size="11" font-weight="700">−1</text>
  <text x="72" y="138" text-anchor="middle" class="svg-label-muted" font-size="10">[+1, −1, +1, −1]</text>

  <!-- Consulta con ruido Ed -->
  <text x="192" y="56" text-anchor="middle" fill="#fbbf24" font-size="11" font-weight="700">Consulta E_d</text>
  <rect x="164" y="64" width="28" height="28" fill="#1e293b" stroke="#94a3b8"/><text x="178" y="82" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">+1</text>
  <rect x="192" y="64" width="28" height="28" fill="#fb7185" stroke="#f43f5e"/><text x="206" y="82" text-anchor="middle" fill="#fff" font-size="11" font-weight="700">+1</text>
  <rect x="164" y="92" width="28" height="28" fill="#1e293b" stroke="#94a3b8"/><text x="178" y="110" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">+1</text>
  <rect x="192" y="92" width="28" height="28" fill="#f8fafc" stroke="#94a3b8"/><text x="206" y="110" text-anchor="middle" fill="#0f172a" font-size="11" font-weight="700">−1</text>
  <text x="192" y="138" text-anchor="middle" fill="#fb7185" font-size="10">bit 2 invertido</text>

  <line x1="230" y1="92" x2="274" y2="92" stroke="#34d399" stroke-width="2" marker-end="url(#hop2-arr)"/>
  <text x="252" y="83" text-anchor="middle" fill="#34d399" font-size="10" font-weight="700">W</text>

  <!-- Recuperado -->
  <text x="326" y="56" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">S(1) = E₁ ✓</text>
  <rect x="298" y="64" width="28" height="28" fill="#1e293b" stroke="#34d399"/><text x="312" y="82" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">+1</text>
  <rect x="326" y="64" width="28" height="28" fill="#f8fafc" stroke="#34d399"/><text x="340" y="82" text-anchor="middle" fill="#0f172a" font-size="11" font-weight="700">−1</text>
  <rect x="298" y="92" width="28" height="28" fill="#1e293b" stroke="#34d399"/><text x="312" y="110" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">+1</text>
  <rect x="326" y="92" width="28" height="28" fill="#f8fafc" stroke="#34d399"/><text x="340" y="110" text-anchor="middle" fill="#0f172a" font-size="11" font-weight="700">−1</text>
  <text x="326" y="138" text-anchor="middle" fill="#34d399" font-size="10">Limpia el ruido</text>

  <rect x="28" y="156" width="352" height="36" rx="6" class="svg-note-bg"/>
  <text x="204" y="178" text-anchor="middle" class="svg-node-text" font-size="10.5">Regla fija: Negro/Sí = +1 · Blanco/No = −1 · Faltante en E_d = 0</text>

  <!-- Panel derecho: Pozos de Energia -->
  <rect x="408" y="10" width="338" height="195" rx="10" fill="rgba(167,139,250,0.08)" stroke="#a78bfa" stroke-width="1"/>
  <text x="577" y="32" text-anchor="middle" fill="#c4b5fd" font-size="12" font-weight="700">Atractores (Mínimos de Energía)</text>
  <path d="M 430 62 Q 465 56 490 132 Q 515 170 538 118 Q 560 74 585 118 Q 610 170 638 132 Q 668 56 720 62" fill="none" stroke="#c4b5fd" stroke-width="2.5"/>
  <circle cx="514" cy="147" r="5" fill="#34d399"/>
  <text x="514" y="168" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">Eₖ (mínimo)</text>
  <circle cx="614" cy="147" r="5" fill="#fbbf24"/>
  <text x="614" y="168" text-anchor="middle" fill="#fbbf24" font-size="11" font-weight="700">−Eₖ (inverso)</text>
  <circle cx="562" cy="96" r="4.5" fill="#fb7185"/>
  <text x="562" y="84" text-anchor="middle" fill="#fb7185" font-size="10" font-weight="700">A ↔ B (ciclo)</text>
  <text x="577" y="192" text-anchor="middle" class="svg-label-muted" font-size="10">W guarda igual a Eₖ y −Eₖ porque (−1)·(−1) = +1</text>
</svg>`,
          notasClave: [
            "Hopfield discreta opera exclusivamente con **vectores bipolares** $\\{+1, -1\\}$ (no binarios $\\{0, 1\\}$).",
            "Toda matriz $W$ válida cumple dos invariantes visuales instantáneas: **diagonal principal nula** ($w_{ii}=0$) y **simetría** ($w_{ij}=w_{ji}$).",
            "Cuando $net_i = 0$, la función de transferencia **conserva el estado anterior** $s_i(t)$ (no devuelve $0$, salvo si $S(0)$ empezó con $0$ en rasgo faltante)."
          ]
        },
        {
          id: "PRAC-HOP-02",
          tema: "HOPFIELD",
          tipo: "algoritmo",
          titulo: "Algoritmo Completo de Hopfield (Aprendizaje Off-Line + Reconocimiento)",
          etiquetaNaturaleza: "ENTRENAMIENTO PRÁCTICO · NO ES PREGUNTA DE PARCIAL",
          resumen: "Los 5 pasos exactos exigidos en la guía práctica y hojas de parcial para memorizar M patrones de longitud N y probar un patrón distorsionado o incompleto E_d.",
          pasos: [
            {
              nro: 1,
              titulo: "Codificar los patrones de entrada en representación bipolar",
              queHago: "Paso cada dibujo o variable a vector con `+1` (negro / verdadero) y `-1` (blanco / falso). Si una consulta $E_d$ tiene variables desconocidas, pongo `0` en esos lugares.",
              formula: "$$E_k = [e_1^{(k)}, e_2^{(k)}, \\dots, e_N^{(k)}] \\in \\{-1, +1\\}^N$$",
              queEscriboEnHoja: "«Paso todo a +1 (negro/sí) y -1 (blanco/no): E₁ = [...], E₂ = [...] y la consulta E_d = [...].»"
            },
            {
              nro: 2,
              titulo: "Calcular cada matriz individual sin autorrecurrencias",
              queHago: "Para cada patrón armo la tabla $E_k^T \\cdot E_k$ (si fila y columna tienen igual signo va `+1`, si distinto `-1`) y pongo ceros en toda la diagonal principal ($-I$).",
              formula: "$$W_k = E_k^T \\cdot E_k - I \\qquad (w_{ii}^{(k)} = 0)$$",
              queEscriboEnHoja: "«Armo la matriz de cada patrón y le pongo 0 en la diagonal para que ninguna neurona se conecte consigo misma.»"
            },
            {
              nro: 3,
              titulo: "Sumar las matrices para obtener W",
              queHago: "Sumo celda a celda las matrices de todos los patrones. Chequeo rápido en un segundo: diagonal toda en `0` y arriba/abajo iguales (simétrica).",
              formula: "$$W = \\sum_{k=1}^{M} \\left(E_k^T \\cdot E_k - I\\right)$$",
              queEscriboEnHoja: "«Sumo las matrices individuales para obtener W (verifico diagonal nula y simetría).»"
            },
            {
              nro: 4,
              titulo: "Presentar E_d e iterar el cálculo sincrónico",
              queHago: "Arranco con $S(0)=E_d$ y multiplico $S(t)\\cdot W$ columna por columna. Si $net_i>0 \\to +1$; si $net_i<0 \\to -1$; y si da exacto $0$, **copio lo que tenía antes $s_i(t)$**.",
              svgDiagram: `
                <svg viewBox="0 0 760 112" xmlns="http://www.w3.org/2000/svg" class="lab-svg-diagram" role="img" aria-label="Regla de activacion signo y empate net = 0">
                  <text x="380" y="22" text-anchor="middle" fill="#fbbf24" font-size="12" font-weight="700">Regla rápida del escalón s_i(t+1) = f(net_i)</text>
                  <rect x="24" y="36" width="220" height="58" rx="8" fill="rgba(52,211,153,0.10)" stroke="#34d399"/>
                  <text x="134" y="58" text-anchor="middle" fill="#34d399" font-size="12" font-weight="700">netᵢ &gt; 0  ➔  +1</text>
                  <text x="134" y="78" text-anchor="middle" class="svg-label-muted" font-size="10.5">Se activa positivo</text>

                  <rect x="270" y="36" width="220" height="58" rx="8" fill="rgba(251,191,36,0.12)" stroke="#fbbf24" stroke-width="1.5"/>
                  <text x="380" y="58" text-anchor="middle" fill="#fbbf24" font-size="12" font-weight="700">netᵢ = 0  ➔  sᵢ(t)</text>
                  <text x="380" y="78" text-anchor="middle" class="svg-node-text" font-size="10.5">Conserva su estado previo (¡NO poner 0!)</text>

                  <rect x="516" y="36" width="220" height="58" rx="8" fill="rgba(251,113,133,0.10)" stroke="#fb7185"/>
                  <text x="626" y="58" text-anchor="middle" fill="#fb7185" font-size="12" font-weight="700">netᵢ &lt; 0  ➔  −1</text>
                  <text x="626" y="78" text-anchor="middle" class="svg-label-muted" font-size="10.5">Se activa negativo</text>
                </svg>
              `,
              formula: "$$net(t) = S(t)\\cdot W, \\qquad s_i(t+1) = \\begin{cases} +1 & net_i > 0 \\\\ s_i(t) & net_i = 0 \\\\ -1 & net_i < 0 \\end{cases}$$",
              queEscriboEnHoja: "«Multiplico S(t)·W y paso por el signo para sacar S(t+1) (donde dio net=0 mantengo el valor que ya tenía).»"
            },
            {
              nro: 5,
              titulo: "Evaluar convergencia, ciclo límite o patrón espurio",
              queHago: "Si $S(t+1) = S(t)$ la red ya frenó y comparo si recuperó algún $E_k$ o su opuesto $-E_k$. Si vuelve a un vector anterior tras 2+ pasos, entra en ciclo y no estabiliza.",
              formula: "$$S(t+1) = S(t) \\implies \\text{Converge} \\quad | \\quad S(t+n) = S(t)\\;(n>1) \\implies \\text{No estabiliza}$$",
              queEscriboEnHoja: "«Como S(t+1) dio igual a S(t), la red estabiliza y recupera el patrón Eₖ (o su inverso / entra en ciclo si alterna).»"
            }
          ]
        },
        {
          id: "PRAC-HOP-03",
          tema: "HOPFIELD",
          tipo: "algoritmo",
          titulo: "Análisis de Capacidad, Ortogonalidad y Auditoría de Matrices W (Ej. 03 y 04)",
          etiquetaNaturaleza: "ENTRENAMIENTO PRÁCTICO · NO ES PREGUNTA DE PARCIAL",
          resumen: "Además de iterar, la Guía Práctica evalúa dos preguntas fijas: verificar las cotas de recuperabilidad/ortogonalidad y detectar errores premeditados en una matriz W dada.",
          pasos: [
            {
              nro: 1,
              titulo: "Verificar condiciones de recuperabilidad (Capacidad)",
              queHago: "Con $N$ neuronas y $M$ patrones, calculo los dos límites con `ln(N)` (logaritmo natural, no base 10) y comparo si $M$ entra dentro de lo esperado.",
              formula: "$$M_{\\text{buena}} \\approx 0{,}138\\,N \\qquad M_{\\text{perfecta}} \\le \\frac{N}{4\\,\\ln(N)}$$",
              queEscriboEnHoja: "«Con N = ..., los límites dan M_buena = ... y M_perf = ...; como guardamos M patrones, [entra / supera] la capacidad teórica.»"
            },
            {
              nro: 2,
              titulo: "Verificar condición de ortogonalidad entre cada par (k, m)",
              queHago: "Hago el producto punto entre cada pareja de patrones. Si da $\\le 0$, difieren en al menos la mitad de sus bits y se interfieren poco.",
              formula: "$$\\sum_{i=1}^{N} e_i^{(k)}\\,e_i^{(m)} \\le 0 \\quad (\\forall\\,k \\neq m)$$",
              queEscriboEnHoja: "«Producto escalar E₁·E₂ = ... (≤ 0, difieren en ≥50%), así que cumplen ortogonalidad.»"
            },
            {
              nro: 3,
              titulo: "Auditar una matriz W dada (Ejercicio tipo 04)",
              queHago: "Si ya te dan $W_1, W_2, W$ para revisar fallas: mirá la diagonal (tiene que ser 0), la simetría y el signo $e_i e_j$ de cada posición antes de evaluar $E_d$.",
              formula: "$$w_{ij} \\stackrel{?}{=} \\sum_{k=1}^{M} e_i^{(k)} e_j^{(k)} \\quad (i \\neq j), \\qquad w_{ii} \\stackrel{?}{=} 0$$",
              queEscriboEnHoja: "«Encontré errores en W: falta poner cero en la diagonal / la posición (i,j) debería valer Y. Corrijo W y pruebo E_d.»"
            }
          ]
        },
        {
          id: "PRAC-HOP-04",
          tema: "HOPFIELD",
          tipo: "plantilla",
          titulo: "Plantilla de Hoja en Blanco: Aprendizaje de W e Iteraciones (Ejemplo 11-RedesHopfield)",
          etiquetaNaturaleza: "ENTRENAMIENTO PRÁCTICO · NO ES PREGUNTA DE PARCIAL",
          resumen: "Ejemplo resuelto de las diapositivas oficiales con E_1 = [+1, -1, -1, +1], E_2 = [-1, +1, +1, -1] y E_d = [+1, +1, -1, +1].",
          tablaPlantilla: {
            tituloTabla: "Matriz W = (E_1^T E_1 - I) + (E_2^T E_2 - I)",
            columnas: ["Neurona i \\ j", "j = 1", "j = 2", "j = 3", "j = 4"],
            filas: [
              ["i = 1 (+1 / -1)", "0", "-2", "-2", "+2"],
              ["i = 2 (-1 / +1)", "-2", "0", "+2", "-2"],
              ["i = 3 (-1 / +1)", "-2", "+2", "0", "-2"],
              ["i = 4 (+1 / -1)", "+2", "-2", "-2", "0"]
            ]
          },
          tablaPlantilla2: {
            tituloTabla: "Tabla de Trazado de Iteraciones (S(0) = E_d = [+1, +1, -1, +1])",
            columnas: ["Iteración t", "Estado S(t)", "net = S(t) · W", "S(t+1) = f(net)", "Diagnóstico"],
            filas: [
              ["t = 0", "[+1, +1, -1, +1]", "[+2, -6, -2, +2]", "[+1, -1, -1, +1]", "Cambió s_2 -> realimentar"],
              ["t = 1", "[+1, -1, -1, +1]", "[+6, -6, -6, +6]", "[+1, -1, -1, +1]", "S(2) = S(1) -> Converge a E_1"]
            ]
          },
          tipHoja: "💡 Truco mecánico para el producto exterior en papel: escribí E_k arriba de las columnas y E_k^T a la izquierda de las filas. Si fila y columna tienen igual signo, va +1; si distinto signo, va -1; y luego tachá la diagonal reemplazándola por 0."
        },
        {
          id: "PRAC-HOP-05",
          tema: "HOPFIELD",
          tipo: "formula",
          titulo: "Flashcard 1: Matriz de Pesos W y Propiedades Estructurales",
          etiquetaNaturaleza: "ENTRENAMIENTO PRÁCTICO · NO ES PREGUNTA DE PARCIAL",
          preguntaFrente: "¿Cuál es la fórmula exacta para calcular la matriz de pesos W de Hopfield y qué dos propiedades garantiza siempre?",
          respuestaDorso: "Se calcula mediante aprendizaje hebbiano **off-line**:\n$$W = \\sum_{k=1}^{M} \\left( E_k^T \\cdot E_k - I \\right)$$\nDonde cada $E_k$ es vector fila $1 \\times N$, de modo que $E_k^T \\cdot E_k$ genera una matriz $N \\times N$. Garantiza **diagonal nula** ($w_{ii} = 0$, sin autorrecurrencia) y **simetría** ($w_{ij} = w_{ji}$)."
        },
        {
          id: "PRAC-HOP-06",
          tema: "HOPFIELD",
          tipo: "formula",
          titulo: "Flashcard 2: Función de Activación y Regla Crítica net_i = 0",
          etiquetaNaturaleza: "ENTRENAMIENTO PRÁCTICO · NO ES PREGUNTA DE PARCIAL",
          preguntaFrente: "En el reconocimiento sincrónico S(t+1) = f(S(t) · W), ¿qué devuelve f(net_i) cuando net_i da exactamente 0?",
          respuestaDorso: "Cuando $net_i = 0$, **la neurona conserva su estado del paso anterior**:\n$$s_i(t+1) = \\begin{cases} +1 & \\text{si } net_i > 0 \\\\ s_i(t) & \\text{si } net_i = 0 \\\\ -1 & \\text{si } net_i < 0 \\end{cases}$$\n¡Nunca pongas $0$ en $S(t+1)$ cuando $net_i = 0$! Eso arruina las multiplicaciones de la iteración siguiente."
        },
        {
          id: "PRAC-HOP-07",
          tema: "HOPFIELD",
          tipo: "formula",
          titulo: "Flashcard 3: Cotas de Recuperabilidad y Ortogonalidad",
          etiquetaNaturaleza: "ENTRENAMIENTO PRÁCTICO · NO ES PREGUNTA DE PARCIAL",
          preguntaFrente: "¿Cuáles son las fórmulas de capacidad perfecta, recuperación buena y ortogonalidad en los trabajos prácticos?",
          respuestaDorso: "- **Recuperación perfecta:** $M_{\\text{perf}} \\le \\frac{N}{4\\,\\ln(N)}$ (logaritmo natural $\\ln$).\n- **Recuperación suficientemente buena:** $M_{\\text{buena}} \\approx 0{,}138\\,N$.\n- **Ortogonalidad (criterio de cátedra, diferencia $\\ge 50\\%$):** $\\sum_{i=1}^{N} e_i^{(k)}\\,e_i^{(m)} \\le 0$ para todo $k \\neq m$. *(Nota: para $N=4$, $M_{\\text{buena}}=0{,}55$ y $M_{\\text{perf}}=0{,}72$)*."
        },
        {
          id: "PRAC-HOP-08",
          tema: "HOPFIELD",
          tipo: "formula",
          titulo: "Flashcard 4: Criterios de Estabilización, Ciclos y Estados Espurios",
          etiquetaNaturaleza: "ENTRENAMIENTO PRÁCTICO · NO ES PREGUNTA DE PARCIAL",
          preguntaFrente: "¿Cómo distinguís en la hoja si la red convergió a un patrón válido, si cayó en un patrón espurio o si no estabiliza?",
          respuestaDorso: "- **Estabiliza (converge):** $S(t+1) = S(t)$.\n- **No estabiliza (oscilación):** se repite un estado tras $n > 1$ pasos, $S(t) = S(t+n)$ (muy frecuente un ciclo de período $2$: $A \\leftrightarrow B$).\n- **Atractor inverso / espurio:** como $W$ es idéntica para $E_k$ y $-E_k$ (ya que $(-E_k)^T(-E_k) = E_k^T E_k$), si $S(t)$ converge a $-E_k$, estabilizó pero en la **imagen invertida** del patrón (o en una mezcla espuria si $M$ supera la capacidad)."
        },
        {
          id: "PRAC-HOP-09",
          tema: "HOPFIELD",
          tipo: "trampa",
          titulo: "Las 6 Trampas Mortales de Redes de Hopfield en el Parcial",
          etiquetaNaturaleza: "ENTRENAMIENTO PRÁCTICO · NO ES PREGUNTA DE PARCIAL",
          resumen: "Errores de cálculo o de criterio que invalidan todo el ejercicio aunque hayas entendido el algoritmo.",
          trampas: [
            "**Usar codificación binaria {0, 1} en vez de bipolar {-1, +1}:** Blanco/falso SIEMPRE es $-1$, nunca $0$. Si usás $0$, perdés los refuerzos negativos $((-1)(-1)=+1)$ y la matriz $W$ queda completamente mal. (Solo se usa $0$ en componentes *desconocidas* de una consulta parcial $E_d$ en el Paso 4).",
            "**Olvidar restar la matriz identidad I:** Dejar $1$ en la diagonal principal ($w_{ii} \\neq 0$) agrega autorrecurrencia positiva artificial y hace que la red quede atrapada repitiendo el patrón ruidoso $E_d$ sin corregirlo.",
            "**Multiplicar al revés E_k · E_k^T (escalar) en vez de E_k^T · E_k (matriz):** Como $E_k$ es vector fila ($1 \\times N$), la traspuesta $E_k^T$ ($N \\times 1$) debe ir a la izquierda para obtener una matriz $N \\times N$.",
            "**Responder 0 o +1 fijo cuando net_i = 0:** Ante un empate ($net_i = 0$), la regla oficial conserva el valor previo $s_i(t)$. Cambiarlo arbitrariamente suele transformar una convergencia legítima en oscilación falsa.",
            "**Calcular la capacidad con log10(N) en lugar de ln(N):** La calculadora científica tiene `log` (base 10) y `ln` (base $e$). Para $N=4$, $4/(4\\ln 4) = 0{,}721$, mientras que con $\\log_{10}$ daría $1{,}66$ (¡completamente falso!).",
            "**Creer que si superó la capacidad M > 0,138N ya no se hace el ejercicio:** En los prácticos con $N=4, 5, 6$ y $M=2$ siempre falla la cota teórica ($0{,}72 < 2$), pero igual se calcula $W$ y se itera $E_d$ para verificar si en ese caso particular converge o oscila."
          ]
        }
      ]
    },

    // =========================================================================
    // TEMA 5: MAPAS AUTO-ORGANIZADOS DE KOHONEN (SOM)
    // =========================================================================
    {
      id: "SOM",
      nombre: "Mapas Auto-organizados (SOM)",
      badge: "Aprendizaje Competitivo Online · Vecindad y BMU",
      icono: "🗺️",
      ponderacion: "25% típico del parcial · Alta sensibilidad a persistencia W(t) y función de vecindad",
      referenciaCatedra: "Guía Práctica SOM · Parciales 2019 (CIN), 2020/2021, 2023 (Tema 1/2), 19/11/2025 y Cuestionario Moodle 06",
      referenciaLinks: [
        { label: "guia_practica_som.pdf", path: "MODELOS_ORIGINALES/4_GUIAS_PRACTICAS_CATEDRA/guia_practica_som.pdf", kind: "pdf" },
        { label: "parcial2_2025_11_19_oficial.pdf", path: "MODELOS_ORIGINALES/1_PARCIALES_2DO_PARCIAL/parcial2_2025_11_19_oficial.pdf", kind: "pdf" },
        { label: "parcial2_2023_tema1.jpeg", path: "MODELOS_ORIGINALES/1_PARCIALES_2DO_PARCIAL/parcial2_2023_tema1.jpeg", kind: "img" },
        { label: "02_som_kohonen_paso_a_paso.md", path: "GUIAS_PASO_A_PASO/02_som_kohonen_paso_a_paso.md", kind: "md" }
      ],
      tiempoSugerido: "20–25 min",
      objetivo: "Determinar la neurona ganadora (BMU) por mínima distancia euclídea, evaluar la función de vecindad nula o continua sin omitir vecinas, actualizar pesos en modo estrictamente online y graficar la arquitectura final.",
      items: [
        {
          id: "PRAC-SOM-01",
          tema: "SOM",
          tipo: "diagrama",
          titulo: "Arquitectura Competitiva SOM y Atracción de Pesos en el Espacio de Entradas",
          etiquetaNaturaleza: "ENTRENAMIENTO PRÁCTICO · NO ES PREGUNTA DE PARCIAL",
          resumen: "Cada entrada xᵢ se conecta a todas las neuronas competitivas de salida Wⱼ (sin nodo bias). La neurona más cercana al patrón X gana la competencia (BMU) y arrastra su vector de pesos hacia X; si la vecindad es continua, las vecinas también se acercan según h(i, j*).",
          svgDiagram: `
<svg class="lab-svg-diagram" viewBox="0 0 760 345" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Arquitectura SOM de Kohonen y desplazamiento geométrico de pesos hacia el patrón ganador">
  <defs>
    <marker id="som-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8"/>
    </marker>
    <marker id="som-arrow-green" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#10b981"/>
    </marker>
    <marker id="som-arrow-amber" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#f59e0b"/>
    </marker>
  </defs>

  <text x="184" y="22" text-anchor="middle" class="svg-node-text" font-size="12" font-weight="700">1. ARQUITECTURA DE RED SOM (SIN BIAS)</text>
  <text x="568" y="22" text-anchor="middle" class="svg-node-text" font-size="12" font-weight="700">2. COMPETENCIA Y MOVIMIENTO DE PESOS</text>

  <!-- Neuronas de salida arriba -->
  <circle cx="110" cy="84" r="24" class="svg-node svg-node-hidden"/>
  <text x="110" y="81" text-anchor="middle" class="svg-node-text" font-size="13" font-weight="700">W₁</text>
  <text x="110" y="96" text-anchor="middle" class="svg-label-muted" font-size="10">Salida 1</text>

  <circle cx="258" cy="84" r="24" class="svg-node svg-node-out"/>
  <text x="258" y="81" text-anchor="middle" class="svg-node-text" font-size="13" font-weight="700">W₂*</text>
  <text x="258" y="96" text-anchor="middle" class="svg-label-muted" font-size="10">BMU</text>

  <!-- Interacción lateral implícita entre salidas -->
  <line x1="136" y1="84" x2="232" y2="84" stroke="#f59e0b" stroke-width="1.6" stroke-dasharray="4 3"/>
  <text x="184" y="75" text-anchor="middle" fill="#fbbf24" font-size="10" font-weight="700">vecindad h(1,2)</text>

  <!-- Neuronas de entrada abajo -->
  <circle cx="110" cy="208" r="22" class="svg-node svg-node-in"/>
  <text x="110" y="213" text-anchor="middle" class="svg-node-text" font-size="13" font-weight="700">x₁</text>

  <circle cx="258" cy="208" r="22" class="svg-node svg-node-in"/>
  <text x="258" y="213" text-anchor="middle" class="svg-node-text" font-size="13" font-weight="700">x₂</text>

  <!-- Conexiones forward x -> W -->
  <line x1="110" y1="184" x2="110" y2="112" stroke="#38bdf8" stroke-width="2" marker-end="url(#som-arrow)"/>
  <line x1="125" y1="190" x2="242" y2="104" stroke="#38bdf8" stroke-width="1.8" marker-end="url(#som-arrow)"/>
  <line x1="243" y1="190" x2="126" y2="104" stroke="#38bdf8" stroke-width="1.8" marker-end="url(#som-arrow)"/>
  <line x1="258" y1="184" x2="258" y2="112" stroke="#10b981" stroke-width="2.2" marker-end="url(#som-arrow-green)"/>

  <!-- Etiquetas de pesos sinápticos -->
  <text x="92" y="150" text-anchor="middle" class="svg-label-muted" font-size="11" font-weight="700">w₁₁</text>
  <text x="276" y="150" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">w₂₂</text>
  <text x="150" y="160" text-anchor="middle" class="svg-label-muted" font-size="10.5">w₂₁</text>
  <text x="218" y="160" text-anchor="middle" class="svg-label-muted" font-size="10.5">w₁₂</text>

  <!-- Nota izquierda -->
  <rect x="16" y="252" width="338" height="76" rx="8" class="svg-note-bg"/>
  <text x="185" y="273" text-anchor="middle" class="svg-node-text" font-size="11.5" font-weight="700">Convención de subíndices en hoja: w_ji</text>
  <text x="185" y="292" text-anchor="middle" class="svg-label-muted" font-size="10.5">j = neurona de salida (fila)  |  i = entrada (col)</text>
  <text x="185" y="311" text-anchor="middle" fill="#fbbf24" font-size="10.5" font-weight="600">Regla: W_i(t+1) = W_i(t) + α · h(i,j*) · (X − W_i(t))</text>

  <!-- Separador vertical -->
  <line x1="370" y1="18" x2="370" y2="334" stroke="rgba(148,163,184,0.4)" stroke-width="1.5" stroke-dasharray="4 4"/>

  <!-- Ejes del plano derecho -->
  <line x1="406" y1="226" x2="736" y2="226" stroke="#64748b" stroke-width="1.5"/>
  <line x1="422" y1="240" x2="422" y2="44" stroke="#64748b" stroke-width="1.5"/>
  <text x="734" y="218" text-anchor="end" class="svg-label-muted" font-size="11">x₁</text>
  <text x="412" y="54" text-anchor="end" class="svg-label-muted" font-size="11">x₂</text>

  <!-- Patrón p presentado -->
  <circle cx="534" cy="182" r="7" fill="#38bdf8" stroke="#f8fafc" stroke-width="2"/>
  <text x="534" y="202" text-anchor="middle" class="svg-node-text" font-size="11" font-weight="700">Patrón p</text>

  <!-- Distancia a W2 (menor = BMU) y W1 (mayor) -->
  <line x1="534" y1="182" x2="578" y2="110" stroke="#34d399" stroke-width="1.6" stroke-dasharray="4 3"/>
  <text x="542" y="138" text-anchor="end" fill="#34d399" font-size="10.5" font-weight="700">d₂ (mín)</text>

  <line x1="534" y1="182" x2="676" y2="96" stroke="#94a3b8" stroke-width="1.3" stroke-dasharray="4 3"/>
  <text x="642" y="148" text-anchor="middle" class="svg-label-muted" font-size="10.5">d₁ &gt; d₂</text>

  <!-- Pesos iniciales y actualizados -->
  <circle cx="578" cy="110" r="8" class="svg-node svg-node-out"/>
  <text x="578" y="96" text-anchor="middle" class="svg-node-text" font-size="11" font-weight="700">W₂(0)</text>

  <!-- Flecha gran movimiento de W2(0) a W2(1) -->
  <line x1="573" y1="117" x2="554" y2="150" stroke="#10b981" stroke-width="2.6" marker-end="url(#som-arrow-green)"/>
  <circle cx="549" cy="158" r="6" fill="#10b981" stroke="#f8fafc" stroke-width="1.5"/>
  <text x="588" y="174" text-anchor="start" fill="#34d399" font-size="10.5" font-weight="700">W₂(1) (h grande)</text>

  <!-- Peso W1 vecino -->
  <circle cx="676" cy="96" r="8" class="svg-node svg-node-hidden"/>
  <text x="688" y="84" text-anchor="middle" class="svg-node-text" font-size="11" font-weight="700">W₁(0)</text>

  <!-- Flecha movimiento menor de W1(0) a W1(1) si vecindad continua -->
  <line x1="669" y1="100" x2="646" y2="114" stroke="#f59e0b" stroke-width="2.2" marker-end="url(#som-arrow-amber)"/>
  <circle cx="639" cy="118" r="5.5" fill="#f59e0b" stroke="#f8fafc" stroke-width="1.5"/>
  <text x="684" y="130" text-anchor="middle" fill="#fbbf24" font-size="10.5" font-weight="700">W₁(1) si h &gt; 0</text>

  <!-- Nota derecha -->
  <rect x="386" y="252" width="358" height="76" rx="8" class="svg-note-bg"/>
  <text x="565" y="273" text-anchor="middle" fill="#34d399" font-size="11.5" font-weight="700">Aprendizaje estrictamente ONLINE (secuencial)</text>
  <text x="565" y="292" text-anchor="middle" class="svg-label-muted" font-size="10.5">El patrón p₂ compite contra W(1), NUNCA contra W(0)</text>
  <text x="565" y="311" text-anchor="middle" fill="#fbbf24" font-size="10.5">Vecindad nula: solo cambia j* | Continua: cambian todas</text>
</svg>`,
          svgDiagram2: `
<svg class="lab-svg-diagram" viewBox="0 0 760 205" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Curvas de vecindad SOM y flujo online p1 a p2">
  <defs>
    <marker id="som2-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 1 L10 5 L0 9 z" fill="#38bdf8"/></marker>
  </defs>
  <!-- Panel izquierdo: Curvas de vecindad -->
  <rect x="14" y="10" width="366" height="184" rx="10" fill="rgba(251,191,36,0.07)" stroke="#fbbf24" stroke-width="1"/>
  <text x="197" y="32" text-anchor="middle" fill="#fbbf24" font-size="12" font-weight="700">¿Cuánto vale h en la ganadora (d=0) y vecinas?</text>
  <line x1="65" y1="162" x2="355" y2="162" stroke="#64748b" stroke-width="1.2"/>
  <line x1="65" y1="46" x2="65" y2="162" stroke="#64748b" stroke-width="1.2"/>
  <text x="58" y="60" text-anchor="end" fill="#38bdf8" font-size="10">1.0</text>
  <text x="58" y="110" text-anchor="end" fill="#34d399" font-size="10">0.5</text>
  <text x="58" y="164" text-anchor="end" class="svg-label-muted" font-size="10">0</text>
  <text x="65" y="176" text-anchor="middle" class="svg-label-muted" font-size="10">d=0</text>
  <text x="200" y="176" text-anchor="middle" class="svg-label-muted" font-size="10">dist(Wᵢ, W_j*)</text>

  <!-- 1/(1+d) -->
  <path d="M 65 56 Q 120 108 345 142" fill="none" stroke="#38bdf8" stroke-width="2.4"/>
  <circle cx="65" cy="56" r="4" fill="#38bdf8"/>
  <text x="138" y="62" fill="#38bdf8" font-size="10.5" font-weight="700">1/(1+d) → gana=1.0</text>

  <!-- 1/(2+d) -->
  <path d="M 65 109 Q 130 132 345 150" fill="none" stroke="#34d399" stroke-width="2.4"/>
  <circle cx="65" cy="109" r="4" fill="#34d399"/>
  <text x="155" y="106" fill="#34d399" font-size="10.5" font-weight="700">1/(2+d) → ¡gana=0.5!</text>

  <!-- Vecindad Nula -->
  <line x1="65" y1="56" x2="65" y2="162" stroke="#fb7185" stroke-width="2" stroke-dasharray="4,3"/>
  <line x1="68" y1="160" x2="345" y2="160" stroke="#fb7185" stroke-width="2" stroke-dasharray="4,3"/>
  <text x="255" y="152" fill="#fb7185" font-size="10">Nula (d&gt;0 → h=0)</text>

  <!-- Panel derecho: Flujo Online -->
  <rect x="394" y="10" width="352" height="184" rx="10" fill="rgba(52,211,153,0.07)" stroke="#34d399" stroke-width="1"/>
  <text x="570" y="32" text-anchor="middle" fill="#34d399" font-size="12" font-weight="700">Regla Online: nunca recicles W(0)</text>
  <rect x="414" y="54" width="128" height="44" rx="7" class="svg-node svg-node-in"/>
  <text x="478" y="73" text-anchor="middle" class="svg-node-text" font-size="11" font-weight="700">1. Entra p₁ + W(0)</text>
  <text x="478" y="89" text-anchor="middle" class="svg-label-muted" font-size="9.5">Gana BMU y mueve pesos</text>

  <line x1="544" y1="76" x2="588" y2="76" stroke="#38bdf8" stroke-width="2" marker-end="url(#som2-arr)"/>

  <rect x="594" y="54" width="134" height="44" rx="7" class="svg-node svg-node-out"/>
  <text x="661" y="73" text-anchor="middle" fill="#6ee7b7" font-size="11.5" font-weight="700">W(1) Guardado</text>
  <text x="661" y="89" text-anchor="middle" class="svg-label-muted" font-size="9.5">Pisa al W(0) viejo</text>

  <line x1="661" y1="100" x2="661" y2="124" stroke="#38bdf8" stroke-width="2" marker-end="url(#som2-arr)"/>

  <rect x="414" y="128" width="314" height="46" rx="7" class="svg-note-bg"/>
  <text x="571" y="148" text-anchor="middle" fill="#38bdf8" font-size="11" font-weight="700">2. Entra p₂ ➔ compite SÍ o SÍ contra W(1) ✓</text>
  <text x="571" y="164" text-anchor="middle" fill="#fb7185" font-size="10">(Comparar p₂ contra W(0) da ejercicio anulado ✗)</text>
</svg>`,
          notasClave: [
            "**Sin neurona bias:** A diferencia de Perceptrón y MLP, en SOM las $D$ entradas se conectan directamente a las $M$ neuronas competitivas de salida.",
            "**Atracción geométrica:** El vector $\\mathbf{x} - \\mathbf{w}_i(t)$ apunta desde $\\mathbf{w}_i$ hacia $\\mathbf{x}$, por eso al sumar $\\alpha\\,h\\,(\\mathbf{x} - \\mathbf{w}_i)$ cada neurona se mueve **acercándose** al patrón presentado.",
            "**Modo online obligatorio:** Apenas actualizás los pesos tras presentar $p_1$, esos valores $W(1)$ reemplazan de inmediato a $W(0)$ para evaluar $p_2$."
          ]
        },
        {
          id: "PRAC-SOM-02",
          tema: "SOM",
          tipo: "algoritmo",
          titulo: "Algoritmo Paso a Paso de Kohonen SOM (Competencia, Cooperación y Adaptación)",
          etiquetaNaturaleza: "ENTRENAMIENTO PRÁCTICO · NO ES PREGUNTA DE PARCIAL",
          resumen: "Los 5 pasos exactos para resolver cualquier ejercicio de entrenamiento SOM en el parcial, cubriendo tanto vecindad nula como vecindad continua.",
          pasos: [
            {
              nro: 1,
              titulo: "Fijar arquitectura inicial, tasa α y función de vecindad",
              queHago: "Anoto entradas $D$, neuronas de salida $M$, los pesos iniciales $W_j(0)$, la tasa $\\alpha$ y si la vecindad $h$ es **nula** o **continua**.",
              formula: "$$W_j(0) = [w_{j1}(0),\\; w_{j2}(0),\\; \\dots,\\; w_{jD}(0)], \\qquad \\alpha \\in (0, 1]$$",
              queEscriboEnHoja: "«Arranco con los pesos iniciales W(0), α = ... y la vecindad h dada por el enunciado.»"
            },
            {
              nro: 2,
              titulo: "Presentar el patrón p con los pesos vigentes W(t)",
              queHago: "Tomo el patrón actual; si ya vengo de otro patrón ($p_1 \\to p_2$), uso **sí o sí los pesos nuevos $W(t)$**, nunca los iniciales.",
              formula: "$$\\mathbf{x}(t) = [x_1,\\; x_2,\\; \\dots,\\; x_D], \\qquad \\text{comparar contra } W_j(t)$$",
              queEscriboEnHoja: "«Presento el patrón p = [...] evaluando contra los pesos vigentes W(t).»"
            },
            {
              nro: 3,
              titulo: "Fase de Competencia: distancias euclídeas y ganadora (BMU)",
              queHago: "Mido la distancia euclídea (con la raíz escrita) de $\\mathbf{x}$ a cada neurona; la más cercana gana ($j^*$).",
              formula: "$$d_j = \\sqrt{\\sum_{i=1}^{D} (x_i - w_{ji}(t))^2} \\qquad\\Longrightarrow\\qquad j^* = \\arg\\min_j\\, d_j$$",
              queEscriboEnHoja: "«Mido la distancia del patrón a cada neurona: como d_k es la más chica, gana la neurona W_k.»"
            },
            {
              nro: 4,
              titulo: "Fase de Cooperación: evaluar factor de vecindad h(i, j*)",
              queHago: "Si la vecindad es **nula**, solo cambia la ganadora ($h=1$, resto $0$). Si es **continua**, calculo $h$ tanto en la ganadora (`dist=0`) como en cada vecina usando las distancias entre los pesos **actuales $W(t)$**.",
              formula: "$$h(i, j^*) = \\begin{cases} 1 \\text{ si } i=j^*,\\; 0 \\text{ si } i\\neq j^* & \\text{(vecindad nula)} \\\\ \\dfrac{1}{c + \\sqrt{\\sum_k (w_{ik}(t) - w_{j^* k}(t))^2}} & \\text{(vecindad continua, } c\\in\\{1,2\\}\\text{)} \\end{cases}$$",
              queEscriboEnHoja: "«Calculo cuánto arrastra la ganadora a cada neurona usando la función de vecindad h (tanto para la ganadora d=0 como para las vecinas).»"
            },
            {
              nro: 5,
              titulo: "Fase de Adaptación: actualizar todas las neuronas con h > 0",
              queHago: "Corro los pesos hacia el patrón haciendo **peso actual + $\\alpha\\cdot h\\cdot(\\text{patrón} - \\text{peso})$** y guardo $W(t+1)$ para el próximo patrón.",
              formula: "$$w_{ji}(t+1) = w_{ji}(t) + \\alpha \\cdot h(j, j^*) \\cdot \\big(x_i - w_{ji}(t)\\big)$$",
              queEscriboEnHoja: "«Acerco los pesos hacia el patrón según α·h y guardo W(t+1) para lo que sigue.»"
            }
          ]
        },
        {
          id: "PRAC-SOM-03",
          tema: "SOM",
          tipo: "algoritmo",
          titulo: "Sub-procedimientos de Examen: Clasificar Nuevos Ejemplos y Dibujar la Red",
          etiquetaNaturaleza: "ENTRENAMIENTO PRÁCTICO · NO ES PREGUNTA DE PARCIAL",
          resumen: "Cómo responder los incisos complementarios clásicos de la Guía TP (Punto 02) y de parciales: clasificación post-entrenamiento y gráfico de arquitectura.",
          pasos: [
            {
              nro: 1,
              titulo: "Clasificar ejemplos de prueba usando pesos actualizados W(final)",
              queHago: "Mido la distancia de cada ejemplo de prueba a los últimos pesos actualizados $W_j(\\text{final})$ y le asigno la clase de la más cercana (**sin modificar los pesos**).",
              formula: "$$\\text{Clase}(\\mathbf{x}_{\\text{test}}) = C_{j^*}, \\qquad j^* = \\arg\\min_j \\|\\mathbf{x}_{\\text{test}} - W_j(\\text{final})\\|_2$$",
              queEscriboEnHoja: "«Mido distancia a los pesos finales sin moverlos: como quedó más cerca de W_m, pertenece a la Clase C_m.»"
            },
            {
              nro: 2,
              titulo: "Graficar la arquitectura final con pesos etiquetados",
              queHago: "Dibujo los $D$ nodos de entrada (sin bias $x_0$), los $M$ de salida y rotulo cada flecha con su valor final $w_{ji}$.",
              formula: "$$\\text{Entrada } x_i \\xrightarrow{\\;w_{ji}\\;} \\text{Salida } W_j \\qquad (D \\times M \\text{ conexiones totales})$$",
              queEscriboEnHoja: "«Dibujo las entradas conectadas a todas las salidas (sin bias) poniendo el valor final de cada peso sobre su flecha.»"
            }
          ]
        },
        {
          id: "PRAC-SOM-04",
          tema: "SOM",
          tipo: "plantilla",
          titulo: "Plantilla de Hoja en Blanco: Parcial Real 2023 (Vecindad Continua h = 1/(2 + dist))",
          etiquetaNaturaleza: "ENTRENAMIENTO PRÁCTICO · NO ES PREGUNTA DE PARCIAL",
          resumen: "Modelo completo con números verificados del Parcial 2023 (IA-H0075): W_1(0) = [+0,70; -0,10], W_2(0) = [-0,10; +0,40], α = 0,70, p_2 = [-0,80; -0,90] y vecindad h(i) = 1 / (2 + dist(W_i, W_j*)).",
          svgDiagram: `
<svg class="lab-svg-diagram" viewBox="0 0 760 205" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Movimiento vectorial de W1 y W2 hacia p2 en Parcial 2023 SOM">
  <defs>
    <marker id="som3-g" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 1 L10 5 L0 9 z" fill="#34d399"/></marker>
    <marker id="som3-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 1 L10 5 L0 9 z" fill="#fbbf24"/></marker>
  </defs>
  <text x="380" y="22" text-anchor="middle" fill="#38bdf8" font-size="12" font-weight="700">Visualización geométrica del Parcial 2023: W₁ y W₂ se acercan hacia p₂ = (−0.80, −0.90)</text>
  <!-- Plot box x in [-1, +1] mapped to [120..520] (x_px = 320 + 200*x), y in [-1, +1] mapped to [180..40] (y_px = 110 - 70*y) -->
  <line x1="100" y1="110" x2="540" y2="110" stroke="#475569" stroke-width="1.2" stroke-dasharray="3,3"/>
  <line x1="320" y1="36" x2="320" y2="188" stroke="#475569" stroke-width="1.2" stroke-dasharray="3,3"/>
  <text x="536" y="104" fill="#64748b" font-size="10">x₁</text>
  <text x="328" y="46" fill="#64748b" font-size="10">x₂</text>

  <!-- p2=(-0.80, -0.90) -> (160, 173) -->
  <circle cx="160" cy="173" r="7" fill="#38bdf8" stroke="#fff" stroke-width="1.5"/>
  <text x="148" y="191" text-anchor="middle" fill="#38bdf8" font-size="11" font-weight="700">p₂ (−0.80, −0.90)</text>

  <!-- W2(0)=(-0.10, +0.40) -> (300, 82) | W2(1)=(-0.345, -0.055) -> (251, 113.8) -->
  <circle cx="300" cy="82" r="6" class="svg-node svg-node-out"/>
  <text x="300" y="70" text-anchor="middle" class="svg-node-text" font-size="10.5" font-weight="700">W₂(0) (−0.10, 0.40)</text>
  <line x1="296" y1="86" x2="256" y2="110" stroke="#34d399" stroke-width="2.5" marker-end="url(#som3-g)"/>
  <circle cx="251" cy="114" r="5.5" fill="#34d399"/>
  <text x="238" y="130" text-anchor="end" fill="#34d399" font-size="10.5" font-weight="700">W₂(1) ganadora (h=0.50)</text>

  <!-- W1(0)=(+0.70, -0.10) -> (460, 117) | W1(1)=(+0.343, -0.290) -> (388.6, 130.3) -->
  <circle cx="460" cy="117" r="6" class="svg-node svg-node-hidden"/>
  <text x="466" y="134" text-anchor="start" class="svg-node-text" font-size="10.5" font-weight="700">W₁(0) (0.70, −0.10)</text>
  <line x1="454" y1="118" x2="395" y2="129" stroke="#fbbf24" stroke-width="2.5" marker-end="url(#som3-a)"/>
  <circle cx="389" cy="130" r="5.5" fill="#fbbf24"/>
  <text x="404" y="152" fill="#fbbf24" font-size="10.5" font-weight="700">W₁(1) vecina (h=0.34)</text>

  <rect x="556" y="44" width="188" height="136" rx="8" class="svg-note-bg"/>
  <text x="650" y="68" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">Control visual rápido</text>
  <text x="568" y="92" class="svg-node-text" font-size="10.5">• Ambas flechas apuntan</text>
  <text x="568" y="108" class="svg-node-text" font-size="10.5">  hacia p₂ (nunca al revés).</text>
  <text x="568" y="132" class="svg-label-muted" font-size="10">• +0.70 bajó a +0.343</text>
  <text x="568" y="148" class="svg-label-muted" font-size="10">• +0.40 bajó a −0.055</text>
  <text x="568" y="166" fill="#fbbf24" font-size="10">✓ ¡Signo verificado!</text>
</svg>`,
          tablaPlantilla: {
            tituloTabla: "Tabla 1 — Fases de Competencia y Cooperación",
            columnas: ["Neurona j", "Peso W_j(0)", "d(p_2, W_j)", "¿Ganadora BMU?", "dist(W_j, W_2)", "Factor h(j)"],
            filas: [
              ["W_1 (Vecina)", "[+0,700; -0,100]", "√2,89 = 1,700", "No", "√0,89 ≈ 0,943", "1 / (2 + 0,943) ≈ 0,340"],
              ["W_2 (Ganadora)", "[-0,100; +0,400]", "√2,18 ≈ 1,476", "✅ Sí (j* = 2)", "0", "1 / (2 + 0) = 0,500"]
            ]
          },
          tablaPlantilla2: {
            tituloTabla: "Tabla 2 — Fase de Adaptación Online: W_j(1) = W_j(0) + α · h(j) · (p_2 - W_j(0))",
            columnas: ["Neurona", "α · h(j)", "Diferencia (p_2 - W(0))", "Incremento ΔW", "Peso Nuevo W(1)"],
            filas: [
              ["W_2 (Ganadora)", "0,70 × 0,500 = 0,350", "[-0,700; -1,300]", "[-0,245; -0,455]", "[-0,345; -0,055]"],
              ["W_1 (Vecina)", "0,70 × 0,340 = 0,238", "[-1,500; -0,800]", "[-0,357; -0,190]", "[+0,343; -0,290]"]
            ]
          },
          tipHoja: "💡 Chequeo instantáneo en calculadora: las coordenadas de W(1) SIEMPRE deben quedar comprendidas entre las de W(0) y p_2. Por ejemplo, +0,700 se movió hacia -0,800 quedando en +0,343. ¡Si te dio mayor a +0,700, invertiste el signo de (p_2 - W)!"
        },
        {
          id: "PRAC-SOM-05",
          tema: "SOM",
          tipo: "formula",
          titulo: "Flashcard 1: Distancia Euclídea y Selección de BMU",
          etiquetaNaturaleza: "ENTRENAMIENTO PRÁCTICO · NO ES PREGUNTA DE PARCIAL",
          preguntaFrente: "¿Qué criterio define a la neurona ganadora (BMU) en SOM y cómo conviene anotar su cálculo en el parcial?",
          respuestaDorso: "Gana la neurona $j^*$ con **menor distancia euclídea** entre su vector de pesos $W_j(t)$ y el patrón de entrada $\\mathbf{x}$:\n$$d_j = \\sqrt{\\sum_{i=1}^{D} (x_i - w_{ji}(t))^2}, \\qquad j^* = \\arg\\min_j\\, d_j$$\nEn la hoja se debe escribir la raíz cuadrada explícita (no solo $d_j^2$) y declarar en una frase: *'La neurona $j^*$ resulta ganadora por presentar la menor distancia euclídea'*."
        },
        {
          id: "PRAC-SOM-06",
          tema: "SOM",
          tipo: "formula",
          titulo: "Flashcard 2: Vecindad Nula vs Continua (Denominador 1+dist vs 2+dist)",
          etiquetaNaturaleza: "ENTRENAMIENTO PRÁCTICO · NO ES PREGUNTA DE PARCIAL",
          preguntaFrente: "¿Cuánto vale el factor de vecindad h para la neurona ganadora y sus vecinas según la función dada?",
          respuestaDorso: "- **Vecindad nula:** $h(j^*) = 1$ y $h(i) = 0$ para todo $i \\neq j^*$ (solo se actualiza la ganadora).\n- **Vecindad continua:** $h(i) = \\dfrac{1}{1 + \\text{dist}(W_i, W_{j^*})}$ (Guía TP) o $h(i) = \\dfrac{1}{2 + \\text{dist}(W_i, W_{j^*})}$ (Parcial 2023).\n¡Ojo con la ganadora! Como $\\text{dist}(W_{j^*}, W_{j^*}) = 0$, su factor vale **$1$** si el denominador es $1+d$, pero vale **$0{,}500$** si el denominador es $2+d$."
        },
        {
          id: "PRAC-SOM-07",
          tema: "SOM",
          tipo: "formula",
          titulo: "Flashcard 3: Ecuación de Adaptación de Pesos y Regla del Signo",
          etiquetaNaturaleza: "ENTRENAMIENTO PRÁCTICO · NO ES PREGUNTA DE PARCIAL",
          preguntaFrente: "¿Cuál es la fórmula de actualización de pesos en SOM y cómo verificás que no invertiste el signo?",
          respuestaDorso: "$$w_{ji}(t+1) = w_{ji}(t) + \\alpha \\cdot h(j, j^*) \\cdot \\big(x_i - w_{ji}(t)\\big)$$\nEl término entre paréntesis siempre es **Patrón menos Peso** $(x_i - w_{ji})$, nunca al revés. Como $\\alpha\\cdot h \\in (0, 1]$, cada nuevo peso $w_{ji}(t+1)$ tiene que quedar **entre** $w_{ji}(t)$ y $x_i$ (acercándose al patrón)."
        },
        {
          id: "PRAC-SOM-08",
          tema: "SOM",
          tipo: "formula",
          titulo: "Flashcard 4: Aprendizaje Online Secuencial entre Patrones",
          etiquetaNaturaleza: "ENTRENAMIENTO PRÁCTICO · NO ES PREGUNTA DE PARCIAL",
          preguntaFrente: "Si el parcial pide 'presentar el patrón p₁ y luego p₂', ¿contra qué pesos calculás las distancias para p₂?",
          respuestaDorso: "Obligatoriamente contra **$W(1)$**, es decir, los pesos **ya actualizados** luego de presentar $p_1$ (aprendizaje estrictamente *online*).\nSi evaluás $p_2$ contra $W(0)$, podés elegir una neurona ganadora distinta y la cátedra califica el ejercicio completo con **0 puntos**."
        },
        {
          id: "PRAC-SOM-09",
          tema: "SOM",
          tipo: "trampa",
          titulo: "Las 6 Trampas Mortales de SOM en el Parcial",
          etiquetaNaturaleza: "ENTRENAMIENTO PRÁCTICO · NO ES PREGUNTA DE PARCIAL",
          resumen: "Los errores sistemáticos que más anulan ejercicios completos de Kohonen SOM en UTN FRRe.",
          trampas: [
            "**Ignorar la función de vecindad continua:** Si el enunciado da $h(i) = 1/(1+\\text{dist})$ o $1/(2+\\text{dist})$, debés actualizar **la ganadora Y todas las vecinas**. Actualizar solo la ganadora anula el ejercicio.",
            "**Olvidar la persistencia online entre patrones p₁ -> p₂ -> p₃:** Evaluar el segundo patrón contra los pesos iniciales $W(0)$ en lugar de usar $W(1)$ recién calculados puede cambiar hasta la neurona ganadora.",
            "**Asumir h(ganadora) = 1 cuando la fórmula es 1 / (2 + dist):** Con denominador $2 + \\text{dist}$, para la ganadora ($\\text{dist}=0$) da $h = 1/2 = 0{,}500$, NO $1$. Leé con lupa el constante del denominador.",
            "**Calcular $\\text{dist}(W_i, W_{j^*})$ con los pesos ya actualizados $W_{j^*}(t+1)$:** Dentro de un mismo patrón, tanto la distancia competitiva como las distancias entre neuronas para $h$ se evalúan usando el estado actual $W(t)$ **antes** de aplicar $\\Delta W$.",
            "**Invertir el orden de la resta a (w_ji - x_i):** Poner el peso primero invierte el vector dirección y **aleja** la neurona del patrón presentado en vez de atraerla. Recordá siempre: *Entrada menos Peso* $(x_i - w_{ji})$.",
            "**Dibujar nodo bias x₀ = 1 o cruzar los subíndices w_ji en el esquema:** SOM no lleva bias en la capa de entrada, y cada flecha que entra a la salida $W_j$ desde $x_i$ se rotula $w_{ji}$ (componente $i$ del vector $W_j$)."
          ]
        }
      ]
    },

    // =========================================================================
    // TEMA 6: K-NEAREST NEIGHBORS (KNN) Y LEAVE-ONE-OUT (LOOCV)
    // =========================================================================
    {
      id: "KNN",
      nombre: "K-Nearest Neighbors y LOOCV",
      badge: "Aprendizaje Lazy · Votación Simple/Ponderada y K Óptimo",
      icono: "📍",
      ponderacion: "20%–25% típico · Cuentas simples pero exige precisión con LOOCV y ponderación",
      referenciaCatedra: "Guía Práctica KNN · Parciales 2020/2021, 2023 (Tema 2), 19/11/2025 y Finales 2021 (17/02, 27/04)",
      referenciaLinks: [
        { label: "guia_practica_knn.pdf", path: "MODELOS_ORIGINALES/4_GUIAS_PRACTICAS_CATEDRA/guia_practica_knn.pdf", kind: "pdf" },
        { label: "parcial2_2025_11_19_oficial.pdf", path: "MODELOS_ORIGINALES/1_PARCIALES_2DO_PARCIAL/parcial2_2025_11_19_oficial.pdf", kind: "pdf" },
        { label: "parcial2_2023_teoria_tema2.jpeg", path: "MODELOS_ORIGINALES/1_PARCIALES_2DO_PARCIAL/parcial2_2023_teoria_tema2.jpeg", kind: "img" },
        { label: "07_knn_leave_one_out.md", path: "GUIAS_PASO_A_PASO/07_knn_leave_one_out.md", kind: "md" }
      ],
      tiempoSugerido: "20–25 min",
      objetivo: "Clasificar nuevas consultas con KNN mayoritario o ponderado (1/d, 1/d², 1/(1+d²)), armar la tabla simétrica de distancias para elegir K* mediante Leave-One-Out Cross-Validation y resolver el caso teórico K = m + n.",
      items: [
        {
          id: "PRAC-KNN-01",
          tema: "KNN",
          tipo: "diagrama",
          titulo: "Vecindad Radial (Simple vs Ponderado) y Validación Leave-One-Out (LOOCV)",
          etiquetaNaturaleza: "ENTRENAMIENTO PRÁCTICO · NO ES PREGUNTA DE PARCIAL",
          resumen: "KNN no entrena un modelo previo (lazy evaluation): guarda todas las instancias y clasifica según los K vecinos más cercanos. Con ponderación por distancia, un vecino muy cercano puede derrotar a varios vecinos más lejanos.",
          svgDiagram: `
<svg class="lab-svg-diagram" viewBox="0 0 760 345" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Comparación de KNN simple vs ponderado con círculos de vecindad y flujo Leave-One-Out">
  <defs>
    <marker id="knn-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8"/>
    </marker>
    <marker id="knn-arrow-green" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#10b981"/>
    </marker>
  </defs>

  <text x="186" y="22" text-anchor="middle" class="svg-node-text" font-size="12" font-weight="700">1. VECINDAD RADIAL: SIMPLE VS PONDERADO</text>
  <text x="568" y="22" text-anchor="middle" class="svg-node-text" font-size="12" font-weight="700">2. LEAVE-ONE-OUT CROSS-VALIDATION (LOOCV)</text>

  <!-- Radio exterior K=3 y radio interior K=1 -->
  <circle cx="176" cy="134" r="92" fill="rgba(16,185,129,0.06)" stroke="#10b981" stroke-width="1.8" stroke-dasharray="5 4"/>
  <circle cx="176" cy="134" r="46" fill="rgba(56,189,248,0.08)" stroke="#38bdf8" stroke-width="1.8" stroke-dasharray="4 3"/>

  <text x="272" y="72" text-anchor="start" fill="#34d399" font-size="11" font-weight="700">K = 3</text>
  <text x="224" y="108" text-anchor="start" fill="#38bdf8" font-size="11" font-weight="700">K = 1</text>

  <!-- Punto consulta x_q -->
  <polygon points="172,125 180,134 172,143 164,134" fill="#f8fafc" stroke="#38bdf8" stroke-width="2"/>
  <text x="166" y="159" text-anchor="middle" class="svg-node-text" font-size="11" font-weight="700">x_q</text>

  <!-- Vecino 1 muy cercano (Clase A) -->
  <circle cx="198" cy="126" r="7" fill="#38bdf8" stroke="#f8fafc" stroke-width="1.5"/>
  <text x="200" y="148" text-anchor="middle" class="svg-label-muted" font-size="9.5">P₁(A)</text>

  <!-- Vecinos 2 y 3 más lejanos (Clase B) -->
  <rect x="104" y="96" width="14" height="14" rx="2" fill="#f59e0b" stroke="#f8fafc" stroke-width="1.5"/>
  <text x="72" y="91" text-anchor="middle" fill="#fbbf24" font-size="10">P₂(B) d=2,0</text>

  <rect x="116" y="182" width="14" height="14" rx="2" fill="#f59e0b" stroke="#f8fafc" stroke-width="1.5"/>
  <text x="86" y="210" text-anchor="middle" fill="#fbbf24" font-size="10">P₃(B) d=2,5</text>

  <!-- Punto 4 fuera de K=3 -->
  <circle cx="304" cy="186" r="7" fill="#38bdf8" opacity="0.55" stroke="#94a3b8" stroke-width="1.2"/>
  <text x="304" y="206" text-anchor="middle" class="svg-label-muted" font-size="10">P₄(A) fuera</text>

  <!-- Nota izquierda -->
  <rect x="16" y="252" width="340" height="76" rx="8" class="svg-note-bg"/>
  <text x="186" y="273" text-anchor="middle" class="svg-node-text" font-size="11" font-weight="700">Con K = 3 vecinos, la ponderación invierte el fallo:</text>
  <text x="186" y="292" text-anchor="middle" fill="#fbbf24" font-size="10.5">Simple: Clase B = 2 votos vs A = 1  → Gana B</text>
  <text x="186" y="311" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">Ponderado (1/d²): A = 100 vs B = 0,41  → Gana A</text>

  <!-- Separador vertical -->
  <line x1="370" y1="18" x2="370" y2="334" stroke="rgba(148,163,184,0.4)" stroke-width="1.5" stroke-dasharray="4 4"/>

  <!-- Flujo derecho LOOCV -->
  <rect x="388" y="42" width="166" height="52" rx="8" class="svg-node svg-node-in"/>
  <text x="471" y="64" text-anchor="middle" class="svg-node-text" font-size="11.5" font-weight="700">1. Aislar pᵢ (Prueba)</text>
  <text x="471" y="82" text-anchor="middle" class="svg-label-muted" font-size="10">Quedan N − 1 puntos</text>

  <line x1="556" y1="68" x2="584" y2="68" stroke="#38bdf8" stroke-width="2" marker-end="url(#knn-arrow)"/>

  <rect x="588" y="42" width="156" height="52" rx="8" class="svg-node svg-node-hidden"/>
  <text x="666" y="64" text-anchor="middle" class="svg-node-text" font-size="11.5" font-weight="700">2. Simetría dᵢⱼ = dⱼᵢ</text>
  <text x="666" y="82" text-anchor="middle" class="svg-label-muted" font-size="10">Diagonal (dᵢᵢ) prohibida</text>

  <line x1="666" y1="96" x2="666" y2="124" stroke="#38bdf8" stroke-width="2" marker-end="url(#knn-arrow)"/>

  <rect x="388" y="128" width="356" height="54" rx="8" class="svg-node svg-node-out"/>
  <text x="566" y="149" text-anchor="middle" class="svg-node-text" font-size="11.5" font-weight="700">3. Clasificar pᵢ usando K vecinos más próximos</text>
  <text x="566" y="168" text-anchor="middle" class="svg-label-muted" font-size="10.5">Repetir para i = 1..N  →  Comparar predicción vs clase real</text>

  <line x1="566" y1="184" x2="566" y2="210" stroke="#10b981" stroke-width="2" marker-end="url(#knn-arrow-green)"/>

  <!-- Caja inferior LOOCV -->
  <rect x="388" y="214" width="356" height="114" rx="8" class="svg-note-bg"/>
  <text x="566" y="236" text-anchor="middle" fill="#34d399" font-size="11.5" font-weight="700">4. Elegir K* con menor tasa de error LOOCV</text>
  <text x="566" y="257" text-anchor="middle" class="svg-node-text" font-size="11">E_LOOCV(K) = (Cantidad de Errores) / N</text>
  <text x="566" y="280" text-anchor="middle" class="svg-label-muted" font-size="10.5">Solo calculás N(N−1)/2 pares de distancias una vez</text>
  <text x="566" y="302" text-anchor="middle" fill="#fbbf24" font-size="10.5" font-weight="600">En binario usar K impares (1, 3, 5) para evitar empates</text>
</svg>`,
          svgDiagram2: `
<svg class="lab-svg-diagram" viewBox="0 0 760 205" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Efecto del parametro K y matriz triangular simetrica LOOCV">
  <!-- Panel izquierdo: Efecto de K -->
  <rect x="14" y="10" width="356" height="184" rx="10" fill="rgba(56,189,248,0.07)" stroke="#38bdf8" stroke-width="1"/>
  <text x="192" y="32" text-anchor="middle" fill="#38bdf8" font-size="12" font-weight="700">¿Qué pasa al cambiar K? (Sesgo vs Varianza)</text>
  <rect x="28" y="48" width="154" height="82" rx="6" class="svg-note-bg"/>
  <text x="105" y="68" text-anchor="middle" fill="#fb7185" font-size="11.5" font-weight="700">K = 1 (muy chico)</text>
  <text x="105" y="88" text-anchor="middle" class="svg-node-text" font-size="10">Sigue cada punto aislado</text>
  <text x="105" y="104" text-anchor="middle" class="svg-label-muted" font-size="10">Muy sensible al ruido</text>
  <text x="105" y="120" text-anchor="middle" fill="#fb7185" font-size="10">(Overfitting local)</text>

  <rect x="196" y="48" width="160" height="82" rx="6" class="svg-note-bg"/>
  <text x="276" y="68" text-anchor="middle" fill="#34d399" font-size="11.5" font-weight="700">K = m+n (todos)</text>
  <text x="276" y="88" text-anchor="middle" class="svg-node-text" font-size="10">Si simple: gana la clase</text>
  <text x="276" y="104" text-anchor="middle" class="svg-node-text" font-size="10">con más muestras (m &gt; n).</text>
  <text x="276" y="120" text-anchor="middle" fill="#fbbf24" font-size="10">Si m = n decide distancia</text>

  <text x="192" y="158" text-anchor="middle" class="svg-node-text" font-size="10.5">Usando LOOCV elegís K* que minimiza errores reales</text>
  <text x="192" y="176" text-anchor="middle" fill="#34d399" font-size="10">Tip: K impar en 2 clases evita empates</text>

  <!-- Panel derecho: Matriz triangular LOOCV -->
  <rect x="384" y="10" width="362" height="184" rx="10" fill="rgba(251,191,36,0.07)" stroke="#fbbf24" stroke-width="1"/>
  <text x="565" y="32" text-anchor="middle" fill="#fbbf24" font-size="12" font-weight="700">Atajo Matriz LOOCV (Triangular + Diagonal Tachada)</text>
  <!-- Grid 5x5 simple -->
  <text x="454" y="54" text-anchor="middle" class="svg-label-muted" font-size="10">p₁</text>
  <text x="494" y="54" text-anchor="middle" class="svg-label-muted" font-size="10">p₂</text>
  <text x="534" y="54" text-anchor="middle" class="svg-label-muted" font-size="10">p₃</text>
  <text x="574" y="54" text-anchor="middle" class="svg-label-muted" font-size="10">p₄</text>
  <text x="614" y="54" text-anchor="middle" class="svg-label-muted" font-size="10">p₅</text>

  <text x="424" y="76" text-anchor="end" class="svg-label-muted" font-size="10">p₁</text>
  <rect x="438" y="61" width="32" height="20" fill="rgba(251,113,133,0.2)" stroke="#fb7185"/><text x="454" y="75" text-anchor="middle" fill="#fb7185" font-size="10" font-weight="700">✕</text>
  <rect x="478" y="61" width="32" height="20" fill="rgba(56,189,248,0.18)" stroke="#38bdf8"/><text x="494" y="75" text-anchor="middle" fill="#7dd3fc" font-size="10">d₁₂</text>
  <rect x="518" y="61" width="32" height="20" fill="rgba(56,189,248,0.18)" stroke="#38bdf8"/><text x="534" y="75" text-anchor="middle" fill="#7dd3fc" font-size="10">d₁₃</text>
  <rect x="558" y="61" width="32" height="20" fill="rgba(56,189,248,0.18)" stroke="#38bdf8"/><text x="574" y="75" text-anchor="middle" fill="#7dd3fc" font-size="10">d₁₄</text>
  <rect x="598" y="61" width="32" height="20" fill="rgba(56,189,248,0.18)" stroke="#38bdf8"/><text x="614" y="75" text-anchor="middle" fill="#7dd3fc" font-size="10">d₁₅</text>

  <text x="424" y="98" text-anchor="end" class="svg-label-muted" font-size="10">p₂</text>
  <text x="454" y="97" text-anchor="middle" fill="#64748b" font-size="9.5">=</text>
  <rect x="478" y="83" width="32" height="20" fill="rgba(251,113,133,0.2)" stroke="#fb7185"/><text x="494" y="97" text-anchor="middle" fill="#fb7185" font-size="10" font-weight="700">✕</text>
  <rect x="518" y="83" width="32" height="20" fill="rgba(56,189,248,0.18)" stroke="#38bdf8"/><text x="534" y="97" text-anchor="middle" fill="#7dd3fc" font-size="10">d₂₃</text>
  <rect x="558" y="83" width="32" height="20" fill="rgba(56,189,248,0.18)" stroke="#38bdf8"/><text x="574" y="97" text-anchor="middle" fill="#7dd3fc" font-size="10">d₂₄</text>
  <rect x="598" y="83" width="32" height="20" fill="rgba(56,189,248,0.18)" stroke="#38bdf8"/><text x="614" y="97" text-anchor="middle" fill="#7dd3fc" font-size="10">d₂₅</text>

  <text x="424" y="120" text-anchor="end" class="svg-label-muted" font-size="10">p₃</text>
  <text x="454" y="119" text-anchor="middle" fill="#64748b" font-size="9.5">=</text>
  <text x="494" y="119" text-anchor="middle" fill="#64748b" font-size="9.5">=</text>
  <rect x="518" y="105" width="32" height="20" fill="rgba(251,113,133,0.2)" stroke="#fb7185"/><text x="534" y="119" text-anchor="middle" fill="#fb7185" font-size="10" font-weight="700">✕</text>
  <rect x="558" y="105" width="32" height="20" fill="rgba(56,189,248,0.18)" stroke="#38bdf8"/><text x="574" y="119" text-anchor="middle" fill="#7dd3fc" font-size="10">d₃₄</text>
  <rect x="598" y="105" width="32" height="20" fill="rgba(56,189,248,0.18)" stroke="#38bdf8"/><text x="614" y="119" text-anchor="middle" fill="#7dd3fc" font-size="10">d₃₅</text>

  <text x="424" y="142" text-anchor="end" class="svg-label-muted" font-size="10">p₄</text>
  <rect x="558" y="127" width="32" height="20" fill="rgba(251,113,133,0.2)" stroke="#fb7185"/><text x="574" y="141" text-anchor="middle" fill="#fb7185" font-size="10" font-weight="700">✕</text>
  <rect x="598" y="127" width="32" height="20" fill="rgba(56,189,248,0.18)" stroke="#38bdf8"/><text x="614" y="141" text-anchor="middle" fill="#7dd3fc" font-size="10">d₄₅</text>

  <text x="424" y="164" text-anchor="end" class="svg-label-muted" font-size="10">p₅</text>
  <rect x="598" y="149" width="32" height="20" fill="rgba(251,113,133,0.2)" stroke="#fb7185"/><text x="614" y="163" text-anchor="middle" fill="#fb7185" font-size="10" font-weight="700">✕</text>

  <text x="688" y="88" text-anchor="middle" fill="#7dd3fc" font-size="10.5" font-weight="700">N(N−1)/2</text>
  <text x="688" y="104" text-anchor="middle" class="svg-label-muted" font-size="9.5">cuentas únicas</text>
  <text x="688" y="132" text-anchor="middle" fill="#fb7185" font-size="10" font-weight="700">✕ Sin autovecino</text>
  <text x="565" y="184" text-anchor="middle" class="svg-label-muted" font-size="9.5">Para evaluar pᵢ leés su fila completa y su columna hacia arriba</text>
</svg>`,
          notasClave: [
            "**Algoritmo perezoso (lazy):** No existe etapa de entrenamiento ni ecuación de frontera previa; todo cálculo ocurre recién al llegar $\\mathbf{x}_q$.",
            "**Tres pesos ponderados en cátedra:** $1/d$ y $1/d^2$ (Guía TP) y $1/(1+d^2)$ (para evitar división por cero cuando un punto coincide con $\\mathbf{x}_q$).",
            "**Diagonal excluida en LOOCV:** Al validar $\\mathbf{x}_i$, nunca puede figurar $\\mathbf{x}_i$ mismo entre sus $K$ vecinos."
          ]
        },
        {
          id: "PRAC-KNN-02",
          tema: "KNN",
          tipo: "algoritmo",
          titulo: "Algoritmo Paso a Paso: KNN Mayoritario Simple y KNN Ponderado",
          etiquetaNaturaleza: "ENTRENAMIENTO PRÁCTICO · NO ES PREGUNTA DE PARCIAL",
          resumen: "Procedimiento completo para clasificar una nueva instancia x_q dada una tabla de entrenamiento y un parámetro K.",
          pasos: [
            {
              nro: 1,
              titulo: "Calcular la distancia euclídea entre x_q y todas las instancias",
              queHago: "Calculo la distancia euclídea (anotando la raíz) desde el punto nuevo $\\mathbf{x}_q$ hacia cada dato conocido.",
              formula: "$$d(\\mathbf{x}_q, \\mathbf{x}_i) = \\sqrt{\\sum_{r=1}^{D} \\big(a_r(\\mathbf{x}_q) - a_r(\\mathbf{x}_i)\\big)^2}$$",
              queEscriboEnHoja: "«Calculo la distancia euclídea de x_q a cada punto conocido para ver cuáles quedan más cerca.»"
            },
            {
              nro: 2,
              titulo: "Ordenar las instancias de menor a mayor distancia y tomar las K primeras",
              queHago: "Ordeno de menor a mayor distancia y agarro solo los $K$ más cercanos con sus etiquetas de clase.",
              formula: "$$d_{(1)} \\le d_{(2)} \\le \\dots \\le d_{(K)} \\le \\dots \\le d_{(N)} \\quad\\Longrightarrow\\quad V_K = \\{\\mathbf{x}_{(1)}, \\dots, \\mathbf{x}_{(K)}\\}$$",
              queEscriboEnHoja: "«Elijo los K = ... vecinos con menor distancia: p_a (Clase ...), p_b (Clase ...).»"
            },
            {
              nro: 3,
              titulo: "Asignar pesos w_i (solo si es KNN Ponderado)",
              queHago: "Si es simple, cada uno vale $1$ voto. Si es ponderado, le doy más peso a los que están más cerca usando la fórmula que pide el enunciado ($1/d$, $1/d^2$ o $1/(1+d^2)$).",
              formula: "$$w_i = 1 \\;\\text{(Simple)} \\quad \\bigg| \\quad w_i = \\frac{1}{d_i} \\;\\text{ ó }\\; w_i = \\frac{1}{d_i^2} \\;\\text{ ó }\\; w_i = \\frac{1}{1 + d_i^2}$$",
              queEscriboEnHoja: "«Calculo el peso de cada vecino cercano para darle más voto a los que están más próximos.»"
            },
            {
              nro: 4,
              titulo: "Sumar votos / puntajes por clase y decidir por arg max",
              queHago: "Sumo los votos (o los pesos $w_i$) por clase y asigno el punto nuevo a la clase que junta mayor puntaje.",
              formula: "$$\\hat{f}(\\mathbf{x}_q) = \\arg\\max_{v \\in V} \\sum_{i \\in V_K} w_i\\,\\delta\\big(v, f(\\mathbf{x}_i)\\big), \\qquad \\delta(a,b) = \\begin{cases} 1 & a=b \\\\ 0 & a\\neq b \\end{cases}$$",
              queEscriboEnHoja: "«Sumo los puntajes de cada clase y como gana Clase ..., clasifico x_q ahí.»"
            }
          ]
        },
        {
          id: "PRAC-KNN-03",
          tema: "KNN",
          tipo: "algoritmo",
          titulo: "Algoritmo LOOCV para Elegir el K Óptimo (Validación Cruzada en Papel)",
          etiquetaNaturaleza: "ENTRENAMIENTO PRÁCTICO · NO ES PREGUNTA DE PARCIAL",
          resumen: "Cómo encontrar el parámetro K óptimo en los puntos 02 y 04 de la Guía TP sin duplicar cuentas innecesariamente.",
          pasos: [
            {
              nro: 1,
              titulo: "Construir la matriz simétrica de distancias por pares (N(N−1)/2 cálculos)",
              queHago: "Calculo solo la mitad superior porque $d(p_i, p_j) = d(p_j, p_i)$, y tacho la diagonal porque ningún punto puede usarse de vecino propio.",
              formula: "$$d(p_i, p_j) = d(p_j, p_i), \\qquad i \\neq j \\quad\\Longrightarrow\\quad \\text{solo } \\frac{N(N-1)}{2} \\text{ pares}$$",
              queEscriboEnHoja: "«Armo la tabla simétrica de distancias tachando la diagonal (porque dejo afuera el punto que estoy probando).»"
            },
            {
              nro: 2,
              titulo: "Listar para cada instancia p_i su ranking de N − 1 vecinos",
              queHago: "Para cada punto $p_i$, ordeno sus vecinos del más cercano al más lejano.",
              formula: "$$\\text{Columna } p_i: \\; \\big[p_{(1)}^{(i)},\\; p_{(2)}^{(i)},\\; \\dots,\\; p_{(N-1)}^{(i)}\\big]$$",
              queEscriboEnHoja: "«Ordeno de más cerca a más lejos qué vecinos le quedan a cada punto.»"
            },
            {
              nro: 3,
              titulo: "Evaluar aciertos y tasa de error para cada K candidato",
              queHago: "Pruebo cada $K$ pedido (ej. $K=1, 3, 5$) mirando si esos $K$ vecinos aciertan la clase real de cada punto, y divido errores por $N$.",
              formula: "$$E_{\\text{LOOCV}}(K) = \\frac{\\text{Cantidad de Errores}(K)}{N}, \\qquad \\text{Precisión}(K) = \\frac{\\text{Aciertos}(K)}{N}$$",
              queEscriboEnHoja: "«Pruebo K=1 (errores/N), K=3 (errores/N)... comparando contra la clase real de cada ejemplo.»"
            },
            {
              nro: 4,
              titulo: "Seleccionar K* óptimo (mínimo error LOOCV)",
              queHago: "Me quedo con el $K$ que tuvo menor error (en empate prefiero el menor impar).",
              formula: "$$K^* = \\arg\\min_{K} E_{\\text{LOOCV}}(K)$$",
              queEscriboEnHoja: "«Elijo K* = ... porque fue el que cometió menos errores en Leave-One-Out.»"
            }
          ]
        },
        {
          id: "PRAC-KNN-04",
          tema: "KNN",
          tipo: "plantilla",
          titulo: "Plantilla de Hoja en Blanco: KNN Ponderado + LOOCV (Parcial IA-H0122)",
          etiquetaNaturaleza: "ENTRENAMIENTO PRÁCTICO · NO ES PREGUNTA DE PARCIAL",
          resumen: "Modelo completo con puntos p_1(1,2,+1), p_2(2,3,+1), p_3(2,1,+1), p_4(4,2,-1), p_5(5,3,-1), p_6(5,1,-1) clasificando x_0 = (3, 2) con K = 3 y w_i = 1 / (1 + d²).",
          svgDiagram: `
<svg class="lab-svg-diagram" viewBox="0 0 760 195" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Mapa espacial del parcial IA-H0122 mostrando K=3 alrededor de x0=(3,2)">
  <text x="380" y="22" text-anchor="middle" fill="#34d399" font-size="12" font-weight="700">Mapa espacial Parcial IA-H0122: x₀ = (3, 2) rodeado de K=3 vecinos</text>
  <!-- x in [0..6] -> [120..520] (x_px = 120 + 66*x), y in [0..4] -> [168..42] (y_px = 168 - 31*y) -->
  <line x1="100" y1="168" x2="540" y2="168" stroke="#64748b" stroke-width="1.2"/>
  <line x1="120" y1="38" x2="120" y2="174" stroke="#64748b" stroke-width="1.2"/>

  <!-- Radio K=3 alrededor de x0(3,2) -> (318, 106), radio d=1.5 -> ~99 px -->
  <circle cx="318" cy="106" r="96" fill="rgba(52,211,153,0.06)" stroke="#34d399" stroke-width="1.8" stroke-dasharray="5,4"/>
  <text x="418" y="64" fill="#34d399" font-size="10.5" font-weight="700">K = 3 adentro</text>

  <!-- x0=(3,2) -->
  <polygon points="318,97 327,106 318,115 309,106" fill="#fbbf24" stroke="#0f172a" stroke-width="1.5"/>
  <text x="318" y="130" text-anchor="middle" fill="#fbbf24" font-size="11" font-weight="700">x₀ (3,2)</text>

  <!-- Clase +1 (azules): p1(1,2)->(186,106), p2(2,3)->(252,75), p3(2,1)->(252,137) -->
  <circle cx="186" cy="106" r="6" fill="#38bdf8" opacity="0.5"/>
  <text x="166" y="100" text-anchor="end" class="svg-label-muted" font-size="10">p₁ (+1) d=2</text>
  <circle cx="252" cy="75" r="7" fill="#38bdf8" stroke="#fff" stroke-width="1.4"/>
  <text x="242" y="66" text-anchor="end" fill="#7dd3fc" font-size="10.5" font-weight="700">p₂(+1) d=1.41</text>
  <circle cx="252" cy="137" r="7" fill="#38bdf8" stroke="#fff" stroke-width="1.4"/>
  <text x="242" y="152" text-anchor="end" fill="#7dd3fc" font-size="10.5" font-weight="700">p₃(+1) d=1.41</text>

  <!-- Clase -1 (rojos): p4(4,2)->(384,106), p5(5,3)->(450,75), p6(5,1)->(450,137) -->
  <rect x="377" y="99" width="14" height="14" rx="2" fill="#fb7185" stroke="#fff" stroke-width="1.4"/>
  <text x="384" y="128" text-anchor="middle" fill="#fb7185" font-size="10.5" font-weight="700">p₄(−1) d=1</text>
  <rect x="444" y="69" width="12" height="12" rx="2" fill="#fb7185" opacity="0.5"/>
  <text x="462" y="79" class="svg-label-muted" font-size="10">p₅(−1) d=2.2</text>
  <rect x="444" y="131" width="12" height="12" rx="2" fill="#fb7185" opacity="0.5"/>
  <text x="462" y="141" class="svg-label-muted" font-size="10">p₆(−1) d=2.2</text>

  <rect x="556" y="42" width="188" height="132" rx="8" class="svg-note-bg"/>
  <text x="650" y="66" text-anchor="middle" fill="#38bdf8" font-size="11.5" font-weight="700">Competencia K=3:</text>
  <text x="568" y="90" fill="#fb7185" font-size="10.5">• p₄ solo: w = 0.500</text>
  <text x="568" y="110" fill="#7dd3fc" font-size="10.5">• p₂ + p₃: 0.333 + 0.333</text>
  <text x="568" y="126" fill="#7dd3fc" font-size="10.5" font-weight="700">  = 0.666</text>
  <text x="650" y="154" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">2 vecinos ganan → +1 ✓</text>
</svg>`,
          tablaPlantilla: {
            tituloTabla: "Tabla 1 — Clasificación de x_0 = (3, 2) con K = 3 y w_i = 1 / (1 + d²)",
            columnas: ["Instancia (Clase)", "d(x_0, p_i)", "Orden", "¿En K=3?", "Peso w_i = 1 / (1 + d²)", "Aporte por Clase"],
            filas: [
              ["p_4 (4, 2) [−1]", "√1 = 1,000", "1°", "✅ Sí", "1 / (1 + 1) = 0,500", "Score(−1) += 0,500"],
              ["p_2 (2, 3) [+1]", "√2 ≈ 1,414", "2°", "✅ Sí", "1 / (1 + 2) = 0,333", "Score(+1) += 0,333"],
              ["p_3 (2, 1) [+1]", "√2 ≈ 1,414", "3°", "✅ Sí", "1 / (1 + 2) = 0,333", "Score(+1) += 0,333"],
              ["p_1 (1, 2) [+1]", "√4 = 2,000", "4°", "No", "—", "Descartado"],
              ["p_5 (5, 3) [−1]", "√5 ≈ 2,236", "5°", "No", "—", "Descartado"],
              ["p_6 (5, 1) [−1]", "√5 ≈ 2,236", "6°", "No", "—", "Descartado"]
            ]
          },
          tablaPlantilla2: {
            tituloTabla: "Tabla 2 — Resumen Final y Control LOOCV (K = 1 sobre los 6 puntos)",
            columnas: ["Evaluación", "Comparación de Puntajes / Vecinos", "Resultado", "Verificación"],
            filas: [
              ["Decisión x_0 = (3,2)", "Score(+1) = 0,666  vs  Score(−1) = 0,500", "Clase +1", "Dos vecinos (+1) superan a p_4 (−1)"],
              ["LOOCV (K=1)", "p_1→p_2(+1), p_2→p_1(+1), p_3→p_1(+1), p_4→p_5(−1), p_5→p_4(−1), p_6→p_4(−1)", "6/6 Aciertos", "E_LOOCV(K=1) = 0 / 6 = 0%"]
            ]
          },
          tipHoja: "💡 Truco de tiempo en LOOCV: para N = 6 instancias no hagas 30 cuentas de distancia. Armá 15 pares en un triángulo superior (p1-p2, p1-p3... hasta p5-p6) y leé cada fila/columna para armar el ranking."
        },
        {
          id: "PRAC-KNN-05",
          tema: "KNN",
          tipo: "formula",
          titulo: "Flashcard 1: Regla Matemática de KNN Simple vs Ponderado",
          etiquetaNaturaleza: "ENTRENAMIENTO PRÁCTICO · NO ES PREGUNTA DE PARCIAL",
          preguntaFrente: "¿Cómo se formaliza la regla de decisión de KNN Simple y KNN Ponderado en las diapositivas de la cátedra?",
          respuestaDorso: "Con la función delta de Kronecker $\\delta(a, b) = 1$ si $a=b$ (y $0$ si $a \\neq b$):\n- **KNN Simple:** $\\hat{f}(\\mathbf{x}_q) \\leftarrow \\arg\\max_{v \\in V} \\sum_{i=1}^{K} \\delta\\big(v, f(\\mathbf{x}_i)\\big)$.\n- **KNN Ponderado:** $\\hat{f}(\\mathbf{x}_q) \\leftarrow \\arg\\max_{v \\in V} \\sum_{i=1}^{K} w_i\\,\\delta\\big(v, f(\\mathbf{x}_i)\\big)$."
        },
        {
          id: "PRAC-KNN-06",
          tema: "KNN",
          tipo: "formula",
          titulo: "Flashcard 2: Las Tres Variantes de Pesos w_i en KNN Ponderado",
          etiquetaNaturaleza: "ENTRENAMIENTO PRÁCTICO · NO ES PREGUNTA DE PARCIAL",
          preguntaFrente: "¿Qué tres fórmulas de ponderación aparecen en la Guía TP y parciales, y cuál evita la división por cero?",
          respuestaDorso: "1. **Inversa de distancia (Guía TP 03):** $w_i = \\dfrac{1}{d(\\mathbf{x}_q, \\mathbf{x}_i)}$.\n2. **Inversa del cuadrado (Diapositivas y TP 03):** $w_i = \\dfrac{1}{d(\\mathbf{x}_q, \\mathbf{x}_i)^2}$ *(más agresiva con los cercanos)*.\n3. **Inversa suavizada (Parciales):** $w_i = \\dfrac{1}{1 + d(\\mathbf{x}_q, \\mathbf{x}_i)^2}$ — **única que evita indeterminación** si $d = 0$ (cuando $\\mathbf{x}_q$ coincide exactamente con un dato, da $w_i = 1$)."
        },
        {
          id: "PRAC-KNN-07",
          tema: "KNN",
          tipo: "formula",
          titulo: "Flashcard 3: Tasa de Error Leave-One-Out (LOOCV)",
          etiquetaNaturaleza: "ENTRENAMIENTO PRÁCTICO · NO ES PREGUNTA DE PARCIAL",
          preguntaFrente: "¿Cómo se define el error LOOCV para un candidato K y cuántos pares de distancias únicos exige una tabla de N puntos?",
          respuestaDorso: "Para cada $i = 1, \\dots, N$, se clasifica $\\mathbf{x}_i$ usando los **$N - 1$** puntos restantes:\n$$E_{\\text{LOOCV}}(K) = \\frac{\\text{Cantidad de clasificaciones erróneas con } K}{N}, \\qquad K^* = \\arg\\min_K E_{\\text{LOOCV}}(K)$$\nPor simetría $d(\\mathbf{x}_i, \\mathbf{x}_j) = d(\\mathbf{x}_j, \\mathbf{x}_i)$, solo necesitás calcular $\\dfrac{N(N-1)}{2}$ distancias distintas."
        },
        {
          id: "PRAC-KNN-08",
          tema: "KNN",
          tipo: "formula",
          titulo: "Flashcard 4: Caso Teórico Crítico K = m + n (Parcial IA-H0076)",
          etiquetaNaturaleza: "ENTRENAMIENTO PRÁCTICO · NO ES PREGUNTA DE PARCIAL",
          preguntaFrente: "Con dos clases A (m ejemplos) y B (n ejemplos) y KNN ponderado w_i = 1/(1+d²) usando K = m + n, ¿qué ocurre si m > n, m < n y m = n?",
          respuestaDorso: "- **Si $m > n$:** tiende a clasificar como **Clase $A$** por acumulación mayoritaria de muchos sumandos positivos.\n- **Si $m < n$:** tiende a clasificar como **Clase $B$** por volumen muestral.\n- **Si $m = n$:** las cantidades están equilibradas, se anula el sesgo de tamaño y decide **estrictamente la proximidad espacial** (los $w_i$ más altos)."
        },
        {
          id: "PRAC-KNN-09",
          tema: "KNN",
          tipo: "trampa",
          titulo: "Las 6 Trampas Mortales de KNN y LOOCV en el Parcial",
          etiquetaNaturaleza: "ENTRENAMIENTO PRÁCTICO · NO ES PREGUNTA DE PARCIAL",
          resumen: "Errores de procedimiento o de aritmética que más hacen perder puntos en ejercicios de KNN.",
          trampas: [
            "**Incluir al propio punto p_i como vecino suyo en LOOCV:** Al validar $p_i$, queda fuera del entrenamiento. Si dejás la diagonal $d(p_i, p_i)=0$, $K=1$ acierta 100% por trampa e invalida la elección de $K^*$.",
            "**Olvidar sumar los pesos w_i en KNN Ponderado:** Calcular $w_i$ pero terminar sumando $1 + 1 + 0$ en la ecuación de clase (error frecuente al copiar rápido la plantilla de KNN simple) cambia por completo el ganador.",
            "**Dividir por cero con w_i = 1/d² cuando d = 0:** Si la consulta cae sobre un punto existente del dataset ($d=0$), en $1/d^2$ queda indefinido (se asigna esa clase o se usa $1/(1+d^2)$ que da $w=1$).",
            "**Elegir K par en problemas de 2 clases:** Como sucede con $K=6$ en TP 01 ($3$ votos Clase 0 vs $3$ votos Clase 1), un $K$ par puede producir empates sin ganador claro. Usá preferentemente $K$ impares.",
            "**Confundir 'menor distancia' con 'menor peso':** El vecino $1^{\\circ}$ más próximo tiene la **menor** distancia $d$ y por lo tanto el **mayor** peso $w_i$. Ordená primero por $d$ ascendente.",
            "**No mostrar los cálculos de √(...) cuando los números parecen obvios:** En la hoja de examen la cátedra evalúa que escribas la expresión euclídea $\\sqrt{(x_1 - y_1)^2 + \\dots}$ al menos en las primeras instancias y listes todas las $N$ distancias antes de elegir los $K$ mejores."
          ]
        }
      ]
    },

    // =========================================================================
    // TEMA 7: CLUSTERING (K-MEANS Y JERÁRQUICO AGLOMERATIVO)
    // =========================================================================
    {
      id: "CLUSTERING",
      nombre: "Clustering y K-Means",
      badge: "Particional (K-Means) · Jerárquico (Single/Complete/Average) y Dendrograma",
      icono: "🫧",
      ponderacion: "25% clásico · Average-Link ponderado y Dendrograma escalado son puntos clave",
      referenciaCatedra: "Guía Práctica Clustering · Parciales 2016, 2021, 2023 (Tema 1/2), 19/11/2025 y Finales 2021",
      referenciaLinks: [
        { label: "guia_practica_clustering.pdf", path: "MODELOS_ORIGINALES/4_GUIAS_PRACTICAS_CATEDRA/guia_practica_clustering.pdf", kind: "pdf" },
        { label: "parcial2_2025_11_19_oficial.pdf", path: "MODELOS_ORIGINALES/1_PARCIALES_2DO_PARCIAL/parcial2_2025_11_19_oficial.pdf", kind: "pdf" },
        { label: "parcial2_2023_tema1.jpeg", path: "MODELOS_ORIGINALES/1_PARCIALES_2DO_PARCIAL/parcial2_2023_tema1.jpeg", kind: "img" },
        { label: "04_clustering_average_link.md", path: "GUIAS_PASO_A_PASO/04_clustering_average_link.md", kind: "md" }
      ],
      tiempoSugerido: "20–25 min",
      objetivo: "Ejecutar iteraciones tabuladas de K-Means hasta estabilizar centroides, reducir matrices de distancia con Single/Complete/Average Link sin caer en el error de cardinalidad y trazar dendrogramas con escala vertical exacta.",
      items: [
        {
          id: "PRAC-CLU-01",
          tema: "CLUSTERING",
          tipo: "diagrama",
          titulo: "Criterios de Enlace Jerárquico (Single / Complete / Average) y Dendrograma Escalado",
          etiquetaNaturaleza: "ENTRENAMIENTO PRÁCTICO · NO ES PREGUNTA DE PARCIAL",
          resumen: "Mientras K-Means particiona en K grupos recalculando centroides en cada iteración, el clustering jerárquico aglomerativo fusiona paso a paso los dos clusters de menor distancia según Single-Link (mínimo), Complete-Link (máximo) o Average-Link (promedio de TODOS los pares cruzados).",
          svgDiagram: `
<svg class="lab-svg-diagram" viewBox="0 0 760 345" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Comparativa geométrica de enlaces Single Complete Average y dendrograma escalado de Average-Link">
  <defs>
    <marker id="clu-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8"/>
    </marker>
  </defs>

  <text x="186" y="22" text-anchor="middle" class="svg-node-text" font-size="12" font-weight="700">1. DISTANCIA ENTRE CLUSTERS A y B</text>
  <text x="568" y="22" text-anchor="middle" class="svg-node-text" font-size="12" font-weight="700">2. DENDROGRAMA ESCALADO (AVERAGE LINK)</text>

  <!-- Cluster A (izquierda) y Cluster B (derecha) -->
  <ellipse cx="96" cy="128" rx="54" ry="52" fill="rgba(56,189,248,0.08)" stroke="#38bdf8" stroke-width="1.6" stroke-dasharray="4 3"/>
  <text x="96" y="66" text-anchor="middle" fill="#38bdf8" font-size="11" font-weight="700">Cluster A (|A|=2)</text>

  <ellipse cx="276" cy="128" rx="54" ry="52" fill="rgba(16,185,129,0.08)" stroke="#10b981" stroke-width="1.6" stroke-dasharray="4 3"/>
  <text x="276" y="66" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">Cluster B (|B|=2)</text>

  <!-- Puntos en A y B -->
  <circle cx="72" cy="106" r="7" fill="#38bdf8" stroke="#f8fafc" stroke-width="1.5"/>
  <text x="72" y="94" text-anchor="middle" class="svg-label-muted" font-size="10">x₁</text>
  <circle cx="122" cy="144" r="7" fill="#38bdf8" stroke="#f8fafc" stroke-width="1.5"/>
  <text x="122" y="164" text-anchor="middle" class="svg-label-muted" font-size="10">x₂</text>

  <circle cx="250" cy="144" r="7" fill="#10b981" stroke="#f8fafc" stroke-width="1.5"/>
  <text x="250" y="164" text-anchor="middle" class="svg-label-muted" font-size="10">y₁</text>
  <circle cx="300" cy="106" r="7" fill="#10b981" stroke="#f8fafc" stroke-width="1.5"/>
  <text x="300" y="94" text-anchor="middle" class="svg-label-muted" font-size="10">y₂</text>

  <!-- Líneas cruzadas internas suaves para Average Link (4 pares) -->
  <line x1="72" y1="106" x2="250" y2="144" stroke="rgba(148,163,184,0.45)" stroke-width="1.2" stroke-dasharray="3 3"/>
  <line x1="122" y1="144" x2="300" y2="106" stroke="rgba(148,163,184,0.45)" stroke-width="1.2" stroke-dasharray="3 3"/>

  <!-- Línea Complete-Link (máxima: x1 <-> y2) -->
  <line x1="79" y1="106" x2="293" y2="106" stroke="#f59e0b" stroke-width="2.2"/>
  <text x="186" y="97" text-anchor="middle" fill="#fbbf24" font-size="10.5" font-weight="700">Complete (máx)</text>

  <!-- Línea Single-Link (mínima: x2 <-> y1) -->
  <line x1="129" y1="144" x2="243" y2="144" stroke="#38bdf8" stroke-width="2.4"/>
  <text x="186" y="161" text-anchor="middle" fill="#38bdf8" font-size="10.5" font-weight="700">Single (mín)</text>

  <text x="186" y="198" text-anchor="middle" class="svg-node-text" font-size="10.5" font-weight="600">Average = promedio de los |A|·|B| = 4 pares cruzados</text>

  <!-- Caja izquierda K-Means -->
  <rect x="16" y="218" width="340" height="112" rx="8" class="svg-note-bg"/>
  <text x="186" y="239" text-anchor="middle" fill="#34d399" font-size="11.5" font-weight="700">K-Means (Particional · K fijo a priori)</text>
  <text x="186" y="260" text-anchor="middle" class="svg-label-muted" font-size="10.5">1. Semillas μⱼ⁽⁰⁾ → 2. Asignar al μⱼ más cercano</text>
  <text x="186" y="279" text-anchor="middle" class="svg-label-muted" font-size="10.5">3. Recalcular μⱼ = media de puntos en Cⱼ</text>
  <text x="186" y="299" text-anchor="middle" fill="#fbbf24" font-size="10.5" font-weight="600">Para cuando no reasigna puntos (μ no cambia)</text>
  <text x="186" y="317" text-anchor="middle" class="svg-label-muted" font-size="10">Si datos son categóricos sin media → usar K-Modes</text>

  <!-- Separador vertical -->
  <line x1="370" y1="18" x2="370" y2="334" stroke="rgba(148,163,184,0.4)" stroke-width="1.5" stroke-dasharray="4 4"/>

  <!-- Eje vertical del Dendrograma (Parcial IA-H0075: 1.45, 1.98, 2.84, 6.11) -->
  <line x1="422" y1="210" x2="422" y2="42" stroke="#94a3b8" stroke-width="1.6" marker-end="url(#clu-arrow)"/>
  <text x="415" y="42" text-anchor="end" class="svg-label-muted" font-size="10.5" font-weight="700">h</text>

  <!-- Línea base y hojas A, N, R, S, P -->
  <line x1="422" y1="210" x2="736" y2="210" stroke="#64748b" stroke-width="1.4"/>
  <text x="466" y="226" text-anchor="middle" class="svg-node-text" font-size="12" font-weight="700">A</text>
  <text x="526" y="226" text-anchor="middle" class="svg-node-text" font-size="12" font-weight="700">N</text>
  <text x="586" y="226" text-anchor="middle" class="svg-node-text" font-size="12" font-weight="700">R</text>
  <text x="656" y="226" text-anchor="middle" class="svg-node-text" font-size="12" font-weight="700">S</text>
  <text x="716" y="226" text-anchor="middle" class="svg-node-text" font-size="12" font-weight="700">P</text>

  <!-- Nivel h1 = 1.45 (y = 175) : (A, N) -->
  <line x1="418" y1="175" x2="426" y2="175" stroke="#38bdf8" stroke-width="1.5"/>
  <text x="413" y="179" text-anchor="end" fill="#38bdf8" font-size="10" font-weight="700">1,45</text>
  <polyline points="466,210 466,175 526,175 526,210" fill="none" stroke="#38bdf8" stroke-width="2.2"/>

  <!-- Nivel h2 = 1.98 (y = 152) : (S, P) -->
  <line x1="418" y1="152" x2="426" y2="152" stroke="#10b981" stroke-width="1.5"/>
  <text x="413" y="156" text-anchor="end" fill="#34d399" font-size="10" font-weight="700">1,98</text>
  <polyline points="656,210 656,152 716,152 716,210" fill="none" stroke="#10b981" stroke-width="2.2"/>

  <!-- Nivel h3 = 2.84 (y = 120) : ((AN), R) -->
  <line x1="418" y1="120" x2="426" y2="120" stroke="#f59e0b" stroke-width="1.5"/>
  <text x="413" y="124" text-anchor="end" fill="#fbbf24" font-size="10" font-weight="700">2,84</text>
  <polyline points="496,175 496,120 586,120 586,210" fill="none" stroke="#f59e0b" stroke-width="2.2"/>
  <text x="541" y="112" text-anchor="middle" fill="#fbbf24" font-size="10" font-weight="700">(AN)R</text>

  <!-- Nivel h4 = 6.11 (y = 64) : ((AN)R, SP) -->
  <line x1="418" y1="64" x2="426" y2="64" stroke="#f8fafc" stroke-width="1.5"/>
  <text x="413" y="68" text-anchor="end" class="svg-node-text" font-size="10" font-weight="700">6,11</text>
  <polyline points="541,120 541,64 686,64 686,152" fill="none" stroke="#f8fafc" stroke-width="2.2"/>
  <text x="614" y="55" text-anchor="middle" class="svg-node-text" font-size="10" font-weight="700">Raíz: 6 pares / 6</text>

  <!-- Nota derecha trampa cardinalidad -->
  <rect x="386" y="242" width="358" height="88" rx="8" class="svg-note-bg"/>
  <text x="565" y="263" text-anchor="middle" fill="#f87171" font-size="11.5" font-weight="700">¡Trampa de Cardinalidad en h₄ = 6,11!</text>
  <text x="565" y="283" text-anchor="middle" class="svg-label-muted" font-size="10.5">|(AN)R| = 3 elementos  y  |SP| = 2 elementos</text>
  <text x="565" y="302" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">Correcto: (2·d(AN,SP) + 1·d(R,SP)) / 3 = 6,107</text>
  <text x="565" y="320" text-anchor="middle" fill="#fbbf24" font-size="10">Prohibido dividir por 2 cuando |A| ≠ |B|</text>
</svg>`,
          svgDiagram2: `
<svg class="lab-svg-diagram" viewBox="0 0 760 205" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Efecto cadena Single Link vs Complete Link y convergencia visual K-Means">
  <defs>
    <marker id="clu2-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 1 L10 5 L0 9 z" fill="#34d399"/></marker>
  </defs>
  <!-- Panel izquierdo: Single vs Complete -->
  <rect x="14" y="10" width="358" height="184" rx="10" fill="rgba(56,189,248,0.07)" stroke="#38bdf8" stroke-width="1"/>
  <text x="193" y="32" text-anchor="middle" fill="#38bdf8" font-size="12" font-weight="700">Single-Link (cadenas) vs. Complete-Link (bolas compactas)</text>

  <!-- Single link encadenado -->
  <text x="30" y="64" fill="#fb7185" font-size="11" font-weight="700">Single (mínimo):</text>
  <ellipse cx="195" cy="86" rx="145" ry="18" fill="rgba(251,113,133,0.12)" stroke="#fb7185" stroke-width="1.5" stroke-dasharray="4,3"/>
  <circle cx="80" cy="86" r="5" fill="#38bdf8"/><circle cx="115" cy="86" r="5" fill="#38bdf8"/><circle cx="150" cy="86" r="5" fill="#fbbf24"/><circle cx="195" cy="86" r="5" fill="#fbbf24"/><circle cx="240" cy="86" r="5" fill="#34d399"/><circle cx="280" cy="86" r="5" fill="#34d399"/>
  <text x="193" y="116" text-anchor="middle" class="svg-label-muted" font-size="9.5">Un puente de puntos une todo en un grupo alargado (efecto cadena)</text>

  <!-- Complete link compacto -->
  <text x="30" y="140" fill="#34d399" font-size="11" font-weight="700">Complete (máximo):</text>
  <circle cx="115" cy="158" r="24" fill="rgba(56,189,248,0.14)" stroke="#38bdf8" stroke-width="1.5"/>
  <circle cx="105" cy="154" r="4.5" fill="#38bdf8"/><circle cx="122" cy="162" r="4.5" fill="#38bdf8"/><circle cx="114" cy="148" r="4.5" fill="#38bdf8"/>
  <circle cx="268" cy="158" r="24" fill="rgba(52,211,153,0.14)" stroke="#34d399" stroke-width="1.5"/>
  <circle cx="258" cy="154" r="4.5" fill="#34d399"/><circle cx="276" cy="160" r="4.5" fill="#34d399"/><circle cx="266" cy="148" r="4.5" fill="#34d399"/>
  <text x="193" y="186" text-anchor="middle" class="svg-label-muted" font-size="9.5">Fuerza clusters compactos y diámetros chicos</text>

  <!-- Panel derecho: Evolucion K-Means -->
  <rect x="386" y="10" width="360" height="184" rx="10" fill="rgba(52,211,153,0.07)" stroke="#34d399" stroke-width="1"/>
  <text x="566" y="32" text-anchor="middle" fill="#34d399" font-size="12" font-weight="700">Evolución K-Means: cómo viajan los centroides μ</text>
  <!-- Puntos grupo 1 abajo izq -->
  <circle cx="430" cy="150" r="5" fill="#38bdf8"/><circle cx="430" cy="122" r="5" fill="#38bdf8"/><circle cx="456" cy="136" r="5" fill="#38bdf8"/>
  <!-- Puntos grupo 2 arriba der -->
  <circle cx="655" cy="70" r="5" fill="#fbbf24"/><circle cx="695" cy="70" r="5" fill="#fbbf24"/>

  <!-- Semilla mu1=(1,1)->(430,150) y final mu1=(1.33,2)->(438,136) -->
  <line x1="432" y1="148" x2="438" y2="140" stroke="#34d399" stroke-width="2" marker-end="url(#clu2-arr)"/>
  <text x="415" y="168" fill="#38bdf8" font-size="10" font-weight="700">μ₁(0)</text>
  <text x="470" y="156" fill="#34d399" font-size="10" font-weight="700">μ₁*=(1.33, 2)</text>

  <!-- Semilla mu2=(2,2)->(456,136) salta al grupo 2 (675,70) -->
  <circle cx="456" cy="136" r="7" fill="none" stroke="#fbbf24" stroke-width="1.5" stroke-dasharray="2,2"/>
  <line x1="464" y1="130" x2="664" y2="74" stroke="#34d399" stroke-width="2.4" marker-end="url(#clu2-arr)"/>
  <circle cx="675" cy="70" r="6" fill="#34d399" stroke="#fff" stroke-width="1.5"/>
  <text x="546" y="88" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">μ₂ salta Iter 1→2</text>
  <text x="675" y="54" text-anchor="middle" fill="#fbbf24" font-size="10.5" font-weight="700">μ₂*=(7, 6)</text>
  <text x="566" y="182" text-anchor="middle" class="svg-label-muted" font-size="10">Frena recién cuando μ(t+1) = μ(t) (nadie cambia de grupo)</text>
</svg>`,
          notasClave: [
            "**Dendrograma con escala:** Siempre graduá el eje vertical $h$ con las alturas numéricas exactas ($h_1 < h_2 < \\dots$) y dejá todas las hojas individuales en la línea base $h = 0$.",
            "**Average Link ponderado:** Si un cluster tiene tamaño $|A|$ y se fusiona con otro de tamaño $|B|$, la fórmula recurrente pondera por $|A|$ y $|B|$ dividiendo por $|A|+|B|$ (equivale al promedio exacto de todos los pares originales cruzados).",
            "**K-Means converge en meseta:** Necesitás verificar que en la iteración siguiente los puntos no cambien de cluster (o alcanzar las iteraciones pedidas en la consigna)."
          ]
        },
        {
          id: "PRAC-CLU-02",
          tema: "CLUSTERING",
          tipo: "algoritmo",
          titulo: "Algoritmo Paso a Paso de K-Means (Particional + Heurística de Semillas)",
          etiquetaNaturaleza: "ENTRENAMIENTO PRÁCTICO · NO ES PREGUNTA DE PARCIAL",
          resumen: "Los 4 pasos exactos para resolver K-Means a mano en tabla, incluyendo qué hacer si el enunciado no entrega semillas iniciales.",
          pasos: [
            {
              nro: 1,
              titulo: "Fijar K semillas iniciales (dadas o por heurística oficial)",
              queHago: "Pongo los $K$ centros iniciales dados en el enunciado (si no dan semillas, uso la heurística: primero el punto más lejano al promedio general, después el más lejano a ese, etc.).",
              formula: "$$\\boldsymbol{\\mu}_1^{(0)}, \\dots, \\boldsymbol{\\mu}_K^{(0)} \\in \\mathbb{R}^D \\qquad (\\text{o } \\arg\\max \\|\\mathbf{x}_i - \\bar{\\mathbf{x}}\\| \\text{ si usa heurística})$$",
              queEscriboEnHoja: "«Arranco tomando las K semillas iniciales C₁⁽⁰⁾ = (...), C₂⁽⁰⁾ = (...).»"
            },
            {
              nro: 2,
              titulo: "Calcular distancias euclídeas y asignar cada instancia al centroide más cercano",
              queHago: "Mido la distancia euclídea de cada punto a los $K$ centros actuales y lo meto en el grupo que le queda más cerca.",
              formula: "$$d(\\mathbf{x}_i, \\boldsymbol{\\mu}_j^{(t)}) = \\sqrt{\\sum_{r=1}^{D} (x_{ir} - \\mu_{jr}^{(t)})^2}, \\qquad c(\\mathbf{x}_i) = \\arg\\min_j\\, d(\\mathbf{x}_i, \\boldsymbol{\\mu}_j^{(t)})$$",
              queEscriboEnHoja: "«Mido la distancia de cada punto a los centros y lo asigno al grupo más cercano.»"
            },
            {
              nro: 3,
              titulo: "Recalcular los K centroides (media aritmética por componente)",
              queHago: "Promediamos las coordenadas de los puntos que cayeron en cada grupo para mover cada centroide (en datos categóricos va la moda / **K-Modes**).",
              formula: "$$\\boldsymbol{\\mu}_j^{(t+1)} = \\frac{1}{|C_j|} \\sum_{\\mathbf{x}_i \\in C_j} \\mathbf{x}_i$$",
              queEscriboEnHoja: "«Promediamos los puntos de cada cluster para correr los nuevos centroides μ₁ y μ₂.»"
            },
            {
              nro: 4,
              titulo: "Repetir y verificar criterio de parada (estabilidad o SSE)",
              queHago: "Vuelvo a asignar contra los nuevos centros; cuando ningún punto cambia de grupo y los centroides quedan idénticos, ya convergió y termino.",
              formula: "$$\\text{Parada: } \\boldsymbol{\\mu}_j^{(t+1)} = \\boldsymbol{\\mu}_j^{(t)} \\;\\forall j \\qquad \\Longleftrightarrow \\qquad SSE = \\sum_{j=1}^{K} \\sum_{\\mathbf{x} \\in C_j} \\|\\mathbf{x} - \\boldsymbol{\\mu}_j\\|^2$$",
              queEscriboEnHoja: "«Como en esta vuelta nadie cambió de cluster y los centroides dieron igual, el algoritmo converge y termina.»"
            }
          ]
        },
        {
          id: "PRAC-CLU-03",
          tema: "CLUSTERING",
          tipo: "algoritmo",
          titulo: "Algoritmo Clustering Jerárquico Aglomerativo (Single / Complete / Average + Dendrograma)",
          etiquetaNaturaleza: "ENTRENAMIENTO PRÁCTICO · NO ES PREGUNTA DE PARCIAL",
          resumen: "Los 4 pasos tabulados para ir reduciendo matrices de distancia D_0 -> D_1 -> ... -> D_{N-2} sin confundir cardinalidades y dibujar el dendrograma.",
          pasos: [
            {
              nro: 1,
              titulo: "Partir de la matriz inicial D_0 y localizar la mínima distancia no diagonal",
              queHago: "Busco el número más chico fuera de la diagonal principal de la tabla: esos dos grupos se unen primero y su distancia marca la altura $h_t$.",
              formula: "$$(C_i^*, C_j^*) = \\arg\\min_{i \\neq j} d(C_i, C_j), \\qquad h_t = d(C_i^*, C_j^*)$$",
              queEscriboEnHoja: "«Busco la menor distancia en la matriz (d(A, N) = 1,45), así que junto {A} y {N} a altura h₁ = 1,45.»"
            },
            {
              nro: 2,
              titulo: "Actualizar filas/columnas hacia el nuevo cluster según el enlace pedido",
              queHago: "Achico la matriz recalculando la distancia del grupo recién unido hacia los demás según Single (mínimo), Complete (máximo) o **Average (ponderando siempre por $|A|$ y $|B|$)**.",
              formula: "$$d(A \\cup B, C) = \\begin{cases} \\min\\{d(A,C),\\, d(B,C)\\} & \\text{Single-Link} \\\\ \\max\\{d(A,C),\\, d(B,C)\\} & \\text{Complete-Link} \\\\ \\dfrac{|A|\\,d(A,C) + |B|\\,d(B,C)}{|A| + |B|} & \\text{Average-Link (UPGMA)} \\end{cases}$$",
              queEscriboEnHoja: "«Armo la matriz reducida D₁ calculando la nueva distancia del grupo recién armado contra cada resto (ponderando tamaños en Average).»"
            },
            {
              nro: 3,
              titulo: "Repetir reducción hasta llegar a matriz 2 × 2 (fusión raíz)",
              queHago: "Repito buscar el mínimo y achicar la matriz hasta unir los dos últimos grupos (acordándome cuántos elementos tiene cada grupo).",
              formula: "$$D_0\\,(N\\times N) \\longrightarrow D_1\\,((N-1)\\times(N-1)) \\longrightarrow \\dots \\longrightarrow D_{N-2}\\,(2\\times 2) \\;\\text{(altura raíz } h_{N-1}\\text{)}$$",
              queEscriboEnHoja: "«Llego a la tabla 2×2 y uno los dos últimos grupos ponderando por su cantidad de elementos (h = 6,11).»"
            },
            {
              nro: 4,
              titulo: "Dibujar el dendrograma con eje vertical escalado",
              queHago: "Pongo el eje vertical graduado con las alturas de unión, ordeno las hojas abajo para que no se crucen ramas y uno cada grupo exactamente a su altura.",
              formula: "$$h_1 \\le h_2 \\le \\dots \\le h_{N-1} \\qquad \\text{(monotonía garantizada en Single, Complete y Average)}$$",
              queEscriboEnHoja: "«Dibujo el dendrograma respetando en el eje vertical la altura h de cada unión sin cruzar líneas.»"
            }
          ]
        },
        {
          id: "PRAC-CLU-04",
          tema: "CLUSTERING",
          tipo: "plantilla",
          titulo: "Plantilla de Hoja en Blanco: Average-Link (Parcial 2023 IA-H0075) + K-Means (Final)",
          etiquetaNaturaleza: "ENTRENAMIENTO PRÁCTICO · NO ES PREGUNTA DE PARCIAL",
          resumen: "Dos desarrollos modelo con números exactos: primero la secuencia de Average-Link sobre {A, N, R, S, P} donde aparece la Trampa de Cardinalidad (3 vs 2), y luego 2 iteraciones completas de K-Means.",
          svgDiagram: `
<svg class="lab-svg-diagram" viewBox="0 0 760 155" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Pares cruzados Average Link en D3 3 vs 2">
  <text x="380" y="22" text-anchor="middle" fill="#fbbf24" font-size="12" font-weight="700">¿Por qué h₄ = 6,107? Regla visual de todos los 3 × 2 = 6 pares cruzados</text>
  <rect x="30" y="38" width="210" height="96" rx="8" fill="rgba(56,189,248,0.10)" stroke="#38bdf8"/>
  <text x="135" y="58" text-anchor="middle" fill="#38bdf8" font-size="11.5" font-weight="700">Grupo ((AN)R) · |·| = 3</text>
  <circle cx="72" cy="96" r="14" class="svg-node svg-node-in"/><text x="72" y="101" text-anchor="middle" class="svg-node-text" font-size="12" font-weight="700">A</text>
  <circle cx="135" cy="96" r="14" class="svg-node svg-node-in"/><text x="135" y="101" text-anchor="middle" class="svg-node-text" font-size="12" font-weight="700">N</text>
  <circle cx="198" cy="96" r="14" class="svg-node svg-node-in"/><text x="198" y="101" text-anchor="middle" class="svg-node-text" font-size="12" font-weight="700">R</text>

  <rect x="275" y="54" width="210" height="64" rx="8" class="svg-note-bg"/>
  <text x="380" y="76" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">Suma de 6 aristas en D₀ / 6</text>
  <text x="380" y="96" text-anchor="middle" class="svg-node-text" font-size="10.5">= (2·4,855 + 1·8,610) / 3 = 6,107</text>
  <line x1="242" y1="84" x2="273" y2="84" stroke="#94a3b8" stroke-width="1.5"/>
  <line x1="487" y1="84" x2="518" y2="84" stroke="#94a3b8" stroke-width="1.5"/>

  <rect x="520" y="38" width="210" height="96" rx="8" fill="rgba(52,211,153,0.10)" stroke="#34d399"/>
  <text x="625" y="58" text-anchor="middle" fill="#34d399" font-size="11.5" font-weight="700">Grupo (SP) · |·| = 2</text>
  <circle cx="585" cy="96" r="14" class="svg-node svg-node-out"/><text x="585" y="101" text-anchor="middle" class="svg-node-text" font-size="12" font-weight="700">S</text>
  <circle cx="665" cy="96" r="14" class="svg-node svg-node-out"/><text x="665" y="101" text-anchor="middle" class="svg-node-text" font-size="12" font-weight="700">P</text>
</svg>`,
          tablaPlantilla: {
            tituloTabla: "Tabla 1 — Resumen de Fusiones Average-Link (D_0 de 5×5 con A, N, R, S, P)",
            columnas: ["Paso", "Matriz", "Mínimo hallado", "Nuevo Cluster (Cardinal)", "Cálculo de Recálculo Obligatorio"],
            filas: [
              ["1", "D_0 (5×5)", "d(A, N) = 1,45", "(AN) · |·| = 2", "d((AN),R) = (3,23+2,44)/2 = 2,835; d((AN),S) = 6,220; d((AN),P) = 3,490"],
              ["2", "D_1 (4×4)", "d(S, P) = 1,98", "(SP) · |·| = 2", "d((SP),R) = (9,10+8,12)/2 = 8,610; d((SP),(AN)) = 4 pares / 4 = 4,855"],
              ["3", "D_2 (3×3)", "d((AN), R) = 2,835", "((AN)R) · |·| = 3", "d(((AN)R),(SP)) = (2·4,855 + 1·8,610) / (2+1) = 18,320 / 3 = 6,107"],
              ["4", "D_3 (2×2)", "d(((AN)R), (SP)) = 6,107", "((AN)R)(SP) · |·| = 5", "Comprobación por 6 pares en D_0: (6,32+2,25+6,12+4,73+9,10+8,12)/6 = 6,107"]
            ]
          },
          tablaPlantilla2: {
            tituloTabla: "Tabla 2 — K-Means con K = 2 en x₁(1,1), x₂(1,3), x₃(2,2), x₄(6,6), x₅(8,6) y semillas μ₁=(1,1), μ₂=(2,2)",
            columnas: ["Iteración", "Centroides Vigentes", "Asignación a C₁", "Asignación a C₂", "Centroides Nuevos"],
            filas: [
              ["Iter. 1", "μ₁=(1;1), μ₂=(2;2)", "{x₁} (d=0 < 1,414)", "{x₂, x₃, x₄, x₅}", "μ₁⁽¹⁾=(1; 1),  μ₂⁽¹⁾=(4,25; 4,25)"],
              ["Iter. 2", "μ₁=(1;1), μ₂=(4,25;4,25)", "{x₁, x₂, x₃} (¡x₂,x₃ cambian!)", "{x₄, x₅}", "μ₁⁽²⁾=(1,333; 2),  μ₂⁽²⁾=(7; 6)"],
              ["Iter. 3", "μ₁=(1,333;2), μ₂=(7;6)", "{x₁, x₂, x₃} (sin cambios)", "{x₄, x₅} (sin cambios)", "CONVERGE: μ⁽³⁾ = μ⁽²⁾ → Fin"]
            ]
          },
          tipHoja: "💡 Truco antibloqueo en Average-Link: si dudás de los coeficientes |A| y |B| de Lance-Williams al promediar clusters grandes, sumá directamente en D_0 todas las entradas d(x, y) con x en el primer grupo e y en el segundo, y dividí por |Grupo 1| × |Grupo 2|."
        },
        {
          id: "PRAC-CLU-05",
          tema: "CLUSTERING",
          tipo: "formula",
          titulo: "Flashcard 1: Centroides, Error SSE y Criterio de Parada en K-Means",
          etiquetaNaturaleza: "ENTRENAMIENTO PRÁCTICO · NO ES PREGUNTA DE PARCIAL",
          preguntaFrente: "¿Cómo se actualiza cada centroide en K-Means y qué función de error minimiza el algoritmo hasta converger?",
          respuestaDorso: "- **Recálculo del centroide $j$:** promedio aritmético por coordenada de las instancias asignadas a $C_j$:\n$$\\boldsymbol{\\mu}_j = \\frac{1}{|C_j|} \\sum_{\\mathbf{x}_i \\in C_j} \\mathbf{x}_i$$\n- **Función objetivo (SSE — Suma de Errores Cuadráticos):** $SSE = \\sum_{j=1}^{K} \\sum_{\\mathbf{x} \\in C_j} \\|\\mathbf{x} - \\boldsymbol{\\mu}_j\\|_2^2$.\n- **Parada:** cuando no hay reasignación de puntos ($\\boldsymbol{\\mu}_j^{(t+1)} = \\boldsymbol{\\mu}_j^{(t)}$)."
        },
        {
          id: "PRAC-CLU-06",
          tema: "CLUSTERING",
          tipo: "formula",
          titulo: "Flashcard 2: Comparativa de Distancias Single, Complete y Average Link",
          etiquetaNaturaleza: "ENTRENAMIENTO PRÁCTICO · NO ES PREGUNTA DE PARCIAL",
          preguntaFrente: "¿Cómo calcula la distancia entre dos clusters A y B cada uno de los tres métodos aglomerativos clásicos?",
          respuestaDorso: "1. **Single-Link (vecino más cercano):** $d(A,B) = \\min_{x\\in A,\\, y\\in B} d(x,y)$ *(sufre efecto cadena)*.\n2. **Complete-Link (vecino más lejano):** $d(A,B) = \\max_{x\\in A,\\, y\\in B} d(x,y)$ *(clusters compactos, sensible a outliers)*.\n3. **Average-Link (UPGMA):** $d(A,B) = \\dfrac{1}{|A|\\cdot|B|} \\sum_{x\\in A} \\sum_{y\\in B} d(x,y)$ *(compromiso robusto entre ambos)*."
        },
        {
          id: "PRAC-CLU-07",
          tema: "CLUSTERING",
          tipo: "formula",
          titulo: "Flashcard 3: Fórmula Ponderada de Lance-Williams en Average-Link",
          etiquetaNaturaleza: "ENTRENAMIENTO PRÁCTICO · NO ES PREGUNTA DE PARCIAL",
          preguntaFrente: "Cuando unís dos clusters A y B para calcular la distancia hacia otro grupo C en Average-Link, ¿por qué NO podés hacer (d(A,C) + d(B,C)) / 2?",
          respuestaDorso: "Porque si $|A| \\neq |B|$, el promedio simple les da el mismo peso a grupos de distinto tamaño. La fórmula correcta pondera por la **cardinalidad**:\n$$d(A \\cup B, C) = \\frac{|A|\\,d(A, C) + |B|\\,d(B, C)}{|A| + |B|}$$\nSolo coincide con $(d(A,C)+d(B,C))/2$ en el primer paso cuando ambos grupos tienen $|A|=|B|=1$ elemento."
        },
        {
          id: "PRAC-CLU-08",
          tema: "CLUSTERING",
          tipo: "formula",
          titulo: "Flashcard 4: Average-Link vs Distancia entre Centroides y Selección de Semillas",
          etiquetaNaturaleza: "ENTRENAMIENTO PRÁCTICO · NO ES PREGUNTA DE PARCIAL",
          preguntaFrente: "¿Es equivalente Average-Link a la distancia entre los centroides de los clusters? Y en K-Means sin semillas dadas, ¿cómo se eligen?",
          respuestaDorso: "- **Average-Link NO equivale a distancia entre centroides:** $\\frac{1}{|A||B|}\\sum\\|\\mathbf{x}-\\mathbf{y}\\| \\neq \\|\\boldsymbol{\\mu}_A - \\boldsymbol{\\mu}_B\\|$ por la no linealidad de la norma euclídea (además, centroides puede generar *inversiones* en el dendrograma).\n- **Heurística de semillas en K-Means (`Guía TP 02`):** calcular la media global $\\bar{\\mathbf{x}}$, elegir $\\boldsymbol{\\mu}_1$ como el punto **más alejado** de $\\bar{\\mathbf{x}}$, $\\boldsymbol{\\mu}_2$ el más alejado de $\\boldsymbol{\\mu}_1$, y así sucesivamente."
        },
        {
          id: "PRAC-CLU-09",
          tema: "CLUSTERING",
          tipo: "trampa",
          titulo: "Las 6 Trampas Mortales de Clustering y K-Means en el Parcial",
          etiquetaNaturaleza: "ENTRENAMIENTO PRÁCTICO · NO ES PREGUNTA DE PARCIAL",
          resumen: "Los errores más frecuentes en la corrección de Clustering Jerárquico y K-Means en UTN FRRe.",
          trampas: [
            "**Promediar Average-Link dividiendo siempre por 2 (Trampa 5):** Al unir $(AN)$ de $2$ elementos con $R$ de $1$ elemento, su distancia hacia $(SP)$ debe ponderarse $(2\\cdot d((AN),(SP)) + 1\\cdot d(R,(SP))) / 3$. Dividir por $2$ da otro valor y arruina el último nivel $h$ del dendrograma.",
            "**Responder que Average-Link calcula la distancia entre centroides:** Aunque suenen parecidos, promediar distancias entre **todos los pares de puntos** no da lo mismo que medir la distancia entre los dos promedios $\\|\\mu_A - \\mu_B\\|$.",
            "**Dibujar el dendrograma sin alturas numéricas en el eje vertical:** Un árbol topológico sin marcas escaladas $h_1, h_2, h_3, \\dots$ ni alineación real de las alturas de unión pierde puntaje completo de representación gráfica.",
            "**Frenar K-Means en la primera iteración cuando los puntos aún migraron:** Si entre Iteración $0$ e Iteración $1$ cambió algún centroide, necesitás correr al menos la comprobación siguiente hasta verificar que no hubo reasignaciones (salvo que la consigna pida exactamente $2$ iteraciones).",
            "**Cruzar fortalezas y debilidades entre métodos:** **Single-Link** sufre efecto cadena (*chain effect*); **Complete-Link** es sensible a *outliers*; **K-Means** exige definir $K$ a priori, es sensible a semillas iniciales y a *outliers*, y solo aplica donde exista media.",
            "**Aplicar media aritmética sobre atributos nominales (TP K-Means 03):** Si los datos son categóricos (no numéricos), no existe noción de promedio; se debe usar **K-Modes**, tomando la **moda** (valor más frecuente) como centro representativo de cada cluster."
          ]
        }
      ]
    }
  ]
};
