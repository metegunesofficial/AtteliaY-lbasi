# GitHub'a push script'i
$projeDizini = "C:\Users\pc\Desktop\Yılbaşı Çekilişi"

if (Test-Path $projeDizini) {
    Write-Host "Proje dizini bulundu: $projeDizini"
    Set-Location $projeDizini

    # Eski git deposunu temizle
    if (Test-Path ".git") {
        Remove-Item ".git" -Recurse -Force
    }

    # Git deposu başlat
    git init
    Write-Host "Git deposu başlatıldı"

    # Dosyaları ekle
    git add .
    Write-Host "Dosyalar staging'e eklendi"

    # Commit yap
    git commit -m "İlk commit: Yılbaşı Çekilişi projesi"
    Write-Host "Commit yapıldı"

    # Remote ekle
    git remote add origin https://github.com/metegunesofficial/AtteliaY-lbasi.git
    Write-Host "Remote repository eklendi"

    # Branch'i main yap
    git branch -M main
    Write-Host "Branch main olarak ayarlandı"

    # Push et
    git push -u origin main
    Write-Host "GitHub'a push edildi"
} else {
    Write-Host "Proje dizini bulunamadı: $projeDizini"
}
