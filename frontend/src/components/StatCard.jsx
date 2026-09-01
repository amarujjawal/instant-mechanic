import React from "react";
import { ArrowUpRight } from "lucide-react";
export default function StatCard({
  label,
  value,
  icon: Icon,
  meta,
  positive = true,
}) {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <div className="stat-icon">
          <Icon size={19} />
        </div>
        {meta && (
          <span className={positive ? "trend up" : "trend down"}>
            {meta}
            <ArrowUpRight size={13} />
          </span>
        )}
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}
