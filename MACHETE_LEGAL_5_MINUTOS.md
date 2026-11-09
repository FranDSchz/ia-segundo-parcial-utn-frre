# Machete Legal de Emergencia (Repaso de 5 a 15 Minutos Antes de Rendir)
**Cátedra:** Inteligencia Artificial — UTN FRRe (5to Nivel ISI)  
**Instrucción:** Leé esta síntesis conceptual en el pasillo del aula Magna antes de que la Cátedra reparta los enunciados.

---

## ⚡ Síntesis de Modelos Clave en 30 Segundos

```
┌───────────────────────────────────────┬───────────────────────────────────────┐
│ Mod. 1: SVM (Soporte Vectorial)       │ Mod. 2: SOM de Kohonen                │
│ • w = Σ α_i y_i x_i (¡Sólo con α > 0!)│ • Ganadora j^{\ast}: menor dist euclídea    │
│ • b = y_i - w^T x_i (Promediar SVs)   │ • Vecindad continua h: ¡actualizar    │
│ • Margen: M = 2 / ||w||               │   TODAS las neuronas con h > 0!       │
│ • KKT: Σ α_i y_i = 0, α_i >= 0        │ • p2: ¡USAR PESOS NUEVOS W(1)!        │
├───────────────────────────────────────┼───────────────────────────────────────┤
│ Mod. 3: MLP Backpropagation           │ Mod. 4: Clustering / Hopfield / AG    │
│ • Sigmoide: f'(net) = f · (1 - f)     │ • Average Link: pares cruzados / N    │
│ • δ_salida = (d - y) · f'(net)        │   ¡NO promediar distancias previas!   │
│ • δ_oculta = f'(net) · Σ (δ_sal · w)  │ • Hopfield: ¡DIAGONAL CERO SIEMPRE!   │
│ • Δw = α · δ_destino · activ_origen   │ • AG: Ruleta 00-99 / Copias enteras   │
└───────────────────────────────────────┴───────────────────────────────────────┘
```

---

## 🎯 Tabla Mnemotécnica Rápida de Sustitución

| Modelo | Fórmula Crítica de Calculadora | Error Típico del que Descuenta Puntos |
| :--- | :--- | :--- |
| **SVM** | $b_i = y_i - (w_1 x_1 + w_2 x_2)$ | Usar un punto con $\alpha = 0$ para calcular $b$. |
| **SOM** | $w_{\text{nuevo}} = w_{\text{ant}} + \alpha \cdot h \cdot (x - w_{\text{ant}})$ | Olvidar actualizar la neurona vecina cuando $h \ne 0$. |
| **MLP** | $\delta_s = (d_k - y_k) \cdot y_k \cdot (1 - y_k)$ | Invertir el signo: es $(d - y)$, NO $(y - d)$. |
| **Average Link** | $d((ANR), SP) = \frac{2 \cdot d(AN, SP) + 1 \cdot d(R, SP)}{3}$ | Dividir por 2 en vez de dividir por la cardinalidad 3. |
| **Hopfield** | $w_{ii} = 0 \quad (\text{diagonal principal nula})$ | Dejar los autolazos $w_{ii} = M$ sin restar la identidad. |
| **Naïve Bayes** | $P(x_i \in \text{bin} \mid C_k) = \frac{\text{frecuencia}}{N_k}$ | Dividir por el total global en vez de por el total de la clase. |
| **KNN** | $w_i = \frac{1}{1 + d^2}$ | Olvidar sumar 1 en el denominador si un punto coincide. |
| **Genéticos** | $p_i = f_i / \sum f, \quad q_i = \sum p$ | Dejar baches o superposiciones en el rango $[00 - 99]$. |

---

## 🚨 Las 6 Trampas Clásicas de Cátedra (Checklist Anticaída)

1. **¿SVM te dio varios valores de $b$?**  
   $\to$ Reportá $b\_{prom} = \frac{1}{|SV|} \sum b\_i$ indicando que promediás por tolerancia numérica.
2. **¿SOM tiene función $h = 1 / (2 + \text{dist})$?**  
   $\to$ Calculá la distancia entre los pesos de la ganadora y la vecina. ¡Actualizá las DOS neuronas!
3. **¿SOM te pide presentar dos patrones ($p\_1$ y luego $p\_2$)?**  
   $\to$ Al calcular distancias para $p_2$, **usá la matriz de pesos $W(1)$**, NO los iniciales.
4. **¿Matriz de Hopfield armada?**  
   $\to$ Pasá un lápiz por la diagonal principal: **TODOS DEBEN SER CEROS**.
5. **¿Fusión en Clustering?**  
   $\to$ Ponderá por el tamaño de cada cluster antes de promediar distancias.
6. **¿Preguntan si el término de momento puede ser negativo?**  
   $\to$ **SÍ**: aunque el coeficiente $\beta \in [0, 1)$ es positivo, el **término de momento** $\beta \cdot \Delta w(t-1)$ es negativo cuando el peso decreció en el paso anterior ($\Delta w(t-1) < 0$).

---

## ✅ Checklist de 6 Puntos Antes de Entregar la Hoja

- [ ] **1. Fórmulas Generales Escritas:** ¿Pusiste la fórmula con letras antes de reemplazar con números en cada ejercicio? (La cátedra descuenta si ponés resultados directos).
- [ ] **2. Frases Justificativas:** ¿Acompañaste los pasos con frases breves? (*"La neurona 2 es BMU por tener menor distancia"*, *"El punto 4 no influye por tener"* $\alpha=0$).
- [ ] **3. Diagrama de Red Dibujado:** ¿Dibujaste la arquitectura con entradas, salidas y nombres de conexiones en SOM y MLP?
- [ ] **4. Redondeo Uniforme:** ¿Usaste 3 o 4 decimales prolijos en todos los términos $\delta$ y distancias?
- [ ] **5. Dendrograma a Escala:** ¿El gráfico del árbol de clustering tiene el eje vertical con los números exactos de fusión marcados?
- [ ] **6. Identificación y Ejercicios Claros:** ¿Cada ejercicio está rotulado con su número de problema ocupando su espacio correspondiente en tus hojas en blanco?
