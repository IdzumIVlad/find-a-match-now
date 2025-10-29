import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SlidersHorizontal, X } from "lucide-react";
import { useTranslation } from 'react-i18next';

export interface JobFiltersType {
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  country?: string;
  city?: string;
  employmentType?: string;
}

interface JobFiltersProps {
  filters: JobFiltersType;
  onFiltersChange: (filters: JobFiltersType) => void;
}

export const JobFilters = ({ filters, onFiltersChange }: JobFiltersProps) => {
  const { t } = useTranslation();
  const [localFilters, setLocalFilters] = useState<JobFiltersType>(filters);
  const [open, setOpen] = useState(false);

  const handleApply = () => {
    onFiltersChange(localFilters);
    setOpen(false);
  };

  const handleReset = () => {
    const emptyFilters = {};
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const activeFiltersCount = Object.values(filters).filter(v => v !== undefined && v !== '').length;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative">
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          {t('filters.title')}
          {activeFiltersCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{t('filters.title')}</SheetTitle>
          <SheetDescription>{t('filters.description')}</SheetDescription>
        </SheetHeader>
        <div className="space-y-6 mt-6">
          {/* Salary Range */}
          <div className="space-y-3">
            <Label>{t('filters.salary')}</Label>
            <div className="space-y-2">
              <Select
                value={localFilters.currency || 'USD'}
                onValueChange={(value) => setLocalFilters({ ...localFilters, currency: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('form.currency')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">{t('currency.usd')}</SelectItem>
                  <SelectItem value="ARS">{t('currency.ars')}</SelectItem>
                  <SelectItem value="BRL">{t('currency.brl')}</SelectItem>
                  <SelectItem value="RUB">{t('currency.rub')}</SelectItem>
                  <SelectItem value="EUR">{t('currency.eur')}</SelectItem>
                  <SelectItem value="MXN">{t('currency.mxn')}</SelectItem>
                  <SelectItem value="COP">{t('currency.cop')}</SelectItem>
                  <SelectItem value="CLP">{t('currency.clp')}</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    type="number"
                    placeholder={t('vacancy.salaryFrom')}
                    value={localFilters.salaryMin || ''}
                    onChange={(e) => setLocalFilters({ 
                      ...localFilters, 
                      salaryMin: e.target.value ? Number(e.target.value) : undefined 
                    })}
                  />
                </div>
                <div className="flex-1">
                  <Input
                    type="number"
                    placeholder={t('vacancy.salaryTo')}
                    value={localFilters.salaryMax || ''}
                    onChange={(e) => setLocalFilters({ 
                      ...localFilters, 
                      salaryMax: e.target.value ? Number(e.target.value) : undefined 
                    })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-3">
            <Label>{t('filters.location')}</Label>
            <div className="space-y-2">
              <Input
                placeholder={t('filters.country')}
                value={localFilters.country || ''}
                onChange={(e) => setLocalFilters({ ...localFilters, country: e.target.value })}
              />
              <Input
                placeholder={t('filters.city')}
                value={localFilters.city || ''}
                onChange={(e) => setLocalFilters({ ...localFilters, city: e.target.value })}
              />
            </div>
          </div>

          {/* Employment Type */}
          <div className="space-y-3">
            <Label>{t('filters.employmentType')}</Label>
            <Select
              value={localFilters.employmentType || ''}
              onValueChange={(value) => setLocalFilters({ ...localFilters, employmentType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('filters.selectType')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full-time">{t('employmentType.fullTime')}</SelectItem>
                <SelectItem value="part-time">{t('employmentType.partTime')}</SelectItem>
                <SelectItem value="contract">{t('employmentType.contract')}</SelectItem>
                <SelectItem value="freelance">{t('employmentType.freelance')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button onClick={handleApply} className="flex-1">
              {t('filters.apply')}
            </Button>
            <Button onClick={handleReset} variant="outline">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
