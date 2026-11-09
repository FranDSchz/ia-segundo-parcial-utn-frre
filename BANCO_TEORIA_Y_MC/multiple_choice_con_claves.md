# Banco de Multiple Choice con Claves Docentes Confirmadas
**Cátedra:** Inteligencia Artificial — UTN FRRe (5to Nivel ISI)  
**Profesor Titular:** Ing. Marcelo Karanik  
**Fuentes Documentales:** Exámenes teóricos oficiales impresos (2019 con corrección en tinta roja `CIN_teoria_IA2019.jpg`, 2020, 2021, 2023).

> [!IMPORTANT]
> **Penalización por Respuesta Incorrecta:**  
> En la modalidad presencial teórica de la UTN FRRe, las preguntas Multiple Choice o V/F suelen restar puntaje en caso de error. Por tanto, no se debe adivinar. Este banco compila las claves exactas validadas por el Ing. Marcelo Karanik junto a sus fundamentos teóricos.

---

## Pregunta MC 01 — Clustering Jerárquico: Centroides en Métodos de Enlace
* **Fuente Oficial:** Examen Teórico Oficial 2019 (`CIN_teoria_IA2019.jpg`), Pregunta 1.
* **Consigna:** En clustering jerárquico aglomerativo, la distancia entre dos clusters:
  - [ ] A) Se calcula utilizando la máxima distancia de sus centroides si se emplea el método Complete-Link.
  - [ ] B) Se calcula utilizando la mínima distancia de sus centroides si se emplea el método Single-Link.
  - [ ] C) Se calcula utilizando el promedio de la distancia de sus centroides si se emplea el método Average-Link.
  - [x] **D) Ninguna de las anteriores es correcta (TODAS SON FALSAS). <span style="color:red; font-weight:bold;">[CLAVE CORRECTA - VALIDADA EN ROJO]</span>**

* **Justificación Oficial de Cátedra:**
  Ninguno de los métodos de enlace canónicos (Single, Complete o Average) calcula distancias entre centroides:
  * **Single Link** utiliza la distancia mínima entre pares de elementos individuales: $\min_{x \in A, y \in B} d(x, y)$.
  * **Complete Link** utiliza la distancia máxima entre pares de elementos individuales: $\max_{x \in A, y \in B} d(x, y)$.
  * **Average Link** utiliza la media aritmética de todas las distancias entre pares cruzados: $\frac{1}{|A||B|} \sum \sum d(x, y)$.
  El cálculo explícito de centroides ($\mu = \frac{1}{|C|} \sum x_i$) corresponde a métodos ajenos a los enlaces clásicos, tales como *Centroid Linkage* (UPGMC) o *Ward*.

---

## Pregunta MC 02 — Clasificador $K$-NN Ponderado
* **Fuente Oficial:** Examen Teórico Oficial 2019, Pregunta 2.
* **Consigna:** Para utilizar el algoritmo $K$-NN ponderado:
  - [x] **A) No es necesario que las clases sean linealmente separables. <span style="color:red; font-weight:bold;">[CLAVE CORRECTA - VALIDADA EN ROJO]</span>**
  - [ ] B) Es necesario establecer previamente el valor del $K$ óptimo en forma analítica.
  - [ ] C) Puede utilizarse todo el conjunto de datos para estimar la clase de una nueva instancia obligatoriamente.

* **Justificación Oficial de Cátedra:**
  $K$-NN es un clasificador no paramétrico y local que aproxima fronteras de decisión de forma no lineal (mosaicos de Voronoi suaves), por lo que no impone ningún requisito de separabilidad lineal en el espacio de características. La opción B es falsa porque $K$ es un hiperparámetro empírico ajustado por validación cruzada.

---

## Pregunta MC 03 — Algoritmo Disk $K$-Means
* **Fuente Oficial:** Examen Teórico Oficial 2019, Pregunta 3.
* **Consigna:** El algoritmo Disk $K$-Means:
  - [ ] A) Retorna los mismos clusters que la versión $K$-Means si las semillas utilizadas en ambos casos son las mismas.
  - [ ] B) Requiere establecer la cantidad de clusters al inicio de la ejecución de forma fija e inmutable.
  - [x] **C) Permite analizar distintas configuraciones de clusters para seleccionar la adecuada. <span style="color:red; font-weight:bold;">[CLAVE CORRECTA - VALIDADA EN ROJO]</span>**

* **Justificación Oficial de Cátedra:**
  La variante Disk $K$-Means fue concebida para manejar grandes volúmenes de datos almacenados en memoria secundaria (disco) y evaluar dinámicamente configuraciones competitivas de centroides reduciendo el número de accesos a disco, permitiendo comparar índices de validez de múltiples particiones.

---

## Pregunta MC 04 — Vectores y Márgenes en Support Vector Machines (SVM)
* **Fuente Oficial:** Exámenes 2020 y 2023.
* **Consigna:** En una Support Vector Machine (caso lineal separable):
  - [x] **1. Los vectores de soporte son aquellos cuyo multiplicador de Lagrange $\alpha_i$ es estrictamente positivo ($\alpha_i > 0$). <span style="color:red; font-weight:bold;">[VERDADERO]</span>**
  - [ ] 2. Se debe recalcular todo el método cuando ingresa una nueva instancia de prueba para clasificarla. **[FALSO]**
  - [x] **3. Entre los hiperplanos de margen $H_+$ y $H_-$ no existen instancias del conjunto de entrenamiento. <span style="color:red; font-weight:bold;">[VERDADERO]</span>**
  - [ ] 4. Ninguna de las anteriores. **[FALSO]**

* **Justificación Oficial de Cátedra:**
  * La afirmación 1 es la definición axiomática de Karush-Kuhn-Tucker: si $\alpha_i = 0$, el punto no ejerce fuerza sobre el margen.
  * La afirmación 2 es falsa porque SVM realiza aprendizaje *eager* y *offline*: clasificar una nueva muestra cuesta un producto escalar directo $\text{sgn}(\mathbf{w}^T \mathbf{x} + b)$ sin reentrenar.
  * La afirmación 3 es verdadera por definición de margen estricto (*hard margin*): las restricciones exigen $y_i(\mathbf{w}^T \mathbf{x}_i + b) \ge 1$, dejando la banda de ancho $\frac{2}{\|\mathbf{w}\|}$ totalmente vacía de puntos.

---

## Pregunta MC 05 — Ortogonalidad en Redes de Hopfield
* **Fuente Oficial:** Examen Teórico 2021 / 2023.
* **Consigna:** En el modelo autoasociativo de Hopfield, el concepto de ortogonalidad está asociado a:
  - [ ] A) La cantidad de neuronas físicas en la capa de entrada.
  - [x] **B) Al grado de diferencia que hay entre los patrones de entrenamiento memorizados. <span style="color:red; font-weight:bold;">[CLAVE CORRECTA]</span>**
  - [ ] C) A la complejidad temporal de los cálculos en el proceso de entrenamiento.

* **Justificación Oficial de Cátedra:**
  En el álgebra bipolar $\{-1, +1\}^N$, dos patrones $\mathbf{e}_k$ y $\mathbf{e}_m$ son ortogonales si su producto escalar es nulo ($\mathbf{e}_k \cdot \mathbf{e}_m = 0$). Esto ocurre cuando difieren exactamente en el **50% de sus componentes** ($N/2$). Si los patrones no son ortogonales, existe correlación cruzada (*crosstalk*), reduciendo drásticamente la capacidad de almacenamiento y provocando que la red recupere patrones espurios.

---

## Pregunta MC 06 — Propiedades del Algoritmo $K$-Means
* **Consigna:** El algoritmo clásico $K$-Means:
  - [ ] A) Es un método de clasificación local. **[FALSO]**
  - [ ] B) Es un método de clasificación lazy. **[FALSO]**
  - [ ] C) Es un algoritmo de aprendizaje supervisado. **[FALSO]**
  - [x] **D) Ninguna de las anteriores. <span style="color:red; font-weight:bold;">[CLAVE CORRECTA]</span>**

* **Justificación Oficial de Cátedra:**
  $K$-Means es un algoritmo de **clustering no supervisado** (los datos no poseen etiquetas de clase), es **particional** (no jerárquico), opera de forma **global** (minimiza la suma global de errores cuadráticos intra-cluster / inercia), y es de tipo **eager** (construye centroides explícitos durante el entrenamiento iterativo). Por ende, las tres afirmaciones iniciales son rotundamente falsas.

---

## Pregunta MC 07 — Naturaleza del Algoritmo $K$-NN
* **Consigna:** El algoritmo $K$-NN:
  - [x] **1. Es lazy (vago / perezoso). <span style="color:red; font-weight:bold;">[VERDADERO]</span>**
  - [x] **2. Es un método local. <span style="color:red; font-weight:bold;">[VERDADERO]</span>**
  - [ ] 3. Requiere obligatoriamente que las clases tengan cantidades iguales o muy parecidas de instancias. **[FALSO]**

* **Justificación Oficial de Cátedra:**
  * Es *lazy* porque no procesa una función de hipótesis en la fase de entrenamiento: almacena los datos y calcula distancias sólo ante una consulta.
  * Es *local* porque su predicción se fundamenta exclusivamente en el entorno geométrico circundante a la consulta $\mathbf{x}_0$.
  * La opción 3 es falsa: aunque un desbalance severo afecta la votación mayoritaria simple, el algoritmo puede ejecutarse y corregirse mediante ponderación por distancia inversa $w_i = 1/d^2$.

---

## Pregunta MC 08 — Desbalance y Tamaño de Vecindad en $K$-NN ($K = p + q$)
* **Consigna:** En un dataset con dos clases ($p$ instancias de $A$ y $q$ instancias de $B$), se clasifica una nueva consulta fijando $K = p + q$ (la totalidad de los ejemplos) con votación mayoritaria simple:
  - [x] **1. Se clasifica como $A$ si $p > q$. <span style="color:red; font-weight:bold;">[VERDADERO]</span>**
  - [x] **2. Se clasifica como $B$ si $p < q$. <span style="color:red; font-weight:bold;">[VERDADERO]</span>**
  - [ ] 3. No se puede determinar de antemano sin haber calculado las distancias con la nueva instancia. **[FALSO para votación simple]**

* **Justificación Oficial de Cátedra:**
  Si $K$ abarca todo el dataset y la votación es **no ponderada** (recuento plano), la clase mayoritaria tendrá inexorablemente más votos ($p > q \implies A$, $q > p \implies B$) sin importar dónde esté ubicada la consulta en el espacio. Solo si existe ponderación por distancia inversa ($w_i = \frac{1}{1+d^2}$) la ubicación espacial podría potencialmente revertir el predominio de la clase mayoritaria.

---

## Pregunta MC 09 — Multiplicadores de Lagrange para Puntos No Soporte en SVM
* **Consigna:** En una Máquina de Vectores de Soporte lineal, los vectores de entrenamiento que **no son de soporte** tienen asociados multiplicadores de Lagrange cuyos valores son:
  - [ ] A) Estrictamente positivos ($\alpha_i > 0$).
  - [x] **B) Ceros ($\alpha_i = 0$). <span style="color:red; font-weight:bold;">[CLAVE CORRECTA]</span>**
  - [ ] C) Estrictamente negativos ($\alpha_i < 0$).

* **Justificación Oficial de Cátedra:**
  Por la condición de holgura complementaria de Karush-Kuhn-Tucker (KKT):
  $$\alpha_i \cdot [y_i (\mathbf{w}^T \mathbf{x}_i + b) - 1] = 0$$
  Para cualquier punto que no pertenezca al borde del margen, se tiene $y_i(\mathbf{w}^T \mathbf{x}_i + b) > 1$. Para que el producto sea nulo, **necesariamente $\alpha_i = 0$**.

---

## Pregunta MC 10 — Capacidad de Almacenamiento Teórica en Hopfield
* **Consigna:** La cantidad de patrones $M$ que puede memorizar una red de Hopfield de $N$ neuronas para una recuperación libre de errores es:
  - [ ] A) $M = \frac{M}{4 \ln N}$
  - [ ] B) $N = \frac{M}{4 \ln M}$
  - [x] **C) $M \le \frac{N}{4 \ln N}$ <span style="color:red; font-weight:bold;">[CLAVE CORRECTA]</span>**
  - [ ] D) $M \ge 0.50 N$

* **Justificación Oficial de Cátedra:**
  Para garantizar matemáticamente que todos los patrones memorizados correspondan a mínimos locales exactos de la función de Lyapunov con probabilidad tendiente a 1, la cota asintótica de McEliece y Posner establece que $M \le \frac{N}{4 \ln N}$. Si se tolera un pequeño margen de error en la recuperación, la cota empírica se amplía a $M \approx 0.138 N$.

---

## Pregunta MC 11 — Fase de Competencia en Mapas de Kohonen (SOM)
* **Consigna:** En la fase de competencia del entrenamiento de una red SOM:
  - [ ] A) Las mejores entradas definen la influencia en las neuronas de salida.
  - [ ] B) Se establece la magnitud de actualización de pesos mediante la función de vecindad.
  - [x] **C) Se establece la neurona de salida ganadora (BMU) en función de la menor distancia euclídea. <span style="color:red; font-weight:bold;">[CLAVE CORRECTA]</span>**
  - [ ] D) Las entradas compiten entre sí para alcanzar la mejor neurona.

* **Justificación Oficial de Cátedra:**
  La fase de competencia consiste en presentar un patrón de entrada $\mathbf{x}$ y computar la distancia contra todos los vectores de pesos $\mathbf{w}_j$, declarando como ganadora a la que presente la distancia mínima: $j^* = \arg\min_j \|\mathbf{x} - \mathbf{w}_j\|$. La opción B corresponde a la fase posterior de cooperación/adaptación.

---

## Pregunta MC 12 — Definición de la Capa de Entrada en SOM
* **Consigna:** La cantidad de neuronas en la capa de entrada de un SOM está definida por:
  - [ ] A) La cantidad de conexiones sinápticas.
  - [x] **B) Las dimensiones del problema (número de atributos del vector de entrada). <span style="color:red; font-weight:bold;">[CLAVE CORRECTA]</span>**
  - [ ] C) La topología elegida para la grilla de salida (rectangular o hexagonal).
  - [ ] D) La decisión arbitraria del diseñador.

* **Justificación Oficial de Cátedra:**
  Cada patrón de entrada tiene dimensión $D$ ($\mathbf{x} = [x_1, x_2, \dots, x_D]^T$). Por lo tanto, la capa de entrada de la red SOM debe poseer exactamente $D$ nodos, cada uno conectado a cada neurona de salida mediante un peso $w_{ji}$.

---

## Pregunta MC 13 — Capacidad de Separación de SVM Lineal
* **Consigna:** Las Máquinas de Vectores de Soporte con kernel lineal realizan separaciones lineales:
  - [ ] A) Solamente en problemas de dos dimensiones ($D = 2$).
  - [ ] B) En problemas con cualquier cantidad de clases simultáneas de forma nativa.
  - [x] **C) En problemas binarios (dos clases) en espacios de características de cualquier dimensionalidad ($D \ge 2$). <span style="color:red; font-weight:bold;">[CLAVE CORRECTA]</span>**
  - [ ] D) Únicamente cuando los multiplicadores de Lagrange son todos iguales.

* **Justificación Oficial de Cátedra:**
  SVM lineal está formulado nativamente como un clasificador binario ($y_i \in \{-1, +1\}$), pero su formulación opera en espacios euclidianos de cualquier dimensión $\mathbb{R}^D$ mediante hiperplanos de dimensión $D-1$. Para problemas multiclase ($K > 2$), se deben aplicar esquemas de descomposición externa como *One-vs-Rest* (OvR) o *One-vs-One* (OvO).

---

## Pregunta MC 14 — Término de Momento en el Perceptrón Multicapa (MLP)
* **Consigna:** El término de momento $\beta$ en el algoritmo Backpropagation:
  - [ ] A) Reemplaza al coeficiente de aprendizaje $\alpha$ cuando el gradiente se anula.
  - [x] **B) Acelera la convergencia a lo largo de direcciones consistentes y filtra oscilaciones de alta frecuencia. <span style="color:red; font-weight:bold;">[CLAVE CORRECTA]</span>**
  - [ ] C) Obliga a que la actualización de pesos sea siempre un número estrictamente positivo.

* **Justificación Oficial de Cátedra:**
  El término de momento $\beta \Delta w(t-1)$ añade una componente inercial al gradiente. Si los gradientes sucesivos apuntan en el mismo sentido, la velocidad de ajuste se incrementa (acelerando el cruce de mesetas llanas). Si los gradientes oscilan de signo (valles escarpados), las componentes consecutivas se cancelan parcialmente, estabilizando la trayectoria del descenso.
