# Segundo Parcial Presencial de Inteligencia Artificial — 19/11/2025

**Cátedra:** Inteligencia Artificial — UTN FRRe (5to Nivel ISI)  
**Modalidad:** Examen Práctico Escrito (4 Ejercicios Integradores)

---

### Punto 1 (20%) — Clustering Jerárquico Aglomerativo
Partiendo de las distancias entre las 5 instancias, realizar e indicar los pasos necesarios del algoritmo de **clustering jerárquico aglomerativo**, empleando las estrategias **Complete Link** y **Average Link**. Graficar los dendrogramas resultantes.

* $d(A,B) = 3.44$, $d(A,C) = 1.32$, $d(A,D) = 8.21$, $d(A,E) = 6.23$, $d(B,C) = 7.43$
* $d(B,D) = 1.22$, $d(B,E) = 5.67$, $d(C,D) = 5.16$, $d(C,E) = 1.88$, $d(D,E) = 8.38$

---

### Punto 2 (30%) — Mapa Auto-Organizado de Kohonen (SOM)
De acuerdo al conjunto de datos mostrado en la siguiente tabla, para una red **SOM** (con función de vecindad no nula):
1. **(25%)** Presentar el patrón $P_4$ y actualizar los pesos correspondientes con tasa de aprendizaje $\alpha = 0.8$ y función de vecindad continua:
   $$h(t) = \frac{1}{1 + \text{dist}(S_i, S_j)^2}$$
2. **(5%)** Graficar la arquitectura de red correspondiente al ejercicio.

**Pesos Iniciales:**
* $W_1 = [-3.2;\; -4.4]$
* $W_2 = [1.6;\; 1.7]$
* $W_3 = [-2.8;\; -5.5]$

| Atributo | $P_1$ | $P_2$ | $P_3$ | $P_4$ | $P_5$ |
| :---: | :---: | :---: | :---: | :---: | :---: |
| $X_1$ | $1.50$ | $0.50$ | $0.25$ | **$0.15$** | $0.90$ |
| $X_2$ | $2.50$ | $0.70$ | $0.75$ | **$0.88$** | $2.10$ |

---

### Punto 3 (30%) — Perceptrón Multicapa (MLP - Backpropagation)
Dada la red MLP y los datos de la tabla (con función de transferencia **sigmoidal estándar** para todas las neuronas), calcular los errores ($\delta$) de las neuronas y luego actualizar los pesos indicados a continuación:

| Parámetro / Peso | Valor Inicial |
| :--- | :---: |
| $W_{H1\text{-}I01}$ | $0.50$ |
| $W_{H1\text{-}I02}$ | $1.50$ |
| $W_{H2\text{-}I01}$ | $0.90$ |
| $W_{H2\text{-}I02}$ | $1.20$ |
| $W_{O1\text{-}H1}$ *(en tabla original: `WO1-I01`)* | $1.00$ |
| $W_{O1\text{-}H2}$ *(en tabla original: `WO1-I02`)* | $1.80$ |
| $W_{O2\text{-}H1}$ *(en tabla original: `WO2-I01`)* | $1.40$ |
| $W_{O2\text{-}H2}$ *(en tabla original: `WO2-I02`)* | $2.30$ |
| Entrada $I_{01}$ | $2$ |
| Entrada $I_{02}$ | $3$ |
| Tasa de aprendizaje $\alpha$ | $0.8$ |
| Salida deseada $d_{01}$ | $1$ |
| Salida deseada $d_{02}$ | $0$ |

---

### Punto 4 (20%) — Algoritmos Genéticos
Para los siguientes 8 individuos de 8 bits ($G_1 \dots G_8$):
1. **a)** Realizar **cruza simple** en $G_4$ para los pares de individuos $(I_{01}\text{-}I_{02})$ e $(I_{03}\text{-}I_{04})$.
2. **b)** Realizar **cruza multipunto** en $G_2, G_5, G_7$ para los pares $(I_{05}\text{-}I_{07})$ e $(I_{06}\text{-}I_{08})$.
3. **c)** Aplicar **selección con control de copias esperadas** al $50\%$ de la población (de ser necesario, utilizar la parte decimal según criterio de residuo fraccionario).

| Individuo | Cromosoma ($G_1 \dots G_8$) | Aptitud ($f_i$) |
| :---: | :---: | :---: |
| $I_{01}$ | `00110011` | $18$ |
| $I_{02}$ | `01100101` | $14$ |
| $I_{03}$ | `00001001` | $21$ |
| $I_{04}$ | `00011110` | $22$ |
| $I_{05}$ | `10100100` | $16$ |
| $I_{06}$ | `01111010` | $44$ |
| $I_{07}$ | `11000101` | $41$ |
| $I_{08}$ | `01101110` | $12$ |

> [!TIP]
> **Resolución Completa Paso a Paso:** Consultá el desarrollo analítico íntegro de estos 4 puntos en [`BANCO_EJERCICIOS_PRACTICOS_2024_2025_FINALES.md`](../../GUIAS_PASO_A_PASO/BANCO_EJERCICIOS_PRACTICOS_2024_2025_FINALES.md).
