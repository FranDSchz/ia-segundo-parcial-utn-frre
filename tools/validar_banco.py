# -*- coding: utf-8 -*-
"""
Script de validación estricta del banco de preguntas, integridad documental,
anonimato criptográfico (SHA-256) y motor de puntuación Moodle.
Cátedra de Inteligencia Artificial — UTN FRRe
"""
import os, sys, json, re, hashlib, unicodedata

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

# Hashes SHA-256 de tokens de anonimato institucional (sin almacenar nombres en texto plano)
HASHES_ANONIMATO_PROHIBIDOS = {
    '7643d74c277a0987c1d189567b13781112b91e9863f209b4a9cb33195eb6bfb6',
    '16b02287e8a9f1d5bb5a4afacaf6ac7124c62846bad58d8f48acc27598a2cb7a',
    '0fd18146fd379dff877fe51cc0092120b12bca2f9fdcd3fad1748da01ad6d47d',
    'b59a2aa4cfb38f4a6dfb1ebe4ef42c1b321afb7543086910c06e8c74f115d1e9',
    'b7db16f39e93350901f92db7496afde7bc0500e24806e99808ccf3721d03c4c8',
    '81cce9877ae92eec72d542d39c57e3f923bc5a13ae5fcbad097498bc866f1279',
}

PATRON_SPOILER_OPCION = re.compile(
    r'(\[(?:FALSO|VERDADERO|CLAVE)|\b(?:Falso|Verdadero|Correcto|Correcta|Incorrecto)\s*\.?\s*$|\\to\s*(?:Falso|Verdadero|Correcto)|->\s*(?:Falso|Verdadero|Correcto))',
    re.I
)

def normalizar_ascii(texto):
    nfkd = unicodedata.normalize('NFKD', texto.lower())
    return ''.join(c for c in nfkd if not unicodedata.combining(c))

def verificar_anonimato_sha256(texto):
    """Verifica mediante ventanas de 1 y 2 palabras que ningún token coincida con hashes prohibidos."""
    palabras = re.findall(r'[a-z]+', normalizar_ascii(texto))
    for i, w in enumerate(palabras):
        h1 = hashlib.sha256(w.encode('utf-8')).hexdigest()
        if h1 in HASHES_ANONIMATO_PROHIBIDOS:
            return False, w
        if i + 1 < len(palabras):
            bi = f"{w} {palabras[i+1]}"
            h2 = hashlib.sha256(bi.encode('utf-8')).hexdigest()
            if h2 in HASHES_ANONIMATO_PROHIBIDOS:
                return False, bi
    return True, None

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
    print("=== INICIANDO VALIDACIÓN INTEGRAL DEL BANCO Y REPOSITORIO ===")
    assert os.path.exists(JSON_PATH), f"No existe {JSON_PATH}"
    assert os.path.exists(JS_PATH), f"No existe {JS_PATH}"
    
    with open(JSON_PATH, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    print(f"Total de preguntas en banco: {len(data)}")
    assert len(data) >= 45, f"Se esperaban al menos 45 preguntas únicas, se encontraron {len(data)}"
    
    ids = set()
    stems_vistos = set()
    errores = []
    
    for i, q in enumerate(data, 1):
        qid = q.get('id')
        if not qid or qid in ids:
            errores.append(f"Pregunta #{i}: ID inválido o duplicado: {qid}")
        ids.add(qid)
        
        tema = q.get('tema')
        if tema not in TEMAS_VALIDOS:
            errores.append(f"Pregunta {qid}: Tema desconocido '{tema}'")
            
        titulo = q.get('titulo', '').strip()
        enunciado = q.get('enunciado', '').strip()
        if not titulo:
            errores.append(f"Pregunta {qid}: Título vacío")
        if not enunciado:
            errores.append(f"Pregunta {qid}: Enunciado vacío")
            
        # Verificar no duplicación semántica por enunciado + primera opción
        opciones = q.get('opciones', [])
        if not isinstance(opciones, list) or len(opciones) < 2:
            errores.append(f"Pregunta {qid}: Menos de 2 opciones ({len(opciones)})")
            
        firma = re.sub(r'\W+', '', (enunciado + (opciones[0] if opciones else '')).lower())
        if firma in stems_vistos:
            errores.append(f"Pregunta {qid}: Enunciado/opción duplicado detectado")
        stems_vistos.add(firma)
            
        for o_idx, opt in enumerate(opciones):
            if not opt.strip():
                errores.append(f"Pregunta {qid}: Opción {o_idx} vacía")
            if PATRON_SPOILER_OPCION.search(opt):
                errores.append(f"Pregunta {qid}: Opción {o_idx} contiene spoiler de respuesta: '{opt}'")
                
        correctas = q.get('correctas', [])
        if not isinstance(correctas, list) or len(correctas) == 0:
            errores.append(f"Pregunta {qid}: Lista de correctas vacía")
        for c in correctas:
            if not (0 <= c < len(opciones)):
                errores.append(f"Pregunta {qid}: Índice correcto {c} fuera de rango [0, {len(opciones)-1}]")
                
        if not q.get('explicacion', '').strip():
            errores.append(f"Pregunta {qid}: Explicación doctrinal vacía")
        if not q.get('fuente', '').strip():
            errores.append(f"Pregunta {qid}: Fuente no informada")
            
        full_text = f"{titulo} {enunciado} {' '.join(opciones)} {q.get('explicacion', '')}"
        dolar_count = full_text.count('$')
        if dolar_count % 2 != 0:
            errores.append(f"Pregunta {qid}: Posible desbalance de delimitadores LaTeX '$' (total: {dolar_count})")
            
        ok_anon, token_infractor = verificar_anonimato_sha256(full_text)
        if not ok_anon:
            errores.append(f"Pregunta {qid}: Violación de anonimato detectada ('{token_infractor}')")

    # Auditoría de archivos del repositorio (bytes corruptos, enlaces externos y anonimato)
    for dirpath, _, filenames in os.walk(REPO_ROOT):
        if '.git' in dirpath.split(os.sep):
            continue
        for fn in filenames:
            if fn.endswith(('.md', '.js', '.json', '.html', '.css', '.py')):
                fpath = os.path.join(dirpath, fn)
                rel = os.path.relpath(fpath, REPO_ROOT)
                with open(fpath, 'rb') as bf:
                    raw = bf.read()
                if b'\x00' in raw or b'\x07' in raw:
                    errores.append(f"Archivo {rel}: Contiene bytes de control corruptos (\\x00 o \\x07)")
                txt = raw.decode('utf-8', errors='replace')
                if fn.endswith('.md') and ('file:///' + 'c:/facultad') in txt.lower():
                    errores.append(f"Archivo {rel}: Contiene enlace local externo roto a c:/facultad")
                ok_anon, tok = verificar_anonimato_sha256(txt)
                if not ok_anon:
                    errores.append(f"Archivo {rel}: Violación de anonimato detectada ('{tok}')")

    if errores:
        print(f"\n[ERROR] Se detectaron {len(errores)} inconsistencias:")
        for e in errores[:15]:
            print(f"  - {e}")
        sys.exit(1)
        
    print(f"\n[OK] Todas las {len(data)} preguntas únicas y los archivos del repositorio pasaron la verificación estructural, de spoilers, de bytes y de anonimato SHA-256.")
    
    # -------------------------------------------------------------
    # PRUEBA DE LA FÓRMULA DE PUNTUACIÓN MOODLE
    # -------------------------------------------------------------
    print("\n=== VERIFICANDO CÁLCULO DE PUNTUACIÓN MOODLE ===")
    
    s1 = calcular_puntaje_moodle([0], 4, [0])
    assert s1 == 100.0, f"Fallo Caso 1: esperado 100.0, obtenido {s1}"
    
    s2 = calcular_puntaje_moodle([0], 4, [1])
    assert s2 == 0.0, f"Fallo Caso 2 (clipping a 0): esperado 0.0, obtenido {s2}"
    
    s3 = calcular_puntaje_moodle([0, 1], 4, [0])
    assert s3 == 50.0, f"Fallo Caso 3: esperado 50.0, obtenido {s3}"
    
    s4 = calcular_puntaje_moodle([0, 1], 4, [0, 2])
    assert s4 == 0.0, f"Fallo Caso 4: esperado 0.0, obtenido {s4}"
    
    s5 = calcular_puntaje_moodle([0, 1, 2], 4, [0, 1])
    assert s5 == 66.67, f"Fallo Caso 5: esperado 66.67, obtenido {s5}"
    
    s6 = calcular_puntaje_moodle([0, 1, 2], 4, [0, 1, 3])
    assert s6 == 0.0, f"Fallo Caso 6: esperado 0.0, obtenido {s6}"
    
    s7 = calcular_puntaje_moodle([0, 1], 4, [])
    assert s7 == 0.0, f"Fallo Caso 7: esperado 0.0, obtenido {s7}"
    
    print("[OK] Todos los casos de prueba de penalización fraccional Moodle pasaron con éxito.")
    print("=== VALIDACIÓN COMPLETADA AL 100% ===")

if __name__ == '__main__':
    validar()
