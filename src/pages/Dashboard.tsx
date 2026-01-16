import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSubjects } from '@/hooks/useSubjects';
import { useAttendance } from '@/hooks/useAttendance';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import ThemeToggle from '@/components/ThemeToggle';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  GraduationCap,
  Plus,
  Calendar,
  LogOut,
  BookOpen,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  Trash2,
  Loader2,
  BarChart3,
} from 'lucide-react';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const { subjects, addSubject, deleteSubject } = useSubjects();
  const { getDashboardStats } = useAttendance(subjects);
  const { toast } = useToast();
  
  const [newSubjectName, setNewSubjectName] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isAddingSubject, setIsAddingSubject] = useState(false);

  const stats = getDashboardStats();

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;

    setIsAddingSubject(true);
    const { error } = await addSubject(newSubjectName.trim());
    
    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Subject Added',
        description: `${newSubjectName} has been added successfully.`,
      });
      setNewSubjectName('');
      setIsAddDialogOpen(false);
    }
    setIsAddingSubject(false);
  };

  const handleDeleteSubject = async (id: string, name: string) => {
    const { error } = await deleteSubject(id);
    
    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Subject Deleted',
        description: `${name} has been removed.`,
      });
    }
  };

  const getPercentageColor = (percentage: number) => {
    if (percentage >= 75) return 'text-success';
    if (percentage >= 50) return 'text-warning';
    return 'text-destructive';
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 75) return 'bg-success';
    if (percentage >= 50) return 'bg-warning';
    return 'bg-destructive';
  };

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
                <h1 className="font-display font-bold text-lg">Attendance Tracker</h1>
                <p className="text-sm text-muted-foreground">Welcome, {user?.name}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Link to="/calendar">
                <Button variant="outline" size="sm">
                  <Calendar className="w-4 h-4" />
                  <span className="hidden sm:inline">Calendar</span>
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
        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card variant="elevated" className="animate-fade-in stagger-1">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Overall</p>
                  <p className={`text-2xl font-bold ${getPercentageColor(stats.overallPercentage)}`}>
                    {stats.overallPercentage}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated" className="animate-fade-in stagger-2">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Present</p>
                  <p className="text-2xl font-bold text-success">{stats.totalPresent}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated" className="animate-fade-in stagger-3">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-destructive" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Absent</p>
                  <p className="text-2xl font-bold text-destructive">{stats.totalAbsent}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated" className="animate-fade-in stagger-4">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Leave</p>
                  <p className="text-2xl font-bold text-warning">{stats.totalLeave}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subjects Section */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-display font-bold">Your Subjects</h2>
            <p className="text-muted-foreground">
              {subjects.length} subject{subjects.length !== 1 ? 's' : ''} tracked
            </p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="hero">
                <Plus className="w-5 h-5" />
                Add Subject
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Subject</DialogTitle>
                <DialogDescription>
                  Enter the name of the subject you want to track.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddSubject} className="space-y-4 mt-4">
                <Input
                  placeholder="e.g., Mathematics, Physics, Chemistry"
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  autoFocus
                />
                <div className="flex gap-3 justify-end">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isAddingSubject || !newSubjectName.trim()}>
                    {isAddingSubject ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'Add Subject'
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Subjects Grid */}
        {subjects.length === 0 ? (
          <Card variant="outlined" className="animate-fade-in">
            <CardContent className="py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-display font-bold mb-2">No Subjects Yet</h3>
              <p className="text-muted-foreground mb-6">
                Add your first subject to start tracking attendance.
              </p>
              <Button variant="hero" onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="w-5 h-5" />
                Add Your First Subject
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.subjectStats.map((stat, index) => (
              <Card 
                key={stat.subject.id} 
                variant="elevated"
                className="group animate-fade-in-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${stat.subject.color}20` }}
                      >
                        <BookOpen 
                          className="w-5 h-5" 
                          style={{ color: stat.subject.color }}
                        />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{stat.subject.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {stat.total} classes tracked
                        </p>
                      </div>
                    </div>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Subject</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{stat.subject.name}"? 
                            This will also delete all attendance records for this subject.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteSubject(stat.subject.id, stat.subject.name)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Attendance</span>
                      <span className={`text-lg font-bold ${getPercentageColor(stat.percentage)}`}>
                        {stat.percentage}%
                      </span>
                    </div>
                    
                    <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`absolute inset-y-0 left-0 ${getProgressColor(stat.percentage)} transition-all duration-500`}
                        style={{ width: `${stat.percentage}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-sm">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-success" />
                        <span className="text-muted-foreground">{stat.present} Present</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-destructive" />
                        <span className="text-muted-foreground">{stat.absent} Absent</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-warning" />
                        <span className="text-muted-foreground">{stat.leave} Leave</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Quick action to calendar */}
        {subjects.length > 0 && (
          <div className="mt-8 text-center animate-fade-in">
            <Link to="/calendar">
              <Button variant="outline" size="lg">
                <Calendar className="w-5 h-5" />
                Mark Today's Attendance
                <TrendingUp className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
