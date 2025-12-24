// Bir hediye kartının temel bilgilerini tutan tip
export interface Hediye {
  // Kartın benzersiz numarası (1–170 arası olacak)
  id: number;
  // Hediye adı (örneğin: "İstanbul Tatil Paketi")
  ad: string;
  // 1 = küçük, 2 = orta, 3 = büyük hediye
  seviye: 1 | 2 | 3;
  // Kart salon içinde açıldı mı?
  acildiMi: boolean;
  // Bu hediyeyi kazanan kişinin çektiği numara (örneğin: 57)
  alanNumara?: number;
}
