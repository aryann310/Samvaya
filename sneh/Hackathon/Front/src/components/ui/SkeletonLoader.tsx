import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="card p-4 animate-pulse">
      <div className="h-4 bg-border/50 rounded w-1/3 mb-4"></div>
      <div className="h-4 bg-border/50 rounded w-full mb-2"></div>
      <div className="h-4 bg-border/50 rounded w-5/6"></div>
    </div>
  );
};

export const SkeletonTable: React.FC = () => {
  return (
    <div className="w-full flex flex-col gap-3 animate-pulse">
      <div className="h-8 bg-border/50 rounded w-full"></div>
      <div className="h-8 bg-border/50 rounded w-full"></div>
      <div className="h-8 bg-border/50 rounded w-full"></div>
      <div className="h-8 bg-border/50 rounded w-full"></div>
      <div className="h-8 bg-border/50 rounded w-full"></div>
    </div>
  );
};

export const SkeletonText: React.FC<{ lines?: number }> = ({ lines = 3 }) => {
  return (
    <div className="flex flex-col gap-2 animate-pulse">
      {Array.from({ length: lines }).map((_, i) => (
        <div 
          key={i} 
          className={`h-4 bg-border/50 rounded ${i === lines - 1 ? 'w-2/3' : 'w-full'}`}
        ></div>
      ))}
    </div>
  );
};

export const SkeletonChart: React.FC = () => {
  return (
    <div className="w-full h-64 bg-border/50 rounded-lg animate-pulse flex items-end p-4 gap-2">
       <div className="w-1/6 h-1/3 bg-border/30 rounded-t"></div>
       <div className="w-1/6 h-2/3 bg-border/30 rounded-t"></div>
       <div className="w-1/6 h-1/2 bg-border/30 rounded-t"></div>
       <div className="w-1/6 h-full bg-border/30 rounded-t"></div>
       <div className="w-1/6 h-4/5 bg-border/30 rounded-t"></div>
       <div className="w-1/6 h-2/5 bg-border/30 rounded-t"></div>
    </div>
  );
};
