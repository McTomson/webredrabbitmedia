"use client";

import { Wrench, Hotel, Briefcase, Coffee, ShoppingBag, Factory, CheckCircle } from 'lucide-react';
import { AOSWrapper } from './AnimatedSection';

const branchen = [
  {
    icon: Wrench,
    title: "Handwerk",
    description: "Professionelle Websites für Installateure, Elektriker und alle Handwerksbetriebe in Oberösterreich.",
    redText: "Meisterbetriebe",
    highlight: "Regional"
  },
  {
    icon: Hotel,
    title: "Tourismus",
    description: "Buchungsoptimierte Websites für Hotels, Pensionen und Ferienwohnungen im Salzkammergut.",
    redText: "Buchungs-Check",
    highlight: "Saisonal"
  },
  {
    icon: Briefcase,
    title: "Dienstleister",
    description: "Vertrauensvolle Online-Präsenz für Ärzte, Anwälte, Steuerberater und Berater in Linz & Wels.",
    redText: "Seriös & Sicher",
    highlight: "Vertrauen"
  },
  {
    icon: Coffee,
    title: "Gastronomie",
    description: "Appetitanregende Websites für Restaurants, Cafés und Wirtshäuser in ganz Oberösterreich.",
    redText: "Speisekarte inkl.",
    highlight: "Genuss"
  },
  {
    icon: ShoppingBag,
    title: "Handel",
    description: "Verkaufsstarke Online-Shops und Websites für Einzelhändler und Direktvermarkter in OÖ.",
    redText: "E-Commerce",
    highlight: "Verkauf"
  },
  {
    icon: Factory,
    title: "Industrie & Mittelstand",
    description: "Leistungsstarke Websites für Industriebetriebe und den exportorientierten Mittelstand.",
    redText: "Maschinenbau",
    highlight: "Export-Ready"
  }
];

export default function OOBranchenSection() {
  return (
    <section className="py-24 bg-white" id="branchen">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-16">
          <AOSWrapper animation="fade-up" delay={100}>
            <h2 className="text-4xl lg:text-5xl font-light text-gray-900 leading-tight mb-6">
              Webdesign für <span className="text-red-600 font-medium">OÖ Branchen</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Von Linz bis Steyr, vom Innviertel bis ins Salzkammergut – wir kennen die Bedürfnisse
              oberösterreichischer Betriebe und erstellen Websites, die zu Ihrem Erfolg beitragen.
            </p>
          </AOSWrapper>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {branchen.map((branche, index) => (
            <AOSWrapper
              key={index}
              animation="fade-up"
              delay={200 + (index * 100)}
            >
              <div className="group h-full p-8 lg:p-10 bg-white border border-gray-200 rounded-xl hover:shadow-xl transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 relative overflow-hidden flex flex-col">
                {/* Background accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-200 to-red-200 group-hover:from-red-200 group-hover:to-red-300 transition-all duration-500"></div>

                {/* Icon */}
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-red-50 transition-all duration-300">
                  <branche.icon className="w-8 h-8 text-gray-600 group-hover:text-red-600 transition-colors duration-300" />
                </div>

                {/* Content */}
                <div className="text-center flex flex-col flex-grow">
                  <h4 className="font-medium text-lg lg:text-xl mb-4 text-gray-900 group-hover:text-red-600 transition-colors duration-300">
                    {branche.title}
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed mb-6 flex-grow">
                    {branche.description}
                  </p>

                  {/* Red badge */}
                  <div className="mb-6">
                    <div className="inline-block px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-medium">
                      {branche.redText}
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full text-xs font-medium text-gray-600 group-hover:bg-red-50 group-hover:text-red-600 transition-all duration-300 mx-auto mt-auto">
                    <CheckCircle className="w-3 h-3" />
                    {branche.highlight}
                  </div>
                </div>
              </div>
            </AOSWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}
