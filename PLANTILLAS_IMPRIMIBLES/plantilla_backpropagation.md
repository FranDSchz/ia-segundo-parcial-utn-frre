# Plantilla de Examen Imprimible: Perceptrón Multicapa (MLP) y Backpropagation
**Universidad Tecnológica Nacional — Facultad Regional Resistencia (UTN FRRe)**  
**Cátedra:** Inteligencia Artificial | **Hoja de Trabajo de Cálculo Práctico (Formato A4)**  

**Datos del Estudiante:**  
* **Apellido y Nombre:** ____________________________________________________  
* **Legajo N°:** ____________________ | **Comisión:** _______ | **Fecha:** ____ / ____ / 2026  
* **Arquitectura de la Red Evaluada:** Entradas: _____ | Ocultas: _____ | Salidas: _____  
* **Parámetros de Aprendizaje:** Tasa $\alpha =$ ________ | Coeficiente de Momento $\beta =$ ________  

---

## Fórmulas Guía de Referencia en Examen
* **Potencial Post-sináptico:** $net_j = \sum_{i} w_{ji} o_i + b_j$
* **Activación Sigmoide:** $o_j = \frac{1}{1 + e^{-net_j}}$ | **Derivada:** $f'(net_j) = o_j \cdot (1 - o_j)$
* **Gradiente de Salida:** $\delta_k = (d_k - o_k) \cdot o_k \cdot (1 - o_k)$
* **Gradiente Oculto:** $\delta_j = o_j \cdot (1 - o_j) \cdot \sum_{k \in \text{salidas}} (\delta_k \cdot w_{kj})$
* **Regla Delta Generalizada con Momento:**
  $$\Delta w_{ji}(t) = \alpha \cdot \delta_j \cdot o_i + \beta \cdot \Delta w_{ji}(t-1)$$
  $$w_{ji}(t+1) = w_{ji}(t) + \Delta w_{ji}(t)$$

---

## 1. Hoja de Trabajo: Paso Forward (Propagación hacia Adelante)

| Capa | Neurona ($j$) | Entradas Conectadas ($o_i$) | Pesos Sinápticos ($w_{ji}$) | Sesgo / Umbral ($b_j$) | Cálculo de $net_j = \sum w o + b$ | Activación $o_j = \sigma(net_j)$ |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Oculta** | $h_1$ | | | | | |
| **Oculta** | $h_2$ | | | | | |
| **Oculta** | $h_3$ | | | | | |
| **Salida** | $y_1$ | | | | | |
| **Salida** | $y_2$ | | | | | |

---

## 2. Hoja de Trabajo: Paso Backward (Gradientes Locales $\delta$)

### A. Capa de Salida
| Neurona ($k$) | Valor Deseado ($d_k$) | Salida Red ($o_k$) | Error Local $(d_k - o_k)$ | Derivada $f'(net_k) = o_k(1-o_k)$ | Gradiente Local $\delta_k = (d_k - o_k) f'$ |
| :---: | :---: | :---: | :---: | :---: | :---: |
| $y_1$ | | | | | |
| $y_2$ | | | | | |
| $y_3$ | | | | | |

### B. Capa Oculta (Retropropagación)
| Neurona ($j$) | Activación ($o_j$) | Derivada $f'(net_j) = o_j(1-o_j)$ | Sumatoria Ponderada $\sum_{k} \delta_k \cdot w_{kj}$ | Gradiente Local Oculto $\delta_j = f'(net_j) \sum$ |
| :---: | :---: | :---: | :---: | :---: |
| $h_1$ | | | | |
| $h_2$ | | | | |
| $h_3$ | | | | |

---

## 3. Hoja de Trabajo: Actualización de Pesos Sinápticos y Sesgos

| Conexión ($j \leftarrow i$) | Peso Actual $w_{ji}(t)$ | Entrada $o_i$ | $\delta_j$ Destino | Ajuste Actual $\alpha \cdot \delta_j \cdot o_i$ | Inercia Previa $\beta \cdot \Delta w_{ji}(t-1)$ | Ajuste Total $\Delta w_{ji}(t)$ | Peso Nuevo $w_{ji}(t+1)$ |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| | | | | | | | |
| | | | | | | | |
| | | | | | | | |
| | | | | | | | |
| | | | | | | | |
| | | | | | | | |
| | | | | | | | |
| | | | | | | | |
| | | | | | | | |
| | | | | | | | |

---

## 4. Cuadrícula de Cálculos Auxiliares y Comprobación de Signos
*(Espacio libre reservado para cómputo de exponentes de la calculadora: $e^{-net}$, verificación de derivadas y productos intermedios)*

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                        │
│                                                                                        │
│                                                                                        │
│                                                                                        │
│                                                                                        │
│                                                                                        │
│                                                                                        │
│                                                                                        │
└────────────────────────────────────────────────────────────────────────────────────────┘
```
