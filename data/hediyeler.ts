// 30 hediyeyi tanımlayan liste
export interface Hediye {
  id: number;
  ad: string;
  // Kart açıldı mı?
  acildiMi: boolean;
  // Açıldığında çıkan rastgele numara (1-170)
  cekilenNumara?: number;
}

// 30 hediye listesi - istersen buraya gerçek hediye isimlerini yazabilirsin
export const hediyeler: Hediye[] = [
  { id: 1, ad: "11 Lux Hastane", acildiMi: false },
  { id: 2, ad: "Fam Dental", acildiMi: false },
  { id: 3, ad: "BuggingFace", acildiMi: false },
  { id: 4, ad: "Xilo", acildiMi: false },
  { id: 5, ad: "Mistral", acildiMi: false },
  { id: 6, ad: "Cubig", acildiMi: false },
  { id: 7, ad: "Railway", acildiMi: false },
  { id: 8, ad: "Browserbase", acildiMi: false },
  { id: 9, ad: "Blackbox AI", acildiMi: false },
  { id: 10, ad: "Resart", acildiMi: false },
  { id: 11, ad: "Recall", acildiMi: false },
  { id: 12, ad: "Gas", acildiMi: false },
  { id: 13, ad: "Lovable", acildiMi: false },
  { id: 14, ad: "Mixxi", acildiMi: false },
  { id: 15, ad: "Firecrawi", acildiMi: false },
  { id: 16, ad: "LemonAIde", acildiMi: false },
  { id: 17, ad: "Nebius", acildiMi: false },
  { id: 18, ad: "Daytona", acildiMi: false },
  { id: 19, ad: "Head", acildiMi: false },
  { id: 20, ad: "Cloudflare", acildiMi: false },
  { id: 21, ad: "SweetElise", acildiMi: false },
  { id: 22, ad: "v0", acildiMi: false },
  { id: 23, ad: "T23", acildiMi: false },
  { id: 24, ad: "Groal", acildiMi: false },
  { id: 25, ad: "Convex", acildiMi: false },
  { id: 26, ad: "Hediye 26", acildiMi: false },
  { id: 27, ad: "Hediye 27", acildiMi: false },
  { id: 28, ad: "Hediye 28", acildiMi: false },
  { id: 29, ad: "Hediye 29", acildiMi: false },
  { id: 30, ad: "Hediye 30", acildiMi: false },
];
