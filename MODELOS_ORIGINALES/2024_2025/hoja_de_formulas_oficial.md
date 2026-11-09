# Hoja de Fórmulas Oficial (Transcripción Normalizada de Cátedra)

**Cátedra:** Inteligencia Artificial — UTN FRRe (5to Nivel ISI)

---

### Reglas de Asociación `[TEMA_P1_RENDIDO]`

$$Soporte = \frac{(X \cup Y).count}{n} \qquad Confianza = \frac{(X \cup Y).count}{X.count}$$

### Árboles de Decisión `[TEMA_P1_RENDIDO]`

$$Entrop\acute{\imath}a(D) = -\sum_{j=1}^{|C|} P(C_j) \cdot \log_2(P(C_j))$$

$$Entrop\acute{\imath}a_{A_i}(D) = \sum_{j=1}^{m} \frac{|D_j|}{|D|} \cdot Entrop\acute{\imath}a(D_j)$$

$$Ganancia(D, A_i) = Entrop\acute{\imath}a(D) - Entrop\acute{\imath}a_{A_i}(D)$$

$$TasaDeGanancia(D, A_i) = \frac{Ganancia(D, A_i)}{-\sum_{j=1}^{m} \left(\frac{|D_j|}{|D|} \cdot \log_2\left(\frac{|D_j|}{|D|}\right)\right)}$$

### Búsqueda `[TEMA_P1_RENDIDO]`

* **Algoritmo $A^*$:** $f'(X) = g(X) + h'(X)$

---

### Algoritmos Genéticos

* **Selección por ruleta:**
  $$Ranuras_i = \left(\frac{aptitud_i}{\sum_{i=1}^{N} aptitud_i}\right) \cdot 100$$
* **Selección con control de copias esperadas:**
  $$c_i = \frac{aptitud_i}{\overline{aptitud}}$$
* **Selección por ranking:**
  $$c_i = R_{\min} + 2 \cdot \frac{(n - i) \cdot (1 - R_{\min})}{n - 1}$$
* **Mutación adaptativa:**
  $$P_m(t+1) = P_m(t) \pm \lambda \qquad (P_{\min} \le P_m(t) \le P_{\max})$$

### Naïve Bayes

$$P(c_i \mid a_1, \dots, a_m) \propto P(c_i) \cdot \prod_{j=1}^{m} P(a_j \mid c_i)$$

$$\mu = \frac{1}{N} \sum_{i=1}^{N} x_i \qquad \sigma = \sqrt{\frac{\sum_{i=1}^{N} (x_i - \mu)^2}{N}} \qquad P(a_j \mid c_i) = \frac{1}{\sigma \sqrt{2\pi}} \cdot e^{-\frac{(a_j - \mu)^2}{2\sigma^2}}$$

### Perceptrón Simple

$$Net = \sum_{i=0}^{N} w_i \cdot x_i$$

$$w_i(t+1) = w_i(t) + \alpha \cdot [d(t) - y(t)] \cdot x_i$$

* **Método analítico (recta de separación en $\mathbb{R}^2$):** $w_1 \cdot x_1 + w_2 \cdot x_2 = \theta$

### MLP: Perceptrón Multicapa (Backpropagation)

$$Net_{pj} = \sum_{i} w_{ji} \cdot x_{pi}$$

* **Sigmoidal estándar:**
  $$y_{pj} = \frac{1}{1 + e^{-Net_{pj}}} \qquad f'_j(Net_{pj}) = y_{pj} \cdot (1 - y_{pj})$$
* **Tangente hiperbólica estándar:**
  $$y_{pj} = \frac{e^{Net} - e^{-Net}}{e^{Net} + e^{-Net}} \qquad f'_j(Net_{pj}) = 1 - y_{pj}^2$$
* **Sigmoidal parametrizada ($\beta$):**
  $$y_{pj} = \frac{1}{1 + e^{-2\beta Net_{pj}}} \qquad f'_j(Net_{pj}) = 2\beta \cdot y_{pj} \cdot (1 - y_{pj})$$
* **Tangente hiperbólica parametrizada ($\beta$):**
  $$y_{pj} = \frac{e^{\beta Net} - e^{-\beta Net}}{e^{\beta Net} + e^{-\beta Net}} \qquad f'_j(Net_{pj}) = \beta \cdot (1 - y_{pj}^2)$$
* **Gradiente en Capa de Salida:**
  $$\delta_{pk} = f'_k(Net_{pk}) \cdot (d_{pk} - y_{pk})$$
* **Gradiente en Capa Oculta:**
  $$\delta_{pj} = f'_j(Net_{pj}) \cdot \sum_{k} (\delta_{pk} \cdot w_{kj})$$
* **Actualización de Pesos (con Momento):**
  $$w_{kj}(t+1) = w_{kj}(t) + \alpha \cdot \delta_{pk} \cdot y_{pj} + \beta \cdot (w_{kj}(t) - w_{kj}(t-1))$$
* **Error por Patrón y Error Global:**
  $$E_p = \frac{1}{2} \sum_{k=1}^{M} (d_{pk} - y_{pk})^2 \qquad E_g = \frac{1}{L} \sum_{p=1}^{L} E_p$$

### SVM: Máquinas de Vectores de Soporte

$$\text{Maximizar } L_D = \sum_{i=1}^{N} \alpha_i - \frac{1}{2} \sum_{i,j=1}^{N} y_i \cdot y_j \cdot \alpha_i \cdot \alpha_j \cdot (\overline{x}_i^T \cdot \overline{x}_j)$$

$$\text{Sujeto a: } \sum_{i=1}^{N} y_i \cdot \alpha_i = 0 \quad \text{y} \quad \alpha_i \ge 0$$

$$\frac{\partial L_P}{\partial \overline{w}} = \overline{w} - \sum_{i=1}^{N} y_i \cdot \alpha_i \cdot \overline{x}_i = 0 \implies \overline{w} = \sum_{i=1}^{N} y_i \cdot \alpha_i \cdot \overline{x}_i$$

$$b = \frac{1}{y_i} - \overline{w}^T \overline{x}_i$$

* **Hiperplano de separación en $\mathbb{R}^2$:** $\text{Pendiente} = -\frac{w_1}{w_2}$, $\quad \text{Ordenada al origen} = -\frac{b}{w_2}$
* **Clasificar nuevas instancias:** $\overline{w}^T \overline{x}_i + b > 0 \implies c = +1 \quad \vert \quad < 0 \implies c = -1$
* **Margen geométrico:**
  $$Margen = d_+ + d_- = \frac{2}{\|\overline{w}\|} = \frac{2}{\sqrt{w_1^2 + w_2^2 + \dots + w_r^2}}$$

### Red de Hopfield

$$W = \sum_{k=1}^{M} (E_k^T \cdot E_k - I)$$

$$S(t+1) = \text{signo}(S(t) \cdot W) \qquad \text{siendo } S(t=0) = E_d$$

* **Capacidad de recuperación perfecta:** $\#\text{patrones} \le \frac{N}{4 \cdot \ln(N)} \qquad \text{Buena } (<1\% \text{ error}): \#\text{patrones} \le 0.138 \cdot N$
* **Condición de ortogonalidad:** $\sum_{i=1}^{N} e_i^{(k)} \cdot e_i^{(m)} \le 0 \quad \forall k \ne m$

### SOM: Self-Organizing Map (Kohonen)

$$d_j = \sqrt{\sum_{i=1}^{N} \left(w_{ji} - e_i^{(k)}\right)^2}$$

$$w_{ji}(t+1) = w_{ji}(t) + \alpha(t) \cdot h \cdot (e_i - w_{ji}) \qquad \left(\alpha(t) = \frac{1}{t}\right)$$

### K-Means

$$dist(\overline{x}_i, \overline{m}_j) = \sqrt{(x_{i1} - m_{j1})^2 + \dots + (x_{ir} - m_{jr})^2}$$

$$\overline{m}_j = \frac{1}{|C_j|} \sum_{\overline{x}_i \in C_j} \overline{x}_i$$

### KNN: K-Nearest Neighbors (Ponderado por Distancia)

$$f(x_q) \leftarrow \arg\max_{c \in C} \sum_{i=1}^{K} \frac{\delta(c, f(x_i))}{d(x_q, x_i)^2}$$
