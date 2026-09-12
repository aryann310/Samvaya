import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi, formatINR } from '../hooks/useApi';
import { useBusiness } from '../contexts/BusinessContext';
import { updateBusiness, getBusiness } from '../services/api';
import PageHeader from '../components/ui/PageHeader';
import { SkeletonCard } from '../components/ui/SkeletonLoader';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { 
  Save, 
  UploadCloud, 
  CheckCircle, 
  FileText, 
  X, 
  Building2, 
  MapPin, 
  User, 
  FileCheck, 
  BarChart2,
  ChevronRight
} from 'lucide-react';

type Tab = 'profile' | 'location' | 'owner' | 'registration' | 'benchmarks';

export default function Business() {
  const { t } = useTranslation();
  const { businessId, loading: ctxLoading } = useBusiness();
  const { data: businessData, loading: dataLoading, refetch } = useApi(
    () => getBusiness(businessId!),
    [businessId]
  );
  
  const [formData, setFormData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('profile');

  useEffect(() => {
    if (businessData) {
      setFormData(businessData);
    }
  }, [businessData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev: any) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: val
        }
      }));
    } else {
      setFormData((prev: any) => ({
        ...prev,
        [name]: val
      }));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFormData((prev: any) => ({
      ...prev,
      documents: [...(prev?.documents || []), file.name]
    }));
  };

  const handleSave = async () => {
    if (!formData || !businessId) return;
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await updateBusiness(businessId, formData);
      await refetch();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const isLoading = ctxLoading || dataLoading || !formData;

  if (isLoading) {
    return (
      <div className="page-enter p-6 space-y-6">
        <PageHeader title={t('business.title')} />
        <SkeletonCard />
      </div>
    );
  }

  const benchmarkData = [
    {
      metric: t('business.monthlyRevenue') || 'Monthly Revenue',
      you: businessData?.monthlyRevenue || 180000,
      similar: 165000,
    },
    {
      metric: t('business.profitMargin') || 'Profit Margin',
      you: businessData ? Math.round(((businessData.monthlyRevenue - businessData.monthlyExpenses) / businessData.monthlyRevenue) * 100) : 19,
      similar: 16,
    }
  ];

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'profile', label: 'Business Profile', icon: <Building2 className="w-5 h-5" /> },
    { id: 'location', label: 'Location Details', icon: <MapPin className="w-5 h-5" /> },
    { id: 'owner', label: 'Ownership Info', icon: <User className="w-5 h-5" /> },
    { id: 'registration', label: 'Registration & Docs', icon: <FileCheck className="w-5 h-5" /> },
    { id: 'benchmarks', label: 'Industry Benchmarks', icon: <BarChart2 className="w-5 h-5" /> },
  ];

  // Helper for animated inputs
  const InputGroup = ({ label, children }: { label: string, children: React.ReactNode }) => (
    <div className="space-y-1.5 group">
      <label className="block text-[11px] font-bold uppercase tracking-widest text-muted-foreground group-focus-within:text-lime-500 transition-colors">
        {label}
      </label>
      <div className="relative">
        {children}
      </div>
    </div>
  );

  return (
    <div className="page-enter p-4 md:p-6 min-h-screen bg-background">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-foreground tracking-tight">Business Accounts</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your business profile, documents, and compare industry benchmarks.</p>
          </div>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-sm shadow-[0_0_20px_rgba(132,204,22,0.3)] hover:shadow-[0_0_30px_rgba(132,204,22,0.5)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            {isSaving ? (t('common.saving') || 'Saving...') : (t('common.save') || 'Save Changes')}
          </button>
        </div>

        {saveSuccess && (
          <div className="p-4 bg-lime-500/10 border border-lime-500/20 rounded-2xl flex items-center gap-3 text-lime-600 dark:text-lime-400 font-semibold text-sm transition-all shadow-lg animate-in slide-in-from-top-4">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <span>{t('business.savedSuccess') || 'Business profile changes saved successfully!'}</span>
          </div>
        )}

        {/* Main Split Layout */}
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Navigation Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl transition-all duration-300 ease-out border ${
                  activeTab === tab.id 
                    ? 'bg-card border-glass-border shadow-lg text-foreground scale-[1.02]' 
                    : 'bg-transparent border-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                }`}
              >
                <div className="flex items-center gap-3 font-semibold text-sm">
                  <div className={`p-2 rounded-xl transition-colors ${activeTab === tab.id ? 'bg-primary/10 text-primary' : 'bg-transparent'}`}>
                    {tab.icon}
                  </div>
                  {tab.label}
                </div>
                {activeTab === tab.id && <ChevronRight className="w-4 h-4 text-primary" />}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="flex-1 bg-card/70 backdrop-blur-3xl border border-glass-border shadow-glass-shadow rounded-3xl p-6 md:p-8 relative overflow-hidden">
            {/* Subtle background glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none transform translate-x-1/2 -translate-y-1/2" />
            
            <div className="relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-foreground">Business Profile</h2>
                    <p className="text-sm text-muted-foreground mt-1">Basic information about your enterprise.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <InputGroup label={t('business.name')}>
                        <input name="name" value={formData.name || ''} onChange={handleChange} className="w-full bg-background border border-border text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl px-4 py-3 text-sm transition-all shadow-sm" placeholder="Enter business name" />
                      </InputGroup>
                    </div>
                    <InputGroup label={t('business.type')}>
                      <select name="type" value={formData.type || ''} onChange={handleChange} className="w-full bg-background border border-border text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl px-4 py-3 text-sm transition-all shadow-sm appearance-none">
                        <option value="retail">{t('business.typeRetail')}</option>
                        <option value="service">{t('business.typeService')}</option>
                        <option value="manufacturing">{t('business.typeManufacturing')}</option>
                      </select>
                    </InputGroup>
                    <InputGroup label={t('business.category')}>
                      <input name="category" value={formData.category || ''} onChange={handleChange} className="w-full bg-background border border-border text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl px-4 py-3 text-sm transition-all shadow-sm" placeholder="e.g. Textiles, Electronics" />
                    </InputGroup>
                    <div className="md:col-span-2">
                      <InputGroup label={t('business.description')}>
                        <textarea name="description" value={formData.description || ''} onChange={handleChange} className="w-full bg-background border border-border text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl p-4 text-sm transition-all shadow-sm resize-none" rows={4} placeholder="Describe your business operations..." />
                      </InputGroup>
                    </div>
                  </div>
                </div>
              )}

              {/* Location Tab */}
              {activeTab === 'location' && (
                <div className="space-y-6">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-foreground">Location Details</h2>
                    <p className="text-sm text-muted-foreground mt-1">Geographical footprint of your business operations.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputGroup label={t('business.village')}>
                      <input name="location.village" value={formData.location?.village || ''} onChange={handleChange} className="w-full bg-background border border-border text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl px-4 py-3 text-sm transition-all shadow-sm" />
                    </InputGroup>
                    <InputGroup label={t('business.taluka')}>
                      <input name="location.taluka" value={formData.location?.taluka || ''} onChange={handleChange} className="w-full bg-background border border-border text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl px-4 py-3 text-sm transition-all shadow-sm" />
                    </InputGroup>
                    <InputGroup label={t('business.district')}>
                      <input name="location.district" value={formData.location?.district || ''} onChange={handleChange} className="w-full bg-background border border-border text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl px-4 py-3 text-sm transition-all shadow-sm" />
                    </InputGroup>
                    <InputGroup label={t('business.state')}>
                      <input name="location.state" value={formData.location?.state || ''} onChange={handleChange} className="w-full bg-background border border-border text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl px-4 py-3 text-sm transition-all shadow-sm" />
                    </InputGroup>
                    <div className="md:col-span-2">
                      <InputGroup label={t('business.pincode')}>
                        <input name="location.pincode" value={formData.location?.pincode || ''} onChange={handleChange} className="w-full md:w-1/2 bg-background border border-border text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl px-4 py-3 text-sm transition-all shadow-sm" />
                      </InputGroup>
                    </div>
                  </div>
                </div>
              )}

              {/* Ownership Tab */}
              {activeTab === 'owner' && (
                <div className="space-y-6">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-foreground">Ownership Info</h2>
                    <p className="text-sm text-muted-foreground mt-1">Contact details for the primary business owner.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <InputGroup label={t('business.ownerName')}>
                        <input name="owner.name" value={formData.owner?.name || ''} onChange={handleChange} className="w-full md:w-2/3 bg-background border border-border text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl px-4 py-3 text-sm transition-all shadow-sm" />
                      </InputGroup>
                    </div>
                    <InputGroup label={t('business.ownerPhone')}>
                      <input name="owner.phone" value={formData.owner?.phone || ''} onChange={handleChange} className="w-full bg-background border border-border text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl px-4 py-3 text-sm transition-all shadow-sm" />
                    </InputGroup>
                    <InputGroup label={t('business.ownerEmail')}>
                      <input type="email" name="owner.email" value={formData.owner?.email || ''} onChange={handleChange} className="w-full bg-background border border-border text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl px-4 py-3 text-sm transition-all shadow-sm" />
                    </InputGroup>
                  </div>
                </div>
              )}

              {/* Registration Tab */}
              {activeTab === 'registration' && (
                <div className="space-y-6">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-foreground">Registration & Documents</h2>
                    <p className="text-sm text-muted-foreground mt-1">Manage official compliance and documentation.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <InputGroup label={t('business.registrationType')}>
                      <select name="registration.type" value={formData.registration?.type || ''} onChange={handleChange} className="w-full bg-background border border-border text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl px-4 py-3 text-sm transition-all shadow-sm appearance-none">
                        <option value="proprietorship">{t('business.regProprietorship')}</option>
                        <option value="partnership">{t('business.regPartnership')}</option>
                        <option value="company">{t('business.regCompany')}</option>
                        <option value="unregistered">{t('business.regUnregistered')}</option>
                      </select>
                    </InputGroup>
                    
                    <div className="flex flex-col justify-end pb-3">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative flex items-center justify-center">
                          <input type="checkbox" name="registration.gstRegistered" checked={formData.registration?.gstRegistered || false} onChange={handleChange} className="peer sr-only" />
                          <div className="w-11 h-6 bg-muted rounded-full peer-checked:bg-primary transition-colors border border-border" />
                          <div className="absolute left-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5 shadow-sm" />
                        </div>
                        <span className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">{t('business.gstRegistered')}</span>
                      </label>
                    </div>

                    {formData.registration?.gstRegistered && (
                      <div className="md:col-span-2 animate-in fade-in slide-in-from-top-2">
                        <InputGroup label={t('business.gstNumber')}>
                          <input name="registration.gstNumber" value={formData.registration?.gstNumber || ''} onChange={handleChange} className="w-full md:w-1/2 bg-background border border-border text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl px-4 py-3 text-sm transition-all shadow-sm uppercase placeholder-normal-case" placeholder="22AAAAA0000A1Z5" />
                        </InputGroup>
                      </div>
                    )}
                  </div>

                  <div className="p-6 bg-muted/30 border border-border rounded-2xl">
                    <label className="block text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-4">{t('business.uploadDocument')}</label>
                    
                    <label className="border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer group">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <UploadCloud className="text-primary w-6 h-6" />
                      </div>
                      <span className="text-sm font-bold text-primary mb-1">{t('business.clickToUpload')}</span>
                      <span className="text-xs text-muted-foreground">{t('business.uploadFormats')}</span>
                      <input type="file" className="hidden" onChange={handleFileUpload} accept=".pdf,.png,.jpg,.jpeg" />
                    </label>

                    {formData.documents && formData.documents.length > 0 && (
                      <div className="mt-6 space-y-3">
                        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Uploaded Files</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {formData.documents.map((doc: string, idx: number) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-card rounded-xl border border-border shadow-sm group">
                              <div className="flex items-center gap-3 overflow-hidden">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                  <FileText className="w-4 h-4" />
                                </div>
                                <span className="font-medium text-sm text-foreground truncate">{doc}</span>
                              </div>
                              <button 
                                type="button"
                                onClick={() => setFormData((prev: any) => ({
                                  ...prev,
                                  documents: prev.documents.filter((_: any, i: number) => i !== idx)
                                }))}
                                className="text-muted-foreground hover:bg-red-500/10 hover:text-red-500 p-2 rounded-lg transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Benchmarks Tab */}
              {activeTab === 'benchmarks' && (
                <div className="space-y-6">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-foreground">{t('business.benchmarkTitle')}</h2>
                    <p className="text-sm text-muted-foreground mt-1">See how your business metrics compare against the regional cluster average.</p>
                  </div>
                  
                  <div className="bg-background border border-border p-6 rounded-2xl">
                    <div className="h-80 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart layout="vertical" data={benchmarkData} margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="rgba(150, 150, 150, 0.2)" />
                          <XAxis type="number" stroke="currentColor" className="text-muted-foreground" tick={{ fill: 'currentColor' }} />
                          <YAxis dataKey="metric" type="category" width={120} stroke="currentColor" className="text-muted-foreground font-medium" tick={{ fill: 'currentColor' }} />
                          <Tooltip 
                            cursor={{ fill: 'rgba(150, 150, 150, 0.1)' }}
                            contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '12px', color: 'var(--foreground)', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                            itemStyle={{ color: 'var(--foreground)', fontWeight: 600 }}
                            formatter={(val: any) => typeof val === 'number' && val > 1000 ? formatINR(val) : `${val}%`} 
                          />
                          <Legend wrapperStyle={{ paddingTop: '20px' }} />
                          <Bar dataKey="you" name={t('business.you')} fill="var(--primary)" radius={[0, 6, 6, 0]} barSize={24} />
                          <Bar dataKey="similar" name={t('business.similarLocal')} fill="rgba(150, 150, 150, 0.4)" radius={[0, 6, 6, 0]} barSize={24} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
