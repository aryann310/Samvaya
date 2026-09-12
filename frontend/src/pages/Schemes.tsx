import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi, formatINR } from '../hooks/useApi';
import { getSchemes } from '../services/api';
import PageHeader from '../components/ui/PageHeader';
import { SkeletonCard } from '../components/ui/SkeletonLoader';
import StatusBadge from '../components/ui/StatusBadge';
import Modal from '../components/ui/Modal';
import { Search, Building, CheckCircle, XCircle, ExternalLink, ShieldCheck } from 'lucide-react';

export default function Schemes() {
  const { t } = useTranslation();
  const { data: schemesData, loading: dataLoading } = useApi(
    () => getSchemes(),
    []
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedScheme, setSelectedScheme] = useState<any>(null);

  if (dataLoading || !schemesData) {
    return (
      <div className="page-enter p-6 space-y-6">
        <PageHeader title={t('schemes.title')} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  const filteredSchemes = (schemesData || [])
    .filter((scheme: any) => 
      scheme.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scheme.category?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a: any, b: any) => (b.matchPercentage || b.eligibilityMatch || 0) - (a.matchPercentage || a.eligibilityMatch || 0));

  return (
    <div className="page-enter p-4 md:p-6 space-y-6 bg-[#0B0C0F] text-[#DFE6EF] min-h-screen">
      <PageHeader title={t('schemes.title')} subtitle={t('schemes.subtitle')} />

      <div className="bg-[#1B2028] border border-[#323A46] p-4 rounded-2xl shadow-xl flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-[#7E8A99]" size={18} />
          <input 
            type="text" 
            placeholder={t('schemes.searchPlaceholder')} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#11141A] border border-[#323A46] text-[#DFE6EF] placeholder-[#7E8A99] pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] transition-all"
          />
        </div>
        <select className="bg-[#11141A] border border-[#323A46] text-[#DFE6EF] px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-[#38BDF8] w-full sm:w-auto">
          <option value="" className="bg-[#1B2028]">{t('common.allCategories')}</option>
          <option value="subsidy" className="bg-[#1B2028]">Subsidy</option>
          <option value="loan" className="bg-[#1B2028]">Loan</option>
          <option value="training" className="bg-[#1B2028]">Training</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredSchemes.map((scheme: any, idx: number) => {
          const match = scheme.matchPercentage || scheme.eligibilityMatch || 90;
          const benefitStr = typeof scheme.maxBenefit === 'number' ? formatINR(scheme.maxBenefit) : (scheme.maxBenefit || '₹10,00,000');

          return (
            <div 
              key={scheme.id || idx} 
              className="bg-[#1B2028] border border-[#323A46] rounded-2xl shadow-xl overflow-hidden flex flex-col cursor-pointer hover:border-[#38BDF8]/50 transition-all transform hover:-translate-y-1"
              onClick={() => setSelectedScheme(scheme)}
            >
              <div className="p-5 flex-1">
                <div className="flex justify-between items-start mb-3">
                  <StatusBadge status="info" label={scheme.category} size="sm" />
                  <div className="flex items-center space-x-1 bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] px-2.5 py-1 rounded-full text-xs font-bold">
                    <ShieldCheck size={14} />
                    <span>{match}% Match</span>
                  </div>
                </div>
                <h3 className="text-lg font-heading font-bold text-[#DFE6EF] mb-1.5 line-clamp-2">{scheme.name}</h3>
                <p className="text-xs text-[#7E8A99] mb-3 flex items-center">
                  <Building size={13} className="mr-1.5 text-[#38BDF8]" /> {scheme.ministry}
                </p>
                <p className="text-xs text-[#A4B0BE] line-clamp-3 leading-relaxed mb-4">{scheme.description}</p>
              </div>
              
              <div className="bg-[#11141A] p-4 border-t border-[#323A46] flex justify-between items-center">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#7E8A99] font-medium block">{t('schemes.maxBenefit')}</span>
                  <span className="font-bold text-[#38BDF8] text-sm">{benefitStr}</span>
                </div>
                <span className="text-xs font-bold text-[#38BDF8] hover:text-[#7DD3FC] flex items-center gap-1">
                  {t('common.viewDetails')} &rarr;
                </span>
              </div>
            </div>
          );
        })}
        {filteredSchemes.length === 0 && (
          <div className="col-span-full py-12 text-center text-[#7E8A99]">
            {t('schemes.noResults')}
          </div>
        )}
      </div>

      {selectedScheme && (
        <Modal
          isOpen={!!selectedScheme}
          onClose={() => setSelectedScheme(null)}
          title={selectedScheme.name}
          size="lg"
          footer={
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 w-full">
              <div className="text-sm">
                <span className="text-[#7E8A99]">{t('schemes.maxBenefit')}: </span>
                <span className="font-bold text-[#38BDF8]">
                  {typeof selectedScheme.maxBenefit === 'number' ? formatINR(selectedScheme.maxBenefit) : selectedScheme.maxBenefit}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <button onClick={() => setSelectedScheme(null)} className="px-4 py-2 rounded-xl bg-[#11141A] border border-[#323A46] text-[#DFE6EF] text-sm font-semibold hover:bg-[#232A35] transition-colors">
                  {t('common.close')}
                </button>
                <a 
                  href={selectedScheme.officialLink || selectedScheme.link || '#'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-5 py-2 rounded-xl bg-[#38BDF8] text-[#0B0C0F] text-sm font-bold shadow-[0_0_12px_rgba(56,189,248,0.3)] hover:bg-[#0284C7] transition-all inline-flex items-center"
                >
                  {t('schemes.applyOfficial')} <ExternalLink size={16} className="ml-2" />
                </a>
              </div>
            </div>
          }
        >
          <div className="space-y-5 py-2">
            <div className="flex items-center space-x-2 text-xs text-[#7E8A99] border-b border-[#323A46] pb-3">
              <Building size={15} className="text-[#38BDF8]" />
              <span>{selectedScheme.ministry}</span>
              <span>&bull;</span>
              <span className="bg-[#11141A] border border-[#323A46] px-2 py-0.5 rounded text-[#38BDF8]">{selectedScheme.category}</span>
            </div>

            <div>
              <h4 className="font-heading font-bold text-base text-[#DFE6EF] mb-2">{t('schemes.description')}</h4>
              <p className="text-[#A4B0BE] text-sm leading-relaxed">{selectedScheme.description}</p>
            </div>

            <div>
              <h4 className="font-heading font-bold text-base text-[#DFE6EF] mb-2.5">{t('schemes.benefits')}</h4>
              <ul className="space-y-2">
                {selectedScheme.benefits?.map((benefit: string, i: number) => (
                  <li key={i} className="flex items-start text-sm">
                    <CheckCircle className="text-[#10B981] mt-0.5 mr-2.5 flex-shrink-0" size={16} />
                    <span className="text-[#DFE6EF]">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-heading font-bold text-base text-[#DFE6EF] mb-2.5">{t('schemes.eligibility')}</h4>
              <div className="bg-[#11141A] border border-[#323A46] p-4 rounded-xl space-y-3">
                {(selectedScheme.eligibilityCriteria || selectedScheme.criteria || []).map((criterion: any, i: number) => (
                  <div key={i} className="flex items-start justify-between text-sm">
                    <span className="text-[#DFE6EF]">{criterion.criterion || criterion.rule || criterion.name}</span>
                    {criterion.met ? (
                      <CheckCircle className="text-[#10B981] flex-shrink-0 ml-4" size={18} />
                    ) : (
                      <XCircle className="text-[#EF4444] flex-shrink-0 ml-4" size={18} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
