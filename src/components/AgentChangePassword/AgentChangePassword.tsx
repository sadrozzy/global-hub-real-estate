'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import './AgentChangePassword.scss';

interface AgentChangePasswordProps {
  uuid: string;
}

export default function AgentChangePassword({ uuid }: AgentChangePasswordProps) {
  const t = useTranslations('AgentProfile');
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Simulate loading time like AgentProperties
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [uuid]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = t('currentPasswordRequired');
    }

    if (!formData.newPassword) {
      newErrors.newPassword = t('newPasswordRequired');
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = t('passwordMinLength');
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t('confirmPasswordRequired');
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = t('passwordsDoNotMatch');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // TODO: Implement API call to change password
      console.log('Changing password for agent:', uuid, formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form on success
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // TODO: Show success message
      alert(t('passwordChangedSuccessfully'));
      
    } catch (error) {
      console.error('Error changing password:', error);
      // TODO: Show error message
      alert(t('passwordChangeError'));
    } finally {
      setIsLoading(false);
    }
  };

  if (isInitialLoading) {
    return (
      <div className="agent-change-password">
        <div className="agent-change-password__loading">
          <div className="agent-change-password__loading-spinner"></div>
          <p>{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="agent-change-password">
      <div className="agent-change-password__container">
        <div className="agent-change-password__form">
          {/* Current Password Field */}
          <div className="agent-change-password__field">
            <label className="agent-change-password__label">
              {t('currentPassword')}*
            </label>
            <div className="agent-change-password__input-container">
              <input
                type={showPasswords.current ? 'text' : 'password'}
                value={formData.currentPassword}
                onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                className={`agent-change-password__input ${errors.currentPassword ? 'agent-change-password__input--error' : ''}`}
                placeholder="••••••••••"
              />
              <button
                type="button"
                className="agent-change-password__toggle-btn"
                onClick={() => togglePasswordVisibility('current')}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  {showPasswords.current ? (
                    <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                  ) : (
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                  )}
                </svg>
              </button>
            </div>
            {errors.currentPassword && (
              <span className="agent-change-password__error">{errors.currentPassword}</span>
            )}
          </div>

          {/* New Password Field */}
          <div className="agent-change-password__field">
            <label className="agent-change-password__label">
              {t('newPassword')}*
            </label>
            <div className="agent-change-password__input-container">
              <input
                type={showPasswords.new ? 'text' : 'password'}
                value={formData.newPassword}
                onChange={(e) => handleInputChange('newPassword', e.target.value)}
                className={`agent-change-password__input ${errors.newPassword ? 'agent-change-password__input--error' : ''}`}
                placeholder="••••••••••"
              />
              <button
                type="button"
                className="agent-change-password__toggle-btn"
                onClick={() => togglePasswordVisibility('new')}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  {showPasswords.new ? (
                    <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                  ) : (
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                  )}
                </svg>
              </button>
            </div>
            {errors.newPassword && (
              <span className="agent-change-password__error">{errors.newPassword}</span>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="agent-change-password__field">
            <label className="agent-change-password__label">
              {t('confirmPassword')}*
            </label>
            <div className="agent-change-password__input-container">
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className={`agent-change-password__input ${errors.confirmPassword ? 'agent-change-password__input--error' : ''}`}
                placeholder="••••••••••"
              />
              <button
                type="button"
                className="agent-change-password__toggle-btn"
                onClick={() => togglePasswordVisibility('confirm')}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  {showPasswords.confirm ? (
                    <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                  ) : (
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                  )}
                </svg>
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="agent-change-password__error">{errors.confirmPassword}</span>
            )}
          </div>

          {/* Save Button */}
          <div className="agent-change-password__actions">
            <button
              className="agent-change-password__save-btn"
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? t('saving') : t('save')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
