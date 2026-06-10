// Locale-aware formatters for the dashboard (de-AT). Tabular figures are applied via the
// `tabular-nums` utility on the rendering side so columns stay aligned.

const nf = new Intl.NumberFormat('de-AT');

export function int(n: number): string {
    return nf.format(Math.round(n));
}

export function pct(ratio: number, digits = 1): string {
    return `${(ratio * 100).toFixed(digits).replace('.', ',')} %`;
}

export function pos(n: number): string {
    return n.toFixed(1).replace('.', ',');
}

export function duration(seconds: number): string {
    const s = Math.round(seconds);
    const m = Math.floor(s / 60);
    const rest = s % 60;
    return m > 0 ? `${m}:${String(rest).padStart(2, '0')} min` : `${rest} s`;
}
