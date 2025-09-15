import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
  label = "Телефон",
  placeholder = "+7 (999) 123-45-67", 
  required = false,
  error
}: PhoneInputProps) => {
  const formatPhoneNumber = (input: string) => {
    // Remove all non-digits
    const cleaned = input.replace(/\D/g, '');
    
    // Start with +7 if empty or if first digit is 8
    let formatted = '';
    if (cleaned.length === 0) {
      return '';
    }
    
    // Handle different input scenarios
    if (cleaned.startsWith('7')) {
      formatted = '+7';
      const rest = cleaned.slice(1);
      if (rest.length > 0) {
        formatted += ' (' + rest.slice(0, 3);
        if (rest.length > 3) {
          formatted += ') ' + rest.slice(3, 6);
          if (rest.length > 6) {
            formatted += '-' + rest.slice(6, 8);
            if (rest.length > 8) {
              formatted += '-' + rest.slice(8, 10);
            }
          }
        }
      }
    } else if (cleaned.startsWith('8')) {
      formatted = '+7';
      const rest = cleaned.slice(1);
      if (rest.length > 0) {
        formatted += ' (' + rest.slice(0, 3);
        if (rest.length > 3) {
          formatted += ') ' + rest.slice(3, 6);
          if (rest.length > 6) {
            formatted += '-' + rest.slice(6, 8);
            if (rest.length > 8) {
              formatted += '-' + rest.slice(8, 10);
            }
          }
        }
      }
    } else {
      // Assume it's without country code, add +7
      formatted = '+7';
      if (cleaned.length > 0) {
        formatted += ' (' + cleaned.slice(0, 3);
        if (cleaned.length > 3) {
          formatted += ') ' + cleaned.slice(3, 6);
          if (cleaned.length > 6) {
            formatted += '-' + cleaned.slice(6, 8);
            if (cleaned.length > 8) {
              formatted += '-' + cleaned.slice(8, 10);
            }
          }
        }
      }
    }
    
    return formatted;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const formatted = formatPhoneNumber(input);
    onChange(formatted);
  };

  return (
    <div>
      <Label htmlFor="phone">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <Input
        id="phone"
        type="tel"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={error ? "border-destructive" : ""}
        required={required}
      />
      {error && (
        <p className="text-sm text-destructive mt-1">{error}</p>
      )}
      <p className="text-xs text-muted-foreground mt-1">
        Формат: +7 (999) 123-45-67
      </p>
    </div>
  );
};

export default PhoneInput;