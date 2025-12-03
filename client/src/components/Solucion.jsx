import { useNavigate } from 'react-router-dom';
import HorarioTable from './HorarioTable';

const Solucion = ({
  resultado,
  index,
  bloques,
  dias,
  colorMap,
  generarMatriz,
  modoAcordeon,
  acordeonActivo,
  setAcordeonActivo,
  onDownload,
  obtenerNombreMateria,
  semestreSeleccionado,
  generarMatrizConNombres
}) => {

  const navigate = useNavigate();
  const matriz = generarMatrizConNombres
    ? generarMatrizConNombres(resultado.ruta, obtenerNombreMateria)
    : generarMatriz(resultado.ruta);

  /* ============================================================
     MÉTRICA DE CALIDAD — IMPLEMENTACIÓN COMPLETA
     Basada en la fórmula formal incorporando:
     - Conflictos
     - Materias asignadas
     - Distribución equitativa
     - Fitness normalizado
  ============================================================ */
  const calculateScheduleScore = (matriz, resultado) => {
    const w1 = 0.35; // Conflictos
    const w2 = 0.25; // Materias asignadas
    const w3 = 0.20; // Distribución equitativa
    const w4 = 0.20; // Fitness

    /* ---------------------------------------------------------
       1. Cálculo de conflictos
    -----------------------------------------------------------*/
    let conflictCount = 0;
    const totalBloques = matriz.length;

    for (const bloque of matriz) {
      if (Array.isArray(bloque) && bloque.length > 1) {
        conflictCount += bloque.length - 1;
      }
    }

    const C_conf = -conflictCount / Math.max(1, totalBloques);

    /* ---------------------------------------------------------
       2. Materias asignadas 
    -----------------------------------------------------------*/
    const materiasTotales = resultado.ruta.length;
    const materiasAsignadas = resultado.ruta.filter(
      (r) => !r.id_materia.includes("Nido")
    ).length;

    const C_asig = materiasAsignadas / Math.max(1, materiasTotales);

    /* ---------------------------------------------------------
       3. Distribución equitativa de carga horaria
    -----------------------------------------------------------*/
    const diasSemana = 5;
    let horasPorDia = Array(diasSemana).fill(0);

    matriz.forEach((bloque, idx) => {
      if (Array.isArray(bloque) && bloque.length > 0) {
        const dia = idx % diasSemana;
        horasPorDia[dia] += 1; // cada bloque equivale a 1 periodo
      }
    });

    const promedio = horasPorDia.reduce((a, b) => a + b, 0) / diasSemana;

    let varianza = 0;
    for (let h of horasPorDia) varianza += Math.pow(h - promedio, 2);
    varianza /= diasSemana;

    const sigma = Math.sqrt(varianza);
    const sigmaMax = Math.sqrt(
      diasSemana * Math.pow(Math.max(...horasPorDia), 2)
    );

    const C_dist = 1 - Math.min(sigma / Math.max(1, sigmaMax), 1);

    /* ---------------------------------------------------------
       4. Fitness normalizado
    -----------------------------------------------------------*/
    const F = resultado.peso;
    const C_fit = Math.min(Math.max(F, 0), 1);

    /* ---------------------------------------------------------
       5. Fórmula final de calidad
    -----------------------------------------------------------*/
    const Q =
      w1 * C_conf +
      w2 * C_asig +
      w3 * C_dist +
      w4 * C_fit;

    /* Normalizar a escala 1–5 */
    const Q_norm = Math.min(Math.max(1 + 4 * Math.max(Q, 0), 1), 5);

    return parseFloat(Q_norm.toFixed(1));
  };

  /* ============================================================
     Obtener la calidad final del horario
  ============================================================ */
  const scheduleScore = calculateScheduleScore(matriz, resultado);

  /* ============================================================
     Función auxiliar para mostrar días asignados según idHorario
  ============================================================ */
  const obtenerDiasDeHorario = (idHorario) => {
    const cleanId = idHorario.replace(/['"\s]/g, "");
    const horarios = {
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
    };

    const horario = horarios[cleanId];
    if (!horario) return cleanId;

    return horario
      .map((hora, idx) => hora !== "-" ? dias[idx] : null)
      .filter(Boolean)
      .join(", ");
  };

  return (
    <div
      className="
        mb-8 bg-white border-4 border-black rounded-2xl
        shadow-[6px_6px_0px_0px_black] p-6
        font-['Comic_Sans_MS']
      "
    >
      <h2
        className="text-xl font-bold cursor-pointer"
        onClick={() => setAcordeonActivo(index === acordeonActivo ? null : index)}
      >
        Solución {index + 1}
      </h2>

      <p className="text-sm mt-1">
        <strong className="text-rose-600">Calidad del Horario:</strong>{" "}
        <span className="font-bold">{scheduleScore} / 5.0</span>
      </p>

      <p className="text-xs text-gray-700">
        <strong>Fitness:</strong> {resultado.peso.toFixed(4)}
      </p>

      {(!modoAcordeon || index === acordeonActivo) && (
        <div className="flex gap-4 mt-5">

          {/* Tabla de horario */}
          <div className="flex-1 ">
            <HorarioTable matriz={matriz} bloques={bloques} dias={dias} colorMap={colorMap} />
          </div>

          {/* Recorrido de materias */}
          <div
            className="
              w-80 bg-white p-4 rounded-2xl border-2 border-black
              shadow-[4px_4px_0px_0px_black]
            "
          >
            <h3 className="text-sm font-bold mb-2 -rotate-1">Recorrido de Materias</h3>

            <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
              {resultado.ruta
                .filter(i => !i.id_materia.includes('Nido'))
                .map((item, idx) => {
                  const nombreMateria = obtenerNombreMateria(item.id_materia);
                  const diasMateria = obtenerDiasDeHorario(item.id_horario);

                  return (
                    <div
                      key={idx}
                      className="
                        text-xs p-2 rounded-xl border-2
                        shadow-[3px_3px_0px_0px_black]
                      "
                      style={{
                        backgroundColor: colorMap[nombreMateria] || "#F8F8F8",
                        borderColor: "#000"
                      }}
                    >
                      <div className="font-semibold text-gray-900">
                        {nombreMateria} <span>({item.id_materia})</span>
                      </div>
                      <div className="text-[11px]">Días: {diasMateria}</div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* Botones */}
      {onDownload && (
        <div className="flex gap-3 mt-5">
          <button
            onClick={() => onDownload(index)}
            className="
              bg-purple-300 border-2 border-black rounded-xl
              px-4 py-2 font-bold shadow-[4px_4px_0px_0px_black]
              hover:bg-purple-400 transition w-full
            "
          >
            Descargar
          </button>

          <button
            onClick={() =>
              navigate(`/modificar?horario=${index}`, {
                state: { resultado, bloques, dias, colorMap, semestre: semestreSeleccionado }
              })
            }
            className="
              bg-yellow-300 border-2 border-black rounded-xl
              px-4 py-2 font-bold shadow-[4px_4px_0px_0px_black]
              hover:bg-yellow-400 transition w-full
            "
          >
            Modificar
          </button>
        </div>
      )}
    </div>
  );
};

export default Solucion;
