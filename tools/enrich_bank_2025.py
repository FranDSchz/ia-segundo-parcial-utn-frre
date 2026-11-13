# -*- coding: utf-8 -*-
"""
Script de integración y etiquetado por año (Tags / Filtro de Año)
Incorpora las 20 preguntas oficiales del 2do Parcial de Teoría (Moodle 19/11/2025)
Cátedra de Inteligencia Artificial - UTN FRRe
"""
import os, sys, json, re

sys.stdout.reconfigure(encoding='utf-8')

ROOT_FACULTAD = r"c:\facultad\Inteligencia Artificial"
DEV_ROOT = r"C:\dev\ia-segundo-parcial-utn-frre"

JSON_PATH = os.path.join(ROOT_FACULTAD, "preguntas_quiz.json")

# Las 20 preguntas oficiales del examen Moodle 2do Parcial (19/11/2025)
MOODLE_2025_PREGUNTAS = [
    {
        "nro_examen": 1,
        "id_propuesto": "MC-2025-01",
        "tema": "HOPFIELD",
        "titulo": "Hopfield: Arquitectura de Entrada y Salida",
        "enunciado": "El modelo de Hopfield es una red neuronal de:",
        "opciones": [
            "A) N neuronas de entrada y M neuronas de salida.",
            "B) N neuronas de entrada y N neuronas de salida.",
            "C) N neuronas de entrada y N-1 neuronas de salida.",
            "D) N neuronas de entrada y M-1 neuronas de salida."
        ],
        "correctas": [1],
        "explicacion": "En el modelo autoasociativo discreto estándar de Hopfield, la red posee una única capa recurrente donde cada una de las $N$ neuronas recibe una componente del vector de entrada y produce una componente de la salida ($N$ entradas y $N$ salidas). No hay capas ocultas ni asimetría dimensional.",
        "es_oficial": True,
        "es_p1": False,
        "fuente": "2do Parcial Oficial UTN FRRe (Moodle 2025)",
        "origen": "2do Parcial Oficial UTN FRRe (Moodle 2025)",
        "multiple": False,
        "tags": ["2025", "OFICIAL", "PARCIAL_2"],
        "anio": "2025"
    },
    {
        "nro_examen": 2,
        "id_propuesto": "MC-2025-02",
        "tema": "MLP",
        "titulo": "Perceptrón Simple: Función de Transferencia",
        "enunciado": "La función de transferencia que utiliza el modelo del Perceptrón es:",
        "opciones": [
            "A) Sigmoidal.",
            "B) De escalón.",
            "C) Lineal (identidad).",
            "D) Tangente Hiperbólica."
        ],
        "correctas": [1],
        "explicacion": "El Perceptrón simple clásico de Rosenblatt utiliza exclusivamente una función de activación tipo escalón (Hard Limit / signo / Heaviside) que produce una salida discreta binaria $\\{0, 1\\}$ o bipolar $\\{-1, +1\\}$. Las funciones sigmoidal y tangente hiperbólica son derivables y corresponden a redes multicapa (MLP) entrenadas por gradiente descendente.",
        "es_oficial": True,
        "es_p1": False,
        "fuente": "2do Parcial Oficial UTN FRRe (Moodle 2025)",
        "origen": "2do Parcial Oficial UTN FRRe (Moodle 2025)",
        "multiple": False,
        "tags": ["2025", "OFICIAL", "PARCIAL_2"],
        "anio": "2025"
    },
    {
        "nro_examen": 3,
        "id_propuesto": "MC-2025-03",
        "tema": "SOM",
        "titulo": "SOM: Conexiones de la Capa de Salida",
        "enunciado": "En los Mapas Auto-organizados (SOM), cada neurona de salida:",
        "opciones": [
            "A) Está conectada a todas las demás neuronas de salida y posee conexiones autorrecurrentes.",
            "B) Está conectada a todas las neuronas de entrada.",
            "C) Está conectada a todas las demás neuronas de salida y no posee conexiones autorrecurrentes."
        ],
        "correctas": [1],
        "explicacion": "En una red SOM de Kohonen, cada neurona de la capa de salida (ubicada en una grilla topológica 1D o 2D) posee un vector de pesos sinápticos completo conectado directamente a todas las neuronas de la capa de entrada ($d$ conexiones por neurona de salida). Entre las neuronas de salida no existen conexiones físicas cableadas: la interacción lateral de vecindad se modela algorítmicamente mediante la función $h(i)$.",
        "es_oficial": True,
        "es_p1": False,
        "fuente": "2do Parcial Oficial UTN FRRe (Moodle 2025)",
        "origen": "2do Parcial Oficial UTN FRRe (Moodle 2025)",
        "multiple": False,
        "tags": ["2025", "OFICIAL", "PARCIAL_2"],
        "anio": "2025"
    },
    {
        "nro_examen": 4,
        "id_propuesto": "MC-2025-04",
        "tema": "CLUSTERING",
        "titulo": "Clustering Jerárquico: Inicialización del Algoritmo Aglomerativo",
        "enunciado": "La línea 1 (uno) del algoritmo de clustering aglomerativo dice:",
        "opciones": [
            "A) Make each data point in the data set D a cluster.",
            "B) Find two clusters that are nearest to each other.",
            "C) Make a cluster with each pair of data points in the data set D."
        ],
        "correctas": [0],
        "explicacion": "En el pseudocódigo formal de Clustering Jerárquico Aglomerativo (Tan, Steinbach & Kumar / Han & Kamber), el paso inicial (línea 1) consiste en asignar cada elemento individual del dataset $D$ a su propio cluster singleton: *Make each data point in the data set D a cluster*. En las líneas posteriores (bucle iterativo) se buscan recursivamente los dos clusters con distancia mínima y se unen.",
        "es_oficial": True,
        "es_p1": False,
        "fuente": "2do Parcial Oficial UTN FRRe (Moodle 2025)",
        "origen": "2do Parcial Oficial UTN FRRe (Moodle 2025)",
        "multiple": False,
        "tags": ["2025", "OFICIAL", "PARCIAL_2"],
        "anio": "2025"
    },
    {
        "nro_examen": 5,
        "id_propuesto": "MC-2025-05",
        "tema": "MLP",
        "titulo": "Backpropagation: Arquitectura de Conexiones",
        "enunciado": "Una red neuronal de propagación hacia atrás:",
        "opciones": [
            "A) Tiene únicamente conexiones hacia neuronas de capas posteriores.",
            "B) Tiene conexiones hacia neuronas de capas posteriores y hacia neuronas de la misma capa.",
            "C) Tiene conexiones hacia neuronas de capas posteriores y hacia neuronas de capas anteriores."
        ],
        "correctas": [1, 2],
        "explicacion": "Criterio oficial de Cátedra: Las arquitecturas generales entrenadas con algoritmos de propagación hacia atrás abarcan tanto redes feedforward estándar con posibles conexiones laterales intracapa (opción B), como redes recurrentes con retroalimentación hacia capas anteriores o de contexto (opción C, p. ej. redes de Elman y Jordan). Por ello, ambas configuraciones extendidas son computacionalmente admitidas.",
        "es_oficial": True,
        "es_p1": False,
        "fuente": "2do Parcial Oficial UTN FRRe (Moodle 2025)",
        "origen": "2do Parcial Oficial UTN FRRe (Moodle 2025)",
        "multiple": True,
        "tags": ["2025", "OFICIAL", "PARCIAL_2"],
        "anio": "2025"
    },
    {
        "nro_examen": 6,
        "id_propuesto": "MC-2025-06",
        "tema": "MLP",
        "titulo": "Neurona Artificial: Ecuación de Salida",
        "enunciado": "La salida de una neurona $i$ está determinada por:",
        "opciones": [
            "A) $f(x_1, x_2, \\dots, x_n)$",
            "B) $f(w_1, w_2, \\dots, w_n)$",
            "C) $f(\\text{Net}_i)$",
            "D) $\\text{Net}_i$"
        ],
        "correctas": [2],
        "explicacion": "En el modelo formal de neurona artificial, la salida $y_i$ se obtiene aplicando la función de transferencia no lineal $f$ a la suma ponderada neta o potencial postsináptico: $y_i = f(\\text{Net}_i)$, donde $\\text{Net}_i = \\sum_{j=1}^n w_{ij} x_j - \\theta_i$.",
        "es_oficial": True,
        "es_p1": False,
        "fuente": "2do Parcial Oficial UTN FRRe (Moodle 2025)",
        "origen": "2do Parcial Oficial UTN FRRe (Moodle 2025)",
        "multiple": False,
        "tags": ["2025", "OFICIAL", "PARCIAL_2"],
        "anio": "2025"
    },
    {
        "nro_examen": 7,
        "id_propuesto": "MC-2025-07",
        "tema": "HOPFIELD",
        "titulo": "Hopfield: Matriz de Pesos con M Patrones",
        "enunciado": "En el modelo de Hopfield, con $M$ patrones, los pesos de las conexiones se obtienen calculando:",
        "opciones": [
            "A) $W = \\sum_{i=1}^N (E_i^T \\cdot E_i) - I$",
            "B) $W = \\sum_{i=1}^M (E_i^T \\cdot E_i) + I$",
            "C) $W = \\sum_{i=1}^M (E_i \\cdot E_i) - I$",
            "D) $W = \\sum_{i=1}^M (E_i^T \\cdot E_i) - I$"
        ],
        "correctas": [3],
        "explicacion": "En el aprendizaje hebbiano de Hopfield con $M$ patrones bipolares de entrenamiento, la matriz de pesos sinápticos es la suma de los productos exteriores de los $M$ vectores menos la matriz identidad $I$ para anular las conexiones autorrecurrentes ($w_{ii} = 0$): $W = \\sum_{k=1}^M (E_k^T \\cdot E_k) - I$.",
        "es_oficial": True,
        "es_p1": False,
        "fuente": "2do Parcial Oficial UTN FRRe (Moodle 2025)",
        "origen": "2do Parcial Oficial UTN FRRe (Moodle 2025)",
        "multiple": False,
        "tags": ["2025", "OFICIAL", "PARCIAL_2"],
        "anio": "2025"
    },
    {
        "nro_examen": 8,
        "id_propuesto": "MC-2025-08",
        "tema": "SOM",
        "titulo": "SOM: Regla de Actualización de Pesos Sinápticos",
        "enunciado": "La expresión de actualización del peso $w_{ji}$ de un SOM es (siendo $e_i$ el componente $i$-ésimo de la entrada, $a(t)$ el factor de aprendizaje y $h_j$ la función de vecindad):",
        "opciones": [
            "A) $w_{ji}(t+1) = w_{ji}(t) + a(t) \\cdot h_j \\cdot [e_i - w_{ji}(t)]$",
            "B) $w_{ji}(t+1) = w_{ji}(t) + a(t) \\cdot h_j \\cdot [e_i + w_{ji}(t)]$",
            "C) $w_{ji}(t+1) = w_{ji}(t) + a(t) \\cdot h_j \\cdot [w_{ji}(t) - e_i]$"
        ],
        "correctas": [0],
        "explicacion": "La regla de Kohonen desplaza los vectores de pesos de la neurona ganadora y sus vecinas topológicas hacia el patrón de entrada $e$: $\\Delta w_{ji} = a(t) \\cdot h_j \\cdot [e_i - w_{ji}(t)]$, de donde $w_{ji}(t+1) = w_{ji}(t) + a(t) h_j [e_i - w_{ji}(t)]$.",
        "es_oficial": True,
        "es_p1": False,
        "fuente": "2do Parcial Oficial UTN FRRe (Moodle 2025)",
        "origen": "2do Parcial Oficial UTN FRRe (Moodle 2025)",
        "multiple": False,
        "tags": ["2025", "OFICIAL", "PARCIAL_2"],
        "anio": "2025"
    },
    {
        "nro_examen": 9,
        "id_propuesto": "MC-2025-09",
        "tema": "ALGORITMOS_GENETICOS",
        "titulo": "Algoritmos Genéticos: Definición de Convergencia Prematura",
        "enunciado": "En Algoritmos Genéticos, la convergencia prematura se da cuando uno o más individuos:",
        "opciones": [
            "A) Dominan rápidamente la población antes de que se haya hecho una exploración amplia del espacio de búsqueda.",
            "B) Aplican siempre los mismos operadores genéticos.",
            "C) Convergen a la solución después de haber explorado ampliamente el espacio de búsqueda.",
            "D) Comparten el mismo valor de aptitud."
        ],
        "correctas": [0],
        "explicacion": "La convergencia prematura ocurre cuando cromosomas con aptitud relativa muy alta en las generaciones iniciales acaparan la selección por ruleta, reduciendo rápidamente la diversidad genética y atrapando al algoritmo genético en un óptimo local antes de explorar adecuadamente el espacio de estados.",
        "es_oficial": True,
        "es_p1": False,
        "fuente": "2do Parcial Oficial UTN FRRe (Moodle 2025)",
        "origen": "2do Parcial Oficial UTN FRRe (Moodle 2025)",
        "multiple": False,
        "tags": ["2025", "OFICIAL", "PARCIAL_2"],
        "anio": "2025"
    },
    {
        "nro_examen": 10,
        "id_propuesto": "MC-2025-10",
        "tema": "MLP",
        "titulo": "MLP: Criterio de Parada por Error Global",
        "enunciado": "Sin considerar error de validación, ni test, el algoritmo de aprendizaje de las redes MLP finaliza cuando el error global es:",
        "opciones": [
            "A) Menor al error mínimo aceptable.",
            "B) Menor a la diferencia entre la salida deseada y la salida obtenida.",
            "C) Igual a cero.",
            "D) Igual al gradiente descendente."
        ],
        "correctas": [0],
        "explicacion": "En el entrenamiento estándar de Backpropagation sobre el conjunto de entrenamiento, el criterio de convergencia de parada primaria se satisface cuando el error global cuadrático de la época desciende por debajo de un umbral de tolerancia predefinido denominado 'error mínimo aceptable' ($E \\le \\varepsilon_{\\text{min}}$).",
        "es_oficial": True,
        "es_p1": False,
        "fuente": "2do Parcial Oficial UTN FRRe (Moodle 2025)",
        "origen": "2do Parcial Oficial UTN FRRe (Moodle 2025)",
        "multiple": False,
        "tags": ["2025", "OFICIAL", "PARCIAL_2"],
        "anio": "2025"
    },
    {
        "nro_examen": 11,
        "id_propuesto": "MC-2025-11",
        "tema": "HOPFIELD",
        "titulo": "Hopfield: Condición Textual de Ortogonalidad",
        "enunciado": "La condición de ortogonalidad de las redes de Hopfield (con $N$ neuronas) establece que:",
        "opciones": [
            "A) Los patrones, tomados de a pares, deben tener al menos 50% de los elementos análogos diferentes.",
            "B) Los pesos de las conexiones deben ser ortogonales.",
            "C) Las neuronas deben ser ortogonales.",
            "D) Los patrones, tomados de a pares, deben tener N-1 elementos análogos diferentes."
        ],
        "correctas": [0],
        "explicacion": "Para que dos patrones bipolares $\\{-1, +1\\}^N$ sean ortogonales ($E_a \\cdot E_b = 0$), deben coincidir en exactamente $N/2$ componentes y diferir en las otras $N/2$. Por lo tanto, tomados de a pares deben tener al menos el 50% de sus elementos análogos diferentes (distancia de Hamming $d_H \\ge N/2$).",
        "es_oficial": True,
        "es_p1": False,
        "fuente": "2do Parcial Oficial UTN FRRe (Moodle 2025)",
        "origen": "2do Parcial Oficial UTN FRRe (Moodle 2025)",
        "multiple": False,
        "tags": ["2025", "OFICIAL", "PARCIAL_2"],
        "anio": "2025"
    },
    {
        "nro_examen": 12,
        "id_propuesto": "MC-2025-12",
        "tema": "ALGORITMOS_GENETICOS",
        "titulo": "Algoritmos Genéticos: Naturaleza de la Selección por Ruleta",
        "enunciado": "En Algoritmos Genéticos, la selección mediante ruleta:",
        "opciones": [
            "A) Es un operador que combina individuos seleccionados mediante ranuras de una ruleta.",
            "B) Es un operador que modifica individuos utilizando ranuras de una ruleta.",
            "C) Es un método basado en orden.",
            "D) Es un método proporcional."
        ],
        "correctas": [3],
        "explicacion": "La ruleta es el método canónico de Selección Proporcional a la Aptitud (*Fitness Proportionate Selection*): el tamaño angular del slot asignado a cada individuo en el espacio $[0, 1)$ es exactamente proporcional a su aptitud normalizada $p_i = f_i / \\sum f$. No es un método basado en ranking u orden ni un operador genético de modificación.",
        "es_oficial": True,
        "es_p1": False,
        "fuente": "2do Parcial Oficial UTN FRRe (Moodle 2025)",
        "origen": "2do Parcial Oficial UTN FRRe (Moodle 2025)",
        "multiple": False,
        "tags": ["2025", "OFICIAL", "PARCIAL_2"],
        "anio": "2025"
    },
    {
        "nro_examen": 13,
        "id_propuesto": "MC-2025-13",
        "tema": "MLP",
        "titulo": "Perceptrón: Propósito del Factor de Aprendizaje",
        "enunciado": "En el modelo del Perceptrón, el factor de aprendizaje (alfa) se utiliza para:",
        "opciones": [
            "A) Actualizar la función de transferencia.",
            "B) Modificar las entradas de la red.",
            "C) Regular la velocidad del aprendizaje.",
            "D) Definir el espacio de entradas y pesos."
        ],
        "correctas": [2],
        "explicacion": "El hiperparámetro de tasa o factor de aprendizaje $\\alpha$ controla la magnitud del paso de ajuste aplicado a los pesos en cada iteración ($\\Delta w_i = \\alpha \\cdot e \\cdot x_i$), regulando de forma directa la velocidad y la estabilidad de la convergencia hacia el hiperplano separador.",
        "es_oficial": True,
        "es_p1": False,
        "fuente": "2do Parcial Oficial UTN FRRe (Moodle 2025)",
        "origen": "2do Parcial Oficial UTN FRRe (Moodle 2025)",
        "multiple": False,
        "tags": ["2025", "OFICIAL", "PARCIAL_2"],
        "anio": "2025"
    },
    {
        "nro_examen": 14,
        "id_propuesto": "MC-2025-14",
        "tema": "MLP",
        "titulo": "Regla Delta Generalizada: Justificación de Generalización",
        "enunciado": "La regla delta generalizada es la generalización de la regla delta debido a que:",
        "opciones": [
            "A) Generaliza la utilización del aprendizaje no supervisado para problemas de clasificación.",
            "B) Provee un mecanismo para la actualización de los pesos de las capas intermedias de la red neuronal.",
            "C) Generaliza la utilización de las redes neuronales en diferentes campos.",
            "D) Utiliza la generalización de los patrones de entrada para obtener clasificaciones más precisas."
        ],
        "correctas": [1],
        "explicacion": "La regla delta clásica de Widrow-Hoff solo permitía actualizar capas conectadas directamente a una salida deseada supervisada. La regla delta generalizada (Backpropagation) utiliza la regla de la cadena para propagar los errores hacia atrás, proveyendo por primera vez una fórmula analítica para actualizar los pesos de las capas ocultas o intermedias.",
        "es_oficial": True,
        "es_p1": False,
        "fuente": "2do Parcial Oficial UTN FRRe (Moodle 2025)",
        "origen": "2do Parcial Oficial UTN FRRe (Moodle 2025)",
        "multiple": False,
        "tags": ["2025", "OFICIAL", "PARCIAL_2"],
        "anio": "2025"
    },
    {
        "nro_examen": 15,
        "id_propuesto": "MC-2025-15",
        "tema": "NAIVE_BAYES",
        "titulo": "Naïve Bayes con Histogramas: Dimensiones y Clases",
        "enunciado": "El clasificador Naïve Bayes con histogramas:",
        "opciones": [
            "A) Funciona correctamente para problemas con más de dos clases.",
            "B) Utiliza la media de los datos en atributo como probabilidad a priori.",
            "C) Funciona correctamente para problemas con más de dos dimensiones.",
            "D) Necesita conocer la distribución de los datos para hacer una clasificación más eficiente."
        ],
        "correctas": [0, 2],
        "explicacion": "El enfoque de Naïve Bayes con histogramas discretiza atributos continuos en intervalos o bins sin requerir supuestos paramétricos de distribución previa (como normalidad), y opera de forma consistente tanto para problemas multiclase ($K > 2$) como multidimensionales ($d > 2$) gracias a la hipótesis de independencia condicional.",
        "es_oficial": True,
        "es_p1": False,
        "fuente": "2do Parcial Oficial UTN FRRe (Moodle 2025)",
        "origen": "2do Parcial Oficial UTN FRRe (Moodle 2025)",
        "multiple": True,
        "tags": ["2025", "OFICIAL", "PARCIAL_2"],
        "anio": "2025"
    },
    {
        "nro_examen": 16,
        "id_propuesto": "MC-2025-16",
        "tema": "KMEANS",
        "titulo": "K-Means: Representación de la Tupla xi",
        "enunciado": "¿Qué representa la tupla $x_i = (x_1 \\dots x_r)$ en el algoritmo K-means?",
        "opciones": [
            "A) La cantidad de atributos presentes en los datos.",
            "B) La cantidad de elementos de data set.",
            "C) La cantidad de grupos a conformar entre los datos."
        ],
        "correctas": [0],
        "explicacion": "Criterio oficial de la Cátedra (apunte teórico de Clustering UTN FRRe): la tupla $x_i = (x_1, \\dots, x_r)$ formaliza el vector de características de la instancia $i$, donde el índice $r$ representa la cantidad de dimensiones o atributos que describen a los datos en el espacio euclídeo.",
        "es_oficial": True,
        "es_p1": False,
        "fuente": "2do Parcial Oficial UTN FRRe (Moodle 2025)",
        "origen": "2do Parcial Oficial UTN FRRe (Moodle 2025)",
        "multiple": False,
        "tags": ["2025", "OFICIAL", "PARCIAL_2"],
        "anio": "2025"
    },
    {
        "nro_examen": 17,
        "id_propuesto": "MC-2025-17",
        "tema": "MLP",
        "titulo": "ADALINE: Función Objetivo de la Regla Delta",
        "enunciado": "El modelo ADALINE utiliza la regla delta, cuyo objetivo es:",
        "opciones": [
            "A) Minimizar el error cuadrático cometido por todos los patrones de entrada.",
            "B) Minimizar el error de propagación hacia atrás.",
            "C) Minimizar el error cuadrático medio cometido por todos los patrones de entrada.",
            "D) Minimizar el error de los pesos de las conexiones."
        ],
        "correctas": [2],
        "explicacion": "El objetivo formal de la regla delta de Widrow-Hoff (LMS) en el ADALINE es minimizar el Error Cuadrático Medio (ECM / MSE) calculado sobre todos los patrones de entrenamiento: $E = \\frac{1}{2P} \\sum_{p=1}^P (d_p - \\text{Net}_p)^2$, aplicando descenso por gradiente en la superficie parabólica continua del error.",
        "es_oficial": True,
        "es_p1": False,
        "fuente": "2do Parcial Oficial UTN FRRe (Moodle 2025)",
        "origen": "2do Parcial Oficial UTN FRRe (Moodle 2025)",
        "multiple": False,
        "tags": ["2025", "OFICIAL", "PARCIAL_2"],
        "anio": "2025"
    },
    {
        "nro_examen": 18,
        "id_propuesto": "MC-2025-18",
        "tema": "MLP",
        "titulo": "MLP: Efecto del Término de Momento",
        "enunciado": "La utilización del término de momento en el algoritmo de la regla delta generalizada:",
        "opciones": [
            "A) Disminuye la cantidad de patrones necesarios para estabilizar los pesos de la red.",
            "B) Disminuye la propagación hacia adelante de los patrones de entrada.",
            "C) Acelera la convergencia de la red hacia pesos estables.",
            "D) Acelera la estabilización de las entradas y salidas deseadas."
        ],
        "correctas": [2],
        "explicacion": "El término de momento $\\alpha \\Delta w(t-1)$ aporta inercia a la actualización sináptica en la dirección predominante del gradiente, evitando oscilaciones en valles estrechos, atravesando mesetas de error planas y acelerando de forma demostrada la convergencia hacia pesos estables.",
        "es_oficial": True,
        "es_p1": False,
        "fuente": "2do Parcial Oficial UTN FRRe (Moodle 2025)",
        "origen": "2do Parcial Oficial UTN FRRe (Moodle 2025)",
        "multiple": False,
        "tags": ["2025", "OFICIAL", "PARCIAL_2"],
        "anio": "2025"
    },
    {
        "nro_examen": 19,
        "id_propuesto": "MC-2025-19",
        "tema": "HOPFIELD",
        "titulo": "Hopfield: Paradigma de Aprendizaje",
        "enunciado": "El algoritmo del modelo de Hopfield es:",
        "opciones": [
            "A) De aprendizaje supervisado.",
            "B) De aprendizaje no supervisado.",
            "C) De aprendizaje mixto.",
            "D) De aprendizaje semi-supervisado."
        ],
        "correctas": [1],
        "explicacion": "Criterio estricto de Cátedra: La red de Hopfield es clasificada como un modelo de **aprendizaje no supervisado** (o autoasociativo sin maestro), dado que calcula su matriz sináptica únicamente a través de la autocorrelación directa de los patrones de entrada ($W = \\sum E_k^T E_k - I$) sin requerir retroalimentación de error ni etiquetas de clase externas.",
        "es_oficial": True,
        "es_p1": False,
        "fuente": "2do Parcial Oficial UTN FRRe (Moodle 2025)",
        "origen": "2do Parcial Oficial UTN FRRe (Moodle 2025)",
        "multiple": False,
        "tags": ["2025", "OFICIAL", "PARCIAL_2"],
        "anio": "2025"
    },
    {
        "nro_examen": 20,
        "id_propuesto": "MC-2025-20",
        "tema": "NAIVE_BAYES",
        "titulo": "Naïve Bayes Continuo: Estimación de Parámetros",
        "enunciado": "El clasificador Naïve Bayes que utiliza distribuciones continuas de probabilidad, requiere el cálculo de:",
        "opciones": [
            "A) La media y el desvío estándar de cada clase.",
            "B) La media y el desvío estándar de cada atributo.",
            "C) Las probabilidades a priori de cada clase.",
            "D) Los parámetros de la distribución que se elija para clasificar por cada clase y cada atributo."
        ],
        "correctas": [3],
        "explicacion": "En la formulación canónica general de Naïve Bayes continuo, para calcular la verosimilitud $P(x_i | C_k)$ no necesariamente se usa una normal/gaussiana (pueden ser distribuciones exponenciales, log-normales o Gamma). Por ello, el principio general requiere estimar los parámetros específicos de la distribución elegida para cada combinación de clase y atributo.",
        "es_oficial": True,
        "es_p1": False,
        "fuente": "2do Parcial Oficial UTN FRRe (Moodle 2025)",
        "origen": "2do Parcial Oficial UTN FRRe (Moodle 2025)",
        "multiple": False,
        "tags": ["2025", "OFICIAL", "PARCIAL_2"],
        "anio": "2025"
    }
]

def firma(item):
    opts = item.get('opciones', [])
    first_opt = opts[0] if opts else ''
    return re.sub(r'\W+', '', (item.get('enunciado', '') + first_opt).lower())

def main():
    with open(JSON_PATH, 'r', encoding='utf-8') as f:
        bank = json.load(f)

    print(f"Banco actual: {len(bank)} preguntas.")

    # 1. Asegurar que todas las preguntas existentes tengan tags y anio
    for q in bank:
        if 'tags' not in q:
            # Deducir tags si es posible
            src = q.get('fuente', '') + ' ' + q.get('origen', '')
            if '2023' in src:
                q['tags'] = ['2023', 'PARCIAL_2']
                q['anio'] = '2023'
            elif '2021' in src:
                q['tags'] = ['2021', 'FINAL_O_MESAS']
                q['anio'] = '2021'
            elif '2020' in src:
                q['tags'] = ['2020', 'PARCIAL_2']
                q['anio'] = '2020'
            elif q.get('es_p1'):
                q['tags'] = ['P1_REPASO']
                q['anio'] = None
            else:
                q['tags'] = ['HISTORICO', 'CATEDRA']
                q['anio'] = None
        if 'anio' not in q:
            q['anio'] = None
        if 'pregunta' not in q:
            q['pregunta'] = q.get('enunciado', '')
        if 'justificacion' not in q:
            q['justificacion'] = q.get('explicacion', '')

    existing_stems = {firma(q): q for q in bank}
    agregadas = 0
    actualizadas = 0

    for q25 in MOODLE_2025_PREGUNTAS:
        f_key = firma(q25)
        if f_key in existing_stems:
            target = existing_stems[f_key]
            target['tags'] = q25['tags']
            target['anio'] = q25['anio']
            target['fuente'] = q25['fuente']
            target['origen'] = q25['origen']
            target['es_oficial'] = True
            target['titulo'] = q25['titulo']
            target['explicacion'] = q25['explicacion']
            target['justificacion'] = q25['explicacion']
            actualizadas += 1
            print(f"Actualizada pregunta existente: {target['id']}")
        else:
            # Nueva pregunta
            q_nueva = {
                "id": q25['id_propuesto'],
                "tema": q25['tema'],
                "titulo": q25['titulo'],
                "enunciado": q25['enunciado'],
                "opciones": q25['opciones'],
                "correctas": q25['correctas'],
                "explicacion": q25['explicacion'],
                "es_oficial": True,
                "es_p1": False,
                "fuente": q25['fuente'],
                "nro": len(bank) + 1,
                "origen": q25['origen'],
                "pregunta": q25['enunciado'],
                "multiple": q25['multiple'],
                "justificacion": q25['explicacion'],
                "tags": q25['tags'],
                "anio": q25['anio']
            }
            bank.append(q_nueva)
            existing_stems[f_key] = q_nueva
            agregadas += 1
            print(f"Agregada nueva pregunta oficial 2025: {q_nueva['id']} - {q_nueva['titulo']}")

    # Reindexar nro
    for idx, q in enumerate(bank, 1):
        q['nro'] = idx

    print(f"\nResumen: {agregadas} nuevas agregadas, {actualizadas} existentes actualizadas.")
    print(f"Total nuevo en banco: {len(bank)} preguntas.")

    # Guardar en facultad
    with open(JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(bank, f, indent=2, ensure_ascii=False)
    print(f"[OK] Guardado {JSON_PATH}")

    # Guardar en dev repo
    dev_json = os.path.join(DEV_ROOT, "preguntas_quiz.json")
    with open(dev_json, 'w', encoding='utf-8') as f:
        json.dump(bank, f, indent=2, ensure_ascii=False)
    print(f"[OK] Guardado {dev_json}")

    # Sincronizar docs/data/preguntas.js
    dev_js = os.path.join(DEV_ROOT, "docs", "data", "preguntas.js")
    js_content = "window.PREGUNTAS = " + json.dumps(bank, indent=2, ensure_ascii=False) + ";\n"
    with open(dev_js, 'w', encoding='utf-8') as f:
        f.write(js_content)
    print(f"[OK] Guardado {dev_js}")

if __name__ == '__main__':
    main()
