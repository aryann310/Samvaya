import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi, formatINR } from '../hooks/useApi';
import { useBusiness } from '../contexts/BusinessContext';
import { updateBusiness, getBusiness } from '../services/api';
import PageHeader from '../components/ui/PageHeader';
import { SkeletonCard } from '../components/ui/SkeletonLoader';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Save, UploadCloud, CheckCircle, FileText, X } from 'lucide-react';

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

  useEffect(() => {
    if (businessData) {
      setFormData(businessData);
    }
  }, [businessData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    // Handle nested objects
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
        <SkeletonCard />
      </div>
    );
  }

  // Benchmark comparison data based on business
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

  return (
    <div className="page-enter p-4 md:p-6 space-y-6 bg-[#0B0C0F] text-[#DFE6EF] min-h-screen">
      <PageHeader 
        title={t('business.title')} 
        action={{
          label: isSaving ? (t('common.saving') || 'Saving...') : (t('common.save') || 'Save Changes'),
          onClick: handleSave,
          icon: <Save size={18} />
        }}
      />

      {saveSuccess && (
        <div className="p-4 bg-[#10B981]/15 border border-[#10B981]/30 rounded-xl flex items-center gap-3 text-[#10B981] font-semibold text-sm transition-all shadow-lg">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span>{t('business.savedSuccess') || 'Business profile changes saved successfully!'}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1B2028] border border-[#323A46] p-6 rounded-2xl shadow-xl space-y-4">
          <h2 className="text-lg font-heading font-bold text-[#DFE6EF] border-b border-[#323A46] pb-2">{t('business.infoTitle')}</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#7E8A99] mb-1.5">{t('business.name')}</label>
              <input name="name" value={formData.name || ''} onChange={handleChange} className="bg-[#11141A] border border-[#323A46] text-[#DFE6EF] focus:outline-none focus:border-[#38BDF8] rounded-xl px-4 py-2.5 text-sm w-full" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#7E8A99] mb-1.5">{t('business.type')}</label>
                <select name="type" value={formData.type || ''} onChange={handleChange} className="bg-[#11141A] border border-[#323A46] text-[#DFE6EF] focus:outline-none focus:border-[#38BDF8] rounded-xl px-4 py-2.5 text-sm w-full">
                  <option value="retail" className="bg-[#1B2028]">{t('business.typeRetail')}</option>
                  <option value="service" className="bg-[#1B2028]">{t('business.typeService')}</option>
                  <option value="manufacturing" className="bg-[#1B2028]">{t('business.typeManufacturing')}</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#7E8A99] mb-1.5">{t('business.category')}</label>
                <input name="category" value={formData.category || ''} onChange={handleChange} className="bg-[#11141A] border border-[#323A46] text-[#DFE6EF] focus:outline-none focus:border-[#38BDF8] rounded-xl px-4 py-2.5 text-sm w-full" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#7E8A99] mb-1.5">{t('business.description')}</label>
              <textarea name="description" value={formData.description || ''} onChange={handleChange} className="bg-[#11141A] border border-[#323A46] text-[#DFE6EF] focus:outline-none focus:border-[#38BDF8] rounded-xl p-3 text-sm w-full" rows={3} />
            </div>
          </div>
        </div>

        <div className="bg-[#1B2028] border border-[#323A46] p-6 rounded-2xl shadow-xl space-y-4">
          <h2 className="text-lg font-heading font-bold text-[#DFE6EF] border-b border-[#323A46] pb-2">{t('business.locationTitle')}</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#7E8A99] mb-1.5">{t('business.village')}</label>
                <input name="location.village" value={formData.location?.village || ''} onChange={handleChange} className="bg-[#11141A] border border-[#323A46] text-[#DFE6EF] focus:outline-none focus:border-[#38BDF8] rounded-xl px-4 py-2.5 text-sm w-full" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#7E8A99] mb-1.5">{t('business.taluka')}</label>
                <input name="location.taluka" value={formData.location?.taluka || ''} onChange={handleChange} className="bg-[#11141A] border border-[#323A46] text-[#DFE6EF] focus:outline-none focus:border-[#38BDF8] rounded-xl px-4 py-2.5 text-sm w-full" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#7E8A99] mb-1.5">{t('business.district')}</label>
                <input name="location.district" value={formData.location?.district || ''} onChange={handleChange} className="bg-[#11141A] border border-[#323A46] text-[#DFE6EF] focus:outline-none focus:border-[#38BDF8] rounded-xl px-4 py-2.5 text-sm w-full" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#7E8A99] mb-1.5">{t('business.state')}</label>
                <input name="location.state" value={formData.location?.state || ''} onChange={handleChange} className="bg-[#11141A] border border-[#323A46] text-[#DFE6EF] focus:outline-none focus:border-[#38BDF8] rounded-xl px-4 py-2.5 text-sm w-full" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#7E8A99] mb-1.5">{t('business.pincode')}</label>
                <input name="location.pincode" value={formData.location?.pincode || ''} onChange={handleChange} className="bg-[#11141A] border border-[#323A46] text-[#DFE6EF] focus:outline-none focus:border-[#38BDF8] rounded-xl px-4 py-2.5 text-sm w-full" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#1B2028] border border-[#323A46] p-6 rounded-2xl shadow-xl space-y-4">
          <h2 className="text-lg font-heading font-bold text-[#DFE6EF] border-b border-[#323A46] pb-2">{t('business.ownerTitle')}</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#7E8A99] mb-1.5">{t('business.ownerName')}</label>
              <input name="owner.name" value={formData.owner?.name || ''} onChange={handleChange} className="bg-[#11141A] border border-[#323A46] text-[#DFE6EF] focus:outline-none focus:border-[#38BDF8] rounded-xl px-4 py-2.5 text-sm w-full" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#7E8A99] mb-1.5">{t('business.ownerPhone')}</label>
                <input name="owner.phone" value={formData.owner?.phone || ''} onChange={handleChange} className="bg-[#11141A] border border-[#323A46] text-[#DFE6EF] focus:outline-none focus:border-[#38BDF8] rounded-xl px-4 py-2.5 text-sm w-full" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#7E8A99] mb-1.5">{t('business.ownerEmail')}</label>
                <input name="owner.email" value={formData.owner?.email || ''} onChange={handleChange} className="bg-[#11141A] border border-[#323A46] text-[#DFE6EF] focus:outline-none focus:border-[#38BDF8] rounded-xl px-4 py-2.5 text-sm w-full" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#1B2028] border border-[#323A46] p-6 rounded-2xl shadow-xl space-y-4">
          <h2 className="text-lg font-heading font-bold text-[#DFE6EF] border-b border-[#323A46] pb-2">{t('business.registrationTitle')}</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#7E8A99] mb-1.5">{t('business.registrationType')}</label>
              <select name="registration.type" value={formData.registration?.type || ''} onChange={handleChange} className="bg-[#11141A] border border-[#323A46] text-[#DFE6EF] focus:outline-none focus:border-[#38BDF8] rounded-xl px-4 py-2.5 text-sm w-full">
                <option value="proprietorship" className="bg-[#1B2028]">{t('business.regProprietorship')}</option>
                <option value="partnership" className="bg-[#1B2028]">{t('business.regPartnership')}</option>
                <option value="company" className="bg-[#1B2028]">{t('business.regCompany')}</option>
                <option value="unregistered" className="bg-[#1B2028]">{t('business.regUnregistered')}</option>
              </select>
            </div>
            <div className="flex items-center space-x-3 mt-4">
              <input type="checkbox" name="registration.gstRegistered" checked={formData.registration?.gstRegistered || false} onChange={handleChange} className="w-4 h-4 accent-[#38BDF8] rounded cursor-pointer" />
              <label className="font-semibold text-sm text-[#DFE6EF] cursor-pointer">{t('business.gstRegistered')}</label>
            </div>
            {formData.registration?.gstRegistered && (
              <div className="mt-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#7E8A99] mb-1.5">{t('business.gstNumber')}</label>
                <input name="registration.gstNumber" value={formData.registration?.gstNumber || ''} onChange={handleChange} className="bg-[#11141A] border border-[#323A46] text-[#DFE6EF] focus:outline-none focus:border-[#38BDF8] rounded-xl px-4 py-2.5 text-sm w-full" />
              </div>
            )}
            
            <div className="mt-4 pt-4 border-t border-[#323A46]">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#7E8A99] mb-2">{t('business.uploadDocument')}</label>
              <label className="border-2 border-dashed border-[#38BDF8]/30 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-[#38BDF8] hover:bg-[#38BDF8]/5 transition-all cursor-pointer bg-[#11141A]/50">
                <UploadCloud className="text-[#38BDF8] mb-2" size={30} />
                <span className="text-sm font-bold text-[#38BDF8]">{t('business.clickToUpload')}</span>
                <span className="text-xs text-[#7E8A99] mt-1">{t('business.uploadFormats')}</span>
                <input type="file" className="hidden" onChange={handleFileUpload} accept=".pdf,.png,.jpg,.jpeg" />
              </label>

              {formData.documents && formData.documents.length > 0 && (
                <div className="mt-3 space-y-2">
                  <span className="text-[11px] font-semibold text-[#7E8A99] uppercase tracking-wider block">Uploaded Documents</span>
                  {formData.documents.map((doc: string, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 bg-[#11141A] rounded-xl border border-[#323A46] text-xs">
                      <div className="flex items-center gap-2 truncate">
                        <FileText size={14} className="text-[#38BDF8] flex-shrink-0" />
                        <span className="font-medium text-[#DFE6EF] truncate">{doc}</span>
                      </div>
                      <button 
                        type="button"
                        onClick={() => setFormData((prev: any) => ({
                          ...prev,
                          documents: prev.documents.filter((_: any, i: number) => i !== idx)
                        }))}
                        className="text-[#7E8A99] hover:text-[#EF4444] ml-2 p-1 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1B2028] border border-[#323A46] p-6 rounded-2xl shadow-xl w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-heading font-bold text-[#DFE6EF]">{t('business.benchmarkTitle')}</h2>
          <span className="text-xs text-[#7E8A99] bg-[#11141A] px-2.5 py-1 rounded-full border border-[#323A46]">Regional Cluster Average</span>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={benchmarkData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#323A46" />
              <XAxis type="number" stroke="#7E8A99" tick={{ fill: '#7E8A99' }} />
              <YAxis dataKey="metric" type="category" width={120} stroke="#7E8A99" tick={{ fill: '#7E8A99' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#11141A', borderColor: '#323A46', borderRadius: '0.75rem', color: '#DFE6EF' }}
                itemStyle={{ color: '#DFE6EF' }}
                formatter={(val: number) => typeof val === 'number' && val > 1000 ? formatINR(val) : val} 
              />
              <Legend wrapperStyle={{ color: '#DFE6EF' }} />
              <Bar dataKey="you" name={t('business.you')} fill="#38BDF8" radius={[0, 4, 4, 0]} />
              <Bar dataKey="similar" name={t('business.similarLocal')} fill="#7E8A99" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
