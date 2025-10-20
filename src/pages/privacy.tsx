import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEOHead from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const Privacy = () => {
  const { t } = useTranslation();

  return (
    <>
      <SEOHead 
        title="Política de Privacidad"
        description="Conoce cómo protegemos tu información personal en laburoGO. Política de privacidad, tratamiento de datos y derechos del usuario."
        keywords="política de privacidad, protección de datos, GDPR, privacidad online"
        type="article"
      />
      
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="mb-6">
            <Link to="/">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('common.home')}
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-foreground mb-2">Política de Privacidad</h1>
            <p className="text-muted-foreground">Última actualización: {new Date().toLocaleDateString('es-AR')}</p>
          </div>

          <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Información que Recopilamos</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                LaburoGO recopila información personal cuando te registrás y usás nuestra plataforma:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Datos de contacto: nombre completo, email y teléfono</li>
                <li>Información profesional: currículum, experiencia laboral y educación</li>
                <li>Datos de empresas: nombre, descripción y sitio web (para empleadores)</li>
                <li>Información técnica: dirección IP, navegador y dispositivo</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. Uso de la Información</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Utilizamos tu información para:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Facilitar la búsqueda de empleo y reclutamiento</li>
                <li>Procesar aplicaciones a ofertas laborales</li>
                <li>Mejorar nuestros servicios y la experiencia del usuario</li>
                <li>Comunicarte novedades y actualizaciones importantes</li>
                <li>Garantizar la seguridad de la plataforma</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. Compartir Información</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Tu información puede ser compartida en las siguientes circunstancias:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Con empleadores cuando aplicás a sus ofertas laborales</li>
                <li>Con proveedores de servicios que nos ayudan a operar la plataforma</li>
                <li>Cuando sea requerido por ley o autoridades competentes</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Nunca vendemos tu información personal a terceros.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Cookies y Tecnologías Similares</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Utilizamos cookies y tecnologías similares para:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Mantener tu sesión activa cuando navegás la plataforma</li>
                <li>Recordar tus preferencias de idioma y tema</li>
                <li>Analizar el uso del sitio y mejorar el rendimiento</li>
                <li>Prevenir fraude y garantizar la seguridad</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Podés gestionar las cookies desde la configuración de tu navegador, aunque algunas funcionalidades 
                pueden verse afectadas si las desactivás completamente.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Analytics</h2>
              <p className="text-muted-foreground leading-relaxed">
                Utilizamos herramientas de análisis para comprender cómo se usa nuestra plataforma. 
                Esta información nos ayuda a mejorar la experiencia del usuario y optimizar nuestros servicios. 
                Los datos recopilados son anónimos y agregados.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. Seguridad de los Datos</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Implementamos medidas de seguridad técnicas y organizativas para proteger tu información:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Encriptación de datos sensibles en tránsito y almacenamiento</li>
                <li>Acceso restringido a información personal solo para personal autorizado</li>
                <li>Auditorías regulares de seguridad</li>
                <li>Copias de seguridad periódicas</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">7. Tus Derechos</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                De acuerdo con las leyes de protección de datos aplicables en Argentina, tenés derecho a:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Acceder a tus datos personales</li>
                <li>Rectificar información inexacta o incompleta</li>
                <li>Solicitar la eliminación de tus datos</li>
                <li>Oponerte al procesamiento de tus datos</li>
                <li>Solicitar la portabilidad de tus datos</li>
                <li>Retirar el consentimiento en cualquier momento</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Para ejercer estos derechos, podés contactarnos en privacy@laburego.com
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">8. Retención de Datos</h2>
              <p className="text-muted-foreground leading-relaxed">
                Conservamos tu información personal solo mientras sea necesario para los fines descritos en esta 
                política o según lo requiera la ley. Cuando eliminás tu cuenta, tu información personal es 
                eliminada de forma segura, excepto lo que debamos conservar por requisitos legales.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">9. Cambios a esta Política</h2>
              <p className="text-muted-foreground leading-relaxed">
                Podemos actualizar esta Política de Privacidad ocasionalmente. Te notificaremos sobre cambios 
                significativos mediante email o mediante un aviso destacado en nuestra plataforma. La fecha de 
                "última actualización" al inicio del documento indica cuándo se realizó la última modificación.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">10. Contacto</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Si tenés preguntas sobre esta Política de Privacidad o sobre cómo manejamos tus datos, podés contactarnos:
              </p>
              <ul className="list-none text-muted-foreground space-y-2">
                <li>Email: <a href="mailto:privacy@laburego.com" className="text-primary hover:underline">privacy@laburego.com</a></li>
                <li>Formulario de contacto: <Link to="/contact" className="text-primary hover:underline">Contactanos</Link></li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default Privacy;
