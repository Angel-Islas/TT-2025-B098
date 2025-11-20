// src/pages/ModificarHorarioPage.jsx
import React from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import ModificarHorario from '../components/ModificarHorario';
import materiasData from '../data/materias.json';

const ModificarHorarioPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Obtener los datos del estado de navegación (datos principales)
  const stateData = location.state || [];
  // console.log('state data:', stateData)

  // Obtener el índice del horario desde los parámetros de URL
  const horarioIndex = parseInt(searchParams.get('horario')) || 0;

  // Extraer datos del state
  const resultado = stateData.resultado|| [];
  // console.log('modificar horario pagina: ', resultado)
  const bloques = stateData.bloques || [];
  const dias = stateData.dias || [];
  const colorMap = stateData.colorMap || {};
  const semestre = stateData.semestre;

  // Función para obtener el nombre completo de una materia
  const obtenerNombreMateria = (codigoMateria) => {
    return materiasData[codigoMateria] || codigoMateria;
  };

  // Función para generar matriz de horarios (simplificada)
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

  // Función para generar matriz con nombres
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

  // Función auxiliar para convertir horarios a bloques
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

  // Datos de horarios (necesarios para generarMatriz)
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

  // Si no hay datos principales, mostrar mensaje de error
  if (!resultado) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
        <p>No se encontró el horario a modificar. Por favor, regrese a la página de generación.</p>
        <button
          onClick={() => navigate('/generar-horarios')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Volver a Generar Horarios
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-bold mb-4">
          Modificar Horario #{horarioIndex + 1}
        </h2>
      </div>

      <ModificarHorario
        resultados={[resultado]}
        bloques={bloques}
        dias={dias}
        colorMap={colorMap}
        semestreSeleccionado={semestre}
        obtenerNombreMateria={obtenerNombreMateria}
        generarMatriz={generarMatriz}
        generarMatrizConNombres={generarMatrizConNombres}
      />
    </div>
  );
};

export default ModificarHorarioPage;
