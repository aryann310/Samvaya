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
    <div className="page-enter p-4 md:p-6 space-y-6 min-h-screen">
      <PageHeader 
        title={t('settings.title', 'Settings & System Preferences')} 
        subtitle={t('settings.subtitle', 'Configure business owner details, regional language preferences, and notification triggers.')}
      />

      <div className="max-w-3xl space-y-6">
        <div className="bg-card/70 backdrop-blur-md border border-glass-border p-6 rounded-3xl shadow-glass-shadow">
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center">
            <User className="mr-2 text-primary" size={22} /> {t('settings.profile', 'Owner Profile')}
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Full Name</label>
                <input type="text" className="bg-background border border-border text-foreground rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 w-full" defaultValue={business?.owner?.name} />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Phone Number</label>
                <input type="text" className="bg-background border border-border text-foreground rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 w-full" defaultValue={business?.owner?.phone} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Email Address</label>
                <input type="email" className="bg-background border border-border text-foreground rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 w-full" defaultValue={business?.owner?.email} />
              </div>
            </div>
            <div className="pt-2">
              <button onClick={() => alert('Coming soon!')} className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-sm shadow-xs transition-all">
                {t('common.save', 'Save Changes')}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-card/70 backdrop-blur-md border border-glass-border p-6 rounded-3xl shadow-glass-shadow">
          <h2 className="text-lg font-bold text-foreground mb-2 flex items-center">
            <Globe className="mr-2 text-primary" size={22} /> {t('settings.language', 'Language Preference')}
          </h2>
          <p className="text-muted-foreground mb-4 text-xs">{t('settings.languageDesc', 'Select your preferred vernacular language for advisory and interface.')}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button 
              onClick={() => changeLanguage('en')}
              className={`p-3.5 rounded-2xl border text-center transition-all ${(i18n.language || 'en').startsWith('en') ? 'border-primary bg-primary/10 text-primary font-bold shadow-xs' : 'border-border bg-card text-muted-foreground hover:border-foreground/30'}`}
            >
              <div className="font-bold text-base">English</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">Default</div>
            </button>
            <button 
              onClick={() => changeLanguage('hi')}
              className={`p-3.5 rounded-2xl border text-center transition-all ${(i18n.language || 'en').startsWith('hi') ? 'border-primary bg-primary/10 text-primary font-bold shadow-xs' : 'border-border bg-card text-muted-foreground hover:border-foreground/30'}`}
            >
              <div className="font-bold text-base">हिन्दी</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">Hindi</div>
            </button>
            <button 
              onClick={() => changeLanguage('gu')}
              className={`p-3.5 rounded-2xl border text-center transition-all ${(i18n.language || 'en').startsWith('gu') ? 'border-primary bg-primary/10 text-primary font-bold shadow-xs' : 'border-border bg-card text-muted-foreground hover:border-foreground/30'}`}
            >
              <div className="font-bold text-base">ગુજરાતી</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">Gujarati</div>
            </button>
          </div>
        </div>

        <div className="bg-card/70 backdrop-blur-md border border-glass-border p-6 rounded-3xl shadow-glass-shadow">
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center">
            <Bell className="mr-2 text-primary" size={22} /> {t('settings.notifications', 'Notification Alerts')}
          </h2>
          <div className="space-y-4">
            {[
              { id: 'notif-alerts', label: 'Low Stock Alerts', desc: 'Get notified when inventory is running low' },
              { id: 'notif-cashflow', label: 'Cash Flow Warnings', desc: 'Alerts about potential cash shortages' },
              { id: 'notif-insights', label: 'AI Business Insights', desc: 'Weekly summaries and recommendations' },
              { id: 'notif-schemes', label: 'New Gov Schemes', desc: 'When you become eligible for a new scheme' }
            ].map(pref => (
              <div key={pref.id} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
                <div>
                  <p className="font-bold text-sm text-foreground">{pref.label}</p>
                  <p className="text-xs text-muted-foreground">{pref.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-muted border border-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-xs"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card/70 backdrop-blur-md border border-glass-border p-6 rounded-3xl shadow-glass-shadow flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div className="flex items-center text-muted-foreground mb-4 sm:mb-0">
            <HelpCircle className="mr-2 text-primary" size={20} />
            <div>
              <p className="font-semibold text-sm text-foreground">Samvaya Intelligence v2.0</p>
              <a href="#" className="text-xs text-primary hover:underline">Help & Support Knowledgebase</a>
            </div>
          </div>
          <button onClick={handleLogout} className="px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 font-bold text-sm hover:bg-red-500/20 transition-all flex items-center">
            <LogOut size={16} className="mr-2" /> {t('settings.logout', 'Sign Out')}
          </button>
        </div>
      </div>
    </div>
  );
}
