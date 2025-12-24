import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "ATTELIA Yılbaşı Çekilişi",
  description: "ATTELIA New Year Gala hediye çekiliş oyunu"
};

// Uygulamanın temel iskeletini kuran layout bileşeni
export default function RootLayout({
  children
}: {
  children: ReactNode;
}) {
  return (
    <html lang="tr">
      <body className="min-h-screen bg-slate-900 text-slate-100">
        {children}
      </body>
    </html>
  );
}


