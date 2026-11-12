# 2do Parcial Teórico Oficial — Cohorte 2025 (Grupo 2 Moodle UTN FRRe)

> Transcripción limpia y anonimizada de las preguntas recopiladas del **Grupo 2** del 2do Parcial Teórico (Moodle, cohorte 19/11/2025), integrada en el simulador como ítems \MC-2025-21\ a \MC-2025-28\.  
> Ver también el intento completo oficial del 19/11/2025 en [\parcial2_2025_11_19_teoria_moodle_oficial.pdf\](../MODELOS_ORIGINALES/1_PARCIALES_2DO_PARCIAL/parcial2_2025_11_19_teoria_moodle_oficial.pdf).

---

1. Mapas Auto-Organizados (SOM)

Pregunta: Los SOM son redes neuronales de:

a. $N$ neuronas de entrada y $N-1$ neuronas de salida.

b. $N$ neuronas de entrada y $N$ neuronas de salida.

c. $N$ neuronas de entrada y $M-1$ neuronas de salida.

d. $N$ neuronas de entrada y $M$ neuronas de salida. ✅

Justificación: Los mapas de Kohonen (SOM) mapean un espacio de entrada de $N$ dimensiones a un espacio de salida de $M$ dimensiones (generalmente una retícula bidimensional). La cantidad de neuronas de salida ($M$) es independiente de la dimensión de la entrada ($N$).

2. Perceptrón - Convergencia

Pregunta: En el modelo del Perceptrón, el proceso de aprendizaje finaliza cuando:

a. La variación de los pesos es mínima.

b. Al menos el 90% de los patrones dan salida igual a la salida deseada.

c. Se ha completado una época con error cero para todos los patrones. ✅

d. Se ha completado una época con error menor al error aceptable para todos los patrones.

Justificación: Teóricamente, el algoritmo del Perceptrón simple garantiza la convergencia (teorema de convergencia del perceptrón) solo si los datos son linealmente separables, deteniéndose cuando clasifica correctamente todos los patrones de entrenamiento (error cero).

3. Clasificador Naïve Bayes

Pregunta: El clasificador Naïve Bayes tiene como principio básico:

a. Suponer que las clases son condicionalmente independientes entre sí.

b. Suponer que los atributos son condicionalmente independientes entre sí. ✅

c. Suponer que las probabilidades a priori son iguales.

d. Suponer que cada clase responde a la misma distribución de probabilidades.

Justificación: El término "Naïve" (ingenuo) proviene de la asunción simplificadora de que la presencia de una característica (atributo) particular en una clase no está relacionada con la presencia de ninguna otra característica (independencia condicional).

4. Backpropagation - Actualización de Pesos

Pregunta: Utilizando el algoritmo Backpropagation, el incremento del peso $w_{ji}$ es ($i \to j$):

a. Alfa por el error cometido en la neurona $i$ por la salida de la neurona $i$.

b. Alfa por el error cometido en la neurona $j$ por la salida de la neurona $j$.

c. Alfa por el error cometido en la neurona $j$ por la salida de la neurona $i$. ✅

d. Alfa por el error cometido en la neurona $i$ por la salida de la neurona $j$.

Justificación: La regla delta generalizada establece que el cambio de peso es proporcional a la tasa de aprendizaje ($\alpha$), el gradiente local o error de la neurona destino ($\delta_j$) y la salida de la neurona origen ($y_i$).

5. Perceptrón vs. ADALINE

Pregunta: La diferencia entre el modelo del Perceptrón y del ADALINE es:

a. La función de transferencia (del Perceptrón es de escalón y del ADALINE es lineal). ✅

b. El procesamiento de las entradas (del Perceptrón es de escalón y del ADALINE es lineal).

c. El proceso de ajuste de los pesos.

d. El tipo de aprendizaje que utilizan (el del Perceptrón es supervisado y el del ADALINE es semi-supervisado).

Justificación: Aunque ambos son supervisados y estructuralmente similares, ADALINE (Adaptive Linear Element) utiliza una función de transferencia lineal (la suma ponderada neta) para calcular el error y ajustar pesos (regla Widrow-Hoff), mientras que el Perceptrón usa la salida cuantizada (escalón).

6. Regla de Aprendizaje SOM (Kohonen)

Pregunta: La expresión de actualización del peso $w_{ji}$ de un SOM es (siendo $e_i$ el componente $i$-ésimo de la entrada, $a(t)$ el factor de aprendizaje y $h_j$ la función de vecindad):

a. $w_{ji(t+1)} = w_{ji(t)} + a(t) \cdot h_j \cdot [e_i - w_{ji(t)}]$ ✅

b. $w_{ji(t+1)} = w_{ji(t)} + a(t) \cdot h_j \cdot [w_{ji(t)} - e_i]$

c. $w_{ji(t+1)} = w_{ji(t)} + a(t) \cdot h_j \cdot [e_i + w_{ji(t)}]$

Justificación: La regla de Kohonen busca acercar el vector de pesos $w$ al vector de entrada $e$. La dirección correcta del movimiento es la diferencia $(e - w)$.

7. Parada Temprana (Early Stopping) en MLP

Pregunta: El error de validación se utiliza para detener el proceso de aprendizaje del modelo MLP cuando:

a. Las iteraciones no son válidas.

b. Los pesos de las conexiones no son válidos.

c. Disminuye la capacidad de la red para clasificar patrones no utilizados para el entrenamiento. ✅

d. Aumenta el error de entrenamiento.

Justificación: Cuando el error de validación comienza a subir (mientras el de entrenamiento sigue bajando), indica overfitting (sobreajuste). Esto significa que la red está perdiendo su capacidad de generalización (su capacidad para clasificar correctamente patrones nuevos o no vistos).

8. Redes de Hopfield - Tipo

Pregunta: El modelo de Hopfield es una red neuronal:

a. Feedforward.

b. Autorrecurrente. ✅

c. Backforward.

Justificación: Las redes de Hopfield son redes recurrentes asociativas donde la salida de las neuronas se retroalimenta a las entradas de las otras neuronas en la red.

9. Redes de Hopfield - Conectividad

Pregunta: En el modelo de Hopfield, cada neurona de salida:

a. Está conectada a todas las demás neuronas de salida y posee conexiones autorrecurrentes.

b. Está conectada a todas las demás neuronas de salida y no posee conexiones autorrecurrentes. ✅

c. Está conectada a todas las neuronas de entrada.

Justificación: En la arquitectura estándar de Hopfield, la conectividad es total entre neuronas distintas, pero $w_{ii} = 0$ (una neurona no se conecta a sí misma; sin auto-bucles).

10. Algoritmo K-Means

Pregunta: ¿Qué representa la tupla $x_i = (x_1 \dots x_r)$ en el algoritmo K-means?

a. La cantidad de atributos presentes en los datos. ✅

b. La cantidad de elementos de data set.

c. La cantidad de grupos a conformar entre los datos.

Justificación: $x_i$ representa un patrón o vector de datos individual. La tupla $(x_1 \dots x_r)$ detalla las componentes de ese vector, por lo que $r$ corresponde al número de dimensiones o atributos que describen a cada dato.
