import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { ThemeProvider } from "./components/theme-provider";
import { AuthGuard } from "./components/layouts/AuthGuard";
import { PublicGuard } from "./components/layouts/PublicGuard";

import { Dashboard } from "./pages/Dashboard";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { OnboardingPage } from "./pages/onboarding/OnboardingPage";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="family-task-theme">
      <BrowserRouter>
        <Routes>
          {/* Group 1: Public routes (Login, Register) */}
          {/* If a logged-in user reaches these, the guard will redirect them */}
          <Route element={<PublicGuard />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Group 2: Onboarding (special case) */}
          {/* Requires authentication but not a family membership */}
          <Route path="/onboarding" element={<OnboardingPage />} />

          {/* Group 3: Protected routes (Dashboard) */}
          {/* Requires authentication and a family; AuthGuard will redirect if not */}
          <Route element={<AuthGuard />}>
            <Route path="/" element={<Dashboard />} />
            {/* Aquí irían más rutas: /tasks, /rewards, /settings */}
          </Route>

          {/* Fallback 404 */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
