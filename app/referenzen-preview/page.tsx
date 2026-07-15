import { redirect } from "next/navigation";

// Alte interne P2b-Preview der Kugel-Galerie. Seit 15.07.2026 lebt die
// Galerie produktiv unter /relaunch-preview/referenzen (gleiche Komponente,
// konsistente Projektliste) — diese Route leitet nur noch dorthin um.
export default function ReferenzenPreviewRedirect() {
  redirect("/relaunch-preview/referenzen");
}
