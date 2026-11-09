# Dossier de Variantes Numéricas Resueltas: Clustering Jerárquico Aglomerativo
**Universidad Tecnológica Nacional — Facultad Regional Resistencia (UTN FRRe)**  
**Cátedra:** Inteligencia Artificial (UTN FRRe)  
**Material de Entrenamiento Gradual en 3 Niveles**  

---

## Índice del Dossier
1. **Nivel 1 (Básico / Mínima Distancia):** Single Linkage (Enlace Simple / Vecino Más Cercano) y Efecto de Encadenamiento.
2. **Nivel 2 (Intermedio / Máxima Distancia):** Complete Linkage (Enlace Completo / Vecino Más Lejano) y Diámetro de Clusters.
3. **Nivel 3 (Parcial Real / Caso Completo):** Average Linkage (UPGMA Ponderado por Cardinal) y Prevención de la Trampa 5.

---

## Comparativa Conceptual de Criterios sobre la Misma Matriz Primitiva
Para permitir una comparación inmediata y directa de los tres algoritmos, utilizaremos en los Niveles 1 y 2 el siguiente conjunto de 4 elementos $\{A, B, C, D\}$ con matriz de distancias inicial $D_0$:

| | A | B | C | D |
| :---: | :---: | :---: | :---: | :---: |
| **A** | $0.00$ | $3.00$ | $7.00$ | $8.00$ |
| **B** | $3.00$ | $0.00$ | $6.00$ | $7.00$ |
| **C** | $7.00$ | $6.00$ | $0.00$ | $2.00$ |
| **D** | $8.00$ | $7.00$ | $2.00$ | $0.00$ |

---

## Nivel 1: Single Linkage (Enlace Simple)

### Enunciado
Aplicar el algoritmo de Clustering Jerárquico Aglomerativo con criterio **Single Linkage** sobre la matriz $D_0$.  
Regla canónica:
$$d(C_i \cup C_j, C_k) = \min \{ d(C_i, C_k), \ d(C_j, C_k) \}$$

**Se solicita:**
1. Desarrollar las fusiones sucesivas y construir las matrices reducidas.
2. Trazar el dendrograma resultante.
3. Explicar el fenómeno de encadenamiento (*chaining effect*).

---

### Solución Oficial Paso a Paso

#### 1. Paso 1: Fusión Inicial
La menor distancia en $D_0$ es $d(C, D) = \mathbf{2.00}$.  
Se agrupan $\{C, D\} \to \mathbf{(CD)}$ a nivel **$2.00$**.

*Recálculo de distancias con la regla del mínimo:*
* $d((CD), A) = \min \{ d(C, A), d(D, A) \} = \min \{ 7.00, 8.00 \} = \mathbf{7.00}$
* $d((CD), B) = \min \{ d(C, B), d(D, B) \} = \min \{ 6.00, 7.00 \} = \mathbf{6.00}$

**Matriz Reducida $D_1$ ($3 \times 3$):**
| | (CD) | A | B |
| :---: | :---: | :---: | :---: |
| **(CD)** | $0.00$ | $7.00$ | $6.00$ |
| **A** | $7.00$ | $0.00$ | $3.00$ |
| **B** | $6.00$ | $3.00$ | $0.00$ |

#### 2. Paso 2: Segunda Fusión
En $D_1$, el mínimo es $d(A, B) = \mathbf{3.00}$.  
Se agrupan $\{A, B\} \to \mathbf{(AB)}$ a nivel **$3.00$**.

*Recálculo de distancia entre los dos macro-clusters:*
$$d((AB), (CD)) = \min \{ d(A, C), d(A, D), d(B, C), d(B, D) \} = \min \{ 7.00, 8.00, 6.00, 7.00 \} = \mathbf{6.00}$$

#### 3. Paso 3: Fusión Raíz Final
Se unen $(AB)$ y $(CD)$ a nivel **$6.00$**.

*Dendrograma Single Linkage:*
```
 Altura d
   ▲
6.0│       ┌───────────────────────┐  <--- Raíz Single Link a 6.00
   │       │                       │
4.0│       │                       │
   │       │               ┌───────┴───────┐  <--- Fusión (AB) a 3.00
2.0│┌──────┴───────┐       │       │       │  <--- Fusión (CD) a 2.00
   ││      │       │       │       │       │
0.0┴┴──────┴───────┴───────┴───────┴───────┴───► Elementos
    C      D               A       B
```

*Efecto de Encadenamiento:* Al elegir siempre la menor distancia entre bordes, Single Link tiende a incorporar elementos aislados uno a uno en cadenas alargadas y dispersas, dificultando la detección de grupos esféricos compactos.

---

## Nivel 2: Complete Linkage (Enlace Completo)

### Enunciado
Aplicar el algoritmo de Clustering Jerárquico Aglomerativo con criterio **Complete Linkage** sobre la misma matriz $D_0$.  
Regla canónica:
$$d(C_i \cup C_j, C_k) = \max \{ d(C_i, C_k), \ d(C_j, C_k) \}$$

**Se solicita:**
1. Desarrollar las fusiones sucesivas y construir las matrices reducidas.
2. Trazar el dendrograma resultante.
3. Comparar la altura de la raíz respecto a Single Linkage.

---

### Solución Oficial Paso a Paso

#### 1. Paso 1: Fusión Inicial
La menor distancia en $D_0$ es $d(C, D) = \mathbf{2.00}$.  
Se forma el cluster $\mathbf{(CD)}$ a nivel **$2.00$**.

*Recálculo de distancias con la regla del máximo:*
* $d((CD), A) = \max \{ d(C, A), d(D, A) \} = \max \{ 7.00, 8.00 \} = \mathbf{8.00}$
* $d((CD), B) = \max \{ d(C, B), d(D, B) \} = \max \{ 6.00, 7.00 \} = \mathbf{7.00}$

**Matriz Reducida $D_1$ ($3 \times 3$):**
| | (CD) | A | B |
| :---: | :---: | :---: | :---: |
| **(CD)** | $0.00$ | $8.00$ | $7.00$ |
| **A** | $8.00$ | $0.00$ | $3.00$ |
| **B** | $7.00$ | $3.00$ | $0.00$ |

#### 2. Paso 2: Segunda Fusión
En $D_1$, el mínimo es $d(A, B) = \mathbf{3.00}$.  
Se forma el cluster $\mathbf{(AB)}$ a nivel **$3.00$**.

*Recálculo de distancia entre macro-clusters:*
$$d((AB), (CD)) = \max \{ d(A, C), d(A, D), d(B, C), d(B, D) \} = \max \{ 7.00, 8.00, 6.00, 7.00 \} = \mathbf{8.00}$$

#### 3. Paso 3: Fusión Raíz Final
Se unen $(AB)$ y $(CD)$ a nivel **$8.00$**.

*Comparación de la cota superior:*
$$\text{Single Link (6.00)} < \text{Average Link (7.00)} < \text{Complete Link (8.00)}$$
Complete Linkage garantiza que todos los elementos dentro del nuevo cluster unificado están a una distancia máxima de a lo sumo 8.00 unidades, produciendo agrupamientos hiper-esféricos y compactos.

---

## Nivel 3: Average Linkage Ponderado (Caso Completo de 5 Elementos con Trampa 5)

### Enunciado
Dada la matriz de distancias entre 5 muestras $\{P_1, P_2, P_3, P_4, P_5\}$:

| | $P_1$ | $P_2$ | $P_3$ | $P_4$ | $P_5$ |
| :---: | :---: | :---: | :---: | :---: | :---: |
| **$P_1$** | $0.00$ | $1.50$ | $4.00$ | $7.00$ | $8.00$ |
| **$P_2$** | $1.50$ | $0.00$ | $4.50$ | $6.50$ | $7.50$ |
| **$P_3$** | $4.00$ | $4.50$ | $0.00$ | $3.00$ | $3.50$ |
| **$P_4$** | $7.00$ | $6.50$ | $3.00$ | $0.00$ | $2.00$ |
| **$P_5$** | $8.00$ | $7.50$ | $3.50$ | $2.00$ | $0.00$ |

**Se solicita:**
1. Ejecutar las 4 etapas aglomerativas completas con **Average Linkage (UPGMA)**.
2. Identificar el momento exacto donde el alumno suele cometer la **Trampa 5** (promediar dos distancias intermedias en lugar de ponderar por los cardinales) y demostrar la fórmula correcta:
   $$d(C_i \cup C_j, C_k) = \frac{|C_i| \cdot d(C_i, C_k) + |C_j| \cdot d(C_j, C_k)}{|C_i| + |C_j|}$$
3. Trazar el dendrograma métrico.

---

### Solución Oficial Paso a Paso

#### 1. Fusión 1 ($D_0 \to D_1$)
Mínimo en $D_0$: $d(P_1, P_2) = \mathbf{1.500}$.  
Se forma $(P_1 P_2)$ a nivel **$1.500$** con cardinal $|P_1 P_2| = 2$.

*Recálculo de distancias promedio:*
* $d((P_1 P_2), P_3) = \frac{d(P_1, P_3) + d(P_2, P_3)}{2} = \frac{4.00 + 4.50}{2} = \mathbf{4.250}$
* $d((P_1 P_2), P_4) = \frac{d(P_1, P_4) + d(P_2, P_4)}{2} = \frac{7.00 + 6.50}{2} = \mathbf{6.750}$
* $d((P_1 P_2), P_5) = \frac{d(P_1, P_5) + d(P_2, P_5)}{2} = \frac{8.00 + 7.50}{2} = \mathbf{7.750}$

**Matriz Reducida $D_1$ ($4 \times 4$):**
| | $(P_1 P_2)$ | $P_3$ | $P_4$ | $P_5$ |
| :---: | :---: | :---: | :---: | :---: |
| **$(P_1 P_2)$** | $0.000$ | $4.250$ | $6.750$ | $7.750$ |
| **$P_3$** | $4.250$ | $0.000$ | $3.000$ | $3.500$ |
| **$P_4$** | $6.750$ | $3.000$ | $0.000$ | $2.000$ |
| **$P_5$** | $7.750$ | $3.500$ | $2.000$ | $0.000$ |

---

#### 2. Fusión 2 ($D_1 \to D_2$)
Mínimo en $D_1$: $d(P_4, P_5) = \mathbf{2.000}$.  
Se forma $(P_4 P_5)$ a nivel **$2.000$** con cardinal $|P_4 P_5| = 2$.

*Recálculo hacia $(P_4 P_5)$:*
* $d((P_4 P_5), P_3) = \frac{d(P_4, P_3) + d(P_5, P_3)}{2} = \frac{3.00 + 3.50}{2} = \mathbf{3.250}$
* $d((P_4 P_5), (P_1 P_2)) = \frac{d(P_4, P_1) + d(P_4, P_2) + d(P_5, P_1) + d(P_5, P_2)}{4} = \frac{7.00 + 6.50 + 8.00 + 7.50}{4} = \frac{29.00}{4} = \mathbf{7.250}$

**Matriz Reducida $D_2$ ($3 \times 3$):**
| | $(P_1 P_2)$ | $P_3$ | $(P_4 P_5)$ |
| :---: | :---: | :---: | :---: |
| **$(P_1 P_2)$** | $0.000$ | $4.250$ | $7.250$ |
| **$P_3$** | $4.250$ | $0.000$ | $3.250$ |
| **$(P_4 P_5)$** | $7.250$ | $3.250$ | $0.000$ |

---

#### 3. Fusión 3 ($D_2 \to D_3$ y Alerta de Trampa 5)
Mínimo en $D_2$: $d(P_3, (P_4 P_5)) = \mathbf{3.250}$.  
Se fusiona $P_3$ ($|P_3|=1$) con $(P_4 P_5)$ ($|P_4 P_5|=2$) para formar $\mathbf{(P_3 P_4 P_5)}$ con cardinal $1 + 2 = 3$.

> [!CAUTION] Alerta Pedagógica — Trampa 5 de Cátedra:
> * **Error común del alumno:** Promediar directamente los valores de la tabla anterior:  
>   $$d_{\text{erróneo}} = \frac{d((P_1 P_2), P_3) + d((P_1 P_2), (P_4 P_5))}{2} = \frac{4.250 + 7.250}{2} = \frac{11.500}{2} = \mathbf{5.750} \quad (\mathbf{\text{INCORRECTO}})$$
>   Esto asigna un 50% de peso a $P_3$ y sólo un 25% a cada uno de $P_4$ y $P_5$.
> * **Cálculo canónico obligatorio de cátedra (Ponderado por cardinales):**
>   $$d((P_1 P_2), P_3 \cup (P_4 P_5)) = \frac{|P_3| \cdot d((P_1 P_2), P_3) + |P_4 P_5| \cdot d((P_1 P_2), (P_4 P_5))}{|P_3| + |P_4 P_5|}$$
>   $$d((P_1 P_2), (P_3 P_4 P_5)) = \frac{1 \cdot (4.250) + 2 \cdot (7.250)}{1 + 2} = \frac{4.250 + 14.500}{3} = \frac{18.750}{3} = \mathbf{6.250}$$
>   (Comprobación directa sumando los $2 \times 3 = 6$ pares cruzados de $D_0$: $\frac{4.0 + 4.5 + 7.0 + 6.5 + 8.0 + 7.5}{6} = \frac{37.5}{6} = \mathbf{6.250}$).

**Matriz Reducida $D_3$ ($2 \times 2$):**
| | $(P_1 P_2)$ | $(P_3 P_4 P_5)$ |
| :---: | :---: | :---: |
| **$(P_1 P_2)$** | $0.000$ | $6.250$ |
| **$(P_3 P_4 P_5)$** | $6.250$ | $0.000$ |

---

#### 4. Fusión 4: Raíz Final
Se fusionan $(P_1 P_2)$ con $(P_3 P_4 P_5)$ a nivel **$6.250$**.

```
 Altura d
   ▲
7.0│               ┌───────────────────────────────┐  <--- Fusión Raíz a 6.250
   │               │                               │
5.0│               │                       ┌───────┴───────┐  <--- Fusión (P3(P4 P5)) a 3.250
   │               │                       │               │
3.0│               │               ┌───────┴───────┐       │  <--- Fusión (P4 P5) a 2.000
   │       ┌───────┴───────┐       │       ┌───────┴───────┐
1.0│       │       │       │       │       │       │       │  <--- Fusión (P1 P2) a 1.500
   │       │       │       │       │       │       │       │
0.0└───┬───┴───────┬───────┴───┬───┴───────┬───┴───┬───────┴───► Elementos
       P1          P2          P3          P4      P5
```
