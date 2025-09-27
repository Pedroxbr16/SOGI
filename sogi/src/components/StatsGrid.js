import React from "react";
import StatsCard from "./StatsCard";
import "../assets/css/components/stats.css";

/**
 * Props:
 * - items: Array<{ id, title, value, accent, icon? }>
 */
export default function StatsGrid({ items = [] }) {
  return (
    <div className="stats-grid">
      {items.map((it) => (
        <StatsCard
          key={it.id ?? it.title}
          title={it.title}
          value={it.value}
          accent={it.accent}
          icon={it.icon}
        />
      ))}
    </div>
  );
}
