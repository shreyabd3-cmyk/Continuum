import React, { cloneElement, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AlertCircle, Loader2, X } from 'lucide-react';

export function useDialogForm(initial, validate, onSave, onClose) {
  const [values, setValues] = useState(initial), [errors, setErrors] = useState({}), [touched, setTouched] = useState({});
  const [busy, setBusy] = useState(false), [formError, setFormError] = useState('');
  const pending = useRef(false), latest = useRef(initial), dirty = useRef(new Set()), submitted = useRef(false);
  const setValue = (name, value) => {
    const next = { ...latest.current, [name]: value };
    latest.current = next; dirty.current.add(name);
    setValues(next);
    if (touched[name] || submitted.current) setErrors(validate(next));
    setFormError('');
  };
  const blur = name => { if (!dirty.current.has(name) && !submitted.current) return; setTouched(previous => ({ ...previous, [name]: true })); setErrors(validate(latest.current)); };
  const error = name => touched[name] ? errors[name] : '';
  const submit = async event => {
    event.preventDefault();
    if (pending.current) return;
    submitted.current = true;
    const issues = validate(latest.current); setErrors(issues); setTouched(Object.fromEntries(Object.keys(values).map(key => [key, true])));
    if (Object.keys(issues).length) { const form = event.currentTarget; requestAnimationFrame(() => form.querySelector('[aria-invalid="true"]')?.focus()); return; }
    pending.current = true; setBusy(true); setFormError('');
    try { const saved = await onSave(latest.current); if (saved === false) setFormError('Your changes could not be saved. Please try again. Your entries are still here.'); else onClose(); }
    catch { setFormError('Your changes could not be saved. Check your connection and try again.'); }
    finally { pending.current = false; setBusy(false); }
  };
  return { values, setValue, blur, error, busy, submit, formError, setFormError };
}

export function Field({ label, hint, error, required, children, multiline = false, autoFocus = false, ...props }) {
  const generated = useId(), id = props.id || `field-${generated}`, helpId = `${id}-help`;
  const value = children?.props?.value ?? props.value;
  const controlProps = { id, 'aria-describedby': hint || error ? helpId : undefined, 'aria-invalid': !!error, required, 'data-autofocus': autoFocus || undefined };
  return <div className="ds-field" data-filled={value !== undefined && value !== '' || undefined} data-error={!!error || undefined}>
    <label className="ds-field-label" htmlFor={id}>{label}{required ? <span aria-hidden="true"> *</span> : <span className="ds-field-optional">Optional</span>}</label>
    {children ? cloneElement(children, controlProps) : multiline ? <textarea {...props} {...controlProps} className="ds-field-control" /> : <input {...props} {...controlProps} className="ds-field-control" />}
    {(error || hint) && <p className="ds-field-support" id={helpId}>{error && <AlertCircle size={14} aria-hidden="true" />}{error || hint}</p>}
  </div>;
}

export default function FormDialog({ title, description, children, onClose, onSubmit, submitLabel = 'Save changes', busyLabel = 'Saving…', busy = false, error, secondaryAction }) {
  const titleId = useId(), descriptionId = useId(), dialog = useRef(null), body = useRef(null), close = useRef(onClose), pending = useRef(busy);
  close.current = onClose; pending.current = busy;
  useEffect(() => {
    const previous = document.activeElement, root = document.getElementById('root'), wasInert = root?.inert, overflow = document.body.style.overflow;
    if (root) root.inert = true;
    document.body.style.overflow = 'hidden';
    const target = dialog.current?.querySelector('[data-autofocus], input:not([type="hidden"]):not(:disabled), textarea:not(:disabled)');
    (target || dialog.current)?.focus();
    return () => { if (root) root.inert = wasInert; document.body.style.overflow = overflow; if (previous?.isConnected) previous.focus(); };
  }, []);
  useEffect(() => { if (error && body.current) body.current.scrollTop = 0; }, [error]);
  const keyboard = event => {
    if (event.key === 'Escape' && !pending.current) { event.preventDefault(); event.stopPropagation(); close.current(); }
    if (event.key !== 'Tab') return;
    const controls = [...dialog.current.querySelectorAll('button, input:not([type="hidden"]), textarea, select, a[href], [tabindex="0"]')].filter(el => !el.matches(':disabled') && el.offsetParent !== null);
    const first = controls[0], last = controls[controls.length - 1];
    if (!first) { event.preventDefault(); return; }
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  };
  return createPortal(<div className="material-workspace ds-modal-backdrop" onPointerDown={event => { if (event.target === event.currentTarget && !busy) onClose(); }}>
    <section className="ds-modal" ref={dialog} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={description ? descriptionId : undefined} aria-busy={busy} onKeyDown={keyboard}>
      <header className="ds-modal-header"><div><h2 id={titleId}>{title}</h2>{description && <p id={descriptionId}>{description}</p>}</div><button className="ds-icon-button" type="button" aria-label="Close dialog" disabled={busy} onClick={onClose}><X size={22} /></button></header>
      <form noValidate onSubmit={onSubmit}>
        <div className="ds-modal-body" ref={body}>{error && <div className="ds-form-error" role="alert"><AlertCircle size={18} /><span>{error}</span></div>}<fieldset className="ds-form-fields" disabled={busy}>{children}</fieldset></div>
        <footer className="ds-modal-footer">{secondaryAction && <div className="ds-modal-secondary">{secondaryAction}</div>}<button type="button" className="ds-text-button" disabled={busy} onClick={onClose}>Cancel</button><button className="ws-primary" type="submit" disabled={busy}>{busy && <Loader2 size={18} className="animate-spin" />}<span>{busy ? busyLabel : submitLabel}</span></button></footer>
        <span className="sr-only" role="status">{busy ? 'Saving changes. Please wait.' : ''}</span>
      </form>
    </section>
  </div>, document.body);
}
