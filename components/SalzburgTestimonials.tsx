"use client";

import { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const testimonials = [
    {
        name: "Dr. Maximilian Salzburg",
        company: "Salzburg Medical Care",
        location: "Stadt Salzburg",
        rating: 5,
        text: "Exzellenz wird in Salzburg großgeschrieben. Red Rabbit Media hat diesen Anspruch digital perfekt umgesetzt. Unsere Patienten schätzen die klare Struktur und das edle Design.",
        service: "Arztpraxis"
    },
    {
        name: "Hannes Moser",
        company: "Alpenpark Resort",
        location: "Zell am See",
        rating: 5,
        text: "Für unsere internationalen Gäste im Pinzgau brauchten wir einen Webauftritt auf Weltniveau. Das Ergebnis hat unsere Erwartungen übertroffen.",
        service: "Tourismus & Hotel"
    },
    {
        name: "Elisabeth Schneider",
        company: "Schneider & Söhne Bau",
        location: "Hallein",
        rating: 5,
        text: "Bodenständige Qualität trifft auf moderne Technik. Die neue Website ist unser wichtigstes Werkzeug für die Kundengewinnung in der Region geworden.",
        service: "Baugewerbe"
    }
];

export default function SalzburgTestimonials() {
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
                        Das sagen unsere <span className="text-red-600 font-medium">Salzburger Kunden</span>
                    </h2>
                </motion.div>

                <div className="relative">
                    <div className="overflow-hidden" ref={emblaRef}>
                        <div className="flex">
                            {testimonials.map((testimonial, index) => (
                                <div key={index} className="flex-[0_0_100%] min-w-0">
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
