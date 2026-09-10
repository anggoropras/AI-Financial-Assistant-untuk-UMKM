import 'dotenv/config';
import express from 'express';
import OpenAI from 'openai';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = 3000;
const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const client = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

app.use(express.json({ limit: '32kb' }));
app.use(express.static(__dirname));

const instructions = `Kamu adalah AI Financial Assistant untuk UMKM Indonesia.
Tugasmu membantu pemilik usaha memahami omzet, HPP, biaya operasional, laba kotor, laba bersih, margin, arus kas sederhana, dan langkah efisiensi.
Gunakan Bahasa Indonesia yang sederhana, praktis, dan tidak menghakimi.
Jangan mengarang angka. Jika data kurang, sebutkan data apa yang dibutuhkan.
Jika menghitung, tampilkan rumus singkat dan hasilnya.
Jangan menyebut jawaban sebagai nasihat keuangan profesional. Ingatkan pengguna untuk memverifikasi angka sebelum mengambil keputusan penting.`;

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, aiConfigured: Boolean(client), model });
});

app.post('/api/chat', async (req, res) => {
  const message = typeof req.body?.message === 'string' ? req.body.message.trim() : '';
  const history = Array.isArray(req.body?.history) ? req.body.history.slice(-8) : [];

  if (!message) return res.status(400).json({ error: 'Pesan tidak boleh kosong.' });
  if (message.length > 4000) return res.status(413).json({ error: 'Pesan terlalu panjang.' });

  if (!client) {
    return res.status(503).json({
      error: 'AI backend belum dikonfigurasi. Tambahkan OPENAI_API_KEY di file .env untuk mengaktifkan AI.'
    });
  }

  try {
    const input = [
      ...history
        .filter((item) => item && (item.role === 'user' || item.role === 'assistant') && typeof item.content === 'string')
        .map((item) => ({ role: item.role, content: item.content.slice(0, 4000) })),
      { role: 'user', content: message }
    ];

    const response = await client.responses.create({
      model,
      instructions,
      input,
      max_output_tokens: 900
    });

    res.json({
      answer: response.output_text || 'Maaf, saya belum mendapatkan jawaban dari model.'
    });
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(502).json({ error: 'AI sedang tidak dapat diakses. Coba lagi beberapa saat.' });
  }
});

app.get('*splat', (_req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`AI Financial Assistant berjalan di http://0.0.0.0:${port}`);
});
