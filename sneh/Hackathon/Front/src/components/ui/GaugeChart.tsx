import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface GaugeChartProps {
  score: number;
  size?: number;
  label?: string;
  explanation?: string;
}

const GaugeChart: React.FC<GaugeChartProps> = ({
  score,
  size = 200,
  label,
  explanation,
}) => {
  const { t } = useTranslation();
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 100);
    return () => clearTimeout(timer);
  }, [score]);

  const strokeWidth = size * 0.1;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const arcLength = circumference / 2;
  const strokeDashoffset = arcLength - (animatedScore / 100) * arcLength;

  let colorClass = 'text-danger';
  if (score > 80) colorClass = 'text-success';
  else if (score > 60) colorClass = 'text-primary-light';
  else if (score > 40) colorClass = 'text-warning';

  return (
    <div className="flex flex-col items-center animate-fade-in relative" style={{ width: size }}>
      {/* Ambient glow behind score */}
      <div className="absolute top-8 w-28 h-16 bg-[#38BDF8]/10 rounded-full blur-xl pointer-events-none" />

      <div className="relative" style={{ width: size, height: size / 2 }}>
        <svg
          width={size}
          height={size / 2}
          className="overflow-visible"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#323A46" />
              <stop offset="50%" stopColor="#7E8A99" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>
          </defs>
          <path
            d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
            fill="none"
            stroke="currentColor"
            className="text-[#323A46]"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          <path
            d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
            fill="none"
            stroke="url(#gaugeGradient)"
            className="transition-all duration-1000 ease-out drop-shadow-[0_0_12px_rgba(56,189,248,0.3)]"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={arcLength}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-end pb-1">
          <span className="font-heading text-4xl lg:text-5xl font-black tracking-tight text-[#DFE6EF]">
            {Math.round(animatedScore)}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#7E8A99]">
            Out of 100
          </span>
        </div>
      </div>
      {(label || explanation) && (
        <div className="text-center mt-5">
          {label && (
            <div className="font-heading font-bold text-sm text-[#DFE6EF] uppercase tracking-wider mb-1">
              {label}
            </div>
          )}
          {explanation && (
            <div className="font-body text-xs text-[#7E8A99] max-w-[220px] leading-relaxed">
              {explanation}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GaugeChart;
