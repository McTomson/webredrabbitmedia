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
  }
}
