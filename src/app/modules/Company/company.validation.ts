import { z } from "zod";


const update = z.object({
    name: z.string().optional(),
    website: z.string().optional(),
    companyImage: z.string().optional(),
    description: z.string().optional(),
})


export const company_validation_schemas = {
    update
}