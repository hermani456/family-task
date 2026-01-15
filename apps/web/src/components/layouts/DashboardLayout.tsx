import { Outlet } from "react-router";
import { BottomNav } from "./BottomNav";
import { TopNav } from "./TopNav";

export const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-background font-sans">
      {/* pb-20 es CRÍTICO: Da espacio abajo para que el menú fijo 
         no tape el contenido final de la lista 
      */}
      <TopNav />
      <main className="flex-1 pb-24 px-4 pt-4">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};
