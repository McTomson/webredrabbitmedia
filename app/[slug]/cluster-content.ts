
import { CityCluster } from "./cities";

interface ClusterContent {
    hero: {
        headline: (city: string) => string;
        subline: (city: string) => string;
    };
    intro: {
        headline: (city: string) => string;
        text: (city: string) => string;
    };
    process: {
        headline: string;
        text: string;
        steps: {
            title: string;
            description: string;
            highlight: string;
        }[];
        benefits: {
            title: string;
            description: string;
            highlight: string;
            redText: string;
        }[];
    };
    portfolio: {
        headline: string;
        text: (city: string) => string;
    };
    seo: {
        headline: string;
        subline: string;
        strategyHeadline: string;
        comparisonHeadline: (city: string) => string;
        features: {
            title: string;
            text: (city: string) => string;
        }[];
        strategyItems: {
            title: string;
            text: string;
        }[];
        comparisonItems: {
            name: string;
            other: string;
            us: string;
        }[];
    };
    about: {
        headline: string;
        text: string;
        testimonialsHeadline: (city: string) => string;
        features: {
            title: string;
            text: string;
        }[];
        testimonials: {
            stars: string;
            rating: string;
            quote: string;
            author: string;
            company: string;
            avatar: string;
        }[];
    };
    faq: {
        headline: (city: string) => string;
        subline: (city: string, region: string) => string;
        questions: {
            question: (city: string) => string;
            answer: (city: string, region: string) => string;
        }[];
    };
    contact: {
        headline: string;
        subline: (city: string) => string;
    };
}

export const clusterContent: Record<CityCluster, ClusterContent> = {
    metropolis: {
        hero: {
            headline: (city) => `Webvorsprung für ${city}.`,
            subline: (city) => `High-Performance Webdesign für den Wettbewerb in ${city}. Schneller, sicherer und konvertierungsstark.`
        },
        intro: {
            headline: (city) => `Erfolg ist in ${city} kein Zufall.`,
            text: (city) => `In der Wirtschaftsregion ${city} entscheiden Sekunden über den Kundenkontakt. Wir liefern keine Standard-Lösungen, sondern digitale Performance-Systeme. Technologisch führend und speziell für den Wettbewerb in ${city} entwickelt.`
        },
        process: {
            headline: "Effizienz statt Bürokratie.",
            text: "Ihr Unternehmen in braucht Lösungen, keine Meetings. Wir arbeiten rein digital, datenbasiert und mit vollem Fokus auf Ihren wirtschaftlichen Erfolg.",
            steps: [
                { title: "Smartes Briefing", description: "Vergessen Sie lange Vorgespräche. Unser digitaler Onboarding-Prozess in 2 Minuten klärt alle Anforderungen präzise.", highlight: "2 Minuten" },
                { title: "Marktanalyse & Konzept", description: "Wir analysieren Ihre Mitbewerber in der Region und erstellen in 7 Tagen einen Strategie-Entwurf, der Sie abhebt.", highlight: "Datengestützt" },
                { title: "Entscheidung ohne Risiko", description: "Sie sehen das Ergebnis, bevor Sie zahlen. Gefällt Ihnen der Entwurf nicht? Kein Cent Kosten für Sie.", highlight: "Risikofrei" }
            ],
            benefits: [
                { title: "Asynchron & Schnell", description: "Keine Zeitverschwendung durch Termine. Wir kommunizieren effizient und dokumentiert.", highlight: "Fokus", redText: "100% Digital" },
                { title: "Full-Service", description: "Vom Hosting bis zum Text: Wir liefern das komplette Paket schlüsselfertig.", highlight: "Komplett", redText: "Alles in einem" },
                { title: "Datenschutz First", description: "Rechtssicherheit nach aktuellen Standards. Ihre Daten bleiben in Europa.", highlight: "Sicher", redText: "DSGVO Safe" },
                { title: "Investitionsschutz", description: "Unsere Tech-Stacks sind wartungsarm und skalieren mit Ihrem Wachstum mit.", highlight: "Skalierbar", redText: "Zukunftssicher" }
            ]
        },
        portfolio: {
            headline: "Nachweisbarer Erfolg.",
            text: (city) => `Beispiele für digitale Transformationen, die wir in ${city} und Umgebung realisiert haben.`
        },
        seo: {
            headline: "Sichtbarkeit ist die Währung.",
            subline: "Top-Rankings sind kein Glück, sondern Mathematik. Wir optimieren Code und Content so, dass Suchmaschinen Ihr Angebot als die relevanteste Antwort der Region identifizieren.",
            strategyHeadline: "Warum 'Dabei sein' nicht mehr reicht.",
            comparisonHeadline: (city) => `Der Unterschied: Agentur vs. Performance-Partner in ${city}.`,
            features: [
                { title: "Speed Architecture", text: (city) => `Ladezeiten im Millisekunden-Bereich. Google belohnt Geschwindigkeit – besonders in kompetitiven Märkten wie ${city}.` },
                { title: "Semantische Suche", text: (city) => `Wir optimieren nicht nur auf Keywords, sondern auf Suchintention. So finden Sie genau die Kunden in ${city}, die kaufen wollen.` },
                { title: "AI-Ready Data", text: (city) => `Strukturierte Daten sorgen dafür, dass KI-Assistenten Ihr Geschäft verstehen und aktiv empfehlen.` }
            ],
            strategyItems: [
                { title: "Die Realität", text: "Die meisten Websites in Ihrer Branche sind digitale Visitenkarten ohne Motor. Sie sehen nett aus, werden aber nicht gefunden." },
                { title: "Unsere Lösung", text: "Wir drehen den Spieß um: Zuerst die technische Auffindbarkeit und Conversion-Strategie, dann das Design. Form follows Function." },
                { title: "Das Ergebnis", text: "Ein digitaler Vertriebskanal, der unabhängig von Öffnungszeiten qualifizierte Anfragen generiert und Ihren Umsatz steigert." }
            ],
            comparisonItems: [
                { name: "Basis-Technologie", other: "Baukasten / Wordpress", us: "Next.js & React" },
                { name: "Lade-Geschwindigkeit", other: "Durchschnitt (>2s)", us: "Extrem (<0.5s)" },
                { name: "Such-Strategie", other: "Keywords", us: "Topical Authority" },
                { name: "Kostenmodell", other: "Stunden / Unklar", us: "Fixpreis" },
                { name: "Zukunftsfähigkeit", other: "Gering", us: "AI-Native" }
            ]
        },
        about: {
            headline: "Digitale Exzellenz für Ihren Markt",
            text: "Erfahrung trifft auf Innovation. Wir sind keine klassische Werbeagentur, sondern ein Technologie-Partner für Unternehmen, die messbares Wachstum wollen.",
            testimonialsHeadline: (city) => `Feedback von Leistungsträgern in ${city}`,
            features: [
                { title: "Klarheit statt Floskeln", text: "Wir versprechen keine Wunder, wir liefern Daten und Ergebnisse." },
                { title: "Enterprise Technologie", text: "Wir nutzen denselben Tech-Stack wie Netflix oder Uber – für Ihren Erfolg." },
                { title: "Kompromisslose Qualität", text: "Jedes Pixel, jede Zeile Code wird geprüft. Perfektion ist unser Anspruch." }
            ],
            testimonials: [
                {
                    stars: "⭐️⭐️⭐️⭐️⭐️",
                    rating: "5/5",
                    quote: "\"Die Zusammenarbeit war erfrischend effizient. Kein Vertriebs-Geplänkel, sondern Fakten und schnelle Umsetzung. Das Ergebnis spricht für sich.\"",
                    author: "Daniel W.",
                    company: "Sanitärtechnik",
                    avatar: "👨‍🔧"
                },
                {
                    stars: "⭐️⭐️⭐️⭐️⭐️",
                    rating: "5/5",
                    quote: "\"Wir waren skeptisch wegen 'keine Meetings', aber es war die beste Entscheidung. Das Projekt lief deutlich reibungsloser als mit unserer alten Agentur.\"",
                    author: "Stefan H.",
                    company: "Elektroanlagen",
                    avatar: "👨‍💻"
                },
                {
                    stars: "⭐️⭐️⭐️⭐️",
                    rating: "4/5",
                    quote: "\"Endlich eine Website, die uns auch technisch gehört und performt. Seit dem Relaunch haben sich unsere Anfragen über Google verdoppelt.\"",
                    author: "Ali K.",
                    company: "Bauunternehmen",
                    avatar: "👷‍♂️"
                }
            ]
        },
        faq: {
            headline: (city) => `Antworten für ${city}`,
            subline: (city, region) => `Konkrete Fakten für Entscheider in ${city} und ${region}.`,
            questions: [
                {
                    question: (city) => `Gibt es versteckte Kosten bei Projekten in ${city}?`,
                    answer: (city, region) => `Definitiv nicht. Unser Angebot ist ein Pauschalpreis. Beratung, Design, Entwicklung und der Launch in ${city} sind inkludiert. Sie behalten volle Kostensicherheit.`
                },
                {
                    question: (city) => `Warum sollte ich mich in ${city} für euch entscheiden?`,
                    answer: (city, region) => `Weil wir nicht nur "hübsch" machen, sondern "erfolgreich". Wir kennen den Wettbewerb in ${city} und statten Sie mit der Technologie aus, um diesen digital zu überholen.`
                },
                {
                    question: (city) => `Macht ihr Fotos bei uns vor Ort in ${city}?`,
                    answer: (city, region) => `Wir konzentrieren uns auf das Webdesign. Für High-End Fotografie in ${city} empfehlen wir spezialisierte Partner oder nutzen Ihr bestehendes Material bestmöglich.`
                },
                {
                    question: (city) => `Referenzen in ${city}?`,
                    answer: (city, region) => `Wir arbeiten mit diversen Branchen in ${region} zusammen. Die Anforderungen in ${city} an Professionalität und Speed sind uns bestens vertraut.`
                },
                {
                    question: (city) => `Wie funktioniert die Abstimmung ohne Meetings?`,
                    answer: (city, region) => `Besser als Sie denken. Durch präzise Formulare und direkten Chat/Mail-Support entfallen Wartezeiten und Anfahrten im ${city}er Verkehr. Wir arbeiten dann, wenn Sie Zeit haben.`
                },
                {
                    question: (city) => `Ist die Seite fit für den Markt in ${city}?`,
                    answer: (city, region) => `Ja. Wir optimieren spezifisch auf lokale Suchanfragen ("Local SEO") für ${city}, damit Sie genau dort sichtbar sind, wo Ihre Kunden suchen.`
                }
            ]
        },
        contact: {
            headline: "Bereit zu skalieren?",
            subline: (city) => `Starten Sie jetzt Ihr Projekt in ${city}. Kein Risiko, maximale Effizienz. In 7 Tagen online.`
        }
    },

    salzburg: {
        hero: {
            headline: (city) => `Stilvolles Webdesign für ${city}.`,
            subline: (city) => `Zeigen Sie sich von Ihrer besten Seite. Digitaler Auftritt mit Salzburger Charme und internationaler Klasse.`
        },
        intro: {
            headline: (city) => `Tradition trifft Moderne.`,
            text: (city) => `In ${city} hat Qualität Tradition. Das gilt auch im Internet. Wir bauen Websites, die Ihre Werte widerspiegeln: Elegant, beständig und offen für die Welt.`
        },
        process: {
            headline: "Klar und Durchdacht.",
            text: "Wir nehmen uns Zeit, Sie zu verstehen. Wie ein Maßschneider entwickeln wir eine Lösung, die perfekt zu Ihnen passt.",
            steps: [
                { title: "Zuhören", description: "Wir wollen wissen, was Ihr Geschäft ausmacht. Bei einer Melange oder digital.", highlight: "Persönlich" },
                { title: "Gestalten", description: "Wir entwerfen ein Design, das Ihre Handschrift trägt. Unverwechselbar und stilvoll.", highlight: "Individuell" },
                { title: "Veröffentlichen", description: "Wir kümmern uns um den Start. Damit Sie sofort glänzen können.", highlight: "Sorglos" }
            ],
            benefits: [
                { title: "International", description: "Wir übersetzen Ihre Seite für Gäste aus aller Welt.", highlight: "Weltweit", redText: "Mehrsprachig" },
                { title: "Ästhetisch", description: "Design, das dem Ruf der Kulturstadt gerecht wird.", highlight: "Schön", redText: "Premium Design" },
                { title: "Einfach", description: "Technik, die funktioniert. Ohne, dass Sie sich darum kümmern müssen.", highlight: "Simpel", redText: "0 Stress" },
                { title: "Gefunden werden", description: "Wir bringen Sie in Google nach vorne. Bei lokalen und internationalen Suchanfragen.", highlight: "Sichtbar", redText: "Top Ranking" }
            ]
        },
        portfolio: {
            headline: "Ausgewählte Referenzen.",
            text: (city) => `Unternehmen in ${city}, die auf Qualität setzen.`
        },
        seo: {
            headline: "Sichtbarkeit mit Niveau.",
            subline: "Wir sorgen dafür, dass Sie von den richtigen Menschen gefunden werden. Mit einer Strategie, die auf Qualität statt Masse setzt.",
            strategyHeadline: "Warum 'Gut' in Salzburg nicht reicht.",
            comparisonHeadline: (city) => `Der Qualitäts-Unterschied für ${city}.`,
            features: [
                { title: "Mehrsprachigkeit", text: (city) => `Salzburg ist international. Wir sorgen dafür, dass Google Ihre Seite in allen Sprachen richtig einordnet.` },
                { title: "Bildsprache", text: (city) => `Bilder sagen mehr als 1000 Worte. Wir optimieren Ihre Fotos für maximale Wirkung und schnelle Ladezeiten.` },
                { title: "Lokale Exzellenz", text: (city) => `Wir stärken Ihren Ruf in der Region. Damit Sie die erste Wahl für anspruchsvolle Kunden sind.` }
            ],
            strategyItems: [
                { title: "Der Anspruch", text: "Ihre Kunden erwarten Perfektion. Eine langsame oder unübersichtliche Website passt nicht zu Ihrem Angebot." },
                { title: "Unsere Antwort", text: "Technische Perfektion im Hintergrund, elegante Optik im Vordergrund. So wie es sein soll." },
                { title: "Der Nutzen", text: "Sie gewinnen Kunden, die Qualität zu schätzen wissen. Und sparen Zeit durch digitale Prozesse." }
            ],
            comparisonItems: [
                { name: "Design", other: "Massenware", us: "Handverlesen" },
                { name: "Sprachen", other: "Automatisch", us: "Professionell" },
                { name: "Technik", other: "Veraltet", us: "State-of-the-Art" },
                { name: "Anspruch", other: "Mittelmaß", us: "Exzellenz" },
                { name: "Service", other: "Callcenter", us: "Persönlich" }
            ]
        },
        about: {
            headline: "Wir verstehen Qualität",
            text: "Wir sind keine laute Werbeagentur. Wir sind Handwerker des Digitalen. Wir lieben schöne Dinge und saubere Arbeit. Genau wie Sie.",
            testimonialsHeadline: (city) => `Was Salzburger Unternehmer sagen`,
            features: [
                { title: "Stilvoll", text: "Design, das nicht schreit, sondern überzeugt." },
                { title: "Diskret", text: "Wir arbeiten im Hintergrund für Ihren Erfolg." },
                { title: "Langfristig", text: "Wir suchen Partnerschaften, keine schnellen Geschäfte." }
            ],
            testimonials: [
                {
                    stars: "⭐️⭐️⭐️⭐️⭐️",
                    rating: "5/5",
                    quote: "\"Endlich ein Partner, der unseren Anspruch an Ästhetik versteht. Die Zusammenarbeit war äußerst angenehm.\"",
                    author: "Dr. Richard H.",
                    company: "Privatklinik",
                    avatar: "👨‍⚕️"
                },
                {
                    stars: "⭐️⭐️⭐️⭐️⭐️",
                    rating: "5/5",
                    quote: "\"Unsere internationalen Gäste loben die neue Website. Übersichtlich, schnell und wunderschön.\"",
                    author: "Katharina M.",
                    company: "Boutique Hotel",
                    avatar: "🏨"
                },
                {
                    stars: "⭐️⭐️⭐️⭐️",
                    rating: "4/5",
                    quote: "\"Kompetent und zuverlässig. Die Umsetzung erfolgte pünktlich zu den Festspielen.\"",
                    author: "Alexander P.",
                    company: "Kulturbetrieb",
                    avatar: "🎻"
                }
            ]
        },
        faq: {
            headline: (city) => `Fragen aus ${city}`,
            subline: (city, region) => `Antworten für anspruchsvolle Unternehmer aus ${city}.`,
            questions: [
                {
                    question: (city) => `Können Sie auch mehrsprachige Seiten erstellen?`,
                    answer: (city, region) => `Ja, das ist eine unserer Spezialitäten. Wir richten Ihre Seite so ein, dass sie perfekt auf Deutsch, Englisch und bei Bedarf in weiteren Sprachen funktioniert.`
                },
                {
                    question: (city) => `Haben Sie Erfahrung mit Tourismus/Kultur?`,
                    answer: (city, region) => `Ja. Wir wissen, dass in ${city} oft besondere Anforderungen gelten. Buchungssysteme, Veranstaltungskalender oder hochauflösende Galerien sind für uns Standard.`
                },
                {
                    question: (city) => `Wie läuft die Betreuung ab?`,
                    answer: (city, region) => `Wir sind Ihr langfristiger Partner. Wenn Sie Änderungen wünschen oder neue Ideen haben, sind wir nur einen Anruf entfernt.`
                }
            ]
        },
        contact: {
            headline: "Starten wir gemeinsam.",
            subline: (city) => `Ein unverbindliches Gespräch über Ihre Ziele in ${city}. Diskret und professionell.`
        }
    },
    tourism: {
        hero: {
            headline: (city) => `Mehr Gäste für ${city}.`,
            subline: (city) => `Websites, die Urlaubsfreude wecken. Perfekt inszeniert für Besucher in ${city} – am Handy und am Desktop.`
        },
        intro: {
            headline: (city) => `Der erste Eindruck zählt.`,
            text: (city) => `${city} lebt vom Tourismus. Ihre Website ist oft der erste Kontakt mit dem Gast. Wir sorgen dafür, dass dieser Moment sitzt – und aus Besuchern echte Gäste werden.`
        },
        process: {
            headline: "Einladend und Einfach.",
            text: "Wir machen keine technische Wissenschaft daraus. Wir wollen wissen, was Ihr Haus besonders macht. Den Rest erledigen wir.",
            steps: [
                { title: "Ihre Geschichte", description: "Erzählen Sie uns, was Ihre Gäste an Ihnen schätzen. Wir hören zu.", highlight: "Persönlich" },
                { title: "Gestaltung", description: "Wir entwerfen eine Seite, die Lust auf Urlaub macht. Mit viel Platz für schöne Bilder.", highlight: "Kreativ" },
                { title: "Online Start", description: "Pünktlich zur Saison sind Sie bereit. Buchbar auf allen Geräten.", highlight: "Pünktlich" }
            ],
            benefits: [
                { title: "Zeitsparend", description: "Sie kümmern sich um die Gäste, wir uns um die Technik.", highlight: "Entlastung", redText: "Weniger Arbeit" },
                { title: "Mehr Buchungen", description: "Eine Seite, die verkauft. Einfach zu finden, einfach zu buchen.", highlight: "Umsatz", redText: "Voll belegt" },
                { title: "Perfekt am Handy", description: "80% der Gäste schauen am Smartphone. Ihre Seite sieht dort top aus.", highlight: "Mobil", redText: "100% Mobil" },
                { title: "International", description: "Bereit für Gäste aus aller Welt. Wir richten Sprachen sauber ein.", highlight: "Global", redText: "Mehrsprachig" }
            ]
        },
        portfolio: {
            headline: "Bilder, die überzeugen.",
            text: (city) => `Erfolgreiche Betriebe aus ${city} vertrauen auf uns.`
        },
        seo: {
            headline: "Gefunden werden von Gästen.",
            subline: "Gäste suchen oft spontan und mobil. Wir sorgen dafür, dass Sie in den Suchergebnissen ganz oben stehen, wenn jemand nach Urlaub in Ihrer Region sucht.",
            strategyHeadline: "Warum eine schöne Seite alleine nicht reicht.",
            comparisonHeadline: (city) => `Der Unterschied für ${city}.`,
            features: [
                { title: "Handy-Optimierung", text: (city) => `Gäste buchen am Handy. Wir garantieren einfache Bedienung für ${city} Besucher.` },
                { title: "Bild-Optimierung", text: (city) => `Große Bilder, die trotzdem schnell laden. Google liebt das – und Ihre Gäste auch.` },
                { title: "Internationale Suche", text: (city) => `Wir strukturieren Ihre Seite so, dass auch Gäste aus dem Ausland Sie in ${city} finden.` }
            ],
            strategyItems: [
                { title: "Wichtig", text: "Gäste entscheiden emotional. Wenn die Seite langsam ist oder am Handy nervt, buchen sie woanders." },
                { title: "Unsere Lösung", text: "Wir machen es dem Gast einfach. Schnelle Ladezeiten, klare knöpfe, direkte Buchungsmöglichkeit." },
                { title: "Ihr Vorteil", text: "Mehr Direktbuchungen über die eigene Seite. Weniger Provision an große Buchungsportale zahlen." }
            ],
            comparisonItems: [
                { name: "Design", other: "Standard Vorlage", us: "Maßgeschneidert" },
                { name: "Handy", other: "Oft fehlerhaft", us: "Perfekte Bedienung" },
                { name: "Bilder", other: "Laden langsam", us: "Laden sofort" },
                { name: "Inhalt", other: "Textwüsten", us: "Urlaubsgefühle" },
                { name: "Service", other: "Anonym", us: "Persönlich" }
            ]
        },
        about: {
            headline: "Wir zeigen Ihre Schokoladenseite",
            text: "Webdesign ist wie Gastfreundschaft im Internet. Wir sorgen dafür, dass sich der Gast schon auf der Website wohlfühlt. Mit 15 Jahren Erfahrung im Tourismus-Marketing.",
            testimonialsHeadline: (city) => `Erfahrungen aus ${city}`,
            features: [
                { title: "Gefühlvoll", text: "Design, das die Stimmung Ihres Hauses einfängt." },
                { title: "Gäste-Verständnis", text: "Wir wissen, wonach Urlauber suchen." },
                { title: "Rundum-Service", text: "Fotos, Texte, Technik. Wir kümmern uns um alles." }
            ],
            testimonials: [
                {
                    stars: "⭐️⭐️⭐️⭐️⭐️",
                    rating: "5/5",
                    quote: "\"Endlich eine Website, die unsere Gäste begeistert. Die Buchungen sind seit dem Neustart spürbar gestiegen.\"",
                    author: "Maria S.",
                    company: "Hotel & Gastronomie",
                    avatar: "👩‍🍳"
                },
                {
                    stars: "⭐️⭐️⭐️⭐️⭐️",
                    rating: "5/5",
                    quote: "\"Professionell, kreativ und verlässlich. Genau das, was wir gesucht haben. Danke für die Geduld!\"",
                    author: "Thomas K.",
                    company: "Tourismusverband",
                    avatar: "🏔️"
                },
                {
                    stars: "⭐️⭐️⭐️⭐️",
                    rating: "4/5",
                    quote: "\"Super Zusammenarbeit. Unsere Ferienwohnungen sind jetzt am Handy viel einfacher zu buchen.\"",
                    author: "Lisa M.",
                    company: "Ferienwohnungen",
                    avatar: "🏠"
                }
            ]
        },
        faq: {
            headline: (city) => `Häufige Fragen aus ${city}`,
            subline: (city, region) => `Antworten für Tourismusbetriebe aus ${city} und ${region}.`,
            questions: [
                {
                    question: (city) => `Können wir Texte selbst ändern?`,
                    answer: (city, region) => `Ja, absolut. Wir zeigen Ihnen, wie Sie aktuelle Angebote oder Öffnungszeiten ganz einfach selbst anpassen. Ohne Techniker.`
                },
                {
                    question: (city) => `Wie lange dauert das?`,
                    answer: (city, region) => `Meistens sind wir in 2-4 Wochen fertig. Wir schauen, dass wir rechtzeitig vor der Saison online sind.`
                },
                {
                    question: (city) => `Helfen Sie bei der Bildauswahl?`,
                    answer: (city, region) => `Ja. Bilder sind im Tourismus das Wichtigste. Wir helfen bei der Auswahl oder vermitteln Fotografen in ${city}.`
                }
            ]
        },
        contact: {
            headline: "Zeit für etwas Neues?",
            subline: (city) => `Lassen Sie uns gemeinsam mehr Gäste für ${city} begeistern. Unverbindlich anfragen.`
        }
    },
    regional: {
        hero: {
            headline: (city) => `Webvorsprung für ${city}.`,
            subline: (city) => `Webdesign mit Handschlagqualität für ${city}. Digitale Lösungen, die Vertrauen schaffen.`
        },
        intro: {
            headline: (city) => `Digital präsent, persönlich verankert.`,
            text: (city) => `In ${city} kennt man sich. Ein guter Ruf ist alles. Wir bauen Websites, die Ihre persönliche Integrität ins Digitale übertragen: Ehrlich, sauber, verlässlich.`
        },
        process: {
            headline: "Persönlich und Verlässlich.",
            text: "Wir sprechen kein 'Fachchinesisch'. Wir setzen uns zusammen, hören zu und setzen genau das um, was Sie brauchen. Pünktlich und im Budget.",
            steps: [
                { title: "Kennenlernen", description: "Wir reden über Ihre Ziele. Verständlich und auf Augenhöhe.", highlight: "Persönlich" },
                { title: "Umsetzung", description: "Wir bauen Ihre Seite. Handwerklich sauber und ohne Fehler.", highlight: "Solide" },
                { title: "Betreuung", description: "Auch nach dem Start lassen wir Sie nicht allein. Wir kümmern uns.", highlight: "Verlässlich" }
            ],
            benefits: [
                {
                    title: "Keine Meetings",
                    description: "Alles läuft digital ab. Du sparst Zeit.",
                    highlight: "Digital",
                    redText: "2 Minuten"
                },
                {
                    title: "Kein Aufwand",
                    description: "Du machst nichts. Wir kümmern uns um alles.",
                    highlight: "Entspannt",
                    redText: "0 Aufwand"
                },
                {
                    title: "Sicher",
                    description: "100% DSGVO-konform. Deine Daten sind sicher.",
                    highlight: "DSGVO",
                    redText: "100% Sicher"
                },
                {
                    title: "Professionell",
                    description: "Deine Website ist in 7 Tagen fertig.",
                    highlight: "Schnell",
                    redText: "7 Tage"
                }
            ]
        },
        portfolio: {
            headline: "Ergebnisse, die zählen.",
            text: (city) => `Design aus Österreich für den höchsten Anspruch in ${city}.`
        },
        seo: {
            headline: "Top-Rankings ohne Kompromisse",
            subline: "Wir optimieren Ihre Website für Google und die neue Generation der AI-Suche. Damit Sie gefunden werden.",
            strategyHeadline: "Unser 3-Schritte Plan",
            comparisonHeadline: (city) => `Warum ${city}er Unternehmen uns wählen`,
            features: [
                { title: "Technisches Fundament", text: (city) => `Google liebt Geschwindigkeit. Wir bauen auf modernster Technologie, die Ladezeiten minimiert und Rankings maximiert.` },
                { title: "Strategische SEO", text: (city) => `Wir analysieren nicht nur Keywords, sondern Kaufabsichten. Damit du genau dann gefunden wirst, wenn deine Kunden bereit sind zu kaufen.` },
                { title: "AI & LLM Ready", text: (city) => `Die Zukunft der Suche ist KI. Wir strukturieren deine Daten so, dass ChatGPT & Co. dich als beste Antwort verstehen und empfehlen.` }
            ],
            strategyItems: [
                { title: "Warum wichtig?", text: "Die schönste Website nützt Ihnen nichts, wenn sie auf Seite 2 bei Google landet. 90% der Nutzer klicken nur auf die ersten 3 Ergebnisse." },
                { title: "Was wir tun", text: "Wir überlassen nichts dem Zufall. Wir analysieren genau, was Ihre Kunden suchen und bereiten Ihre Daten so auf, dass KI-Modelle wie ChatGPT Sie als beste Antwort empfehlen." },
                { title: "Ihr Vorteil", text: "Sie bekommen nicht nur ein Design, sondern einen 24/7 Vertriebsmitarbeiter. Während andere für teure Werbeanzeigen zahlen müssen, kommen Kunden bei Ihnen organisch auf die Seite." }
            ],
            comparisonItems: [
                { name: "Design", other: "Standard Template", us: "Premium Custom" },
                { name: "SEO Basics", other: "Extra Kosten", us: "Inklusive" },
                { name: "Ladezeit", other: "Oft langsam", us: "High-Speed" },
                { name: "AI-Ready", other: "Nicht vorhanden", us: "Standard" },
                { name: "Kosten", other: "Intransparent", us: "Fixpreis" }
            ]
        },
        about: {
            headline: "Über Red Rabbit Media",
            text: "Wir entwickeln professionelle Websites, die Ihr Unternehmen online erfolgreich machen. Mit über 15 Jahren Erfahrung verstehen wir, was Ihre Kunden erwarten und wie Sie online überzeugen.",
            testimonialsHeadline: (city) => `Kundenstimmen aus der Region ${city}`,
            features: [
                { title: "Transparente Preise", text: "Keine versteckten Kosten - Sie wissen von Anfang an, was Ihre Website kostet." },
                { title: "Strategisch durchdacht", text: "Jede Website wird so konzipiert, dass sie Ihre Geschäftsziele erreicht." },
                { title: "🎯 Rundum-sorglos-Paket", text: "Wir übernehmen alles: Texte, Bilder, Struktur, Design - Sie lehnen sich zurück und erhalten Ihre fertige Website." }
            ],
            testimonials: [
                {
                    stars: "⭐️⭐️⭐️⭐️⭐️",
                    rating: "5/5",
                    quote: "\"Ich hatte keine Lust mich damit zu beschäftigen wusste aber das ich eine neue Webseite benötigte. RED hat alles gemacht und ich musste nur einmal ein feedback geben. Jetzt hab ich eine moderne Website und bin online sichtbar – ohne Stress.\"",
                    author: "Daniel W.",
                    company: "Sanitär & Heizung",
                    avatar: "👨‍🔧"
                },
                {
                    stars: "⭐️⭐️⭐️⭐️⭐️",
                    rating: "5/5",
                    quote: "\"Ich war erst skeptisch. Aber das Team hat geliefert – schnell, unkompliziert und die Seite sieht top aus. Danke nochmals!\"",
                    author: "Stefan H.",
                    company: "Elektrotechnik",
                    avatar: "👨‍💻"
                },
                {
                    stars: "⭐️⭐️⭐️⭐️",
                    rating: "4/5",
                    quote: "\"Nachdem ich Google Analytics gecheckt habe sah ich das meine Kunden nach 30 sec die Seite wieder verlassen haben und mich nicht kontaktiert haben. Jetzt bekomme ich jeden Monat neue Anfragen.\"",
                    author: "Ali K.",
                    company: "Bauunternehmen",
                    avatar: "👷‍♂️"
                }
            ]
        },
        faq: {
            headline: (city) => `Häufige Fragen aus ${city}`,
            subline: (city, region) => `Antworten für Unternehmer aus ${city} und ${region}.`,
            questions: [
                {
                    question: (city) => `Gibt es versteckte Kosten für Unternehmen aus ${city}?`,
                    answer: (city, region) => `Nein. Unser Fixpreis von 790€ gilt auch für Kunden aus ${city} und Umgebung. Darin enthalten sind Design, technische Umsetzung, SEO-Grundlagen und DSGVO-Sicherheit. Transparenz ist uns wichtig, gerade für die lokale Zusammenarbeit in ${region}.`
                },
                {
                    question: (city) => `Wie hebe ich mich von der Konkurrenz in ${city} ab?`,
                    answer: (city, region) => `Durch individuelles Design statt Templates. ${city} ist ein kompetitiver Markt. Wir analysieren Ihre lokalen Mitbewerber in ${city} und positionieren Ihre Website so, dass sie genau Ihre Stärken hervorhebt und Sie in den lokalen Suchergebnissen sichtbar macht.`
                },
                {
                    question: (city) => `Können Sie auch Bilder von meinem Standort in ${city} machen?`,
                    answer: (city, region) => `Wir arbeiten meist mit vorhandenem Material oder hochwertigen Stock-Medien. Für authentische Fotos aus ${city} empfehlen wir lokale Fotografen, mit denen wir Sie gerne vernetzen. Einbindung und Optimierung der Bilder übernehmen selbstverständlich wir.`
                },
                {
                    question: (city) => `Betreuen Sie auch andere Kunden in ${city}?`,
                    answer: (city, region) => `Ja, wir betreuen mehrere Unternehmen in ${region} und speziell im Raum ${city}. Wir verstehen die lokale Wirtschaft.`
                },
                {
                    question: (city) => `Wie läuft die Zusammenarbeit ab, wenn ich in ${city} sitze?`,
                    answer: (city, region) => `Sehr effizient. Wir nutzen Video-Calls, WhatsApp und Telefon. Das spart Ihnen Zeit und uns Ressourcen.`
                },
                {
                    question: (city) => `Ist die Website für den ${city}er Markt optimiert?`,
                    answer: (city, region) => `Absolut. Wir richten die SEO-Strategie auf lokale Keywords aus.`
                }
            ]
        },
        contact: {
            headline: "Bereit für digitalen Erfolg?",
            subline: (city) => `Der Wettbewerb in ${city} schläft nicht. Starten Sie jetzt mit einer Website, die nicht nur gut aussieht, sondern verkauft.`
        }
    },
    graz: {
        hero: {
            headline: (city) => `Kreatives Webdesign für ${city}.`,
            subline: (city) => `Außergewöhnliches Design trifft auf steirische Verlässlichkeit. Wir bauen Websites für den Anspruch von morgen.`
        },
        intro: {
            headline: (city) => `${city}: Wo Design auf Technik trifft.`,
            text: (city) => `In der „City of Design“ reicht Standard nicht aus. Ihr Unternehmen in ${city} braucht eine digitale Visitenkarte, die Qualität und Innovation ausstrahlt. Wir verbinden ästhetischen Anspruch mit technischer Perfektion.`
        },
        process: {
            headline: "Einfach. Persönlich. Direkt.",
            text: "Wir verzichten auf kompliziertes Fachchinesisch. Unser Weg zur neuen Website ist so klar und direkt wie ein Gespräch unter Partnern.",
            steps: [
                { title: "Kennenlernen", description: "Erzählen Sie uns von Ihrer Idee. Ein kurzes, digitales Gespräch oder ein paar Klicks reichen für den Start.", highlight: "Unverbindlich" },
                { title: "Entwurf & Konzept", description: "Wir gestalten einen maßgeschneiderten Entwurf für Sie. Modern, sauber und passend für den Grazer Markt.", highlight: "Kreativarbeit" },
                { title: "Entscheidung in Ruhe", description: "Sie schauen sich alles genau an. Passt es? Dann legen wir los. Wenn nicht, entstehen keine Kosten.", highlight: "Fairness" }
            ],
            benefits: [
                {
                    title: "Keine langen Meetings",
                    description: "Wir klären alles Wichtige effizient und digital. Das spart Ihnen Zeit.",
                    highlight: "Effizient",
                    redText: "Zeitsparend"
                },
                {
                    title: "Voller Service",
                    description: "Sie lehnen sich zurück. Wir kümmern uns um Design und Technik.",
                    highlight: "Bequem",
                    redText: "Rundum-Service"
                },
                {
                    title: "Datenschutz",
                    description: "Wir achten penibel auf die DSGVO. Ihre Seite ist rechtssicher.",
                    highlight: "Sicher",
                    redText: "Rechtssicher"
                },
                {
                    title: "Schnelle Umsetzung",
                    description: "In einer Woche steht Ihre neue Website.",
                    highlight: "Flott",
                    redText: "7 Tage"
                }
            ]
        },
        portfolio: {
            headline: "Design, das wirkt.",
            text: (city) => `Moderne Ästhetik für Grazer Unternehmen. Klar, strukturiert und überzeugend.`
        },
        seo: {
            headline: "Gefunden werden, wo es zählt",
            subline: "Eine schöne Seite muss auch sichtbar sein. Wir sorgen dafür, dass Sie in Graz und der Steiermark ganz oben stehen.",
            strategyHeadline: "Unser Weg zu mehr Sichtbarkeit",
            comparisonHeadline: (city) => `Der Unterschied zu anderen Agenturen`,
            features: [
                { title: "Saubere Technik", text: (city) => `Wir programmieren sauber und ordentlich. Das Ergebnis: Blitzschnelle Ladezeiten, die Google belohnt.` },
                { title: "Lokale Strategie", text: (city) => `Wir wissen, wie die Steiermark tickt. Wir optimieren Ihre Seite so, dass regionale Kunden Sie sofort finden.` },
                { title: "Zukunftssicher", text: (city) => `Wir nutzen modernste Tools, damit Ihre Seite auch morgen noch aktuell und wettbewerbsfähig ist.` }
            ],
            strategyItems: [
                { title: "Sichtbarkeit", text: "Wer nicht gefunden wird, verliert Kunden. Wir platzieren Sie dort, wo gesucht wird: Ganz oben." },
                { title: "Verständnis", text: "Wir analysieren genau, was Ihre Kunden brauchen und richten die Inhalte darauf aus." },
                { title: "Ergebnis", text: "Mehr Anfragen, mehr Kunden. Ihre Website wird zu Ihrem besten Außendienstmitarbeiter." }
            ],
            comparisonItems: [
                { name: "Gestaltung", other: "Baukasten", us: "Handarbeit" },
                { name: "Auffindbarkeit", other: "Oft vernachlässigt", us: "Im Fokus" },
                { name: "Geschwindigkeit", other: "Durchschnitt", us: "Blitzschnell" },
                { name: "Zukunft", other: "Veraltet schnell", us: "Modernste Technik" },
                { name: "Preis", other: "Unklar", us: "Fixpreis" }
            ]
        },
        about: {
            headline: "Qualität aus Überzeugung",
            text: "Wir sind keine anonyme Internet-Firma. Wir sind Partner für den steirischen Mittelstand. Handschlagqualität und verlässliche Arbeit sind unser Fundament.",
            testimonialsHeadline: (city) => `Das sagen Kunden aus ${city}`,
            features: [
                { title: "Ehrliche Arbeit", text: "Wir halten, was wir versprechen. Termin- und preistreu." },
                { title: "Direkter Draht", text: "Sie erreichen uns, wenn Sie uns brauchen. Kein Callcenter." },
                { title: "Komplettlösung", text: "Design, Text, Technik. Sie bekommen alles aus einer Hand." }
            ],
            testimonials: [
                {
                    stars: "⭐️⭐️⭐️⭐️⭐️",
                    rating: "5/5",
                    quote: "\"Endlich eine Agentur, die versteht, was wir brauchen. Unkompliziert, schnell und das Ergebnis kann sich sehen lassen.\"",
                    author: "Markus P.",
                    company: "Architekturbüro",
                    avatar: "📐"
                },
                {
                    stars: "⭐️⭐️⭐️⭐️⭐️",
                    rating: "5/5",
                    quote: "\"Wir wollten eine moderne Seite, die unsere Qualität widerspiegelt. Genau das haben wir bekommen. Top Service!\"",
                    author: "Lisa M.",
                    company: "Design Studio",
                    avatar: "🎨"
                },
                {
                    stars: "⭐️⭐️⭐️⭐️",
                    rating: "4/5",
                    quote: "\"Die Zusammenarbeit war sehr angenehm. Man merkt, dass hier Profis am Werk sind, die ihr Handwerk verstehen.\"",
                    author: "Hannes K.",
                    company: "Ingenieurbüro",
                    avatar: "🏗️"
                }
            ]
        },
        faq: {
            headline: (city) => `Fragen zu Ihrem Projekt in ${city}`,
            subline: (city, region) => `Wir antworten gerne auf Ihre Fragen. Direkt und verständlich.`,
            questions: [
                {
                    question: (city) => `Kommen Sie für eine Besprechung nach ${city}?`,
                    answer: (city, region) => `Wir setzen auf effiziente, digitale Kommunikation per Video oder Telefon. Das spart nicht nur Anfahrtskosten, sondern auch wertvolle Zeit, die wir lieber in Ihre Website investieren.`
                },
                {
                    question: (city) => `Was kostet das Ganze wirklich?`,
                    answer: (city, region) => `Es bleibt bei 790€. Das ist unser Fixpreis für Ihr Komplettpaket. Keine versteckten Gebühren, keine bösen Überraschungen.`
                },
                {
                    question: (city) => `Wie lange dauert es bis zur fertigen Seite?`,
                    answer: (city, region) => `In der Regel ist Ihre neue Website in 7 Tagen online. Wir arbeiten zügig und strukturiert.`
                },
                {
                    question: (city) => `Brauche ich eigene Fotos aus ${city}?`,
                    answer: (city, region) => `Wenn Sie welche haben, super! Wenn nicht, nutzen wir hochwertige Symbolbilder oder helfen Ihnen, einen Fotografen in ${city} zu finden.`
                },
                {
                    question: (city) => `Helfen Sie auch nach dem Start weiter?`,
                    answer: (city, region) => `Selbstverständlich. Wir lassen Sie nicht allein. Wir kümmern uns um Wartung und Updates, damit Ihre Seite sicher bleibt.`
                }
            ]
        },
        contact: {
            headline: "Starten wir gemeinsam.",
            subline: (city) => `Lassen Sie uns über Ihre Ziele in ${city} sprechen. Unverbindlich und auf Augenhöhe.`
        }
    },
};
