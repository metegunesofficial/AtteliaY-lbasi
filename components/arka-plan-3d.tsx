"use client";

// Alternatif CSS bazlı animasyonlu arka plan
export function ArkaPlan3D() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden opacity-60">
      {/* Dönen gradient orta kutu */}
      <div
        className="relative w-40 h-40"
        style={{
          animation: "spin 12s linear infinite"
        }}
      >
        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)",
            boxShadow: "0 0 80px rgba(251, 191, 36, 0.5), inset 0 0 20px rgba(255,255,255,0.2)"
          }}
        />
        {/* Kurdele efekti */}
        <div
          className="absolute inset-0 flex items-center justify-center"
        >
          <div
            className="absolute w-full h-4 rounded-full"
            style={{
              background: "linear-gradient(90deg, #dc2626 0%, #b91c1c 50%, #dc2626 100%)",
              top: "50%",
              transform: "translateY(-50%)"
            }}
          />
          <div
            className="absolute h-full w-4 rounded-full"
            style={{
              background: "linear-gradient(180deg, #dc2626 0%, #b91c1c 50%, #dc2626 100%)",
              left: "50%",
              transform: "translateX(-50%)"
            }}
          />
        </div>
      </div>

      {/* Parıltı efektleri */}
      <div className="absolute inset-0">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-yellow-300"
            style={{
              left: `${15 + (i % 4) * 25}%`,
              top: `${20 + Math.floor(i / 4) * 30}%`,
              animation: `pulse ${1.5 + (i * 0.2)}s ease-in-out infinite`,
              boxShadow: "0 0 10px rgba(251, 191, 36, 0.8)"
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); }
        }
      `}</style>
    </div>
  );
}
