import { useState } from "react";
import { Navigate } from "react-router"; // Ojo: react-router-dom, no react-router
import { authClient } from "../../lib/auth-client";
import { useMyFamily } from "../../hooks/useMyFamily";
import { Home, CirclePlus, ArrowLeft } from "lucide-react";
import { CreateFamilyForm } from "./components/CreateFamilyForm";
import { JoinFamilyForm } from "./components/JoinFamilyForm";
import { SelectionCard } from "./components/SelectionCard";
import { UserAvatar } from "../../components/UserAvatar";

type OnboardingStep = "select" | "create" | "join";

export const OnboardingPage = () => {
  const { data: session } = authClient.useSession();
  const { data: familyData, refetch } = useMyFamily();

  const [step, setStep] = useState<OnboardingStep>("select");

  if (!session) return <Navigate to="/login" />;
  if (familyData?.family) return <Navigate to="/" />;

  // Esta función se pasa a los formularios para recargar la app al terminar
  const handleSuccess = async () => {
    await refetch();
    // La redirección es automática por el 'if' de arriba
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-300">
        <div className="flex flex-col items-center mb-8">
          {step === "select" ? (
            <>
              <UserAvatar
                name={session.user?.name}
                className="size-12 md:size-14 border-2 border-gray-100 mb-3"
              />
              <h1 className="text-3xl font-black tracking-tighter text-foreground">
                ¡Hola, {session.user?.name || "usuario"}!
              </h1>
              <p className="text-muted-foreground font-medium text-sm mt-1">
                ¿Cómo quieres usar FamilyTask?
              </p>
            </>
          ) : (
            <button
              onClick={() => setStep("select")}
              className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors mx-auto"
            >
              <ArrowLeft className="w-4 h-4" /> Volver
            </button>
          )}
        </div>

        {step === "select" && (
          <div className="space-y-4">
            <SelectionCard
              icon={<Home className="size-5" />}
              color="indigo"
              badge="Soy Admin"
              title="Crear un hogar"
              desc="Configura tu hogar, añade a tus hijos y empieza a asignar tareas."
              onClick={() => setStep("create")}
            />
            <SelectionCard
              icon={<CirclePlus className="size-5" />}
              color="amber"
              badge="Tengo código"
              title="Unirme a un hogar"
              desc="Ingresa el código de invitación que te dieron tus padres."
              onClick={() => setStep("join")}
            />
          </div>
        )}

        {step === "create" && <CreateFamilyForm onSuccess={handleSuccess} />}

        {step === "join" && <JoinFamilyForm onSuccess={handleSuccess} />}
      </div>
    </div>
  );
};
