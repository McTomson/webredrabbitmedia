"use client";

import { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    name: "Franz Gruber",
    company: "Haustechnik Gruber",
    location: "Eferding",
    rating: 5,
    text: "Die Website hat uns viele neue Kunden gebracht. Besonders die schnelle Umsetzung und der faire Preis haben uns überzeugt. Endlich eine Agentur, die hält, was sie verspricht!",
    service: "Installateur"
  },
  {
    name: "Maria Huber",
    company: "Pension Seeblick",
    location: "Gmunden",
    rating: 5,
    text: "Unsere Buchungen sind seit dem Website-Relaunch um 40% gestiegen. Die Seite ist wunderschön und funktioniert perfekt auf allen Geräten. Absolute Empfehlung!",
    service: "Hotel & Pension"
  },
  {
    name: "Dr. Thomas Hofer",
    company: "Zahnarztpraxis Dr. Hofer",
    location: "Linz",
    rating: 5,
    text: "Professionell, schnell und unkompliziert. Die neue Website vermittelt genau das Vertrauen, das unsere Patienten suchen. Danke für die tolle Arbeit!",
    service: "Arztpraxis"
  },
  {
    name: "Johann Müller",
    company: "Gasthaus Müller",
    location: "Wels",
    rating: 5,
    text: "Endlich eine Website, die zu unserem Wirtshaus passt! Die Speisekarte ist jetzt online und wir bekommen deutlich mehr Reservierungen. Top Service!",
    service: "Gastronomie"
  },
  {
    name: "Sabine Steiner",
    company: "Trachtenmode Steiner",
    location: "Steyr",
    rating: 5,
    text: "Der Online-Shop läuft perfekt und die Kunden lieben das Design. Besonders gut gefällt mir, dass alles so einfach zu bedienen ist. Vielen Dank!",
    service: "Handel"
  }
];

export default function OOTestimonials() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    slidesToScroll: 1,
    breakpoints: {
      '(min-width: 768px)': { slidesToScroll: 2 },
      '(min-width: 1024px)': { slidesToScroll: 3 }
    }
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);

    // Auto-scroll every 8 seconds (slower)
    const autoScroll = setInterval(() => {
      emblaApi.scrollNext();
    }, 8000);

    return () => {
      clearInterval(autoScroll);
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="py-20 bg-white" id="testimonials">
      <div className="max-w-7xl mx-auto px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">
            Stimmen unserer Kunden aus der <span className="text-red-600 font-medium">Region</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Über 156 erfolgreiche Projekte in Oberösterreich – von Linz bis Steyr, vom Innviertel bis ins Salzkammergut.
          </p>
        </motion.div>

        <div className="relative">
          {/* Carousel */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="flex-[0_0_100%] md:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.333%-16px)] min-w-0"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-gray-50 p-8 rounded-lg h-full flex flex-col"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                      ))}
                    </div>

                    <div className="flex-1 mb-6">
                      <Quote className="w-10 h-10 text-red-200 mb-4" />
                      <p className="text-gray-700 leading-relaxed italic">
                        "{testimonial.text}"
                      </p>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-600">{testimonial.company}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-sm text-red-600 font-medium">{testimonial.service}</span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-600">{testimonial.location}</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={scrollPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
            aria-label="Vorheriges Testimonial"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
            aria-label="Nächstes Testimonial"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => emblaApi?.scrollTo(index)}
                className={`w-2 h-2 rounded-full transition-all ${index === selectedIndex ? 'bg-red-600 w-8' : 'bg-gray-300'
                  }`}
                aria-label={`Gehe zu Testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
