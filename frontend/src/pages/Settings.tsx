import React from 'react';
import { useTranslation } from 'react-i18next';
import { useBusiness } from '../contexts/BusinessContext';
import PageHeader from '../components/ui/PageHeader';
import { User, Bell, Globe, HelpCircle, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const { t, i18n } = useTranslation();
  const { business } = useBusiness();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Implement logout logic here
    navigate('/login');
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="page-enter p-4 md:p-6 space-y-6 bg-[#0B0C0F] text-[#DFE6EF] min-h-screen">
      <PageHeader title={t('settings.title')} />

      <div className="max-w-3xl space-y-6">
        <div className="bg-[#1B2028] border border-[#323A46] p-6 rounded-2xl shadow-xl">
          <h2 className="text-lg font-heading font-bold text-[#DFE6EF] mb-4 flex items-center">
            <User className="mr-2 text-[#38BDF8]" size={22} /> {t('settings.profile')}
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#7E8A99] mb-1.5">Full Name</label>
                <input type="text" className="bg-[#11141A] border border-[#323A46] text-[#DFE6EF] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#38BDF8] w-full" defaultValue={business?.owner?.name} />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#7E8A99] mb-1.5">Phone Number</label>
                <input type="text" className="bg-[#11141A] border border-[#323A46] text-[#DFE6EF] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#38BDF8] w-full" defaultValue={business?.owner?.phone} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#7E8A99] mb-1.5">Email Address</label>
                <input type="email" className="bg-[#11141A] border border-[#323A46] text-[#DFE6EF] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#38BDF8] w-full" defaultValue={business?.owner?.email} />
              </div>
            </div>
            <div className="pt-2">
              <button onClick={() => alert('Coming soon!')} className="px-5 py-2.5 rounded-xl bg-[#38BDF8] text-[#0B0C0F] font-bold text-sm shadow-[0_0_12px_rgba(56,189,248,0.3)] hover:bg-[#0284C7] transition-all">
                {t('common.save') || 'Save Changes'}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-[#1B2028] border border-[#323A46] p-6 rounded-2xl shadow-xl">
          <h2 className="text-lg font-heading font-bold text-[#DFE6EF] mb-2 flex items-center">
            <Globe className="mr-2 text-[#38BDF8]" size={22} /> {t('settings.language')}
          </h2>
          <p className="text-[#7E8A99] mb-4 text-xs">{t('settings.languageDesc')}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button 
              onClick={() => changeLanguage('en')}
              className={`p-3.5 rounded-xl border text-center transition-all ${(i18n.language || 'en').startsWith('en') ? 'border-[#38BDF8] bg-[#38BDF8]/10 text-[#38BDF8] font-bold shadow-[0_0_12px_rgba(56,189,248,0.2)]' : 'border-[#323A46] bg-[#11141A] text-[#7E8A99] hover:border-[#7E8A99]'}`}
            >
              <div className="font-bold text-base">English</div>
              <div className="text-[11px] text-[#7E8A99] mt-0.5">Default</div>
            </button>
            <button 
              onClick={() => changeLanguage('hi')}
              className={`p-3.5 rounded-xl border text-center transition-all ${(i18n.language || 'en').startsWith('hi') ? 'border-[#38BDF8] bg-[#38BDF8]/10 text-[#38BDF8] font-bold shadow-[0_0_12px_rgba(56,189,248,0.2)]' : 'border-[#323A46] bg-[#11141A] text-[#7E8A99] hover:border-[#7E8A99]'}`}
            >
              <div className="font-bold text-base">हिन्दी</div>
              <div className="text-[11px] text-[#7E8A99] mt-0.5">Hindi</div>
            </button>
            <button 
              onClick={() => changeLanguage('gu')}
              className={`p-3.5 rounded-xl border text-center transition-all ${(i18n.language || 'en').startsWith('gu') ? 'border-[#38BDF8] bg-[#38BDF8]/10 text-[#38BDF8] font-bold shadow-[0_0_12px_rgba(56,189,248,0.2)]' : 'border-[#323A46] bg-[#11141A] text-[#7E8A99] hover:border-[#7E8A99]'}`}
            >
              <div className="font-bold text-base">ગુજરાતી</div>
              <div className="text-[11px] text-[#7E8A99] mt-0.5">Gujarati</div>
            </button>
          </div>
        </div>

        <div className="bg-[#1B2028] border border-[#323A46] p-6 rounded-2xl shadow-xl">
          <h2 className="text-lg font-heading font-bold text-[#DFE6EF] mb-4 flex items-center">
            <Bell className="mr-2 text-[#38BDF8]" size={22} /> {t('settings.notifications')}
          </h2>
          <div className="space-y-4">
            {[
              { id: 'notif-alerts', label: 'Low Stock Alerts', desc: 'Get notified when inventory is running low' },
              { id: 'notif-cashflow', label: 'Cash Flow Warnings', desc: 'Alerts about potential cash shortages' },
              { id: 'notif-insights', label: 'AI Business Insights', desc: 'Weekly summaries and recommendations' },
              { id: 'notif-schemes', label: 'New Gov Schemes', desc: 'When you become eligible for a new scheme' }
            ].map(pref => (
              <div key={pref.id} className="flex items-center justify-between py-2.5 border-b border-[#323A46]/60 last:border-0">
                <div>
                  <p className="font-bold text-sm text-[#DFE6EF]">{pref.label}</p>
                  <p className="text-xs text-[#7E8A99]">{pref.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-[#11141A] border border-[#323A46] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-[#DFE6EF] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#DFE6EF] after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#38BDF8]"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#1B2028] border border-[#323A46] p-6 rounded-2xl shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div className="flex items-center text-[#7E8A99] mb-4 sm:mb-0">
            <HelpCircle className="mr-2 text-[#38BDF8]" size={20} />
            <div>
              <p className="font-semibold text-sm text-[#DFE6EF]">Samvaya Intelligence v2.0</p>
              <a href="#" className="text-xs text-[#38BDF8] hover:underline">Help & Support Knowledgebase</a>
            </div>
          </div>
          <button onClick={handleLogout} className="px-4 py-2.5 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/30 text-[#EF4444] font-bold text-sm hover:bg-[#EF4444]/25 transition-all flex items-center">
            <LogOut size={16} className="mr-2" /> {t('settings.logout')}
          </button>
        </div>
      </div>
    </div>
  );
}
