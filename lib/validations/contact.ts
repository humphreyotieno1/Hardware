import { z } from "zod"

export const contactFormSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional().or(z.literal("")),
    subject: z.string().min(5, "Subject must be at least 5 characters"),
    category: z.string().min(1, "Please select a category"),
    message: z.string().min(10, "Message must be at least 10 characters"),
})

export type ContactFormData = z.infer<typeof contactFormSchema>
