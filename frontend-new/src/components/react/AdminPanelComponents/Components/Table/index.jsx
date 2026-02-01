import React from "react";
import styles from "./styles.module.css";

function Table({ data, titulos, actions=null }){
  return (
    <table className={styles.Table}>
    <thead>
      <tr>
        {titulos.map((item, idx) => 
          <th key={idx} style={{"width": item.size}}>{item.txt}</th>
        )}
      </tr>
    </thead>
    <tbody>
      {data.map((item,idx) => (
        <tr key={idx} className="row">
          {titulos.map((col,idx) => (
            <td key={idx} >
              <div
                className={col.key === "actions" ? styles.BtnContainer : ""}
              >
                {(col.key === "actions" && actions)
                ? actions.map((btn,idx) => 
                  <button
                    key={idx}
                    onClick={()=> btn.callback(item)}
                    style={{"backgroundColor":btn.color}}
                  >{btn.txt}</button>
                )
                : item[col.key]}
              </div>
            </td>
          ))}
        </tr>
      ))}
    </tbody>
    </table>
  );
}

export { Table };