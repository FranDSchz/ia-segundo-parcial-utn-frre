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
    texto = re.sub(r'\\\\(frac|alpha|beta|sigma|mathbf|sum|prod|in|ne|le|ge|cdot|vert|mid|lambda|lt|gt)', r'\\\1', texto)
    
    # Normalizar < y > dentro de bloques matemáticos ($$...$$ y $...$) a \lt y \gt
    # para evitar colisiones con el parser HTML del navegador (ej: $p < q$ -> <q>)
    def fix_math(m):
        block = m.group(0)
        block = re.sub(r'<(?!=)', r'\\lt ', block)
        block = re.sub(r'>(?!=)', r'\\gt ', block)
        block = re.sub(r'[ \t]+', ' ', block)
        return block

    texto = re.sub(r'\$\$[\s\S]+?\$\$|\$[^\$]+?\$', fix_math, texto)
    return texto.strip()

def limpiar_opcion_spoilers(texto):
    """Elimina cualquier rastro de clave, spoiler o nota aclaratoria dentro de una opción."""
    if not texto:
        return ""
    t = texto.strip()
    t = re.sub(r'<span[^>]*>.*?</span>', '', t)
    t = re.sub(r'\[(?:CLAVE CORRECTA|VERDADERO|FALSO)[^\]]*\]', '', t, flags=re.I)
    t = re.sub(r'\*\*\[(?:CLAVE CORRECTA|VERDADERO|FALSO)[^\]]*\]\*\*', '', t, flags=re.I)
    t = re.sub(r'(?:\$\s*\\to\s*\$|\\to|->)\s*\*\*.*?\*\*', '', t, flags=re.I)
    t = re.sub(r'(?:\$\s*\\to\s*\$|\\to|->)\s*(?:Falso|Verdadero|Correcto|Correcta|Incorrecto|Incorrecta)[^.]*\.?', '', t, flags=re.I)
    t = re.sub(r'\*\(en el apunte de cátedra[^)]*\)\*', '', t, flags=re.I)
    t = t.strip('*').strip()
    t = re.sub(r'^\*\*|\*\*$', '', t).strip()
    return normalizar_latex(t)

def detectar_tema(titulo, consigna):
    raw = (titulo + " " + consigna).lower()
    text = re.sub(r'[\$\*\_]', '', raw)
    
    if any(k in text for k in ['genétic', 'genetic', 'ruleta', 'cruza', 'cruce', 'mutación', 'mutacion', 'cromosoma', 'alelo', 'fitness', 'aptitud']):
        return 'ALGORITMOS_GENETICOS'
    if any(k in text for k in ['support vector', 'svm', 'hiperplano', 'lagrange', 'kkt', 'margen óptimo', 'margen optimo', 'vectores de soporte']):
        return 'SVM'
    if bool(re.search(r'\b(som|kohonen)\b', text)) or any(k in text for k in ['auto-organizado', 'autoorganizado', 'bmu', 'mapas autoorganizados', 'mapas auto-organizados']):
        return 'SOM'
    if any(k in text for k in ['multicapa', 'mlp', 'backpropagation', 'retropropagación', 'retropropagacion', 'momento', 'early stopping', 'adaline', 'perceptrón', 'perceptron']):
        return 'MLP'
    if any(k in text for k in ['hopfield', 'hebb', 'ortogonalidad', 'atractor', 'memoria asociativa', 'lyapunov']):
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
    norm = re.sub(r'\W+', '', s.lower())[:60]
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
        clean_text = limpiar_opcion_spoilers(raw_text)
        opts.append(clean_text)
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
# FASE 2: Preguntas Únicas de PARTE IV de BANCO_TEORICO_Y_TIPS_CONSOLIDADO_TOTAL.md
# (Excluyendo las que duplican exactamente a MC-OFICIAL-01..14 o MC-CONSOL-03)
# -------------------------------------------------------------
NUMEROS_DUPLICADOS_PARTE4 = {
    11, 12, 13, 14, 15, 16, 17, 22, 29, 30, 31, 32, 33, 35, 36,
    38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51
}

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
    num_int = int(num) if num.isdigit() else idx
    if num_int in NUMEROS_DUPLICADOS_PARTE4:
        continue

    title = m_t.group(2).strip() if m_t else first_line
    is_p1 = ('[TEMA_P1_RENDIDO]' in title or '[TEMA_P1_RENDIDO]' in b)

    enun_m = re.search(r'\*\*(?:Enunciado|Enunciado y Opciones|Enunciado Oficial):\*\*\s*(.*?)(?=\n\s*-\s*[a-zA-Z0-9]\)|\n\s*\d+\.|\n\*\s*\*\*|\Z)', b, re.DOTALL)
    enun = enun_m.group(1).strip() if enun_m else title

    h = make_hash(enun or title)
    if h in seen_hashes:
        continue

    opts = []
    correct_indices = []

    letter_matches = list(re.finditer(r'-\s*([a-zA-Z0-9]+)\)\s*(.*?)(?=\n\s*-\s*[a-zA-Z0-9]+\)|\n\*\s*\*\*|\n---|\Z)', b, re.DOTALL))
    if letter_matches:
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
            clean_opt = limpiar_opcion_spoilers(l_txt)
            clean_opt = clean_opt.strip('.').strip()
            if clean_opt:
                current_idx = len(opts)
                opts.append(clean_opt)
                if is_corr:
                    correct_indices.append(current_idx)

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

print(f"Total acumulado tras Fase 2 (sin duplicados): {len(preguntas)} preguntas.")

# -------------------------------------------------------------
# FASE 3: BANCO DE PREGUNTAS CURADAS DE ALTA EXIGENCIA (2024-2025)
# Cubriendo los 8 ejes de P2 con notación estricta de la Cátedra
# -------------------------------------------------------------
preguntas_adicionales = [
    # ALGORITMOS GENÉTICOS (6 preguntas)
    {
        'id': 'MC-AG-01',
        'tema': 'ALGORITMOS_GENETICOS',
        'titulo': 'Algoritmos Genéticos: Selección Proporcional por Ruleta Acumulada (00-99)',
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
        'fuente': 'Guía Práctica Nº 6 y Segundo Parcial 19/11/2025 (Punto 4)'
    },
    {
        'id': 'MC-AG-02',
        'tema': 'ALGORITMOS_GENETICOS',
        'titulo': 'Algoritmos Genéticos: Control de Copias Esperadas ($c_i = f_i / \\bar{f}$)',
        'enunciado': 'En la Selección con Control de Copias Esperadas (evaluada en el Segundo Parcial del 19/11/2025), respecto a la asignación de réplicas de cada individuo:',
        'opciones': [
            'El número esperado de copias se calcula como $c_i = f_i / \\bar{f}$, donde $\\bar{f}$ es la aptitud media de la población.',
            'La parte entera $\\lfloor c_i \\rfloor$ garantiza copias determinísticas directas en la población de apareamiento.',
            'Las vacantes restantes se completan utilizando la parte decimal o fraccionaria de $c_i$ en orden decreciente.',
            'Todos los individuos con $c_i < 1.0$ son eliminados automáticamente sin ninguna chance de pasar a la siguiente generación.'
        ],
        'correctas': [0, 1, 2],
        'explicacion': 'La opción 4 es falsa: los individuos con $c_i < 1.0$ tienen parte entera 0 pero conservan su parte decimal (ej. $0.93$), la cual compite por las vacantes remanentes.',
        'es_oficial': True,
        'es_p1': False,
        'fuente': 'Segundo Parcial Presencial Oficial (19/11/2025, Punto 4)'
    },
    {
        'id': 'MC-AG-03',
        'tema': 'ALGORITMOS_GENETICOS',
        'titulo': 'Algoritmos Genéticos: Operadores de Cruce Simple, Multipunto y Uniforme',
        'enunciado': 'Sobre los operadores de cruce en representaciones cromosómicas binarias:',
        'opciones': [
            'El cruce simple en 1 punto divide ambos cromosomas en la posición $k$ e intercambia sus colas derechas.',
            'El cruce multipunto alterna los segmentos cromosómicos entre ambos padres en cada punto de corte definido.',
            'El cruce binomial o uniforme evalúa bit a bit una máscara probabilística independiente para decidir de qué padre proviene cada alelo.',
            'El operador de cruce siempre se aplica con probabilidad $P_c = 1.0$ sobre todos los individuos sin excepción.'
        ],
        'correctas': [0, 1, 2],
        'explicacion': 'La opción 4 es falsa: el cruce se rige por una probabilidad de cruza $P_c$ (típicamente entre 0.6 y 0.9). Si un par no cruza, los padres pasan intactos a la etapa siguiente.',
        'es_oficial': True,
        'es_p1': False,
        'fuente': 'Guía Práctica Nº 6 y Segundo Parcial 19/11/2025'
    },
    {
        'id': 'MC-AG-04',
        'tema': 'ALGORITMOS_GENETICOS',
        'titulo': 'Algoritmos Genéticos: Mutación No Uniforme / Adaptativa por Temperatura',
        'enunciado': 'En la Cátedra de IA, el mecanismo de mutación adaptativa dependiente de la temperatura ($P_m(t+1) = P_m(t) \\pm \\lambda$):',
        'opciones': [
            'En régimen descendente ($P_m(t+1) = P_m(t) - \\lambda$), promueve alta exploración global al inicio y convergencia fina al final.',
            'En régimen ascendente ($P_m(t+1) = P_m(t) + \\lambda$), incrementa la tasa de mutación cuando la población pierde diversidad para escapar de óptimos locales.',
            'La probabilidad de mutación jamás debe modificarse durante la corrida del algoritmo para garantizar la convergencia.',
            'Opera acotada dentro del rango de seguridad $P_{\\min} \\le P_m(t) \\le P_{\\max}$.'
        ],
        'correctas': [0, 1, 3],
        'explicacion': 'La opción 3 es falsa: la mutación adaptativa varía dinámicamente $P_m(t)$ entre $P_{\\min}$ y $P_{\\max}$ según la temperatura o madurez de la población.',
        'es_oficial': True,
        'es_p1': False,
        'fuente': 'Hoja de Fórmulas Oficial y Exámenes Finales 2024-2025'
    },
    {
        'id': 'MC-AG-05',
        'tema': 'ALGORITMOS_GENETICOS',
        'titulo': 'Algoritmos Genéticos: Selección por Ranking Lineal frente a Superindividuos',
        'enunciado': '¿Por qué la Cátedra recomienda la Selección por Ranking Lineal ($c_i = R_{\\min} + 2 \\frac{(n-i)(1-R_{\\min})}{n-1}$) para mitigar la convergencia prematura?',
        'opciones': [
            'Porque asigna copias esperadas en función del orden (ranking ordinal) y no de la magnitud absoluta de la aptitud.',
            'Porque un superindividuo con aptitud desproporcionada solo recibe la cuota del puesto #1, sin monopolizar la población.',
            'Porque suprime por completo la necesidad de evaluar la función de aptitud $f(x)$.',
            'Porque mantiene una presión selectiva controlada incluso cuando la varianza de aptitudes es extrema.'
        ],
        'correctas': [0, 1, 3],
        'explicacion': 'La opción 3 es falsa: la función de aptitud sigue siendo indispensable para poder ordenar a los individuos en el ranking.',
        'es_oficial': True,
        'es_p1': False,
        'fuente': 'Hoja de Fórmulas Oficial y Banco Teórico UTN FRRe'
    },
    {
        'id': 'MC-AG-06',
        'tema': 'ALGORITMOS_GENETICOS',
        'titulo': 'Algoritmos Genéticos: Diagnóstico ante Estancamiento (Elitismo, Cruza y Mutación)',
        'enunciado': 'Si un Algoritmo Genético utiliza selección elitista (15%), cruza (70%) y mutación (15%) y se estanca en un óptimo local sin alcanzar la solución esperada, ¿cuál es el diagnóstico correcto de la Cátedra?',
        'opciones': [
            'No se debe eliminar la cruza ni la mutación, ya que la cruza recombina bloques constructores y la mutación aporta diversidad genética.',
            'Una solución válida es aplicar mutación adaptativa ascendente para inyectar diversidad y escapar del óptimo local.',
            'Otra solución válida es reemplazar la selección elitista/ruleta por selección basada en ranking para reducir la presión selectiva prematura.',
            'La mejor alternativa es suprimir por completo los operadores de cruza y mutación y dejar únicamente selección por orden.'
        ],
        'correctas': [0, 1, 2],
        'explicacion': 'La opción 4 es falsa (Pregunta Oficial de Examen): reemplazar cruza y mutación por selección basada en orden destruiría toda capacidad de búsqueda y exploración de nuevas soluciones.',
        'es_oficial': True,
        'es_p1': False,
        'fuente': 'Examen Final Oficial (Pregunta 28 del Compendio Doctrinal)'
    },
    # NAÏVE BAYES (4 preguntas)
    {
        'id': 'MC-NB-01',
        'tema': 'NAIVE_BAYES',
        'titulo': 'Naïve Bayes: Supuesto Fundamental de Independencia Condicional',
        'enunciado': 'El clasificador probabilístico Naïve Bayes asume que:',
        'opciones': [
            'Los atributos descriptivos son condicionalmente independientes entre sí dado el valor de la clase: $P(a_1, \\dots, a_m \\mid c_i) = \\prod_{j=1}^m P(a_j \\mid c_i)$.',
            'La probabilidad posterior es proporcional al producto del prior de la clase por las verosimilitudes: $P(c_i \\mid a_1, \\dots, a_m) \\propto P(c_i) \\prod_{j=1}^m P(a_j \\mid c_i)$.',
            'Todos los atributos deben seguir obligatoriamente una distribución normal estándar con media $\\mu = 0$ y varianza $\\sigma^2 = 1$.',
            'El denominador $P(a_1, \\dots, a_m)$ es constante para todas las clases $c_i$ y no altera la decisión $\\arg\\max$.'
        ],
        'correctas': [0, 1, 3],
        'explicacion': 'La opción 3 es falsa: los atributos pueden ser discretos (tablas de frecuencia/histogramas) o continuos con distintas medias $\\mu_{jk}$ y desviaciones $\\sigma_{jk}$ por clase.',
        'es_oficial': True,
        'es_p1': False,
        'fuente': 'Hoja de Fórmulas Oficial y Exámenes Presenciales 2020-2025'
    },
    {
        'id': 'MC-NB-02',
        'tema': 'NAIVE_BAYES',
        'titulo': 'Naïve Bayes: Variables Continuas (Gaussiano vs. Histogramas y Probabilidad Cero)',
        'enunciado': 'En la práctica de la Cátedra para clasificar variables numéricas continuas mediante Naïve Bayes:',
        'opciones': [
            'El método de Histogramas discretiza el rango continuo en intervalos (bins) y estima probabilidades mediante frecuencias relativas.',
            'Si un intervalo tiene frecuencia 0 para una clase, su verosimilitud $P(a_j \\mid c_i) = 0$ anula todo el producto posterior (problema de frecuencia cero).',
            'La corrección de Laplace (o suavizado aditivo) evita que una frecuencia nula anule toda la productoria de verosimilitudes.',
            'En el método Gaussiano continuo, la función de densidad evalúa $P(a_j \\mid c_i) = \\frac{1}{\\sigma \\sqrt{2\\pi}} e^{-\\frac{(a_j - \\mu)^2}{2\\sigma^2}}$.'
        ],
        'correctas': [0, 1, 2, 3],
        'explicacion': 'Las 4 afirmaciones son verdaderas y constituyen los pilares teóricos y prácticos de la Guía Nº 4 y de la Hoja de Fórmulas Oficial de la Cátedra.',
        'es_oficial': True,
        'es_p1': False,
        'fuente': 'Guía Práctica Nº 4 Naïve Bayes y Hoja de Fórmulas Oficial'
    },
    {
        'id': 'MC-NB-03',
        'tema': 'NAIVE_BAYES',
        'titulo': 'Naïve Bayes vs. k-NN: Comparación Eager vs. Lazy y Dimensionalidad',
        'enunciado': 'Al contrastar el Clasificador Naïve Bayes frente al algoritmo $k$-NN según la tabla comparativa oficial de la Cátedra:',
        'opciones': [
            'Naïve Bayes realiza aprendizaje offline (*eager*), estimando probabilidades a priori y verosimilitudes antes de clasificar.',
            '$k$-NN realiza aprendizaje *lazy* (perezoso), postergando el cómputo de distancias hasta el instante de clasificar la consulta.',
            'Naïve Bayes escala eficientemente en espacios de alta dimensionalidad, mientras que $k$-NN sufre la maldición de la dimensionalidad.',
            'Ambos modelos son algoritmos de agrupamiento no supervisado.'
        ],
        'correctas': [0, 1, 2],
        'explicacion': 'La opción 4 es falsa: tanto Naïve Bayes como $k$-NN son algoritmos de **clasificación supervisada** (el no supervisado de la tabla comparativa es $K$-Means).',
        'es_oficial': True,
        'es_p1': False,
        'fuente': 'Tabla Comparativa Tridimensional Canónica (Pregunta 16 del Compendio)'
    },
    {
        'id': 'MC-NB-04',
        'tema': 'NAIVE_BAYES',
        'titulo': 'Naïve Bayes: Limitaciones ante Distribuciones en Espiral o Atributos Correlacionados',
        'enunciado': '¿Qué ocurre cuando se aplica Naïve Bayes Gaussiano a un problema bidimensional cuyas clases forman dos espirales entrelazadas o presentan fuerte correlación no lineal entre atributos?',
        'opciones': [
            'El modelo falla porque asume independencia condicional entre atributos dado el valor de la clase.',
            'Al proyectar los datos sobre cada eje coordenado por separado, las distribuciones marginales de ambas clases se solapan severamente.',
            'Las fronteras de decisión de Naïve Bayes Gaussiano no pueden adaptarse a variedades en espiral altamente entrelazadas.',
            'Naïve Bayes resuelve cualquier espiral no lineal con 100% de exactitud sin necesidad de transformar el espacio.'
        ],
        'correctas': [0, 1, 2],
        'explicacion': 'La opción 4 es falsa: como explica la Pregunta 27 del banco de finales, Naïve Bayes falla ante espirales entrelazadas porque ignora las dependencias cruzadas entre variables.',
        'es_oficial': True,
        'es_p1': False,
        'fuente': 'Examen Final Oficial (Pregunta 27 del Compendio Doctrinal)'
    },
    # MLP / BACKPROPAGATION / ADALINE (5 preguntas)
    {
        'id': 'MC-MLP-01',
        'tema': 'MLP',
        'titulo': 'MLP: Error de Validación Creciente y Parada Temprana (Early Stopping)',
        'enunciado': 'Durante el entrenamiento de una red Perceptrón Multicapa (MLP) con Backpropagation, el error de entrenamiento disminuye pero el error de validación comienza a subir de forma sostenida:',
        'opciones': [
            'Indica que la red está comenzando a sobreajustar (*overfitting*), perdiendo capacidad de generalización.',
            'Se debe detener el entrenamiento en el punto donde el error de validación alcanzó su mínimo (*Early Stopping*).',
            'Si en cambio el error de validación ya es menor que el error mínimo aceptable, también corresponde detener el entrenamiento por convergencia exitosa.',
            'Para solucionarlo se debe eliminar el conjunto de validación y entrenar hasta que el error de entrenamiento sea exactamente 0.'
        ],
        'correctas': [0, 1, 2],
        'explicacion': 'La opción 4 es falsa: entrenar hasta error cero sin validación agrava el sobreajuste. La Cátedra exige detener el entrenamiento por Early Stopping o cuando $E_{val} < E_{\\min}$.',
        'es_oficial': True,
        'es_p1': False,
        'fuente': 'Examen Final Junio 2025 y Preguntas 2, 13 y 23 del Compendio'
    },
    {
        'id': 'MC-MLP-02',
        'tema': 'MLP',
        'titulo': 'MLP: ¿El Término de Momento Puede Llegar a Ser Negativo?',
        'enunciado': 'En la fórmula oficial de actualización de pesos de Backpropagation con momento de la Cátedra: $w_{kj}(t+1) = w_{kj}(t) + \\alpha \\delta_{pk} y_{pj} + \\beta (w_{kj}(t) - w_{kj}(t-1))$. Ante la pregunta de examen "¿El término de momento puede llegar a ser negativo?", ¿cuáles afirmaciones son correctas?',
        'opciones': [
            'SÍ: el término de momento completo $\\beta \\cdot \\Delta w_{kj}(t-1)$ es negativo siempre que el cambio de peso de la iteración anterior $\\Delta w_{kj}(t-1) = w_{kj}(t) - w_{kj}(t-1)$ haya sido negativo.',
            'El coeficiente o constante de momento $\\beta$ se define como un hiperparámetro positivo en el rango $[0, 1)$, pero al multiplicarse por un incremento previo negativo produce un término negativo.',
            'Si tanto la corrección por gradiente actual como el cambio de peso anterior son negativos, el término de momento negativo refuerza el descenso en esa misma dirección.',
            'NO: ni el coeficiente $\\beta$ ni el producto $\\beta \\cdot \\Delta w(t-1)$ pueden tomar jamás signos negativos bajo ninguna circunstancia.'
        ],
        'correctas': [0, 1, 2],
        'explicacion': 'Trampa clásica de examen final (Junio 2025): el coeficiente escalar $\\beta \\in [0, 1)$ es positivo, pero el **término de momento** $\\beta (w(t) - w(t-1))$ **SÍ puede ser negativo** cuando $w(t) < w(t-1)$ (es decir, cuando el peso disminuyó en el paso anterior).',
        'es_oficial': True,
        'es_p1': False,
        'fuente': 'Examen Final Junio 2025 (Pregunta 4) y Pregunta 1 de Desarrollo'
    },
    {
        'id': 'MC-MLP-03',
        'tema': 'MLP',
        'titulo': 'MLP: Derivadas de Funciones de Activación Sigmoidal y Tangente Hiperbólica',
        'enunciado': 'En el cálculo del gradiente local $\\delta$ durante el paso hacia atrás (*Backward Pass*) de una red MLP según el Formulario Oficial de la Cátedra:',
        'opciones': [
            'Para la función sigmoidal estándar $y_{pj} = \\frac{1}{1 + e^{-Net_{pj}}}$, su derivada es $f\'_j(Net_{pj}) = y_{pj}(1 - y_{pj})$.',
            'Para la tangente hiperbólica estándar $y_{pj} = \\tanh(Net_{pj})$, su derivada es $f\'_j(Net_{pj}) = 1 - y_{pj}^2$.',
            'El gradiente de una neurona oculta $j$ pondera los errores de la capa siguiente: $\\delta_{pj} = f\'_j(Net_{pj}) \\sum_k (\\delta_{pk} \\cdot w_{kj})$.',
            'En la capa oculta el error se calcula restando directamente $(d_{pj} - y_{pj})$ igual que en la capa de salida.'
        ],
        'correctas': [0, 1, 2],
        'explicacion': 'La opción 4 es falsa: las neuronas ocultas no poseen salida deseada directa $d_{pj}$, por lo que su gradiente $\\delta_{pj}$ se retropropaga sumando $\\sum_k \\delta_{pk} w_{kj}$.',
        'es_oficial': True,
        'es_p1': False,
        'fuente': 'Hoja de Fórmulas Oficial y Segundo Parcial 19/11/2025 (Punto 3)'
    },
    {
        'id': 'MC-MLP-04',
        'tema': 'MLP',
        'titulo': 'Redes Neuronales: Diferencias entre ADALINE y Perceptrón Simple',
        'enunciado': 'Al comparar el proceso de aprendizaje del modelo ADALINE (Widrow-Hoff / LMS) con el Perceptrón Simple (Rosenblatt) según la doctrina de la Cátedra:',
        'opciones': [
            'ADALINE calcula el error sobre la salida lineal continua ($e = d - Net$) antes de aplicar el umbral bipolar.',
            'El Perceptrón Simple calcula el error únicamente sobre la salida discreta umbralizada ($e = d - y$).',
            'Ante clases no linealmente separables, el Perceptrón Simple oscila indefinidamente sin converger, mientras que ADALINE converge al mínimo error cuadrático medio.',
            'El Perceptrón Simple de una sola capa puede resolver nativamente la función booleana XOR.'
        ],
        'correctas': [0, 1, 2],
        'explicacion': 'La opción 4 es falsa: el Perceptrón Simple solo genera un hiperplano lineal y no puede resolver XOR ni paridad de 3 bits $(x \\oplus y) \\oplus z$.',
        'es_oficial': True,
        'es_p1': False,
        'fuente': 'Examen Final Oficial (Pregunta 17 del Compendio Doctrinal)'
    },
    # HOPFIELD (2 preguntas adicionales)
    {
        'id': 'MC-HOP-01',
        'tema': 'HOPFIELD',
        'titulo': 'Redes de Hopfield: Matriz de Pesos Hebbiana, Diagonal Nula y Energía',
        'enunciado': 'En una Red de Hopfield discreta de $N$ neuronas con patrones bipolares $E_k \\in \\{-1, +1\\}^N$ y regla de aprendizaje $W = \\sum_{k=1}^M (E_k^T E_k - I)$:',
        'opciones': [
            'La matriz de pesos $W$ es cuadrada de dimensión $N \\times N$ y estrictamente simétrica ($w_{ij} = w_{ji}$).',
            'Restar la matriz identidad $I$ por cada patrón fuerza a que la diagonal principal sea nula ($w_{ii} = 0$), evitando la auto-conexión.',
            'Durante la fase de recuperación, la red evoluciona hasta alcanzar un atractor estable donde $S(t+1) = S(t)$ (mínimo local de energía de Lyapunov).',
            'El entrenamiento de la red de Hopfield es supervisado y requiere etiquetas de clase para cada patrón.'
        ],
        'correctas': [0, 1, 2],
        'explicacion': 'La opción 4 es falsa: el modelo de Hopfield es una memoria auto-asociativa de aprendizaje **no supervisado y offline**.',
        'es_oficial': True,
        'es_p1': False,
        'fuente': 'Hoja de Fórmulas Oficial y Preguntas 15, 21 y 56 del Compendio'
    },
    {
        'id': 'MC-HOP-02',
        'tema': 'HOPFIELD',
        'titulo': 'Redes de Hopfield: Limitaciones, Estados Espurios y Patrones Inversos',
        'enunciado': '¿Cuáles de los siguientes son problemas o limitaciones intrínsecas de reconocimiento en una red neuronal de Hopfield según la Cátedra?',
        'opciones': [
            'Capacidad de almacenamiento severamente acotada ($M \\le \\frac{N}{4 \\ln N}$ para recuperación perfecta y $M \\le 0.138 N$ para error $<1\\%$).',
            'Interferencia destructiva (*crosstalk*) cuando los patrones memorizados no cumplen la condición de ortogonalidad.',
            'Convergencia a estados espurios (mínimos locales falsos que no corresponden a ningún patrón entrenado) o a ciclos límite oscilatorios.',
            'Atracción hacia patrones invertidos ($-E_k$), dado que tienen exactamente la misma energía que el patrón original $E_k$.'
        ],
        'correctas': [0, 1, 2, 3],
        'explicacion': 'Las 4 opciones son verdaderas y constituyen la respuesta completa a la Pregunta 25 de exámenes finales ("Mencione todos los problemas de reconocimiento que puede tener una red neuronal Hopfield").',
        'es_oficial': True,
        'es_p1': False,
        'fuente': 'Examen Final Oficial (Pregunta 25 del Compendio Doctrinal)'
    },
    # SOM (2 preguntas adicionales)
    {
        'id': 'MC-SOM-01',
        'tema': 'SOM',
        'titulo': 'Mapas Auto-Organizados (SOM): Función de Vecindad y Actualización de Pesos',
        'enunciado': 'En el entrenamiento de una red SOM de Kohonen (como en el Punto 2 del Segundo Parcial del 19/11/2025) con función de vecindad continua $h = \\frac{1}{1 + \\text{dist}(S_i, S_j)^2}$:',
        'opciones': [
            'Para la neurona ganadora (BMU), la distancia topológica consigo misma es $\\text{dist}(S_i, S_i) = 0$, por lo que su factor de vecindad es máximo ($h = 1$).',
            'Las neuronas vecinas con $h > 0$ también actualizan sus vectores de pesos acercándose al patrón presentado, aunque con menor intensidad que la BMU.',
            'La regla de adaptación es $w_{ji}(t+1) = w_{ji}(t) + \\alpha(t) \\cdot h \\cdot (e_i - w_{ji}(t))$.',
            'La condición de parada del algoritmo SOM consiste en detenerse apenas una neurona gana por primera vez en la primera iteración.'
        ],
        'correctas': [0, 1, 2],
        'explicacion': 'La opción 4 es falsa: el entrenamiento del SOM se extiende a lo largo de múltiples épocas hasta que el mapa topológico converge y los pesos sinápticos se estabilizan ($\\Delta w \\to 0$).',
        'es_oficial': True,
        'es_p1': False,
        'fuente': 'Segundo Parcial Presencial Oficial (19/11/2025, Punto 2 al 30%)'
    },
    {
        'id': 'MC-SOM-02',
        'tema': 'SOM',
        'titulo': 'Comparativa Neuronal: SOM vs. Hopfield vs. Perceptrón Simple',
        'enunciado': 'De acuerdo con la Tabla Comparativa de Redes Neuronales exigida por la Cátedra (SOM vs. Hopfield vs. Perceptrón Simple):',
        'opciones': [
            'Tanto SOM como Hopfield utilizan aprendizaje No Supervisado, mientras que el Perceptrón Simple utiliza aprendizaje Supervisado.',
            'En una red de Hopfield la cantidad de salidas es igual a la cantidad de entradas ($N$), mientras que en el Perceptrón Simple hay $1$ salida y en SOM hay $M$ neuronas en la grilla de salida.',
            'SOM preserva las relaciones topológicas del espacio de entrada proyectándolas sobre una grilla de menor dimensión (1D o 2D).',
            'La red SOM requiere conocer la etiqueta de clase deseada $d_k$ en cada iteración para poder calcular la distancia euclídea a la BMU.'
        ],
        'correctas': [0, 1, 2],
        'explicacion': 'La opción 4 es falsa: SOM es estrictamente no supervisado y competitivo; calcula distancias únicamente entre el vector de entrada $X$ y los vectores de pesos $W_j$.',
        'es_oficial': True,
        'es_p1': False,
        'fuente': 'Examen Final Oficial (Pregunta 15 del Compendio Doctrinal)'
    },
    {
        'id': 'MC-SOM-03',
        'tema': 'SOM',
        'titulo': 'Mapas Auto-Organizados (SOM): Topología Rectangular vs. Hexagonal y Decaimiento de $\\alpha(t)$',
        'enunciado': 'Respecto a la topología de la capa de salida y los hiperparámetros de entrenamiento en una red SOM de Kohonen:',
        'opciones': [
            'En una grilla bidimensional rectangular cada neurona interna posee 4 vecinas inmediatas a distancia 1, mientras que en una grilla hexagonal posee 6 vecinas equidistantes.',
            'La tasa de aprendizaje $\\alpha(t)$ decrece monótonamente con el tiempo o las épocas (por ejemplo $\\alpha(t) = 1/t$) para garantizar la estabilización fina del mapa.',
            'Para determinar la neurona ganadora (BMU), minimizar la distancia euclídea $d_j = \\sqrt{\\sum (w_{ji} - e_i)^2}$ es equivalente a minimizar la distancia euclídea al cuadrado $d_j^2 = \\sum (w_{ji} - e_i)^2$.',
            'En una red SOM existen conexiones sinápticas con pesos entrenables directos entre las neuronas de la capa de salida.'
        ],
        'correctas': [0, 1, 2],
        'explicacion': 'La opción 4 es falsa (Pregunta Clásica de Cátedra): no existen conexiones físicas ponderadas entre las neuronas de la grilla de salida; su interacción ocurre únicamente a través de la función de vecindad topológica $h$.',
        'es_oficial': True,
        'es_p1': False,
        'fuente': 'Hoja de Fórmulas Oficial y Pregunta 14 del Compendio Doctrinal'
    },
    # SVM (2 preguntas adicionales)
    {
        'id': 'MC-SVM-01',
        'tema': 'SVM',
        'titulo': 'Support Vector Machines: Margen Geométrico Óptimo y Vectores de Soporte',
        'enunciado': 'En la formulación canónica de Máquinas de Vectores de Soporte (SVM) para clasificación binaria linealmente separable:',
        'opciones': [
            'El margen geométrico total de separación entre los hiperplanos $H_+$ y $H_-$ es $\\gamma = \\frac{2}{\\|\\mathbf{w}\\|}$.',
            'Maximizar el margen geométrico $\\frac{2}{\\|\\mathbf{w}\\|}$ es matemáticamente equivalente a minimizar $\\frac{1}{2} \\|\\mathbf{w}\\|^2$.',
            'El vector normal al hiperplano se obtiene como combinación lineal de los vectores de soporte: $\\mathbf{w} = \\sum_{i=1}^N y_i \\alpha_i \\mathbf{x}_i$.',
            'Si se eliminan del dataset los puntos con $\\alpha_i = 0$, el hiperplano óptimo cambia de pendiente y de margen.'
        ],
        'correctas': [0, 1, 2],
        'explicacion': 'La opción 4 es falsa: los puntos con $\\alpha_i = 0$ no aportan nada a la suma $\\mathbf{w} = \\sum y_i \\alpha_i \\mathbf{x}_i$, por lo que eliminarlos deja invariante al hiperplano.',
        'es_oficial': True,
        'es_p1': False,
        'fuente': 'Hoja de Fórmulas Oficial y Guía Práctica Nº 5 SVM'
    },
    {
        'id': 'MC-SVM-02',
        'tema': 'SVM',
        'titulo': 'Support Vector Machines: Cálculo de la Ordenada $b$, Pendiente y Kernel Trick',
        'enunciado': 'Respecto a la resolución analítica de una SVM en $\\mathbb{R}^2$ y al tratamiento de datos no linealmente separables:',
        'opciones': [
            'La ecuación de la recta del hiperplano separador $w_1 x_1 + w_2 x_2 + b = 0$ tiene pendiente $m = -w_1 / w_2$ y ordenada al origen $-b / w_2$.',
            'El sesgo $b$ se despeja evaluando los vectores de soporte en $b = \\frac{1}{y_i} - \\mathbf{w}^T \\mathbf{x}_i$ (o promediando sobre los vectores de soporte de ambas clases).',
            'Cuando las clases no son linealmente separables en el espacio original, una función de Kernel proyecta implícitamente los datos a un espacio de mayor dimensión donde sí sean linealmente separables.',
            'En la formulación dual de SVM, la condición de restricción de igualdad exige que $\\sum_{i=1}^N y_i \\alpha_i = 1$.'
        ],
        'correctas': [0, 1, 2],
        'explicacion': 'La opción 4 es falsa: la restricción de igualdad del problema dual obtenida al derivar respecto a $b$ es $\\sum_{i=1}^N y_i \\alpha_i = 0$.',
        'es_oficial': True,
        'es_p1': False,
        'fuente': 'Hoja de Fórmulas Oficial y Exámenes Finales 2024-2025'
    },
    # CLUSTERING JERÁRQUICO Y K-MEANS (3 preguntas adicionales)
    {
        'id': 'MC-CLU-01',
        'tema': 'CLUSTERING',
        'titulo': 'Clustering Jerárquico Aglomerativo: Single-Link, Complete-Link y Dendrogramas',
        'enunciado': 'En el algoritmo de Clustering Jerárquico Aglomerativo (evaluado en el Punto 1 del Segundo Parcial del 19/11/2025):',
        'opciones': [
            'Comienza con tantos clusters unitarios como instancias ($N$) y en cada paso fusiona el par de clusters con menor distancia según el criterio de enlace elegido.',
            'El criterio Single-Link ($\\min d(x,y)$) tiende a producir clusters alargados por el "efecto cadena" (*chaining effect*).',
            'El criterio Complete-Link ($\\max d(x,y)$) tiende a formar clusters más compactos y de diámetros similares.',
            'El eje vertical del dendrograma representa la distancia (o disimilitud) a la cual se produjo cada fusión, permitiendo obtener $k$ grupos al trazar un corte horizontal.'
        ],
        'correctas': [0, 1, 2, 3],
        'explicacion': 'Las 4 opciones son verdaderas y resumen las propiedades fundamentales de Single-Link, Complete-Link, Average-Link y la interpretación del dendrograma.',
        'es_oficial': True,
        'es_p1': False,
        'fuente': 'Segundo Parcial Presencial Oficial (19/11/2025, Punto 1 al 20%)'
    },
    {
        'id': 'MC-KM-01',
        'tema': 'KMEANS',
        'titulo': 'K-Means: Condición de Parada, Sensibilidad a Semillas y Sobreajuste',
        'enunciado': 'Respecto al algoritmo de agrupamiento particional $K$-Means según la Cátedra:',
        'opciones': [
            'En cada iteración reasigna cada punto al centroide más cercano (menor distancia euclídea) y luego recalcula cada centroide como el vector medio $\\overline{m}_j = \\frac{1}{|C_j|} \\sum_{\\mathbf{x}_i \\in C_j} \\mathbf{x}_i$.',
            'Finaliza cuando las asignaciones de instancias no cambian (los centroides se estabilizan y se repiten entre dos iteraciones sucesivas).',
            'Es sensible a la elección de las semillas iniciales y a la presencia de valores atípicos (*outliers*).',
            'Para evitar el sobreajuste (valores de $k$ excesivamente altos), se emplean heurísticas como el Método del Codo (*Elbow*) o el Coeficiente de Silueta.'
        ],
        'correctas': [0, 1, 2, 3],
        'explicacion': 'Las 4 afirmaciones son verdaderas (Hoja de Fórmulas Oficial y Preguntas 16 y 18 del Compendio Teórico de la Cátedra).',
        'es_oficial': True,
        'es_p1': False,
        'fuente': 'Hoja de Fórmulas Oficial y Pregunta 18 del Compendio Doctrinal'
    },
    {
        'id': 'MC-CLU-02',
        'tema': 'CLUSTERING',
        'titulo': 'Clustering Jerárquico: Cálculo Analítico de Average-Link vs. Single/Complete-Link',
        'enunciado': 'Si en un paso del algoritmo de Clustering Jerárquico Aglomerativo se desea calcular la distancia entre el cluster $C_1 = \\{A, C\\}$ y el cluster $C_2 = \\{B, D\\}$:',
        'opciones': [
            'Con Single-Link, la distancia es $\\min\\{d(A,B),\\; d(A,D),\\; d(C,B),\\; d(C,D)\\}$.',
            'Con Complete-Link, la distancia es $\\max\\{d(A,B),\\; d(A,D),\\; d(C,B),\\; d(C,D)\\}$.',
            'Con Average-Link, la distancia es el promedio de los 4 pares cruzados: $\\frac{d(A,B) + d(A,D) + d(C,B) + d(C,D)}{2 \\times 2}$.',
            'Con Average-Link, basta con promediar únicamente $d(A,B)$ y $d(C,D)$ ignorando los pares cruzados restantes.'
        ],
        'correctas': [0, 1, 2],
        'explicacion': 'La opción 4 es falsa: Average-Link exige promediar **todos** los $|C_1| \\times |C_2|$ pares cruzados de distancias individuales entre ambos grupos.',
        'es_oficial': True,
        'es_p1': False,
        'fuente': 'Segundo Parcial Presencial Oficial (19/11/2025, Punto 1)'
    },
    {
        'id': 'MC-KM-02',
        'tema': 'KMEANS',
        'titulo': 'K-Means vs. Clustering Jerárquico: Complejidad, Partición y Forma de Clusters',
        'enunciado': 'Al comparar el agrupamiento particional ($K$-Means) con el agrupamiento jerárquico aglomerativo según la Cátedra:',
        'opciones': [
            '$K$-Means produce una única partición plana de $k$ grupos, mientras que el Clustering Jerárquico genera una jerarquía anidada de particiones visualizable en un dendrograma.',
            '$K$-Means tiende a encontrar clusters hiperesféricos (convexos) al minimizar la distancia euclídea a los centroides.',
            'En el Clustering Jerárquico Aglomerativo las fusiones son irrevocables: una vez que dos instancias se unen en un paso, no pueden separarse en pasos posteriores.',
            '$K$-Means construye un árbol dendrograma completo en cada iteración sin necesidad de definir $k$.'
        ],
        'correctas': [0, 1, 2],
        'explicacion': 'La opción 4 es falsa: el dendrograma es exclusivo del Clustering Jerárquico; $K$-Means requiere fijar $k$ a priori y solo mantiene $k$ centroides.',
        'es_oficial': True,
        'es_p1': False,
        'fuente': 'Guía Práctica Nº 4 y Exámenes Finales Oficiales'
    },
    # KNN Y APRENDIZAJE POR REFUERZO (2 preguntas adicionales)
    {
        'id': 'MC-KNN-01',
        'tema': 'KNN',
        'titulo': 'k-NN Ponderado con $k = m + n$ y Selección de $k$-Óptimo por Validación Cruzada',
        'enunciado': 'En el clasificador $k$-NN ponderado por distancia ($w_i = \\frac{1}{1 + d(x_0, x_i)^2}$ o $w_i = \\frac{1}{d(x_q, x_i)^2}$):',
        'opciones': [
            'Si se fija $k = m + n$ (todo el dataset) con $m > n$, una consulta $x_0$ muy cercana a puntos de la clase minoritaria $B$ puede clasificarse como $B$ porque los pesos cercanos dominan sobre los lejanos.',
            'Para hallar el $k$-óptimo de manera empírica, la Cátedra emplea validación cruzada *Leave-One-Out* (evaluando qué valor de $k$ maximiza la cantidad total de aciertos).',
            'En problemas de clasificación binaria con votación simple, suele preferirse un valor de $k$ impar para evitar empates.',
            'En $k$-NN ponderado, las instancias más alejadas de la consulta reciben el peso más alto.'
        ],
        'correctas': [0, 1, 2],
        'explicacion': 'La opción 4 es falsa: el peso es inversamente proporcional al cuadrado de la distancia, por lo que las instancias más cercanas reciben el mayor peso.',
        'es_oficial': True,
        'es_p1': False,
        'fuente': 'Examen Final Oficial (Preguntas 20 y 22 del Compendio Doctrinal)'
    },
    {
        'id': 'MC-GEN-01',
        'tema': 'GENERAL_IA',
        'titulo': 'Aprendizaje Supervisado vs. Aprendizaje por Refuerzo y Valores Iniciales Optimistas',
        'enunciado': 'De acuerdo con las preguntas teóricas de examen final de la Cátedra sobre paradigmas de aprendizaje:',
        'opciones': [
            'En el Aprendizaje Supervisado existe un maestro que provee la salida deseada exacta para cada entrada, mientras que en el Aprendizaje por Refuerzo el agente aprende por ensayo y error recibiendo señales de recompensa o castigo.',
            'En Aprendizaje por Refuerzo, iniciar los valores de acción con estimaciones optimistas altas incentiva la exploración sistemática de estados y acciones aún no visitados.',
            'El objetivo del aprendizaje inductivo supervisado sobre un dataset es obtener una función de hipótesis que relacione los atributos con las clases para generalizar ante nuevas instancias.',
            'En el Aprendizaje por Refuerzo, el entorno entrega al agente el gradiente analítico exacto $\\delta_{pk}$ en cada paso.'
        ],
        'correctas': [0, 1, 2],
        'explicacion': 'La opción 4 es falsa: en Aprendizaje por Refuerzo no se conoce la salida deseada ni el gradiente analítico; solo se observa una señal escalar de recompensa.',
        'es_oficial': True,
        'es_p1': False,
        'fuente': 'Exámenes Finales Oficiales (Preguntas 24 y 26 del Compendio Doctrinal)'
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
    q['titulo'] = normalizar_latex(q.get('titulo', ''))
    q['enunciado'] = normalizar_latex(q.get('enunciado', ''))
    q['opciones'] = [normalizar_latex(opt) for opt in q.get('opciones', [])]
    q['explicacion'] = normalizar_latex(q.get('explicacion', ''))

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
