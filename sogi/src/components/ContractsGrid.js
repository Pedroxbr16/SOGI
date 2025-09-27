import React from "react";
import ContractCard from "./ContractCard";
import "./contracts.css";

/** Props: items: Array<ContractCard props> */
export default function ContractsGrid({ items = [] }) {
  return (
    <div className="contracts-grid">
      {items.map((it, idx) => (
        <ContractCard key={it.id ?? idx} {...it} />
      ))}
    </div>
  );
}
