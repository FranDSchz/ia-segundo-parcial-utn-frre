# Plantilla de Examen Imprimible: Algoritmos Genéticos (Selección y Operadores)
**Universidad Tecnológica Nacional — Facultad Regional Resistencia (UTN FRRe)**  
**Cátedra:** Inteligencia Artificial | **Hoja de Trabajo de Cálculo Práctico (Formato A4)**  

**Datos del Estudiante:**  
* **Apellido y Nombre:** ____________________________________________________  
* **Legajo N°:** ____________________ | **Comisión:** _______ | **Fecha:** ____ / ____ / 2026  
* **Tamaño Poblacional ($N$):** _____ | **Suma de Aptitud ($\sum f_i$):** _________  

---

## Fórmulas Guía de Operadores Genéticos
* **Probabilidad de Selección Proporcional:** $P(i) = \frac{f_i}{\sum_{j=1}^N f_j}$
* **Probabilidad Acumulada:** $C(i) = \sum_{j=1}^i P(j)$ &nbsp;|&nbsp; **Rango en Ruleta:** $[ \operatorname{round}(100 \cdot C(i-1)) \ \text{a} \ \operatorname{round}(100 \cdot C(i)) - 1 ]$
* **Valor Esperado de Copias:** $\eta_i = N \cdot P(i)$ &nbsp;|&nbsp; **Copias Enteras:** $C_i = \lfloor \eta_i \rfloor$
* **Residuo Decimal:** $r_i = \eta_i - C_i$ &nbsp;|&nbsp; **Plazas a Sortear:** $N_{\text{vacantes}} = N - \sum_{i=1}^N C_i$
* **Selección por Ranking Lineal:**
  $$P(i) = \frac{1}{N} \left[ R_{\min} + 2(1 - R_{\min}) \frac{N - i}{N - 1} \right], \quad i \in \{1, \dots, N\}$$
* **Mutación Adaptativa por Temperatura:**
  $$p_m(t) = \min(P_{\max}, \ P_{\min} + \lambda \cdot t) \quad \text{ó} \quad p_m(t) = \max(P_{\min}, \ P_{\max} - \lambda \cdot t)$$

---

## 1. Hoja de Trabajo: Evaluación de Fitness, Probabilidades y Ruleta [00 - 99]

| N° | Individuo | Cromosoma / Genotipo | Aptitud ($f_i$) | Probabilidad $P(i) = f_i / \sum f$ | Porcentaje (%) | Probabilidad Acumulada $C(i)$ | Intervalo Ruleta $[00 - 99]$ |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| 1 | $I_1$ | | | | | | |
| 2 | $I_2$ | | | | | | |
| 3 | $I_3$ | | | | | | |
| 4 | $I_4$ | | | | | | |
| 5 | $I_5$ | | | | | | |
| 6 | $I_6$ | | | | | | |
| 7 | $I_7$ | | | | | | |
| 8 | $I_8$ | | | | | | |
| **Total** | | — | $\sum f_i = $ | $\sum P(i) = 1.000$ | $100\%$ | — | — |

---

## 2. Hoja de Trabajo: Sorteo de Padres por Ruleta Monte Carlo

| Tirada ($k$) | Número Aleatorio ($R_k$) | Intervalo Coincidente | Individuo Seleccionado |
| :---: | :---: | :---: | :---: |
| 1 | | | |
| 2 | | | |
| 3 | | | |
| 4 | | | |
| 5 | | | |
| 6 | | | |

---

## 3. Hoja de Trabajo: Selección por Control de Número Esperado de Copias

| Individuo | Aptitud ($f_i$) | Valor Esperado $\eta_i = N \cdot P(i)$ | Copias Enteras Asignadas $C_i = \lfloor \eta_i \rfloor$ | Residuo Decimal $r_i = \eta_i - C_i$ | Probabilidad Decimal Normalizada $P_{\text{dec}}(i)$ | Intervalo Ruleta Decimal $[00 - 99]$ | Copias Ganadas por Sorteo | Total Copias Finales |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| $I_1$ | | | | | | | | |
| $I_2$ | | | | | | | | |
| $I_3$ | | | | | | | | |
| $I_4$ | | | | | | | | |
| $I_5$ | | | | | | | | |
| $I_6$ | | | | | | | | |
| **Totales** | $\sum f = $ | $\sum \eta_i = N =$ | **Enteras:** $\sum C_i =$ | **Suma:** $\sum r_i =$ | $\sum P_{\text{dec}} = 1.000$ | — | **Sorteo:** | **Población:** $N =$ |

* **Números aleatorios utilizados para el sorteo de plazas vacantes:**
  * Tirada 1: Aleatorio = _________ $\implies$ Asignado a: _________
  * Tirada 2: Aleatorio = _________ $\implies$ Asignado a: _________
  * Tirada 3: Aleatorio = _________ $\implies$ Asignado a: _________

---

## 4. Hoja de Trabajo: Mutación Adaptativa por Temperatura

* **Parámetros Térmicos:** $P_{\min} =$ __________ | $P_{\max} =$ __________ | $\lambda =$ __________ | Régimen: ____________________

| Generación ($t$) | Fórmula Aplicada: $p_m(t)$ | Sustitución Numérica | Probabilidad de Mutación $p_m(t)$ |
| :---: | :---: | :---: | :---: |
| $t = 0$ | | | |
| $t = $ _____ | | | |
| $t = $ _____ | | | |
| $t = $ _____ | | | |
