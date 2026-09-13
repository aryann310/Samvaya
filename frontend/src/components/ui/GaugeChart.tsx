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
      <div className="absolute top-8 w-28 h-16 bg-primary/15 rounded-full blur-xl pointer-events-none" />

      <div className="relative" style={{ width: size, height: size / 2 }}>
        <svg
          width={size}
          height={size / 2}
          className="overflow-visible"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#facc15" />
              <stop offset="60%" stopColor="#84cc16" />
              <stop offset="100%" stopColor="#65a30d" />
            </linearGradient>
          </defs>
          <path
            d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
            fill="none"
            stroke="currentColor"
            className="text-muted"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          <path
            d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
            fill="none"
            stroke="url(#gaugeGradient)"
            className="transition-all duration-1000 ease-out drop-shadow-[0_0_12px_rgba(132,204,22,0.4)]"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={arcLength}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-end pb-1">
          <span className="text-4xl lg:text-5xl font-black tracking-tight text-foreground">
            {Math.round(animatedScore)}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Out of 100
          </span>
        </div>
      </div>
      {(label || explanation) && (
        <div className="text-center mt-5">
          {label && (
            <div className="font-bold text-xs uppercase tracking-wider text-foreground mb-1">
              {label}
            </div>
          )}
          {explanation && (
            <div className="text-xs text-muted-foreground max-w-[220px] leading-relaxed">
              {explanation}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GaugeChart;
