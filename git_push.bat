@echo off
cd /d "C:\Users\pc\Desktop\Yılbaşı Çekilişi"
if %errorlevel% neq 0 (
    echo Proje dizini bulunamadi
    pause
    exit /b 1
)

echo Proje dizinine gecildi
echo.

if exist .git (
    rmdir /s /q .git
    echo Eski git deposu silindi
)

git init
echo Git deposu baslatildi

git add .
echo Dosyalar staging'e eklendi

git commit -m "Ilk commit: Yilbasi Cekilisi projesi"
echo Commit yapildi

git remote add origin https://github.com/metegunesofficial/AtteliaY-lbasi.git
echo Remote repository eklendi

git branch -M main
echo Branch main olarak ayarlandi

git push -u origin main
echo GitHub'a push edildi

echo.
echo Islem tamamlandi!
pause
