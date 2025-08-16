import * as React from "react";
export function Tag({ children, tone="default" }: { children: React.ReactNode; tone?: "default" | "success" | "danger" | "warning" }) {
  const colors: any = {
    default: { background:"#f3f4f6", color:"#111" },
    success: { background:"#e6f7ec", color:"#0d8936" },
    danger: { background:"#fde8ea", color:"#b00020" },
    warning: { background:"#fff7e6", color:"#a36a00" }
  };
  return <span style={{ ...colors[tone], padding:"4px 8px", borderRadius: 999, fontSize:12, fontWeight:600 }}>{children}</span>;
}
