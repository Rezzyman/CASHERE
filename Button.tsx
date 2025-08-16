import * as React from "react";
type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "danger" | "success" };
export function Button({ variant = "primary", children, style, ...rest }: Props) {
  const base: React.CSSProperties = { padding: "10px 16px", borderRadius: 12, border: "1px solid #ddd", cursor: "pointer", fontWeight: 600 };
  const theme: Record<string, React.CSSProperties> = {
    primary: { background: "#111", color: "#fff" },
    secondary: { background: "#fff", color: "#111" },
    danger: { background: "#b00020", color: "#fff", borderColor: "#b00020" },
    success: { background: "#0d8936", color: "#fff", borderColor: "#0d8936" }
  };
  return <button style={{ ...base, ...theme[variant], ...(style as any) }} {...rest}>{children}</button>;
}
