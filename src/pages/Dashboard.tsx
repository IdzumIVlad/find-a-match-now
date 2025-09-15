import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Dashboard = () => {
  const { user, profile } = useAuth();

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Личный кабинет</h1>
          <p className="text-muted-foreground">Добро пожаловать в ваш личный кабинет</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Информация о пользователе</CardTitle>
              <CardDescription>Ваши основные данные</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <strong>Email:</strong> {user?.email}
              </div>
              {profile && (
                <>
                  <div>
                    <strong>Телефон:</strong> {profile.phone}
                  </div>
                  <div>
                    <strong>Роль:</strong> {profile.role === 'employer' ? 'Работодатель' : 'Соискатель'}
                  </div>
                  <div>
                    <strong>Дата регистрации:</strong> {new Date(profile.created_at).toLocaleDateString('ru-RU')}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Быстрые действия</CardTitle>
              <CardDescription>Основные функции платформы</CardDescription>
            </CardHeader>
            <CardContent>
              {profile?.role === 'employer' ? (
                <p>Функции для работодателей будут добавлены позже</p>
              ) : (
                <p>Функции для соискателей будут добавлены позже</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;