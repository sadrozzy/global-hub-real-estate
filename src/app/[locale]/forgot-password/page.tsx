'use client';

import { use } from 'react';
import { useTranslations } from 'next-intl';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import ForgotPasswordForm from '@/components/ForgotPasswordForm/ForgotPasswordForm';
import './page.scss';

export default function ForgotPasswordPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  const t = useTranslations('ForgotPassword');

  return (
    <div className="forgot-password-page">
      <Header locale={locale} />
      <main className="forgot-password-page__main">
        <div className="forgot-password-page__container">
          <div className="forgot-password-page__content">
            <div className="forgot-password-page__header">
              <h1 className="forgot-password-page__title">{t('title')}</h1>
              <p className="forgot-password-page__subtitle">{t('subtitle')}</p>
            </div>
            <ForgotPasswordForm />
          </div>
        </div>
      </main>
      <Footer locale={locale} />
    </div>
  );
}
