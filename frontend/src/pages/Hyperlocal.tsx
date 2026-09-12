import { useEffect, useState } from "react";
import { getHyperlocalData } from "../api";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { MapPin, Users, Store, Lightbulb, Map } from "lucide-react";

export default function Hyperlocal() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getHyperlocalData().then(setData).catch(console.error);
  }, []);

  if (!data) return <div className="p-8">Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text">Hyperlocal Market</h1>
        <p className="text-gray-500 mt-1">Insights and opportunities in your 5km radius.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Store className="text-blue-600 w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Nearby Competitors</p>
              <h4 className="text-2xl font-bold text-text">{data.competitorsNearby}</h4>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <Users className="text-green-600 w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Local Demand</p>
              <h4 className="text-2xl font-bold text-text">{data.demandLevel}</h4>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <MapPin className="text-purple-600 w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Avg. Market Pricing</p>
              <h4 className="text-2xl font-bold text-text">{data.averagePricing}</h4>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Market Opportunities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.opportunities.map((opp: string, idx: number) => (
                  <div key={idx} className="flex gap-4 p-4 rounded-xl bg-amber-50 border border-amber-100">
                    <Lightbulb className="w-6 h-6 text-amber-600 shrink-0" />
                    <p className="text-sm text-gray-800">{opp}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Local Map Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 w-full h-[300px] rounded-xl flex flex-col items-center justify-center text-gray-400 border border-gray-200 border-dashed">
                <Map className="w-12 h-12 mb-2 opacity-50" />
                <p>Interactive Map Component</p>
                <p className="text-xs mt-1">Showing 5km radius</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Area Infrastructure</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Local Markets</span>
                <span className="font-semibold text-text">{data.nearbyAmenities.markets}</span>
              </li>
              <li className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Schools/Colleges</span>
                <span className="font-semibold text-text">{data.nearbyAmenities.schools}</span>
              </li>
              <li className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Transport Hubs</span>
                <span className="font-semibold text-text">{data.nearbyAmenities.transportHubs}</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
