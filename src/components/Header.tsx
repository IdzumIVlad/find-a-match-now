import React, { useState } from 'react';
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
import { LogOut, User, Briefcase, FileText, Database, Plus } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import JobForm from '@/components/JobForm';
import { useTranslation } from 'react-i18next';

const Header = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showJobForm, setShowJobForm] = useState(false);

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
    <>
      {/* Skip to main content link for keyboard navigation */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        {t('common.skipToContent') || 'Skip to main content'}
      </a>
      <header className="border-b bg-background" role="banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-xl font-bold text-primary" aria-label={t('common.homeLink') || 'Go to home page'}>
              LaburoGO
            </Link>
            
            <nav className="flex items-center gap-6" role="navigation" aria-label={t('common.mainNavigation') || 'Main navigation'}>
              <Link 
                to="/resumes" 
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:rounded"
                aria-label={t('common.resumesLink') || 'Browse resumes'}
              >
                <Database className="w-4 h-4" aria-hidden="true" />
                {t('common.resumes')}
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center gap-2" role="toolbar" aria-label={t('common.userActions') || 'User actions'}>
            <Button 
              onClick={() => setShowJobForm(true)}
              variant="default"
              size="sm"
              className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              aria-label={t('home.postJobAriaLabel') || 'Post a new job'}
            >
              <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
              {t('home.postJob')}
            </Button>
            <LanguageSwitcher />
            <ThemeToggle />
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="relative h-8 w-8 rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    aria-label={t('common.userMenu') || 'User menu'}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {getInitials(user.email || 'U')}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-popover z-50">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.email}</p>
                      {profile && (
                        <p className="text-xs text-muted-foreground">
                          {profile.role === 'employer' ? t('common.employer') : t('common.candidate')}
                        </p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuItem onClick={() => navigate(getDashboardLink())}>
                    <User className="mr-2 h-4 w-4" />
                    {t('common.dashboard')}
                  </DropdownMenuItem>
                  {profile?.role === 'employer' && (
                    <DropdownMenuItem onClick={() => navigate('/employer')}>
                      <Briefcase className="mr-2 h-4 w-4" />
                      {t('common.myVacancies')}
                    </DropdownMenuItem>
                  )}
                  {profile?.role === 'candidate' && (
                    <DropdownMenuItem onClick={() => navigate('/candidate')}>
                      <FileText className="mr-2 h-4 w-4" />
                      {t('common.myResumes')}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    {t('common.logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                <Link to="/auth">{t('common.login')}</Link>
              </Button>
            )}
          </div>
        </div>
        </div>
      </header>

      <JobForm
        open={showJobForm}
        onOpenChange={setShowJobForm}
        onSubmit={() => {
          setShowJobForm(false);
          if (window.location.pathname === '/') {
            window.location.reload();
          }
        }}
      />
    </>
  );
};

export default Header;