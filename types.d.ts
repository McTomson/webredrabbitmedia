declare module 'rss';

// Kein top-level import/export in dieser Datei: sie muss ein globales Script
// bleiben, sonst wird `declare module 'rss'` zur Modul-Augmentierung.
declare global {
  interface Window {
    /**
     * Geteilte Lenis-Instanz des Relaunch. Wird von der ERSTEN Stelle gesetzt,
     * die Lenis startet (Homepage: components/relaunch/HomeMorph.tsx, sonst
     * components/relaunch/ScrollExperience.tsx), damit nie zwei Instanzen
     * gegeneinander scrollen. ScrollExperience haengt seine Soft-Snap-Engine
     * an die vorhandene Instanz, statt eine eigene zu bauen.
     */
    __rrLenis?: import('lenis').default;

    /**
     * Optionale, von einer Seite registrierte Zusatz-Haltepunkte INNERHALB
     * eines [data-rr-snap-exempt]-Tracks — fuer scroll-gebundene Animationen,
     * deren Zwischenstopps sich nicht als eigenes DOM-Element ausdruecken
     * lassen (z.B. die vier Ehrlich-gesagt-Statements in website-demo). Muss
     * die aktuellen Dokument-Y-Positionen liefern (nicht gecacht, da sich
     * Track-Position/-Hoehe bei Resize aendert). ScrollExperience beruecksichtigt
     * diese Kanten fuer Gesten-Klammer UND Idle-Snap, unabhaengig vom
     * Exempt-Filter, der sonst nur fuer echte [data-rr-snap]-Elemente gilt.
     */
    __rrDynamicSnapTops?: () => number[];
  }
}
