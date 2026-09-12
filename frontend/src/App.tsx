import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import AIAdvisor from "./pages/AIAdvisor";
import Finances from "./pages/Finances";
import Hyperlocal from "./pages/Hyperlocal";
import Team from "./pages/Team";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="team" element={<Team />} />
          <Route path="business" element={<div className="p-8"><h1 className="text-3xl font-bold">My Business</h1><p className="mt-2 text-gray-500">Page under construction for demo.</p></div>} />
          <Route path="advisor" element={<AIAdvisor />} />
          <Route path="hyperlocal" element={<Hyperlocal />} />
          <Route path="finances" element={<Finances />} />
          <Route path="cashflow" element={<div className="p-8"><h1 className="text-3xl font-bold">Cash Flow</h1><p className="mt-2 text-gray-500">Page under construction for demo.</p></div>} />
          <Route path="inventory" element={<div className="p-8"><h1 className="text-3xl font-bold">Inventory</h1><p className="mt-2 text-gray-500">Page under construction for demo.</p></div>} />
          <Route path="financing" element={<div className="p-8"><h1 className="text-3xl font-bold">Financing</h1><p className="mt-2 text-gray-500">Page under construction for demo.</p></div>} />
          <Route path="schemes" element={<div className="p-8"><h1 className="text-3xl font-bold">Government Schemes</h1><p className="mt-2 text-gray-500">Page under construction for demo.</p></div>} />
          <Route path="reports" element={<div className="p-8"><h1 className="text-3xl font-bold">Reports</h1><p className="mt-2 text-gray-500">Page under construction for demo.</p></div>} />
          <Route path="settings" element={<div className="p-8"><h1 className="text-3xl font-bold">Settings</h1><p className="mt-2 text-gray-500">Page under construction for demo.</p></div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
