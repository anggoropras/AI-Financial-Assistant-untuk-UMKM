import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Bot, 
  CheckCircle2, 
  HelpCircle, 
  Store, 
  Layers, 
  ShieldCheck, 
  Zap, 
  BarChart3, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Scale, 
  FileText, 
  ChevronRight,
  MessageSquare,
  Search,
  Check,
  Building2,
  Coffee,
  ShoppingBag,
  Scissors
} from 'lucide-react';

interface LandingPageViewProps {
  onOpenApp: (tab?: 'dashboard' | 'transactions' | 'cashflow' | 'ai') => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({ onOpenApp }) => {
  const [activeDemoTab, setActiveDemoTab] = useState<'q1' | 'q2'>('q1');

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-600 selection:text-white font-sans antialiased">
      
      {/* 1. NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection('hero')}>
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-base shadow-sm shadow-blue-500/25">
              AF
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 tracking-tight text-lg">Afin.ai</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100">
                  UMKM
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-600">
            <button 
              type="button" 
              onClick={() => scrollToSection('problem')} 
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              Masalah
            </button>
            <button 
              type="button" 
              onClick={() => scrollToSection('solution')} 
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              Solusi
            </button>
            <button 
              type="button" 
              onClick={() => scrollToSection('features')} 
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              Fitur
            </button>
            <button 
              type="button" 
              onClick={() => scrollToSection('how-it-works')} 
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              Cara Kerja
            </button>
            <button 
              type="button" 
              onClick={() => scrollToSection('ai-demo')} 
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              AI Assistant
            </button>
            <button 
              type="button" 
              onClick={() => scrollToSection('differentiator')} 
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              Perbandingan
            </button>
          </nav>

          {/* Nav CTA */}
          <div className="flex items-center gap-3">
            <button
              id="btn-nav-open-app"
              type="button"
              onClick={() => onOpenApp('dashboard')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-bold shadow-sm shadow-blue-600/25 transition-all cursor-pointer"
            >
              <span>Buka Aplikasi</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section id="hero" className="relative pt-12 pb-20 sm:pt-16 sm:pb-24 border-b border-slate-100 bg-gradient-to-b from-slate-50/70 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-extrabold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>AI FINANCIAL ASSISTANT FOR UMKM</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Jangan Cuma Catat Uang.{' '}
              <span className="text-blue-600 underline decoration-blue-200 decoration-wavy decoration-2">
                Pahami Ke Mana Uang Anda Pergi.
              </span>
            </h1>

            {/* Sub Headline */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Afin.ai mengubah transaksi harian menjadi insight keuangan yang mudah dipahami dan dapat ditindaklanjuti—membantu pemilik UMKM mengetahui pemasukan, pengeluaran, arus kas, dan kondisi usaha tanpa harus menjadi ahli akuntansi.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                id="btn-hero-primary"
                type="button"
                onClick={() => onOpenApp('dashboard')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-bold shadow-md shadow-blue-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Mulai Kelola Keuangan dengan AI</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                id="btn-hero-secondary"
                type="button"
                onClick={() => scrollToSection('how-it-works')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Lihat Cara Kerjanya →</span>
              </button>
            </div>

            {/* Micro copy */}
            <p className="text-xs text-slate-500 pt-1">
              Tidak perlu memahami istilah akuntansi yang rumit. Cukup catat transaksi, Afin.ai membantu menjelaskan sisanya.
            </p>
          </div>

          {/* Interactive Hero UI Simulation Showcase */}
          <div className="mt-12 max-w-5xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
            <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="font-semibold text-slate-400 ml-2">app.afin.ai / demo</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-medium">Live Financial Engine</span>
              </div>
            </div>

            <div className="p-5 sm:p-7 bg-slate-50/50">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-xs">
                  <div className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                    Pemasukan (Inflow)
                  </div>
                  <div className="text-xl font-extrabold text-emerald-700 mt-1">Rp15.000.000</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Penjualan & pesanan katering</div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-rose-100 shadow-xs">
                  <div className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
                    <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
                    Pengeluaran (Outflow)
                  </div>
                  <div className="text-xl font-extrabold text-rose-700 mt-1">Rp6.250.000</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Bahan baku & operasional</div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-xs">
                  <div className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-blue-600" />
                    Arus Kas Bersih (Net)
                  </div>
                  <div className="text-xl font-extrabold text-blue-700 mt-1">+Rp8.750.000</div>
                  <div className="text-[11px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Kondisi Kas Sehat & Surplus
                  </div>
                </div>
              </div>

              {/* AI Real-time conversation box in Hero */}
              <div className="bg-white rounded-xl border border-blue-100 p-4 sm:p-5 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                  <Bot className="w-4 h-4 text-blue-600" />
                  <span>AI Financial Assistant — Analisis Otomatis</span>
                </div>
                <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100/80 text-xs sm:text-sm text-slate-700 space-y-1.5 leading-relaxed">
                  <p className="font-semibold text-slate-900">
                    “Kondisi kas usaha Anda bulan ini dalam posisi surplus <strong>Rp8.750.000</strong>.”
                  </p>
                  <p className="text-slate-600">
                    Pengeluaran terbesar Anda berada di pos <strong>Bahan Baku (Rp3.200.000 atau 51% dari total biaya)</strong>. Uang masuk dari penjualan harian cukup untuk menutupi seluruh operasional dan menyisakan dana cadangan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SOCIAL PROOF LOGO BAR */}
      <section className="py-10 border-b border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <p className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider">
            Dibangun untuk membantu UMKM mengambil keputusan berdasarkan data.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 pt-2 text-xs font-semibold text-slate-600">
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>Built for Indonesian UMKM</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200">
              <Coffee className="w-4 h-4 text-amber-600" />
              <span>Kuliner & Warung Makan</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200">
              <ShoppingBag className="w-4 h-4 text-emerald-600" />
              <span>Toko Kelontong & Retail</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200">
              <Scissors className="w-4 h-4 text-purple-600" />
              <span>Jasa & Kreatif</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400">
            Designed for owners who want simpler financial management.
          </p>
        </div>
      </section>

      {/* 4. THE PROBLEM */}
      <section id="problem" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Masalahnya Bukan Anda Tidak Punya Data.{' '}
              <span className="text-rose-600">Masalahnya Anda Sulit Memahaminya.</span>
            </h2>
            <div className="text-sm sm:text-base text-slate-600 space-y-2">
              <p>Banyak pemilik UMKM sudah melakukan transaksi setiap hari.</p>
              <p className="font-semibold text-slate-800 italic bg-white p-3 rounded-xl border border-slate-200 inline-block shadow-xs">
                Tetapi ketika ditanya: “Bulan ini sebenarnya usaha saya untung atau tidak?”
              </p>
              <p className="text-rose-700 font-medium">Jawabannya sering tidak langsung tersedia.</p>
            </div>
          </div>

          {/* 4 Pain Points Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Pain Point 01 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="text-xs font-bold text-rose-600 uppercase tracking-wide">
                Pain Point 01
              </div>
              <h3 className="text-lg font-bold text-slate-900">Transaksi Berantakan</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Penjualan, pembelian bahan, biaya operasional, dan pengeluaran lainnya tercatat di tempat berbeda—atau bahkan hanya diingat di kepala.
              </p>
              <div className="pt-2 border-t border-slate-100 text-xs font-semibold text-rose-700">
                Akibatnya: sulit mengetahui kondisi keuangan secara real-time.
              </div>
            </div>

            {/* Pain Point 02 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="text-xs font-bold text-rose-600 uppercase tracking-wide">
                Pain Point 02
              </div>
              <h3 className="text-lg font-bold text-slate-900">Sulit Membaca Arus Kas</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Uang masuk memang terlihat banyak, tetapi uang keluar juga terus berjalan setiap hari tanpa jeda.
              </p>
              <div className="pt-2 border-t border-slate-100 text-xs font-semibold text-rose-700">
                Tanpa ringkasan yang jelas, pemilik usaha sulit mengetahui berapa yang masuk, berapa yang keluar, dan berapa yang sebenarnya tersisa.
              </div>
            </div>

            {/* Pain Point 03 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="text-xs font-bold text-rose-600 uppercase tracking-wide">
                Pain Point 03
              </div>
              <h3 className="text-lg font-bold text-slate-900">Akuntansi Terasa Rumit</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Banyak tools keuangan menggunakan istilah akuntansi kompleks dan tabel debit-kredit yang terasa dibuat untuk seorang akuntan profesional.
              </p>
              <div className="pt-2 border-t border-slate-100 text-xs font-semibold text-rose-700">
                UMKM membutuhkan informasi yang sederhana, bukan laporan yang membingungkan.
              </div>
            </div>

            {/* Pain Point 04 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="text-xs font-bold text-rose-600 uppercase tracking-wide">
                Pain Point 04
              </div>
              <h3 className="text-lg font-bold text-slate-900">Keputusan Masih Berdasarkan Perasaan</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Ketika data tidak mudah dipahami, keputusan belanja stok dan ekspansi sering dibuat berdasarkan asumsi:
              </p>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs italic text-slate-700 font-medium">
                “Sepertinya bulan ini ramai.”
              </div>
              <div className="pt-2 border-t border-slate-100 text-xs font-semibold text-blue-700">
                Padahal yang dibutuhkan adalah: <strong>“Data menunjukkan apa?”</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. THE SOLUTION */}
      <section id="solution" className="py-16 sm:py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Dari Transaksi Menjadi Pemahaman.{' '}
              <span className="text-blue-600">Dari Pemahaman Menjadi Tindakan.</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Afin.ai menyederhanakan pengelolaan keuangan UMKM dengan menggabungkan pencatatan transaksi dan kecerdasan buatan dalam satu pengalaman yang mudah digunakan.
            </p>
            <div className="pt-2">
              <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-xs font-extrabold tracking-wide">
                Catat → Hitung → Pahami → Bertindak
              </span>
            </div>
          </div>

          {/* Solution Transformation Card */}
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-slate-50 to-blue-50/40 rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Left: Input Sederhana */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Contoh Input Anda</span>
                </div>
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100 text-sm font-semibold text-slate-800">
                  “Hari ini penjualan katering Rp750.000, belanja beras & bumbu Rp300.000.”
                </div>
                <p className="text-xs text-slate-500">
                  Cukup catat apa yang terjadi secara harian tanpa pusing akun jurnal.
                </p>
              </div>

              {/* Right: Output Pemahaman */}
              <div className="bg-white p-5 rounded-xl border border-blue-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span>Afin.ai Mengubahnya Menjadi:</span>
                  </div>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold border border-emerald-200">
                    Otomatis
                  </span>
                </div>
                
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded bg-slate-50">
                    <span className="text-slate-600 font-medium">Pemasukan:</span>
                    <span className="font-bold text-emerald-700">Rp750.000</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-slate-50">
                    <span className="text-slate-600 font-medium">Pengeluaran:</span>
                    <span className="font-bold text-rose-700">Rp300.000</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-blue-50/80 font-bold border border-blue-100">
                    <span className="text-blue-900">Arus Kas Bersih (Sisa Kas):</span>
                    <span className="text-blue-700">Rp450.000</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1.5">
                  <Bot className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Siap ditanyakan: “Pengeluaran terbesar saya bulan ini apa?”</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CORE SERVICES */}
      <section id="features" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Apa yang Bisa Afin.ai Bantu?
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Empat kapabilitas utama untuk mengendalikan arus uang usaha Anda secara menyeluruh.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Service 01 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-sm mb-4">
                  01
                </div>
                <h3 className="text-base font-bold text-slate-900">Catat Transaksi</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Masukkan pemasukan dan pengeluaran harian dengan cara yang sederhana tanpa kerumitan debit-kredit.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 text-xs font-semibold text-blue-700">
                Semua transaksi usaha lebih terstruktur dan mudah ditelusuri.
              </div>
            </div>

            {/* Service 02 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-sm mb-4">
                  02
                </div>
                <h3 className="text-base font-bold text-slate-900">Pantau Arus Kas</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Lihat pemasukan, pengeluaran, saldo, dan arus kas bersih dalam satu dashboard yang selalu terbarukan.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 text-xs font-semibold text-emerald-700">
                Anda tidak perlu menghitung semuanya secara manual dengan kalkulator.
              </div>
            </div>

            {/* Service 03 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black text-sm mb-4">
                  03
                </div>
                <h3 className="text-base font-bold text-slate-900">Pahami Kondisi Keuangan</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Afin.ai membantu mengubah data transaksi menjadi ringkasan yang mudah dipahami setiap saat.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 text-xs font-semibold text-amber-800">
                Anda tahu ke mana uang pergi dan pos pengeluaran mana yang paling besar.
              </div>
            </div>

            {/* Service 04 */}
            <div className="bg-white p-6 rounded-2xl border border-blue-200 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm mb-4">
                  04
                </div>
                <h3 className="text-base font-bold text-slate-900">Tanya AI</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Tidak perlu membuka laporan yang rumit. Cukup tanyakan kondisi usaha Anda secara langsung:
                </p>
                <div className="mt-2 text-[11px] text-slate-500 space-y-1 bg-slate-50 p-2 rounded-lg">
                  <div>• “Berapa pengeluaran saya bulan ini?”</div>
                  <div>• “Apa pengeluaran terbesar saya?”</div>
                  <div>• “Kenapa pengeluaran meningkat?”</div>
                </div>
              </div>
              <div className="pt-3 border-t border-slate-100 text-xs font-semibold text-blue-700">
                Data keuangan menjadi percakapan yang sederhana dan actionable.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. HOW IT WORKS */}
      <section id="how-it-works" className="py-16 sm:py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Sesederhana 3 Langkah
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Tidak perlu instalasi rumit. Alur kerja alami yang dirancang khusus untuk rutinitas pemilik usaha.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto relative">
            {/* Step 1 */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                01
              </div>
              <h3 className="text-lg font-bold text-slate-900">Catat</h3>
              <p className="text-xs text-slate-600">
                Masukkan transaksi harian Anda saat toko buka atau sesaat setelah tutup toko.
              </p>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700">
                Contoh: Penjualan → Rp500.000
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                02
              </div>
              <h3 className="text-lg font-bold text-slate-900">Pahami</h3>
              <p className="text-xs text-slate-600">
                Afin.ai secara otomatis menghitung dan merangkum kondisi keuangan Anda tanpa jeda.
              </p>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-blue-700">
                Contoh: Pemasukan → Pengeluaran → Arus Kas
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                03
              </div>
              <h3 className="text-lg font-bold text-slate-900">Ambil Tindakan</h3>
              <p className="text-xs text-slate-600">
                Tanyakan kepada AI dan dapatkan insight berdasarkan data transaksi riil Anda.
              </p>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-emerald-700">
                Contoh: “Bahan baku menjadi kategori terbesar bulan ini.”
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm font-bold text-slate-800">
              Tidak perlu menjadi ahli akuntansi untuk memahami bisnis Anda.
            </p>
          </div>
        </div>
      </section>

      {/* 8. AI ASSISTANT DEMO */}
      <section id="ai-demo" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Interactive AI Demonstration</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Punya Pertanyaan tentang Keuangan? Tinggal Tanya.
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
              Afin.ai menggunakan AI untuk membantu menerjemahkan data transaksi menjadi jawaban yang lebih mudah dipahami dan bebas jargon.
            </p>
          </div>

          {/* Interactive AI Preview Dialog */}
          <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-md p-5 sm:p-7 space-y-5">
            {/* Question Selector Tabs */}
            <div className="flex flex-wrap gap-2 pb-3 border-b border-slate-100">
              <button
                type="button"
                onClick={() => setActiveDemoTab('q1')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeDemoTab === 'q1'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Pertanyaan 1: Total Pengeluaran
              </button>
              <button
                type="button"
                onClick={() => setActiveDemoTab('q2')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeDemoTab === 'q2'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Pertanyaan 2: Pengeluaran Terbesar
              </button>
            </div>

            {/* Conversation Flow */}
            <div className="space-y-4">
              {activeDemoTab === 'q1' ? (
                <>
                  <div className="flex items-start gap-3 justify-end">
                    <div className="bg-blue-600 text-white p-3.5 rounded-2xl rounded-tr-xs text-xs sm:text-sm max-w-md shadow-xs">
                      “Berapa total pengeluaran saya bulan ini?”
                    </div>
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0">
                      Anda
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl rounded-tl-xs text-xs sm:text-sm text-slate-800 max-w-xl space-y-2 shadow-xs leading-relaxed">
                      <p className="font-semibold text-slate-900">
                        Total pengeluaran Anda bulan ini adalah <strong>Rp6.250.000</strong>.
                      </p>
                      <p className="text-slate-600">
                        Pengeluaran terbesar berasal dari <strong>Bahan Baku</strong> sebesar <strong>Rp3.200.000</strong>, diikuti operasional listrik/internet sebesar Rp2.000.000.
                      </p>
                      <div className="pt-2 border-t border-slate-200 text-[11px] text-emerald-700 font-semibold">
                        ✓ Dibandingkan pemasukan Rp15.000.000, kas Anda masih memiliki surplus Rp8.750.000.
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-3 justify-end">
                    <div className="bg-blue-600 text-white p-3.5 rounded-2xl rounded-tr-xs text-xs sm:text-sm max-w-md shadow-xs">
                      “Pengeluaran saya paling besar di mana?”
                    </div>
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0">
                      Anda
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl rounded-tl-xs text-xs sm:text-sm text-slate-800 max-w-xl space-y-2 shadow-xs leading-relaxed">
                      <p className="font-semibold text-slate-900">
                        <strong>Bahan baku</strong> merupakan pengeluaran terbesar, yaitu sekitar <strong>51%</strong> dari total pengeluaran bulan ini.
                      </p>
                      <p className="text-slate-600">
                        Pos ini mencakup pembelian beras, ayam, dan bumbu dapur senilai total Rp3.200.000.
                      </p>
                      <div className="pt-2 border-t border-slate-200 text-[11px] text-blue-700 font-semibold">
                        💡 Saran: Anda dapat memantau harga beli bahan per pekan untuk menjaga margin laba kotor.
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Trust Message */}
            <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 flex items-center gap-2 text-xs text-blue-900 font-medium">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                <strong>Jaminan Akurasi:</strong> Afin.ai tidak menebak kondisi keuangan Anda. Insight dibuat berdasarkan data transaksi yang Anda catat.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 9. DIFFERENTIATOR */}
      <section id="differentiator" className="py-16 sm:py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Afin.ai Bukan Sekadar Buku Kas Digital.
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Perbedaan mendasar antara pencatatan tradisional yang pasif dengan pendampingan analitik AI yang proaktif.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Traditional */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Model Konvensional
              </div>
              <h3 className="text-lg font-bold text-slate-700">Traditional Financial Recording</h3>
              <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-600">
                Alur: Catat → Simpan → Lihat laporan
              </div>
              <div className="p-4 rounded-xl bg-white/70 border border-slate-200 text-xs text-slate-600 italic">
                Aplikasi pencatatan biasa hanya memberi Anda: <br />
                <strong className="text-slate-800 font-bold not-italic">“Ini transaksi Anda.”</strong>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Pemilik usaha tetap harus menafsirkan sendiri tabel-tabel angka yang panjang dan mencari tahu apa maksudnya.
              </p>
            </div>

            {/* Afin.ai */}
            <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/40 p-6 rounded-2xl border border-blue-200 shadow-sm space-y-4">
              <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Pendekatan Afin.ai
              </div>
              <h3 className="text-lg font-bold text-blue-900">AI-Powered Financial Understanding</h3>
              <div className="p-3 rounded-xl bg-white border border-blue-200 text-xs font-bold text-blue-800 shadow-xs">
                Alur: Catat → Hitung → Analisis → Tanya → Pahami → Bertindak
              </div>
              <div className="p-4 rounded-xl bg-white border border-blue-100 text-xs text-slate-700 space-y-1">
                <div>Afin.ai memberikan pemahaman konkret:</div>
                <div className="font-bold text-slate-900">“Ini yang sedang terjadi pada keuangan usaha Anda.”</div>
                <div className="text-blue-700 font-semibold pt-1">Dan kemudian: “Ini hal yang perlu Anda perhatikan.”</div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Menjembatani gap antara data mentah dengan tindakan bisnis yang nyata.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 10. SOCIAL PROOF / CASE STUDY */}
      <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Dibangun untuk Masalah Nyata UMKM
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Studi kasus validasi dari tantangan riil yang dihadapi pemilik usaha di lapangan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Case Study 01 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                Case Study 01 — Kejernihan Arus Kas
              </div>
              <div className="space-y-2 text-xs sm:text-sm">
                <div>
                  <strong className="text-rose-700">Masalah:</strong>{' '}
                  <span className="text-slate-600">
                    Pemilik usaha kesulitan mengetahui total pemasukan dan pengeluaran bulan berjalan karena uang modal tercampur dengan pengeluaran pribadi.
                  </span>
                </div>
                <div>
                  <strong className="text-blue-700">Solusi Afin.ai:</strong>{' '}
                  <span className="text-slate-600">
                    Menggabungkan transaksi harian ke dalam dashboard otomatis dengan kalkulasi kas bersih instan.
                  </span>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 font-semibold">
                  Hasil: Pengguna dapat melihat pemasukan, pengeluaran, saldo, dan arus kas dalam satu tampilan seketika.
                </div>
              </div>
            </div>

            {/* Case Study 02 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                Case Study 02 — Pengambilan Keputusan Cepat
              </div>
              <div className="space-y-2 text-xs sm:text-sm">
                <div>
                  <strong className="text-rose-700">Masalah:</strong>{' '}
                  <span className="text-slate-600">
                    Data transaksi tersedia di buku catatan, tetapi pemilik usaha tidak punya waktu untuk menganalisanya dan bingung mengambil keputusan belanja.
                  </span>
                </div>
                <div>
                  <strong className="text-blue-700">Solusi Afin.ai:</strong>{' '}
                  <span className="text-slate-600">
                    AI Financial Assistant membantu menerjemahkan tumpukan catatan menjadi insight menggunakan bahasa Indonesia sehari-hari.
                  </span>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 font-semibold">
                  Hasil: Pengguna dapat bertanya langsung mengenai kondisi keuangan usahanya dan langsung mendapatkan rekomendasi tindakan.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. WHY AFIN.AI */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Kenapa Afin.ai?
            </h2>
            <p className="text-base sm:text-lg text-slate-600 font-medium">
              Karena pengelolaan keuangan UMKM tidak seharusnya terasa rumit.
            </p>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 max-w-xl mx-auto text-xs sm:text-sm font-semibold text-slate-800">
              Prinsip Utama: Teknologi harus membuat keputusan bisnis lebih mudah, bukan membuat pemilik usaha semakin bingung.
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-black text-sm">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Simple</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tidak membutuhkan pengetahuan akuntansi tingkat lanjut untuk mulai mencatat.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-sm">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Intelligent</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                AI membantu menemukan pola tersembunyi dan insight dari transaksi Anda.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-sm">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Actionable</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Informasi tidak berhenti pada angka—tetapi membantu pengguna memahami apa yang terjadi.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-black text-sm">
                4
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Personal</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Insight dihitung secara eksklusif berdasarkan data transaksi usaha pengguna sendiri.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 12. FINAL CTA */}
      <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-950 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Berhenti Menebak.{' '}
            <span className="text-blue-400">Mulai Pahami Keuangan Usaha Anda.</span>
          </h2>

          <div className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed space-y-1">
            <p>Setiap hari ada transaksi.</p>
            <p>Setiap transaksi menghasilkan data.</p>
            <p className="text-white font-semibold">
              Dan data yang dipahami dengan benar dapat membantu Anda mengambil keputusan yang lebih baik.
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              id="btn-final-cta-primary"
              type="button"
              onClick={() => onOpenApp('dashboard')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-sm font-bold shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Coba Afin.ai Sekarang →</span>
            </button>
            <button
              id="btn-final-cta-secondary"
              type="button"
              onClick={() => scrollToSection('how-it-works')}
              className="w-full sm:w-auto px-6 py-4 rounded-xl border border-slate-700 hover:border-slate-500 bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Pelajari Cara Kerjanya</span>
            </button>
          </div>

          <p className="text-xs text-slate-400 pt-2">
            Mulai dari pencatatan sederhana. Bangun pemahaman keuangan yang lebih baik.
          </p>
        </div>
      </section>

      {/* 13. FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 border-b border-slate-800/80">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-sm">
                  AF
                </div>
                <span className="text-white font-black text-xl tracking-tight">Afin.ai</span>
              </div>
              <p className="text-xs font-semibold text-slate-300 mt-2">
                AI Financial Assistant untuk UMKM Indonesia
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Catat lebih mudah. Pahami lebih cepat. Bertindak lebih tepat.
              </p>
            </div>

            {/* Navigation links */}
            <div className="flex flex-wrap gap-4 sm:gap-6 text-xs font-medium">
              <button
                type="button"
                onClick={() => onOpenApp('dashboard')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Dashboard
              </button>
              <button
                type="button"
                onClick={() => onOpenApp('transactions')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Transaksi
              </button>
              <button
                type="button"
                onClick={() => onOpenApp('cashflow')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Arus Kas
              </button>
              <button
                type="button"
                onClick={() => onOpenApp('ai')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                AI Assistant
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('hero')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Tentang Afin.ai
              </button>
            </div>

            {/* Footer CTA */}
            <div>
              <button
                type="button"
                onClick={() => onOpenApp('dashboard')}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>Mulai dengan Afin.ai →</span>
              </button>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
            <div>
              © 2026 Afin.ai. Hak Cipta Dilindungi. Solusi AI Keuangan untuk UMKM Indonesia.
            </div>
            <div className="text-[11px] text-slate-500">
              Bukan nasihat akuntansi atau perbankan legal. Dibuat untuk pemahaman finansial independen.
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};
