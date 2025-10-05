import{z} from "zod";

export const meetingsInsertSchema = z.object({

    name: z.string().min(1,{message: "name is required"}),
    agentId :z.string().min(1,{message: "agentId is required"}),
})
export const meetingsUpdateSchema = z.object({
    id: z.string().min(1,{message: "id is required"}),
    name: z.string().optional(),
    agentId: z.string().optional(),
    status: z.enum(["upcoming", "active", "completed", "cancelled", "processing"]).optional(),
    endTime: z.date().optional(),
});