// Alkış sesi çal
export function calPatlamaSesi() {
  try {
    const alkis = new Audio("/sounds/alkis.mp3");
    alkis.volume = 0.7;
    alkis.play().catch(() => {
      // Ses çalamazsa sessizce devam et
    });
  } catch {
    // Hata durumunda sessizce devam et
  }
}
