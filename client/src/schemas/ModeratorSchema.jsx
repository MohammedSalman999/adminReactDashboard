"use client";

import z from "zod";

const moderatorSchema = z.object({
  vehicle_number: z
    .string()
    .nonempty({ message: "Vehicle number is required" })
    .regex(/^[A-Z0-9]+$/, {
      message:
        "Vehicle number must only contain uppercase letters and numbers.",
    }),
  owner_name: z
    .string()
    .nonempty({ message: "Owner name is required" })
    .min(4, { message: "Owner name must be at least 4 characters long." })
    .max(15, { message: "Owner name cannot exceed 15 characters." }),
  owner_phone: z
    .string()
    .nonempty({ message: "Phone number is required." })
    .regex(/^[6-9]\d{9}$/, {
      message: "Phone number is invalid.",
    }),
  city: z.string().nonempty({ message: "City is required" }),
  status: z.string().nonempty({ message: "Status is required" }),
  name: z.string().min(4, {
    message: "employee is reuired",
  }),
});

export { moderatorSchema };
