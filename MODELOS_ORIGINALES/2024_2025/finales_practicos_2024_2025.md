# Compendio de Exámenes Finales Prácticos (2024 – 2025)

**Cátedra:** Inteligencia Artificial — UTN FRRe (5to Nivel ISI)  
**Nota Curricular:** Los puntos correspondientes a Búsqueda ($A^*$), Planificación (POP), Árboles de Decisión (C4.5) y Reglas de Asociación (Apriori) están rotulados con `[TEMA_P1_RENDIDO]` por pertenecer al Primer Parcial.

> [!TIP]
> **Resoluciones Analíticas Completas Paso a Paso:** Todos los ejercicios de este compendio se encuentran íntegramente desarrollados en [`BANCO_EJERCICIOS_PRACTICOS_2024_2025_FINALES.md`](../../GUIAS_PASO_A_PASO/BANCO_EJERCICIOS_PRACTICOS_2024_2025_FINALES.md).

---

## Mesa Junio 2025
1. **Agrupamiento Particional:** Algoritmo $K$-Means.
2. **Búsqueda Heurística:** Algoritmo $A^*$ `[TEMA_P1_RENDIDO]`.
3. **Clustering Jerárquico Aglomerativo:** Estrategias *Single Link* y *Average Link* con trazado de dendrogramas.
4. **Redes Neuronales Competitivas:** Mapa Auto-Organizado de Kohonen (SOM).

---

## Mesa Abril 2025
1. **Perceptrón Multicapa (MLP):** Calcular el error global $E_g$ y responder justificadamente si es necesario continuar el entrenamiento o detenerlo.
2. **Agrupamiento Particional:** Algoritmo $K$-Means.
3. **Reglas de Asociación:** Generación de reglas dado un ítem frecuente específico `[TEMA_P1_RENDIDO]`.
4. **Búsqueda Heurística:** Algoritmo $A^*$ `[TEMA_P1_RENDIDO]`.

---

## Mesa Febrero 2025
1. **Redes de Hopfield:** Análisis de ortogonalidad y cotas de recuperabilidad buena y perfecta con $3$ patrones bipolares.
2. **Árboles de Decisión:** Determinación del nodo raíz sobre tabla de $7$ instancias `[TEMA_P1_RENDIDO]`.
3. **Reglas de Asociación:** Generación de conjuntos de ítems frecuentes (Apriori) `[TEMA_P1_RENDIDO]`.
4. **Redes Neuronales (MLP / Perceptrón):** Propagación hacia adelante (*Forward Pass*) con múltiples entradas.
5. **Planificación:** Algoritmo POP `[TEMA_P1_RENDIDO]`.

---

## Mesa Diciembre 2024
1. **Clustering Jerárquico Aglomerativo:** Reducción matricial y dendrograma.
2. **Clasificación Basada en Instancias:** Algoritmo $K$-NN ponderado por distancia inversa ($w_i = 1/d^2$).
3. **Árboles de Decisión:** Construcción e impureza de nodos `[TEMA_P1_RENDIDO]`.
4. **Perceptrón Multicapa (MLP):** Propagación hacia adelante, cálculo del error del patrón $E_p$ y actualización de pesos con Backpropagation.

---

## Mesa Noviembre 2024
1. **Planificación:** Problema del mundo de bloques (POP) `[TEMA_P1_RENDIDO]`.
2. **Árboles de Decisión:** Determinación del atributo nodo raíz por ganancia `[TEMA_P1_RENDIDO]`.
3. **Perceptrón Multicapa (MLP):** Propagación hacia adelante, gradientes de error $\delta$ y actualización de pesos.
4. **Redes de Hopfield:** Dinámica de recuperación de patrones y verificación de ortogonalidad.
5. **Reglas de Asociación:** Generación de itemsets frecuentes `[TEMA_P1_RENDIDO]`.

---

## Mesa Octubre 2024

### Ejercicio 1 — Clasificador Naïve Bayes con Distribución Normal Continua
Dados los siguientes parámetros en $\mathbb{R}^2$, calcular a qué clase pertenece la nueva instancia $N = (x_1 = -1.5,\; x_2 = -0.5)$ utilizando **Naïve Bayes con distribución normal (Gaussiana)**. Normalizar los resultados obtenidos considerando las probabilidades a priori $P(C_1) = 0.1$ y $P(C_2) = 0.6$ (o su proporción relativa).

| Clase | $X_1$: Desvío ($\sigma$) | $X_1$: Media ($\mu$) | $X_2$: Desvío ($\sigma$) | $X_2$: Media ($\mu$) |
| :---: | :---: | :---: | :---: | :---: |
| **$C_1$** | $1.01$ | $5.20$ | $1.71$ | $-4.22$ |
| **$C_2$** | $1.25$ | $7.31$ | $2.45$ | $-4.31$ |

### Ejercicio 2 — Agrupamiento $K$-Means ($K = 3$)
Dado el siguiente conjunto de datos en $t = 0$, realizar **dos iteraciones completas** del algoritmo $K$-Means suponiendo que $D_1$, $D_4$ y $D_6$ son las semillas iniciales:

| Instancia | $X_1$ | $X_2$ | Semilla Inicial |
| :---: | :---: | :---: | :---: |
| **$D_1$** | $21.20$ | $55.20$ | Centroide $m_1^{(0)}$ |
| **$D_2$** | $32.70$ | $76.90$ | — |
| **$D_3$** | $46.70$ | $55.80$ | — |
| **$D_4$** | $86.70$ | $13.11$ | Centroide $m_2^{(0)}$ |
| **$D_5$** | $43.00$ | $26.60$ | — |
| **$D_6$** | $13.00$ | $66.60$ | Centroide $m_3^{(0)}$ |

### Ejercicio 3 — Perceptrón Multicapa (MLP): Error Global y Condición de Parada
Dados los siguientes 4 patrones con sus salidas deseadas $E_p = [d_{p1},\; d_{p2}]$ y las salidas obtenidas por la red $Y_p = [y_{p1},\; y_{p2}]$:

| Patrón | Salida Deseada $[d_{p1},\; d_{p2}]$ | Salida Obtenida $[y_{p1},\; y_{p2}]$ |
| :---: | :---: | :---: |
| **$P_1$** | $[3.21;\; 4.78]$ | $[3.02;\; 4.99]$ |
| **$P_2$** | $[3.52;\; 5.89]$ | $[3.52;\; 5.86]$ |
| **$P_3$** | $[3.00;\; 5.23]$ | $[3.13;\; 5.22]$ |
| **$P_4$** | $[3.89;\; 4.99]$ | $[3.15;\; 5.43]$ |

Si el error mínimo aceptable de entrenamiento es $\epsilon = 0.02$ (sin considerar error de validación), ¿el algoritmo debería seguir iterando? Calcular $E_p = \frac{1}{2}\sum_{k=1}^2 (d_{pk} - y_{pk})^2$ y $E_g = \frac{1}{4}\sum_{p=1}^4 E_p$ y justificar la respuesta.

### Ejercicio 4 — Redes de Hopfield ($N = 5$)
Dados los patrones bipolares:
* $P_1 = [+1,\; +1,\; -1,\; -1,\; -1]$
* $P_2 = [-1,\; +1,\; -1,\; +1,\; -1]$

Determinar las condiciones de recuperabilidad buena ($M \le 0.138 N$) y perfecta ($M \le \frac{N}{4\ln N}$), verificar si cumplen con la condición de ortogonalidad ($\sum_{i=1}^N e_i^{(1)} e_i^{(2)} \le 0$), realizar todos los cálculos necesarios (incluyendo la matriz $W$) y graficar la arquitectura.

---

## Mesa Agosto 2024
1. **Mapas Auto-Organizados (SOM):** Competencia y actualización de pesos.
2. **Reglas de Asociación:** Generación de reglas `[TEMA_P1_RENDIDO]`.
3. **Búsqueda Heurística:** Algoritmo $A^*$ `[TEMA_P1_RENDIDO]`.

---

## Mesa Julio 2024
1. **Reglas de Asociación:** Algoritmo Apriori `[TEMA_P1_RENDIDO]`.
2. **Clustering Jerárquico Aglomerativo:** Estrategia *Average Link*.
3. **Mapas Auto-Organizados (SOM):** Actualización online.
4. **Perceptrón Simple:** Obtención de la recta de separación mediante método analítico ($w_1 x_1 + w_2 x_2 = \theta$).

---

## Mesa Junio 2024
1. **Clasificador Naïve Bayes:** Atributos continuos con distribución Normal.
2. **Perceptrón Multicapa (MLP):** Cálculo del error global $E_g$ y verificación de condición de parada frente a error mínimo aceptable.
3. **Búsqueda:** Algoritmo $A^*$ y Primero en Profundidad (DFS) `[TEMA_P1_RENDIDO]`.
4. **Clustering Jerárquico Aglomerativo:** Estrategias *Single Link* y *Average Link*.

---

## Mesa Febrero 2024
1. **Perceptrón Multicapa (MLP):** Cálculo del error global $E_g$, verificación de condición de parada y cálculo del término de momento $\beta \Delta w(t-1)$.
2. **Mapas Auto-Organizados (SOM):** Ejecución de una iteración y ajuste de pesos.
3. **Reglas de Asociación:** Generación de reglas para un conjunto frecuente `[TEMA_P1_RENDIDO]`.
4. **Clasificación / Agrupamiento:** Selección de $K$ en $K$-NN / $K$-Means.
