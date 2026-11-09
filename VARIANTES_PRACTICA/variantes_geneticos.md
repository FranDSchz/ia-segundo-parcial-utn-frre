# Dossier de Variantes Numéricas Resueltas: Algoritmos Genéticos
**Universidad Tecnológica Nacional — Facultad Regional Resistencia (UTN FRRe)**  
**Cátedra:** Inteligencia Artificial (UTN FRRe)  
**Material de Entrenamiento Gradual en 3 Niveles (Guía TP-AG + Apunte Oficial de Mutación)**  

---

## Índice del Dossier
1. **Nivel 1 (Básico / Selección Proporcional):** Ruleta Simple Monte Carlo con Mapeo $[00 - 99]$.
2. **Nivel 2 (Intermedio / Presión Selectiva Controlada):** Selección por Ranking Lineal con Parámetro $R_{\min}$ (Ejercicio Oficial Guía TP).
3. **Nivel 3 (Avanzado / Caso de Cátedra):** Mutación Adaptativa por Temperatura con Reinicio Cíclico en Generaciones 200, 320 y 435 (`Alg_gen_Adapt_Temp.pdf`).

---

## Nivel 1: Ruleta Proporcional Simple Monte Carlo $[00 - 99]$

### Enunciado
Dada una población de $N = 5$ individuos en la generación $t$ con los siguientes valores de aptitud (*fitness*):

| Individuo | Aptitud ($f_i$) |
| :---: | :---: |
| **$I_1$** | $40$ |
| **$I_2$** | $25$ |
| **$I_3$** | $10$ |
| **$I_4$** | $50$ |
| **$I_5$** | $25$ |

**Se solicita:**
1. Calcular la aptitud total y la probabilidad de selección $P(i) = f_i / \sum f_j$.
2. Construir la tabla de probabilidad acumulada y los rangos enteros de ruleta $[00 - 99]$.
3. Sortear 3 individuos utilizando la siguiente secuencia de números pseudoaleatorios provistos:
   $$\mathbf{R} = [12, \ 48, \ 91]$$

---

### Solución Oficial Paso a Paso

#### 1. Cálculo de Probabilidades
Aptitud Total:
$$\sum_{i=1}^5 f_i = 40 + 25 + 10 + 50 + 25 = \mathbf{150}$$

* $P(1) = 40 / 150 = 4 / 15 \approx \mathbf{0.2667}$ ($26.67\%$)
* $P(2) = 25 / 150 = 1 / 6 \approx \mathbf{0.1667}$ ($16.67\%$)
* $P(3) = 10 / 150 = 1 / 15 \approx \mathbf{0.0667}$ ($6.67\%$)
* $P(4) = 50 / 150 = 1 / 3 \approx \mathbf{0.3333}$ ($33.33\%$)
* $P(5) = 25 / 150 = 1 / 6 \approx \mathbf{0.1667}$ ($16.67\%$)

#### 2. Tabla de Ruleta $[00 - 99]$
| Individuo | $f_i$ | $P(i)$ | Acumulada $C(i)$ | Intervalo Entero $[00 - 99]$ |
| :---: | :---: | :---: | :---: | :---: |
| **$I_1$** | $40$ | $0.2667$ | $0.2667$ | **$[00 - 26]$** |
| **$I_2$** | $25$ | $0.1667$ | $0.4334$ | **$[27 - 42]$** |
| **$I_3$** | $10$ | $0.0667$ | $0.5001$ | **$[43 - 49]$** |
| **$I_4$** | $50$ | $0.3333$ | $0.8334$ | **$[50 - 82]$** |
| **$I_5$** | $25$ | $0.1667$ | $1.0000$ | **$[83 - 99]$** |

#### 3. Sorteo de Individuos
1. Aleatorio **$12$**: Cae en $[00 - 26] \implies$ Selecciona a **$I_1$**
2. Aleatorio **$48$**: Cae en $[43 - 49] \implies$ Selecciona a **$I_3$**
3. Aleatorio **$91$**: Cae en $[83 - 99] \implies$ Selecciona a **$I_5$**

Individuos ganadores del apareamiento: $\{I_1, I_3, I_5\}$.

---

## Nivel 2: Selección por Ranking Lineal con Parámetro $R_{\min}$ (Ejercicio Oficial Cátedra)

### Enunciado y Marco Teórico
Cuando en una población existen individuos con un fitness excesivamente dominante (super-individuos), la ruleta proporcional puede causar convergencia prematura. Para evitarlo, la cátedra UTN FRRe utiliza el **Ranking Lineal**, ordenando los individuos de mejor ($i=1$) a peor ($i=N$) e independizando las probabilidades de los valores absolutos de fitness mediante la fórmula:
$$P(i) = \frac{1}{N} \left[ R_{\min} + 2(1 - R_{\min}) \frac{N - i}{N - 1} \right], \quad i \in \{1, \dots, N\}$$
donde $R_{\min} \in [0, 1]$ representa la probabilidad asignada al peor individuo escalada respecto a la media.

Considere $N = 5$ individuos ordenados por aptitud descendente:  
$i=1$ ($I_{\text{mejor}}$), $i=2$, $i=3$, $i=4$, $i=5$ ($I_{\text{peor}}$).

**Se solicita:**
1. Deducir y calcular analíticamente las probabilidades $P(i)$ para **$R_{\min} = 0.0$** (máxima presión selectiva).
2. Repetir el cálculo para **$R_{\min} = 0.5$** (presión intermedia).
3. Repetir el cálculo para **$R_{\min} = 1.0$** (selección uniforme sin sesgo).
4. Verificar que en los tres casos se cumple $\sum_{i=1}^5 P(i) = 1.0$.

---

### Solución Oficial Paso a Paso

#### 1. Caso $R_{\min} = 0.0$ (Presión Selectiva Máxima)
Sustituyendo $N = 5$ y $R_{\min} = 0.0$:
$$P(i) = \frac{1}{5} \left[ 0 + 2(1 - 0) \frac{5 - i}{4} \right] = \frac{1}{5} \left[ \frac{5 - i}{2} \right] = \frac{5 - i}{10}$$
* Para $i = 1$ (Mejor individuo): $P(1) = \frac{5 - 1}{10} = \frac{4}{10} = \mathbf{0.400}$ ($40\%$)
* Para $i = 2$: $P(2) = \frac{5 - 2}{10} = \frac{3}{10} = \mathbf{0.300}$ ($30\%$)
* Para $i = 3$: $P(3) = \frac{5 - 3}{10} = \frac{2}{10} = \mathbf{0.200}$ ($20\%$)
* Para $i = 4$: $P(4) = \frac{5 - 4}{10} = \frac{1}{10} = \mathbf{0.100}$ ($10\%$)
* Para $i = 5$ (Peor individuo): $P(5) = \frac{5 - 5}{10} = \frac{0}{10} = \mathbf{0.000}$ ($0\%$)
$$\sum P(i) = 0.40 + 0.30 + 0.20 + 0.10 + 0.00 = \mathbf{1.000} \quad \text{(Verificado)}$$

#### 2. Caso $R_{\min} = 0.5$ (Presión Selectiva Moderada)
Sustituyendo $N = 5$ y $R_{\min} = 0.5$:
$$P(i) = \frac{1}{5} \left[ 0.5 + 2(0.5) \frac{5 - i}{4} \right] = \frac{1}{5} \left[ 0.5 + \frac{5 - i}{4} \right] = 0.1 + \frac{5 - i}{20}$$
* Para $i = 1$: $P(1) = 0.10 + \frac{4}{20} = 0.10 + 0.20 = \mathbf{0.300}$ ($30\%$)
* Para $i = 2$: $P(2) = 0.10 + \frac{3}{20} = 0.10 + 0.15 = \mathbf{0.250}$ ($25\%$)
* Para $i = 3$: $P(3) = 0.10 + \frac{2}{20} = 0.10 + 0.10 = \mathbf{0.200}$ ($20\%$)
* Para $i = 4$: $P(4) = 0.10 + \frac{1}{20} = 0.10 + 0.05 = \mathbf{0.150}$ ($15\%$)
* Para $i = 5$: $P(5) = 0.10 + \frac{0}{20} = 0.10 + 0.00 = \mathbf{0.100}$ ($10\%$)
$$\sum P(i) = 0.30 + 0.25 + 0.20 + 0.15 + 0.10 = \mathbf{1.000} \quad \text{(Verificado)}$$

#### 3. Caso $R_{\min} = 1.0$ (Selección Neutra / Uniforme)
Sustituyendo $R_{\min} = 1.0$:
$$P(i) = \frac{1}{5} \left[ 1.0 + 2(0) \frac{5 - i}{4} \right] = \frac{1}{5} [1.0] = \mathbf{0.200} \quad (\forall i \in \{1, 2, 3, 4, 5\})$$
$$\sum P(i) = 5 \times 0.200 = \mathbf{1.000} \quad \text{(Verificado)}$$
*Conclusión docente:* A medida que $R_{\min} \to 1.0$, el ranking lineal elimina gradualmente la presión selectiva, convirtiendo el sorteo en un muestreo aleatorio equiprobable puro.

---

## Nivel 3: Mutación Adaptativa por Temperatura y Ciclos de Reinicio (Guía de Cátedra `Alg_gen_Adapt_Temp.pdf`)

### Enunciado Oficial de Cátedra
En el modelo oficial de Mutación Adaptativa provisto en `Alg_gen_Adapt_Temp.pdf`, se definen los siguientes parámetros de ajuste:
* $P_{\min} = 0.001$
* $P_{\max} = 0.100$
* Tasa de incremento térmico: $\lambda = 0.001$ por generación

Las generaciones comienzan estrictamente en la generación $t = 0$.  
En el régimen de **Temperatura Ascendente**, la probabilidad de mutación en la generación $t$ se incrementa linealmente:
$$p_m(t) = P_{\min} + \lambda \cdot t = 0.001 + 0.001 \cdot t$$
hasta alcanzar el valor tope $P_{\max} = 0.100$ en la generación $t = 99$.

**Consigna de Examen:**  
*«¿Cuáles serían los valores de probabilidad de mutación en las generaciones 200, 320 y 435 si, cuando se alcanza $P_{\max}$, la próxima generación toma el valor de probabilidad $P_{\min}$ y se reinicia el proceso de incremento?»*

---

### Solución Oficial Paso a Paso

#### 1. Determinación de la Longitud del Ciclo Térmico
* Generación inicial del ciclo: $t_{\text{inicio}} = 0 \implies p_m(0) = 0.001$.
* Número de incrementos para alcanzar el tope:
  $$\Delta t = \frac{P_{\max} - P_{\min}}{\lambda} = \frac{0.100 - 0.001}{0.001} = \frac{0.099}{0.001} = 99 \text{ incrementos}$$
* El valor tope $P_{\max} = 0.100$ se alcanza exactamente en la generación $t = 99$.
* Como al alcanzar el tope la siguiente generación toma el valor $P_{\min}$, el ciclo completo comprende exactamente:
  $$T_{\text{ciclo}} = 99 + 1 = \mathbf{100 \text{ generaciones}}$$

#### 2. Mapeo de Ciclos por Aritmética Modular
Cualquier generación arbitraria $t$ se descompone como:
$$t = k \cdot 100 + t_{\text{relativo}}, \quad \text{donde } t_{\text{relativo}} = t \pmod{100} \in [0, 99]$$
y la probabilidad de mutación viene dada por:
$$p_m(t) = P_{\min} + \lambda \cdot t_{\text{relativo}} = 0.001 + 0.001 \cdot (t \pmod{100})$$

#### 3. Evaluación en las Generaciones Solicitadas
* **Para la Generación $t = 200$:**
  $$t_{\text{relativo}} = 200 \pmod{100} = 0$$
  $$p_m(200) = 0.001 + 0.001 \cdot (0) = \mathbf{0.0010}$$
  *(La generación 200 corresponde al inicio exacto del tercer ciclo térmico)*.

* **Para la Generación $t = 320$:**
  $$t_{\text{relativo}} = 320 \pmod{100} = 20$$
  $$p_m(320) = 0.001 + 0.001 \cdot (20) = 0.001 + 0.020 = \mathbf{0.0210}$$

* **Para la Generación $t = 435$:**
  $$t_{\text{relativo}} = 435 \pmod{100} = 35$$
  $$p_m(435) = 0.001 + 0.001 \cdot (35) = 0.001 + 0.035 = \mathbf{0.0360}$$

#### 4. Resumen Tabular de Resultados Oficiales
| Generación ($t$) | Número de Ciclo | Generación Relativa en Ciclo ($t_{\text{rel}}$) | Fórmula Aplicada | Probabilidad de Mutación ($p_m$) |
| :---: | :---: | :---: | :---: | :---: |
| **$200$** | Ciclo 3 | $0$ | $0.001 + 0.001(0)$ | **$0.0010$ ($0.10\%$)** |
| **$320$** | Ciclo 4 | $20$ | $0.001 + 0.001(20)$ | **$0.0210$ ($2.10\%$)** |
| **$435$** | Ciclo 5 | $35$ | $0.001 + 0.001(35)$ | **$0.0360$ ($3.60\%$)** |
