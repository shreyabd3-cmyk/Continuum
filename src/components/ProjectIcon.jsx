import React from 'react';
import { parseIcon } from '../workspace/projectAppearance';

export default function ProjectIcon({ icon, title = '', size = 'sm', className = '' }) {
  const sizes = { sm: 'w-7 h-7', md: 'w-10 h-10', lg: 'w-14 h-14' };
  const { text, color, isImage } = parseIcon(icon);
  if (!icon && !title) return null;
  return <div aria-hidden="true" className={`project-icon ${sizes[size]} rounded-xl flex items-center justify-center shrink-0 ${className}`} style={{ backgroundColor: color }}>
    {isImage ? <img src={icon} alt="" className="w-full h-full object-cover rounded-xl" /> : <span style={{ fontSize: { sm: 11, md: 14, lg: 20 }[size], fontWeight: 600, color: 'white', letterSpacing: '.03em', lineHeight: 1 }}>{(text || title.slice(0, 2)).toUpperCase()}</span>}
  </div>;
}
