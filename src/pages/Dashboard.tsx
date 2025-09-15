import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
  const { profile, loading } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    console.log('Dashboard effect:', { loading, profile: !!profile, role: profile?.role });
    if (!loading && profile) {
      if (profile.role === 'employer') {
        console.log('Redirecting to employer');
        navigate('/employer', { replace: true });
      } else if (profile.role === 'candidate') {
        console.log('Redirecting to candidate');
        navigate('/candidate', { replace: true });
      }
    }
  }, [profile, loading, navigate]);

  console.log('Dashboard render:', { loading, profile: !!profile });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground">{t('common.loading')}</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card>
          <CardContent className="py-12 text-center">
            <div className="text-muted-foreground">
              Profile not found. Please complete registration.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-muted-foreground">Redirecting...</div>
    </div>
  );
};

export default Dashboard;