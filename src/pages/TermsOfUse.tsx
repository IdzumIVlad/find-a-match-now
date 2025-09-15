import React from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const TermsOfUse = () => {
  return (
    <>
      <SEOHead
        title="Условия использования"
        description="Ознакомьтесь с условиями использования платформы laburoGO для поиска работы и подбора персонала"
        keywords="условия использования, пользовательское соглашение, laburoGO, работа"
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
            <h1 className="text-3xl font-bold text-foreground mb-2">Условия использования</h1>
            <p className="text-muted-foreground">Последнее обновление: {new Date().toLocaleDateString('ru-RU')}</p>
          </div>

          <div className="prose prose-gray dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Общие положения</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Добро пожаловать на платформу laburoGO. Используя наш сервис, вы соглашаетесь с настоящими условиями использования. 
                Пожалуйста, внимательно ознакомьтесь с ними перед началом работы с платформой.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                laburoGO - это онлайн-платформа, которая соединяет работодателей и соискателей, предоставляя инструменты 
                для размещения вакансий, поиска работы и управления процессом найма.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. Регистрация и аккаунты</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Для использования платформы вам необходимо создать аккаунт и предоставить точную информацию о себе. 
                Вы несете ответственность за конфиденциальность своих учетных данных.
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Вы должны быть не младше 16 лет для создания аккаунта</li>
                <li>Предоставляемая информация должна быть достоверной и актуальной</li>
                <li>Запрещено создавать несколько аккаунтов для одного пользователя</li>
                <li>Вы обязуются не передавать доступ к аккаунту третьим лицам</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. Правила для соискателей</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">Соискатели обязуются:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Предоставлять точную информацию в резюме</li>
                <li>Своевременно обновлять свой профиль</li>
                <li>Вежливо общаться с работодателями</li>
                <li>Не размещать недостоверную или вводящую в заблуждение информацию</li>
                <li>Соблюдать профессиональную этику при взаимодействии</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Правила для работодателей</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">Работодатели обязуются:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Размещать только реальные вакансии</li>
                <li>Указывать достоверную информацию о компании и условиях работы</li>
                <li>Соблюдать трудовое законодательство</li>
                <li>Не допускать дискриминации при отборе кандидатов</li>
                <li>Своевременно закрывать неактуальные вакансии</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Запрещенные действия</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">На платформе запрещено:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Размещать незаконный, вредоносный или оскорбительный контент</li>
                <li>Заниматься спамом или массовой рассылкой</li>
                <li>Нарушать права интеллектуальной собственности</li>
                <li>Использовать автоматизированные системы для массовых действий</li>
                <li>Пытаться получить несанкционированный доступ к системе</li>
                <li>Размещать мошеннические предложения о работе</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. Ответственность</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                laburoGO выступает в роли посредника между работодателями и соискателями. Мы не несем ответственности за:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Достоверность информации, размещаемой пользователями</li>
                <li>Результаты трудоустройства или найма</li>
                <li>Споры между работодателями и соискателями</li>
                <li>Ущерб, возникший в результате использования платформы</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">7. Изменения условий</h2>
              <p className="text-muted-foreground leading-relaxed">
                Мы оставляем за собой право изменять настоящие условия использования. Существенные изменения будут 
                доведены до пользователей через уведомления на платформе или по электронной почте.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">8. Контакты</h2>
              <p className="text-muted-foreground leading-relaxed">
                По вопросам, связанным с условиями использования, обращайтесь по адресу: support@laburoGO.com
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default TermsOfUse;