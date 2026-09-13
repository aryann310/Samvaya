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
    <div className="page-enter p-4 md:p-6 space-y-8 min-h-screen">
      <PageHeader 
        title={t('financing.title', 'Financing & Loan Readiness')} 
        subtitle={t('financing.subtitle', 'Creditworthiness score, factor analysis, and tailored government-backed micro-loan schemes.')} 
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card/70 backdrop-blur-md border border-glass-border p-6 rounded-3xl shadow-glass-shadow flex flex-col items-center justify-center">
          <GaugeChart 
            score={financeData.readinessScore} 
            label={t('financing.readinessScore', 'Financial Readiness Score')} 
            size={180} 
            explanation={t('financing.readinessDesc', 'Composite evaluation based on live revenue stability and debt ratios.')}
          />
        </div>

        <div className="md:col-span-2 bg-card/70 backdrop-blur-md border border-glass-border p-6 rounded-3xl shadow-glass-shadow">
          <div className="flex items-center justify-between pb-3 border-b border-glass-border mb-5">
            <h2 className="text-xl font-bold text-foreground">{t('financing.scoreFactors', 'Score Breakdown')}</h2>
            <span className="text-xs text-lime-700 dark:text-lime-400 bg-lime-500/10 border border-lime-500/20 px-2.5 py-0.5 rounded-full font-semibold">Credit Engine</span>
          </div>
          <div className="space-y-4">
            {financeData.readinessFactors.map((factor: any, idx: number) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-semibold text-foreground">{factor.name}</span>
                  <span className="text-lime-600 dark:text-lime-400 font-mono text-xs font-bold">{factor.score}/{factor.maxScore}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5 border border-border overflow-hidden">
                  <div 
                    className="bg-[#84cc16] bg-diagonal-stripes h-2.5 rounded-full shadow-xs transition-all duration-500" 
                    style={{ width: `${(factor.score / factor.maxScore) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-foreground px-1">{t('financing.loanProducts', 'Available Loan Products')}</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {financeData.loanProducts.map((product: any, idx: number) => {
            const bank = product.bankName || product.provider || 'SBI';
            const name = product.productName || product.name || 'Mudra Loan';
            const tenureStr = typeof product.tenure === 'object' && product.tenure !== null
              ? `${product.tenure.min}-${product.tenure.max} yrs`
              : `${product.tenureRange || product.tenure || '12-60'} mos`;

            return (
              <div key={product.id || idx} className="bg-card/70 backdrop-blur-md border border-glass-border p-6 rounded-3xl shadow-glass-shadow flex flex-col h-full hover:border-primary/40 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-2xl bg-muted border border-border text-foreground flex items-center justify-center font-black text-xl mr-4 flex-shrink-0 shadow-2xs">
                      {bank.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-foreground">{name}</h3>
                      <p className="text-xs text-muted-foreground font-medium">{bank}</p>
                    </div>
                  </div>
                  <StatusBadge 
                    status={product.eligible ? 'success' : 'danger'} 
                    label={product.eligible ? t('common.eligible', 'Eligible') : t('common.notEligible', 'Ineligible')} 
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 my-4 flex-1">
                  <div className="bg-muted/60 border border-border p-3 rounded-2xl">
                    <p className="text-xs text-muted-foreground mb-1">{t('financing.interestRate', 'Interest Rate')}</p>
                    <p className="font-black text-foreground text-lg">{product.interestRate}%</p>
                  </div>
                  <div className="bg-muted/60 border border-border p-3 rounded-2xl">
                    <p className="text-xs text-muted-foreground mb-1">{t('financing.maxAmount', 'Maximum Amount')}</p>
                    <p className="font-black text-foreground text-lg">{formatINR(product.maxAmount)}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground flex items-center">
                      <FileText size={15} className="mr-2 text-lime-600 dark:text-lime-400" /> {product.processingFee ? formatINR(product.processingFee) : 'Nil'} processing fee
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-glass-border flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-semibold bg-muted px-2.5 py-1 rounded-full border border-border">{tenureStr} tenure</span>
                  <button 
                    onClick={() => handleApplyClick(product)}
                    disabled={!product.eligible}
                    className={`px-5 py-2 rounded-xl font-bold text-sm transition-all ${
                      product.eligible 
                      ? 'bg-primary hover:bg-primary-hover text-primary-foreground shadow-xs' 
                      : 'bg-muted text-muted-foreground border border-border cursor-not-allowed opacity-60'
                    }`}
                  >
                    {t('financing.apply', 'Apply Now')}
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
        title={success ? t('financing.applySuccess', 'Application Submitted') : `${t('financing.applyFor', 'Apply for')} ${selectedProduct?.productName || selectedProduct?.name || ''}`}
        size="md"
      >
        {success ? (
          <div className="py-8 flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 rounded-full flex items-center justify-center">
              <CheckCircle size={32} />
            </div>
            <h3 className="text-xl font-bold text-foreground">{t('financing.applicationSubmitted', 'Application Submitted!')}</h3>
            <p className="text-muted-foreground text-sm max-w-sm">{t('financing.applicationSuccessMsg', 'Your loan application has been received and forwarded to partner financial institutions.')}</p>
            <button onClick={() => setApplyModalOpen(false)} className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-sm shadow-xs mt-4 w-full max-w-xs">
              {t('common.done', 'Done')}
            </button>
          </div>
        ) : (
          <div className="py-2">
            {/* Progress Bar */}
            <div className="flex mb-8">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex-1 flex flex-col items-center relative">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold z-10 text-xs ${step >= s ? 'bg-primary text-primary-foreground shadow-xs' : 'bg-muted border border-border text-muted-foreground'}`}>
                    {s}
                  </div>
                  {s < 3 && (
                    <div className={`absolute top-4 left-1/2 w-full h-1 -z-0 ${step > s ? 'bg-primary' : 'bg-border'}`} />
                  )}
                  <span className="text-[11px] mt-2 text-muted-foreground">Step {s}</span>
                </div>
              ))}
            </div>

            {/* Form Steps */}
            <div className="min-h-[200px]">
              {step === 1 && (
                <div className="space-y-4 animate-fade-in">
                  <h4 className="font-bold text-sm text-foreground">{t('financing.stepPersonal', 'Personal Information')}</h4>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Full Name</label>
                    <input type="text" className="bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 w-full" defaultValue="Arvindbhai Patel" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">PAN Number</label>
                    <input type="text" className="bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 w-full uppercase" defaultValue="ABCDE1234F" />
                  </div>
                </div>
              )}
              {step === 2 && (
                <div className="space-y-4 animate-fade-in">
                  <h4 className="font-bold text-sm text-foreground">{t('financing.stepBusiness', 'Business Details')}</h4>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Business Name</label>
                    <input type="text" className="bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 w-full" defaultValue="Shree Ganesh Kirana Store" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Annual Revenue</label>
                    <input type="text" className="bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 w-full" defaultValue="₹12,00,000" />
                  </div>
                </div>
              )}
              {step === 3 && (
                <div className="space-y-4 animate-fade-in">
                  <h4 className="font-bold text-sm text-foreground">{t('financing.stepLoan', 'Loan Requirements')}</h4>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Loan Amount Required</label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                      <input 
                        type="number" 
                        value={formData.amount}
                        onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})}
                        className="bg-background border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 w-full" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Tenure (Months)</label>
                    <select 
                      value={formData.tenure}
                      onChange={(e) => setFormData({...formData, tenure: Number(e.target.value)})}
                      className="bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 w-full"
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
            <div className="flex justify-between mt-8 pt-4 border-t border-glass-border">
              <button 
                onClick={() => step > 1 ? setStep(step - 1) : setApplyModalOpen(false)} 
                className="px-4 py-2 rounded-xl bg-muted border border-border text-foreground text-sm font-semibold hover:bg-muted/80 transition-colors"
                disabled={isSubmitting}
              >
                {step === 1 ? t('common.cancel', 'Cancel') : t('common.back', 'Back')}
              </button>
              <button 
                onClick={() => step < 3 ? setStep(step + 1) : handleSubmit()} 
                className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground text-sm font-bold shadow-xs transition-all"
                disabled={isSubmitting}
              >
                {isSubmitting ? t('common.loading', 'Loading...') : step < 3 ? t('common.next', 'Next') : t('common.submit', 'Submit Application')}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
