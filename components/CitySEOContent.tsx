import { City } from '../app/[slug]/cities';

interface CitySEOContentProps {
    city: City;
}

const CitySEOContent = ({ city }: CitySEOContentProps) => {
    // Generate a consistent "random" project count between 121 and 212 if not provided
    // Simple hash function to make it deterministic per city
    const getProjectCount = (name: string) => {
        if (city.projectCount) return city.projectCount;
        const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return 121 + (hash % 92);
    };

    const projectCount = getProjectCount(city.name);
    const isWien = city.name === "Wien";

    return (
        <div className="sr-only" aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: '1px', height: '1px', overflow: 'hidden' }}>
            <article itemScope itemType={isWien ? "https://schema.org/LocalBusiness" : "https://schema.org/ProfessionalService"}>
                <div itemProp="name" role="heading" aria-level={1}>
                    Webdesign {city.name} - Ihre Agentur vor Ort {isWien ? "" : "und mobil"}
                </div>

                {/* Address - Always Wien (SAB Requirement) */}
                <div itemProp="address" itemScope itemType="https://schema.org/PostalAddress" style={{ display: 'none' }}>
                    <span itemProp="streetAddress">Grabnergasse 8</span>
                    <span itemProp="postalCode">1060</span>
                    <span itemProp="addressLocality">Wien</span>
                    <span itemProp="addressCountry">AT</span>
                </div>

                {/* Service Area for non-Wien cities */}
                {!isWien && (
                    <div itemProp="areaServed" itemScope itemType="https://schema.org/City">
                        <span itemProp="name">{city.name}</span>
                        <div itemProp="containedInPlace" itemScope itemType="https://schema.org/State">
                            <span itemProp="name">{city.region}</span>
                        </div>
                    </div>
                )}

                {/* Mobile Service Definition for non-Wien cities */}
                {!isWien && (
                    <meta itemProp="serviceType" content={`Mobile Webdesign & Website-Entwicklung für ${city.name}`} />
                )}

                <div itemProp="description">
                    <h2>Webdesign in {city.name}: Digitaler Erfolg für Ihr Unternehmen</h2>
                    <p>
                        Als Unternehmen in {city.name} ({city.region}) benötigen Sie einen starken digitalen Partner.
                        {city.seoText}
                        Wir verstehen die Dynamik der {city.name}er Wirtschaft und bieten maßgeschneiderte Lösungen.
                        {projectCount > 0 && `Bereits über ${projectCount} erfolgreiche Projekte haben wir in der Region realisiert.`}
                    </p>

                    <h3>Persönlicher Service vor Ort in {city.name}</h3>
                    <p>
                        Wir kommen zu Ihnen! Mit unserem Hauptsitz in Wien bedienen wir ganz Österreich mit unserem mobilen
                        Webdesign-Service. Auch in {city.name} besuchen wir Sie gerne persönlich für eine unverbindliche Erstberatung.
                        Sparen Sie sich die Anfahrt - wir bringen die Agentur zu Ihnen ins Haus.
                    </p>

                    <h3>Warum {city.name}er Unternehmen auf uns setzen</h3>
                    <p>
                        Die Konkurrenz in {city.name} schläft nicht. {city.marketTrends}
                        Um hier zu bestehen, brauchen Sie mehr als nur eine Visitenkarte im Netz.
                        Unsere Websites sind Verkaufsmaschinen, optimiert für lokale Suchanfragen wie "Webdesign {city.name}"
                        oder "Homepage erstellen lassen {city.name}".
                        Wir nutzen {city.localFacts[1]} als Inspiration für funktionale Designs.
                    </p>

                    <h3>Strategisches Webdesign im Bezirk {city.name}</h3>
                    <p>
                        Egal ob Sie im Zentrum von {city.name} oder im Umland tätig sind: Regionale Sichtbarkeit ist der Schlüssel.
                        Wir optimieren Ihren Google My Business Eintrag für {city.name} und sorgen dafür,
                        dass Sie bei lokalen Suchanfragen ("in meiner Nähe") gefunden werden.
                        Kennen Sie {city.landmarks[0]} oder {city.landmarks[1]}? Genau so bekannt machen wir Ihre Marke digital.
                    </p>

                    <h3>Kosten transparente Website-Erstellung in {city.name}</h3>
                    <p>
                        Viele Agenturen in {city.name} verlangen hohe Stundensätze. Wir arbeiten effizient und mit Fixpreisen ab 790€.
                        Sie wissen genau, was Sie bekommen: Eine fertige, rechtssichere Website.
                        Ideal für KMUs, Startups und Traditionsbetriebe in {city.name} und ganz {city.region}.
                    </p>

                    <h3>FAQ: Webdesign {city.name}</h3>
                    <p>
                        <strong>Frage:</strong> Kommen Sie für ein Meeting nach {city.name}?<br />
                        <strong>Antwort:</strong> Ja, absolut! Wir sind eine mobile Agentur und besuchen unsere Kunden in {city.name}
                        und ganz Österreich persönlich vor Ort. Wir glauben, dass die besten Ergebnisse durch persönlichen Kontakt entstehen.
                    </p>
                </div>

                <span itemProp="priceRange">€€</span>
            </article>
        </div>
    );
};

export default CitySEOContent;
