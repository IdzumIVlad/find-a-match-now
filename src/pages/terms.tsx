import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEOHead from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const Terms = () => {
  const { t } = useTranslation();

  return (
    <>
      <SEOHead
        title="Términos y Condiciones de Uso"
        description="Términos y condiciones de uso de laburoGO. Conoce tus derechos y obligaciones al usar nuestra plataforma de búsqueda de empleo."
        keywords="términos y condiciones, condiciones de uso, política de uso, términos legales"
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
            <h1 className="text-3xl font-bold text-foreground mb-2">Términos y Condiciones</h1>
            <p className="text-muted-foreground">Última actualización: {new Date().toLocaleDateString('es-AR')}</p>
          </div>

          <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Aceptación de los Términos</h2>
              <p className="text-muted-foreground leading-relaxed">
                Al acceder y utilizar LaburoGO, aceptás estar vinculado por estos Términos y Condiciones, 
                nuestra Política de Privacidad y todas las leyes aplicables. Si no estás de acuerdo con alguno 
                de estos términos, no debés usar esta plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. Descripción del Servicio</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                LaburoGO es una plataforma que conecta empleadores con candidatos. Ofrecemos:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Publicación de ofertas laborales para empleadores</li>
                <li>Base de datos de currículums para búsqueda de candidatos</li>
                <li>Sistema de aplicaciones para candidatos</li>
                <li>Herramientas de gestión de aplicaciones</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. Registro y Cuentas de Usuario</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Para utilizar ciertas funciones de la plataforma, debés crear una cuenta:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Debés tener al menos 18 años para registrarte</li>
                <li>Debés proporcionar información precisa y actualizada</li>
                <li>Sos responsable de mantener la confidencialidad de tu contraseña</li>
                <li>Sos responsable de todas las actividades que ocurran bajo tu cuenta</li>
                <li>Debés notificarnos inmediatamente sobre cualquier uso no autorizado</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Tipos de Usuarios</h2>
              
              <h3 className="text-xl font-medium text-foreground mb-3 mt-6">4.1 Candidatos</h3>
              <p className="text-muted-foreground leading-relaxed mb-2">Los candidatos pueden:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li>Crear y gestionar su currículum</li>
                <li>Aplicar a ofertas laborales</li>
                <li>Ver el estado de sus aplicaciones</li>
              </ul>

              <h3 className="text-xl font-medium text-foreground mb-3">4.2 Empleadores</h3>
              <p className="text-muted-foreground leading-relaxed mb-2">Los empleadores pueden:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Publicar ofertas laborales</li>
                <li>Recibir y gestionar aplicaciones</li>
                <li>Acceder a la base de datos de currículums (según plan contratado)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Contenido del Usuario</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Al publicar contenido en LaburoGO, declarás y garantizás que:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Sos el propietario o tenés los derechos necesarios sobre el contenido</li>
                <li>El contenido es preciso y no engañoso</li>
                <li>El contenido no viola derechos de terceros</li>
                <li>El contenido no contiene material ilegal, ofensivo o inapropiado</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Nos reservamos el derecho de eliminar cualquier contenido que viole estos términos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. Conducta Prohibida</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Los usuarios no deben:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Publicar información falsa o engañosa</li>
                <li>Acosar, amenazar o discriminar a otros usuarios</li>
                <li>Utilizar la plataforma para actividades ilegales</li>
                <li>Intentar acceder a cuentas de otros usuarios</li>
                <li>Interferir con el funcionamiento de la plataforma</li>
                <li>Extraer datos mediante scraping o métodos automatizados</li>
                <li>Revender o redistribuir contenido de la plataforma</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">7. Propiedad Intelectual</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Todo el contenido de LaburoGO, incluyendo diseño, texto, gráficos, logos y código, 
                es propiedad de LaburoGO o de sus licenciantes y está protegido por las leyes de 
                propiedad intelectual aplicables.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Se te otorga una licencia limitada, no exclusiva e intransferible para usar la plataforma 
                de acuerdo con estos términos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">8. Limitación de Responsabilidad</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                LaburoGO actúa únicamente como intermediario entre empleadores y candidatos:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>No garantizamos que encuentres empleo o candidatos adecuados</li>
                <li>No somos responsables de las decisiones de contratación</li>
                <li>No verificamos la exactitud de la información publicada por usuarios</li>
                <li>No somos responsables de las relaciones laborales que surjan</li>
                <li>No garantizamos disponibilidad ininterrumpida del servicio</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">9. Terminación</h2>
              <p className="text-muted-foreground leading-relaxed">
                Podemos suspender o terminar tu acceso a la plataforma en cualquier momento, con o sin previo 
                aviso, por cualquier motivo, incluyendo violación de estos términos. Podés cancelar tu cuenta 
                en cualquier momento desde la configuración de tu perfil.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">10. Modificaciones</h2>
              <p className="text-muted-foreground leading-relaxed">
                Nos reservamos el derecho de modificar estos Términos y Condiciones en cualquier momento. 
                Los cambios significativos serán notificados a través de la plataforma o por email. 
                El uso continuado de la plataforma después de los cambios constituye tu aceptación de los nuevos términos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">11. Ley Aplicable</h2>
              <p className="text-muted-foreground leading-relaxed">
                Estos términos se rigen por las leyes de la República Argentina. Cualquier disputa será 
                resuelta en los tribunales competentes de la Ciudad Autónoma de Buenos Aires.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">12. Contacto</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Para preguntas sobre estos Términos y Condiciones:
              </p>
              <ul className="list-none text-muted-foreground space-y-2">
                <li>Email: <a href="mailto:legal@laburego.com" className="text-primary hover:underline">legal@laburego.com</a></li>
                <li>Formulario de contacto: <Link to="/contact" className="text-primary hover:underline">Contactanos</Link></li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default Terms;
