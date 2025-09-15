import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User, Briefcase, FileText, Database } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

const Header = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  const getDashboardLink = () => {
    if (!profile) return '/dashboard';
    return profile.role === 'employer' ? '/employer' : '/candidate';
  };

  return (
    <header className="border-b bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-xl font-bold text-primary">
              LaburoGO
            </Link>
            
            <nav className="flex items-center gap-6">
              <Link 
                to="/resumes" 
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Database className="w-4 h-4" />
                База резюме
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {getInitials(user.email || 'U')}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.email}</p>
                      {profile && (
                        <p className="text-xs text-muted-foreground">
                          {profile.role === 'employer' ? 'Работодатель' : 'Соискатель'}
                        </p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuItem onClick={() => navigate(getDashboardLink())}>
                    <User className="mr-2 h-4 w-4" />
                    Личный кабинет
                  </DropdownMenuItem>
                  {profile?.role === 'employer' && (
                    <DropdownMenuItem onClick={() => navigate('/employer')}>
                      <Briefcase className="mr-2 h-4 w-4" />
                      Мои вакансии
                    </DropdownMenuItem>
                  )}
                  {profile?.role === 'candidate' && (
                    <DropdownMenuItem onClick={() => navigate('/candidate')}>
                      <FileText className="mr-2 h-4 w-4" />
                      Мои резюме
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Выйти
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild>
                <Link to="/auth">Войти</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;