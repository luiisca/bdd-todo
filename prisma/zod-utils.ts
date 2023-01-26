import { z } from "zod";

const taskText = z.string().min(0).max(1000);

export const taskData = z.object({
  text: taskText,
  completed: z.boolean().optional(),
});

export type TaskDataType = z.infer<typeof taskData>;
