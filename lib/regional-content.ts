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
    aboutSecondaryText?: string;
    strategyItems?: { title: string; text: string }[];
    seoFeatures?: { title: string; text: string }[];
    aboutFeatures?: { title: string; text: string }[];
    sectionOrder?: string[];
}

export const regionalContent: Record<string, RegionalContent> = {
    "Wien": {
        hook: "Speed",
        introNarrative: "In einer Metropole, die niemals stillsteht, ist Zeit die wertvollste Währung. Wir entwickeln Webauftritte für Wiener Unternehmen, die sofort überzeugen – ohne langwierige Meetings, dafür mit maximalen Ergebnissen.",
        economicContext: "Wien ist der Motor der österreichischen Wirtschaft. Vom innovativen Start-up in den Außenbezirken bis zur etablierten Kanzlei im ersten Bezirk – wir liefern Webdesign, das dieser Dynamik gerecht wird. Wir verstehen die urbanen Anforderungen an Sichtbarkeit und digitale Professionalität.",
        landmarks: ["Stephansplatz", "Donau City", "MuseumsQuartier", "Naschmarkt"],
        localProof: "Vom ersten Bezirk bis nach Aspern – wir digitalisieren die Hauptstadt.",
        projectCount: 187,
        heroHeadline: "Digital. <br /><span class=\"text-red-500\">Wien.</span>",
        heroSubline: "Blitzschnelles Webdesign für die Hauptstadt. Keine Anfahrt, keine Parkplatzsuche – 100% digitaler Erfolg.",
        introHeadline: "Ihre Werbeagentur für Webdesign in Wien",
        introText: `
            <p class="mb-6">
                Wien ist international, schnell und anspruchsvoll. Ihre Website sollte das widerspiegeln. Wir unterstützen Dienstleister, Agenturen und Betriebe in ganz Wien dabei, ihre digitale Visitenkarte in eine echte Verkaufsmaschine zu verwandeln.
            </p>
            <p>
                Ob Sie im <strong>1. Bezirk</strong>, in <strong>Donaustadt</strong> oder <strong>Meidling</strong> sitzen: Wir bieten Ihnen professionelles Webdesign, das genau auf die Wiener Zielgruppe zugeschnitten ist. Mit Fokus auf mobile Performance und SEO-Exzellenz.
            </p>
        `,
        aboutHeadline: "Urbaner Vorsprung durch High-End Programmierung",
        aboutText: `
            <p class="mb-6">
                In einer Stadt mit so viel Wettbewerb wie Wien reicht ein Standard-Design nicht aus. Wir setzen auf modernste Technologien, um Ihre Ladezeiten zu minimieren und Ihre Rankings zu maximieren.
            </p>
            <p>
                Wir sind Ihr Partner für <strong>Webdesign Wien</strong>. Wir begleiten Sie von der ersten Idee bis zum Go-Live und sorgen dafür, dass Sie bei Google dort stehen, wo Ihre Kunden suchen: Ganz oben.
            </p>
        `,
        aboutSecondaryText: `
            Wien verlangt nach Exzellenz. Seit 2019 entwickeln wir für Wiener Unternehmen Webauftritte, die technisch und optisch Maßstäbe setzen. Wir glauben an klare Prozesse, faire Fixpreise und Ergebnisse, die sich in Zahlen messen lassen.
        `,
        strategyItems: [
            {
                title: "Zeit ist Geld",
                text: "In Wien wartet niemand gerne. Wenn Ihre Website länger als 2 Sekunden lädt, haben Sie den Kunden bereits verloren. Wir bauen auf Speed."
            },
            {
                title: "KI-Ready",
                text: "Wir bereiten Ihre Inhalte so vor, dass sie nicht nur von Google, sondern auch von KI-Assistenten wie ChatGPT in Wien empfohlen werden."
            },
            {
                title: "Konversions-Fokus",
                text: "Klicks sind gut, Kunden sind besser. Wir strukturieren Ihre Seite so, dass aus Besuchern echte Anfragen für Ihr Wiener Unternehmen werden."
            }
        ],
        seoFeatures: [
            {
                title: "Local SEO Wien",
                text: "Gezielte Sichtbarkeit in den relevanten Bezirken und für spezifische Wiener Suchbegriffe."
            },
            {
                title: "High-Speed Hosting",
                text: "Serverstandorte und Infrastruktur, die für maximale Ladegeschwindigkeiten in Österreich optimiert sind."
            },
            {
                title: "Technische Exzellenz",
                text: "Sauberer Code nach Next.js Standards sorgt für dauerhafte Top-Rankings ohne technische Altlasten."
            }
        ],
        aboutFeatures: [
            {
                title: "Full-Service Digital",
                text: "Von der Strategie bis zur fertigen Website – alles aus einer Hand."
            },
            {
                title: "Transparente Fixpreise",
                text: "Keine versteckten Agentur-Gebühren, sondern klare Kosten von Anfang an."
            },
            {
                title: "Persönlicher Support",
                text: "Wir sind für unsere Wiener Kunden immer erreichbar – digital und direkt."
            }
        ],
        sectionOrder: ["intro", "seo", "portfolio", "branchen", "about", "pricing", "faq", "contact"]
    },
    "Oberösterreich": {
        hook: "Quality",
        introNarrative: "Oberösterreich ist das Land der Unternehmer. Hier zählen Handschlagqualität und Ergebnisse, keine leeren Versprechungen.",
        economicContext: "Von der Industrie in Linz über Handwerksbetriebe in Wels bis zu Hotels im Salzkammergut – wir liefern Webdesign, das so zuverlässig arbeitet wie Ihre Produktion. Egal ob Installateur, Arzt, Restaurant oder Einzelhändler – wir verstehen Ihr Geschäft und kennen die Bedürfnisse oberösterreichischer Betriebe.",
        landmarks: ["Ars Electronica Center", "Pöstlingberg", "Traunsee", "Kulturhauptstadt Bad Ischl"],
        localProof: "Von Linz bis Steyr, vom Innviertel bis ins Salzkammergut – Qualität, die bleibt.",
        projectCount: 156,
        sectionOrder: ["intro", "portfolio", "branchen", "about", "testimonials", "pricing", "faq", "contact"]
    },
    "Niederösterreich": {
        hook: "Innovation",
        introNarrative: "Niederösterreich ist das Land der Weite und der Möglichkeiten. Wir verbinden bodenständige Werte mit digitalem Fortschritt für Betriebe, die mehr erreichen wollen.",
        economicContext: "Von den zukunftsorientierten Technologie-Zentren im Wiener Umland bis zum traditionsreichen Weinbau in der Wachau – die Wirtschaft Niederösterreichs ist so vielfältig wie ihre Landschaft. Wir bieten maßgeschneiderte Webseiten-Gestaltung, die die lokale Identität wahrt und gleichzeitig höchste Maßstäbe in Technik und Suchmaschinen-Optimierung setzt. Egal ob Sie als Winzer, Industrieller oder Dienstleister agieren: Wir bringen Ihren Erfolg auf den Punkt.",
        landmarks: ["Stift Melk", "Schneeberg", "Wachau", "St. Pöltner Landhausviertel"],
        localProof: "Vom Waldviertel bis ins Industrieviertel – wir sind die Werbeagentur für den niederösterreichischen Mittelstand.",
        projectCount: 164,
        sectionOrder: ["intro", "usp", "portfolio", "about", "testimonials", "pricing", "faq", "contact"]
    },
    "Salzburg": {
        hook: "Tourism",
        introNarrative: "Wer auf der Weltbühne spielt, braucht einen Auftritt, der glänzt. Wir entwickeln Webseiten für Salzburger Unternehmen, die internationale Qualitätsstandards nicht nur erfüllen, sondern setzen.",
        economicContext: "Salzburg ist ein Synonym für Exzellenz – in Kultur, Tourismus und Handel. Vom Festspielbezirk bis zu den exportstarken Betrieben im Flachgau und Pinzgau. Wir liefern Webdesign, das diese Eleganz und Professionalität widerspiegelt und weltweit Kunden überzeugt.",
        landmarks: ["Festung Hohensalzburg", "Getreidegasse", "Wolfgangsee", "Großglockner"],
        localProof: "Ob Festspielstadt oder Pongau – wir bringen Salzburger Gastfreundschaft ins Netz.",
        projectCount: 134,
        heroHeadline: "Exzellenz. <br /><span class=\"text-red-500\">Salzburg.</span>",
        heroSubline: "Premium Webdesign für die Weltbühne. Wir machen Ihre Marke digital unvergesslich.",
        introHeadline: "Ihre Agentur für Webdesign in Salzburg",
        introText: `
            <p class="mb-6">
                Salzburg lebt von der Perfektion. Ihre Website sollte da keine Ausnahme machen. Wir unterstützen Salzburger Betriebe dabei, ihre Qualität digital erlebbar zu machen – für Kunden aus der Region und Gäste aus aller Welt.
            </p>
            <p>
                Ob Sie in der <strong>Stadt Salzburg</strong> innovative Dienstleistungen anbieten oder im <strong>Pinzgau</strong> im Tourismus erfolgreich sind: Wir bauen Webseiten, die ästhetisch glänzen und technisch auf höchstem Niveau arbeiten.
            </p>
        `,
        aboutHeadline: "Webdesign mit Salzburger Qualitätsanspruch",
        aboutText: `
            <p class="mb-6">
                In einer Region, die für ihre Kunst und Kultur berühmt ist, zählt das Auge fürs Detail. Wir gestalten Webauftritte, die Ihre Werte transportieren und gleichzeitig für maximale Konversion optimiert sind.
            </p>
            <p>
                Wir sind Ihr Partner für <strong>Webdesign Salzburg</strong>. Wir setzen auf klare Linien, schnelle Ladezeiten und eine intuitive Nutzerführung, die Ihre Kunden direkt ans Ziel führt.
            </p>
        `,
        aboutSecondaryText: `
            Salzburg fordert Brillanz. Seit 2019 begleiten wir Salzburger Unternehmen dabei, digital groß aufzuspielen. Wir vereinen kreativen Anspruch mit kompromissloser Technik – für Ergebnisse, die so zeitlos sind wie die Mozartstadt selbst.
        `,
        strategyItems: [
            {
                title: "Premium-Positionierung",
                text: "Wir heben Ihren Salzburger Betrieb von der Masse ab. Durch exklusives Design, das Ihre Kompetenz unterstreicht."
            },
            {
                title: "Internationale SEO",
                text: "Sichtbarkeit weit über Salzburg hinaus. Wir optimieren für nationale und internationale Märkte."
            },
            {
                title: "Storytelling",
                text: "Wir erzählen die Geschichte Ihrer Marke so, dass sie Emotionen weckt und Vertrauen bei Ihren Kunden aufbaut."
            }
        ],
        seoFeatures: [
            {
                title: "Globaler Standard",
                text: "Wir nutzen Technologien, die weltweit für ihre Performance und Sicherheit bekannt sind."
            },
            {
                title: "Content Excellence",
                text: "Hochwertige Inhalte, die sowohl Google als auch Ihre anspruchsvollen Kunden überzeugen."
            },
            {
                title: "KI-Vorsprung",
                text: "Bereit für die Zukunft der Suche: Wir machen Ihre Daten für moderne Assistenz-Systeme lesbar."
            }
        ],
        aboutFeatures: [
            {
                title: "Höchste Ästhetik",
                text: "Design, das Ihre Premium-Qualität auf den ersten Blick sichtbar macht."
            },
            {
                title: "Präzise Technik",
                text: "Hinter der schönen Fassade arbeitet ein Motor aus purem High-Tech."
            },
            {
                title: "Ehrliche Beratung",
                text: "Wir sagen Ihnen direkt, was für Ihren Erfolg in Salzburg nötig ist."
            }
        ],
        sectionOrder: ["intro", "portfolio", "about", "branchen", "seo", "pricing", "faq", "contact"]
    },
    "Tirol": {
        hook: "Tourism",
        introNarrative: "Wo alpine Stärke auf digitalen Weitblick trifft: Wir bauen Websites für Tiroler Betriebe, die keine Grenzen kennen und immer das Ziel vor Augen haben.",
        economicContext: "Tirol ist eine Weltmarke. Vom Tourismus-Hotspot bis zum exportorientierten Mittelstand im Inntal. Wir liefern Webdesign, das so stabil und weithin sichtbar ist wie ein Gipfelsieg – technisch überragend und auf internationales Wachstum ausgelegt.",
        landmarks: ["Goldenes Dachl", "Nordkette", "Arlberg", "Kitzbühel"],
        localProof: "Vom Inntal bis auf die Gletscher – digitale Lösungen auf höchstem Niveau.",
        projectCount: 168,
        heroHeadline: "Performance. <br /><span class=\"text-red-500\">Tirol.</span>",
        heroSubline: "Ihr Gipfelsieg im Netz. High-Speed Webdesign für Tiroler Unternehmen mit Weitblick.",
        introHeadline: "Ihr Partner für Webdesign in Tirol",
        introText: `
            <p class="mb-6">
                In Tirol zählen Ergebnisse, kein langes Gerede. Ihre Website sollte so zuverlässig funktionieren wie Ihr Betrieb. Wir unterstützen Tourismusverbände, Handwerker und Industrieunternehmen in ganz Tirol dabei, digital an die Spitze zu kommen.
            </p>
            <p>
                Egal ob Sie in <strong>Innsbruck</strong>, <strong>Kufstein</strong> oder <strong>Lienz</strong> zu Hause sind: Wir liefern Ihnen Webdesign, das international überzeugt und lokal vertraut wirkt. Mit Fokus auf Tempo und messbare Anfragen.
            </p>
        `,
        aboutHeadline: "Digitale Kompetenz aus dem Herzen der Alpen",
        aboutText: `
            <p class="mb-6">
                Wer hier oben Erfolg haben will, braucht Ausdauer und die richtige Ausrüstung. Das gilt auch für Ihren Webauftritt. Wir setzen auf einen Tech-Stack, der auch bei höchster Last stabil läuft.
            </p>
            <p>
                Wir sind Ihr Partner für <strong>Webdesign Tirol</strong>. Wir optimieren Ihre Seite für Google und KI-Suche, damit Sie genau dann gefunden werden, wenn die Konkurrenz noch im Tal festsitzt.
            </p>
        `,
        aboutSecondaryText: `
            Tiroler Handschlagqualität trifft digitale Innovation. Seit 2019 begleiten wir Unternehmen im Westen Österreichs auf ihrem Weg zum Online-Erfolg. Wir versprechen keine Wunder, wir liefern handfeste technische Exzellenz – ehrlich, direkt und effizient.
        `,
        strategyItems: [
            {
                title: "Gipfelstürmer-SEO",
                text: "Wir bringen Sie ganz nach oben. Mit Strategien, die exakt auf den Tiroler Markt und internationale Benchmarks abgestimmt sind."
            },
            {
                title: "Tourismus-Fokus",
                text: "Maximale Konversion für Gäste aus aller Welt. Intuitive Buchungspfade und atemberaubendes Mobile-Design."
            },
            {
                title: "Stabiles Fundament",
                text: "Wir nutzen Technologien like Next.js for blitzschnelle Ladezeiten und höchste Sicherheit – egal wie viele Besucher kommen."
            }
        ],
        seoFeatures: [
            {
                title: "Mobile Gipfelstürmer",
                text: "Perfekte Performance auf jedem Berg. Unsere Seiten sind extrem leichtgewichtig und auch bei mobilen Daten pfeilschnell."
            },
            {
                title: "Strukturierte Daten",
                text: "Wir sorgen dafür, dass Suchmaschinen und KI-Agenten Ihre Tiroler Dienstleistungen sofort verstehen."
            },
            {
                title: "Regionale Dominanz",
                text: "Gezielte Optimierung für Tiroler Städte und Täler, um lokale Anfragen direkt einzusammeln."
            }
        ],
        aboutFeatures: [
            {
                title: "Klare Prozesse",
                text: "Vom ersten Design bis zum fertigen Produkt – wir arbeiten strukturiert und termintreu."
            },
            {
                title: "Fixpreis-Garantie",
                text: "Ein ehrliches Angebot für ehrliche Arbeit. Keine versteckten Kosten, keine Überraschungen."
            },
            {
                title: "Langfristiger Partner",
                text: "Wir stehen auch nach dem Launch an Ihrer Seite und helfen Ihnen, oben zu bleiben."
            }
        ],
        sectionOrder: ["intro", "seo", "branchen", "portfolio", "process", "pricing", "faq", "contact"]
    },
    "Steiermark": {
        hook: "Innovation",
        introNarrative: "Wo traditionelle Handschlagqualität auf modernste Hochtechnologie trifft: Wir entwickeln Webauftritte für das Innovationsland Österreichs.",
        economicContext: "Vom Grazer Tech-Start-up über den obersteirischen Industriebetrieb bis hin zum Tourismus im Ennstal – die Steiermark ist wirtschaftlich am Puls der Zeit. Wir liefern das digitale Fundament dafür: Webdesign, das so effizient arbeitet wie die steirische Industrie.",
        landmarks: ["Grazer Uhrturm", "Dachstein-Gletscher", "Südsteirische Weinstraße", "Red Bull Ring"],
        localProof: "Von Graz bis Liezen, von Schladming bis Hartberg – wir digitalisieren die grüne Mark.",
        projectCount: 179,
        heroHeadline: "Innovation. <br /><span class=\"text-red-500\">Steiermark.</span>",
        heroSubline: "Blitzschnelles Webdesign für steirische Betriebe. Ohne leere Kilometer, direkt zum Ergebnis.",
        introHeadline: "Ihr Partner für Webdesign in der Steiermark",
        introText: `
            <p class="mb-6">
                Sie suchen eine Webagentur für die Steiermark, die Ihr Unternehmen digital nach vorne bringt? Wir erstellen Webseiten, die nicht nur optisch überzeugen, sondern als echter Vertriebskanal funktionieren.
            </p>
            <p>
                Egal ob Sie in <strong>Graz</strong>, <strong>Leoben</strong> oder <strong>Kapfenberg</strong> ansässig sind: Wir kombinieren technisches Expertenwissen mit einem tiefen Verständnis für den steirischen Markt. Unser Ziel ist Ihr messbarer Erfolg im Netz.
            </p>
        `,
        aboutHeadline: "Digitaler Vorsprung für steirische Unternehmen",
        aboutText: `
            <p class="mb-6">
                In einem Land voller Hidden Champions darf Ihre Website kein Geheimtipp bleiben. Wir optimieren Ihren Auftritt für maximale Sichtbarkeit und Performance.
            </p>
            <p>
                Wir sind Ihr verlässlicher Ansprechpartner für <strong>Webdesign Steiermark</strong>. Wir verstehen die Anforderungen moderner KMUs und liefern Lösungen, die langfristig wachsen – ohne Abo-Fallen oder versteckte Kosten.
            </p>
        `,
        aboutSecondaryText: `
            In einer Welt, die sich ständig wandelt, braucht es Partner, die beständig Qualität liefern. 
            Seit 2019 begleiten wir Unternehmen dabei, ihre digitale Identität zu finden und zu schärfen. 
            Wir glauben an transparente Kommunikation, pixelgenaues Design und technische Exzellenz. 
            Keine leeren Versprechungen, sondern messbare Ergebnisse.
        `,
        strategyItems: [
            {
                title: "Warum wichtig?",
                text: "Die schönste Website nützt Ihnen nichts, wenn sie auf Seite 2 bei Google landet. 90% der Nutzer klicken nur auf die ersten 3 Ergebnisse."
            },
            {
                title: "Was wir tun",
                text: "Wir überlassen nichts dem Zufall. Wir analysieren genau, was Ihre Kunden suchen und bereiten Ihre Daten so auf, dass KI-Modelle wie ChatGPT Sie als beste Antwort empfehlen."
            },
            {
                title: "Ihr Vorteil",
                text: "Sie bekommen nicht nur ein Design, sondern einen 24/7 Vertriebsmitarbeiter. Während andere für teure Werbeanzeigen zahlen müssen, kommen Kunden bei Ihnen organisch auf die Seite."
            }
        ],
        seoFeatures: [
            {
                title: "Solide Technik",
                text: "Google liebt Geschwindigkeit. Wir bauen auf modernster Technologie, die Ladezeiten minimiert und Rankings maximiert."
            },
            {
                title: "Suchmaschinen-Optimierung",
                text: "Wir analysieren nicht nur Suchbegriffe, sondern Kaufabsichten. Damit Sie genau dann gefunden werden, wenn Ihre Kunden bereit sind zu kaufen."
            },
            {
                title: "Zukunftssicher",
                text: "Die Zukunft der Suche ist KI. Wir strukturieren Ihre Daten so, dass ChatGPT & Co. Sie als beste Antwort verstehen und empfehlen."
            }
        ],
        aboutFeatures: [
            {
                title: "Individuelles Design",
                text: "Maßgeschneidert auf Ihre Marke und Zielgruppe."
            },
            {
                title: "SEO-Optimierung",
                text: "Gefunden werden, wo Ihre Kunden suchen."
            },
            {
                title: "Performance",
                text: "Blitzschnelle Ladezeiten für beste Nutzererfahrung."
            }
        ],
        sectionOrder: ["intro", "portfolio", "testimonials", "branchen", "process", "seo", "about", "pricing", "faq", "contact"]
    },
    "Kärnten": {
        hook: "Tourism",
        introNarrative: "Wo Lebensqualität auf wirtschaftliche Stärke trifft: Wir bringen die Kärntner Gastfreundschaft und Professionalität auf den digitalen Bildschirm.",
        economicContext: "Kärnten ist ein Land der Vielfalt – wirtschaftlich wie landschaftlich. Vom Tourismus rund um den Wörthersee bis zum starken Mittelstand im Lavanttal. Wir geben Kärntner Unternehmen die digitale Bühne, die sie verdienen, und sorgen für mehr Sichtbarkeit über die Landesgrenzen hinaus.",
        landmarks: ["Wörthersee", "Pyramidenkogel", "Burg Hochosterwitz", "Großglockner"],
        localProof: "Erfolgreiche Projekte von Klagenfurt bis Hermagor.",
        projectCount: 142,
        heroHeadline: "Sonnenseite. <br /><span class=\"text-red-500\">Kärnten.</span>",
        heroSubline: "Hochwertiges Webdesign für Kärntner Betriebe. Wir machen Ihren Erfolg digital sichtbar.",
        introHeadline: "Webdesign Agentur für Kärnten",
        introText: `
            <p class="mb-6">
                Egal ob Sie eine Pension am See führen, einen Handwerksbetrieb in Villach leiten oder ein Start-up in Klagenfurt aufbauen: Ein moderner Webauftritt ist Ihr wichtigster Vertriebskanal. Wir erstellen Webseiten, die Kunden emotional abholen und faktisch überzeugen.
            </p>
            <p>
                Wir verstehen die Kärntner Mentalität und kombinieren sie mit technischer Präzision. Wir begleiten Unternehmen in <strong>Klagenfurt</strong>, <strong>Villach</strong>, <strong>Spittal</strong> und Wolfsberg auf dem Weg zur digitalen Marktführerschaft.
            </p>
        `,
        aboutHeadline: "Partnerschaft auf Augenhöhe für Kärntner KMUs",
        aboutText: `
            <p class="mb-6">
                Webdesign ist Vertrauenssache. Wir setzen auf langfristige Zusammenarbeit und echte Ergebnisse. Keine komplizierten Klauseln, sondern transparente Lösungen, die funktionieren.
            </p>
            <p>
                Wir sind Ihr Partner für <strong>Webdesign Kärnten</strong>. Mit Fokus auf lokale Suchmaschinenoptimierung sorgen wir dafür, dass Sie genau dann gefunden werden, wenn Kunden in der Region nach Ihren Leistungen suchen.
            </p>
        `,
        aboutSecondaryText: `
            Kärntner Betriebe zeichnen sich durch Qualität und Verlässlichkeit aus. Das ist auch unser Anspruch. Seit 2019 unterstützen wir Unternehmen im Süden Österreichs dabei, ihre PS digital auf die Straße zu bringen – mit Design, das begeistert und Technik, die hält.
        `,
        strategyItems: [
            {
                title: "Regionale Relevanz",
                text: "Wir optimieren Ihre Seite so, dass Sie in Kärnten und Umgebung für die richtigen Suchbegriffe ganz oben erscheinen."
            },
            {
                title: "Tourismus-Turbo",
                text: "Speziell für Gastronomie und Hotellerie: Wir integrieren Buchungstools und emotionale Bildwelten für mehr Gäste."
            },
            {
                title: "Mobile First",
                text: "In Urlaubsregionen suchen Kunden oft von unterwegs. Wir garantieren perfekte Darstellung auf jedem Smartphone."
            }
        ],
        seoFeatures: [
            {
                title: "Sichtbarkeit am Markt",
                text: "Durch strategisches SEO sorgen wir dafür, dass Ihre Kärntner Kunden Sie nicht erst suchen müssen."
            },
            {
                title: "Strukturierte Daten",
                text: "Wir bereiten Ihre Inhalte so auf, dass Suchmaschinen alle wichtigen Infos sofort erfassen und positiv bewerten."
            },
            {
                title: "Zukunftssicherheit",
                text: "Unsere Technik wächst mit Ihren Anforderungen mit – flexibel, sicher und immer auf dem neuesten Stand."
            }
        ],
        aboutFeatures: [
            {
                title: "Einfache Bedienung",
                text: "Auf Wunsch pflegen Sie Inhalte später ganz einfach selbst – wir zeigen Ihnen wie."
            },
            {
                title: "Kein Risiko",
                text: "Zahlung erst bei Zufriedenheit. Ein faires Modell für faire Partner."
            },
            {
                title: "Persönliche Note",
                text: "Individualität statt Baukasten – wir fangen den Charakter Ihres Kärntner Betriebs ein."
            }
        ],
        sectionOrder: ["intro", "about", "portfolio", "branchen", "process", "testimonials", "faq", "contact"]
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
        introNarrative: "Schaffen, nicht nur reden. In Vorarlberg zählen Fakten und Präzision. Wir entwickeln Webseiten für Unternehmen im Ländle, die Weltmarktführung digital sichtbar machen.",
        economicContext: "Vorarlberg ist ein Hub für Hochtechnologie und modernes Handwerk. Vom innovativen KMU im Rheintal bis zum Tourismus-Pionier im Montafon. Unsere Websites sind wie Vorarlberger Architektur: Klar, funktional und bis ins letzte Detail perfekt durchdacht.",
        landmarks: ["Bregenzer Festspiele", "Karren", "Silvretta", "Arlberg"],
        localProof: "Vom Bodensee bis ins Montafon – digitales Handwerk für Vorarlberg.",
        projectCount: 145,
        heroHeadline: "Präzision. <br /><span class=\"text-red-500\">Vorarlberg.</span>",
        heroSubline: "Digitale Exzellenz für das Ländle. Webdesign, das so präzise arbeitet wie Ihre Fertigung.",
        introHeadline: "Ihre Webagentur für Vorarlberg",
        introText: `
            <p class="mb-6">
                Wer im Ländle erfolgreich sein will, muss Qualität liefern. Ihre Website ist das Aushängeschild Ihres Erfolgs. Wir unterstützen Vorarlberger Traditionsbetriebe und Tech-Startups dabei, ihre Stärken digital auf den Punkt zu bringen.
            </p>
            <p>
                Ob Sie in <strong>Bregenz</strong>, <strong>Dornbirn</strong> oder <strong>Feldkirch</strong> ansässig sind: Wir bieten Ihnen Webdesign, das den Vorarlberger Spirit von Fleiß und Innovation atmet. Mit Fokus auf höchste technische Standards und regionale Relevanz.
            </p>
        `,
        aboutHeadline: "Digitaler Vorsprung durch Ländle-Präzision",
        aboutText: `
            <p class="mb-6">
                Vorarlberger Produkte sind weltweit gefragt. Ein digitaler Auftritt muss diesen Standard halten können. Wir bauen Webseiten, die nicht nur modern aussehen, sondern als hocheffiziente Werkzeuge für Ihr Wachstum dienen.
            </p>
            <p>
                Wir sind Ihr Partner für <strong>Webdesign Vorarlberg</strong>. Wir sorgen dafür, dass Ihr Unternehmen online genau die Wertigkeit ausstrahlt, die Ihre Kunden von Ihnen gewohnt sind – überall und jederzeit.
            </p>
        `,
        aboutSecondaryText: `
            Das Ländle steht für 'Schaffen'. Das ist auch unser Motto. Seit 2019 begleiten wir Vorarlberger Unternehmen dabei, ihre digitale Präsenz zu perfektionieren. Wir setzen auf klare Kante, modernste Technik und eine Zusammenarbeit auf Augenhöhe.
        `,
        strategyItems: [
            {
                title: "Effizienz-Prinzip",
                text: "Kein Ballast, keine Spielereien. Wir fokussieren uns auf das, was Ihr Vorarlberger Unternehmen wirklich weiterbringt: Performance und Anfragen."
            },
            {
                title: "Zukunftsorientiert",
                text: "Wir nutzen modernste Schnittstellen und KI-optimierte Datenstrukturen, damit Ihre Website auch morgen noch an der Spitze des Marktes steht."
            },
            {
                title: "Qualitätssicherung",
                text: "Pixelgenaues Design und fehlerfreier Code sind für uns Standard. Wir prüfen jedes Detail, bevor wir live gehen."
            }
        ],
        seoFeatures: [
            {
                title: "Lokale Autorität",
                text: "Wir stärken Ihre Sichtbarkeit im Rheintal und darüber hinaus, damit Sie zum digitalen Marktführer in Ihrer Nische werden."
            },
            {
                title: "Next-Gen SEO",
                text: "Gezielte Integration von semantischen Suchbegriffen, die Ihre Kunden in Vorarlberg wirklich verwenden."
            },
            {
                title: "KI-Empfehlungen",
                text: "Ihre Daten werden so strukturiert, dass ChatGPT und Co. Ihr Unternehmen als Top-Empfehlung im Ländle ausgeben."
            }
        ],
        aboutFeatures: [
            {
                title: "Bodenständige Werte",
                text: "Ehrliche Kommunikation und verlässliche Ergebnisse ohne Agentur-Fachchinesisch."
            },
            {
                title: "High-End Technologie",
                text: "Wir bauen auf Next.js für maximale Sicherheit und unschlagbare Geschwindigkeit."
            },
            {
                title: "Direkter Kontakt",
                text: "Kurze Wege, schnelle Entscheidungen. Wir arbeiten so effizient wie Ihr Team."
            }
        ],
        sectionOrder: ["intro", "process", "branchen", "portfolio", "about", "seo", "faq", "contact"]
    },
};
