import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
}

const PhoneInput = ({ 
  value, 
  onChange, 
  label,
  placeholder, 
  required = false,
  error
}: PhoneInputProps) => {
  const { t } = useTranslation();
  
  const formatPhoneNumber = (input: string) => {
    // Just clean and allow international format
    const cleaned = input.replace(/[^\d+\s()-]/g, '');
    return cleaned;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const formatted = formatPhoneNumber(input);
    onChange(formatted);
  };

  return (
    <div>
      <Label htmlFor="phone">
        {label || t('form.phone')} {required && <span className="text-destructive">*</span>}
      </Label>
      <Input
        id="phone"
        type="tel"
        value={value}
        onChange={handleChange}
        placeholder={placeholder || "+1 (555) 123-4567"}
        className={error ? "border-destructive" : ""}
        required={required}
      />
      {error && (
        <p className="text-sm text-destructive mt-1">{error}</p>
      )}
    </div>
  );
};

export default PhoneInput;