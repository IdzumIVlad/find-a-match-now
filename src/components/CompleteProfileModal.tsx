import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/contexts/AuthContext';
import PhoneInput from '@/components/PhoneInput';
import { useToast } from '@/hooks/use-toast';
import { trackSignupCandidate, trackSignupEmployer } from '@/lib/analytics';

interface CompleteProfileModalProps {
  open: boolean;
  onClose: () => void;
}

const CompleteProfileModal = ({ open, onClose }: CompleteProfileModalProps) => {
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'employer' | 'candidate'>('candidate');
  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const { createProfile } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError('');
    
    if (!phone.trim()) {
      setPhoneError('Телефон обязателен для заполнения');
      return;
    }

    // Basic phone validation
    const phoneRegex = /^\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/;
    if (!phoneRegex.test(phone)) {
      setPhoneError('Введите корректный номер телефона в формате +7 (999) 123-45-67');
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
      setLoading(false);
    } else {
      // Track role-specific signup in GA4
      if (role === 'candidate') {
        trackSignupCandidate();
      } else if (role === 'employer') {
        trackSignupEmployer();
      }
      
      toast({
        title: "Профиль создан",
        description: "Ваш профиль успешно создан",
      });
      setLoading(false);
      onClose(); // Теперь можно безопасно закрыть модальное окно
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]" data-testid="complete-profile-modal">
        <DialogHeader>
          <DialogTitle>Завершите профиль</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <PhoneInput
            value={phone}
            onChange={setPhone}
            required
            error={phoneError}
          />
          
          <div>
            <Label>
              Роль <span className="text-destructive">*</span>
            </Label>
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