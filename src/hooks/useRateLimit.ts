import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Простая функция для хеширования IP
const hashString = async (str: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(str + 'SALT_SECRET_KEY'); // В продакшене использовать настоящий соль
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export const useRateLimit = () => {
  const [isBlocked, setIsBlocked] = useState(false);

  const checkRateLimit = useCallback(async (vacancyId: string): Promise<boolean> => {
    try {
      // Получаем IP адрес пользователя (в продакшене через заголовки)
      const userAgent = navigator.userAgent;
      const ipHash = await hashString('127.0.0.1'); // В продакшене получать реальный IP

      // Проверяем, есть ли заявки за последние 10 минут
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
      
      const { data, error } = await supabase
        .from('apply_audit')
        .select('id')
        .eq('vacancy_id', vacancyId)
        .eq('ip_hash', ipHash)
        .gte('created_at', tenMinutesAgo)
        .limit(1);

      if (error) {
        console.error('Rate limit check failed:', error);
        return false; // В случае ошибки разрешаем заявку
      }

      const blocked = (data && data.length > 0);
      setIsBlocked(blocked);
      
      return blocked;
    } catch (error) {
      console.error('Rate limit check error:', error);
      return false;
    }
  }, []);

  const recordApplication = useCallback(async (vacancyId: string, userId?: string) => {
    try {
      const userAgent = navigator.userAgent;
      const ipHash = await hashString('127.0.0.1'); // В продакшене получать реальный IP

      const { error } = await supabase
        .from('apply_audit')
        .insert({
          vacancy_id: vacancyId,
          user_id: userId || null,
          ip_hash: ipHash,
          user_agent: userAgent
        });

      if (error) {
        console.error('Failed to record application audit:', error);
      }
    } catch (error) {
      console.error('Error recording application audit:', error);
    }
  }, []);

  return { checkRateLimit, recordApplication, isBlocked };
};