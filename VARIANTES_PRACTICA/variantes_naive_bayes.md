# Dossier de Variantes Numéricas Resueltas: Clasificador Naïve Bayes
**Universidad Tecnológica Nacional — Facultad Regional Resistencia (UTN FRRe)**  
**Cátedra:** Inteligencia Artificial (UTN FRRe)  
**Material de Entrenamiento Gradual en 3 Niveles**  

---

## Índice del Dossier
1. **Nivel 1 (Básico / Atributos Categóricos):** Clasificación mediante Tablas de Frecuencia Directas.
2. **Nivel 2 (Parcial Real / Atributos Continuos con Densidad Gaussiana):** Estimación de $\mu$ y $\sigma$ por Clase y Evaluación de la Campana de Gauss (Final 2024–2025).
3. **Nivel 3 (Caso Borde / Histogramas Discretizados y Frecuencia Cero):** Construcción de Bins, Efecto Anulador de Probabilidad Cero y Corrección de Laplace.

---

## Nivel 1: Clasificación Naïve Bayes con Atributos Categóricos

### Enunciado
Dado un conjunto de entrenamiento de $N = 10$ préstamos bancarios clasificados en $C_1 = \text{Aprueba}$ ($6$ casos) y $C_2 = \text{Rechaza}$ ($4$ casos), se conocen las siguientes frecuencias para los atributos $A_1 = \text{Ingresos}$ y $A_2 = \text{Historial}$:
* En $C_1$ ($\text{Aprueba}$, $6$ casos): $\text{Ingresos}=\text{Altos}$ ocurre $4$ veces; $\text{Historial}=\text{Bueno}$ ocurre $5$ veces.
* En $C_2$ ($\text{Rechaza}$, $4$ casos): $\text{Ingresos}=\text{Altos}$ ocurre $1$ vez; $\text{Historial}=\text{Bueno}$ ocurre $1$ vez.

**Se solicita:** Clasificar la nueva solicitud $X = (\text{Ingresos}=\text{Altos},\; \text{Historial}=\text{Bueno})$.

---

### Solución Oficial Paso a Paso

#### 1. Probabilidades a Priori $P(C_k)$
$$P(C_1 = \text{Aprueba}) = \frac{6}{10} = \mathbf{0.600} \qquad P(C_2 = \text{Rechaza}) = \frac{4}{10} = \mathbf{0.400}$$

#### 2. Verosimilitudes Condicionales $P(A_j \mid C_k)$
* Para $C_1$ ($\text{Aprueba}$):
  $$P(\text{Altos} \mid C_1) = \frac{4}{6} \approx 0.667 \qquad P(\text{Bueno} \mid C_1) = \frac{5}{6} \approx 0.833$$
* Para $C_2$ ($\text{Rechaza}$):
  $$P(\text{Altos} \mid C_2) = \frac{1}{4} = 0.250 \qquad P(\text{Bueno} \mid C_2) = \frac{1}{4} = 0.250$$

#### 3. Producto Posterior No Normalizado $V(C_k) = P(C_k) \prod P(A_j \mid C_k)$
* **Clase $C_1$ ($\text{Aprueba}$):**
  $$V(C_1) = 0.600 \times \frac{4}{6} \times \frac{5}{6} = \frac{120}{360} \approx \mathbf{0.3333}$$
* **Clase $C_2$ ($\text{Rechaza}$):**
  $$V(C_2) = 0.400 \times 0.250 \times 0.250 = \mathbf{0.0250}$$

**Decisión:** Como $V(C_1) = 0.3333 > V(C_2) = 0.0250$, la instancia se clasifica como **$\text{Aprueba}$** (con probabilidad normalizada $\frac{0.3333}{0.3333 + 0.0250} = \mathbf{93.02\%}$).

---

## Nivel 2: Naïve Bayes con Distribuciones Continuas Gaussianas (Examen Final 2024–2025)

### Enunciado
Se desea clasificar una nueva instancia continua $X = (a_1 = 5.0,\; a_2 = 1.5)$ entre dos clases equiprobables $C_1$ ($P(C_1) = 0.5$) y $C_2$ ($P(C_2) = 0.5$). Del conjunto de entrenamiento se obtuvieron los siguientes parámetros gaussianos:
* **Clase $C_1$:** Atributo $a_1$: $\mu_{11} = 4.8,\; \sigma_{11} = 0.4$. Atributo $a_2$: $\mu_{12} = 1.4,\; \sigma_{12} = 0.2$.
* **Clase $C_2$:** Atributo $a_1$: $\mu_{21} = 6.0,\; \sigma_{21} = 0.5$. Atributo $a_2$: $\mu_{22} = 2.0,\; \sigma_{22} = 0.5$.

**Se solicita:** Evaluar las densidades normales según la Hoja de Fórmulas Oficial y determinar la clase ganadora.

---

### Solución Oficial Paso a Paso

#### 1. Fórmula Oficial de Densidad Gaussiana
$$P(a_j \mid c_i) = \frac{1}{\sigma \sqrt{2\pi}} \cdot e^{-\frac{(a_j - \mu)^2}{2\sigma^2}}$$

#### 2. Evaluación para la Clase $C_1$
* Para $a_1 = 5.0$ ($\mu = 4.8, \sigma = 0.4$):
  $$P(a_1 = 5.0 \mid C_1) = \frac{1}{0.4 \sqrt{2\pi}} \cdot e^{-\frac{(5.0 - 4.8)^2}{2(0.4)^2}} = 0.9974 \cdot e^{-\frac{0.04}{0.32}} = 0.9974 \cdot e^{-0.125} \approx \mathbf{0.8802}$$
* Para $a_2 = 1.5$ ($\mu = 1.4, \sigma = 0.2$):
  $$P(a_2 = 1.5 \mid C_1) = \frac{1}{0.2 \sqrt{2\pi}} \cdot e^{-\frac{(1.5 - 1.4)^2}{2(0.2)^2}} = 1.9947 \cdot e^{-\frac{0.01}{0.08}} = 1.9947 \cdot e^{-0.125} \approx \mathbf{1.7603}$$
* Puntaje posterior de $C_1$:
  $$V(C_1) = P(C_1) \cdot P(a_1 \mid C_1) \cdot P(a_2 \mid C_1) = 0.5 \times 0.8802 \times 1.7603 \approx \mathbf{0.7747}$$

#### 3. Evaluación para la Clase $C_2$
* Para $a_1 = 5.0$ ($\mu = 6.0, \sigma = 0.5$):
  $$P(a_1 = 5.0 \mid C_2) = \frac{1}{0.5 \sqrt{2\pi}} \cdot e^{-\frac{(5.0 - 6.0)^2}{2(0.5)^2}} = 0.7979 \cdot e^{-2.0} \approx \mathbf{0.1080}$$
* Para $a_2 = 1.5$ ($\mu = 2.0, \sigma = 0.5$):
  $$P(a_2 = 1.5 \mid C_2) = \frac{1}{0.5 \sqrt{2\pi}} \cdot e^{-\frac{(1.5 - 2.0)^2}{2(0.5)^2}} = 0.7979 \cdot e^{-0.5} \approx \mathbf{0.4840}$$
* Puntaje posterior de $C_2$:
  $$V(C_2) = P(C_2) \cdot P(a_1 \mid C_2) \cdot P(a_2 \mid C_2) = 0.5 \times 0.1080 \times 0.4840 \approx \mathbf{0.0261}$$

**Decisión:** Como $0.7747 > 0.0261$, la instancia se clasifica en la **Clase $C_1$**.

---

## Nivel 3: Caso Borde — Histogramas con Frecuencia Cero y Suavizado de Laplace

### Enunciado
En un problema con histogramas discretizados en $B = 3$ intervalos para cada atributo, la Clase $C_1$ ($N_1 = 20$ muestras) presenta las siguientes frecuencias para una consulta $X = (x_1, x_2, x_3)$:
* $f(x_1 \in \text{Bin}_2 \mid C_1) = 12$
* $f(x_2 \in \text{Bin}_1 \mid C_1) = 15$
* $f(x_3 \in \text{Bin}_3 \mid C_1) = 0$

**Se solicita:**
1. Mostrar qué ocurre con la probabilidad posterior sin suavizado.
2. Recalcular las verosimilitudes aplicando la **Corrección de Laplace** ($\text{Laplace}+1$ con $B = 3$ intervalos).

---

### Solución Oficial Paso a Paso

#### 1. Efecto Anulador sin Suavizado
$$P(X \mid C_1) = \frac{12}{20} \times \frac{15}{20} \times \frac{0}{20} = 0.60 \times 0.75 \times 0.00 = \mathbf{0.0000}$$
Aunque los atributos $x_1$ y $x_2$ tienen altísima afinidad con $C_1$, el único bin vacío en $x_3$ anula toda la productoria.

#### 2. Aplicación del Suavizado de Laplace ($+1$ en numerador, $+B$ en denominador)
$$P_{\text{Laplace}}(x_j \in \text{Bin}_m \mid C_k) = \frac{\text{frecuencia} + 1}{N_k + B}$$
Con $N_1 = 20$ y $B = 3$ ($N_1 + B = 23$):
* $P(x_1 \mid C_1) = \frac{12 + 1}{20 + 3} = \frac{13}{23} \approx 0.5652$
* $P(x_2 \mid C_1) = \frac{15 + 1}{20 + 3} = \frac{16}{23} \approx 0.6957$
* $P(x_3 \mid C_1) = \frac{0 + 1}{20 + 3} = \frac{1}{23} \approx 0.0435$

$$P_{\text{Laplace}}(X \mid C_1) = 0.5652 \times 0.6957 \times 0.0435 \approx \mathbf{0.0171 > 0}$$
De este modo se preserva la evidencia acumulada de los restantes atributos sin colapsar la decisión bayesiana.
