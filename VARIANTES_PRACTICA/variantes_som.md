# Dossier de Variantes Numéricas Resueltas: Redes SOM de Kohonen
**Universidad Tecnológica Nacional — Facultad Regional Resistencia (UTN FRRe)**  
**Cátedra:** Inteligencia Artificial (UTN FRRe)  
**Material de Entrenamiento Gradual en 3 Niveles**  

---

## Índice del Dossier
1. **Nivel 1 (Básico / Conceptual Inicial):** SOM con Vecindad Nula (Winner-Takes-All estricto).
2. **Nivel 2 (Parcial Real / Examen Estándar):** SOM con Vecindad Continua en Espacio de Pesos (Examen UTN FRRe 2023 `IA-H0075`).
3. **Nivel 3 (Caso Borde / Trampa 3):** Actualización Online Secuencial con Persistencia de Pesos (Efecto de Inversión de Ganadora).

---

## Nivel 1: SOM con Vecindad Nula (Winner-Takes-All Estricto)

### Enunciado
Considere una red autoorganizada de Kohonen con 2 neuronas de salida y 2 entradas.  
Pesos iniciales al paso $t=0$:
$$W_1(0) = [0.800, 0.100]^T, \quad W_2(0) = [0.100, 0.700]^T$$
Tasa de aprendizaje: $\alpha = 0.60$.  
Función de vecindad nula: $h(j^*, j^*) = 1.0$ (únicamente para la neurona ganadora) y $h(i, j^*) = 0.0$ para toda neurona vecina.

Se presenta el patrón:
$$X = [0.200, 0.900]^T$$

**Se solicita:**
1. Calcular la distancia euclídea de ambas neuronas al patrón $X$.
2. Determinar la neurona ganadora $j^*$.
3. Actualizar la matriz de pesos de la red al paso $t=1$.

---

### Solución Oficial Paso a Paso

#### 1. Distancias Euclídeas
* **Para Neurona 1:**
  $$d_1^2 = (0.200 - 0.800)^2 + (0.900 - 0.100)^2 = (-0.600)^2 + (0.800)^2 = 0.360 + 0.640 = 1.000$$
  $$d_1 = \sqrt{1.000} = \mathbf{1.000}$$

* **Para Neurona 2:**
  $$d_2^2 = (0.200 - 0.100)^2 + (0.900 - 0.700)^2 = (0.100)^2 + (0.200)^2 = 0.010 + 0.040 = 0.050$$
  $$d_2 = \sqrt{0.050} \approx \mathbf{0.224}$$

#### 2. Selección de la Ganadora (BMU)
Como $d_2 = 0.224 < d_1 = 1.000$, la neurona ganadora es **$j^* = 2$**.

#### 3. Actualización de Pesos Sinápticos
* **Neurona 2 (Ganadora, $h=1.0$):**
  $$W_2(1) = W_2(0) + \alpha \cdot (X - W_2(0)) = [0.100, 0.700]^T + 0.60 [0.200 - 0.100, 0.900 - 0.700]^T$$
  $$W_2(1) = [0.100, 0.700]^T + 0.60 [0.100, 0.200]^T = [0.100 + 0.060, 0.700 + 0.120]^T = [\mathbf{0.160}, \mathbf{0.820}]^T$$

* **Neurona 1 (Vecina inactiva, $h=0.0$):**
  $$W_1(1) = W_1(0) + 0 = [\mathbf{0.800}, \mathbf{0.100}]^T$$

---

## Nivel 2: SOM con Vecindad Continua en Espacio de Pesos (Examen Real UTN FRRe 2023)

### Enunciado
Dada una red SOM de 2 entradas y 2 neuronas de salida con:
$$W_1(0) = [+0.700, -0.100]^T, \quad W_2(0) = [-0.100, +0.400]^T$$
Parámetros: $\alpha = 0.70$ y función de vecindad continua evaluada en la distancia entre vectores de pesos:
$$h(i) = \frac{1}{2 + \operatorname{dist}(W_i(0), W_{j^*}(0))}$$

Se presenta el patrón $p_2 = [-0.800, -0.900]^T$.

**Se solicita:**
1. Determinar la neurona ganadora $j^*$.
2. Calcular los factores de vecindad $h(j^*)$ y $h(\text{vecina})$.
3. Actualizar los pesos de **ambas** neuronas.

---

### Solución Oficial Paso a Paso

#### 1. Distancias Euclídeas al Patrón $p_2$
* Para Neurona 1:
  $$d_1^2 = (-0.800 - 0.700)^2 + (-0.900 - (-0.100))^2 = (-1.500)^2 + (-0.800)^2 = 2.250 + 0.640 = 2.890$$
  $$d_1 = \sqrt{2.890} = \mathbf{1.700}$$

* Para Neurona 2:
  $$d_2^2 = (-0.800 - (-0.100))^2 + (-0.900 - 0.400)^2 = (-0.700)^2 + (-1.300)^2 = 0.490 + 1.690 = 2.180$$
  $$d_2 = \sqrt{2.180} \approx \mathbf{1.476}$$

Como $d_2 = 1.476 < d_1 = 1.700$, la neurona ganadora es **$j^* = 2$**.

#### 2. Factores de Vecindad Topológica
* **Para Neurona 2 (Ganadora):** $\operatorname{dist}(W_2, W_2) = 0 \implies h(2) = \frac{1}{2 + 0} = \mathbf{0.500}$.
* **Para Neurona 1 (Vecina):**
  $$\operatorname{dist}(W_1, W_2) = \sqrt{(0.700 - (-0.100))^2 + (-0.100 - 0.400)^2} = \sqrt{(0.800)^2 + (-0.500)^2} = \sqrt{0.640 + 0.250} = \sqrt{0.890} \approx 0.943$$
  $$h(1) = \frac{1}{2 + 0.943} = \frac{1}{2.943} \approx \mathbf{0.340}$$

#### 3. Actualización de Pesos al Paso $t=1$
Fórmula: $W_i(1) = W_i(0) + \alpha \cdot h(i) \cdot (p_2 - W_i(0))$

* **Neurona 2 (Ganadora):**
  $$p_2 - W_2(0) = [-0.800 - (-0.100), -0.900 - 0.400]^T = [-0.700, -1.300]^T$$
  $$\Delta W_2 = (0.70)(0.500)[-0.700, -1.300]^T = 0.350 [-0.700, -1.300]^T = [-0.245, -0.455]^T$$
  $$W_2(1) = [-0.100 - 0.245, 0.400 - 0.455]^T = [\mathbf{-0.345}, \mathbf{-0.055}]^T$$

* **Neurona 1 (Vecina):**
  $$p_2 - W_1(0) = [-0.800 - 0.700, -0.900 - (-0.100)]^T = [-1.500, -0.800]^T$$
  $$\Delta W_1 = (0.70)(0.340)[-1.500, -0.800]^T = 0.238 [-1.500, -0.800]^T = [-0.357, -0.190]^T$$
  $$W_1(1) = [0.700 - 0.357, -0.100 - 0.190]^T = [\mathbf{0.343}, \mathbf{-0.290}]^T$$

---

## Nivel 3: Caso Borde — Actualización Online Secuencial con Persistencia de Pesos (Trampa 3)

### Enunciado
Considere una red SOM con 2 entradas y 2 neuronas competitivas con pesos iniciales al tiempo $t=0$:
$$W_1(0) = [0.200, 0.600]^T, \quad W_2(0) = [0.700, 0.300]^T$$
Parámetros: $\alpha = 0.50$, vecindad nula.

Se presenta secuencialmente una secuencia de dos patrones:
1. Primero el patrón $p_1 = [0.400, 0.800]^T$.
2. Inmediatamente a continuación, el patrón $p_2 = [0.500, 0.520]^T$.

**Se solicita:**
1. Determinar la ganadora para $p_1$ y calcular los pesos actualizados $W(1)$.
2. Determinar la ganadora para $p_2$ utilizando el algoritmo online correcto (evaluando contra $W(1)$) y calcular $W(2)$.
3. Demostrar el error cometido si el alumno cae en la **Trampa 3 de Cátedra** (evaluar $p_2$ contra los pesos iniciales obsoletos $W(0)$), mostrando cómo se invierte erróneamente la neurona ganadora.

---

### Solución Oficial Paso a Paso

#### 1. Presentación de $p_1 = [0.400, 0.800]^T$
* Distancias euclídeas cuadráticas contra $W(0)$:
  $$d_1^2(p_1, W_1(0)) = (0.400 - 0.200)^2 + (0.800 - 0.600)^2 = 0.040 + 0.040 = \mathbf{0.080} \implies d_1 \approx 0.283$$
  $$d_2^2(p_1, W_2(0)) = (0.400 - 0.700)^2 + (0.800 - 0.300)^2 = 0.090 + 0.250 = \mathbf{0.340} \implies d_2 \approx 0.583$$
* Como $d_1 < d_2$, **la neurona ganadora para $p_1$ es $N_1$**.
* Actualización al paso $t=1$:
  $$W_1(1) = W_1(0) + 0.50 [0.400 - 0.200, 0.800 - 0.600]^T = [0.200 + 0.100, 0.600 + 0.100]^T = [\mathbf{0.300}, \mathbf{0.700}]^T$$
  $$W_2(1) = W_2(0) = [\mathbf{0.700}, \mathbf{0.300}]^T$$

#### 2. Presentación Correcta de $p_2 = [0.500, 0.520]^T$ (Algoritmo Online Persistente)
Se deben calcular las distancias obligatoriamente contra **$W(1)$**:
* **Distancia a $W_1(1) = [0.300, 0.700]^T$:**
  $$d_1^2(p_2, W_1(1)) = (0.500 - 0.300)^2 + (0.520 - 0.700)^2 = (0.200)^2 + (-0.180)^2 = 0.0400 + 0.0324 = \mathbf{0.0724}$$
  $$d_1 = \sqrt{0.0724} \approx \mathbf{0.269}$$

* **Distancia a $W_2(1) = [0.700, 0.300]^T$:**
  $$d_2^2(p_2, W_2(1)) = (0.500 - 0.700)^2 + (0.520 - 0.300)^2 = (-0.200)^2 + (0.220)^2 = 0.0400 + 0.0484 = \mathbf{0.0884}$$
  $$d_2 = \sqrt{0.0884} \approx \mathbf{0.297}$$

* **Resultado Legítimo:**
  Como $d_1 = 0.269 < d_2 = 0.297$, **la neurona ganadora para $p_2$ es nuevamente $N_1$**.
  $$W_1(2) = W_1(1) + 0.50 [0.500 - 0.300, 0.520 - 0.700]^T = [0.300 + 0.100, 0.700 - 0.090]^T = [\mathbf{0.400}, \mathbf{0.610}]^T$$
  $$W_2(2) = W_2(1) = [\mathbf{0.700}, \mathbf{0.300}]^T$$

#### 3. Demostración Forense de la Trampa 3 de Cátedra
Si el alumno ignora la persistencia online y calcula las distancias de $p_2$ contra los pesos obsoletos $W(0)$:
* $d_1^2(p_2, W_1(0)) = (0.500 - 0.200)^2 + (0.520 - 0.600)^2 = 0.0900 + 0.0064 = \mathbf{0.0964} \implies d_1 \approx 0.311$
* $d_2^2(p_2, W_2(0)) = (0.500 - 0.700)^2 + (0.520 - 0.300)^2 = 0.0400 + 0.0484 = \mathbf{0.0884} \implies d_2 \approx 0.297$

El alumno concluye erróneamente que $d_2 < d_1$ e indica que la ganadora es $N_2$, actualizando la neurona equivocada:
$$W_2^{\text{erróneo}} = [0.700, 0.300]^T + 0.50 [0.500 - 0.700, 0.520 - 0.300]^T = [0.600, 0.410]^T \quad (\mathbf{\text{Calificación docente: 0 / 25 pts}})$$
**Conclusión formativa:** En el examen de la UTN FRRe, la red SOM opera en modo online: cada patrón modifica de inmediato la topología del espacio de pesos para los estímulos futuros.
