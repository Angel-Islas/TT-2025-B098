import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { HiOutlineBugAnt } from "react-icons/hi2";

const Header = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white mx-4 my-4 border-[4px] border-black rounded-2xl shadow-[4px_4px_0px_#000]">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">

          {/* LOGO */}
          <div className="flex items-center justify-between">
              <HiOutlineBugAnt className="m-2 text-3xl " />
            <h1 className="text-2xl font-['Comic_Sans_MS'] font-black tracking-wider rotate-[-1deg]">
              ACOPlanner
            </h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-4 font-['Comic_Sans_MS'] ">
            <Link
              to="/"
              className={`px-4 py-2 border-2 border-black rounded-xl shadow-[3px_3px_0px_#000] 
              transition-all active:translate-x-[2px] active:translate-y-[2px] 
              ${
                isActive("/")
                  ? "bg-yellow-300"
                  : "bg-white hover:bg-yellow-200"
              }`}
            >
              Inicio
            </Link>

            <Link
              to="/generar-horarios"
              className={`px-4 py-2 border-2 border-black rounded-xl shadow-[3px_3px_0px_#000] 
              transition-all active:translate-x-[2px] active:translate-y-[2px]
              ${
                isActive("/generar-horarios")
                  ? "bg-green-300"
                  : "bg-white hover:bg-green-200"
              }`}
            >
              Generar Horarios
            </Link>

            <Link
              to="/manual"
              className={`px-4 py-2 border-2 border-black rounded-xl shadow-[3px_3px_0px_#000] 
              transition-all active:translate-x-[2px] active:translate-y-[2px]
              ${
                isActive("/manual")
                  ? "bg-blue-300"
                  : "bg-white hover:bg-blue-200"
              }`}
            >
              Manual de Usuario
            </Link>

            <Link
              to="/acerca-de"
              className={`px-4 py-2 border-2 border-black rounded-xl shadow-[3px_3px_0px_#000] 
              transition-all active:translate-x-[2px] active:translate-y-[2px]
              ${
                isActive("/acerca-de")
                  ? "bg-pink-300"
                  : "bg-white hover:bg-pink-200"
              }`}
            >
              Acerca del Proyecto
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-black"
            onClick={() => setOpen(!open)}
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {open ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="mt-4 md:hidden flex flex-col space-y-3 font-['Comic Sans MS']">

            <Link
              to="/"
              className={`px-4 py-2 border-2 border-black rounded-xl shadow-[2px_2px_0px_#000]
              ${isActive("/") ? "bg-yellow-300" : "bg-white hover:bg-yellow-200"}`}
              onClick={() => setOpen(false)}
            >
              Inicio
            </Link>

            <Link
              to="/generar-horarios"
              className={`px-4 py-2 border-2 border-black rounded-xl shadow-[2px_2px_0px_#000]
              ${
                isActive("/generar-horarios")
                  ? "bg-blue-300"
                  : "bg-white hover:bg-blue-200"
              }`}
              onClick={() => setOpen(false)}
            >
              Generar Horarios
            </Link>

            <Link
              to="/manual"
              className={`px-4 py-2 border-2 border-black rounded-xl shadow-[2px_2px_0px_#000]
              ${
                isActive("/manual")
                  ? "bg-green-300"
                  : "bg-white hover:bg-green-200"
              }`}
              onClick={() => setOpen(false)}
            >
              Manual de Usuario
            </Link>

            <Link
              to="/acerca-de"
              className={`px-4 py-2 border-2 border-black rounded-xl shadow-[2px_2px_0px_#000]
              ${
                isActive("/acerca-de")
                  ? "bg-pink-300"
                  : "bg-white hover:bg-pink-200"
              }`}
              onClick={() => setOpen(false)}
            >
              Acerca del Proyecto
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
