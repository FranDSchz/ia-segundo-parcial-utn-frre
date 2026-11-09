# Dossier de Variantes Numéricas Resueltas: Support Vector Machines (SVM)
**Universidad Tecnológica Nacional — Facultad Regional Resistencia (UTN FRRe)**  
**Cátedra:** Inteligencia Artificial (UTN FRRe)  
**Material de Entrenamiento Gradual en 3 Niveles**  

---

## Índice del Dossier
1. **Nivel 1 (Básico / Conceptual Inicial):** SVM Canónico con 2 Vectores de Soporte Simétricos.
2. **Nivel 2 (Parcial Real / Examen Estándar):** SVM Asimétrico con 3 Vectores de Soporte y Promediado de Sesgo (Tema Histórico 2023).
3. **Nivel 3 (Caso Borde / Dual Completo):** SVM Formulación Dual con Matriz de Gram, Resolución Analítica por KKT y Punto en el Origen.

---

## Nivel 1: SVM Canónico con 2 Vectores de Soporte Simétricos

### Enunciado
En un espacio bidimensional $\mathbb{R}^2$, se tienen dos vectores de soporte aislados obtenidos tras el entrenamiento de un clasificador SVM de margen estricto:
* $p_1 = [2.0, 2.0]^T$ perteneciente a la clase positiva $y_1 = +1$, con multiplicador $\alpha_1 = 0.50$.
* $p_2 = [-2.0, -2.0]^T$ perteneciente a la clase negativa $y_2 = -1$, con multiplicador $\alpha_2 = 0.50$.

**Se solicita:**
1. Verificar la condición de equilibrio KKT $\sum \alpha_i y_i = 0$.
2. Calcular el vector ortogonal de pesos $\mathbf{w}$.
3. Calcular los sesgos $b_1, b_2$ y el sesgo promediado $b_{prom}$.
4. Determinar la ecuación de la recta de separación y el ancho total del margen $M$.

---

### Solución Oficial Paso a Paso

#### 1. Condición de Equilibrio KKT
$$\sum_{i=1}^2 \alpha_i y_i = \alpha_1 y_1 + \alpha_2 y_2 = (0.50)(+1) + (0.50)(-1) = 0.50 - 0.50 = 0 \quad \text{(Satisfecho)}$$

#### 2. Cálculo del Vector $\mathbf{w}$
$$\mathbf{w} = \alpha_1 y_1 p_1 + \alpha_2 y_2 p_2 = (0.50)(+1)[2.0, 2.0]^T + (0.50)(-1)[-2.0, -2.0]^T$$
$$\mathbf{w} = [1.0, 1.0]^T + [1.0, 1.0]^T = [\mathbf{2.000}, \mathbf{2.000}]^T$$

#### 3. Cálculo de Sesgos $b_i = y_i - \mathbf{w}^T p_i$
* Para $p_1$:
  $$b_1 = 1 - [(2.0)(2.0) + (2.0)(2.0)] = 1 - [4.0 + 4.0] = 1 - 8.0 = \mathbf{-7.000}$$
* Para $p_2$:
  $$b_2 = -1 - [(2.0)(-2.0) + (2.0)(-2.0)] = -1 - [-4.0 - 4.0] = -1 - (-8.0) = \mathbf{+7.000}$$
* Sesgo promediado:
  $$b_{prom} = \frac{b_1 + b_2}{2} = \frac{-7.000 + 7.000}{2} = \mathbf{0.000}$$
*(Por simetría central respecto al origen, la recta pasa exactamente por el punto $[0, 0]^T$)*.

#### 4. Hiperplano y Margen
* **Ecuación:** $\mathbf{w}^T \mathbf{x} + b = 0 \iff 2.0 x_1 + 2.0 x_2 = 0 \iff x_1 + x_2 = 0$.
* **Norma:** $\|\mathbf{w}\| = \sqrt{2^2 + 2^2} = \sqrt{8} \approx 2.828$.
* **Margen total:** $M = \frac{2}{\|\mathbf{w}\|} = \frac{2}{\sqrt{8}} = \frac{2}{2.828} \approx \mathbf{0.707}$.

---

## Nivel 2: SVM Asimétrico con 3 Vectores de Soporte y Promediado de Sesgo (Examen Real UTN FRRe 2023)

### Enunciado
Dadas las 4 muestras en $\mathbb{R}^2$:
* $p_1 = [0, 4]^T$, clase $y_1 = +1$, $\alpha_1 = 0.50$
* $p_2 = [3, 0]^T$, clase $y_2 = +1$, $\alpha_2 = 0.25$
* $p_3 = [-2, 0]^T$, clase $y_3 = -1$, $\alpha_3 = 0.75$
* $p_4 = [-3, -3]^T$, clase $y_4 = -1$, $\alpha_4 = 0.00$

**Se solicita:**
1. Descartar los puntos no soporte y calcular $\mathbf{w}$.
2. Calcular analíticamente $b_1, b_2, b_3$ y reportar el sesgo promediado oficial $b_{prom}$.
3. Determinar el margen de separación.

---

### Solución Oficial Paso a Paso

#### 1. Cálculo de $\mathbf{w}$
Como $\alpha_4 = 0$, $p_4$ es un punto interior descartable.  
Comprobación KKT: $\sum \alpha_i y_i = 0.50(+1) + 0.25(+1) + 0.75(-1) = 0.75 - 0.75 = 0$.
$$\mathbf{w} = (0.50)(+1)[0, 4]^T + (0.25)(+1)[3, 0]^T + (0.75)(-1)[-2, 0]^T$$
$$\mathbf{w} = [0.00, 2.00]^T + [0.75, 0.00]^T + [1.50, 0.00]^T = [0.75 + 1.50, 2.00]^T = [\mathbf{2.250}, \mathbf{2.000}]^T$$

#### 2. Cálculo de los Sesgos Individuales y Promedio
* **Para $p_1 = [0, 4]^T$ ($y_1 = +1$):**
  $$\mathbf{w}^T p_1 = (2.25)(0) + (2.00)(4) = 8.00 \implies b_1 = 1 - 8.00 = \mathbf{-7.000}$$
* **Para $p_2 = [3, 0]^T$ ($y_2 = +1$):**
  $$\mathbf{w}^T p_2 = (2.25)(3) + (2.00)(0) = 6.75 \implies b_2 = 1 - 6.75 = \mathbf{-5.750}$$
* **Para $p_3 = [-2, 0]^T$ ($y_3 = -1$):**
  $$\mathbf{w}^T p_3 = (2.25)(-2) + (2.00)(0) = -4.50 \implies b_3 = -1 - (-4.50) = \mathbf{+3.500}$$

* **Sesgo Promediado Requerido por la Cátedra:**
  $$b_{prom} = \frac{b_1 + b_2 + b_3}{3} = \frac{-7.000 - 5.750 + 3.500}{3} = \frac{-9.250}{3} \approx \mathbf{-3.083}$$

#### 3. Ecuación y Margen
* **Hiperplano:** $2.250 x_1 + 2.000 x_2 - 3.083 = 0$.
* **Norma:** $\|\mathbf{w}\| = \sqrt{2.25^2 + 2.00^2} = \sqrt{5.0625 + 4.000} = \sqrt{9.0625} \approx 3.010$.
* **Margen:** $M = \frac{2}{\|\mathbf{w}\|} = \frac{2}{3.010} \approx \mathbf{0.664}$.

---

## Nivel 3: Caso Borde — SVM Dual Completo con Matriz de Gram y Punto en el Origen

### Enunciado
Considere los siguientes puntos de entrenamiento:
* $P_1 = [1.0, 2.0]^T$, clase $y_1 = +1$
* $P_2 = [2.0, 1.0]^T$, clase $y_2 = +1$
* $P_3 = [0.0, 0.0]^T$, clase $y_3 = -1$

Plantear la formulación dual $L_D$, construir la matriz de Gram, resolver analíticamente los multiplicadores de Lagrange mediante condiciones KKT y demostrar que los sesgos $b_i$ coinciden exactamente sin dispersión numérica.

---

### Solución Oficial Paso a Paso

#### 1. Matriz de Gram $K_{ij} = P_i^T P_j$
* $K_{11} = 1^2 + 2^2 = 5.0$
* $K_{12} = (1)(2) + (2)(1) = 4.0$
* $K_{13} = (1)(0) + (2)(0) = 0.0$
* $K_{22} = 2^2 + 1^2 = 5.0$
* $K_{23} = (2)(0) + (1)(0) = 0.0$
* $K_{33} = 0^2 + 0^2 = 0.0$


$$
K = \begin{bmatrix}
5.0 & 4.0 & 0.0 \\
4.0 & 5.0 & 0.0 \\
0.0 & 0.0 & 0.0
\end{bmatrix}
$$


#### 2. Formulación Dual $L_D$
Restricción KKT de igualdad:
$$\alpha_1(+1) + \alpha_2(+1) + \alpha_3(-1) = 0 \implies \alpha_3 = \alpha_1 + \alpha_2$$
Sustituyendo en la doble sumatoria $Q$:
Como $K_{13} = K_{23} = K_{33} = 0$, los términos que involucran a $\alpha_3$ se anulan en la parte cuadrática:
$$Q = \frac{1}{2} [ y_1^2 K_{11} \alpha_1^2 + y_2^2 K_{22} \alpha_2^2 + 2 y_1 y_2 K_{12} \alpha_1 \alpha_2 ] = \frac{1}{2} [ 5.0 \alpha_1^2 + 5.0 \alpha_2^2 + 8.0 \alpha_1 \alpha_2 ] = 2.5 \alpha_1^2 + 2.5 \alpha_2^2 + 4.0 \alpha_1 \alpha_2$$
Término lineal:
$$\alpha_1 + \alpha_2 + \alpha_3 = \alpha_1 + \alpha_2 + (\alpha_1 + \alpha_2) = 2 \alpha_1 + 2 \alpha_2$$
Por lo tanto:
$$L_D(\alpha_1, \alpha_2) = 2 \alpha_1 + 2 \alpha_2 - 2.5 \alpha_1^2 - 2.5 \alpha_2^2 - 4.0 \alpha_1 \alpha_2$$

#### 3. Derivadas Parciales y Punto Óptimo
$$\frac{\partial L_D}{\partial \alpha_1} = 2 - 5.0 \alpha_1 - 4.0 \alpha_2 = 0 \implies 5.0 \alpha_1 + 4.0 \alpha_2 = 2.0$$
$$\frac{\partial L_D}{\partial \alpha_2} = 2 - 4.0 \alpha_1 - 5.0 \alpha_2 = 0 \implies 4.0 \alpha_1 + 5.0 \alpha_2 = 2.0$$

Por simetría del sistema:
$$\alpha_1^* = \alpha_2^* = \frac{2.0}{5.0 + 4.0} = \frac{2}{9} \approx \mathbf{0.222}$$
$$\alpha_3^* = \alpha_1^* + \alpha_2^* = \frac{2}{9} + \frac{2}{9} = \frac{4}{9} \approx \mathbf{0.444}$$

#### 4. Vector de Pesos $\mathbf{w}$ y Sesgo $b$
$$\mathbf{w} = \frac{2}{9}(+1)[1, 2]^T + \frac{2}{9}(+1)[2, 1]^T + \frac{4}{9}(-1)[0, 0]^T = \frac{2}{9}[3, 3]^T = [\mathbf{2/3}, \mathbf{2/3}]^T \approx [0.667, 0.667]^T$$

*Verificación de sesgos:*
* En $P_1$: $b_1 = 1 - [(2/3)(1) + (2/3)(2)] = 1 - [2/3 + 4/3] = 1 - 2 = \mathbf{-1.000}$
* En $P_2$: $b_2 = 1 - [(2/3)(2) + (2/3)(1)] = 1 - [4/3 + 2/3] = 1 - 2 = \mathbf{-1.000}$
* En $P_3$: $b_3 = -1 - [(2/3)(0) + (2/3)(0)] = -1 - 0 = \mathbf{-1.000}$

**Conclusión pedagógica:** Cuando los datos son exactamente simétricos respecto al hiperplano, todos los vectores de soporte arrojan idéntico valor de sesgo ($b = -1.000$). La ecuación del hiperplano óptimo es:
$$\frac{2}{3} x_1 + \frac{2}{3} x_2 - 1 = 0 \iff x_1 + x_2 = 1.500$$
Margen: $M = \frac{2}{\|\mathbf{w}\|} = \frac{2}{\sqrt{(2/3)^2 + (2/3)^2}} = \frac{2}{\sqrt{8/9}} = \frac{2 \cdot 3}{2\sqrt{2}} = \frac{3}{\sqrt{2}} \approx \mathbf{2.121}$.
