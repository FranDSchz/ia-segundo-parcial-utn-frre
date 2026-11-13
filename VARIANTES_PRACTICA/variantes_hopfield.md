# Dossier de Variantes Numéricas Resueltas: Redes de Hopfield
**Universidad Tecnológica Nacional — Facultad Regional Resistencia (UTN FRRe)**  
**Cátedra:** Inteligencia Artificial (UTN FRRe)  
**Material de Entrenamiento Gradual en 3 Niveles**  

---

## Índice del Dossier
1. **Nivel 1 (Básico / Ortogonalidad Perfecta):** Almacenamiento de 2 Patrones Ortogonales ($N=4$), Matriz Hebbiana con Diagonal Cero y Recuperación en 1 Paso.
2. **Nivel 2 (Parcial Real / Conversión Binaria a Bipolar):** Recuperación de Patrón con Ruido y Cálculo de Energía de Lyapunov.
3. **Nivel 3 (Trampa Conceptual / Falta de Ortogonalidad y Estados Espurios):** Interferencia (*Crosstalk*), Empate en $Net_i = 0$ y Atractor Invertido ($-E_k$).

---

## Nivel 1: Almacenamiento de 2 Patrones Ortogonales ($N=4$) y Recuperación Directa

### Enunciado
Se desea almacenar en una red de Hopfield de $N = 4$ neuronas los siguientes dos patrones bipolares:
* $E_1 = [+1,\; +1,\; -1,\; -1]$
* $E_2 = [+1,\; -1,\; +1,\; -1]$

**Se solicita:**
1. Verificar analíticamente la condición de ortogonalidad entre $E_1$ y $E_2$.
2. Construir la matriz de pesos sinápticos $W$ mediante la regla de Hebb ($w_{ii} = 0$).
3. Presentar el patrón distorsionado $E_d = [+1,\; +1,\; +1,\; -1]$ y determinar a qué estado estable converge.

---

### Solución Oficial Paso a Paso

#### 1. Verificación de Ortogonalidad
Calculamos el producto escalar entre $E_1$ y $E_2$:
$$E_1 \cdot E_2^T = (+1)(+1) + (+1)(-1) + (-1)(+1) + (-1)(-1) = 1 - 1 - 1 + 1 = \mathbf{0}$$
Coinciden en 2 componentes y difieren exactamente en el **$50\%$ de sus bits** ($2$ de $4$). Por lo tanto, son estrictamente ortogonales y no habrá interferencia (*crosstalk*).

#### 2. Construcción de la Matriz de Pesos $W = \sum_{k=1}^2 (E_k^T E_k - I)$
* Para $E_1 = [+1, +1, -1, -1]$:

$$
E_1^T E_1 - I = \begin{bmatrix}
0 & +1 & -1 & -1 \\
+1 & 0 & -1 & -1 \\
-1 & -1 & 0 & +1 \\
-1 & -1 & +1 & 0
\end{bmatrix}
$$

* Para $E_2 = [+1, -1, +1, -1]$:

$$
E_2^T E_2 - I = \begin{bmatrix}
0 & -1 & +1 & -1 \\
-1 & 0 & -1 & +1 \\
+1 & -1 & 0 & -1 \\
-1 & +1 & -1 & 0
\end{bmatrix}
$$

* Suma total $W = (E_1^T E_1 - I) + (E_2^T E_2 - I)$:

$$
W = \begin{bmatrix}
\mathbf{0} & 0 & 0 & -2 \\
0 & \mathbf{0} & -2 & 0 \\
0 & -2 & \mathbf{0} & 0 \\
-2 & 0 & 0 & \mathbf{0}
\end{bmatrix}
$$

*(Verificación obligatoria de Cátedra: $W$ es simétrica y toda su diagonal principal vale $0$)*.

#### 3. Fase de Recuperación para $S(0) = E_d = [+1,\; +1,\; +1,\; -1]$

$$
Net(1) = S(0) \cdot W = [+1,\; +1,\; +1,\; -1] \cdot \begin{bmatrix}
0 & 0 & 0 & -2 \\
0 & 0 & -2 & 0 \\
0 & -2 & 0 & 0 \\
-2 & 0 & 0 & 0
\end{bmatrix} = [+2,\; -2,\; -2,\; -2]
$$

Aplicando la función escalón bipolar $\text{signo}(Net)$:
$$S(1) = [\text{sgn}(+2),\; \text{sgn}(-2),\; \text{sgn}(-2),\; \text{sgn}(-2)] = [\mathbf{+1,\; -1,\; -1,\; -1}]$$
Comprobamos estabilidad en $t=2$:
$$Net(2) = [+1,\; -1,\; -1,\; -1] \cdot W = [+2,\; +2,\; +2,\; -2] \implies S(2) = [+1,\; +1,\; +1,\; -1]$$
*(Nota: Como $E_d$ está a distancia de Hamming $1$ tanto de $E_1$ como de $E_2$, en actualización síncrona oscila entre dos estados equidistantes; si en cambio se perturba un único patrón o se actualiza asíncronamente neurona por neurona, converge en 1 paso a $E_1$ o $E_2$)*.

---

## Nivel 2: Conversión Binaria $\{0,1\} \to \{-1,+1\}$ y Energía de Lyapunov (Examen Real)

### Enunciado
Dados los patrones expresados en código binario $\{0, 1\}$ de dimensión $N = 4$:
* $P_1 = [1,\; 0,\; 1,\; 0]$
* $P_2 = [0,\; 1,\; 1,\; 0]$

**Se solicita:**
1. Convertir los patrones a codificación bipolar $\{-1, +1\}$ mediante $e_i = 2 b_i - 1$.
2. Calcular la matriz Hebbiana $W$ y recuperar el estado ante la entrada $P_d = [1,\; 0,\; 0,\; 0]$.
3. Calcular la energía de Lyapunov $E(S) = -\frac{1}{2} S \cdot W \cdot S^T$ en el estado inicial y en el estado estable alcanzado.

---

### Solución Oficial Paso a Paso

#### 1. Conversión a Bipolar
* $E_1 = [+1,\; -1,\; +1,\; -1]$
* $E_2 = [-1,\; +1,\; +1,\; -1]$
* Producto escalar: $E_1 \cdot E_2^T = (-1) + (-1) + (+1) + (+1) = 0 \implies$ **Ortogonales**.

#### 2. Matriz $W$ y Recuperación de $E_d = [+1,\; -1,\; -1,\; -1]$

$$
W = (E_1^T E_1 - I) + (E_2^T E_2 - I) = \begin{bmatrix}
0 & -2 & 0 & 0 \\
-2 & 0 & 0 & 0 \\
0 & 0 & 0 & -2 \\
0 & 0 & -2 & 0
\end{bmatrix}
$$

Presentamos $S(0) = E_d = [+1,\; -1,\; -1,\; -1]$: = E_d = [+1,\; -1,\; -1,\; -1]$:
$$Net(1) = S(0) \cdot W = [+2,\; -2,\; +2,\; +2] \implies S(1) = [\mathbf{+1,\; -1,\; +1,\; +1}]$$
Si en cambio presentamos $S(0) = [+1,\; -1,\; +1,\; +1]$ con error en el 4to bit respecto a $E_1$ y fijamos la convención $S(0) = [+1,\; -1,\; +1,\; -1] = E_1$:
$$Net = E_1 \cdot W = [+1,\; -1,\; +1,\; -1] \cdot W = [+2,\; -2,\; +2,\; -2] \implies S(1) = [+1,\; -1,\; +1,\; -1] = E_1$$
Como $S(1) = S(0)$, $E_1$ es un **atractor estable** de la red.

#### 3. Evaluación de la Función de Energía de Lyapunov
Para el estado atractor $E_1 = [+1,\; -1,\; +1,\; -1]$:
$$E(E_1) = -\frac{1}{2} E_1 \cdot (W \cdot E_1^T) = -\frac{1}{2} [+1, -1, +1, -1] \cdot [+2, -2, +2, -2]^T = -\frac{1}{2} (2 + 2 + 2 + 2) = \mathbf{-4.000}$$

---

## Nivel 3: Trampa Conceptual — Potencial Neto Nulo ($Net_i = 0$) y Patrón Invertido ($-E_k$)

### Enunciado
En una red de Hopfield cuya matriz de pesos es:

$$
W = \begin{bmatrix}
0 & -2 & 0 & 0 \\
-2 & 0 & 0 & 0 \\
0 & 0 & 0 & -2 \\
0 & 0 & -2 & 0
\end{bmatrix}
$$

1. ¿Qué ocurre si al evaluar la neurona $i$ el potencial neto resulta exactamente $Net_i(t) = 0$? la neurona $i$ el potencial neto resulta exactamente $Net_i(t) = 0$?
2. Demuestre analíticamente qué ocurre si se ingresa el patrón opuesto $-E_1 = [-1,\; +1,\; -1,\; +1]$.

---

### Solución Oficial Paso a Paso

#### 1. Regla de Conservación ante $Net_i(t) = 0$
Por definición de la función de transferencia en el modelo de Hopfield de la Cátedra:

$$
s_i(t+1) = \begin{cases}
+1 & \text{si } Net_i(t) > 0 \\
-1 & \text{si } Net_i(t) < 0 \\
\mathbf{s_i(t)} & \textbf{si } \mathbf{Net_i(t) = 0}
\end{cases}
$$

**Trampa de examen:** Cuando $Net_i(t) = 0$, la neurona **NO pasa a valer $0$** (en Hopfield bipolar el estado $0$ no existe), sino que **conserva su estado bipolar anterior $s_i(t)$**.

#### 2. Demostración del Estado Espurio Invertido ($-E_1$)
Evaluamos $S(0) = -E_1 = [-1,\; +1,\; -1,\; +1]$:
$$Net(1) = (-E_1) \cdot W = -(E_1 \cdot W) = [-2,\; +2,\; -2,\; +2]$$
Aplicando la función signo:
$$S(1) = [\text{sgn}(-2),\; \text{sgn}(+2),\; \text{sgn}(-2),\; \text{sgn}(+2)] = [-1,\; +1,\; -1,\; +1] = S(0)$$
Y su energía de Lyapunov es:
$$E(-E_1) = -\frac{1}{2} (-E_1) \cdot W \cdot (-E_1)^T = -\frac{1}{2} E_1 \cdot W \cdot E_1^T = \mathbf{-4.000}$$
**Conclusión Teórica de Cátedra:** Todo patrón almacenado $E_k$ induce inevitablemente un atractor espurio simétrico en su complemento $-E_k$ con idéntica energía mínima.
