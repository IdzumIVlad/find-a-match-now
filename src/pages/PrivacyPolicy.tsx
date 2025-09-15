import React from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <>
      <SEOHead
        title="Политика конфиденциальности"
        description="Узнайте, как laburoGO собирает, использует и защищает ваши персональные данные на платформе поиска работы"
        keywords="политика конфиденциальности, защита данных, GDPR, персональные данные, laburoGO"
      />
      
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="mb-6">
            <Link to="/">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                На главную
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-foreground mb-2">Политика конфиденциальности</h1>
            <p className="text-muted-foreground">Последнее обновление: {new Date().toLocaleDateString('ru-RU')}</p>
          </div>

          <div className="prose prose-gray dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Введение</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                laburoGO серьезно относится к защите ваших персональных данных. Настоящая политика конфиденциальности 
                объясняет, как мы собираем, используем, храним и защищаем вашу информацию.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Используя наш сервис, вы соглашаетесь с практиками, описанными в данной политике конфиденциальности.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. Собираемая информация</h2>
              
              <h3 className="text-xl font-medium text-foreground mb-3">2.1 Личная информация</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">Мы собираем следующую информацию:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
                <li>Имя, фамилия и контактные данные</li>
                <li>Адрес электронной почты и номер телефона</li>
                <li>Информация о профессиональном опыте и образовании</li>
                <li>Данные резюме и портфолио</li>
                <li>Информация о компании (для работодателей)</li>
              </ul>

              <h3 className="text-xl font-medium text-foreground mb-3">2.2 Автоматически собираемые данные</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>IP-адрес и геолокация</li>
                <li>Информация о браузере и устройстве</li>
                <li>Данные о взаимодействии с платформой</li>
                <li>Файлы cookie и аналогичные технологии</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. Использование информации</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">Мы используем собранную информацию для:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Предоставления и улучшения наших услуг</li>
                <li>Сопоставления соискателей с подходящими вакансиями</li>
                <li>Обеспечения безопасности платформы</li>
                <li>Отправки уведомлений и обновлений</li>
                <li>Анализа использования сервиса</li>
                <li>Соблюдения правовых обязательств</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Передача данных третьим лицам</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Мы не продаем ваши персональные данные. Информация может быть передана третьим лицам только в следующих случаях:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>С вашего явного согласия</li>
                <li>Работодателям при подаче заявки на вакансию</li>
                <li>Поставщикам услуг, работающим от нашего имени</li>
                <li>При соблюдении правовых требований</li>
                <li>Для защиты наших прав и безопасности пользователей</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Хранение и безопасность данных</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Мы принимаем разумные меры для защиты ваших данных от несанкционированного доступа, изменения, 
                раскрытия или уничтожения:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Шифрование данных при передаче и хранении</li>
                <li>Регулярные проверки безопасности</li>
                <li>Ограниченный доступ к персональным данным</li>
                <li>Резервное копирование данных</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. Ваши права</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">У вас есть следующие права в отношении ваших данных:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Право на доступ к своим персональным данным</li>
                <li>Право на исправление неточных данных</li>
                <li>Право на удаление данных</li>
                <li>Право на ограничение обработки</li>
                <li>Право на портируемость данных</li>
                <li>Право отозвать согласие на обработку</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">7. Файлы cookie</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Мы используем файлы cookie для улучшения работы сайта, персонализации контента и анализа трафика. 
                Вы можете управлять настройками cookie в своем браузере.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Типы используемых cookie: необходимые, функциональные, аналитические и маркетинговые.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">8. Срок хранения данных</h2>
              <p className="text-muted-foreground leading-relaxed">
                Мы храним ваши персональные данные только до тех пор, пока это необходимо для целей, 
                указанных в данной политике, или в соответствии с требованиями законодательства. 
                После удаления аккаунта данные будут удалены в течение 30 дней.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">9. Изменения политики</h2>
              <p className="text-muted-foreground leading-relaxed">
                Мы можем периодически обновлять данную политику конфиденциальности. О существенных изменениях 
                мы уведомим вас по электронной почте или через уведомления на платформе.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">10. Контакты</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                По вопросам защиты персональных данных обращайтесь:
              </p>
              <ul className="list-none text-muted-foreground space-y-1">
                <li>Email: privacy@laburoGO.com</li>
                <li>Адрес: Ответственный за защиту данных laburoGO</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;