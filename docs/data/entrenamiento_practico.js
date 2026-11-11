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
    { id: "SVM", nombre: "Support Vector Machines (SVM)", estado: "completo" },
    { id: "HOPFIELD", nombre: "Redes de Hopfield", estado: "completo" },
    { id: "SOM", nombre: "Mapas Auto-organizados (SOM)", estado: "completo" },
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
          respuestaDorso: "Se mira **primero la fila de Error de Validación** (no la de Entrenamiento ni Test para decidir el corte).\n\n* Mientras el **Error de Validación** baja junto con el de entrenamiento, la red sigue generalizando bien.\n* En el instante en que el Error de Validación **alcanza su mínimo y en la iteración siguiente empieza a subir** (mientras entrenamiento sigue bajando), comenzó el **sobreajuste (overfitting)**.\n* **Qué escribir en la hoja:** «Se debe detener el entrenamiento en la iteración $I_k$ (la del mínimo de validación), ya que a partir de $I_{k+1}$ el error de validación crece mientras el de entrenamiento sigue descendiendo, evidenciando sobreajuste (*overfitting*).»\n* *Nota:* Si el ejercicio aclara expresamente «no se utiliza error de validación», recién ahí comparás **$E_G \\le E_{\\text{mínimo aceptable}}$**."
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
              queHago: "Contar la cantidad total $N$ de individuos y sumar todas las aptitudes $\\sum f_i$. Si piden **Selección Elitista** del $k\\%$, ordenás por aptitud descendente y copiás directo a los $\\text{round}(k\\% \\cdot N)$ mejores **sin pasarlos por cruce ni mutación**.",
              formula: "$$S = \\sum_{i=1}^{N} f_i \\qquad \\bar{f} = \\frac{S}{N} \\qquad N_{\\text{elite}} = k\\% \\cdot N$$",
              queEscriboEnHoja: "«Calculo la aptitud total de la población $\\sum f_i = \\dots$ y la media $\\bar{f} = \\dots$. En caso de selección elitista del $k\\%$, preservo intactos los mejores individuos sin recombinación.»"
            },
            {
              nro: 2,
              titulo: "Método 1 — Selección por Ruleta Proporcional [00–99]",
              queHago: "Calculás la aptitud normalizada $p_i = f_i / \\sum f$, multiplicás por $100$ y redondeás a ranuras enteras (verificando que sumen exactamente $100$). Asignás rangos consecutivos empezando en `00` hasta `99` y leés la lista de aleatorios en orden.",
              formula: "$$p_i = \\frac{f_i}{\\sum_{j=1}^N f_j} \\qquad \\text{Ranuras}_i = \\text{round}(100 \\cdot p_i) \\qquad \\text{Rango}_i = [\\text{Fin}_{i-1}+1,\\; \\text{Fin}_{i-1}+\\text{Ranuras}_i]$$",
              queEscriboEnHoja: "«Normalizo las aptitudes como $p_i = f_i / \\sum f_j$, asigno 100 ranuras en el rango $[00-99]$ sin huecos ni solapamientos y selecciono cada individuo según el intervalo que contiene al número aleatorio $r_k$.»"
            },
            {
              nro: 3,
              titulo: "Método 2 — Control sobre el Número Esperado de Copias",
              queHago: "Calculás el valor esperado $c_i = f_i / \\bar{f}$ (equivalente a $N \\cdot p_i$). Si piden seleccionar una fracción $M$ (ej. $50\\%$ de $N$, como en el Parcial 19/11/2025), asignás primero las partes enteras $\\lfloor c_i \\rfloor$. Los cupos faltantes hasta $M$ se completan o bien **por mayor parte decimal** (Criterio Determinista) o haciendo una **nueva ruleta normalizada sobre las partes decimales** $d_i / \\sum d_k$ (Guía Ej. 01-e).",
              formula: "$$c_i = \\frac{f_i}{\\bar{f}} = \\lfloor c_i \\rfloor + d_i \\qquad P_i^{\\text{dec}} = \\frac{d_i}{\\sum_{k=1}^N d_k}$$",
              queEscriboEnHoja: "«Calculo las copias esperadas $c_i = f_i / \\bar{f}$, asigno determinísticamente la parte entera $\\lfloor c_i \\rfloor$ y completo los cupos vacantes mediante [los mayores residuos decimales / ruleta normalizada sobre $d_i$].»"
            },
            {
              nro: 4,
              titulo: "Método 3 — Selección por Ranking Lineal (Orden Descendente)",
              queHago: "Primero **ordenás la tabla de mayor a menor aptitud**: $i = 1$ es el **más apto** y $i = n$ es el **menos apto**. Aplicás la fórmula oficial de la cátedra para obtener copias esperadas $c_i$ usando $R_{\\min} \\in [0, 1]$ (verificando que $\\sum c_i = n$). Luego aplicás parte entera + mayor parte decimal (o ruleta sobre $d_i$, según pida el enunciado).",
              formula: "$$c_i = R_{\\min} + 2 \\cdot \\frac{(n - i)(1 - R_{\\min})}{n - 1} \\qquad (i = 1:\\text{ mejor},\\; i = n:\\text{ peor})$$",
              queEscriboEnHoja: "«Para evitar convergencia prematura por súper-individuos, ordeno decrecientemente la población ($i=1$ mejor, $i=n$ peor), aplico Ranking Lineal con $R_{\\min} = \\dots$ verificando $\\sum c_i = n$, y asigno copias enteras y decimales.»"
            },
            {
              nro: 5,
              titulo: "Cierre: Ajuste cuando piden un % de la población (ej. 30%, 40%, 50%)",
              queHago: "Si el enunciado pide seleccionar por ejemplo *«el 40% de la población»* sobre $N=10$ (es decir $M=4$ individuos), en Ruleta leés solo los primeros 4 aleatorios (o tomás las copias pedidas); en Control de Copias o Ranking podés trabajar con $\\sum c_i = N$ asignando enteros sin pasarte de $M$ y cubriendo los cupos restantes hasta $M$ con las mayores partes decimales.",
              formula: "$$M_{\\text{objetivo}} = \\text{Porcentaje} \\cdot N \\qquad \\Delta N = M_{\\text{objetivo}} - N_{\\text{enteras asignadas}}$$",
              queEscriboEnHoja: "«El cupo objetivo es del $\\dots\\%$ ($M = \\dots$ individuos). Con las copias por parte entera cubro $\\dots$ plazas y las $\\Delta N$ restantes se asignan según la parte fraccionaria.»"
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
              queHago: "Ubicás el corte **después del bit $k$** contando desde la izquierda ($1 \\dots k \\mid k+1 \\dots L$). Hijo 1 toma prefijo de Padre 1 + sufijo de Padre 2. **Cuidado:** leé bien si te piden el Hijo 2 clásico (prefijo P2 + sufijo P1) o *«por complemento binario del primero»* ($\\text{NOT}(\\text{Hijo 1})$ bit a bit).",
              formula: "$$H_1 = P_1[1..k] \\parallel P_2[k+1..L] \\qquad H_2^{\\text{clásico}} = P_2[1..k] \\parallel P_1[k+1..L] \\quad \\text{ó} \\quad H_2^{\\text{comp}} = \\overline{H_1}$$",
              queEscriboEnHoja: "«Aplico cruce simple en el gen $G_k$, conservando en el Hijo 1 los primeros $k$ bits del primer progenitor y los restantes del segundo (y obtengo Hijo 2 según el criterio solicitado).»"
            },
            {
              nro: 2,
              titulo: "Cruza Multipunto en Gk1, Gk2, ..., Gkm",
              queHago: "Trazás líneas verticales **después** de cada posición indicada ($k_1, k_2, \\dots$) dividiendo el cromosoma en segmentos. Si hay cantidad impar de cortes (ej. 3 cortes en `G2, G5, G7`), se asume un corte implícito en 0 (anillo). Alternás bloques: Hijo 1 toma `Seg1(P1) + Seg2(P2) + Seg3(P1) + Seg4(P2)` y Hijo 2 lo opuesto.",
              formula: "$$H_1 = \\text{Seg}_1(P_1) \\parallel \\text{Seg}_2(P_2) \\parallel \\text{Seg}_3(P_1) \\parallel \\dots$$",
              queEscriboEnHoja: "«Segmento ambos cromosomas en los loci $G_{k1}, G_{k2}, \\dots$ alternando bloques entre Padre 1 y Padre 2 (modelo de anillo) para generar ambos descendientes.»"
            },
            {
              nro: 3,
              titulo: "Cruza Binomial / Uniforme (Ranuras gen a gen)",
              queHago: "Si el primer progenitor tiene prob $p$ y el segundo $1-p$, asignás ranuras $[00\\text{ a }(100p-1)]$ al primero y $[100p\\text{ a }99]$ al segundo (si $p=0.5$ es Uniforme: `00-49` y `50-99`). Para cada bit $j = 1 \\dots L$, mirás el aleatorio $r_j$ para decidir de qué progenitor copiás el bit $j$ para Hijo 1. Para Hijo 2 fijate cuál de los **dos métodos** piden: (a) **genes no seleccionados**, o (b) **complemento binario de Hijo 1**.",
              formula: "$$r_j \\in [00,\\, 100p-1] \\implies H_1[j] = P_1[j], \\qquad r_j \\in [100p,\\, 99] \\implies H_1[j] = P_2[j]$$",
              queEscriboEnHoja: "«Asigno ranuras $[00 - \\dots]$ al Padre 1 ($p = \\dots$) y $[\\dots - 99]$ al Padre 2 ($1-p = \\dots$). Evalúo cada locus con su aleatorio $r_j$ y construyo el segundo hijo mediante [genes no seleccionados / complemento binario del Hijo 1].»"
            },
            {
              nro: 4,
              titulo: "Mutación Simple vs. Adaptativa por Temperatura (Ascendente / Descendente)",
              queHago: "En Mutación Simple, invertís únicamente el bit indicado ($0 \\leftrightarrow 1$). En **Temperatura**, recordá que en la cátedra **las generaciones arrancan en $t = 0$**! Aplicás la fórmula lineal **sin pasarte** de $[P_{\\min}, P_{\\max}]$. Si el enunciado aclara **reinicio cíclico** (caso `Alg_gen_Adapt_Temp.pdf`), primero hallás la longitud del ciclo $T = \\frac{P_{\\max}-P_{\\min}}{\\lambda} + 1$ y evaluás $t_{\\text{rel}} = t \\pmod{T}$.",
              formula: "$$\\text{Asc: } p_m(t) = \\min(P_{\\max},\\; P_{\\min} + \\lambda \\cdot t_{\\text{rel}}) \\qquad \\text{Desc: } p_m(t) = \\max(P_{\\min},\\; P_{\\max} - \\lambda \\cdot t_{\\text{rel}})$$",
              queEscriboEnHoja: "«Siendo $t=0$ la generación inicial, evalúo el esquema térmico [ascendente/descendente] con paso $\\lambda$ acotado al intervalo $[P_{\\min}, P_{\\max}]$ (con ciclo modular $T$ si reinicia al saturar).»"
            },
            {
              nro: 5,
              titulo: "Justificación conceptual: Temperatura vs. Convergencia",
              queHago: "Si te preguntan si la Mutación por Temperatura (ascendente o descendente) mide la **homogeneidad de la población**, respondés con firmeza **NO**. Solo depende del contador temporal $t$; la que sí evalúa diversidad/similitud genética real es la **Mutación Adaptativa por Convergencia**.",
              formula: "$$\\text{Temperatura } \\implies f(t) \\text{ (exógena)} \\qquad \\text{Convergencia } \\implies f(\\text{diversidad}) = \\frac{N_{\\text{distintos}}}{N_{\\text{total}}}$$",
              queEscriboEnHoja: "«La mutación por temperatura NO evalúa la homogeneidad poblacional porque solo depende del número de generación $t$; el método que sí mide la diversidad real es la mutación adaptativa por convergencia.»"
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
          respuestaDorso: "* **Esquema Estándar (se estabiliza en el tope):**\n  * Temperatura Ascendente: $p_m(t) = \\min(P_{\\max},\\; P_{\\min} + \\lambda \\cdot t)$.\n  * Temperatura Descendente: $p_m(t) = \\max(P_{\\min},\\; P_{\\max} - \\lambda \\cdot t)$.\n  * Como se alcanza $P_{\\max} = 0.1$ en $t = \\frac{0.1 - 0.001}{0.001} = 99$, para $t \\ge 99$ quedaría fijo en $0.100$.\n* **Esquema con Reinicio Cíclico (trampa clásica de `Alg_gen_Adapt_Temp.pdf`):**\n  * De $t = 0$ a $t = 99$ hay exactamente **$T = 99 + 1 = 100$ generaciones por ciclo**. En $t = 100$ reinicia a $P_{\\min} = 0.001$.\n  * Usás aritmética modular $t_{\\text{rel}} = t \\pmod{100}$:\n    * $t = 200 \\implies t_{\\text{rel}} = 0 \\implies p_m(200) = 0.001 + 0.001(0) = \\mathbf{0.001}$\n    * $t = 320 \\implies t_{\\text{rel}} = 20 \\implies p_m(320) = 0.001 + 0.001(20) = \\mathbf{0.021}$\n    * $t = 435 \\implies t_{\\text{rel}} = 35 \\implies p_m(435) = 0.001 + 0.001(35) = \\mathbf{0.036}$"
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
              queHago: "Leé cuántas muestras hay en cada clase $N_k$ y el total general $N_{\\text{total}}$. Si el enunciado da porcentajes (ej. `T1=30%` de `125.000`), calculás $N_1 = 0.30 \\times 125.000 = 37.500$ porque **lo vas a necesitar como denominador de los bins**. Si falta una clase («y el resto de $E_4$»), restás del total.",
              formula: "$$P(C_k) = \\frac{N_k}{N_{\\text{total}}} \\qquad N_k = P(C_k) \\cdot N_{\\text{total}}$$",
              queEscriboEnHoja: "«Determino la cantidad de muestras por clase $N_k$ (si vienen en %, calculo $N_k = P(C_k)\\cdot N_{\\text{total}}$) y obtengo las probabilidades *a priori* $P(C_k) = N_k / N_{\\text{total}}$ verificando que sumen $1$.»"
            },
            {
              nro: 2,
              titulo: "Ubicar el bin exacto de cada atributo de la nueva instancia",
              queHago: "Para cada coordenada de la instancia $X_{\\text{nueva}} = (x_1, x_2, \\dots)$, localizás en qué columna/intervalo cae respetando estrictamente bordes abiertos `(` vs. cerrados `]`.",
              formula: "$$x_i \\in (a, b] \\iff a < x_i \\le b$$",
              queEscriboEnHoja: "«Para la instancia $X = (\\dots)$, identifico los intervalos correspondientes: $x_1$ pertenece al bin $(\\dots]$, $x_2$ al bin $(\\dots]$, etc.»"
            },
            {
              nro: 3,
              titulo: "Extraer las Verosimilitudes Condicionales P(xi ∈ Bin | Ck)",
              queHago: "Para cada clase $C_k$, tomás la frecuencia observada en ese bin y la dividís por **$N_k$ (total de ESA clase, NO $N_{\\text{total}}$)**. **Ojo:** si una celda vale $0$, comentá el efecto anulador y aplicá **Laplace** si corresponde.",
              formula: "$$P(x_i \\in \\text{Bin}_m \\mid C_k) = \\frac{\\text{Frec}(\\text{Bin}_m,\\, C_k)}{N_k} \\qquad (\\text{con Laplace: } \\frac{\\text{Frec} + 1}{N_k + B})$$",
              queEscriboEnHoja: "«Asumiendo independencia condicional entre atributos dada la clase, calculo cada verosimilitud dividiendo la frecuencia del intervalo por el total de esa clase $N_k$.»"
            },
            {
              nro: 4,
              titulo: "Multiplicar A Priori × Verosimilitudes (Score por clase)",
              queHago: "Aplicás el Teorema de Naïve Bayes sin el denominador $P(\\mathbf{x})$: multiplicás $P(C_k)$ por todas las verosimilitudes de esa clase. Anotá el resultado en **notación científica** clara (`5.87 × 10^-3`) para no perder dígitos significativos.",
              formula: "$$P(C_k \\mid \\mathbf{x}) \\propto \\text{Score}(C_k) = P(C_k) \\cdot \\prod_{i=1}^{D} P(x_i \\in \\text{Bin}_m \\mid C_k)$$",
              queEscriboEnHoja: "«Calculo el producto proporcional a la probabilidad *a posteriori* para cada clase: $P(C_k \\mid \\mathbf{x}) \\propto P(C_k) \\cdot P(x_1 \\mid C_k) \\cdots P(x_D \\mid C_k) = \\dots$»"
            },
            {
              nro: 5,
              titulo: "Aplicar Regla MAP (ArgMax) y Normalizar si piden probabilidad %",
              queHago: "Comparás todos los $\\text{Score}(C_k)$ y elegís la clase mayor (cuidado con exponentes negativos: $10^{-3} > 10^{-6}$). Si la consigna pide la *«probabilidad de pertenecer a cada clase»*, dividís cada Score por la suma $\\sum \\text{Score}(C_j)$ para normalizar al $100\\%$.",
              formula: "$$C^* = \\arg\\max_{C_k} \\text{Score}(C_k) \\qquad P(C_k \\mid \\mathbf{x}) = \\frac{\\text{Score}(C_k)}{\\sum_j \\text{Score}(C_j)}$$",
              queEscriboEnHoja: "«Por regla MAP ($\\arg\\max$), como $\\text{Score}(C^*) > \\text{Score}(C_{\\text{otras}})$, la nueva instancia se clasifica como perteneciente a la clase **$C^*$** [con probabilidad normalizada del $\\dots\\%$].»"
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
              queHago: "Si ya te dan la tabla de $(\\mu, \\sigma)$, salteás este paso. Si te dan puntos $(x, y, \\text{Clase})$ (Ej. 03 o gráfico del Ej. 04), separás por clase y calculás la media $\\mu$ y el desvío $\\sigma$ de cada atributo. *(Nota: la guía resuelta de cátedra usa desvío poblacional dividiendo por $N_k$, tecla `xσn` en Casio; si usás $N_k-1$ aclará tu convención).* ",
              formula: "$$\\mu_{ik} = \\frac{1}{N_k} \\sum_{p \\in C_k} x_{pi} \\qquad \\sigma_{ik} = \\sqrt{\\frac{1}{N_k} \\sum_{p \\in C_k} (x_{pi} - \\mu_{ik})^2}$$",
              queEscriboEnHoja: "«Calculo la media $\\mu$ y el desvío estándar $\\sigma$ de entrenamiento para cada atributo dentro de cada clase y armo la tabla de parámetros gaussianos.»"
            },
            {
              nro: 2,
              titulo: "Calcular Probabilidades a Priori P(Ck)",
              queHago: "Contás cuántos ejemplos pertenecen a cada clase y dividís por el total $N_{\\text{total}}$. Si todas las clases tienen la misma cantidad de ejemplos (ej. 3 de clase `0` y 3 de clase `1`), $P(C_0) = P(C_1) = 0.5$.",
              formula: "$$P(C_k) = \\frac{N_k}{N_{\\text{total}}}$$",
              queEscriboEnHoja: "«Las probabilidades *a priori* de cada clase son $P(C_1) = N_1 / N_{\\text{total}} = \\dots$»"
            },
            {
              nro: 3,
              titulo: "Evaluar la Función de Densidad Gaussiana para cada atributo",
              queHago: "Para cada clase $C_k$ y cada atributo $x_i$ de la consulta, reemplazás $x_i, \\mu_{ik}, \\sigma_{ik}$ en la campana de Gauss. **¡Atención!** Si $\\sigma$ es chico (ej. $0.2$), el valor de densidad puede dar **$> 1$** (ej. $1.76$): es completamente normal porque es una *densidad*, no una probabilidad acumulada.",
              formula: "$$p(x_i \\mid C_k) = \\frac{1}{\\sigma_{ik}\\sqrt{2\\pi}} \\cdot e^{-\\frac{(x_i - \\mu_{ik})^2}{2\\sigma_{ik}^2}}$$",
              queEscriboEnHoja: "«Asumiendo distribución normal para cada atributo continuo, reemplazo $(x_i, \\mu_{ik}, \\sigma_{ik})$ en la función de densidad gaussiana para obtener las verosimilitudes.»"
            },
            {
              nro: 4,
              titulo: "Multiplicar A Priori × Verosimilitudes y Clasificar (ArgMax)",
              queHago: "Calculás $\\text{Score}(C_k) = P(C_k) \\cdot p(x_1 \\mid C_k) \\cdot p(x_2 \\mid C_k) \\cdots$ para todas las clases, normalizás si la consigna pide *«calcule la probabilidad»* (Ej. 01) y declarás ganadora la clase de mayor valor.",
              formula: "$$C^* = \\arg\\max_{C_k} \\left[ P(C_k) \\prod_{i=1}^D p(x_i \\mid C_k) \\right]$$",
              queEscriboEnHoja: "«Comparando los productos *a posteriori* (notación proporcional / normalizada), el mayor valor corresponde a la clase **$C^*$**, por lo tanto la nueva instancia se asigna a dicha clase.»"
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
          respuestaDorso: "* **Limitación de la Gaussiana:** Asume que cada clase y atributo sigue una única campana unimodal e independencia entre dimensiones. **Falla** si los datos son **multimodales** (varios grupos separados de la misma clase), tienen formas no convexas/entrelazadas (**espirales, anillos concéntricos**) o fuerte correlación diagonal.\n* **Alternativa:** Discretizar en **Histogramas (bins)** cuando no se conoce la distribución.\n* **3 factores clave al usar Histogramas (Slide 47):**\n  1. **No usar bins** si los datos responden claramente a una distribución paramétrica conocida.\n  2. Determinar correctamente la **amplitud (cantidad y ancho) de los bins**.\n  3. Manejar adecuadamente las probabilidades de los **bins vacíos (frecuencia cero)**."
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
    {
      id: "SVM",
      nombre: "Support Vector Machines (SVM) — Primal, Dual KKT y Margen",
      badge: "SVM",
      icono: "📐",
      ponderacion: "20% – 25% del Parcial Práctico",
      tiempoSugerido: "20 - 25 min en hoja",
      objetivo: "Identificar Vectores de Soporte (α_i > 0), reconstruir el vector w y el sesgo promediado b_prom, trazar los hiperplanos H_0, H+ y H- con sus cortes de ejes, verificar soluciones propuestas (Guía Ej. 02) y plantear el Dual Lagrangiano L_D con restricciones KKT y Margen Blando C.",
      items: [
        {
          id: "PRAC-SVM-01",
          tema: "SVM",
          tipo: "diagrama",
          titulo: "Geometría de Hiperplanos (H₀, H⁺, H⁻), Margen Máximo M y Vectores de Soporte",
          etiquetaNaturaleza: "ENTRENAMIENTO PRÁCTICO · NO ES PREGUNTA DE PARCIAL",
          resumen: "Cómo visualizar en R² los 3 hiperplanos paralelos, la dirección perpendicular de w y qué puntos definen realmente la frontera (α_i > 0 vs α_i = 0).",
          svgDiagram: `
            <svg viewBox="0 0 760 320" xmlns="http://www.w3.org/2000/svg" class="lab-svg-diagram" role="img" aria-label="Diagrama geometrico SVM con hiperplanos H0, H+, H-, margen 2/||w|| y vectores de soporte">
              <defs>
                <marker id="svm-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#fbbf24" />
                </marker>
                <marker id="svm-arrow-m" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#10b981" />
                </marker>
              </defs>

              <!-- Panel Izquierdo: Plano geometrico R^2 -->
              <rect x="20" y="14" width="435" height="254" rx="10" class="svg-node svg-node-in"/>
              <text x="237" y="36" text-anchor="middle" fill="#38bdf8" font-size="13" font-weight="800">PLANO R²: SEPARACIÓN DE MARGEN MÁXIMO</text>

              <!-- Ejes suaves -->
              <line x1="65" y1="226" x2="425" y2="226" stroke="#475569" stroke-width="1.2"/>
              <line x1="85" y1="54" x2="85" y2="246" stroke="#475569" stroke-width="1.2"/>
              <text x="432" y="230" class="svg-label-muted" font-size="11">x₁</text>
              <text x="85" y="48" text-anchor="middle" class="svg-label-muted" font-size="11">x₂</text>

              <!-- H+ (+1) -->
              <line x1="115" y1="74" x2="390" y2="174" stroke="#38bdf8" stroke-width="1.8" stroke-dasharray="6,4"/>
              <text x="396" y="170" fill="#38bdf8" font-size="11" font-weight="700">H⁺ (= +1)</text>

              <!-- H0 (= 0) -->
              <line x1="95" y1="104" x2="364" y2="202" stroke="#f8fafc" stroke-width="2.5"/>
              <text x="374" y="208" class="svg-node-text" font-size="11.5" font-weight="800">H₀ (= 0)</text>

              <!-- H- (-1) -->
              <line x1="75" y1="134" x2="355" y2="236" stroke="#fb7185" stroke-width="1.8" stroke-dasharray="6,4"/>
              <text x="360" y="246" fill="#fb7185" font-size="11" font-weight="700">H⁻ (= -1)</text>

              <!-- Vector normal w -->
              <line x1="168" y1="131" x2="188" y2="76" stroke="#fbbf24" stroke-width="2.4" marker-end="url(#svm-arrow)"/>
              <text x="198" y="82" fill="#fbbf24" font-size="12" font-weight="800">w (⊥ H₀)</text>

              <!-- Margen M = 2 / ||w|| -->
              <line x1="274" y1="132" x2="254" y2="188" stroke="#10b981" stroke-width="2" marker-start="url(#svm-arrow-m)" marker-end="url(#svm-arrow-m)"/>
              <rect x="275" y="140" width="95" height="22" rx="4" fill="#064e3b" stroke="#10b981" stroke-width="1"/>
              <text x="322" y="155" text-anchor="middle" fill="#a7f3d0" font-size="11" font-weight="700">M = 2 / ||w||</text>

              <!-- Puntos clase +1 -->
              <circle cx="239" cy="119" r="7" fill="#38bdf8" stroke="#fbbf24" stroke-width="2.4"/>
              <text x="239" y="106" text-anchor="middle" fill="#fbbf24" font-size="10" font-weight="700">SV (α₁>0)</text>

              <circle cx="310" cy="145" r="7" fill="#38bdf8" stroke="#fbbf24" stroke-width="2.4"/>
              <text x="342" y="128" text-anchor="middle" fill="#fbbf24" font-size="10" font-weight="700">SV (α₂>0)</text>

              <circle cx="325" cy="76" r="6" fill="#0284c7" stroke="#94a3b8" stroke-width="1.4"/>
              <text x="364" y="80" class="svg-label-muted" font-size="10">+1 (α=0)</text>

              <!-- Puntos clase -1 -->
              <rect x="172" y="166" width="13" height="13" rx="2" fill="#fb7185" stroke="#fbbf24" stroke-width="2.4"/>
              <text x="206" y="196" text-anchor="middle" fill="#fbbf24" font-size="10" font-weight="700">SV (α₃>0)</text>

              <rect x="115" y="198" width="12" height="12" rx="2" fill="#e11d48" stroke="#94a3b8" stroke-width="1.4"/>
              <text x="155" y="210" class="svg-label-muted" font-size="10">-1 (α=0)</text>

              <!-- Panel Derecho: Reglas de decision rapida -->
              <rect x="470" y="14" width="270" height="254" rx="10" class="svg-node svg-node-in"/>
              <text x="605" y="38" text-anchor="middle" fill="#10b981" font-size="13" font-weight="800">CHEQUEO DE VALIDEZ (Ej. 02)</text>

              <rect x="486" y="54" width="238" height="58" rx="6" fill="rgba(56, 189, 248, 0.12)" stroke="#38bdf8"/>
              <text x="605" y="73" text-anchor="middle" fill="#38bdf8" font-size="11.5" font-weight="700">1. Equilibrio KKT obligatorio:</text>
              <text x="605" y="91" text-anchor="middle" class="svg-node-text" font-size="11.5">Σ αᵢ yᵢ = 0   y   αᵢ ≥ 0</text>
              <text x="605" y="105" text-anchor="middle" class="svg-label-muted" font-size="10">(Si no da 0, el resultado dado es erróneo)</text>

              <rect x="486" y="122" width="238" height="64" rx="6" fill="rgba(16, 185, 129, 0.12)" stroke="#10b981"/>
              <text x="605" y="141" text-anchor="middle" fill="#10b981" font-size="11.5" font-weight="700">2. Consistencia geométrica:</text>
              <text x="605" y="159" text-anchor="middle" class="svg-node-text" font-size="11">• Los αᵢ > 0 deben caer SOBRE H⁺ / H⁻.</text>
              <text x="605" y="175" text-anchor="middle" class="svg-node-text" font-size="11">• Los puntos con yᵢ=+1 arriba, yᵢ=-1 abajo.</text>

              <rect x="486" y="196" width="238" height="58" rx="6" fill="rgba(251, 113, 133, 0.12)" stroke="#fb7185"/>
              <text x="605" y="215" text-anchor="middle" fill="#fb7185" font-size="11.5" font-weight="700">3. Ningún punto dentro de banda:</text>
              <text x="605" y="233" text-anchor="middle" class="svg-node-text" font-size="11">yᵢ (wᵀxᵢ + b) ≥ 1  ∀i  (caso separable)</text>
              <text x="605" y="247" text-anchor="middle" class="svg-label-muted" font-size="10">Si algún punto queda del lado opuesto ➔ Falla</text>

              <!-- Regla inferior -->
              <rect x="20" y="280" width="720" height="28" rx="6" class="svg-note-bg"/>
              <text x="380" y="299" text-anchor="middle" class="svg-node-text" font-size="11.5" font-weight="600">
                Regla clave de cátedra: SOLO los puntos con αᵢ > 0 (Vectores de Soporte) participan en w, b_prom y definen el margen óptimo.
              </text>
            </svg>
          `,
          notasClave: [
            "**Significado de $d(+)$ y $d(-)$:** Son la distancia ortogonal mínima desde el hiperplano central $H_0$ hasta el punto positivo más cercano ($H^+$) y negativo más cercano ($H^-$). Ambas miden $\\frac{1}{\\|\\mathbf{w}\\|}$, por lo que el margen total vale $M = \\frac{2}{\\|\\mathbf{w}\\|}$.",
            "**¿Por qué maximizar el margen equivale a minimizar $\\frac{1}{2}\\|\\mathbf{w}\\|^2$?** Porque $M = 2/\\|\\mathbf{w}\\|$ crece cuando $\\|\\mathbf{w}\\|$ decrece, y minimizar $\\frac{1}{2}\\mathbf{w}^T\\mathbf{w}$ convierte el problema en una optimización cuadrática convexa derivable."
          ]
        },
        {
          id: "PRAC-SVM-02",
          tema: "SVM",
          tipo: "algoritmo",
          titulo: "Variante A (80% Exámenes): Dados los α_i, hallar w, b_prom, Hiperplanos y Margen",
          etiquetaNaturaleza: "ENTRENAMIENTO PRÁCTICO · NO ES PREGUNTA DE PARCIAL",
          resumen: "Los 6 pasos exactos de la guía resuelta de cátedra (`guia_practica_svm.pdf` Págs. 4–9) para reconstruir el clasificador y validar soluciones.",
          pasos: [
            {
              nro: 1,
              titulo: "Identificar Vectores de Soporte (αi > 0) y verificar Σ αi·yi = 0",
              queHago: "Filtrás únicamente las filas con $\\alpha_i > 0$ (el resto son puntos interiores inactivos que **no entran** en ningún cálculo de $\\mathbf{w}$ ni de $b$). Como chequeo rápido KKT, verificás si $\\sum \\alpha_i y_i = 0$.",
              formula: "$$SV = \\{\\mathbf{x}_i : \\alpha_i > 0\\} \\qquad \\text{Control KKT: } \\sum_{i \\in SV} \\alpha_i y_i = 0$$",
              queEscriboEnHoja: "«Identifico como Vectores de Soporte únicamente los ejemplos con multiplicador $\\alpha_i > 0$ (descartando los de $\\alpha_i = 0$) y verifico la condición KKT $\\sum \\alpha_i y_i = 0$.»"
            },
            {
              nro: 2,
              titulo: "Calcular el Vector de Pesos w componente a componente",
              queHago: "Escribís primero la sumatoria simbólica y luego sumás los productos $\\alpha_i \\cdot y_i \\cdot \\mathbf{x}_i$ componente a componente ($w_1$ y $w_2$). Atención al signo de $y_i = -1$ combinado con coordenadas negativas.",
              formula: "$$\\mathbf{w} = \\sum_{i \\in SV} \\alpha_i \\, y_i \\, \\mathbf{x}_i$$",
              queEscriboEnHoja: "«Reconstruyo el vector de pesos $\\mathbf{w} = \\sum_{i \\in SV} \\alpha_i y_i \\mathbf{x}_i$, obteniendo $\\mathbf{w} = [w_1,\\; w_2]^T$.»"
            },
            {
              nro: 3,
              titulo: "Calcular b_i en CADA Vector de Soporte y promediar (b_prom)",
              queHago: "La cátedra escribe $b_i = \\frac{1}{y_i} - \\mathbf{w}^T \\mathbf{x}_i$ (que es idéntico a $y_i - \\mathbf{w}^T \\mathbf{x}_i$ porque $y_i \\in \\{+1, -1\\}$). Calculás **un $b_i$ por cada SV** ($\\alpha_i > 0$) y sacás el promedio $b_{\\text{prom}}$ (fundamental si los datos traen redondeo o pertenecen al Ej. 02).",
              formula: "$$b_i = y_i - \\mathbf{w}^T \\mathbf{x}_i \\qquad b_{\\text{prom}} = \\frac{1}{|SV|} \\sum_{i \\in SV} b_i$$",
              queEscriboEnHoja: "«Por la condición $y_i(\\mathbf{w}^T \\mathbf{x}_i + b) = 1$, calculo $b_i = y_i - \\mathbf{w}^T \\mathbf{x}_i$ para cada vector de soporte y tomo su promedio $b_{\\text{prom}} = \\frac{1}{|SV|} \\sum b_i$ para absorber posibles redondeos.»"
            },
            {
              nro: 4,
              titulo: "Escribir los Hiperplanos (H₀, H⁺, H⁻) y hallar cortes con los ejes",
              queHago: "Armás las 3 ecuaciones reemplazando $\\mathbf{w}$ y $b_{\\text{prom}}$: $H_0 (=0)$, $H^+ (=+1)$ y $H^- (=-1)$. En cada recta evaluás **si $x_1 = 0 \\implies x_2 = \\dots$** y **si $x_2 = 0 \\implies x_1 = \\dots$** para dibujar las 3 líneas paralelas con precisión.",
              formula: "$$H_0: w_1 x_1 + w_2 x_2 + b_{\\text{prom}} = 0 \\qquad H^{\\pm}: w_1 x_1 + w_2 x_2 + b_{\\text{prom}} = \\pm 1$$",
              queEscriboEnHoja: "«Defino el hiperplano separador $H_0$ y los márgenes canónicos $H^+, H^-$, calculando sus intersecciones con ambos ejes coordenados para el trazado gráfico.»"
            },
            {
              nro: 5,
              titulo: "Graficar puntos y validar si la solución es correcta (caso Guía Ej. 02)",
              queHago: "Dibujás todos los puntos (aunque tengan $\\alpha_i = 0$!). Si te preguntan si la solución obtenida es correcta, evaluás 3 cosas: (1) $\\sum \\alpha_i y_i = 0$, (2) los puntos con $\\alpha_i > 0$ caen sobre $H^+$ o $H^-$, y (3) ningún punto queda mal clasificado ni dentro del margen.",
              formula: "$$\\text{Clasificación nueva muestra: } \\hat{y}(\\mathbf{x}) = \\operatorname{sgn}(\\mathbf{w}^T \\mathbf{x} + b_{\\text{prom}})$$",
              queEscriboEnHoja: "«Al graficar el hiperplano, los márgenes y la totalidad de puntos de entrenamiento, verifico [que separa correctamente / que viola la separación o KKT porque el punto ... queda mal ubicado].»"
            },
            {
              nro: 6,
              titulo: "Calcular la Norma ||w|| y el Ancho Total del Margen M",
              queHago: "Calculás $\\|\\mathbf{w}\\| = \\sqrt{\\mathbf{w}^T \\mathbf{w}} = \\sqrt{w_1^2 + w_2^2}$ y dividís $2$ por ese valor para reportar el margen de maximización completo $M$.",
              formula: "$$\\|\\mathbf{w}\\| = \\sqrt{w_1^2 + w_2^2} \\qquad M = d(+) + d(-) = \\frac{2}{\\|\\mathbf{w}\\|}$$",
              queEscriboEnHoja: "«Calculo la norma euclídea $\\|\\mathbf{w}\\| = \\sqrt{w_1^2 + w_2^2}$ y el margen geométrico máximo entre hiperplanos paralelos $M = 2 / \\|\\mathbf{w}\\|$.»"
            }
          ]
        },
        {
          id: "PRAC-SVM-03",
          tema: "SVM",
          tipo: "algoritmo",
          titulo: "Variante B: Planteo del Lagrangiano Dual L_D, Matriz de Gram y Caso No Separable",
          etiquetaNaturaleza: "ENTRENAMIENTO PRÁCTICO · NO ES PREGUNTA DE PARCIAL",
          resumen: "Cómo armar paso a paso la función objetivo cuadrática L_D(α) y las restricciones KKT (Guía Ej. 01 y `Sem12-SVM`).",
          pasos: [
            {
              nro: 1,
              titulo: "Armar Matriz simétrica de Productos Internos (Gram) Kij = xiᵀ·xj",
              queHago: "Para no equivocarte signos en la doble sumatoria, primero armás la tabla de productos escalares $K_{ij} = x_{i1} x_{j1} + x_{i2} x_{j2}$ (como $K_{ij} = K_{ji}$, calculás solo la triangular superior y diagonal).",
              formula: "$$K_{ij} = \\langle \\mathbf{x}_i, \\mathbf{x}_j \\rangle = \\mathbf{x}_i^T \\mathbf{x}_j$$",
              queEscriboEnHoja: "«Construyo la matriz de productos escalares $K_{ij} = \\mathbf{x}_i^T \\mathbf{x}_j$ para todos los pares de ejemplos de entrenamiento.»"
            },
            {
              nro: 2,
              titulo: "Desarrollar la doble sumatoria ½ ΣΣ αi αj yi yj Kij con signo y factor 2",
              queHago: "En la diagonal ($i = j$), siempre vale $y_i^2 = +1$, quedando $\\frac{1}{2} K_{ii} \\alpha_i^2$. En los pares cruzados ($i < j$), como aparecen dos veces —$(i, j)$ y $(j, i)$— se cancela el $\\frac{1}{2}$ y queda **$y_i y_j K_{ij} \\alpha_i \\alpha_j$**. ¡Ojo al signo del producto $y_i y_j$!",
              formula: "$$\\frac{1}{2}\\sum_i\\sum_j \\alpha_i \\alpha_j y_i y_j K_{ij} = \\frac{1}{2}\\sum_{i} K_{ii}\\alpha_i^2 + \\sum_{i < j} (y_i y_j K_{ij}) \\alpha_i \\alpha_j$$",
              queEscriboEnHoja: "«Desarrollo el término cuadrático separando elementos diagonales ($y_i^2=1$) y términos cruzados duplicados por simetría, cuidando el signo de $y_i y_j$.»"
            },
            {
              nro: 3,
              titulo: "Escribir el Lagrangiano Dual L_D(α) a Maximizar",
              queHago: "Recordá el signo menos delante de toda la parte cuadrática: $\\max_{\\boldsymbol{\\alpha}} L_D(\\boldsymbol{\\alpha}) = \\sum \\alpha_i - \\frac{1}{2}\\sum\\sum \\dots$. Distribuí bien el signo negativo al abrir paréntesis.",
              formula: "$$\\max_{\\boldsymbol{\\alpha}} \\; L_D(\\boldsymbol{\\alpha}) = \\sum_{i=1}^N \\alpha_i - \\frac{1}{2} \\sum_{i=1}^N \\sum_{j=1}^N \\alpha_i \\alpha_j y_i y_j (\\mathbf{x}_i^T \\mathbf{x}_j)$$",
              queEscriboEnHoja: "«Planteo la función objetivo dual $L_D(\\boldsymbol{\\alpha})$ a maximizar en función exclusivamente de los multiplicadores de Lagrange $\\alpha_i$.»"
            },
            {
              nro: 4,
              titulo: "Detallar todas las Restricciones KKT (Separable vs. Margen Blando C)",
              queHago: "Escribís la igualdad $\\sum \\alpha_i y_i = 0$ explícita con $+1$ y $-1$ según la clase, y $\\alpha_i \\ge 0$ para todo $i$. Si el ejercicio menciona **margen blando / ruido / parámetro $C$**, la cota cambia a **$0 \\le \\alpha_i \\le C$**.",
              formula: "$$\\text{s.a. } \\sum_{i=1}^N \\alpha_i y_i = 0, \\qquad \\alpha_i \\ge 0 \\; (\\text{o } 0 \\le \\alpha_i \\le C \\text{ en margen blando})$$",
              queEscriboEnHoja: "«Establezco las restricciones KKT de igualdad $\\sum \\alpha_i y_i = 0$ y no negatividad $\\alpha_i \\ge 0$ (acotadas por $C$ en caso de margen blando).»"
            },
            {
              nro: 5,
              titulo: "Qué hacer si los datos NO son linealmente separables (Kernels y Holgura)",
              queHago: "Si los datos presentan ruido o no admiten recta separadora en $\\mathbb{R}^2$, la cátedra plantea dos recursos complementarios: (a) **Margen blando** introduciendo variables de holgura $\\xi_i \\ge 0$ penalizadas por $C\\sum \\xi_i$, o (b) **Función Kernel** $K(\\mathbf{x}_i, \\mathbf{x}_j) = \\langle \\Phi(\\mathbf{x}_i), \\Phi(\\mathbf{x}_j)\\rangle$ que mapea los datos a mayor dimensión donde sí son separables.",
              formula: "$$\\min \\frac{1}{2}\\|\\mathbf{w}\\|^2 + C\\sum_{i=1}^N \\xi_i \\qquad \\text{ó} \\qquad \\mathbf{x}_i^T \\mathbf{x}_j \\mapsto \\mathcal{K}(\\mathbf{x}_i, \\mathbf{x}_j) = \\Phi(\\mathbf{x}_i)^T\\Phi(\\mathbf{x}_j)$$",
              queEscriboEnHoja: "«Ante datos no linealmente separables se permiten holguras $\\xi_i \\ge 0$ penalizadas por $C$ ($0 \\le \\alpha_i \\le C$), o bien se sustituye el producto interno por una función Kernel $\\mathcal{K}(\\mathbf{x}_i, \\mathbf{x}_j)$ que proyecta a un espacio de mayor dimensión.»"
            }
          ]
        },
        {
          id: "PRAC-SVM-04",
          tema: "SVM",
          tipo: "plantilla",
          titulo: "Plantillas para Hoja en Blanco (Tabla de SVs/Sesgos + Cortes de Hiperplanos)",
          etiquetaNaturaleza: "ENTRENAMIENTO PRÁCTICO · NO ES PREGUNTA DE PARCIAL",
          resumen: "Formato exacto para resolver cualquier ejercicio tipo Guía 02 o Parcial 2023 en papel con cero errores de índice.",
          tablaPlantilla: {
            tituloTabla: "1) Tabla de Reconstrucción de w y b_prom (solo usar filas con α_i > 0)",
            columnas: [
              "Punto",
              "Vector $\\mathbf{x}_i = [x_1, x_2]$",
              "$y_i$",
              "$\\alpha_i$",
              "¿Es SV?",
              "Aporte a $\\mathbf{w}$: $\\alpha_i y_i \\mathbf{x}_i$",
              "$\\mathbf{w}^T \\mathbf{x}_i$",
              "$b_i = y_i - \\mathbf{w}^T \\mathbf{x}_i$"
            ],
            filas: [
              ["$p_1$", "$[x_{11}, x_{12}]$", "$+1$", "$\\alpha_1 > 0$", "**Sí**", "$\\alpha_1(+1)\\mathbf{x}_1$", "$w_1 x_{11}+w_2 x_{12}$", "$1 - \\mathbf{w}^T p_1$"],
              ["$p_2$", "$[x_{21}, x_{22}]$", "$-1$", "$\\alpha_2 > 0$", "**Sí**", "$\\alpha_2(-1)\\mathbf{x}_2$", "$w_1 x_{21}+w_2 x_{22}$", "$-1 - \\mathbf{w}^T p_2$"],
              ["$p_k$", "$[x_{k1}, x_{k2}]$", "$\\pm 1$", "$0$", "No (omitir)", "$[0, 0]$", "—", "**No promediar**"],
              ["**Totales**", "—", "—", "$\\sum \\alpha_i y_i = 0$", "$|SV|$ filas", "$\\mathbf{w} = [w_1, w_2]^T$", "—", "$b_{\\text{prom}} = \\frac{1}{|SV|}\\sum b_i$"]
            ]
          },
          tablaPlantilla2: {
            tituloTabla: "2) Cortes con los Ejes para Graficar las 3 Rectas en R²",
            columnas: [
              "Hiperplano",
              "Ecuación Cartesiana",
              "Corte eje $x_2$ ($x_1 = 0$)",
              "Corte eje $x_1$ ($x_2 = 0$)"
            ],
            filas: [
              ["**Separador $H_0$**", "$w_1 x_1 + w_2 x_2 + b_{\\text{prom}} = 0$", "$x_2 = -b_{\\text{prom}} / w_2$", "$x_1 = -b_{\\text{prom}} / w_1$"],
              ["**Margen $H^+$**", "$w_1 x_1 + w_2 x_2 + b_{\\text{prom}} = +1$", "$x_2 = (1 - b_{\\text{prom}}) / w_2$", "$x_1 = (1 - b_{\\text{prom}}) / w_1$"],
              ["**Margen $H^-$**", "$w_1 x_1 + w_2 x_2 + b_{\\text{prom}} = -1$", "$x_2 = (-1 - b_{\\text{prom}}) / w_2$", "$x_1 = (-1 - b_{\\text{prom}}) / w_1$"]
            ]
          },
          tipHoja: "💡 **Atajo al graficar en hoja:** Si un coeficiente ($w_1$ o $w_2$) da $0$, esa recta es horizontal o vertical ($x_k = \\text{cte}$). En caso general, calculá primero los dos cortes de $H_0$, unilos con regla, y trazá $H^+$ y $H^-$ paralelos usando sus propios cortes!"
        },
        {
          id: "PRAC-SVM-05",
          tema: "SVM",
          tipo: "formula",
          titulo: "Flashcard 1: Reconstrucción Primal (w, b_prom), Norma y Ancho del Margen M",
          etiquetaNaturaleza: "ENTRENAMIENTO PRÁCTICO · NO ES PREGUNTA DE PARCIAL",
          preguntaFrente: "Te dan los multiplicadores óptimos $\\alpha_i$. ¿Cómo calculás $\\mathbf{w}$, $b_{\\text{prom}}$, las distancias $d^+$ y $d^-$, el margen total $M$ y cómo clasificás un nuevo punto $\\mathbf{x}_{\\text{nuevo}}$?",
          respuestaDorso: "* **Vector de pesos $\\mathbf{w}$:**\n  $$\\mathbf{w} = \\sum_{i \\in SV} \\alpha_i y_i \\mathbf{x}_i \\quad (\\text{sólo con } \\alpha_i > 0)$$\n* **Sesgo individual y promedio:**\n  $$b_i = \\frac{1}{y_i} - \\mathbf{w}^T \\mathbf{x}_i = y_i - \\mathbf{w}^T \\mathbf{x}_i, \\qquad b_{\\text{prom}} = \\frac{1}{|SV|} \\sum_{i \\in SV} b_i$$\n* **Distancias y Margen Geométrico Total:**\n  $$\\|\\mathbf{w}\\| = \\sqrt{\\mathbf{w}^T \\mathbf{w}} = \\sqrt{\\sum_k w_k^2}, \\qquad d^+ = d^- = \\frac{1}{\\|\\mathbf{w}\\|}, \\qquad M = d^+ + d^- = \\frac{2}{\\|\\mathbf{w}\\|}$$\n* **Regla de clasificación:**\n  $$f(\\mathbf{x}_{\\text{nuevo}}) = \\mathbf{w}^T \\mathbf{x}_{\\text{nuevo}} + b_{\\text{prom}} \\implies \\text{Clase } +1 \\text{ si } f \\ge 0,\\; \\text{Clase } -1 \\text{ si } f < 0$$"
        },
        {
          id: "PRAC-SVM-06",
          tema: "SVM",
          tipo: "formula",
          titulo: "Flashcard 2: Formulación Dual L_D(α) y las 3 Condiciones KKT",
          etiquetaNaturaleza: "ENTRENAMIENTO PRÁCTICO · NO ES PREGUNTA DE PARCIAL",
          preguntaFrente: "Escribí de memoria el problema de optimización Dual Lagrangiano $L_D(\\boldsymbol{\\alpha})$ completo y las **3 condiciones de Karush-Kuhn-Tucker (KKT)** que exige la cátedra.",
          respuestaDorso: "**Función Objetivo Dual (a Maximizar):**\n$$L_D(\\boldsymbol{\\alpha}) = \\sum_{i=1}^N \\alpha_i - \\frac{1}{2} \\sum_{i=1}^N \\sum_{j=1}^N \\alpha_i \\alpha_j y_i y_j (\\mathbf{x}_i^T \\mathbf{x}_j)$$\n\n**Las 3 Condiciones KKT:**\n1. **Estacionariedad / Equilibrio de pesos:** $\\sum_{i=1}^N \\alpha_i y_i = 0$ *(y $\\mathbf{w} = \\sum \\alpha_i y_i \\mathbf{x}_i$)*. \n2. **Factibilidad dual (no negatividad):** $\\alpha_i \\ge 0 \\; \\forall i$ *(si es Margen Blando: $0 \\le \\alpha_i \\le C$)*. \n3. **Holgura complementaria:** $\\alpha_i \\cdot [y_i(\\mathbf{w}^T \\mathbf{x}_i + b) - 1] = 0 \\; \\forall i$ *(implica que si $\\alpha_i > 0$, el punto DEBE estar sobre $H^+$ o $H^-$).* "
        },
        {
          id: "PRAC-SVM-07",
          tema: "SVM",
          tipo: "formula",
          titulo: "Flashcard 3: Cómo evaluar si una solución propuesta (Guía Ej. 02) es válida o errónea",
          etiquetaNaturaleza: "ENTRENAMIENTO PRÁCTICO · NO ES PREGUNTA DE PARCIAL",
          preguntaFrente: "En el Ejercicio 02 de la Guía TP-SVM te dan una tabla con 7 puntos, clases y valores $\\alpha_i$, y te piden *«grafique y explique si la solución obtenida es correcta»*. ¿Qué verificás paso a paso?",
          respuestaDorso: "Seguís esta lista rápida de validación (como en `guia_practica_svm.pdf` Ej. 2.1 y 2.3):\n1. **Chequeo KKT algebraico inmediato:** Calculá $\\sum \\alpha_i y_i$. Si da distinto de $0$ (como en Ej. 2.1 donde $\\frac{1}{9} - \\frac{1}{3} + \\frac{5}{9} = \\frac{1}{3} \\ne 0$), **ya podés anticipar que es incorrecta** (aunque igual graficás $\\mathbf{w}, b_{\\text{prom}}, H_0, H^+, H^-$ si piden gráfico).\n2. **Chequeo de ubicación en $H_0, H^+, H^-$:** Verificá en el dibujo si los puntos con $\\alpha_i > 0$ caen sobre las líneas de margen ($y_i(\\mathbf{w}^T\\mathbf{x}_i + b) = 1$) y si la banda entre $H^+$ y $H^-$ queda libre.\n3. **Separación de clases:** Si un punto de clase $+1$ cae del lado negativo o viceversa (o puntos mezclados sin margen separable), la solución lineal hard-margin **no es válida**."
        },
        {
          id: "PRAC-SVM-08",
          tema: "SVM",
          tipo: "formula",
          titulo: "Flashcard 4: Caso No Linealmente Separable — Margen Blando (ξ_i, C) y Kernel Φ(x)",
          etiquetaNaturaleza: "ENTRENAMIENTO PRÁCTICO · NO ES PREGUNTA DE PARCIAL",
          preguntaFrente: "¿Qué cambia exactamente en la formulación primal y dual cuando los datos tienen ruido (Margen Blando), y qué hace conceptualmente una función Kernel $\\mathcal{K}$?",
          respuestaDorso: "* **1) Margen Blando (Soft Margin):**\n  * Se agregan **variables de holgura** $\\xi_i \\ge 0$ a cada restricción: $y_i(\\mathbf{w}^T\\mathbf{x}_i + b) \\ge 1 - \\xi_i$.\n  * El objetivo primal suma el castigo por error: $\\min \\frac{1}{2}\\|\\mathbf{w}\\|^2 + C \\sum \\xi_i$.\n  * **Dato de oro para examen (`Slide 28`):** ¡En el **Dual**, $\\xi_i$ desaparece por completo! La fórmula de $L_D(\\boldsymbol{\\alpha})$ es **idéntica**, solo cambia la cota a **$0 \\le \\alpha_i \\le C$**.\n  * $C$ alto penaliza errores fuertemente (margen estrecho, riesgo de overfitting); $C$ bajo tolera más errores (margen más ancho).\n* **2) Truco del Kernel:**\n  * Mapea los vectores $\\mathbf{x} \\mapsto \\Phi(\\mathbf{x})$ a un espacio de mayor dimensión donde las clases sí sean linealmente separables, calculando $\\mathcal{K}(\\mathbf{x}_i, \\mathbf{x}_j) = \\Phi(\\mathbf{x}_i)^T\\Phi(\\mathbf{x}_j)$ directamente en $L_D$ sin computar $\\Phi$ explícitamente."
        },
        {
          id: "PRAC-SVM-09",
          tema: "SVM",
          tipo: "trampa",
          titulo: "Las 6 Trampas Clásicas de Examen en Support Vector Machines (SVM)",
          etiquetaNaturaleza: "ENTRENAMIENTO PRÁCTICO · NO ES PREGUNTA DE PARCIAL",
          resumen: "Errores habituales de cálculo y signo al resolver SVM en hoja.",
          trampas: [
            "**Usar solo un $b_i$ sin promediar todos los Vectores de Soporte:** Cuando los $\\alpha_i$ vienen redondeados o son de prueba (`Ej. 02` o `Parcial 2023`), $b_1, b_2, b_3$ dan distintos. La cátedra exige promediar sobre todos los SVs: $b_{\\text{prom}} = \\frac{1}{|SV|}\\sum b_i$.",
            "**Incluir puntos con $\\alpha_i = 0$ en el cálculo de $b_{\\text{prom}}$:** JAMÁS. Un punto con $\\alpha_i = 0$ está fuera del margen (`y_i(wᵀx_i + b) > 1`), NO cumple la igualdad $y_i(\\mathbf{w}^T\\mathbf{x}_i + b) = 1$, y arruinaría $b_{\\text{prom}}$.",
            "**Poner $+1$ en vez de $y_i$ al despejar $b_i$:** Es $b_i = y_i - \\mathbf{w}^T \\mathbf{x}_i$. Si el vector de soporte es de clase negativa ($y_i = -1$), arrancás con **$-1 - \\mathbf{w}^T \\mathbf{x}_i$**, ¡nunca $1 - \\mathbf{w}^T \\mathbf{x}_i$!",
            "**Confundir el ancho del margen $M$ con $d^+$:** La distancia del hiperplano central $H_0$ a un margen es $d^+ = \\frac{1}{\\|\\mathbf{w}\\|}$, pero el **margen total entre $H^+$ y $H^-$** es el doble: **$M = \\frac{2}{\\|\\mathbf{w}\\|}$**.",
            "**Comerse el factor $2$ o errar el signo $y_i y_j$ en el Dual $L_D$:** Al expandir $\\frac{1}{2}\\sum_i\\sum_j$, cada par distinto $(i, j)$ aparece dos veces (`2 · 1/2 = 1`). Además, si $y_1 = +1$, $y_3 = -1$ y $K_{13} = -12$, entonces $-y_1 y_3 K_{13} = -(+1)(-1)(-12) = -12$, pero en $L_D = \\dots - Q$ cambia el signo de nuevo! Escribí primero $Q$ completo y después restalo.",
            "**Olvidar que $\\|\\mathbf{w}\\|$ lleva raíz cuadrada:** La norma euclídea es $\\|\\mathbf{w}\\| = \\sqrt{w_1^2 + w_2^2}$, mientras que $\\mathbf{w}^T \\mathbf{w} = \\|\\mathbf{w}\\|^2$. Al dividir $M = 2 / \\|\\mathbf{w}\\|$, aplicá siempre la raíz cuadrada."
          ]
        }
      ]
    },

    // =========================================================================
    // TEMA 5: REDES DE HOPFIELD (MEMORIA AUTOASOCIATIVA)
    // =========================================================================
    {
      id: "HOPFIELD",
      nombre: "Redes de Hopfield",
      badge: "Memoria Autoasociativa · Matriz W y Convergencia",
      icono: "🧲",
      ponderacion: "Cálculo matricial mecánico (sin errores de signo) + análisis de capacidad/ortogonalidad",
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
              queHago: "Traduzco cada figura o ficha de variables a un vector fila $E_k$ de tamaño $N$ usando $+1$ (negro / verdadero) y $-1$ (blanco / falso). Si un patrón de consulta $E_d$ omite variables (ej. problema meteorológico donde solo informan $VN$ y $TE$), coloco $0$ en las posiciones desconocidas.",
              formula: "$$E_k = [e_1^{(k)}, e_2^{(k)}, \\dots, e_N^{(k)}] \\in \\{-1, +1\\}^N$$",
              queEscriboEnHoja: "Paso 1 — Codificación bipolar (negro/v = +1, blanco/f = -1): E_1 = [...], E_2 = [...], patrón de consulta E_d = [...]."
            },
            {
              nro: 2,
              titulo: "Calcular cada matriz individual sin autorrecurrencias",
              queHago: "Para cada patrón $E_k$, armo el producto exterior $E_k^T \\cdot E_k$ (matriz $N \\times N$ donde la celda $(i,j)$ vale $e_i^{(k)} \\cdot e_j^{(k)}$) y le resto la matriz identidad $I$ (dejando $0$ en toda la diagonal principal).",
              formula: "$$W_k = E_k^T \\cdot E_k - I \\qquad (w_{ii}^{(k)} = 0)$$",
              queEscriboEnHoja: "Paso 2 — Aprendizaje individual: Escribo las tablas de producto exterior E_1^T E_1 - I y E_2^T E_2 - I poniendo explícitamente ceros en la diagonal."
            },
            {
              nro: 3,
              titulo: "Sumar las matrices para obtener W",
              queHago: "Sumo componente a componente las $M$ matrices individuales $W_k$. Verifico visualmente que la matriz resultante $W$ tenga ceros en la diagonal y sea simétrica respecto a ella.",
              formula: "$$W = \\sum_{k=1}^{M} \\left(E_k^T \\cdot E_k - I\\right)$$",
              queEscriboEnHoja: "Paso 3 — Matriz de pesos total: W = W_1 + ... + W_M = [...]. Verificación: diagonal = 0 y w_ij = w_ji."
            },
            {
              nro: 4,
              titulo: "Presentar E_d e iterar el cálculo sincrónico",
              queHago: "Inicio con $S(0) = E_d$. Calculo $net = S(t) \\cdot W$ multiplicando el vector fila por cada columna de $W$ (como $W$ es simétrica, fila o columna da idéntico producto). Luego aplico la función escalón $f(net_i)$: positivo $\\to +1$, negativo $\\to -1$, y **si $net_i = 0$ copio el valor anterior $s_i(t)$**.",
              formula: "$$net(t) = S(t)\\cdot W, \\qquad s_i(t+1) = \\begin{cases} +1 & net_i > 0 \\\\ s_i(t) & net_i = 0 \\\\ -1 & net_i < 0 \\end{cases}$$",
              queEscriboEnHoja: "Iteración 1: S(0).W = [net_1 ... net_N] -> S(1) = f(net) = [...]. (Aclaro al margen: como net_j = 0, conserva s_j(0))."
            },
            {
              nro: 5,
              titulo: "Evaluar convergencia, ciclo límite o patrón espurio",
              queHago: "Comparo $S(t+1)$ con todos los estados anteriores. Si $S(t+1) = S(t)$ la red **se estabiliza**; si vuelvo a un estado de hace $n > 1$ pasos ($S(t) = S(t+n)$) entra en **oscilación (no estabiliza)**. Si estabilizó, verifico si coincide con algún $E_k$ aprendido o con un **atractor inverso / espurio** ($-E_k$).",
              formula: "$$S(t+1) = S(t) \\implies \\text{Converge} \\quad | \\quad S(t+n) = S(t)\\;(n>1) \\implies \\text{No estabiliza}$$",
              queEscriboEnHoja: "Iteración 2: S(1).W = [...] -> S(2) = [...]. Como S(2) = S(1), la red se estabiliza y recupera el patrón E_k (o el patrón inverso -E_k)."
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
              queHago: "Con $N$ neuronas y $M$ patrones almacenados, calculo los dos umbrales: recuperación suficientemente buena ($0{,}138\\,N$) y recuperación perfecta ($N / (4\\ln N)$). Comparo $M$ contra ambos límites.",
              formula: "$$M_{\\text{buena}} \\approx 0{,}138\\,N \\qquad M_{\\text{perfecta}} \\le \\frac{N}{4\\,\\ln(N)}$$",
              queEscriboEnHoja: "Con N neuronas: Buena <= 0,138*N = ...; Perfecta <= N / (4*ln(N)) = .... Como almacenamos M = ... patrones (> límite), no se garantiza teóricamente la recuperación sin interferencia."
            },
            {
              nro: 2,
              titulo: "Verificar condición de ortogonalidad entre cada par (k, m)",
              queHago: "Calculo el producto escalar entre cada par distinto de patrones $E_k$ y $E_m$. En esta cátedra se exige que los patrones difieran en al menos $50\\%$ de sus componentes, lo que equivale a suma $\\le 0$.",
              formula: "$$\\sum_{i=1}^{N} e_i^{(k)}\\,e_i^{(m)} \\le 0 \\quad (\\forall\\,k \\neq m)$$",
              queEscriboEnHoja: "Producto escalar E_1 . E_2 = (...). Como da <= 0 (diferencia >= 50%), cumplen la condición de ortogonalidad de la cátedra."
            },
            {
              nro: 3,
              titulo: "Auditar una matriz W dada (Ejercicio tipo 04)",
              queHago: "Cuando el enunciado da $E_1, E_2$ y matrices $W_1, W_2, W$ precalculadas pidiendo encontrar errores: 1) chequeo diagonal de $W_1, W_2, W$ (deben ser $0$); 2) chequeo simetría; 3) recalculo fila a fila $e_i e_j$ donde sospecho error y verifico la suma $W = W_1 + W_2$; 4) recién con la $W$ **corregida** pruebo $E_d$.",
              formula: "$$w_{ij} \\stackrel{?}{=} \\sum_{k=1}^{M} e_i^{(k)} e_j^{(k)} \\quad (i \\neq j), \\qquad w_{ii} \\stackrel{?}{=} 0$$",
              queEscriboEnHoja: "Errores detectados: en W_1 posición (fila, col) figura X en lugar de Y (porque e_i*e_j = ...); además no se restó la identidad en (...). Con W corregida presento E_d..."
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
    // TEMA 6: MAPAS AUTO-ORGANIZADOS DE KOHONEN (SOM)
    // =========================================================================
    {
      id: "SOM",
      nombre: "Mapas Auto-organizados (SOM)",
      badge: "Aprendizaje Competitivo Online · Vecindad y BMU",
      icono: "🗺️",
      ponderacion: "25% típico del parcial · Alta sensibilidad a persistencia W(t) y función de vecindad",
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
              queHago: "Identifico la dimensión $D$ de entrada, la cantidad $M$ de neuronas de salida y copio la tabla de pesos iniciales $W_1(0), \\dots, W_M(0)$. Anoto la tasa de aprendizaje $\\alpha$ (si la guía TP no la aclara, en TP 01 suele indicarse $\\alpha = 0{,}5$) y si la vecindad $h$ es **nula** o **continua**.",
              formula: "$$W_j(0) = [w_{j1}(0),\\; w_{j2}(0),\\; \\dots,\\; w_{jD}(0)], \\qquad \\alpha \\in (0, 1]$$",
              queEscriboEnHoja: "Datos iniciales: D = ... entradas, M = ... neuronas de salida, α = ..., vecindad h = ... . Pesos iniciales W_1(0) = [...], W_2(0) = [...]."
            },
            {
              nro: 2,
              titulo: "Presentar el patrón p con los pesos vigentes W(t)",
              queHago: "Tomo el vector de entrada $\\mathbf{x} = E_k$ indicado por el enunciado. Si estoy en una secuencia de varios patrones ($p_1$, luego $p_2$, luego $p_3$...), **uso obligatoriamente la matriz de pesos recién actualizada** $W(t)$, nunca los iniciales $W(0)$.",
              formula: "$$\\mathbf{x}(t) = [x_1,\\; x_2,\\; \\dots,\\; x_D], \\qquad \\text{comparar contra } W_j(t)$$",
              queEscriboEnHoja: "Iteración t — Presento el patrón p = [...] utilizando los pesos actuales W(t) = ..."
            },
            {
              nro: 3,
              titulo: "Fase de Competencia: distancias euclídeas y ganadora (BMU)",
              queHago: "Calculo explícitamente la distancia euclídea (con raíz cuadrada escrita) entre $\\mathbf{x}$ y cada vector de pesos $W_j(t)$. La neurona con la **menor distancia** es la ganadora $j^*$ (Best Matching Unit).",
              formula: "$$d_j = \\sqrt{\\sum_{i=1}^{D} (x_i - w_{ji}(t))^2} \\qquad\\Longrightarrow\\qquad j^* = \\arg\\min_j\\, d_j$$",
              queEscriboEnHoja: "Competencia: d(p, W_1) = √(...) = ...; d(p, W_2) = √(...) = ... . Como d_k es mínima, la neurona ganadora (BMU) es j* = k."
            },
            {
              nro: 4,
              titulo: "Fase de Cooperación: evaluar factor de vecindad h(i, j*)",
              queHago: "- **Si vecindad es nula:** $h(j^*, j^*) = 1$ y $h(i, j^*) = 0$ para todas las demás neuronas.\n- **Si vecindad es continua** (ej. $\\frac{1}{1 + \\text{dist}(W_i, W_{j^*})}$ o $\\frac{1}{2 + \\text{dist}(W_i, W_{j^*})}$): evalúo $h$ tanto para $j^*$ (donde $\\text{dist}(W_{j^*}, W_{j^*}) = 0$) como para cada neurona vecina usando los pesos $W(t)$ **previos a actualizar**.",
              formula: "$$h(i, j^*) = \\begin{cases} 1 \\text{ si } i=j^*,\\; 0 \\text{ si } i\\neq j^* & \\text{(vecindad nula)} \\\\ \\dfrac{1}{c + \\sqrt{\\sum_k (w_{ik}(t) - w_{j^* k}(t))^2}} & \\text{(vecindad continua, } c\\in\\{1,2\\}\\text{)} \\end{cases}$$",
              queEscriboEnHoja: "Cooperación: Para la ganadora dist = 0 -> h(j*) = ...; para la vecina dist(W_i, W_j*) = √(...) -> h(i) = 1/(c + dist) = ..."
            },
            {
              nro: 5,
              titulo: "Fase de Adaptación: actualizar todas las neuronas con h > 0",
              queHago: "Aplico la regla de Kohonen componente a componente sobre todas las neuronas con $h(i, j^*) > 0$. Verifico que cada componente nueva haya quedado ubicada entre el peso anterior y el patrón $\\mathbf{x}$, y guardo $W(t+1)$ para la siguiente iteración o gráfica.",
              formula: "$$w_{ji}(t+1) = w_{ji}(t) + \\alpha \\cdot h(j, j^*) \\cdot \\big(x_i - w_{ji}(t)\\big)$$",
              queEscriboEnHoja: "Adaptación: w_ji(t+1) = w_ji(t) + α·h·(x_i - w_ji(t)) = ... . Nuevo vector W(t+1) = [...]. (Si hay siguiente patrón, repito desde el Paso 2 con estos nuevos pesos)."
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
              queHago: "Cuando piden *'Suponga que cada $W_i$ corresponde a la clase $C_i$; determine con los pesos actualizados a qué clase pertenecen los ejemplos'*, tomo el último vector de pesos actualizado $W_i(\\text{final})$, calculo la distancia euclídea del ejemplo de prueba $\\mathbf{x}_{\\text{test}}$ a cada $W_i(\\text{final})$, y asigno la clase de la neurona de **menor distancia**. ¡En clasificación NO se modifican pesos!",
              formula: "$$\\text{Clase}(\\mathbf{x}_{\\text{test}}) = C_{j^*}, \\qquad j^* = \\arg\\min_j \\|\\mathbf{x}_{\\text{test}} - W_j(\\text{final})\\|_2$$",
              queEscriboEnHoja: "Clasificación Ejemplo k: d(x_test, W_1(final)) = ...; d(x_test, W_2(final)) = ... . Mínima en W_m -> pertenece a la Clase C_m (sin modificar pesos)."
            },
            {
              nro: 2,
              titulo: "Graficar la arquitectura final con pesos etiquetados",
              queHago: "Dibujo abajo (o a la izquierda) los $D$ nodos de entrada $x_1, \\dots, x_D$ (SIN neurona bias $x_0$), arriba (o a la derecha) los $M$ nodos de salida $W_1, \\dots, W_M$, trazo flechas de cada entrada hacia todas las salidas y escribo sobre cada flecha el valor final $w_{ji}$.",
              formula: "$$\\text{Entrada } x_i \\xrightarrow{\\;w_{ji}\\;} \\text{Salida } W_j \\qquad (D \\times M \\text{ conexiones totales})$$",
              queEscriboEnHoja: "Arquitectura de la Red: esquema con D nodos de entrada conectando hacia M neuronas competitivas de salida, rotulando cada flecha con w_ji final."
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
    }
  ]
};
