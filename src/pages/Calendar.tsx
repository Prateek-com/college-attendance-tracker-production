import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSubjects } from '@/hooks/useSubjects';
import { useAttendance } from '@/hooks/useAttendance';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { AttendanceStatus, Subject } from '@/types';
import ThemeToggle from '@/components/ThemeToggle';
import {
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  CheckCircle2,
  XCircle,
  Clock,
  BookOpen,
} from 'lucide-react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  getDay,
  isToday,
  isFuture,
} from 'date-fns';

export default function AttendanceCalendar() {
  const { user, signOut } = useAuth();
  const { subjects } = useSubjects();
  const { markAttendance, getAttendanceForDate } = useAttendance(subjects);
  const { toast } = useToast();

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    // Add padding days for the start of the week
    const startPadding = getDay(monthStart);
    const paddingDays = Array(startPadding).fill(null);
    
    return [...paddingDays, ...days];
  }, [currentMonth]);

  const handleMarkAttendance = async (status: AttendanceStatus) => {
    if (!selectedSubject || !selectedDate) return;

    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const { error } = await markAttendance(selectedSubject.id, dateStr, status);

    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Attendance Marked',
        description: `Marked as ${status} for ${selectedSubject.name} on ${format(selectedDate, 'MMM d, yyyy')}`,
      });
    }
  };

  const getStatusForDay = (date: Date): AttendanceStatus | null => {
    if (!selectedSubject) return null;
    return getAttendanceForDate(selectedSubject.id, format(date, 'yyyy-MM-dd'));
  };

  const getStatusColor = (status: AttendanceStatus | null) => {
    switch (status) {
      case 'present':
        return 'bg-success text-success-foreground';
      case 'absent':
        return 'bg-destructive text-destructive-foreground';
      case 'leave':
        return 'bg-warning text-warning-foreground';
      default:
        return '';
    }
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="font-display font-bold text-lg">Attendance Calendar</h1>
                <p className="text-sm text-muted-foreground">Mark your daily attendance</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Link to="/dashboard">
                <Button variant="outline" size="sm">
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Subject Selection */}
          <div className="lg:col-span-1">
            <Card variant="elevated" className="animate-fade-in">
              <CardHeader>
                <CardTitle className="text-lg">Select Subject</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {subjects.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No subjects added yet</p>
                    <Link to="/dashboard">
                      <Button variant="link" className="mt-2">Add Subject</Button>
                    </Link>
                  </div>
                ) : (
                  subjects.map((subject) => (
                    <button
                      key={subject.id}
                      onClick={() => setSelectedSubject(subject)}
                      className={`w-full p-4 rounded-xl text-left transition-all duration-200 hover:scale-[1.02] ${
                        selectedSubject?.id === subject.id
                          ? 'bg-primary text-primary-foreground shadow-lg'
                          : 'bg-secondary hover:bg-secondary/80'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            selectedSubject?.id === subject.id 
                              ? 'bg-primary-foreground/20' 
                              : ''
                          }`}
                          style={{ 
                            backgroundColor: selectedSubject?.id !== subject.id 
                              ? `${subject.color}20` 
                              : undefined 
                          }}
                        >
                          <BookOpen 
                            className="w-4 h-4" 
                            style={{ 
                              color: selectedSubject?.id === subject.id 
                                ? 'currentColor' 
                                : subject.color 
                            }}
                          />
                        </div>
                        <span className="font-medium">{subject.name}</span>
                      </div>
                    </button>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Status Legend */}
            <Card variant="outlined" className="mt-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Status Legend</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-success" />
                  <span className="text-sm text-muted-foreground">Present</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-destructive" />
                  <span className="text-sm text-muted-foreground">Absent</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-warning" />
                  <span className="text-sm text-muted-foreground">Leave</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card variant="elevated" className="animate-slide-in-right">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">
                    {format(currentMonth, 'MMMM yyyy')}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentMonth(new Date())}
                    >
                      Today
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Week day headers */}
                <div className="grid grid-cols-7 mb-2">
                  {weekDays.map((day) => (
                    <div
                      key={day}
                      className="text-center text-sm font-medium text-muted-foreground py-2"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, index) => {
                    if (!day) {
                      return <div key={`padding-${index}`} className="aspect-square" />;
                    }

                    const status = getStatusForDay(day);
                    const isSelected = selectedDate && isSameDay(day, selectedDate);
                    const disabled = !selectedSubject || isFuture(day);

                    return (
                      <button
                        key={day.toISOString()}
                        onClick={() => !disabled && setSelectedDate(day)}
                        disabled={disabled}
                        className={`
                          aspect-square rounded-lg text-sm font-medium
                          transition-all duration-200
                          flex items-center justify-center
                          ${disabled ? 'opacity-40 cursor-not-allowed' : 'hover:scale-105 cursor-pointer'}
                          ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}
                          ${isToday(day) && !status ? 'bg-primary/10 text-primary font-bold' : ''}
                          ${status ? getStatusColor(status) : 'hover:bg-secondary'}
                        `}
                      >
                        {format(day, 'd')}
                      </button>
                    );
                  })}
                </div>

                {/* Quick mark buttons */}
                {selectedSubject && selectedDate && !isFuture(selectedDate) && (
                  <div className="mt-6 p-4 bg-secondary/50 rounded-xl animate-fade-in">
                    <p className="text-sm text-muted-foreground mb-3">
                      Mark attendance for <strong>{selectedSubject.name}</strong> on{' '}
                      <strong>{format(selectedDate, 'MMMM d, yyyy')}</strong>
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        variant="success"
                        onClick={() => handleMarkAttendance('present')}
                        className="flex-1"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Present
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleMarkAttendance('absent')}
                        className="flex-1"
                      >
                        <XCircle className="w-4 h-4" />
                        Absent
                      </Button>
                      <Button
                        variant="warning"
                        onClick={() => handleMarkAttendance('leave')}
                        className="flex-1"
                      >
                        <Clock className="w-4 h-4" />
                        Leave
                      </Button>
                    </div>
                  </div>
                )}

                {!selectedSubject && (
                  <div className="mt-6 p-4 bg-muted/50 rounded-xl text-center">
                    <p className="text-muted-foreground">
                      Select a subject from the sidebar to mark attendance
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
