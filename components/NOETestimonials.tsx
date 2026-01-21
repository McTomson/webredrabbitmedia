"use client";

import { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const testimonials = [
    {
        name: "Thomas Gruber",
        company: "Gruber Installationen",
        location: "Tulln",
        rating: 5,
        text: "Endlich eine Webseite, die uns neue Kunden bringt. Die Zusammenarbeit war unkompliziert und professionell.",
        service: "Installateur"
    },
    {
        name: "Maria Steiner",
        company: "Heuriger Steiner",
        location: "Krems",
        rating: 5,
        text: "Die neue Webseite ist wunderschön geworden. Unsere Gäste finden uns jetzt viel leichter und die Reservierungen laufen super.",
        service: "Gastronomie"
    },
    {
        name: "Dr. Andreas Hofer",
        company: "Zahnarztpraxis Hofer",
        location: "St. Pölten",
        rating: 5,
        text: "Professionell, schnell und fair. Genau so soll Zusammenarbeit sein. Die Patientenanfragen haben deutlich zugenommen.",
        service: "Arztpraxis"
    },
    {
        name: "Sabine Müller",
        company: "Friseur Müller",
        location: "Hollabrunn",
        rating: 4,
        text: "Sehr zufrieden mit dem Ergebnis. Die Webseite sieht toll aus. Nur die Lieferzeit war etwas länger als erwartet.",
        service: "Dienstleistung"
    },
    {
        name: "Johann Bauer",
        company: "Tischlerei Bauer",
        location: "Amstetten",
        rating: 5,
        text: "Handschlagqualität. Die haben geliefert, was sie versprochen haben. Keine leeren Versprechungen, sondern echte Arbeit.",
        service: "Handwerk"
    }
];

export default function NOETestimonials() {
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

        const autoScroll = setInterval(() => {
            emblaApi.scrollNext();
        }, 8000);

        return () => {
            clearInterval(autoScroll);
            emblaApi.off('select', onSelect);
        };
    }, [emblaApi, onSelect]);

    return (
        <section className="py-24 bg-[#fafafa]" id="testimonials">
            <div className="max-w-4xl mx-auto px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mb-16"
                >
                    <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-4 tracking-tight">
                        Stimmen aus der <span className="text-red-600 font-medium">Region</span>
                    </h2>
                    <div className="w-12 h-px bg-red-600 mx-auto"></div>
                </motion.div>

                <div className="relative">
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
                                                    className={`w-4 h-4 ${i < testimonial.rating ? 'fill-[#fbbc04] text-[#fbbc04]' : 'fill-gray-200 text-gray-200'}`}
                                                />
                                            ))}
                                        </div>

                                        <blockquote className="text-xl md:text-2xl font-light text-gray-700 leading-relaxed mb-10 italic">
                                            &quot;{testimonial.text}&quot;
                                        </blockquote>

                                        <div className="mt-10">
                                            <p className="text-lg font-medium text-gray-900">{testimonial.name}</p>
                                            <p className="text-xs text-gray-400 mt-2 uppercase tracking-[0.2em] font-light">
                                                {testimonial.company} • {testimonial.location}
                                            </p>
                                        </div>
                                    </motion.div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={scrollPrev}
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-gray-300 hover:text-red-600 transition-colors hidden md:flex"
                        aria-label="Vorheriges Testimonial"
                    >
                        <ChevronLeft className="w-8 h-8 font-thin" />
                    </button>
                    <button
                        onClick={scrollNext}
                        className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-gray-300 hover:text-red-600 transition-colors hidden md:flex"
                        aria-label="Nächstes Testimonial"
                    >
                        <ChevronRight className="w-8 h-8 font-thin" />
                    </button>

                    <div className="flex justify-center gap-3 mt-12">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => emblaApi?.scrollTo(index)}
                                className={`h-0.5 rounded-full transition-all duration-500 ${index === selectedIndex ? 'bg-red-600 w-10' : 'bg-gray-200 w-4'}`}
                                aria-label={`Gehe zu Testimonial ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
