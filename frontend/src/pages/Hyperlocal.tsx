import { useEffect, useState } from "react";
import { getHyperlocalData } from "../api";
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
  Sparkles 
} from "lucide-react";

export default function Hyperlocal() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getHyperlocalData().then(setData).catch(console.error);
  }, []);

  const commodities = [
    { name: "Sharbati Wheat", mandi: "Kisan Ganj Mandi", price: "₹2,420/qtl", change: "+4.2%", isUp: true },
    { name: "Mustard Seed (Sarson)", mandi: "District Hub Mandi", price: "₹5,650/qtl", change: "+1.8%", isUp: true },
    { name: "Chana (Gram)", mandi: "APMC Sector 4", price: "₹6,100/qtl", change: "-0.5%", isUp: false },
    { name: "Organic Cow Milk", mandi: "Local Dairy Cooperative", price: "₹52/Ltr", change: "+6.0%", isUp: true },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Hyperlocal Market Intelligence</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Mandi spot rates, competitor density, and catchment trade signals.</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-card/70 backdrop-blur-md border border-glass-border rounded-xl text-xs font-semibold text-foreground/80 shadow-xs hover:border-lime-500 transition-colors">
          <MapPin className="w-3.5 h-3.5 text-lime-600" />
          <span>Radius: 5 km</span>
        </button>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-card/70 backdrop-blur-md rounded-3xl p-5 border border-glass-border shadow-glass-shadow flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-muted/80 flex items-center justify-center text-foreground">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Nearby Competitors</p>
            <h4 className="text-2xl font-black text-foreground mt-0.5">{data?.competitorsNearby || "12"}</h4>
            <span className="text-[10px] text-muted-foreground">Within immediate trade cluster</span>
          </div>
        </div>
        
        <div className="bg-card/70 backdrop-blur-md rounded-3xl p-5 border border-glass-border shadow-glass-shadow flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#84cc16]/15 flex items-center justify-center text-lime-700">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Local Demand Index</p>
            <h4 className="text-2xl font-black text-foreground mt-0.5">{data?.demandLevel || "High (+18%)"}</h4>
            <span className="text-[10px] text-lime-600 font-semibold">Festive procurement phase</span>
          </div>
        </div>

        <div className="bg-card/70 backdrop-blur-md rounded-3xl p-5 border border-glass-border shadow-glass-shadow flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Wheat className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Avg. Mandi Realization</p>
            <h4 className="text-2xl font-black text-foreground mt-0.5">{data?.averagePricing || "₹3,450/qtl"}</h4>
            <span className="text-[10px] text-muted-foreground">Benchmark APMC average</span>
          </div>
        </div>
      </div>

      {/* Mandi Commodity Spot Rates */}
      <div className="bg-card/70 backdrop-blur-md rounded-3xl p-6 border border-glass-border shadow-glass-shadow">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-foreground">Live APMC Mandi Rates</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Updated every 4 hours from regional agriculture market boards</p>
          </div>
          <button className="flex items-center gap-1 text-xs font-semibold text-foreground/80 bg-muted border border-glass-border px-3 py-1.5 rounded-xl">
            <span>Filter District</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {commodities.map((item, i) => (
            <div key={i} className="p-4 rounded-2xl bg-background border border-glass-border/80 flex flex-col justify-between hover:bg-muted/80/70 transition-colors">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{item.mandi}</span>
                <h4 className="text-sm font-bold text-foreground mt-0.5">{item.name}</h4>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-base font-black text-foreground">{item.price}</span>
                <span className={`text-xs font-bold flex items-center ${item.isUp ? "text-lime-600" : "text-rose-500"}`}>
                  {item.isUp ? <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
                  {item.change}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Layout: Market Opportunities & Infrastructure */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          {/* Opportunities Card */}
          <div className="bg-card/70 backdrop-blur-md rounded-3xl p-6 border border-glass-border shadow-glass-shadow">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-lime-600" />
              <h3 className="text-base font-bold text-foreground">High-Margin Local Opportunities</h3>
            </div>
            <div className="space-y-3">
              {(data?.opportunities || [
                "Wholesale buyers in nearby mandi are paying 12% premium for sorted & bagged wheat.",
                "Organic cold-pressed oil demand has surged in the 15km township radius.",
                "Bulk dairy collection center offering ₹3/litre bonus for fat content above 4.5%."
              ]).map((opp: string, idx: number) => (
                <div key={idx} className="flex items-start gap-3 p-4 rounded-2xl bg-lime-50/60 border border-lime-100/80">
                  <div className="w-6 h-6 rounded-full bg-[#84cc16] flex items-center justify-center text-gray-950 font-bold shrink-0 mt-0.5 shadow-xs">
                    <Lightbulb className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-xs text-foreground font-medium leading-relaxed">{opp}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Map Preview */}
          <div className="bg-card/70 backdrop-blur-md rounded-3xl p-6 border border-glass-border shadow-glass-shadow">
            <h3 className="text-base font-bold text-foreground mb-2">Trade Catchment Map</h3>
            <div className="bg-background w-full h-[220px] rounded-2xl flex flex-col items-center justify-center text-muted-foreground border border-glass-border border-dashed">
              <Map className="w-10 h-10 mb-2 text-muted-foreground" />
              <p className="text-xs font-semibold text-muted-foreground">Geo-Radius Trade Perimeter</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Showing 5 active Mandis, 12 grain storage warehouses, and 3 transport hubs</p>
            </div>
          </div>
        </div>

        {/* Infrastructure & Amenities */}
        <div className="bg-card/70 backdrop-blur-md rounded-3xl p-6 border border-glass-border shadow-glass-shadow flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-foreground mb-1">Local Ecosystem</h3>
            <p className="text-xs text-muted-foreground mb-4">Essential infrastructure within delivery range</p>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-muted flex items-center justify-between border border-glass-border">
                <span className="text-xs font-medium text-muted-foreground">Regulated Mandis</span>
                <span className="text-xs font-bold text-foreground">{data?.nearbyAmenities?.markets || "3 mandis"}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-muted flex items-center justify-between border border-glass-border">
                <span className="text-xs font-medium text-muted-foreground">Cold Storage & Warehouses</span>
                <span className="text-xs font-bold text-foreground">{data?.nearbyAmenities?.schools || "4 facilities"}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-muted flex items-center justify-between border border-glass-border">
                <span className="text-xs font-medium text-muted-foreground">Transport Hubs & Freight</span>
                <span className="text-xs font-bold text-foreground">{data?.nearbyAmenities?.transportHubs || "2 logistics depots"}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-muted flex items-center justify-between border border-glass-border">
                <span className="text-xs font-medium text-muted-foreground">Rural Banking & BC Points</span>
                <span className="text-xs font-bold text-foreground">7 touchpoints</span>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-gray-900 text-white">
            <span className="text-[10px] font-bold text-lime-400 uppercase tracking-wider">Logistics Alert</span>
            <p className="text-xs font-medium text-white/90 mt-1 leading-relaxed">
              District toll route opens tomorrow at 6 AM; morning dispatch avoids peak congestion.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
