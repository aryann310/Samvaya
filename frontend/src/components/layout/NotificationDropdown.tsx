import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  CheckCircle, 
  AlertTriangle, 
  Sparkles, 
  Package, 
  Check, 
  Trash2, 
  X 
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useBusiness } from '../../contexts/BusinessContext';
import { getDashboard, getInventory } from '../../services/api';

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'warning' | 'alert' | 'ai' | 'info' | 'success';
  read: boolean;
  route?: string;
}

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Low Stock Alert: Sharbati Wheat Flour',
    description: 'Current stock is 120 kg, below minimum threshold of 150 kg.',
    time: '15m ago',
    type: 'warning',
    read: false,
    route: '/inventory'
  },
  {
    id: 'notif-2',
    title: 'GST Return Filing Due',
    description: 'Monthly GSTR-3B filing is due in 4 days. Verify invoice records.',
    time: '1h ago',
    type: 'alert',
    read: false,
    route: '/finances'
  },
  {
    id: 'notif-3',
    title: 'AI Advisory: Mandi Price Surge',
    description: 'Mandi prices for Mustard Seeds rose 8% this morning in APMC.',
    time: '3h ago',
    type: 'ai',
    read: false,
    route: '/advisor'
  },
  {
    id: 'notif-4',
    title: 'Pre-Approved Credit Limit',
    description: 'Mudra Shishu loan eligible for up to ₹50,000 working capital.',
    time: 'Yesterday',
    type: 'info',
    read: true,
    route: '/financing'
  }
];

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem('samvaya_notifications');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return DEFAULT_NOTIFICATIONS;
  });

  const { businessId } = useBusiness();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Save to localStorage whenever notifications change
  useEffect(() => {
    try {
      localStorage.setItem('samvaya_notifications', JSON.stringify(notifications));
    } catch {
      // ignore
    }
  }, [notifications]);

  // Synchronize with real backend data if available
  useEffect(() => {
    let isMounted = true;
    const fetchLiveAlerts = async () => {
      try {
        const [dashData, invData] = await Promise.all([
          getDashboard(businessId).catch(() => null),
          getInventory(businessId).catch(() => null)
        ]);

        if (!isMounted) return;

        const liveItems: NotificationItem[] = [];

        // Low stock items from real inventory
        if (invData && Array.isArray(invData)) {
          invData
            .filter((item: any) => item.quantity <= item.reorderLevel)
            .slice(0, 3)
            .forEach((item: any) => {
              liveItems.push({
                id: `inv-${item.id}`,
                title: `Low Stock: ${item.name}`,
                description: `Only ${item.quantity} ${item.unit} remaining (Reorder level: ${item.reorderLevel}).`,
                time: 'Just now',
                type: 'warning',
                read: false,
                route: '/inventory'
              });
            });
        }

        // Uncompleted priorities from dashboard
        if (dashData?.priorities && Array.isArray(dashData.priorities)) {
          dashData.priorities
            .filter((p: any) => !p.completed)
            .slice(0, 2)
            .forEach((p: any) => {
              liveItems.push({
                id: `pri-${p.id}`,
                title: p.title,
                description: p.description,
                time: 'Today',
                type: 'alert',
                read: false,
                route: p.route || '/finances'
              });
            });
        }

        // Only merge if we got real items and not already present
        if (liveItems.length > 0) {
          setNotifications(prev => {
            const existingIds = new Set(prev.map(n => n.id));
            const newToAdd = liveItems.filter(n => !existingIds.has(n.id));
            if (newToAdd.length === 0) return prev;
            return [...newToAdd, ...prev];
          });
        }
      } catch {
        // Backend offline or mock data - preserve current notifications
      }
    };

    fetchLiveAlerts();
    return () => { isMounted = false; };
  }, [businessId]);

  // Close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const removeNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleNotificationClick = (item: NotificationItem) => {
    // Mark as read
    setNotifications(prev => prev.map(n => n.id === item.id ? { ...n, read: true } : n));
    setIsOpen(false);
    if (item.route) {
      navigate(item.route);
    }
  };

  const getIcon = (type: NotificationItem['type']) => {
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
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button 
        onClick={() => setIsOpen(prev => !prev)}
        className={cn(
          "relative w-9 h-9 rounded-xl bg-card/70 backdrop-blur-md border border-glass-border flex items-center justify-center text-muted-foreground hover:text-foreground shadow-glass-shadow transition-all focus:outline-none",
          isOpen && "border-foreground/30 text-foreground bg-muted"
        )}
        title={unreadCount > 0 ? `${unreadCount} unread notifications` : "Notifications"}
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-2 h-2 bg-lime-500 rounded-full ring-2 ring-card animate-pulse" />
        )}
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-80 sm:w-96 bg-card border border-glass-border rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between bg-muted/30">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-foreground">Notifications</span>
              {unreadCount > 0 ? (
                <span className="bg-lime-500/15 text-lime-600 dark:text-lime-400 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-lime-500/30">
                  {unreadCount} new
                </span>
              ) : (
                <span className="bg-muted text-muted-foreground text-[10px] font-medium px-1.5 py-0.5 rounded-full">
                  0 unread
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-muted transition-colors"
                  title="Mark all as read"
                >
                  <Check className="w-3 h-3" />
                  <span>Mark read</span>
                </button>
              )}
              {notifications.length > 0 && (
                <button 
                  onClick={clearAllNotifications}
                  className="text-[11px] text-muted-foreground hover:text-destructive flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-destructive/10 transition-colors"
                  title="Clear all notifications"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              )}
            </div>
          </div>

          {/* List of Notifications */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-border/30">
            {notifications.length === 0 ? (
              <div className="py-10 px-4 text-center">
                <div className="w-10 h-10 rounded-full bg-muted/60 flex items-center justify-center mx-auto mb-2 text-muted-foreground">
                  <CheckCircle className="w-5 h-5 text-lime-500" />
                </div>
                <h4 className="text-sm font-semibold text-foreground">All caught up!</h4>
                <p className="text-xs text-muted-foreground mt-1 max-w-[220px] mx-auto leading-relaxed">
                  No notifications to display right now. Real-time alerts will appear here.
                </p>
              </div>
            ) : (
              notifications.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => handleNotificationClick(item)}
                  className={cn(
                    "p-3.5 flex items-start gap-3 transition-colors cursor-pointer relative group",
                    item.read 
                      ? "hover:bg-muted/40 opacity-80 hover:opacity-100" 
                      : "bg-muted/20 hover:bg-muted/50"
                  )}
                >
                  {/* Icon Indicator */}
                  <div className="w-8 h-8 rounded-xl bg-card border border-border/60 flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                    {getIcon(item.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-1.5">
                      <h5 className={cn(
                        "text-xs truncate text-foreground",
                        !item.read ? "font-bold" : "font-medium"
                      )}>
                        {item.title}
                      </h5>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                    <span className="text-[10px] text-muted-foreground/70 mt-1 block">
                      {item.time}
                    </span>
                  </div>

                  {/* Unread blue/lime dot */}
                  {!item.read && (
                    <span className="w-2 h-2 rounded-full bg-lime-500 shrink-0 mt-1.5" />
                  )}

                  {/* Dismiss X button on hover */}
                  <button
                    onClick={(e) => removeNotification(item.id, e)}
                    className="absolute right-2 top-2 p-1 text-muted-foreground/50 hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity rounded-md"
                    title="Dismiss"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
