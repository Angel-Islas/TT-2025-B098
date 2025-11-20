import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import HorarioTable from "./HorarioTable";

// ---------------- NUEVO: Función para leer días ----------------
const diasSemana = ["Lun", "Mar", "Miér", "Jue", "Vie"];

const obtenerDiasDeHorario = (idHorario, horarios) => {
  const bloques = horarios[idHorario];
  if (!bloques) return "Sin días";

  return bloques
    .map((bloque, index) => {
      if (bloque !== "-") {
        return `${diasSemana[index]} (${bloque})`;
      }
      return null;
    })
    .filter(Boolean)
    .join(", ");
};
// ---------------------------------------------------------------

const getQueryParam = (search, key) => {
  const params = new URLSearchParams(search);
  return params.get(key);
};

const obtenerSemestreDeMateria = (idMateria) => {
  const partes = idMateria.split("-");
  if (partes.length > 1) {
    const num = parseInt(partes[1][0], 10);
    return isNaN(num) ? null : num;
  }
  return null;
};

const decimalToTime = (num) => {
if (typeof num !== "number") {
num = parseFloat(num);
if (isNaN(num)) return num;
}
const horas = Math.floor(num);
const minutos = Math.round((num - horas) * 60);
const mm = minutos.toString().padStart(2, "0");
return `${horas}:${mm}`;
};


const formatearRango = (rango) => {
if (!rango || rango === "-") return "-";
const partes = rango.split("-").map((x) => x.trim());
return `${decimalToTime(partes[0])} - ${decimalToTime(partes[1])}`;
};

const horarios = {
  "H1": ["7 - 8.5", "-", "-", "7 - 8.5", "8.5 - 10"].map(formatearRango),
  "H2": ["-", "7 - 8.5", "7 - 8.5", "-", "7 - 8.5"].map(formatearRango),
  "H3": ["7 - 8.5", "12 - 13.5", "-", "7 - 8.5", "8.5 - 10"].map(formatearRango),
  "H4": ["-", "10.5 - 12", "10.5 - 12", "13.5 - 15", "10.5 - 12"].map(formatearRango),
  "H5": ["8.5 - 10", "-", "8.5 - 10", "8.5 - 10", "-"].map(formatearRango),
  "H6": ["8.5 - 10", "-", "8.5 - 10", "8.5 - 10", "12 - 13.5"].map(formatearRango),
  "H7": ["-", "10.5 - 12", "10.5 - 12", "-", "10.5 - 12"].map(formatearRango),
  "H8": ["10.5 - 12", "8.5 - 10", "-", "10.5 - 12", "-"].map(formatearRango),
  "H9": ["10.5 - 12", "8.5 - 10", "-", "10.5 - 12", "12 - 13.5"].map(formatearRango),
  "H10": ["13.5 - 15", "7 - 8.5", "7 - 8.5", "-", "7 - 8.5"].map(formatearRango),
  "H11": ["12 - 13.5", "12 - 13.5", "12 - 13.5", "12 - 13.5", "-"].map(formatearRango),
  "H12": ["12 - 13.5", "-", "12 - 13.5", "12 - 13.5", "-"].map(formatearRango),
  "H13": ["-", "12 - 13.5", "13.5 - 15", "-", "12 - 13.5"].map(formatearRango),
  "H16": ["-", "13.5 - 15", "-", "13.5 - 15", "13.5 - 15"].map(formatearRango),
  "H17": ["13.5 - 15", "13.5 - 15", "13.5 - 15", "-", "13.5 - 15"].map(formatearRango),
  "H18": ["13.5 - 15", "13.5 - 15", "-", "13.5 - 15", "-"].map(formatearRango),
  "H19": ["15 - 16.5", "-", "-", "15 - 16.5", "15 - 16.5"].map(formatearRango),
  "H20": ["-", "15 - 16.5", "15 - 16.5", "-", "15 - 16.5"].map(formatearRango),
  "H21": ["-", "15 - 16.5", "15 - 16.5", "13.5 - 15", "15 - 16.5"].map(formatearRango),
  "H22": ["15 - 16.5", "-", "-", "15 - 16.5", "16.5 - 18"].map(formatearRango),
  "H23": ["15 - 16.5", "13.5 - 15", "-", "15 - 16.5", "16.5 - 18"].map(formatearRango),
  "H24": ["16.5 - 18", "-", "16.5 - 18", "16.5 - 18", "-"].map(formatearRango),
  "H26": ["16.5 - 18", "-", "16.5 - 18", "16.5 - 18", "13.5 - 15"].map(formatearRango),
  "H28": ["18.5 - 20", "16.5 - 18", "-", "18.5 - 20", "-"].map(formatearRango),
  "H29": ["-", "18.5 - 20", "18.5 - 20", "-", "18.5 - 20"].map(formatearRango),
  "H30": ["18.5 - 20", "16.5 - 18", "13.5 - 15", "18.5 - 20", "-"].map(formatearRango),
  "H32": ["-", "16.5 - 18", "16.5 - 18", "-", "13.5 - 15"].map(formatearRango),
  "H33": ["-", "18.5 - 21.5", "18.5 - 20", "-", "-"].map(formatearRango),
  "H34": ["20 - 21.5", "-", "20 - 21.5", "20 - 21.5", "-"].map(formatearRango),
  "H40": ["12:00-13:30","-","12:00-13:30","-","-"].map(formatearRango),
  "H41": ["-","10:30-12:00","10:30-12:00","-","-"].map(formatearRango),
  "H42": ["12:00-13:30","-","-","12:00-13:30","-"].map(formatearRango),
  "H43": ["10:30-12:00","-","-","10:30-12:00","-"].map(formatearRango),
  "H44": ["18:30-20:00","16:30-18:00","-","-","-"].map(formatearRango),
  "H45": ["20:00-21:30","-","20:00-21:30","-","-"].map(formatearRango),
  "H46": ["16:30-18:00","-","-","16:30-18:00","-"].map(formatearRango)
};

const ModificarHorario = ({
  resultados,
  bloques,
  dias,
  colorMap,
  generarMatriz,
  obtenerNombreMateria,
  semestreSeleccionado,
  generarMatrizConNombres,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const idx = parseInt(getQueryParam(location.search, "horario"), 10);

  const resultado = resultados?.[0];

  const [materiasDisponibles, setMateriasDisponibles] = useState([]);
  const [materiasHabilitadas, setMateriasHabilitadas] = useState({});
  const [materiasSeleccionadas, setMateriasSeleccionadas] = useState({});
  const [colores, setColores] = useState(colorMap || {});

  const coloresDisponibles = useMemo(
    () => [
      "#FFB6C1", "#ADD8E6", "#90EE90", "#FFD700", "#FFA07A",
      "#9370DB", "#00CED1", "#F08080", "#DAA520", "#87CEFA",
      "#98FB98", "#FFC0CB", "#FF6347", "#AFEEEE", "#F4A460",
      "#D8BFD8", "#E6E6FA", "#20B2AA", "#FA8072", "#B0E0E6",
      "#FFE4B5", "#7FFFD4", "#FF69B4", "#CD5C5C", "#E0FFFF",
      "#BC8F8F", "#BDB76B", "#40E0D0", "#778899", "#FFDAB9",
    ],
    []
  );

  const handleDownloadModifiedPDF = async () => {
    try {
      const rutaFiltrada = rutaModificada.filter(
        (item) => materiasHabilitadas[item.id_materia]
      );

      const matrizConNombres = generarMatrizConNombres(
        rutaFiltrada,
        obtenerNombreMateria
      );

      const solucionesConMatriz = [
        {
          peso: resultado.peso,
          ruta: rutaFiltrada,
          matriz: matrizConNombres.map((fila) =>
            fila.map((celda) => celda || "")
          ),
        },
      ];

      const response = await axios.post(
        "http://localhost:5000/generate_pdf",
        { soluciones: solucionesConMatriz },
        {
          responseType: "blob",
          headers: { "Content-Type": "application/json" },
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const link = document.createElement("a");

      link.href = URL.createObjectURL(blob);
      link.download = `horario_modificado_${idx + 1}.pdf`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error al descargar el PDF modificado:", error);
      alert("Error al descargar el PDF.");
    }
  };

  useEffect(() => {
    const fetchMaterias = async () => {
      try {
        const res = await axios.get("http://localhost:5000/materias_disponibles");
        const data = res.data;
        if (Array.isArray(data)) setMateriasDisponibles(data);
        else if (data?.materias) setMateriasDisponibles(data.materias);
      } catch {
        setMateriasDisponibles([]);
      }
    };
    fetchMaterias();
  }, []);

  useEffect(() => {
    if (resultado) {
      const inicial = {};
      const seleccionadas = {};

      resultado.ruta.forEach((item) => {
        if (!item.id_materia.includes("Nido")) {
          inicial[item.id_materia] = true;
          seleccionadas[item.id_materia] = item.id_horario;
        }
      });

      setMateriasHabilitadas(inicial);
      setMateriasSeleccionadas(seleccionadas);
    }
  }, [resultado]);

  if (!resultado) {
    return (
      <div className="p-4">
        <button
          onClick={() => navigate("/")}
          className="bg-gray-500 text-white px-4 py-2 rounded shadow-[4px_4px_0_#000]"
        >
          ← Volver
        </button>
        <p>No se encontró el horario seleccionado.</p>
      </div>
    );
  }

  const semestreActual = useMemo(() => {
    const ids = resultado.ruta
      .filter((item) => !item.id_materia.includes("Nido"))
      .map((item) => obtenerSemestreDeMateria(item.id_materia))
      .filter((n) => n !== null);

    return ids.length > 0 ? ids[0] : null;
  }, [resultado]);

  const generarMatrizFiltrada = (ruta) => {
    const rutaFiltrada = ruta.filter(
      (item) => materiasHabilitadas[item.id_materia]
    );
    return generarMatrizConNombres
      ? generarMatrizConNombres(rutaFiltrada, obtenerNombreMateria)
      : generarMatriz(rutaFiltrada);
  };

  const rutaModificada = useMemo(() => {
    const base = resultado.ruta.map((item) => {
      if (materiasSeleccionadas[item.id_materia]) {
        return { ...item, id_horario: materiasSeleccionadas[item.id_materia] };
      }
      return item;
    });

    const nuevas = Object.keys(materiasSeleccionadas)
      .filter((idMateria) => !base.some((i) => i.id_materia === idMateria))
      .map((idMateria) => ({
        id_materia: idMateria,
        id_horario: materiasSeleccionadas[idMateria],
        grupo: "Nuevo",
        profesor: "Por asignar",
        peso: 1,
      }));

    return [...base, ...nuevas];
  }, [resultado.ruta, materiasSeleccionadas]);

  const matriz = useMemo(() => {
    return generarMatrizFiltrada(rutaModificada);
  }, [rutaModificada, materiasHabilitadas]);

  const materiasUsadas = useMemo(() => {
    return new Set(resultado.ruta.map((item) => item.id_materia));
  }, [resultado]);

  const toggleMateria = (idMateria) => {
    setMateriasHabilitadas((prev) => ({
      ...prev,
      [idMateria]: !prev[idMateria],
    }));
  };

  const handleHorarioChange = (idMateria, nuevoHorario) => {
    setMateriasSeleccionadas((prev) => ({
      ...prev,
      [idMateria]: nuevoHorario,
    }));
  };

  const handleAddMateria = (idMateria, idHorario) => {
    setMateriasHabilitadas((prev) => ({ ...prev, [idMateria]: true }));
    setMateriasSeleccionadas((prev) => ({ ...prev, [idMateria]: idHorario }));

    const nombre = obtenerNombreMateria(idMateria);
    setColores((prev) => {
      if (!prev[nombre]) {
        const usados = Object.values(prev);
        const libre =
          coloresDisponibles.find((c) => !usados.includes(c)) || "#CCCCCC";
        return { ...prev, [nombre]: libre };
      }
      return prev;
    });
  };

  const obtenerOpcionesHorario = (idMateria) => {
    return materiasDisponibles.filter((m) => m.Id_materia === idMateria);
  };

  return (
    <div className="p-4">

      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate('/generar-horarios')}
          className="px-4 py-2 bg-yellow-300 border-4 border-black rounded-xl shadow-[4px_4px_0_#000] hover:bg-yellow-400 transition rotate-[-1deg]"
        >
          ← Volver a resultados
        </button>

        <button
          onClick={handleDownloadModifiedPDF}
          className="px-4 py-2 bg-blue-300 border-4 border-black rounded-xl shadow-[4px_4px_0_#000] hover:bg-blue-400 transition rotate-[1deg]"
        >
          Descargar PDF Modificado
        </button>
      </div>

      <div className="flex gap-4">

        <div className="flex-1 border-4 border-black rounded-2xl p-3 bg-white shadow-[6px_6px_0_#000]">
          <HorarioTable
            matriz={matriz}
            bloques={bloques}
            dias={dias}
            colorMap={colores}
          />
        </div>

        {/* PANEL DE PERSONALIZACIÓN */}
        <div className="w-80 bg-white border-4 border-black rounded-2xl p-3 shadow-[6px_6px_0_#000]">

          <h3 className="text-lg font-bold mb-2 font-[cursive]">
            Personalizar Materias
          </h3>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {rutaModificada
              .filter((item) => !item.id_materia.includes("Nido"))
              .map((item, i) => {
                const nombre = obtenerNombreMateria(item.id_materia);
                const habilitada = materiasHabilitadas[item.id_materia];
                const opciones = obtenerOpcionesHorario(item.id_materia);
                const horarioActual = materiasSeleccionadas[item.id_materia];

                return (
                  <div
                    key={i}
                    className={`p-2 border-2 border-black rounded-xl shadow-[3px_3px_0_#000] ${
                      habilitada ? "" : "opacity-50"
                    }`}
                    style={{
                      backgroundColor: habilitada
                        ? colores[nombre] || "#f9f9f9"
                        : "#e0e0e0",
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-bold">{nombre}</div>
                        <div className="text-xs">ID: {item.id_materia}</div>
                      </div>

                      <input
                        type="checkbox"
                        checked={habilitada}
                        onChange={() => toggleMateria(item.id_materia)}
                      />
                    </div>

                    {habilitada && (
                      <select
                        className="mt-2 w-full border-2 border-black rounded px-1 py-0.5 text-xs"
                        value={horarioActual}
                        onChange={(e) =>
                          handleHorarioChange(item.id_materia, e.target.value)
                        }
                      >
                        {opciones.map((op) => (
                          <option key={op.Id_horario} value={op.Id_horario}>
                            {op.turno} — {obtenerDiasDeHorario(op.Id_horario, horarios)}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                );
              })}
          </div>

          {/* Añadir materia */}
          <div className="mt-4 border-t-2 border-black pt-2">
            <h4 className="font-bold text-sm mb-1 rotate-[-1deg]">
              Añadir nueva materia
            </h4>

            <select
              className="w-full border-2 border-black rounded px-1 py-1 text-xs shadow-[3px_3px_0_#000]"
              onChange={(e) => {
                const id = e.target.value;
                if (id) {
                  const opciones = obtenerOpcionesHorario(id);
                  if (opciones.length > 0) {
                    handleAddMateria(id, opciones[0].Id_horario);
                  }
                }
              }}
            >
              <option value="">Seleccionar materia...</option>

              {Array.from(new Set(materiasDisponibles.map((m) => m.Id_materia)))
                .filter((id) => {
                  const sem = obtenerSemestreDeMateria(id);
                  const esSig = sem === semestreActual + 1;
                  const esActualNoUsada =
                    sem === semestreActual && !materiasUsadas.has(id);
                  return esSig || esActualNoUsada;
                })
                .map((id) => (
                  <option key={id} value={id}>
                    {obtenerNombreMateria(id)}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModificarHorario;
