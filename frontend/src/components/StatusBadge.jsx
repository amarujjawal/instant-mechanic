import React from "react";
export default function StatusBadge({ status }) {
  const cls = status.toLowerCase().replaceAll(" ", "-");
  return <span className={`status ${cls}`}>{status}</span>;
}
