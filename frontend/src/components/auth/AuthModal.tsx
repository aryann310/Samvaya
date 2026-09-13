import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { X, Lock, Mail, Phone, User as UserIcon, Building, ShieldCheck, Loader2, KeyRound } from 'lucide-react';

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authModalTab, openAuthModal, login, signup } = useAuth();
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupBusinessName, setSignupBusinessName] = useState('');

  // General state
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login({ email: loginEmail, password: loginPassword });
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please verify your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (signupPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsSubmitting(true);
    try {
      await signup({
        name: signupName,
        email: signupEmail,
        phone: signupPhone,
        password: signupPassword,
        businessName: signupBusinessName || undefined,
        role: 'entrepreneur',
      });
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemoKiranaCredentials = () => {
    setLoginEmail('patel@samvaya.in');
    setLoginPassword('kirana123');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-card/95 backdrop-blur-xl border border-border/80 rounded-2xl shadow-2xl overflow-hidden text-card-foreground"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header decoration */}
        <div className="h-1.5 w-full bg-gradient-to-r from-primary via-emerald-500 to-teal-500" />

        {/* Modal Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 pt-5">
          {/* Logo / Badge */}
          <div className="flex items-center gap-2.5 mb-5">
            <div className="h-9 w-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">Samvaya Access</h2>
              <p className="text-[11px] text-muted-foreground">Encrypted Kirana & SME Intelligence Portal</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex rounded-xl bg-muted/60 p-1 mb-5">
            <button
              type="button"
              onClick={() => { openAuthModal('signin'); setError(null); }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                authModalTab === 'signin'
                  ? 'bg-card text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { openAuthModal('signup'); setError(null); }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                authModalTab === 'signup'
                  ? 'bg-card text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Error Notice */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium flex items-start gap-2">
              <span className="font-bold">Error:</span> {error}
            </div>
          )}

          {/* SIGN IN TAB */}
          {authModalTab === 'signin' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="e.g. patel@samvaya.in"
                    className="w-full bg-background border border-input rounded-xl pl-9 pr-3.5 py-2 text-xs text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-foreground">Password</label>
                  <button
                    type="button"
                    onClick={fillDemoKiranaCredentials}
                    className="text-[11px] text-primary hover:underline font-medium"
                  >
                    Use Demo Owner Credentials
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-background border border-input rounded-xl pl-9 pr-3.5 py-2 text-xs text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-2.5 px-4 bg-primary text-primary-foreground font-medium rounded-xl text-xs shadow-md hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Authenticating...
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" /> Sign In with JWT
                  </>
                )}
              </button>
            </form>
          ) : (
            /* CREATE ACCOUNT TAB */
            <form onSubmit={handleSignup} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    placeholder="e.g. Rameshbhai Patel"
                    className="w-full bg-background border border-input rounded-xl pl-9 pr-3.5 py-2 text-xs text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="e.g. name@kirana.in"
                    className="w-full bg-background border border-input rounded-xl pl-9 pr-3.5 py-2 text-xs text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Phone Number <span className="text-[10px] text-primary">(Encrypted at rest)</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={signupPhone}
                    onChange={(e) => setSignupPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full bg-background border border-input rounded-xl pl-9 pr-3.5 py-2 text-xs text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Business Name (Optional)</label>
                <div className="relative">
                  <Building className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={signupBusinessName}
                    onChange={(e) => setSignupBusinessName(e.target.value)}
                    placeholder="e.g. Patel General Store"
                    className="w-full bg-background border border-input rounded-xl pl-9 pr-3.5 py-2 text-xs text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Password (Min 6 characters)</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-background border border-input rounded-xl pl-9 pr-3.5 py-2 text-xs text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-2.5 px-4 bg-primary text-primary-foreground font-medium rounded-xl text-xs shadow-md hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Registering...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" /> Create Account & Generate Token
                  </>
                )}
              </button>
            </form>
          )}

          {/* Security Info Footer */}
          <div className="mt-5 pt-4 border-t border-border/50 flex items-center justify-center gap-2 text-[10px] text-muted-foreground">
            <Lock className="w-3 h-3 text-emerald-500" />
            <span>AES-256-GCM PII encryption at rest • HMAC-SHA256 JWT auth</span>
          </div>
        </div>
      </div>
    </div>
  );
}
