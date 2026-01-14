import { zodResolver } from "@hookform/resolvers/zod";
import { CirclePlus, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { useJoinFamily } from "../../../hooks/useMyFamily";

const joinFamilySchema = z.object({
  code: z.string().length(6, "El código debe tener 6 caracteres").toUpperCase(),
});

export const JoinFamilyForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { mutate, isPending } = useJoinFamily();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof joinFamilySchema>>({
    resolver: zodResolver(joinFamilySchema),
  });

  const onSubmit = async (data: z.infer<typeof joinFamilySchema>) => {
    mutate(data, {
      onSuccess: () => {
        toast.success("¡Te has unido a la familia!");
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
        <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-3 text-secondary">
          <CirclePlus className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold">Ingresa el código</h2>
        <p className="text-sm text-muted-foreground">
          Pídele el código de 6 dígitos al administrador
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex justify-center">
          <input
            {...register("code")}
            maxLength={6}
            placeholder="XK9-M2P"
            className="w-full text-center text-3xl tracking-[0.5em] uppercase p-4 rounded-xl border border-border bg-background focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all placeholder:tracking-normal placeholder:font-sans placeholder:text-lg"
            autoFocus
          />
        </div>
        {errors.code && (
          <p className="text-danger text-xs text-center font-bold">
            {errors.code.message}
          </p>
        )}

        <button
          disabled={isPending || isSubmitting}
          className="w-full bg-secondary text-secondary-foreground py-4 rounded-xl font-bold shadow-lg shadow-secondary/20 hover:bg-secondary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {isPending || isSubmitting ? <Loader2 className="animate-spin" /> : "Unirme ahora"}
        </button>
      </form>
    </div>
  );
};
