import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Solucion from '../components/Solucion';
import materiasData from '../data/materias.json';

const GenerarHorariosPage = () => {
  const [cargaAcademica, setCargaAcademica] = useState("");
  const [semestre, setSemestre] = useState();
  const [results, setResults] = useState([]);
  const [selectedHorarioIdx, setSelectedHorarioIdx] = useState(-1);
  const [colorMap, setColorMap] = useState({});
  const [horarioNido, setHorarioNido] = useState('H1');
  const [horarioMinimo, setHorarioMinimo] = useState(1);
  const [modoAcordeon, setModoAcordeon] = useState(false);
  const [acordeonActivo, setAcordeonActivo] = useState(null);
  const [turno, setTurno] = useState("");

  /* ============================================================
     BLOQUES Y DÍAS
  ============================================================ */
  const bloques = [
    "7:00 - 8:30", "8:30 - 10:00", "10:30 - 12:00",
    "12:00 - 13:30", "13:30 - 15:00", "15:00 - 16:30",
    "16:30 - 18:00", "18:30 - 20:00", "20:00 - 21:30"
  ];

  const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

  /* ============================================================
     HORARIOS
  ============================================================ */
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

  const convertirABloque = (horarioStr) => {
    const mapa = {
      "7 - 8.5": 0,
      "8.5 - 10": 1,
      "10.5 - 12": 2,
      "12 - 13.5": 3,
      "13.5 - 15": 4,
      "15 - 16.5": 5,
      "16.5 - 18": 6,
      "18.5 - 20": 7,
      "20 - 21.5": 8
    };
    return mapa[horarioStr];
  };

  /* ============================================================
     COLORES
  ============================================================ */
  const coloresDisponibles = [
    "#FFB6C1", "#ADD8E6", "#90EE90", "#FFD700", "#FFA07A",
    "#af99daff", "#00CED1", "#F08080", "#DAA520", "#87CEFA",
    "#98FB98", "#FFC0CB", "#FF6347", "#AFEEEE", "#F4A460",
    "#D8BFD8", "#B0E0E6", "#E0FFFF", "#FFE4B5", "#E6E6FA"
  ];

  const asignarColores = (resultados) => {
    const materiasUnicas = new Set();
    resultados.forEach(r => {
      r.ruta.forEach(({ id_materia }) => {
        const nombreMateria = obtenerNombreMateria(id_materia);
        materiasUnicas.add(nombreMateria);
      });
    });
    const nuevoColorMap = {};
    let i = 0;
    materiasUnicas.forEach(materia => {
      nuevoColorMap[materia] = coloresDisponibles[i % coloresDisponibles.length];
      i++;
    });
    setColorMap(nuevoColorMap);
  };

  /* ============================================================
     MATERIAS
  ============================================================ */

  const obtenerNombreMateria = (codigoMateria) => {
    return materiasData[codigoMateria] || codigoMateria;
  };

  /* ============================================================
     SESSION STORAGE (para limpiar en reload)
  ============================================================ */

  const saveSchedulesToSession = (schedules) => {
    sessionStorage.setItem('generatedSchedules', JSON.stringify(schedules));
  };

  const loadSchedulesFromSession = () => {
    const saved = sessionStorage.getItem('generatedSchedules');
    return saved ? JSON.parse(saved) : null;
  };

  const clearSchedulesFromSession = () => {
    sessionStorage.removeItem('generatedSchedules');
  };

  /* ============================================================
     FETCH DATA
  ============================================================ */
  const fetchData = async () => {
    try {
      const matrixResponse = await axios.post('/api/generate_matrix', {
        horario_nido: horarioNido,
        horario_minimo: horarioMinimo,
        semestre: semestre || null,
        turno: turno || null,
        carga_academica: cargaAcademica || null
      });

      if (matrixResponse.data?.message) {
        const acoResponse = await axios.get('/api/run_aco_solver', {
          params: { carga_academica: cargaAcademica }
        });

        const data = acoResponse.data.aco_result || [];
        setResults(data);
        asignarColores(data);

        saveSchedulesToSession(data);
      }
    } catch (error) {
      console.error('Error al generar:', error);
    }
  };

  /* ============================================================
     Cargar datos si existen (solo mientras está abierta la pestaña)
  ============================================================ */
  useEffect(() => {
    const saved = loadSchedulesFromSession();
    if (saved) {
      setResults(saved);
      asignarColores(saved);
    }
  }, []);

  /* ============================================================
     Limpiar sessionStorage al recargar/cerrar
  ============================================================ */
  useEffect(() => {
    const handleBeforeUnload = () => {
      clearSchedulesFromSession();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  /* ============================================================
     MATRICES
  ============================================================ */

  const generarMatriz = (ruta) => {
    const matriz = Array(9).fill(null).map(() => Array(5).fill(""));
    ruta.forEach(({ id_horario, id_materia }) => {
      const cleanId = id_horario.replace(/['"\s]/g, "");
      const horario = horarios[cleanId];
      if (!horario) return;
      horario.forEach((hora, diaIdx) => {
        if (hora !== "-") {
          const fila = convertirABloque(hora);
          if (fila !== undefined) {
            matriz[fila][diaIdx] = matriz[fila][diaIdx]
              ? matriz[fila][diaIdx] + ` / ${id_materia}`
              : id_materia;
          }
        }
      });
    });
    return matriz;
  };

  const generarMatrizConNombres = (ruta) => {
    const matriz = Array(9).fill(null).map(() => Array(5).fill(""));
    ruta.forEach(({ id_horario, id_materia }) => {
      const cleanId = id_horario.replace(/['"\s]/g, "");
      const horario = horarios[cleanId];
      if (!horario) return;
      horario.forEach((hora, diaIdx) => {
        if (hora !== "-") {
          const fila = convertirABloque(hora);
          if (fila !== undefined) {
            const nombreMateria = obtenerNombreMateria(id_materia);
            matriz[fila][diaIdx] = matriz[fila][diaIdx]
              ? matriz[fila][diaIdx] + ` / ${nombreMateria}`
              : nombreMateria;
          }
        }
      });
    });
    return matriz;
  };

  /* ============================================================
     CAMBIOS DE HORARIO
  ============================================================ */
  // Ahora soporta tanto el evento como el valor directo (string "H1")
  const handleHorarioNidoChange = (valueOrEvent) => {
    const value = typeof valueOrEvent === 'string' ? valueOrEvent : (valueOrEvent?.target?.value || '');
    if (!value) return;

    setHorarioNido(value);
    const numero = parseInt(value.replace('H', ''), 10);
    if (!isNaN(numero)) {
      setHorarioMinimo(numero);
    }
    // Si el usuario selecciona manualmente un nido, limpiamos turno para
    // permitir cambios posteriores del nido.
    setTurno("");
  };

  /* Cambiar nido según turno */
  useEffect(() => {
    if (turno === "matutino") {
      setHorarioNido("H1");
      setHorarioMinimo(1);
    } else if (turno === "vespertino") {
      setHorarioNido("H20");
      setHorarioMinimo(20);
    }
  }, [turno]);

  /* ============================================================
     PDF GENERATION
  ============================================================ */
  const handleDownloadPDF = async () => {
    try {
      const solucionesConMatriz = results.map((resultado) => {
        const matriz = generarMatrizConNombres(resultado.ruta);
        return {
          peso: resultado.peso,
          ruta: resultado.ruta,
          matriz: matriz.map((fila) => fila.map((celda) => celda || ""))
        };
      });

      const response = await axios.post(
        '/api/generate_pdf',
        { soluciones: solucionesConMatriz },
        { responseType: 'blob' }
      );

      // const blob = new Blob([response.data], { type: 'application/pdf' });
      // const link = document.createElement('a');
      // link.href = URL.createObjectURL(blob);
      // link.download = 'soluciones.pdf';
      // link.click();

      // const response = await axios.post('/generate_pdf', data, { responseType: 'blob' });

      const pdfURL = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));

      // ABRIR EN NUEVA PESTAÑA
      window.open(pdfURL, '_blank');

    } catch (error) {
      console.error('Error al descargar PDF:', error);
    }
  };

  const handleDownloadSelectedPDF = async (idx) => {
    try {
      const seleccionado = results[idx];
      const matriz = generarMatrizConNombres(seleccionado.ruta);

      const response = await axios.post(
        '/api/generate_pdf',
        {
          soluciones: [{
            peso: seleccionado.peso,
            ruta: seleccionado.ruta,
            matriz: matriz.map((fila) => fila.map((celda) => celda || ""))
          }]
        },
        { responseType: 'blob' }
      );

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `horario_${idx + 1}.pdf`;
      link.click();
    } catch (error) {
      console.error('Error al descargar PDF:', error);
    }
  };

  /* ============================================================
     RETURN
  ============================================================ */
  return (
    <div className="flex min-h-screen p-4 gap-4">
      <Sidebar
        cargaAcademica={cargaAcademica}
        setCargaAcademica={setCargaAcademica}
        horarioNido={horarioNido}
        handleHorarioNidoChange={handleHorarioNidoChange}
        fetchData={fetchData}
        handleDownloadPDF={handleDownloadPDF}
        handleDownloadSelectedPDF={handleDownloadSelectedPDF}
        modoAcordeon={modoAcordeon}
        setModoAcordeon={setModoAcordeon}
        turno={turno}
        setTurno={setTurno}
        results={results}
        selectedHorarioIdx={selectedHorarioIdx}
        setSelectedHorarioIdx={setSelectedHorarioIdx}
        semestre={semestre}
        setSemestre={setSemestre}
      />

      <div className="flex-1 overflow-y-auto h-screen pr-2">
        {results.map((resultado, i) => (
          <Solucion
            key={i}
            resultado={resultado}
            index={i}
            bloques={bloques}
            dias={dias}
            colorMap={colorMap}
            generarMatriz={generarMatriz}
            generarMatrizConNombres={generarMatrizConNombres}
            modoAcordeon={modoAcordeon}
            acordeonActivo={acordeonActivo}
            setAcordeonActivo={setAcordeonActivo}
            onDownload={handleDownloadSelectedPDF}
            obtenerNombreMateria={obtenerNombreMateria}
            semestreSeleccionado={semestre}
            convertirABloque={convertirABloque}
          />
        ))}
      </div>
    </div>
  );
};

export default GenerarHorariosPage;
