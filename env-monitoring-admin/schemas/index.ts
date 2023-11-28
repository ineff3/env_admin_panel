import { z } from 'zod';

export const CompanySchema = z.object({
    id: z.number().positive().int().optional(),
    name: z.string().trim()
        .min(1, { message: "Company name should be at least 1 character long" })
        .max(45, { message: "Company name should be at most 45 character long" }),
    description: z.string().trim(),
    location: z.string().trim()
});

export const CompanyArraySchema = z.array(CompanySchema).nonempty({
    message: "Can't be empty!",
});

export const PassportSchema = z.object({
    id: z.number().positive().int().optional(),
    company_id: z.number().positive().int(),
    year: z.number().positive().int().refine(
        (val) => val >= 2000 && val <= 2030,
        "Year must be in range of 2000 to 2030"
    )
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

export const RfcFactorSchema = z.object({
    id: z.number().positive().int().optional(),
    factor_Name: z.string().trim()
        .min(1, { message: "Pollution name should be at least 1 character long" })
        .max(150, { message: "Pollution name should be at most 150 character long" }),
    factor_value: z.number().positive(),
})

export const RfcFactorArraySchema = z.array(RfcFactorSchema).nonempty({
    message: "Can't be empty!",
});