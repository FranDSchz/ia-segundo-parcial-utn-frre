# Plantilla de Examen Imprimible: Clustering Jerárquico Aglomerativo
**Universidad Tecnológica Nacional — Facultad Regional Resistencia (UTN FRRe)**  
**Cátedra:** Inteligencia Artificial | **Hoja de Trabajo de Cálculo Práctico (Formato A4)**  

**Datos del Estudiante:**  
* **Apellido y Nombre:** ____________________________________________________  
* **Legajo N°:** ____________________ | **Comisión:** _______ | **Fecha:** ____ / ____ / 2026  
* **Criterio de Enlace Asignado:** [ ] Single Link (Mínimo) &nbsp;&nbsp;&nbsp; [ ] Complete Link (Máximo) &nbsp;&nbsp;&nbsp; [ ] Average Link (Promedio Ponderado)  

---

## Fórmulas Guía de Actualización de Distancias
* **Single Linkage:** $d(C_i \cup C_j, C_k) = \min \{ d(C_i, C_k), \ d(C_j, C_k) \}$
* **Complete Linkage:** $d(C_i \cup C_j, C_k) = \max \{ d(C_i, C_k), \ d(C_j, C_k) \}$
* **Average Linkage (Canónico Cátedra):**
  $$d(C_i \cup C_j, C_k) = \frac{|C_i| \cdot d(C_i, C_k) + |C_j| \cdot d(C_j, C_k)}{|C_i| + |C_j|} = \frac{1}{|C_i \cup C_j| \cdot |C_k|} \sum_{x \in C_i \cup C_j} \sum_{y \in C_k} d(x, y)$$

---

## 1. Matriz Inicial $D_0$ ($5 \times 5$) y Fusión 1

| | Elemento 1: ____ | Elemento 2: ____ | Elemento 3: ____ | Elemento 4: ____ | Elemento 5: ____ |
| :---: | :---: | :---: | :---: | :---: | :---: |
| **Elemento 1: ____** | $0.000$ | | | | |
| **Elemento 2: ____** | | $0.000$ | | | |
| **Elemento 3: ____** | | | $0.000$ | | |
| **Elemento 4: ____** | | | | $0.000$ | |
| **Elemento 5: ____** | | | | | $0.000$ |

* **Mínimo detectado en $D_0$:** $d(\text{____}, \text{____}) = $ _________
* **Cluster formado:** (__________), **Nivel de enlace:** $h_1 = $ _________, **Cardinal:** $|\cdot| = $ _____
* **Cálculo explícito de distancias hacia el nuevo cluster:**
  * $d((________), \text{____}) =$ ____________________________________________________________________
  * $d((________), \text{____}) =$ ____________________________________________________________________
  * $d((________), \text{____}) =$ ____________________________________________________________________

---

## 2. Matriz Reducida $D_1$ ($4 \times 4$) y Fusión 2

| | Cluster/El. A: ________ | Cluster/El. B: ________ | Cluster/El. C: ________ | Cluster/El. D: ________ |
| :---: | :---: | :---: | :---: | :---: |
| **Cluster/El. A: ________** | $0.000$ | | | |
| **Cluster/El. B: ________** | | $0.000$ | | |
| **Cluster/El. C: ________** | | | $0.000$ | |
| **Cluster/El. D: ________** | | | | $0.000$ |

* **Mínimo detectado en $D_1$:** $d(\text{________}, \text{________}) = $ _________
* **Cluster formado:** (__________________), **Nivel de enlace:** $h_2 = $ _________, **Cardinal:** $|\cdot| = $ _____
* **Cálculo explícito de distancias:**
  * $d((________________), \text{________}) =$ ___________________________________________________________
  * $d((________________), \text{________}) =$ ___________________________________________________________

---

## 3. Matriz Reducida $D_2$ ($3 \times 3$) y Fusión 3

| | Cluster I: ____________ | Cluster II: ____________ | Cluster III: ____________ |
| :---: | :---: | :---: | :---: |
| **Cluster I: ____________** | $0.000$ | | |
| **Cluster II: ____________** | | $0.000$ | |
| **Cluster III: ____________** | | | $0.000$ |

* **Mínimo detectado en $D_2$:** $d(\text{____________}, \text{____________}) = $ _________
* **Cluster formado:** (________________________), **Nivel de enlace:** $h_3 = $ _________, **Cardinal:** $|\cdot| = $ _____
* **Cálculo explícito de distancias:**
  * $d((________________________), \text{____________}) =$ __________________________________________________

---

## 4. Matriz Reducida $D_3$ ($2 \times 2$) y Fusión Raíz Final

| | Macro-Cluster 1: ____________________ | Macro-Cluster 2: ____________________ |
| :---: | :---: | :---: |
| **Macro-Cluster 1: ____________________** | $0.000$ | |
| **Macro-Cluster 2: ____________________** | | $0.000$ |

* **Fusión Final Raíz:** Nivel de enlace $h_4 = $ _________ | **Cardinal Total:** $|\Omega| = 5$

---

## 5. Trazado del Dendrograma con Escala Métrica
*(Dibuje las barras de enlace a la altura exacta de cada nivel $h_1, h_2, h_3, h_4$ calculados)*

```
 Nivel d
   ▲
10.0┼
    │
 8.0┼
    │
 6.0┼
    │
 4.0┼
    │
 2.0┼
    │
 0.0┴───────┬───────────────┬───────────────┬───────────────┬───────────────┬───────► Hojas
          _____           _____           _____           _____           _____
```
