import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(8, "Minimum 8 characters")
  .regex(/[A-Z]/, "At least one uppercase letter")
  .regex(/[a-z]/, "At least one lowercase letter")
  .regex(/[0-9]/, "At least one number")
  .regex(/[^A-Za-z0-9]/, "At least one special character");

export const loginSchema = z.object({
  identifier: z.string().min(1, "Required"),
  password: z.string().min(1, "Required"),
  loginType: z.enum(["admin", "member"]),
});

export const addMemberSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(50),
    memberId: z
      .string()
      .min(1, "Member ID is required")
      .max(15)
      .regex(/^[A-Za-z0-9_-]+$/, "Alphanumeric, hyphens, underscores only"),
    mobile: z
      .string()
      .regex(/^\d{10,13}$/, "Mobile must be 10-13 digits"),
    password: passwordSchema,
    confirmPassword: z.string(),
    bmi: z
      .number({ invalid_type_error: "BMI must be a number" })
      .min(10, "BMI must be at least 10")
      .max(60, "BMI must be at most 60"),
    joinDate: z.string().min(1, "Join date is required"),
    plan: z.enum(["MONTHLY", "QUARTERLY", "ANNUAL"]),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const updateProfileSchema = z.object({
  mobile: z
    .string()
    .regex(/^\d{10,13}$/, "Mobile must be 10-13 digits")
    .optional()
    .or(z.literal("")),
  bmi: z
    .number({ invalid_type_error: "BMI must be a number" })
    .min(10)
    .max(60)
    .optional(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Required"),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const resetPasswordSchema = z
  .object({
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const adminPasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Required"),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const contactSchema = z.object({
  name:    z.string().min(2, "Name must be at least 2 characters"),
  email:   z.string().email("Enter a valid email address"),
  phone:   z.string().regex(/^\d{10,13}$/, "Mobile must be 10-13 digits"),
  plan:    z.enum(["MONTHLY", "QUARTERLY", "ANNUAL"]),
  message: z.string().min(10, "Message must be at least 10 characters").max(500),
});

export type LoginInput         = z.infer<typeof loginSchema>;
export type AddMemberInput     = z.infer<typeof addMemberSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput= z.infer<typeof changePasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type AdminPasswordInput = z.infer<typeof adminPasswordSchema>;
export type ContactInput       = z.infer<typeof contactSchema>;

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  memberId: z.string().min(3, "Member ID must be at least 3 characters").max(15)
    .regex(/^[A-Za-z0-9_-]+$/, "Alphanumeric, hyphens, underscores only"),
  mobile: z.string().regex(/^\d{10,13}$/, "Mobile must be 10–13 digits"),
  password: passwordSchema,
  confirmPassword: z.string(),
  bmi: z.number({ invalid_type_error: "BMI must be a number" }).min(10).max(60),
  plan: z.enum(["MONTHLY", "QUARTERLY", "ANNUAL"]),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords do not match", path: ["confirmPassword"],
});

export const forgotPasswordSchema = z.object({
  memberId: z.string().min(1, "Member ID is required"),
  mobile: z.string().regex(/^\d{10,13}$/, "Mobile must be 10–13 digits"),
});

export const tokenResetSchema = z.object({
  memberId: z.string().min(1, "Member ID is required"),
  token: z.string().length(6, "Reset code must be 6 digits"),
  newPassword: passwordSchema,
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: "Passwords do not match", path: ["confirmPassword"],
});

export type RegisterInput      = z.infer<typeof registerSchema>;
export type ForgotPasswordInput= z.infer<typeof forgotPasswordSchema>;
export type TokenResetInput    = z.infer<typeof tokenResetSchema>;
