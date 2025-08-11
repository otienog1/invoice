export interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  phone?: string;
  company_name?: string;
  company_address?: string;
  company_logo?: string;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  tax_pin?: string;
  company?: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface InvoiceItem {
  id?: number;
  description: string;
  quantity: number;
  rate: number;
  total: number;
}

export interface Invoice {
  id: number;
  invoice_number: string;
  title?: string;
  description?: string;
  issue_date: string;
  due_date?: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  discount_rate: number;
  discount_amount: number;
  total_amount: number;
  paid_amount: number;
  payment_date?: string;
  notes?: string;
  terms?: string;
  user_id: number;
  customer_id: number;
  customer?: Customer;
  items: InvoiceItem[];
  created_at: string;
  updated_at: string;
}

export interface CreateInvoiceData {
  customer_id: number;
  title?: string;
  description?: string;
  due_date?: string;
  tax_rate?: number;
  discount_rate?: number;
  notes?: string;
  terms?: string;
  items: Omit<InvoiceItem, 'id' | 'total'>[];
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  pages: number;
  current_page: number;
}

export interface DashboardStats {
  totalInvoices: number;
  totalRevenue: number;
  pendingInvoices: number;
  paidInvoices: number;
  overdueInvoices: number;
  monthlyRevenue: number;
  recentInvoices: Invoice[];
}

export interface CreateCustomerData {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  tax_pin?: string;
  company?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  name: string;
  password: string;
  phone?: string;
  company_name?: string;
  company_address?: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
  message: string;
}