from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
from fpdf import FPDF
from io import BytesIO
import pandas as pd 
import json
from matrix_generator import generate_adjacency_matrix
from aco_solver import run_aco_solver

app = Flask(__name__)
CORS(app)

with open("CSV/materias.json", "r", encoding="utf-8") as f:
    materias_dict = json.load(f)

@app.route('/api/materias_disponibles', methods=['GET'])
def materias_disponibles():
    try:
        # Carga tu CSV (ajusta la ruta según tu estructura)
        df = pd.read_csv('CSV/horarios.csv')

        # Aseguramos que las columnas esperadas existan
        columnas_esperadas = {'Id_materia', 'Id_horario', 'turno'}
        if not columnas_esperadas.issubset(df.columns):
            return jsonify({'error': 'El CSV no contiene las columnas requeridas: Id_materia, Id_horario, turno'}), 400

        # Convertimos a lista de diccionarios para que React lo reciba como arreglo
        materias = df.to_dict(orient='records')

        return jsonify(materias)

    except Exception as e:
        print("Error cargando materias:", e)
        return jsonify({'error': 'No se pudieron cargar las materias'}), 500
    
# Solo genera la matriz de adyacencia
@app.route('/api/generate_matrix', methods=['POST'])
def generate_matrix():
    try:
        data = request.json
        #print("Datos recibidos en /generate_matrix:", data)  # DEBUG
        horario_nido = data.get('horario_nido', 'H1')
        horario_minimo = data.get('horario_minimo', 1)

        semestre = data.get('semestre', None)
        turno = data.get('turno', None)
        carga_academica = data.get('carga_academica', None)
        matrix_message = generate_adjacency_matrix(
            csv_input_path='CSV/horarios.csv',
            csv_output_path='CSV/completa.csv',
            horario_nido=horario_nido,
            horario_minimo=horario_minimo,
            turno=turno,
            semestre=semestre,
            carga_academica=carga_academica
        )
        return jsonify({"message": matrix_message})
    except Exception as e:
        import traceback
        # print("Error en /generate_matrix:", e)
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

# Solo ejecuta el algoritmo ACO
@app.route('/api/run_aco_solver', methods=['GET'])
def run_aco():
    try:
        carga_academica = request.args.get('carga_academica', None)
        aco_result = run_aco_solver(carga_academica=carga_academica)
        return jsonify({"aco_result": aco_result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
def hex_to_rgb(hex_color):
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def obtener_dias_horario(id_horario):
    dias = ["Lu", "Ma", "Mi", "Ju", "Vi"]
    horarios = {
        "H1": ["7 - 8.5", "-", "-", "7 - 8.5", "8.5 - 10"],
        "H2": ["-", "7 - 8.5", "7 - 8.5", "-", "7 - 8.5"],
        "H3": ["7 - 8.5", "12 - 13.5", "-", "7 - 8.5", "8.5 - 10"],
        "H4": ["-", "10.5 - 12", "10.5 - 12", "13.5 - 15", "10.5 - 12"],
        "H5": ["8.5 - 10", "-", "8.5 - 10", "8.5 - 10", "-"],
        "H6": ["8.5 - 10", "-", "8.5 - 10", "8.5 - 10", "12 - 13.5"],
        "H7": ["-", "10.5 - 12", "10.5 - 12", "-", "10.5 - 12"],
        "H8": ["10.5 - 12", "8.5 - 10", "-", "10.5 - 12", "-"],
        "H9": ["10.5 - 12", "8.5 - 10", "-", "10.5 - 12", "12 - 13.5"],
        "H10": ["13.5 - 15", "7 - 8.5", "7 - 8.5", "-", "7 - 8.5"],
        "H11": ["12 - 13.5", "12 - 13.5", "12 - 13.5", "12 - 13.5", "-"],
        "H12": ["12 - 13.5", "-", "12 - 13.5", "12 - 13.5", "-"],
        "H13": ["-", "12 - 13.5", "13.5 - 15", "-", "12 - 13.5"],
        "H16": ["-", "13.5 - 15", "-", "13.5 - 15", "13.5 - 15"],
        "H17": ["13.5 - 15", "13.5 - 15", "13.5 - 15", "-", "13.5 - 15"],
        "H18": ["13.5 - 15", "13.5 - 15", "-", "13.5 - 15", "-"],
        "H19": ["15 - 16.5", "-", "-", "15 - 16.5", "15 - 16.5"],
        "H20": ["-", "15 - 16.5", "15 - 16.5", "-", "15 - 16.5"],
        "H21": ["-", "15 - 16.5", "15 - 16.5", "13.5 - 15", "15 - 16.5"],
        "H22": ["15 - 16.5", "-", "-", "15 - 16.5", "16.5 - 18"],
        "H23": ["15 - 16.5", "13.5 - 15", "-", "15 - 16.5", "16.5 - 18"],
        "H24": ["16.5 - 18", "-", "16.5 - 18", "16.5 - 18", "-"],
        "H26": ["16.5 - 18", "-", "16.5 - 18", "16.5 - 18", "13.5 - 15"],
        "H28": ["18.5 - 20", "16.5 - 18", "-", "18.5 - 20", "-"],
        "H29": ["-", "18.5 - 20", "18.5 - 20", "-", "18.5 - 20"],
        "H30": ["18.5 - 20", "16.5 - 18", "13.5 - 15", "18.5 - 20", "-"],
        "H32": ["-", "16.5 - 18", "16.5 - 18", "-", "13.5 - 15"],
        "H33": ["-", "18.5 - 21.5", "18.5 - 20", "-", "-"],
        "H34": ["20 - 21.5", "-", "20 - 21.5", "20 - 21.5", "-"],
        "H40": ["12:00-13:30","-","12:00-13:30","-","-"],
        "H41": ["-","10:30-12:00","10:30-12:00","-","-"],
        "H42": ["12:00-13:30","-","-","12:00-13:30","-"],
        "H43": ["10:30-12:00","-","-","10:30-12:00","-"],
        "H44": ["18:30-20:00","16:30-18:00","-","-","-"],
        "H45": ["20:00-21:30","-","20:00-21:30","-","-"],
        "H46": ["16:30-18:00","-","-","16:30-18:00","-"]
    }

    def convertir_hora(h):
        """Convierte horas 8.5 → 8:30, 13.5 → 13:30, etc."""
        try:
            h = h.replace(" ", "")
            inicio, fin = h.split("-")
            return f"{formato(inicio)}-{formato(fin)}"
        except:
            return h

    def formato(h):
        if ":" in h:
            return h
        h = float(h)
        horas = int(h)
        minutos = "30" if (h - horas) == 0.5 else "00"
        return f"{horas}:{minutos.zfill(2)}"

    horario = horarios.get(id_horario)
    if horario:
        dias_horas = []
        for i, hora in enumerate(horario):
            if hora != "-":
                dias_horas.append(f"{dias[i]} {convertir_hora(hora)}")

        return ", ".join(dias_horas) if dias_horas else id_horario

    return id_horario


# Solo genera el PDf con la informacion de los horarios
@app.route('/api/generate_pdf', methods=['POST'])
def generate_pdf():
    data = request.get_json()
    soluciones = data.get('soluciones', [])

    bloques = [
        "7:00 - 8:30", "8:30 - 10:00", "10:30 - 12:00", "12:00 - 13:30",
        "13:30 - 15:00", "15:00 - 16:30", "16:30 - 18:00", "18:30 - 20:00", "20:00 - 21:30"
    ]
    dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"]

    colores_disponibles = [
        "#FFB6C1", "#ADD8E6", "#90EE90", "#FFD700", "#FFA07A", "#9370DB", "#00CED1",
        "#F08080", "#DAA520", "#87CEFA", "#98FB98", "#FFC0CB", "#FF6347", "#AFEEEE",
        "#F4A460", "#D8BFD8", "#B0E0E6", "#E0FFFF", "#FFE4B5", "#E6E6FA"
    ]

    # Obtener materias únicas desde la matriz
    materias_unicas = set()
    for sol in soluciones:
        for fila in sol["matriz"]:
            for celda in fila:
                if celda:
                    for m in celda.split("/"):
                        materia = m.strip()
                        if materia:
                            materias_unicas.add(materia)

    color_map = {
        materia: colores_disponibles[i % len(colores_disponibles)]
        for i, materia in enumerate(sorted(list(materias_unicas)))
    }

    pdf = FPDF(orientation="L", unit="mm", format="A4")
    pdf.set_auto_page_break(auto=False)

    # Convertir hex → rgb
    def hex_to_rgb(h):
        h = h.lstrip("#")
        return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

    # ---- Centrador de tablas ----
    def center_table(pdf, total_width):
        page_width = pdf.w - 20  # márgenes
        margin_x = (page_width - total_width) / 2
        pdf.set_x(10 + margin_x)

    for idx, solucion in enumerate(soluciones):
        pdf.add_page()
        pdf.image("img/fondo.jpg", x=0, y=0, w=297, h=210)  # Fondo completo
        
        pdf.image("img/EscudoESCOM.png", 30, 7, 28) # Izquierda 
        pdf.image("img/Logo_ipn.png", 242, 3, 28) # Derecha
        

        pdf.set_font("Arial", "B", 18)
        pdf.set_xy(0, 10)
        pdf.cell(0, 10, "Sistema de Generación de Horarios - AcoPlanner", align="C")
        pdf.ln(12)

        pdf.set_font("Arial", "B", 14)
        pdf.cell(0, 8, f"Horario #{idx + 1}", align="C")
        pdf.ln(10)

        # ======================
        # TABLA DE HORARIO (centrada)
        # ======================
        col_w = 34
        line_h = 2.3   # altura por línea
        total_width = col_w * (1 + len(dias))

        # Primero obtener la matriz de esta solución
        matriz = solucion.get("matriz", [])
        
        # Verificar que la matriz existe
        if not matriz:
            continue
            
        # Calcular altura máxima global para todas las filas
        global_max_lines = 1
        for fila in matriz:
            for celda in fila:
                contenido = celda or ""
                if contenido:
                    # Calcular líneas necesarias
                    lines = len(pdf.multi_cell(col_w, line_h, contenido, split_only=True, border=0))
                    global_max_lines = max(global_max_lines, lines)
        
        # Altura uniforme para todas las filas (mínimo 2 líneas)
        row_h = max(global_max_lines, 2) * line_h

        center_table(pdf, total_width)

        # Encabezado
        pdf.set_font("Arial", "B", 9)
        pdf.set_fill_color(235, 245, 255)
        pdf.cell(col_w, 10, "Hora", border=1, align="C", fill=True)

        for dia in dias:
            pdf.cell(col_w, 10, dia, border=1, align="C", fill=True)
        pdf.ln()

        pdf.set_font("Arial", "", 7)

        # Dibujar tabla con altura uniforme
        for i, fila in enumerate(matriz):
            # Centrar esta fila
            center_table(pdf, total_width)
            
            # Guardar posición inicial
            start_x = pdf.get_x()
            start_y = pdf.get_y()
            
            # === 1. DIBUJAR EL FONDO DE LAS CELDAS (con bordes) ===
            
            # Celda de hora (fondo blanco)
            pdf.set_fill_color(255, 255, 255)
            pdf.cell(col_w, row_h, "", border=1, align="C", fill=True)
            
            # Celdas de contenido (días)
            for celda in fila:
                contenido = celda or ""
                
                # Determinar color de fondo
                fill = False
                fill_color = (255, 255, 255)
                if contenido:
                    primera = contenido.split("/")[0].strip()
                    if primera in color_map:
                        r, g, b = hex_to_rgb(color_map[primera])
                        fill_color = (r, g, b)
                        fill = True
                
                pdf.set_fill_color(*fill_color)
                pdf.cell(col_w, row_h, "", border=1, align="C", fill=True)
            
            # === 2. DIBUJAR EL TEXTO ENCIMA (centrado) ===
            
            # Volver a la posición inicial de la fila
            pdf.set_xy(start_x, start_y)
            
            # Celda de hora (texto)
            pdf.set_fill_color(255, 255, 255)  # Fondo transparente para texto
            pdf.cell(col_w, row_h, bloques[i], border=0, align="C", fill=False)
            
            # Celdas de contenido (texto)
            for j, celda in enumerate(fila):
                contenido = celda or ""
                if contenido:
                    # Calcular posición X
                    x_pos = start_x + col_w * (j + 1)
                    
                    # Calcular altura del texto
                    lines_needed = len(pdf.multi_cell(col_w, line_h, contenido, split_only=True, border=0))
                    text_height = lines_needed * line_h
                    
                    # Calcular desplazamiento vertical para centrar
                    y_offset = max(1, (row_h - text_height) / 2)
                    
                    # Posicionar para texto
                    pdf.set_xy(x_pos, start_y + y_offset)
                    
                    # Dibujar texto (sin borde, sin fondo)
                    pdf.multi_cell(col_w, line_h, contenido, border=0, align="C", fill=False)
            
            # Mover a siguiente fila
            pdf.set_xy(start_x, start_y + row_h)

        pdf.ln(6)

        # ======================
        # TABLA DE PASOS
        # ======================
        pasos = solucion.get("ruta", [])
        pasos = [p for p in pasos if "Nido" not in p.get("id_materia", "")]
        pasos = pasos[:10]

        col_paso = 15
        col_materia = 115
        col_horario = 70
        total_w = col_paso + col_materia + col_horario

        center_table(pdf, total_w)

        pdf.set_font("Arial", "B", 8)
        pdf.set_fill_color(220, 220, 220)
        pdf.cell(col_paso, 6, "Paso", border=1, align="C", fill=True)
        pdf.cell(col_materia, 6, "Materia", border=1, align="C", fill=True)
        pdf.cell(col_horario, 6, "Horario", border=1, align="C", fill=True)
        pdf.ln()

        pdf.set_font("Arial", size=7)

        for i, item in enumerate(pasos):
            center_table(pdf, total_w)

            id_materia = item["id_materia"]

            # === obtener el nombre real desde materias.json ===
            nombre_materia = materias_dict.get(id_materia, id_materia)

            # Paso
            pdf.set_fill_color(255, 255, 255)
            pdf.cell(col_paso, 6, str(i + 1), border=1, align="C", fill=True)

            # Color por nombre
            if nombre_materia in color_map:
                r, g, b = hex_to_rgb(color_map[nombre_materia])
                pdf.set_fill_color(r, g, b)
                fill = True
            else:
                pdf.set_fill_color(255, 255, 255)
                fill = False

            pdf.cell(col_materia, 6, nombre_materia, border=1, align="L", fill=fill)

            # Horario bonito
            pdf.set_fill_color(255, 255, 255)
            dias_h = obtener_dias_horario(item["id_horario"])
            pdf.cell(col_horario, 6, dias_h, border=1, align="C", fill=True)

            pdf.ln()

    pdf_bytes = pdf.output(dest="S").encode("latin1")
    pdf_output = BytesIO(pdf_bytes)
    pdf_output.seek(0)

    return send_file(pdf_output, mimetype="application/pdf", as_attachment=True, download_name="horarios.pdf")


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=5000)
