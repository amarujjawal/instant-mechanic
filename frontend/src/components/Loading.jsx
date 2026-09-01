import React from "react";
export default function Loading({ text = "Loading..." }) {
  return (
    <div className="state">
      <div className="spinner" />
      <p>{text}</p>
    </div>
  );
}
