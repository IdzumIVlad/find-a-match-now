import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Header from '@/components/Header';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useViewTracker } from '@/hooks/useViewTracker';
import { Mail, Phone, Eye, Send, Calendar } from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import { HelmetProvider } from 'react-helmet-async';
import { format } from 'date-fns';

interface Resume {
  id: string;
  candidate_id: string;
  full_name: string;
  email: string;
  phone: string;
  summary: string;
  skills: string[];
  experience: any[];
  education: any[];
  views: number;
  created_at: string;
}

const ResumeDetail = () => {
  const { id } = useParams();
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [emailForm, setEmailForm] = useState({
    employerEmail: '',
    message: ''
  });
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const { toast } = useToast();

  // Track views for this resume
  useViewTracker({
    resourceType: 'resume',
    id: id || '',
    enabled: !!id
  });

  useEffect(() => {
    if (id) {
      fetchResume();
    }
  }, [id]);

  const fetchResume = async () => {
    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setResume({
        ...data,
        experience: data.experience as any[],
        education: data.education as any[]
      });
    } catch (error) {
      console.error('Error fetching resume:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить резюме",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emailForm.employerEmail.trim()) {
      toast({
        title: "Ошибка",
        description: "Введите email работодателя",
        variant: "destructive",
      });
      return;
    }

    setSendingEmail(true);

    try {
      const response = await fetch(`https://usmwwkltvjyjzaxsdyhz.supabase.co/functions/v1/send-resume`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employerEmail: emailForm.employerEmail,
          message: emailForm.message,
          resumeData: resume,
          resumeUrl: window.location.href
        }),
      });

      if (!response.ok) throw new Error('Failed to send email');

      toast({
        title: "Успешно",
        description: "Резюме отправлено работодателю",
      });

      setEmailDialogOpen(false);
      setEmailForm({ employerEmail: '', message: '' });
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось отправить резюме",
        variant: "destructive",
      });
    } finally {
      setSendingEmail(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  const formatExperienceDate = (date: string | Date) => {
    if (!date) return '';
    return format(new Date(date), 'MM.yyyy');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Загрузка...</div>
        </div>
      </div>
    );
  }

  if (!resume) {
    return <Navigate to="/404" replace />;
  }

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-background">
        <SEOHead 
          title={`Резюме ${resume.full_name}`}
          description={`Резюме ${resume.full_name}. ${resume.summary?.slice(0, 150)}... Навыки: ${resume.skills?.slice(0, 5).join(', ')}`}
          type="article"
          keywords={`резюме, кандидат, ${resume.full_name}, ${resume.skills?.join(', ')}, поиск работы`}
        />
        <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">{resume.full_name}</h1>
              <div className="flex items-center gap-4 text-muted-foreground">
                <span className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  {resume.views} просмотров
                </span>
                <span>Создано {formatDate(resume.created_at)}</span>
              </div>
            </div>
            <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Отправить работодателю
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Отправить резюме работодателю</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSendEmail} className="space-y-4">
                  <div>
                    <Label htmlFor="employerEmail">Email работодателя *</Label>
                    <Input
                      id="employerEmail"
                      type="email"
                      value={emailForm.employerEmail}
                      onChange={(e) => setEmailForm(prev => ({ ...prev, employerEmail: e.target.value }))}
                      placeholder="employer@company.com"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="message">Сопроводительное письмо</Label>
                    <Textarea
                      id="message"
                      value={emailForm.message}
                      onChange={(e) => setEmailForm(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Добавьте персональное сообщение для работодателя"
                      rows={4}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setEmailDialogOpen(false)}>
                      Отмена
                    </Button>
                    <Button type="submit" disabled={sendingEmail}>
                      {sendingEmail ? 'Отправка...' : 'Отправить'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Contact Info */}
          <div className="flex flex-wrap gap-4 text-muted-foreground">
            <a href={`mailto:${resume.email}`} className="flex items-center hover:text-primary">
              <Mail className="w-4 h-4 mr-2" />
              {resume.email}
            </a>
            {resume.phone && (
              <a href={`tel:${resume.phone}`} className="flex items-center hover:text-primary">
                <Phone className="w-4 h-4 mr-2" />
                {resume.phone}
              </a>
            )}
          </div>
        </div>

        {/* Summary */}
        {resume.summary && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>О себе</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{resume.summary}</p>
            </CardContent>
          </Card>
        )}

        {/* Skills */}
        {resume.skills && resume.skills.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Навыки</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {resume.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Experience */}
        {resume.experience && resume.experience.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Опыт работы</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {resume.experience.map((exp, index) => (
                <div key={index} className="border-l-2 border-primary pl-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">{exp.position}</h3>
                      <p className="text-muted-foreground">{exp.company}</p>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatExperienceDate(exp.startDate)} - {exp.endDate ? formatExperienceDate(exp.endDate) : 'Настоящее время'}
                    </div>
                  </div>
                  {exp.responsibilities && (
                    <p className="whitespace-pre-wrap text-muted-foreground">{exp.responsibilities}</p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Education */}
        {resume.education && resume.education.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Образование</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {resume.education.map((edu, index) => (
                <div key={index} className="border-l-2 border-secondary pl-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{edu.degree}</h3>
                      <p className="text-muted-foreground">{edu.institution}</p>
                    </div>
                    {(edu.startYear || edu.endYear) && (
                      <div className="text-sm text-muted-foreground">
                        {edu.startYear} - {edu.endYear || 'Настоящее время'}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
      </div>
    </HelmetProvider>
  );
};

export default ResumeDetail;