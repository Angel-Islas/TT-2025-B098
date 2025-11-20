// Componente para mostrar una tabla de horario
import React from "react";

const HorarioTable = ({ matriz, bloques, dias, colorMap }) => (
  <div
    id="horario-table"
    className="p-4 w-full flex justify-center"
    style={{
      backgroundColor: "#fffdf6",
      borderRadius: "16px",
    }}
  >
    <table
      className="table-auto border-collapse text-sm
                 border-[3px] border-black rounded-xl shadow-[4px_4px_0px_black]
                 bg-[#fffdf6] font-[cursive]"
      style={{ width: "100%", maxWidth: "1100px" }}
    >
      <thead>
        <tr>
          <th
            className="border-[3px] border-black px-3 py-2 bg-[#fef3c7]
                       shadow-[2px_2px_0px_black] text-center"
          >
            Hora
          </th>

          {dias.map((dia, i) => (
            <th
              key={i}
              className="border-[3px] border-black px-3 py-2 bg-[#fef3c7]
                         shadow-[2px_2px_0px_black] text-center"
            >
              {dia}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {matriz.map((fila, i) => (
          <tr key={i}>
            {/* Columna de la hora */}
            <td
              className="border-[3px] border-black px-2 py-2 font-bold
                         bg-blue-100 shadow-[2px_2px_0px_black] text-center"
            >
              {bloques[i]}
            </td>

            {/* Celdas con materias */}
            {fila.map((celda, j) => {
              const materias = celda.split(" / ");
              return (
                <td
                  key={j}
                  className="border-[3px] border-black px-2 py-2 text-center
                             bg-white shadow-[2px_2px_0px_black]"
                >
                  {materias.map((m, k) => (
                    <div
                      key={k}
                      style={{
                        backgroundColor: colorMap[m] || "#f2f2f2",
                      }}
                      className="rounded-xl px-2 py-1 mb-1
                                 border-[2px] border-black
                                 shadow-[2px_2px_0px_black]
                                 text-xs"
                    >
                      {m}
                    </div>
                  ))}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default HorarioTable;
