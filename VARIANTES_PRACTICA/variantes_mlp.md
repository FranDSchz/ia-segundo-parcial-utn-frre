# Dossier de Variantes Numéricas Resueltas: Perceptrón Multicapa (MLP) y Backpropagation
**Universidad Tecnológica Nacional — Facultad Regional Resistencia (UTN FRRe)**  
**Cátedra:** Inteligencia Artificial | **Profesor Titular:** Ing. Marcelo Karanik  
**Material de Entrenamiento Gradual en 3 Niveles**  

---

## Índice del Dossier
1. **Nivel 1 (Básico / Conceptual Inicial):** Propagación Hacia Adelante (Forward Pass) con Activación Sigmoidal y Error Cuadrático.
2. **Nivel 2 (Parcial Real / Examen Estándar):** Backpropagation Completo en Red $2 \times 2 \times 1$ con Regla de la Cadena y Derivadas.
3. **Nivel 3 (Caso Borde / Cuestión Teórica de Examen):** Término de Inercia y Momento Negativo ($\beta \cdot \Delta w(t-1) < 0$).

---

## Nivel 1: Forward Pass Sigmoidal y Error Cuadrático por Patrón

### Enunciado
Considere una red neuronal elemental con 2 entradas ($x_1, x_2$) y 1 neurona de salida $y$ con función de transferencia sigmoide logística:
$$o = \sigma(net) = \frac{1}{1 + e^{-net}}$$
Pesos sinápticos actuales:
$$w_1 = 0.800, \quad w_2 = -0.500, \quad b = 0.200$$

Se presenta el patrón de entrada:
$$\mathbf{x} = \begin{bmatrix} 1.500 \\ 2.000 \end{bmatrix} \quad \text{con valor objetivo deseado } d = 1.000$$

**Se solicita:**
1. Calcular el potencial post-sináptico $net$ y la salida activada de la red $o$.
2. Calcular el error simple $(d - o)$ y la función de pérdida de error cuadrático $E = \frac{1}{2}(d - o)^2$.
3. Calcular el valor de la derivada evaluada en dicho punto: $f'(net) = o \cdot (1 - o)$.

---

### Solución Oficial Paso a Paso

#### 1. Potencial Post-sináptico y Activación
$$net = x_1 w_1 + x_2 w_2 + b = (1.500)(0.800) + (2.000)(-0.500) + 0.200$$
$$net = 1.200 - 1.000 + 0.200 = \mathbf{0.400}$$
Aplicando la función sigmoide:
$$o = \sigma(0.400) = \frac{1}{1 + e^{-0.400}} = \frac{1}{1 + 0.6703} = \frac{1}{1.6703} \approx \mathbf{0.5987} \approx \mathbf{0.599}$$

#### 2. Error Simple y Error Cuadrático
* **Error lineal:**
  $$e = d - o = 1.000 - 0.5987 = \mathbf{+0.4013}$$
* **Error cuadrático:**
  $$E = \frac{1}{2} (d - o)^2 = \frac{1}{2} (0.4013)^2 = \frac{1}{2} (0.1610) \approx \mathbf{0.0805}$$

#### 3. Derivada de la Función de Activación
$$f'(net) = o \cdot (1 - o) = 0.5987 \cdot (1 - 0.5987) = 0.5987 \cdot 0.4013 \approx \mathbf{0.2403}$$

---

## Nivel 2: Backpropagation Completo en Red $2 \times 2 \times 1$ (Estilo Parcial UTN FRRe)

### Enunciado
Dada una red neuronal $2 \times 2 \times 1$ donde todas las unidades poseen activación sigmoide unipolar:
* **Entradas:** $x_1 = 2.000, \quad x_2 = 1.000$
* **Valor Deseado en Salida:** $d = 0.000$
* **Tasa de Aprendizaje:** $\alpha = 0.50$
* **Pesos Ocultos:**
  $$w_{h1, x1} = 0.100, \quad w_{h1, x2} = 0.300, \quad b_{h1} = 0.000$$
  $$w_{h2, x1} = -0.200, \quad w_{h2, x2} = 0.400, \quad b_{h2} = -0.100$$
* **Pesos de Salida:**
  $$w_{y, h1} = 0.500, \quad w_{y, h2} = -0.500, \quad b_y = 0.100$$

**Se solicita:**
1. Ejecutar el paso **Forward** calculando las activaciones $o_{h1}, o_{h2}, o_y$.
2. Ejecutar el paso **Backward** determinando los gradientes locales $\delta_y, \delta_{h1}, \delta_{h2}$.
3. Actualizar los pesos de salida ($w_{y, h1}, w_{y, h2}, b_y$) y los pesos ocultos conectados a $x_1$ ($w_{h1, x1}, w_{h2, x1}$).

---

### Solución Oficial Paso a Paso

#### 1. Paso Forward
* **Neurona oculta $h_1$:**
  $$net_{h1} = x_1 w_{h1, x1} + x_2 w_{h1, x2} + b_{h1} = (2.0)(0.1) + (1.0)(0.3) + 0.0 = 0.2 + 0.3 = \mathbf{0.500}$$
  $$o_{h1} = \sigma(0.500) = \frac{1}{1 + e^{-0.500}} \approx \mathbf{0.6225}$$
* **Neurona oculta $h_2$:**
  $$net_{h2} = x_1 w_{h2, x1} + x_2 w_{h2, x2} + b_{h2} = (2.0)(-0.2) + (1.0)(0.4) - 0.1 = -0.4 + 0.4 - 0.1 = \mathbf{-0.100}$$
  $$o_{h2} = \sigma(-0.100) = \frac{1}{1 + e^{0.100}} \approx \mathbf{0.4750}$$
* **Neurona de salida $y$:**
  $$net_y = o_{h1} w_{y, h1} + o_{h2} w_{y, h2} + b_y = (0.6225)(0.500) + (0.4750)(-0.500) + 0.100$$
  $$net_y = 0.31125 - 0.23750 + 0.10000 = \mathbf{0.17375}$$
  $$o_y = \sigma(0.17375) \approx \mathbf{0.5433}$$

#### 2. Paso Backward (Gradientes Locales $\delta$)
* **Gradiente local de salida ($d = 0.000$):**
  $$e_y = d - o_y = 0.000 - 0.5433 = -0.5433$$
  $$f'(net_y) = o_y (1 - o_y) = (0.5433)(1 - 0.5433) = (0.5433)(0.4567) \approx 0.2481$$
  $$\delta_y = e_y \cdot f'(net_y) = (-0.5433)(0.2481) \approx \mathbf{-0.1348}$$

* **Gradientes locales retropropagados a capa oculta:**
  $$\delta_{hj} = o_{hj}(1 - o_{hj}) \cdot [\delta_y \cdot w_{y, hj}]$$
  * Para $h_1$:
    $$f'(net_{h1}) = (0.6225)(1 - 0.6225) = (0.6225)(0.3775) \approx 0.2350$$
    $$\delta_{h1} = 0.2350 \cdot [(-0.1348)(0.500)] = 0.2350 \cdot [-0.0674] \approx \mathbf{-0.0158}$$
  * Para $h_2$:
    $$f'(net_{h2}) = (0.4750)(1 - 0.4750) = (0.4750)(0.5250) \approx 0.2494$$
    $$\delta_{h2} = 0.2494 \cdot [(-0.1348)(-0.500)] = 0.2494 \cdot [+0.0674] \approx \mathbf{+0.0168}$$

#### 3. Actualización de Pesos Sinápticos ($\alpha = 0.50$)
Fórmula: $w^{\text{nuevo}} = w + \alpha \cdot \delta_{\text{destino}} \cdot \text{activación}_{\text{origen}}$

* **Pesos Capa de Salida:**
  * $w_{y, h1}^{\text{nuevo}} = 0.500 + (0.50)(-0.1348)(0.6225) = 0.500 - 0.0420 = \mathbf{0.4580}$
  * $w_{y, h2}^{\text{nuevo}} = -0.500 + (0.50)(-0.1348)(0.4750) = -0.500 - 0.0320 = \mathbf{-0.5320}$
  * $b_y^{\text{nuevo}} = 0.100 + (0.50)(-0.1348)(1.000) = 0.100 - 0.0674 = \mathbf{0.0326}$

* **Pesos Capa Oculta:**
  * $w_{h1, x1}^{\text{nuevo}} = 0.100 + (0.50)(-0.0158)(2.000) = 0.100 - 0.0158 = \mathbf{0.0842}$
  * $w_{h2, x1}^{\text{nuevo}} = -0.200 + (0.50)(+0.0168)(2.000) = -0.200 + 0.0168 = \mathbf{-0.1832}$

---

## Nivel 3: Caso Borde — Dinámica del Término de Momento Negativo ($\beta \cdot \Delta w(t-1) < 0$)

### Enunciado y Fundamentación de Examen
En el examen teórico de la UTN FRRe (`IA-H0079`), la cátedra formula recurrentemente la siguiente pregunta:  
*«¿El término de momento que se utiliza en MLP puede ser numéricamente negativo? Justifique formalmente, indique cuándo ocurre y analice su impacto en el aprendizaje».*

Para contrastar numéricamente este efecto, considere dos conexiones sinápticas independientes ($w_A$ y $w_B$) sometidas a actualización en el paso $t$:
* Ambas conexiones reciben el mismo impulso de gradiente actual: $\alpha \cdot \delta_j \cdot o_i = +0.030$.
* Parámetro de inercia: $\beta = 0.40$.
* **Conexión A (Inercia positiva):** El peso venía incrementándose: $\Delta w_A(t-1) = +0.050$.
* **Conexión B (Inercia negativa):** El peso venía decrementándose en la época anterior: $\Delta w_B(t-1) = -0.050$.

**Se solicita:**
1. Calcular el ajuste neto $\Delta w_A(t)$ y $\Delta w_B(t)$.
2. Analizar el comportamiento dinámico en el descenso por gradiente en ambos casos (aceleración vs. amortiguación de oscilaciones).
3. Analizar qué ocurre si el gradiente actual también es negativo ($\alpha \delta o = -0.040$) y la inercia previa era negativa ($\Delta w(t-1) = -0.030$).

---

### Solución Oficial Paso a Paso

#### 1. Cálculo de los Ajustes Netos
Fórmula de la Regla Delta Generalizada:
$$\Delta w(t) = \alpha \cdot \delta_j \cdot o_i + \beta \cdot \Delta w(t-1)$$

* **Para la Conexión A (Momento positivo):**
  $$\Delta w_A(t) = +0.030 + (0.40)(+0.050) = +0.030 + 0.020 = \mathbf{+0.050}$$
  El ajuste se incrementa un $66.7\%$ respecto al gradiente puro gracias a la inercia acumulada.

* **Para la Conexión B (Término de Momento Negativo):**
  $$\beta \cdot \Delta w_B(t-1) = (0.40)(-0.050) = \mathbf{-0.020} \quad (\text{Término de momento estrictamente negativo})$$
  $$\Delta w_B(t) = +0.030 + (-0.020) = \mathbf{+0.010}$$
  El ajuste final resulta positivo pero se reduce a un tercio de su magnitud de gradiente.

#### 2. Justificación Teórica de Cátedra
* **¿Puede ser negativo?**  
  **Sí.** Aunque el coeficiente hiperparamétrico $\beta \in [0, 1)$ es siempre un número real positivo, el **término de momento** como producto escalar $\beta \cdot \Delta w(t-1)$ adopta el signo de la derivada anterior. Si en el paso previo el peso debió decrecer ($\Delta w(t-1) < 0$), el término de momento es intrínsecamente negativo.
* **Impacto en el aprendizaje:**
  * **Amortiguación de oscilaciones en valles estrechos:** Si el gradiente actual apunta en sentido positivo ($+0.030$) pero la inercia previa venía en sentido negativo ($-0.020$), el algoritmo detecta un cambio brusco de signo en la pendiente. El momento negativo actúa como un **freno inercial**, amortiguando la oscilación perpendicular al valle y evitando divergencia.

#### 3. Refuerzo de Descenso Negativo
Si el gradiente actual es negativo ($\alpha \delta o = -0.040$) y la inercia previa también es negativa ($\Delta w(t-1) = -0.030$):
$$\Delta w(t) = -0.040 + (0.40)(-0.030) = -0.040 - 0.012 = \mathbf{-0.052}$$
En este escenario, el término de momento negativo refuerza el avance en la dirección de descenso, logrando que el peso disminuya con mayor rapidez y atravesando mesetas o valles planos donde el gradiente puro tendería a desvanecerse.
