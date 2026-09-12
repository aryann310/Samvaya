import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi, formatINR } from '../hooks/useApi';
import { useBusiness } from '../contexts/BusinessContext';
import { getFinancing, submitLoanApplication } from '../services/api';
import PageHeader from '../components/ui/PageHeader';
import { SkeletonCard } from '../components/ui/SkeletonLoader';
import GaugeChart from '../components/ui/GaugeChart';
import StatusBadge from '../components/ui/StatusBadge';
import Modal from '../components/ui/Modal';
import { CheckCircle, AlertCircle, IndianRupee, FileText } from 'lucide-react';

export default function Financing() {
  const { t } = useTranslation();
  const { businessId, loading: ctxLoading } = useBusiness();
  const { data: financeData, loading: dataLoading } = useApi(
    () => getFinancing(businessId!),
    [businessId]
  );

  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ amount: 100000, tenure: 12 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const isLoading = (ctxLoading || dataLoading) && !financeData;

  const handleApplyClick = (product: any) => {
    setSelectedProduct(product);
    setStep(1);
    setSuccess(false);
    setApplyModalOpen(true);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await submitLoanApplication(selectedProduct?.id || 'loan-1', formData);
      setSuccess(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !financeData) {
    return (
      <div className="page-enter p-6 space-y-6">
        <PageHeader title={t('financing.title')} />
        <SkeletonCard />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter p-4 md:p-6 space-y-8 bg-[#0B0C0F] text-[#DFE6EF] min-h-screen">
      <PageHeader 
        title={t('financing.title')} 
        subtitle={t('financing.subtitle')} 
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1B2028] border border-[#323A46] p-6 rounded-2xl shadow-xl flex flex-col items-center justify-center">
          <GaugeChart 
            score={financeData.readinessScore} 
            label={t('financing.readinessScore')} 
            size={180} 
            explanation={t('financing.readinessDesc')}
          />
        </div>

        <div className="md:col-span-2 bg-[#1B2028] border border-[#323A46] p-6 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-[#323A46] mb-5">
            <h2 className="text-xl font-heading font-bold text-[#DFE6EF]">{t('financing.scoreFactors')}</h2>
            <span className="text-xs text-[#38BDF8] bg-[#38BDF8]/10 border border-[#38BDF8]/20 px-2.5 py-0.5 rounded-full font-semibold">Credit Engine</span>
          </div>
          <div className="space-y-4">
            {financeData.readinessFactors.map((factor: any, idx: number) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-semibold text-[#DFE6EF]">{factor.name}</span>
                  <span className="text-[#38BDF8] font-mono text-xs font-bold">{factor.score}/{factor.maxScore}</span>
                </div>
                <div className="w-full bg-[#11141A] rounded-full h-2.5 border border-[#323A46]/60">
                  <div 
                    className="bg-[#38BDF8] h-2.5 rounded-full shadow-[0_0_8px_rgba(56,189,248,0.5)] transition-all" 
                    style={{ width: `${(factor.score / factor.maxScore) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-heading font-bold text-[#DFE6EF] px-1">{t('financing.loanProducts')}</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {financeData.loanProducts.map((product: any, idx: number) => {
            const bank = product.bankName || product.provider || 'SBI';
            const name = product.productName || product.name || 'Mudra Loan';
            const tenureStr = typeof product.tenure === 'object' && product.tenure !== null
              ? `${product.tenure.min}-${product.tenure.max} yrs`
              : `${product.tenureRange || product.tenure || '12-60'} mos`;

            return (
              <div key={product.id || idx} className="bg-[#1B2028] border border-[#323A46] p-6 rounded-2xl shadow-xl flex flex-col h-full hover:border-[#38BDF8]/40 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-xl bg-[#11141A] border border-[#323A46] text-[#38BDF8] flex items-center justify-center font-black text-xl mr-4 flex-shrink-0 shadow-inner">
                      {bank.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-[#DFE6EF]">{name}</h3>
                      <p className="text-xs text-[#7E8A99] font-medium">{bank}</p>
                    </div>
                  </div>
                  <StatusBadge 
                    status={product.eligible ? 'success' : 'danger'} 
                    label={product.eligible ? t('common.eligible') : t('common.notEligible')} 
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 my-4 flex-1">
                  <div className="bg-[#11141A] border border-[#323A46] p-3 rounded-xl">
                    <p className="text-xs text-[#7E8A99] mb-1">{t('financing.interestRate')}</p>
                    <p className="font-black text-[#DFE6EF] text-lg">{product.interestRate}%</p>
                  </div>
                  <div className="bg-[#11141A] border border-[#323A46] p-3 rounded-xl">
                    <p className="text-xs text-[#7E8A99] mb-1">{t('financing.maxAmount')}</p>
                    <p className="font-black text-[#DFE6EF] text-lg">{formatINR(product.maxAmount)}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-[#7E8A99] flex items-center">
                      <FileText size={15} className="mr-2 text-[#38BDF8]" /> {product.processingFee ? formatINR(product.processingFee) : 'Nil'} processing fee
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-[#323A46] flex items-center justify-between">
                  <span className="text-xs text-[#38BDF8] font-semibold bg-[#38BDF8]/10 px-2.5 py-1 rounded-full border border-[#38BDF8]/20">{tenureStr} tenure</span>
                  <button 
                    onClick={() => handleApplyClick(product)}
                    disabled={!product.eligible}
                    className={`px-5 py-2 rounded-xl font-bold text-sm transition-all ${
                      product.eligible 
                      ? 'bg-[#38BDF8] text-[#0B0C0F] hover:bg-[#0284C7] shadow-[0_0_12px_rgba(56,189,248,0.3)]' 
                      : 'bg-[#11141A] text-[#7E8A99] border border-[#323A46] cursor-not-allowed opacity-60'
                    }`}
                  >
                    {t('financing.apply')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Modal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        title={success ? t('financing.applySuccess') : `${t('financing.applyFor')} ${selectedProduct?.productName || selectedProduct?.name || ''}`}
        size="md"
      >
        {success ? (
          <div className="py-8 flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 bg-[#10B981]/20 border border-[#10B981]/30 text-[#10B981] rounded-full flex items-center justify-center">
              <CheckCircle size={32} />
            </div>
            <h3 className="text-xl font-bold text-[#DFE6EF]">{t('financing.applicationSubmitted')}</h3>
            <p className="text-[#7E8A99] text-sm max-w-sm">{t('financing.applicationSuccessMsg')}</p>
            <button onClick={() => setApplyModalOpen(false)} className="px-6 py-2.5 rounded-xl bg-[#38BDF8] text-[#0B0C0F] font-bold text-sm shadow-[0_0_15px_rgba(56,189,248,0.4)] mt-4 w-full max-w-xs">
              {t('common.done')}
            </button>
          </div>
        ) : (
          <div className="py-2">
            {/* Progress Bar */}
            <div className="flex mb-8">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex-1 flex flex-col items-center relative">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold z-10 text-xs ${step >= s ? 'bg-[#38BDF8] text-[#0B0C0F] shadow-[0_0_10px_rgba(56,189,248,0.4)]' : 'bg-[#11141A] border border-[#323A46] text-[#7E8A99]'}`}>
                    {s}
                  </div>
                  {s < 3 && (
                    <div className={`absolute top-4 left-1/2 w-full h-1 -z-0 ${step > s ? 'bg-[#38BDF8]' : 'bg-[#323A46]'}`} />
                  )}
                  <span className="text-[11px] mt-2 text-[#7E8A99]">Step {s}</span>
                </div>
              ))}
            </div>

            {/* Form Steps */}
            <div className="min-h-[200px]">
              {step === 1 && (
                <div className="space-y-4 animate-fade-in">
                  <h4 className="font-bold text-sm text-[#DFE6EF]">{t('financing.stepPersonal')}</h4>
                  <div>
                    <label className="block text-xs font-semibold text-[#7E8A99] uppercase tracking-wider mb-1.5">Full Name</label>
                    <input type="text" className="bg-[#11141A] border border-[#323A46] rounded-xl px-4 py-2.5 text-sm text-[#DFE6EF] focus:outline-none focus:border-[#38BDF8] w-full" defaultValue="Ramesh Patel" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#7E8A99] uppercase tracking-wider mb-1.5">PAN Number</label>
                    <input type="text" className="bg-[#11141A] border border-[#323A46] rounded-xl px-4 py-2.5 text-sm text-[#DFE6EF] focus:outline-none focus:border-[#38BDF8] w-full" defaultValue="ABCDE1234F" />
                  </div>
                </div>
              )}
              {step === 2 && (
                <div className="space-y-4 animate-fade-in">
                  <h4 className="font-bold text-sm text-[#DFE6EF]">{t('financing.stepBusiness')}</h4>
                  <div>
                    <label className="block text-xs font-semibold text-[#7E8A99] uppercase tracking-wider mb-1.5">Business Name</label>
                    <input type="text" className="bg-[#11141A] border border-[#323A46] rounded-xl px-4 py-2.5 text-sm text-[#DFE6EF] focus:outline-none focus:border-[#38BDF8] w-full" defaultValue="Patel General Store" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#7E8A99] uppercase tracking-wider mb-1.5">Annual Revenue</label>
                    <input type="text" className="bg-[#11141A] border border-[#323A46] rounded-xl px-4 py-2.5 text-sm text-[#DFE6EF] focus:outline-none focus:border-[#38BDF8] w-full" defaultValue="₹12,00,000" />
                  </div>
                </div>
              )}
              {step === 3 && (
                <div className="space-y-4 animate-fade-in">
                  <h4 className="font-bold text-sm text-[#DFE6EF]">{t('financing.stepLoan')}</h4>
                  <div>
                    <label className="block text-xs font-semibold text-[#7E8A99] uppercase tracking-wider mb-1.5">Loan Amount Required</label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-[#7E8A99]" size={16} />
                      <input 
                        type="number" 
                        value={formData.amount}
                        onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})}
                        className="bg-[#11141A] border border-[#323A46] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#DFE6EF] focus:outline-none focus:border-[#38BDF8] w-full" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#7E8A99] uppercase tracking-wider mb-1.5">Tenure (Months)</label>
                    <select 
                      value={formData.tenure}
                      onChange={(e) => setFormData({...formData, tenure: Number(e.target.value)})}
                      className="bg-[#11141A] border border-[#323A46] rounded-xl px-4 py-2.5 text-sm text-[#DFE6EF] focus:outline-none focus:border-[#38BDF8] w-full"
                    >
                      <option value="6">6 Months</option>
                      <option value="12">12 Months</option>
                      <option value="24">24 Months</option>
                      <option value="36">36 Months</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-between mt-8 pt-4 border-t border-[#323A46]">
              <button 
                onClick={() => step > 1 ? setStep(step - 1) : setApplyModalOpen(false)} 
                className="px-4 py-2 rounded-xl bg-[#11141A] border border-[#323A46] text-[#DFE6EF] text-sm font-semibold hover:bg-[#232A35] transition-colors"
                disabled={isSubmitting}
              >
                {step === 1 ? t('common.cancel') : t('common.back')}
              </button>
              <button 
                onClick={() => step < 3 ? setStep(step + 1) : handleSubmit()} 
                className="px-5 py-2 rounded-xl bg-[#38BDF8] text-[#0B0C0F] text-sm font-bold shadow-[0_0_12px_rgba(56,189,248,0.3)] hover:bg-[#0284C7] transition-all"
                disabled={isSubmitting}
              >
                {isSubmitting ? t('common.loading') : step < 3 ? t('common.next') : t('common.submit')}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
