"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";
import 'aos/dist/aos.css';

interface AnimatedSectionProps extends HTMLMotionProps<"section"> {
    children: ReactNode;
    delay?: number;
}

export const AnimatedSection = ({ children, delay = 0, className, ...props }: AnimatedSectionProps) => {
    return (
        <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay, ease: "easeOut" }}
            className={className}
            {...props}
        >
            {children}
        </motion.section>
    );
};

interface AOSWrapperProps {
    children: ReactNode;
    animation?: string;
    delay?: number;
    duration?: number;
    className?: string;
}

export const AOSWrapper = ({
    children,
    animation = "fade-up",
    delay = 0,
    duration = 800,
    className = ""
}: AOSWrapperProps) => {

    return (
        <div
            data-aos={animation}
            data-aos-delay={delay}
            data-aos-duration={duration}
            className={className}
        >
            {children}
        </div>
    );
};
