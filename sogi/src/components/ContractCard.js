import React from "react";
import { MapPin } from "lucide-react";
import moment from "moment";

const CHIP = {
  "RENOVAÇÃO CONFIRMADA": "chip-green",
  "RENOVAÇÃO PENDENTE": "chip-yellow",
  "SEM PROVISÃO": "chip-gray",
};

export default function ContractCard({ contract, selectedDate }) {
  const c = contract;
  const titulo = c.empresa || c.nome;
  const statusNome = c.statusNome || "—";
  const venc = c.dataVencimento || c.vencimento;

  let vencTxt = "Base de Máquinas", style = { color: "#6b7280" };
  if (venc) {
    const days = moment(venc).diff(moment(selectedDate), "days");
    if (days < 0) { vencTxt = `Vencido há ${Math.abs(days)} dias`; style = { color: "#EF4444" }; }
    else if (days <= 30) { vencTxt = `Vence em ${days} dias`; style = { color: "#F59E0B" }; }
    else { vencTxt = `Vence em ${days} dias`; style = { color: "#10B981" }; }
  }

  return (
    <div className="card">
      <div className="top">
        <div>
          <h2>{titulo}</h2>
          <div className="muted"><MapPin size={14}/> {c.localizacao || "Não informado"}</div>
        </div>
        <span className={`badge ${CHIP[statusNome] || "chip-gray"}`}>{statusNome}</span>
      </div>

      <div style={{ margin: "8px 0 12px 0", fontWeight: 700, ...style }}>{vencTxt}</div>
      <div className="divider"></div>

      <div>
        <div className="muted" style={{ marginBottom: 8 }}>
          Máquinas ({(c.maquinas || c.machine || []).length})
        </div>
        <ul className="list">
          {((c.maquinas) || (c.machine || []).map(txt => ({ display: txt }))).map((m, i) => (
            <li key={i}>
              <span>🧰 {m.display || m}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
