import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface CreateFamilyResponse {
  inviteCode?: string;
  success: boolean;
}

export const CreateFamily = () => {
  const [mode, setMode] = useState<"CREATE" | "JOIN">("CREATE");
  const [inputValue, setInputValue] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const url =
        mode === "CREATE"
          ? `${import.meta.env.VITE_API_URL}/api/families`
          : `${import.meta.env.VITE_API_URL}/api/families/join`;

      const body =
        mode === "CREATE" ? { name: inputValue } : { code: inputValue };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error en la operación");
      }
      return res.json() as Promise<CreateFamilyResponse>;
    },
    onSuccess: (data) => {
      if (mode === "CREATE") {
        alert(`¡Familia creada! Tu código es: ${data.inviteCode}`);
      } else {
        alert("¡Te has unido exitosamente!");
      }
      queryClient.invalidateQueries({ queryKey: ["my-family"] });
      window.location.reload();
    },
    onError: (err) => alert(err.message),
  });

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 border rounded-lg shadow-sm">
      <div className="flex border-b mb-6">
        <button
          className={`flex-1 pb-2 font-medium ${
            mode === "CREATE" ? "border-b-2 border-black" : "text-gray-400"
          }`}
          onClick={() => setMode("CREATE")}
        >
          Crear Familia
        </button>
        <button
          className={`flex-1 pb-2 font-medium ${
            mode === "JOIN" ? "border-b-2 border-black" : "text-gray-400"
          }`}
          onClick={() => setMode("JOIN")}
        >
          Unirse con Código
        </button>
      </div>

      <h2 className="text-2xl font-bold mb-4">
        {mode === "CREATE" ? "Nuevo Hogar" : "Únete a tu equipo"}
      </h2>

      <div className="flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">
            {mode === "CREATE"
              ? "Nombre de la Familia"
              : "Código de Invitación"}
          </span>
          <input
            type="text"
            className="border p-2 rounded focus:ring-2 focus:ring-black outline-none"
            placeholder={mode === "CREATE" ? "Ej: Familia Pérez" : "Ej: A1B2C3"}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </label>

        <button
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending || !inputValue}
          className="bg-black text-white py-2 rounded font-medium hover:bg-gray-800 disabled:opacity-50"
        >
          {mutation.isPending
            ? "Procesando..."
            : mode === "CREATE"
            ? "Crear"
            : "Unirse"}
        </button>
      </div>
    </div>
  );
};
