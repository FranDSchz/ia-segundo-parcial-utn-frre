# -*- coding: utf-8 -*-
"""
Script de auditoría, limpieza de metadatos de años e incorporación de nuevos
hallazgos teóricos de alta frecuencia para el banco de preguntas del Simulador Quiz UTN FRRe.
"""
import os, sys, json, re

sys.stdout.reconfigure(encoding='utf-8')

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JSON_PATH = os.path.join(REPO_ROOT, "preguntas_quiz.json")
JS_PATH = os.path.join(REPO_ROOT, "docs", "data", "preguntas.js")

def normalizar_latex(texto):
    if not texto:
        return ""
    # Reemplazar normas |w| por \|w\|
    texto = re.sub(r'\|([a-zA-Z\\]+)\|', r'\\|\1\\|', texto)
    # Evitar dobles barras accidentales
    texto = re.sub(r'\\\\(frac|alpha|beta|sigma|mathbf|sum|prod|in|ne|le|ge|cdot|vert|mid|lambda|lt|gt)', r'\\\1', texto)
    
    # Normalizar < y > dentro de bloques matemáticos ($$...$$ y $...$) a \lt y \gt
    def fix_math(m):
        block = m.group(0)
        block = re.sub(r'<(?!=)', r'\\lt ', block)
        block = re.sub(r'>(?!=)', r'\\gt ', block)
        block = re.sub(r'[ \t]+', ' ', block)
        return block

    texto = re.sub(r'\$\$[\s\S]+?\$\$|\$[^\$]+?\$', fix_math, texto)
    return texto.strip()

def enrich_bank():
    with open(JSON_PATH, 'r', encoding='utf-8') as f:
        data = json.load(f)

    print(f"Preguntas iniciales cargadas: {len(data)}")

    # 1. Limpieza de metadatos de años no verificados en preguntas existentes
    for q in data:
        qid = q.get('id', '')
        
        # Enunciado cleanups
        enun = q.get('enunciado', '')
        enun = enun.replace('Segundo Parcial del 19/11/2025', 'Segundo Parcial Presencial')
        enun = enun.replace('Punto 2 del Segundo Parcial del 19/11/2025', 'Segundo Parcial Presencial')
        enun = enun.replace('Punto 1 del Segundo Parcial del 19/11/2025', 'Segundo Parcial Presencial')
        q['enunciado'] = enun
        
        # Explicacion cleanups
        expl = q.get('explicacion', '')
        expl = expl.replace('Trampa clásica de examen final (Junio 2025):', 'Trampa clásica de examen final de cátedra:')
        q['explicacion'] = expl

        # Fuente / Origen cleanups
        fuente = q.get('fuente', '')
        if '2024' in fuente or '2025' in fuente or '19/11/2025' in fuente:
            if 'Punto 4' in fuente or 'Segundo Parcial' in fuente:
                fuente = 'Guía Práctica Nº 6 y Segundo Parcial Presencial' if 'Guía' in fuente else 'Segundo Parcial Presencial'
            elif 'Finales 2024-2025' in fuente:
                fuente = 'Hoja de Fórmulas Oficial y Mesas de Examen Final'
            elif 'Presenciales 2020-2025' in fuente:
                fuente = 'Hoja de Fórmulas Oficial y Exámenes Presenciales de Cátedra'
            elif 'Junio 2025' in fuente:
                fuente = 'Mesas de Examen Final y Preguntas del Compendio de Cátedra'
            else:
                fuente = re.sub(r'\b202[45]\b', 'Mesas de Examen Final', fuente)
        q['fuente'] = fuente
        q['origen'] = fuente

    # 2. Definición de los 7 nuevos hallazgos teóricos de alta frecuencia
    nuevas_preguntas = [
        # MC-53: Red Neuronal Competitiva / SOM con conexiones laterales inhibitorias
        {
            'id': 'MC-53',
            'tema': 'SOM',
            'titulo': 'Redes Neuronales Competitivas: Arquitectura SOM con Conexiones Laterales Inhibitorias',
            'enunciado': 'En la arquitectura de una red neuronal autoorganizada competitiva (SOM de Kohonen) dotada de conexiones laterales recurrentes (modelo de Sombrero Mexicano):',
            'opciones': [
                'Las neuronas de la capa de salida compiten mediante autoexcitación positiva local (a corta distancia) y conexiones inhibitorias negativas hacia neuronas situadas a media y larga distancia en la grilla.',
                'La función de vecindad $h_{cj}(t)$ modula la magnitud del ajuste sináptico de las neuronas vecinas a la ganadora (BMU), contrayendo su radio de influencia con el avance de las iteraciones.',
                'El aprendizaje es supervisado y requiere conocer a priori la clase objetivo de cada vector de entrada para actualizar los pesos.',
                'La red preserva la topología del espacio de entrada, de modo que patrones con pequeña distancia euclídea activan neuronas contiguas en el mapa de salida.'
            ],
            'correctas': [0, 1, 3],
            'explicacion': 'En la red SOM de Kohonen con conexiones laterales:\n  * **Las opciones 1, 2 y 4 son verdaderas:**\n    - El modelo biológico del Sombrero Mexicano implementa cooperación local mediante conexiones excitatorias de corto alcance e inhibición lateral a media/larga distancia para concentrar la respuesta en un único grupo ganador (*winner-take-all* suave).\n    - La función de vecindad $h_{cj}(t) = \\exp\\left(-\\frac{\\text{dist}^2(c, j)}{2\\sigma(t)^2}\\right)$ disminuye tanto con la distancia topológica a la BMU como con el tiempo, contrayendo $\\sigma(t)$ para pasar de autoorganización global a ajuste fino local.\n    - La propiedad central de SOM es la preservación topológica (*topological ordering*): mapea relaciones de proximidad de $\\mathbb{R}^N$ sobre una grilla bidimensional o unidimensional.\n  * **La opción 3 es falsa:** SOM es un modelo de aprendizaje estrictamente **no supervisado**; los vectores de entrada no poseen etiquetas de clase.',
            'es_oficial': True,
            'es_p1': False,
            'fuente': 'Exámenes de Cátedra (Parciales y Finales)',
            'origen': 'Exámenes de Cátedra (Parciales y Finales)'
        },
        # MC-54: EBL y Teoría del Dominio
        {
            'id': 'MC-54',
            'tema': 'GENERAL_IA',
            'titulo': 'Aprendizaje Basado en Explicaciones (EBL): Rol Determinante de la Teoría del Dominio',
            'enunciado': 'En el paradigma de Aprendizaje Basado en Explicaciones (EBL - Explanation-Based Learning), en contraste con los métodos de aprendizaje inductivo empírico:',
            'opciones': [
                'El factor determinante y excluyente para su funcionamiento es contar previamente con una Teoría del Dominio (Domain Theory) completa y consistente.',
                'Es un método analítico-deductivo capaz de aprender y generalizar un concepto a partir de un único ejemplo de entrenamiento (one-shot learning).',
                'Requiere miles de instancias de entrenamiento para inferir hipótesis mediante correlación estadística y frecuencias relativas.',
                'Utiliza la teoría del dominio para construir una prueba formal que explica deductivamente por qué el ejemplo satisface el concepto meta, generalizándola mediante regresión de objetivos.'
            ],
            'correctas': [0, 1, 3],
            'explicacion': 'En el paradigma EBL:\n  * **Las opciones 1, 2 y 4 son verdaderas:**\n    - La disponibilidad de una Teoría del Dominio previa (axiomas, reglas y relaciones causales) es el factor determinante indispensable; sin ella no es posible construir la explicación deductiva fundacional.\n    - Al apoyarse en razonamiento deductivo a partir de la teoría del dominio, el sistema puede extraer el concepto general a partir de un único ejemplo positivo (*one-shot learning*).\n    - El algoritmo EBL construye un árbol de demostración formal y luego sustituye las constantes específicas del ejemplo por variables generales mediante regresión de objetivos (*Goal Regression* / EBG), asegurando que la regla aprendida preserve validez deductiva.\n  * **La opción 3 es falsa:** La necesidad de grandes volúmenes de datos estadísticos caracteriza al aprendizaje inductivo empírico (como redes neuronales, árboles de decisión o Naive Bayes), no al aprendizaje deductivo EBL.',
            'es_oficial': True,
            'es_p1': False,
            'fuente': 'Exámenes de Cátedra (Parciales y Finales)',
            'origen': 'Exámenes de Cátedra (Parciales y Finales)'
        },
        # MC-55: Clustering Jerárquico Propiedades Comparativas
        {
            'id': 'MC-55',
            'tema': 'CLUSTERING',
            'titulo': 'Clustering Jerárquico: Análisis Comparativo entre Single-Link, Complete-Link y Average-Link',
            'enunciado': 'Al evaluar las propiedades geométricas y de estabilidad de los métodos clásicos de enlace en clustering jerárquico aglomerativo:',
            'opciones': [
                'El método Single-Link (distancia mínima entre pares) sufre del efecto de encadenamiento (chaining effect), tendiendo a fusionar grupos distintos a través de puentes de puntos ruidosos.',
                'El método Complete-Link (distancia máxima entre pares) es más conservador y tiende a generar cúmulos compactos, esféricos y de diámetros homogéneos.',
                'El método Average-Link calcula la distancia inter-cluster evaluando exclusivamente la distancia euclídea entre los centroides de ambos grupos.',
                'El método Average-Link calcula la media aritmética de todas las distancias entre pares cruzados de instancias de ambos grupos, ofreciendo un compromiso equilibrado frente al ruido.'
            ],
            'correctas': [0, 1, 3],
            'explicacion': 'Análisis de métodos de enlace en clustering jerárquico:\n  * **Las opciones 1, 2 y 4 son verdaderas:**\n    - Por definir la disimilitud como $d(A, B) = \\min_{x \\in A, y \\in B} d(x, y)$, Single Link es vulnerable al efecto de encadenamiento (*chaining*), formando cadenas alargadas o serpenteantes si existen instancias intermedias dispersas.\n    - Complete Link define $d(A, B) = \\max_{x \\in A, y \\in B} d(x, y)$, lo que exige que todos los puntos de ambos grupos estén próximos para fusionarse, produciendo cúmulos de diámetro reducido y formas compactas.\n    - Average Link (UPGMA) promedia todas las distancias punto a punto: $\\frac{1}{|A||B|} \\sum_{x \\in A} \\sum_{y \\in B} d(x, y)$, logrando una mayor estabilidad estadística ante ruido.\n  * **La opción 3 es falsa:** Ninguno de los tres enlaces clásicos (Single, Complete ni Average) utiliza centroides; el uso de centroides define métodos distintos como *Centroid Linkage* (UPGMC) o *Ward*.',
            'es_oficial': True,
            'es_p1': False,
            'fuente': 'Exámenes de Cátedra (Parciales y Finales)',
            'origen': 'Exámenes de Cátedra (Parciales y Finales)'
        },
        # MC-56: KNN Ponderado por Distancia Inversa
        {
            'id': 'MC-56',
            'tema': 'KNN',
            'titulo': 'Clasificador $K$-NN Ponderado: Ponderación por Inversa al Cuadrado y Robustez ante Hiperparámetros',
            'enunciado': 'En el clasificador $K$-NN ponderado por distancia inversa con pesos $w_i = \\frac{1}{d(\\mathbf{x}_q, \\mathbf{x}_i)^2}$:',
            'opciones': [
                'Las instancias de entrenamiento más cercanas a la consulta adquieren un peso dominante, mientras que las instancias lejanas u outliers ejercen un impacto infinitesimal en la votación.',
                'Se mitiga sustancialmente la sensibilidad ante la elección de $k$, permitiendo incluso utilizar todo el dataset ($k = N$) sin que las regiones lejanas distorsionen la decisión local.',
                'Es imprescindible normalizar o estandarizar las variables continuas cuando poseen rangos de escala significativamente dispares para evitar distorsiones métricas.',
                'El algoritmo exige que las clases sean linealmente separables en el espacio de entrada para asegurar convergencia teórica.'
            ],
            'correctas': [0, 1, 2],
            'explicacion': 'Propiedades del algoritmo $K$-NN ponderado por distancia inversa:\n  * **Las opciones 1, 2 y 3 son verdaderas:**\n    - La ponderación $w_i = \\frac{1}{d^2}$ decae cuadráticamente con la distancia. Esto protege la decisión local frente a outliers alejados y hace que fijar $k = N$ sea viable sin que la clase mayoritaria global degrade el voto del entorno inmediato.\n    - Como cualquier método basado en distancias euclídeas, atributos con magnitudes numéricas grandes dominarían artificialmente el cálculo de distancia si no se normalizan al intervalo $[0, 1]$ o a media cero y varianza unitaria.\n  * **La opción 4 es falsa:** $K$-NN es un clasificador no paramétrico y local que aproxima fronteras de Voronoi altamente no lineales; no asume ninguna hipótesis de separabilidad lineal.',
            'es_oficial': True,
            'es_p1': False,
            'fuente': 'Exámenes de Cátedra (Parciales y Finales)',
            'origen': 'Exámenes de Cátedra (Parciales y Finales)'
        },
        # MC-57: Término de Momento en MLP
        {
            'id': 'MC-57',
            'tema': 'MLP',
            'titulo': 'Perceptrón Multicapa: Dinámica Física e Inercia del Término de Momento ($\\beta$)',
            'enunciado': 'En el entrenamiento de un Perceptrón Multicapa (MLP) mediante Backpropagation, la regla de actualización con término de momento es $\\Delta w(t) = -\\alpha \\nabla E(t) + \\beta \\Delta w(t-1)$ con $\\beta \\in [0, 1)$. Respecto a su efecto físico y dinámico:',
            'opciones': [
                'Actúa como una masa inercial que acumula velocidad en zonas de pendiente consistente (mesetas llanas), acelerando la marcha del algoritmo hacia el mínimo.',
                'En valles estrechos con curvas de nivel alargadas donde el gradiente oscila abruptamente entre paredes opuestas, amortigua las componentes de alta frecuencia estabilizando el descenso.',
                'El término de momento $\\beta \\Delta w(t-1)$ es un vector que puede tomar valores numéricos negativos cuando el peso disminuyó en la iteración previa.',
                'El término de momento elimina la necesidad de fijar la tasa de aprendizaje $\\alpha$, volviendo prescindible el cálculo del gradiente de error.'
            ],
            'correctas': [0, 1, 2],
            'explicacion': 'Dinámica del término de momento en MLP:\n  * **Las opciones 1, 2 y 3 son verdaderas:**\n    - El parámetro inercial $\\beta$ suma una fracción del desplazamiento anterior. Si los gradientes son coherentes en signo, la velocidad efectiva aumenta $\\Delta w_{\\max} \\approx \\frac{-\\alpha \\nabla E}{1-\\beta}$ (atravesando mesetas llanas rápidamente). Si los gradientes alternan de signo, los términos sucesivos se contrarrestan, cancelando oscilaciones transversales estériles y conduciendo la actualización hacia el fondo del cañón.\n    - Aunque el coeficiente escalar $\\beta \\ge 0$ es no negativo, el término de momento $\\beta \\Delta w(t-1) = \\beta (w(t) - w(t-1))$ adopta signo negativo siempre que $w(t) < w(t-1)$, siendo una trampa conceptual clásica de examen.\n  * **La opción 4 es falsa:** El momento complementa y modula el gradiente local guiado por $\\alpha$, pero jamás sustituye al vector gradiente $\\nabla E$ ni a la tasa de aprendizaje.',
            'es_oficial': True,
            'es_p1': False,
            'fuente': 'Exámenes de Cátedra (Parciales y Finales)',
            'origen': 'Exámenes de Cátedra (Parciales y Finales)'
        },
        # MC-58: SVM y multiplicadores de Lagrange KKT
        {
            'id': 'MC-58',
            'tema': 'SVM',
            'titulo': 'Support Vector Machines: Multiplicadores de Lagrange $\\alpha_i$ y Condiciones KKT de Soporte',
            'enunciado': 'En la formulación dual de una Support Vector Machine lineal para datos linealmente separables, las condiciones de holgura complementaria de Karush-Kuhn-Tucker (KKT) establecen $\\alpha_i [y_i(\\mathbf{w}^T \\mathbf{x}_i + b) - 1] = 0$ con $\\alpha_i \\ge 0$. De acuerdo con este criterio:',
            'opciones': [
                'Los vectores de soporte son exclusivamente aquellos situados sobre los hiperplanos de margen ($y_i(\\mathbf{w}^T \\mathbf{x}_i + b) = 1$), para los cuales $\\alpha_i > 0$.',
                'Para todas las instancias interiores que no son de soporte ($y_i(\\mathbf{w}^T \\mathbf{x}_i + b) > 1$), sus multiplicadores de Lagrange son idénticamente nulos ($\\alpha_i = 0$).',
                'El vector director normal del hiperplano depende de la suma de todo el dataset: $\\mathbf{w} = \\sum_{i=1}^N \\alpha_i y_i \\mathbf{x}_i$, pero solo los vectores de soporte con $\\alpha_i > 0$ contribuyen activamente a su valor.',
                'Si se eliminara del conjunto de entrenamiento un vector interior (con $\\alpha_i = 0$), el hiperplano óptimo y los márgenes variarían drásticamente.'
            ],
            'correctas': [0, 1, 2],
            'explicacion': 'Condiciones KKT y multiplicadores de Lagrange en SVM:\n  * **Las opciones 1, 2 y 3 son verdaderas:**\n    - Por holgura complementaria KKT, el producto $\\alpha_i [y_i(\\mathbf{w}^T \\mathbf{x}_i + b) - 1]$ debe anularse para toda instancia $i$. Si el punto se sitúa estrictamente detrás del margen ($y_i(\\mathbf{w}^T \\mathbf{x}_i + b) > 1$), el corchete es estrictamente positivo, obligando a que $\\alpha_i = 0$. Únicamente cuando la instancia descansa exactamente sobre el margen límite ($y_i(\\mathbf{w}^T \\mathbf{x}_i + b) = 1$), el multiplicador puede ser positivo ($\\alpha_i > 0$), definiendo un vector de soporte.\n    - Como $\\alpha_i = 0$ para todos los puntos no soporte, el vector de pesos $\\mathbf{w} = \\sum_{i \\in \\text{SV}} \\alpha_i y_i \\mathbf{x}_i$ es una combinación lineal dispersa (*sparse*) sustentada únicamente en los vectores de soporte.\n  * **La opción 4 es falsa:** La remoción o desplazamiento de cualquier punto interior que mantenga $\\alpha_i = 0$ no produce alteración alguna en la frontera de separación ni en los márgenes de decisión.',
            'es_oficial': True,
            'es_p1': False,
            'fuente': 'Exámenes de Cátedra (Parciales y Finales)',
            'origen': 'Exámenes de Cátedra (Parciales y Finales)'
        },
        # MC-59: Hopfield Ortogonalidad Estricta y Diagonal Nula
        {
            'id': 'MC-59',
            'tema': 'HOPFIELD',
            'titulo': 'Redes de Hopfield: Ortogonalidad Estricta de Patrones y Condición de Diagonal Nula ($w_{ii}=0$)',
            'enunciado': 'En el modelo autoasociativo discreto de Hopfield con estados bipolares $s_i \\in \\{-1, +1\\}$ y matriz de pesos Hebbiana $\\mathbf{W}$:',
            'opciones': [
                'La ortogonalidad estricta entre dos patrones memorizados $\\mathbf{e}^{(k)}$ y $\\mathbf{e}^{(m)}$ exige que su producto escalar sea nulo ($\\sum_{i=1}^N e_i^{(k)} e_i^{(m)} = 0$), lo que significa que difieren exactamente en el 50% de sus componentes.',
                'La condición de diagonal nula ($w_{ii} = 0$) anula la auto-retroalimentación directa de cada neurona sobre sí misma, impidiendo dinámicas de autoexcitación desestabilizadoras.',
                'La simetría $\\mathbf{W} = \\mathbf{W}^T$ junto con $w_{ii} = 0$ garantiza matemáticamente la convergencia monótona de la función de energía de Lyapunov ($E = -\\frac{1}{2} \\sum \\sum w_{ij} s_i s_j$) hacia un atractor estable en actualización asincrónica.',
                'Si los patrones a memorizar poseen alta correlación positiva entre sí (no ortogonales), la capacidad de almacenamiento efectivo aumenta debido al refuerzo sináptico mutuo.'
            ],
            'correctas': [0, 1, 2],
            'explicacion': 'Propiedades fundamentales de las redes de Hopfield:\n  * **Las opciones 1, 2 y 3 son verdaderas:**\n    - La ortogonalidad en el espacio bipolar $\\{-1, +1\\}^N$ se define por $\\mathbf{e}^{(k)} \\cdot \\mathbf{e}^{(m)} = 0$, requiriendo que exactamente la mitad ($N/2$) de las componentes coincidan (+1) y la otra mitad difiera (-1). Esto anula los términos de interferencia cruzada (*crosstalk*) en la regla Hebbiana.\n    - La fijación de $w_{ii} = 0$ elimina bucles reflexivos y, unida a la simetría $w_{ij} = w_{ji}$, asegura que ante la actualización asincrónica de la neurona $k$, el cambio de energía sea $\\Delta E = -\\Delta s_k \\cdot \\text{net}_k \\le 0$, asegurando que la red descienda sin ciclos oscilatorios a un mínimo de Lyapunov.\n  * **La opción 4 es falsa:** La correlación cruzada entre patrones no ortogonales genera diafonía destructiva, degrada drásticamente la capacidad de recuperación libre de errores y genera mínimos espurios no deseados.',
            'es_oficial': True,
            'es_p1': False,
            'fuente': 'Exámenes de Cátedra (Parciales y Finales)',
            'origen': 'Exámenes de Cátedra (Parciales y Finales)'
        }
    ]

    existing_ids = set(q['id'] for q in data)
    for nq in nuevas_preguntas:
        if nq['id'] not in existing_ids:
            data.append(nq)
            existing_ids.add(nq['id'])

    # 3. Formateo y estandarización integral de todas las preguntas
    for i, q in enumerate(data, 1):
        q['nro'] = i
        q['titulo'] = normalizar_latex(q.get('titulo', ''))
        enun = normalizar_latex(q.get('enunciado', ''))
        q['enunciado'] = enun
        q['pregunta'] = enun
        q['opciones'] = [normalizar_latex(opt) for opt in q.get('opciones', [])]
        correctas = q.get('correctas', [])
        q['correctas'] = correctas
        q['multiple'] = (len(correctas) > 1)
        expl = normalizar_latex(q.get('explicacion', ''))
        q['explicacion'] = expl
        q['justificacion'] = expl
        origen = q.get('origen') or q.get('fuente') or 'Exámenes de Cátedra (Parciales y Finales)'
        q['origen'] = origen
        q['fuente'] = origen
        if 'es_oficial' not in q:
            q['es_oficial'] = True
        if 'es_p1' not in q:
            q['es_p1'] = False

    print(f"Total consolidado de preguntas tras enriquecimiento: {len(data)}")

    # Guardar preguntas_quiz.json
    with open(JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"[OK] Guardado JSON maestro en: {JSON_PATH}")

    # Guardar docs/data/preguntas.js
    with open(JS_PATH, 'w', encoding='utf-8') as f:
        f.write("// Base de Datos Maestra de Preguntas — Simulador Quiz UTN FRRe\n")
        f.write("// Cátedra de Inteligencia Artificial (Segundo Parcial)\n")
        f.write("// Generado automáticamente sin dependencias de build\n")
        f.write("window.PREGUNTAS = ")
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write(";\n")
    print(f"[OK] Guardado JS de producción en: {JS_PATH}")

if __name__ == '__main__':
    enrich_bank()
