'use client';

import { use } from 'react';
import { useTranslations } from 'next-intl';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import RegisterForm from '@/components/RegisterForm/RegisterForm';
import './page.scss';

export default function RegisterPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  const t = useTranslations('Register');

  return (
    <div className="register-page">
      <Header locale={locale} />
      <main className="register-page__main">
        <div className="register-page__container">
          <div className="register-page__content">
            <div className="register-page__header">
              <h1 className="register-page__title">{t('title')}</h1>
              <p className="register-page__subtitle">{t('subtitle')}</p>
            </div>
            <RegisterForm />
          </div>
        </div>
      </main>
      <Footer locale={locale} />
    </div>
  );
}
