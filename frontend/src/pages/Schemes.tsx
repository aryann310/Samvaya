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
    <div className="page-enter p-4 md:p-6 space-y-6 min-h-screen">
      <PageHeader 
        title={t('schemes.title', 'Government Schemes & Subsidies')} 
        subtitle={t('schemes.subtitle', 'Explore national and state schemes matched specifically to your business category.')} 
      />

      <div className="bg-card/70 backdrop-blur-md border border-glass-border p-4 rounded-3xl shadow-glass-shadow flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <input 
            type="text" 
            placeholder={t('schemes.searchPlaceholder', 'Search by scheme name or ministry...')} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-background border border-border text-foreground placeholder:text-muted-foreground pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <select className="bg-background border border-border text-foreground px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 w-full sm:w-auto">
          <option value="">{t('common.allCategories', 'All Categories')}</option>
          <option value="subsidy">Subsidy</option>
          <option value="loan">Loan</option>
          <option value="training">Training</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredSchemes.map((scheme: any, idx: number) => {
          const match = scheme.matchPercentage || scheme.eligibilityMatch || 90;
          const benefitStr = typeof scheme.maxBenefit === 'number' ? formatINR(scheme.maxBenefit) : (scheme.maxBenefit || '₹10,00,000');

          return (
            <div 
              key={scheme.id || idx} 
              className="bg-card/70 backdrop-blur-md border border-glass-border rounded-3xl shadow-glass-shadow overflow-hidden flex flex-col cursor-pointer hover:border-primary/50 transition-all transform hover:-translate-y-1"
              onClick={() => setSelectedScheme(scheme)}
            >
              <div className="p-5 flex-1">
                <div className="flex justify-between items-start mb-3">
                  <StatusBadge status="info" label={scheme.category} size="sm" />
                  <div className="flex items-center space-x-1 bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full text-xs font-bold">
                    <ShieldCheck size={14} />
                    <span>{match}% Match</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-1.5 line-clamp-2">{scheme.name}</h3>
                <p className="text-xs text-muted-foreground mb-3 flex items-center">
                  <Building size={13} className="mr-1.5 text-primary" /> {scheme.ministry}
                </p>
                <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed mb-4">{scheme.description}</p>
              </div>
              
              <div className="bg-muted/40 p-4 border-t border-glass-border flex justify-between items-center">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium block">{t('schemes.maxBenefit', 'Max Benefit')}</span>
                  <span className="font-bold text-foreground text-sm">{benefitStr}</span>
                </div>
                <span className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                  {t('common.viewDetails', 'View Details')} &rarr;
                </span>
              </div>
            </div>
          );
        })}
        {filteredSchemes.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            {t('schemes.noResults', 'No government schemes match your filter criteria.')}
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
                <span className="text-muted-foreground">{t('schemes.maxBenefit', 'Max Benefit')}: </span>
                <span className="font-bold text-foreground">
                  {typeof selectedScheme.maxBenefit === 'number' ? formatINR(selectedScheme.maxBenefit) : selectedScheme.maxBenefit}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <button onClick={() => setSelectedScheme(null)} className="px-4 py-2 rounded-xl bg-muted border border-border text-foreground text-sm font-semibold hover:bg-muted/80 transition-colors">
                  {t('common.close', 'Close')}
                </button>
                <a 
                  href={selectedScheme.officialLink || selectedScheme.link || '#'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground text-sm font-bold shadow-xs transition-all inline-flex items-center"
                >
                  {t('schemes.applyOfficial', 'Official Portal')} <ExternalLink size={16} className="ml-2" />
                </a>
              </div>
            </div>
          }
        >
          <div className="space-y-5 py-2">
            <div className="flex items-center space-x-2 text-xs text-muted-foreground border-b border-glass-border pb-3">
              <Building size={15} className="text-primary" />
              <span>{selectedScheme.ministry}</span>
              <span>&bull;</span>
              <span className="bg-muted border border-border px-2 py-0.5 rounded-md text-foreground font-medium">{selectedScheme.category}</span>
            </div>

            <div>
              <h4 className="font-bold text-base text-foreground mb-2">{t('schemes.description', 'Scheme Overview')}</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">{selectedScheme.description}</p>
            </div>

            <div>
              <h4 className="font-bold text-base text-foreground mb-2.5">{t('schemes.benefits', 'Scheme Benefits')}</h4>
              <ul className="space-y-2">
                {selectedScheme.benefits?.map((benefit: string, i: number) => (
                  <li key={i} className="flex items-start text-sm">
                    <CheckCircle className="text-emerald-500 mt-0.5 mr-2.5 flex-shrink-0" size={16} />
                    <span className="text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-base text-foreground mb-2.5">{t('schemes.eligibility', 'Eligibility Criteria')}</h4>
              <div className="bg-muted/40 border border-border p-4 rounded-2xl space-y-3">
                {(selectedScheme.eligibilityCriteria || selectedScheme.criteria || []).map((criterion: any, i: number) => (
                  <div key={i} className="flex items-start justify-between text-sm">
                    <span className="text-foreground">{criterion.criterion || criterion.rule || criterion.name}</span>
                    {criterion.met ? (
                      <CheckCircle className="text-emerald-500 flex-shrink-0 ml-4" size={18} />
                    ) : (
                      <XCircle className="text-rose-500 flex-shrink-0 ml-4" size={18} />
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
