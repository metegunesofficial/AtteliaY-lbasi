import type { Hediye } from "@/types/hediye";

interface HediyeKartiProps {
  hediye: Hediye;
  // Kart tıklandığında dışarıya haber veren fonksiyon
  onAc?: (hediye: Hediye) => void;
}

// Kartın hem kapalı hem de açık halini çizen basit bileşen
export function HediyeKarti({ hediye, onAc }: HediyeKartiProps) {
  const seviyeRengi =
    hediye.seviye === 3
      ? "border-atteliaGold"
      : hediye.seviye === 2
        ? "border-atteliaRed"
        : "border-atteliaGreen";

  return (
    <div
      onClick={() => {
        if (!hediye.acildiMi && onAc) {
          onAc(hediye);
        }
      }}
      className={`relative flex aspect-[3/4] cursor-pointer items-center justify-center rounded-xl border-2 ${seviyeRengi} bg-slate-800/80 shadow-md shadow-slate-900/70 transition-transform hover:-translate-y-1 hover:scale-105`}
    >
      {hediye.acildiMi ? (
        <div className="pointer-events-none select-none px-2 text-center">
          <div className="text-[10px] uppercase tracking-[0.25em] text-slate-300">
            ATTELIA
          </div>
          <div className="mt-2 text-sm font-semibold text-atteliaGold">
            {hediye.ad}
          </div>
          <div className="mt-1 text-xs text-slate-200">
            Numara: {hediye.alanNumara ?? "?"}
          </div>
        </div>
      ) : (
        <div className="pointer-events-none select-none text-center">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-300">
            ATTELIA
          </div>
          <div className="mt-2 text-sm font-semibold text-slate-100">
            Sürpriz Hediye
          </div>
        </div>
      )}
    </div>
  );
}
