import { useState, useEffect, useCallback } from 'react';
import { AttendanceRecord, AttendanceStatus, SubjectStats, DashboardStats, Subject } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { attendanceApi } from '@/lib/api';

export function useAttendance(subjects: Subject[]) {
  const { user } = useAuth();
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load attendance records from MongoDB via API
  const loadRecords = useCallback(async () => {
    if (!user || subjects.length === 0) {
      setRecords([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      // Load attendance for all subjects
      const allRecords: AttendanceRecord[] = [];
      
      for (const subject of subjects) {
        const { data, error } = await attendanceApi.getBySubject(subject.id);
        if (data && !error) {
          allRecords.push(...data.map(r => ({
            id: r.id,
            subject_id: r.subject_id,
            user_id: user.id,
            date: r.date,
            status: r.status as AttendanceStatus,
            created_at: new Date().toISOString(),
          })));
        }
      }
      
      setRecords(allRecords);
    } catch (error) {
      console.error('Failed to load attendance:', error);
      setRecords([]);
    }
    setIsLoading(false);
  }, [user, subjects]);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  const markAttendance = async (
    subjectId: string,
    date: string,
    status: AttendanceStatus
  ): Promise<{ error: Error | null }> => {
    if (!user) return { error: new Error('Not authenticated') };

    try {
      // Only send 'present' or 'absent' to API
     // ✅ Send actual status including 'leave'
const { data, error } = await attendanceApi.mark(
  subjectId,
  date,
  status as 'present' | 'absent' | 'leave'
);

      
      if (error || !data) {
        return { error: new Error(error || 'Failed to mark attendance') };
      }

      // Update local state
      setRecords(prev => {
        const existingIndex = prev.findIndex(
          r => r.subject_id === subjectId && r.date === date
        );

        const newRecord: AttendanceRecord = {
          id: data.id,
          subject_id: data.subject_id,
          user_id: user.id,
          date: data.date,
          status: status, // Keep original status for UI
          created_at: new Date().toISOString(),
        };

        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = newRecord;
          return updated;
        }
        return [...prev, newRecord];
      });
      
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const getAttendanceForDate = (subjectId: string, date: string): AttendanceStatus | null => {
    const record = records.find(r => r.subject_id === subjectId && r.date === date);
    return record?.status || null;
  };

  const getSubjectStats = (subjectId: string): Omit<SubjectStats, 'subject'> => {
    const subjectRecords = records.filter(r => r.subject_id === subjectId);
    const total = subjectRecords.length;
    const present = subjectRecords.filter(r => r.status === 'present').length;
    const absent = subjectRecords.filter(r => r.status === 'absent').length;
    const leave = subjectRecords.filter(r => r.status === 'leave').length;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

    return { total, present, absent, leave, percentage };
  };

  const getDashboardStats = (): DashboardStats => {
    const subjectStats: SubjectStats[] = subjects.map(subject => ({
      subject,
      ...getSubjectStats(subject.id),
    }));

    const totalPresent = subjectStats.reduce((sum, s) => sum + s.present, 0);
    const totalAbsent = subjectStats.reduce((sum, s) => sum + s.absent, 0);
    const totalLeave = subjectStats.reduce((sum, s) => sum + s.leave, 0);
    const totalClasses = totalPresent + totalAbsent + totalLeave;
    
    const overallPercentage = totalClasses > 0 
      ? Math.round((totalPresent / totalClasses) * 100) 
      : 0;

    return {
      totalSubjects: subjects.length,
      overallPercentage,
      totalPresent,
      totalAbsent,
      totalLeave,
      subjectStats,
    };
  };

  const getAttendanceForSubject = (subjectId: string): AttendanceRecord[] => {
    return records.filter(r => r.subject_id === subjectId);
  };

  return {
    records,
    isLoading,
    markAttendance,
    getAttendanceForDate,
    getSubjectStats,
    getDashboardStats,
    getAttendanceForSubject,
    refetch: loadRecords,
  };
}
