// Sidebar con estilo garabato
import React from 'react';

const Sidebar = ({
  horarioNido,
  handleHorarioNidoChange,
  fetchData,
  handleDownloadPDF,
  modoAcordeon,
  setModoAcordeon,
  turno,
  setTurno,
  semestre,
  setSemestre,
  cargaAcademica,
  setCargaAcademica
}) => {
  const horariosDisponibles = [
    { id: 'H1', hora: '7:00' },
    { id: 'H5', hora: '8:30' },
    { id: 'H8', hora: '10:30' },
    { id: 'H12', hora: '12:00' },
    { id: 'H18', hora: '13:30' },
    { id: 'H20', hora: '15:00' },
    { id: 'H24', hora: '16:30' },
    { id: 'H28', hora: '18:30' }
  ];

  const horaBloqueada = !!turno;

  return (
    <div className="
      w-1/4 bg-white p-5 rounded-2xl
      border-4 border-black shadow-[6px_6px_0px_0px_#000]
      space-y-6
      font-['Comic_Sans_MS']
    ">
      <h2 className="text-xl font-bold mb-2 -rotate-1">
        Configuración
      </h2>

      <form className="space-y-4">

        {/* Turno */}
        <label className="block">
          <span className="font-semibold">Turno:</span>
          <select
            value={turno}
            onChange={e => setTurno(e.target.value)}
            className="
              w-full p-2 mt-1 rounded-xl border-2 border-black
              bg-white shadow-[3px_3px_0px_0px_black]
            "
          >
            <option value="">Selecciona turno</option>
            <option value="matutino">Matutino</option>
            <option value="vespertino">Vespertino</option>
          </select>
        </label>

        {/* Semestre */}
        <label className="block">
          <span className="font-semibold">Semestre:</span>
          <select
            value={semestre || ''}
            onChange={e => setSemestre(parseInt(e.target.value))}
            className="
              w-full p-2 mt-1 rounded-xl border-2 border-black
              bg-white shadow-[3px_3px_0px_0px_black]
            "
          >
            <option value="">Todos</option>
            {[2, 3, 4, 5, 6, 7].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </label>

        {/* Hora inicial del día */}
        <label className="block">
          <span
            className={`font-semibold ${
              horaBloqueada ? 'text-red-600' : ''
            }`}
          >
            Hora inicial del día:
          </span>

          <select
            value={horarioNido}
            onChange={e => handleHorarioNidoChange(e.target.value)}
            disabled={horaBloqueada}
            className={`
              w-full p-2 mt-1 rounded-xl border-2
              shadow-[3px_3px_0px_0px_black]
              ${horaBloqueada
                ? 'bg-red-200 border-red-600 cursor-not-allowed'
                : 'bg-white border-black'}
            `}
          >
            <option value="">Selecciona hora</option>
            {horariosDisponibles.map(h => (
              <option key={h.id} value={h.id}>{h.hora}</option>
            ))}
          </select>

          {horaBloqueada && (
            <p className="text-xs text-red-600 mt-1">
              * No se puede seleccionar hora cuando hay turno
            </p>
          )}
        </label>

        {/* Carga académica */}
        <label className="block">
          <span className="font-semibold">Carga académica:</span>
          <select
            value={cargaAcademica || ''}
            onChange={e => setCargaAcademica(e.target.value)}
            className="
              w-full p-2 mt-1 rounded-xl border-2 border-black
              bg-white shadow-[3px_3px_0px_0px_black]
            "
          >
            <option value="">Selecciona carga</option>
            <option value="maxima">Máxima (77.40 créditos)</option>
            <option value="media">Media (48.38 créditos)</option>
            <option value="minima">Mínima (32.25 créditos)</option>
          </select>
        </label>
      </form>

      {/* Botones */}
      <button
        onClick={fetchData}
        className="
          w-full bg-yellow-200 border-2 border-black rounded-xl
          py-2 font-bold shadow-[4px_4px_0px_0px_black]
          hover:bg-yellow-400 transition
        "
      >
        Generar Horarios
      </button>

      <button
        onClick={handleDownloadPDF}
        className="
          w-full bg-blue-300 border-2 border-black rounded-xl
          py-2 font-bold shadow-[4px_4px_0px_0px_black]
          hover:bg-blue-400 transition
        "
      >
        Descargar PDF (todos)
      </button>

      <label className="flex items-center gap-2 text-sm font-semibold">
        <input
          type="checkbox"
          checked={modoAcordeon}
          onChange={() => setModoAcordeon(!modoAcordeon)}
          className="w-4 h-4"
        />
        Modo acordeón
      </label>
    </div>
  );
};

export default Sidebar;
