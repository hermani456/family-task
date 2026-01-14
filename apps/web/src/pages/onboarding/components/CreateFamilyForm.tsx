import { zodResolver } from "@hookform/resolvers/zod";
import { Home, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { useCreateFamily } from "../../../hooks/useMyFamily";

const createFamilySchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 letras"),
});

export const CreateFamilyForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { mutate, isPending } = useCreateFamily();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof createFamilySchema>>({
    resolver: zodResolver(createFamilySchema),
  });

  const onSubmit = async (data: z.infer<typeof createFamilySchema>) => {
    mutate(data, {
      onSuccess: () => {
        toast.success("Familia creada");
        onSuccess();
      },
      onError: (err) => {
        toast.error(err.message);
      },
    });
  };

  return (
    <div className="bg-surface p-6 rounded-3xl border border-border shadow-lg animate-in slide-in-from-bottom-4 duration-300">
      <div className="mb-6 text-center">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 text-primary">
          <Home className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold">Ponle nombre a tu hogar</h2>
        <p className="text-sm text-muted-foreground">
          Puede ser "Familia Pérez" o "Los Increíbles"
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
            {...register("name")}
            placeholder="Ej. Familia Gonzalez"
            className="w-full text-center text-lg font-bold p-4 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            autoFocus
          />
          {errors.name && (
            <p className="text-danger text-xs text-center mt-2 font-bold">
              {errors.name.message}
            </p>
          )}
        </div>

        <button
          disabled={isPending || isSubmitting}
          className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {isPending || isSubmitting ? (
            <Loader2 className="animate-spin" />
          ) : (
            "Crear Hogar"
          )}
        </button>
      </form>
    </div>
  );
};
