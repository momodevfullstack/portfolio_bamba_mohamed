import { projects } from "@/data/projects";

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

type PaginatedResponse<T> = {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};

class ApiClient {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== "undefined") {
      if (token) localStorage.setItem("auth_token", token);
      else localStorage.removeItem("auth_token");
    }
  }

  getToken() {
    return this.token || (typeof window !== "undefined" ? localStorage.getItem("auth_token") : null);
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  async login(credentials: { email: string; password: string }): Promise<ApiResponse<{ user: any; token: string }>> {
    const validEmail = credentials.email === "admin@mohamedbamako.dev";
    const validPassword = credentials.password === "admin123";
    if (!validEmail || !validPassword) {
      return { success: false, error: "Identifiants invalides" };
    }
    const token = "local-demo-token";
    const user = { id: "1", email: credentials.email, name: "Admin", role: "ADMIN" };
    this.setToken(token);
    return { success: true, data: { user, token } };
  }

  async logout() {
    this.setToken(null);
    return { success: true, message: "Deconnecte" };
  }

  async getCurrentUser() {
    if (!this.isAuthenticated()) return null;
    return { id: "1", email: "admin@mohamedbamako.dev", name: "Admin", role: "ADMIN" };
  }

  async getProjects(params?: { page?: number; limit?: number }): Promise<ApiResponse<PaginatedResponse<any>>> {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? projects.length;
    return {
      success: true,
      data: {
        data: projects.slice(0, limit),
        meta: { page, limit, total: projects.length, totalPages: 1, hasNext: false, hasPrev: false },
      },
    };
  }

  async getMessages(_params?: { page?: number; limit?: number; status?: string; search?: string }): Promise<ApiResponse<PaginatedResponse<any>>> {
    return {
      success: true,
      data: {
        data: [],
        meta: { page: 1, limit: 50, total: 0, totalPages: 1, hasNext: false, hasPrev: false },
      },
    };
  }

  async updateMessage(_id: string, _payload: any) {
    return { success: true, data: {} };
  }

  async createMessage(_payload?: any) {
    return { success: true, data: { id: crypto.randomUUID?.() ?? "message-1" } };
  }

  async createQuote(_payload?: any) {
    return { success: true, data: { id: crypto.randomUUID?.() ?? "quote-1" } };
  }

  async createProject(_payload: any) {
    return { success: true, data: { id: crypto.randomUUID?.() ?? "project-1" } };
  }

  async updateProject(_id: string, _payload: any) {
    return { success: true, data: {} };
  }

  async deleteProject(_id: string) {
    return { success: true, data: {} };
  }

  async uploadImage(_file: File) {
    return "/photo1.jfif";
  }

  async getNotifications() {
    return { success: true, data: { notifications: [], pagination: { page: 1, limit: 20, total: 0, pages: 1 } } };
  }

  async markNotificationAsRead() {
    return { success: true, data: { read: true } };
  }
}

export const apiClient = new ApiClient();
export type { ApiResponse, PaginatedResponse };
