import { Routes, Route } from "react-router-dom";
import { Sidebar } from "./components/sidebar";
import { TopNav } from "./components/top-nav";
import Dashboard from "./pages/dashboard";
import PartnersPage from "./pages/partners";
import OrdersPage from "./pages/orders";
import AssignmentsPage from "./pages/assignments";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";

function App() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopNav />
        <main className="flex-1 p-4 md:p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/partners" element={<PartnersPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/assignments" element={<AssignmentsPage />} />
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/register" element={<RegisterPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
