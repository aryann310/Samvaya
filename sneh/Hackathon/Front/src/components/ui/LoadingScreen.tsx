import React from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50">
      <div className="flex flex-col items-center gap-4 animate-fade-in">
        <img 
          src="/logo-icon.png" 
          alt="Samvaya Logo" 
          className="w-16 h-16 rounded-2xl shadow-warm-lg animate-bounce object-contain"
        />
        <h1 className="text-3xl font-heading font-bold text-primary tracking-tight">
          Samvaya
        </h1>
        <div className="flex items-center gap-2 text-sm text-body-text/80 font-medium">
          <Loader2 className="w-4 h-4 text-primary animate-spin" />
          <span>{t('common.loading') || 'Loading intelligence...'}</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
