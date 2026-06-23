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

export const verifyOtpSchema = z.object({
    email: z.string().email("Invalid email address"),
    otp: z.string().length(4, "OTP must be exactly 4 digits."),
});


export const loginSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(1, "Password is required"),
});

export const categorySchema = z.object({
    name: z.string()
        .min(2, "Category name must be at least 2 characters")
        .max(50, "Name is too long"),
    description: z.string().optional().or(z.literal('')),
});


export const productSchema = z.object({
    name: z.string().min(1, "Name is required"),
    sku: z.string().min(1, "SKU is required"),
    description: z.string().min(10, "Description is required"),

    price: z.coerce.number({ message: "Price must be a number" }).min(0, "Price cannot be negative"),

    salePrice: z.union([z.coerce.number().min(0, "Sale price cannot be negative"), z.literal('')]).optional(),

    saleStartDate: z.string().optional().or(z.literal('')),
    saleEndDate: z.string().optional().or(z.literal('')),

    stockQuantity: z.coerce.number({ message: "Stock must be a number" }).min(0, "Stock cannot be negative"),
    categoryId: z.string().min(1, "Category is required"),

    images: z.array(z.string())
        .max(5, "You can only upload up to 5 images")
        .min(1, "At least one image is required"),

    isFeatured: z.boolean(),
    isActive: z.boolean(),

    attributes: z.array(z.object({
        key: z.string().min(1, "Key is required"),
        value: z.string().min(1, "Value is required")
    })).min(1, "At least one attribute is required")

}).superRefine((data, ctx) => {
    // Sale Price Validation
    if (data.salePrice !== '' && data.salePrice !== undefined) {
        if (Number(data.salePrice) >= Number(data.price)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Sale price must be less than regular price",
                path: ["salePrice"]
            });
        }
    }

    if (data.saleStartDate && data.saleEndDate) {
        const start = new Date(data.saleStartDate);
        const end = new Date(data.saleEndDate);

        if (start >= end) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "End date must be after start date",
                path: ["saleEndDate"]
            });
        }
    }
});

export const personalInfoSchema = z.object({
    firstName: z.string()
        .min(2, "First name must be at least 2 characters.")
        .regex(/^[a-zA-Z\s]+$/, "First name must contain only letters."),

    lastName: z.string()
        .min(2, "Last name must be at least 2 characters.")
        .regex(/^[a-zA-Z\s]+$/, "Last name must contain only letters."),

    telephone: z.string()
        .regex(/^\+94\s?\d{2}\s?\d{3}\s?\d{4}$/, "Phone number must be in +94 format (e.g. +94 XX XXX XXXX)")
});


export const updatePasswordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required."),

    newPassword: z.string()
        .min(6, "Password must be at least 6 characters long.")
        .superRefine((val, ctx) => {
            if (!/[A-Z]/.test(val)) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Must contain at least one uppercase letter." });
            }
            if (!/[a-z]/.test(val)) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Must contain at least one lowercase letter." });
            }
            if (!/[0-9]/.test(val)) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Must contain at least one number." });
            }
            if (!/[!@#$%^&*(),.?":{}|<>]/.test(val)) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Must contain at least one special character." });
            }
        }),

    confirmNewPassword: z.string()
})
    .refine((data) => data.newPassword === data.confirmNewPassword, {
        message: "New passwords do not match.",
        path: ["confirmNewPassword"]
    });


const addressTypeEnum = z.enum(['HOME', 'OFFICE', 'OTHER']);

export const addressSchema = z.object({
    addressType: addressTypeEnum,
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    district: z.string().min(1, 'District is required'),
    postalCode: z.string().min(1, 'Postal code is required'),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
export type VerifyOtpValues = z.infer<typeof verifyOtpSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
export type CategoryFormValues = z.infer<typeof categorySchema>;
export type ProductFormValues = z.infer<typeof productSchema>;
export type PersonalInfoValues = z.infer<typeof personalInfoSchema>;
export type UpdatePasswordValues = z.infer<typeof updatePasswordSchema>;
export type AddressFormValues = z.infer<typeof addressSchema>;







