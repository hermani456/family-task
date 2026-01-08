// packages/shared/src/index.ts
import { z } from 'zod';

export const helloSchema = z.object({
    message: z.string(),
});

export type HelloType = z.infer<typeof helloSchema>;

export const SHARED_MESSAGE = "¡Hola desde el paquete compartido!";