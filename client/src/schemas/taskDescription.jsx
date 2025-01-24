import { z } from "zod";

const taskDescriptionSchema = z.object({
  taskDetails: z.string().min(8, "Enter reason"),
  photo1: z.any().refine((file) => file instanceof File, {
    message: "Upload img 1",
  }),
  photo2: z.any().refine((file) => file instanceof File, {
    message: "Upload img 2",
  }),
});

export { taskDescriptionSchema };
