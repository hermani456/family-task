import { CreateFamily } from "./components/CreateFamily";
import { Dashboard } from "./components/Dashboard";
import { useMyFamily } from "./hooks/useMyFamily";
import { useState } from "react";
import { signUp, useSession, signOut } from "./lib/auth-client";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const session = useSession();

  const handleRegister = async () => {
    await signUp.email(
      {
        email,
        password,
        name,
      },
      {
        onRequest: () => alert("Enviando petición..."),
        onSuccess: () => alert("¡Usuario creado y logueado!"),
        onError: (ctx) => alert(ctx.error.message),
      }
    );
  };

  const handleLogout = async () => {
    await signOut();
    window.location.reload();
  };

  const familyQuery = useMyFamily();

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
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
          >
            Cerrar Sesión
          </button>
        </header>
        <CreateFamily />
      </div>
    );
  }

  return (
    <div className="p-10 flex flex-col gap-4 max-w-md mx-auto font-sans">
      <h1 className="text-2xl font-bold">FamilyTask Login</h1>
      <div className="p-10 flex flex-col gap-4 max-w-md mx-auto font-sans">
        // <h1 className="text-2xl font-bold">Registro de Familia (Test)</h1>
        //{" "}
        <input
          className="border p-2 rounded"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border p-2 rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="border p-2 rounded"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="bg-black text-white p-2 rounded hover:bg-gray-800 transition"
          onClick={handleRegister}
        >
          Registrarse
        </button>
      </div>
    </div>
  );
}

export default App;
