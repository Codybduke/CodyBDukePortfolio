/**
 * Primitives mapped to the Caliber component library pages: Buttons (11:100),
 * Tags (214:50), Alerts & banners (153:9801), Inputs (359:2), Picker (772:4403),
 * Tabs (117:2), Breadcrumbs (879:61), Toggle Switches (4:220), Tool Tips
 * (116:321), Checkboxes (4:100), Card (1666:4575), Modals + Overlay (153:6296).
 */
import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { IconChevronDown, IconChevronRight, IconInfo, IconSparkle, IconX } from './icons';

/* ---------------------------------------------------------------- button */

type ButtonProps = {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'ai';
  size?: 'md' | 'sm';
  onClick?: () => void;
  disabled?: boolean;
  title?: string;
  type?: 'button' | 'submit';
};

export function Button({ children, variant = 'secondary', size = 'md', onClick, disabled, title, type = 'button' }: ButtonProps) {
  return (
    <button
      type={type}
      className={`cal-btn cal-btn--${variant}${size === 'sm' ? ' cal-btn--sm' : ''}`}
      onClick={onClick}
      disabled={disabled}
      title={title}
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------- tag */

export type Tone = 'gray' | 'red' | 'orange' | 'gold' | 'lime' | 'green' | 'blue' | 'ai' | 'outline';

export function Tag({ tone = 'gray', children }: { tone?: Tone; children: ReactNode }) {
  return <span className={`cal-tag cal-tag--${tone}`}>{children}</span>;
}

/* ----------------------------------------------------------------- alert */

export function Alert({
  tone = 'gray',
  icon,
  children,
}: {
  tone?: 'gray' | 'blue' | 'gold' | 'green' | 'red';
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className={`cal-alert cal-alert--${tone}`} role="note">
      {icon ? <span className="cal-alert__icon">{icon}</span> : <span className="cal-alert__icon"><IconInfo size={15} /></span>}
      <p className="cal-alert__body">{children}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ card */

export function Card({
  title,
  aside,
  children,
  variant = 'flat',
  padded = true,
}: {
  title?: ReactNode;
  aside?: ReactNode;
  children: ReactNode;
  variant?: 'flat' | 'raised' | 'dashed';
  padded?: boolean;
}) {
  const cls = ['cal-card'];
  if (variant === 'raised') cls.push('cal-card--raised');
  if (variant === 'dashed') cls.push('cal-card--dashed');
  return (
    <section className={cls.join(' ')} style={padded ? undefined : { padding: 0 }}>
      {title ? (
        <header className="cal-between" style={{ marginBottom: 16 }}>
          <h3 className="cal-card__title" style={{ marginBottom: 0 }}>{title}</h3>
          {aside}
        </header>
      ) : null}
      {children}
    </section>
  );
}

/* --------------------------------------------------------------- tooltip */

/**
 * `side="bottom"` is for tooltips inside a modal: the body is the scroll
 * container, so a pop that opens upward gets clipped by its own overflow.
 */
export function Tooltip({
  label,
  side = 'top',
  children,
}: {
  label: string;
  side?: 'top' | 'bottom';
  children?: ReactNode;
}) {
  // Pinning is tracked apart from hover, or a click on a tooltip the pointer
  // is already over would close the thing it just opened.
  const [hover, setHover] = useState(false);
  const [pinned, setPinned] = useState(false);
  const open = hover || pinned;
  const id = useId();
  return (
    <span className="cal-tip">
      <button
        type="button"
        className="cal-tip__btn"
        aria-label={label}
        aria-describedby={open ? id : undefined}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onFocus={() => setHover(true)}
        onBlur={() => { setHover(false); setPinned(false); }}
        onClick={() => setPinned((v) => !v)}
      >
        {children ?? 'i'}
      </button>
      {open ? (
        <span className={`cal-tip__pop cal-tip__pop--${side}`} role="tooltip" id={id}>
          {label}
        </span>
      ) : null}
    </span>
  );
}

/* ----------------------------------------------------------------- field */

export function Field({
  label,
  value,
  placeholder,
  dismissible = true,
  select = false,
  onClick,
  width,
}: {
  label: string;
  value?: string;
  placeholder?: string;
  dismissible?: boolean;
  select?: boolean;
  onClick?: () => void;
  width?: number;
}) {
  const filled = Boolean(value);
  return (
    <div className="cal-filter" style={{ width }}>
      <span className="cal-label">{label}</span>
      <div
        className={`cal-field${select ? ' cal-field--select' : ''}${filled ? '' : ' cal-field--placeholder'}`}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } } : undefined}
      >
        <span className="cal-grow" style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {value ?? placeholder}
        </span>
        <span className="cal-field__x">
          {select ? <IconChevronDown size={15} /> : dismissible && filled ? <IconX size={14} /> : null}
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------- dropdown */

export type DropdownOption<T extends string> = {
  id: T;
  label: string;
  /** Right-aligned in the menu: score, dollars, whatever ranks the option. */
  meta?: ReactNode;
  /** Shown on the closed trigger when the menu meta would be redundant. */
  triggerMeta?: ReactNode;
  note?: string;
};

/**
 * A real select, not a segmented control — the skill switcher carries a score
 * and a dollar figure per option, which is how Ellis compares them.
 */
export function Dropdown<T extends string>({
  options,
  value,
  onChange,
  label,
  width,
}: {
  options: DropdownOption<T>[];
  value: T;
  onChange: (v: T) => void;
  label: string;
  width?: number | string;
}) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const current = options.find((o) => o.id === value) ?? options[0];

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="cal-select" ref={wrap} style={{ width }}>
      <button
        type="button"
        className="cal-field cal-field--select"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="cal-grow" style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {current?.label}
        </span>
        {current?.triggerMeta ?? current?.meta ? (
          <span className="cal-select__meta">{current.triggerMeta ?? current.meta}</span>
        ) : null}
        <span className="cal-field__x"><IconChevronDown size={15} /></span>
      </button>

      {open ? (
        <div className="cal-select__menu" role="listbox" aria-label={label}>
          {options.map((o) => (
            <button
              key={o.id}
              type="button"
              role="option"
              aria-selected={o.id === value}
              className="cal-select__opt"
              onClick={() => {
                onChange(o.id);
                setOpen(false);
              }}
            >
              <span className="cal-select__opt-main">
                <span className="cal-grow">{o.label}</span>
                {o.meta ? <span className="cal-select__meta">{o.meta}</span> : null}
              </span>
              {o.note ? <span className="cal-select__opt-note">{o.note}</span> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

/* ----------------------------------------------------------------- chips */

/** The four piles, repeated above the deal table so the filter is visible. */
export function Chip({
  active,
  color,
  onClick,
  children,
}: {
  active: boolean;
  color?: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      className="cal-chip"
      aria-pressed={active}
      style={color ? ({ ['--chip-accent' as string]: color }) : undefined}
      onClick={onClick}
    >
      {color ? <span className="cal-chip__dot" /> : null}
      {children}
    </button>
  );
}

/* ----------------------------------------------------------------- money */

/**
 * The dollar figure that rides alongside a count. Britton: put it next to the
 * number, same size, in parentheses, a shade lighter than the count itself.
 */
export function Amount({ children }: { children: ReactNode }) {
  return <span className="cal-amt">({children})</span>;
}

/* ---------------------------------------------------------------- picker */

export function Picker<T extends string>({
  options,
  value,
  onChange,
  labels,
}: {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  labels?: Record<string, string>;
}) {
  return (
    <div className="cal-picker" role="group">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          className="cal-picker__opt"
          aria-pressed={o === value}
          onClick={() => onChange(o)}
        >
          {labels?.[o] ?? o}
        </button>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ tabs */

export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
}: {
  tabs: { id: T; label: string; badge?: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="cal-tabs" role="tablist">
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          role="tab"
          className="cal-tab"
          aria-selected={t.id === value}
          onClick={() => onChange(t.id)}
        >
          {t.label}
          {t.badge ? <span className="cal-tab__badge">{t.badge}</span> : null}
        </button>
      ))}
    </div>
  );
}

/* ----------------------------------------------------------- breadcrumbs */

export function Breadcrumbs({ items }: { items: { label: string; onClick?: () => void }[] }) {
  return (
    <nav className="cal-crumbs" aria-label="Breadcrumb">
      {items.map((item, i) => {
        const last = i === items.length - 1;
        return (
          <span key={item.label} className="cal-row cal-gap-4">
            {item.onClick && !last ? (
              <button type="button" className="cal-crumb" onClick={item.onClick}>{item.label}</button>
            ) : (
              <span className={`cal-crumb${last ? ' cal-crumb--current' : ''}`} aria-current={last ? 'page' : undefined}>
                {item.label}
              </span>
            )}
            {last ? null : <span className="cal-crumbs__sep"><IconChevronRight size={13} /></span>}
          </span>
        );
      })}
    </nav>
  );
}

/* ---------------------------------------------------------------- toggle */

export function Toggle({
  on,
  onChange,
  label,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button type="button" className="cal-toggle" aria-pressed={on} onClick={() => onChange(!on)}>
      <span>{label}</span>
      <span className="cal-toggle__track" data-on={on}>
        <span className="cal-toggle__knob" />
      </span>
    </button>
  );
}

/* -------------------------------------------------------------- checkbox */

export function Checkbox({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  children: ReactNode;
}) {
  return (
    <button type="button" className="cal-check" role="checkbox" aria-checked={checked} onClick={() => onChange(!checked)}>
      <span className="cal-check__box" data-on={checked}>
        {checked ? (
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m5 12.5 4.5 4.5L19 7" />
          </svg>
        ) : null}
      </span>
      <span className="cal-grow">{children}</span>
    </button>
  );
}

/* ----------------------------------------------------------------- modal */

export function Modal({
  title,
  eyebrow,
  onClose,
  size = 'wide',
  footer,
  children,
}: {
  title: ReactNode;
  eyebrow?: ReactNode;
  onClose: () => void;
  size?: 'wide' | 'mid';
  footer?: ReactNode;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    ref.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div className="cal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div
        className={`cal-modal cal-modal--${size}`}
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === 'string' ? title : undefined}
        tabIndex={-1}
        ref={ref}
      >
        <header className="cal-modal__head">
          <div className="cal-grow">
            {eyebrow ? <div style={{ marginBottom: 6 }}>{eyebrow}</div> : null}
            <h2 className="cal-d24">{title}</h2>
          </div>
          <button type="button" className="cal-modal__x" onClick={onClose} aria-label="Close">
            <IconX size={17} />
          </button>
        </header>
        <div className="cal-modal__body">{children}</div>
        {footer ? <footer className="cal-modal__foot">{footer}</footer> : null}
      </div>
    </div>
  );
}

/* ------------------------------------------------------- AI attribution */

export function AiLabel({ children = 'AI-generated' }: { children?: ReactNode }) {
  return (
    <span className="cal-ai">
      <span className="cal-ai__spark"><IconSparkle size={14} /></span>
      {children}
    </span>
  );
}

/* --------------------------------------------------------------- legend */

export function Legend({ items }: { items: { color: string; label: string }[] }) {
  return (
    <div className="cal-legend">
      {items.map((i) => (
        <span key={i.label} className="cal-legend__item">
          <span className="cal-legend__dot" style={{ background: i.color }} />
          {i.label}
        </span>
      ))}
    </div>
  );
}
