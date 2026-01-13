// City data for Austrian cities
export const cities = {
    wien: {
        name: "Wien",
        region: "Wien",
        population: "1.9 Mio.",
        description: "Als Hauptstadt und größte Stadt Österreichs ist Wien das wirtschaftliche und kulturelle Zentrum des Landes.",
        keywords: "Webdesign Wien, Website erstellen Wien, Webentwicklung Wien",
        landmarks: ["Stephansdom", "Schloss Schönbrunn", "Prater"],
    },
    graz: {
        name: "Graz",
        region: "Steiermark",
        population: "290.000",
        description: "Die zweitgrößte Stadt Österreichs und Hauptstadt der Steiermark ist bekannt für ihre Altstadt und innovative Architektur.",
        keywords: "Webdesign Graz, Website erstellen Graz, Webentwicklung Graz",
        landmarks: ["Uhrturm", "Kunsthaus", "Murinsel"],
    },
    linz: {
        name: "Linz",
        region: "Oberösterreich",
        population: "206.000",
        description: "Die Landeshauptstadt von Oberösterreich ist ein wichtiges Industrie- und Kulturzentrum an der Donau.",
        keywords: "Webdesign Linz, Website erstellen Linz, Webentwicklung Linz",
        landmarks: ["Ars Electronica Center", "Pöstlingberg", "Lentos Kunstmuseum"],
    },
    salzburg: {
        name: "Salzburg",
        region: "Salzburg",
        population: "156.000",
        description: "Die Mozartstadt ist weltbekannt für ihre barocke Altstadt und die Festspiele.",
        keywords: "Webdesign Salzburg, Website erstellen Salzburg, Webentwicklung Salzburg",
        landmarks: ["Festung Hohensalzburg", "Getreidegasse", "Schloss Mirabell"],
    },
    innsbruck: {
        name: "Innsbruck",
        region: "Tirol",
        population: "132.000",
        description: "Die Hauptstadt Tirols liegt eingebettet in den Alpen und ist ein wichtiges Zentrum für Tourismus und Wintersport.",
        keywords: "Webdesign Innsbruck, Website erstellen Innsbruck, Webentwicklung Innsbruck",
        landmarks: ["Goldenes Dachl", "Nordkette", "Bergisel"],
    },
    klagenfurt: {
        name: "Klagenfurt",
        region: "Kärnten",
        population: "101.000",
        description: "Die Landeshauptstadt Kärntens liegt am Wörthersee und ist bekannt für ihre Lebensqualität.",
        keywords: "Webdesign Klagenfurt, Website erstellen Klagenfurt, Webentwicklung Klagenfurt",
        landmarks: ["Wörthersee", "Minimundus", "Lindwurm"],
    },
    bregenz: {
        name: "Bregenz",
        region: "Vorarlberg",
        population: "30.000",
        description: "Die Landeshauptstadt Vorarlbergs liegt am Bodensee und ist bekannt für die Bregenzer Festspiele.",
        keywords: "Webdesign Bregenz, Website erstellen Bregenz, Webentwicklung Bregenz",
        landmarks: ["Seebühne", "Pfänder", "Kunsthaus"],
    },
    eisenstadt: {
        name: "Eisenstadt",
        region: "Burgenland",
        population: "15.000",
        description: "Die Landeshauptstadt des Burgenlandes ist die kleinste Landeshauptstadt Österreichs.",
        keywords: "Webdesign Eisenstadt, Website erstellen Eisenstadt, Webentwicklung Eisenstadt",
        landmarks: ["Schloss Esterházy", "Haydnhaus", "Gloriette"],
    },
    "st-poelten": {
        name: "St. Pölten",
        region: "Niederösterreich",
        population: "56.000",
        description: "Die Landeshauptstadt Niederösterreichs ist ein modernes Verwaltungs- und Kulturzentrum.",
        keywords: "Webdesign St. Pölten, Website erstellen St. Pölten, Webentwicklung St. Pölten",
        landmarks: ["Landhausviertel", "Festspielhaus", "Dom"],
    },
} as const;

export type CitySlug = keyof typeof cities;

export function generateStaticParams() {
    return Object.keys(cities).map((city) => ({
        city,
    }));
}
