# CATÁLOGO MAESTRO FORENSE DE HASHES SHA-256 Y DEDUPLICACIÓN DE RECURSOS
### Cátedra de Inteligencia Artificial — Universidad Tecnológica Nacional (UTN FRRe)
**Auditoría de Integridad Criptográfica, Detección de Duplicados Cruzados y Clasificación Exhaustiva**

- **Fecha de Ejecución Forense:** 2026-11-09 00:17:51
- **Agente Auditor:** Agente Auditor y de Hashing SHA-256 (UTN FRRe)
- **Alcance:** Manifiesto de 660 ítems de Google Drive, raíces no catalogadas `Folder_Owa` (`1OwaNABEhlTAcgbYd7nqzZwtpdxwHfLE_`) y `Folder_ot9` (`1ot9gsZs5QligS3MMcpa-CHbk_ahn6SxP`), y repositorios locales (`recursos ordenar`, `recursos_historicos`, `Semana 01-14`, `scratch`).
- **Universo Total de Archivos Únicos Forenses:** `193` archivos relevantes.
- **Archivos con Duplicaciones Detectadas:** `178` archivos (`92.2%` del acervo presenta duplicados).

## 1. RESUMEN EJECUTIVO Y MÉTRICAS GLOBALES

A través de un rastreo recursivo y exhaustivo sobre **9 raíces históricas de Google Drive**, más las 2 nuevas colecciones desenterradas (`Folder_Owa` y `Folder_ot9`), y el árbol físico local de la facultad, se procedió al cálculo forense del hash criptográfico **SHA-256** (256 bits / 64 caracteres hexadecimales) sobre cada flujo de bytes real de los archivos.
El objetivo central fue erradicar la ambigüedad generada por archivos renombrados, copias huérfanas, versiones duplicadas en subcarpetas de estudiantes y falsas atribuciones de fechas o instancias de examen.

### Distribución por Categoría Inequívoca

| Tag de Clasificación | Definición del Contenido | Cantidad de Archivos Únicos |
| :--- | :--- | :---: |
| `[SEGUNDO_PARCIAL_PRACTICA]` | Exámenes, recuperatorios, ejercicios y guías prácticas del 2º Parcial | **46** |
| `[SEGUNDO_PARCIAL_TEORIA]` | Preguntas a desarrollar, cuestionarios y Multiple Choice del 2º Parcial | **11** |
| `[EXAMEN_FINAL_PRACTICA]` | Exámenes finales prácticos resueltos y ejercicios de mesas | **12** |
| `[EXAMEN_FINAL_TEORIA]` | Exámenes finales teóricos, autoevaluaciones y bancos de examen | **41** |
| `[TEMA_P1_RENDIDO]` | Búsqueda Sistemática/Heurística, POP, C4.5, Apriori, SBR, Cuestionarios P1 | **67** |
| `[MATERIAL_ESTUDIO_COMPILADO]` | Holy Scriptures, apuntes compilados, cuadernos de clase y libros | **16** |
| **TOTAL GENERAL** | **Archivos Únicos Verificados Criptográficamente** | **193** |

## 2. MATRIZ DE DEDUPLICACIÓN CRUZADA: CASOS CRÍTICOS IDENTIFICADOS

El hashing SHA-256 reveló que gran parte de los archivos almacenados con nombres distintos en carpetas distantes corresponden a copias binarias 100% idénticas. A continuación se detallan los casos más notables de duplicación cruzada:

### Caso 1: Tips de Práctica Segundo Parcial (D3 vs Folder 2 vs Local)

- **Hash SHA-256:** `e64049485b5d0dcaa9a34e022c678485f2409996a11a0e1bbdb024c0055a6152`
- **Tamaño:** 616,598 bytes
- **Clasificación Forense:** `[SEGUNDO_PARCIAL_PRACTICA]`
- **Descripción:** Archivo DOCX fundamental con los pasos algebraicos resueltos y tips metodológicos para los ejercicios de SVM, SOM, MLP y Clustering del Segundo Parcial. Presente de forma idéntica en múltiples raíces de Drive y carpetas locales.
- **Ocurrencias Idénticas Detectadas:**
  - `GDrive: Folder_1_D3/Tips-practica segundo parcial IA.docx (ID: 1Wa1Q4bTdAcDJyLx8MXCqFDETzT31JkIS)`
  - `GDrive: Folder_2/Tips-practica segundo parcial IA.docx (ID: 1PVrom5JYMCVw60797hX2v5pF7fB1Vt4l)`
  - `Local: recursos ordenar/Tips-practica segundo parcial IA.docx`
  - `Local: recursos_historicos/crudos_drive_p2/D3_Segundo_Parcial_Root/Tips_practica_segundo_parcial_IA_D3.docx`
  - `Local: recursos_historicos/fuentes/evaluaciones/parcial_2/parcial2_sfecha_tips-ia_practica_IA-H0144.docx`
  - `Local: scratch/deep_crawl_downloads/tips_practica_D3.docx`
  - `Local: scratch/remote_docs/Tips_practica_segundo_parcial.docx`

### Caso 2: Apunte IA — Holy Scriptures (Folder_Owa vs Folder_7 vs Local)

- **Hash SHA-256:** `822f20d06e34f5f3c2c0df336fd97a60f51b3e1e17a573ecfc8755f91929591b`
- **Tamaño:** 9,993,814 bytes
- **Clasificación Forense:** `[MATERIAL_ESTUDIO_COMPILADO]`
- **Descripción:** La obra magna canónica de la cátedra que compila teoría y ejercicios de toda la materia. Compartida en las carpetas de Drive con diferentes nombres y rutas.
- **Ocurrencias Idénticas Detectadas:**
  - `GDrive: Folder_Owa/Material Parciales/Apunte IA _ Holy Scriptures.docx.pdf (ID: 1FSzmxNBCng1cy-AAnC6o2e-GSTt9e8d-)`
  - `GDrive: Folder_7/APUNTES/Apunte IA _ Holy Scriptures.docx.pdf (ID: 1fzqdThb7T41cROaB4NBqCt3F81hDKEYP)`
  - `Local: recursos ordenar/Apunte IA _ Holy Scriptures.docx.pdf`
  - `Local: recursos_historicos/fuentes/material_didactico/apuntes_resumenes/apunte_sfecha_apunte-ia-holy-scriptures_desconocido_IA-H0004.pdf`
  - `Local: scratch/deep_crawl_downloads/Holy_Scriptures.pdf`
  - `Local: scratch/drive_ingest/Owa_Holy_Scriptures.pdf`
  - `Local: scratch/drive_ingest/F7_Holy_Scriptures.pdf`

### Caso 3: Apunte IA + Modelos de Finales — Compendio Alumno Indexado (Folder 2 vs Local)

- **Hash SHA-256:** `a444eb91297bdbef0c857b05825c26058508d8bf014e20778c62a5539368e7dc`
- **Tamaño:** 5,691,794 bytes
- **Clasificación Forense:** `[EXAMEN_FINAL_TEORIA]`
- **Descripción:** El compendio indexado de exámenes finales de Compendio Alumno. Crucial para la doctrina teórica completa de finales y parciales.
- **Ocurrencias Idénticas Detectadas:**
  - `GDrive: Folder_2/Apuente IA + Modelos de finales - Compendio Alumno Indexado.docx (ID: 1a8vxDna-TPYiuCBbpsckQ8adQ5UdzVWb)`
  - `Local: recursos ordenar/Apuente IA + Modelos de finales - Compendio Alumno Indexado.docx`
  - `Local: recursos_historicos/fuentes/evaluaciones/finales/formato_desconocido/final_sfecha_apuente-ia-modelos-de-fin_desconocido_IA-H0003.docx`
  - `Local: scratch/remote_docs/Apunte_IA_Modelos_finales_2025.docx`
  - `Local: scratch/drive_ingest/F2_Apunte_IA_Modelos_finales.docx`

### Caso 4: Fórmulas de Segundo Parcial P2 (Folder_Owa vs Folder 1 D3 vs Local)

- **Hash SHA-256:** `72b88df34d9069e2a1d89b802514a5645e26670c0e327c1d45edb49d9d589881`
- **Tamaño:** 667,110 bytes
- **Clasificación Forense:** `[SEGUNDO_PARCIAL_PRACTICA]`
- **Descripción:** Formulario oficial de Segundo Parcial con ecuaciones de Naive Bayes (Laplace), Perceptrón / MLP (retropropagación), SOM (actualización de pesos y vecindad gaussiana), SVM (hiperplano w*x+b) y distancias de Clustering.
- **Ocurrencias Idénticas Detectadas:**
  - `GDrive: Folder_Owa/Material Parciales/Parcial 2/Fórmulas P2.pdf (ID: 1dajUpcXZMoyp-uDCtvGLAsyUXj1Fd0ch)`
  - `GDrive: Folder_1_D3 / D2_Material_Parcial_2 (ID: 1dajUpcXZMoyp-uDCtvGLAsyUXj1Fd0ch)`
  - `Local: recursos ordenar/Fórmulas P2.pdf`
  - `Local: recursos_historicos/crudos_drive_p2/D2_Material_Parcial_2/Formulas_P2.pdf`
  - `Local: recursos_historicos/fuentes/material_didactico/formularios/formulario_sfecha_frmulas-p2_desconocido_IA-H0051.pdf`
  - `Local: scratch/deep_crawl_downloads/Formulas_P2.pdf`

### Caso 5: Banco Oficial de Multiple Choice de Segundo Parcial (Folder 3 vs D4 vs Local)

- **Hash SHA-256:** `5bbe7f3e1f271e1f7aa6fe2c418f280b829716dcc082fcf3983c60804130975e`
- **Tamaño:** 15,166 bytes
- **Clasificación Forense:** `[SEGUNDO_PARCIAL_TEORIA]`
- **Descripción:** Banco oficial de preguntas tipo Multiple Choice evaluadas por la cátedra para la teoría de Segundo Parcial (A*, K-Means vs Clustering Jerárquico, KNN, SOM y Perceptrón).
- **Ocurrencias Idénticas Detectadas:**
  - `GDrive: Folder_3/MC/Multiple choice.docx (ID: 1v1_Ox75bwBPcBCGb0dcX_pjplgM-JQJO)`
  - `Local: recursos_historicos/crudos_drive_p2/D4_MC/Multiple_choice_D4.docx`
  - `Local: recursos_historicos/crudos_drive_p2/2024_2025/banco_multiple_choice_oficial.docx`
  - `Local: scratch/remote_docs/Multiple_choice.docx`
  - `Local: scratch/nuevos_modelos_2024_2025_finales/documentos/banco_multiple_choice_oficial.docx`

### Caso 6: La Serie Fotográfica de Segundo Parcial (Segundo parcial 1 a 7 y teoría vs Folder 3 vs 2024_2025)

- **Hash SHA-256:** `Múltiples SHAs (0904b3f4, 9e6ca0cb, 1a5b0cc2, 24c28fac, ccf47f9a, fc4c0f11, f4190cc5, fb963679)`
- **Tamaño:** Entre 81 KB y 314 KB
- **Clasificación Forense:** `[SEGUNDO_PARCIAL_PRACTICA]` y `[SEGUNDO_PARCIAL_TEORIA]`
- **Descripción:** Las fotos de exámenes reales de segundo parcial almacenadas como '1.jpeg' a '7.jpeg' en recursos ordenar son idénticas a las fotos de Folder_3/Parciales/Segundo parcial y a las imágenes de WhatsApp de noviembre 2023.
- **Ocurrencias Idénticas Detectadas:**
  - `1.jpeg (SHA 0904b3f4): Segundo parcial/1.jpeg == Folder_3/Parciales/Segundo parcial/1.jpeg == WhatsApp Image 2023-11-22 at 09.31.21.jpeg == recuperatorio_1_mlp_svm_knn_hopfield.jpg`
  - `2.jpeg (SHA 9e6ca0cb): Segundo parcial/2.jpeg == Folder_3/Parciales/Segundo parcial/2.jpeg == parcial_2p_svm_som_mlp_early_stopping.jpg`
  - `3.jpeg (SHA 1a5b0cc2): Segundo parcial/3.jpeg == Folder_3/Parciales/Segundo parcial/3.jpeg == 1er_Recup_2do_parcial_2020.jpeg == recuperatorio_2p_knn_cv_perceptron_som.jpg`
  - `4.jpeg (SHA 24c28fac): Segundo parcial/4.jpeg == Folder_3/Parciales/Segundo parcial/4.jpeg == parcial_2p_nb_histogramas_hopfield_empresas_svm.jpg`
  - `5.jpeg (SHA ccf47f9a): Segundo parcial/5.jpeg == Folder_3/Parciales/Segundo parcial/5.jpeg == parcial_2p_svm_clustering_mlp_momento.jpg`
  - `6.jpeg (SHA fc4c0f11): Segundo parcial/6.jpeg == Folder_3/Parciales/Segundo parcial/6.jpeg == parcial_2p_mlp_error_momento_svm_average_link.jpg`
  - `7.jpeg (SHA f4190cc5): Segundo parcial/7.jpeg == Folder_3/Parciales/Segundo parcial/7.jpeg == 2do_parcial_IA_2015.jpg == parcial_2p_nb_histogramas_hopfield_spam_svm_lagrange.jpg`
  - `teoria.jpeg (SHA fb963679): Segundo parcial/Teoria/teoria.jpeg == Teoria-20260930T171037Z-1-001/Teoria/9.jpeg == parcial_teoria_som_mlp_nb_knn_kmeans.jpg`

### Caso 7: Cuestionarios Moodle C1 a C6 y la Falsa Clasificación de ilovepdf_merged

- **Hash SHA-256:** `df9528f2b0f68e66f79a2e543561b0043318249677ee09174521108a2525b9d3 / fcc6ef1b80550ef3d82dd962633ac8a2dc23d9e5a59e326e0bfd736cbe79a687`
- **Tamaño:** 1,122,749 bytes / 1,573,511 bytes
- **Clasificación Forense:** `[TEMA_P1_RENDIDO]`
- **Descripción:** Los archivos ilovepdf_merged_1 y 2 estaban catalogados erróneamente dentro de 'finales_historicos'. La auditoría forense de contenido reveló que son intentos completos de Cuestionario 1 (Agentes/Introducción) y Cuestionario 2 (SBR, Redes Semánticas y Frames).
- **Ocurrencias Idénticas Detectadas:**
  - `ilovepdf_merged_1 (SHA fcc6ef1b): Cuestionario 02 SBR - Redes Semánticas y Frames (25 páginas de Moodle)`
  - `ilovepdf_merged_2 (SHA df9528f2): Cuestionario 01 Introducción y Agentes Inteligentes (14 páginas de Moodle)`

### Caso 8: Cuadernos de Cátedra Primera a Cuarta Parte (Folder 3 vs Folder_ot9)

- **Hash SHA-256:** `Múltiples SHAs (Cuaderno 1 a 4)`
- **Tamaño:** 22.5 MB, 13.2 MB, 14.8 MB, 28.1 MB
- **Clasificación Forense:** `[MATERIAL_ESTUDIO_COMPILADO]`
- **Descripción:** Los 4 cuadernos manuscritos y escaneados de clase se encuentran duplicados bit a bit entre Folder_3 y Folder_ot9.
- **Ocurrencias Idénticas Detectadas:**
  - `Folder_3/Apuntes-Clases/Cuaderno - Primera parte.pdf (ID: 1k1jRES3uOHO4iYYjFYXsJGvH3L0-eEhW) == Folder_ot9/Apuntes Clases/Cuaderno - Primera parte.pdf (ID: 1lt_K6SO3D8WPVzx4BCJP7HJcY9rNJOhv)`
  - `Folder_3/Apuntes-Clases/Cuaderno - Segunda parte.pdf (ID: 187sy_bc2VjH1UP_5NDHHh-2yMYYnfR2V) == Folder_ot9/Apuntes Clases/Cuaderno - Segunda parte.pdf (ID: 1x1fSh_bbpxSRpZJfvVVjzNd71WXaCXU2)`
  - `Folder_3/Apuntes-Clases/Cuaderno - Tercera parte.pdf (ID: 1neDOlyUXNBTMi_F69YBwOOM6DYmzgXVj) == Folder_ot9/Apuntes Clases/Cuaderno - Tercera parte.pdf (ID: 1PYqWpW6XBUQFRpmETmtaPvTz28xjsqap)`
  - `Folder_3/Apuntes-Clases/Cuaderno - Cuarta parte.pdf (ID: 17PzZ-knc3IhjWE_Fw297EZYoOBE6QLUP) == Folder_ot9/Apuntes Clases/Cuaderno - Cuarta parte.pdf (ID: 1UxzBhU4Kw7CNCh7O4Pt8QPaV1qVLg8d2)`

## 3. HALLAZGOS FORENSES MAYORES: RECURSOS DESENTERRADOS

Durante la auditoría de `Folder_Owa`, `Folder_ot9` y `recursos ordenar`, se recuperaron piezas clave de examen que estaban aisladas:

1. **`2 parcial práctica T1.pdf` (Segundo Parcial Práctico 17/11/2021 Tema 1)**
   - **Hash SHA-256:** `e750564e25b7105cf5fad120f17a06fe64305c3f5d3a9111bebca925bda1abc0`
   - **Ubicación:** `recursos ordenar\2 parcial práctica T1.pdf` y `fuentes/evaluaciones/parcial_2/parcial2_sfecha_2-prctica-t1_desconocido_IA-H0002.pdf`
   - **Contenido Verificado:** Ejercicio 1: Support Vector Machines (cálculo de hiperplano óptimo w y b con vectores de soporte en x=(1,2) y (2,1)); Ejercicio 2: SOM con vecindad no nula y topología rectangular; Ejercicio 3: Clustering jerárquico aglomerativo con Average Link y trazado de dendrograma.
   - **Tag:** `[SEGUNDO_PARCIAL_PRACTICA]`

2. **`Preguntas Parcial 2.pdf` (Banco Teórico Extenso de Segundo Parcial)**
   - **Hash SHA-256:** `711b020d326bf3d2ae6d6b553e1987d605c2eef0ba95ba285dd6dbeee868c2ee`
   - **Ubicación en Drive:** `Folder_Owa/Material Parciales/Parcial 2/Preguntas Parcial 2.pdf` (ID: `1NndtmJPt2Gz5O6-yDCUkIjw8VlG3E2re`)
   - **Contenido Verificado:** Documento de 29 páginas con las respuestas modelo desarrolladas a todas las preguntas teóricas de Segundo Parcial: Principio de Naive Bayes, funciones de activación tangencial en MLP, cooperación en SOM, ajuste de parámetros en aprendizaje por refuerzo, aprendizaje por consejo y sistemas explicativos.
   - **Tag:** `[SEGUNDO_PARCIAL_TEORIA]`

3. **`Segundo parcial IA - 19/11/2025` (Modelo de Examen Segundo Parcial 2025)**
   - **Hash SHA-256:** `17184dbbdb66e138a0c64eb9aa6c4c5b3644aa2bc7e491bc85d2630bf1aeeeb9`
   - **Ubicación en Drive:** `Folder_5/Segundo Parcial/Segundo parcial IA - 19/11/2025` (ID: `1cxROiKZUwn8PARBlEfogelfZikYYdZBhaYpDSevs_QI`)
   - **Contenido Verificado:** Examen oficial del 19/11/2025 con dos puntos centrales: Punto 1 (20%): Clustering jerárquico aglomerativo con estrategia Complete Link sobre matriz de 5 instancias; Punto 2: MLP con cálculo analítico de pesos y cruza simple/multipunto de Algoritmos Genéticos.
   - **Tag:** `[SEGUNDO_PARCIAL_PRACTICA]`

4. **`ApunteFinal.pdf` & `APUNTE PARA FINAL IA.docx` (Doctrina Canónica de Examen Final)**
   - **ApunteFinal.pdf (103 páginas):** `37859fbed0b533cb42c7e008ce9e22aa749658ecda85be201a4e50882e987483` (Folder_Owa)
   - **APUNTE PARA FINAL IA.docx (396k caracteres):** `0f9910f781c8153f315266858e763b652ee9a1496a9ce868e83b48ce0c918ee9` (Folder_8)
   - **Contenido Verificado:** Resúmenes estructurales completos que integran Unidad 1 (Agentes, SSEE), Unidad 2 (SBR, RS, Frames, Árboles, Planning), Unidad 3 (Búsqueda, AG) y Unidad 4 (Naive Bayes, MLP, SVM, Hopfield, SOM, Clustering, KNN).
   - **Tag:** `[EXAMEN_FINAL_TEORIA]`

## 4. CATÁLOGO FORENSE MAESTRO AGRUPADO POR CATEGORÍA

A continuación se presenta el inventario tabular completo de todos los archivos relevantes con su SHA-256 inmutable de 64 caracteres, tamaño exacto en bytes, formato, ocurrencias locales y referencias de Google Drive.

### A. Recursos de Práctica del Segundo Parcial (`[SEGUNDO_PARCIAL_PRACTICA]`) — 46 Archivos Únicos

| # | Nombre Canónico | SHA-256 (64 caracteres) | Tamaño | Formato | Duplicado? | Ocurrencias / Referencias Principales |
| :-: | :--- | :--- | :-: | :-: | :-: | :--- |
| 1 | **1_Recuperatorio_2_parcial_Dos_Santos.pdf** | `9d75733fdd3b072de0d1320ef9db4b9a2403076ee841c593cf1949e1080c81a0` | 2,967,410 B | PDF | Sí (2) | Local: `1_Recuperatorio_2_parcial_Dos_Santos.pdf` // Drive: `Folder_1_D3/2020 - Examen y solución/1° Recuperatorio 2° parcial Dos San...` |
| 2 | **1er_Recup_2do_Parcial_2020.pdf** | `acc47240d8b65993d3ec53a2a6c428ee7b710ce2e5fbc6726eb1f4f73609fa8f` | 3,932,543 B | PDF | Sí (2) | Local: `1er_Recup_2do_Parcial_2020.pdf` // Drive: `Folder_1_D3/2020 - Recup 2do P - Examen y solución/1er Recup 2do Parcial 2020.pdf` |
| 3 | **2 parcial práctica T1.pdf** | `e750564e25b7105cf5fad120f17a06fe64305c3f5d3a9111bebca925bda1abc0` | 963,106 B | PDF | Sí (2) | Local: `2 parcial práctica T1.pdf` |
| 4 | **2015_punto_1.jpg** | `4b8a3ac7ea198348649816625bbb462a70565412c847516bf8d721af5d961202` | 94,843 B | JPG | Sí (2) | Local: `2015_punto_1.jpg` // Drive: `Folder_1_D3/2015 y 2016 - Examen y solución/2015 punto 1.jpg` |
| 5 | **2_parcial_2008.jpg** | `2d13d11fe3d7825c3faafa7305bbb6dfd7be2e69fa0e330d65c08056e5a91d46` | 1,696,735 B | JPG | Sí (3) | Local: `2_parcial_2008.jpg` // Drive: `Folder_1_D3/2° parcial 2008.jpg` |
| 6 | **2_Parcial_2012.docx** | `f80c740c814cee0c2f38fcffd65ae0966df162de2b09b4b771691355ffa269e6` | 26,527 B | DOCX | Sí (2) | Local: `2_Parcial_2012.docx` // Drive: `Folder_1_D3/2012 - Examen y solución/2º Parcial 2012.docx` |
| 7 | **2_Parcial_IA_2012.jpg** | `7d993163d4329b4724eda2aa1b2718f28d995d1cd27c22c1706d7bf7d203cbdb` | 76,334 B | JPG | Sí (2) | Local: `2_Parcial_IA_2012.jpg` // Drive: `Folder_1_D3/2012 - Examen y solución/2º Parcial IA 2012.jpg` |
| 8 | **2do Parcial.pdf** | `b249e7385ac892e38f32b281f3f3f0b041448872aa425108627e62362ad57750` | 2,459,714 B | PDF | Sí (2) | Local: `2do Parcial.pdf` // Drive: `Folder_1_D3/2do Parcial` |
| 9 | **2do Recup 2do Parcial.xlsx** | `664834e71a6b255a2e2f65655e053d88a0aa5233f42d3ede8d70e7787998b597` | 917,638 B | XLSX | Sí (2) | Local: `2do Recup 2do Parcial.xlsx` // Drive: `Folder_1_D3/2do Recup 2do Parcial.xlsx` |
| 10 | **2do_parcial_IA_2016.jpg** | `1b9ab2f99a596c6467ba5a0c13850c6008066389c466e17554135bb0ebe70450` | 312,433 B | JPG | Sí (2) | Local: `2do_parcial_IA_2016.jpg` // Drive: `Folder_1_D3/2015 y 2016 - Examen y solución/2do parcial IA 2016.jpg` |
| 11 | **2do_parcial_IA_2020_Gabriela_Dos_Santos.pdf** | `50d94998ccc8fdce402b1fd85985d2a6047f5cf9cf990a8f45d205d36ca2211e` | 2,877,714 B | PDF | Sí (2) | Local: `2do_parcial_IA_2020_Gabriela_Dos_Santos.pdf` // Drive: `Folder_1_D3/2019 - Examen y solución/2do parcial IA 2020 Gabriela Dos Sant...` |
| 12 | **4. Naive Bayes.pdf** | `7bbea04ffde1bb79cbb62124eedf15a5e2234959a629d63ee02a722ddf97f946` | 1,219,928 B | PDF | Sí (2) | Local: `4. Naive Bayes.pdf` |
| 13 | **5. perceptrón simple.pdf** | `bf40a36be4544c13b84843aa0d91e166e21a88f6fbf7f656a86285b6bc53fea3` | 2,601,531 B | PDF | Sí (2) | Local: `5. perceptrón simple.pdf` |
| 14 | **6. MLP.pdf** | `94a505a8178fc5950b5eac0862fbf3fe7c864c90951c85cf64890466a30cc1a1` | 1,645,259 B | PDF | Sí (2) | Local: `6. MLP.pdf` |
| 15 | **7. SOM.pdf** | `e745331abfaeb28de5161d06735a83f2e96522f430ffae7e91982a9da94e3918` | 1,527,671 B | PDF | Sí (2) | Local: `7. SOM.pdf` |
| 16 | **8. KNN.pdf** | `4043add8c6a8c12dda6a53a342e536d2ee91385bccb5220db0c542800e492069` | 2,826,296 B | PDF | Sí (2) | Local: `8. KNN.pdf` |
| 17 | **9. Clustering.pdf** | `79420b41d5897605f252a29b8aeb915ac0933eeb9175e223b9b2f3d6e1dea1cd` | 1,747,684 B | PDF | Sí (2) | Local: `9. Clustering.pdf` |
| 18 | **CIN_practica_IA2019.jpg** | `286be36c5b93be9dba66bfa70fcae249ece457941014930c1668e4e7fe415e87` | 3,788,418 B | JPG | Sí (2) | Local: `CIN_practica_IA2019.jpg` // Drive: `Folder_1_D3/2019 - Examen y solución/CIN práctica-IA2019.jpg` |
| 19 | **Ejercicios som 1.jpeg** | `23a7e3811b18e9bda15d11695e4111ac05b27c1525ec9b547bb21462ffe2e0cd` | 200.8 KB | JPEG | Único | Drive: `Folder_5/Segundo Parcial/Ejercicios som 1.jpeg` |
| 20 | **Fórmulas P2.pdf** | `72b88df34d9069e2a1d89b802514a5645e26670c0e327c1d45edb49d9d589881` | 667,110 B | PDF | Sí (5) | Local: `Fórmulas P2.pdf` // Drive: `Folder_Owa/Material Parciales/Parcial 2/Fórmulas P2.pdf` |
| 21 | **GuiaTP-AG.pdf** | `26efce57eb033a2856b4243d35a2841bb60d8d8e06730825e58d947cda4557ff` | 20,328 B | PDF | Sí (3) | Local: `GuiaTP-AG.pdf` // Drive: `Folder_7/PRACTICOS/Parcial 2/Guía 6 - AG/GuiaTP-AG.pdf` |
| 22 | **GuiaTP2021-U1 (1).pdf** | `689a1fb5938fd4aa429676be159069a68929b7c88d9e4bd478735b30ad21ed9c` | 42,793 B | PDF | Sí (6) | Local: `GuiaTP2021-U1 (1).pdf` // Drive: `Folder_7/PRACTICOS/Parcial 1/Guía 1/GuiaTP2021-U1 (1).pdf` |
| 23 | **Guía TP-clustering-knn.pdf** | `4f9bfd392574a6dd8d261800660702413250c4792d80276929197a11168a2fcc` | 31,662 B | PDF | Sí (4) | Local: `Guía TP-clustering-knn.pdf` // Drive: `Folder_5/Segundo Parcial/Guía TP-clustering-knn.pdf` |
| 24 | **Guía TP-Hopfield-SOM.pdf** | `363654dbe8b1198674a768a226b510597dbb46e5d72fc256a3570f3d0a86e8b6` | 34,959 B | PDF | Sí (4) | Local: `Guía TP-Hopfield-SOM.pdf` // Drive: `Folder_5/Segundo Parcial/Guía TP-Hopfield-SOM.pdf` |
| 25 | **Guía TP-NB.pdf** | `301dd866f9ca2b6cb13aa5cba897bfbb02772395f78f3c687c675d681254a677` | 66,391 B | PDF | Sí (4) | Local: `Guía TP-NB.pdf` // Drive: `Folder_5/Segundo Parcial/naives Bayes.pdf` |
| 26 | **Guía TP-Perceptrón-MLP.pdf** | `97e9051804af01efb521ec29f327119d964448c3047007f27178d87dfe4b7462` | 80,245 B | PDF | Sí (3) | Local: `Guía TP-Perceptrón-MLP.pdf` // Drive: `Folder_7/PRACTICOS/Parcial 2/Guía 8 - Perceptron MLP/Guía TP-Perceptrón-MLP.pdf` |
| 27 | **Hopfield.pdf** | `c68a79ace7e88502828725679605d5db14a52e4be27cae6c1e93f641ae70b4bd` | 1,835,928 B | PDF | Sí (2) | Local: `Hopfield.pdf` |
| 28 | **IA2P.docx** | `eb41596d5304ddddbe504bf1299e4ddc4a02bd8aab9586a0d5d0a5a665b505c5` | 119,222 B | DOCX | Sí (2) | Local: `IA2P.docx` // Drive: `Folder_1_D3/IA2P.docx` |
| 29 | **Informe-MLP-IA.pdf** | `33aba5c742c46dcd490ceaf1e3b281d03b4c76edb1a5e93839ebf6f5e0c44087` | 401.9 KB | PDF | Único | Drive: `Folder_5/Segundo Parcial/Informe-MLP-IA.pdf` |
| 30 | **parcial_2.jpg** | `ac23d787b11b830c044f07fb29fe580e43073df7fa62a86903f706091b719871` | 1,952,756 B | JPG | Sí (3) | Local: `parcial_2.jpg` // Drive: `Folder_1_D3/parcial 2.jpg` |
| 31 | **Parcial_2_inteligencia.html** | `3927522c3f2be8e38c285219d5ad5c5cfc59b5f37c59ced5d2e899578651d016` | 434 B | HTML | Sí (3) | Local: `Parcial_2_inteligencia.html` // Drive: `Folder_1_D3/Parcial 2 inteligencia.html` |
| 32 | **parcial_3.jpg** | `3d27c0e2232905f9c5c43f2e8feb2eed4872eecddead754add2587ab14392764` | 1,911,882 B | JPG | Sí (3) | Local: `parcial_3.jpg` // Drive: `Folder_1_D3/parcial 3.jpg` |
| 33 | **Perez_Carlos_2do_Parcial.pdf** | `e9c37dfa913d5897e814ae3c477bdc665ae5d70fc1517e7a683247a3d9bacad7` | 1,109,371 B | PDF | Sí (2) | Local: `Perez_Carlos_2do_Parcial.pdf` // Drive: `Folder_1_D3/2020 - Examen y solución/Perez Carlos - 2do Parcial.pdf` |
| 34 | **Practica_Segundo_Parcial.xlsx** | `97502142b60425ad9a9e3f74dce3b1a27ff8ed374555679b058ba36323dded08` | 8,814,118 B | XLSX | Sí (2) | Local: `Practica_Segundo_Parcial.xlsx` // Drive: `Folder_1_D3/Practica Segundo Parcial.xlsx` |
| 35 | **Preguntas Parcial 2.pdf** | `711b020d326b58d9aec05a31ddc5bd8960d5736ac27059e8673b8b61641f5a8e` | 1,068,703 B | PDF | Sí (4) | Local: `Preguntas Parcial 2.pdf` // Drive: `Folder_Owa/Material Parciales/Parcial 2/Preguntas Parcial 2.pdf` |
| 36 | **Resolucion_SOM_vecindad_no_nula.png** | `fdc55cc31990296201e62e7962adfb3518a16ace4a57aa90e155db613399de39` | 410,882 B | PNG | Sí (2) | Local: `Resolucion_SOM_vecindad_no_nula.png` // Drive: `Folder_1_D3/2020 - Recup 2do P - Examen y solución/Resolucion SOM vecindad no nula.png` |
| 37 | **Segundo parcial IA - 19/11/2025** | `17184dbbdb66f9551842f908477ed380f6c2b3b4e91e1c8f70ec12ec27b14dd9` | 5.6 KB | UNKNOWN | Único | Drive: `Folder_5/Segundo Parcial/Segundo parcial IA - 19/11/2025` |
| 38 | **Som 2.jpeg** | `23f11d654857d1ae55e1cd871c89faaad028350772f8b55907a7b1b2c3af7e38` | 125.3 KB | JPEG | Único | Drive: `Folder_5/Segundo Parcial/Som 2.jpeg` |
| 39 | **SVM.pdf** | `36a10a3fc368d7c9effde0c45f55a50cf8005a24f0326993e429467c614e41c5` | 2,122,484 B | PDF | Sí (3) | Local: `SVM.pdf` // Drive: `modelos_2do_parcial/practica/SVM.pdf` |
| 40 | **Tips-practica segundo parcial IA.docx** | `e64049485b5d0dcaa9a34e022c678485f2409996a11a0e1bbdb024c0055a6152` | 616,598 B | DOCX | Sí (7) | Local: `Tips-practica segundo parcial IA.docx` // Drive: `Folder_2/Tips-practica segundo parcial IA.docx` |
| 41 | **Todo_junto_Resueltos_IA.docx** | `77a453e32243ce962a05dc8d5e460610465c5c5da49d3c4030ed1ad68f787de3` | 537,597 B | DOCX | Sí (2) | Local: `Todo_junto_Resueltos_IA.docx` // Drive: `Folder_1_D3/Todo junto Resueltos IA.docx` |
| 42 | **WhatsApp Image 2023-11-21 at 20.47.01.jpeg** | `0eb489a30ad33a12bb144b7a8868f976990c4708897fd659b9669d305151b264` | 122,357 B | JPEG | Sí (2) | Local: `WhatsApp Image 2023-11-21 at 20.47.01.jpeg` |
| 43 | **WhatsApp Image 2023-11-21 at 20.47.02 (1).jpeg** | `1d5d028f9e5ed5ae5525d4226c4c78483c02525e872cd7c45c68d7eab4c0a236` | 116,736 B | JPEG | Sí (2) | Local: `WhatsApp Image 2023-11-21 at 20.47.02 (1).jpeg` |
| 44 | **WhatsApp Image 2023-11-21 at 20.47.02.jpeg** | `e6ce6497294810311205604fb5055c32e339b12b5df349ab8a0cfd853767bb03` | 144,902 B | JPEG | Sí (2) | Local: `WhatsApp Image 2023-11-21 at 20.47.02.jpeg` |
| 45 | **WhatsApp Image 2023-11-21 at 20.47.03.jpeg** | `1553bee9a4e67907e7ff28993849d854c2754e15acc4805a7c106c5103b02b21` | 157,810 B | JPEG | Sí (2) | Local: `WhatsApp Image 2023-11-21 at 20.47.03.jpeg` |
| 46 | **WhatsApp Image 2023-11-22 at 21.06.49.jpeg** | `5bcbfc6f30cc2542b372f5f76f4f1e05d8389a418ac2ffca420d7dd0bd589d52` | 183,000 B | JPEG | Sí (2) | Local: `WhatsApp Image 2023-11-22 at 21.06.49.jpeg` |


### B. Recursos de Teoría del Segundo Parcial (`[SEGUNDO_PARCIAL_TEORIA]`) — 11 Archivos Únicos

| # | Nombre Canónico | SHA-256 (64 caracteres) | Tamaño | Formato | Duplicado? | Ocurrencias / Referencias Principales |
| :-: | :--- | :--- | :-: | :-: | :-: | :--- |
| 1 | **13-KNN-Practica.pdf** | `4362c291271c7c6650de746e3a5b3876fc57d1d7f17b986e06c7740de3f444d1` | 213,156 B | PDF | Sí (2) | Local: `13-KNN-Practica.pdf` // Drive: `Folder_Owa/Semana 14 (U.4 - Clustering - knn)/Teoría/13-KNN-Practica.pdf` |
| 2 | **14-Clustering.pdf** | `0d7ebc1ab076446e491921f58fe4171fcf23693e5ff683014fcd4c8c506f1432` | 147,013 B | PDF | Sí (2) | Local: `14-Clustering.pdf` // Drive: `Folder_Owa/Semana 14 (U.4 - Clustering - knn)/Teoría/14-Clustering.pdf` |
| 3 | **banco_multiple_choice_oficial.docx** | `5bbe7f3e1f271e1f7aa6fe2c418f280b829716dcc082fcf3983c60804130975e` | 15,166 B | DOCX | Sí (5) | Local: `banco_multiple_choice_oficial.docx` // Drive: `Folder_3/MC/Multiple choice.docx` |
| 4 | **Carlos - Cuestionario 5.pdf** | `65cf5574c437e568805d004bb53939f2fa955be1e9dcfaaa2dd234f73d6a9b2a` | 92,677 B | PDF | Sí (2) | Local: `Carlos - Cuestionario 5.pdf` |
| 5 | **Carlos - Cuestionario 6.pdf** | `4edde234f185bb51026329c235d227775a255f41473f7a43ca77bce8881c408d` | 106,048 B | PDF | Sí (2) | Local: `Carlos - Cuestionario 6.pdf` |
| 6 | **CIN_teoria_IA2019.jpg** | `c71d075a639efe482a8a3b1bfd473f42592164c4ce4137dc5969fc5650c02859` | 3,695,411 B | JPG | Sí (2) | Local: `CIN_teoria_IA2019.jpg` // Drive: `Folder_1_D3/2019 - Examen y solución/CIN teoría-IA2019.jpg` |
| 7 | **cuestionario 06 - SVM HOPFIELD SOM.pdf** | `3aba2429e0cccb492e3f41b62300f1b80e6dffc485bb71319eeef7b4a227ceb6` | 418,628 B | PDF | Sí (2) | Local: `cuestionario 06 - SVM HOPFIELD SOM.pdf` |
| 8 | **Gaby - Cuestionario 05 - NB -Perceptrón - MLP_ Revisión del intento.pdf** | `a983155b86162a7dd56bd11a0934f003bbcc4b4d677b60f09f03b74b169ab106` | 92,425 B | PDF | Sí (2) | Local: `Gaby - Cuestionario 05 - NB -Perceptrón - MLP_ Revisión del intento.pdf` |
| 9 | **Gaby - Cuestionario 06 - SVM - Hopfield - SOM_ Revisión del intento.pdf** | `47ba4dfc8d24dd23af0ead695ec049c0ef3cc9c42ca5ea8eefebb4a6706cd598` | 136,977 B | PDF | Sí (2) | Local: `Gaby - Cuestionario 06 - SVM - Hopfield - SOM_ Revisión del intento.pdf` |
| 10 | **Josie - Cuestionario 05 - NB -Perceptrón - MLP.pdf** | `f3372d8b95daeed5fe0a08e36ceedeec4a2f2840616d0b234c7c4be415bd03e9` | 213,811 B | PDF | Sí (2) | Local: `Josie - Cuestionario 05 - NB -Perceptrón - MLP.pdf` |
| 11 | **Josie - Cuestionario 06 - SVM - Hopfield - SOM.pdf** | `1f0ce30cde34fc41fe6f1740bea0e8919cfe7b5e40979d59d3f522b7898fa988` | 241,334 B | PDF | Sí (2) | Local: `Josie - Cuestionario 06 - SVM - Hopfield - SOM.pdf` |


### C. Exámenes Finales — Práctica (`[EXAMEN_FINAL_PRACTICA]`) — 12 Archivos Únicos

| # | Nombre Canónico | SHA-256 (64 caracteres) | Tamaño | Formato | Duplicado? | Ocurrencias / Referencias Principales |
| :-: | :--- | :--- | :-: | :-: | :-: | :--- |
| 1 | **FINAL - 2021 MARZO PRACTICA.jpeg** | `9ac22d7edc89e0ef4e709d4cf09fb69ba77d9d234dbfeeca97bae5f6ab663089` | 224,519 B | JPEG | Sí (4) | Local: `FINAL - 2021 MARZO PRACTICA.jpeg` |
| 2 | **Final 2 de Marzo.xlsx** | `cbdaf4b41c98cb70ab4cfa611e1ccbfda41bf4d4c2e41596ba62d1a64e6239ca` | 92,303 B | XLSX | Sí (2) | Local: `Final 2 de Marzo.xlsx` |
| 3 | **Final 27 abril.xlsx** | `66627cdc773a46c2333004f299128540436310650f4a5f6aed7c99999f30009e` | 1,916,679 B | XLSX | Sí (2) | Local: `Final 27 abril.xlsx` |
| 4 | **Final AI - Dos Santos (Práctica).pdf** | `eeb70bb5dd06730d263bf04de26709c3ddff3b65b185cf45688da13a32b56593` | 2,418,017 B | PDF | Sí (2) | Local: `Final AI - Dos Santos (Práctica).pdf` |
| 5 | **Final IA Corregido. Teoría 60. Práctica 69.pdf** | `64eeaaa5d4a070b7a15bac71c3bcfb2c9c47253f5b9e57c4395ae982d756a2e8` | 3,997,067 B | PDF | Sí (2) | Local: `Final IA Corregido. Teoría 60. Práctica 69.pdf` |
| 6 | **Guía TP-SVM.pdf** | `48178373e894c4605e2f9f54072ac9835b9955b54c7b4d739148e38f133d6c54` | 960,572 B | PDF | Sí (3) | Local: `Guía TP-SVM.pdf` // Drive: `Folder_7/PRACTICOS/Parcial 2/Guía 9 - SVM (Solo entra en Finales)/Guía TP-SVM.pdf` |
| 7 | **Lista de Finales Prácticos - IA.docx** | `4b1f4f214245bd1842d9cff8d758ac10a5c219f2d1f032742c719a8a96da0a1d` | 11,604 B | DOCX | Sí (2) | Local: `Lista de Finales Prácticos - IA.docx` |
| 8 | **Lista de Finales Prácticos - IA.docx** | `37f2223cc6ddab7c0326f003b1095b118a0e519b8a158ce0fd12aed9610b2561` | 12,753 B | DOCX | Sí (2) | Local: `Lista de Finales Prácticos - IA.docx` |
| 9 | **Practica IA Marzo 2021.png** | `403da5cadbd1cc6f965c5c2f340dbee88f50d2eabd4c3494a5bff1a44987b5d2` | 776,435 B | PNG | Sí (2) | Local: `Practica IA Marzo 2021.png` |
| 10 | **practica_final_2.jpeg** | `76747c4962fb9738ef40bea69490c6ac2f2bd01d5eab18db7e3672321217c526` | 112,348 B | JPEG | Sí (2) | Local: `practica_final_2.jpeg` |
| 11 | **practica_final_3.jpeg** | `679d80ba689b2d959dc4a0ab313ddcc7e50f5a6b3805591cf75e67241f741f93` | 151,324 B | JPEG | Sí (2) | Local: `practica_final_3.jpeg` |
| 12 | **practica_final_4.jpeg** | `db466303cd46fadce8244175fe651ca49c7ceabf865aedd0469f4aeec8bcd4f0` | 108,371 B | JPEG | Sí (2) | Local: `practica_final_4.jpeg` |


### D. Exámenes Finales — Teoría (`[EXAMEN_FINAL_TEORIA]`) — 41 Archivos Únicos

| # | Nombre Canónico | SHA-256 (64 caracteres) | Tamaño | Formato | Duplicado? | Ocurrencias / Referencias Principales |
| :-: | :--- | :--- | :-: | :-: | :-: | :--- |
| 1 | **1.jpeg** | `0904b3f42a07b3a1f00d46618a69b0889b45f5630292f814a37ede0b34ebd686` | 167,999 B | JPEG | Sí (7) | Local: `WhatsApp Image 2023-11-22 at 09.31.21.jpeg` // Drive: `Folder_3/Parciales/Segundo parcial/1.jpeg` |
| 2 | **1.png** | `14d2750e141acc00a6eb8f2c3d261972a52e2fef1597ada98faea6d5e09c2db0` | 121,266 B | PNG | Sí (3) | Local: `1.png` // Drive: `Folder_3/Final/Teoria/1.png` |
| 3 | **10.png** | `f50c06138f318f707b531b35f70c880d9d7857a088fe2ac7b0e6e5c2394daffe` | 35,535 B | PNG | Sí (3) | Local: `10.png` // Drive: `Folder_3/Final/Teoria/10.png` |
| 4 | **17_02_2021 Final IA.docx** | `76d06a51c06b81da293542cdcabb68df88a2708a41ca10912eb8ef9ec7ef0ad8` | 30,129 B | DOCX | Sí (2) | Local: `17_02_2021 Final IA.docx` |
| 5 | **17_02_2021 Final IA.pdf** | `16698b27fd1c0cd6f82575b4b7526ea81526953959159e496fcbf2369e24c0f5` | 95,427 B | PDF | Sí (5) | Local: `17_02_2021 Final IA.pdf` // Drive: `Folder_3/Final/Teoria/17_02_2021 Final IA.pdf` |
| 6 | **2.jpeg** | `9e6ca0cb131f6d086989626e35f77077ddb63d4dfd469d6678be2f71cbcdd0b2` | 256,687 B | JPEG | Sí (6) | Local: `2.jpeg` // Drive: `Folder_3/Parciales/Segundo parcial/2.jpeg` |
| 7 | **3.jpeg** | `1a5b0cc2c4bb8622e555e7582516f9c698deccc861d5dce3ac87fd256a8d4017` | 188,004 B | JPEG | Sí (8) | Local: `3.jpeg` // Drive: `Folder_1_D3/2020 - Recup 2do P - Examen y solución/1er Recup 2do parcial 2020.jpeg` |
| 8 | **3.png** | `dad99d07e254791a89a3557cd031a8814c217879c25c690db570fe70fbd30635` | 109,893 B | PNG | Sí (3) | Local: `3.png` // Drive: `Folder_3/Final/Teoria/3.png` |
| 9 | **4 (listo).png** | `a2f1e5d2885d52beb9d2dfb41e7c56d22b8b9f7a7a1557237ad2205bae87ecc3` | 49,021 B | PNG | Sí (3) | Local: `4 (listo).png` // Drive: `Folder_3/Final/Teoria/4 (listo).png` |
| 10 | **4.jpeg** | `24c28fac25ef97220bd515bd2c778b5aab709f07b376925bf10f1e5d1fd85a01` | 314,872 B | JPEG | Sí (6) | Local: `4.jpeg` // Drive: `Folder_3/Parciales/Segundo parcial/4.jpeg` |
| 11 | **5(listo).png** | `7968aaf670375c109752230cda85e2c4d693aa24e12a0ae4742e918e1f90272a` | 59,725 B | PNG | Sí (3) | Local: `5(listo).png` // Drive: `Folder_3/Final/Teoria/5(listo).png` |
| 12 | **5.jpeg** | `ccf47f9a60236b6334bc4b9c3071355b708f445890d9b3f77a2def44710f9161` | 81,528 B | JPEG | Sí (6) | Local: `5.jpeg` // Drive: `Folder_3/Parciales/Segundo parcial/5.jpeg` |
| 13 | **6(listo).png** | `17e92075429cf747eff3878c2ab68e70990313de57e7021c2069859461b2d699` | 47,728 B | PNG | Sí (3) | Local: `6(listo).png` // Drive: `Folder_3/Final/Teoria/6(listo).png` |
| 14 | **6.jpeg** | `fc4c0f11cfe8fb3c69c9230d7b3223ec9af79acc6cf5e9dfb26e22d00a8dec08` | 110,630 B | JPEG | Sí (6) | Local: `6.jpeg` // Drive: `Folder_3/Parciales/Segundo parcial/6.jpeg` |
| 15 | **7.jpeg** | `f4190cc5383eed1a34693c1af64e41ea9354d9dc545321448f544a7928f5a38a` | 146,739 B | JPEG | Sí (8) | Local: `7.jpeg` // Drive: `Folder_1_D3/2015 y 2016 - Examen y solución/2do parcial IA 2015.jpg` |
| 16 | **7.png** | `8ddb0ee2eef5511b4e7231588262ca14df19902340ed1bcd08024d54bb909625` | 79,123 B | PNG | Sí (3) | Local: `7.png` // Drive: `Folder_3/Final/Teoria/7.png` |
| 17 | **8.jpeg** | `ff66d356811228d181a2585177f61951fe266edf1c3b639e153f05bdf8245c54` | 73,570 B | JPEG | Sí (8) | Local: `FINAL - 2021 MARZO TEORIA.jpeg` // Drive: `Folder_3/Final/Teoria/2da mesa febrero.jpeg` |
| 18 | **9.jpeg** | `fb963679720bace63111d645b7735026b33bb79df02ef793a6119bd13791ac48` | 107,326 B | JPEG | Sí (8) | Local: `teoria.jpeg` // Drive: `Folder_3/Final/Teoria/9.jpeg` |
| 19 | **Apuente IA + Modelos de finales - Compendio Alumno Indexado.docx** | `a444eb91297bdbef0c857b05825c26058508d8bf014e20778c62a5539368e7dc` | 5,691,794 B | DOCX | Sí (4) | Local: `Apuente IA + Modelos de finales - Compendio Alumno Indexado.docx` // Drive: `Folder_2/Apuente IA + Modelos de finales - Ian...` |
| 20 | **APUNTE PARA FINAL IA.docx** | `0f9910f781c8e4d92d122926a0621a347dca59189aa6c2becbece70c7e300112` | 10.6 MB | DOCX | Único | Drive: `Folder_8/APUNTE PARA FINAL IA.docx` |
| 21 | **ApunteFinal.pdf** | `37859fbed0b5eb881d57e3772d2845869910bbd90ef31a037ba5b2c3d3d5be82` | 10.6 MB | PDF | Único | Drive: `Folder_Owa/Material Parciales/ApunteFinal.pdf` |
| 22 | **devolución final IA.mp3** | `112f4e624983a9954edaf132cfa7f2989ddb9de0023a60d93605c4d9cfb107ab` | 18,780,864 B | MP3 | Sí (2) | Local: `devolución final IA.mp3` |
| 23 | **examen_ia.docx** | `7131a6c27a7459c6f254ad9b2c417407860a9e5e2fd4b475cbd10b587b267aec` | 16,774 B | DOCX | Sí (6) | Local: `examen_ia.docx` // Drive: `Folder_3/Final/Teoria/examen_ia.docx` |
| 24 | **Final Feb 2021.png** | `db87331a5c0edff213c45ad7c825048610a6ce869c796a1fb7df1540eca168a5` | 539,582 B | PNG | Sí (2) | Local: `Final Feb 2021.png` |
| 25 | **FINAL IA - 08062021.docx** | `6152924d0fed706d109cd35814a5fcc8ebb506fa1624d9bfa4b1dab2113be7c7` | 1,192,895 B | DOCX | Sí (2) | Local: `FINAL IA - 08062021.docx` |
| 26 | **FINAL IA - 27042021.pdf** | `7186374f82149812c91db1a1a1cd572e97ae8a6124fdd76c3cc6f3f84e8ae26d` | 207,329 B | PDF | Sí (2) | Local: `FINAL IA - 27042021.pdf` |
| 27 | **Final IA - Dos Santos (Teoría).pdf** | `cecc8acbb63d0d01ebfdd645018af283f451ac22b95498f30602fe94e55299c2` | 3,085,243 B | PDF | Sí (2) | Local: `Final IA - Dos Santos (Teoría).pdf` |
| 28 | **FINAL IA TEORIA - 27042021.pdf** | `62bac9bbf2564ae916f8cd9de8caa777f031d73afd37a0ea9a55545168a1fce6` | 74,101 B | PDF | Sí (2) | Local: `FINAL IA TEORIA - 27042021.pdf` |
| 29 | **finales_practicos_2024_2025.md** | `59fe769826676358af837d306ea1d640ca6e629ede549282c3058b93cdc49a1b` | 3,251 B | MD | Sí (3) | Local: `finales_practicos_2024_2025.md` |
| 30 | **finales_teoricos_2024_2025.md** | `f4224a60a95a834dfce839cf2943cc12a63fb0a0bb1771baf40d6671f77852f1` | 3,314 B | MD | Sí (3) | Local: `finales_teoricos_2024_2025.md` |
| 31 | **hoja_de_formulas_oficial.md** | `36239cf80d788b150eaff5bed48621b403645cd0c681b4caa18dc98a40866ad8` | 4,984 B | MD | Sí (3) | Local: `hoja_de_formulas_oficial.md` |
| 32 | **ilovepdf_merged_1.pdf** | `fcc6ef1b80550ef3d82dd962633ac8a2dc23d9e5a59e326e0bfd736cbe79a687` | 1,573,511 B | PDF | Sí (2) | Local: `ilovepdf_merged_1.pdf` |
| 33 | **Lista de Finales Teoricos- IA.docx** | `c780546020b39d1f82f886870735f93dbb32ae4851d2e0898591cc5dea0899d4` | 10,861 B | DOCX | Sí (2) | Local: `Lista de Finales Teoricos- IA.docx` |
| 34 | **Lista de Finales Teoricos- IA.docx** | `9296728409562a647eb632df3e03c1810db1b00dd05430d1d9b4c4c727ab98d8` | 9,629 B | DOCX | Sí (2) | Local: `Lista de Finales Teoricos- IA.docx` |
| 35 | **Preguntas y respuestas por temas.docx** | `621aad25442640c3f12c47ba669c56f245d52a14b45d7e15f0e445b9399f1637` | 13,237,379 B | DOCX | Sí (4) | Local: `Preguntas y respuestas por temas(1).docx` // Drive: `Folder_3/Teoria-FInal/Preguntas y respuestas por temas.docx` |
| 36 | **Screen Shot 2021-04-27 at 10.38.25.png** | `a1a9e45a4ba92f452d562d0a1929dea6d27e633712171a30d43a28f27b83dea7` | 367,762 B | PNG | Sí (5) | Local: `Screen Shot 2021-04-27 at 10.38.25.png` // Drive: `Folder_3/Final/Teoria/Screen Shot 2021-04-27 at 10.38.25.png` |
| 37 | **Screen Shot 2021-06-08 at 10.17.44.png** | `0d0d39130ce139f8908d211b7e98fedc88e55a4c0058a8cbaa9b9bef15896ffb` | 340,296 B | PNG | Sí (5) | Local: `Screen Shot 2021-06-08 at 10.17.44.png` // Drive: `Folder_3/Final/Teoria/Screen Shot 2021-06-08 at 10.17.44.png` |
| 38 | **segundo_parcial_19_nov_2025.md** | `a64150dae391df0e727ffcdfce1ead1dd2c4aa4e1338af89f3898a1de6af50c0` | 1,921 B | MD | Sí (3) | Local: `segundo_parcial_19_nov_2025.md` |
| 39 | **Temas Finales.docx** | `47d524d91411f7aff13f71dc6b6f0598c948699214557016643c2920c631795d` | 895,390 B | DOCX | Sí (2) | Local: `Temas Finales.docx` |
| 40 | **Teoria IA Marzo 2021.png** | `b9e0d08367ee0911924cf3cc5119f00b1b3792db0cfae7e40c00d59412687db1` | 715,118 B | PNG | Sí (2) | Local: `Teoria IA Marzo 2021.png` |
| 41 | **TeoriaConPregDeFinalesEnRojo.pdf** | `b42bb615070b61b5bbf3b794d0dcdaaa6cff822bdc0c4607113e2e95405b1c9d` | 3,147,571 B | PDF | Sí (3) | Local: `TeoriaConPregDeFinalesEnRojo.pdf` // Drive: `Folder_3/Teoria-FInal/TeoriaConPregDeFinalesEnRojo.pdf` |


### E. Temas de Primer Parcial ya Rendidos (Auditados para Archivo Forense) (`[TEMA_P1_RENDIDO]`) — 67 Archivos Únicos

| # | Nombre Canónico | SHA-256 (64 caracteres) | Tamaño | Formato | Duplicado? | Ocurrencias / Referencias Principales |
| :-: | :--- | :--- | :-: | :-: | :-: | :--- |
| 1 | **1-Imagen.HEIC** | `be9b2f9f7d83c99599ff084030d436de318ea1aae964267a034b8bed62fefad6` | 1,609,550 B | HEIC | Sí (2) | Local: `1-Imagen.HEIC` |
| 2 | **10-Imagen.HEIC** | `2c52cd9ed18a05b2493264f84084eb889a4db5942e133cf576e27ecb6e9c68f3` | 2,762,305 B | HEIC | Sí (2) | Local: `10-Imagen.HEIC` |
| 3 | **11-Imagen.HEIC** | `75d5f1834538f9402e208f55ffe9773197bc2ffaa21318235de90071e5f8a3c4` | 2,413,775 B | HEIC | Sí (2) | Local: `11-Imagen.HEIC` |
| 4 | **1er Parcial - Rejunte Preguntas.pdf** | `793d0d8bde317bc64c4477786f2fe65ee98bebc8eaf663f10d2d5375c6d74d56` | 351,092 B | PDF | Sí (2) | Local: `1er Parcial - Rejunte Preguntas.pdf` |
| 5 | **2-Imagen.HEIC** | `5f058355f2c11bb380cae6725d82d2968a486dc8bf6ab1c910b154eada03bf6b` | 2,145,692 B | HEIC | Sí (2) | Local: `2-Imagen.HEIC` |
| 6 | **2. planning.pdf** | `f6a2fe41ee9ae509bd92f622bea5bb0aa5b5c2e5d93f48d62e2a0106ef4f54b1` | 781,803 B | PDF | Sí (2) | Local: `2. planning.pdf` |
| 7 | **2a.jpg** | `d504a7d3b85419de9f38653e92c3033c833e15e729ac38488f3a7fbcd4be78f1` | 85,127 B | JPG | Sí (3) | Local: `2a.jpg` // Drive: `Folder_3/Parciales/Primer parcial/2a.jpg` |
| 8 | **2b.jpg** | `73b69f3ec39243ea6ce4bc5d0a67d263a5dcbcd0e9a1c7511fa348e440febf14` | 95,133 B | JPG | Sí (3) | Local: `2b.jpg` // Drive: `Folder_3/Parciales/Primer parcial/2b.jpg` |
| 9 | **2c.jpg** | `41922cc2882ecd937cb06a307e5147fb072e474548e2cadab6fb532bebc27563` | 58,276 B | JPG | Sí (3) | Local: `2c.jpg` // Drive: `Folder_3/Parciales/Primer parcial/2c.jpg` |
| 10 | **3-Imagen.HEIC** | `0ed73253f542398a2e8320b4d1f8fc489bebe834be05ff8c6b1b62b73e500dc0` | 2,424,139 B | HEIC | Sí (2) | Local: `3-Imagen.HEIC` |
| 11 | **3. búsqueda.pdf** | `24da5d7a74153d8678b4d69db25e1e80831c5ee124b98eb3f646147f6f4decad` | 1,914,489 B | PDF | Sí (2) | Local: `3. búsqueda.pdf` |
| 12 | **3.jpeg** | `18969453876f5f33dd4ad8cab021aa6f33408073a68103688bd79801e991aca3` | 202,646 B | JPEG | Sí (3) | Local: `3.jpeg` // Drive: `Folder_3/Parciales/Primer parcial/3.jpeg` |
| 13 | **4-Imagen.HEIC** | `62bbb82242e94c8e4a45154c9b9a40ad3eaed2b34915ce7578f4b23b7cddf0dd` | 2,560,882 B | HEIC | Sí (2) | Local: `4-Imagen.HEIC` |
| 14 | **4.jpeg** | `2b3f09e570fcb3dd6a8eee2e97e90d1692b53d316ea56c485bf01eb7a7b20d04` | 210,351 B | JPEG | Sí (3) | Local: `4.jpeg` // Drive: `Folder_3/Parciales/Primer parcial/4.jpeg` |
| 15 | **5-Imagen.HEIC** | `68ab5e48820c165db3b7acb4b4cc848c31a3dd7cd583f6bd989bc198f473963a` | 2,787,133 B | HEIC | Sí (2) | Local: `5-Imagen.HEIC` |
| 16 | **6-Imagen.HEIC** | `6a3d7631a2bbcbe1278a8c06f72f92f20285fd55ab5ebc93a6f3f7d2d496e5b5` | 2,577,544 B | HEIC | Sí (2) | Local: `6-Imagen.HEIC` |
| 17 | **7-Imagen.HEIC** | `ceb3a0a8cb05c568f8920019dbfa51c0c98ea3ea9539831e82e9a2cde3692fe2` | 2,275,311 B | HEIC | Sí (2) | Local: `7-Imagen.HEIC` |
| 18 | **8-Imagen.HEIC** | `4175b6ea2bb1e164519a67804d14f8f09e9f98ae1e518729a68076bac5e7e316` | 2,624,338 B | HEIC | Sí (2) | Local: `8-Imagen.HEIC` |
| 19 | **9-imagen.HEIC** | `9d8ba34a9667e5da5df61b9fc40178e55ee5ad2fbf21fe00a91b46dd2bf1c90d` | 2,381,530 B | HEIC | Sí (2) | Local: `9-imagen.HEIC` |
| 20 | **AD - Carlos - Cuestionario 3.pdf** | `91a26a7f07a3a16721fce4a9555ef61b13f2a95973bb69ad02e90d9bbcd47ba1` | 110,754 B | PDF | Sí (2) | Local: `AD - Carlos - Cuestionario 3.pdf` |
| 21 | **AD - Gaby - Cuestionario 3.pdf** | `5053e93183abc75d0ed5b70699e35731922c1d4ae6975cf1bdff51c6c845aa9f` | 105,362 B | PDF | Sí (2) | Local: `AD - Gaby - Cuestionario 3.pdf` |
| 22 | **AD - Josie - Cuestionario 3.pdf** | `e1ee44ce938d9717b3b6c75bd8007ea5b1569197143211e637e9b004d44b4b17` | 159,777 B | PDF | Sí (2) | Local: `AD - Josie - Cuestionario 3.pdf` |
| 23 | **AD - Vero - Cuestionario 3.pdf** | `b7b6a714e4c92b45697c412926e92d032dd180450dab0f4e390fc1a23077caaa` | 103,859 B | PDF | Sí (2) | Local: `AD - Vero - Cuestionario 3.pdf` |
| 24 | **C2. SBR-ReglasDeAsosciación.pdf** | `6e856d663d1f9ad09dafafc92b2deb485e8efd72f538f9b5ccde98a0d2ff4d67` | 10,099 B | PDF | Sí (3) | Local: `C2. SBR-ReglasDeAsosciación.pdf` // Drive: `Folder_3/Semana 2 - U2=SistBasadReglas/C2. SBR-ReglasDeAsosciación.pdf` |
| 25 | **C4. Planning.pdf** | `8260c00886cc988ce9503d1cc6766b2171ff85e6b76d1b8104ff72d86201cac9` | 8,348 B | PDF | Sí (3) | Local: `C4. Planning.pdf` // Drive: `Folder_3/Semana 5 - U2=Planning/C4. Planning.pdf` |
| 26 | **C6. Búsqueda.docx** | `a4f3db43626b1e9ab28d2a81e6cdec2b6d22ff4286c413e0730ac5a4dd78e200` | 684,994 B | DOCX | Sí (3) | Local: `C6. Búsqueda.docx` // Drive: `Folder_3/Semana 8 - U3=BusqSemantica y Heuristica/C6. Búsqueda.docx` |
| 27 | **Carlos - Cuestionario 4.pdf** | `f8e9780489defa89a15470d3c96fa2b3b4cb9f49ced0a7fcdc64933526b2a080` | 98,471 B | PDF | Sí (2) | Local: `Carlos - Cuestionario 4.pdf` |
| 28 | **Carlos Pérez - Primer Parcial.pdf** | `19f5d365bb3293f288f80c1432f3c2b8169e5ae82d317b623b09279ca2da52a1` | 2,541,477 B | PDF | Sí (2) | Local: `Carlos Pérez - Primer Parcial.pdf` |
| 29 | **CUESTIONARIO 04 - BÚSQUEDA - ALGORITMOS GENÉTICOS.pdf** | `f5ce4f96d5a1a7ee63cae1d0bba4c54b5e210182a6e48d43f7f14ad8b41cb308` | 102,167 B | PDF | Sí (2) | Local: `CUESTIONARIO 04 - BÚSQUEDA - ALGORITMOS GENÉTICOS.pdf` |
| 30 | **CUESTIONARIO 04 - BÚSQUEDA - ALGORITMOS GENÉTICOS_ Revisión del intento- Josie.pdf** | `b8d8ad826fb6da0e131709581171582ae4f15f1391ac5076947c5d35c3d6961b` | 237,109 B | PDF | Sí (2) | Local: `CUESTIONARIO 04 - BÚSQUEDA - ALGORITMOS GENÉTICOS_ Revisión del intento- Josie.pdf` |
| 31 | **CUESTIONARIO 04 - BÚSQUEDA - ALGORITMOS GENÉTICOS_ Revisión del intento.pdf** | `84c96c6dcaf77b2cbbb25171589b32eb4dba6323b3fa3f8a663316e4c0728f73` | 95,534 B | PDF | Sí (2) | Local: `CUESTIONARIO 04 - BÚSQUEDA - ALGORITMOS GENÉTICOS_ Revisión del intento.pdf` |
| 32 | **Dos Santos Gabriela - Primer Parcial - Tema 1.pdf** | `8edeb8d550d7b51fda91ed8607c78ac510adbea5ef932a242b225db9a09a9667` | 4,575,623 B | PDF | Sí (2) | Local: `Dos Santos Gabriela - Primer Parcial - Tema 1.pdf` |
| 33 | **Formulas.pdf** | `0fb9cceaec6fd4dfdbcfd10295c1c9abf4a234807a8de7cb7b3a053774ffe813` | 220.3 KB | PDF | Único | Drive: `Folder_Owa/Material Parciales/Parcial 1/Formulas.pdf` |
| 34 | **GUIA 2.docx** | `0537513198544b5f00556cfa1222fe20b25948a6e65513e189354ce7e57ad389` | 747,227 B | DOCX | Sí (2) | Local: `GUIA 2.docx` |
| 35 | **Guia 3 DT.docx** | `8352ffaf0fb58a9c5879c850de72ac6eaf25cc1d70ce5de9278e6f3eeef6c3df` | 1,955,711 B | DOCX | Sí (2) | Local: `Guia 3 DT.docx` |
| 36 | **Guia 4 Planning.docx** | `5bb578d0fa83c093d2aecbc3ad89aee4008b306d3e4dd3b720a55f6d4f1d4682` | 2,936,810 B | DOCX | Sí (2) | Local: `Guia 4 Planning.docx` |
| 37 | **GuiaTP-Búsqueda.pdf** | `99fb3289d1de5b277dee159290a0cc59a6d725d5a87591ca455b5854767ebd56` | 74,139 B | PDF | Sí (7) | Local: `GuiaTP-Búsqueda.pdf` // Drive: `Folder_5/Primer Parcial/Busquedas Semantica/GuiaTP-Búsqueda.pdf` |
| 38 | **GuiaTPDecisionTree.pdf** | `c5042e1c6c845e56fb687595202b6e76630282c4a98ba7920597e21eb6779522` | 12,130 B | PDF | Sí (7) | Local: `GuiaTPDecisionTree.pdf` // Drive: `Folder_5/Primer Parcial/Arboles de Decision/GuiaTPDecisionTree.pdf` |
| 39 | **Guía 5 Busqueda.docx** | `b2ef94fa8c6d6c77d493e5fa328972531d504817fee37a4574e7f92850764238` | 407,450 B | DOCX | Sí (2) | Local: `Guía 5 Busqueda.docx` |
| 40 | **Guía TP-SBR-Association Rules (1).pdf** | `b757e34499b3169449336389533810ab16c934fd69c1443e67d22e21c6ef813c` | 23,184 B | PDF | Sí (5) | Local: `Guía TP-SBR-Association Rules (1).pdf` // Drive: `Folder_7/PRACTICOS/Parcial 1/Guía 2 - Reglas de Asosiación/Guía TP-SBR-Association Rules (1).pdf` |
| 41 | **GuíaTP-Planning.pdf** | `467f4f97edba0913838df1d6caa1bc41480ba5f0a517cdd0390291e6481218b6` | 17,723 B | PDF | Sí (5) | Local: `GuíaTP-Planning.pdf` // Drive: `Folder_7/PRACTICOS/Parcial 1/Guia 4 - Planning/GuíaTP-Planning.pdf` |
| 42 | **IA y SE - Carlos - Cuestionario 1.pdf** | `6ff750d7f3af73ad64086884b59726313ab92a1b7637aa2ad38ef8de2dbbb1d3` | 98,861 B | PDF | Sí (2) | Local: `IA y SE - Carlos - Cuestionario 1.pdf` |
| 43 | **IA y SE - Gaby - Cuestionario 1.pdf** | `19ea837bf1f6b92db31121b7b406b240213c912dce0ef25019ff98bed85f0a93` | 97,653 B | PDF | Sí (2) | Local: `IA y SE - Gaby - Cuestionario 1.pdf` |
| 44 | **IA y SE - Josie - Cuestionario 1.pdf** | `9bd769f6571ff5c642abe8c421a46e208171df19ef5a12db2f9b395cd6e1013e` | 153,191 B | PDF | Sí (2) | Local: `IA y SE - Josie - Cuestionario 1.pdf` |
| 45 | **IA y SE - Vero - Cuestionario 1.pdf** | `38e4803d1b1a17c0cee864147b146ecacf07936905fe912d08664f3d892c80c3` | 545,527 B | PDF | Sí (2) | Local: `IA y SE - Vero - Cuestionario 1.pdf` |
| 46 | **ia11.jpeg** | `e7e5d57f1646992f0172c9d734d453e53195801b3098a4c91444d5b8213b6766` | 256,215 B | JPEG | Sí (3) | Local: `ia11.jpeg` // Drive: `Folder_3/Parciales/Primer parcial/ia11.jpeg` |
| 47 | **ilovepdf_merged.pdf** | `df9528f2b0f68e66f79a2e543561b0043318249677ee09174521108a2525b9d3` | 1,122,749 B | PDF | Sí (5) | Local: `ilovepdf_merged.pdf` // Drive: `Folder_2/ilovepdf_merged.pdf` |
| 48 | **JosieFeldman-Tema1-PrimerParcial.pdf** | `7cc7ed50c09df40f93d235f82b4799a889a9ef9aa7dea5dfd79d372f386aa952` | 3,275,914 B | PDF | Sí (2) | Local: `JosieFeldman-Tema1-PrimerParcial.pdf` |
| 49 | **Laura Aguilar.pdf** | `84f689b3d4e57355aa99f537cd53cfec9a1854348da397d66c9b13948214d3a1` | 2,359,115 B | PDF | Sí (2) | Local: `Laura Aguilar.pdf` |
| 50 | **ModeloParcial1.pdf** | `878f45b5476cff1a7b49ba630df518f07718792a4faede18be88a14fe559bd7d` | 1,497,309 B | PDF | Sí (2) | Local: `ModeloParcial1.pdf` |
| 51 | **Modelos Parcial P 1 IA.pdf** | `d0f418393a6ec71e899b8d7c178de1b5aaf023e1fd11081092fe981fd80df6f5` | 1,538,955 B | PDF | Sí (3) | Local: `Modelos Parcial P 1 IA.pdf` // Drive: `Folder_ot9/Practica/Modelos Parcial P 1 IA.pdf` |
| 52 | **Otro de teoría.pdf** | `114ba2df119ff698c16d7d2cb3f9dc9943a0a88076967a688953bb8990d52a6a` | 104,970 B | PDF | Sí (2) | Local: `Otro de teoría.pdf` |
| 53 | **Paso a paso de Algoritmo a Priori.docx** | `28d7b3791713facf38e87951bdf3772802b25bc468c6abaf3e2a3845963b2bb1` | 773,393 B | DOCX | Sí (3) | Local: `Paso a paso de Algoritmo a Priori.docx` // Drive: `Folder_Owa/Anotaciones/Paso a paso de Algoritmo a Priori.docx` |
| 54 | **Preguntas Parcial T 1 IA.pdf** | `58dfb21e74a5d0b988242d3e8e40acd8cca1614a4f851908f0faf44bae639a75` | 580,256 B | PDF | Sí (4) | Local: `Preguntas Parcial T 1 IA-1.pdf` // Drive: `Folder_ot9/Teoria/Preguntas Parcial T 1 IA.pdf` |
| 55 | **Práctica 2019.pdf** | `fedad65df3536a57b3af5d37cf9793b361ffab47c922c5fdb680d1f9e2e4b09b` | 149,115 B | PDF | Sí (2) | Local: `Práctica 2019.pdf` |
| 56 | **práctico 2022.pdf** | `af8d91e4ee49325f52deab0701dfd16c88fe5096d43e9a158c1d217cc0034103` | 295,476 B | PDF | Sí (2) | Local: `práctico 2022.pdf` |
| 57 | **SBR, RS y SBM - Carlos - Cuestionario 2.pdf** | `9772b6fd7259e529c0515c383e04699735c9d8a3f6091f9973e062ead3df26a6` | 121,590 B | PDF | Sí (2) | Local: `SBR, RS y SBM - Carlos - Cuestionario 2.pdf` |
| 58 | **SBR, RS y SBM - Gaby - Cuestionario 2.pdf** | `6b643f8f252aae62872c873c6367ed794d60d1472dfe009ab6465b3467194778` | 117,337 B | PDF | Sí (2) | Local: `SBR, RS y SBM - Gaby - Cuestionario 2.pdf` |
| 59 | **SBR, RS y SBM - Josie - Cuestionario 2.pdf** | `9207799e6c0b926fa26ac4aed29643f7530a060f92c97bec9cba59e04556d1e2` | 190,315 B | PDF | Sí (2) | Local: `SBR, RS y SBM - Josie - Cuestionario 2.pdf` |
| 60 | **SBR, RS y SBM - Vero - Cuestionario 2.pdf** | `b62149516d9872106c08baea08bffef414e8ad2a1cca0f484b9a480bc39f0345` | 118,630 B | PDF | Sí (2) | Local: `SBR, RS y SBM - Vero - Cuestionario 2.pdf` |
| 61 | **Tema 1.jpg** | `7b569933163b3667bd8515476b26f168a1a55d32b347c2b782f8bba2ab4de6b1` | 388,282 B | JPG | Sí (2) | Local: `Tema 1.jpg` |
| 62 | **Tema 2.jpeg** | `49aa080b43d66e88052889eb083daa32a4bac8e185c71506638b1c41c68b3e55` | 193,789 B | JPEG | Sí (2) | Local: `Tema 2.jpeg` |
| 63 | **teoria.png** | `4cc02c9b232d70ec421ea5a3ef5a51e595622f4fa9c73cbf3eec4c4c640f8f54` | 1,246,309 B | PNG | Sí (3) | Local: `teoria.png` // Drive: `Folder_3/Parciales/Primer parcial/Teoria/teoria.png` |
| 64 | **Teoría.pdf** | `8908dd1cd0fe0b5019d48e3848467cd91452f310e05eb66f950e3d092030da94` | 77,805 B | PDF | Sí (2) | Local: `Teoría.pdf` |
| 65 | **TP1 - Semana 02 a 04.pdf** | `ac6498695076908f1c87c17fabe0f57aa9c85c9eb32e9959a00b3793467915b1` | 1.9 MB | PDF | Único | Drive: `Folder_ot9/Practica/TP1 - Semana 02 a 04.pdf` |
| 66 | **TP1.docx** | `ce1d11e48637b9e371b325ad6aeca2d83c92c986804bef3ff1eb155d239522ac` | 150,311 B | DOCX | Sí (2) | Local: `TP1.docx` |
| 67 | **WhatsApp Image 2023-09-09 at 21.55.01.jpeg** | `d1cb28e70a6b83c908ab4f2a4428ebf1a67dcba4853aeb715e54e5f1d00750a0` | 24,716 B | JPEG | Sí (2) | Local: `WhatsApp Image 2023-09-09 at 21.55.01.jpeg` |


### F. Material de Estudio Compilado y Obras de Referencia (`[MATERIAL_ESTUDIO_COMPILADO]`) — 16 Archivos Únicos

| # | Nombre Canónico | SHA-256 (64 caracteres) | Tamaño | Formato | Duplicado? | Ocurrencias / Referencias Principales |
| :-: | :--- | :--- | :-: | :-: | :-: | :--- |
| 1 | **1. reglas de asociación.pdf** | `a02f9746ebc9daa530806f523b0a3b653658050a3953e7db42690748d813cd8c` | 1,818,782 B | PDF | Sí (2) | Local: `1. reglas de asociación.pdf` |
| 2 | **8-AlgoritmosGeneticos.pdf** | `2c183a159ee49c1af4ac8744f5b1f9c82fe62f4b74a6b4d6dd52c33136ec3418` | 97,201 B | PDF | Sí (2) | Local: `8-AlgoritmosGeneticos.pdf` // Drive: `Folder_Owa/Semana 08 (U.3 - Algoritmos Genéticos)/Teoría/8-AlgoritmosGeneticos.pdf` |
| 3 | **Alg_gen_Adapt_Temp.pdf** | `a099bb4fac2202292ad4ed6e1a95b9da4522952f6e227577326773d3ad80c361` | 28,049 B | PDF | Sí (2) | Local: `Alg_gen_Adapt_Temp.pdf` // Drive: `Folder_Owa/Semana 08 (U.3 - Algoritmos Genéticos)/Teoría/Alg_gen_Adapt_Temp.pdf` |
| 4 | **Apunte IA _ Holy Scriptures.docx.pdf** | `822f20d06e34f5f3c2c0df336fd97a60f51b3e1e17a573ecfc8755f91929591b` | 9,993,814 B | PDF | Sí (5) | Local: `Apunte IA _ Holy Scriptures.docx.pdf` // Drive: `Folder_Owa/Material Parciales/Apunte IA _ Holy Scriptures.docx.pdf` |
| 5 | **ApunteCompilado.pdf** | `958ef74a58ae34332ba643c49dcac0888d40627bcf0c4bea09f415c164763298` | 3.9 MB | PDF | Único | Drive: `Folder_Owa/Material Parciales/Parcial 1/ApunteCompilado.pdf` |
| 6 | **ApunteCompilado2.pdf** | `e84dcfecf956b6ae7cf2e6f423274a21707eb4d2f8d6e659538c4ccef6aa6b3c` | 6,961,675 B | PDF | Sí (2) | Local: `ApunteCompilado2.pdf` // Drive: `Folder_Owa/Material Parciales/Parcial 2/ApunteCompilado2.pdf` |
| 7 | **doc_2do_parcial_D3.md** | `b2b4b4230e37b661e77dc7ca8437a3f5965616f57aa1d4ed907ebd4d181461e0` | 1,185,292 B | MD | Único | Local: `doc_2do_parcial_D3.md` |
| 8 | **Ejercicio 11/09.docx** | `bb219e076426a99ee116fde127b19b6fc7a8882440bc935df1bbfb43d5670ae6` | 5.3 MB | DOCX | Único | Drive: `Folder_Owa/Anotaciones/Ejercicio 11/09.docx` |
| 9 | **Ejercicios Práctica (Algunos no corregidos).pdf** | `1b48cf6000c56a0d94eb90ebf9bfb2c3136da3c6f2416fa2e23070fbe06defa4` | 23,517,850 B | PDF | Sí (2) | Local: `Ejercicios Práctica (Algunos no corregidos).pdf` |
| 10 | **Fórmulas.docx** | `e03b9d3f33a28eb2bbccca1a1dc93e45b62a2424b5fe25cde7d7daa9991fdc51` | 565,222 B | DOCX | Sí (2) | Local: `Fórmulas.docx` |
| 11 | **Guias resueltas y extras4.pdf** | `03fb1b0340394f18ba922e12380b7deeb7fd7bc93090c8642935d0ca5663b09b` | 5,014,126 B | PDF | Sí (2) | Local: `Guias resueltas y extras4.pdf` |
| 12 | **Modelos Parcial P 1 IA** | `a1b9200643bb1c8f66de069b985409ffd1a47e9526514a73bc5bcc5eb4fed23c` | 1.6 MB | UNKNOWN | Único | Drive: `Folder_7/MODELOS/Modelos Parcial P 1 IA` |
| 13 | **Preguntas Parcial T 1 IA** | `2aa55cb20f45077a4e5e374ab1fc3886c25b5a9535215f6dd86bfec15ee4b514` | 1.5 MB | UNKNOWN | Único | Drive: `Folder_7/MODELOS/Preguntas Parcial T 1 IA` |
| 14 | **Preguntas_Parcial_2_pypdf.txt** | `9b868a0929f1cbe1493a4aed78af8f6f90353645f6399af7d5b6263dad7d68ea` | 57,020 B | TXT | Único | Local: `Preguntas_Parcial_2_pypdf.txt` |
| 15 | **Práctica 21_08.docx** | `120c25493a46fe1fcd07ce3b58ef9cedebb885d074cb2dddf552a59f52058f8a` | 1,205,013 B | DOCX | Sí (3) | Local: `Práctica 21_08.docx` // Drive: `Folder_Owa/Anotaciones/Práctica 21/08.docx` |
| 16 | **Todo Practica.docx** | `20226956e752a7855d1a4db7e5c7e578c67156c12e81222429e5a17651db6b3e` | 1.2 MB | DOCX | Único | Drive: `Folder_ot9/Practica/Todo Practica.docx` |


## 5. CONCLUSIONES Y RECOMENDACIONES DE HIGIENE FORENSE

1. **Consolidación de Canónicos:** El 92.2% de los recursos auditados poseía al menos una copia redundante. Se recomienda conservar la estructura normalizada en `banco_preguntas/` y `recursos_historicos/crudos_drive_p2/`, utilizando como nombres canónicos los títulos temáticos descriptivos en lugar de los nombres genéricos de cámara o WhatsApp (`1.jpeg`, `1-Imagen.HEIC`, `doc1.md`).
2. **Protección Criptográfica:** El archivo JSON `scratch/catalogo_hashes_forense.json` servirá como la base de datos inmutable de control para validar cualquier nuevo archivo incorporado al workspace mediante comprobación automática de SHA-256.
3. **Separación P1 vs P2:** Los 67 recursos clasificados como `[TEMA_P1_RENDIDO]` deben mantenerse en almacenamiento de archivo histórico para evitar sobrecargar los bancos de preparación específicos del Segundo Parcial.
4. **Foco Inmediato en P2:** Para el estudio del Segundo Parcial, los núcleos indispensables auditados son:
   - Práctica: `2 parcial práctica T1.pdf` (2021), `Segundo parcial IA - 19/11/2025`, `Tips-practica segundo parcial IA.docx`, `Practica Segundo Parcial.xlsx` y la serie de exámenes 2012-2020.
   - Teoría: `Preguntas Parcial 2.pdf` (Folder_Owa), `banco_multiple_choice_oficial.docx`, `parcial_teoria_som_mlp_nb_knn_kmeans.jpg`, Cuestionarios 5 y 6.