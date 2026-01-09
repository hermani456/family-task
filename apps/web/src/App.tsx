import { CreateFamily } from "./components/CreateFamily";
import { Dashboard } from "./components/Dashboard";
import { useMyFamily } from "./hooks/useMyFamily";
import { useState } from "react";
// 1. IMPORTANTE: Agregamos signIn a los imports
import { signUp, signIn, useSession, signOut } from "./lib/auth-client";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("12345678");
  const [name, setName] = useState("");
  
  // 2. Estado para alternar entre Login y Registro
  const [isLoginMode, setIsLoginMode] = useState(true); 

  const session = useSession();
  const familyQuery = useMyFamily();

  // Función para Registrarse (Crear cuenta)
  const handleRegister = async () => {
    await signUp.email(
      {
        email,
        password,
        name,
      },
      {
        // onRequest: () => alert("Creando cuenta..."),
        onSuccess: () => {
             alert("¡Bienvenido! Cuenta creada.");
             window.location.reload();
        },
        onError: (ctx) => alert(ctx.error.message),
      }
    );
  };

  // 3. Función para Iniciar Sesión
  const handleLogin = async () => {
    await signIn.email(
        {
            email,
            password,
        },
        {
            // onRequest: () => alert("Iniciando sesión..."),
            onSuccess: () => {
                // Better Auth maneja la sesión, recargamos para actualizar estado
                window.location.reload(); 
            },
            onError: (ctx) => alert(ctx.error.message),
        }
    );
  };

  const handleLogout = async () => {
    await signOut();
    window.location.reload();
  };


  // --- LÓGICA DE RUTAS (Dashboard vs Onboarding) ---
  if (session.isPending) return <div className="p-10">Cargando...</div>;

  if (session.data) {
    if (familyQuery.isLoading)
      return <div className="p-10">Buscando tu hogar...</div>;
      
    if (familyQuery.data?.family) {
      return <Dashboard />;
    }
    
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <header className="flex justify-between items-center max-w-4xl mx-auto mb-8">
          <h1 className="font-bold text-xl">
            Bienvenido, {session.data.user.name}
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded text-sm hover:bg-red-600"
          >
            Cerrar Sesión
          </button>
        </header>
        <CreateFamily />
      </div>
    );
  }

  // --- FORMULARIO DE AUTH (LOGIN / REGISTER) ---
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="p-8 bg-white border rounded-xl shadow-sm w-full max-w-md flex flex-col gap-4 font-sans">
        <h1 className="text-2xl font-bold text-center mb-2">
            {isLoginMode ? "Iniciar Sesión" : "Crear Cuenta"}
        </h1>

        {/* El campo NOMBRE solo se muestra en Registro */}
        {!isLoginMode && (
            <input
            className="border p-2 rounded focus:ring-2 focus:ring-black outline-none"
            placeholder="Tu Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            />
        )}

        <input
          className="border p-2 rounded focus:ring-2 focus:ring-black outline-none"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        
        <input
          type="password"
          className="border p-2 rounded focus:ring-2 focus:ring-black outline-none"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          // Permite enviar con Enter
          // onKeyDown={(e) => {
          //     if (e.key === "Enter") isLoginMode ? handleLogin() : handleRegister();
          // }}
        />

        <button
          className="bg-black text-white p-2 rounded hover:bg-gray-800 transition font-medium mt-2"
          onClick={isLoginMode ? handleLogin : handleRegister}
        >
          {isLoginMode ? "Entrar" : "Registrarse"}
        </button>

        {/* Toggle para cambiar de modo */}
        <div className="text-center mt-4">
            <button 
                onClick={() => setIsLoginMode(!isLoginMode)}
                className="text-sm text-gray-500 hover:text-black hover:underline"
            >
                {isLoginMode 
                    ? "¿No tienes cuenta? Regístrate aquí" 
                    : "¿Ya tienes cuenta? Inicia sesión"}
            </button>
        </div>
      </div>
    </div>
  );
}

export default App;