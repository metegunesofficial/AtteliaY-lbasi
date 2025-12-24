import confetti from "canvas-confetti";

// Kart açıldığında gösterişli konfeti patlaması
export function patlatKonfeti() {
  // İlk patlama - merkez
  confetti({
    particleCount: 150,
    spread: 100,
    startVelocity: 50,
    scalar: 1.2,
    origin: { x: 0.5, y: 0.5 },
    colors: ['#fbbf24', '#ef4444', '#22c55e', '#3b82f6', '#f97316', '#ec4899']
  });

  // İkinci patlama - soldan
  setTimeout(() => {
    confetti({
      particleCount: 80,
      spread: 60,
      startVelocity: 40,
      origin: { x: 0.3, y: 0.6 },
      colors: ['#fbbf24', '#ef4444', '#22c55e']
    });
  }, 200);

  // Üçüncü patlama - sağdan
  setTimeout(() => {
    confetti({
      particleCount: 80,
      spread: 60,
      startVelocity: 40,
      origin: { x: 0.7, y: 0.6 },
      colors: ['#3b82f6', '#f97316', '#ec4899']
    });
  }, 400);
}
