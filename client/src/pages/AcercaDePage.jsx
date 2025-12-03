import React from 'react';

const AcercaDePage = () => {
  const developers = [
    {
      name: "Ángel Israel Islas Duarte",
      role: "Alumno de Ingenieria en Sistemas Computacionales",
      email: "aislasd1500@alumno.ipn.mx"
    },
  ];

  const directoras =[
        {
      name: "Ana Belem Juárez Méndez",
      role: "Maestria en ciencias de la computación",
      email: "abjuarezm@ipn.mx"
    },
    {
      name: "Abril Valeria Uriarte Arcia",
      role: "Doctorado en ciencias de la computación",
      email: "auriartea@ipn.mx"
    }
  ];

  const technologies = [
    { name: "React.js", description: "Framework para la interfaz y gestión de componentes." },
    { name: "Python Flask", description: "Servidor ligero encargado de ejecutar el algoritmo ACO." },
    { name: "Tailwind CSS", description: "Framework CSS para un diseño moderno y responsivo." },
    { name: "CSV como base de datos", description: "Estructura ligera para cargar materias y restricciones." },
    { name: "Axios", description: "Cliente HTTP para comunicación cliente-servidor." }
  ];

  return (
    <div className="container mx-auto px-4 py-10 font-['Comic_Sans_MS']">

      {/* Título con estilo doodle */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-800 mb-4 tracking-wider rotate-[-1deg]">
          Acerca del Proyecto
        </h1>
        <p className="text-xl text-gray-600">
          Sistema inteligente de generación de horarios con ACO
        </p>
      </div>

      {/* GRID principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* ---------------- LADO IZQUIERDO ---------------- */}
        <div className="space-y-10">

          {/* Descripción */}
          <div className="bg-white rounded-2xl p-6 shadow-[4px_4px_0px_#000000] border-4 border-black rotate-[0.5deg]">
            <h2 className="text-3xl font-bold mb-4 tracking-wide">Descripción del Proyecto</h2>

            <p className="text-gray-800 mb-3">
              Este sistema optimiza la creación de horarios académicos utilizando el algoritmo 
              de optimización por colonia de hormigas (ACO). Analiza combinaciones posibles, 
              minimiza conflictos y genera horarios completos sin traslapes.
            </p>

            <p className="text-gray-800 mb-3">
              Permite seleccionar materias, visualizar soluciones, modificarlas, compararlas y 
              exportarlas en PDF. Todo el backend corre en Python Flask y el frontend está hecho en React.
            </p>

            <p className="text-gray-800">
              El objetivo principal es facilitar la toma de decisiones para estudiantes de ingeniería,
              generando horarios óptimos y personalizados.
            </p>
          </div>

          {/* Desarrolladores */}
          <div className="bg-white rounded-2xl p-6 shadow-[4px_4px_0px_#000000] border-4 border-black rotate-[-0.7deg]">
            <h2 className="text-3xl font-bold mb-6 tracking-wide">Desarrollador</h2>

            <div className="space-y-6">
              {developers.map((dev, index) => (
                <div
                  key={index}
                  className="border-l-4 border-green-500 pl-4"
                >
                  <h3 className="text-xl font-semibold text-gray-800">{dev.name}</h3>
                  <p className="text-gray-600 text-sm">{dev.role}</p>
                  <p className="text-gray-500 text-sm">{dev.email}</p>
                </div>
              ))}
            </div>

            <h2 className='text-3xl font-bold my-6 tracking-wide'>Directoras</h2>

            <div className='space-y-6'>
              {directoras.map((dev, index)=> (
                <div
                  key={index}
                  className='border-l-4 border-yellow-500 pl-4'
                >
                  <h3 className='text-xl font-semibold text-gray-800'>{dev.name}</h3>
                  <p className='text-gray-600 text-sm'>{dev.role}</p>
                  <p className='text-gray-500 text-sm'>{dev.email}</p>

                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ---------------- LADO DERECHO ---------------- */}
        <div className="space-y-10">

          {/* Objetivo */}
          <div className="bg-white rounded-2xl p-6 shadow-[4px_4px_0px_#000000] border-4 border-black rotate-[0.8deg]">
            <h2 className="text-3xl font-bold mb-4 tracking-wide">Objetivo</h2>
            <p className="text-gray-800">
              Desarrollar un sistema basado en el algoritmo ACO para la optimización de la generación de horarios escolares para los estudiantes de ESCOM que minimice la cantidad de horas libres.
            </p>
            <h2 className='text-3xl font-bold mb-4 tracking-wide'>Alcance</h2>
            <p className='text-gray-800'>
              El proyecto desarrolla un sistema para generar horarios escolares utilizando el algoritmo ACO, 
              enfocado en el plan de estudios 2020 de Ingeniería en Sistemas Computacionales de la ESCOM. 
              Su alcance considera asignaturas obligatorias y optativas distribuidas por semestre, y está dirigido principalmente a alumnos regulares 
              que siguen el avance natural del plan. El sistema busca apoyar la organización académica del estudiante proporcionando horarios viables 
              que reduzcan conflictos, huecos innecesarios y saturación de actividades.
            </p>
          </div>

          {/* Tecnologías */}
          <div className="bg-white rounded-2xl p-6 shadow-[4px_4px_0px_#000000] border-4 border-black rotate-[-0.5deg]">
            <h2 className="text-3xl font-bold mb-4 tracking-wide">Tecnologías</h2>

            <div className="space-y-4">
              {technologies.map((tech, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-800">{tech.name}</h3>
                  <p className="text-gray-600 text-sm">{tech.description}</p>
                </div>
              ))}
            </div>
            
          </div>

          {/* Trabajo a futuro */}
          <div className="bg-white rounded-2xl p-6 shadow-[4px_4px_0px_#000000] border-4 border-black rotate-[1deg]">
            <h2 className="text-3xl font-bold mb-4 tracking-wide">Trabajo a Futuro</h2>

            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="w-2 h-2 mt-2 bg-pink-500 rounded-full"></span>
                  <p className="ml-3 text-gray-800">
                    Integración de planes de estudio de todas las carreras de ESCOM para generar horarios personalizados
                    no solo para ISC, sino también para LCD, IIA.
                  </p>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 mt-2 bg-pink-500 rounded-full"></span>
                  <p className="ml-3 text-gray-800">
                    Conexión directa con el SAES para obtener en tiempo real la situación académica del estudiante:
                    materias acreditadas, reprobadas, seriación y carga óptima sugerida.
                  </p>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 mt-2 bg-pink-500 rounded-full"></span>
                  <p className="ml-3 text-gray-800">
                    Considerar la calidad y evaluación histórica de profesores para generar horarios que prioricen grupos
                    con mejores calificaciones promedio y menor índice de reprobación.
                  </p>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 mt-2 bg-pink-500 rounded-full"></span>
                  <p className="ml-3 text-gray-800">
                    Implementar un módulo especial para que profesores puedan generar sus propios horarios, evitando choques
                    entre grupos, cargas excesivas y respetando sus restricciones de tiempo.
                  </p>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 mt-2 bg-pink-500 rounded-full"></span>
                  <p className="ml-3 text-gray-800">
                    Mejora del algoritmo mediante un enfoque de optimización multiobjetivo, incorporando metricas para mejorar la calidad de las soluciones, 
                    además integrar mejoras en la heurística propuesta para mejorar su rendimiento
                  </p>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AcercaDePage;
