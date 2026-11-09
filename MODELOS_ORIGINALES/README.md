# Guía Maestra y Catálogo Forense de Modelos de Examen Originales (Segundo Parcial)

**Universidad:** Universidad Tecnológica Nacional – Facultad Regional Resistencia (UTN FRRe)  
**Carrera:** Ingeniería en Sistemas de Información (5to Nivel)  
**Asignatura:** Inteligencia Artificial  
**Cátedra:** Inteligencia Artificial (UTN FRRe)  
**Destino Académico:** Preparación Integral para el Segundo Parcial Teórico-Práctico (Semana 14 – 18/11/2026)  
**Estado:** Curado, Anonimizado, Auditado y Verificado Criptográficamente  

---

## 1. Presentación y Propósito de este Repositorio

Este directorio reúne la **totalidad de los exámenes parciales, recuperatorios y compilaciones prácticas originales** recopilados a lo largo de más de una década de evaluaciones de la cátedra de Inteligencia Artificial de la UTN FRRe.

Todos los archivos han sido:
1. **Anonimizados:** Se removió cualquier dato personal sensible de los alumnos que aportaron sus exámenes.
2. **Normalizados y Reorganizados:** Nombres de archivo estandarizados por año, modalidad y tipo de evaluación.
3. **Auditados contra Ruido P1:** En años anteriores a 2022, el temario de las materias del plan histórico ubicaba temas de búsqueda sistemática/heurística ($A^*$, DFS, BFS, Escalada) y planificación en el Segundo Parcial. En la cursada actual (2026), **esos temas ya fueron evaluados en el Primer Parcial**. Cada ficha técnica detalla explícitamente qué ejercicios entran y cuáles deben ser ignorados.
4. **Respaldados Multimodalmente:** Todos los diagramas de redes neuronales, esquemas de topología SOM, árboles, tablas de datos numéricos y correcciones docentes en tinta roja fueron recortados y preservados en la carpeta [`imagenes/`](../imagenes/) para consulta de alta definición.

---

## 2. Matriz Resumen de Archivos y Fichas Técnicas

| Subcarpeta | Archivo | Año / Período | Legibilidad | Temas Cubiertos | % Activo P2 | Advertencia Ruido P1 |
| :--- | :--- | :---: | :---: | :--- | :---: | :---: |
| **`2024_2025/`** | `segundo_parcial_19_nov_2025.md` | Nov 2025 | ⭐⭐⭐⭐⭐ | Clustering Avg/Complete, SOM Vecindad, MLP, Algoritmos Genéticos | **100%** | Sin ruido P1 (Canónico) |
| **`2024_2025/`** | `finales_practicos_2024_2025.md` | 2024-2025 | ⭐⭐⭐⭐⭐ | Naive Bayes Normal, K-Means 2 iter, MLP Error, Hopfield Ortogonalidad | **80%** | ⚠️ Incluye A* y Planning (P1) |
| **`2024_2025/`** | `finales_teoricos_2024_2025.md` | 2024-2025 | ⭐⭐⭐⭐⭐ | Momento negativo, Early Stopping, Disk K-Means, SVM d+/d-, SOM | **70%** | ⚠️ Incluye Downward closure (P1) |
| **`2024_2025/`** | `parcial_2p_svm_som_mlp_early_stopping.jpg` | 2024-2025 | ⭐⭐⭐⭐⭐ | SVM Dual, SOM Vecindad Nula, MLP Curvas Validación y Early Stopping | **75%** | ⚠️ Ejercicio 4 es Búsqueda (P1) |
| **`2024_2025/`** | `parcial_teoria_som_mlp_nb_knn_kmeans.jpg` | 2024-2025 | ⭐⭐⭐⭐⭐ | SOM Conexiones Laterales, MLP vs NB, Factores Ajuste, EBL, MC | **75%** | ⚠️ MC 5 es A* (P1) |
| **`2024_2025/`** | `recuperatorio_1_mlp_svm_knn_hopfield.jpg` | 2024-2025 | ⭐⭐⭐⭐⭐ | MLP 2 Capas Ocultas, SVM Dual, KNN Ponderado 1/d², Hopfield | **100%** | Sin ruido P1 (Canónico) |
| **`finales_historicos/`** | `17_02_2021_Final_IA.pdf` | Feb 2021 | ⭐⭐⭐⭐⭐ | Momento MLP, Agente Reactivo, SVM w/b, KNN Ponderado, K-Means | **70%** | ⚠️ Incluye C4.5 y Amenazas (P1) |
| **`finales_historicos/`** | `2da_mesa_febrero.jpeg` | Feb 2021 | ⭐⭐⭐⭐⭐ | Tabla Comparativa SOM/Hopfield/Perceptrón, Early Stopping MLP | **75%** | ⚠️ Downward closure y C4.5 (P1) |
| **`finales_historicos/`** | `final_screen_2021_04_27.png` | Abr 2021 | ⭐⭐⭐⭐⭐ | Tabla Comparativa MLP/SVM/Hopfield, Diseño MLP f=sin(xy)-0.5 | **75%** | ⚠️ Amenazas en POP (P1) |
| **`finales_historicos/`** | `final_screen_2021_06_08.png` | Jun 2021 | ⭐⭐⭐⭐⭐ | Tabla Comparativa KNN/K-Means/NB, Diseño MLP Paridad XOR 3D, SVM | **75%** | ⚠️ Downward closure (P1) |
| **`finales_historicos/`** | `practica_final_1.jpeg` | ~2021 | ⭐⭐⭐⭐⭐ | Naive Bayes Normal, Clustering Jerárquico Dendrograma, MLP Error | **75%** | ⚠️ Ejercicio 4 es A* (P1) |
| **`finales_historicos/`** | `practica_final_2.jpeg` | Feb 2021 | ⭐⭐⭐⭐⭐ | KNN Ponderado k=3, Perceptrón Analítico, K-Means Semillas (2,4)/(1,1) | **75%** | ⚠️ Ejercicio 4 es Búsqueda (P1) |
| **`finales_historicos/`** | `practica_final_3.jpeg` | ~2021 | ⭐⭐⭐⭐⭐ | SVM Dual 4 puntos en R2 | **33%** | ⚠️ Ej. 2 Bloques (P1), Ej. 3 C4.5 |
| **`finales_historicos/`** | `practica_final_4.jpeg` | ~2021 | ⭐⭐⭐⭐⭐ | Clustering Jerárquico 5 puntos, Perceptrón Analítico | **65%** | ⚠️ Ej. 3 Árbol C4.5 (P1) |
| **`2023/`** | `2023_parcial2_tema1.jpeg` | Nov 2023 | ⭐⭐⭐⭐☆ | SVM, SOM, MLP Backprop, Clustering Avg-Link | **100%** | Sin ruido P1 (Canónico) |
| **`2023/`** | `2023_parcial2_tema2.jpeg` | Nov 2023 | ⭐⭐⭐⭐☆ | SVM, SOM, MLP Backprop, Clustering Avg-Link | **100%** | Sin ruido P1 (Canónico) |
| **`2023/`** | `2023_teoria_tema1.jpeg` | Nov 2023 | ⭐⭐⭐⭐☆ | MLP en $\mathbb{R}^2$, Avg Link vs Centroides, SOM | **75%** | ⚠️ Ejercicio 3 es $A^*$ (P1) |
| **`2023/`** | `2023_teoria_tema2.jpeg` | Nov 2023 | ⭐⭐⭐⭐☆ | ADALINE vs Perceptrón, $k$-means, Naive Bayes, KNN | **80%** | ⚠️ Ejercicio 4 es $A^*$ (P1) |
| **`2023/`** | `2023_teoria_desarrollo.jpeg` | Nov 2023 | ⭐⭐⭐☆☆ | Momento MLP, SVM $d(-)/d(+)$, AG Temperatura, Hopfield | **100%** | Sin ruido (¡Incluye AG!) |
| **`2022/`** | `2022_practico.pdf` | Sep 2022 | ⭐⭐⭐⭐⭐ | C4.5, Planificación POP, Apriori, SBR | **0%** | ⛔ **100% RUIDO P1 (Ignorar)** |
| **`2020_2021_virtuales/`**| `2020_parcial2_resuelto_alumno_A.pdf` | Nov 2020 | ⭐⭐⭐⭐☆ | SVM, SOM, MLP Error Global, KNN Leave-One-Out | **80%** | ⚠️ Ejercicio 4 es Búsqueda (P1) |
| **`2020_2021_virtuales/`**| `2020_recup_parcial2_resuelto_alumno_A.pdf`| Dic 2020 | ⭐⭐⭐⭐☆ | $k$-fold CV, Perceptrón Analítico, SOM, SVM | **80%** | ⚠️ Ejercicio 1 es Búsqueda (P1) |
| **`2020_2021_virtuales/`**| `2020_parcial2_resuelto_alumno_B.pdf` | Nov 2020 | ⭐⭐⭐☆☆ | SVM Lagrangiano, SOM Vecindad Nula, MLP | **75%** | ⚠️ Ejercicio 4 es Búsqueda (P1) |
| **`2020_2021_virtuales/`**| `2020_recup_parcial2_oficial.pdf` | Dic 2020 | ⭐⭐⭐⭐☆ | $k$-fold CV, Perceptrón Analítico, SOM | **75%** | ⚠️ Ejercicio 1 es Búsqueda (P1) |
| **`2020_2021_virtuales/`**| `2021_recup_parcial2_oficial_IA-H0122.jpeg`| ~2021 | ⭐⭐⭐⭐☆ | MLP (2 capas ocultas), SVM Dual, KNN Ponderado, Hopfield | **100%** | Sin ruido P1 (Canónico) |
| **`2020_2021_virtuales/`**| `2020_parcial2_virtual_zoom_IA-H0123.jpeg` | 2020 | ⭐⭐⭐⭐☆ | SVM Dual, SOM Vecindad Nula, MLP Error Global | **75%** | ⚠️ Ejercicio 4 es Búsqueda (P1) |
| **`2020_2021_virtuales/`**| `2020_recup_parcial2_virtual_zoom_IA-H0124.jpeg`| Nov 2020 | ⭐⭐⭐⭐☆ | $k$-fold CV, Perceptrón Analítico, SOM | **75%** | ⚠️ Ejercicio 1 es Búsqueda (P1) |
| **`2020_2021_virtuales/`**| `2020_recup_resolucion_som_alumno.png` | Nov 2020 | ⭐⭐⭐⭐☆ | SOM traza de cálculo y actualización online | **100%** | Sin ruido P1 |
| **`2020_2021_virtuales/`**| `2020_2021_teoria_multiple_choice_IA-H0129.jpeg`| ~2021 | ⭐⭐⭐⭐☆ | MLP vs NB en $\mathbb{R}^2$, Ajuste Parámetros, SOM, EBL, MC | **75%** | ⚠️ MC 5 es $A^*$ (P1) |
| **`2015_2019/`** | `2019_cin_practica_4k.jpg` | Nov 2019 | ⭐⭐⭐⭐⭐ | SVM Dual, Clustering Single/Complete, MLP Momento | **75%** | ⚠️ Ejercicio 4 es Búsqueda (P1) |
| **`2015_2019/`** | `2019_cin_teoria_correccion_roja_4k.jpg`| Nov 2019 | ⭐⭐⭐⭐⭐ | MLP vs NB, Conexiones Laterales SOM, EBL, MC | **75%** | ⚠️ MC 5 es Búsqueda (P1) |
| **`2015_2019/`** | `2016_parcial2_presencial.jpg` | Nov 2016 | ⭐⭐⭐⭐☆ | Naive Bayes Histogramas, Perceptrón Analítico, Hopfield, SVM | **80%** | ⚠️ Ejercicio 1 es Búsqueda (P1) |
| **`2015_2019/`** | `2015_parcial2_presencial.jpg` | Jun 2015 | ⭐⭐⭐⭐☆ | Naive Bayes Histogramas, Perceptrón Analítico, Hopfield, SVM | **80%** | ⚠️ Ejercicio 1 es Búsqueda (P1) |
| **`2015_2019/`** | `2012_parcial2_presencial.jpg` | Nov 2012 | ⭐⭐⭐☆☆ | Perceptrón Analítico, KNN Ponderado | **50%** | ⚠️ Ej. 1 POP (P1), Ej. 2 Q-Learn |
| **`2015_2019/`** | `2012_parcial2_enunciado.docx` | Nov 2012 | ⭐⭐⭐⭐⭐ | Perceptrón Analítico, KNN Ponderado (DOCX original) | **50%** | ⚠️ Ej. 1 POP (P1), Ej. 2 Q-Learn |
| **`compilaciones_tematicas/`**| 8 Cuadernillos Oficiales (`SVM`, `MLP`, `SOM`, `Hopfield`, `Clustering`, `Naive Bayes`, `KNN`, `Perceptrón`) | Varios | ⭐⭐⭐⭐⭐ | Guías completas de ejercicios resueltos paso a paso por tema | **100%** | Sin ruido P1 |

---

## 3. Fichas Técnicas Detalladas por Examen

### 3.1. Carpeta `2023/` (Presencial Contemporáneo)

#### Ficha Técnica: `2023_parcial2_tema1.jpeg`
- **Identificador Canónico:** `IA-H0077`
- **Fecha de Evaluación:** 21 de Noviembre de 2023 (Segundo Parcial Práctico – Tema 1).
- **Legibilidad:** ⭐⭐⭐⭐☆ (4/5 – Fotografía nítida de hoja impresa original).
- **Estructura y Ponderación:**
  1. **Ejercicio 1 (25%): Support Vector Machines (SVM)**  
     *Temario P2 Activo:* **SÍ**.  
     *Enunciado:* Dados 4 vectores $p_1=[0, 4]^T, p_2=[3, 0]^T, p_3=[-2, 0]^T, p_4=[-3, -3]^T$ con clases $y \in \{+1, -1\}$ y multiplicadores de Lagrange $\alpha_i$, calcular el vector de pesos $\mathbf{w}$ y el sesgo promediado $b_{prom}$.  
  2. **Ejercicio 2 (25%): Mapas Autoorganizados de Kohonen (SOM)**  
     *Temario P2 Activo:* **SÍ**.  
     *Enunciado:* Red SOM lineal de 3 neuronas, tasa $\alpha=0.5$, función de vecindad continua $h(i, j^*) = \frac{1}{1 + \text{dist}(W_i, W_{j^*})}$. Presentación del patrón $p_3 = [0.8, 0.4]^T$. Determinar neurona ganadora ($BMU$) y actualizar todos los pesos sinápticos.  
  3. **Ejercicio 3 (25%): Perceptrón Multicapa (MLP) – Backpropagation**  
     *Temario P2 Activo:* **SÍ**.  
     *Enunciado:* Red $3 \times 2 \times 3$ con funciones de activación sigmoideas logísticas $\sigma(net)$. Para un patrón con salida deseada $do_1 = 1, do_2 = 0, do_3 = 0$, calcular la salida de la red, los gradientes locales de error $\delta$ para cada capa y la corrección de pesos considerando momento $\beta$.  
  4. **Ejercicio 4 (25%): Clustering Jerárquico Aglomerativo (Average Linkage)**  
     *Temario P2 Activo:* **SÍ**.  
     *Enunciado:* Matriz de distancias de 5 patrones en $\mathbb{R}^2$. Realizar las fusiones paso a paso aplicando la media de distancias entre pares cruzados y graficar el dendrograma con las alturas de unión.
- **Advertencias de Ruido P1:** Ninguna. Cobertura 100% canónica del Segundo Parcial 2026.
- **Tips de Cátedra y Observaciones:**
  - *Trampa de SOM:* La vecindad es continua; no actualizar únicamente la ganadora.
  - *Trampa de SVM:* Calcular $b$ en cada uno de los vectores de soporte $(\alpha_i > 0)$ y reportar formalmente el promedio aritmético.

---

#### Ficha Técnica: `2023_parcial2_tema2.jpeg`
- **Identificador Canónico:** `IA-H0075`
- **Fecha de Evaluación:** 21 de Noviembre de 2023 (Segundo Parcial Práctico – Tema 2).
- **Legibilidad:** ⭐⭐⭐⭐☆ (4/5 – Fotografía clara de examen impreso).
- **Estructura y Ponderación:**
  1. **Ejercicio 1 (25%): Support Vector Machines (SVM)**  
     *Temario P2 Activo:* **SÍ**.  
     *Enunciado:* Mismos datos de puntos con multiplicadores $\alpha_1=1/2, \alpha_2=1/4, \alpha_3=3/4, \alpha_4=0$. Obtención analítica de $\mathbf{w}$ y $b$.  
  2. **Ejercicio 2 (25%): Mapas Autoorganizados de Kohonen (SOM)**  
     *Temario P2 Activo:* **SÍ**.  
     *Enunciado:* Presentación del patrón $p_2 = [0.2, 0.7]^T$. Determinación de ganadora y actualización de pesos con vecindad continua.  
  3. **Ejercicio 3 (25%): Perceptrón Multicapa (MLP) – Backpropagation**  
     *Temario P2 Activo:* **SÍ**.  
     *Enunciado:* Arquitectura $3 \times 2 \times 3$ con vector objetivo $do = [0, 1, 0]^T$.  
  4. **Ejercicio 4 (25%): Clustering Jerárquico Aglomerativo (Average Linkage)**  
     *Temario P2 Activo:* **SÍ**.  
     *Enunciado:* Fusión aglomerativa con matriz de distancias euclidianas y dendrograma.
- **Advertencias de Ruido P1:** Ninguna. Examen canónico contemporáneo.

---

#### Ficha Técnica: `2023_teoria_tema1.jpeg`
- **Identificador Canónico:** `IA-H0074`
- **Fecha:** Noviembre 2023 (Segundo Parcial Teórico – Tema 1).
- **Legibilidad:** ⭐⭐⭐⭐☆ (4/5 – Hoja impresa).
- **Estructura:**
  - **Pregunta 1:** MLP en $\mathbb{R}^2$ con 3 clusters disjuntos. Explicar arquitectura requerida (capas ocultas, funciones no lineales para regiones acotadas). [ACTIVO P2]
  - **Pregunta 2:** Clustering Jerárquico: Average Linkage vs Distancia entre Centroides. Comparación conceptual y matemática. [ACTIVO P2]
  - **Pregunta 3:** Búsqueda Heurística $A^*$ con heurística sobreestimada ($h(n) > h^*(n)$). Consecuencias sobre la admisibilidad. [RUIDO P1]
  - **Pregunta 4:** SOM: Fases de ordenamiento y convergencia; reducción temporal de $\alpha(t)$ y del radio de vecindad $\sigma(t)$. [ACTIVO P2]
- ⚠️ **ADVERTENCIA EXPLÍCITA DE RUIDO P1:**
  - **El Ejercicio 3 es de Búsqueda Heurística ($A^*$). ¡NO ENTRA EN EL 2DO PARCIAL 2026!** Ya fue evaluado y aprobado en el Primer Parcial.

---

#### Ficha Técnica: `2023_teoria_tema2.jpeg`
- **Identificador Canónico:** `IA-H0076`
- **Fecha:** Noviembre 2023 (Recuperatorio Teórico).
- **Legibilidad:** ⭐⭐⭐⭐☆ (4/5).
- **Estructura:**
  - **Pregunta 1:** ADALINE vs Perceptrón Simple: diferencias en la regla de aprendizaje (regla delta continua de Widrow-Hoff vs corrección por error cuantizado de Rosenblatt). [ACTIVO P2]
  - **Pregunta 2:** Sobreajuste (Overfitting) en $k$-means: comportamiento de $SSE$ cuando $k \to N$ y método del codo. [ACTIVO P2]
  - **Pregunta 3:** Naive Bayes con atributos continuos: densidad Normal / Gaussiana vs histogramas discretos. [ACTIVO P2]
  - **Pregunta 4:** Búsqueda Heurística $A^*$ con $h(n) = 0$. Degeneración a Dijkstra. [RUIDO P1]
  - **Pregunta 5:** KNN Ponderado: factor $w_i = 1/d_i^2$ y tratamiento de empates. [ACTIVO P2]
- ⚠️ **ADVERTENCIA EXPLÍCITA DE RUIDO P1:**
  - **El Ejercicio 4 es de Búsqueda ($A^*$). ¡NO ENTRA EN EL 2DO PARCIAL 2026!**

---

#### Ficha Técnica: `2023_teoria_desarrollo.jpeg`
- **Identificador Canónico:** `IA-H0079`
- **Fecha:** 22 de Noviembre de 2023 (Evaluación Teórica Manuscrita).
- **Legibilidad:** ⭐⭐⭐☆☆ (3.5/5 – Manuscrito en bolígrafo sobre hoja rayada, completamente legible).
- **Estructura:**
  - **Pregunta 1:** Término de Momento en MLP: justificación física/matemática del factor $\beta \cdot \Delta w(t-1)$, amortiguación de oscilaciones y aceleración en mesetas. [ACTIVO P2]
  - **Pregunta 2:** SVM: Definición de planos soporte $d(+)$ y $d(-)$, ancho del margen $M = \frac{2}{\|\mathbf{w}\|}$. [ACTIVO P2]
  - **Pregunta 3: Algoritmos Genéticos (AG): Mutación por Temperatura Descendente.** Justificación conceptual de por qué la probabilidad de mutación debe disminuir en generaciones avanzadas (balance exploración vs explotación / enfriamiento simulado). [ACTIVO P2 – UNIDAD 3 PARTE 2]
  - **Pregunta 4:** Naive Bayes: Suposición fundamental de independencia condicional y reducción de parámetros. [ACTIVO P2]
  - **Pregunta 5:** Hopfield: Capacidad máxima de almacenamiento de patrones bipolares ortogonales ($p_{max} \approx 0.14 N$). [ACTIVO P2]
- **Observación Docente Clave:** Este examen es de valor excepcional porque contiene la **única pregunta conceptual documentada sobre Algoritmos Genéticos (Unidad 3-2)** en todo el registro histórico.

---

### 3.2. Carpeta `2022/` (Alerta de Ruido P1)

#### Ficha Técnica: `2022_practico.pdf`
- **Identificador Canónico:** `IA-H0071`
- **Fecha:** 14 de Septiembre de 2022.
- **Legibilidad:** ⭐⭐⭐⭐⭐ (5/5 – Documento PDF digital).
- **Contenido del Examen:**
  - Ejercicio 1: Árboles de Decisión (C4.5 / Indumentaria – 4 ramas, ganancia de información). [P1]
  - Ejercicio 2: Planificación de Orden Parcial (POP – Problema del Mundo de Bloques). [P1]
  - Ejercicio 3: Reglas de Asociación (Algoritmo Apriori con 84 transacciones). [P1]
  - Ejercicio 4: Sistemas Basados en Reglas (SBR – Coherencia y encadenamiento). [P1]
- ⛔ **ADVERTENCIA CRÍTICA PARA ESTUDIANTES:**
  - **ESTE ARCHIVO PERTENECE ÍNTEGRAMENTE AL PRIMER PARCIAL (UNIDADES 1 Y 2).**
  - Fue hallado en carpetas de alumnos titulado como modelo de segundo parcial por error de archivo. **NINGÚN EJERCICIO DE ESTE PDF ENTRA EN EL SEGUNDO PARCIAL 2026.** Se conserva únicamente por integridad forense.

---

### 3.3. Carpeta `2020_2021_virtuales/` (Exámenes de Pandemia y Resoluciones de Alumnos)

#### Ficha Técnica: `2020_parcial2_resuelto_alumno_A.pdf`
- **Origen:** Examen real resuelto y corregido por la cátedra (Noviembre 2020).
- **Legibilidad:** ⭐⭐⭐⭐☆ (4/5 – 4 páginas manuscritas nítidas con anotaciones de corrección).
- **Desglose de Ejercicios:**
  - Ejercicio 1: SVM Dual – Matriz de Gram $K_{ij}$, función cuadrática $L_D$ y resolución. [ACTIVO P2]
  - Ejercicio 2: Red SOM – Actualización con vecindad continua y tasa de aprendizaje. [ACTIVO P2]
  - Ejercicio 3: MLP – Cálculo de error global medio de época y función de parada. [ACTIVO P2]
  - Ejercicio 4: Búsqueda Sistemática (Profundidad). [RUIDO P1 - NO ENTRA]
  - Ejercicio 5: KNN – Clasificación por distancia euclidiana y Leave-One-Out. [ACTIVO P2]
- ⚠️ **ADVERTENCIA P1:** El ejercicio de Búsqueda de la pág. 3 corresponde al temario del 1er Parcial.

#### Ficha Técnica: `2020_recup_parcial2_resuelto_alumno_A.pdf`
- **Origen:** Recuperatorio real resuelto (Diciembre 2020).
- **Legibilidad:** ⭐⭐⭐⭐☆ (4/5 – 5 páginas manuscritas de excelente prolijidad).
- **Desglose de Ejercicios:**
  - Ejercicio 1: Búsqueda Heurística ($A^*$). [RUIDO P1 - NO ENTRA]
  - Ejercicio 2: Validación Cruzada $k$-fold en KNN para selección óptima de $k$. [ACTIVO P2]
  - Ejercicio 3: Perceptrón Simple – Determinación analítica de la recta divisoria y cálculo del vector normal $\mathbf{w}$ y sesgo $\theta$. [ACTIVO P2]
  - Ejercicio 4: Red SOM – Actualización con tasa $\alpha=1$. [ACTIVO P2]
  - Ejercicio 5: SVM Dual – Deducción de multiplicadores $\alpha_i$ y comprobación KKT. [ACTIVO P2]
- ⚠️ **ADVERTENCIA P1:** Ejercicio 1 ($A^*$) pertenece a P1.

#### Ficha Técnica: `2020_parcial2_resuelto_alumno_B.pdf`
- **Origen:** Examen manuscrito resuelto por alumno cohorte 2020.
- **Legibilidad:** ⭐⭐⭐☆☆ (3/5 – 3 páginas de fotos con letra imprenta).
- **Desglose:**
  - Ejercicio 1: SVM Planteo Lagrangiano. [ACTIVO P2]
  - Ejercicio 2: SOM con vecindad nula (sólo actualiza la neurona ganadora). [ACTIVO P2]
  - Ejercicio 3: MLP Error cuadrático medio de época. [ACTIVO P2]
  - Ejercicio 4: Búsqueda en Grafo. [RUIDO P1 - NO ENTRA]

#### Ficha Técnica: `2020_recup_parcial2_oficial.pdf`
- **Origen:** Enunciado oficial y pauta de examen recuperatorio cohorte 2020 (6 páginas).
- **Legibilidad:** ⭐⭐⭐⭐☆ (4.5/5).
- **Desglose:**
  - Ejercicio 1: Búsqueda Heurística ($A^*$). [RUIDO P1]
  - Ejercicio 2: Validación Cruzada $k$-fold. [ACTIVO P2]
  - Ejercicio 3: Perceptrón Simple Analítico. [ACTIVO P2]
  - Ejercicio 4: Red SOM. [ACTIVO P2]

#### Ficha Técnica: `2021_recup_parcial2_oficial_IA-H0122.jpeg`
- **Identificador Canónico:** `IA-H0122`
- **Fecha:** ~2021. Formato: Fotografía de examen impreso presencial.
- **Legibilidad:** ⭐⭐⭐⭐☆ (4/5).
- **Desglose (100% P2 Activo):**
  - **Ejercicio 1 (25%): MLP con 2 Capas Ocultas ($2 \times 3 \times 2 \times 1$)**  
    Cálculo de propagación hacia adelante y retropropagación de gradientes $\delta$ a través de dos capas intermedias con funciones sigmoides.
  - **Ejercicio 2 (25%): SVM Dual en $\mathbb{R}^2$**  
    Puntos $P_1=[-3,1]^T, P_2=[0,1]^T, P_3=[3,-3]^T$. Planteo de la matriz de Gram y la función $L_D$.
  - **Ejercicio 3 (25%): KNN Ponderado ($1/d^2$)**  
    Clasificación de nueva instancia con normalización de distancias y suma de pesos por clase.
  - **Ejercicio 4 (25%): Redes de Hopfield**  
    Almacenamiento de patrones de 4 neuronas, cálculo de matriz hebbiana $W$ (diagonal en cero) y recuperación con vector de entrada perturbado.
- **Advertencias P1:** Ninguna. Modelo 100% puro de Segundo Parcial.

#### Ficha Técnica: `2020_parcial2_virtual_zoom_IA-H0123.jpeg`
- **Identificador Canónico:** `IA-H0123`
- **Desglose:** Ejercicio 1 SVM Dual (25%); Ejercicio 2 SOM vecindad nula (25%); Ejercicio 3 MLP error global y parada temprana (25%); Ejercicio 4 Búsqueda en Grafo (25% - ⚠️ **RUIDO P1 - NO ENTRA**).

#### Ficha Técnica: `2020_recup_parcial2_virtual_zoom_IA-H0124.jpeg`
- **Identificador Canónico:** `IA-H0124`
- **Desglose:** Ejercicio 1 Búsqueda BFS/$A^*$ (25% - ⚠️ **RUIDO P1**); Ejercicio 2 $k$-fold Cross Validation (25%); Ejercicio 3 Perceptrón analítico (25%); Ejercicio 4 Red SOM con $\alpha=1$ (25%).

#### Ficha Técnica: `2020_recup_resolucion_som_alumno.png`
- **Descripción:** Traza gráfica manuscrita del cálculo de distancias euclidianas y actualización online para el ejercicio SOM del recuperatorio 2020. Muestra cómo usar la matriz $W(1)$ para procesar el patrón siguiente.

#### Ficha Técnica: `2020_2021_teoria_multiple_choice_IA-H0129.jpeg`
- **Identificador Canónico:** `IA-H0129`
- **Desglose:** Preguntas teóricas de desarrollo (MLP vs Naive Bayes en $\mathbb{R}^2$, Ajuste de parámetros en redes, Topología SOM con inhibición lateral, Aprendizaje EBL) y 4 preguntas Multiple Choice. (Nota: La pregunta MC 5 es de $A^*$, tema de P1).

---

### 3.4. Carpeta `2015_2019/` (Presenciales Históricos de 4 Cuadrantes)

#### Ficha Técnica: `2019_cin_practica_4k.jpg`
- **Identificadores:** `IA-H-2019-PRAC` / `IA-H0126`
- **Fecha:** Noviembre 2019 (Examen CIN / UTN FRRe).
- **Legibilidad:** ⭐⭐⭐⭐⭐ (5/5 – Foto en ultra alta resolución 4K).
- **Desglose de Ejercicios:**
  - Ejercicio 1 (25%): SVM Dual – Matriz de productos escalares y función $L_D(\boldsymbol{\alpha})$ con restricciones KKT. [ACTIVO P2]
  - Ejercicio 2 (25%): Clustering Jerárquico Aglomerativo – Criterios Single-Linkage y Complete-Linkage sobre 4 puntos y dendrograma. [ACTIVO P2]
  - Ejercicio 3 (25%): MLP – Red $3 \times 2 \times 2$, cálculo del error global medio cuadrático en iteración 5 y término de momento con $\beta=0.9$. [ACTIVO P2]
  - Ejercicio 4 (25%): Búsqueda Sistemática y Heurística (Primero en Profundidad y $A^*$). [RUIDO P1 - NO ENTRA]
- ⚠️ **ADVERTENCIA P1:** Ejercicio 4 es de Búsqueda ($A^*$). ¡NO ENTRA EN P2 2026!

#### Ficha Técnica: `2019_cin_teoria_correccion_roja_4k.jpg`
- **Identificador:** `IA-H-2019-TEOR`
- **Fecha:** Noviembre 2019.
- **Legibilidad:** ⭐⭐⭐⭐⭐ (5/5 – Examen oficial corregido en tinta roja por la cátedra).
- **Desglose:**
  - Ejercicio 1: MLP vs Naive Bayes en el plano $\mathbb{R}^2$. [ACTIVO P2]
  - Ejercicio 2: Factores del aprendizaje conexionista (convergencia, gradiente). [ACTIVO P2]
  - Ejercicio 3: Red SOM – Conexiones de inhibición lateral ("sombrero mexicano"). [ACTIVO P2]
  - Ejercicio 4: EBL (Explanation-Based Learning). [Histórico Teórico]
  - Multiple Choice con penalización de puntaje por error.

#### Ficha Técnica: `2016_parcial2_presencial.jpg`
- **Identificadores:** `IA-H-2016-PRAC` / `IA-H0125`
- **Fecha:** Noviembre 2016.
- **Legibilidad:** ⭐⭐⭐⭐☆ (4.5/5).
- **Desglose:**
  - Ejercicio 1 (25%): Búsqueda Heurística ($A^*$). [RUIDO P1 - NO ENTRA]
  - Ejercicio 2 (25%): Naive Bayes con Histogramas Discretizados (101.875 muestras en tablas de frecuencias). [ACTIVO P2]
  - Ejercicio 3 (25%): Perceptrón Simple Analítico (obtención de $w_1, w_2, \theta$). [ACTIVO P2]
  - Ejercicio 4 (25%): Red de Hopfield – Almacenamiento de perfiles de empresas con vectores bipolares. [ACTIVO P2]
  - Ejercicio 5: SVM Dual. [ACTIVO P2]
- ⚠️ **ADVERTENCIA P1:** Ejercicio 1 es de Búsqueda ($A^*$). ¡NO ENTRA EN P2 2026!

#### Ficha Técnica: `2015_parcial2_presencial.jpg` y `2015_parcial2_punto_1_detalle.jpg`
- **Identificador:** `IA-H0128`
- **Fecha:** 22 de Junio de 2015.
- **Legibilidad:** ⭐⭐⭐⭐☆ (4/5).
- **Desglose:**
  - Ejercicio 1 (25%): Búsqueda en Grafo (DFS y $A^*$). [RUIDO P1]
  - Ejercicio 2 (25%): Naive Bayes con Histogramas de frecuencias. [ACTIVO P2]
  - Ejercicio 3 (25%): Perceptrón Simple Analítico. [ACTIVO P2]
  - Ejercicio 4 (25%): Red de Hopfield (Filtrado de SPAM). [ACTIVO P2]
  - Ejercicio 5 (25%): SVM separación gráfica y analítica. [ACTIVO P2]

#### Ficha Técnica: `2012_parcial2_presencial.jpg` y `2012_parcial2_enunciado.docx`
- **Identificador:** `IA-H-2012-PRAC`
- **Fecha:** 20 de Noviembre de 2012.
- **Legibilidad:** ⭐⭐⭐☆☆ (3.5/5 en JPG, ⭐⭐⭐⭐⭐ 5/5 en DOCX editable).
- **Desglose:**
  - Ejercicio 1 (25%): Planificación de Orden Parcial (POP en grilla $2 \times 3$). [RUIDO P1 - NO ENTRA EN P2]
  - Ejercicio 2 (25%): Aprendizaje por Refuerzo (Q-Learning) con selección Softmax / Boltzmann: $\pi(s,a) = \frac{e^{Q/\tau}}{\sum e^{Q/\tau}}$. [PROGRAMA ANTIGUO - NO ENTRA EN P2 2026]
  - Ejercicio 3 (25%): Perceptrón Simple Analítico en el plano. [ACTIVO P2]
  - Ejercicio 4 (25%): KNN Ponderado ($1/d^2$). [ACTIVO P2]

---

### 3.5. Carpeta `compilaciones_tematicas/` (Dossiers Prácticos Oficiales de la Cátedra)

Contiene las guías oficiales de ejercicios resueltos paso a paso por tema para preparar el examen:
1. **`SVM.pdf`** (9 págs.): Formulación Dual $L_D$, matriz de productos escalares, condiciones KKT, cálculo de $\mathbf{w}$ y sesgo promediado $b_{prom}$.
2. **`MLP.pdf`** / **`6. MLP.pdf`** (7 págs.): Algoritmo Backpropagation completo, regla de la cadena para capas ocultas, término de momento $\beta$ y función de error global.
3. **`SOM.pdf`** / **`7. SOM.pdf`** (6 págs.): Mapas de Kohonen, cálculo de distancias euclidianas, neurona ganadora ($BMU$), actualización con vecindad nula y vecindad continua.
4. **`Clustering.pdf`** / **`9. Clustering.pdf`** (7 págs.): Algoritmos de agrupamiento aglomerativo (Single-Link, Complete-Link, Average-Link) y K-Means con dendrogramas.
5. **`Hopfield.pdf`** (7 págs.): Redes autoasociativas, regla de Hebb, matriz simétrica con diagonal en cero y dinámica de recuperación de patrones bipolares.
6. **`4. Naive Bayes.pdf`** / **`Naive_Bayes.pdf`** (5 págs.): Clasificador Bayesiano ingenuo mediante histogramas de frecuencias relativas y densidades continuas Gaussianas.
7. **`8. KNN.pdf`** / **`KNN.pdf`** (10 págs.): Algoritmo $k$-Vecinos Más Cercanos, ponderación por inverso de distancia al cuadrado ($1/d^2$), Leave-One-Out CV y $k$-fold CV.
8. **`5. perceptron simple.pdf`** / **`Perceptron_Simple.pdf`** (11 págs.): Método analítico de obtención de pesos y umbral, orientación del vector normal y algoritmo iterativo de Rosenblatt.

---

### 3.6. Carpeta `imagenes/` (Catálogo Multimodal de Diagramas)

Contiene los **137 recortes gráficos `.png`** extraídos en alta resolución de las fuentes originales. Todos los archivos están directamente vinculados a los ejercicios del banco:
- **Diagramas de Arquitecturas Neuronales:** Redes MLP completas con pesos numéricos (`IA-H0075_ejercicio_03_red_mlp.png`, `IA-H0122_ejercicio_01_red_mlp.png`, `IA-H0126_ejercicio_03_red_mlp.png`).
- **Topologías SOM:** Grillas neuronales y vectores de pesos iniciales (`IA-H0075_ejercicio_02_som.png`, `IA-H0124_ejercicio_04_som.png`).
- **Tablas de Datos de Examen:** Matrices de distancias, tablas de datos para KNN, conjuntos de entrenamiento de Perceptrón y Naive Bayes (`IA-H0075_ejercicio_02_tabla.png`, `IA-H0125_ejercicio_02_tablas.png`, `IA-H0126_ejercicio_03_tabla_patrones.png`).
- **Dendrogramas y Agrupamientos:** Resultados de clustering jerárquico aglomerativo (`IA-H0126_ejercicio_02_clustering.png`, `IA-H0129_ejercicio_01_clusters.png`).

---

## 4. Las 6 Trampas Mortales de Examen Detectadas por Auditoría Docente

Del análisis forense de las correcciones docentes de la cátedra en los exámenes de 2016 a 2023, se extraen las 6 trampas recurrentes donde los alumnos pierden puntos:

1. **El Sentido del Vector Normal en Perceptrón Analítico:**
   - *Error típico:* El alumno halla la recta igualando a cero ($w_1 x_1 + w_2 x_2 - \theta = 0$) a partir de los cortes en los ejes y no verifica la orientación.
   - *Consecuencia:* El vector normal $\mathbf{w}$ apunta hacia la clase $-1$.
   - *Solución obligatoria:* Evaluar siempre un punto testigo en $f(Net)$. Si da signo opuesto al deseado, **invertir los signos de todos los pesos y del umbral** ($w_1 \leftarrow -w_1, w_2 \leftarrow -w_2, \theta \leftarrow -\theta$).

2. **Vecindad Continua vs Nula en SOM:**
   - *Error típico:* Cuando el enunciado define una función de vecindad $h(i, j^*) = \frac{1}{1 + \text{dist}}$, el alumno actualiza únicamente la ganadora.
   - *Consecuencia:* Cátedra anula el ejercicio (0 / 25%).
   - *Solución obligatoria:* Calcular el factor $h$ para cada neurona de la red y actualizar todos los vectores de pesos sinápticos.

3. **Falta de Persistencia de Pesos en el Aprendizaje Online de SOM:**
   - *Error típico:* Al presentar el segundo patrón $p_2$, se calculan las distancias contra la matriz de pesos inicial $W(0)$.
   - *Solución obligatoria:* El aprendizaje es **online** (patrón por patrón). Para $p_2$, las distancias euclidianas se deben calcular contra la matriz $W(1)$ recién actualizada por $p_1$.

4. **La Diagonal en Redes de Hopfield:**
   - *Error típico:* Sumar los productos exteriores de los vectores bipolares $E_k^T E_k$ sin restar la matriz identidad $I$.
   - *Solución obligatoria:* La matriz de pesos de Hopfield **siempre debe tener ceros en su diagonal principal** ($w_{ii} = 0$) para evitar auto-lazos inestables.

5. **El Error de Promediado en Average Linkage:**
   - *Error típico:* Al fusionar el cluster $\{A, B\}$ con el punto $\{C\}$, promediar la distancia previa con la nueva: $\frac{d(\{A,B\}, C)}{2}$.
   - *Solución obligatoria:* Average Linkage exige la media aritmética exacta de **todos los pares cruzados**:
     $$d(C_1, C_2) = \frac{1}{|C_1| \cdot |C_2|} \sum_{x \in C_1} \sum_{y \in C_2} d(x, y)$$

6. **El Sesgo $b$ en Support Vector Machines (SVM):**
   - *Error típico:* Despejar $b$ utilizando un solo vector de soporte arbitrario.
   - *Solución obligatoria:* Despejar $b_i = y_i - \mathbf{w}^T x_i$ para cada uno de los vectores de soporte $(\alpha_i > 0)$ y reportar formalmente el promedio aritmético $b_{prom}$.

---

## 5. La Brecha Crítica de Algoritmos Genéticos

> [!WARNING]
> **Ninguno de los 16 exámenes prácticos impresos de 4 cuadrantes contiene ejercicios de cálculo numérico de Algoritmos Genéticos.**
> La cátedra evalúa tradicionalmente este tema mediante coloquios orales, defensas de laboratorio o en el examen teórico conceptual (como en `2023_teoria_desarrollo.jpeg`, Pregunta 3: *Mutación por Temperatura Descendente*).
> Para el entrenamiento práctico de Algoritmos Genéticos (selección por ruleta, cruce monopunto/bipunto y mutación bit-flip), **es obligatorio estudiar con la guía oficial `GuiaTP-AG.pdf` de la Semana 08**.
