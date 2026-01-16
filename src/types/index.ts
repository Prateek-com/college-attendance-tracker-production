// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

// Subject Types
export interface Subject {
  id: string;
  user_id: string;
  name: string;
  color: string;
  created_at: string;
}

// Attendance Types
export type AttendanceStatus = 'present' | 'absent' | 'leave';

export interface AttendanceRecord {
  id: string;
  subject_id: string;
  user_id: string;
  date: string;
  status: AttendanceStatus;
  created_at: string;
}

// Stats Types
export interface SubjectStats {
  subject: Subject;
  total: number;
  present: number;
  absent: number;
  leave: number;
  percentage: number;
}

export interface DashboardStats {
  totalSubjects: number;
  overallPercentage: number;
  totalPresent: number;
  totalAbsent: number;
  totalLeave: number;
  subjectStats: SubjectStats[];
}

// Auth Context Types
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}
