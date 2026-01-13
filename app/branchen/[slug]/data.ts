// Branch/Industry data for different business sectors
export const branches = {
    handwerk: {
        name: "Handwerk",
        title: "Webdesign für Handwerksbetriebe",
        description: "Professionelle Websites für Handwerksbetriebe - DSGVO-konform und mobil-optimiert",
        keywords: "Webdesign Handwerk, Website Handwerksbetrieb, Handwerker Website",
        icon: "🔨",
        benefits: [
            "Online-Präsenz für mehr Sichtbarkeit",
            "Einfache Kontaktaufnahme für Kunden",
            "Professioneller Auftritt im Internet",
            "Mobile-optimiert für alle Geräte"
        ],
    },
    gastronomie: {
        name: "Gastronomie",
        title: "Webdesign für Gastronomie",
        description: "Professionelle Websites für Restaurants und Gastronomiebetriebe",
        keywords: "Webdesign Gastronomie, Restaurant Website, Gastronomie Homepage",
        icon: "🍽️",
        benefits: [
            "Online-Speisekarten und Menüs",
            "Tischreservierung direkt über die Website",
            "Kundenbewertungen präsentieren",
            "Öffnungszeiten immer aktuell"
        ],
    },
    einzelhandel: {
        name: "Einzelhandel",
        title: "Webdesign für Einzelhandel",
        description: "Professionelle Websites für Einzelhandelsgeschäfte und Shops",
        keywords: "Webdesign Einzelhandel, Shop Website, Einzelhandel Homepage",
        icon: "🛍️",
        benefits: [
            "Online-Shop Integration möglich",
            "Produktpräsentation ansprechend",
            "Standorte und Öffnungszeiten",
            "Kundenbindung durch Newsletter"
        ],
    },
    dienstleistung: {
        name: "Dienstleistung",
        title: "Webdesign für Dienstleister",
        description: "Professionelle Websites für Dienstleistungsunternehmen",
        keywords: "Webdesign Dienstleistung, Dienstleister Website, Service Homepage",
        icon: "💼",
        benefits: [
            "Services klar präsentieren",
            "Vertrauen durch Referenzen aufbauen",
            "Kontaktformular für Anfragen",
            "SEO-optimiert für lokale Suche"
        ],
    },
} as const;

export type BranchSlug = keyof typeof branches;

export function generateStaticParams() {
    return Object.keys(branches).map((branch) => ({
        slug: branch,
    }));
}
