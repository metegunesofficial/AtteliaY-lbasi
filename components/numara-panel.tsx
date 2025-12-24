"use client";

import { useState } from "react";

interface NumaraPanelProps {
  cekilenNumara: number | null;
  kullanilanNumaralar: number[];
  onNumaraKaydet: (deger: number) => void;
  uyari: string | null;
}

// Fanustan çekilen numarayı alan basit giriş alanı
export function NumaraPanel({
  cekilenNumara,
  kullanilanNumaralar,
  onNumaraKaydet,
  uyari
}: NumaraPanelProps) {
  const [gecici, setGecici] = useState("");

  const gonder = () => {
    const sayi = Number(gecici);
    if (!Number.isInteger(sayi)) return;
    onNumaraKaydet(sayi);
  };

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-slate-700/70 bg-slate-900/70 p-4">
      <div className="flex items-center gap-3">
        <input
          value={gecici}
          onChange={(e) => setGecici(e.target.value)}
          placeholder="Çekilen numara (1-170)"
          className="w-40 rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm outline-none focus:border-atteliaGold"
          inputMode="numeric"
        />
        <button
          type="button"
          onClick={gonder}
          className="rounded-lg bg-atteliaGreen px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
        >
          Kaydet
        </button>
        <div className="text-xs text-slate-300">
          Toplam çekilen: {kullanilanNumaralar.length}/170
        </div>
      </div>
      <div className="text-xs text-atteliaGold">
        Aktif numara: {cekilenNumara ?? "Seçilmedi"}
      </div>
      {uyari ? (
        <div className="text-xs text-atteliaRed">{uyari}</div>
      ) : null}
    </div>
  );
}
