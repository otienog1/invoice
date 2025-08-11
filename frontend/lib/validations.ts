import * as z from 'zod';

// Customer validation schema
export const customerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name too long'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().max(15, 'Phone number too long').optional().or(z.literal('')),
  address: z.string().max(500, 'Address too long').optional().or(z.literal('')),
  tax_pin: z.string().max(50, 'Tax PIN too long').optional().or(z.literal('')),
  company: z.string().max(200, 'Company name too long').optional().or(z.literal('')),
});

// Invoice item validation schema
export const invoiceItemSchema = z.object({
  description: z.string().min(1, 'Description is required').max(500, 'Description too long'),
  quantity: z.number().min(0.01, 'Quantity must be greater than 0'),
  rate: z.number().min(0.01, 'Rate must be greater than 0'),
});

// Invoice validation schema
export const invoiceSchema = z.object({
  customer_id: z.number().min(1, 'Customer is required'),
  title: z.string().max(200, 'Title too long').optional().or(z.literal('')),
  description: z.string().max(1000, 'Description too long').optional().or(z.literal('')),
  due_date: z.string().optional().or(z.literal('')),
  tax_rate: z.number().min(0, 'Tax rate cannot be negative').max(100, 'Tax rate cannot exceed 100%').default(0),
  discount_rate: z.number().min(0, 'Discount rate cannot be negative').max(100, 'Discount rate cannot exceed 100%').default(0),
  notes: z.string().max(1000, 'Notes too long').optional().or(z.literal('')),
  terms: z.string().max(1000, 'Terms too long').optional().or(z.literal('')),
  items: z.array(invoiceItemSchema).min(1, 'At least one item is required'),
});

// User/Profile validation schema
export const profileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name too long'),
  email: z.string().email('Invalid email address'),
  phone: z.string().max(15, 'Phone number too long').optional().or(z.literal('')),
  company_name: z.string().max(200, 'Company name too long').optional().or(z.literal('')),
  company_address: z.string().max(500, 'Company address too long').optional().or(z.literal('')),
});

// Login validation schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Registration validation schema
export const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(100, 'Username too long'),
  email: z.string().email('Invalid email address'),
  name: z.string().min(1, 'Name is required').max(200, 'Name too long'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().max(15, 'Phone number too long').optional().or(z.literal('')),
  company_name: z.string().max(200, 'Company name too long').optional().or(z.literal('')),
  company_address: z.string().max(500, 'Company address too long').optional().or(z.literal('')),
});

// Export types
export type CustomerFormData = z.infer<typeof customerSchema>;
export type InvoiceFormData = z.infer<typeof invoiceSchema>;
export type InvoiceItemFormData = z.infer<typeof invoiceItemSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;