import { Outlet } from "react-router";
import { BottomNav } from "./BottomNav";

export const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-background font-sans">
      {/* pb-20 es CRÍTICO: Da espacio abajo para que el menú fijo 
         no tape el contenido final de la lista 
      */}
      <main className="pb-24 px-4 pt-6">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};