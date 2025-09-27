import React from "react";
import "../assets/css/components/stats.css";

/**
 * Props:
 * - title: string
 * - value: string | number | ReactNode
 * - accent: "blue" | "yellow" | "red" | "green"
 * - icon?: ReactNode (opcional)
 * - subtle?: boolean (deixa o fundo mais translúcido)
 */
export default function StatsCard({ title, value, Icon, accent = "#2563eb" }) {
  return (
    <div className="stats-card" style={{ borderLeftColor: accent }}>
      <div>
        <div className="title">{title}</div>
        <div className="value">{value}</div>
      </div>
      {Icon ? <Icon size={28} color="#9ca3af" /> : null}
    </div>
  );
}