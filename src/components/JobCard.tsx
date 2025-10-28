import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Building2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface JobCardProps {
  id: string;
  title: string;
  companyName: string;
  location: string;
  salary: string;
  currency?: string;
  type: string;
  description: string;
  postedDate: string;
  onApply: (jobId: string) => void;
}

const JobCard = ({
  id,
  title,
  companyName,
  location,
  salary,
  currency,
  type,
  description,
  postedDate,
  onApply,
}: JobCardProps) => {
  const { t } = useTranslation();
  
  const getCurrencySymbol = (curr?: string) => {
    const symbols: Record<string, string> = {
      USD: '$',
      ARS: '$',
      BRL: 'R$',
      RUB: '₽',
      EUR: '€',
      MXN: '$',
      COP: '$',
      CLP: '$',
    };
    return symbols[curr || 'USD'] || curr || '$';
  };
  
  const formatSalaryDisplay = (salaryText: string, curr?: string) => {
    // If salary already has a currency symbol, return as is
    if (salaryText.includes('$') || salaryText.includes('₽') || salaryText.includes('€') || salaryText.includes('R$')) {
      return salaryText;
    }
    // Check if it's "Negotiable" or similar
    if (salaryText.toLowerCase().includes('negoc') || salaryText.toLowerCase().includes('договор')) {
      return salaryText;
    }
    // Otherwise prepend the currency symbol
    const symbol = getCurrencySymbol(curr);
    return `${symbol}${salaryText}`;
  };
  
  return (
    <Card className="bg-gradient-card shadow-card hover:shadow-hover transition-all duration-300 border-0 focus-within:ring-2 focus-within:ring-ring" data-testid="job-card">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <CardTitle className="text-xl text-foreground hover:text-primary transition-colors">
              {title}
            </CardTitle>
            <div className="flex items-center gap-4 text-muted-foreground text-sm">
              <div className="flex items-center gap-1">
                <Building2 className="w-4 h-4" aria-hidden="true" />
                <span aria-label={`Company: ${companyName}`}>{companyName}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" aria-hidden="true" />
                <span aria-label={`Location: ${location}`}>{location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" aria-hidden="true" />
                <span aria-label={`Posted: ${postedDate}`}>{postedDate}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <Badge variant="secondary" className="mb-2">
              {type}
            </Badge>
            <p className="text-lg font-semibold text-primary">{formatSalaryDisplay(salary, currency)}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base mb-4 leading-relaxed line-clamp-3">
          {description}
        </CardDescription>
        <Button 
          onClick={() => onApply(id)}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          aria-label={`Apply for ${title} at ${companyName}`}
        >
          {t("jobCard.apply")}
        </Button>
      </CardContent>
    </Card>
  );
};

export default JobCard;