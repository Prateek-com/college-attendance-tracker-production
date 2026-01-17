/**
 * API Service - Connects React frontend to FastAPI backend
 */


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// Auth token handling
let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
  if (token) {
    localStorage.setItem("auth_token", token);
  } else {
    localStorage.removeItem("auth_token");
  }
}

export function getAuthToken(): string | null {
  if (!authToken) {
    authToken = localStorage.getItem("auth_token");
  }
  return authToken;
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getAuthToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.detail || "Request failed" };
    }

    return { data };
  } catch (error) {
    console.error("API Error:", error);
    return { error: "Failed to connect to backend" };
  }
}



// ---------------- AUTH API ----------------

export const authApi = {
  register(name: string, email: string, password: string) {
    return apiRequest("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
  },

  login(email: string, password: string) {
    return apiRequest("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  getMe() {
    return apiRequest("/api/auth/me");
  },
};




// ---------------- SUBJECTS API ----------------

export const subjectsApi = {
  async getAll() {
    return apiRequest("/api/subjects");
  },

  async create(name: string) {
    return apiRequest("/api/subjects", {
      method: "POST",
      body: JSON.stringify({ name }),
    });
  },

  async delete(id: string) {
    return apiRequest(`/api/subjects/${id}`, {
      method: "DELETE",
    });
  },
};




// ---------------- ATTENDANCE API ----------------

export const attendanceApi = {
  async getBySubject(subjectId: string) {
    return apiRequest(`/api/attendance/${subjectId}`);
  },

  async mark(subjectId: string, date: string, status: "present" | "absent") {
    return apiRequest("/api/attendance", {
      method: "POST",
      body: JSON.stringify({
        subject_id: subjectId,
        date,
        status,
      }),
    });
  },

  async getStats(subjectId: string) {
    return apiRequest(`/api/attendance/${subjectId}/stats`);
  },
};
