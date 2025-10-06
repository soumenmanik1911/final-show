import{z} from "zod";

export const guestInsertSchema = z.object({
    name: z.string().min(1, { message: "Guest name is required" }),
    email: z.string().email({ message: "Valid email is required" }),
});

export const guestUpdateSchema = z.object({
    id: z.string().min(1, { message: "Guest ID is required" }),
    name: z.string().min(1, { message: "Guest name is required" }).optional(),
    email: z.string().email({ message: "Valid email is required" }).optional(),
});

export const meetingsInsertSchema = z.object({
    name: z.string().min(1,{message: "name is required"}),
    agentId :z.string().min(1,{message: "agentId is required"}),
    guests: z.array(guestInsertSchema).optional(),
})
export const meetingsUpdateSchema = z.object({
    id: z.string().min(1,{message: "id is required"}),
    name: z.string().optional(),
    agentId: z.string().optional(),
    status: z.enum(["upcoming", "active", "completed", "cancelled", "processing"]).optional(),
    endTime: z.date().optional(),
});