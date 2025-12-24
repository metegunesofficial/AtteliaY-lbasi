"use client";

import { useEffect, useState, useMemo } from "react";

interface GiftPopupProps {
    isOpen: boolean;
    onClose: () => void;
    giftNumber: number;
    giftName: string;
}

// CSS Animasyonlu Hediye Pop-up - Kızaksız versiyon
export function GiftPopup3D({ isOpen, onClose, giftNumber, giftName }: GiftPopupProps) {
    const [phase, setPhase] = useState<"entering" | "gift" | "reveal">("entering");
    const [opacity, setOpacity] = useState(0);

    // Kar ve yıldız pozisyonları bir kere hesaplansın
    const snowflakes = useMemo(() =>
        Array.from({ length: 50 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 3,
            duration: 4 + Math.random() * 3,
            size: 0.8 + Math.random() * 0.8,
        })), []
    );

    const stars = useMemo(() =>
        Array.from({ length: 40 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            top: Math.random() * 50,
            size: 0.5 + Math.random() * 1.2,
            delay: Math.random() * 2,
        })), []
    );

    useEffect(() => {
        if (isOpen) {
            // Fade in
            setPhase("entering");
            setOpacity(0);

            requestAnimationFrame(() => {
                setOpacity(1);
                setPhase("gift");
            });

            // Sonuç kartı açılıyor
            const timer = setTimeout(() => setPhase("reveal"), 1200);

            return () => {
                clearTimeout(timer);
            };
        } else {
            setPhase("entering");
            setOpacity(0);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden transition-opacity duration-500"
            style={{ opacity }}
        >
            {/* Arka plan - gradient gece gökyüzü */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#050a15] via-[#0f1f35] to-[#1a3050]" />

            {/* Aurora efekti */}
            <div className="absolute inset-0 aurora-effect pointer-events-none" />

            {/* Kar efekti */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {snowflakes.map((flake) => (
                    <div
                        key={flake.id}
                        className="snowflake-smooth"
                        style={{
                            left: `${flake.left}%`,
                            animationDelay: `${flake.delay}s`,
                            animationDuration: `${flake.duration}s`,
                            fontSize: `${flake.size}rem`,
                        }}
                    >
                        ❄️
                    </div>
                ))}
            </div>

            {/* Yıldızlar */}
            <div className="absolute inset-0 pointer-events-none">
                {stars.map((star) => (
                    <div
                        key={star.id}
                        className="star-smooth"
                        style={{
                            left: `${star.left}%`,
                            top: `${star.top}%`,
                            fontSize: `${star.size}rem`,
                            animationDelay: `${star.delay}s`,
                        }}
                    >
                        {star.id % 3 === 0 ? "⭐" : "✨"}
                    </div>
                ))}
            </div>

            {/* Düşen Hediye - Akışkan geçiş */}
            <div className={`gift-smooth ${phase === "gift" ? "gift-drop" : phase === "reveal" ? "gift-vanish" : "gift-hidden"}`}>
                <span className="text-[140px] drop-shadow-2xl">🎁</span>
                <div className="sparkles">
                    {["✨", "⭐", "✨", "⭐"].map((s, i) => (
                        <span key={i} className="sparkle" style={{ '--i': i } as React.CSSProperties}>{s}</span>
                    ))}
                </div>
            </div>

            {/* Sonuç Kartı - Yumuşak giriş */}
            <div className={`result-smooth ${phase === "reveal" ? "result-show" : "result-hidden"}`}>
                <div className="result-card-smooth">
                    <div className="text-5xl mb-3 celebration-bounce">🎉</div>
                    <div className="number-smooth">
                        #{giftNumber}
                    </div>
                    <div className="text-2xl md:text-3xl text-white font-semibold my-4 px-4 name-fade">
                        {giftName}
                    </div>
                    <button
                        onClick={onClose}
                        className="button-smooth"
                    >
                        Tamam ✓
                    </button>
                </div>
            </div>
        </div>
    );
}
