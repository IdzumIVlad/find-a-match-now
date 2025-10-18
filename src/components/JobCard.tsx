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
  type,
  description,
  postedDate,
  onApply,
}: JobCardProps) => {
  const { t } = useTranslation();
  
  return (
    <Card className="bg-gradient-card shadow-card hover:shadow-hover transition-all duration-300 border-0" data-testid="job-card">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <CardTitle className="text-xl text-foreground hover:text-primary transition-colors">
              {title}
            </CardTitle>
            <div className="flex items-center gap-4 text-muted-foreground text-sm">
              <div className="flex items-center gap-1">
                <Building2 className="w-4 h-4" />
                {companyName}
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {location}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {postedDate}
              </div>
            </div>
          </div>
          <div className="text-right">
            <Badge variant="secondary" className="mb-2">
              {type}
            </Badge>
            <p className="text-lg font-semibold text-primary">{salary}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base mb-4 leading-relaxed line-clamp-3">
          {description}
        </CardDescription>
        <Button 
          onClick={() => onApply(id)}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {t("jobCard.apply")}
        </Button>
      </CardContent>
    </Card>
  );
};

export default JobCard;