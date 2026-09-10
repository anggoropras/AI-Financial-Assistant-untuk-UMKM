# AI Financial Assistant untuk UMKM

Aplikasi asisten keuangan untuk membantu pelaku UMKM memahami omzet, HPP, biaya, laba, margin, dan mengambil langkah awal berdasarkan data yang mereka masukkan.

## Fitur

- Chat interface untuk pertanyaan keuangan UMKM.
- Integrasi AI generatif melalui backend Node.js.
- Perhitungan laba kotor, laba bersih, dan margin.
- Visualisasi sederhana komposisi biaya.
- Fallback analisis lokal jika backend AI belum tersedia.
- Light/Dark mode.
- API key tetap berada di server dan tidak dikirim ke browser.

## Teknologi

- HTML5
- CSS3
- JavaScript (Vanilla)
- Node.js + Express
- OpenAI Responses API

## Menjalankan lokal

1. Pastikan Node.js 20+ terpasang.
2. Salin `.env.example` menjadi `.env`.
3. Isi `OPENAI_API_KEY` pada `.env`.
4. Install dependency:

```bash
npm install
```

5. Jalankan:

```bash
npm start
```

6. Buka `http://localhost:3000`.

Jika `OPENAI_API_KEY` belum diisi, aplikasi tetap dapat memakai analisis keuangan berbasis aturan sebagai fallback.

## Environment

```text
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-5.6-luna
PORT=3000
```

Jangan commit file `.env` atau API key ke GitHub.

## Struktur

```text
.
├── index.html
├── style.css
├── script.js
├── server.js
├── package.json
├── .env.example
├── README.md
├── LICENSE
└── .gitignore
```

## Status

Prototype sudah memiliki frontend chat dan backend AI. Tahap berikutnya dapat mencakup database transaksi, autentikasi pengguna, laporan laba/rugi, arus kas, ekspor laporan, dan deployment publik.

## Lisensi

MIT
