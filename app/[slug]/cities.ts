// City data for Austrian cities
export interface City {
    name: string;
    region: string;
    population: string;
    description: string;
    keywords: string;
    landmarks: readonly string[];
    seoText: string;
    marketTrends: string;
    localFacts: readonly string[];
}

export const cities: Record<string, City> = {
    wien: {
        name: "Wien",
        region: "Wien",
        population: "1.9 Mio.",
        description: "Als Hauptstadt und wirtschaftliches Zentrum Österreichs ist Wien der härteste Markt für digitale Dienstleistungen. Hier zählt nicht nur Design, sondern Performance.",
        keywords: "Webdesign Wien, Website erstellen Wien, SEO Agentur Wien",
        landmarks: ["Stephansdom", "Schloss Schönbrunn", "Donau City"],
        seoText: "In Wien konkurrieren über 50.000 Unternehmen um die digitale Sichtbarkeit. Eine Website muss hier mehr können als nur gut aussehen – sie muss Wiens schnelles Tempo widerspiegeln. Unsere Designs für Wiener Kunden sind geprägt von urbaner Ästhetik, kombiniert mit kompromissloser technischer SEO, um in den hart umkämpften lokalen Suchergebnissen (Local Pack) zu bestehen.",
        marketTrends: "Steigende Nachfrage nach mehrsprachigen Websites (DE/EN) für internationales Publikum und mobile-first Lösungen für die urbane Pendler-Zielgruppe.",
        localFacts: ["Höchste dichte an Digitalagenturen in Österreich", "Starker Fokus auf Service-Dienstleistungen", "Hohe Mobile-Usage durch Öffi-Nutzer"]
    },
    graz: {
        name: "Graz",
        region: "Steiermark",
        population: "290.000",
        description: "Graz, die City of Design, verlangt nach Webseiten, die Kreativität und Funktionalität perfekt vereinen. Standard-Lösungen funktionieren hier nicht.",
        keywords: "Webdesign Graz, Website erstellen Graz, Webentwicklung Steiermark",
        landmarks: ["Uhrturm", "Kunsthaus", "Murinsel"],
        seoText: "Als UNESCO City of Design hat Graz einen hohen ästhetischen Anspruch. Grazer Unternehmen benötigen Websites, die diesen Design-Spirit atmen, ohne dabei die steirische Bodenständigkeit zu verlieren. Wir fokussieren uns in Graz auf innovative UI/UX-Konzepte, die besonders für die starke Kreativ- und Technologieszene der Stadt optimiert sind.",
        marketTrends: "Wachsende Tech-Szene verlangt nach modernen, cleanen Designs. Starker Fokus auf Nachhaltigkeit und regionale Wertschöpfung in der Kommunikation.",
        localFacts: ["UNESCO City of Design", "Starke Start-up Szene rund um die TU Graz", "Hoher Anspruch an visuelle Ästhetik"]
    },
    linz: {
        name: "Linz",
        region: "Oberösterreich",
        population: "206.000",
        description: "In der Industriestadt Linz zählt Innovation. Webdesign muss hier technisch präzise, schnell und zukunftsorientiert sein.",
        keywords: "Webdesign Linz, Website erstellen Linz, SEO Linz",
        landmarks: ["Ars Electronica Center", "Pöstlingberg", "Lentos"],
        seoText: "Linz hat sich von der Stahlstadt zum Technologie-Hub entwickelt. Webdesign in Linz muss diesen Wandel reflektieren: Technisch makellos, extrem schnell und integriert mit modernen Tools. Für unsere Linzer Kunden – oft aus dem Industrie- und Technologiesektor – setzen wir auf strukturierte Daten und B2B-optimierte Lead-Generierung.",
        marketTrends: "Starker B2B-Fokus. Websites dienen oft als digitaler Vertriebskanal für Industrie und Handwerk. Integration von ERP/CRM-Schnittstellen ist oft gefragt.",
        localFacts: ["Zentrum für digitale Kunst (Ars Electronica)", "Starker Industriemotor", "Pragmatische, lösungsorientierte Geschäftskultur"]
    },
    salzburg: {
        name: "Salzburg",
        region: "Salzburg",
        population: "156.000",
        description: "Salzburg verbindet Tradition mit Weltklasse-Tourismus. Websites müssen hier internationales Flair mit lokaler Tradition verknüpfen.",
        keywords: "Webdesign Salzburg, Website erstellen Salzburg, Tourismus Marketing Salzburg",
        landmarks: ["Festung Hohensalzburg", "Getreidegasse", "Mirabellgarten"],
        seoText: "Salzburg ist ein globales Schaufenster. Websites müssen hier oft zwei Zielgruppen gleichzeitig ansprechen: Das lokale Publikum und internationale Gäste. Mehrsprachigkeit und eine exzellente mobile User Experience (für Touristen vor Ort) sind Pflicht. Unser Webdesign für Salzburg balanciert elegant zwischen Tradition und Moderne.",
        marketTrends: "Dominanz des Tourismus- und Festspielsektors. Hohe Anforderungen an bildgewaltige Websites und Buchungsintegrationen.",
        localFacts: ["Weltkulturerbe trifft Moderne", "Hohe Dichte an Premium-Dienstleistern", "Internationales Publikum ganzjährig"]
    },
    innsbruck: {
        name: "Innsbruck",
        region: "Tirol",
        population: "132.000",
        description: "Die Hauptstadt der Alpen zieht sportliche und aktive Zielgruppen an. Webdesign muss hier dynamisch und emotional sein.",
        keywords: "Webdesign Innsbruck, Website erstellen Innsbruck, SEO Tirol",
        landmarks: ["Goldenes Dachl", "Nordkette", "Bergisel"],
        seoText: "In Innsbruck trifft der urbane Raum direkt auf die alpine Wildnis. Dieses Spannungsfeld nutzen wir im Webdesign: Klare, starke Bilderwelten und eine robuste Performance, die auch bei schlechtem Netz am Berg funktioniert. SEO in Tirol bedeutet oft, für hyper-lokale Suchbegriffe ('Skiverleih Innsbruck') und saisonale Trends optimiert zu sein.",
        marketTrends: "Stark saisonabhängiges Geschäft. Websites müssen flexibel auf Winter/Sommer umstellbar sein. Outdoor-Ästhetik dominiert.",
        localFacts: ["Universitätsstadt mit jungem Flair", "Zentrum des Alpentourismus", "Starke Verbindung von Sport und Business"]
    },
    klagenfurt: {
        name: "Klagenfurt",
        region: "Kärnten",
        population: "101.000",
        description: "Am Wörthersee gelegen, steht Klagenfurt für Lebensqualität. Webdesign darf hier entspannter, aber nicht weniger professionell sein.",
        keywords: "Webdesign Klagenfurt, Website erstellen Klagenfurt, Kärnten Web",
        landmarks: ["Wörthersee", "Minimundus", "Lindwurm"],
        seoText: "Klagenfurt ist das Tor zum Süden. Die digitale Kommunikation ist hier oft persönlicher und wärmer als im Rest Österreichs. Wir setzen für Klagenfurter Unternehmen auf Storytelling und starke visuelle Elemente, die das Lebensgefühl der Region transportieren, ohne die geschäftlichen Ziele aus den Augen zu verlieren.",
        marketTrends: "Tourismus und Dienstleistung dominieren. Wachsende IT-Szene im Lakeside Park verlangt nach High-End Web-Lösungen.",
        localFacts: ["Lakeside Science & Technology Park", "Drehscheibe im Alpen-Adria-Raum", "Hohe Lebensqualität als Standortfaktor"]
    },
    bregenz: {
        name: "Bregenz",
        region: "Vorarlberg",
        population: "30.000",
        description: "Im Vierländereck ist Qualität das oberste Gebot. Vorarlberger Webdesign muss präzise, hochwertig und alemannisch-nüchtern sein.",
        keywords: "Webdesign Bregenz, Website erstellen Vorarlberg, Dornbirn Webdesign",
        landmarks: ["Seebühne", "Pfänder", "Kunsthaus"],
        seoText: "Vorarlberg gilt als die Architektur- und Handwerkerhochburg Österreichs. 'Schaffa, schaffa, Hüsle baua' gilt auch digital: Websites müssen hier extrem funktional und handwerklich perfekt sein. Verspieltes Design kommt weniger gut an als klare, typografie-lastige Layouts mit Fokus auf Information und Qualität.",
        marketTrends: "Exportorientierte Wirtschaft verlangt nach mehrsprachigen B2B-Portalen. Hohes Qualitätsbewusstsein der Kunden.",
        localFacts: ["Vierländereck (DACH+FL)", "Starke Architektur-Szene", "Höchste Exportquote Österreichs"]
    },
    eisenstadt: {
        name: "Eisenstadt",
        region: "Burgenland",
        population: "15.000",
        description: "Klein, aber fein. In Eisenstadt zählt der persönliche Kontakt. Webseiten müssen hier Vertrauen und Nähe aufbauen.",
        keywords: "Webdesign Eisenstadt, Website erstellen Burgenland, Neusiedl Webdesign",
        landmarks: ["Schloss Esterházy", "Haydnhaus", "Schlosspark"],
        seoText: "Als kleinste Landeshauptstadt hat Eisenstadt eine familiäre Business-Struktur. SEO funktioniert hier stark über persönliche Netzwerke und lokale Reputation. Unsere Websites für das Burgenland sind darauf optimiert, digitale Visitenkarten zu sein, die den persönlichen Handschlag vorbereiten – freundlich, offen und direkt.",
        marketTrends: "Weinbau und Tourismus sind wichtige Treiber. Wachsender Bedarf an E-Commerce Lösungen für lokale Produzenten.",
        localFacts: ["Weinbau als Wirtschaftsfaktor", "Nähe zum Ballungsraum Wien", "Starke regionale Identität"]
    },
    "st-poelten": {
        name: "St. Pölten",
        region: "Niederösterreich",
        population: "56.000",
        description: "Die jüngste Landeshauptstadt sucht ihre Identität. Webdesign hier muss modern und selbstbewusst auftreten.",
        keywords: "Webdesign St. Pölten, Website erstellen Niederösterreich, Krems Webdesign",
        landmarks: ["Landhausviertel", "Klangturm", "Rathausplatz"],
        seoText: "St. Pölten ist eine Stadt im Wandel. Zwischen Barock und moderner Verwaltung entwickelt sich eine neue Dienstleistungsgesellschaft. Webdesign muss hier Brücken bauen – zwischen der ländlichen Umgebung Niederösterreichs und dem urbanen Anspruch der Hauptstadt. Wir setzen auf klare Strukturen und Regions-spezifisches SEO.",
        marketTrends: "Verwaltung und Bildung sind starke Sektoren. Zunehmende Digitalisierung traditioneller Handwerksbetriebe.",
        localFacts: ["Jüngste Landeshauptstadt", "Zentraler Verkehrsknotenpunkt", "Starkes Wachstum im Immobiliensektor"]
    },
} as const;

export type CitySlug = keyof typeof cities;

export function generateStaticParams() {
    return Object.keys(cities).map((city) => ({
        slug: `webdesign-${city}`,
    }));
}
