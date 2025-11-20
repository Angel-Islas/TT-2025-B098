import numpy as np
import pandas as pd
import random
from collections import defaultdict
import re

def contar_horas_libres(path, Id_horario):
    dias_semana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"]
    from matrix_generator import horarios  

    bloques_por_dia = {dia: [] for dia in dias_semana}

    for item in path:
        h = Id_horario[item['node']].strip().strip("'")
        if h in horarios:
            bloques = horarios[h]
            for i, bloque in enumerate(bloques):
                if bloque != "-":
                    inicio, fin = bloque.split(" - ")
                    inicio, fin = float(inicio), float(fin)
                    bloques_por_dia[dias_semana[i]].append((inicio, fin))

    horas_libres_total = 0
    for bloques in bloques_por_dia.values():
        if not bloques:
            continue
        bloques.sort(key=lambda x: x[0])
        for i in range(len(bloques) - 1):
            fin_actual = bloques[i][1]
            inicio_siguiente = bloques[i+1][0]
            if inicio_siguiente > fin_actual:
                horas_libres_total += inicio_siguiente - fin_actual
    return horas_libres_total


# ==============================
# ACO Solver
# ==============================
def run_aco_solver(csv_path='CSV/completa.csv', max_iter=10, num_ants=5, carga_academica=None):
    try:
        df = pd.read_csv(csv_path, header=0)

        # Extraemos los nodos y datos relevantes
        node_info = df.iloc[:, 0].astype(str).tolist()
        Id_materia = [re.search(r"\('?(.*?)',", n).group(1) if re.search(r"\('?(.*?)',", n) else "?" for n in node_info]
        Id_horario = [re.search(r", '?(H\d+)'?", n).group(1) if re.search(r", '?(H\d+)'?", n) else "?" for n in node_info]

        # Extraer créditos (ya incluidos en el CSV)
        if "creditos" in df.columns:
            creditos = df["creditos"].astype(float).tolist()
        else:
            creditos = [0.0] * len(Id_materia)

        # Convertir la matriz
        matriz = df.iloc[:, 1:].values.astype(float)
        matriz = np.nan_to_num(matriz, nan=0.0, posinf=0.0, neginf=0.0)

        # Parámetros ACO
        alpha, beta, gamma = 1.0, 2.0, 0.3  # gamma controla peso de créditos en la heurística
        rho, Q, tau_min, tau_max = 0.1, 1.0, 0.1, 1.0
        num_nodes = matriz.shape[0]

        pheromone = np.ones((num_nodes, num_nodes)) * tau_max
        np.fill_diagonal(pheromone, 0)

        start_node = next((i for i, node in enumerate(Id_materia) if "Nido" in node), None)
        if start_node is None:
            raise ValueError("No se encontró el nodo Nido en los datos.")

        # ------------------------------
        # Funciones auxiliares
        # ------------------------------
        def calculate_probabilities(current_node, allowed_nodes):
            probabilities = []
            total = 0.0
            epsilon = 1e-10
            for node in allowed_nodes:
                if matriz[current_node][node] > 0:
                    pheromone_value = pheromone[current_node][node] ** alpha
                    heuristic_distance = (1.0 / (matriz[current_node][node] + epsilon)) ** beta
                    heuristic_creditos = (1 + creditos[node]) ** gamma  # materias con más créditos más atractivas
                    value = pheromone_value * heuristic_distance * heuristic_creditos
                    total += value
                    probabilities.append((node, value))
                else:
                    probabilities.append((node, 0.0))
            if total > 0:
                probabilities = [(n, v / total) for n, v in probabilities]
            return probabilities

        def select_next_node_roulette(probabilities):
            nodes, probs = zip(*probabilities) if probabilities else ([], [])
            if not nodes or sum(probs) == 0:
                return random.choice(nodes) if nodes else None
            return random.choices(nodes, weights=probs, k=1)[0]

        def is_final_node(current_node, allowed_nodes, visited_materias, visited_horarios):
            return not any(
                Id_materia[n] not in visited_materias and
                Id_horario[n] not in visited_horarios and
                matriz[current_node][n] > 0 for n in allowed_nodes
            )

        # ------------------------------
        # Gestión de soluciones
        # ------------------------------
        top_solutions = []

        def add_solution_if_unique(path, distance, unique_nodes):
            nonlocal top_solutions
            signature = frozenset((Id_materia[item['node']], Id_horario[item['node']]) for item in path)
            if any(sol['signature'] == signature for sol in top_solutions):
                return
            top_solutions.append({'path': path, 'distance': distance, 'unique_nodes': unique_nodes, 'signature': signature})
            top_solutions.sort(key=lambda x: (-x['unique_nodes'], x['distance']))
            top_solutions = top_solutions[:10]

        # ------------------------------
        # Ejecución ACO
        # ------------------------------
        for _ in range(max_iter):
            for _ in range(num_ants):
                current_node = start_node
                path = [{'node': current_node, 'weight': 0.0}]
                allowed = set(range(num_nodes)) - {current_node}
                visited_materias = {Id_materia[current_node]}
                visited_horarios = {Id_horario[current_node]}
                distance = 0.0

                while True:
                    if is_final_node(current_node, allowed, visited_materias, visited_horarios):
                        break
                    allowed_filtered = [
                        n for n in allowed
                        if Id_materia[n] not in visited_materias and
                        Id_horario[n] not in visited_horarios and
                        matriz[current_node][n] > 0
                    ]
                    if not allowed_filtered:
                        break
                    next_node = select_next_node_roulette(calculate_probabilities(current_node, allowed_filtered))
                    if next_node is None:
                        break
                    weight = matriz[current_node][next_node]
                    path.append({'node': next_node, 'weight': weight})
                    distance += weight
                    allowed.remove(next_node)
                    visited_materias.add(Id_materia[next_node])
                    visited_horarios.add(Id_horario[next_node])
                    current_node = next_node
                add_solution_if_unique(path, distance, len(visited_materias))

            # Actualización feromonas
            if top_solutions:
                best_path = top_solutions[0]['path']
                best_distance = top_solutions[0]['distance']
                pheromone *= (1 - rho)
                if best_distance > 0:
                    for i in range(len(best_path) - 1):
                        u, v = best_path[i]['node'], best_path[i+1]['node']
                        pheromone[u][v] += Q / best_distance
                pheromone = np.clip(pheromone, tau_min, tau_max)

        # ------------------------------
        # Resultados finales
        # ------------------------------
        result = []
        for sol in top_solutions:
            horas_libres = contar_horas_libres(sol['path'], Id_horario)
            suma_creditos = sum(creditos[item['node']] for item in sol['path'])
            result.append({
                "ruta": [
                    {
                        'id_materia': Id_materia[item['node']],
                        'id_horario': Id_horario[item['node']],
                        'peso_conexion': item['weight'],
                        'creditos': creditos[item['node']]
                    } for item in sol['path']
                ],
                "nodos_unicos": sol['unique_nodes'],
                "peso": sol['distance'],
                "horas_libres": horas_libres,
                "creditos_totales": suma_creditos
            })

        # ------------------------------
        # Recorte según carga académica
        # ------------------------------
        if carga_academica:
            limite_materias = {
                'minima': 4,
                'media': 6,
                'maxima': None  # No se recorta
            }.get(carga_academica, None)

            if limite_materias is not None:
                for sol in result:
                    ruta_filtrada = [
                        mat for mat in sol['ruta'] if 'Nido' not in mat['id_materia']
                    ]
                    if len(ruta_filtrada) > limite_materias:
                        # Ordenar por id_horario descendente (H más alto = más tarde)
                        ruta_filtrada.sort(key=lambda x: int(re.search(r'H(\d+)', x['id_horario']).group(1)), reverse=True)
                        # Mantener solo las primeras n materias
                        ruta_filtrada = ruta_filtrada[:limite_materias]
                        # Volver a agregar Nido al inicio
                        ruta_filtrada = [mat for mat in sol['ruta'] if 'Nido' in mat['id_materia']] + ruta_filtrada
                        # Actualizar la solución
                        sol['ruta'] = ruta_filtrada
                        sol['creditos_totales'] = sum(mat['creditos'] for mat in ruta_filtrada)
                        sol['nodos_unicos'] = len(ruta_filtrada)

        result.sort(key=lambda x: (x['horas_libres'], -x['creditos_totales']))
        return result

    except Exception as e:
        import traceback
        print('Error en run_aco_solver:', e)
        traceback.print_exc()
        raise


if __name__ == "__main__":
    soluciones = run_aco_solver(carga_academica='media')
    for s in soluciones:
        print(f"Materias: {len(s['ruta'])} | Créditos: {s['creditos_totales']} | Horas libres: {s['horas_libres']:.2f}")
        for r in s['ruta']:
            print(f"  {r['id_materia']} - {r['id_horario']} ({r['creditos']} créditos)")
        print("-" * 60)
