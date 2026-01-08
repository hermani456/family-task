import { useMyFamily } from "../hooks/useMyFamily";
import { signOut } from "../lib/auth-client";
import { TaskList } from "./TaskList";

export const Dashboard = () => {
  const { data, isLoading } = useMyFamily();

  if (isLoading) return <div className="p-10">Cargando tu hogar...</div>;

  if (!data?.family) return <div>No tienes familia asignada.</div>;

  const { familyName, inviteCode, role, balance } = data.family;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-xl font-bold tracking-tight text-indigo-600">
            FamilyTask
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <a
            href="#"
            className="flex items-center px-4 py-2 text-gray-900 bg-gray-100 rounded-lg"
          >
            Tablero
          </a>
          <a
            href="#"
            className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
          >
            Tareas
          </a>
          <a
            href="#"
            className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
          >
            Recompensas
          </a>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={() => signOut().then(() => window.location.reload())}
            className="text-sm text-red-500 hover:text-red-700 w-full text-left"
          >
            Cerrar Sesión
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{familyName}</h2>
            <p className="text-sm text-gray-500">
              Rol:{" "}
              <span className="font-medium bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs">
                {role}
              </span>
            </p>
          </div>

          <div className="flex gap-4">
            <div className="bg-white p-3 rounded-lg border shadow-sm flex flex-col items-end">
              <span className="text-xs text-gray-400 uppercase font-bold">
                Código de Invitación:{" "}
              </span>
              <span className="text-lg font-mono font-bold tracking-widest">
                {inviteCode}
              </span>
            </div>

            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 flex flex-col items-end min-w-[100px]">
              <span className="text-xs text-yellow-600 uppercase font-bold">
                Mis Puntos:{" "}
              </span>
              <span className="text-xl font-bold text-yellow-700">
                {balance}
              </span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border shadow-sm col-span-2 h-64 flex items-center justify-center text-gray-400 border-dashed border-2">
            <TaskList />
          </div>
          <div className="bg-white p-6 rounded-xl border shadow-sm h-64 flex items-center justify-center text-gray-400 border-dashed border-2">
            (Miembros / Actividad)
          </div>
        </div>
      </main>
    </div>
  );
};
