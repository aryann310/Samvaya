import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AlertTriangle, 
  Sparkles, 
  Package, 
  CheckCircle, 
  Bell, 
  X, 
  ArrowRight 
} from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ToastData {
  id: string;
  title: string;
  description: string;
  type?: 'warning' | 'alert' | 'ai' | 'info' | 'success';
  route?: string;
  duration?: number;
}

// Global helper to trigger a toast from anywhere in the app
export const triggerToast = (toast: Omit<ToastData, 'id'>) => {
  const event = new CustomEvent('samvaya-toast', {
    detail: { ...toast, id: 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4) }
  });
  window.dispatchEvent(event);
};

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const navigate = useNavigate();

  // Listen for custom toast events
  useEffect(() => {
    const handleToastEvent = (e: Event) => {
      const customEvent = e as CustomEvent<ToastData>;
      if (customEvent.detail) {
        setToasts((prev) => [customEvent.detail, ...prev.slice(0, 3)]); // Keep max 4 toasts
      }
    };

    window.addEventListener('samvaya-toast', handleToastEvent);

    // Initial alert on load so the user sees the top-right corner notification in action
    const timer = setTimeout(() => {
      triggerToast({
        title: 'Mandi Price Alert',
        description: 'Mustard seed APMC price surged +8% today. Good time to sell inventory.',
        type: 'ai',
        route: '/advisor',
        duration: 7000
      });
    }, 1200);

    return () => {
      window.removeEventListener('samvaya-toast', handleToastEvent);
      clearTimeout(timer);
    };
  }, []);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleToastClick = (toast: ToastData) => {
    dismissToast(toast.id);
    if (toast.route) {
      navigate(toast.route);
    }
  };

  const getIcon = (type?: ToastData['type']) => {
    switch (type) {
      case 'warning':
        return <Package className="w-4 h-4 text-amber-500" />;
      case 'alert':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'ai':
        return <Sparkles className="w-4 h-4 text-lime-500" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      default:
        return <Bell className="w-4 h-4 text-sky-500" />;
    }
  };

  return (
    <div 
      aria-live="polite" 
      className="fixed top-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-[360px] w-full pointer-events-none select-none"
    >
      {toasts.map((toast) => (
        <ToastCard 
          key={toast.id} 
          toast={toast} 
          onDismiss={() => dismissToast(toast.id)} 
          onClick={() => handleToastClick(toast)}
          getIcon={getIcon}
        />
      ))}
    </div>
  );
}

function ToastCard({
  toast,
  onDismiss,
  onClick,
  getIcon
}: {
  toast: ToastData;
  onDismiss: () => void;
  onClick: () => void;
  getIcon: (type?: ToastData['type']) => React.ReactNode;
}) {
  const duration = toast.duration || 6000;

  // Auto dismiss timer
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  return (
    <div
      onClick={onClick}
      className={cn(
        "pointer-events-auto bg-card/95 backdrop-blur-md border border-glass-border shadow-2xl rounded-2xl p-3.5 flex flex-col gap-2 transition-all duration-300 cursor-pointer group hover:border-foreground/20 hover:scale-[1.01] relative overflow-hidden",
        "animate-in slide-in-from-right-8 fade-in-0 duration-250 ease-out"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Type Icon Badge */}
        <div className="w-8 h-8 rounded-xl bg-muted/70 border border-border/50 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
          {getIcon(toast.type)}
        </div>

        {/* Text Details */}
        <div className="flex-1 min-w-0 pr-4">
          <div className="flex items-center gap-1.5">
            <h5 className="text-xs font-bold text-foreground truncate">
              {toast.title}
            </h5>
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">
            {toast.description}
          </p>

          {toast.route && (
            <div className="flex items-center gap-1 text-[11px] font-semibold text-lime-600 dark:text-lime-400 mt-1.5 group-hover:underline">
              <span>View details</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDismiss();
          }}
          className="text-muted-foreground/60 hover:text-foreground p-1 rounded-lg hover:bg-muted transition-colors shrink-0 -mr-1 -mt-1"
          title="Dismiss notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Subtle Bottom Auto-dismiss Countdown Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-muted overflow-hidden">
        <div 
          className="h-full bg-lime-500/70 dark:bg-lime-400/80 animate-shrink" 
          style={{ animation: `shrinkWidth ${duration}ms linear forwards` }}
        />
      </div>

      <style>{`
        @keyframes shrinkWidth {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}
