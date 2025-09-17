import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock, Eye, Database } from 'lucide-react';

const SecurityInfo = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Защита данных
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-green-600" />
            <span className="text-sm">RLS политики активны</span>
            <Badge variant="secondary">Защищено</Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-green-600" />
            <span className="text-sm">Контактные данные скрыты</span>
            <Badge variant="secondary">Приватно</Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-green-600" />
            <span className="text-sm">Аудит доступа включен</span>
            <Badge variant="secondary">Мониторинг</Badge>
          </div>
          
          <div className="text-xs text-muted-foreground">
            Все действия с данными логируются для безопасности
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityInfo;