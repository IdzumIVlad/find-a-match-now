import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface CompleteProfileModalProps {
  open: boolean;
  onClose: () => void;
}

const CompleteProfileModal = ({ open, onClose }: CompleteProfileModalProps) => {
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'employer' | 'candidate'>('candidate');
  const [loading, setLoading] = useState(false);
  const { createProfile } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      toast({
        title: "Ошибка",
        description: "Телефон обязателен для заполнения",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    const { error } = await createProfile(phone, role);
    
    if (error) {
      toast({
        title: "Ошибка создания профиля",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Профиль создан",
        description: "Ваш профиль успешно создан",
      });
      onClose();
    }
    
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Завершите профиль</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="phone">Телефон *</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+7 (999) 123-45-67"
              required
            />
          </div>
          
          <div>
            <Label>Роль *</Label>
            <RadioGroup value={role} onValueChange={(value: 'employer' | 'candidate') => setRole(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="employer" id="employer" />
                <Label htmlFor="employer">Работодатель</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="candidate" id="candidate" />
                <Label htmlFor="candidate">Соискатель</Label>
              </div>
            </RadioGroup>
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Сохраняем...' : 'Сохранить профиль'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CompleteProfileModal;