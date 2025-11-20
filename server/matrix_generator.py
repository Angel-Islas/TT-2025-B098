import pandas as pd
import numpy as np

horarios = {
    "H1": ("7 - 8.5", "-", "-", "7 - 8.5", "8.5 - 10"),
    "H2": ("-", "7 - 8.5", "7 - 8.5", "-", "7 - 8.5"),
    "H3": ("7 - 8.5", "12 - 13.5", "-", "7 - 8.5", "8.5 - 10"),
    "H4": ("-", "10.5 - 12", "10.5 - 12", "13.5 - 15", "10.5 - 12"),
    "H5": ("8.5 - 10", "-", "8.5 - 10", "8.5 - 10", "-"),
    "H6": ("8.5 - 10", "-", "8.5 - 10", "8.5 - 10", "12 - 13.5"),
    "H7": ("-", "10.5 - 12", "10.5 - 12", "-", "10.5 - 12"),
    "H8": ("10.5 - 12", "8.5 - 10", "-", "10.5 - 12", "-"),
    "H9": ("10.5 - 12", "8.5 - 10", "-", "10.5 - 12", "12 - 13.5"),
    "H10": ("13.5 - 15", "7 - 8.5", "7 - 8.5", "-", "7 - 8.5"),
    "H11": ("12 - 13.5", "12 - 13.5", "12 - 13.5", "12 - 13.5", "-"),
    "H12": ("12 - 13.5", "-", "12 - 13.5", "12 - 13.5", "-"),
    "H13": ("-", "12 - 13.5", "13.5 - 15", "-", "12 - 13.5"),
    "H16": ("-", "13.5 - 15", "-", "13.5 - 15", "13.5 - 15"),
    "H17": ("13.5 - 15", "13.5 - 15", "13.5 - 15", "-", "13.5 - 15"),
    "H18": ("13.5 - 15", "13.5 - 15", "-", "13.5 - 15", "-"),
    "H19": ("15 - 16.5", "-", "-", "15 - 16.5", "15 - 16.5"),
    "H20": ("-", "15 - 16.5", "15 - 16.5", "-", "15 - 16.5"),
    "H21": ("-", "15 - 16.5", "15 - 16.5", "13.5 - 15", "15 - 16.5"),
    "H22": ("15 - 16.5", "-", "-", "15 - 16.5", "16.5 - 18"),
    "H23": ("15 - 16.5", "13.5 - 15", "-", "15 - 16.5", "16.5 - 18"),
    "H24": ("16.5 - 18", "-", "16.5 - 18", "16.5 - 18", "-"),
    "H26": ("16.5 - 18", "-", "16.5 - 18", "16.5 - 18", "13.5 - 15"),
    "H28": ("18.5 - 20", "16.5 - 18", "-", "18.5 - 20", "-"),
    "H29": ("-", "18.5 - 20", "18.5 - 20", "-", "18.5 - 20"),
    "H30": ("18.5 - 20", "16.5 - 18", "13.5 - 15", "18.5 - 20", "-"),
    "H32": ("-", "16.5 - 18", "16.5 - 18", "-", "13.5 - 15"),
    "H33": ("-", "18.5 - 21.5", "18.5 - 20", "-", "-"),
    "H34": ("20 - 21.5", "-", "20 - 21.5", "20 - 21.5", "-"),
    "H40": ("12:00-13:30","-","12:00-13:30","-","-"),
    "H41": ("-","10:30-12:00","10:30-12:00","-","-"),
    "H42": ("12:00-13:30","-","-","12:00-13:30","-"),
    "H43": ("10:30-12:00","-","-","10:30-12:00","-"),
    "H44": ("18:30-20:00","16:30-18:00","-","-","-"),
    "H45": ("20:00-21:30","-","20:00-21:30","-","-"),
    "H46": ("16:30-18:00","-","-","16:30-18:00","-")
}

def extraer_semestre(id_materia):
    try:
        return int(id_materia.split("-")[1][0])
    except:
        return None


def generate_adjacency_matrix(csv_input_path='CSV/horarios.csv', csv_output_path='CSV/completa.csv', horario_nido='H1', horario_minimo='H1', turno=None, semestre=None, carga_academica=None):
    data = pd.read_csv(csv_input_path)

    # Agrega la columna de semestre
    data['Semestre'] = data['Id_materia'].apply(extraer_semestre)
    if semestre is not None:
        data = data[data['Semestre'] == semestre]

    # Mapea horarios
    data['Horario'] = data['Id_horario'].map(horarios)

    # Construye los nodos incluyendo los créditos
    nodes = data.apply(lambda row: (row['Id_materia'], row['Id_horario'], tuple(row['Horario']), row['creditos']), axis=1).tolist()

    node_indices = {node: idx for idx, node in enumerate(nodes)}
    size = len(nodes)
    matriz = np.zeros((size, size), dtype=float)

    # ==================== FUNCIONES AUXILIARES ====================
    def parse_horario(horario):
        if horario == "-":
            return 7.0, 7.0
        start, end = horario.split(" - ")
        return float(start), float(end)

    def calcular_diferencia(node1, node2):
        total_diff = 0
        for day in range(5):
            start1, end1 = parse_horario(node1[2][day])
            start2, end2 = parse_horario(node2[2][day])

            if (start1 == 7.0 and end1 == 7.0) and (start2 == 7.0 and end2 == 7.0):
                total_diff += 0
            elif (start1 != 7.0 or end1 != 7.0) and (start2 == 7.0 and end2 == 7.0):
                total_diff += 0
            elif (start2 != 7.0 or end2 != 7.0) and (start1 == 7.0 and end1 == 7.0):
                start1_v, end1_v = 7.0, 7.0
                if end1_v == start2:
                    total_diff += 0.1
                elif start2 > end1_v:
                    total_diff += abs(start2 - end1_v)
                elif start1_v > end2:
                    total_diff += abs(start1_v - end2)
                else:
                    total_diff += 0.1
            else:
                if end1 == start2:
                    total_diff += 0.1
                elif start1 == start2:
                    total_diff += 0
                elif start2 > end1:
                    total_diff += abs(start2 - end1)
                elif start1 >= end2:
                    total_diff += abs(start1 - end2)
                else:
                    total_diff += 0.1
        return total_diff

    def get_horario_num(horario_str):
        if horario_str.startswith('H'):
            try:
                return int(horario_str[1:])
            except ValueError:
                return 0
        return 0

    def horario_en_turno(node, turno):
        bloques_matutino = ["7 - 8.5", "8.5 - 10", "10.5 - 12", "12 - 13.5", "13.5 - 15"]
        bloques_vespertino = ["13.5 - 15", "15 - 16.5", "16.5 - 18", "18.5 - 20", "20 - 21.5"]
        if turno == 'matutino':
            return any(h in bloques_matutino for h in node[2] if h != '-')
        elif turno == 'vespertino':
            return any(h in bloques_vespertino for h in node[2] if h != '-')
        return True

    # ==================== MATRIZ DE ADYACENCIA ====================
    for i, node1 in enumerate(nodes):
        for j, node2 in enumerate(nodes):
            if turno and (not horario_en_turno(node1, turno) or not horario_en_turno(node2, turno)):
                matriz[i][j] = 0
                continue
            if i != j:
                if node1[0] == node2[0] or node1[1] == node2[1]:
                    matriz[i][j] = 0
                else:
                    matriz[i][j] = calcular_diferencia(node1, node2)
            else:
                matriz[i][j] = 0

    for i, node1 in enumerate(nodes):
        for j, node2 in enumerate(nodes):
            if i != j:
                horario_num1 = get_horario_num(node1[1])
                horario_num2 = get_horario_num(node2[1])
                if horario_num1 < horario_minimo or horario_num2 < horario_minimo:
                    matriz[i][j] = 0

    # Agrega el nodo nido
    nodo_nido = ("Nido", "HX1", ("-", "-", "-", "-", "-"), 0)
    nodes.append(nodo_nido)
    node_indices[nodo_nido] = size

    new_size = size + 1
    new_matriz = np.zeros((new_size, new_size), dtype=float)
    new_matriz[:size, :size] = matriz

    for i, node in enumerate(nodes):
        if node[1] == horario_nido:
            new_matriz[size][i] = 1
            new_matriz[i][size] = 1

    adjacency_df = pd.DataFrame(new_matriz, index=nodes, columns=nodes)
    adjacency_df.to_csv(csv_output_path)

    return f"Matriz guardada en {csv_output_path} con nodo nido en horario {horario_nido}"


if __name__ == "__main__":
    print(generate_adjacency_matrix())
