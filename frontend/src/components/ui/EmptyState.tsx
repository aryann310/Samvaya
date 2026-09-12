import React from 'react';
import { useTranslation } from 'react-i18next';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center animate-fade-in w-full">
      {icon && (
        <div className="text-body-text/30 mb-4 flex justify-center">
          {icon}
        </div>
      )}
      <h3 className="font-heading text-lg font-semibold text-charcoal mb-2">
        {title}
      </h3>
      <p className="font-body text-body-text mb-6 max-w-sm">
        {description}
      </p>
      {action && (
        <button className="btn-primary" onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
