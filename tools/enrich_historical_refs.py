# -*- coding: utf-8 -*-
"""
Enriquece las 87 preguntas de preguntas_quiz.json con trazabilidad histórica
verificada contra MODELOS_ORIGINALES/, multiple_choice_con_claves.md y los
bancos históricos auditados de UTN FRRe, sin inventar fechas no confirmadas
y preservando el anonimato SHA-256 exigido por tools/validar_banco.py.
"""
import json
import os
import re
import sys

sys.stdout.reconfigure(encoding="utf-8")

REPO_DEV = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REPO_FAC = r"c:\facultad\Inteligencia Artificial"

ALLOWED_REPO_PREFIXES = (
    "MODELOS_ORIGINALES/",
    "BANCO_TEORIA_Y_MC/",
    "GUIAS_PASO_A_PASO/",
    "ESTRUCTURAS_Y_TABLAS_DE_RESOLUCION/",
    "FORMULARIO_OFICIAL.md",
    "MACHETE_LEGAL_5_MINUTOS.md",
)

EXT_KIND = {
    ".pdf": "pdf",
    ".png": "img",
    ".jpg": "img",
    ".jpeg": "img",
    ".md": "md",
}


def build_repo_index():
    """Indexa archivos públicos trazables del repositorio por basename y ruta relativa POSIX."""
    by_base = {}
    all_paths = set()
    for root, _, files in os.walk(REPO_DEV):
        if ".git" in root or os.path.basename(root) == "docs":
            continue
        for fname in sorted(files):
            full = os.path.join(root, fname)
            rel = os.path.relpath(full, REPO_DEV).replace("\\", "/")
            if rel.startswith(ALLOWED_REPO_PREFIXES):
                all_paths.add(rel)
                by_base.setdefault(fname, []).append(rel)
    return by_base, all_paths


def resolve_repo_files(qid, q, by_base, all_paths):
    """Extrae y valida rutas reales dentro del repo para cada pregunta."""
    r = q["referencia_historica"]
    candidates = []
    seen_paths = set()

    def add_path(rel_path, label=None):
        rel = rel_path.replace("\\", "/")
        if rel not in all_paths or rel in seen_paths:
            return
        seen_paths.add(rel)
        ext = os.path.splitext(rel)[1].lower()
        candidates.append({
            "label": label or os.path.basename(rel),
            "path": rel,
            "kind": EXT_KIND.get(ext, "file"),
        })

    # 1. Fuentes explícitas en orden de prioridad: archivo_origen -> antecedentes -> fuente
    text_sources = [
        r.get("archivo_origen", ""),
        r.get("antecedentes", ""),
        q.get("fuente", ""),
    ]
    file_rx = re.compile(r"([A-Za-z0-9_\-]+\.(?:pdf|png|jpe?g|md))", re.IGNORECASE)
    for blob in text_sources:
        for m in file_rx.findall(blob):
            fname = m.strip()
            if fname in by_base:
                for p in by_base[fname]:
                    add_path(p)

    combined = " | ".join(text_sources)
    low = combined.lower()

    # 2. Alias conocidos verificados hacia archivos normalizados del repositorio
    if "preguntas segundo parcial grupo 2" in low or "preguntas_grupo2" in low or (
        qid.startswith("MC-2025-") and int(qid.split("-")[-1]) >= 21
    ):
        add_path(
            "BANCO_TEORIA_Y_MC/parcial2_2025_grupo2_moodle.md",
            "parcial2_2025_grupo2_moodle.md (Grupo 2)",
        )
    if "compilado" in low or "29 págs" in low or "29paginas" in low:
        add_path("MODELOS_ORIGINALES/1_PARCIALES_2DO_PARCIAL/preguntas_parcial2_desarrollo_compilado_29paginas.pdf")
    if "multiple_choice_d4.docx" in low or "banco_teorico_y_tips_consolidado_total.md" in low:
        add_path(
            "BANCO_TEORIA_Y_MC/BANCO_TEORICO_Y_TIPS_CONSOLIDADO_TOTAL.md",
            "BANCO_TEORICO_Y_TIPS_CONSOLIDADO_TOTAL.md (Parte IV · D4)",
        )
    if qid.startswith("MC-OFICIAL-") or re.match(r"^MC-5[3-9]$", qid):
        add_path("BANCO_TEORIA_Y_MC/multiple_choice_con_claves.md")
    if "lista de finales teóricos" in low or "finales teóricos" in low:
        add_path("BANCO_TEORIA_Y_MC/BANCO_PREGUNTAS_TEORICAS_FINALES_Y_MESAS.md")
    if "tp-ag" in low or (qid.startswith("MC-AG-") and "08_algoritmos_geneticos" not in low):
        add_path("GUIAS_PASO_A_PASO/08_algoritmos_geneticos.md")

    assert len(candidates) >= 1, f"{qid} no resolvió ningún archivo verificable en el repositorio"
    return candidates


def ref(estado, instancia, fecha, anios, archivo_origen, antecedentes="", detalle=""):
    return {
        "estado": estado,  # "verificada_examen" | "derivada_examen" | "compendio_sin_fecha"
        "instancia": instancia,
        "fecha": fecha,
        "anios": anios,
        "archivo_origen": archivo_origen,
        "antecedentes": antecedentes,
        "detalle": detalle,
    }


MOODLE_2025_ANIOS_EXTRA = {
    "MC-2025-08": (
        ["2025", "2020"],
        "Pregunta idéntica evaluada previamente en Cuestionario 06 CVG (04/11/2020, Preg. 5 — cuestionario_moodle_06_svm_hopfield_som.pdf).",
    ),
    "MC-2025-11": (
        ["2025", "2020"],
        "Pregunta idéntica evaluada previamente en Cuestionario 06 CVG (04/11/2020, Preg. 1 — cuestionario_moodle_06_svm_hopfield_som.pdf).",
    ),
    "MC-2025-21": (
        ["2025", "2020"],
        "Pregunta idéntica evaluada previamente en Cuestionario 06 CVG (04/11/2020, Preg. 3 — cuestionario_moodle_06_svm_hopfield_som.pdf).",
    ),
    "MC-2025-23": (
        ["2025", "2020"],
        "Pregunta idéntica evaluada previamente en Cuestionario 05 CVG (28/10/2020, Preg. 4 — cuestionario_moodle_05_nb_perceptron_mlp.pdf).",
    ),
}

GRUPO2_INDEX = {
    "MC-2025-21": "Preg. 1",
    "MC-2025-22": "Preg. 2",
    "MC-2025-23": "Preg. 3",
    "MC-2025-24": "Preg. 4",
    "MC-2025-25": "Preg. 5",
    "MC-2025-26": "Preg. 7",
    "MC-2025-27": "Preg. 8",
    "MC-2025-28": "Preg. 9",
}

HISTORICAL_MAP = {
    # ------------------------------------------------------------------
    # MC-OFICIAL-01..14 (Banco Multiple Choice Oficial / Validado)
    # ------------------------------------------------------------------
    "MC-OFICIAL-01": {
        "anio": "2019",
        "fuente": "2do Parcial Teórico Presencial 2019 (parcial2_2019_cin_teoria_correccion_roja_4k.jpg, Preg. 06)",
        "tags": ["2019", "OFICIAL", "PARCIAL_2", "TINTA_ROJA"],
        "ref": ref(
            "verificada_examen",
            "2do Parcial Teórico Presencial (Validado en Tinta Roja)",
            "2019",
            ["2019"],
            "parcial2_2019_cin_teoria_correccion_roja_4k.jpg · Ej. 06 (5%)",
            "Compilada también en preguntas_parcial2_desarrollo_compilado_29paginas.pdf (Opciones Múltiples Preg. 1 y 9); variante conceptual sobre Average-Link en 2do Parcial Nov 2023 Tema 1 (Ej. 02).",
            "Consigna V/F oficial impresa con corrección docente en tinta roja.",
        ),
    },
    "MC-OFICIAL-02": {
        "anio": "2019",
        "fuente": "2do Parcial Teórico Presencial 2019 (parcial2_2019_cin_teoria_correccion_roja_4k.jpg, Preg. 07)",
        "tags": ["2019", "OFICIAL", "PARCIAL_2", "TINTA_ROJA"],
        "ref": ref(
            "verificada_examen",
            "2do Parcial Teórico Presencial (Validado en Tinta Roja)",
            "2019",
            ["2019"],
            "parcial2_2019_cin_teoria_correccion_roja_4k.jpg · Ej. 07 (5%)",
            "Compilada en preguntas_parcial2_desarrollo_compilado_29paginas.pdf (Opciones Múltiples Preg. 2) y Multiple_choice_D4.docx (Preg. 36).",
            "Consigna V/F oficial impresa sobre K-NN ponderado con corrección docente en tinta roja.",
        ),
    },
    "MC-OFICIAL-03": {
        "anio": "2019",
        "fuente": "2do Parcial Teórico Presencial 2019 (parcial2_2019_cin_teoria_correccion_roja_4k.jpg, Preg. 08)",
        "tags": ["2019", "OFICIAL", "PARCIAL_2", "TINTA_ROJA"],
        "ref": ref(
            "verificada_examen",
            "2do Parcial Teórico Presencial (Validado en Tinta Roja)",
            "2019",
            ["2019"],
            "parcial2_2019_cin_teoria_correccion_roja_4k.jpg · Ej. 08 (5%)",
            "Compilada en preguntas_parcial2_desarrollo_compilado_29paginas.pdf (Opciones Múltiples Preg. 3) y Multiple_choice_D4.docx (Preg. 37).",
            "Consigna V/F oficial impresa sobre Disk K-Means con corrección docente en tinta roja.",
        ),
    },
    "MC-OFICIAL-04": {
        "anio": "2023",
        "fuente": "Exámenes Teóricos Oficiales UTN FRRe (2020 y 2023)",
        "tags": ["2020", "2023", "OFICIAL", "PARCIAL_2"],
        "ref": ref(
            "verificada_examen",
            "Exámenes Teóricos Oficiales de Cátedra",
            "2020 / 2023",
            ["2020", "2023"],
            "multiple_choice_con_claves.md (MC 04) · compilado en preguntas_parcial2_desarrollo_compilado_29paginas.pdf (MC Preg. 4)",
            "Registrada también en Multiple_choice_D4.docx (Preg. 29 / banco CVG).",
            "Consigna de selección múltiple validada sobre vectores de soporte y márgenes H+ / H- en SVM.",
        ),
    },
    "MC-OFICIAL-05": {
        "anio": "2023",
        "fuente": "Exámenes Teóricos Oficiales UTN FRRe (2021 / 2023)",
        "tags": ["2021", "2023", "OFICIAL", "PARCIAL_2"],
        "ref": ref(
            "verificada_examen",
            "Examen Teórico Oficial de Cátedra",
            "2021 / 2023",
            ["2021", "2023"],
            "multiple_choice_con_claves.md (MC 05) · compilado en preguntas_parcial2_desarrollo_compilado_29paginas.pdf (MC Preg. 5)",
            "Temática evaluada también en Cuestionario 06 CVG (04/11/2020, Preg. 1) y 2do Parcial Moodle 19/11/2025 (Preg. 11).",
            "Consigna oficial sobre significado de la ortogonalidad de patrones en Hopfield.",
        ),
    },
    "MC-OFICIAL-06": {
        "anio": None,
        "fuente": "Compilado de Parciales Opciones Múltiples UTN FRRe (Preg. 6, s/f)",
        "tags": ["HISTORICO", "CATEDRA"],
        "ref": ref(
            "compendio_sin_fecha",
            "Compilado de Parciales · Opciones Múltiples",
            "Sin fecha exacta registrada",
            [],
            "preguntas_parcial2_desarrollo_compilado_29paginas.pdf · Sección Opciones Múltiples, Preg. 6",
            "Reproducida en multiple_choice_con_claves.md (MC 06). El compilado no conserva el año individual de esta pregunta.",
            "Item V/F oficial sobre clasificación taxonómica de K-Means (ninguna de las anteriores es verdadera).",
        ),
    },
    "MC-OFICIAL-07": {
        "anio": None,
        "fuente": "Compilado de Parciales Opciones Múltiples UTN FRRe (Preg. 7, s/f)",
        "tags": ["HISTORICO", "CATEDRA"],
        "ref": ref(
            "compendio_sin_fecha",
            "Compilado de Parciales · Opciones Múltiples",
            "Sin fecha exacta registrada",
            [],
            "preguntas_parcial2_desarrollo_compilado_29paginas.pdf · Sección Opciones Múltiples, Preg. 7",
            "Reproducida en multiple_choice_con_claves.md (MC 07). El compilado no consigna fecha de examen específica.",
            "Consigna oficial sobre naturaleza lazy y local de K-NN.",
        ),
    },
    "MC-OFICIAL-08": {
        "anio": None,
        "fuente": "Compilado de Parciales Opciones Múltiples UTN FRRe (Preg. 8, s/f)",
        "tags": ["HISTORICO", "CATEDRA"],
        "ref": ref(
            "compendio_sin_fecha",
            "Compilado de Parciales · Opciones Múltiples",
            "Sin fecha exacta registrada",
            [],
            "preguntas_parcial2_desarrollo_compilado_29paginas.pdf · Sección Opciones Múltiples, Preg. 8",
            "Versión de desarrollo análoga (k-NN ponderado k=m+n) tomada en Recuperatorio 2do Parcial Nov 2023 (parcial2_2023_teoria_tema2.jpeg / IA-H0076, Ej. 05).",
            "Pregunta de examen sobre desbalance p vs q con k=p+q en K-NN sin ponderar.",
        ),
    },
    "MC-OFICIAL-09": {
        "anio": None,
        "fuente": "Compilado de Parciales Opciones Múltiples UTN FRRe (Preg. 10, s/f)",
        "tags": ["HISTORICO", "CATEDRA"],
        "ref": ref(
            "compendio_sin_fecha",
            "Compilado de Parciales · Opciones Múltiples",
            "Sin fecha exacta registrada",
            [],
            "preguntas_parcial2_desarrollo_compilado_29paginas.pdf · Sección Opciones Múltiples, Preg. 10 (y Multiple_choice_D4.docx Preg. 30)",
            "Sin fecha individual impresa en el compilado; concepto evaluado también en Finales 17/02/2021 (Preg. 3) y 08/06/2021 (Ej. 04).",
            "Consigna oficial sobre multiplicadores de Lagrange nulos en vectores no soporte.",
        ),
    },
    "MC-OFICIAL-10": {
        "anio": None,
        "fuente": "Compilado de Parciales Opciones Múltiples UTN FRRe (Preg. 11, s/f)",
        "tags": ["HISTORICO", "CATEDRA"],
        "ref": ref(
            "compendio_sin_fecha",
            "Compilado de Parciales · Opciones Múltiples",
            "Sin fecha exacta registrada",
            [],
            "preguntas_parcial2_desarrollo_compilado_29paginas.pdf · Sección Opciones Múltiples, Preg. 11 (y Multiple_choice_D4.docx Preg. 31)",
            "Sin fecha individual impresa en el compilado.",
            "Consigna oficial sobre cota teórica de patrones M <= N / (4 ln N) en Hopfield.",
        ),
    },
    "MC-OFICIAL-11": {
        "anio": None,
        "fuente": "Compilado de Parciales Opciones Múltiples UTN FRRe (Preg. 12, s/f)",
        "tags": ["HISTORICO", "CATEDRA"],
        "ref": ref(
            "compendio_sin_fecha",
            "Compilado de Parciales · Opciones Múltiples",
            "Sin fecha exacta registrada",
            [],
            "preguntas_parcial2_desarrollo_compilado_29paginas.pdf · Sección Opciones Múltiples, Preg. 12 (y Multiple_choice_D4.docx Preg. 32)",
            "Sin fecha individual impresa en el compilado.",
            "Consigna oficial sobre fase de competencia (selección de BMU) en SOM.",
        ),
    },
    "MC-OFICIAL-12": {
        "anio": None,
        "fuente": "Compilado de Parciales Opciones Múltiples UTN FRRe (Preg. 13, s/f)",
        "tags": ["HISTORICO", "CATEDRA"],
        "ref": ref(
            "compendio_sin_fecha",
            "Compilado de Parciales · Opciones Múltiples",
            "Sin fecha exacta registrada",
            [],
            "preguntas_parcial2_desarrollo_compilado_29paginas.pdf · Sección Opciones Múltiples, Preg. 13 (y Multiple_choice_D4.docx Preg. 33)",
            "Sin fecha individual impresa en el compilado; pregunta relacionada con Cuestionario 06 CVG (04/11/2020, Preg. 3).",
            "Consigna oficial sobre cantidad de neuronas en la capa de entrada de un SOM.",
        ),
    },
    "MC-OFICIAL-13": {
        "anio": "2020",
        "fuente": "Cuestionario 06 CVG (04/11/2020, Preg. 2) y Compilado Oficial (Preg. 14)",
        "tags": ["2020", "OFICIAL", "MOODLE_CVG"],
        "ref": ref(
            "verificada_examen",
            "Cuestionario Moodle CVG + Compilado de Parciales",
            "04/11/2020",
            ["2020"],
            "cuestionario_moodle_06_svm_hopfield_som.pdf · Preg. 2 (y preguntas_parcial2_desarrollo_compilado_29paginas.pdf MC Preg. 14)",
            "Presente también en Multiple_choice_D4.docx (Preg. 34).",
            "Consigna oficial verificada: SVM lineal realiza separaciones binarias en espacios de D >= 2 dimensiones.",
        ),
    },
    "MC-OFICIAL-14": {
        "anio": None,
        "fuente": "Banco Multiple Choice Oficial UTN FRRe (MC 14 — Término de Momento, s/f)",
        "tags": ["HISTORICO", "CATEDRA"],
        "ref": ref(
            "compendio_sin_fecha",
            "Banco Teórico de Cátedra · Multiple Choice",
            "Sin fecha exacta en el ítem MC",
            [],
            "multiple_choice_con_claves.md · Pregunta MC 14",
            "Temática evaluada en 2do Parcial Moodle 19/11/2025 (Preg. 18), 2do Parcial Teórico 22/11/2023 (IA-H0079, Ej. 01) y Final 17/02/2021 (Preg. 1).",
            "Efecto físico del término de momento beta en Backpropagation.",
        ),
    },
    # ------------------------------------------------------------------
    # MC-CONSOL-* (Parte IV del Compendio / Multiple_choice_D4.docx)
    # ------------------------------------------------------------------
    "MC-CONSOL-01": {
        "anio": None,
        "fuente": "Banco Multiple Choice CVG (Multiple_choice_D4.docx · Parte IV Preg. 01, s/f)",
        "tags": ["P1_REPASO", "HISTORICO"],
        "ref": ref(
            "compendio_sin_fecha",
            "Banco Multiple Choice CVG (Compilado P1/P2)",
            "Sin fecha exacta en Multiple_choice_D4.docx",
            [],
            "Multiple_choice_D4.docx · ítem 1 (BANCO_TEORICO_Y_TIPS_CONSOLIDADO_TOTAL.md Parte IV Preg. 01)",
            "Tema de Primer Parcial (Reglas de Asociación).",
            "Consigna V/F oficial sobre minconf, minsup y co-ocurrencia en reglas de asociación.",
        ),
    },
    "MC-CONSOL-02": {
        "anio": None,
        "fuente": "Banco Multiple Choice CVG (Multiple_choice_D4.docx · Parte IV Preg. 02, s/f)",
        "tags": ["P1_REPASO", "HISTORICO"],
        "ref": ref(
            "compendio_sin_fecha",
            "Banco Multiple Choice CVG (Compilado P1/P2)",
            "Sin fecha exacta en Multiple_choice_D4.docx",
            [],
            "Multiple_choice_D4.docx · ítem 2 (BANCO_TEORICO_Y_TIPS_CONSOLIDADO_TOTAL.md Parte IV Preg. 02)",
            "Tema de Primer Parcial (Árboles de Decisión ID3/C4.5).",
            "Criterio de selección de nodo raíz en árboles de decisión.",
        ),
    },
    "MC-CONSOL-03": {
        "anio": None,
        "fuente": "Banco Multiple Choice CVG (Multiple_choice_D4.docx · Parte IV Preg. 03, s/f)",
        "tags": ["P1_REPASO", "HISTORICO"],
        "ref": ref(
            "compendio_sin_fecha",
            "Banco Multiple Choice CVG (Compilado P1/P2)",
            "Sin fecha exacta en Multiple_choice_D4.docx",
            [],
            "Multiple_choice_D4.docx · ítem 3 (BANCO_TEORICO_Y_TIPS_CONSOLIDADO_TOTAL.md Parte IV Preg. 03)",
            "Tema de Primer Parcial (Árboles de Decisión).",
            "Propiedades de hojas impuras y caminos mutuamente excluyentes.",
        ),
    },
    "MC-CONSOL-04": {
        "anio": None,
        "fuente": "Banco Multiple Choice CVG (Multiple_choice_D4.docx · Parte IV Preg. 04, s/f)",
        "tags": ["P1_REPASO", "HISTORICO"],
        "ref": ref(
            "compendio_sin_fecha",
            "Banco Multiple Choice CVG (Compilado P1/P2)",
            "Sin fecha exacta en Multiple_choice_D4.docx",
            [],
            "Multiple_choice_D4.docx · ítem 4 (BANCO_TEORICO_Y_TIPS_CONSOLIDADO_TOTAL.md Parte IV Preg. 04)",
            "Tema de Primer Parcial (Planificación de Orden Parcial POP).",
            "Condiciones de terminación y amenazas resueltas en POP.",
        ),
    },
    "MC-CONSOL-05": {
        "anio": None,
        "fuente": "Banco Multiple Choice CVG (Multiple_choice_D4.docx · Parte IV Preg. 05, s/f)",
        "tags": ["P1_REPASO", "HISTORICO"],
        "ref": ref(
            "compendio_sin_fecha",
            "Banco Multiple Choice CVG (Compilado P1/P2)",
            "Sin fecha exacta en Multiple_choice_D4.docx",
            [],
            "Multiple_choice_D4.docx · ítem 5 (BANCO_TEORICO_Y_TIPS_CONSOLIDADO_TOTAL.md Parte IV Preg. 05)",
            "Consigna afín sobre A* en 2do Parcial Teórico 2019 (parcial2_2019_cin_teoria_correccion_roja_4k.jpg, Ej. 05). Tema evaluado actualmente en P1.",
            "Comparación entre BFS y A* con heurística perfecta h'=h* y g=1.",
        ),
    },
    "MC-CONSOL-06": {
        "anio": None,
        "fuente": "Banco Multiple Choice CVG (Multiple_choice_D4.docx · Parte IV Preg. 06, s/f)",
        "tags": ["P1_REPASO", "HISTORICO"],
        "ref": ref(
            "compendio_sin_fecha",
            "Banco Multiple Choice CVG (Compilado P1/P2)",
            "Sin fecha exacta en Multiple_choice_D4.docx",
            [],
            "Multiple_choice_D4.docx · ítem 6 (BANCO_TEORICO_Y_TIPS_CONSOLIDADO_TOTAL.md Parte IV Preg. 06)",
            "Tema de Primer Parcial (Búsqueda Heurística A*).",
            "Comportamiento de A* con h'(n)=0 y costo de paso g(n) variable.",
        ),
    },
    "MC-CONSOL-07": {
        "anio": None,
        "fuente": "Banco Multiple Choice CVG (Multiple_choice_D4.docx · Parte IV Preg. 07, s/f)",
        "tags": ["P1_REPASO", "HISTORICO"],
        "ref": ref(
            "compendio_sin_fecha",
            "Banco Multiple Choice CVG (Compilado P1/P2)",
            "Sin fecha exacta en Multiple_choice_D4.docx",
            [],
            "Multiple_choice_D4.docx · ítem 7 (BANCO_TEORICO_Y_TIPS_CONSOLIDADO_TOTAL.md Parte IV Preg. 07)",
            "Misma situación evaluada en desarrollo en Recuperatorio 2do Parcial Nov 2023 (parcial2_2023_teoria_tema2.jpeg / IA-H0076, Ej. 04). Tema movido a P1.",
            "Comportamiento de A* con h'(n)=0 y g(n)=1 constante.",
        ),
    },
    "MC-CONSOL-18": {
        "anio": None,
        "fuente": "Banco Multiple Choice CVG (Multiple_choice_D4.docx · Parte IV Preg. 18, s/f)",
        "tags": ["P1_REPASO", "HISTORICO"],
        "ref": ref(
            "compendio_sin_fecha",
            "Banco Multiple Choice CVG (Compilado P1/P2)",
            "Sin fecha exacta en Multiple_choice_D4.docx",
            [],
            "Multiple_choice_D4.docx · ítem 18 (BANCO_TEORICO_Y_TIPS_CONSOLIDADO_TOTAL.md Parte IV Preg. 18)",
            "Propiedad downward closure evaluada en desarrollo en Final Feb 2021 2da Mesa (Ej. 03) y Final 08/06/2021 (Ej. 03). Tema de P1.",
            "Generación de itemsets frecuentes en Apriori.",
        ),
    },
    "MC-CONSOL-19": {
        "anio": None,
        "fuente": "Banco Multiple Choice CVG (Multiple_choice_D4.docx · Parte IV Preg. 19, s/f)",
        "tags": ["P1_REPASO", "HISTORICO"],
        "ref": ref(
            "compendio_sin_fecha",
            "Banco Multiple Choice CVG (Compilado P1/P2)",
            "Sin fecha exacta en Multiple_choice_D4.docx",
            [],
            "Multiple_choice_D4.docx · ítem 19 (BANCO_TEORICO_Y_TIPS_CONSOLIDADO_TOTAL.md Parte IV Preg. 19)",
            "Tema de Primer Parcial (Sistemas Basados en Reglas).",
            "Control de coherencia de datos en Sistemas Basados en Reglas.",
        ),
    },
    "MC-CONSOL-20": {
        "anio": None,
        "fuente": "Banco Multiple Choice CVG (Multiple_choice_D4.docx · Parte IV Preg. 20, s/f)",
        "tags": ["P1_REPASO", "HISTORICO"],
        "ref": ref(
            "compendio_sin_fecha",
            "Banco Multiple Choice CVG (Compilado P1/P2)",
            "Sin fecha exacta en Multiple_choice_D4.docx",
            [],
            "Multiple_choice_D4.docx · ítem 20 (BANCO_TEORICO_Y_TIPS_CONSOLIDADO_TOTAL.md Parte IV Preg. 20)",
            "Tema de Primer Parcial (Reglas de Asociación).",
            "Definición probabilística de confianza P(Y | X) en reglas de asociación.",
        ),
    },
    "MC-CONSOL-23": {
        "anio": None,
        "fuente": "Banco Multiple Choice CVG (Multiple_choice_D4.docx · Parte IV Preg. 23, s/f)",
        "tags": ["HISTORICO", "CATEDRA"],
        "ref": ref(
            "compendio_sin_fecha",
            "Banco Multiple Choice CVG (Compilado P1/P2)",
            "Sin fecha exacta en Multiple_choice_D4.docx",
            [],
            "Multiple_choice_D4.docx · Preg. 24 (BANCO_TEORICO_Y_TIPS_CONSOLIDADO_TOTAL.md Parte IV Preg. 23)",
            "Evaluación de uso del conjunto de test con etiquetas en aprendizaje supervisado.",
            "Consigna oficial sobre contenido y rol del conjunto de test.",
        ),
    },
    # ------------------------------------------------------------------
    # MC-53..59 (Hallazgos teóricos sintetizados desde exámenes reales)
    # ------------------------------------------------------------------
    "MC-53": {
        "anio": "2019",
        "fuente": "Basada en 2do Parcial Teórico 2019 (Ej. 03) y Nov 2023 Tema 1 (Ej. 04)",
        "tags": ["2019", "2021", "2023", "CATEDRA", "DERIVADA"],
        "ref": ref(
            "derivada_examen",
            "Derivada de Exámenes Teóricos (Parcial 2019 / Parcial 2023 / Final 2021)",
            "2019 / Nov 2023",
            ["2019", "2021", "2023"],
            "parcial2_2019_cin_teoria_correccion_roja_4k.jpg (Ej. 03 · IA-H-2019-TEOR) y parcial2_2023_teoria_tema1.jpeg (Ej. 04 · IA-H0074)",
            "Evaluada también en Final 17/02/2021 (Preg. 4) y compilado 29 págs. (Preg. 10, 14, 60–63).",
            "Síntesis MC generada desde el ejercicio de desarrollo sobre SOM y conexiones laterales (Sombrero Mexicano).",
        ),
    },
    "MC-54": {
        "anio": "2019",
        "fuente": "Basada en 2do Parcial Teórico 2019 (parcial2_2019_cin_teoria_correccion_roja_4k.jpg, Ej. 04)",
        "tags": ["2019", "CATEDRA", "DERIVADA"],
        "ref": ref(
            "derivada_examen",
            "Derivada de 2do Parcial Teórico Presencial",
            "2019",
            ["2019"],
            "parcial2_2019_cin_teoria_correccion_roja_4k.jpg (Ej. 04 al 15% · IA-H-2019-TEOR)",
            "Reproducida como Preg. 11 en preguntas_parcial2_desarrollo_compilado_29paginas.pdf.",
            "Síntesis MC de la consigna de desarrollo sobre el rol de la Teoría del Dominio en EBL.",
        ),
    },
    "MC-55": {
        "anio": "2023",
        "fuente": "Basada en 2do Parcial Teórico 2019 (Ej. 06), Final 17/02/2021 (Preg. 6) y Nov 2023 (Ej. 02)",
        "tags": ["2019", "2021", "2023", "CATEDRA", "DERIVADA"],
        "ref": ref(
            "derivada_examen",
            "Derivada de Parciales Teóricos y Final",
            "2019 / 2021 / Nov 2023",
            ["2019", "2021", "2023"],
            "parcial2_2023_teoria_tema1.jpeg (Ej. 02 · IA-H0074), parcial2_2019_cin_teoria_correccion_roja_4k.jpg (Ej. 06) y final_2021_02_17.pdf (Preg. 6)",
            "Cubre propiedades geométricas de Single-Link, Complete-Link y diferencia de Average-Link vs centroides.",
            "Síntesis MC armada sobre consignas recurrentes de enlaces en clustering jerárquico.",
        ),
    },
    "MC-56": {
        "anio": "2023",
        "fuente": "Basada en 2do Parcial Teórico 2019 (Ej. 07) y Recuperatorio Nov 2023 (Ej. 05)",
        "tags": ["2019", "2023", "CATEDRA", "DERIVADA"],
        "ref": ref(
            "derivada_examen",
            "Derivada de Parcial Teórico y Recuperatorio",
            "2019 / Nov 2023",
            ["2019", "2023"],
            "parcial2_2023_teoria_tema2.jpeg (Ej. 05 · IA-H0076) y parcial2_2019_cin_teoria_correccion_roja_4k.jpg (Ej. 07)",
            "Incluye normalización, robustez ante k=N y ponderación inversa al cuadrado.",
            "Síntesis MC derivada de consignas reales de K-NN ponderado.",
        ),
    },
    "MC-57": {
        "anio": "2023",
        "fuente": "Basada en 2do Parcial Teórico 22/11/2023 (Ej. 01) y Final 17/02/2021 (Preg. 1)",
        "tags": ["2021", "2023", "CATEDRA", "DERIVADA"],
        "ref": ref(
            "derivada_examen",
            "Derivada de 2do Parcial Teórico y Examen Final",
            "22/11/2023 (y Final 17/02/2021)",
            ["2021", "2023"],
            "parcial2_2023_teoria_desarrollo.jpeg (Ej. 01 · IA-H0079) y final_2021_02_17.pdf (Teoría Preg. 1)",
            "Presente también en preguntas_parcial2_desarrollo_compilado_29paginas.pdf (Pregs. 12 y 48).",
            "Síntesis MC sobre física del término de momento (mesetas llanas, valles escarpados y signo negativo).",
        ),
    },
    "MC-58": {
        "anio": "2021",
        "fuente": "Basada en Final 17/02/2021 (Preg. 3), Final 08/06/2021 (Preg. 4) y MC Oficial (#4, #10)",
        "tags": ["2021", "CATEDRA", "DERIVADA"],
        "ref": ref(
            "derivada_examen",
            "Derivada de Exámenes Finales y MC Compilado",
            "17/02/2021 y 08/06/2021",
            ["2021"],
            "final_2021_02_17.pdf (Preg. 3), final_2021_06_08_mesa.png (Ej. 04) y compilado 29 págs. (MC #4 y #10)",
            "Cubre condiciones de holgura complementaria KKT y dispersión de vectores de soporte.",
            "Síntesis MC basada en preguntas de finales sobre Lagrange y obtención de w.",
        ),
    },
    "MC-59": {
        "anio": "2023",
        "fuente": "Basada en 2do Parcial Teórico 22/11/2023 (Ej. 05) y Cuestionario 06 CVG (04/11/2020, Preg. 1)",
        "tags": ["2020", "2023", "CATEDRA", "DERIVADA"],
        "ref": ref(
            "derivada_examen",
            "Derivada de Parcial Teórico y Cuestionario CVG",
            "22/11/2023 (y 04/11/2020)",
            ["2020", "2023"],
            "parcial2_2023_teoria_desarrollo.jpeg (Ej. 05 · IA-H0079) y cuestionario_moodle_06_svm_hopfield_som.pdf (Preg. 1)",
            "Relacionada con Pregs. 21, 33, 36 y 59 de preguntas_parcial2_desarrollo_compilado_29paginas.pdf.",
            "Síntesis MC sobre ortogonalidad bipolar, diagonal nula y estabilidad de Lyapunov en Hopfield.",
        ),
    },
    # ------------------------------------------------------------------
    # 27 Preguntas Temáticas (MC-AG-*, MC-NB-*, MC-MLP-*, etc.)
    # ------------------------------------------------------------------
    "MC-AG-01": {
        "anio": "2025",
        "fuente": "Basada en Guía Práctica Nº 6 TP-AG y antecedente Moodle 19/11/2025 (Preg. 12)",
        "tags": ["2025", "PRACTICO", "DERIVADA"],
        "ref": ref(
            "derivada_examen",
            "Derivada de Guía Práctica TP-AG y Moodle 2025",
            "19/11/2025 (Moodle Preg. 12) · Guía TP-AG",
            ["2025"],
            "guia_practica / 2do Parcial Moodle 19/11/2025 (parcial2_2025_11_19_teoria_moodle_oficial.pdf, Preg. 12)",
            "Combina la selección proporcional por ruleta [00-99] de la guía práctica con la trampa del superindividuo.",
            "Pregunta temática de estudio basada en guía oficial y Moodle.",
        ),
    },
    "MC-AG-02": {
        "anio": "2025",
        "fuente": "Basada en 2do Parcial Práctico 19/11/2025 (Punto 4.c) y Guía Práctica TP-AG",
        "tags": ["2025", "PRACTICO_2025", "DERIVADA"],
        "ref": ref(
            "derivada_examen",
            "Derivada de 2do Parcial Práctico Presencial",
            "19/11/2025",
            ["2025"],
            "parcial2_2025_11_19_oficial.pdf · Página 2, Punto 4.c (Control de copias 50%)",
            "Complementa la regla de parte entera + mayor parte decimal tomada en el parcial práctico del 19/11/2025.",
            "Pregunta conceptual derivada directamente del ejercicio práctico oficial.",
        ),
    },
    "MC-AG-03": {
        "anio": "2025",
        "fuente": "Basada en 2do Parcial Práctico 19/11/2025 (Punto 4.a y 4.b) y Guía Práctica TP-AG",
        "tags": ["2025", "PRACTICO_2025", "DERIVADA"],
        "ref": ref(
            "derivada_examen",
            "Derivada de 2do Parcial Práctico Presencial",
            "19/11/2025",
            ["2025"],
            "parcial2_2025_11_19_oficial.pdf · Página 2, Punto 4.a (Cruza simple G4) y 4.b (Multipunto G2, G5, G7)",
            "Cubre operadores de cruce binario de la guía práctica TP-AG.",
            "Pregunta conceptual derivada del punto práctico de Algoritmos Genéticos.",
        ),
    },
    "MC-AG-04": {
        "anio": "2023",
        "fuente": "Basada en 2do Parcial Teórico 22/11/2023 (Ej. 03) y Hoja de Fórmulas Oficial",
        "tags": ["2023", "CATEDRA", "DERIVADA"],
        "ref": ref(
            "derivada_examen",
            "Derivada de 2do Parcial Teórico Presencial",
            "22/11/2023",
            ["2023"],
            "parcial2_2023_teoria_desarrollo.jpeg · Ej. 03 (20% · IA-H0079) y hoja_de_formulas_segundo_parcial.pdf",
            "Evaluada también en preguntas_parcial2_desarrollo_compilado_29paginas.pdf (Preg. 78).",
            "Pregunta temática basada en el ejercicio teórico de mutación adaptativa por temperatura.",
        ),
    },
    "MC-AG-05": {
        "anio": None,
        "fuente": "Basada en Hoja de Fórmulas Oficial y Compendio de Cátedra (Preg. 75, s/f)",
        "tags": ["HISTORICO", "CATEDRA", "DERIVADA"],
        "ref": ref(
            "compendio_sin_fecha",
            "Derivada de Hoja de Fórmulas y Compendio Teórico",
            "Sin fecha exacta en el compendio",
            [],
            "hoja_de_formulas_segundo_parcial.pdf y preguntas_parcial2_desarrollo_compilado_29paginas.pdf (Preg. 75)",
            "Desarrollada también en la presentación oficial SEM08-AlgGen_2024.pptx (Ranking lineal).",
            "Pregunta conceptual sobre fórmula y efecto del Ranking Lineal.",
        ),
    },
    "MC-AG-06": {
        "anio": None,
        "fuente": "Basada en Compendio Doctrinal de Finales (Preg. 28 del compilado, s/f)",
        "tags": ["HISTORICO", "CATEDRA", "DERIVADA"],
        "ref": ref(
            "compendio_sin_fecha",
            "Derivada de Pregunta de Examen Final del Compilado",
            "Sin fecha exacta en el compendio",
            [],
            "preguntas_parcial2_desarrollo_compilado_29paginas.pdf · Preg. 28 (Elitismo 15%, cruza 70%, mutación 15%)",
            "El compilado reúne preguntas reales de mesas de examen final previas sin fecha individual por ítem.",
            "Pregunta temática armada sobre el diagnóstico oficial ante estancamiento en AG.",
        ),
    },
    "MC-NB-01": {
        "anio": "2023",
        "fuente": "Basada en Cuestionario 05 CVG (28/10/2020, Preg. 4) y 2do Parcial 22/11/2023 (Ej. 04)",
        "tags": ["2020", "2023", "CATEDRA", "DERIVADA"],
        "ref": ref(
            "derivada_examen",
            "Derivada de Parcial Teórico y Cuestionario CVG",
            "28/10/2020 y 22/11/2023",
            ["2020", "2023"],
            "cuestionario_moodle_05_nb_perceptron_mlp.pdf (Preg. 4), parcial2_2023_teoria_desarrollo.jpeg (Ej. 04 · IA-H0079) y hoja_de_formulas_segundo_parcial.pdf",
            "Temática presente también en preguntas_parcial2_desarrollo_compilado_29paginas.pdf (Pregs. 39–45).",
            "Síntesis sobre independencia condicional, posterior y rol del denominador en Naïve Bayes.",
        ),
    },
    "MC-NB-02": {
        "anio": "2023",
        "fuente": "Basada en Recuperatorio 2do Parcial Nov 2023 (Ej. 03), Parciales 2015/2016 y Guía NB",
        "tags": ["2015", "2016", "2023", "CATEDRA", "DERIVADA"],
        "ref": ref(
            "derivada_examen",
            "Derivada de Parciales Teóricos/Prácticos y Guía Nº 4",
            "Nov 2023 (y Prácticos 2015 / 2016)",
            ["2015", "2016", "2023"],
            "parcial2_2023_teoria_tema2.jpeg (Ej. 03 · IA-H0076), parcial2_2015_06_22_nb_perceptron_hopfield_spam_svm_inverso.png (Ej. 2), parcial2_2016_presencial.jpg (Ej. 2) y guia_practica_naive_bayes.pdf",
            "Cubre histogramas, bins vacíos (frecuencia cero), suavizado de Laplace y densidad gaussiana.",
            "Síntesis de los dos enfoques prácticos de Naïve Bayes evaluados por la cátedra.",
        ),
    },
    "MC-NB-03": {
        "anio": "2021",
        "fuente": "Basada en Examen Final 08/06/2021 (Ej. 01 al 42% · Tabla K-NN / K-Means / NB)",
        "tags": ["2021", "CATEDRA", "DERIVADA"],
        "ref": ref(
            "derivada_examen",
            "Derivada de Examen Final Oficial",
            "08/06/2021",
            ["2021"],
            "final_2021_06_08_mesa.png · Ej. 01 (42%) y compilado 29 págs. Preg. 16",
            "Refleja directamente las dimensiones comparadas en el cuadro tridimensional k-NN vs K-Means vs NB.",
            "Síntesis sobre aprendizaje eager vs lazy y sensibilidad dimensional.",
        ),
    },
    "MC-NB-04": {
        "anio": None,
        "fuente": "Basada en Banco de Finales del Compendio (Preg. 27 del compilado, s/f)",
        "tags": ["HISTORICO", "CATEDRA", "DERIVADA"],
        "ref": ref(
            "compendio_sin_fecha",
            "Derivada de Pregunta de Examen Final del Compilado",
            "Sin fecha exacta en el compendio",
            [],
            "preguntas_parcial2_desarrollo_compilado_29paginas.pdf · Preg. 27 (Problemas de NB con distribución gaussiana)",
            "Basada en el caso clásico de dos espirales entrelazadas y atributos correlacionados.",
            "Pregunta conceptual derivada de pregunta real de examen final.",
        ),
    },
    "MC-MLP-01": {
        "anio": "2021",
        "fuente": "Basada en Final 2da Mesa Febrero 2021 (Ej. 02 al 20%) y Compilado (Pregs. 2, 13, 23)",
        "tags": ["2021", "CATEDRA", "DERIVADA"],
        "ref": ref(
            "derivada_examen",
            "Derivada de Examen Final Oficial",
            "Febrero 2021 (2da Mesa)",
            ["2021"],
            "final_2021_02_segunda_mesa.jpeg · Ej. 02 (20%) y compilado 29 págs. Pregs. 2, 13 y 23",
            "Concepto evaluado también en 2do Parcial Moodle 19/11/2025 (Pregs. 10 y 18) y DOCX Grupo 2 (MC-2025-26).",
            "Criterios de Early Stopping cuando sube el error de validación o E_val < E_min.",
        ),
    },
    "MC-MLP-02": {
        "anio": "2023",
        "fuente": "Basada en 2do Parcial Teórico 22/11/2023 (Ej. 01) y Final 17/02/2021 (Preg. 1)",
        "tags": ["2021", "2023", "CATEDRA", "DERIVADA"],
        "ref": ref(
            "derivada_examen",
            "Derivada de 2do Parcial Teórico y Examen Final",
            "22/11/2023 (y Final 17/02/2021)",
            ["2021", "2023"],
            "parcial2_2023_teoria_desarrollo.jpeg (Ej. 01 · IA-H0079), final_2021_02_17.pdf (Preg. 1) y compilado 29 págs. Pregs. 12 y 48",
            "Pregunta recurrente reportada también en mesas de finales 2024–2025 (Lista de Finales Teóricos).",
            "Aclara la diferencia entre el coeficiente positivo beta y el término completo beta·DeltaW(t-1) negativo.",
        ),
    },
    "MC-MLP-03": {
        "anio": "2025",
        "fuente": "Basada en 2do Parcial Práctico 19/11/2025 (Pto. 3), Nov 2023 (Ej. 3) y Hoja de Fórmulas",
        "tags": ["2023", "2025", "PRACTICO_2025", "DERIVADA"],
        "ref": ref(
            "derivada_examen",
            "Derivada de 2do Parcial Práctico y Hoja de Fórmulas",
            "19/11/2025 (y Nov 2023)",
            ["2023", "2025"],
            "parcial2_2025_11_19_oficial.pdf (Punto 3 · todas sigmoidales), parcial2_2023_tema1.jpeg (Ej. 03) y hoja_de_formulas_segundo_parcial.pdf",
            "Sintetiza las derivadas y gradientes delta requeridos en Backpropagation.",
            "Pregunta de práctica conceptual derivada del ejercicio obligatorio de MLP.",
        ),
    },
    "MC-MLP-04": {
        "anio": "2023",
        "fuente": "Basada en Recuperatorio 2do Parcial Nov 2023 (Ej. 01) y Compilado (Preg. 17)",
        "tags": ["2023", "CATEDRA", "DERIVADA"],
        "ref": ref(
            "derivada_examen",
            "Derivada de Recuperatorio 2do Parcial Teórico",
            "Nov 2023",
            ["2023"],
            "parcial2_2023_teoria_tema2.jpeg · Ej. 01 (IA-H0076) y compilado 29 págs. Preg. 17",
            "Relacionada con Pregs. 1, 2, 17 del Moodle 2025 y DOCX Grupo 2 (MC-2025-25).",
            "Contrasta el cálculo de error lineal de ADALINE (Widrow-Hoff) vs umbralizado del Perceptrón.",
        ),
    },
    "MC-HOP-01": {
        "anio": "2023",
        "fuente": "Basada en 2do Parcial Teórico 22/11/2023 (Ej. 05), Compilado (Pregs. 21, 36, 59) y Hoja Fórmulas",
        "tags": ["2023", "CATEDRA", "DERIVADA"],
        "ref": ref(
            "derivada_examen",
            "Derivada de 2do Parcial Teórico y Hoja de Fórmulas",
            "22/11/2023",
            ["2023"],
            "parcial2_2023_teoria_desarrollo.jpeg (Ej. 05 · IA-H0079), hoja_de_formulas_segundo_parcial.pdf y compilado Pregs. 21, 36, 59",
            "Complementa a MC-2025-07 y MC-2025-19 del Moodle 2025.",
            "Regla de aprendizaje hebbiana W = sum(E_k^T E_k - I) y convergencia de Lyapunov.",
        ),
    },
    "MC-HOP-02": {
        "anio": None,
        "fuente": "Basada en Compendio Doctrinal de Finales (Pregs. 25 y 35 del compilado, s/f)",
        "tags": ["HISTORICO", "CATEDRA", "DERIVADA"],
        "ref": ref(
            "compendio_sin_fecha",
            "Derivada de Pregunta de Examen Final del Compilado",
            "Sin fecha exacta en el compendio",
            [],
            "preguntas_parcial2_desarrollo_compilado_29paginas.pdf · Pregs. 25 y 35 (Limitaciones de reconocimiento en Hopfield)",
            "Enumera capacidad límite, crosstalk, estados espurios, ciclos límite y patrones inversos -E_k.",
            "Pregunta temática basada en el banco oficial de preguntas de desarrollo.",
        ),
    },
    "MC-SOM-01": {
        "anio": "2025",
        "fuente": "Basada en 2do Parcial Práctico 19/11/2025 (Punto 2), Nov 2023 y Cuestionario 06 CVG (04/11/2020)",
        "tags": ["2020", "2023", "2025", "PRACTICO_2025", "DERIVADA"],
        "ref": ref(
            "derivada_examen",
            "Derivada de 2do Parcial Práctico y Cuestionario CVG",
            "19/11/2025 (y Nov 2023 / 04/11/2020)",
            ["2020", "2023", "2025"],
            "parcial2_2025_11_19_oficial.pdf (Punto 2 al 30%), parcial2_2023_tema1.jpeg (Ej. 02) y cuestionario_moodle_06_svm_hopfield_som.pdf (Preg. 5)",
            "Fórmula h = 1/(1 + dist^2) tomada textualmente en el parcial práctico del 19/11/2025.",
            "Síntesis de vecindad continua y regla de actualización en SOM.",
        ),
    },
    "MC-SOM-02": {
        "anio": "2021",
        "fuente": "Basada en Final 2da Mesa Febrero 2021 (Ej. 01 al 40%) y Compilado (Preg. 15)",
        "tags": ["2021", "CATEDRA", "DERIVADA"],
        "ref": ref(
            "derivada_examen",
            "Derivada de Examen Final Oficial",
            "Febrero 2021 (2da Mesa)",
            ["2021"],
            "final_2021_02_segunda_mesa.jpeg · Ej. 01 (40%) y compilado 29 págs. Preg. 15",
            "Compara arquitecturas SOM, Hopfield y Perceptrón Simple según grilla comparativa de finales.",
            "Pregunta temática armada desde el cuadro comparativo oficial.",
        ),
    },
    "MC-SOM-03": {
        "anio": "2023",
        "fuente": "Basada en 2do Parcial Teórico Nov 2023 Tema 1 (Ej. 04) y Compilado (Pregs. 14, 60–63)",
        "tags": ["2023", "CATEDRA", "DERIVADA"],
        "ref": ref(
            "derivada_examen",
            "Derivada de 2do Parcial Teórico y Compendio",
            "Nov 2023",
            ["2023"],
            "parcial2_2023_teoria_tema1.jpeg (Ej. 04 · IA-H0074) y compilado 29 págs. Pregs. 14 y 60–63",
            "Refuerza el criterio de vecindad topológica (4 vs 6 vecinas) y ausencia de conexiones sinápticas entre salidas (Moodle 2025 Preg. 3).",
            "Pregunta temática de arquitectura y entrenamiento SOM.",
        ),
    },
    "MC-SVM-01": {
        "anio": "2023",
        "fuente": "Basada en Final 17/02/2021 (Preg. 3), Parcial 2023 (Ej. 01) y Guía Práctica SVM",
        "tags": ["2021", "2023", "CATEDRA", "DERIVADA"],
        "ref": ref(
            "derivada_examen",
            "Derivada de Parciales Prácticos, Final y Guía Nº 5 SVM",
            "Nov 2023 (y Final 17/02/2021)",
            ["2021", "2023"],
            "parcial2_2023_tema1.jpeg (Ej. 01 · IA-H0075/IA-H0077), final_2021_02_17.pdf (Preg. 3) y guia_practica_svm.pdf",
            "Tema correspondiente a finales / planes anteriores (marcado opcional en P2 actual).",
            "Margen geométrico óptimo, vector normal w e invariancia ante vectores con alpha_i = 0.",
        ),
    },
    "MC-SVM-02": {
        "anio": "2021",
        "fuente": "Basada en Final 17/02/2021 (Preg. 3), Final 08/06/2021 (Ej. 04) y Hoja de Fórmulas",
        "tags": ["2021", "CATEDRA", "DERIVADA"],
        "ref": ref(
            "derivada_examen",
            "Derivada de Exámenes Finales y Hoja de Fórmulas",
            "17/02/2021 y 08/06/2021",
            ["2021"],
            "final_2021_02_17.pdf (Preg. 3), final_2021_06_08_mesa.png (Ej. 04) y hoja_de_formulas_segundo_parcial.pdf",
            "Reportada también en mesas finales 2024–2025 (Lista de Finales Teóricos).",
            "Cálculo de sesgo b, recta separadora, kernel trick y restricción dual sum(y_i alpha_i) = 0.",
        ),
    },
    "MC-CLU-01": {
        "anio": "2025",
        "fuente": "Basada en 2do Parcial Práctico 19/11/2025 (Punto 1 al 20%) y Nov 2023 (Ej. 04)",
        "tags": ["2023", "2025", "PRACTICO_2025", "DERIVADA"],
        "ref": ref(
            "derivada_examen",
            "Derivada de 2do Parcial Práctico Presencial",
            "19/11/2025 (y Nov 2023)",
            ["2023", "2025"],
            "parcial2_2025_11_19_oficial.pdf (Punto 1 al 20%) y parcial2_2023_tema1.jpeg (Ej. 04)",
            "Complementa a Preg. 4 del Moodle 2025 (MC-2025-04).",
            "Pasos de clustering jerárquico aglomerativo, efecto cadena, compacidad e interpretación del dendrograma.",
        ),
    },
    "MC-CLU-02": {
        "anio": "2025",
        "fuente": "Basada en 2do Parcial Práctico 19/11/2025 (Pto. 1) y 2do Parcial Nov 2023 (Ej. 04 / Teo Ej. 02)",
        "tags": ["2023", "2025", "PRACTICO_2025", "DERIVADA"],
        "ref": ref(
            "derivada_examen",
            "Derivada de Parciales Prácticos Presenciales",
            "19/11/2025 (y Nov 2023)",
            ["2023", "2025"],
            "parcial2_2025_11_19_oficial.pdf (Punto 1), parcial2_2023_tema1.jpeg (Ej. 04) y parcial2_2023_teoria_tema1.jpeg (Ej. 02)",
            "Ejemplifica el cálculo cruzado entre clusters {A,C} y {B,D} en Average-Link vs Single/Complete-Link.",
            "Pregunta analítica derivada de los parciales prácticos de Clustering.",
        ),
    },
    "MC-KM-01": {
        "anio": "2023",
        "fuente": "Basada en Recuperatorio 2do Parcial Nov 2023 (Ej. 02) y Compilado (Pregs. 18, 70, 71)",
        "tags": ["2023", "CATEDRA", "DERIVADA"],
        "ref": ref(
            "derivada_examen",
            "Derivada de Recuperatorio 2do Parcial Teórico",
            "Nov 2023",
            ["2023"],
            "parcial2_2023_teoria_tema2.jpeg (Ej. 02 · IA-H0076), hoja_de_formulas_segundo_parcial.pdf y compilado Pregs. 18, 70, 71",
            "Responde directamente a cómo evitar el sobreajuste (valores altos de k) y cuándo finaliza K-Means.",
            "Pregunta temática basada en el recuperatorio teórico de Noviembre 2023.",
        ),
    },
    "MC-KM-02": {
        "anio": "2021",
        "fuente": "Basada en Final 17/02/2021 (Teoría Preg. 6 y Práctica Ej. 4) y Guía Práctica Clustering",
        "tags": ["2021", "CATEDRA", "DERIVADA"],
        "ref": ref(
            "derivada_examen",
            "Derivada de Examen Final Oficial y Guía Práctica",
            "17/02/2021",
            ["2021"],
            "final_2021_02_17.pdf (Teoría Preg. 6 y Práctica Ej. 4), compilado Preg. 32 y guia_practica_clustering.pdf",
            "Compara particionamiento plano en K-Means frente a jerarquía irrevocable en clustering aglomerativo.",
            "Pregunta temática derivada de final teórico-práctico y guía oficial.",
        ),
    },
    "MC-KNN-01": {
        "anio": "2023",
        "fuente": "Basada en Recuperatorio Nov 2023 (Ej. 05), Recup Virtual Nov 2020 y Compilado (Pregs. 20, 22)",
        "tags": ["2020", "2023", "CATEDRA", "DERIVADA"],
        "ref": ref(
            "derivada_examen",
            "Derivada de Recuperatorios 2do Parcial Teórico/Práctico",
            "Nov 2020 y Nov 2023",
            ["2020", "2023"],
            "parcial2_2023_teoria_tema2.jpeg (Ej. 05 · IA-H0076), parcial2_2020_recup_virtual.jpeg (IA-H0124, k-fold) y compilado Pregs. 20 y 22",
            "Integra el análisis teórico de k = m + n en k-NN ponderado con la selección de k por Leave-One-Out.",
            "Pregunta temática armada desde consignas reales de recuperatorios.",
        ),
    },
    "MC-GEN-01": {
        "anio": None,
        "fuente": "Basada en Compendio Doctrinal de Finales (Pregs. 24 y 26 del compilado, s/f)",
        "tags": ["HISTORICO", "CATEDRA", "DERIVADA"],
        "ref": ref(
            "compendio_sin_fecha",
            "Derivada de Preguntas de Examen Final del Compilado",
            "Sin fecha exacta en el compendio",
            [],
            "preguntas_parcial2_desarrollo_compilado_29paginas.pdf · Pregs. 24 y 26",
            "Consolida aprendizaje supervisado vs por refuerzo y valores iniciales optimistas.",
            "Pregunta temática basada en dos preguntas clásicas del banco de desarrollo.",
        ),
    },
}


def main():
    json_dev = os.path.join(REPO_DEV, "preguntas_quiz.json")
    json_fac = os.path.join(REPO_FAC, "preguntas_quiz.json")
    js_dev = os.path.join(REPO_DEV, "docs", "data", "preguntas.js")

    with open(json_dev, "r", encoding="utf-8") as f:
        data = json.load(f)

    by_base, all_paths = build_repo_index()
    assert len(data) == 87, f"Esperado 87 preguntas, hay {len(data)}"

    for idx, q in enumerate(data, 1):
        q["nro"] = idx
        qid = q["id"]

        if qid.startswith("MC-2025-"):
            num = int(qid.split("-")[-1])
            q["anio"] = "2025"
            q["tags"] = ["2025", "OFICIAL", "PARCIAL_2", "PARCIAL_2025"]
            if num <= 20:
                extra = MOODLE_2025_ANIOS_EXTRA.get(qid)
                anios = extra[0] if extra else ["2025"]
                ant = extra[1] if extra else "Forma parte del intento completo oficial del 19/11/2025."
                q["fuente"] = f"2do Parcial Oficial UTN FRRe · Moodle 19/11/2025 (Preg. {num})"
                q["origen"] = q["fuente"]
                if "2020" in anios:
                    q["tags"].append("MOODLE_CVG_2020")
                q["referencia_historica"] = ref(
                    "verificada_examen",
                    "2do Parcial Teórico Oficial (Moodle)",
                    "19/11/2025",
                    anios,
                    f"parcial2_2025_11_19_teoria_moodle_oficial.pdf · Pregunta {num}",
                    ant,
                    "Consigna y opciones oficiales extraídas del examen en Campus Virtual (CVG).",
                )
            else:
                g2_p = GRUPO2_INDEX[qid]
                extra = MOODLE_2025_ANIOS_EXTRA.get(qid)
                anios = extra[0] if extra else ["2025"]
                ant = extra[1] if extra else "Variante del banco de preguntas Moodle 2do Parcial 2025."
                q["fuente"] = f"2do Parcial Oficial UTN FRRe · Grupo 2 Moodle 2025 ({g2_p})"
                q["origen"] = q["fuente"]
                if "2020" in anios:
                    q["tags"].append("MOODLE_CVG_2020")
                q["referencia_historica"] = ref(
                    "verificada_examen",
                    "2do Parcial Teórico Oficial (Grupo 2 · Moodle)",
                    "2025 (cohorte 19/11/2025)",
                    anios,
                    f"BANCO_TEORIA_Y_MC/parcial2_2025_grupo2_moodle.md · {g2_p} (transcripción de Preguntas Segundo parcial Grupo 2 .docx)",
                    ant,
                    "Consigna oficial recopilada de otro grupo del mismo 2do Parcial Moodle 2025.",
                )
        else:
            spec = HISTORICAL_MAP.get(qid)
            assert spec is not None, f"Falta mapeo histórico para {qid}"
            q["anio"] = spec["anio"]
            q["fuente"] = spec["fuente"]
            q["origen"] = spec["fuente"]
            q["tags"] = spec["tags"]
            q["referencia_historica"] = dict(spec["ref"])

        q["referencia_historica"]["archivos_repo"] = resolve_repo_files(qid, q, by_base, all_paths)

    # Resumen verificable en consola
    by_estado = {}
    anios_count = {}
    total_links = 0
    for q in data:
        est = q["referencia_historica"]["estado"]
        by_estado[est] = by_estado.get(est, 0) + 1
        total_links += len(q["referencia_historica"]["archivos_repo"])
        for a in q["referencia_historica"]["anios"]:
            anios_count[a] = anios_count.get(a, 0) + 1

    print("Resumen por estado de trazabilidad:", by_estado)
    print("Preguntas con registro por año:", dict(sorted(anios_count.items())))
    print("Total de links verificados al repo:", total_links)

    for path in [json_dev, json_fac]:
        if os.path.exists(os.path.dirname(path)):
            with open(path, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            print(f"[OK] Guardado {path}")

    with open(js_dev, "w", encoding="utf-8") as f:
        f.write("window.PREGUNTAS = " + json.dumps(data, indent=2, ensure_ascii=False) + ";\n")
    print(f"[OK] Sincronizado {js_dev}")


if __name__ == "__main__":
    main()
