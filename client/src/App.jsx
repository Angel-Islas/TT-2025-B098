import React, { useState } from 'react';
import axios from 'axios';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import ManualUsuarioPage from './pages/ManualUsuarioPage';
import AcercaDePage from './pages/AcercaDePage';
import GenerarHorariosPage from './pages/GenerarHorariosPage';
import ModificarHorarioPage from './pages/ModificarHorarioPage';
import materiasData from './data/materias.json';

const App = () => {
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

  const bloques = [
    "7:00 - 8:30", "8:30 - 10:00", "10:30 - 12:00",
    "12:00 - 13:30", "13:30 - 15:00", "15:00 - 16:30",
    "16:30 - 18:00", "18:30 - 20:00", "20:00 - 21:30"
  ];

  const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

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

  const coloresDisponibles = [
    "#FFB6C1", "#ADD8E6", "#90EE90", "#FFD700", "#FFA07A",
    "#9370DB", "#00CED1", "#F08080", "#DAA520", "#87CEFA",
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

  // Función para obtener el nombre completo de una materia
  const obtenerNombreMateria = (codigoMateria) => {
    return materiasData[codigoMateria] || codigoMateria;
  };

  // Función para obtener materias según el semestre
  const obtenerMateriasPorSemestre = (semestreSeleccionado) => {
    if (!semestreSeleccionado) return materiasData;

    const materiasPorSemestre = {};

    // Distribución más equilibrada de materias por semestre
    const materiasPorSemestreMap = {
      2: ["c-201", "c-202", "c-203", "c-204", "c-205"], // Semestre 2: 5 materias básicas
      3: ["c-206", "c-207", "c-208", "c-209"], // Semestre 3: 4 materias
      4: ["c-210", "c-211", "c-212", "c-213", "c-214"], // Semestre 4: 5 materias
      5: ["c-215", "c-216", "c-217", "c-218"], // Semestre 5: 4 materias
      6: ["c-219", "c-220"] // Semestre 6: 2 materias (proyecto final y prácticas)
    };

    const materiasSemestre = materiasPorSemestreMap[semestreSeleccionado] || [];

    materiasSemestre.forEach(codigo => {
      if (materiasData[codigo]) {
        materiasPorSemestre[codigo] = materiasData[codigo];
      }
    });

    return materiasPorSemestre;
  };

  const fetchData = async () => {
    try {
      const matrixResponse = await axios.post('http://localhost:5000/generate_matrix', {
        horario_nido: horarioNido,
        horario_minimo: horarioMinimo,
        semestre: semestre || null,
        turno: turno || null,
        carga_academica: cargaAcademica || null
      });
      if (matrixResponse.data?.message) {
        const acoResponse = await axios.get('http://localhost:5000/run_aco_solver', {
          params: { carga_academica: cargaAcademica }
        });
        const data = acoResponse.data.aco_result || [];
        setResults(data);
        asignarColores(data);
      }
    } catch (error) {
      console.error('Error al generar la matriz:', error);
    }
  };

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

  const generarMatrizConNombres = (ruta, obtenerNombreMateria) => {
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


  const handleHorarioNidoChange = (e) => {
    const value = e.target.value;
    setHorarioNido(value);
    const numero = parseInt(value.replace('H', ''), 10);
    if (!isNaN(numero)) {
      setHorarioMinimo(numero);
    }
    setTurno(""); // Si el usuario edita manualmente, limpia el turno
  };

  // Efecto para actualizar horarioNido y horarioMinimo según el turno
  React.useEffect(() => {
    if (turno === "matutino") {
      setHorarioNido("H1"); // O el valor que corresponda
      setHorarioMinimo(1); // 7:00
    } else if (turno === "vespertino") {
      setHorarioNido("H20"); // O el valor que corresponda
      setHorarioMinimo(20); // 13:30
    }
  }, [turno]);

  const handleDownloadPDF = async () => {
    try {
      const solucionesConMatriz = results.map((resultado) => {
        const matriz = generarMatrizConNombres(resultado.ruta, obtenerNombreMateria);
        return {
          peso: resultado.peso,
          ruta: resultado.ruta,
          matriz: matriz.map((fila) => fila.map((celda) => celda || "")),
          nombres_materias: obtenerNombreMateria // Enviar función para que el servidor pueda usarla
        };
      });

      const response = await axios.post(
        'http://localhost:5000/generate_pdf',
        { soluciones: solucionesConMatriz },
        {
          responseType: 'blob',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'soluciones.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error al descargar el PDF:', error);
    }
  };

  // Descargar solo el horario seleccionado
  const handleDownloadSelectedPDF = async (idx) => {
    try {
      if (typeof idx !== 'number' || !results[idx]) {
        alert('No se encontró el horario para descargar.');
        return;
      }
      const seleccionado = results[idx];
      const matriz = generarMatrizConNombres(seleccionado.ruta, obtenerNombreMateria);
      const solucionesConMatriz = [{
        peso: seleccionado.peso,
        ruta: seleccionado.ruta,
        matriz: matriz.map((fila) => fila.map((celda) => celda || "")),
        nombres_materias: obtenerNombreMateria
      }];
      const response = await axios.post(
        'http://localhost:5000/generate_pdf',
        { soluciones: solucionesConMatriz },
        {
          responseType: 'blob',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `horario_${idx + 1}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error al descargar el PDF:', error);
    }
  };


  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/generar-horarios" element={
            <GenerarHorariosPage />
          } />
          <Route path="/modificar" element={
            <ModificarHorarioPage
              resultados={results}
              bloques={bloques}
              dias={dias}
              colorMap={colorMap}
              generarMatriz={generarMatriz}
              obtenerNombreMateria={obtenerNombreMateria}
              semestreSeleccionado={semestre}
              generarMatrizConNombres={generarMatrizConNombres}
            />
          } />
          <Route path="/manual" element={<ManualUsuarioPage />} />
          <Route path="/acerca-de" element={<AcercaDePage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
