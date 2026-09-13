import { useEffect, useState } from "react";
import { useBusiness } from "../contexts/BusinessContext";
import { 
  Store, 
  MapPin, 
  Lightbulb, 
  Map, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  ChevronDown, 
  Wheat, 
  Sparkles,
  Info
} from "lucide-react";

const StatusBadge = ({ status }: { status: string }) => {
  let color = "bg-gray-100 text-gray-700";
  if (status === 'LIVE') color = "bg-green-100 text-green-700 border border-green-200";
  if (status === 'CACHED') color = "bg-amber-100 text-amber-700 border border-amber-200";
  if (status === 'CALCULATED') color = "bg-blue-100 text-blue-700 border border-blue-200";
  if (status === 'STATIC') color = "bg-slate-100 text-slate-700 border border-slate-200";
  if (status === 'DEMO') color = "bg-purple-100 text-purple-700 border border-purple-200";

  return (
    <span className={`text-[9px] px-1.5 py-0.5 rounded-sm font-bold uppercase tracking-wider ${color}`}>
      {status}
    </span>
  );
};

export default function Hyperlocal() {
  const { businessId } = useBusiness();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    // Calling the updated Phase 4 Hyperlocal endpoint
    fetch(`/api/v2/hyperlocal/summary`) // Note: Make sure the route points here or fallback to /api/hyperlocal
      .then(r => r.json())
      .then(res => {
        if (res.success && res.data) {
          setData(res.data);
        } else {
          // fallback to v1 route if v2 not mounted
          fetch(`/api/hyperlocal/${businessId}`)
            .then(r => r.json())
            .then(res2 => setData(res2.data))
            .catch(console.error);
        }
      })
      .catch(console.error);
  }, [businessId]);

// Moved outside to prevent recreating on every render

  const marketPrices = data?.marketPrices || [];
  const competitorsCount = data?.competitionLevel ? (data?.competitors?.length || 0) : (data?.competitorsNearby ?? 3);
  const demandSignal = data?.demandSignals?.[0]?.direction || "STABLE";

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Hyperlocal Market Intelligence</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Mandi spot rates, competitor density, and verifiable trade signals.</p>
        </div>
        <button onClick={() => alert('Coming soon!')} className="flex items-center gap-1.5 px-3 py-1.5 bg-card/70 backdrop-blur-md border border-glass-border rounded-xl text-xs font-semibold text-foreground/80 shadow-xs hover:border-lime-500 transition-colors">
          <MapPin className="w-3.5 h-3.5 text-lime-600" />
          <span>Radius: 5 km</span>
        </button>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-card/70 backdrop-blur-md rounded-3xl p-5 border border-glass-border shadow-glass-shadow flex items-center gap-4 relative">
          <div className="absolute top-4 right-4">
            <StatusBadge status={data?.competitionLevel ? "LIVE" : "DEMO"} />
          </div>
          <div className="w-12 h-12 rounded-2xl bg-muted/80 flex items-center justify-center text-foreground">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Nearby Competitors</p>
            <h4 className="text-2xl font-black text-foreground mt-0.5">{competitorsCount}</h4>
            <span className="text-[10px] text-muted-foreground">Level: {data?.competitionLevel || "UNKNOWN"}</span>
          </div>
        </div>
        
        <div className="bg-card/70 backdrop-blur-md rounded-3xl p-5 border border-glass-border shadow-glass-shadow flex items-center gap-4 relative">
          <div className="absolute top-4 right-4">
            <StatusBadge status={data?.demandSignals ? "CALCULATED" : "DEMO"} />
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#84cc16]/15 flex items-center justify-center text-lime-700">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Local Demand Signal</p>
            <h4 className="text-2xl font-black text-foreground mt-0.5">{demandSignal}</h4>
            <span className="text-[10px] text-lime-600 font-semibold">{data?.demandSignals?.[0]?.product || "General Items"}</span>
          </div>
        </div>

        <div className="bg-card/70 backdrop-blur-md rounded-3xl p-5 border border-glass-border shadow-glass-shadow flex items-center gap-4 relative">
          <div className="absolute top-4 right-4">
            <StatusBadge status={marketPrices.length > 0 ? marketPrices[0]?.provenance?.status : "DEMO"} />
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Wheat className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Avg. Mandi Realization</p>
            <h4 className="text-2xl font-black text-foreground mt-0.5">
              {marketPrices.length > 0 ? `₹${marketPrices[0]?.modalPrice}/${marketPrices[0]?.unit}` : "₹3,450/qtl"}
            </h4>
            <span className="text-[10px] text-muted-foreground">Benchmark APMC average</span>
          </div>
        </div>
      </div>

      {/* Mandi Commodity Spot Rates */}
      <div className="bg-card/70 backdrop-blur-md rounded-3xl p-6 border border-glass-border shadow-glass-shadow">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-foreground">Verified APMC Mandi Rates</h3>
            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
              <Info className="w-3.5 h-3.5" />
              Source data tracked with provenance and freshness layer.
            </p>
          </div>
          <button onClick={() => alert('Coming soon!')} className="flex items-center gap-1 text-xs font-semibold text-foreground/80 bg-muted border border-glass-border px-3 py-1.5 rounded-xl">
            <span>Filter District</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {marketPrices.map((item: any, i: number) => {
             const trend = data?.marketTrends?.[item.commodity];
             const isUp = trend?.direction === 'UP';
             const isDown = trend?.direction === 'DOWN';
             
             return (
              <div key={i} className="p-4 rounded-2xl bg-background border border-glass-border/80 flex flex-col justify-between hover:bg-muted/80/70 transition-colors relative">
                <div className="absolute top-3 right-3">
                  <StatusBadge status={item.provenance?.status || 'CACHED'} />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{item.market}</span>
                  <h4 className="text-sm font-bold text-foreground mt-0.5">{item.commodity}</h4>
                  <p className="text-[10px] text-muted-foreground mt-1">Source: {item.provenance?.source}</p>
                </div>
                <div className="mt-4 flex items-baseline justify-between">
                  <span className="text-base font-black text-foreground">₹{item.modalPrice}/{item.unit}</span>
                  {trend && trend.direction !== 'STABLE' && trend.direction !== 'UNKNOWN' && (
                    <span className={`text-xs font-bold flex items-center ${isUp ? "text-lime-600" : "text-rose-500"}`}>
                      {isUp ? <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
                      {trend.percentageChange}%
                    </span>
                  )}
                  {(!trend || trend.direction === 'STABLE') && (
                     <span className="text-[10px] text-muted-foreground font-semibold">STABLE</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Two Column Layout: Market Opportunities & Infrastructure */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          {/* Opportunities Card */}
          <div className="bg-card/70 backdrop-blur-md rounded-3xl p-6 border border-glass-border shadow-glass-shadow">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-lime-600" />
              <h3 className="text-base font-bold text-foreground">Verified Local Opportunities</h3>
            </div>
              {(data?.opportunities || []).map((opp: any, idx: number) => {
                const title = opp.title || null;
                const desc = typeof opp === 'object' ? (opp.description || opp.reasons?.[0] || opp.title) : opp;
                
                return (
                  <div key={idx} className="flex items-start gap-3 p-4 rounded-2xl bg-lime-500/10 border border-lime-500/20 mb-3 relative">
                     <div className="absolute top-3 right-3">
                        <StatusBadge status={"CALCULATED"} />
                     </div>
                    <div className="w-6 h-6 rounded-full bg-[#84cc16] flex items-center justify-center text-gray-950 font-bold shrink-0 mt-0.5 shadow-xs">
                      <Lightbulb className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 pr-10">
                      {title && <p className="text-xs font-bold text-foreground mb-0.5">{title}</p>}
                      <p className="text-xs text-foreground/90 font-medium leading-relaxed">{desc}</p>
                    </div>
                  </div>
                );
              })}
          </div>
          
          {/* Map Preview */}
          <div className="bg-card/70 backdrop-blur-md rounded-3xl p-6 border border-glass-border shadow-glass-shadow relative">
             <div className="absolute top-4 right-4">
                <StatusBadge status={"STATIC"} />
             </div>
            <h3 className="text-base font-bold text-foreground mb-2">Trade Catchment Map</h3>
            <div className="bg-background w-full h-[220px] rounded-2xl flex flex-col items-center justify-center text-muted-foreground border border-glass-border border-dashed">
              <Map className="w-10 h-10 mb-2 text-muted-foreground" />
              <p className="text-xs font-semibold text-muted-foreground">Geo-Radius Trade Perimeter</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Showing {competitorsCount} competitors within active range.</p>
            </div>
          </div>
        </div>

        {/* Local Events & Evidence */}
        <div className="bg-card/70 backdrop-blur-md rounded-3xl p-6 border border-glass-border shadow-glass-shadow flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-foreground mb-1">Local Events</h3>
            <p className="text-xs text-muted-foreground mb-4">Upcoming events affecting local demand</p>

            <div className="space-y-3">
               {(data?.events || []).map((event: any, i: number) => (
                  <div key={i} className="p-3.5 rounded-2xl bg-muted flex items-center justify-between border border-glass-border relative">
                    <div className="absolute -top-2 right-2">
                      <StatusBadge status={event.provenance?.status || "CACHED"} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-foreground">{event.name}</span>
                      <span className="text-[10px] text-muted-foreground">{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                  </div>
               ))}
            </div>
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-gray-900 text-white">
            <span className="text-[10px] font-bold text-lime-400 uppercase tracking-wider">Provenance Alert</span>
            <p className="text-[11px] font-medium text-white/90 mt-1 leading-relaxed">
              All data points in this dashboard are tagged with a source status. CACHED means fallback to non-live provider.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
