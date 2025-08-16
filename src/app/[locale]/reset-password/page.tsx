'use client';

import { use } from 'react';
import { useTranslations } from 'next-intl';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import ResetPasswordForm from '@/components/ResetPasswordForm/ResetPasswordForm';
import './page.scss';

export default function ResetPasswordPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  const t = useTranslations('ResetPassword');

  return (
    <div className="reset-password-page">
      <Header locale={locale} />
      <main className="reset-password-page__main">
        <div className="reset-password-page__container">
          <div className="reset-password-page__content">
            <div className="reset-password-page__header">
              <h1 className="reset-password-page__title">{t('title')}</h1>
              <p className="reset-password-page__subtitle">{t('subtitle')}</p>
            </div>
            <ResetPasswordForm />
          </div>
        </div>
      </main>
      <Footer locale={locale} />
    </div>
  );
}
