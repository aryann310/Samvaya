import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { getDashboardData } from "../api";
import { Activity, IndianRupee, TrendingUp, AlertCircle, ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function Dashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getDashboardData().then(setData).catch(console.error);
  }, []);

  if (!data) return <div className="p-8">Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text">Welcome back, Entrepreneur</h1>
        <p className="text-gray-500 mt-1">Here is what's happening with your business today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Business Health</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-text">{data.businessHealthScore}/100</div>
            <p className="text-xs text-primary font-medium mt-1">Looking good</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Available Cash</CardTitle>
            <IndianRupee className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-text">₹{data.availableCash.toLocaleString('en-IN')}</div>
            <p className="text-xs text-gray-500 mt-1">Operating capital</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Revenue (MTD)</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-text">₹{data.revenue.toLocaleString('en-IN')}</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" /> +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Expenses</CardTitle>
            <IndianRupee className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-text">₹{data.expenses.toLocaleString('en-IN')}</div>
            <p className="text-xs text-red-500 flex items-center mt-1">
              <ArrowDownRight className="h-3 w-3 mr-1" /> -2% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Today's Priorities</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {data.priorities.map((item: string, i: number) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-0.5 bg-primary/10 p-1.5 rounded-full">
                    <AlertCircle className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm text-text font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Local Market Pulse</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <TrendingUp className="text-green-600 w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-text">{data.marketPulse.status}</h4>
                <p className="text-sm text-gray-500">Current Market Condition</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100">
              {data.marketPulse.description}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
