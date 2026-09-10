import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  HelpCircle, 
  Store, 
  RefreshCw,
  Info,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { Transaction, ChatMessage, UserProfile } from '../../types';
import { aiService } from '../../services/ai/aiService';
import { calculateTotals } from '../../utils/calculations';

interface AiAssistantViewProps {
  transactions: Transaction[];
  currentUser: UserProfile | null;
}

const QUICK_PROMPTS = [
  'Berapa total pengeluaran saya bulan ini?',
  'Pengeluaran saya paling besar di mana?',
  'Bagaimana kondisi keuangan usaha saya?',
  'Apa pengeluaran yang perlu saya perhatikan?',
  'Apakah arus kas saya sehat?',
  'Apa yang bisa saya lakukan untuk mengurangi pengeluaran?',
  'Berapa total pemasukan saya?'
];

export const AiAssistantView: React.FC<AiAssistantViewProps> = ({
  transactions,
  currentUser
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init_1',
      sender: 'assistant',
      text: `Halo ${currentUser?.name || 'Bapak/Ibu'}! Saya **AFIN.AI**, asisten keuangan pribadi yang ditenagai oleh **Gemini AI** untuk mendampingi usaha **${currentUser?.businessName || 'UMKM Anda'}**.

Saya siap menjawab pertanyaan apa pun mengenai kondisi aktual keuangan usaha Anda berdasarkan data catatan transaksi:
• Omzet & sumber pemasukan
• Pos pengeluaran terbesar & efisiensi biaya
• Kondisi kesehatan arus kas & saldo usaha
• Rekomendasi langkah praktis untuk meningkatkan profit

Silakan klik salah satu rekomendasi pertanyaan di bawah atau ketik langsung pertanyaan Anda!`,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastSource, setLastSource] = useState<'gemini' | 'rules_fallback'>('gemini');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await aiService.askFinancialAssistant(text, transactions, currentUser);
      setLastSource(response.source);
      const totals = calculateTotals(transactions);

      const assistantMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'assistant',
        text: response.answer,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        dataContextSummary: {
          totalIncome: totals.totalIncome,
          totalExpense: totals.totalExpense,
          netCashFlow: totals.netCashFlow
        }
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        sender: 'assistant',
        text: 'Maaf, terjadi kendala saat memproses analisa data dengan AI. Silakan periksa koneksi atau coba sesaat lagi.',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `init_${Date.now()}`,
        sender: 'assistant',
        text: `Percakapan telah diatur ulang. Silakan ajukan pertanyaan keuangan baru seputar usaha **${currentUser?.businessName || 'Anda'}**.`,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Structured Markdown formatter for sections, bolding, and bullet points
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const formattedParts = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          const content = part.slice(2, -2);
          // Highlight key sections
          if (
            content.includes('Jawaban Singkat') ||
            content.includes('Data yang Mendukung') ||
            content.includes('Insight') ||
            content.includes('Saran Tindakan')
          ) {
            return (
              <span key={pIdx} className="inline-block font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/60 my-1">
                {content}
              </span>
            );
          }
          return <strong key={pIdx} className="font-semibold text-slate-900">{content}</strong>;
        }
        if (part.startsWith('*') && part.endsWith('*')) {
          return <em key={pIdx} className="text-slate-500 italic text-xs">{part.slice(1, -1)}</em>;
        }
        return part;
      });

      if (line.startsWith('• ') || line.startsWith('- ')) {
        return (
          <div key={idx} className="flex items-start gap-2 my-1 pl-1">
            <span className="text-blue-600 font-bold shrink-0">•</span>
            <span className="text-slate-800">{formattedParts}</span>
          </div>
        );
      }

      if (/^\d+\.\s/.test(line)) {
        const match = line.match(/^(\d+\.)\s(.*)/);
        if (match) {
          return (
            <div key={idx} className="flex items-start gap-2 my-1 pl-1">
              <span className="text-blue-600 font-bold shrink-0">{match[1]}</span>
              <span className="text-slate-800">{match[2]}</span>
            </div>
          );
        }
      }

      if (line.trim() === '') {
        return <div key={idx} className="h-2" />;
      }

      return <div key={idx} className="leading-relaxed text-slate-800">{formattedParts}</div>;
    });
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto flex flex-col h-[calc(100vh-140px)]">
      {/* AI Header Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xs shadow-blue-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base font-bold text-slate-900">Gemini Financial Assistant</h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200 flex items-center gap-1">
                <Cpu className="w-3 h-3 text-blue-600" />
                Gemini 3.8 Flash
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium border border-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Data-Grounded
              </span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
              <Store className="w-3 h-3 text-blue-600" />
              Basis Data: <strong>{currentUser?.businessName || 'Warung Berkah'}</strong> ({transactions.length} transaksi aktif)
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleClearChat}
          title="Reset Percakapan"
          className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Mulai Ulang</span>
        </button>
      </div>

      {/* Messages Container */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                  isUser
                    ? 'bg-blue-600 text-white'
                    : 'bg-indigo-50 border border-indigo-200 text-indigo-700'
                }`}
              >
                {isUser ? 'Saya' : <Bot className="w-4 h-4 text-blue-600" />}
              </div>

              <div className={`max-w-[88%] sm:max-w-[80%] space-y-1 ${isUser ? 'items-end' : 'items-start'}`}>
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm shadow-xs ${
                    isUser
                      ? 'bg-blue-600 text-white rounded-tr-xs'
                      : 'bg-slate-50/80 border border-slate-200/80 text-slate-800 rounded-tl-xs'
                  }`}
                >
                  {renderFormattedText(msg.text)}
                </div>
                <div className={`text-[10px] text-slate-400 px-1 flex items-center gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
                  <span>{msg.timestamp}</span>
                  {!isUser && (
                    <span className="text-slate-400 text-[9px] flex items-center gap-1">
                      • {lastSource === 'gemini' ? 'Gemini AI' : 'Deterministic Engine'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-blue-600 animate-spin" />
            </div>
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl rounded-tl-xs text-xs text-slate-600 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]" />
              <span className="ml-1">Gemini AI sedang membaca transaksi & merumuskan insight...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="shrink-0">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-[11px] font-bold text-slate-400 shrink-0 flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-blue-500" /> Contoh Pertanyaan:
          </span>
          {QUICK_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSend(prompt)}
              className="px-3 py-1.5 rounded-full border border-slate-200 bg-white hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 text-slate-600 font-medium text-xs whitespace-nowrap transition-colors cursor-pointer shrink-0 shadow-2xs"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div className="shrink-0 bg-white rounded-2xl border border-slate-200 p-2 shadow-xs">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Tanyakan analisis keuangan usaha Anda ke Gemini..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-transparent border-none focus:outline-hidden text-slate-800 placeholder:text-slate-400"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <span>Kirim</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="mt-1.5 px-2 pb-1 text-[10px] text-slate-400 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Info className="w-3 h-3 text-slate-400 shrink-0" />
            Jawaban dihitung murni dari data transaksi Anda. Bukan nasihat finansial resmi.
          </span>
          <span className="hidden sm:inline text-slate-400 font-medium">
            Shift + Enter untuk baris baru
          </span>
        </div>
      </div>
    </div>
  );
};
