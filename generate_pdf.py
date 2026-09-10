#!/usr/bin/env python3
"""
Python script to generate a comprehensive, beautifully styled PDF landing page guide
and copy tailored for a Senior UI/UX & Graphic Designer/Illustrator facing job transition.

Requirements:
    pip install weasyprint
"""
import sys
import tempfile
import os

html_content = """<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Panduan & Copywriting Landing Page: Senior UI/UX & Graphic Designer</title>
    <style>
        @page {
            size: A4;
            margin: 15mm 12mm;
            background-color: #f7f6f3;
            @bottom-right {
                content: counter(page);
                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                font-size: 9pt;
                color: #718096;
            }
        }
        *, *::before, *::after {
            box-sizing: border-box;
        }
        body {
            margin: 0;
            padding: 0;
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #2d3748;
            background-color: #f7f6f3;
            line-height: 1.5;
            font-size: 10.5pt;
        }
        .header-banner {
            background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%);
            color: #ffffff;
            padding: 24px 20px;
            margin: -15mm -12mm 20px -12mm;
            border-bottom: 4px solid #319795;
        }
        .header-banner h1 {
            margin: 0 0 6px 0;
            font-size: 20pt;
            font-weight: 700;
            letter-spacing: -0.5px;
        }
        .header-banner p {
            margin: 0;
            color: #cbd5e0;
            font-size: 10pt;
        }
        h2 {
            font-size: 14pt;
            color: #1a202c;
            margin-top: 22px;
            margin-bottom: 10px;
            border-left: 4px solid #319795;
            padding-left: 8px;
            page-break-after: avoid;
        }
        h3 {
            font-size: 11pt;
            color: #2b6cb0;
            margin-top: 14px;
            margin-bottom: 6px;
            page-break-after: avoid;
        }
        p {
            margin: 0 0 10px 0;
        }
        .box {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 12px 14px;
            margin-bottom: 12px;
            page-break-inside: avoid;
        }
        .code-box {
            background: #1a202c;
            color: #e2e8f0;
            font-family: 'Courier New', Courier, monospace;
            font-size: 8.5pt;
            padding: 12px;
            border-radius: 6px;
            white-space: pre-wrap;
            margin-bottom: 12px;
            page-break-inside: avoid;
            line-height: 1.4;
        }
        .badge {
            display: inline-block;
            background: #e6fffa;
            color: #234e52;
            border: 1px solid #b2f5ea;
            font-size: 8pt;
            font-weight: bold;
            padding: 2px 6px;
            border-radius: 4px;
            margin-bottom: 8px;
            text-transform: uppercase;
        }
        ul {
            margin: 0 0 10px 0;
            padding-left: 20px;
        }
        li {
            margin-bottom: 4px;
        }
        @media print {
            .no-print {
                display: none !important;
            }
        }
    </style>
</head>
<body>

    <div class="header-banner">
        <h1>Strategi Landing Page & Copywriting</h1>
        <p>Spesialisasi: Senior UI/UX Designer, Graphic Designer & Illustrator</p>
    </div>

    <div class="box">
        <span class="badge">Mindset & Pendekatan</span>
        <p>Sebagai seorang <strong>Senior UI/UX & Graphic Designer/Illustrator</strong>, portofolio visual dan kemampuan memecahkan masalah (<em>problem solving</em>) melalui desain adalah aset utama penarik klien. Landing page ini dirancang untuk menunjukkan bahwa kamu bukan sekadar pembuat aset visual yang estetis, melainkan mitra strategis yang menaikkan konversi bisnis dan nilai jenama (brand value).</p>
    </div>

    <h2>1. Master Prompt untuk Menyusun Copywriting</h2>
    <p>Gunakan prompt ini pada AI (seperti Gemini atau Claude) untuk menghasilkan naskah landing page yang tajam, profesional, dan berorientasi pada nilai bisnis (<em>business impact</em>):</p>
    
    <div class="code-box">Bertindaklah sebagai Senior Copywriter dan Brand Strategist. Aku seorang Senior UI/UX Designer, Graphic Designer, dan Illustrator dengan pengalaman mendalam. Saat ini aku sedang membuat landing page profesional untuk menawarkan jasa (freelance, contract, atau project-based) kepada klien atau perusahaan yang membutuhkan keahlian desain berkualitas tinggi dengan cepat.

Tolong buatkan draf copywriting landing page yang mencakup:
1. Headline & Sub-headline yang menonjolkan kombinasi estetika visual, kegunaan (usability), dan dampak bisnis (conversion/growth).
2. Section "The Problem": Masalah umum perusahaan (misal: produk digital membingungkan, brand tidak konsisten, ilustrasi/grafis kaku dan kurang menarik perhatian audiens).
3. Section "The Solution": Bagaimana pendekatan desainku yang berbasis data, berpusat pada pengguna (user-centric), dan memiliki standar visual tinggi menyelesaikan masalah tersebut.
4. Section "Services Offered": Rincian layanan (UI/UX Design untuk Web/App, Design System, Brand Identity & Graphic Design, Custom Illustration).
5. Section "Selected Works / Portfolio Structure": Panduan cara menampilkan studi kasus terbaik.
6. Call to Action (CTA): Kalimat penutup yang persuasif untuk menjadwalkan panggilan atau konsultasi awal.

Gunakan nada bahasa yang profesional, elegan, berwibawa, dan meyakinkan dalam Bahasa Indonesia.</div>

    <h2>2. Struktur Wireframe / Layout Landing Page</h2>
    <ul>
        <li><strong>Hero Section:</strong> Menampilkan karya visual terbaik (<em>mockup</em> atau <em>illustration preview</em>), headline bernilai tinggi, dan tombol aksi utama (<em>"Jadwalkan Konsultasi"</em>).</li>
        <li><strong>Social Proof / Client Ticker:</strong> Daftar atau logo perusahaan/proyek prestisius yang pernah ditangani.</li>
        <li><strong>Pain Points:</strong> Menyoroti kendala bisnis akibat desain yang buruk atau tidak terstruktur.</li>
        <li><strong>Core Services Grid:</strong> Pembagian jelas antara UI/UX, Graphic Design, dan Ilustrasi Kreatif.</li>
        <li><strong>Featured Case Study:</strong> Studi kasus interaksi pengguna atau transformasi brand yang sukses.</li>
        <li><strong>About / Philosophy:</strong> Penjelasan singkat pengalaman senior dan standar kerja profesional.</li>
        <li><strong>Footer / Final CTA:</strong> Ajakan langsung menghubungi via email atau pesan instan.</li>
    </ul>

    <h2>3. Template Kode HTML & Tailwind CSS Responsif</h2>
    <p>Berikut adalah kerangka kode siap pakai yang bersih, modern, dan dioptimalkan khusus untuk portofolio desainer:</p>

    <div class="code-box">&lt;!DOCTYPE html&gt;
&lt;html lang=&quot;id&quot; class=&quot;scroll-smooth&quot;&gt;
&lt;head&gt;
    &lt;meta charset=&quot;UTF-8&quot;&gt;
    &lt;meta name=&quot;viewport&quot; content=&quot;width=device-width, initial-scale=1.0&quot;&gt;
    &lt;title&gt;Senior UI/UX &amp; Graphic Design Portfolio&lt;/title&gt;
    &lt;script src=&quot;https://cdn.tailwindcss.com&quot;&gt;&lt;/script&gt;
&lt;/head&gt;
&lt;body class=&quot;bg-zinc-950 text-zinc-100 font-sans antialiased&quot;&gt;
    &lt;header class=&quot;fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800&quot;&gt;
        &lt;div class=&quot;max-w-6xl mx-auto px-6 h-16 flex items-center justify-between&quot;&gt;
            &lt;span class=&quot;font-bold text-lg tracking-tight text-white&quot;&gt;Studio.Portfolio&lt;/span&gt;
            &lt;a href=&quot;#contact&quot; class=&quot;bg-teal-600 hover:bg-teal-500 text-white text-sm font-medium px-4 py-2 rounded-full transition&quot;&gt;Mulai Kolaborasi&lt;/a&gt;
        &lt;/div&gt;
    &lt;/header&gt;

    &lt;section class=&quot;pt-36 pb-20 px-6 max-w-5xl mx-auto text-center&quot;&gt;
        &lt;div class=&quot;inline-block mb-4 px-3 py-1 rounded-full bg-teal-950/80 border border-teal-800 text-teal-300 text-xs font-semibold tracking-wide uppercase&quot;&gt;
            Tersedia untuk Kontrak &amp; Proyek Kreatif
        &lt;/div&gt;
        &lt;h1 class=&quot;text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6&quot;&gt;
            Menerjemahkan Ide Kompleks Menjadi Pengalaman Visual yang Berdampak
        &lt;/h1&gt;
        &lt;p class=&quot;text-lg sm:text-xl text-zinc-400 mb-10 max-w-2xl mx-auto&quot;&gt;
            Senior UI/UX Designer, Graphic Designer &amp; Illustrator yang membantu produk digital dan brand tampil menonjol, intuitif, dan bernilai tinggi.
        &lt;/p&gt;
        &lt;div class=&quot;flex flex-col sm:flex-row justify-center gap-4&quot;&gt;
            &lt;a href=&quot;#contact&quot; class=&quot;bg-teal-600 hover:bg-teal-500 text-white font-semibold px-8 py-3.5 rounded-xl transition shadow-lg shadow-teal-600/20&quot;&gt;Hubungi Saya&lt;/a&gt;
            &lt;a href=&quot;#services&quot; class=&quot;bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 font-semibold px-8 py-3.5 rounded-xl transition&quot;&gt;Lihat Keahlian&lt;/a&gt;
        &lt;/div&gt;
    &lt;/section&gt;

    &lt;section id=&quot;services&quot; class=&quot;py-20 px-6 max-w-6xl mx-auto&quot;&gt;
        &lt;div class=&quot;text-center mb-16&quot;&gt;
            &lt;h2 class=&quot;text-3xl font-bold mb-4 text-white border-0 p-0&quot;&gt;Layanan &amp; Keahlian Utama&lt;/h2&gt;
            &lt;p class=&quot;text-zinc-400&quot;&gt;Solusi desain end-to-end dari riset pengguna hingga eksekusi visual tingkat lanjut.&lt;/p&gt;
        &lt;/div&gt;
        &lt;div class=&quot;grid md:grid-cols-3 gap-8&quot;&gt;
            &lt;div class=&quot;bg-zinc-900/60 p-8 rounded-2xl border border-zinc-800&quot;&gt;
                &lt;h3 class=&quot;text-xl font-bold text-white mb-3&quot;&gt;UI/UX Product Design&lt;/h3&gt;
                &lt;p class=&quot;text-zinc-400 text-sm leading-relaxed&quot;&gt;Wireframing, user research, design system, dan antarmuka aplikasi web/mobile yang intuitif dan berfokus pada konversi.&lt;/p&gt;
            &lt;/div&gt;
            &lt;div class=&quot;bg-zinc-900/60 p-8 rounded-2xl border border-zinc-800&quot;&gt;
                &lt;h3 class=&quot;text-xl font-bold text-white mb-3&quot;&gt;Brand Identity &amp; Graphic Design&lt;/h3&gt;
                &lt;p class=&quot;text-zinc-400 text-sm leading-relaxed&quot;&gt;Pengembangan identitas jenama komprehensif, panduan visual, hingga materi pemasaran digital berstandar tinggi.&lt;/p&gt;
            &lt;/div&gt;
            &lt;div class=&quot;bg-zinc-900/60 p-8 rounded-2xl border border-zinc-800&quot;&gt;
                &lt;h3 class=&quot;text-xl font-bold text-white mb-3&quot;&gt;Custom Illustration&lt;/h3&gt;
                &lt;p class=&quot;text-zinc-400 text-sm leading-relaxed&quot;&gt;Ilustrasi digital eksklusif untuk memperkuat karakter produk, narasi visual, serta daya tarik emosional brand.&lt;/p&gt;
            &lt;/div&gt;
        &lt;/div&gt;
    &lt;/section&gt;

    &lt;section id=&quot;contact&quot; class=&quot;py-20 px-6 max-w-3xl mx-auto text-center&quot;&gt;
        &lt;div class=&quot;bg-gradient-to-b from-teal-950/40 to-zinc-900 p-10 sm:p-14 rounded-3xl border border-teal-900/50&quot;&gt;
            &lt;h2 class=&quot;text-3xl font-bold text-white mb-4 border-0 p-0&quot;&gt;Mari Wujudkan Visi Desain Anda&lt;/h2&gt;
            &lt;p class=&quot;text-zinc-400 mb-8&quot;&gt;Terbuka untuk kolaborasi proyek jangka pendek, kontrak desainer senior, maupun kesempatan penuh waktu.&lt;/p&gt;
            &lt;a href=&quot;mailto:emailkamu@domain.com&quot; class=&quot;inline-block bg-teal-600 hover:bg-teal-500 text-white font-semibold px-8 py-4 rounded-xl transition shadow-lg shadow-teal-600/20&quot;&gt;
                Kirim Email / Jadwalkan Diskusi
            &lt;/a&gt;
        &lt;/div&gt;
    &lt;/section&gt;

    &lt;footer class=&quot;py-8 text-center text-xs text-zinc-600 border-t border-zinc-900&quot;&gt;
        &amp;copy; 2026 Senior UI/UX &amp; Graphic Designer Portfolio. All rights reserved.
    &lt;/footer&gt;
&lt;/body&gt;
&lt;/html&gt;</div>

</body>
</html>
"""

def main():
    try:
        from weasyprint import HTML
    except ImportError:
        print("Error: weasyprint library is not installed.")
        print("Please install it with: pip install weasyprint")
        sys.exit(1)

    output_pdf = sys.argv[1] if len(sys.argv) > 1 else "panduan_landing_page_designer.pdf"
    
    with tempfile.NamedTemporaryFile(suffix=".html", mode="w", encoding="utf-8", delete=False) as f:
        f.write(html_content)
        temp_html = f.name

    try:
        print(f"Mengonversi dokumen ke PDF...")
        HTML(filename=temp_html).write_pdf(output_pdf)
        print(f"PDF berhasil dibuat: {os.path.abspath(output_pdf)}")
    finally:
        if os.path.exists(temp_html):
            os.remove(temp_html)

if __name__ == "__main__":
    main()
