import { useMyFamily } from "../hooks/useMyFamily";
import { signOut } from "../lib/auth-client";
import { RewardsList } from "../components/RewardsList";
import { TaskList } from "../components/TaskList";
import { ActivityFeed } from "../components/ActivityFeed";
import { UserAvatar } from "../components/UserAvatar"; // <--- Asegúrate de tener este componente creado

export const Dashboard = () => {
  const { data, isLoading } = useMyFamily();

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 text-gray-400 animate-pulse">
        Cargando tu hogar...
      </div>
    );
  }

  if (!data?.family || !data?.member) {
    return (
      <div className="h-screen flex items-center justify-center">
        No tienes familia asignada o hubo un error.
      </div>
    );
  }

  // Desestructuramos según la respuesta real del backend (Family + Member)
  const { family } = data;
  const { member } = data; // member tiene: role, balance, userId, user { name }

  const firstName = member.user.name.split(" ")[0]; // Solo el primer nombre

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden font-sans">
      {/* --- HEADER SUPERIOR (Sticky & Mobile Friendly) --- */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 md:px-8 md:py-4 flex justify-between items-center shadow-sm z-10 shrink-0">
        {/* IZQUIERDA: Avatar + Saludo */}
        <div className="flex items-center gap-3">
          <UserAvatar
            name={member.user.name}
            className="w-10 h-10 md:w-12 md:h-12 border-2 border-gray-100"
          />

          <div className="leading-tight">
            <h1 className="text-lg md:text-xl font-black tracking-tight text-gray-900">
              Hola, {firstName}
            </h1>
            <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500 font-medium">
              <span>Familia {family.name}</span>
              <span className="hidden md:inline-block text-gray-300">•</span>
              {/* Código de Invitación (Discreto) */}
              <span
                className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 tracking-wider text-[10px] border border-gray-200"
                title="Código de invitación"
              >
                {family.inviteCode}
              </span>
            </div>
          </div>
        </div>

        {/* DERECHA: Saldo + Logout */}
        <div className="flex items-center gap-4">
          {/* Píldora de Saldo */}
          <div className="flex flex-col items-end group cursor-default">
            <div className="bg-yellow-400 text-black font-black px-3 py-1 md:px-5 md:py-1.5 rounded-full shadow-sm text-sm md:text-lg flex items-center gap-1.5 transform group-hover:scale-105 transition-transform">
              <span>🪙</span>
              <span>{member.balance}</span>
            </div>
            <span className="text-[9px] md:text-[10px] text-gray-400 font-bold mt-0.5 mr-1 tracking-wider uppercase">
              Puntos
            </span>
          </div>

          {/* Botón Salir (Icono en móvil, Texto en desktop) */}
          <button
            onClick={() => signOut().then(() => window.location.reload())}
            className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-gray-100"
            title="Cerrar Sesión"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* --- CONTENIDO PRINCIPAL (Scrollable) --- */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth">
        <div className="max-w-7xl mx-auto h-full grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 pb-20 md:pb-0">
          {/* 1. SECCIÓN TAREAS (Principal) */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col h-125 md:h-full transition-all hover:shadow-md">
            <div className="flex items-center justify-between mb-4 shrink-0">
              <h2 className="text-lg font-bold flex items-center gap-2 text-gray-800">
                📝 Tareas
              </h2>
              {member.role === "CHILD" && (
                <span className="bg-blue-50 text-blue-600 text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wide">
                  Tu Turno
                </span>
              )}
            </div>
            {/* Pasamos userId y role correctamente desde 'member' */}
            <TaskList userRole={member.role} userId={member.userId} />
          </div>

          {/* 2. SECCIÓN PREMIOS */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col h-112.5 md:h-full transition-all hover:shadow-md">
            <div className="flex items-center justify-between mb-4 shrink-0">
              <h2 className="text-lg font-bold flex items-center gap-2 text-gray-800">
                🎁 Tienda
              </h2>
              <span className="bg-pink-50 text-pink-600 text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wide">
                Canjear
              </span>
            </div>
            <RewardsList userRole={member.role} userBalance={member.balance} />
          </div>

          {/* 3. SECCIÓN HISTORIAL */}
          <div className="bg-gray-50/80 p-5 rounded-2xl border border-dashed border-gray-300 flex flex-col h-87.5 md:h-full">
            <div className="flex items-center justify-between mb-4 shrink-0">
              <h2 className="text-lg font-bold flex items-center gap-2 text-gray-500">
                📊 Actividad
              </h2>
            </div>
            <ActivityFeed />
          </div>
        </div>
      </main>
    </div>
  );
};
