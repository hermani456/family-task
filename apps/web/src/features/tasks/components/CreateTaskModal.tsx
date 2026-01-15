import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Sparkles, Users } from "lucide-react";
import { toast } from "sonner";
import { useCreateTask } from "../../../hooks/useTasks";
import { useMembers } from "../../../hooks/useMembers";

const createTaskSchema = z.object({
  title: z.string().min(3, "Mínimo 3 letras"),
  points: z.coerce.number().min(1, "Mínimo 1 punto").max(1000),
  assignedToId: z.string().optional(),
});

type FormValues = z.infer<typeof createTaskSchema>;

interface Props {
  onSuccess: () => void;
}

interface Member {
  userId: string;
  name: string;
  role: "PARENT" | "CHILD";
}

export const CreateTaskForm = ({ onSuccess }: Props) => {
  const { data: members } = useMembers();
  const { mutate, isPending } = useCreateTask();

  const form = useForm({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: "",
      points: 10,
      assignedToId: "all",
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = form;

  const currentPoints = useWatch({ control, name: "points" });

  const onSubmit = (data: FormValues) => {
    const payload = {
      title: data.title,
      points: data.points,
      assignedToId: data.assignedToId === "all" ? undefined : data.assignedToId,
    };

    mutate(payload, {
      onSuccess: () => {
        toast.success("¡Tarea creada!");
        onSuccess();
      },
      onError: (err) => {
        toast.error(err.message);
      },
    });
  };

  const filteredMembers = members?.filter((member) => member.role === "CHILD");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* TÍTULO */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-muted-foreground ml-1">
          ¿Qué hay que hacer?
        </label>
        <input
          {...register("title")}
          placeholder="Ej. Lavar los platos"
          className="w-full p-4 bg-background border border-border rounded-xl font-medium focus:ring-2 focus:ring-primary/20 outline-none"
          autoFocus
        />
        {errors.title && (
          <p className="text-rose-500 text-xs ml-1 font-bold">
            {errors.title.message}
          </p>
        )}
      </div>

      <div className="flex gap-4">
        {/* PUNTOS */}
        <div className="w-1/3 space-y-2">
          <label className="text-sm font-bold text-muted-foreground ml-1">
            Puntos
          </label>
          <div className="relative">
            <input
              type="number"
              {...register("points")}
              className="w-full p-4 bg-background border border-border rounded-xl font-bold text-center outline-none focus:border-primary"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-muted-foreground pointer-events-none uppercase">
              PTS
            </span>
          </div>
        </div>

        {/* ASIGNACIÓN */}
        <div className="w-2/3 space-y-2">
          <label className="text-sm font-bold text-muted-foreground ml-1">
            Asignar a
          </label>
          <div className="relative">
            <select
              {...register("assignedToId")}
              className="w-full p-4 bg-background border border-border rounded-xl font-medium outline-none appearance-none pr-10"
            >
              <option value="all">🏠 Para todos</option>
              {filteredMembers?.map((member: Member) => (
                <option key={member.userId} value={member.userId}>
                  👤 {member.name}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
              <Users className="w-4 h-4 opacity-50" />
            </div>
          </div>
        </div>
      </div>

      {errors.points && (
        <p className="text-rose-500 text-xs ml-1 font-bold">
          {errors.points.message}
        </p>
      )}

      {/* CHIPS RÁPIDOS */}
      <div>
        <label className="text-[10px] font-black text-muted-foreground ml-1 uppercase tracking-wider">
          Selección Rápida
        </label>
        <div className="flex gap-2 mt-2 overflow-x-auto pb-1 scrollbar-hide">
          {[10, 20, 50, 100].map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => setValue("points", val, { shouldValidate: true })}
              className={`px-3 py-2 rounded-lg text-sm font-bold border transition-all active:scale-95 shrink-0 ${
                currentPoints === val
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-surface border-border text-muted-foreground"
              }`}
            >
              {val} pts
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg mt-2 active:scale-[0.98] transition-all flex justify-center items-center gap-2 disabled:opacity-70"
      >
        {isPending ? (
          <Loader2 className="animate-spin w-5 h-5" />
        ) : (
          <Sparkles className="w-5 h-5" />
        )}
        {isPending ? "Guardando..." : "Crear Tarea"}
      </button>
    </form>
  );
};
