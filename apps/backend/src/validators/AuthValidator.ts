import { z } from 'zod';

export const LoginSchema = z.object({
  email: z
    .string({ message: 'Email is required' })
    .email('Please enter a valid email')
    .nonempty('Email cannot be empty'),
  password: z
    .string({ message: 'Password is required' })
    .nonempty('Password cannot be empty'),
});

export const SignUpSchema = z.object({
  first_name: z
    .string({ message: 'First name is required' })
    .nonempty('First name cannot be empty'),
  last_name: z.string().optional(),
  email: z.string().email().nonempty('Email cannot be empty'),
  password: z
    .string({ message: 'Password is required' })
    .nonempty('Password cannot be empty'),
  phone_no: z.string().optional(),
});

export const RefreshTokenSchema = z.object({
  refreshToken: z
    .string({ message: 'Token is required' })
    .nonempty('token cannot be empty'),
});

export type LoginDTO = z.infer<typeof LoginSchema>;

export type SignUpDTO = z.infer<typeof SignUpSchema>;

export type RefreshTokenDTO = z.infer<typeof RefreshTokenSchema>;
