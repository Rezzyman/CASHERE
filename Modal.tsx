import * as React from "react";
export function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'grid', placeItems:'center', zIndex:1000 }} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{ background:'#fff', borderRadius:16, padding:20, maxWidth:900, width:'90%', boxShadow:'0 8px 30px rgba(0,0,0,0.2)' }}>
        {children}
      </div>
    </div>
  );
}
