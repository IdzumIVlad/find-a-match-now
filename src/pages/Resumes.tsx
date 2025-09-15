import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/Header';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Search, Lock, Mail, Phone, Eye, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Resume {
  id: string;
  full_name: string;
  summary: string;
  skills: string[];
  views: number;
  created_at: string;
}

const Resumes = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [filteredResumes, setFilteredResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState<string>('');
  const [allSkills, setAllSkills] = useState<string[]>([]);

  useEffect(() => {
    checkAccess();
  }, [user]);

  useEffect(() => {
    if (hasAccess) {
      fetchResumes();
    }
  }, [hasAccess]);

  useEffect(() => {
    filterResumes();
  }, [searchTerm, skillFilter, resumes]);

  const checkAccess = async () => {
    if (!user) {
      setHasAccess(false);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('resume_access')
        .select('has_access')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }

      setHasAccess(data?.has_access || false);
    } catch (error) {
      console.error('Error checking access:', error);
      setHasAccess(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchResumes = async () => {
    try {
      // Use secure function that doesn't expose PII for public access
      const { data, error } = await supabase
        .rpc('get_public_resumes_safe');

      if (error) throw error;

      setResumes(data || []);

      // Collect all unique skills
      const skillsSet = new Set<string>();
      data?.forEach(resume => {
        resume.skills?.forEach((skill: string) => skillsSet.add(skill));
      });
      setAllSkills(Array.from(skillsSet).sort());
    } catch (error) {
      console.error('Error fetching resumes:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить резюме",
        variant: "destructive",
      });
    }
  };

  const filterResumes = () => {
    let filtered = resumes;

    if (searchTerm) {
      filtered = filtered.filter(resume =>
        resume.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resume.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resume.skills?.some(skill => 
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (skillFilter) {
      filtered = filtered.filter(resume =>
        resume.skills?.some(skill => 
          skill.toLowerCase().includes(skillFilter.toLowerCase())
        )
      );
    }

    setFilteredResumes(filtered);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">База резюме</h1>
          <p className="text-muted-foreground">
            Найдите подходящих кандидатов для вашей компании
          </p>
        </div>

        {!hasAccess ? (
          <div className="max-w-2xl mx-auto text-center">
            <Card className="p-8">
              <div className="flex flex-col items-center space-y-6">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                  <Lock className="w-8 h-8 text-muted-foreground" />
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold">Доступ к базе резюме</h2>
                  <p className="text-muted-foreground">
                    Для доступа к полной базе резюме кандидатов свяжитесь с нами
                  </p>
                </div>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button disabled size="lg" className="gap-2">
                        <Eye className="w-4 h-4" />
                        SOON
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Функция будет доступна в ближайшее время</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <div className="pt-4 border-t">
                  <Button variant="outline" size="lg" className="gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Связаться с нами
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Поиск и фильтры</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Поиск по имени, описанию или навыкам..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Select value={skillFilter} onValueChange={setSkillFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Фильтр по навыкам" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Все навыки</SelectItem>
                      {allSkills.map((skill) => (
                        <SelectItem key={skill} value={skill}>
                          {skill}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            <div className="flex justify-between items-center">
              <p className="text-muted-foreground">
                Найдено {filteredResumes.length} из {resumes.length} резюме
              </p>
              
              {(searchTerm || skillFilter) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchTerm('');
                    setSkillFilter('');
                  }}
                >
                  Сбросить фильтры
                </Button>
              )}
            </div>

            {/* Resume Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredResumes.map((resume) => (
                <Card key={resume.id} className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <Link to={`/resumes/${resume.id}`}>
                          <CardTitle className="text-lg hover:text-primary transition-colors cursor-pointer">
                            {resume.full_name}
                          </CardTitle>
                        </Link>
                        <div className="mt-2 text-sm text-muted-foreground">
                          Контактные данные доступны авторизованным работодателям
                        </div>
                      </div>
                      <div className="flex items-center text-muted-foreground text-sm">
                        <Eye className="w-4 h-4 mr-1" />
                        {resume.views}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="flex-1 flex flex-col">
                    {/* Summary */}
                    <div className="flex-1 mb-4">
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {resume.summary || 'Описание не указано'}
                      </p>
                    </div>

                    {/* Skills */}
                    {resume.skills && resume.skills.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {resume.skills.slice(0, 6).map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {resume.skills.length > 6 && (
                            <Badge variant="outline" className="text-xs">
                              +{resume.skills.length - 6}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="pt-4 border-t text-xs text-muted-foreground">
                      Создано {formatDate(resume.created_at)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredResumes.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  {searchTerm || skillFilter 
                    ? 'Резюме по заданным критериям не найдены'
                    : 'Резюме пока нет'
                  }
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Resumes;