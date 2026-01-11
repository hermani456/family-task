import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { ThemeProvider } from "./components/theme-provider";
import { Dashboard } from "./components/Dashboard";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { authClient } from "./lib/auth-client";

function App() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending)
    return <div className="h-screen grid place-items-center">Cargando...</div>;

  return (
    <ThemeProvider defaultTheme="system" storageKey="family-task-theme">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={session ? <Dashboard /> : <Navigate to="/login" />}
          />

          <Route
            path="/login"
            element={!session ? <LoginPage /> : <Navigate to="/" />}
          />

          <Route
            path="/register"
            element={!session ? <RegisterPage /> : <Navigate to="/" />}
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
