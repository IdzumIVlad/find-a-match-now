import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, DollarSign, Clock, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface VacancyCardProps {
  id: string;
  title: string;
  location?: string;
  salary_min?: number;
  salary_max?: number;
  employment_type?: string;
  description?: string;
  views: number;
  postedDate: string;
  onApply: (vacancyId: string) => void;
}

const VacancyCard = ({
  id,
  title,
  location,
  salary_min,
  salary_max,
  employment_type,
  description,
  views,
  postedDate,
  onApply
}: VacancyCardProps) => {
  const { t } = useTranslation();
  
  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return t('vacancy.salaryNegotiable');
    if (min && max) return `${min.toLocaleString()} - ${max.toLocaleString()} ₽`;
    if (min) return `${t('vacancy.salaryFrom')} ${min.toLocaleString()} ₽`;
    if (max) return `${t('vacancy.salaryTo')} ${max.toLocaleString()} ₽`;
    return t('vacancy.salaryNegotiable');
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <Link to={`/vacancies/${id}`}>
              <CardTitle className="text-xl hover:text-primary transition-colors cursor-pointer">
                {title}
              </CardTitle>
            </Link>
            <CardDescription className="flex flex-wrap gap-4 mt-2">
              {location && (
                <span className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {location}
                </span>
              )}
              <span className="flex items-center">
                <DollarSign className="w-4 h-4 mr-1" />
                {formatSalary(salary_min, salary_max)}
              </span>
            </CardDescription>
          </div>
          <div className="flex flex-col items-end gap-2">
            {employment_type && <Badge variant="secondary">{employment_type}</Badge>}
            <div className="flex items-center text-muted-foreground text-sm">
              <Eye className="w-4 h-4 mr-1" />
              {views}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1">
          <p className="text-muted-foreground line-clamp-3 mb-4">
            {description || t('vacancy.noDescription')}
          </p>
        </div>
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="w-4 h-4 mr-1" />
            {postedDate}
          </div>
          <Button size="sm" onClick={() => onApply(id)}>
            {t('vacancy.apply')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VacancyCard;