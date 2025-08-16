'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import './ResetPasswordForm.scss';

interface FormData {
  newPassword: string;
  confirmPassword: string;
}

export default function ResetPasswordForm() {
  const t = useTranslations('ResetPassword');
  const locale = useLocale();
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    newPassword: '',
    confirmPassword: ''
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear password error when user starts typing
    if (passwordError) {
      setPasswordError('');
    }
  };

  const validatePasswords = () => {
    if (formData.newPassword !== formData.confirmPassword) {
      setPasswordError(t('passwordMismatch'));
      return false;
    }
    if (formData.newPassword.length < 8) {
      setPasswordError(t('passwordTooShort'));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePasswords()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // TODO: Implement actual password reset API call
      console.log('Reset password data:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // TODO: Handle successful password reset (redirect to login, show success message, etc.)
      alert(t('success'));
      router.push(`/${locale}/login`);
    } catch (error) {
      console.error('Reset password error:', error);
      alert(t('error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="reset-password-form">
      <form onSubmit={handleSubmit} className="reset-password-form__form">
        {/* New Password Field */}
        <div className="reset-password-form__field">
          <label htmlFor="newPassword" className="reset-password-form__label">
            {t('newPassword')}*
          </label>
          <div className="reset-password-form__password-wrapper">
            <input
              type={showNewPassword ? 'text' : 'password'}
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              placeholder={t('newPasswordPlaceholder')}
              className="reset-password-form__input"
              autoComplete="off"
              required
            />
            <button
              type="button"
              className="reset-password-form__password-toggle"
              onClick={() => setShowNewPassword(!showNewPassword)}
              aria-label={showNewPassword ? t('hidePassword') : t('showPassword')}
            >
              {showNewPassword ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password Field */}
        <div className="reset-password-form__field">
          <label htmlFor="confirmPassword" className="reset-password-form__label">
            {t('confirmPassword')}*
          </label>
          <div className="reset-password-form__password-wrapper">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder={t('confirmPasswordPlaceholder')}
              className="reset-password-form__input"
              autoComplete="off"
              required
            />
            <button
              type="button"
              className="reset-password-form__password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? t('hidePassword') : t('showPassword')}
            >
              {showConfirmPassword ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Password Error Message */}
        {passwordError && (
          <div className="reset-password-form__error">
            {passwordError}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="reset-password-form__submit-btn"
        >
          {isLoading ? t('saving') : t('save')}
        </button>
      </form>
    </div>
  );
}
