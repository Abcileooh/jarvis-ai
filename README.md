# J.A.R.V.I.S. — React Native / Expo

Tony Stark'ın yapay zeka asistanı, Türkçe konuşan mobil uygulama.

---

## KURULUM (Adım Adım)

### 1. Node.js İndir
- https://nodejs.org → LTS sürümü indir ve kur

### 2. Expo Hesabı Oluştur
- https://expo.dev → ücretsiz kayıt

### 3. Dosyaları Yerleştir
Bu klasörün içindeki tüm dosyaları bir yere kopyalayın.

### 4. API Anahtarı Ekle
`app.json` dosyasını açın, şu satırı bulun:
```
"ANTHROPIC_API_KEY": "BURAYA_API_ANAHTARINIZI_YAZIN"
```
Kendi Anthropic API anahtarınızı yazın.
API anahtarı almak için: https://console.anthropic.com

### 5. Terminal/Komut İstemi Aç
Proje klasörüne gelin:
```bash
cd jarvis-app
```

### 6. Paketleri Kur
```bash
npm install
```

### 7. EAS CLI Kur
```bash
npm install -g eas-cli
eas login
```
Expo hesabınızla giriş yapın.

### 8. EAS Yapılandır
```bash
eas build:configure
```

### 9. APK Derle
```bash
eas build -p android --profile preview
```
Bu işlem 10-15 dakika sürebilir. Expo sunucularında derlenir.

### 10. APK İndir
- https://expo.dev/accounts → projenizi bulun → Build → APK'yı indirin

### 11. Telefona Kur
- APK dosyasını telefonunuza gönderin
- Ayarlar → Güvenlik → "Bilinmeyen kaynaklardan yüklemeye izin ver"
- APK'ya tıklayıp kurun

---

## HIZLI TEST (Telefon Olmadan)

Uygulamayı bilgisayarda test etmek için:
```bash
npm start
```
Çıkan QR kodu Expo Go uygulamasıyla (telefon) okutun.

---

## SORUN GİDERME

**"API anahtarı ayarlanmamış" hatası:**
→ app.json içindeki ANTHROPIC_API_KEY değerini güncelleyin.

**Build başarısız:**
→ `eas build:configure` tekrar çalıştırın.

**Uygulama açılmıyor:**
→ Telefonda "Bilinmeyen kaynaklar"a izin verildiğinden emin olun.

---

## PROJE YAPISI

```
jarvis-app/
├── App.js                    ← Giriş noktası
├── app.json                  ← Expo config + API key
├── eas.json                  ← Build config
├── package.json
└── src/
    ├── constants/
    │   └── theme.js          ← Renkler, sabitler
    ├── services/
    │   └── anthropic.js      ← Claude API bağlantısı
    ├── components/
    │   ├── HUDRing.js        ← Dönen halka animasyonu
    │   ├── RadarSweep.js     ← Radar tarama animasyonu
    │   ├── PulseDot.js       ← Yanıp sönen nokta
    │   ├── WaveBar.js        ← Ses dalgası animasyonu
    │   └── SystemStats.js    ← Canlı sistem istatistikleri
    └── screens/
        ├── BootScreen.js     ← Açılış animasyonu
        └── ChatScreen.js     ← Ana sohbet ekranı
```
