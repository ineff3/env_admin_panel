import { z } from 'zod';

export const EnterpriseSchema = z.object({
    id: z.number().positive().int().optional(),
    name: z.string().trim()
        .min(1, { message: "Enterprise name should be at least 1 character long" })
        .max(25, { message: "Enterprise name should be at most 25 character long" }),
    location: z.string().trim()
        .min(1, { message: "Enterprise location should be at least 1 character long" })
        .max(25, { message: "Enterprise location should be at most 25 character long" }),
    description: z.string().trim()
        .min(1, { message: "Enterprise location should be at least 1 character long" })
});

export const EnterpriseArraySchema = z.array(EnterpriseSchema).nonempty({
    message: "Can't be empty!",
});

//--------------------------------------------------------------------
export const CompanySchema = z.object({
    id: z.number().positive().int().optional(),
    name: z.string().trim()
        .min(1, { message: "Enterprise name should be at least 1 character long" })
        .max(25, { message: "Enterprise name should be at most 25 character long" }),
    description: z.string().trim()
        .min(1, { message: "Enterprise location should be at least 1 character long" })
});

export const CompanyArraySchema = z.array(CompanySchema).nonempty({
    message: "Can't be empty!",
});