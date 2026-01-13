import { City } from '../app/[slug]/cities';

interface CitySEOContentProps {
    city: City;
}

const CitySEOContent = ({ city }: CitySEOContentProps) => {
    return (
        <div className="sr-only" aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: '1px', height: '1px', overflow: 'hidden' }}>
            <article itemScope itemType="https://schema.org/LocalBusiness">
                <div itemProp="name" role="heading" aria-level={1}>
                    Webdesign {city.name} - Ihre Agentur vor Ort
                </div>

                <div itemProp="description">
                    <h2>Webdesign in {city.name}: Digitaler Erfolg für Ihr Unternehmen</h2>
                    <p>
                        Als Unternehmen in {city.name} ({city.region}) benötigen Sie einen starken digitalen Partner.
                        {city.seoText}
                        Wir verstehen die Dynamik der {city.name}er Wirtschaft und bieten maßgeschneiderte Lösungen.
                        Anders als anonyme Online-Baukästen sind wir greifbar und kennen den lokalen Markt.
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
                        Viele Agenturen in {city.name} verlangen hohe Stundensätze. Wir gehen einen anderen Weg:
                        Fixpreis ab 790€. Transparenz von Anfang an.
                        Sie wissen genau, was Sie bekommen: Eine fertige, rechtssichere Website, die Kunden gewinnt.
                        Ideal für KMUs, Startups und Traditionsbetriebe in {city.name} und ganz {city.region}.
                    </p>

                    <h3>FAQ: Webdesign {city.name}</h3>
                    <p>
                        <strong>Frage:</strong> Kommen Sie für ein Meeting nach {city.name}?<br />
                        <strong>Antwort:</strong> Wir arbeiten primär digital, um die Kosten für Sie niedrig zu halten.
                        Für größere Projekte in {city.name} sind persönliche Termine nach Absprache möglich.
                        Die meisten unserer {city.name}er Kunden schätzen jedoch die effiziente Abwicklung per Video-Call
                        und Telefon.
                    </p>
                </div>

                <div itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                    <span itemProp="addressLocality">{city.name}</span>, <span itemProp="addressRegion">{city.region}</span>
                    <span itemProp="addressCountry">Österreich</span>
                </div>
                <span itemProp="priceRange">€€</span>
            </article>
        </div>
    );
};

export default CitySEOContent;
