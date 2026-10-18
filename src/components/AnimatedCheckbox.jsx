import React from 'react';
export default function AnimatedCheckbox({ className = '', ...props }) {
  return <span className={`animated-checkbox ${className}`}><input {...props} type="checkbox" /><span className="checkbox-surface" aria-hidden="true"><svg viewBox="0 0 20 20"><path d="m5 10 3.3 3.3L15 6.8" /></svg></span></span>;
}
