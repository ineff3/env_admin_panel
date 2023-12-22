import { z } from 'zod';

const PositiveNumber = (factorName: string) => {
    return z.string().refine((value) => {
        const numericValue = Number(value);
        return !isNaN(numericValue) && numericValue > 0;
    }, { message: `${factorName} value must be a positive number` });
}

export const CompanySchema = z.object({
    id: z.number().positive().int().optional(),
    name: z.string().trim()
        .min(1, { message: "Company name should be at least 1 character long" })
        .max(45, { message: "Company name should be at most 45 character long" }),
    description: z.string().trim(),
    city_id: z.number().positive().int()
});

export const CompanyArraySchema = z.array(CompanySchema).nonempty({
    message: "Can't be empty!",
});

export const PassportSchema = z.object({
    id: z.number().positive().int().optional(),
    company_id: z.number().positive().int(),
    year: z.string().refine((value) => {
        const numericValue = Number(value);
        return !isNaN(numericValue) && numericValue > 2000 && numericValue < 2030;
    }, { message: "Year should be between 2000 and 2030" }),
    source_operating_time: z.string().refine((value) => {
        const numericValue = Number(value);
        return !isNaN(numericValue) && numericValue > 0;
    }, { message: "Operating time should be positive" }),
})

export const PollutionSchema = z.object({
    id: z.number().positive().int().optional(),
    name: z.string().trim()
        .min(1, { message: "Pollution name should be at least 1 character long" })
        .max(150, { message: "Pollution name should be at most 150 character long" }),
    value: z.string().refine((value) => {
        const numericValue = Number(value);
        return !isNaN(numericValue) && numericValue > 0;
    }, { message: "Amount value must be a positive number" }),

    passport_id: z.string().refine((value) => {
        const numericValue = Number(value);
        return Number.isInteger(numericValue) && numericValue > 0;
    }, { message: "Passport ID must be a positive integer" }),

    cA_value: z.string().refine((value) => {
        if (value === '') {
            return 0;
        }
        const numericValue = Number(value);
        return !isNaN(numericValue) && numericValue > 0;
    }, { message: "CA value must be a positive number" }),

    cH_value: z.string().refine((value) => {
        if (value === '') {
            return 0;
        }
        const numericValue = Number(value);
        return !isNaN(numericValue) && numericValue > 0;
    }, { message: "CH Value must be a positive number" }),
    pollutant_id: z.number().positive().int(),

})

export const PollutionExcelSchema = z.object({
    id: z.number().positive().int().optional(),
    factor_Name: z.string().trim()
        .min(1, { message: "Pollution name should be at least 1 character long" })
        .max(150, { message: "Pollution name should be at most 150 character long" }),
    factor_value: z.number().positive(),
    passport_id: z.number().positive().int(),
    factor_Ca_value: z.number().positive(),
    factor_Ch_value: z.number().positive(),
    rfc_factor_id: z.number().positive().int(),

})

export const PollutionArraySchema = z.array(PollutionExcelSchema).nonempty({
    message: "Can't be empty!",
});

export const RfcFactorSchema = z.object({
    id: z.number().positive().int().optional(),
    name: z.string().trim()
        .min(1, { message: "Pollution name should be at least 1 character long" })
        .max(150, { message: "Pollution name should be at most 150 character long" }),
    rfC_value: PositiveNumber('RFC'),
    sF_value: PositiveNumber('SF'),
    gdK_value: PositiveNumber('GDK'),
    mass_flow_rate: PositiveNumber('MFR'),
    damaged_organs: z.string().trim().min(1, { message: "Damaged organs should be choosed" })
})

export const RfcFactorArraySchema = z.array(RfcFactorSchema).nonempty({
    message: "Can't be empty!",
});