import React, { useEffect, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

const DashboardContent = () => {
  const { profile, loading } = useAuth();
  const navigate = useNavigate();
  const { t, ready } = useTranslation();

  useEffect(() => {
    if (!loading && profile) {
      if (profile.role === 'employer') {
        navigate('/employer', { replace: true });
      } else if (profile.role === 'candidate') {
        navigate('/candidate', { replace: true });
      }
    }
  }, [profile, loading, navigate]);

  if (loading || !ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground">{ready ? t('common.loading') : 'Loading...'}</div>
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

const Dashboard = () => {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background"><div>Loading...</div></div>}>
      <DashboardContent />
    </Suspense>
  );
};

export default Dashboard;