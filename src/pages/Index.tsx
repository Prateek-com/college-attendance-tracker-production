import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ThemeToggle from '@/components/ThemeToggle';
import { 
  GraduationCap, 
  CheckCircle2, 
  Calendar, 
  BarChart3, 
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
} from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-br from-primary/20 via-accent/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-[300px] h-[300px] bg-accent/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary" />
            </div>
            <span className="font-display font-bold text-xl">AttendTrack</span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to="/auth">
              <Button variant="outline">
                Sign In
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-10">
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4" />
              Smart Attendance Tracking
            </div>
            
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 animate-fade-in-up">
              Track Your College{' '}
              <span className="gradient-text">Attendance</span>{' '}
              Effortlessly
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Never miss tracking your attendance again. Manage all your subjects, 
              view statistics, and maintain your academic records with ease.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <Link to="/auth">
                <Button variant="hero" size="xl">
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button variant="outline" size="xl">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-4">
              Everything You Need
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              A complete attendance tracking solution designed for college students
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card variant="elevated" className="hover-lift animate-fade-in-up stagger-1">
              <CardContent className="pt-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-display font-bold mb-2">Easy Tracking</h3>
                <p className="text-muted-foreground">
                  Mark attendance with a single tap. Present, absent, or leave — it's that simple.
                </p>
              </CardContent>
            </Card>

            <Card variant="elevated" className="hover-lift animate-fade-in-up stagger-2">
              <CardContent className="pt-6">
                <div className="w-14 h-14 rounded-2xl bg-success/10 flex items-center justify-center mb-4">
                  <Calendar className="w-7 h-7 text-success" />
                </div>
                <h3 className="text-xl font-display font-bold mb-2">Calendar View</h3>
                <p className="text-muted-foreground">
                  Visual calendar to track your attendance history and plan ahead.
                </p>
              </CardContent>
            </Card>

            <Card variant="elevated" className="hover-lift animate-fade-in-up stagger-3">
              <CardContent className="pt-6">
                <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-4">
                  <BarChart3 className="w-7 h-7 text-accent" />
                </div>
                <h3 className="text-xl font-display font-bold mb-2">Smart Stats</h3>
                <p className="text-muted-foreground">
                  Real-time attendance percentages for each subject and overall progress.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 rounded-3xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-display font-bold mb-6">
                  Why Choose AttendTrack?
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
                      <Shield className="w-4 h-4 text-success" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Data Security</h4>
                      <p className="text-sm text-muted-foreground">
                        Your attendance data is stored securely and never shared.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center flex-shrink-0">
                      <Zap className="w-4 h-4 text-warning" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Lightning Fast</h4>
                      <p className="text-sm text-muted-foreground">
                        Quick and responsive interface for seamless tracking.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Student Focused</h4>
                      <p className="text-sm text-muted-foreground">
                        Built specifically for college students' needs.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-2xl" />
                  <Card variant="elevated" className="relative">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <BarChart3 className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">Overall Attendance</p>
                          <p className="text-2xl font-bold text-success">87%</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Mathematics</span>
                          <span className="text-sm font-medium text-success">92%</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full w-[92%] bg-success rounded-full" />
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Physics</span>
                          <span className="text-sm font-medium text-warning">78%</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full w-[78%] bg-warning rounded-full" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-display font-bold mb-4">
            Ready to Start Tracking?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Join thousands of students who trust AttendTrack for their attendance management.
          </p>
          <Link to="/auth">
            <Button variant="hero" size="xl">
              Create Free Account
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2026 AttendTrack. Built for students, by Prateek Chaudhary.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
