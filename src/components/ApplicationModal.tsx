import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, Link as LinkIcon, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ApplicationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vacancyId: string;
  vacancyTitle: string;
}

interface Resume {
  id: string;
  full_name: string;
  created_at: string;
}

const ApplicationModal = ({ open, onOpenChange, vacancyId, vacancyTitle }: ApplicationModalProps) => {
  const { t } = useTranslation();
  const [userResumes, setUserResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(false);
  const [resumeSource, setResumeSource] = useState<'existing' | 'file' | 'link'>('existing');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const [formData, setFormData] = useState({
    message: '',
    // Guest fields
    guest_name: '',
    guest_email: '',
    guest_phone: '',
    // Resume fields
    resume_id: '',
    resume_link: ''
  });

  const { user, profile } = useAuth();
  const { toast } = useToast();
  const isCandidate = user && profile?.role === 'candidate';

  useEffect(() => {
    if (open && isCandidate) {
      fetchUserResumes();
    }
  }, [open, isCandidate]);

  const fetchUserResumes = async () => {
    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('id, full_name, created_at')
        .eq('candidate_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUserResumes(data || []);
      
      // Set default resume source based on available resumes
      if ((data || []).length === 0) {
        setResumeSource('file');
      }
    } catch (error) {
      console.error('Error fetching resumes:', error);
    }
  };

  const uploadFile = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${vacancyId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('application-files')
      .upload(fileName, file);

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
      .from('application-files')
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  };

  const validateForm = (): boolean => {
    if (!isCandidate) {
      if (!formData.guest_name.trim() || !formData.guest_email.trim() || !formData.guest_phone.trim()) {
        toast({
          title: t("applicationModal.error"),
          description: t("applicationModal.fillRequired"),
          variant: "destructive",
        });
        return false;
      }
    }

    if (resumeSource === 'existing' && !formData.resume_id) {
      toast({
        title: t("applicationModal.error"),
        description: t("applicationModal.selectResumeError"),
        variant: "destructive",
      });
      return false;
    }

    if (resumeSource === 'file' && !selectedFile) {
      toast({
        title: t("applicationModal.error"),
        description: t("applicationModal.selectFileError"),
        variant: "destructive",
      });
      return false;
    }

    if (resumeSource === 'link' && !formData.resume_link.trim()) {
      toast({
        title: t("applicationModal.error"),
        description: t("applicationModal.provideLinkError"),
        variant: "destructive",
      });
      return false;
    }

    if (resumeSource === 'link') {
      const link = formData.resume_link.trim();
      if (!link || (!link.startsWith('http') && !link.includes('.'))) {
        toast({
          title: t("applicationModal.error"),
          description: t("applicationModal.invalidLinkError"),
          variant: "destructive",
        });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      let applicationData: any = {
        vacancy_id: vacancyId,
        message: formData.message.trim() || null,
      };

      if (isCandidate) {
        applicationData.applied_by = 'candidate';
        applicationData.candidate_id = user.id;
        
        if (resumeSource === 'existing') {
          applicationData.resume_id = formData.resume_id;
        } else if (resumeSource === 'file' && selectedFile) {
          const fileUrl = await uploadFile(selectedFile);
          applicationData.resume_file_url = fileUrl;
        } else if (resumeSource === 'link') {
          applicationData.resume_link = formData.resume_link.trim();
        }
      } else {
        // Guest application
        applicationData.applied_by = 'guest';
        applicationData.candidate_id = null;
        applicationData.guest_name = formData.guest_name.trim();
        applicationData.guest_email = formData.guest_email.toLowerCase().trim();
        applicationData.guest_phone = formData.guest_phone.trim();
        
        if (resumeSource === 'file' && selectedFile) {
          const fileUrl = await uploadFile(selectedFile);
          applicationData.resume_file_url = fileUrl;
        } else if (resumeSource === 'link') {
          applicationData.resume_link = formData.resume_link.trim();
        }
      }

      const { error } = await supabase
        .from('applications')
        .insert(applicationData);

      if (error) {
        if (error.code === '23505') {
          toast({
            title: t("applicationModal.alreadyApplied"),
            description: t("applicationModal.alreadyAppliedDesc"),
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: t("applicationModal.sent"),
          description: t("applicationModal.sentDesc"),
        });
        handleClose();
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: t("applicationModal.error"),
        description: t("applicationModal.sendError"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      message: '',
      guest_name: '',
      guest_email: '',
      guest_phone: '',
      resume_id: '',
      resume_link: ''
    });
    setSelectedFile(null);
    setUploadProgress(0);
    if (userResumes.length > 0) {
      setResumeSource('existing');
    }
    onOpenChange(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        toast({
          title: t("applicationModal.error"),
          description: t("applicationModal.fileSizeError"),
          variant: "destructive",
        });
        return;
      }
      
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: t("applicationModal.error"),
          description: t("applicationModal.fileTypeError"),
          variant: "destructive",
        });
        return;
      }
      
      setSelectedFile(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("applicationModal.title")}</DialogTitle>
          <p className="text-sm text-muted-foreground">{vacancyTitle}</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isCandidate && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <User className="w-4 h-4" />
                  <h3 className="font-medium">{t("applicationModal.contactData")}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="guest_name">{t("applicationModal.name")}</Label>
                    <Input
                      id="guest_name"
                      value={formData.guest_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, guest_name: e.target.value }))}
                      placeholder={t("applicationModal.namePlaceholder")}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="guest_phone">{t("application.phone")} *</Label>
                    <Input
                      id="guest_phone"
                      type="tel"
                      value={formData.guest_phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, guest_phone: e.target.value }))}
                      placeholder={t("applicationModal.phonePlaceholder")}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="guest_email">{t("auth.email")} *</Label>
                    <Input
                      id="guest_email"
                      type="email"
                      value={formData.guest_email}
                      onChange={(e) => setFormData(prev => ({ ...prev, guest_email: e.target.value }))}
                      placeholder="ivan@example.com"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-4 h-4" />
                <h3 className="font-medium">{t("applicationModal.resume")}</h3>
              </div>

              {isCandidate && userResumes.length > 0 && (
                <RadioGroup 
                  value={resumeSource} 
                  onValueChange={(value) => setResumeSource(value as 'existing' | 'file' | 'link')}
                  className="mb-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="existing" id="existing" />
                    <Label htmlFor="existing">{t("applicationModal.selectExisting")}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="file" id="file" />
                    <Label htmlFor="file">{t("applicationModal.uploadFile")}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="link" id="link" />
                    <Label htmlFor="link">{t("applicationModal.provideLink")}</Label>
                  </div>
                </RadioGroup>
              )}

              {(!isCandidate || userResumes.length === 0) && (
                <RadioGroup 
                  value={resumeSource} 
                  onValueChange={(value) => setResumeSource(value as 'file' | 'link')}
                  className="mb-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="file" id="file" />
                    <Label htmlFor="file">{t("applicationModal.uploadFile")}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="link" id="link" />
                    <Label htmlFor="link">{t("applicationModal.provideLink")}</Label>
                  </div>
                </RadioGroup>
              )}

              {resumeSource === 'existing' && userResumes.length > 0 && (
                <div>
                  <Label>{t("applicationModal.selectResume")}</Label>
                  <Select value={formData.resume_id} onValueChange={(value) => setFormData(prev => ({ ...prev, resume_id: value }))}>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder={t("applicationModal.selectResume")} />
                    </SelectTrigger>
                    <SelectContent className="bg-background border z-50">
                      {userResumes.map((resume) => (
                        <SelectItem key={resume.id} value={resume.id}>
                          {resume.full_name} ({t("time.created", { date: new Date(resume.created_at).toLocaleDateString() })})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {resumeSource === 'file' && (
                <div>
                  <Label htmlFor="resume_file">{t("applicationModal.resumeFile")}</Label>
                  <div className="mt-2">
                    <Input
                      id="resume_file"
                      type="file"
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={handleFileChange}
                      className="cursor-pointer"
                    />
                    {selectedFile && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                        <Upload className="w-4 h-4" />
                        {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                      </div>
                    )}
                  </div>
                </div>
              )}

              {resumeSource === 'link' && (
                <div>
                  <Label htmlFor="resume_link">{t("applicationModal.resumeLinkLabel")}</Label>
                  <div className="mt-2 flex">
                    <div className="flex items-center px-3 border border-r-0 rounded-l-md bg-muted">
                      <LinkIcon className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <Input
                      id="resume_link"
                      type="text"
                      value={formData.resume_link}
                      onChange={(e) => setFormData(prev => ({ ...prev, resume_link: e.target.value }))}
                      placeholder={t("applicationModal.resumeLinkPlaceholder")}
                      className="rounded-l-none"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div>
            <Label htmlFor="message">{t("applicationModal.coverLetterLabel")}</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              placeholder={t("applicationModal.coverLetterPlaceholder")}
              rows={4}
              className="mt-2"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? t("applicationModal.sending") : t("applicationModal.sendApplication")}
            </Button>
            <Button type="button" variant="outline" onClick={handleClose}>
              {t("common.cancel")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationModal;
