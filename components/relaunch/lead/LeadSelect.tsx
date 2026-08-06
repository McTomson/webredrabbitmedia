"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

/**
 * Marken-Dropdown fuer das Lead-Popup (Thomas 07.08.: das native <select>
 * rendert das dunkle OS-Menue = "nicht unser design"). Custom-Listbox:
 * Trigger im Unterstrich-Stil der uebrigen Felder, Menue im Styleguide-Look
 * (.rr-select__menu / .rr-select__opt: eckig, Paper-Flaeche, rote Auswahl mit
 * Haken). Tastatur + Screenreader ueber role=combobox/listbox und
 * aria-activedescendant (Fokus bleibt am Trigger).
 *
 * Bewusst KEIN natives <select> und KEIN Portal: das Menue ist kurz und sitzt
 * mitten im Formular (Felder darunter), daher kein Clipping im scrollbaren
 * Panel. Styling kommt aus der bereits importierten styleguide.css (.rr-Scope).
 */

const CHECK =
  "M20 6 9 17l-5-5"; // lucide "check"

export default function LeadSelect({
  id,
  value,
  options,
  placeholder = "Bitte wählen",
  onChange,
}: {
  id: string;
  value: string;
  options: string[];
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  const uid = useId();
  const listId = `${uid}-list`;
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const [open, setOpen] = useState(false);
  // Hervorgehobene Option (Tastatur). -1 = keine.
  const [active, setActive] = useState(-1);

  const selectedIndex = options.indexOf(value);

  const close = useCallback((focusTrigger = true) => {
    setOpen(false);
    setActive(-1);
    if (focusTrigger) triggerRef.current?.focus();
  }, []);

  const openMenu = useCallback(() => {
    setOpen(true);
    // Auf die aktuelle Auswahl aufsetzen, sonst erste Option.
    setActive(selectedIndex >= 0 ? selectedIndex : 0);
  }, [selectedIndex]);

  const pick = useCallback(
    (idx: number) => {
      const opt = options[idx];
      if (opt !== undefined) onChange(opt);
      close();
    },
    [options, onChange, close],
  );

  // Klick ausserhalb schliesst.
  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
        setActive(-1);
      }
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  function onKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        if (open) {
          if (active >= 0) pick(active);
        } else {
          openMenu();
        }
        break;
      case "ArrowDown":
        e.preventDefault();
        if (!open) {
          openMenu();
        } else {
          setActive((a) => Math.min(options.length - 1, a + 1));
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (open) setActive((a) => Math.max(0, a - 1));
        break;
      case "Home":
        if (open) {
          e.preventDefault();
          setActive(0);
        }
        break;
      case "End":
        if (open) {
          e.preventDefault();
          setActive(options.length - 1);
        }
        break;
      case "Escape":
        if (open) {
          // Nur das Menue schliessen, NICHT den ganzen Dialog.
          e.preventDefault();
          e.stopPropagation();
          close();
        }
        break;
      case "Tab":
        if (open) close(false);
        break;
      default:
        break;
    }
  }

  const hasValue = value !== "" && value !== undefined;

  return (
    <div className="rr-select rrlead-selectwrap" ref={wrapRef}>
      <button
        ref={triggerRef}
        type="button"
        id={id}
        className="rrlead-trigger"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open && active >= 0 ? `${listId}-${active}` : undefined}
        onClick={() => (open ? close() : openMenu())}
        onKeyDown={onKeyDown}
      >
        <span className={hasValue ? "rrlead-trigger-val" : "rrlead-trigger-val rrlead-trigger-val--ph"}>
          {hasValue ? value : placeholder}
        </span>
        <svg
          className="rrlead-trigger-chev"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <ul
        id={listId}
        role="listbox"
        className="rr-select__menu rrlead-menu"
        data-open={open ? "true" : "false"}
      >
        {options.map((opt, idx) => (
          <li
            key={opt}
            id={`${listId}-${idx}`}
            role="option"
            aria-selected={opt === value}
            className={`rr-select__opt${idx === active ? " is-active" : ""}`}
            onMouseEnter={() => setActive(idx)}
            onMouseDown={(e) => {
              // mousedown statt click: feuert vor dem document-mousedown-Close.
              e.preventDefault();
              pick(idx);
            }}
          >
            <span>{opt}</span>
            <svg
              className="rr-select__opt-check"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d={CHECK} />
            </svg>
          </li>
        ))}
      </ul>
    </div>
  );
}
