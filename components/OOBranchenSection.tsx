"use client";

import { Wrench, Hotel, Briefcase, Coffee, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

const branchen = [
  {
    icon: Wrench,
    title: "Handwerk",
    description: "Professionelle Websites für Installateure, Elektriker und alle Handwerksbetriebe in Oberösterreich.",
    examples: ["Installateur", "Elektrotechnik", "Tischlerei", "Malerbetrieb"]
  },
  {
    icon: Hotel,
    title: "Tourismus",
    description: "Buchungsoptimierte Websites für Hotels, Pensionen und Ferienwohnungen im Salzkammergut und ganz OÖ.",
    examples: ["Hotels", "Pensionen", "Ferienwohnungen", "Gaststätten"]
  },
  {
    icon: Briefcase,
    title: "Dienstleister",
    description: "Vertrauensvolle Online-Präsenz für Ärzte, Anwälte, Steuerberater und Berater in Linz, Wels und Steyr.",
    examples: ["Ärzte", "Anwälte", "Steuerberater", "Unternehmensberater"]
  },
  {
    icon: Coffee,
    title: "Gastronomie",
    description: "Appetitanregende Websites für Restaurants, Cafés und Wirtshäuser in ganz Oberösterreich.",
    examples: ["Restaurants", "Cafés", "Wirtshäuser", "Catering"]
  },
  {
    icon: ShoppingBag,
    title: "Handel",
    description: "Verkaufsstarke Online-Shops und Websites für Einzelhändler und Direktvermarkter in OÖ.",
    examples: ["Einzelhandel", "E-Commerce", "Direktvermarkter", "Trachtenmode"]
  }
];

export default function OOBranchenSection() {
  return (
    <section className="py-20 bg-gray-50" id="branchen">
      <div className="max-w-7xl mx-auto px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">
            Webdesign für <span className="text-red-600 font-medium">Oberösterreichische Branchen</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Von Linz bis Steyr, vom Innviertel bis ins Salzkammergut – wir kennen die Bedürfnisse 
            oberösterreichischer Betriebe und erstellen Websites, die zu Ihrem Geschäft passen.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {branchen.map((branche, index) => {
            const Icon = branche.icon;
            return (
              <motion.div
                key={branche.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-red-100 rounded-lg flex items-center justify-center">
                    <Icon className="w-7 h-7 text-red-600" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900">{branche.title}</h3>
                </div>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {branche.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {branche.examples.map((example) => (
                    <span
                      key={example}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                    >
                      {example}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-lg text-gray-600">
            Ihre Branche ist nicht dabei? <span className="text-red-600 font-medium">Kein Problem!</span> Wir erstellen 
            Websites für alle Branchen in Oberösterreich.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
