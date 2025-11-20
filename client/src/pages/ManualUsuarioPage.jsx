import React, { useState } from "react";

const ManualUsuarioPage = () => {
  const [activeSection, setActiveSection] = useState("generacion");

  const sections = [
    { id: "generacion", title: "Generación de Horarios" },
    // { id: "configuracion", title: "Configuración Avanzada" },
    { id: "interpretacion", title: "Interpretación de Resultados" },
    { id: "modificacion", title: "Modificación de Horarios" },
    { id: "exportacion", title: "Exportación y Descarga" },
    { id: "preguntas", title: "Preguntas Frecuentes" },
  ];

  const card = "shadow-md rounded-2xl p-6 bg-blue-100 border-blue-200 border-blue-400 border-l-4";
  const highlight =
    "bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md shadow-sm";

  // -------------------
  // INICIO RÁPIDO (FIJO A LA IZQUIERDA)
  // -------------------
  const inicioRapido = (
    <div className="space-y-6">
      <p className="text-lg text-gray-700 font-medium">
        Bienvenido a <span className="font-bold">ACOPlanner</span>, el sistema
        inteligente que genera horarios escolares utilizando el algoritmo de
        optimización por colonia de hormigas (ACO).
      </p>

      <div className={highlight}>
        <h3 className="font-semibold text-yellow-800 mb-2">
          Pasos para comenzar:
        </h3>
        <ol className="list-decimal list-inside space-y-1 text-yellow-700">
          <li>Ve a la sección “Generar Horarios”.</li>
          <li>Selecciona tu turno o la hora de inicio deseada.</li>
          <li>Elige tu carga académica y semestre.</li>
          <li>Presiona “Generar Horarios”.</li>
          <li>Explora las 10 soluciones generadas.</li>
          <li>Descarga tu horario o modifícalo antes de exportarlo.</li>
        </ol>
      </div>
    </div>
  );

  // -------------------
  // CONTENIDO DE LAS SECCIONES (LADO DERECHO)
  // -------------------
  const content = {
    generacion: {
      title: "Generación de Horarios",
      content: (
        <div className="space-y-6">
          <p className="text-gray-700 font-medium">
            ACOPlanner utiliza un algoritmo de colonia de hormigas optimizado
            para buscar combinaciones de horarios sin choques y con una buena
            distribución.
          </p>

          <h3 className="text-xl font-bold text-gray-800">Flujo del proceso:</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={card}>
              <h4 className="font-semibold mb-2">1. Selección de Semestre</h4>
              <p className="text-sm text-gray-600">
                Filtra automáticamente desde CSV del backend.
              </p>
            </div>

            <div className={card}>
              <h4 className="font-semibold mb-2">2. Preferencias Iniciales</h4>
              <p className="text-sm text-gray-600">
                Configura carga académica, turno o hora inicial.
              </p>
            </div>

            <div className={card}>
              <h4 className="font-semibold mb-2">3. Ejecución del ACO</h4>
              <p className="text-sm text-gray-600">
                Se generan 10 soluciones óptimas basadas en peso y distribución.
              </p>
            </div>

            <div className={card}>
              <h4 className="font-semibold mb-2">4. Visualización</h4>
              <p className="text-sm text-gray-600">
                Tablas coloreadas, bloques y códigos de materias.
              </p>
            </div>
          </div>
        </div>
      ),
    },

    configuracion: {
      title: "Configuración Avanzada",
      content: (
        <div className="space-y-6">
          <p className="text-gray-700">
            Ajustes avanzados para personalizar aún más el resultado.
          </p>

          <div className="space-y-4">
            <div className={highlight}>
              <h4 className="font-semibold text-yellow-800 mb-2">Horario Nido</h4>
              <p className="text-sm text-gray-700">
                Selecciona uno de los 34 horarios base disponibles.
              </p>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md shadow-sm">
              <h4 className="font-semibold text-blue-800 mb-2">
                Horario Mínimo
              </h4>
              <p className="text-sm text-blue-700">
                Evita que se generen horarios demasiado matutinos.
              </p>
            </div>

            <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-md shadow-sm">
              <h4 className="font-semibold text-purple-800 mb-2">
                Modo Acordeón
              </h4>
              <p className="text-sm text-purple-700">
                Ideal si deseas ver muchas soluciones en poco espacio.
              </p>
            </div>
          </div>
        </div>
      ),
    },

    interpretacion: {
      title: "Interpretación de Resultados",
      content: (
        <div className="space-y-6">
          <p className="text-gray-700">
            Cada solución incluye datos clave para ayudarte a elegir la mejor.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={card}>
              <h4 className="font-semibold">Colores de Materias</h4>
              <p className="text-sm text-gray-600">
                Cada materia tiene un color único para identificarlas mejor.
              </p>
            </div>

            <div className={card}>
              <h4 className="font-semibold">Calidad del Horario</h4>
              <p className="text-sm text-gray-600">
                El sistema asigna una calidad a cada solución, una mayor calidad significa un horario mas limpio y funcional.
              </p>
            </div>

            <div className={card}>
              <h4 className="font-semibold">Tabla Horaria</h4>
              <p className="text-sm text-gray-600">
                Vista estructurada día–hora.
              </p>
            </div>

            <div className={card}>
              <h4 className="font-semibold">Detalles de Materias</h4>
              <p className="text-sm text-gray-600">
                Información completa de cada materia.
              </p>
            </div>
          </div>
        </div>
      ),
    },

    modificacion: {
      title: "Modificación de Horarios",
      content: (
        <div className="space-y-6">
          <p className="text-gray-700">
            Personaliza tu horario antes de exportarlo:
          </p>

          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            <li>Añade materias que no hayan sido seleccionadas por las hormigas.</li>
            <li>Deshabilitar materias.</li>
            <li>Modifica el horario de materias seleccionadas.</li>
          </ul>
        </div>
      ),
    },

    exportacion: {
      title: "Exportación y Descarga",
      content: (
        <div className="space-y-6">
          <p className="text-gray-700">
            Puedes descargar cualquier horario, incluyendo versiones modificadas.
          </p>

          <div className="space-y-4">
            <div className="bg-pink-50 border-l-4 border-pink-400 p-4 rounded-md shadow-sm">
              <h4 className="font-semibold text-pink-800 mb-2">
                Descarga Individual
              </h4>
              <p className="text-pink-700 text-sm">
                Exporta horario, colores, códigos y calidad.
              </p>
            </div>

            <div className="bg-pink-50 border-l-4 border-pink-400 p-4 rounded-md shadow-sm">
              <h4 className="font-semibold text-pink-800 mb-2">
                Descarga Modificada
              </h4>
              <p className="text-pink-700 text-sm">
                Si editas el horario, el PDF incluirá tu versión final.
              </p>
            </div>
          </div>
        </div>
      ),
    },

    preguntas: {
      title: "Preguntas Frecuentes",
      content: (
        <div className="space-y-4">
          <div className={card}>
            <h5 className="font-semibold">¿El sistema usa base de datos?</h5>
            <p className="text-sm text-gray-600">
              No. Todo se lee desde archivos CSV.
            </p>
          </div>

          <div className={card}>
            <h5 className="font-semibold">¿Por qué 10 soluciones?</h5>
            <p className="text-sm text-gray-600">
              Son las mejores encontradas por ACO en la ejecución.
            </p>
          </div>

          <div className={card}>
            <h5 className="font-semibold">¿Los horarios se guardan?</h5>
            <p className="text-sm text-gray-600">
              Solo temporalmente durante la sesión.
            </p>
          </div>
        </div>
      ),
    },
  };

  return (
    <div className="min-h-screen py-10 px-4 font-['Comic_Sans_MS']">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-10 text-gray-900 tracking-wide rotate-[-1deg]">
          Manual de Usuario – ACOPlanner
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* ----------------------------- */}
          {/* COLUMNA IZQUIERDA: INICIO RÁPIDO */}
          {/* ----------------------------- */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 border-4 border-black shadow-[3px_3px_0px_#000] sticky top-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 rotate-[-1deg]">
                Inicio Rápido
              </h2>

              <div className="prose max-w-none">{inicioRapido}</div>
            </div>
          </div>

          {/* ----------------------------- */}
          {/* COLUMNA DERECHA: SECCIONES */}
          {/* ----------------------------- */}
          <div className="lg:col-span-3 space-y-6">
            {/* Botones arriba */}
            <div className="bg-white rounded-xl border-4 border-black p-4 shadow-[3px_3px_0px_#000] flex flex-wrap justify-center gap-3 text-center">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium border-2 border-black transition-all duration-200 ${
                    activeSection === section.id
                      ? "bg-green-300 shadow-inner"
                      : "bg-gray-100 hover:bg-green-100"
                  }`}
                >
                  {section.title}
                </button>
              ))}
            </div>

            {/* Contenido */}
            <div className="bg-white rounded-2xl shadow-[3px_3px_0px_#000] p-8 border-4 border-black">
              <div className="flex items-center mb-6 justify-center">
                <h2 className="text-3xl font-bold text-gray-900">
                  {content[activeSection]?.title}
                </h2>
              </div>

              <div className="prose max-w-none">
                {content[activeSection]?.content}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManualUsuarioPage;
