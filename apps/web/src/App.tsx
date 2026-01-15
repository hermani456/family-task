import { BrowserRouter, Routes, Route, Navigate } from "react-router"; // O 'react-router-dom'
import { ThemeProvider } from "./components/theme-provider";
import { AuthGuard } from "./components/layouts/AuthGuard";
import { PublicGuard } from "./components/layouts/PublicGuard";
import { DashboardLayout } from "./components/layouts/DashboardLayout";

// Imports de tus páginas (Asegúrate de tener estos componentes o créalos vacíos por ahora)
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { OnboardingPage } from "./pages/onboarding/OnboardingPage";
import { TasksPage } from "./features/tasks/TasksPage";
import { HomePage } from "./pages/HomePage";
import { RewardsShopPage } from "./features/rewards/RewardsShopPage";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="family-task-theme">
      <BrowserRouter>
        <Routes>
          {/* 1. RUTAS PÚBLICAS */}
          <Route element={<PublicGuard />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* 2. ONBOARDING */}
          <Route path="/onboarding" element={<OnboardingPage />} />

          {/* 3. RUTAS PROTEGIDAS (DASHBOARD) */}
          <Route element={<AuthGuard />}>
            {/* AQUÍ ESTÁ EL CAMBIO CLAVE:
               DashboardLayout envuelve a las rutas hijas.
               No lleva 'path', actúa como contenedor visual.
            */}
            <Route element={<DashboardLayout />}>
              
              <Route index element={<HomePage />} /> 
              
              {/* Rutas hijas: Se renderizan DENTRO del <Outlet/> del Layout */}
              <Route path="tasks" element={<TasksPage />} />
              <Route path="shop" element={<RewardsShopPage />} />
              
            </Route>
          </Route>

          {/* 4. FALLBACK 404 */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;