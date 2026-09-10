(() => {
  const chatArea = document.getElementById('chatArea');
  const input = document.getElementById('messageInput');
  const sendBtn = document.getElementById('sendBtn');
  const themeToggle = document.getElementById('themeToggle');
  const themeLabel = document.getElementById('themeLabel');
  const conversation = [];

  const rupiah = (value) => new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', maximumFractionDigits: 0
  }).format(value || 0);

  function normalizeNumber(value) {
    const raw = String(value).toLowerCase().replace(/rp\.?/g, '').replace(/\s/g, '');
    const unitMatch = raw.match(/(juta|jt|ribu|rb|k)$/);
    const unit = unitMatch?.[1];
    let numeric = unit ? raw.slice(0, -unit.length) : raw;
    numeric = numeric.replace(/\./g, '').replace(',', '.');
    const number = Number(numeric);
    if (!Number.isFinite(number)) return null;
    if (unit === 'juta' || unit === 'jt') return number * 1000000;
    if (unit === 'ribu' || unit === 'rb' || unit === 'k') return number * 1000;
    return number;
  }

  function extract(text, patterns) {
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        const number = normalizeNumber(match[1]);
        if (number !== null) return number;
      }
    }
    return 0;
  }

  function analyze(text) {
    const lower = text.toLowerCase();
    const revenue = extract(lower, [/(?:omzet|pendapatan|penjualan|revenue)[^0-9]*(\d[\d.,]*\s*(?:juta|jt|ribu|rb|k)?)/i]);
    const cost = extract(lower, [/(?:hpp|biaya barang|modal barang|harga pokok)[^0-9]*(\d[\d.,]*\s*(?:juta|jt|ribu|rb|k)?)/i]);
    const operating = extract(lower, [/(?:operasional|operasi|biaya operasional)[^0-9]*(\d[\d.,]*\s*(?:juta|jt|ribu|rb|k)?)/i]);
    const other = extract(lower, [/(?:lain-lain|lainnya|biaya lain)[^0-9]*(\d[\d.,]*\s*(?:juta|jt|ribu|rb|k)?)/i]);

    if (!revenue && !cost && !operating && !other) {
      return { type: 'help', html: '<div class="insight">Saya belum menemukan angka keuangan. Coba: <strong>“Omzet 10 juta, HPP 5 juta, operasional 2 juta, lain-lain 500 ribu.”</strong></div>' };
    }

    const gross = revenue - cost;
    const net = gross - operating - other;
    const margin = revenue ? (net / revenue) * 100 : 0;
    const totalExpense = cost + operating + other;
    const rows = [['HPP / biaya barang', cost], ['Operasional', operating], ['Lain-lain', other]];
    const bars = totalExpense ? rows.map(([name, value]) => `
      <div class="bar-row"><div class="bar-label">${name}</div><div class="bar-track"><div class="bar-fill expense" style="width:${Math.min(100, value / totalExpense * 100)}%"></div></div><div class="bar-val">${rupiah(value)}</div></div>`).join('') : '<div class="empty">Belum ada biaya yang dicatat.</div>';
    const tips = [];
    if (!revenue) tips.push('Tambahkan omzet agar margin bersih dapat dihitung dengan lebih bermakna.');
    else if (net < 0) tips.push('Usaha sedang mengalami rugi berdasarkan angka yang diberikan. Prioritaskan biaya terbesar dan evaluasi harga jual.');
    else if (margin < 10) tips.push('Margin bersih masih tipis. Cari biaya yang dapat ditekan tanpa mengganggu operasional utama.');
    else tips.push('Margin bersih positif. Pertahankan kontrol biaya dan cari peluang meningkatkan omzet.');
    if (revenue && cost / revenue > 0.6) tips.push('HPP menyerap lebih dari 60% omzet. Evaluasi harga pemasok, waste, dan harga jual.');
    if (revenue && operating / revenue > 0.2) tips.push('Biaya operasional cukup tinggi terhadap omzet. Pisahkan biaya tetap dan variabel untuk mencari ruang efisiensi.');

    return { type: 'analysis', html: `
      <table class="summary-table"><thead><tr><th>Ringkasan</th><th class="val">Nilai</th></tr></thead><tbody>
      <tr><td>Omzet</td><td class="val">${rupiah(revenue)}</td></tr>
      <tr><td>Laba kotor</td><td class="val ${gross >= 0 ? 'profit' : 'loss'}">${rupiah(gross)}</td></tr>
      <tr><td>Laba bersih</td><td class="val ${net >= 0 ? 'profit' : 'loss'}">${rupiah(net)}</td></tr>
      <tr><td>Margin bersih</td><td class="val ${margin >= 0 ? 'profit' : 'loss'}">${margin.toFixed(1)}%</td></tr></tbody></table>
      <div class="section-head"><span class="icon">📊</span> Komposisi biaya</div><div class="bar-chart">${bars}</div>
      <div class="section-head"><span class="icon">💡</span> Insight</div><div class="pill-list">${tips.map((tip, i) => `<div class="pill ${i === 0 ? 'insight' : 'rec'}"><span class="bullet">${i + 1}</span><span>${tip}</span></div>`).join('')}</div>
      <div class="note-box"><strong>Perlu diingat</strong>Ini analisis awal berbasis aturan, bukan nasihat keuangan profesional. Verifikasi angka sebelum mengambil keputusan bisnis.</div>` };
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char]));
  }

  function formatAiAnswer(text) {
    return escapeHtml(text).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
  }

  function addMessage(content, role = 'bot', remember = true) {
    const wrapper = document.createElement('div');
    wrapper.className = `msg ${role}`;
    const avatar = role === 'bot' ? 'AI' : 'U';
    wrapper.innerHTML = `<div class="msg-avatar">${avatar}</div><div><div class="msg-bubble">${content}</div><div class="msg-time">Sekarang</div></div>`;
    chatArea.appendChild(wrapper);
    chatArea.scrollTop = chatArea.scrollHeight;
    if (remember && (role === 'user' || role === 'bot')) conversation.push({ role: role === 'bot' ? 'assistant' : 'user', content: String(content).replace(/<[^>]*>/g, '').slice(0, 4000) });
  }

  function showTyping() {
    const wrapper = document.createElement('div');
    wrapper.className = 'msg bot'; wrapper.id = 'typingMessage';
    wrapper.innerHTML = '<div class="msg-avatar">AI</div><div><div class="msg-bubble typing"><span></span><span></span><span></span></div></div>';
    chatArea.appendChild(wrapper); chatArea.scrollTop = chatArea.scrollHeight;
  }

  async function askBackend(text) {
    const response = await fetch('/api/chat', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, history: conversation.slice(-8) })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || 'Backend AI tidak tersedia.');
    return data.answer;
  }

  async function sendMessage() {
    const text = input.value.trim();
    if (!text || sendBtn.disabled) return;
    addMessage(escapeHtml(text), 'user');
    input.value = ''; input.style.height = '48px'; sendBtn.disabled = true; showTyping();

    try {
      const answer = await askBackend(text);
      document.getElementById('typingMessage')?.remove();
      addMessage(formatAiAnswer(answer), 'bot');
    } catch (error) {
      document.getElementById('typingMessage')?.remove();
      const fallback = analyze(text);
      addMessage(fallback.type === 'analysis' ? fallback.html : `${fallback.html}<br><br><small>${escapeHtml(error.message)}</small>`, 'bot');
    } finally {
      sendBtn.disabled = false; input.focus();
    }
  }

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); sendMessage(); }
  });
  input.addEventListener('input', () => { input.style.height = 'auto'; input.style.height = `${Math.min(input.scrollHeight, 160)}px`; });
  document.querySelectorAll('.qp').forEach((button) => button.addEventListener('click', () => { input.value = button.dataset.prompt || ''; input.dispatchEvent(new Event('input')); input.focus(); }));

  const savedTheme = localStorage.getItem('umkm-theme') || 'light';
  document.documentElement.dataset.theme = savedTheme;
  updateThemeLabel(savedTheme);
  function updateThemeLabel(theme) { themeLabel.textContent = theme === 'dark' ? 'Dark' : 'Light'; themeToggle.setAttribute('aria-pressed', String(theme === 'dark')); }
  themeToggle.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next; localStorage.setItem('umkm-theme', next); updateThemeLabel(next);
  });
})();
