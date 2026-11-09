# Banco de Preguntas Teóricas y de Desarrollo
**Cátedra:** Inteligencia Artificial — UTN FRRe (5to Nivel ISI)  
**Profesor Titular:** Ing. Marcelo Karanik  
**Compilación:** Preguntas recurrentes de parciales presenciales, recuperatorios y finales (2015 – 2023).

---

## 1. Pregunta 01: El Término de Momento Negativo en MLP
* **Fuente:** Parcial Teórico 2023 ([`IA-H0079.md`](file:///c:/facultad/Inteligencia%20Artificial/recursos_historicos/derivados/IA-H0079/IA-H0079.md)), Pregunta 1.
* **Consigna:** ¿El término de momento que se utiliza en redes MLP puede ser negativo? Justifique su respuesta y, en caso afirmativo, indique en qué circunstancias se obtendrían esos valores y cómo afecta al proceso de aprendizaje.

### Respuesta Modelo de Cátedra:
1. **Conclusión Técnica Directa:**
   **SÍ, el término de momento puede ser negativo.** Es fundamental distinguir entre el parámetro o coeficiente de momento $\beta$ (que por definición es un escalar positivo, $\beta \in [0, 1)$) y el **término de momento compuesto**, definido como:
   $$\text{Término de Momento} = \beta \cdot \Delta w_{ji}(t-1)$$
   Si en la iteración anterior el peso sináptico disminuyó su valor (es decir, experimentó un incremento neto negativo $\Delta w_{ji}(t-1) < 0$), el producto completo será estrictamente **negativo**.

2. **Circunstancias en las que se Produce:**
   Se produce cada vez que la derivada parcial del error respecto al peso en la iteración previa fue positiva ($\frac{\partial E}{\partial w} > 0$). Por la regla del gradiente descendente:
   $$\Delta w(t-1) = -\alpha \frac{\partial E}{\partial w} + \beta \Delta w(t-2)$$
   Un gradiente positivo fuerza un cambio de peso en sentido negativo para reducir el error.

3. **Efecto sobre el Proceso de Aprendizaje:**
   * **Si el gradiente actual mantiene el mismo signo negativo:** El término de momento negativo refuerza el ajuste en la misma dirección, acelerando la convergencia a lo largo de pendientes suaves y mesetas llanas.
   * **Si el gradiente actual cambia bruscamente de signo (oscilación):** El término de momento negativo contrarresta el impulso excesivo del gradiente actual, actuando como un **amortiguador inercial** que previene divergencias en valles estrechos y escarpados.

---

## 2. Pregunta 02: Definición y Cálculo de las Distancias $d(+)$ y $d(-)$ en SVM
* **Fuente:** Parcial Teórico 2023 ([`IA-H0079.md`](file:///c:/facultad/Inteligencia%20Artificial/recursos_historicos/derivados/IA-H0079/IA-H0079.md)), Pregunta 2.
* **Consigna:** En Support Vector Machines (SVM), explique qué son geométricamente las distancias $d(+)$ y $d(-)$, cómo se calculan analíticamente y cuál es su relación con el margen de la red.

### Respuesta Modelo de Cátedra:
1. **Definición Geométrica:**
   * $d(+)$ es la **distancia ortogonal más corta** medida desde el hiperplano central de separación ($H_0: \mathbf{w}^T \mathbf{x} + b = 0$) hasta la instancia de entrenamiento más cercana perteneciente a la **clase positiva ($y_i = +1$)**.
   * $d(-)$ es la **distancia ortogonal más corta** medida desde el hiperplano central $H_0$ hasta la instancia de entrenamiento más cercana perteneciente a la **clase negativa ($y_i = -1$)**.
   * Las instancias que se sitúan exactamente a estas distancias mínimas son los **Vectores de Soporte (Support Vectors)**.

2. **Deducción y Cálculo Analítico:**
   La distancia de cualquier punto $\mathbf{x}$ a un hiperplano $\mathbf{w}^T \mathbf{x} + b = 0$ viene dada por la proyección ortogonal normalizada:
   $$\text{dist}(\mathbf{x}, H_0) = \frac{|\mathbf{w}^T \mathbf{x} + b|}{\|\mathbf{w}\|}$$
   Para un vector de soporte positivo $\mathbf{x}_+$, el hiperplano canónico impone $\mathbf{w}^T \mathbf{x}_+ + b = +1$. Sustituyendo:
   $$d(+) = \frac{|+1|}{\|\mathbf{w}\|} = \frac{1}{\|\mathbf{w}\|}$$
   Para un vector de soporte negativo $\mathbf{x}_-$, el hiperplano canónico impone $\mathbf{w}^T \mathbf{x}_- + b = -1$. Sustituyendo:
   $$d(-) = \frac{|-1|}{\|\mathbf{w}\|} = \frac{1}{\|\mathbf{w}\|}$$

3. **Relación con el Margen Geométrico:**
   Por construcción de la SVM de margen óptimo, el hiperplano es estrictamente equidistante de ambas clases:
   $$d(+) = d(-) = \frac{1}{\|\mathbf{w}\|}$$
   El **Margen Total de Separación ($M$)** es la suma de ambas distancias:
   $$M = d(+) + d(-) = \frac{1}{\|\mathbf{w}\|} + \frac{1}{\|\mathbf{w}\|} = \frac{2}{\|\mathbf{w}\|}$$
   Maximizar el margen geométrico $M$ es formalmente equivalente a minimizar la norma cuadrática $\frac{1}{2}\|\mathbf{w}\|^2$.

---

## 3. Pregunta 03: Sobreajuste en el Algoritmo $K$-Means y Estrategias de Mitigación
* **Fuente:** Parcial Teórico 2023 ([`IA-H0076.md`](file:///c:/facultad/Inteligencia%20Artificial/recursos_historicos/derivados/IA-H0076/IA-H0076.md)), Pregunta 2.
* **Consigna:** Explique por qué se produce el sobreajuste (*overfitting*) en el algoritmo de agrupamiento $K$-Means y describa los métodos para solucionarlo.

### Respuesta Modelo de Cátedra:
1. **Causa del Sobreajuste en $K$-Means:**
   En aprendizaje no supervisado, el sobreajuste ocurre al parametrizar el modelo con un número de clusters $K$ excesivamente elevado.
   * La función de costo que minimiza $K$-Means es la inercia o suma de errores cuadráticos intra-cluster:
     $$J = \sum_{j=1}^K \sum_{x \in C_j} \|x - \mu_j\|^2$$
   * A medida que $K$ se incrementa, $J$ decrece monótonamente. En el caso extremo donde $K = N$ (cada muestra individual es su propio centroide), la inercia es exactamente **cero** ($J = 0$).
   * **Consecuencia:** El modelo memoriza el ruido y las irregularidades del conjunto muestral, perdiendo toda capacidad de sintetizar estructuras subyacentes y generalizar ante nuevos datos.

2. **Estrategias Técnicas de Mitigación:**
   * **Método del Codo (Elbow Method):** Se entrena $K$-Means para múltiples valores consecutivos de $K$ (ej. de $K=1$ a $10$) y se grafica la curva de inercia $J(K)$. Se selecciona como $K$ óptimo aquel punto de inflexión donde la reducción marginal del error comienza a aplanarse notablemente.
   * **Coeficiente de Silhouette (Silueta):** Evalúa la calidad de agrupamiento combinando la distancia media intra-cluster $a(i)$ con la distancia media al cluster vecino más cercano $b(i)$:
     $$s(i) = \frac{b(i) - a(i)}{\max(a(i), b(i))} \in [-1, +1]$$
     Se elige el valor de $K$ que maximice el promedio global de silueta ($\bar{s}$).
   * **Penalización por Complejidad (Criterios AIC / BIC):** Incorporar un término de penalización proporcional a la cantidad de parámetros libres ($K \times D$), castigando modelos sobrecomplejos.

---

## 4. Pregunta 04: Supuesto de Independencia Condicional en Naïve Bayes
* **Fuente:** Parcial Teórico 2023 / 2019.
* **Consigna:** Explique por qué el clasificador Naïve Bayes recibe el nombre de "ingenuo". ¿Qué consecuencias acarrea cuando los atributos están correlacionados y cómo se puede abordar el problema con datos continuos?

### Respuesta Modelo de Cátedra:
1. **Por qué es "Ingenuo":**
   Recibe el nombre de *Naïve* (ingenuo) porque asume la hipótesis simplificadora de que **todas las variables predictoras $x_1, x_2, \dots, x_D$ son condicionalmente independientes entre sí, dado el valor de la clase $C_k$**:
   $$P(x_1, x_2, \dots, x_D \mid C_k) = \prod_{i=1}^D P(x_i \mid C_k)$$
   En sistemas de la vida real, esta independencia casi nunca se cumple en forma estricta (por ejemplo, el peso y la altura de una persona presentan una marcada correlación).

2. **Consecuencias de la Correlación entre Atributos:**
   * Cuando existen atributos fuertemente correlacionados, Naïve Bayes incurre en un efecto de **doble cómputo de evidencia**: pondera dos veces la misma información subyacente.
   * Esto provoca que las probabilidades a posteriori calculadas tiendan a valores extremos (sobreconfianza: probabilidades muy cercanas a 0 o a 1).
   * A pesar de distorsionar las probabilidades numéricas exactas, el orden de clasificación ($\arg\max$) suele mantenerse sorprendentemente competitivo si no se requiere calibración precisa.

3. **Tratamiento de Datos Continuos Complejos (El Problema de los Espirales):**
   * Cuando los atributos son continuos y se modelan mediante densidades Gaussianas unimodales, el clasificador falla catastróficamente ante clases entrelazadas no convexas (como espirales concéntricas).
   * **Solución de Cátedra:** Reemplazar el modelo paramétrico Gaussiano por **Naïve Bayes con Histogramas (Bins Discretizados)**. Se divide el rango continuo de cada atributo en intervalos discretos $[a, b)$ y se calculan las verosimilitudes como frecuencias empíricas de recuento sobre las tablas de contingencia, capturando distribuciones multimodales sin imponer supuestos rígidos.

---

## 5. Pregunta 05: Modelo ADALINE vs. Perceptrón Simple
* **Fuente:** Parcial Teórico 2023 ([`IA-H0076.md`](file:///c:/facultad/Inteligencia%20Artificial/recursos_historicos/derivados/IA-H0076/IA-H0076.md)), Pregunta 1.
* **Consigna:** Explique el proceso de aprendizaje del modelo ADALINE y describa sus diferencias fundamentales con el modelo Perceptrón Simple.

### Respuesta Modelo de Cátedra:
1. **Diferencia Estructural en la Regla de Aprendizaje:**
   * **Perceptrón Simple (Rosenblatt):** Calcula el error comparando la salida deseada $d$ contra la **salida binaria cuantizada** $y = \text{sgn}(net)$ proveniente de la función escalón:
     $$e_{\text{percep}} = d - \text{sgn}(net)$$
     $$\Delta w_i = \alpha \cdot (d - y) \cdot x_i$$
   * **ADALINE (Adaptive Linear Neuron - Widrow & Hoff):** Calcula el error comparando la salida deseada $d$ directamente contra la **activación lineal continua** (la entrada neta $net = \mathbf{w}^T \mathbf{x} - \theta$), antes de pasar por el cuantizador:
     $$e_{\text{adaline}} = d - net = d - \mathbf{w}^T \mathbf{x}$$
     $$\Delta w_i = \alpha \cdot (d - net) \cdot x_i \quad (\text{Regla Delta / LMS / Widrow-Hoff})$$

2. **Naturaleza de la Superficie de Error:**
   * En el Perceptrón, la función escalón introduce discontinuidades y gradientes nulos en casi todo el espacio, impidiendo definir una superficie de costo diferenciable.
   * En ADALINE, la función de costo es el error cuadrático medio:
     $$E = \frac{1}{2} (d - \mathbf{w}^T \mathbf{x})^2$$
     Esta función define un **paraboloide cuadrático estrictamente convexo** en el espacio de pesos, con un único mínimo global garantizado donde el gradiente es analíticamente continuo.

3. **Comportamiento ante Conjuntos No Linealmente Separables:**
   * Si las clases no son linealmente separables, el Perceptrón Simple **nunca converge**: los pesos oscilan indefinidamente sin detenerse.
   * ADALINE **siempre converge** de manera estable hacia el vector de pesos que minimiza el error cuadrático medio global (solución de mínimos cuadrados).

---

## 6. Pregunta 06: Early Stopping y Manejo de Errores en MLP
* **Fuente:** Preguntas 2, 13 y 30 de `preguntas_parcial_2_text.txt`.
* **Consigna:** ¿Qué significan los errores de entrenamiento, validación y prueba en MLP? Explique el criterio de Early Stopping y qué acciones realizar si el error de validación crece antes de alcanzar el error mínimo admisible.

### Respuesta Modelo de Cátedra:
1. **Partición de Datos y Funciones de Error:**
   * **Error de Entrenamiento ($E_{\text{train}}$):** Computado sobre el subconjunto con el que se actualizan los pesos con Backpropagation. Debe disminuir monótonamente en cada época.
   * **Error de Validación ($E_{\text{val}}$):** Computado al cierre de cada época sobre datos no utilizados para el ajuste de pesos. Monitorea la capacidad de generalización.
   * **Error de Test ($E_{\text{test}}$):** Evaluado una única vez tras finalizar todo el entrenamiento para obtener una estimación insesgada del desempeño en producción.

2. **Criterio de Parada Temprana (*Early Stopping*):**
   A partir de un determinado número de épocas, la red comienza a memorizar el ruido específico de los ejemplos de entrenamiento. Mientras $E_{\text{train}}$ continúa bajando, $E_{\text{val}}$ alcanza un mínimo y **empieza a crecer**. En ese punto de divergencia se detiene el entrenamiento de forma inmediata y se conservan los pesos correspondientes al mínimo de validación.

3. **Acciones Correctivas si $E_{\text{val}}$ sube prematuramente antes de alcanzar el mínimo deseado:**
   * **Ajuste de Hiperparámetros:** Reducir la tasa de aprendizaje $\alpha$ para evitar pasos excesivamente grandes en el gradiente.
   * **Modificación Arquitectural:** Si la red tiene demasiada capacidad (demasiadas neuronas ocultas o capas), memoriza rápidamente; se debe podar la arquitectura (*pruning*) o regularizar.
   * **Enriquecimiento del Dataset:** El dataset puede estar sesgado o presentar desbalances. Mezclar (*shuffle*) aleatoriamente los datos antes de particionar y aumentar el volumen de muestras.
   * **El término de momento $\beta$:** No resuelve el sobreajuste; el momento acelera la convergencia pero no modifica los mínimos de la superficie de error.

---

## 7. Pregunta 07: Limitaciones y Patrones Espurios en Redes de Hopfield
* **Fuente:** Preguntas 25 y 35 de `preguntas_parcial_2_text.txt`.
* **Consigna:** Mencione y explique todas las dificultades y limitaciones de reconocimiento que presenta el modelo de red autoasociativa de Hopfield.

### Respuesta Modelo de Cátedra:
1. **Baja Capacidad de Almacenamiento Relativa:**
   Para una recuperación exacta sin errores, el número de patrones memorizables está severamente acotado por $M \le \frac{N}{4 \ln N}$ (o empíricamente $M \approx 0.138 N$). Para 100 neuronas, la red sólo puede almacenar confiablemente 14 informaciones.
2. **Requisito Estricto de Ortogonalidad:**
   Si los vectores memorizados no son mutuamente ortogonales ($\mathbf{e}_k \cdot \mathbf{e}_m \ne 0$, difieren en menos o más del 50% de sus componentes), los términos cruzados distorsionan la matriz Hebbiana, provocando que la red recupere patrones erróneos.
3. **Mínimos Espurios (Estados Falsos o Fantasmas):**
   La función de energía de Lyapunov genera mínimos locales adicionales que no corresponden a ninguno de los patrones aprendidos por el usuario:
   * **Estados Invertidos:** Si $\mathbf{E}_k$ es un mínimo local, su complemento $-\mathbf{E}_k$ es también un mínimo estable por simetría energética.
   * **Estados de Mezcla (Quimeras):** Combinaciones lineales impares de patrones aprendidos (por ejemplo, combinaciones de 3 patrones: $\text{sgn}(\mathbf{E}_1 + \mathbf{E}_2 + \mathbf{E}_3)$).
4. **Ciclos Límite en Actualización Síncrona:**
   Si la red se actualiza de forma síncrona (todas las neuronas al mismo tiempo), la red puede oscilar indefinidamente entre dos estados con período 2 en lugar de estabilizarse en un punto fijo.

---

## 8. Pregunta 08: Mutación en Algoritmos Genéticos: Temperatura vs. Convergencia
* **Fuente:** Parcial Teórico 2023 ([`IA-H0079.md`](file:///c:/facultad/Inteligencia%20Artificial/recursos_historicos/derivados/IA-H0079/IA-H0079.md)), Pregunta 3.
* **Consigna:** En Algoritmos Genéticos, ¿el método de mutación por temperatura descendente tiene en cuenta la homogeneidad de la población para establecer la probabilidad de mutar? Compare con otros esquemas adaptativos.

### Respuesta Modelo de Cátedra:
1. **Conclusión Técnica:** **NO.**
   El método de mutación adaptativa por temperatura descendente modela la tasa de mutación en función directa y exclusiva del **tiempo transcurrido o número de generación ($t$)**:
   $$P_m(t) = P_{\max} - \lambda \cdot t$$
   No calcula distancias de Hamming entre cromosomas ni mide la diversidad de la población.

2. **Ventajas de la Temperatura Descendente:**
   * Al inicio ($t=0$), una alta tasa de mutación fomenta una amplia **exploración** del espacio de búsqueda, evitando quedar atrapado prematuramente en la vecindad de las primeras soluciones generadas al azar.
   * Hacia el final, la tasa se reduce para realizar una **explotación o refinamiento fino** alrededor de las mejores soluciones sin destruirlas.

3. **Contraste con la Mutación por Convergencia (Homogeneidad):**
   El método que sí tiene en cuenta la similitud genética es la **Mutación Adaptativa por Grado de Convergencia**. En este esquema, se computa en cada generación el porcentaje de individuos idénticos ($H = \frac{N_{\text{idénticos}}}{N}$):
   * Si la población se homogeniza excesivamente ($H \to 1$), se dispara la tasa de mutación para forzar diversidad.
   * Si la población mantiene alta variabilidad, la tasa de mutación se conserva en niveles mínimos para permitir la convergencia natural.
