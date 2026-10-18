import React, { Children, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronDown } from 'lucide-react';

// Shared select-only combobox: focus stays on the trigger while the listbox is open.
// The popup is portaled so scrollable panels and dialogs cannot clip its options.
export default function Select({ value = '', onChange, children, disabled = false, required = false, name, id, className = '', ...props }) {
  const generated = useId(), triggerId = id || `select-${generated}`, listId = `${triggerId}-options`;
  const options = Children.toArray(children).filter(child => React.isValidElement(child) && child.type === 'option').map(child => ({ value: String(child.props.value ?? child.props.children ?? ''), label: child.props.children, text: String(child.props.children ?? ''), disabled: !!child.props.disabled }));
  const selected = options.findIndex(option => option.value === String(value));
  const [open, setOpen] = useState(false), [active, setActive] = useState(-1), [position, setPosition] = useState(null);
  const trigger = useRef(null), menu = useRef(null), optionRefs = useRef([]), typing = useRef({ text: '', time: 0 });
  const enabled = options.map((option, index) => option.disabled ? -1 : index).filter(index => index >= 0);
  const show = (edge) => {
    if (disabled || !enabled.length) return;
    setActive(edge === 'last' ? enabled[enabled.length - 1] : selected >= 0 && !options[selected].disabled ? selected : enabled[0]);
    setOpen(true);
  };
  const choose = index => {
    const option = options[index];
    if (!option || option.disabled) return;
    setOpen(false); trigger.current?.focus();
    if (option.value !== String(value)) onChange?.({ target: { value: option.value, name }, currentTarget: { value: option.value, name } });
  };
  useEffect(() => { if (disabled) setOpen(false); }, [disabled]);
  useLayoutEffect(() => {
    if (!open) { setPosition(null); return; }
    const rect = trigger.current.getBoundingClientRect(), padding = 12, gap = 6;
    const below = window.innerHeight - rect.bottom - padding - gap, above = rect.top - padding - gap;
    const upwards = below < 200 && above > below;
    const maxHeight = Math.max(60, Math.min(320, upwards ? above : below));
    const width = Math.min(Math.max(rect.width, 184), window.innerWidth - padding * 2);
    const left = Math.max(padding, Math.min(rect.left, window.innerWidth - padding - width));
    setPosition({ left, width, maxHeight, ...(upwards ? { bottom: window.innerHeight - rect.top + gap } : { top: rect.bottom + gap }) });
    const outside = e => { if (!trigger.current?.contains(e.target) && !menu.current?.contains(e.target)) setOpen(false); };
    const scroll = e => { if (!menu.current?.contains(e.target)) setOpen(false); };
    const close = () => setOpen(false);
    document.addEventListener('pointerdown', outside);
    document.addEventListener('scroll', scroll, true);
    window.addEventListener('resize', close);
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('scroll', scroll, true); window.removeEventListener('resize', close); };
  }, [open]);
  useLayoutEffect(() => {
    const item = optionRefs.current[active], container = menu.current;
    if (!open || !item || !container) return;
    if (item.offsetTop < container.scrollTop) container.scrollTop = item.offsetTop;
    else if (item.offsetTop + item.offsetHeight > container.scrollTop + container.clientHeight) container.scrollTop = item.offsetTop + item.offsetHeight - container.clientHeight;
  }, [active, open, position]);
  const keyboard = e => {
    if (e.key === 'Escape' && open) { e.preventDefault(); e.stopPropagation(); setOpen(false); return; }
    if (e.key === 'Tab') { setOpen(false); return; }
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open ? choose(active) : show(); return; }
    if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) {
      e.preventDefault();
      if (!open) { show(e.key === 'End' || e.key === 'ArrowUp' ? 'last' : undefined); return; }
      if (e.key === 'Home') setActive(enabled[0]);
      else if (e.key === 'End') setActive(enabled[enabled.length - 1]);
      else { const index = enabled.indexOf(active), offset = e.key === 'ArrowDown' ? 1 : -1; setActive(enabled[(index + offset + enabled.length) % enabled.length]); }
      return;
    }
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      const now = Date.now(), previous = now - typing.current.time < 650 ? typing.current.text : '';
      const text = `${previous}${e.key}`.toLocaleLowerCase(); typing.current = { text, time: now };
      const start = Math.max(0, enabled.indexOf(open ? active : selected));
      const order = [...enabled.slice(start + 1), ...enabled.slice(0, start + 1)];
      const match = order.find(index => options[index].text.toLocaleLowerCase().startsWith(text));
      if (match !== undefined) { setActive(match); setOpen(true); }
    }
  };
  return <span className={`ds-select ${className}`}>
    {name && <input type="hidden" name={name} value={value} />}
    <button {...props} ref={trigger} id={triggerId} type="button" className="ds-select-trigger" role="combobox" aria-haspopup="listbox" aria-expanded={open} aria-controls={open ? listId : undefined} aria-activedescendant={open && active >= 0 ? `${listId}-${active}` : undefined} aria-required={required || undefined} disabled={disabled || !enabled.length} data-open={open || undefined} onKeyDown={keyboard} onClick={() => open ? setOpen(false) : show()} onBlur={e => { if (!menu.current?.contains(e.relatedTarget)) setOpen(false); props.onBlur?.(e); }}>
      <span className="ds-select-value">{options[selected]?.label ?? 'Select an option'}</span><ChevronDown size={18} aria-hidden="true" />
    </button>
    {open && position && createPortal(<ul ref={menu} id={listId} role="listbox" aria-label={props['aria-label'] || 'Options'} className="ds-select-menu" style={position} onMouseDown={e => e.preventDefault()}>
      {options.map((option, index) => <li ref={el => { optionRefs.current[index] = el; }} id={`${listId}-${index}`} key={`${option.value}-${index}`} role="option" aria-selected={selected === index} aria-disabled={option.disabled || undefined} data-active={active === index || undefined} onPointerMove={() => { if (!option.disabled) setActive(index); }} onClick={() => choose(index)}><span>{option.label}</span>{selected === index && <Check size={18} aria-hidden="true" />}</li>)}
    </ul>, document.body)}
  </span>;
}
