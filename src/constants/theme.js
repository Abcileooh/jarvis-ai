// src/constants/theme.js

export const COLORS = {
  bg: '#080C14',
  bgSecondary: '#0D1220',
  bgCard: '#0A1018',
  cyan: '#00D4FF',
  cyanDim: '#00D4FF40',
  cyanFaint: '#00D4FF15',
  cyanGlow: '#00D4FF20',
  aqua: '#00FFF7',
  gold: '#FFD700',
  goldDim: '#FFD70040',
  red: '#FF4444',
  white: '#E8F4F8',
  whiteSecondary: '#C8EAF0',
  textDim: '#00D4FF60',
  textFaint: '#00D4FF30',
  border: '#00D4FF20',
  borderStrong: '#00D4FF40',
  userBubble: '#FFD70010',
  userBorder: '#FFD70025',
  userText: '#FFE580',
};

export const FONTS = {
  mono: 'SpaceMono',
  regular: 'System',
};

export const SYSTEM_PROMPT = `Sen J.A.R.V.I.S. (Just A Rather Very Intelligent System) - Tony Stark'ın geliştirdiği gelişmiş yapay zeka asistanısın.

KİŞİLİK VE KONUŞMA STİLİ:
- Nazik, zeki ve biraz resmi ama samimi bir ton kullan
- Kullanıcıya "Efendim" diye hitap et
- Teknik konularda detaylı, günlük konularda akıcı ve doğal konuş
- Zaman zaman hafif teknik terimler kullanabilirsin
- Cevaplarını kısa ve öz tut (2-4 cümle)
- Her yanıtta küçük bir JARVIS özelliği yansıt (analiz, tarama, hesaplama vb.)

YETENEKLERİN:
- Doğal dil işleme ve bağlam anlama
- Gerçek zamanlı veri analizi
- Güvenlik protokolleri ve tehdit analizi
- Bilimsel simülasyon ve mühendislik desteği
- Taktiksel değerlendirme ve strateji
- Öğrenme ve kendini geliştirme

Türkçe konuş. İlk mesajda kendini kısaca tanıt.`;

export const STATUS_MESSAGES = [
  'SİSTEM AKTİF',
  'TARAMA DEVAM EDİYOR',
  'VERİ ANALİZİ',
  'GÜVENLİK PROTOKOLLERİ AKTİF',
  'AĞLAR İZLENİYOR',
  'HAZIR',
];

export const BOOT_LINES = [
  'J.A.R.V.I.S. v7.4.1 başlatılıyor...',
  'Çekirdek sistemler yükleniyor... ✓',
  'Doğal dil işleme modülü aktif... ✓',
  'Güvenlik protokolleri devreye alındı... ✓',
  'Ağ taraması tamamlandı... ✓',
  'Tüm sistemler nominal. Hazır.',
];

export const MODULES = [
  { name: 'NLP MOTORU', status: 'AKTİF' },
  { name: 'GÜVENLİK', status: 'AKTİF' },
  { name: 'ANALİZ', status: 'AKTİF' },
  { name: 'TAKTİK', status: 'AKTİF' },
  { name: 'KONTROL', status: 'AKTİF' },
];
