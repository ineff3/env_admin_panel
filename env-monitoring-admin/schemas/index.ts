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
        .min(1, { message: "Company name should be at least 1 character long" })
        .max(45, { message: "Company name should be at most 45 character long" }),
    description: z.string().trim()
        .min(1, { message: "Company description should be at least 1 character long" }),
    location: z.string().trim()
        .min(1, { message: "Location name should be at least 1 character long" })
});

export const CompanyArraySchema = z.array(CompanySchema).nonempty({
    message: "Can't be empty!",
});

export const PassportSchema = z.object({
    id: z.number().positive().int().optional(),
    company_id: z.number().positive().int(),
    year: z.number().positive().int()
})

export const PollutionSchema = z.object({
    id: z.number().positive().int().optional(),
    factor_Name: z.string().trim()
        .min(1, { message: "Pollution name should be at least 1 character long" })
        .max(150, { message: "Pollution name should be at most 150 character long" }),
    factor_value: z.number().positive(),
    passport_id: z.number().positive().int()
})

export const PollutionArraySchema = z.array(PollutionSchema).nonempty({
    message: "Can't be empty!",
});