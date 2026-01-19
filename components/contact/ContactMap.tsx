export default function ContactMap() {
    return (
        <div className="w-full h-full min-h-[400px] bg-secondary/20 rounded-2xl overflow-hidden relative border border-border/50 shadow-inner">
            {/* Overlay to ensure map fits the dark theme or muted theme better */}
            <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-10 z-10"></div>

            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2659.134591901323!2d16.35133607688537!3d48.19163657124976!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476d07865cbb0e9b%3A0xb35359141c2269a2!2sGrabnergasse%208%2C%201060%20Wien!5e0!3m2!1sde!2sat!4v1705600000000!5m2!1sde!2sat"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "grayscale(100%) contrast(1.2) opacity(0.85)" }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Red Rabbit Media Standort"
                className="w-full h-full object-cover"
            ></iframe>

            {/* Location Card Overlay (Bottom Left) */}
            <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-md p-4 rounded-xl border border-border/50 shadow-lg max-w-xs z-20 hidden md:block">
                <h4 className="font-medium text-foreground">Red Rabbit Media GmbH</h4>
                <p className="text-sm text-muted-foreground">Grabnergasse 8, 1060 Wien</p>
                <a
                    href="https://maps.app.goo.gl/exampleLink"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary font-medium mt-2 inline-block hover:underline"
                >
                    Route planen →
                </a>
            </div>
        </div>
    );
}
