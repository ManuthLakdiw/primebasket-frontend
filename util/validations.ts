import { z } from "zod";

export const registerSchema = z.object({
    firstName: z.string()
        .min(2, "First name must be at least 2 characters.")
        .regex(/^[a-zA-Z\s]+$/, "First name must contain only letters."),

    lastName: z.string()
        .min(2, "Last name must be at least 2 characters.")
        .regex(/^[a-zA-Z\s]+$/, "Last name must contain only letters."),

    email: z.string().email("Please enter a valid email address."),

    password: z.string()
        .min(6, "Password must be at least 6 characters long.")
        .superRefine((val, ctx) => {
            if (!/[A-Z]/.test(val)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Must contain at least one uppercase letter.",
                });
            }
            if (!/[a-z]/.test(val)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Must contain at least one lowercase letter.",
                });
            }
            if (!/[0-9]/.test(val)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Must contain at least one number.",
                });
            }
            if (!/[!@#$%^&*(),.?":{}|<>]/.test(val)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Must contain at least one special character.",
                });
            }
        }),

    confirmPassword: z.string()
})
    .refine((data) => {
        return data.password === data.confirmPassword;
    }, {
        message: "Passwords do not match.",
        path: ["confirmPassword"]
    });

export type RegisterFormValues = z.infer<typeof registerSchema>;


export const verifyOtpSchema = z.object({
    email: z.string().email("Invalid email address"),
    otp: z.string().length(4, "OTP must be exactly 4 digits."),
});

export type VerifyOtpValues = z.infer<typeof verifyOtpSchema>;
