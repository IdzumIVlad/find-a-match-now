import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import SEOHead from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Mail, Send } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const contactSchema = z.object({
  name: z.string()
    .trim()
    .min(2, { message: 'El nombre debe tener al menos 2 caracteres' })
    .max(100, { message: 'El nombre debe tener menos de 100 caracteres' }),
  email: z.string()
    .trim()
    .email({ message: 'Email inválido' })
    .max(255, { message: 'El email debe tener menos de 255 caracteres' }),
  message: z.string()
    .trim()
    .min(10, { message: 'El mensaje debe tener al menos 10 caracteres' })
    .max(2000, { message: 'El mensaje debe tener menos de 2000 caracteres' }),
});

type ContactFormData = z.infer<typeof contactSchema>;

const Contact = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    try {
      // TODO: Implement actual email sending via edge function
      console.log('Contact form submission:', {
        ...data,
        timestamp: new Date().toISOString(),
      });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: '¡Mensaje enviado!',
        description: 'Gracias por contactarnos. Te responderemos pronto.',
      });

      form.reset();
    } catch (error) {
      console.error('Error sending contact form:', error);
      toast({
        title: 'Error',
        description: 'No se pudo enviar el mensaje. Por favor, intentá nuevamente.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEOHead
        title="Contacto - LaburoGO"
        description="Ponete en contacto con el equipo de LaburoGO. Estamos acá para ayudarte."
        keywords="contacto, soporte, ayuda, LaburoGO"
      />
      
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          <div className="mb-8">
            <Link to="/">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('common.home')}
              </Button>
            </Link>
            <div className="flex items-center gap-3 mb-2">
              <Mail className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">Contacto</h1>
            </div>
            <p className="text-muted-foreground">
              ¿Tenés alguna pregunta o sugerencia? Dejanos tu mensaje y te responderemos a la brevedad.
            </p>
          </div>

          <div className="bg-card rounded-lg border shadow-sm p-6 md:p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Nombre *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Tu nombre completo"
                          className="bg-background"
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Email *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="tu@email.com"
                          className="bg-background"
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Mensaje *</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Contanos en qué podemos ayudarte..."
                          className="bg-background min-h-[150px] resize-none"
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-2">
                  <Button
                    type="submit"
                    className="w-full md:w-auto"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Enviar Mensaje
                      </>
                    )}
                  </Button>
                </div>

                <p className="text-sm text-muted-foreground">
                  * Campos obligatorios
                </p>
              </form>
            </Form>

            <div className="mt-8 pt-8 border-t">
              <h3 className="text-lg font-semibold text-foreground mb-4">Otras formas de contacto</h3>
              <div className="space-y-3 text-muted-foreground">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Email directo</p>
                    <a 
                      href="mailto:contacto@laburego.com" 
                      className="text-primary hover:underline"
                    >
                      contacto@laburego.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
