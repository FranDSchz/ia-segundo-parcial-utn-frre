# Dossier de Variantes Numéricas Resueltas: Clasificador $K$-NN y Agrupamiento $K$-Means
**Universidad Tecnológica Nacional — Facultad Regional Resistencia (UTN FRRe)**  
**Cátedra:** Inteligencia Artificial (UTN FRRe)  
**Material de Entrenamiento Gradual en 3 Niveles**  

---

## Índice del Dossier
1. **Nivel 1 ($K$-NN Ponderado por Distancia):** Clasificación con $w_i = \frac{1}{d^2}$ vs. $w_i = \frac{1}{1 + d^2}$ donde la Ponderación Revierte la Mayoría Simple.
2. **Nivel 2 ($K$-Means Paso a Paso):** Ejecución de 2 Iteraciones Completas desde Semillas Fijas hasta Estabilización de Centroides (Final 2024–2025).
3. **Nivel 3 (Validación Cruzada Leave-One-Out en $K$-NN y Disk $K$-Means):** Determinación Empírica del $K$-Óptimo y Equivalencia de Disk $K$-Means.

---

## Nivel 1: $K$-NN Ponderado por Distancia donde la Cercanía Revierte la Mayoría Simple

### Enunciado
Se desea clasificar la consulta $x_q = [2.0,\; 2.0]^T$ con $K = 3$ vecinos más cercanos a partir del siguiente dataset en $\mathbb{R}^2$:
* $P_1 = [2.1,\; 2.0]^T \to \text{Clase } A$
* $P_2 = [4.0,\; 2.0]^T \to \text{Clase } B$
* $P_3 = [2.0,\; 4.5]^T \to \text{Clase } B$
* $P_4 = [8.0,\; 8.0]^T \to \text{Clase } A$

**Se solicita:**
1. Calcular las distancias euclídeas al cuadrado $d(x_q, P_i)^2$ y seleccionar los $K = 3$ vecinos más cercanos.
2. Comparar la decisión por **votación simple** contra la decisión por **$K$-NN ponderado** ($w_i = \frac{1}{d^2}$).

---

### Solución Oficial Paso a Paso

#### 1. Cálculo de Distancias al Cuadrado $d(x_q, P_i)^2$
* $d(x_q, P_1)^2 = (2.0 - 2.1)^2 + (2.0 - 2.0)^2 = (-0.1)^2 + 0 = \mathbf{0.010} \quad (\text{Clase } A)$
* $d(x_q, P_2)^2 = (2.0 - 4.0)^2 + (2.0 - 2.0)^2 = (-2.0)^2 + 0 = \mathbf{4.000} \quad (\text{Clase } B)$
* $d(x_q, P_3)^2 = (2.0 - 2.0)^2 + (2.0 - 4.5)^2 = 0 + (-2.5)^2 = \mathbf{6.250} \quad (\text{Clase } B)$
* $d(x_q, P_4)^2 = (2.0 - 8.0)^2 + (2.0 - 8.0)^2 = 36 + 36 = 72.000 \quad (\text{Descartado para } K=3)$

Los $K = 3$ vecinos más cercanos son $\{P_1, P_2, P_3\}$.

#### 2. Votación Mayoritaria Simple vs. Ponderada
* **Votación Simple (No Ponderada):**
  * Clase $A$: $1$ voto ($P_1$).
  * Clase $B$: $2$ votos ($P_2, P_3$).
  * Ganaría la **Clase $B$** por mayoría simple ($2 > 1$), a pesar de que $P_2$ y $P_3$ están mucho más lejos que $P_1$.
* **Votación Ponderada ($w_i = \frac{1}{d(x_q, P_i)^2}$):**
  * Peso de Clase $A$:
    $$V_A = \frac{1}{d(x_q, P_1)^2} = \frac{1}{0.010} = \mathbf{100.000}$$
  * Peso acumulado de Clase $B$:
    $$V_B = \frac{1}{d(x_q, P_2)^2} + \frac{1}{d(x_q, P_3)^2} = \frac{1}{4.000} + \frac{1}{6.250} = 0.250 + 0.160 = \mathbf{0.410}$$
  * **Decisión Oficial:** Como $V_A = 100.000 \gg V_B = 0.410$, en **$K$-NN ponderado gana contundentemente la Clase $A$**.

---

## Nivel 2: Agrupamiento $K$-Means en 2 Iteraciones hasta Convergencia (Examen Final)

### Enunciado
Dado el conjunto de $5$ instancias en $\mathbb{R}^2$:
$$x_1 = (1, 1), \quad x_2 = (1, 3), \quad x_3 = (2, 2), \quad x_4 = (6, 6), \quad x_5 = (8, 6)$$
Ejecutar el algoritmo $K$-Means con $K = 2$ tomando como semillas iniciales $m_1^{(0)} = (1, 1)$ y $m_2^{(0)} = (2, 2)$ hasta que los centroides se estabilicen.

---

### Solución Oficial Paso a Paso

#### Iteración 1: Asignación respecto a $m_1^{(0)} = (1, 1)$ y $m_2^{(0)} = (2, 2)$
| Instancia | $d(x_i, m_1^{(0)})$ | $d(x_i, m_2^{(0)})$ | Cluster Asignado |
| :---: | :---: | :---: | :---: |
| $x_1 = (1, 1)$ | $\sqrt{0 + 0} = \mathbf{0.000}$ | $\sqrt{1 + 1} = 1.414$ | $C_1$ |
| $x_2 = (1, 3)$ | $\sqrt{0 + 4} = 2.000$ | $\sqrt{1 + 1} = \mathbf{1.414}$ | $C_2$ |
| $x_3 = (2, 2)$ | $\sqrt{1 + 1} = 1.414$ | $\sqrt{0 + 0} = \mathbf{0.000}$ | $C_2$ |
| $x_4 = (6, 6)$ | $\sqrt{25 + 25} = 7.071$ | $\sqrt{16 + 16} = \mathbf{5.657}$ | $C_2$ |
| $x_5 = (8, 6)$ | $\sqrt{49 + 25} = 8.602$ | $\sqrt{36 + 16} = \mathbf{7.211}$ | $C_2$ |

* **Recálculo de Centroides tras Iteración 1:**
  $$m_1^{(1)} = (1, 1) \qquad m_2^{(1)} = \frac{(1,3) + (2,2) + (6,6) + (8,6)}{4} = \mathbf{(4.25,\; 4.25)}$$

#### Iteración 2: Reasignación respecto a $m_1^{(1)} = (1, 1)$ y $m_2^{(1)} = (4.25, 4.25)$
* Para $x_1 = (1, 1)$: $d(x_1, m_1^{(1)}) = \mathbf{0.000} < d(x_1, m_2^{(1)}) = 4.596 \implies C_1$
* Para $x_2 = (1, 3)$: $d(x_2, m_1^{(1)}) = \mathbf{2.000} < d(x_2, m_2^{(1)}) = 3.482 \implies C_1$ *(¡cambia de cluster!)*
* Para $x_3 = (2, 2)$: $d(x_3, m_1^{(1)}) = \mathbf{1.414} < d(x_3, m_2^{(1)}) = 3.182 \implies C_1$ *(¡cambia de cluster!)*
* Para $x_4 = (6, 6)$: $d(x_4, m_1^{(1)}) = 7.071 > d(x_4, m_2^{(1)}) = \mathbf{2.475} \implies C_2$
* Para $x_5 = (8, 6)$: $d(x_5, m_1^{(1)}) = 8.602 > d(x_5, m_2^{(1)}) = \mathbf{4.138} \implies C_2$

* **Recálculo de Centroides tras Iteración 2:**
  $$C_1 = \{x_1, x_2, x_3\} \implies m_1^{(2)} = \frac{(1,1) + (1,3) + (2,2)}{3} = \mathbf{(1.333,\; 2.000)}$$
  $$C_2 = \{x_4, x_5\} \implies m_2^{(2)} = \frac{(6,6) + (8,6)}{2} = \mathbf{(7.000,\; 6.000)}$$

#### Iteración 3 (Verificación de Condición de Parada)
Al evaluar las distancias a $m_1^{(2)} = (1.333, 2.000)$ y $m_2^{(2)} = (7.000, 6.000)$, las asignaciones $C_1 = \{x_1, x_2, x_3\}$ y $C_2 = \{x_4, x_5\}$ no cambian ($m^{(3)} = m^{(2)}$), por lo que el algoritmo **converge y finaliza**.

---

## Nivel 3: Selección del $K$-Óptimo por Leave-One-Out (LOOCV) y Equivalencia con Disk $K$-Means

### Enunciado
1. En un dataset de $N = 5$ instancias se evalúa $K$-NN mediante validación cruzada *Leave-One-Out* para $K \in \{1, 3\}$, obteniéndose la siguiente matriz de clasificación:
   * Con $K = 1$: aciertan $E_1, E_2, E_4$ ($3$ aciertos, $2$ errores).
   * Con $K = 3$: aciertan $E_1, E_2, E_3, E_5$ ($4$ aciertos, $1$ error).
   Determine el $K$-óptimo y su tasa de error de validación.
2. Si el dataset de Nivel 2 estuviera almacenado en disco y se ejecutara **Disk $K$-Means** con las mismas semillas $m_1^{(0)} = (1, 1)$ y $m_2^{(0)} = (2, 2)$, ¿cuáles serían los centroides finales y cuántas lecturas de disco por iteración realizaría?

---

### Solución Oficial Paso a Paso

1. **Selección de $K$-Óptimo por LOOCV:**
   * Exactitud para $K = 1$: $\frac{3}{5} = 60\%$ (Error $= 40\%$).
   * Exactitud para $K = 3$: $\frac{4}{5} = \mathbf{80\%}$ (Error $= \mathbf{20\%}$).
   * Se selecciona **$K_{\text{óptimo}} = 3$** por minimizar el error de validación cruzada.
2. **Equivalencia Exacta en Disk $K$-Means:**
   * En cada iteración, Disk $K$-Means realiza **una única lectura secuencial del archivo en disco**, acumulando en memoria RAM los vectores suma $\sum \mathbf{x}_i$ y los contadores $|C_j|$ de cada grupo.
   * Al finalizar la pasada, divide $\frac{\sum \mathbf{x}_i}{|C_j|}$, obteniendo **exactamente los mismos centroides** $m_1 = (1.333, 2.000)$ y $m_2 = (7.000, 6.000)$ que el algoritmo $K$-Means estándar en memoria.
