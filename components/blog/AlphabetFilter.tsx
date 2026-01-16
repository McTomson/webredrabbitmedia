"use client";

interface AlphabetFilterProps {
    activeLetter: string | null;
    onLetterChange: (letter: string | null) => void;
}

export default function AlphabetFilter({ activeLetter, onLetterChange }: AlphabetFilterProps) {
    // Alphabet for the filter
    const alphabet = "#ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    return (
        <div className="border-b border-gray-100 bg-white sticky top-0 z-30 shadow-subtle/50 backdrop-blur-md bg-white/90">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
                <div className="flex flex-wrap justify-center gap-1 md:gap-2">
                    <button
                        onClick={() => onLetterChange(null)}
                        className={`px-2 py-0.5 text-[10px] md:text-xs font-bold rounded-md transition-colors ${!activeLetter ? 'bg-[#141414] text-white' : 'text-gray-500 hover:text-[#dc2626] hover:bg-red-50'
                            }`}
                    >
                        ALLE
                    </button>
                    {alphabet.map((letter) => (
                        <button
                            key={letter}
                            onClick={() => onLetterChange(letter)}
                            className={`px-1.5 py-0.5 text-[10px] md:text-xs font-medium rounded-md transition-colors ${activeLetter === letter
                                    ? 'bg-[#dc2626] text-white shadow-sm'
                                    : 'text-gray-400 hover:text-[#141414] hover:bg-gray-50'
                                }`}
                        >
                            {letter}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
