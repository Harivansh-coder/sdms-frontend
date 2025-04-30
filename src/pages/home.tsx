import { Sidebar } from "@/components/sidebar";
import { TopNav } from "@/components/top-nav";
import { Outlet } from "react-router-dom";

function Home() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopNav />
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Home;
