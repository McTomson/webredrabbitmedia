"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

/* ------------------------------------------------------------------
   RelaunchDropdown — barrierefreies Dropdown (Listbox-Semantik)
   Red-Rabbit-Relaunch, 05.07.

   - Button-Trigger (aria-haspopup="listbox", aria-expanded)
   - schwebendes Menue (role="listbox") mit role="option"-Eintraegen
   - Tastatur: Pfeil hoch/runter, Home/End, Enter/Space waehlt,
     Esc schliesst, Tippen springt zum passenden Eintrag
   - Roving via aria-activedescendant (Fokus bleibt auf der Liste)
   - schliesst bei Aussenklick + Esc, gibt Fokus an den Trigger zurueck
   - Oeffnen/Schliessen animiert (Master-Easing), kein Layout-Shift
   Styling: .rr-select* in app/styleguide/styleguide.css
   ------------------------------------------------------------------ */

export type RelaunchDropdownOption = {
  value: string;
  label: string;
};

type RelaunchDropdownProps = {
  options: RelaunchDropdownOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  ariaLabel: string;
  id?: string;
};

export function RelaunchDropdown({
  options,
  value,
  defaultValue,
  onChange,
  placeholder = "Bitte waehlen",
  ariaLabel,
  id,
}: RelaunchDropdownProps) {
  const reactId = useId();
  const baseId = id ?? `rr-select-${reactId}`;
  const listId = `${baseId}-list`;

  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<string | undefined>(defaultValue);
  const selectedValue = isControlled ? value : internalValue;

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(() => {
    const i = options.findIndex((o) => o.value === (isControlled ? value : defaultValue));
    return i >= 0 ? i : 0;
  });

  const rootRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const typeaheadRef = useRef<{ q: string; t: number }>({ q: "", t: 0 });

  const selectedOption = options.find((o) => o.value === selectedValue);

  const commit = useCallback(
    (next: string) => {
      if (!isControlled) setInternalValue(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  const closeMenu = useCallback((focusTrigger = true) => {
    setOpen(false);
    if (focusTrigger) triggerRef.current?.focus();
  }, []);

  const openMenu = useCallback(() => {
    const i = options.findIndex((o) => o.value === selectedValue);
    setActiveIndex(i >= 0 ? i : 0);
    setOpen(true);
  }, [options, selectedValue]);

  // Fokus in die Liste holen, sobald geoeffnet.
  useEffect(() => {
    if (open) listRef.current?.focus();
  }, [open]);

  // Aussenklick + Esc auf Dokumentebene.
  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  function moveActive(delta: number) {
    setActiveIndex((prev) => {
      const n = options.length;
      let next = prev + delta;
      if (next < 0) next = 0;
      if (next > n - 1) next = n - 1;
      return next;
    });
  }

  function onTriggerKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
    if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openMenu();
    }
  }

  function onListKeyDown(e: React.KeyboardEvent<HTMLUListElement>) {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        moveActive(1);
        break;
      case "ArrowUp":
        e.preventDefault();
        moveActive(-1);
        break;
      case "Home":
        e.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        e.preventDefault();
        setActiveIndex(options.length - 1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (options[activeIndex]) {
          commit(options[activeIndex].value);
          closeMenu();
        }
        break;
      case "Escape":
        e.preventDefault();
        closeMenu();
        break;
      case "Tab":
        setOpen(false);
        break;
      default:
        // Typeahead: passenden Eintrag anspringen.
        if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
          const now = Date.now();
          const ta = typeaheadRef.current;
          ta.q = now - ta.t > 700 ? e.key : ta.q + e.key;
          ta.t = now;
          const q = ta.q.toLowerCase();
          const idx = options.findIndex((o) => o.label.toLowerCase().startsWith(q));
          if (idx >= 0) setActiveIndex(idx);
        }
        break;
    }
  }

  const activeOptionId = options[activeIndex] ? `${baseId}-opt-${activeIndex}` : undefined;

  return (
    <div className="rr-select" ref={rootRef}>
      <button
        type="button"
        ref={triggerRef}
        id={baseId}
        className="rr-select__trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={onTriggerKeyDown}
      >
        <span className={selectedOption ? undefined : "rr-select__value--placeholder"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          className="rr-select__chev"
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
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <ul
        ref={listRef}
        id={listId}
        className="rr-select__menu"
        role="listbox"
        tabIndex={-1}
        aria-label={ariaLabel}
        aria-activedescendant={open ? activeOptionId : undefined}
        data-open={open ? "true" : "false"}
        onKeyDown={onListKeyDown}
      >
        {options.map((opt, i) => {
          const isSelected = opt.value === selectedValue;
          const isActive = i === activeIndex;
          return (
            <li
              key={opt.value}
              id={`${baseId}-opt-${i}`}
              role="option"
              aria-selected={isSelected}
              className={`rr-select__opt${isActive ? " is-active" : ""}`}
              onMouseEnter={() => setActiveIndex(i)}
              onClick={() => {
                commit(opt.value);
                closeMenu();
              }}
            >
              <span>{opt.label}</span>
              <svg
                className="rr-select__opt-check"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
