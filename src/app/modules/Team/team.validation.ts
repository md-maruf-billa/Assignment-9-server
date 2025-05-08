
import { z } from "zod";

const create = z.object({
    name: z.string(),
    title: z.string(),
    profileImage: z.string().optional(),
    description: z.string(),
    gitHub: z.string(),
    linkedIn: z.string(),
    facebook: z.string(),
    portfolio: z.string()
})
const update = z.object({
    name: z.string().optional(),
    title: z.string().optional(),
    profileImage: z.string().optional(),
    description: z.string().optional(),
    gitHub: z.string().optional(),
    linkedIn: z.string().optional(),
    facebook: z.string().optional(),
    portfolio: z.string().optional()
})


export const team_validation = {
    create,
    update
}