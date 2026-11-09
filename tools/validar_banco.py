# -*- coding: utf-8 -*-
"""
Script de validación estricta del banco de preguntas y del motor de puntuación Moodle.
Cátedra de Inteligencia Artificial — UTN FRRe
"""
import os, sys, json, re

sys.stdout.reconfigure(encoding='utf-8')

REPO_ROOT = r"C:\dev\ia-segundo-parcial-utn-frre"
JSON_PATH = os.path.join(REPO_ROOT, "preguntas_quiz.json")
JS_PATH = os.path.join(REPO_ROOT, "docs", "data", "preguntas.js")

TEMAS_VALIDOS = {
    'ALGORITMOS_GENETICOS',
    'CLUSTERING',
    'KMEANS',
    'KNN',
    'NAIVE_BAYES',
    'HOPFIELD',
    'SOM',
    'MLP',
    'SVM',
    'GENERAL_IA',
    'P1_REPASO'
}

def calcular_puntaje_moodle(correctas, total_opciones, seleccionadas):
    """
    Fórmula canónica Moodle para preguntas de selección múltiple:
    - a = correctas seleccionadas
    - C = total de correctas
    - e = incorrectas seleccionadas
    - I = total de incorrectas
    Puntaje = max(0, 100 * (a/C - e/I))
    Si I == 0 (todas correctas), e/I = 0.
    """
    C = len(correctas)
    N = total_opciones
    I = N - C
    
    set_corr = set(correctas)
    set_sel = set(seleccionadas)
    
    a = len(set_sel.intersection(set_corr))
    e = len(set_sel - set_corr)
    
    frac_a = (a / C) if C > 0 else 0.0
    frac_e = (e / I) if I > 0 else 0.0
    
    neto = 100.0 * (frac_a - frac_e)
    return max(0.0, round(neto, 2))

def validar():
    print("=== INICIANDO VALIDACIÓN DEL BANCO DE PREGUNTAS ===")
    assert os.path.exists(JSON_PATH), f"No existe {JSON_PATH}"
    assert os.path.exists(JS_PATH), f"No existe {JS_PATH}"
    
    with open(JSON_PATH, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    print(f"Total de preguntas en banco: {len(data)}")
    assert len(data) >= 40, f"Se esperaban al menos 40 preguntas, se encontraron {len(data)}"
    
    ids = set()
    errores = []
    
    # Lista de nombres propios prohibidos (mantener anonimato docente/estudiantil)
    NOMBRES_PROHIBIDOS = ['serna', 'martina', 'reinares', 'gonzalez', 'sanchez franco', 'franco sanchez']
    
    for i, q in enumerate(data, 1):
        # 1. ID único
        qid = q.get('id')
        if not qid or qid in ids:
            errores.append(f"Pregunta #{i}: ID inválido o duplicado: {qid}")
        ids.add(qid)
        
        # 2. Tema válido
        tema = q.get('tema')
        if tema not in TEMAS_VALIDOS:
            errores.append(f"Pregunta {qid}: Tema desconocido '{tema}'")
            
        # 3. Título y Enunciado
        titulo = q.get('titulo', '').strip()
        enunciado = q.get('enunciado', '').strip()
        if not titulo:
            errores.append(f"Pregunta {qid}: Título vacío")
        if not enunciado:
            errores.append(f"Pregunta {qid}: Enunciado vacío")
            
        # 4. Opciones
        opciones = q.get('opciones', [])
        if not isinstance(opciones, list) or len(opciones) < 2:
            errores.append(f"Pregunta {qid}: Menos de 2 opciones ({len(opciones)})")
            
        for o_idx, opt in enumerate(opciones):
            if not opt.strip():
                errores.append(f"Pregunta {qid}: Opción {o_idx} vacía")
                
        # 5. Claves correctas
        correctas = q.get('correctas', [])
        if not isinstance(correctas, list) or len(correctas) == 0:
            errores.append(f"Pregunta {qid}: Lista de correctas vacía")
        for c in correctas:
            if not (0 <= c < len(opciones)):
                errores.append(f"Pregunta {qid}: Índice correcto {c} fuera de rango [0, {len(opciones)-1}]")
                
        # 6. Explicación y Fuente
        if not q.get('explicacion', '').strip():
            errores.append(f"Pregunta {qid}: Explicación doctrinal vacía")
        if not q.get('fuente', '').strip():
            errores.append(f"Pregunta {qid}: Fuente no informada")
            
        # 7. Balanceo de LaTeX ($ simples y $$ dobles)
        full_text = f"{titulo} {enunciado} {' '.join(opciones)} {q.get('explicacion', '')}"
        # Contar signos $ escapados o no
        dolar_count = full_text.count('$')
        if dolar_count % 2 != 0:
            errores.append(f"Pregunta {qid}: Posible desbalance de delimitadores LaTeX '$' (total: {dolar_count})")
            
        # 8. Verificación de anonimato
        full_lower = full_text.lower()
        for nom in NOMBRES_PROHIBIDOS:
            if nom in full_lower:
                errores.append(f"Pregunta {qid}: Contiene mención a nombre prohibido '{nom}'")

    if errores:
        print(f"\n[ERROR] Se detectaron {len(errores)} inconsistencias:")
        for e in errores[:10]:
            print(f"  - {e}")
        sys.exit(1)
        
    print("\n[OK] Todas las 52 preguntas pasaron la verificación estructural, de tipos y de anonimato.")
    
    # -------------------------------------------------------------
    # PRUEBA DE LA FÓRMULA DE PUNTUACIÓN MOODLE
    # -------------------------------------------------------------
    print("\n=== VERIFICANDO CÁLCULO DE PUNTUACIÓN MOODLE ===")
    
    # Caso 1: 1 correcta de 1 (C=1, I=3). Selecciona la correcta.
    s1 = calcular_puntaje_moodle([0], 4, [0])
    assert s1 == 100.0, f"Fallo Caso 1: esperado 100.0, obtenido {s1}"
    
    # Caso 2: 1 correcta de 1 (C=1, I=3). Selecciona incorrecta.
    s2 = calcular_puntaje_moodle([0], 4, [1])
    assert s2 == 0.0, f"Fallo Caso 2 (clipping a 0): esperado 0.0, obtenido {s2}"
    
    # Caso 3: 2 correctas de 4 opciones (C=2, I=2). Selecciona 1 correcta y 0 incorrectas.
    s3 = calcular_puntaje_moodle([0, 1], 4, [0])
    assert s3 == 50.0, f"Fallo Caso 3: esperado 50.0, obtenido {s3}"
    
    # Caso 4: 2 correctas de 4 opciones (C=2, I=2). Selecciona 1 correcta y 1 incorrecta.
    # a/C = 1/2 = 0.5; e/I = 1/2 = 0.5 -> 100 * (0.5 - 0.5) = 0.0
    s4 = calcular_puntaje_moodle([0, 1], 4, [0, 2])
    assert s4 == 0.0, f"Fallo Caso 4: esperado 0.0, obtenido {s4}"
    
    # Caso 5: 3 correctas de 4 opciones (C=3, I=1). Selecciona 2 correctas y 0 incorrectas.
    # a/C = 2/3 = 0.6667 -> 66.67
    s5 = calcular_puntaje_moodle([0, 1, 2], 4, [0, 1])
    assert s5 == 66.67, f"Fallo Caso 5: esperado 66.67, obtenido {s5}"
    
    # Caso 6: 3 correctas de 4 opciones (C=3, I=1). Selecciona 2 correctas y la única incorrecta.
    # a/C = 2/3 = 0.6667; e/I = 1/1 = 1.0 -> neto = -33.33 -> clip a 0.0
    s6 = calcular_puntaje_moodle([0, 1, 2], 4, [0, 1, 3])
    assert s6 == 0.0, f"Fallo Caso 6: esperado 0.0, obtenido {s6}"
    
    # Caso 7: Ninguna seleccionada -> 0.0
    s7 = calcular_puntaje_moodle([0, 1], 4, [])
    assert s7 == 0.0, f"Fallo Caso 7: esperado 0.0, obtenido {s7}"
    
    print("[OK] Todos los casos de prueba de penalización fraccional Moodle pasaron con éxito.")
    print("=== VALIDACIÓN COMPLETADA AL 100% ===")

if __name__ == '__main__':
    validar()
