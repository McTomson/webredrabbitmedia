export interface RegionalContent {
    hook: "Speed" | "Security" | "Innovation" | "Quality" | "Tourism";
    introNarrative: string;
    economicContext: string;
    landmarks: string[];
    localProof: string; // Specific localized sentence (e.g., "From X to Y")
    projectCount: number; // Number of completed projects in this region
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
        projectCount: 179
    },
    "Kärnten": {
        hook: "Quality",
        introNarrative: "Lebensqualität und Business gehen Hand in Hand. Wir sorgen dafür, dass Ihre Website für Sie arbeitet, nicht umgekehrt.",
        economicContext: "Kärnten verbindet den Alpen-Adria-Raum. Wir erstellen mehrsprachige, weltoffene Webseiten, die Kärntner Unternehmen als Tor zum Süden positionieren. Entspannt zum Erfolg, mit Technik, die funktioniert.",
        landmarks: ["Wörthersee", "Großglockner", "Burg Hochosterwitz", "Minimundus"],
        localProof: "Vom Wörtersee bis ins Lavanttal – Sichtbarkeit für Kärntens Wirtschaft.",
        projectCount: 151
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
