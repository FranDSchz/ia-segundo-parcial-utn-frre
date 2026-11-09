# Formulario Oficial Canónico — Segundo Parcial
**Cátedra:** Inteligencia Artificial — UTN FRRe (5to Nivel ISI)  
**Compilado Canónico:** 2 Carillas de Fórmulas y Convenciones de Cátedra

---

# CARILLA 1: Redes Neuronales y Aprendizaje No Supervisado

## 1. Perceptrón Multicapa (MLP) y Backpropagation

### Activación Sigmoidal y Derivada:
$$f(net) = \frac{1}{1 + e^{-net}}, \qquad f'(net) = f(net) \cdot (1 - f(net))$$

### Propagación hacia Adelante (Forward Pass):
$$net_{j} = \sum_{i} w_{ji} \cdot y_{i} - \theta_j, \qquad y_j = f(net_j)$$

### Gradientes Locales de Error (Backward Pass):
* **Neurona de Salida ($k \in S$):**
  $$\delta_{sk} = (d_k - y_k) \cdot f'(net_{sk}) = (d_k - f(net_{sk})) \cdot f(net_{sk}) \cdot (1 - f(net_{sk}))$$
* **Neurona Oculta ($j \in O$):**
  $$\delta_{oj} = f'(net_{oj}) \cdot \sum_{k \in S} \delta_{sk} \cdot w_{sk-oj}$$

### Regla Delta Generalizada con Término de Momento $\beta$:
$$w_{ji}(t+1) = w_{ji}(t) + \Delta w_{ji}(t)$$
$$\Delta w_{ji}(t) = \alpha \cdot \delta_j \cdot y_i + \beta \cdot \Delta w_{ji}(t-1)$$
Donde $\alpha \in (0, 1]$ es el factor de aprendizaje y $\beta \in [0, 1)$ es el coeficiente de momento.

### Error Cuadrático Medio de Época:
$$E_{\text{época}} = \frac{1}{2 L} \sum_{p=1}^L \sum_{k=1}^M (d_{pk} - y_{pk})^2$$

---

## 2. Mapas Autoorganizados de Kohonen (SOM)

### Fase 1: Competencia (Distancia Euclidiana a Pesos):
$$d_j = \|\mathbf{x} - \mathbf{w}_j\| = \sqrt{\sum_{k=1}^D (x_k - w_{jk})^2}$$
$$\text{Neurona Ganadora (BMU): } j^{\ast} = \arg\min_j d_j$$

### Fase 2: Cooperación (Función de Vecindad Topológica):
* **Vecindad Continua con Distancia en el Espacio de Pesos:**
  $$h(i, j^{\ast}) = \frac{1}{1 + \text{dist}(W_i, W_{j^{\ast}})} \quad \text{o bien} \quad h(i, j^{\ast}) = \frac{1}{2 + \text{dist}(W_i, W_{j^{\ast}})}$$
  (Para la ganadora $j^{\ast}$: $\text{dist}(W_{j^{\ast}}, W_{j^{\ast}}) = 0 \implies h(j^{\ast}, j^{\ast}) = 1 \text{ ó } 0.50$)
* **Vecindad Nula:**
  $$h(i, j^{\ast}) = 1 \text{ si } i = j^{\ast}, \quad h(i, j^{\ast}) = 0 \text{ si } i \ne j^{\ast}$$

### Fase 3: Adaptación (Actualización Secuencial Online):
$$\mathbf{w}\_i(t+1) = \mathbf{w}\_i(t) + \alpha \cdot h(i, j^{\ast}) \cdot (\mathbf{x} - \mathbf{w}\_i(t))$$
**¡Regla de examen!** Para el patrón $p_{k+1}$, utilizar la matriz de pesos $\mathbf{W}(t+1)$ recién actualizada.

---

## 3. Redes Recurrentes de Hopfield

### Matriz de Pesos Hebbiana (con Diagonal Estrictamente Nula):
$$W = \sum_{k=1}^M \left( \mathbf{e}_k^T \mathbf{e}_k - I \right) \implies w_{ii} = 0 \quad \forall i$$
$$w_{ij} = \sum_{k=1}^M e_{ki} e_{kj} \quad (\text{para } i \ne j), \qquad w_{ij} = w_{ji}$$

### Dinámica de Recuperación (Bipolar $\{-1, +1\}$):
$$net_i(t) = \sum_{j=1}^N w_{ij} x_j(t) = \mathbf{x}(t) \cdot W_{\ast, i}$$
$$
x_i(t+1) = \text{sgn}(net_i(t)) = \begin{cases}
+1 & \text{si } net_i(t) > 0 \\
-1 & \text{si } net_i(t) < 0 \\
x_i(t) & \text{si } net_i(t) = 0
\end{cases}
$$

### Condiciones de Capacidad y Ortogonalidad:
* Ortogonalidad Bipolar: $\mathbf{e}_k \cdot \mathbf{e}_m = 0 \iff$ Difieren en el $50\%$ de bits ($N/2$).
* Capacidad Teórica Asintótica: $M \le \frac{N}{4 \ln N}$ | Capacidad Empírica: $M \approx 0.138 N$.

---

## 4. Clustering Jerárquico Aglomerativo

### Matriz de Distancias Euclidianas:
$$d(x, y) = \sqrt{\sum_{k=1}^D (x_k - y_k)^2}$$

### Métodos de Actualización entre Grupos $A$ y $B$:
* **Single Linkage (Mínimo):** $d(A, B) = \min_{x \in A, y \in B} d(x, y)$
* **Complete Linkage (Máximo):** $d(A, B) = \max_{x \in A, y \in B} d(x, y)$
* **Average Linkage (Promedio Riguroso por Pares Cruzados):**
  $$d(A, B) = \frac{1}{|A| \cdot |B|} \sum_{x \in A} \sum_{y \in B} d(x, y)$$
* **Fórmula de Recurrencia de Lance-Williams para Average Link:**
  $$d((A \cup B), C) = \frac{|A|}{|A| + |B|} d(A, C) + \frac{|B|}{|A| + |B|} d(B, C)$$

---

# CARILLA 2: Modelos Estadísticos, Optimización y Genéticos

## 5. Support Vector Machines (SVM)

### Ecuación del Hiperplano Separador Óptimo y Márgenes:
* Hiperplano Central: $\mathbf{w}^T \mathbf{x} + b = 0$
* Hiperplanos de Margen Canónico: $\mathbf{w}^T \mathbf{x} + b = +1 \quad (y_i = +1), \qquad \mathbf{w}^T \mathbf{x} + b = -1 \quad (y_i = -1)$
* Distancias ortogonales: $d(+) = d(-) = \frac{1}{\|\mathbf{w}\|}$
* Margen Geométrico Total: $M = d(+) + d(-) = \frac{2}{\|\mathbf{w}\|}$

### Reconstrucción Primal a partir de Multiplicadores $\alpha_i$:
$$\mathbf{w} = \sum_{i=1}^N \alpha_i y_i \mathbf{x}_i = \sum_{i \in SV} \alpha_i y_i \mathbf{x}_i \quad (\text{sólo donde } \alpha_i > 0)$$
$$b_i = y_i - \mathbf{w}^T \mathbf{x}_i \quad \forall i \in SV \implies b_{prom} = \frac{1}{|SV|} \sum_{i \in SV} b_i$$

### Formulación Dual de Lagrange $L_D(\boldsymbol{\alpha})$:
$$L_D(\boldsymbol{\alpha}) = \sum_{i=1}^N \alpha_i - \frac{1}{2} \sum_{i=1}^N \sum_{j=1}^N \alpha_i \alpha_j y_i y_j (\mathbf{x}_i^T \mathbf{x}_j)$$
* **Restricciones KKT Obligatorias:**
  1. $\sum_{i=1}^N \alpha_i y_i = 0$
  2. $\alpha_i \ge 0 \quad \forall i = 1, \dots, N$
  3. $\alpha_i [y_i (\mathbf{w}^T \mathbf{x}_i + b) - 1] = 0 \quad \forall i$

---

## 6. Clasificador Naïve Bayes

### Teorema de Bayes con Hipótesis Ingenua de Independencia:
$$P(C_k \mid \mathbf{x}) \propto P(C_k) \cdot \prod_{i=1}^D P(x_i \mid C_k)$$
$$\text{Regla de Decisión MAP: } C^{\ast} = \arg\max_{C_k} \left[ P(C_k) \cdot \prod_{i=1}^D P(x_i \mid C_k) \right]$$

### Probabilidades a Priori:
$$P(C_k) = \frac{N_k}{N_{\text{total}}}$$

### Verosimilitudes:
* **Naïve Bayes con Histogramas (Bins Discretizados):**
  $$P(x_i \in \text{Bin}_m \mid C_k) = \frac{\text{Muestras de clase } C_k \text{ en } \text{Bin}_m}{N_k}$$
* **Naïve Bayes Continuo Gaussiano:**
  $$P(x_i \mid C_k) = \frac{1}{\sqrt{2\pi}\sigma_{ik}} \exp\left( -\frac{(x_i - \mu_{ik})^2}{2\sigma_{ik}^2} \right)$$

---

## 7. $K$-Nearest Neighbors ($K$-NN)

### Ponderación por Distancia Inversa:
$$w_i = \frac{1}{d(\mathbf{x}_0, \mathbf{x}_i)^2} \quad \text{o bien} \quad w_i = \frac{1}{1 + d(\mathbf{x}_0, \mathbf{x}_i)^2}$$
$$\text{Score Ponderado de Clase: } \text{Score}(C_k) = \sum_{i \in \text{Vecinos}, y_i = C_k} w_i$$

### Error de Validación Cruzada Leave-One-Out (LOOCV):
$$E_{\text{LOOCV}}(K) = \frac{1}{N} \sum_{i=1}^N \mathbb{I}(y_i \ne \hat{y}_{(-i)}^{(K)})$$

---

## 8. Algoritmos Genéticos

### Selección por Ruleta Proporcional Normalizada $[00 - 99]$:
$$p_i = \frac{f_i}{\sum_{j=1}^N f_j}, \qquad q_i = \sum_{k=1}^i p_k, \qquad \text{Rango}_i = [\text{Rango}_{i-1}^{\text{fin}} + 1, \; \text{round}(100 \cdot q_i) - 1]$$

### Selección por Ranking Lineal ($R_{\min} \in [0, 1]$):
$$P(i) = \frac{1}{N} \left[ R_{\min} + 2(1 - R_{\min}) \frac{N - i}{N - 1} \right] \quad (\text{con } i=1 \text{ el más apto})$$

### Muestreo Estocástico con Resto (Copias Esperadas):
$$\eta_i = N \cdot p_i, \qquad c_i = \lfloor \eta_i \rfloor \text{ copias deterministas}$$

### Mutación Adaptativa Lineal por Temperatura:
$$P_m(t) = P_{\max} - \lambda \cdot t \quad (\text{descendente}), \qquad P_m(t) = P_{\min} + \lambda \cdot t \quad (\text{ascendente})$$
