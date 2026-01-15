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
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex flex-wrap justify-center gap-2 md:gap-4">
                    <button
                        onClick={() => onLetterChange(null)}
                        className={`px-3 py-1 text-sm md:text-base font-bold rounded-lg transition-colors ${
                            !activeLetter ? 'bg-[#141414] text-white' : 'text-gray-500 hover:text-[#dc2626] hover:bg-red-50'
                        }`}
                    >
                        ALLE
                    </button>
                    {alphabet.map((letter) => (
                        <button
                            key={letter}
                            onClick={() => onLetterChange(letter)}
                            className={`px-2 py-1 text-sm md:text-base font-medium rounded-lg transition-colors ${
                                activeLetter === letter
                                    ? 'bg-[#dc2626] text-white shadow-md'
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
