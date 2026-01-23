export interface RegionalContent {
    hook: "Speed" | "Security" | "Innovation" | "Quality" | "Tourism";
    introNarrative: string;
    economicContext: string;
    landmarks: string[];
    localProof: string; // Specific localized sentence (e.g., "From X to Y")
    projectCount: number; // Number of completed projects in this region
    // Extended content fields
    heroHeadline?: string;
    heroSubline?: string;
    introHeadline?: string;
    introText?: string;
    aboutHeadline?: string;
    aboutText?: string;
    seoText?: string;
}

export const regionalContent: Record<string, RegionalContent> = {
    "Wien": {
        hook: "Speed",
        introNarrative: "In einer Stadt, die niemals wirklich schläft, zählt Geschwindigkeit. Wir wissen, dass Wiener Unternehmen keine Zeit für endlose Meetings haben.",
        economicContext: "Wien ist nicht nur Verwaltungszentrum, sondern der Hub für Startups, Dienstleister und internationale Konzerne. Unser Webdesign-Ansatz ist auf diese urbane Dynamik abgestimmt: Schnell, skalierbar und international konkurrenzfähig.",
        landmarks: ["Stephansplatz", "Donau City", "MuseumsQuartier", "Naschmarkt"],
        localProof: "Vom ersten Bezirk bis nach Aspern – wir digitalisieren die Hauptstadt.",
        projectCount: 187
    },
    "Oberösterreich": {
        hook: "Quality",
        introNarrative: "Oberösterreich ist das Land der Unternehmer. Hier zählen Handschlagqualität und Ergebnisse, keine leeren Versprechungen.",
        economicContext: "Von der Industrie in Linz über Handwerksbetriebe in Wels bis zu Hotels im Salzkammergut – wir liefern Webdesign, das so zuverlässig arbeitet wie Ihre Produktion. Egal ob Installateur, Arzt, Restaurant oder Einzelhändler – wir verstehen Ihr Geschäft und kennen die Bedürfnisse oberösterreichischer Betriebe.",
        landmarks: ["Ars Electronica Center", "Pöstlingberg", "Traunsee", "Kulturhauptstadt Bad Ischl"],
        localProof: "Von Linz bis Steyr, vom Innviertel bis ins Salzkammergut – Qualität, die bleibt.",
        projectCount: 156
    },
    "Niederösterreich": {
        hook: "Innovation",
        introNarrative: "Niederösterreich ist das Land der Weite und der Möglichkeiten. Wir verbinden bodenständige Werte mit digitalem Fortschritt für Betriebe, die mehr erreichen wollen.",
        economicContext: "Von den zukunftsorientierten Technologie-Zentren im Wiener Umland bis zum traditionsreichen Weinbau in der Wachau – die Wirtschaft Niederösterreichs ist so vielfältig wie ihre Landschaft. Wir bieten maßgeschneiderte Webseiten-Gestaltung, die die lokale Identität wahrt und gleichzeitig höchste Maßstäbe in Technik und Suchmaschinen-Optimierung setzt. Egal ob Sie als Winzer, Industrieller oder Dienstleister agieren: Wir bringen Ihren Erfolg auf den Punkt.",
        landmarks: ["Stift Melk", "Schneeberg", "Wachau", "St. Pöltner Landhausviertel"],
        localProof: "Vom Waldviertel bis ins Industrieviertel – wir sind die Werbeagentur für den niederösterreichischen Mittelstand.",
        projectCount: 164
    },
    "Salzburg": {
        hook: "Tourism",
        introNarrative: "Wer auf der Weltbühne spielt, braucht einen Auftritt, der glänzt. Ihre Website ist der erste Eindruck für Gäste aus aller Welt.",
        economicContext: "Salzburg lebt von Exzellenz – in Kultur, Tourismus und Handel. Unsere Websites sind darauf optimiert, internationale Kunden zu überzeugen und Buchungen zu generieren. Ästhetik trifft hier auf maximale Konversion.",
        landmarks: ["Festung Hohensalzburg", "Getreidegasse", "Wolfgangsee", "Großglockner"],
        localProof: "Ob Festspielstadt oder Pongau – wir bringen Salzburger Gastfreundschaft ins Netz.",
        projectCount: 134
    },
    "Tirol": {
        hook: "Tourism",
        introNarrative: "Hoch hinaus wollen viele – wir sorgen dafür, dass Sie oben bleiben. Webdesign für eine Region, die keine Grenzen kennt.",
        economicContext: "Tirol ist eine Weltmarke. Der Wettbewerb im Tourismus und der alpinen Technologie ist hart. Wir bauen Websites, die wie ein Gipfelsieg wirken: Atemberaubend, stabil und weithin sichtbar für internationale Gäste.",
        landmarks: ["Goldenes Dachl", "Nordkette", "Arlberg", "Kitzbühel"],
        localProof: "Vom Inntal bis auf die Gletscher – digitale Lösungen auf höchstem Niveau.",
        projectCount: 168
    },
    "Steiermark": {
        hook: "Innovation",
        introNarrative: "Das grüne Herz Österreichs schlägt digital. Tradition trifft hier auf Hochtechnologie – so wie bei unseren Websites.",
        economicContext: "Die Steiermark ist Innovationsführer, vom Autocluster bis zur Kulinarik. Wir spiegeln diesen Erfindergeist wider: Mit Websites, die technisch am Puls der Zeit sind, aber den steirischen Charme nicht verlieren.",
        landmarks: ["Uhrturm", "Schloßberg", "Dachstein", "Thermenland"],
        localProof: "Ob Grazer Start-up oder Buschenschank in der Südsteiermark – wir verstehen Sie.",
        projectCount: 179,
        heroHeadline: "Webdesign. <span class=\"text-red-500\">Steiermark.</span>",
        heroSubline: "Digitaler Erfolg für steirische Unternehmen. Von Graz bis ins Ennstal.",
        introHeadline: "Webdesign Agentur für die Steiermark",
        introText: `
            <p class="mb-6">
                Die Steiermark ist der Innovationsmotor Österreichs. Deine Website sollte dem in nichts nachstehen. Egal ob Industriebetrieb im Murtal, Winzer in der Südsteiermark oder Dienstleister in Graz: Wir bringen dich groß raus.
            </p>
            <p>
                Du suchst modernes <strong>Webdesign Steiermark</strong>, das nicht nur gut aussieht, sondern auch Kunden gewinnt? Wir verbinden steirische Handschlagqualität mit High-End Technologie.
            </p>
        `,
        aboutHeadline: "Wir sprechen Steirisch. Und Digital.",
        aboutText: `
            <p class="mb-6">
                Websites von der Stange gibt es genug. Wir setzen auf Maßarbeit. Wir analysieren deinen Markt, deine Konkurrenz und deine Zielgruppe, um eine Lösung zu bauen, die wirklich funktioniert.
            </p>
            <p>
                Von Leoben bis Feldbach, von Bruck bis Liezen – wir sind dein Partner vor Ort. Wir wissen, wie die steirische Wirtschaft tickt und was deine Kunden erwarten.
            </p>
        `,
        seoText: `
            <h3>Sichtbarkeit in der grünen Mark</h3>
            <p>
                Eine Website ohne Besucher ist wie ein Buschenschank ohne Wein. Wir sorgen mit professionellem SEO dafür, dass du bei Google ganz oben stehst – egal ob jemand nach "Installateur Graz" oder "Hotel Schladming" sucht.
            </p>
            <p>
                Unser <strong>Webdesign Steiermark</strong> ist von Grund auf für Suchmaschinen optimiert. Schnelle Ladezeiten, saubere Strukturen und relevante Inhalte sind bei uns Standard, nicht Extra.
            </p>
            
            <h3>High-Tech für High-Performance</h3>
            <p>
                Wir nutzen modernste Technologien wie Next.js, um deiner Website den Turbo zu zünden. Das bedeutet: Blitzschnelle Ladezeiten, höchste Sicherheit und perfekte Darstellung auf allen Geräten.
            </p>

            <h3>Warum Red Rabbit Media?</h3>
            <p>
                Weil wir keine 08/15 Agentur sind. Wir sehen uns als deinen strategischen Partner. Wenn du eine <strong>Website erstellen lassen</strong> willst, die dein Unternehmen wirklich weiterbringt, dann bist du bei uns richtig.
            </p>
        `
    },
    "Kärnten": {
        hook: "Tourism",
        introNarrative: "Kärnten verbindet Lebensqualität mit Wirtschaftskraft. Wir bringen diese Stärke ins Netz.",
        landmarks: ["Wörthersee", "Pyramidenkogel", "Burg Hochosterwitz", "Großglockner"],
        localProof: "Erfolgreiche Projekte von Klagenfurt bis Hermagor.",
        projectCount: 142,
        heroHeadline: "Webdesign. <span class=\"text-red-500\">Kärnten.</span>",
        heroSubline: "Wir bringen Kärntner Unternehmen groß raus. Vom Wörthersee bis in die Nockberge.",
        introHeadline: "Webdesign Agentur für alle Branchen in Kärnten",
        introText: `
            <p class="mb-6">
                Egal ob Dienstleister in Villach, Handwerker im Lavanttal oder Start-up in Klagenfurt: Wer heute gefunden werden will, braucht mehr als nur eine Visitenkarte im Netz. Du willst eine <strong>Website machen lassen</strong>, die nicht nur gut aussieht, sondern Kunden bringt?
            </p>
            <p>
                Wir sind deine Partner für digitalen Erfolg. Wir verstehen, dass jeder Betrieb anders tickt. Deshalb gibt es bei uns kein "Schema F", sondern maßgeschneiderte Lösungen für dein <strong>Webdesign in Kärnten</strong>.
            </p>
        `,
        aboutHeadline: "Digitaler Erfolg für Kärntner Betriebe",
        aboutText: `
            <p class="mb-6">
                Red Rabbit Media steht für Ergebnisse. Wir helfen dir, deine PS auf die Straße zu bringen. Unsere Mission: Deine Expertise digital sichtbar machen.
            </p>
            <p>
                Wir betreuen Kunden in ganz Kärnten – von Spittal bis Völkermarkt. Dabei ist uns egal, ob du Zimmer vermietest, Häuser baust oder Beratungen anbietest. Wichtig ist nur eines: Dass du mit deiner neuen Website Erfolg hast.
            </p>
        `,
        seoText: `
            <h3>Gefunden werden statt suchen lassen</h3>
            <p>
                Die schönste Seite nützt nichts, wenn sie keiner sieht. Wir sorgen dafür, dass du bei Google oben stehst. Professionelles <strong>SEO machen</strong> heißt für uns: Technisch sauber, inhaltlich stark und lokal relevant.
            </p>
            <p>
                Wenn jemand nach deiner Dienstleistung in Kärnten sucht, soll er dich finden. Punkt. Wir optimieren Ladezeiten, Strukturen und Texte so, dass Suchmaschinen und Menschen begeistert sind.
            </p>
            
            <h3>Technik, die funktioniert</h3>
            <p>
                Deine Kunden nutzen Smartphones, Tablets und Laptops. Dein <strong>Webdesign Kärnten</strong> muss überall perfekt funktionieren. Wir garantieren Responsive Design, das auf jedem Gerät eine gute Figur macht.
            </p>

            <h3>Warum Profis ranlassen?</h3>
            <p>
                Baukästen sind verlockend, aber oft eine Sackgasse. Wenn du eine <strong>Website machen lassen</strong> willst, die mit deinem Unternehmen wächst, brauchst du ein festes Fundament. Wir bieten dir Freiheit, Flexibilität und einen Partner, der auch nach dem Launch für dich da ist.
            </p>
        `,
        economicContext: "Kärnten ist ein Land der Vielfalt – wirtschaftlich wie landschaftlich. Wir geben Kärntner Unternehmen die digitale Bühne, die sie verdienen.",
    },
    "Burgenland": {
        hook: "Security",
        introNarrative: "Ehrlich währt am längsten. Wir versprechen keine Wunder, sondern solide Arbeit zu einem fairen Preis für das Sonnenland.",
        economicContext: "Das Burgenland hat sich vom Agrarland zum Energie- und Weinpionier gewandelt. Wir begleiten diesen Wandel mit Webseiten, die Nachhaltigkeit ausstrahlen und budgetfreundlich sind – ideal für KMUs und Direktvermarkter.",
        landmarks: ["Neusiedler See", "Schloss Esterházy", "Burg Forchtenstein", "Kellerstöckl"],
        localProof: "Vom Seewinkel bis Jennersdorf – wir vernetzen das Burgenland.",
        projectCount: 128
    },
    "Vorarlberg": {
        hook: "Innovation",
        introNarrative: "Schaffen, nicht reden. Vorarlberger Unternehmen sind Weltmarktführer im Verborgenen – wir machen diese Qualität sichtbar.",
        economicContext: "Der Ländle-Spirit ist einzigartig: Höchste Effizienz und Designanspruch. Unsere Websites sind wie Vorarlberger Architektur: Klar, funktional, ohne unnötigen Ballast, aber bis ins letzte Detail durchdacht.",
        landmarks: ["Bregenzer Festspiele", "Karren", "Silvretta", "Arlberg"],
        localProof: "Vom Bodensee bis ins Montafon – digitales Handwerk für Vorarlberg.",
        projectCount: 145
    }
};
