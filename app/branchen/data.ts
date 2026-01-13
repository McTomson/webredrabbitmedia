export const branches = {
    handwerk: {
        title: "Webdesign für Handwerker",
        description: "Mehr Aufträge, weniger Büroarbeit. Wir digitalisieren Ihren Handwerksbetrieb.",
        benefits: ["Automatische Terminanfragen", "Projekt-Galerie für Referenzen", "Mitarbeiter-Suche Funktion"],
        keywords: "Webdesign Handwerk, Website für Handwerker, Homepage Installateur",
    },
    aerzte: {
        title: "Webdesign für Ärzte & Praxen",
        description: "Praxis-Marketing, das Patienten begeistert und Ihr Team entlastet.",
        benefits: ["Online-Terminbuchung (Doctolib Integration)", "Rechtssicheres Impressum", "Patienten-Informationen"],
        keywords: "Webdesign Arzt, Website Praxis wien, Homepage Zahnarzt",
    },
    dienstleister: {
        title: "Webdesign für Dienstleister",
        description: "Zeigen Sie Ihre Expertise und gewinnen Sie Premium-Kunden.",
        benefits: ["Verkaufsstarke Landingpages", "Newsletter-Integration", "Blog-System für Expertenstatus"],
        keywords: "Webdesign Berater, Website Coach, Homepage Anwalt",
    }
} as const;

export type BranchSlug = keyof typeof branches;
