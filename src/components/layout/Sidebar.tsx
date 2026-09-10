import React from 'react';
import { 
  LayoutDashboard, 
  ReceiptText, 
  ArrowLeftRight, 
  Bot, 
  Settings,
  HelpCircle,
  Database,
  Globe
} from 'lucide-react';

export type NavTab = 'dashboard' | 'transactions' | 'cashflow' | 'ai' | 'settings' | 'landing';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  transactionCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  transactionCount
}) => {
  const navItems = [
    {
      id: 'dashboard' as NavTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      description: 'Ringkasan & Saldo'
    },
    {
      id: 'transactions' as NavTab,
      label: 'Transaksi',
      icon: ReceiptText,
      description: 'Pemasukan & Pengeluaran',
      badge: transactionCount > 0 ? String(transactionCount) : undefined
    },
    {
      id: 'cashflow' as NavTab,
      label: 'Arus Kas',
      icon: ArrowLeftRight,
      description: 'Analisa Aliran Dana'
    },
    {
      id: 'ai' as NavTab,
      label: 'AI Assistant',
      icon: Bot,
      description: 'Tanya Keuangan Usaha',
      highlight: true
    },
    {
      id: 'settings' as NavTab,
      label: 'Pengaturan',
      icon: Settings,
      description: 'Profil & Status Data'
    },
    {
      id: 'landing' as NavTab,
      label: 'Landing Page',
      icon: Globe,
      description: 'Halaman Penawaran & Info'
    }
  ];

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-slate-200 p-4 hidden md:flex flex-col justify-between">
      <div>
        <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
          Menu Utama
        </div>
        <nav className="mt-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-left transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-bold border border-blue-100 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg ${isActive ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm leading-tight flex items-center gap-1.5">
                      {item.label}
                      {item.highlight && (
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 font-normal leading-tight mt-0.5">
                      {item.description}
                    </div>
                  </div>
                </div>

                {item.badge && (
                  <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-slate-100 text-slate-600">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-slate-700">
            <Database className="w-3.5 h-3.5 text-blue-600" />
            <span>Fase 1: UI & Mock Store</span>
          </div>
          <p className="text-slate-500 text-[11px] mt-1 leading-relaxed">
            Data tersimpan aman secara lokal di browser. Siap terhubung ke Firebase di Fase berikutnya.
          </p>
        </div>

        <div className="px-2 text-[11px] text-slate-400 flex items-center justify-between">
          <span>AFIN.AI v1.0.0</span>
          <span className="inline-flex items-center gap-1">
            <HelpCircle className="w-3 h-3" /> Bantuan
          </span>
        </div>
      </div>
    </aside>
  );
};
