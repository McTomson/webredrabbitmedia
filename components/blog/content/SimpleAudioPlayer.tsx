"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, RefreshCw } from 'lucide-react';

interface SimpleAudioPlayerProps {
    src: string;
    title?: string;
    autoPlay?: boolean;
}

export function SimpleAudioPlayer({
    src,
    title = "Audio abspielen",
    autoPlay = false
}: SimpleAudioPlayerProps) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);

    // Format time (seconds) into MM:SS
    const formatTime = (time: number) => {
        if (isNaN(time)) return '00:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch((error) => {
                    console.warn('Audio playback failed:', error);
                });
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const handleCanPlay = () => {
        // Audio is ready to play
        if (autoPlay && audioRef.current) {
            audioRef.current.play().catch((error) => {
                console.warn('Auto-play failed:', error);
            });
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = parseFloat(e.target.value);
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const changePlaybackSpeed = () => {
        const speeds = [1, 1.25, 1.5, 2];
        const currentIndex = speeds.indexOf(playbackRate);
        const nextSpeed = speeds[(currentIndex + 1) % speeds.length];

        if (audioRef.current) {
            audioRef.current.playbackRate = nextSpeed;
            setPlaybackRate(nextSpeed);
        }
    };

    return (
        <div className="w-full my-8 bg-zinc-900 border border-zinc-800 rounded-xl p-4 md:p-6 shadow-lg flex flex-col gap-4">

            <audio
                ref={audioRef}
                src={src}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onCanPlay={handleCanPlay}
                onEnded={() => setIsPlaying(false)}
                onError={(e) => {
                    console.warn('Audio loading error:', e);
                }}
                preload="metadata"
                crossOrigin="anonymous"
            />

            <div className="flex items-center justify-between gap-4">
                {/* Play/Pause Button */}
                <button
                    onClick={togglePlay}
                    className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center transition-all transform hover:scale-105 shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
                    aria-label={isPlaying ? "Pause" : "Play"}
                >
                    {isPlaying ? (
                        <Pause className="w-6 h-6 fill-current" />
                    ) : (
                        <Play className="w-6 h-6 fill-current ml-1" />
                    )}
                </button>

                {/* Title and Progress */}
                <div className="flex-grow min-w-0">
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-white truncate pr-4">
                            {title}
                        </h4>
                        <div className="text-xs text-zinc-400 font-mono flex-shrink-0">
                            {formatTime(currentTime)} / {formatTime(duration)}
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <input
                        type="range"
                        min="0"
                        max={duration || 100}
                        value={currentTime}
                        onChange={handleSeek}
                        className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-red-600 hover:accent-red-500 focus:outline-none"
                        style={{
                            background: `linear-gradient(to right, #dc2626 ${duration ? (currentTime / duration) * 100 : 0}%, #27272a ${duration ? (currentTime / duration) * 100 : 0}%)`
                        }}
                    />
                </div>

                {/* Playback Speed Button */}
                <button
                    onClick={changePlaybackSpeed}
                    className="hidden md:flex items-center justify-center text-zinc-400 hover:text-white transition-colors px-2 py-1 text-xs font-mono bg-zinc-800 rounded"
                    title="Wiedergabegeschwindigkeit"
                >
                    {playbackRate}x
                </button>

                {/* Mute Button (Desktop) */}
                <button
                    onClick={toggleMute}
                    className="hidden md:flex items-center justify-center text-zinc-400 hover:text-white transition-colors p-2"
                    title={isMuted ? "Ton einschalten" : "Ton ausschalten"}
                >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
            </div>
        </div>
    );
}
