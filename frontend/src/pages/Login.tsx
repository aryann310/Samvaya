import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, LogIn, Sparkles, Shield, TrendingUp, ArrowRight } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login({ email, password });
      navigate('/business', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemo = () => {
    setEmail('arvind.patel@example.com');
    setPassword('samvaya123');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-emerald-500/8 rounded-full blur-[140px]" style={{ animationDelay: '1s', animationDuration: '4s' }} />
        <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-yellow-400/5 rounded-full blur-[100px]" style={{ animationDelay: '2s', animationDuration: '6s' }} />
      </div>

      {/* Dot grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
        backgroundSize: '32px 32px'
      }} />

      <div className="w-full max-w-[460px] relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-foreground flex items-center justify-center text-background font-black text-lg tracking-tighter shadow-lg">
              AC
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-black tracking-tight text-foreground leading-none">ACRU</h1>
              <span className="text-[11px] font-bold tracking-[0.2em] text-primary uppercase">Samvaya</span>
            </div>
          </div>
          <p className="text-muted-foreground text-sm font-medium max-w-xs mx-auto leading-relaxed">
            AI-Driven Hyperlocal Business Advisory for Rural Micro-Entrepreneurs
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-card/80 backdrop-blur-2xl border border-glass-border rounded-3xl p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] relative overflow-hidden">
          {/* Card glow */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <h2 className="text-xl font-bold text-foreground mb-1">Welcome back</h2>
            <p className="text-sm text-muted-foreground mb-8">Sign in to your business dashboard</p>

            {error && (
              <div className="mb-6 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-top-2">
                <Shield className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="space-y-1.5">
                <label className={`block text-[11px] font-bold uppercase tracking-widest transition-colors ${
                  focusedField === 'email' ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="owner@business.com"
                  required
                  autoComplete="email"
                  className="w-full bg-background border border-border text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl px-4 py-3 text-sm transition-all shadow-sm placeholder:text-muted-foreground/50"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className={`block text-[11px] font-bold uppercase tracking-widest transition-colors ${
                  focusedField === 'password' ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                    className="w-full bg-background border border-border text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl px-4 py-3 pr-12 text-sm transition-all shadow-sm placeholder:text-muted-foreground/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading || !email || !password}
                className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-foreground hover:bg-foreground/90 text-background font-bold text-sm shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                ) : (
                  <LogIn className="w-4 h-4" />
                )}
                {isLoading ? 'Signing in...' : 'Sign in to Dashboard'}
              </button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 pt-6 border-t border-border/50">
              <button
                onClick={fillDemo}
                className="w-full group flex items-center justify-between p-3.5 rounded-xl bg-primary/5 hover:bg-primary/10 border border-primary/20 hover:border-primary/40 transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-bold text-foreground block">Quick Demo Login</span>
                    <span className="text-[10px] text-muted-foreground">Use pre-configured test credentials</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
          {[
            { icon: Sparkles, text: 'AI-Powered Advisory' },
            { icon: Shield, text: 'Bank-Grade Security' },
            { icon: TrendingUp, text: 'Financial Intelligence' },
          ].map((feat) => (
            <div key={feat.text} className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground bg-card/60 backdrop-blur-sm border border-glass-border px-3 py-1.5 rounded-full">
              <feat.icon className="w-3 h-3 text-primary" />
              {feat.text}
            </div>
          ))}
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] text-muted-foreground/60 mt-6">
          Built for Smart India Hackathon 2024 · Samvaya Team
        </p>
      </div>
    </div>
  );
}
