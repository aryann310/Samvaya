import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useBusiness } from "../contexts/BusinessContext";
import { 
  Send, 
  Bot, 
  User, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  ArrowRight,
  Sparkles,
  MapPin
} from "lucide-react";
import { postAdvisorMessage } from "../services/api";

export default function AIAdvisor() {
  const navigate = useNavigate();
  const { businessId } = useBusiness();
  const { i18n } = useTranslation();
  const [messages, setMessages] = useState<any[]>([
    {
      role: 'system',
      content: 'Hello! I am your AI Hyperlocal Advisory Assistant. Ask me anything about stock reorders, mandi market price predictions, loan readiness, or working capital optimizations.'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const sampleQuestions = [
    "Should I stock 500kg fertilizer before Diwali?",
    "How do I improve my loan readiness score to 85+?",
    "What are the best APMC mandi prices for wheat this week?",
    "How can I cut logistics costs by 15%?"
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;
    
    const userMessage = { role: 'user', content: query };
    setMessages(prev => [...prev, userMessage]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const currentLang = (i18n.language || 'en').slice(0, 2);
      const response = await postAdvisorMessage(query, businessId || 'biz-001', currentLang);
      setMessages(prev => [...prev, { role: 'assistant', data: response }]);
    } catch (error: any) {
      console.error(error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        data: {
          recommendation: "Unable to reach the advisory intelligence server at this moment.",
          why: error?.message || "Communication timeout.",
          localEvidence: "Local network check required.",
          financialImpact: "None recorded.",
          nextStep: { label: "Check Dashboard", route: "/" }
        } 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-6.5rem)] flex flex-col space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground tracking-tight">AI Advisor & Copilot</h1>
            <span className="flex items-center gap-1 bg-[#84cc16]/15 text-[#65a30d] text-[11px] font-bold px-2 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3" /> Pro Active
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">Real-time local market evidence and financial structuring advisory.</p>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="flex-1 bg-card/70 backdrop-blur-md rounded-3xl border border-glass-border shadow-glass-shadow flex flex-col overflow-hidden">
        
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5" ref={scrollRef}>
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              
              {/* Avatar */}
              <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
                msg.role === 'user' 
                  ? 'bg-gray-900 text-white' 
                  : 'bg-[#84cc16] text-gray-950 font-bold'
              }`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              
              {/* Content Bubble */}
              <div className={`max-w-[85%] md:max-w-[75%] ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                {msg.role === 'user' || msg.role === 'system' ? (
                  <div className={`p-4 rounded-2xl text-xs leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-gray-900 text-white rounded-tr-xs font-medium' 
                      : 'bg-background text-foreground rounded-tl-xs font-medium'
                  }`}>
                    {msg.content}
                  </div>
                ) : (
                  <div className="bg-card/70 backdrop-blur-md border border-glass-border rounded-2xl rounded-tl-xs overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.04)] text-xs">
                    
                    {/* Recommendation Header */}
                    <div className="bg-[#84cc16]/10 p-4 border-b border-lime-100">
                      <div className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-lime-700 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[10px] font-bold text-lime-800 uppercase tracking-wider mb-0.5">Recommendation</p>
                          <p className="text-xs font-bold text-foreground leading-snug">{msg.data.recommendation}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Details */}
                    <div className="p-4 space-y-3 bg-card/70 backdrop-blur-md">
                      <div className="flex items-start gap-2.5">
                        <div className="w-5 h-5 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 shrink-0 mt-0.5">
                          <AlertTriangle className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Business Rationale</p>
                          <p className="text-xs text-foreground/80 mt-0.5 leading-relaxed">{msg.data.why}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <div className="w-5 h-5 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
                          <MapPin className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Local Mandi Evidence</p>
                          <p className="text-xs text-foreground/80 mt-0.5 leading-relaxed">{msg.data.localEvidence}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <div className="w-5 h-5 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
                          <TrendingUp className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Financial Projection</p>
                          <p className="text-xs text-emerald-700 font-bold mt-0.5">{msg.data.financialImpact}</p>
                        </div>
                      </div>
                    </div>

                    {/* Action Step Footer */}
                    <div className="bg-background p-3.5 border-t border-glass-border flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Recommended Next Step</p>
                        <p className="text-xs font-semibold text-foreground">
                          {typeof msg.data.nextStep === 'object' ? msg.data.nextStep?.label : (msg.data.nextStep || "Proceed with recommendation")}
                        </p>
                      </div>
                      <button 
                        onClick={() => {
                          const route = typeof msg.data.nextStep === 'object' ? msg.data.nextStep?.route : null;
                          if (route) {
                            navigate(route);
                          } else {
                            navigate('/');
                          }
                        }} 
                        className="flex items-center gap-1 px-3 py-1.5 bg-gray-900 hover:bg-black text-white rounded-xl text-[11px] font-semibold transition-colors shadow-xs ml-3 shrink-0"
                      >
                        <span>Execute</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-2xl bg-[#84cc16] flex items-center justify-center shrink-0 text-gray-950 font-bold shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-background p-3.5 rounded-2xl rounded-tl-xs flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#84cc16] animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-[#84cc16] animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-[#84cc16] animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-6 py-2 border-t border-glass-border flex items-center gap-2 overflow-x-auto bg-[#fafafc]">
          <span className="text-[11px] font-medium text-muted-foreground shrink-0">Suggestions:</span>
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-[11px] font-medium text-foreground/80 bg-card/70 backdrop-blur-md border border-glass-border hover:border-lime-500 hover:text-gray-950 px-3 py-1 rounded-xl shrink-0 transition-colors shadow-2xs"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <div className="p-4 border-t border-glass-border bg-card/70 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask about inventory, loans, mandi prices, or cash flow..."
              className="flex-1 py-2.5 px-4 rounded-xl border border-border text-xs bg-background focus:bg-card/70 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-lime-500/30 focus:border-lime-500 transition-all placeholder:text-muted-foreground"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button 
              onClick={() => handleSend()} 
              disabled={loading || !input.trim()}
              className="px-4 py-2.5 bg-gray-900 hover:bg-black disabled:opacity-40 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <span>Ask</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
