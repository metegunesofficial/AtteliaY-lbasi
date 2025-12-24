"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { hediyeler as varsayilanHediyeler, Hediye } from "@/data/hediyeler";
import { patlatKonfeti } from "@/lib/konfeti";
import { calPatlamaSesi } from "@/lib/ses";
import { exportToExcel, importFromExcel } from "@/lib/excel-export";

// Three.js componenti dinamik yükle (SSR sorunlarını önlemek için)
const GiftPopup3D = dynamic(
  () => import("@/components/gift-popup-3d").then((mod) => mod.GiftPopup3D),
  { ssr: false }
);

// Kar taneleri için rastgele pozisyon
const karTaneleri = Array.from({ length: 120 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  delay: Math.random() * 5,
  size: Math.random() * 0.6 + 0.4,
  duration: Math.random() * 3 + 5,
}));

// Yıldızlar için pozisyon
const yildizlar = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  top: Math.random() * 35,
  size: Math.random() * 1.5 + 0.5,
  delay: Math.random() * 3,
}));

// Rastgele yayılmış Noel ikonları
const noelIkonlari = [
  { id: 1, emoji: "🎄", left: 5, top: 15, size: 2.5 },
  { id: 2, emoji: "⛄", left: 92, top: 12, size: 2 },
  { id: 3, emoji: "🦌", left: 15, top: 40, size: 1.8 },
  { id: 4, emoji: "🎅", left: 88, top: 35, size: 2.2 },
  { id: 5, emoji: "🎁", left: 8, top: 65, size: 1.6 },
  { id: 6, emoji: "❄️", left: 95, top: 55, size: 1.5 },
  { id: 7, emoji: "🔔", left: 3, top: 85, size: 1.8 },
  { id: 8, emoji: "🌟", left: 90, top: 75, size: 1.7 },
  { id: 9, emoji: "🎀", left: 12, top: 25, size: 1.4 },
  { id: 10, emoji: "🍬", left: 85, top: 22, size: 1.3 },
  { id: 11, emoji: "🛷", left: 7, top: 50, size: 1.6 },
  { id: 12, emoji: "✨", left: 93, top: 45, size: 1.5 },
  { id: 13, emoji: "🕯️", left: 4, top: 75, size: 1.4 },
  { id: 14, emoji: "🧦", left: 88, top: 85, size: 1.5 },
  { id: 15, emoji: "🌙", left: 50, top: 5, size: 2 },
  { id: 16, emoji: "⭐", left: 25, top: 8, size: 1.6 },
  { id: 17, emoji: "💫", left: 75, top: 6, size: 1.4 },
  { id: 18, emoji: "🎊", left: 10, top: 55, size: 1.3 },
  { id: 19, emoji: "🎉", left: 91, top: 65, size: 1.4 },
  { id: 20, emoji: "❤️", left: 6, top: 35, size: 1.2 },
];

export default function HomePage() {
  const [hediyeler, setHediyeler] = useState<Hediye[]>(varsayilanHediyeler);
  const [kullanilanNumaralar, setKullanilanNumaralar] = useState<number[]>([]);
  const [sonAcilanKart, setSonAcilanKart] = useState<Hediye | null>(null);
  const [animasyonAktif, setAnimasyonAktif] = useState(false);

  // 3D Pop-up için state
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupData, setPopupData] = useState<{ number: number; name: string; hediyeId: number } | null>(null);
  const [bekleyenAcilis, setBekleyenAcilis] = useState<{ id: number; numara: number } | null>(null);

  // localStorage'dan yükle
  useEffect(() => {
    const kayit = localStorage.getItem("attelia-hediyeler-v2");
    const nums = localStorage.getItem("attelia-numaralar-v2");
    if (kayit) setHediyeler(JSON.parse(kayit));
    if (nums) setKullanilanNumaralar(JSON.parse(nums));
  }, []);

  // localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem("attelia-hediyeler-v2", JSON.stringify(hediyeler));
    localStorage.setItem("attelia-numaralar-v2", JSON.stringify(kullanilanNumaralar));
  }, [hediyeler, kullanilanNumaralar]);

  // Rastgele numara üret (1-170 arası, daha önce kullanılmamış)
  const rastgeleNumaraUret = (): number => {
    const mevcutNumaralar = Array.from({ length: 170 }, (_, i) => i + 1);
    const bos = mevcutNumaralar.filter((n) => !kullanilanNumaralar.includes(n));
    if (bos.length === 0) return Math.floor(Math.random() * 170) + 1;
    return bos[Math.floor(Math.random() * bos.length)];
  };

  // Kart açma işlemi
  const kartAc = (hedef: Hediye) => {
    if (hedef.acildiMi || animasyonAktif) return;

    setAnimasyonAktif(true);
    const yeniNumara = rastgeleNumaraUret();

    // Numarayı kaydet ama kartı henüz açma
    setKullanilanNumaralar((prev) => [...prev, yeniNumara]);
    setBekleyenAcilis({ id: hedef.id, numara: yeniNumara });

    // 3D Pop-up aç
    setPopupData({ number: yeniNumara, name: hedef.ad, hediyeId: hedef.id });
    setPopupOpen(true);

    // Konfeti patlat ve ses çal
    patlatKonfeti();
    calPatlamaSesi();
  };

  // Pop-up kapatıldığında kartı aç
  const handlePopupClose = () => {
    if (bekleyenAcilis) {
      // Şimdi kartı aç
      const yeniHediyeler = hediyeler.map((h) =>
        h.id === bekleyenAcilis.id ? { ...h, acildiMi: true, cekilenNumara: bekleyenAcilis.numara } : h
      );
      setHediyeler(yeniHediyeler);

      const hedef = hediyeler.find(h => h.id === bekleyenAcilis.id);
      if (hedef) {
        setSonAcilanKart({ ...hedef, acildiMi: true, cekilenNumara: bekleyenAcilis.numara });
      }
      setBekleyenAcilis(null);
    }

    setPopupOpen(false);
    setPopupData(null);
    setAnimasyonAktif(false);
  };

  // Sıfırla
  const sifirla = () => {
    setHediyeler(varsayilanHediyeler.map((h) => ({ ...h, acildiMi: false, cekilenNumara: undefined })));
    setKullanilanNumaralar([]);
    setSonAcilanKart(null);
    localStorage.removeItem("attelia-hediyeler-v2");
    localStorage.removeItem("attelia-numaralar-v2");
  };

  // File input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Excel import handler
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = await importFromExcel(file, hediyeler);

    if (result.success) {
      setHediyeler(result.hediyeler);
      setKullanilanNumaralar(prev => [...prev, ...result.kullanilanNumaralar]);
      alert(result.message);
    } else {
      alert(result.message);
    }

    // Input'u sıfırla
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const acilanKartSayisi = hediyeler.filter((h) => h.acildiMi).length;

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* 3D Hediye Pop-up */}
      {popupData && (
        <GiftPopup3D
          isOpen={popupOpen}
          onClose={handlePopupClose}
          giftNumber={popupData.number}
          giftName={popupData.name}
        />
      )}

      {/* Gece Gökyüzü Arka Plan */}
      <div className="pixel-background absolute inset-0" />

      {/* Yıldızlar */}
      <div className="stars-layer absolute inset-0 pointer-events-none">
        {yildizlar.map((yildiz) => (
          <div
            key={yildiz.id}
            className="star absolute"
            style={{
              left: `${yildiz.left}%`,
              top: `${yildiz.top}%`,
              fontSize: `${yildiz.size}rem`,
              animationDelay: `${yildiz.delay}s`,
            }}
          >
            {yildiz.id % 3 === 0 ? "⭐" : "✨"}
          </div>
        ))}
      </div>

      {/* Kar Yağışı */}
      <div className="snowfall absolute inset-0 pointer-events-none overflow-hidden">
        {karTaneleri.map((kar) => (
          <div
            key={kar.id}
            className="snowflake"
            style={{
              left: `${kar.left}%`,
              animationDelay: `${kar.delay}s`,
              animationDuration: `${kar.duration}s`,
              fontSize: `${kar.size}rem`,
            }}
          >
            ❄️
          </div>
        ))}
      </div>

      {/* Rastgele Noel İkonları */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-5">
        {noelIkonlari.map((ikon) => (
          <div
            key={ikon.id}
            className="absolute animate-float-slow"
            style={{
              left: `${ikon.left}%`,
              top: `${ikon.top}%`,
              fontSize: `${ikon.size}rem`,
              opacity: 0.7,
            }}
          >
            {ikon.emoji}
          </div>
        ))}
      </div>

      {/* Sol Dekorasyon */}
      <div className="absolute left-0 bottom-0 w-1/4 h-full pointer-events-none hidden lg:block z-20">
        <div className="absolute bottom-28 left-6">
          <span className="text-9xl animate-wiggle drop-shadow-lg">⛄</span>
        </div>
        <div className="absolute bottom-24 left-40">
          <span className="text-6xl animate-wiggle delay-500">⛄</span>
        </div>
        <div className="absolute bottom-20 left-56">
          <span className="text-5xl animate-wiggle delay-300">⛄</span>
        </div>
        <div className="absolute bottom-32 left-24">
          <span className="text-4xl animate-wiggle delay-700">⛄</span>
        </div>
        <div className="absolute bottom-24 left-52 text-7xl animate-sway">🎄</div>
        <div className="absolute bottom-20 left-8 text-5xl">🎁</div>
        <div className="absolute bottom-16 left-20 text-4xl">🎁</div>
        <div className="absolute bottom-24 left-28 text-3xl">🎁</div>
        <div className="absolute bottom-18 left-44 text-4xl">🎀</div>
        <div className="absolute bottom-32 left-4 text-4xl rotate-45">🍬</div>
      </div>

      {/* Sağ Dekorasyon */}
      <div className="absolute right-0 bottom-0 w-1/4 h-full pointer-events-none hidden lg:block z-20">
        <div className="absolute bottom-20 right-4">
          <span className="text-9xl animate-glow drop-shadow-2xl">🎄</span>
        </div>
        <div className="absolute bottom-24 right-40 text-6xl animate-glow delay-500">🎄</div>
        <div className="absolute bottom-28 right-20">
          <span className="text-7xl animate-wiggle">⛄</span>
        </div>
        <div className="absolute bottom-24 right-52">
          <span className="text-5xl animate-wiggle delay-400">⛄</span>
        </div>
        <div className="absolute bottom-20 right-60">
          <span className="text-4xl animate-wiggle delay-600">⛄</span>
        </div>
        <div className="absolute top-20 right-12 text-5xl animate-twinkle">⭐</div>
        <div className="absolute top-28 right-28 text-3xl animate-twinkle delay-300">✨</div>
        <div className="absolute top-16 right-40 text-4xl animate-twinkle delay-700">⭐</div>
        <div className="absolute bottom-28 right-36">
          <span className="text-7xl animate-run">🦌</span>
        </div>
        <div className="absolute bottom-16 right-12 text-5xl">🎁</div>
        <div className="absolute bottom-20 right-24 text-4xl">🎁</div>
        <div className="absolute bottom-12 right-36 text-3xl">🎁</div>
        <div className="absolute bottom-24 right-48 text-4xl">🎀</div>
        <div className="absolute bottom-16 right-56 text-3xl">🎁</div>
        <div className="absolute top-48 right-6">
          <span className="text-6xl animate-float">🎅</span>
        </div>
      </div>

      {/* Ana İçerik */}
      <div className="relative z-10 flex flex-col items-center min-h-screen py-8 px-4">
        {/* Header */}
        <header className="mb-6 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-yellow-300 drop-shadow-lg pixel-text">
            ATTELIA
          </h1>
        </header>

        {/* Kart Grid */}
        <div className="calendar-container p-6 rounded-xl mb-6 relative">
          <div className="absolute -top-5 -left-5 text-4xl animate-pulse">🎀</div>
          <div className="absolute -top-5 -right-5 text-4xl animate-pulse delay-500">🎀</div>
          <div className="absolute -bottom-5 -left-5 text-4xl animate-pulse delay-300">🔔</div>
          <div className="absolute -bottom-5 -right-5 text-4xl animate-pulse delay-700">🔔</div>

          <div className="grid grid-cols-5 md:grid-cols-6 gap-3">
            {hediyeler.map((hediye) => {
              // Tek tip tasarım - Kutu 1 stili
              const design = { bg: "from-red-600 to-red-800", ribbon: "from-yellow-400 to-yellow-600", icon: "🎄" };

              return (
                <div
                  key={hediye.id}
                  onClick={() => kartAc(hediye)}
                  className={`gift-box-new relative aspect-square cursor-pointer transition-all duration-300 ${hediye.acildiMi ? "opened" : "hover:scale-110 hover:-translate-y-2 hover:rotate-3"
                    } ${animasyonAktif && !hediye.acildiMi ? "pointer-events-none" : ""}`}
                >
                  {hediye.acildiMi ? (
                    <div className={`gift-box-opened bg-gradient-to-br ${design.bg} rounded-lg h-full w-full relative overflow-hidden shadow-lg`}>
                      {/* Açık kutu gövdesi */}
                      <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-br from-black/20 to-black/40 rounded-b-lg" />

                      {/* Açık kapak - yukarda */}
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-[90%] h-4 bg-gradient-to-r from-black/30 via-black/20 to-black/30 rounded-t-lg transform -rotate-12 origin-bottom-left" />

                      {/* Işıltı */}
                      <div className="absolute inset-0 bg-gradient-to-t from-yellow-400/30 via-transparent to-transparent" />

                      {/* Kazanan numara */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-2xl md:text-3xl font-bold text-yellow-300 drop-shadow-lg">
                          #{hediye.cekilenNumara}
                        </div>
                        <div className="text-[10px] md:text-xs text-white text-center mt-1 leading-tight px-1 drop-shadow font-semibold">
                          {hediye.ad}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className={`gift-box-closed bg-gradient-to-br ${design.bg} rounded-lg h-full w-full relative overflow-hidden shadow-lg`}>
                      {/* Parıltı efekti */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-transparent" />

                      {/* Yatay kurdele */}
                      <div className={`absolute top-1/2 left-0 right-0 h-3 -translate-y-1/2 bg-gradient-to-r ${design.ribbon} shadow-md`} />

                      {/* Dikey kurdele */}
                      <div className={`absolute left-1/2 top-0 bottom-0 w-3 -translate-x-1/2 bg-gradient-to-b ${design.ribbon} shadow-md`} />

                      {/* Fiyonk */}
                      <div className="absolute top-1 left-1/2 -translate-x-1/2 z-10">
                        <div className="relative">
                          <span className="text-2xl drop-shadow-lg">🎀</span>
                        </div>
                      </div>

                      {/* Dekoratif ikon */}
                      <div className="absolute bottom-1 right-1 text-lg opacity-60">
                        {design.icon}
                      </div>

                      {/* Işıltı partikülleri */}
                      <div className="absolute top-2 right-2 text-xs animate-pulse">✨</div>
                      <div className="absolute bottom-2 left-2 text-xs animate-pulse delay-500">✨</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Alt Bilgi - Sadece Butonlar */}
        <div className="flex flex-col items-center gap-3">
          {/* Gizli file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImport}
            accept=".xlsx,.xls"
            className="hidden"
          />

          {/* Butonlar */}
          <div className="flex gap-3 mt-4 flex-wrap justify-center">
            <button
              onClick={() => exportToExcel(hediyeler)}
              className="excel-btn px-6 py-2 rounded-lg text-white font-semibold transition hover:brightness-110 flex items-center gap-2"
            >
              <span>📤</span> Excel&apos;e Aktar
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="import-btn px-6 py-2 rounded-lg text-white font-semibold transition hover:brightness-110 flex items-center gap-2 bg-blue-600 hover:bg-blue-500"
            >
              <span>📥</span> Excel&apos;den Yükle
            </button>
            <button
              onClick={sifirla}
              className="reset-btn px-6 py-2 rounded-lg text-white font-semibold transition hover:brightness-110 flex items-center gap-2"
            >
              <span>🔄</span> Sıfırla
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
