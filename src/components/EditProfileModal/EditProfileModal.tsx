'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import './EditProfileModal.scss';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  agentData: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    street: string;
    state: string;
    joined: string;
    licenseNumber: string;
  };
  onSave: (data: any) => void;
}

export default function EditProfileModal({ isOpen, onClose, agentData, onSave }: EditProfileModalProps) {
  const t = useTranslations('AgentProfile');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    officePhoneNumber: '',
    emailAddress: '',
    realEstateLicenseNumber: '',
    memberOfAEI: 'Yes',
    passportNumber: '',
    personalAddress: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && agentData) {
      setFormData({
        firstName: agentData.firstName || '',
        lastName: agentData.lastName || '',
        phoneNumber: agentData.phone || '',
        officePhoneNumber: '',
        emailAddress: agentData.email || '',
        realEstateLicenseNumber: agentData.licenseNumber || '',
        memberOfAEI: 'Yes',
        passportNumber: '',
        personalAddress: agentData.street || ''
      });
    }
  }, [isOpen, agentData]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement API call to save profile data
      console.log('Saving profile data:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="edit-profile-modal__overlay" onClick={handleOverlayClick}>
      <div className="edit-profile-modal">
        {/* Header */}
        <div className="edit-profile-modal__header">
          <h2 className="edit-profile-modal__title">{t('editProfile')}</h2>
          <button 
            className="edit-profile-modal__close-btn"
            onClick={onClose}
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="edit-profile-modal__content">
          {/* Profile Image Section */}
          <div className="edit-profile-modal__image-section">
            <div className="edit-profile-modal__avatar">
              <Image
                src="/images/profiles/agent/profile.png"
                alt="Profile"
                width={60}
                height={60}
                className="edit-profile-modal__avatar-img"
              />
            </div>
            <button className="edit-profile-modal__edit-image-btn">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
              </svg>
              {t('editImage')}
            </button>
          </div>

          {/* Form Fields */}
          <div className="edit-profile-modal__form">
            {/* Name Fields */}
            <div className="edit-profile-modal__row">
              <div className="edit-profile-modal__field">
                <label className="edit-profile-modal__label">
                  {t('firstName')}*
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="edit-profile-modal__input"
                  placeholder="John"
                />
              </div>
              <div className="edit-profile-modal__field">
                <label className="edit-profile-modal__label">
                  {t('lastName')}*
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="edit-profile-modal__input"
                  placeholder="Doe"
                />
              </div>
            </div>

            {/* Phone Fields */}
            <div className="edit-profile-modal__row">
              <div className="edit-profile-modal__field">
                <label className="edit-profile-modal__label">
                  {t('phoneNumber')}*
                </label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  className="edit-profile-modal__input"
                  placeholder="+1 000 00 00"
                />
              </div>
              <div className="edit-profile-modal__field">
                <label className="edit-profile-modal__label">
                  {t('officePhoneNumber')}
                </label>
                <input
                  type="tel"
                  value={formData.officePhoneNumber}
                  onChange={(e) => handleInputChange('officePhoneNumber', e.target.value)}
                  className="edit-profile-modal__input"
                  placeholder="+1 000 00 00"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="edit-profile-modal__field edit-profile-modal__field--full">
              <label className="edit-profile-modal__label">
                {t('emailAddress')}*
              </label>
              <input
                type="email"
                value={formData.emailAddress}
                onChange={(e) => handleInputChange('emailAddress', e.target.value)}
                className="edit-profile-modal__input"
                placeholder="johndoe@icloud.com"
              />
            </div>

            {/* License Number Field */}
            <div className="edit-profile-modal__field edit-profile-modal__field--full">
              <label className="edit-profile-modal__label">
                {t('realEstateLicenseNumber')}*
              </label>
              <input
                type="text"
                value={formData.realEstateLicenseNumber}
                onChange={(e) => handleInputChange('realEstateLicenseNumber', e.target.value)}
                className="edit-profile-modal__input"
                placeholder="123456789"
              />
            </div>

            {/* Member of AEI */}
            <div className="edit-profile-modal__field edit-profile-modal__field--full">
              <label className="edit-profile-modal__label">
                {t('memberOfAEI')}*
              </label>
              <div className="edit-profile-modal__radio-group">
                <button
                  type="button"
                  className={`edit-profile-modal__radio-btn ${formData.memberOfAEI === 'Yes' ? 'edit-profile-modal__radio-btn--active' : ''}`}
                  onClick={() => handleInputChange('memberOfAEI', 'Yes')}
                >
                  {t('yes')}
                </button>
                <button
                  type="button"
                  className={`edit-profile-modal__radio-btn ${formData.memberOfAEI === 'No' ? 'edit-profile-modal__radio-btn--active' : ''}`}
                  onClick={() => handleInputChange('memberOfAEI', 'No')}
                >
                  {t('no')}
                </button>
              </div>
            </div>

            {/* Passport Number Field */}
            <div className="edit-profile-modal__field edit-profile-modal__field--full">
              <label className="edit-profile-modal__label">
                {t('passportNumberOrDominicanID')}
              </label>
              <input
                type="text"
                value={formData.passportNumber}
                onChange={(e) => handleInputChange('passportNumber', e.target.value)}
                className="edit-profile-modal__input"
                placeholder="123456789"
              />
            </div>

            {/* Personal Address Field */}
            <div className="edit-profile-modal__field edit-profile-modal__field--full">
              <label className="edit-profile-modal__label">
                {t('personalAddress')}
              </label>
              <input
                type="text"
                value={formData.personalAddress}
                onChange={(e) => handleInputChange('personalAddress', e.target.value)}
                className="edit-profile-modal__input"
                placeholder="123456789"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="edit-profile-modal__footer">
          <button
            className="edit-profile-modal__cancel-btn"
            onClick={handleCancel}
            disabled={isLoading}
          >
            {t('cancel')}
          </button>
          <button
            className="edit-profile-modal__save-btn"
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? t('saving') : t('save')}
          </button>
        </div>
      </div>
    </div>
  );
}
