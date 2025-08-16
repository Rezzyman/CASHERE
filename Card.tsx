import * as React from "react";
export function Card({ children, title }: { children: React.ReactNode; title?: string }) {
  return <div style={{ border: "1px solid #e5e5e5", borderRadius: 16, padding: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
    {title ? <h3 style={{ marginTop: 0 }}>{title}</h3> : null}
    {children}
  </div>;
}
