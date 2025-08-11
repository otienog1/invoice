import axios from 'axios';
import { 
  Invoice, 
  Customer, 
  CreateInvoiceData, 
  CreateCustomerData,
  ApiResponse, 
  PaginatedResponse,
  AuthResponse,
  LoginData,
  RegisterData,
  DashboardStats,
  User
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  // Login
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },

  // Register
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  // Get profile
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  },

  // Update profile
  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await apiClient.put('/auth/profile', data);
    return response.data;
  },
};

export const invoicesApi = {
  // Get all invoices
  getInvoices: async (params?: {
    page?: number;
    per_page?: number;
    status?: string;
    user_id?: number;
  }): Promise<PaginatedResponse<Invoice>> => {
    const response = await apiClient.get('/invoices', { params });
    return response.data;
  },

  // Get single invoice
  getInvoice: async (id: number): Promise<Invoice> => {
    const response = await apiClient.get(`/invoices/${id}`);
    return response.data;
  },

  // Create invoice
  createInvoice: async (data: CreateInvoiceData): Promise<Invoice> => {
    const response = await apiClient.post('/invoices', data);
    return response.data;
  },

  // Update invoice
  updateInvoice: async (id: number, data: Partial<CreateInvoiceData>): Promise<Invoice> => {
    const response = await apiClient.put(`/invoices/${id}`, data);
    return response.data;
  },

  // Delete invoice
  deleteInvoice: async (id: number): Promise<void> => {
    await apiClient.delete(`/invoices/${id}`);
  },

  // Send invoice
  sendInvoice: async (id: number): Promise<ApiResponse<any>> => {
    const response = await apiClient.post(`/invoices/${id}/send`);
    return response.data;
  },

  // Generate PDF
  downloadPDF: async (id: number): Promise<Blob> => {
    const response = await apiClient.get(`/invoices/${id}/pdf`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Get dashboard stats
  getDashboardStats: async (): Promise<DashboardStats> => {
    // This would be a separate endpoint in a real API
    const invoicesResponse = await apiClient.get('/invoices?per_page=100');
    const invoices = invoicesResponse.data.invoices || [];
    
    const totalInvoices = invoices.length;
    const totalRevenue = invoices.reduce((sum: number, inv: Invoice) => sum + Number(inv.total_amount), 0);
    const paidInvoices = invoices.filter((inv: Invoice) => inv.status === 'paid').length;
    const pendingInvoices = invoices.filter((inv: Invoice) => inv.status === 'sent').length;
    const overdueInvoices = invoices.filter((inv: Invoice) => inv.status === 'overdue').length;
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyRevenue = invoices
      .filter((inv: Invoice) => {
        const invDate = new Date(inv.created_at);
        return invDate.getMonth() === currentMonth && invDate.getFullYear() === currentYear;
      })
      .reduce((sum: number, inv: Invoice) => sum + Number(inv.total_amount), 0);
    
    const recentInvoices = invoices
      .sort((a: Invoice, b: Invoice) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);

    return {
      totalInvoices,
      totalRevenue,
      paidInvoices,
      pendingInvoices,
      overdueInvoices,
      monthlyRevenue,
      recentInvoices,
    };
  },
};

export const customersApi = {
  // Get all customers
  getCustomers: async (params?: {
    page?: number;
    per_page?: number;
    search?: string;
    user_id?: number;
  }): Promise<PaginatedResponse<Customer>> => {
    const response = await apiClient.get('/customers', { params });
    return response.data;
  },

  // Get single customer
  getCustomer: async (id: number): Promise<Customer> => {
    const response = await apiClient.get(`/customers/${id}`);
    return response.data;
  },

  // Create customer
  createCustomer: async (data: CreateCustomerData): Promise<Customer> => {
    const response = await apiClient.post('/customers', data);
    return response.data;
  },

  // Update customer
  updateCustomer: async (id: number, data: Partial<CreateCustomerData>): Promise<Customer> => {
    const response = await apiClient.put(`/customers/${id}`, data);
    return response.data;
  },

  // Delete customer
  deleteCustomer: async (id: number): Promise<void> => {
    await apiClient.delete(`/customers/${id}`);
  },
};

export default apiClient;