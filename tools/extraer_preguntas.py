# -*- coding: utf-8 -*-
"""
Script maestro de extracción, curación y validación del banco de preguntas
para el Simulador Quiz del 2do Parcial de Inteligencia Artificial (UTN FRRe).
"""
import os, sys, re, json

sys.stdout.reconfigure(encoding='utf-8')

REPO_ROOT = r"C:\dev\ia-segundo-parcial-utn-frre"
MC_FILE = os.path.join(REPO_ROOT, "BANCO_TEORIA_Y_MC", "multiple_choice_con_claves.md")
CONSOLIDADO_FILE = os.path.join(REPO_ROOT, "BANCO_TEORIA_Y_MC", "BANCO_TEORICO_Y_TIPS_CONSOLIDADO_TOTAL.md")
OUT_JS = os.path.join(REPO_ROOT, "docs", "data", "preguntas.js")
OUT_JSON = os.path.join(REPO_ROOT, "preguntas_quiz.json")

def normalizar_latex(texto):
    if not texto:
        return ""
    # Reemplazar normas |w| por \|w\|
    texto = re.sub(r'\|([a-zA-Z\\]+)\|', r'\\|\1\\|', texto)
    # Evitar dobles barras accidentales
    texto = re.sub(r'\\\\(frac|alpha|beta|sigma|mathbf|sum|prod|in|ne|le|ge|cdot|vert|mid|lambda)', r'\\\1', texto)
    return texto.strip()

def detectar_tema(titulo, consigna):
    raw = (titulo + " " + consigna).lower()
    text = re.sub(r'[\$\*\_]', '', raw)
    
    if any(k in text for k in ['genétic', 'genetic', 'ruleta', 'cruza', 'cruce', 'mutación', 'mutacion', 'cromosoma', 'alelo', 'fitness', 'aptitud']):
        return 'ALGORITMOS_GENETICOS'
    if any(k in text for k in ['support vector', 'svm', 'hiperplano', 'lagrange', 'kkt', 'margen óptimo', 'margen optimo', 'vectores de soporte']):
        return 'SVM'
    if bool(re.search(r'\b(som|kohonen)\b', text)) or any(k in text for k in ['auto-organizado', 'autoorganizado', 'bmu', 'mapas autoorganizados', 'mapas auto-organizados']):
        return 'SOM'
    if any(k in text for k in ['multicapa', 'mlp', 'backpropagation', 'retropropagación', 'retropropagacion', 'momento', 'early stopping']):
        return 'MLP'
    if any(k in text for k in ['hopfield', 'hebb', 'ortogonalidad', 'atractor', 'memoria asociativa']):
        return 'HOPFIELD'
    if any(k in text for k in ['k-means', 'kmeans', 'disk k-means', 'disk kmeans', 'semillas']):
        return 'KMEANS'
    if any(k in text for k in ['knn', 'k-nn', 'vecinos más cercanos', 'vecinos mas cercanos', 'leave-one-out']):
        return 'KNN'
    if any(k in text for k in ['bayes', 'probabilidad', 'prior', 'posterior', 'verosimilitud', 'independencia condicional']):
        return 'NAIVE_BAYES'
    if any(k in text for k in ['clustering', 'dendrograma', 'single-link', 'complete-link', 'average-link', 'enlace']):
        return 'CLUSTERING'
    if any(k in text for k in ['búsqueda', 'busqueda', 'a*', 'dfs', 'bfs', 'pop', 'orden parcial', 'árbol de decisión', 'arbol de decision', 'apriori', 'reglas de asociación', 'reglas de asociacion']):
        return 'P1_REPASO'
    return 'GENERAL_IA'

preguntas = []
seen_hashes = set()

def make_hash(s):
    norm = re.sub(r'\W+', '', s.lower())[:40]
    return norm

# -------------------------------------------------------------
# FASE 1: 14 Preguntas Canónicas de multiple_choice_con_claves.md
# -------------------------------------------------------------
with open(MC_FILE, 'r', encoding='utf-8') as f:
    content_mc = f.read()

blocks = re.split(r'\n## Pregunta MC\s+', content_mc)[1:]
for idx, b in enumerate(blocks, 1):
    first_line = b.split('\n')[0].strip()
    m_title = re.match(r'(\d+)\s*—\s*(.*)', first_line)
    num = m_title.group(1) if m_title else f"{idx:02d}"
    title = m_title.group(2).strip() if m_title else first_line

    consigna_m = re.search(r'\*\*(?:Consigna|Enunciado):\*\*\s*(.*?)(?=\n\s*-\s*\[|\n\* \*\*|$)', b, re.DOTALL)
    consigna = consigna_m.group(1).strip() if consigna_m else ""

    opts = []
    correct_indices = []
    opt_matches = list(re.finditer(r'-\s*\[([ xX])\]\s*(.*?)(?=\n\s*-\s*\[|\n\* \*\*|\n---|$)', b, re.DOTALL))
    for o_idx, om in enumerate(opt_matches):
        is_checked = om.group(1).lower() == 'x'
        raw_text = om.group(2).strip()
        clean_text = re.sub(r'<span[^>]*>.*?</span>', '', raw_text).strip()
        clean_text = re.sub(r'\[CLAVE CORRECTA[^\]]*\]', '', clean_text).strip()
        clean_text = clean_text.strip('*').strip()
        opts.append(normalizar_latex(clean_text))
        if is_checked:
            correct_indices.append(o_idx)

    just_m = re.search(r'\*\*(?:Justificación Oficial de Cátedra|Justificación):\*\*\s*(.*?)(?=\n---|\Z)', b, re.DOTALL)
    just = just_m.group(1).strip() if just_m else ""

    h = make_hash(consigna or title)
    seen_hashes.add(h)

    tema = detectar_tema(title, consigna)
    preguntas.append({
        'id': f"MC-OFICIAL-{num}",
        'tema': tema,
        'titulo': title,
        'enunciado': normalizar_latex(consigna),
        'opciones': opts,
        'correctas': correct_indices,
        'explicacion': normalizar_latex(just),
        'es_oficial': True,
        'es_p1': False,
        'fuente': 'Examen Teórico Oficial UTN FRRe (Validado en Tinta Roja)'
    })

print(f"Fase 1 cargada: {len(preguntas)} preguntas oficiales.")

# -------------------------------------------------------------
# FASE 2: Preguntas de PARTE IV de BANCO_TEORICO_Y_TIPS_CONSOLIDADO_TOTAL.md
# -------------------------------------------------------------
with open(CONSOLIDADO_FILE, 'r', encoding='utf-8') as f:
    content_total = f.read()

pos4 = content_total.find('# PARTE IV:')
pos5 = content_total.find('# PARTE V:')
p4 = content_total[pos4:pos5] if pos5 != -1 else content_total[pos4:]
q_blocks = re.split(r'\n### Pregunta\s+', p4)[1:]

for idx, b in enumerate(q_blocks, 1):
    first_line = b.split('\n')[0].strip()
    m_t = re.match(r'(\d+):\s*(.*)', first_line)
    num = m_t.group(1) if m_t else f"{idx:02d}"
    title = m_t.group(2).strip() if m_t else first_line
    is_p1 = ('[TEMA_P1_RENDIDO]' in title or '[TEMA_P1_RENDIDO]' in b)

    # Enunciado
    enun_m = re.search(r'\*\*(?:Enunciado|Enunciado y Opciones|Enunciado Oficial):\*\*\s*(.*?)(?=\n\s*-\s*[a-zA-Z0-9]\)|\n\s*\d+\.|\n\*\s*\*\*|\Z)', b, re.DOTALL)
    enun = enun_m.group(1).strip() if enun_m else title

    h = make_hash(enun or title)
    if h in seen_hashes:
        continue

    opts = []
    correct_indices = []

    # Variante True/False numerada (P38-P51)
    vf_matches = list(re.finditer(r'(\d+)\.\s*(.*?)\s*\*\*\([vV]\s*/\s*[fF]\)\*\*', b))
    if vf_matches:
        eval_sec = re.search(r'\*\*(?:Evaluación y Justificación Doctrinal|Evaluación|Justificación).*?:\*\*\s*(.*?)(?=\n---|\Z)', b, re.DOTALL)
        eval_txt = eval_sec.group(1) if eval_sec else ""
        for o_idx, vm in enumerate(vf_matches):
            o_num = vm.group(1)
            o_txt = vm.group(2).strip()
            # Chequear si es VERDADERO o CORRECTO
            is_true = bool(re.search(rf'{o_num}\.\s*\*\*(?:VERDADERO|CORRECTO)', eval_txt, re.I))
            opts.append(normalizar_latex(o_txt))
            if is_true:
                correct_indices.append(o_idx)

        # Si todas fueron FALSAS (caso de single-link, complete-link, average-link vs centroides)
        if len(correct_indices) == 0 and len(opts) > 0:
            opts.append("Ninguna de las anteriores es correcta (todas las afirmaciones son falsas según la doctrina oficial).")
            correct_indices.append(len(opts) - 1)

    # Variante letras con -> CORRECTO
    if not opts:
        letter_matches = list(re.finditer(r'-\s*([a-zA-Z0-9]+)\)\s*(.*?)(?=\n\s*-\s*[a-zA-Z0-9]+\)|\n\*\s*\*\*|\n---|\Z)', b, re.DOTALL))
        if letter_matches:
            # Check si hay **Opción Oficial Correcta:**
            opc_of_m = re.search(r'\*\*(?:Opción Oficial Correcta|Respuesta Oficial):\*\*\s*(.*?)(?=\n|\Z)', b)
            opc_text = opc_of_m.group(1) if opc_of_m else ""
            
            for o_idx, lm in enumerate(letter_matches):
                l_char = lm.group(1).lower()
                l_txt = lm.group(2).strip()
                if not l_txt:
                    continue
                is_corr = bool(re.search(r'(?:\$\s*\\to\s*\$|\\to|->)\s*\*\*(?:CORRECTO|CORRECTA|VERDADERO)', l_txt, re.I))
                if not is_corr and opc_text:
                    if f"{l_char})" in opc_text.lower():
                        is_corr = True
                clean_opt = re.sub(r'(?:\$\s*\\to\s*\$|\\to|->)\s*\*\*.*?\*\*', '', l_txt).strip()
                clean_opt = clean_opt.strip('.').strip()
                if clean_opt:
                    current_idx = len(opts)
                    opts.append(normalizar_latex(clean_opt))
                    if is_corr:
                        correct_indices.append(current_idx)

    # Justificación
    just_m = re.search(r'\*\*(?:Justificación Canónica de la Cátedra|Evaluación y Justificación Doctrinal de la Cátedra|Justificación):\*\*\s*(.*?)(?=\n---|\Z)', b, re.DOTALL)
    just = just_m.group(1).strip() if just_m else ""

    if opts and len(correct_indices) >= 1:
        seen_hashes.add(h)
        tema = 'P1_REPASO' if is_p1 else detectar_tema(title, enun)
        preguntas.append({
            'id': f"MC-CONSOL-{num}",
            'tema': tema,
            'titulo': title.replace('`[TEMA_P1_RENDIDO]`', '').strip(),
            'enunciado': normalizar_latex(enun),
            'opciones': opts,
            'correctas': correct_indices,
            'explicacion': normalizar_latex(just),
            'es_oficial': True,
            'es_p1': is_p1,
            'fuente': 'Compendio Doctrinal y Exámenes Reales UTN FRRe'
        })

print(f"Total acumulado tras Fase 2: {len(preguntas)} preguntas.")

# -------------------------------------------------------------
# FASE 3: BANCO DE PREGUNTAS CLAVE DE ALGORITMOS GENÉTICOS,
# NAÏVE BAYES, MLP Y HOPFIELD (Curadas con Rigor Doctrinal de Cátedra)
# -------------------------------------------------------------
preguntas_adicionales = [
    # ALGORITMOS GENÉTICOS
    {
        'id': 'MC-AG-01',
        'tema': 'ALGORITMOS_GENETICOS',
        'titulo': 'Algoritmos Genéticos: Selección Proporcional por Ruleta Acumulada',
        'enunciado': 'En el método de Selección por Ruleta tradicional en Algoritmos Genéticos, ¿cuáles de las siguientes proposiciones son verdaderas según la doctrina de la Cátedra?',
        'opciones': [
            'A cada individuo se le asigna un sector de ruleta proporcional a su aptitud relativa $p_i = f_i / \\sum f_k$.',
            'Se generan intervalos cerrados acumulados normalizados (por ejemplo en el rango de ranuras 00 a 99) para indexar con números aleatorios.',
            'El método de Ruleta simple previene matemáticamente el estancamiento en óptimos locales frente a un súper-individuo dominante.',
            'Si un individuo tiene aptitud el doble de la media, la probabilidad de que su ranura sea seleccionada es exactamente el doble que la de un individuo con aptitud media.'
        ],
        'correctas': [0, 1, 3],
        'explicacion': 'Las opciones 1, 2 y 4 son verdaderas. La opción 3 es falsa: la ruleta simple es vulnerable al fenómeno del superindividuo que monopoliza la probabilidad y causa convergencia prematura.',
        'es_oficial': True,
        'es_p1': False,
        'fuente': 'Guía Práctica Nº 6 y Segundo Parcial 19/11/2025 (Punto 4 al 30%)'
    },
    {
        'id': 'MC-AG-02',
        'tema': 'ALGORITMOS_GENETICOS',
        'titulo': 'Algoritmos Genéticos: Control de Copias Esperadas (Expected Value Selection)',
        'enunciado': 'En la Selección con Control de Copias Esperadas (utilizada en el examen presencial del 19/11/2025), respecto a la asignación de réplicas de cada individuo:',
        'opciones': [
            'El número esperado de copias se calcula como $c_i = f_i / \\bar{f}$, donde $\\bar{f}$ es la aptitud media de la población.',
            'La parte entera $\\lfloor c_i \\rfloor$ garantiza copias determinísticas directas en la población de apareamiento.',
            'Las vacantes restantes se sortean utilizando la parte decimal o fraccionaria de $c_i$ (o mediante umbral al 50%).',
            'Todos los individuos con $c_i < 1.0$ son eliminados automáticamente sin ninguna chance de pasar a la siguiente generación.'
        ],
        'correctas': [0, 1, 2],
        'explicacion': 'La opción 4 es falsa: los individuos con $c_i < 1.0$ tienen parte entera 0 pero conservan su parte decimal (ej. $0.65$), la cual compite estocásticamente para las plazas remanentes.',
        'es_oficial': True,
        'es_p1': False,
        'fuente': 'Segundo Parcial Presencial Oficial (19/11/2025, Punto 4 al 30%)'
    },
    {
        'id': 'MC-AG-03',
        'tema': 'ALGORITMOS_GENETICOS',
        'titulo': 'Algoritmos Genéticos: Operadores de Cruce (Recombinación)',
        'enunciado': 'Sobre los operadores de cruce en representaciones cromosómicas binarias:',
        'opciones': [
            'El cruce en 1 punto divide ambos cromosomas en la posición $k$ e intercambia sus colas derechas.',
            'El cruce multipunto en 2 puntos divide el cromosoma en 3 segmentos e intercambia el segmento central.',
            'El cruce binomial o uniforme evalúa bit a bit una máscara probabilística independiente para decidir de qué padre proviene cada alelo.',
            'El operador de cruce siempre se aplica con probabilidad $P_c = 1.0$ sobre todos los individuos de la población.'
        ],
        'correctas': [0, 1, 2],
        'explicacion': 'La opción 4 es falsa: el cruce se rige por una tasa de probabilidad $P_c$ (típicamente entre 0.6 y 0.9). Si el par de padres no cruza, ambos pasan intactos a la fase de mutación.',
        'es_oficial': True,
        'es_p1': False,
        'fuente': 'Guía Práctica Nº 6 y Cuaderno de Cátedra UTN FRRe'
    },
    {
        'id': 'MC-AG-04',
        'tema': 'ALGORITMOS_GENETICOS',
        'titulo': 'Algoritmos Genéticos: Mutación Adaptativa por Temperatura (Simulated Annealing)',
        'enunciado': 'En la Cátedra de IA, el mecanismo de mutación adaptativa por temperatura:',
        'opciones': [
            'En régimen descendente ($P_{mut} = P_{max} - \\lambda(t)$), promueve alta exploración global inicial y afinamiento local final.',
            'En régimen ascendente ($P_{mut} = P_{min} + \\lambda(t)$), incrementa la probabilidad de mutación para escapar de óptimos locales ante la homogeneización de la población.',
            'La probabilidad de mutación jamás debe modificarse durante la corrida del algoritmo para garantizar la convergencia asintótica.',
            'Permite dinamizar la diversidad genética en función de la madurez o estancamiento poblacional.'
        ],
        'correctas': [0, 1, 3],
        'explicacion': 'La opción 3 es falsa: la mutación adaptativa se basa precisamente en variar $P_{mut}$ dinámicamente.',
        'es_oficial': True,
        'es_p1': False,
        'fuente': 'Exámenes Presenciales 2023 y Guía Maestra de Cátedra'
    },
    {
        'id': 'MC-AG-05',
        'tema': 'ALGORITMOS_GENETICOS',
        'titulo': 'Algoritmos Genéticos: Selección por Ranking Lineal frente a Superindividuos',
        'enunciado': '¿Por qué la Cátedra recomienda la Selección por Ranking Lineal para mitigar la convergencia prematura?',
        'opciones': [
            'Porque asigna probabilidades de selección en función de la posición ordinal (orden) y no de la magnitud absoluta de la aptitud.',
            'Porque un superindividuo con aptitud desproporcionada solo recibe la probabilidad del puesto #1 ($P_{max}$), sin monopolizar la ruleta.',
            'Porque suprime por completo la necesidad de evaluar la función de aptitud $f(x)$.',
            'Porque mantiene una presión selectiva constante tanto al inicio como al final de la búsqueda evolutiva.'
        ],
        'correctas': [0, 1, 3],
        'explicacion': 'La opción 3 es absurda: la función de aptitud sigue siendo imprescindible para ordenar a los individuos de menor a mayor.',
        'es_oficial': True,
        'es_p1': False,
        'fuente': 'Doctrina de Cátedra UTN FRRe — Preguntas Parcial 2'
    },
    # NAÏVE BAYES
    {
        'id': 'MC-NB-01',
        'tema': 'NAIVE_BAYES',
        'titulo': 'Naïve Bayes: Supuesto Fundamental de Independencia Condicional',
        'enunciado': 'El modelo Naïve Bayes asume que:',
        'opciones': [
            'Los atributos descriptivos son condicionalmente independientes entre sí, dada la variable de clase: $P(X_1, X_2 \\mid C_k) = P(X_1 \\mid C_k) \\cdot P(X_2 \\mid C_k)$.',
            'La probabilidad conjunta $P(X, C_k)$ se factoriza como el producto de la probabilidad a priori $P(C_k)$ por las verosimilitudes univariadas $\\prod P(x_i \\mid C_k)$.',
            'Todos los atributos tienen necesariamente idéntica distribución normal estándar con media cero.',
            'La evidencia marginal $P(X)$ es una constante normalizadora que no altera el ordenamiento de las clases candidatas.'
        ],
        'correctas': [0, 1, 3],
        'explicacion': 'La opción 3 es falsa: los atributos pueden tener distintas medias y varianzas, o ser discretos mediante frecuencias relativas/histogramas.',
        'es_oficial': True,
        'es_p1': False,
        'fuente': 'Banco Teórico de Cátedra y Exámenes Presenciales 2016-2023'
    },
    {
        'id': 'MC-NB-02',
        'tema': 'NAIVE_BAYES',
        'titulo': 'Naïve Bayes: Manejo de Variables Continuas (Gaussiano vs Histogramas)',
        'enunciado': 'En la práctica de la Cátedra para clasificar variables numéricas continuas mediante Naïve Bayes:',
        'opciones': [
            'El método de Histogramas discretiza la variable en $B$ intervalos (bins) de igual ancho y calcula frecuencias relativas.',
            'Si un bin contiene 0 instancias para una clase dada, su verosimilitud es 0 y anularía toda la probabilidad posterior (efecto probabilidad cero).',
            'La corrección de Laplace (o estimador m) suma un pseudocuento en el numerador para evitar la probabilidad nula.',
            'El enfoque Gaussiano asume obligatoriamente que la varianza debe ser igual en todas las clases.'
        ],
        'correctas': [0, 1, 2],
        'explicacion': 'La opción 4 es falsa: en Naïve Bayes Gaussiano cada clase $C_k$ estima su propia media $\\mu_k$ y su propia desviación estándar $\\sigma_k$ sobre el atributo.',
        'es_oficial': True,
        'es_p1': False,
        'fuente': 'Guía Práctica Nº 4 Naïve Bayes y Exámenes de Final'
    },
    {
        'id': 'MC-NB-03',
        'tema': 'NAIVE_BAYES',
        'titulo': 'Naïve Bayes vs k-NN: Comparación Arquitectural y Desbalance',
        'enunciado': 'Al contrastar el Clasificador Naïve Bayes frente al algoritmo $k$-NN según la doctrina de la Cátedra:',
        'opciones': [
            'Naïve Bayes es un modelo ávido (*eager*) paramétrico que construye tablas de probabilidad durante el entrenamiento.',
            '$k$-NN es un modelo perezoso (*lazy*) y no paramétrico que pospone el cálculo de distancias hasta el momento de clasificar la consulta.',
            'Ante un fuerte desbalance de clases (ej. 90% Clase A y 10% Clase B), Naïve Bayes incorpora el sesgo muestral en el prior $P(C_k)$.',
            'Ambos modelos requieren forzosamente que las clases sean linealmente separables en el espacio de características.'
        ],
        'correctas': [0, 1, 2],
        'explicacion': 'La opción 4 es falsa: ninguno de los dos modelos requiere separabilidad lineal. $k$-NN genera fronteras no lineales complejas y Naïve Bayes combina verosimilitudes independientes.',
        'es_oficial': True,
        'es_p1': False,
        'fuente': 'Tabla Comparativa Tridimensional Canónica — Preguntas Parcial 2'
    },
    # MLP (PERCEPTRÓN MULTICAPA)
    {
        'id': 'MC-MLP-01',
        'tema': 'MLP',
        'titulo': 'MLP: Error de Validación Creciente y Early Stopping',
        'enunciado': 'Durante el entrenamiento de una red neuronal Perceptrón Multicapa con Backpropagation, se observa que el error sobre el conjunto de entrenamiento decrece continuamente, pero el error sobre el conjunto de validación comienza a incrementarse sistemáticamente:',
        'opciones': [
            'Este fenómeno indica que la red está memorizando ruido del dataset de entrenamiento (sobreajuste o *overfitting*).',
            'La técnica de *Early Stopping* (parada temprana) interrumpe el entrenamiento en el punto de mínimo error de validación para asegurar óptima generalización.',
            'El error de validación creciente implica que la tasa de aprendizaje $\\eta$ debe incrementarse exponencialmente.',
            'El uso de un conjunto de test independiente permite evaluar el rendimiento final sin sesgar la selección del modelo.'
        ],
        'correctas': [0, 1, 3],
        'explicacion': 'La opción 3 es falsa: aumentar la tasa de aprendizaje $\\eta$ provocaría inestabilidad u oscilaciones destructivas. Lo correcto es aplicar parada temprana o regularización.',
        'es_oficial': True,
        'es_p1': False,
        'fuente': 'Examen Final Junio 2025 y Exámenes Presenciales 2021-2024'
    },
    {
        'id': 'MC-MLP-02',
        'tema': 'MLP',
        'titulo': 'MLP: Justificación Matemática del Término de Momento Negativo Ficticio',
        'enunciado': 'En la ecuación de actualización de pesos con momento: $\\Delta w_{ij}(t) = \\eta \\delta_j x_i + \\alpha \\Delta w_{ij}(t-1)$. ¿Por qué el coeficiente de momento $\\alpha$ debe ser estrictamente positivo ($0 < \\alpha < 1$) y nunca negativo?',
        'opciones': [
            'Un valor $\\alpha > 0$ actúa como inercia física, amortiguando oscilaciones en valles de gran curvatura y acelerando en mesetas.',
            'Si $\\alpha < 0$, el término restaría la dirección del paso previo, provocando un comportamiento de rebote errático y desacelerando el avance hacia el mínimo.',
            'El valor $\\alpha = 1.0$ garantiza teóricamente que el algoritmo nunca quede atrapado en ningún mínimo local.',
            'El término de momento permite escapar de mínimos locales poco profundos gracias a la velocidad acumulada.'
        ],
        'correctas': [0, 1, 3],
        'explicacion': 'La opción 3 es falsa: si $\\alpha = 1$, la inercia no decae y la energía cinética infinita puede desestabilizar por completo el descenso de gradiente impidiendo la convergencia.',
        'es_oficial': True,
        'es_p1': False,
        'fuente': 'Examen Final Junio 2025 (Punto 4) y Preguntas de Cátedra'
    },
    # HOPFIELD
    {
        'id': 'MC-HOP-01',
        'tema': 'HOPFIELD',
        'titulo': 'Redes de Hopfield: Matriz de Pesos Hebbiana y Diagonal Principal',
        'enunciado': 'En una Red de Hopfield discreta de $N$ neuronas con estados $s_i \\in \\{-1, +1\\}$ y regla de Hebb:',
        'opciones': [
            'La matriz de pesos es estrictamente simétrica ($w_{ij} = w_{ji}$).',
            'La diagonal principal es nula ($w_{ii} = 0$), lo que impide la auto-retroalimentación de las neuronas.',
            'La condición de diagonal nula ($w_{ii} = 0$) es necesaria para garantizar la convergencia monótona de la función de energía de Lyapunov $E = -\\frac{1}{2} \\sum_{i} \\sum_{j} w_{ij} s_i s_j$.',
            'La red puede almacenar un número ilimitado de patrones ortogonales sin generar ningún estado espurio.'
        ],
        'correctas': [0, 1, 2],
        'explicacion': 'La opción 4 es falsa: la capacidad máxima está estrictamente acotada por $N / (4 \\ln N)$ y la red siempre es susceptible a estados espurios (combinaciones lineales no deseadas).',
        'es_oficial': True,
        'es_p1': False,
        'fuente': 'Exámenes Teóricos Escaneados y Banco Doctrinal Oficial'
    },
    # SVM
    {
        'id': 'MC-SVM-01',
        'tema': 'SVM',
        'titulo': 'Support Vector Machines: Margen Óptimo y Vectores de Soporte',
        'enunciado': 'En la formulación canónica de Máquinas de Vectores de Soporte (SVM) para clasificación binaria linealmente separable:',
        'opciones': [
            'El margen geométrico total de separación entre las dos clases es $\\gamma = \\frac{2}{\\|w\\|}$.',
            'Maximizar el margen equivale matemáticamente a minimizar la norma $\\frac{1}{2} \\|w\\|^2$.',
            'Los vectores de soporte son los únicos puntos de datos que satisfacen $y_i (w \\cdot x_i + b) = 1$ y tienen $\\alpha_i > 0$.',
            'Si se eliminan todos los puntos que no son vectores de soporte, la solución del hiperplano óptimo cambia drásticamente.'
        ],
        'correctas': [0, 1, 2],
        'explicacion': 'La opción 4 es falsa: los puntos que no son vectores de soporte tienen $\\alpha_i = 0$ y no ejercen ninguna influencia sobre el hiperplano. Si se eliminan, el hiperplano óptimo permanece exactamente idéntico.',
        'es_oficial': True,
        'es_p1': False,
        'fuente': 'Guía Práctica Nº 5 SVM y Exámenes Finales 2024-2025'
    }
]

for q in preguntas_adicionales:
    h = make_hash(q['enunciado'] or q['titulo'])
    if h not in seen_hashes:
        seen_hashes.add(h)
        preguntas.append(q)

print(f"\nExtracción y curación completada. Total de preguntas consolidadas: {len(preguntas)}.")

# Recalcular y ordenar preguntas
for i, q in enumerate(preguntas, 1):
    q['nro'] = i

# Estadísticas por tema
temas_count = {}
p2_count = 0
p1_count = 0
for q in preguntas:
    t = q['tema']
    temas_count[t] = temas_count.get(t, 0) + 1
    if q.get('es_p1'):
        p1_count += 1
    else:
        p2_count += 1

print("\nDistribución por Tema en el Banco:")
for t, cnt in sorted(temas_count.items()):
    print(f"  [{t}]: {cnt} preguntas")

print(f"\nTotal Segundo Parcial (P2 foco directo): {p2_count} preguntas")
print(f"Total Primer Parcial (P1 repaso opcional): {p1_count} preguntas")

# Guardar preguntas_quiz.json
with open(OUT_JSON, 'w', encoding='utf-8') as f:
    json.dump(preguntas, f, indent=2, ensure_ascii=False)
print(f"[OK] Guardado JSON maestro en: {OUT_JSON}")

# Guardar docs/data/preguntas.js
with open(OUT_JS, 'w', encoding='utf-8') as f:
    f.write("// Base de Datos Maestra de Preguntas — Simulador Quiz UTN FRRe\n")
    f.write("// Cátedra de Inteligencia Artificial (Segundo Parcial)\n")
    f.write("// Generado automáticamente sin dependencias de build\n")
    f.write("window.PREGUNTAS = ")
    json.dump(preguntas, f, indent=2, ensure_ascii=False)
    f.write(";\n")
print(f"[OK] Guardado JS de producción en: {OUT_JS}")
