import * as XLSX from "xlsx";
import { Hediye } from "@/data/hediyeler";

// Açılan kartları Excel dosyasına export et
export function exportToExcel(hediyeler: Hediye[]) {
    // Sadece açılmış kartları filtrele
    const acilanlar = hediyeler.filter((h) => h.acildiMi);

    if (acilanlar.length === 0) {
        alert("Henüz açılmış kart yok!");
        return;
    }

    // Excel için veri hazırla
    const data = acilanlar.map((h, index) => ({
        "Sıra": index + 1,
        "Kart No": h.id,
        "Çekilen Numara": h.cekilenNumara,
        "Hediye Adı": h.ad,
        "Tarih": new Date().toLocaleString("tr-TR"),
    }));

    // Worksheet oluştur
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Sütun genişliklerini ayarla
    worksheet["!cols"] = [
        { wch: 6 },  // Sıra
        { wch: 10 }, // Kart No
        { wch: 15 }, // Çekilen Numara
        { wch: 25 }, // Hediye Adı
        { wch: 20 }, // Tarih
    ];

    // Workbook oluştur
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Cekilis Sonuclari");

    // Dosya adı oluştur
    const tarih = new Date().toISOString().split("T")[0];
    const dosyaAdi = `Attelia_Cekilis_${tarih}.xlsx`;

    // Blob olarak kaydet ve indir
    const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

    // Download link oluştur
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = dosyaAdi;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Excel dosyasından import et
export interface ImportResult {
    hediyeler: Hediye[];
    kullanilanNumaralar: number[];
    success: boolean;
    message: string;
}

export function importFromExcel(file: File, mevcutHediyeler: Hediye[]): Promise<ImportResult> {
    return new Promise((resolve) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: "array" });

                // İlk sheet'i al
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];

                // JSON'a çevir
                const jsonData = XLSX.utils.sheet_to_json(worksheet) as Array<{
                    "Kart No"?: number;
                    "Çekilen Numara"?: number;
                    "Hediye Adı"?: string;
                }>;

                if (jsonData.length === 0) {
                    resolve({
                        hediyeler: mevcutHediyeler,
                        kullanilanNumaralar: [],
                        success: false,
                        message: "Excel dosyası boş!",
                    });
                    return;
                }

                // Hediye listesini güncelle
                const yeniHediyeler = [...mevcutHediyeler];
                const kullanilanNumaralar: number[] = [];

                jsonData.forEach((row) => {
                    const kartNo = row["Kart No"];
                    const cekilenNumara = row["Çekilen Numara"];

                    if (kartNo && cekilenNumara) {
                        const index = yeniHediyeler.findIndex((h) => h.id === kartNo);
                        if (index !== -1) {
                            yeniHediyeler[index] = {
                                ...yeniHediyeler[index],
                                acildiMi: true,
                                cekilenNumara: cekilenNumara,
                            };
                            kullanilanNumaralar.push(cekilenNumara);
                        }
                    }
                });

                resolve({
                    hediyeler: yeniHediyeler,
                    kullanilanNumaralar,
                    success: true,
                    message: `${jsonData.length} kayıt başarıyla import edildi!`,
                });
            } catch {
                resolve({
                    hediyeler: mevcutHediyeler,
                    kullanilanNumaralar: [],
                    success: false,
                    message: "Excel dosyası okunamadı!",
                });
            }
        };

        reader.onerror = () => {
            resolve({
                hediyeler: mevcutHediyeler,
                kullanilanNumaralar: [],
                success: false,
                message: "Dosya okunamadı!",
            });
        };

        reader.readAsArrayBuffer(file);
    });
}
