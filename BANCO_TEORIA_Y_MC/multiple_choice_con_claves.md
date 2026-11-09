# Banco de Multiple Choice con Claves Docentes Confirmadas
**Cátedra:** Inteligencia Artificial — UTN FRRe (5to Nivel ISI)  
**Fuentes Documentales:** Exámenes teóricos oficiales impresos (2019 con corrección en tinta roja `CIN_teoria_IA2019.jpg`, 2020, 2021, 2023).

> [!IMPORTANT]
> **Penalización por Respuesta Incorrecta:**  
> En la modalidad presencial teórica de la UTN FRRe, las preguntas Multiple Choice o V/F suelen restar puntaje en caso de error. Por tanto, no se debe adivinar. Este banco compila las claves exactas validadas por la cátedra junto a sus fundamentos teóricos.

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
  - [ ] B) Es necesario establecer previamente el valor del $K$ óptimo. **[FALSO]**
  - [x] **C) Puede utilizarse todo el conjunto de datos ($K = N$) para estimar la clase de una nueva instancia. <span style="color:red; font-weight:bold;">[CLAVE CORRECTA - VALIDADA EN ROJO]</span>**

* **Justificación Oficial de Cátedra:**
  * **A es verdadera:** $K$-NN es un clasificador no paramétrico y local que aproxima fronteras de decisión de forma no lineal (mosaicos de Voronoi suaves), por lo que no impone ningún requisito de separabilidad lineal en el espacio de características.
  * **B es falsa:** El valor óptimo de $K$ no se conoce a priori; es un hiperparámetro empírico ajustado mediante validación cruzada (*Leave-One-Out*).
  * **C es verdadera:** En $K$-NN **ponderado** por distancia inversa ($w_i = \frac{1}{d^2}$ o $w_i = \frac{1}{1+d^2}$), es válido emplear todo el conjunto de entrenamiento ($K = N$) dado que las instancias lejanas reciben un peso infinitesimalmente pequeño y no distorsionan la decisión local.

---

## Pregunta MC 03 — Algoritmo Disk $K$-Means
* **Fuente Oficial:** Examen Teórico Oficial 2019, Pregunta 3.
* **Consigna:** El algoritmo Disk $K$-Means:
  - [x] **A) Retorna los mismos clusters que la versión $K$-Means estándar si las semillas utilizadas en ambos casos son las mismas. <span style="color:red; font-weight:bold;">[CLAVE CORRECTA - VALIDADA EN ROJO]</span>**
  - [x] **B) Requiere establecer la cantidad de clusters $K$ al inicio de la ejecución. <span style="color:red; font-weight:bold;">[CLAVE CORRECTA - VALIDADA EN ROJO]</span>**
  - [ ] C) Determina automáticamente el número óptimo de clusters en una única pasada sin intervención del usuario. **[FALSO]**

* **Justificación Oficial de Cátedra:**
  La variante Disk $K$-Means fue concebida para manejar grandes volúmenes de datos almacenados en memoria secundaria (disco) reduciendo las operaciones de I/O a una lectura secuencial por iteración, pero acumula las sumas y calcula exactamente la misma media aritmética por grupo que $K$-Means clásico; por lo tanto, **bajo idénticas semillas iniciales converge exactamente a los mismos centroides y clusters**. Asimismo, exige definir el hiperparámetro $K$ al inicio de la corrida.

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
  * La afirmación 2 es falsa porque SVM realiza aprendizaje *eager* y *offline*: clasificar una nueva instancia de prueba cuesta un producto escalar directo $\text{sgn}(\mathbf{w}^T \mathbf{x} + b)$ sin reentrenar (sólo se recalcularía si ingresara una nueva instancia de *entrenamiento* que violase el margen).
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
  - [ ] 3. Requiere obligatoriamente que las clases tengan cantidades iguales o muy parecidas de instancias para poder ejecutarse. **[FALSO]**

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

---

# PARTE II: Nuevos Hallazgos Teóricos de Alta Frecuencia (Auditoría de Exámenes Reales)

## Pregunta MC 53 — Redes Neuronales Competitivas: Arquitectura SOM con Conexiones Laterales Inhibitorias
* **Fuente Oficial:** Exámenes de Cátedra (Parciales y Finales).
* **Consigna:** En la arquitectura de una red neuronal autoorganizada competitiva (SOM de Kohonen) dotada de conexiones laterales recurrentes (modelo de Sombrero Mexicano):
  - [x] **A) Las neuronas de la capa de salida compiten mediante autoexcitación positiva local (a corta distancia) y conexiones inhibitorias negativas hacia neuronas situadas a media y larga distancia en la grilla. <span style="color:red; font-weight:bold;">[CLAVE CORRECTA]</span>**
  - [x] **B) La función de vecindad $h_{cj}(t)$ modula la magnitud del ajuste sináptico de las neuronas vecinas a la ganadora (BMU), contrayendo su radio de influencia con el avance de las iteraciones. <span style="color:red; font-weight:bold;">[CLAVE CORRECTA]</span>**
  - [ ] C) El aprendizaje es supervisado y requiere conocer a priori la clase objetivo de cada vector de entrada para actualizar los pesos. **[FALSO]**
  - [x] **D) La red preserva la topología del espacio de entrada, de modo que patrones con pequeña distancia euclídea activan neuronas contiguas en el mapa de salida. <span style="color:red; font-weight:bold;">[CLAVE CORRECTA]</span>**

* **Justificación Oficial de Cátedra:**
  En la red SOM de Kohonen con conexiones laterales:
  * **Las opciones A, B y D son verdaderas:**
    - El modelo biológico del Sombrero Mexicano implementa cooperación local mediante conexiones excitatorias de corto alcance e inhibición lateral a media/larga distancia para concentrar la respuesta en un único grupo ganador (*winner-take-all* suave).
    - La función de vecindad $h_{cj}(t) = \exp\left(-\frac{\text{dist}^2(c, j)}{2\sigma(t)^2}\right)$ disminuye tanto con la distancia topológica a la BMU como con el tiempo, contrayendo $\sigma(t)$ para pasar de autoorganización global a ajuste fino local.
    - La propiedad central de SOM es la preservación topológica (*topological ordering*): mapea relaciones de proximidad de $\mathbb{R}^N$ sobre una grilla bidimensional o unidimensional.
  * **La opción C es falsa:** SOM es un modelo de aprendizaje estrictamente **no supervisado**; los vectores de entrada no poseen etiquetas de clase.

---

## Pregunta MC 54 — Aprendizaje Basado en Explicaciones (EBL): Rol Determinante de la Teoría del Dominio
* **Fuente Oficial:** Exámenes de Cátedra (Parciales y Finales).
* **Consigna:** En el paradigma de Aprendizaje Basado en Explicaciones (EBL - Explanation-Based Learning), en contraste con los métodos de aprendizaje inductivo empírico:
  - [x] **A) El factor determinante y excluyente para su funcionamiento es contar previamente con una Teoría del Dominio (Domain Theory) completa y consistente. <span style="color:red; font-weight:bold;">[CLAVE CORRECTA]</span>**
  - [x] **B) Es un método analítico-deductivo capaz de aprender y generalizar un concepto a partir de un único ejemplo de entrenamiento (one-shot learning). <span style="color:red; font-weight:bold;">[CLAVE CORRECTA]</span>**
  - [ ] C) Requiere miles de instancias de entrenamiento para inferir hipótesis mediante correlación estadística y frecuencias relativas. **[FALSO]**
  - [x] **D) Utiliza la teoría del dominio para construir una prueba formal que explica deductivamente por qué el ejemplo satisface el concepto meta, generalizándola mediante regresión de objetivos. <span style="color:red; font-weight:bold;">[CLAVE CORRECTA]</span>**

* **Justificación Oficial de Cátedra:**
  En el paradigma EBL:
  * **Las opciones A, B y D son verdaderas:**
    - La disponibilidad de una Teoría del Dominio previa (axiomas, reglas y relaciones causales) es el factor determinante indispensable; sin ella no es posible construir la explicación deductiva fundacional.
    - Al apoyarse en razonamiento deductivo a partir de la teoría del dominio, el sistema puede extraer el concepto general a partir de un único ejemplo positivo (*one-shot learning*).
    - El algoritmo EBL construye un árbol de demostración formal y luego sustituye las constantes específicas del ejemplo por variables generales mediante regresión de objetivos (*Goal Regression* / EBG), asegurando que la regla aprendida preserve validez deductiva.
  * **La opción C es falsa:** La necesidad de grandes volúmenes de datos estadísticos caracteriza al aprendizaje inductivo empírico (como redes neuronales, árboles de decisión o Naive Bayes), no al aprendizaje deductivo EBL.

---

## Pregunta MC 55 — Clustering Jerárquico: Análisis Comparativo entre Single-Link, Complete-Link y Average-Link
* **Fuente Oficial:** Exámenes de Cátedra (Parciales y Finales).
* **Consigna:** Al evaluar las propiedades geométricas y de estabilidad de los métodos clásicos de enlace en clustering jerárquico aglomerativo:
  - [x] **A) El método Single-Link (distancia mínima entre pares) sufre del efecto de encadenamiento (chaining effect), tendiendo a fusionar grupos distintos a través de puentes de puntos ruidosos. <span style="color:red; font-weight:bold;">[CLAVE CORRECTA]</span>**
  - [x] **B) El método Complete-Link (distancia máxima entre pares) es más conservador y tiende a generar cúmulos compactos, esféricos y de diámetros homogéneos. <span style="color:red; font-weight:bold;">[CLAVE CORRECTA]</span>**
  - [ ] C) El método Average-Link calcula la distancia inter-cluster evaluando exclusivamente la distancia euclídea entre los centroides de ambos grupos. **[FALSO]**
  - [x] **D) El método Average-Link calcula la media aritmética de todas las distancias entre pares cruzados de instancias de ambos grupos, ofreciendo un compromiso equilibrado frente al ruido. <span style="color:red; font-weight:bold;">[CLAVE CORRECTA]</span>**

* **Justificación Oficial de Cátedra:**
  Análisis de métodos de enlace en clustering jerárquico:
  * **Las opciones A, B y D son verdaderas:**
    - Por definir la disimilitud como $d(A, B) = \min_{x \in A, y \in B} d(x, y)$, Single Link es vulnerable al efecto de encadenamiento (*chaining*), formando cadenas alargadas o serpenteantes si existen instancias intermedias dispersas.
    - Complete Link define $d(A, B) = \max_{x \in A, y \in B} d(x, y)$, lo que exige que todos los puntos de ambos grupos estén próximos para fusionarse, produciendo cúmulos de diámetro reducido y formas compactas.
    - Average Link (UPGMA) promedia todas las distancias punto a punto: $\frac{1}{|A||B|} \sum_{x \in A} \sum_{y \in B} d(x, y)$, logrando una mayor estabilidad estadística ante ruido.
  * **La opción C es falsa:** Ninguno de los tres enlaces clásicos (Single, Complete ni Average) utiliza centroides; el uso de centroides define métodos distintos como *Centroid Linkage* (UPGMC) o *Ward*.

---

## Pregunta MC 56 — Clasificador $K$-NN Ponderado: Ponderación por Inversa al Cuadrado y Robustez ante Hiperparámetros
* **Fuente Oficial:** Exámenes de Cátedra (Parciales y Finales).
* **Consigna:** En el clasificador $K$-NN ponderado por distancia inversa con pesos $w_i = \frac{1}{d(\mathbf{x}_q, \mathbf{x}_i)^2}$:
  - [x] **A) Las instancias de entrenamiento más cercanas a la consulta adquieren un peso dominante, mientras que las instancias lejanas u outliers ejercen un impacto infinitesimal en la votación. <span style="color:red; font-weight:bold;">[CLAVE CORRECTA]</span>**
  - [x] **B) Se mitiga sustancialmente la sensibilidad ante la elección de $k$, permitiendo incluso utilizar todo el dataset ($k = N$) sin que las regiones lejanas distorsionen la decisión local. <span style="color:red; font-weight:bold;">[CLAVE CORRECTA]</span>**
  - [x] **C) Es imprescindible normalizar o estandarizar las variables continuas cuando poseen rangos de escala significativamente dispares para evitar distorsiones métricas. <span style="color:red; font-weight:bold;">[CLAVE CORRECTA]</span>**
  - [ ] D) El algoritmo exige que las clases sean linealmente separables en el espacio de entrada para asegurar convergencia teórica. **[FALSO]**

* **Justificación Oficial de Cátedra:**
  Propiedades del algoritmo $K$-NN ponderado por distancia inversa:
  * **Las opciones A, B y C son verdaderas:**
    - La ponderación $w_i = \frac{1}{d^2}$ decae cuadráticamente con la distancia. Esto protege la decisión local frente a outliers alejados y hace que fijar $k = N$ sea viable sin que la clase mayoritaria global degrade el voto del entorno inmediato.
    - Como cualquier método basado en distancias euclídeas, atributos con magnitudes numéricas grandes dominarían artificialmente el cálculo de distancia si no se normalizan al intervalo $[0, 1]$ o a media cero y varianza unitaria.
  * **La opción D es falsa:** $K$-NN es un clasificador no paramétrico y local que aproxima fronteras de Voronoi altamente no lineales; no asume ninguna hipótesis de separabilidad lineal.

---

## Pregunta MC 57 — Perceptrón Multicapa: Dinámica Física e Inercia del Término de Momento ($\beta$)
* **Fuente Oficial:** Exámenes de Cátedra (Parciales y Finales).
* **Consigna:** En el entrenamiento de un Perceptrón Multicapa (MLP) mediante Backpropagation, la regla de actualización con término de momento es $\Delta w(t) = -\alpha \nabla E(t) + \beta \Delta w(t-1)$ con $\beta \in [0, 1)$. Respecto a su efecto físico y dinámico:
  - [x] **A) Actúa como una masa inercial que acumula velocidad en zonas de pendiente consistente (mesetas llanas), acelerando la marcha del algoritmo hacia el mínimo. <span style="color:red; font-weight:bold;">[CLAVE CORRECTA]</span>**
  - [x] **B) En valles estrechos con curvas de nivel alargadas donde el gradiente oscila abruptamente entre paredes opuestas, amortigua las componentes de alta frecuencia estabilizando el descenso. <span style="color:red; font-weight:bold;">[CLAVE CORRECTA]</span>**
  - [x] **C) El término de momento $\beta \Delta w(t-1)$ es un vector que puede tomar valores numéricos negativos cuando el peso disminuyó en la iteración previa. <span style="color:red; font-weight:bold;">[CLAVE CORRECTA]</span>**
  - [ ] D) El término de momento elimina la necesidad de fijar la tasa de aprendizaje $\alpha$, volviendo prescindible el cálculo del gradiente de error. **[FALSO]**

* **Justificación Oficial de Cátedra:**
  Dinámica del término de momento en MLP:
  * **Las opciones A, B y C son verdaderas:**
    - El parámetro inercial $\beta$ suma una fracción del desplazamiento anterior. Si los gradientes son coherentes en signo, la velocidad efectiva aumenta $\Delta w_{\max} \approx \frac{-\alpha \nabla E}{1-\beta}$ (atravesando mesetas llanas rápidamente). Si los gradientes alternan de signo, los términos sucesivos se contrarrestan, cancelando oscilaciones transversales estériles y conduciendo la actualización hacia el fondo del cañón.
    - Aunque el coeficiente escalar $\beta \ge 0$ es no negativo, el término de momento $\beta \Delta w(t-1) = \beta (w(t) - w(t-1))$ adopta signo negativo siempre que $w(t) < w(t-1)$, siendo una trampa conceptual clásica de examen.
  * **La opción D es falsa:** El momento complementa y modula el gradiente local guiado por $\alpha$, pero jamás sustituye al vector gradiente $\nabla E$ ni a la tasa de aprendizaje.

---

## Pregunta MC 58 — Support Vector Machines: Multiplicadores de Lagrange $\alpha_i$ y Condiciones KKT de Soporte
* **Fuente Oficial:** Exámenes de Cátedra (Parciales y Finales).
* **Consigna:** En la formulación dual de una Support Vector Machine lineal para datos linealmente separables, las condiciones de holgura complementaria de Karush-Kuhn-Tucker (KKT) establecen $\alpha_i [y_i(\mathbf{w}^T \mathbf{x}_i + b) - 1] = 0$ con $\alpha_i \ge 0$. De acuerdo con esta doctrina:
  - [x] **A) Los vectores de soporte son exclusivamente aquellos situados sobre los hiperplanos de margen ($y_i(\mathbf{w}^T \mathbf{x}_i + b) = 1$), para los cuales $\alpha_i > 0$. <span style="color:red; font-weight:bold;">[CLAVE CORRECTA]</span>**
  - [x] **B) Para todas las instancias interiores que no son de soporte ($y_i(\mathbf{w}^T \mathbf{x}_i + b) > 1$), sus multiplicadores de Lagrange son idénticamente nulos ($\alpha_i = 0$). <span style="color:red; font-weight:bold;">[CLAVE CORRECTA]</span>**
  - [x] **C) El vector director normal del hiperplano depende de la suma de todo el dataset: $\mathbf{w} = \sum_{i=1}^N \alpha_i y_i \mathbf{x}_i$, pero solo los vectores de soporte con $\alpha_i > 0$ contribuyen activamente a su valor. <span style="color:red; font-weight:bold;">[CLAVE CORRECTA]</span>**
  - [ ] D) Si se eliminara del conjunto de entrenamiento un vector interior (con $\alpha_i = 0$), el hiperplano óptimo y los márgenes variarían drásticamente. **[FALSO]**

* **Justificación Oficial de Cátedra:**
  Condiciones KKT y multiplicadores de Lagrange en SVM:
  * **Las opciones A, B y C son verdaderas:**
    - Por holgura complementaria KKT, el producto $\alpha_i [y_i(\mathbf{w}^T \mathbf{x}_i + b) - 1]$ debe anularse para toda instancia $i$. Si el punto se sitúa estrictamente detrás del margen ($y_i(\mathbf{w}^T \mathbf{x}_i + b) > 1$), el corchete es estrictamente positivo, obligando a que $\alpha_i = 0$. Únicamente cuando la instancia descansa exactamente sobre el margen límite ($y_i(\mathbf{w}^T \mathbf{x}_i + b) = 1$), el multiplicador puede ser positivo ($\alpha_i > 0$), definiendo un vector de soporte.
    - Como $\alpha_i = 0$ para todos los puntos no soporte, el vector de pesos $\mathbf{w} = \sum_{i \in \text{SV}} \alpha_i y_i \mathbf{x}_i$ es una combinación lineal dispersa (*sparse*) sustentada únicamente en los vectores de soporte.
  * **La opción D es falsa:** La remoción o desplazamiento de cualquier punto interior que mantenga $\alpha_i = 0$ no produce alteración alguna en la frontera de separación ni en los márgenes de decisión.

---

## Pregunta MC 59 — Redes de Hopfield: Ortogonalidad Estricta de Patrones y Condición de Diagonal Nula ($w_{ii}=0$)
* **Fuente Oficial:** Exámenes de Cátedra (Parciales y Finales).
* **Consigna:** En el modelo autoasociativo discreto de Hopfield con estados bipolares $s_i \in \{-1, +1\}$ y matriz de pesos Hebbiana $\mathbf{W}$:
  - [x] **A) La ortogonalidad estricta entre dos patrones memorizados $\mathbf{e}^{(k)}$ y $\mathbf{e}^{(m)}$ exige que su producto escalar sea nulo ($\sum_{i=1}^N e_i^{(k)} e_i^{(m)} = 0$), lo que significa que difieren exactamente en el 50% de sus componentes. <span style="color:red; font-weight:bold;">[CLAVE CORRECTA]</span>**
  - [x] **B) La condición de diagonal nula ($w_{ii} = 0$) anula la auto-retroalimentación directa de cada neurona sobre sí misma, impidiendo dinámicas de autoexcitación desestabilizadoras. <span style="color:red; font-weight:bold;">[CLAVE CORRECTA]</span>**
  - [x] **C) La simetría $\mathbf{W} = \mathbf{W}^T$ junto con $w_{ii} = 0$ garantiza matemáticamente la convergencia monótona de la función de energía de Lyapunov ($E = -\frac{1}{2} \sum \sum w_{ij} s_i s_j$) hacia un atractor estable en actualización asincrónica. <span style="color:red; font-weight:bold;">[CLAVE CORRECTA]</span>**
  - [ ] D) Si los patrones a memorizar poseen alta correlación positiva entre sí (no ortogonales), la capacidad de almacenamiento efectivo aumenta debido al refuerzo sináptico mutuo. **[FALSO]**

* **Justificación Oficial de Cátedra:**
  Propiedades fundamentales de las redes de Hopfield:
  * **Las opciones A, B y C son verdaderas:**
    - La ortogonalidad en el espacio bipolar $\{-1, +1\}^N$ se define por $\mathbf{e}^{(k)} \cdot \mathbf{e}^{(m)} = 0$, requiriendo que exactamente la mitad ($N/2$) de las componentes coincidan (+1) y la otra mitad difiera (-1). Esto anula los términos de interferencia cruzada (*crosstalk*) en la regla Hebbiana.
    - La fijación de $w_{ii} = 0$ elimina bucles reflexivos y, unida a la simetría $w_{ij} = w_{ji}$, asegura que ante la actualización asincrónica de la neurona $k$, el cambio de energía sea $\Delta E = -\Delta s_k \cdot \text{net}_k \le 0$, asegurando que la red descienda sin ciclos oscilatorios a un mínimo de Lyapunov.
  * **La opción D es falsa:** La correlación cruzada entre patrones no ortogonales genera diafonía destructiva, degrada drásticamente la capacidad de recuperación libre de errores y genera mínimos espurios no deseados.
