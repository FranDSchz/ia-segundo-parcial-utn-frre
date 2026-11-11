/**
 * Banco de Entrenamiento Práctico Guiado — Inteligencia Artificial UTN FRRe
 * MATERIAL 100% DE PRÁCTICA Y APOYO DE RESOLUCIÓN (NO CONTIENE PREGUNTAS DE PARCIAL/MOODLE).
 * Construido iterativamente tema por tema.
 */

window.ENTRENAMIENTO_PRACTICO = {
  version: "1.0",
  roadmap: [
    { id: "MLP_PERCEPTRON", nombre: "MLP, Perceptrón y ADALINE", estado: "completo" },
    { id: "ALGORITMOS_GENETICOS", nombre: "Algoritmos Genéticos", estado: "pendiente" },
    { id: "NAIVE_BAYES", nombre: "Naïve Bayes (Histogramas y Normal)", estado: "pendiente" },
    { id: "SVM", nombre: "Support Vector Machines (SVM)", estado: "pendiente" },
    { id: "HOPFIELD", nombre: "Redes de Hopfield", estado: "pendiente" },
    { id: "SOM", nombre: "Mapas Auto-organizados (SOM)", estado: "pendiente" },
    { id: "KNN", nombre: "K-Nearest Neighbors y LOOCV", estado: "pendiente" },
    { id: "CLUSTERING", nombre: "Clustering y K-Means", estado: "pendiente" }
  ],
  temas: [
    {
      id: "MLP_PERCEPTRON",
      nombre: "Perceptrón Simple, ADALINE y Redes MLP (Backpropagation)",
      badge: "MLP & Perceptrón",
      icono: "🧠",
      ponderacion: "25% – 30% del Parcial Práctico",
      tiempoSugerido: "25 - 30 min en hoja",
      objetivo: "Seguir en papel el algoritmo de 6/8 pasos de Backpropagation sin confundir neuronas lineales vs. sigmoidales, justificar el criterio de parada (EG y Early Stopping), aplicar el término de momento y verificar signos en Perceptrón analítico.",
      items: [
        {
          id: "PRAC-MLP-01",
          tema: "MLP_PERCEPTRON",
          tipo: "diagrama",
          titulo: "Arquitectura MLP, Flujo Forward/Backward y Lectura de Subíndices",
          etiquetaNaturaleza: "ENTRENAMIENTO PRÁCTICO · NO ES PREGUNTA DE PARCIAL",
          resumen: "Cómo leer correctamente los pesos en el dibujo del parcial y entender hacia dónde viaja cada cálculo en la red.",
          svgDiagram: `
            <svg viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg" class="lab-svg-diagram" role="img" aria-label="Diagrama de flujo Forward y Backward en red MLP">
              <defs>
                <marker id="arrow-fwd" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8" />
                </marker>
                <marker id="arrow-bwd" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#fb7185" />
                </marker>
              </defs>

              <!-- Leyendas Superiores -->
              <rect x="20" y="12" width="330" height="34" rx="8" fill="rgba(56, 189, 248, 0.12)" stroke="#38bdf8" stroke-width="1"/>
              <text x="185" y="34" text-anchor="middle" fill="#38bdf8" font-size="13" font-weight="700">1. PASO FORWARD (→): Net_j y Salidas f(Net_j)</text>

              <rect x="410" y="12" width="330" height="34" rx="8" fill="rgba(251, 113, 133, 0.12)" stroke="#fb7185" stroke-width="1"/>
              <text x="575" y="34" text-anchor="middle" fill="#fb7185" font-size="13" font-weight="700">2. PASO BACKWARD (←): Gradientes δ y Δw</text>

              <!-- Capa Entrada -->
              <text x="90" y="75" text-anchor="middle" class="svg-label-muted" font-size="12" font-weight="700">CAPA ENTRADA</text>
              <circle cx="90" cy="120" r="24" class="svg-node svg-node-in"/>
              <text x="90" y="125" text-anchor="middle" class="svg-node-text" font-size="14" font-weight="700">x₁</text>
              <circle cx="90" cy="220" r="24" class="svg-node svg-node-in"/>
              <text x="90" y="225" text-anchor="middle" class="svg-node-text" font-size="14" font-weight="700">x₂</text>

              <!-- Capa Oculta -->
              <text x="330" y="75" text-anchor="middle" class="svg-label-muted" font-size="12" font-weight="700">CAPA OCULTA (o₁, o₂)</text>
              <circle cx="330" cy="120" r="28" class="svg-node svg-node-hidden"/>
              <text x="330" y="118" text-anchor="middle" class="svg-node-text" font-size="14" font-weight="700">o₁</text>
              <text x="330" y="135" text-anchor="middle" class="svg-label-muted" font-size="10">f(net_o1)</text>

              <circle cx="330" cy="220" r="28" class="svg-node svg-node-hidden"/>
              <text x="330" y="218" text-anchor="middle" class="svg-node-text" font-size="14" font-weight="700">o₂</text>
              <text x="330" y="235" text-anchor="middle" class="svg-label-muted" font-size="10">f(net_o2)</text>

              <!-- Capa Salida -->
              <text x="570" y="75" text-anchor="middle" class="svg-label-muted" font-size="12" font-weight="700">CAPA SALIDA (s₁, s₂)</text>
              <circle cx="570" cy="120" r="28" class="svg-node svg-node-out"/>
              <text x="570" y="118" text-anchor="middle" class="svg-node-text" font-size="14" font-weight="700">s₁</text>
              <text x="570" y="135" text-anchor="middle" class="svg-label-muted" font-size="10">So₁ vs Sd₁</text>

              <circle cx="570" cy="220" r="28" class="svg-node svg-node-out"/>
              <text x="570" y="218" text-anchor="middle" class="svg-node-text" font-size="14" font-weight="700">s₂</text>
              <text x="570" y="235" text-anchor="middle" class="svg-label-muted" font-size="10">So₂ vs Sd₂</text>

              <!-- Conexiones Forward (Entrada -> Oculta) -->
              <line x1="115" y1="115" x2="298" y2="115" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrow-fwd)"/>
              <text x="205" y="106" text-anchor="middle" fill="#38bdf8" font-size="11" font-weight="700">w₁₋x₁ (dest=o₁, orig=x₁)</text>

              <line x1="114" y1="130" x2="299" y2="210" stroke="#38bdf8" stroke-width="1.6" stroke-dasharray="4,3" marker-end="url(#arrow-fwd)"/>
              <line x1="114" y1="210" x2="299" y2="130" stroke="#38bdf8" stroke-width="1.6" stroke-dasharray="4,3" marker-end="url(#arrow-fwd)"/>

              <line x1="115" y1="225" x2="298" y2="225" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrow-fwd)"/>
              <text x="205" y="245" text-anchor="middle" fill="#38bdf8" font-size="11" font-weight="700">w₂₋x₂ (dest=o₂, orig=x₂)</text>

              <!-- Conexiones Forward (Oculta -> Salida) -->
              <line x1="360" y1="114" x2="538" y2="114" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrow-fwd)"/>
              <text x="450" y="105" text-anchor="middle" fill="#38bdf8" font-size="11" font-weight="700">w_s1-o1</text>

              <line x1="358" y1="132" x2="540" y2="208" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="4,3" marker-end="url(#arrow-fwd)"/>
              <line x1="358" y1="208" x2="540" y2="132" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="4,3" marker-end="url(#arrow-fwd)"/>

              <line x1="360" y1="226" x2="538" y2="226" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrow-fwd)"/>

              <!-- Retorno Backward (Salida -> Oculta -> Entrada) -->
              <line x1="538" y1="126" x2="362" y2="126" stroke="#fb7185" stroke-width="2" marker-end="url(#arrow-bwd)"/>
              <text x="450" y="146" text-anchor="middle" fill="#fb7185" font-size="11" font-weight="700">δ_s1 · w_s1-o1</text>

              <line x1="538" y1="214" x2="362" y2="214" stroke="#fb7185" stroke-width="2" marker-end="url(#arrow-bwd)"/>
              <text x="450" y="246" text-anchor="middle" fill="#fb7185" font-size="11" font-weight="700">δ_s2 · w_s2-o2</text>

              <!-- Salida final y Error Ep -->
              <line x1="600" y1="120" x2="660" y2="120" stroke="#10b981" stroke-width="2" marker-end="url(#arrow-fwd)"/>
              <text x="698" y="124" text-anchor="middle" fill="#10b981" font-size="12" font-weight="700">So₁ vs Sd₁</text>
              <line x1="600" y1="220" x2="660" y2="220" stroke="#10b981" stroke-width="2" marker-end="url(#arrow-fwd)"/>
              <text x="698" y="224" text-anchor="middle" fill="#10b981" font-size="12" font-weight="700">So₂ vs Sd₂</text>

              <!-- Regla mnemotécnica inferior -->
              <rect x="20" y="264" width="720" height="28" rx="6" class="svg-note-bg"/>
              <text x="380" y="283" text-anchor="middle" class="svg-node-text" font-size="12" font-weight="600">
                Regla de subíndices UTN: w_ji significa conexión DESDE i (origen) HACIA j (destino) ➔ Δw_ji = α · δ_j(destino) · y_i(origen)
              </text>
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
          resumen: "Guía paso a paso exactamente como figura en las diapositivas de cátedra (`Sem11-2-MLP-BPN_26.pptx`), incluyendo qué fórmula escribir y qué comentar brevemente en tu hoja de examen.",
          pasos: [
            {
              nro: 1,
              titulo: "Inicialización de los pesos y parámetros",
              queHago: "Verifico todos los pesos iniciales $w_{ji}(0)$ (ya sean de tabla o sobre el grafo de la red), la tasa de aprendizaje $\\alpha$ y si existe término de momento $\\beta$ (si no lo menciona, $\\beta = 0$). En código real se eligen valores aleatorios pequeños.",
              formula: "$$W(0) = \\{w_{ji}(0)\\}, \\quad \\alpha \\in (0, 1], \\quad \\beta \\in [0, 1)$$",
              queEscriboEnHoja: "«Paso 1: Partimos de los pesos sinápticos iniciales W(0), coeficiente de aprendizaje α = ... y momento β = ... suministrados por la consigna.»"
            },
            {
              nro: 2,
              titulo: "Presentación de datos y codificación de la salida",
              queHago: "Tomo el patrón $p$ a evaluar anotando sus entradas $x_i$ y su salida deseada $S_{dk}$ (o $d_k$). Si el problema tiene clases categóricas (ej. `Sol / Lluvia` o clases A/B), dejo explícita su codificación numérica (ej. `[0, 1]`).",
              formula: "$$\\text{Patrón } p: \\; (\\mathbf{E}_p; \\mathbf{S}_d) = ([x_1, x_2, \\dots]; [S_{d1}, S_{d2}, \\dots])$$",
              queEscriboEnHoja: "«Paso 2: Presentamos el patrón p₁ con vector de entrada E = [...] y salida deseada codificada Sd = [...].»"
            },
            {
              nro: 3,
              titulo: "Calcular la salida actual de la red (Forward Pass)",
              queHago: "Voy capa por capa **de izquierda a derecha** (primero capa oculta, luego capa de salida). En cada neurona calculo su entrada neta $net_j$ multiplicando cada entrada por su peso y sumando (ojo si hay sesgo/bias $b_j$), y luego aplico la función de activación que indique esa neurona (**Lineal** o **Sigmoidal**).",
              formula: "$$net_j = \\sum_{i} w_{ji} \\cdot y_i \\qquad \\Longrightarrow \\qquad y_j = f(net_j) = \\begin{cases} net_j & \\text{si es Lineal (Identidad)} \\\\ \\dfrac{1}{1 + e^{-net_j}} & \\text{si es Sigmoidal} \\end{cases}$$",
              queEscriboEnHoja: "«Paso 3 (Forward): Calculo el net y la activación f(net) de las neuronas ocultas (función [lineal/sigmoidal]) y propago esos valores hacia las neuronas de salida.»"
            },
            {
              nro: 4,
              titulo: "Calcular los términos de error δ (Backward Pass)",
              queHago: "Retropropago **de derecha a izquierda**. Primero calculo $\\delta_{sk}$ en la **Capa de Salida** usando $S_{dk} - S_{ok}$. Luego calculo $\\delta_{oj}$ en cada **Neurona Oculta** sumando todos los $\\delta$ de las neuronas a las que se conecta multiplicados por sus respectivos pesos, y todo por la derivada $f'(net_{oj})$.",
              formula: "$$\\delta_{sk} = (S_{dk} - S_{ok}) \\cdot f'(net_{sk}) \\qquad\\mid\\qquad \\delta_{oj} = f'(net_{oj}) \\cdot \\sum_{k \\in \\text{Salidas}} (\\delta_{sk} \\cdot w_{sk-oj})$$\n$$f'(net) = \\begin{cases} 1 & \\text{si neurona es Lineal} \\\\ f(net)\\cdot(1 - f(net)) & \\text{si neurona es Sigmoidal} \\end{cases}$$",
              queEscriboEnHoja: "«Paso 4 (Backward): Determino los gradientes locales δ en capa de salida y los retropropago hacia las neuronas ocultas multiplicados por la derivada de su función de transferencia.»"
            },
            {
              nro: 5,
              titulo: "Actualización de los pesos sinápticos (Regla Delta Generalizada)",
              queHago: "Actualizo cada peso pedido (tanto de salida como ocultos). Uso siempre la regla mnemotécnica: **$\\alpha \\times \\delta_{\\text{neurona destino}} \\times \\text{activación}_{\\text{neurona origen}}$**. Si la consigna pide **momento $\\beta$**, sumo $\\beta \\cdot \\Delta w_{ji}(t-1)$.",
              formula: "$$\\Delta w_{ji}(t) = \\alpha \\cdot \\delta_j \\cdot y_i + \\beta \\cdot \\Delta w_{ji}(t-1) \\qquad\\Longrightarrow\\qquad w_{ji}(t+1) = w_{ji}(t) + \\Delta w_{ji}(t)$$",
              queEscriboEnHoja: "«Paso 5: Actualizo los pesos mediante la Regla Delta Generalizada (w(t+1) = w(t) + Δw), aplicando el término de momento β donde corresponde.»"
            },
            {
              nro: 6,
              titulo: "Calcular el Error del Patrón (Ep), Error Global (EG) y Criterio de Parada (Pasos 7-8)",
              queHago: "Calculo el error cuadrático producido para ese patrón ($E_p$). Nota de la cátedra: si faltan patrones, vuelvo al Paso 2; cuando completo los $L$ patrones de la época, promedio todos los $E_p$ para hallar el **Error Global ($E_G$)** y decido si paro o sigo iterando.",
              formula: "$$E_p = \\frac{1}{2} \\sum_{k=1}^{M} (S_{dk} - S_{ok})^2 \\qquad\\Longrightarrow\\qquad E_G = \\frac{1}{L} \\sum_{p=1}^{L} E_p$$",
              queEscriboEnHoja: "«Paso 6 y Cierre de Época: Calculo el error del patrón Ep y el error global medio EG = (1/L) Σ Ep. Como EG [<= / >] E_mínimo aceptable, el entrenamiento [finaliza / debe realizar una iteración más].»"
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
              queHago: "Planteo el potencial nulo $net = 0$ con $x_0 = 1$ y $w_0 = -\\theta$. Despejo $x_2$ en función de $x_1$. Luego dibujo los puntos de clase 0 y clase 1 en los ejes $(x_1, x_2)$ y elijo **una recta que los separe** con su pendiente $m$ y ordenada al origen $b$. Igualando coeficientes saco $\\theta, w_1, w_2$.",
              formula: "$$w_1 x_1 + w_2 x_2 - \\theta = 0 \\quad\\Longrightarrow\\quad x_2 = -\\frac{w_1}{w_2} x_1 + \\frac{\\theta}{w_2}$$",
              queEscriboEnHoja: "«Trazo la recta separadora x₂ = m·x₁ + b entre ambas clases, fijando arbitrariamente θ (o w₂) para despejar los pesos proporcionales.»"
            },
            {
              nro: 2,
              titulo: "Perceptrón — Verificación OBLIGATORIA del Semiplano (Invertir Signos)",
              queHago: "Tomo un punto testigo de Clase 1 y otro de Clase 0 y calculo $net = w_1 x_1 + w_2 x_2 - \\theta$. Si la recta separa bien pero el punto de Clase 1 me da $net < 0$ (me da salida 0 en vez de 1), **invierto el signo a TODOS**: $-w_1, -w_2, -\\theta$ (es decir, cambio de signo $w_0, w_1, w_2$).",
              formula: "$$\\text{Si un patrón Clase 1 da } f(net) = 0 \\implies w_0 \\leftarrow -w_0, \\; w_1 \\leftarrow -w_1, \\; w_2 \\leftarrow -w_2$$",
              queEscriboEnHoja: "«Verifico con un patrón de cada clase: como el signo obtenido es opuesto a la salida deseada, invierto el signo de θ y de todos los pesos para orientar el semiplano positivo.»"
            },
            {
              nro: 3,
              titulo: "Perceptrón — Método Iterativo vs. ADALINE (Regla Delta / LMS)",
              queHago: "En **Perceptrón Simple**, primero paso $net$ por el escalón $y = f(net) \\in \\{0, 1\\}$ y calculo $\\varepsilon = S_d - y$. En **ADALINE**, el error se calcula **antes del escalón** usando la salida lineal ($S_o = net$): $\\varepsilon = S_d - net$. Si $\\varepsilon \\ne 0$, actualizo cada peso (incluyendo $w_0$ con $x_0 = 1$).",
              formula: "$$w_i(t+1) = w_i(t) + \\alpha \\cdot (S_d - y) \\cdot x_i \\qquad (x_0 = 1, \\; w_0 = -\\theta)$$",
              queEscriboEnHoja: "«Para el patrón pᵢ evalúo net, comparo con Sd y al haber error ε ≠ 0 aplico la regla de ajuste a w₀, w₁, w₂ antes de pasar al patrón siguiente.»"
            }
          ]
        },
        {
          id: "PRAC-MLP-04",
          tema: "MLP_PERCEPTRON",
          tipo: "plantilla",
          titulo: "Plantilla de Tablas para Dibujar en tu Hoja en Blanco (MLP)",
          etiquetaNaturaleza: "ENTRENAMIENTO PRÁCTICO · NO ES PREGUNTA DE PARCIAL",
          resumen: "Qué columnas armar en papel para no perder variables, redondeos ni subíndices mientras usás la calculadora.",
          tablaPlantilla: {
            tituloTabla: "1) Tabla Paso Forward (una fila por neurona, de Oculta a Salida)",
            columnas: ["Neurona j", "Función", "Cálculo de net_j = Σ w_ji · y_i", "Salida f(net_j)", "Derivada f'(net_j)"],
            filas: [
              ["o₁ (oculta)", "Lineal / Sigmoide", "x₁·w₁₋ₓ₁ + x₂·w₁₋ₓ₂", "net₁ ó 1/(1+e⁻ⁿᵉᵗ)", "1 ó f(1 - f)"],
              ["s₁ (salida)", "Sigmoide / Lineal", "f(net_o1)·w_s1-o1 + ...", "1/(1+e⁻ⁿᵉᵗ) ó net", "f(1 - f) ó 1"]
            ]
          },
          tablaPlantilla2: {
            tituloTabla: "2) Tabla Paso Backward (Errores δ) y 3) Actualización de Pesos",
            columnas: ["Peso w_ji", "w_ji(t) actual", "δ_j (destino)", "y_i (origen)", "Δw = α·δ_j·y_i + β·Δw(t-1)", "w_ji(t+1) nuevo"],
            filas: [
              ["w_s1-o1 (salida)", "w_s1-o1(t)", "δ_s1", "f(net_o1)", "α · δ_s1 · f(net_o1) + ...", "w(t) + Δw"],
              ["w_o1-x1 (oculta)", "w_o1-x1(t)", "δ_o1", "x₁ (entrada)", "α · δ_o1 · x₁ + ...", "w(t) + Δw"]
            ]
          },
          tipHoja: "💡 **Tip de examen:** Antes de hacer cualquier cuenta en la calculadora, dejá escrita la fórmula con letras arriba de tu tabla y trabajá siempre con **3 o 4 decimales** consistentes (como pide el Ej. 03 de la guía)."
        },
        {
          id: "PRAC-MLP-05",
          tema: "MLP_PERCEPTRON",
          tipo: "formula",
          titulo: "Flashcard 1: Derivada f'(net) — Lineal vs. Sigmoidal",
          etiquetaNaturaleza: "ENTRENAMIENTO PRÁCTICO · NO ES PREGUNTA DE PARCIAL",
          preguntaFrente: "El enunciado dice: «Neuronas 1, 2, 3: lineales. Neuronas 4, 5: sigmoidales». ¿Cuánto valen f(net) y f'(net) en cada una y cuál es el error clásico en parcial?",
          respuestaDorso: "1. **Si la neurona es Lineal (Identidad):**\n   $$f(net) = net \\qquad\\Longrightarrow\\qquad f'(net) = 1$$\n   *(No multiplicás por nada extra en la derivada, es directamente 1).* \n2. **Si la neurona es Sigmoidal:**\n   $$f(net) = \\frac{1}{1 + e^{-net}} \\qquad\\Longrightarrow\\qquad f'(net) = f(net) \\cdot (1 - f(net))$$\n   *(Si el parcial ya te da el valor $f(net)$ en una tabla, **NO calcules $e^{-net}$**: usá directamente ese valor para hacer $\\text{valor} \\times (1 - \\text{valor})$).* \n\n⚠️ **Error clásico:** Aplicar $f(1-f)$ a una neurona oculta que el gráfico aclaraba que era **lineal** (como pasa en los Ejercicios 01.2, 01.3 y 01.5 de la Guía)."
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
          respuestaDorso: "Se mira **primero la fila de Error de Validación** (no la de Entrenamiento ni Test para decidir el corte).\n\n* Mientras el **Error de Validación** baja junto con el de entrenamiento, la red sigue generalizando bien.\n* En el instante en que el Error de Validación **alcanza su mínimo y en la iteración siguiente empieza a subir** (mientras entrenamiento sigue bajando), comenzó el **sobreajuste (*overfitting*)**.\n* **Qué escribir en la hoja:** «Se debe detener el entrenamiento en la iteración $I_k$ (la del mínimo de validación), ya que a partir de $I_{k+1}$ el error de validación crece mientras el de entrenamiento sigue descendiendo, evidenciando sobreajuste (*overfitting*).»\n* *Nota:* Si el ejercicio aclara expresamente «no se utiliza error de validación», recién ahí comparás **$E_G \\le E_{\\text{mínimo aceptable}}$**."
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
    }
  ]
};
