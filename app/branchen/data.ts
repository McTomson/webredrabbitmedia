export const branches = {
    handwerk: {
        name: "Handwerk",
        title: "Webdesign für Handwerksbetriebe",
        description: "Professionelle Websites für Handwerksbetriebe - DSGVO-konform und mobil-optimiert. Mehr Aufträge, weniger Büroarbeit. Wir digitalisieren Ihren Betrieb.",
        keywords: "Webdesign Handwerk, Website Handwerksbetrieb, Handwerker Website, Homepage Installateur",
        icon: "🔨",
        benefits: [
            "Automatische Terminanfragen",
            "Projekt-Galerie für Referenzen",
            "Mitarbeiter-Suche Funktion",
            "DSGVO-konform & mobil-optimiert"
        ],
        testimonial: {
            name: "Herbert Müller",
            role: "Malermeister Müller & Söhne",
            quote: "Seit wir die neue Seite haben, klingelt das Telefon durchgehend. Endlich finden uns die Kunden online und wir sparen uns viel Zeit bei der Terminvergabe."
        }
    },
    gastronomie: {
        name: "Gastronomie",
        title: "Webdesign für Gastronomie & Restaurants",
        description: "Professionelle Websites für Restaurants und Gastronomiebetriebe. Zeigen Sie Ihre Speisen von der besten Seite.",
        keywords: "Webdesign Gastronomie, Restaurant Website, Gastronomie Homepage",
        icon: "🍽️",
        benefits: [
            "Online-Speisekarten und Menüs",
            "Tischreservierung Integration",
            "Kundenbewertungen präsentieren",
            "Öffnungszeiten & Anfahrt"
        ],
        testimonial: {
            name: "Elena Rossini",
            role: "Trattoria Bella Vista",
            quote: "Die Online-Reservierung spart uns täglich Zeit am Telefon. Unsere Gäste lieben das moderne Design unserer Speisekarte."
        }
    },
    einzelhandel: {
        name: "Einzelhandel",
        title: "Webdesign für Einzelhandel & Shops",
        description: "Professionelle Websites für Einzelhandelsgeschäfte und lokale Shops. Bringen Sie Ihr Geschäft online.",
        keywords: "Webdesign Einzelhandel, Shop Website, Einzelhandel Homepage",
        icon: "🛍️",
        benefits: [
            "Produktpräsentation ansprechend",
            "Standorte und Öffnungszeiten",
            "Kundenbindung durch Newsletter",
            "Click & Collect Integration"
        ],
        testimonial: {
            name: "Markus Weber",
            role: "Modehaus Weber",
            quote: "Unser lokaler Shop wird jetzt endlich bei Google gefunden. Der Click & Collect Service wird von unseren Stammkunden super angenommen."
        }
    },
    dienstleistung: {
        name: "Dienstleistung",
        title: "Webdesign für Dienstleister & Berater",
        description: "Professionelle Websites für Dienstleister, Coaches und Berater. Zeigen Sie Ihre Expertise.",
        keywords: "Webdesign Dienstleistung, Dienstleister Website, Homepage Berater, Website Anwalt",
        icon: "💼",
        benefits: [
            "Services klar präsentieren",
            "Vertrauen durch Referenzen",
            "Kontaktformular für Anfragen",
            "SEO-optimiert für lokale Suche"
        ],
        testimonial: {
            name: "Sabine Kurz",
            role: "Steuerberatung K&P",
            quote: "Kompetent, schnell und zuverlässig. Red Rabbit hat unsere Expertise perfekt digital übersetzt. Wir wirken jetzt viel moderner."
        }
    },
    aerzte: {
        name: "Ärzte",
        title: "Webdesign für Ärzte & Praxen",
        description: "Praxis-Marketing, das Patienten begeistert und Ihr Team entlastet. Professioneller Auftritt für Ihre Ordination.",
        keywords: "Webdesign Arzt, Website Praxis wien, Homepage Zahnarzt",
        icon: "🩺",
        benefits: [
            "Online-Terminbuchung (z.B. Doctolib)",
            "Rechtssicheres Impressum",
            "Patienten-Informationen",
            "Digitale Visitenkarte"
        ],
        testimonial: {
            name: "Dr. Stefan Berger",
            role: "Zahnarztpraxis am Ring",
            quote: "Patienten können Termine jetzt direkt buchen. Das entlastet unsere Rezeption enorm und wirkt sehr professionell auf neue Patienten."
        }
    }
} as const;

export type BranchSlug = keyof typeof branches;
