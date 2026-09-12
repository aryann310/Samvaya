import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardFooter } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Send, Bot, User, CheckCircle2, AlertTriangle, TrendingUp, ArrowRight } from "lucide-react";
import { chatWithAdvisor } from "../api";

export default function AIAdvisor() {
  const [messages, setMessages] = useState<any[]>([
    {
      role: 'system',
      content: 'Namaste! I am your AI Business Advisor. How can I help you grow your business today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await chatWithAdvisor(input);
      setMessages(prev => [...prev, { role: 'assistant', data: response }]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-text">AI Business Advisor</h1>
        <p className="text-gray-500 mt-1">Get personalized, data-driven advice for your business.</p>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden border-gray-200">
        <CardContent className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6" ref={scrollRef}>
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'user' ? 'bg-gray-100 text-gray-600' : 'bg-primary text-white'
              }`}>
                {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>
              
              <div className={`max-w-[85%] md:max-w-[75%] ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                {msg.role === 'user' || msg.role === 'system' ? (
                  <div className={`p-4 rounded-2xl inline-block text-sm ${
                    msg.role === 'user' 
                      ? 'bg-primary text-white rounded-tr-sm' 
                      : 'bg-gray-100 text-text rounded-tl-sm'
                  }`}>
                    {msg.content}
                  </div>
                ) : (
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm overflow-hidden shadow-sm">
                    <div className="bg-primary/5 p-4 border-b border-gray-100">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Recommendation</p>
                          <p className="text-sm font-medium text-text">{msg.data.recommendation}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 space-y-4">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Why</p>
                          <p className="text-sm text-gray-700">{msg.data.why}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Local Evidence</p>
                          <p className="text-sm text-gray-700">{msg.data.localEvidence}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <TrendingUp className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Financial Impact</p>
                          <p className="text-sm text-green-700 font-medium">{msg.data.financialImpact}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 border-t border-gray-100 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Next Step</p>
                        <p className="text-sm text-text font-medium">{msg.data.nextStep}</p>
                      </div>
                      <Button variant="outline" size="sm" className="ml-4 shrink-0">
                        Take Action <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0 text-white">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-gray-100 p-4 rounded-2xl rounded-tl-sm">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="p-4 border-t border-gray-200 bg-gray-50/50">
          <div className="flex w-full items-center gap-2">
            <input
              type="text"
              placeholder="Ask about your business, loans, or market..."
              className="flex-1 h-12 px-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm bg-white"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <Button size="lg" className="rounded-xl px-6" onClick={handleSend} disabled={loading || !input.trim()}>
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

// Temporary import fix for MapPin missing above
import { MapPin } from "lucide-react";
