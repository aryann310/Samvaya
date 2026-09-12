import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useBusiness } from '../contexts/BusinessContext';
import { postAdvisorMessage } from '../services/api';
import { Send, Lightbulb, MapPin, TrendingUp, MessageSquare, Briefcase, Zap, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AdvisorMessage {
  id: string;
  isUser: boolean;
  text?: string;
  response?: any;
  timestamp: Date;
}

export default function AIAdvisor() {
  const { t, i18n } = useTranslation();
  const { businessId } = useBusiness();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<AdvisorMessage[]>([{
    id: 'welcome',
    isUser: false,
    timestamp: new Date(),
    response: {
      recommendation: t('advisor.welcomeTitle') || 'Welcome to your AI Business Advisor',
      why: t('advisor.welcomeDesc') || 'Ask any question about your business and get data-driven recommendations tailored to your local market.',
      nextStep: { label: t('advisor.nextStep') || 'Explore Reports', route: '/reports' }
    }
  }]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (text: string) => {
    if (!text.trim() || !businessId || isLoading) return;
    
    const userMsg: AdvisorMessage = {
      id: Date.now().toString(),
      isUser: true,
      text,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const resp = await postAdvisorMessage(text, businessId, i18n.language);
      const advisorMsg: AdvisorMessage = {
        id: (Date.now() + 1).toString(),
        isUser: false,
        response: resp,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, advisorMsg]);
    } catch (e) {
      console.error(e);
      // fallback error message
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    t('advisor.chip1') || 'Should I take a loan?',
    t('advisor.chip2') || 'How to increase profit?',
    t('advisor.chip3') || 'Best pricing strategy',
    t('advisor.chip4') || 'Inventory management tips',
    t('advisor.chip5') || 'Competition analysis',
    t('advisor.chip6') || 'Festival preparation'
  ];

  return (
    <div className="flex flex-col md:flex-row h-full w-full bg-[#0B0C0F] text-[#DFE6EF] overflow-hidden">
      {/* Session History Sidebar */}
      <div className="w-72 bg-[#11141A] border-r border-[#323A46] flex-col hidden md:flex flex-shrink-0 shadow-xl">
        <div className="p-4 border-b border-[#323A46] flex items-center justify-between bg-[#1B2028]">
          <h2 className="font-heading font-bold text-xs uppercase tracking-wider text-[#DFE6EF] flex items-center gap-2">
            <span className="p-1 rounded-md bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/20">
              <Zap size={14} />
            </span>
            <span>{t('advisor.topics') || 'Advisory Sessions'}</span>
          </h2>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/25">
            Active
          </span>
        </div>
        <div className="p-3">
          <button 
            onClick={() => setMessages([{
              id: 'welcome-' + Date.now(),
              isUser: false,
              timestamp: new Date(),
              response: {
                recommendation: t('advisor.welcomeTitle') || 'Welcome to your AI Business Advisor',
                why: t('advisor.welcomeDesc') || 'Ask any question about your business and get data-driven recommendations tailored to your local market.',
                nextStep: { label: t('advisor.nextStep') || 'Explore Reports', route: '/reports' }
              }
            }])}
            className="w-full py-2.5 px-3 rounded-xl bg-[#1B2028] hover:bg-[#232A35] border border-[#323A46] hover:border-[#38BDF8]/60 text-xs font-bold text-[#DFE6EF] flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <span className="text-[#38BDF8] text-base leading-none">+</span>
            <span>New Advisory Session</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-3 space-y-2">
          <div className="p-3 rounded-xl bg-[#1B2028] border border-[#38BDF8]/40 cursor-pointer flex items-center transition-all shadow-[0_0_12px_rgba(56,189,248,0.15)]">
            <div className="p-2 rounded-lg bg-[#11141A] border border-[#323A46] text-[#38BDF8] mr-3 flex-shrink-0">
              <Briefcase size={15} />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-[#38BDF8] uppercase tracking-wider block">Current Session</span>
              <span className="text-xs font-bold text-[#DFE6EF] truncate block">Financial Advisory & Growth</span>
            </div>
          </div>
          <div className="p-3 rounded-xl hover:bg-[#1B2028] cursor-pointer flex items-center transition-colors text-[#7E8A99] hover:text-[#DFE6EF] border border-transparent hover:border-[#323A46]">
            <div className="p-2 rounded-lg bg-[#11141A] text-[#7E8A99] mr-3 flex-shrink-0">
              <MessageSquare size={15} />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] text-[#7E8A99] block">Yesterday</span>
              <span className="text-xs font-medium text-[#DFE6EF] truncate block">Festive Stocking Plan (Diwali)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat and Suggestions Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative bg-[#0B0C0F]">
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
              {msg.isUser ? (
                <div className="bg-gradient-to-r from-[#1B2028] to-[#252E3B] border border-[#38BDF8]/40 text-[#DFE6EF] px-5 py-3.5 rounded-2xl rounded-tr-sm max-w-[80%] sm:max-w-[70%] shadow-xl font-medium text-sm leading-relaxed">
                  {msg.text}
                </div>
              ) : (
                <div className="w-full max-w-2xl bg-[#1B2028] rounded-2xl border border-[#323A46] shadow-2xl overflow-hidden relative">
                  {/* Subtle top cyan neon glow line */}
                  <div className="h-1 w-full bg-gradient-to-r from-[#38BDF8] via-[#7E8A99] to-[#38BDF8]" />
                  <div className="p-5 sm:p-6 space-y-4">
                    {msg.response.recommendation && (
                      <div className="flex items-start gap-3">
                        <div className="p-2.5 rounded-xl bg-[#11141A] text-[#38BDF8] border border-[#323A46] flex-shrink-0 shadow-inner">
                          <Lightbulb className="w-5 h-5 text-[#38BDF8]" />
                        </div>
                        <div>
                          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#38BDF8] mb-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse" />
                            Autonomous Advisory Analysis
                          </div>
                          <h3 className="text-lg sm:text-xl font-heading font-black text-[#DFE6EF] tracking-tight leading-snug">
                            {msg.response.recommendation}
                          </h3>
                        </div>
                      </div>
                    )}
                    
                    {msg.response.why && (
                      <div className="text-sm text-[#A4B0BE] leading-relaxed font-normal bg-[#11141A]/60 p-4 rounded-xl border border-[#323A46]/60">
                        {msg.response.why}
                      </div>
                    )}
                    
                    {(msg.response.localEvidence || msg.response.evidence) && (
                      <div className="bg-[#11141A] border border-[#38BDF8]/25 p-4 rounded-xl flex items-start gap-3">
                        <MapPin className="text-[#38BDF8] mt-0.5 flex-shrink-0" size={18} />
                        <div className="text-xs sm:text-sm text-[#DFE6EF] font-medium leading-relaxed">
                          <span className="font-bold text-[#38BDF8] block text-xs uppercase tracking-wider mb-1">
                            {t('advisor.localEvidence') || 'Local Market Pulse'}
                          </span>
                          {msg.response.localEvidence || msg.response.evidence}
                        </div>
                      </div>
                    )}
                    
                    {msg.response.financialImpact && (
                      <div className="bg-[#11141A] border border-[#10B981]/25 p-4 rounded-xl flex items-start gap-3">
                        <TrendingUp className="text-[#10B981] mt-0.5 flex-shrink-0" size={18} />
                        <div className="text-xs sm:text-sm text-[#DFE6EF] font-medium leading-relaxed">
                          <span className="font-bold text-[#10B981] block text-xs uppercase tracking-wider mb-1">
                            {t('advisor.financialImpact') || 'Financial Impact'}
                          </span>
                          {msg.response.financialImpact}
                        </div>
                      </div>
                    )}
                    
                    {msg.response.nextStep && (
                      <div className="pt-3 flex items-center justify-between border-t border-[#323A46] mt-2">
                        <span className="text-xs text-[#7E8A99] font-medium">Recommended Action</span>
                        <Link to={msg.response.nextStep.route || '#'} className="px-4 py-2 rounded-xl bg-[#38BDF8] text-[#0B0C0F] font-bold text-xs shadow-[0_0_12px_rgba(56,189,248,0.3)] hover:bg-[#0284C7] transition-all inline-flex items-center gap-1">
                          {msg.response.nextStep.label} &rarr;
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Quick Capability Cards Grid (shown when session is fresh) */}
          {messages.length <= 1 && (
            <div className="space-y-3 pt-2">
              <p className="text-xs uppercase tracking-wider font-bold text-[#7E8A99]">Explore Recommended Advisory Modules</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => handleSend("Will my store face cash flow deficits in the next 60 days?")}
                  className="text-left p-4 rounded-2xl bg-[#1B2028] hover:bg-[#232A35] border border-[#323A46] hover:border-[#38BDF8]/60 transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-base">💰</span>
                    <span className="text-xs text-[#38BDF8] group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                  </div>
                  <h4 className="font-bold text-sm text-[#DFE6EF] mb-1">Cash Flow & Runway</h4>
                  <p className="text-xs text-[#7E8A99] line-clamp-2">Assess liquid reserves against supplier payables for next 60 days.</p>
                </button>

                <button
                  onClick={() => handleSend("How do my store prices compare with competitors in Modhera?")}
                  className="text-left p-4 rounded-2xl bg-[#1B2028] hover:bg-[#232A35] border border-[#323A46] hover:border-[#38BDF8]/60 transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-base">🏷️</span>
                    <span className="text-xs text-[#38BDF8] group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                  </div>
                  <h4 className="font-bold text-sm text-[#DFE6EF] mb-1">Hyperlocal Price Intelligence</h4>
                  <p className="text-xs text-[#7E8A99] line-clamp-2">Benchmark staple commodities and groceries against nearest rivals.</p>
                </button>

                <button
                  onClick={() => handleSend("Which government MSME schemes and low-interest loans can I apply for?")}
                  className="text-left p-4 rounded-2xl bg-[#1B2028] hover:bg-[#232A35] border border-[#323A46] hover:border-[#38BDF8]/60 transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-base">🏛️</span>
                    <span className="text-xs text-[#38BDF8] group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                  </div>
                  <h4 className="font-bold text-sm text-[#DFE6EF] mb-1">Government Schemes</h4>
                  <p className="text-xs text-[#7E8A99] line-clamp-2">Verify eligibility for PMEGP, Mudra loans, and interest subsidies.</p>
                </button>

                <button
                  onClick={() => handleSend("What stock should I prioritize ordering for upcoming festival season?")}
                  className="text-left p-4 rounded-2xl bg-[#1B2028] hover:bg-[#232A35] border border-[#323A46] hover:border-[#38BDF8]/60 transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-base">📦</span>
                    <span className="text-xs text-[#38BDF8] group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                  </div>
                  <h4 className="font-bold text-sm text-[#DFE6EF] mb-1">Festival Stocking Optimization</h4>
                  <p className="text-xs text-[#7E8A99] line-clamp-2">Predict high-margin festive inventory demand to prevent stockouts.</p>
                </button>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-[#1B2028] rounded-2xl border border-[#323A46] shadow-xl p-4 flex items-center space-x-2">
                <span className="text-xs font-semibold text-[#7E8A99] mr-2">Consulting autonomous local intelligence...</span>
                <div className="w-2 h-2 bg-[#38BDF8] rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-[#7E8A99] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-[#38BDF8] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input & Suggestion Chips Dock */}
        <div className="bg-[#11141A] border-t border-[#323A46] p-4 relative z-10 shadow-2xl">
          <div className="flex overflow-x-auto space-x-2 pb-3 mb-1 no-scrollbar flex-nowrap">
            {suggestions.map((sugg, i) => (
              <button
                key={i}
                onClick={() => handleSend(sugg)}
                className="whitespace-nowrap px-3.5 py-1.5 bg-[#1B2028] hover:bg-[#232A35] hover:border-[#38BDF8]/60 text-[#DFE6EF] font-semibold text-xs rounded-full transition-all border border-[#323A46] flex-shrink-0 shadow-sm"
              >
                &bull; {sugg}
              </button>
            ))}
          </div>
          <div className="flex items-center bg-[#1B2028] rounded-2xl border border-[#323A46] p-1.5 pl-4 focus-within:border-[#38BDF8] focus-within:ring-2 focus-within:ring-[#38BDF8]/20 shadow-lg transition-all">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend(input)}
              placeholder={t('advisor.inputPlaceholder') || 'Ask your business advisory question...'}
              className="flex-1 bg-transparent border-none focus:outline-none text-[#DFE6EF] text-sm py-2 placeholder:text-[#7E8A99]"
            />
            <button
              onClick={() => handleSend(input)}
              disabled={isLoading || !input.trim()}
              className="p-2.5 rounded-xl bg-[#38BDF8] text-[#0B0C0F] font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#0284C7] shadow-[0_0_15px_rgba(56,189,248,0.4)] transition-all flex-shrink-0"
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
