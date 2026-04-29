import styles from "./InvitadosTable.module.css";

import GLOBALS from "@/config/globals.js";
const API = GLOBALS.API;

function InvitadosTable({ data, titulos, actions, onLoad }) {
  const renderCell = (item, key) => {
    if (key === "img") {
      return (
        <img
          src={API + item.img}
          alt={item.nombre}
          className={styles.Thumbnail}
        />
      );
    }
    if (key === "actions" && actions) {
      return (
        <div className={styles.Actions}>
          {actions.map((btn, idx) => (
            <button
              key={idx}
              title={btn.txt}
              onClick={() => btn.callback(item)}
              style={{ backgroundColor: btn.color }}
              disabled={onLoad}
            >
              {btn.emoji}
            </button>
          ))}
        </div>
      );
    }
    return item[key];
  };

  if (!data || data.length === 0) {
    return (
      <p className={styles.Empty}>No hay invitados aún...</p>
    );
  }

  return (
    <table className={styles.Table}>
      <thead>
        <tr>
          {titulos.map((item, idx) => (
            <th key={idx} style={{ width: item.size }}>
              {item.txt}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item, idx) => (
          <tr key={idx} className="row">
            {titulos.map((col, colIdx) => (
              <td key={colIdx}>{renderCell(item, col.key)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export { InvitadosTable };
