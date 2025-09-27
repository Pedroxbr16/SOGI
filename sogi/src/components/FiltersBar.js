import React from "react";

export default function FiltersBar({
  q, setQ,
  fCoord, setFCoord,
  fContrato, setFContrato,
  fMaquina, setFMaquina,
  coords = [], contratos = [], maquinas = [],
  onClear,
  headerLeft
}) {
  return (
    <div className="filters">
      <div className="filters-left">{headerLeft}</div>
      <div className="filters-right">
        <input className="input" placeholder="BUSCAR" value={q} onChange={(e)=>setQ(e.target.value)} />
        <select className="select" value={fCoord} onChange={(e)=>setFCoord(e.target.value)}>
          <option value="">Coordenador</option>
          {coords.map((o)=> <option key={o} value={o}>{o}</option>)}
        </select>
        <select className="select" value={fContrato} onChange={(e)=>setFContrato(e.target.value)}>
          <option value="">Status do contrato</option>
          {contratos.map((o)=> <option key={o} value={o}>{o}</option>)}
        </select>
        <select className="select" value={fMaquina} onChange={(e)=>setFMaquina(e.target.value)}>
          <option value="">Status da máquina</option>
          {maquinas.map((o)=> <option key={o} value={o}>{o}</option>)}
        </select>
        <button className="iconbtn" onClick={onClear}>Limpar</button>
      </div>
    </div>
  );
}
