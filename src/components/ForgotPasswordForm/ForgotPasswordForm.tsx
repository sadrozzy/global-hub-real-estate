'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import './ForgotPasswordForm.scss';

interface FormData {
  email: string;
}

export default function ForgotPasswordForm() {
  const t = useTranslations('ForgotPassword');
  const locale = useLocale();
  const [formData, setFormData] = useState<FormData>({
    email: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // TODO: Implement actual forgot password API call
      console.log('Forgot password data:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // TODO: Handle successful password reset request (show success message, redirect, etc.)
      alert(t('success'));
    } catch (error) {
      console.error('Forgot password error:', error);
      alert(t('error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-password-form">
      <form onSubmit={handleSubmit} className="forgot-password-form__form">
        {/* Email Field */}
        <div className="forgot-password-form__field">
          <label htmlFor="email" className="forgot-password-form__label">
            {t('email')}*
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder={t('emailPlaceholder')}
            className="forgot-password-form__input"
            autoComplete="off"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="forgot-password-form__submit-btn"
        >
          {isLoading ? t('confirming') : t('confirm')}
        </button>

        {/* Back Link */}
        <div className="forgot-password-form__back-link">
          <Link href={`/${locale}/login`} className="forgot-password-form__link">
            {t('back')}
          </Link>
        </div>
      </form>
    </div>
  );
}
