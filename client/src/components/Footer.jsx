import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer
      className="
        mt-12 
        bg-white 
        border-t-[4px] border-black 
        shadow-[3px_3px_0px_#000]
        py-4
        font-['Comic_Sans_MS',cursive]
      "
    >
      <div className="container mx-auto px-4 max-w-5xl">

        {/* Contenido principal */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-3">

          {/* Descripción */}
          <p className="text-sm text-black">
            ACOPlanner — Generador de horarios escolares para los estudiantes de la ESCOM
          </p>

          {/* Links */}
          <div className="flex gap-6">

          <p className="text-center text-black text-xs">
            © {new Date().getFullYear()} ACOPlanner — Todos los derechos reservados.
          </p>

            <Link
              to="https://github.com/Angel-Islas"
              target="_blank"
              className="
                hidden
                text-sm 
                text-black 
                hover:bg-yellow-200 
                px-2 py-1 
                rounded-lg 
                transition-all 
                border-[2px] border-black 
                shadow-[2px_2px_0px_#000]
                active:translate-x-[2px] active:translate-y-[2px]
              "
            >
              Repositorio
            </Link>

            <Link
              to="/acerca-de"
              target="_blank"
              className="
              hidden
                text-sm 
                text-black 
                hover:bg-yellow-200 
                px-2 py-1 
                rounded-lg 
                transition-all
                border-[2px] border-black 
                shadow-[2px_2px_0px_#000]
                active:translate-x-[2px] active:translate-y-[2px]
              "
            >
              Sugerencias
            </Link>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
