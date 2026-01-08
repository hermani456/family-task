import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

interface CreateFamilyResponse {
  success: boolean;
  familyId: string;
  inviteCode: string;
}

export const CreateFamily = () => {
  const [familyName, setFamilyName] = useState("");

  const mutation = useMutation({
    mutationFn: async (name: string) => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/families`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ name }),
      });

      if (!res.ok) throw new Error("Error al crear la familia");
      return res.json() as Promise<CreateFamilyResponse>;
    },
    onSuccess: (data) => {
      alert(`¡Familia creada! Código de invitación: ${data.inviteCode}`);
      window.location.reload();
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 border rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-4">Crear nueva familia</h2>
      <p className="text-gray-600 mb-6">
        Crea un espacio para tu hogar. Obtendrás un código para invitar a los
        demás.
      </p>

      <div className="flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Nombre de la Familia</span>
          <input
            type="text"
            className="border p-2 rounded focus:ring-2 focus:ring-black outline-none"
            placeholder="Ej: Familia Pérez"
            value={familyName}
            onChange={(e) => setFamilyName(e.target.value)}
            disabled={mutation.isPending}
          />
        </label>

        <button
          onClick={() => mutation.mutate(familyName)}
          disabled={mutation.isPending || !familyName}
          className="bg-black text-white py-2 rounded font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {mutation.isPending ? "Creando..." : "Crear Familia"}
        </button>
      </div>
    </div>
  );
};
