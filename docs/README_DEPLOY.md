# Guía de Activación de GitHub Pages — Simulador Parcial IA UTN FRRe

Este simulador está desarrollado con arquitectura **Zero Build** (HTML5, CSS3, Vanilla JS) y datos precargados en `docs/data/preguntas.js`, lo que permite que funcione tanto de forma local con doble clic (`file://`) como alojado en la nube con **GitHub Pages**.

---

## 🚀 Cómo Activar GitHub Pages en 2 Clics

Dado que el repositorio es público en GitHub (`frandschz/ia-segundo-parcial-utn-frre`):

1. **Entrar a la configuración del repositorio en GitHub:**
   - Navegá a: `https://github.com/frandschz/ia-segundo-parcial-utn-frre/settings/pages`
2. **Configurar la fuente de publicación (*Build and deployment*):**
   - **Source:** Seleccioná `Deploy from a branch`.
   - **Branch:** Seleccioná `main` y en la carpeta elegí `/docs`.
   - Hacé clic en el botón **Save**.

En 60 segundos, GitHub Pages compilará la entrega y la web quedará en vivo para vos y tus compañeros en:
👉 **`https://frandschz.github.io/ia-segundo-parcial-utn-frre/`**

---

## 💻 Uso Local Offline (Sin Conexión a Internet)

Para usarlo en tu computadora sin necesidad de levantar ningún servidor web ni instalar Node.js:
- Simplemente hacé **doble clic** en:
  `C:\dev\ia-segundo-parcial-utn-frre\docs\index.html`
- El simulador abre directamente en Chrome, Edge o Firefox (`file:///C:/dev/ia-segundo-parcial-utn-frre/docs/index.html`).
- Los datos cargan de inmediato sin errores de CORS porque `preguntas.js` se inyecta como script global.
- El almacenamiento de historial y preguntas falladas se guarda de forma persistente en el `localStorage` de tu navegador.

---

## 🎯 Características del Simulador

1. **Simulacro Oficial (40 min / 25 preguntas aleatorias):**
   - Emula el examen presencial de la Cátedra.
   - Puntuación fraccional Moodle con penalización por opciones erróneas:
     $$\text{puntaje} = \max\!\left(0,\; 100 \cdot \left(\frac{a}{C} - \frac{e}{I}\right)\right)$$
   - Umbrales automáticos de calificación:
     - **$\ge 80\%$:** Promocionado 🚀
     - **$60\% - 79\%$:** Aprobado / Regularizado 👍
     - **$< 60\%$:** No alcanzado ⚠️
2. **Modo Práctica Libre por Tema:**
   - Sin tiempo límite.
   - Validación inmediata pregunta por pregunta con justificación oficial de cátedra.
   - Filtro por los 8 temas de P2: Algoritmos Genéticos, SVM, Redes de Hopfield, SOM, Perceptrón Multicapa (MLP), K-Means, K-NN, Naïve Bayes, Clustering Jerárquico.
3. **Modo QA / Auditoría (`#qa`):**
   - Vista corrida con las 52 preguntas y sus claves visibles para lectura rápida y control grupal.
4. **Repaso de Falladas:**
   - Botón automático para reintentar únicamente las preguntas que tuviste mal o incompletas en simulacros previos.
5. **Dark & Light Mode:**
   - Conmutador accesible en la barra superior con persistencia local.
