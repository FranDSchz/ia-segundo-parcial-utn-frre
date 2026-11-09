# -*- coding: utf-8 -*-
"""
Integración de las 8 preguntas teóricas inéditas descubiertas en 'Preguntas Segundo parcial Grupo 2 .docx'
Lleva el banco maestro a 87 preguntas auditadas.
"""
import json, os, sys

sys.stdout.reconfigure(encoding='utf-8')

ROOT_FAC = r"c:\facultad\Inteligencia Artificial"
ROOT_DEV = r"C:\dev\ia-segundo-parcial-utn-frre"

NUEVAS_PREGUNTAS = [
  {
    "id": "MC-2025-21",
    "tema": "SOM",
    "titulo": "SOM: Dimensionalidad de Entrada y Salida",
    "enunciado": "Los SOM son redes neuronales de:",
    "opciones": [
      "A) N neuronas de entrada y N-1 neuronas de salida.",
      "B) N neuronas de entrada y N neuronas de salida.",
      "C) N neuronas de entrada y M-1 neuronas de salida.",
      "D) N neuronas de entrada y M neuronas de salida."
    ],
    "correctas": [3],
    "explicacion": "Doctrina oficial de la Cátedra: Los mapas auto-organizados de Kohonen (SOM) proyectan un espacio de entrada continuo de $N$ dimensiones sobre un espacio discreto de salida conformado por una retícula topológica de $M$ neuronas (frecuentemente bidimensional). La cantidad de neuronas de salida ($M$) es independiente de la dimensión del vector de entrada ($N$).",
    "es_oficial": True,
    "es_p1": False,
    "fuente": "2do Parcial Oficial UTN FRRe (DOCX Grupo 2 - 2025)",
    "origen": "2do Parcial Oficial UTN FRRe (DOCX Grupo 2 - 2025)",
    "pregunta": "Los SOM son redes neuronales de:",
    "multiple": False,
    "justificacion": "Los mapas de Kohonen (SOM) mapean un espacio de entrada de $N$ dimensiones a un espacio de salida de $M$ dimensiones (generalmente una retícula bidimensional). La cantidad de neuronas de salida ($M$) es independiente de la dimensión de la entrada ($N$).",
    "tags": ["2025", "OFICIAL", "PARCIAL_2"],
    "anio": "2025"
  },
  {
    "id": "MC-2025-22",
    "tema": "MLP",
    "titulo": "Perceptrón Simple: Condición de Parada y Convergencia",
    "enunciado": "En el modelo del Perceptrón, el proceso de aprendizaje finaliza cuando:",
    "opciones": [
      "A) La variación de los pesos es mínima.",
      "B) Al menos el 90% de los patrones dan salida igual a la salida deseada.",
      "C) Se ha completado una época con error cero para todos los patrones.",
      "D) Se ha completado una época con error menor al error aceptable para todos los patrones."
    ],
    "correctas": [2],
    "explicacion": "Doctrina oficial de la Cátedra: Según el Teorema de Convergencia del Perceptrón, para conjuntos de entrenamiento linealmente separables el algoritmo garantiza alcanzar un vector de pesos que clasifica exactamente todos los patrones, finalizando cuando se completa una época completa con error cero. En cambio, en MLP se tolera un error menor a una cota prefijada.",
    "es_oficial": True,
    "es_p1": False,
    "fuente": "2do Parcial Oficial UTN FRRe (DOCX Grupo 2 - 2025)",
    "origen": "2do Parcial Oficial UTN FRRe (DOCX Grupo 2 - 2025)",
    "pregunta": "En el modelo del Perceptrón, el proceso de aprendizaje finaliza cuando:",
    "multiple": False,
    "justificacion": "Teóricamente, el algoritmo del Perceptrón simple garantiza la convergencia (teorema de convergencia del perceptrón) solo si los datos son linealmente separables, deteniéndose cuando clasifica correctamente todos los patrones de entrenamiento (error cero).",
    "tags": ["2025", "OFICIAL", "PARCIAL_2"],
    "anio": "2025"
  },
  {
    "id": "MC-2025-23",
    "tema": "NAIVE_BAYES",
    "titulo": "Naïve Bayes: Principio Básico del Clasificador",
    "enunciado": "El clasificador Naïve Bayes tiene como principio básico:",
    "opciones": [
      "A) Suponer que las clases son condicionalmente independientes entre sí.",
      "B) Suponer que los atributos son condicionalmente independientes entre sí.",
      "C) Suponer que las probabilidades a priori son iguales.",
      "D) Suponer que cada clase responde a la misma distribución de probabilidades."
    ],
    "correctas": [1],
    "explicacion": "Doctrina oficial de la Cátedra: La hipótesis simplificadora fundamental del modelo Naïve Bayes ('ingenuo') es asumir que los atributos o variables predictoras son condicionalmente independientes entre sí dada la clase observada. Las clases no son independientes entre sí (son mutuamente excluyentes).",
    "es_oficial": True,
    "es_p1": False,
    "fuente": "2do Parcial Oficial UTN FRRe (DOCX Grupo 2 - 2025)",
    "origen": "2do Parcial Oficial UTN FRRe (DOCX Grupo 2 - 2025)",
    "pregunta": "El clasificador Naïve Bayes tiene como principio básico:",
    "multiple": False,
    "justificacion": "El término 'Naïve' (ingenuo) proviene de la asunción simplificadora de que la presencia de una característica (atributo) particular en una clase no está relacionada con la presencia de ninguna otra característica (independencia condicional).",
    "tags": ["2025", "OFICIAL", "PARCIAL_2"],
    "anio": "2025"
  },
  {
    "id": "MC-2025-24",
    "tema": "MLP",
    "titulo": "Backpropagation: Fórmula de Incremento de Pesos",
    "enunciado": "Utilizando el algoritmo Backpropagation, el incremento del peso $w_{ji}$ es ($i \\to j$):",
    "opciones": [
      "A) Alfa por el error cometido en la neurona $i$ por la salida de la neurona $i$.",
      "B) Alfa por el error cometido en la neurona $j$ por la salida de la neurona $j$.",
      "C) Alfa por el error cometido en la neurona $j$ por la salida de la neurona $i$.",
      "D) Alfa por el error cometido en la neurona $i$ por la salida de la neurona $j$."
    ],
    "correctas": [2],
    "explicacion": "Doctrina oficial de la Cátedra: De acuerdo a la regla delta generalizada para la conexión dirigida desde la neurona de origen $i$ hacia la neurona de destino $j$, el incremento sináptico es $\\Delta w_{ji} = \\alpha \\cdot \\delta_j \\cdot y_i$, correspondiente a la tasa de aprendizaje $\\alpha$ multiplicada por el gradiente de error local de la neurona destino $j$ ($\\delta_j$) multiplicada por la salida o activación de la neurona origen $i$ ($y_i$).",
    "es_oficial": True,
    "es_p1": False,
    "fuente": "2do Parcial Oficial UTN FRRe (DOCX Grupo 2 - 2025)",
    "origen": "2do Parcial Oficial UTN FRRe (DOCX Grupo 2 - 2025)",
    "pregunta": "Utilizando el algoritmo Backpropagation, el incremento del peso $w_{ji}$ es ($i \\to j$):",
    "multiple": False,
    "justificacion": "La regla delta generalizada establece que el cambio de peso es proporcional a la tasa de aprendizaje ($\\alpha$), el gradiente local o error de la neurona destino ($\\delta_j$) y la salida de la neurona origen ($y_i$).",
    "tags": ["2025", "OFICIAL", "PARCIAL_2"],
    "anio": "2025"
  },
  {
    "id": "MC-2025-25",
    "tema": "MLP",
    "titulo": "Modelos Neuronales: Diferencia entre Perceptrón y ADALINE",
    "enunciado": "La diferencia entre el modelo del Perceptrón y del ADALINE es:",
    "opciones": [
      "A) La función de transferencia (del Perceptrón es de escalón y del ADALINE es lineal).",
      "B) El procesamiento de las entradas (del Perceptrón es de escalón y del ADALINE es lineal).",
      "C) El proceso de ajuste de los pesos.",
      "D) El tipo de aprendizaje que utilizan (el del Perceptrón es supervisado y el del ADALINE es semi-supervisado)."
    ],
    "correctas": [0],
    "explicacion": "Doctrina oficial de la Cátedra: Ambos modelos son monocapa y supervisados. La diferencia reside en la función de transferencia: el Perceptrón calcula el error a partir de la salida cuantizada por la función escalón, mientras que ADALINE (regla LMS / Widrow-Hoff) aplica una función de activación lineal (identidad) para calcular la diferencia con la salida deseada antes del umbral de decisión final.",
    "es_oficial": True,
    "es_p1": False,
    "fuente": "2do Parcial Oficial UTN FRRe (DOCX Grupo 2 - 2025)",
    "origen": "2do Parcial Oficial UTN FRRe (DOCX Grupo 2 - 2025)",
    "pregunta": "La diferencia entre el modelo del Perceptrón y del ADALINE es:",
    "multiple": False,
    "justificacion": "Aunque ambos son supervisados y estructuralmente similares, ADALINE (Adaptive Linear Element) utiliza una función de transferencia lineal (la suma ponderada neta) para calcular el error y ajustar pesos (regla Widrow-Hoff), mientras que el Perceptrón usa la salida cuantizada (escalón).",
    "tags": ["2025", "OFICIAL", "PARCIAL_2"],
    "anio": "2025"
  },
  {
    "id": "MC-2025-26",
    "tema": "MLP",
    "titulo": "MLP: Parada Temprana y Conjunto de Validación",
    "enunciado": "El error de validación se utiliza para detener el proceso de aprendizaje del modelo MLP cuando:",
    "opciones": [
      "A) Las iteraciones no son válidas.",
      "B) Los pesos de las conexiones no son válidos.",
      "C) Disminuye la capacidad de la red para clasificar patrones no utilizados para el entrenamiento.",
      "D) Aumenta el error de entrenamiento."
    ],
    "correctas": [2],
    "explicacion": "Doctrina oficial de la Cátedra: El conjunto de validación sirve para controlar el sobreentrenamiento (overfitting). Si durante el entrenamiento el error sobre el conjunto de validación comienza a incrementarse mientras el de entrenamiento sigue cayendo, significa que la red está perdiendo capacidad de generalización sobre datos no vistos, debiendo detenerse el entrenamiento (parada temprana / Early Stopping).",
    "es_oficial": True,
    "es_p1": False,
    "fuente": "2do Parcial Oficial UTN FRRe (DOCX Grupo 2 - 2025)",
    "origen": "2do Parcial Oficial UTN FRRe (DOCX Grupo 2 - 2025)",
    "pregunta": "El error de validación se utiliza para detener el proceso de aprendizaje del modelo MLP cuando:",
    "multiple": False,
    "justificacion": "Cuando el error de validación comienza a subir (mientras el de entrenamiento sigue bajando), indica overfitting (sobreajuste). Esto significa que la red está perdiendo su capacidad de generalización (su capacidad para clasificar correctamente patrones nuevos o no vistos).",
    "tags": ["2025", "OFICIAL", "PARCIAL_2"],
    "anio": "2025"
  },
  {
    "id": "MC-2025-27",
    "tema": "HOPFIELD",
    "titulo": "Redes de Hopfield: Clasificación por Dinámica Temporal",
    "enunciado": "El modelo de Hopfield es una red neuronal:",
    "opciones": [
      "A) Feedforward.",
      "B) Autorrecurrente.",
      "C) Backforward."
    ],
    "correctas": [1],
    "explicacion": "Doctrina oficial de la Cátedra: La red de Hopfield es una red asociativa puramente autorrecurrente (recurrent network) compuesta por una capa interconectada donde las salidas de las neuronas se retroalimentan como entradas de las demás hasta converger a un atractor o estado de equilibrio estable.",
    "es_oficial": True,
    "es_p1": False,
    "fuente": "2do Parcial Oficial UTN FRRe (DOCX Grupo 2 - 2025)",
    "origen": "2do Parcial Oficial UTN FRRe (DOCX Grupo 2 - 2025)",
    "pregunta": "El modelo de Hopfield es una red neuronal:",
    "multiple": False,
    "justificacion": "Las redes de Hopfield son redes recurrentes asociativas donde la salida de las neuronas se retroalimenta a las entradas de las otras neuronas en la red.",
    "tags": ["2025", "OFICIAL", "PARCIAL_2"],
    "anio": "2025"
  },
  {
    "id": "MC-2025-28",
    "tema": "HOPFIELD",
    "titulo": "Redes de Hopfield: Topología de Conexiones de Salida",
    "enunciado": "En el modelo de Hopfield, cada neurona de salida:",
    "opciones": [
      "A) Está conectada a todas las demás neuronas de salida y posee conexiones autorrecurrentes.",
      "B) Está conectada a todas las demás neuronas de salida y no posee conexiones autorrecurrentes.",
      "C) Está conectada a todas las neuronas de entrada."
    ],
    "correctas": [1],
    "explicacion": "Doctrina oficial de la Cátedra: En la red de Hopfield discreta clásica, la conectividad es completa entre neuronas distintas ($w_{ij} = w_{ji}$), pero la diagonal principal es nula ($w_{ii} = 0$), lo que significa que cada neurona de salida está conectada a todas las demás neuronas y no posee conexiones autorrecurrentes hacia sí misma.",
    "es_oficial": True,
    "es_p1": False,
    "fuente": "2do Parcial Oficial UTN FRRe (DOCX Grupo 2 - 2025)",
    "origen": "2do Parcial Oficial UTN FRRe (DOCX Grupo 2 - 2025)",
    "pregunta": "En el modelo de Hopfield, cada neurona de salida:",
    "multiple": False,
    "justificacion": "En la arquitectura estándar de Hopfield, la conectividad es total entre neuronas distintas, pero $w_{ii} = 0$ (una neurona no se conecta a sí misma; sin auto-bucles).",
    "tags": ["2025", "OFICIAL", "PARCIAL_2"],
    "anio": "2025"
  }
]

def main():
    json_path = os.path.join(ROOT_FAC, "preguntas_quiz.json")
    with open(json_path, 'r', encoding='utf-8') as f:
        bank = json.load(f)

    print(f"Banco actual: {len(bank)} preguntas.")
    ids_existentes = {q['id'] for q in bank}

    agregadas = 0
    for q in NUEVAS_PREGUNTAS:
        if q['id'] not in ids_existentes:
            bank.append(q)
            agregadas += 1
            print(f"Agregada: {q['id']} - {q['titulo']}")

    # Renumerar nro
    for idx, q in enumerate(bank, 1):
        q['nro'] = idx

    print(f"Nuevas agregadas: {agregadas}. Total: {len(bank)}")

    # Guardar en facultad
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(bank, f, indent=2, ensure_ascii=False)
    print(f"[OK] Guardado {json_path}")

    # Guardar en dev
    dev_json = os.path.join(ROOT_DEV, "preguntas_quiz.json")
    with open(dev_json, 'w', encoding='utf-8') as f:
        json.dump(bank, f, indent=2, ensure_ascii=False)
    print(f"[OK] Guardado {dev_json}")

    # Sincronizar docs/data/preguntas.js
    dev_js = os.path.join(ROOT_DEV, "docs", "data", "preguntas.js")
    js_content = "window.PREGUNTAS = " + json.dumps(bank, indent=2, ensure_ascii=False) + ";\n"
    with open(dev_js, 'w', encoding='utf-8') as f:
        f.write(js_content)
    print(f"[OK] Guardado {dev_js}")

if __name__ == '__main__':
    main()
