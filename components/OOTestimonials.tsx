"use client";

import { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
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
    rating: 4,
    text: "Der Online-Shop läuft perfekt und die Kunden lieben das Design. Besonders gut gefällt mir, dass alles so einfach zu bedienen ist. Vielen Dank!",
    service: "Handel"
  }
];

export default function OOTestimonials() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
    slidesToScroll: 1,
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

    // Auto-scroll every 10 seconds for a even slower, more relaxed feel
    const autoScroll = setInterval(() => {
      emblaApi.scrollNext();
    }, 10000);

    return () => {
      clearInterval(autoScroll);
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="py-24 bg-white" id="testimonials">
      <div className="max-w-4xl mx-auto px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-4 tracking-tight">
            Das sagen unsere <span className="text-red-600 font-medium">OÖ Kunden</span>
          </h2>
        </motion.div>

        <div className="relative">
          {/* Minimalist Carousel */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="flex-[0_0_100%] min-w-0"
                >
                  <motion.div
                    initial={{ opacity: 0.5, scale: 0.95 }}
                    animate={{
                      opacity: selectedIndex === index ? 1 : 0.4,
                      scale: selectedIndex === index ? 1 : 0.95
                    }}
                    transition={{ duration: 0.5 }}
                    className="p-10"
                  >
                    <div className="flex justify-center gap-1 mb-8">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${i < testimonial.rating ? 'fill-[#fbbc04] text-[#fbbc04]' : 'fill-gray-200 text-gray-200'}`}
                        />
                      ))}
                    </div>

                    <blockquote className="text-2xl md:text-3xl font-light text-gray-800 leading-relaxed mb-10 italic">
                      &quot;{testimonial.text}&quot;
                    </blockquote>

                    <div className="mt-10">
                      <p className="text-lg font-medium text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-400 mt-1 uppercase tracking-widest">
                        {testimonial.company} • {testimonial.location}
                      </p>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows - Minimalist */}
          <button
            onClick={scrollPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-gray-300 hover:text-red-600 transition-colors"
            aria-label="Vorheriges Testimonial"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-gray-300 hover:text-red-600 transition-colors"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          {/* Progress Indicator */}
          <div className="flex justify-center gap-3 mt-12">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => emblaApi?.scrollTo(index)}
                className={`h-0.5 rounded-full transition-all duration-500 ${index === selectedIndex ? 'bg-red-600 w-12' : 'bg-gray-200 w-6'}`}
                aria-label={`Gehe zu Testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
