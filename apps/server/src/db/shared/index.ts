// 1. Re-exportamos todo el esquema (tablas, enums, etc)
export * from "./schema.js";

// 2. Exportamos TIPOS TypeScript inferidos automáticamente
// Esto es lo que usará el Frontend para no escribir interfaces a mano.
import { type InferSelectModel, type InferInsertModel } from "drizzle-orm";
import { family, member, task, user, reward, transaction } from "./schema.js";

// Tipos para USUARIO
export type User = InferSelectModel<typeof user>;

// Tipos para FAMILIA
export type Family = InferSelectModel<typeof family>;

// Tipos para MIEMBROS
export type Member = InferSelectModel<typeof member>;

// Tipos para TAREAS
export type Task = InferSelectModel<typeof task>;
export type NewTask = InferInsertModel<typeof task>;

export type TaskWithAssignee = Task & {
    assignedToName: string | null;
};

export type Reward = InferSelectModel<typeof reward>;

export type Transaction = InferSelectModel<typeof transaction>;

export type UserRole = InferSelectModel<typeof member>["role"];
