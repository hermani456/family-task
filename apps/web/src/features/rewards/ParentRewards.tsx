import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Gift, Trash2, Ticket, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import confetti from "canvas-confetti";

import { Drawer } from "../../components/ui/drawer";
import { useRewards } from "../../hooks/useRewards";

// 1. SCHEMA ZOD
const rewardSchema = z.object({
  title: z.string().min(3, "El nombre debe tener al menos 3 letras"),
  cost: z.coerce.number().min(10, "El costo mínimo es 10 puntos").max(10000),
  image: z.string().min(1, "Debes elegir un icono"),
});

type RewardFormValues = z.infer<typeof rewardSchema>;

const EMOJI_OPTIONS = [
  "🎁",
  "🎮",
  "🍦",
  "🍕",
  "⚽",
  "🎬",
  "📱",
  "💻",
  "🎨",
  "🚲",
  "🛹",
  "🎸",
  "🎧",
  "💸",
  "🍔",
  "🦄",
  "🧸",
  "⛺",
  "🏊‍♂️",
];

export const ParentRewards = () => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const { data: rewards, isLoading, createMutation } = useRewards();

  const form = useForm({
    resolver: zodResolver(rewardSchema),
    defaultValues: {
      title: "",
      cost: 100,
      image: "🎁",
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors },
  } = form;

  const onSubmit = (data: RewardFormValues) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Premio creado exitosamente");
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.8 } });
        setDrawerOpen(false);
        reset();
      },
      onError: () => {
        toast.error("Error al crear el premio");
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 animate-pulse">
        <div className="bg-gray-200 w-12 h-12 rounded-full" />
        <div className="bg-gray-200 h-4 w-32 rounded" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-24">
      {/* HEADER */}
      <div className="flex items-center gap-2 px-1">
        <div className="bg-pink-100 p-2 rounded-xl text-pink-600">
          <Gift className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-black text-foreground leading-none">
            Tienda de Premios
          </h2>
          <p className="text-xs text-muted-foreground font-medium">
            Gestiona los canjes
          </p>
        </div>
      </div>

      {/* BOTÓN HERO */}
      <button
        onClick={() => setDrawerOpen(true)}
        className="w-full group relative overflow-hidden bg-white border-2 border-dashed border-gray-300 hover:border-pink-400 rounded-3xl p-6 transition-all active:scale-[0.99]"
      >
        <div className="absolute inset-0 bg-pink-50 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative flex flex-col items-center gap-3">
          <div className="bg-gray-100 group-hover:bg-white p-3 rounded-full transition-colors shadow-sm">
            <Plus className="w-6 h-6 text-gray-500 group-hover:text-pink-500" />
          </div>
          <span className="font-bold text-gray-600 group-hover:text-pink-600 text-sm">
            Agregar Nuevo Premio
          </span>
        </div>
      </button>

      {/* LISTA DE PREMIOS */}
      <div className="grid grid-cols-1 gap-4">
        {rewards?.length === 0 && (
          <div className="text-center py-12 px-4 bg-surface rounded-3xl border border-gray-100">
            <p className="text-sm font-medium text-muted-foreground">
              Aún no hay premios en la tienda.
            </p>
          </div>
        )}

        {rewards?.map((reward) => (
          <div
            key={reward.id}
            className="bg-surface p-4 rounded-3xl border border-border shadow-sm flex items-center justify-between group hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="size-14 bg-pink-50 rounded-2xl flex items-center justify-center text-3xl border border-pink-100 select-none shrink-0">
                {reward.image || "🎁"}
              </div>

              <div className="min-w-0">
                <h3 className="font-bold text-foreground text-base truncate pr-2">
                  {reward.title}
                </h3>
                <div className="flex items-center gap-1.5 text-pink-600 font-bold text-xs bg-pink-50 px-2.5 py-1 rounded-lg w-fit mt-1.5">
                  <Ticket className="w-3 h-3" />
                  {reward.cost} pts
                </div>
              </div>
            </div>

            <button
              className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-90"
              onClick={() => toast.info("Eliminar pendiente de implementar")}
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      {/* DRAWER FORMULARIO */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Nuevo Premio"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-6">
          {/* SELECTOR EMOJI */}
          <Controller
            name="image"
            control={control}
            render={({ field }) => (
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-500 ml-1">
                  Icono
                </label>
                <div className="grid grid-cols-6 gap-2 bg-gray-50 p-4 rounded-2xl border border-gray-100 max-h-48 overflow-y-auto">
                  {EMOJI_OPTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => field.onChange(emoji)}
                      className={`text-2xl aspect-square flex items-center justify-center rounded-xl transition-all ${
                        field.value === emoji
                          ? "bg-white shadow-md ring-2 ring-pink-500 scale-110 z-10"
                          : "hover:bg-gray-200/50 opacity-70 hover:opacity-100"
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
                {errors.image && (
                  <p className="text-red-500 text-xs ml-1 font-bold">
                    {errors.image.message}
                  </p>
                )}
              </div>
            )}
          />

          {/* INPUT TÍTULO */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-500 ml-1">
              Nombre
            </label>
            <input
              {...register("title")}
              placeholder="Ej. Tarde de Cine 🍿"
              className="w-full p-4 bg-gray-50 border border-transparent focus:bg-white focus:border-pink-200 rounded-xl font-medium outline-none transition-all placeholder:text-gray-400"
            />
            {errors.title && (
              <p className="text-red-500 text-xs ml-1 font-bold">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* INPUT COSTO */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-500 ml-1">
              Costo
            </label>
            <div className="relative group">
              <input
                type="number"
                {...register("cost")}
                className="w-full p-4 bg-gray-50 border border-transparent focus:bg-white focus:border-pink-200 rounded-xl font-bold text-center text-xl outline-none transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-gray-400 uppercase pointer-events-none group-focus-within:text-pink-400">
                PTS
              </span>
            </div>

            <div className="flex gap-2 justify-center mt-2">
              {[50, 100, 200, 500].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() =>
                    setValue("cost", val, { shouldValidate: true })
                  }
                  className="text-xs font-bold px-3 py-1.5 rounded-full bg-gray-50 text-gray-500 hover:bg-pink-50 hover:text-pink-600 transition-colors border border-gray-100"
                >
                  {val}
                </button>
              ))}
            </div>
            {errors.cost && (
              <p className="text-red-500 text-xs ml-1 font-bold">
                {errors.cost.message}
              </p>
            )}
          </div>

          {/* BOTÓN */}
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="w-full py-4 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl shadow-lg shadow-pink-200 mt-4 active:scale-[0.98] transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {createMutation.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Sparkles className="w-5 h-5" />
            )}
            {createMutation.isPending ? "Guardando..." : "Crear Premio"}
          </button>
        </form>
      </Drawer>
    </div>
  );
};
