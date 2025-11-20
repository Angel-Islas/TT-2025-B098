import React from "react";
import { Link } from "react-router-dom";
import { PiGraphLight } from "react-icons/pi";
import { FiClock } from "react-icons/fi";
import { LuHeart } from "react-icons/lu";

const LandingPage = () => {
  return (
    <div className="font-['Comic_Sans_MS',cursive]">

      {/* HERO GARABATO */}
      <section className="
        bg-white 
        border-[5px] border-black 
        shadow-[6px_6px_0px_#000] 
        rounded-2xl 
        mx-4 mt-6 mb-10 py-16
        text-center
      ">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 rotate-[-0.5deg]">
          Sistema de Generación de Horarios
        </h1>

        <p className="text-xl md:text-2xl max-w-2xl mx-auto mb-8 rotate-[0.5deg]">
          Crea horarios escolares óptimos usando un algoritmo ACO
          con un estilo divertido y fácil de usar.
        </p>

        <div className="space-x-4">
          <Link
            to="/generar-horarios"
            className="
              bg-white border-[3px] border-black 
              shadow-[4px_4px_0px_#000] 
              px-8 py-3 rounded-lg 
              text-black text-lg 
              hover:bg-blue-200 
              hover:translate-x-[2px] hover:translate-y-[2px]
              transition-all inline-block
            "
          >
            Generar Horario
          </Link>

          <Link
            to="/manual"
            className="
              bg-white border-[3px] border-black 
              shadow-[4px_4px_0px_#000] 
              px-8 py-3 rounded-lg 
              text-black text-lg 
              hover:bg-green-200 
              hover:translate-x-[2px] hover:translate-y-[2px]
              transition-all inline-block
            "
          >
            Ver Manual
          </Link>
        </div>
      </section>

      {/* FEATURES GARABATO */}
      <section className="py-12 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-black rotate-[1deg]">
          Características Principales
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {/* CARD 1 */}
          <div className="
            bg-white 
            border-[4px] border-black 
            shadow-[5px_5px_0px_#000] 
            rounded-xl p-8 text-center rotate-[-1deg]
          ">
            <div className="w-16 h-16 bg-yellow-200 border-[3px] border-black shadow-[3px_3px_0px_#000] rounded-full flex items-center justify-center mx-auto mb-6">
              <PiGraphLight className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">Algoritmo Inteligente</h3>
            <p className="text-black">
              El ACO encuentra combinaciones óptimas evitando choques entre materias.
            </p>
          </div>

          {/* CARD 2 */}
          <div className="
            bg-white 
            border-[4px] border-black 
            shadow-[5px_5px_0px_#000] 
            rounded-xl p-8 text-center rotate-[1deg]
          ">
            <div className="w-16 h-16 bg-green-200 border-[3px] border-black shadow-[3px_3px_0px_#000] rounded-full flex items-center justify-center mx-auto mb-6">
              <FiClock className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">Optimización de Tiempo</h3>
            <p className="text-black">
              Produce horarios compactos y eficientes reduciendo huecos innecesarios.
            </p>
          </div>

          {/* CARD 3 */}
          <div className="
            bg-white 
            border-[4px] border-black 
            shadow-[5px_5px_0px_#000] 
            rounded-xl p-8 text-center rotate-[-1deg]
          ">
            <div className="w-16 h-16 bg-purple-200 border-[3px] border-black shadow-[3px_3px_0px_#000] rounded-full flex items-center justify-center mx-auto mb-6">
              <LuHeart className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">Fácil de Usar</h3>
            <p className="text-black">
              Interfaz intuitiva que permite crear horarios en pocos pasos.
            </p>
          </div>
        </div>
      </section>

      {/* PASOS GARABATO */}
      <section className="
        bg-white 
        border-[4px] border-black 
        shadow-[5px_5px_0px_#000] 
        rounded-xl mx-4 mt-16 p-12
      ">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 rotate-[1deg]">
          Cómo Funciona
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 text-center">
          
          {[ 
            ["1", "Selecciona tu semestre", "Elige el semestre que quieres cursar"],
            ["2", "Configura tus preferencias", "Ajusta turno y carga de creditos"],
            ["3", "Genera horarios", "El ACO busca las mejores combinaciones"],
            ["4", "Descarga o modifica", "Exporta en PDF o ajusta a tu gusto"],
          ].map(([num, title, desc], i) => (
            <div 
              key={i}
              className="flex flex-col items-center rotate-[1deg]"
            >
              <div className="
                w-14 h-14 
                bg-rose-200 
                border-[3px] border-black 
                shadow-[3px_3px_0px_#000] 
                rounded-full 
                flex items-center justify-center 
                mb-4 text-xl font-bold
              ">
                {num}
              </div>
              <h3 className="text-xl font-bold mb-2">{title}</h3>
              <p className="text-black">{desc}</p>
            </div>
          ))}

        </div>
      </section>

      {/* CTA FINAL GARABATO */}
      <section className="py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 rotate-[-1deg]">
          ¿Listo para crear tu horario perfecto?
        </h2>

        <p className="text-xl max-w-2xl mx-auto mb-8 rotate-[1deg]">
          Comienza ahora y genera horarios optimizados en segundos.
        </p>

        <Link
          to="/generar-horarios"
          className="
            bg-white border-[3px] border-black 
            shadow-[4px_4px_0px_#000] 
            px-10 py-4 rounded-xl 
            text-black font-bold text-xl 
            hover:bg-yellow-200 
            hover:translate-x-[2px] hover:translate-y-[2px]
            transition-all inline-block
          "
        >
          Empezar Ahora
        </Link>
      </section>
    </div>
  );
};

export default LandingPage;
