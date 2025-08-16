import * as React from "react";
export function Table({ columns, rows }: { columns: string[]; rows: React.ReactNode[][] }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead><tr>{columns.map((c,i)=>(<th key={i} style={{ textAlign:'left', borderBottom:'1px solid #eee', padding:'8px 6px' }}>{c}</th>))}</tr></thead>
      <tbody>
        {rows.map((r,ri)=>(<tr key={ri}>{r.map((cell,ci)=>(<td key={ci} style={{ borderBottom:'1px solid #f3f4f6', padding:'8px 6px' }}>{cell}</td>))}</tr>))}
      </tbody>
    </table>
  );
}
