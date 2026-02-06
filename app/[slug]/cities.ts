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
    projectCount?: number;
    cluster: "metropolis" | "tourism" | "regional" | "graz" | "salzburg" | "innsbruck" | "klagenfurt" | "eisenstadt";
    heroImage?: string;
}

export type CityCluster = City["cluster"];

export const cities: Record<string, City> = {
    wien: {
        name: "Wien",
        region: "Wien",
        population: "1.9 Mio.",
        description: "Vom ersten Bezirk bis nach Donaustadt – wir bauen Webseiten, die im Wiener Wettbewerb ganz oben stehen. Ob Kanzlei, Bäckerei oder wachsendes Unternehmen: Wir sorgen dafür, dass Sie bei Google gefunden werden und Ihre Kunden sofort überzeugt sind.",
        keywords: "Webdesign Wien, Website erstellen Wien, Suchmaschinenoptimierung Wien, Webagentur Wien, Webseite machen lassen Wien",
        landmarks: ["Stephansdom", "Schloss Schönbrunn", "Donau City", "Naschmarkt", "Prater"],
        seoText: "Wien ist der Motor der österreichischen Wirtschaft. Hier entscheiden Millisekunden darüber, ob ein Kunde bei Ihnen anfragt oder zur Konkurrenz geht. Wir optimieren Ihren Auftritt für das Wiener Stadtgebiet und alle Bezirke. Von der Landstraße bis Floridsdorf – wir sorgen dafür, dass Ihr Betrieb bei den relevanten Suchbegriffen ganz oben erscheint. Dabei verbinden wir moderne Technik mit einer klaren Struktur, die Suchmaschinen und echten Menschen gleichermaßen gefällt.",
        marketTrends: "Hohe Nachfrage nach mobiler Nutzbarkeit durch die vielen Öffi-Nutzer und professionelles Auftreten für anspruchsvolle Stadtkunden.",
        localFacts: ["Zentrum für Dienstleistung und Handel", "Hoher Wettbewerbsdruck in allen Branchen", "Schnelllebiger Markt mit Fokus auf Qualität"],
        projectCount: 315,
        cluster: "metropolis"
    },
    salzburg: {
        name: "Salzburg",
        region: "Salzburg",
        population: "156.000",
        description: "Direkt an der Salzburger Altstadt und weit darüber hinaus. Wir entwickeln Webauftritte, die Weltklasse-Niveau haben, aber regional verwurzelt sind. Perfekt für Betriebe von der Getreidegasse bis in den Pinzgau.",
        keywords: "Webdesign Salzburg, Webseite erstellen Salzburg, Homepage Gestaltung Salzburg, Webdesigner Salzburg, SEO Salzburg",
        landmarks: ["Festung Hohensalzburg", "Getreidegasse", "Mirabellgarten", "Salzburger Dom"],
        seoText: "In Salzburg trifft Tradition auf internationales Publikum. Eine Webseite muss hier zwei Dinge können: Die lokale Beständigkeit ausstrahlen und gleichzeitig modernen Standards gerecht werden. Wir unterstützen Salzburger Betriebe dabei, ihre Sichtbarkeit in der Region zu festigen. Von der Stadt Salzburg bis nach Hallein – wir optimieren Ihren Code und Ihre Inhalte so, dass Sie genau dann gefunden werden, wenn Kunden nach Ihren Leistungen suchen.",
        marketTrends: "Fokus auf hochwertige Bildsprache und exzellente Darstellung auf Smartphones für Touristen und Einheimische.",
        localFacts: ["Weltkulturerbe mit modernem Geist", "Hoher Anspruch an Ästhetik und Stil", "Partner für Handwerk und Gastronomie"],
        cluster: "salzburg"
    },
    graz: {
        name: "Graz",
        region: "Steiermark",
        population: "290.000",
        description: "Kreativität trifft steirische Handschlagqualität. Vom Uhrturm bis zur Murinsel – wir gestalten Webseiten, die den Grazer Design-Spirit atmen und gleichzeitig echte Kundenanfragen generieren.",
        keywords: "Webdesign Graz, Webseite erstellen Graz, Homepage Graz, Webagentur Steiermark, Suchmaschinenoptimierung Graz",
        landmarks: ["Uhrturm", "Kunsthaus", "Murinsel", "Schloss Eggenberg"],
        seoText: "Graz ist die Stadt des Designs. Hier wird Innovation großgeschrieben. Grazer Unternehmen benötigen Webseiten, die sich vom Standard abheben, ohne die Bodenständigkeit zu verlieren. Wir fokussieren uns auf schnelle Ladezeiten und eine intuitive Bedienung. Von Jakomini bis nach Eggenberg – wir bringen Ihren Betrieb bei Google nach vorne, damit Sie in der grünen Mark digital den Ton angeben.",
        marketTrends: "Wachsende Technologie-Szene und starker Fokus auf nachhaltige, regionale Kommunikation.",
        localFacts: ["UNESCO City of Design", "Starker Zusammenhalt in der regionalen Wirtschaft", "Hoher Anspruch an Benutzerfreundlichkeit"],
        cluster: "graz"
    },
    linz: {
        name: "Linz",
        region: "Oberösterreich",
        population: "206.000",
        description: "Ehrlich, stark und direkt. Von Urfahr bis Ebelsberg – wir sind Ihr Partner für Webseiten und Google-Optimierung. Ob Industriebetrieb oder kleine Backstube: Wir bringen Sie in Linz nach vorne.",
        keywords: "Webdesign Linz, Webseite erstellen Linz, Homepage machen lassen Linz, SEO Linz, Webagentur Oberösterreich",
        landmarks: ["Ars Electronica Center", "Pöstlingberg", "Lentos", "Mariendom"],
        seoText: "In der Industriestadt Linz zählen Ergebnisse. Hier braucht man keine komplizierten Worte, sondern Lösungen, die funktionieren. Wir entwickeln Webauftritte, die so zuverlässig sind wie die oberösterreichische Wirtschaft. Wir optimieren Ihre Seite für den Linzer Markt und sorgen dafür, dass Ihre Suchergebnisse genau dort erscheinen, wo Ihre Kunden suchen – ehrlich, direkt und pfeilschnell.",
        marketTrends: "Digitalisierung im Handwerk und starke B2B-Präsenz für Industrieunternehmen.",
        localFacts: ["Innovations-Hub am Donaustrand", "Direkte und lösungsorientierte Unternehmenskultur", "Starker Fokus auf Technik und Nutzwert"],
        cluster: "metropolis"
    },
    innsbruck: {
        name: "Innsbruck",
        region: "Tirol",
        population: "132.000",
        description: "Perfekte Aussichten für Ihren Erfolg. Vom Goldenen Dachl bis zur Nordkette – wir bauen digitale Fundamente, die stabil stehen. Wir optimieren Ihre Sichtbarkeit, damit Sie in Innsbruck von jedem Kunden gefunden werden.",
        keywords: "Webdesign Innsbruck, Webseite erstellen Innsbruck, Homepage Innsbruck, SEO Tirol, Webagentur Innsbruck",
        landmarks: ["Goldenes Dachl", "Nordkette", "Bergisel", "Hofburg Innsbruck"],
        seoText: "In Innsbruck zählen Ausdauer und die richtige Strategie. Wer hier erfolgreich sein will, braucht einen Webauftritt, der auch bei höchster Last stabil läuft. Wir unterstützen Tiroler Betriebe dabei, digital an die Spitze zu kommen. Wir optimieren Ihre Inhalte für die lokale Suche in und um Innsbruck, damit Sie genau dann sichtbar sind, wenn die Konkurrenz noch im Tal festsitzt.",
        marketTrends: "Hoher Wettbewerb durch Tourismus und starke lokale Dienstleister. Fokus auf mobile Erreichbarkeit.",
        localFacts: ["Universitätsstadt mit alpiner Dynamik", "Zentrum für Handel und Bergsport", "Traditionelle Werte im modernen Gewand"],
        cluster: "innsbruck"
    },
    klagenfurt: {
        name: "Klagenfurt",
        region: "Kärnten",
        population: "101.000",
        description: "Sichtbarkeit auf der Sonnenseite. Vom Lindwurm bis zum Wörthersee – wir unterstützen Kärntner Unternehmen dabei, online zu wachsen. Wir sprechen Ihre Sprache und liefern Ergebnisse ohne Umwege.",
        keywords: "Webdesign Klagenfurt, Webseite erstellen Kärnten, Homepage Klagenfurt, Suchmaschinenoptimierung Klagenfurt, Webdesigner Kärnten",
        landmarks: ["Lindwurm", "Wörthersee", "Minimundus", "Stadttheater Klagenfurt"],
        seoText: "Klagenfurt verbindet südliche Lebensqualität mit wirtschaftlichem Vorwärtsdrang. Eine Webseite muss hier Vertrauen schaffen und Nähe zeigen. Wir optimieren Ihren Auftritt für den Kärntner Zentralraum. Ob für den Lakeside Park oder das lokale Handwerk: Wir sorgen dafür, dass Ihr Betrieb bei Google genau dort erscheint, wo die Menschen in Klagenfurt und Umgebung nach Ihnen suchen – freundlich, nahbar und technisch brillant.",
        marketTrends: "Zunehmende Vernetzung von Tourismus und lokaler Wirtschaft. Fokus auf persönlichen Kontakt.",
        localFacts: ["Wirtschaftsmotor im Süden", "Starke Identität und regionale Verbundenheit", "Wachsender Technologie-Standort"],
        cluster: "klagenfurt"
    },
    bregenz: {
        name: "Bregenz",
        region: "Vorarlberg",
        population: "30.000",
        description: "Präzises Handwerk für das Ländle. Von der Seebühne bis in das Rheintal – wir erstellen Webseiten mit Vorarlberger Qualitätsanspruch. Klare Linien, schnelle Ladezeiten und optimale Auffindbarkeit.",
        keywords: "Webdesign Bregenz, Webseite erstellen Vorarlberg, Homepage Bregenz, Dornbirn Webdesign, SEO Vorarlberg",
        landmarks: ["Seebühne", "Pfänder", "Kunsthaus Bregenz", "Bregenzerwald"],
        seoText: "Im Vorarlberger Ländle zählt das 'Schaffen'. Qualität ist hier kein Schlagwort, sondern Standard. Wir bauen Webseiten, die so präzise arbeiten wie Ihre Produktion. Wir optimieren Ihren Auftritt für das Vierländereck und sorgen dafür, dass Ihr Betrieb in Bregenz, Dornbirn und Feldkirch als Premium-Partner wahrgenommen wird – funktional, ästhetisch und technisch fehlerfrei.",
        marketTrends: "Höchstes Qualitätsbewusstsein und Fokus auf Langlebigkeit und Funktionalität der Webseite.",
        localFacts: ["Exportstarke Region mit hohem Niveau", "Architektur- und Handwerkshochburg", "Nüchterne, aber exzellente Ästhetik"],
        cluster: "regional"
    },
    eisenstadt: {
        name: "Eisenstadt",
        region: "Burgenland",
        population: "15.000",
        description: "Bodenständig und digital erfolgreich. Vom Schloss Esterházy bis zum Neusiedler See – wir begleiten burgenländische Betriebe bei ihrem Internetauftritt. Ehrlich, regional und wirkungsvoll.",
        keywords: "Webdesign Eisenstadt, Webseite erstellen Burgenland, Homepage Eisenstadt, SEO Burgenland, Internetagentur Eisenstadt",
        landmarks: ["Schloss Esterházy", "Haydnhaus", "Schlosspark", "Neusiedler See"],
        seoText: "Das Burgenland ist im digitalen Aufbruch. Eisenstadt zeigt, wie man Tradition und Fortschritt verbindet. Wir unterstützen Winzer, Handwerker und Dienstleister dabei, über die Landesgrenzen hinaus sichtbar zu werden. Wir bauen Webseiten, die Vertrauen schaffen und Ihre regionale Stärke nutzen. Ob für Kunden in Eisenstadt oder Gäste aus Wien – wir bringen Ihren Erfolg auf den Punkt.",
        marketTrends: "Digitalisierungsschub bei regionalen Produzenten und Direktvermarktern. Fokus auf Nähe und Vertrauen.",
        localFacts: ["Familiengeführte Betriebe als Basis", "Wachsende wirtschaftliche Bedeutung in der Ostregion", "Handschlagqualität beim Geschäftemachen"],
        cluster: "eisenstadt"
    },
    "st-poelten": {
        name: "St. Pölten",
        region: "Niederösterreich",
        population: "56.000",
        description: "Das digitale Herz von Niederösterreich. Vom Landhausviertel bis zum Rathausplatz – wir entwickeln Webseiten, die Vertrauen schaffen. Wir helfen Ihnen, in der Region und darüber hinaus sichtbar zu werden.",
        keywords: "Webdesign St. Pölten, Webseite erstellen Niederösterreich, Homepage St. Pölten, SEO St. Pölten, Webagentur Niederösterreich",
        landmarks: ["Landhausviertel", "Klangturm", "Rathausplatz St. Pölten", "Dom zu St. Pölten"],
        seoText: "St. Pölten verbindet die Weite Niederösterreichs mit urbanem Anspruch. Hier braucht es einen Auftritt, der bodenständig wirkt und technisch überzeugt. Wir optimieren Ihre Webseite für das niederösterreichische Kerngebiet. Von Krems bis nach Baden – wir sorgen dafür, dass Ihr Projekt bei Google ganz oben steht, damit Ihre regionalen Kunden Sie sofort finden und kontaktieren können – zuverlässig und professionell.",
        marketTrends: "Zentraler Standort für Dienstleistungen und starke Nachfrage nach regionaler Auffindbarkeit.",
        localFacts: ["Jüngste Landeshauptstadt als Wachstumsmotor", "Zentrale Drehscheibe in Niederösterreich", "Persönlicher Kontakt ist entscheidend"],
        cluster: "regional"
    },
} as const;

export type CitySlug = keyof typeof cities;

export function generateStaticParams() {
    return Object.keys(cities).map((city) => ({
        slug: `webdesign-${city}`,
    }));
}
