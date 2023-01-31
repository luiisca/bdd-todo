import { z } from "zod";

export const taskData = z.object({
  text: z.string(),
  completed: z.boolean().optional(),
});

export type TaskDataType = z.infer<typeof taskData>;
