'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import './ListPropertyModal.scss';

interface ListPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  // Step 1: Basic Information
  listingTitle: string;
  propertyType: string;
  listingType: string;
  price: string;
  priceType: string;
  currency: string;
}

const TOTAL_STEPS = 7;

export default function ListPropertyModal({ isOpen, onClose }: ListPropertyModalProps) {
  const t = useTranslations('ListProperty');
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    listingTitle: '',
    propertyType: 'house',
    listingType: 'for-sale',
    price: '',
    priceType: 'monthly',
    currency: 'USD'
  });

  const stepTitles = [
    t('basicInformation'),
    t('locationDetails'),
    t('propertyDetails'),
    t('featuresAmenities'),
    t('mediaUpload'),
    t('descriptionNotes'),
    t('contactInformation')
  ];

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleClose = () => {
    setCurrentStep(1);
    setFormData({
      listingTitle: '',
      propertyType: 'house',
      listingType: 'for-sale',
      price: '',
      priceType: 'monthly',
      currency: 'USD'
    });
    onClose();
  };

  if (!isOpen) return null;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="list-property-modal__step-content">
            {/* Listing Title */}
            <div className="list-property-modal__field">
              <label className="list-property-modal__label">
                {t('listingTitle')}*
              </label>
              <input
                type="text"
                className="list-property-modal__input"
                placeholder={t('listingTitlePlaceholder')}
                value={formData.listingTitle}
                onChange={(e) => handleInputChange('listingTitle', e.target.value)}
              />
            </div>

            {/* Property Type */}
            <div className="list-property-modal__field">
              <label className="list-property-modal__label">
                {t('propertyType')}*
              </label>
              <div className="list-property-modal__button-group">
                {['house', 'apartment', 'villa', 'land', 'commercial', 'industrial'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    className={`list-property-modal__option-btn ${
                      formData.propertyType === type ? 'list-property-modal__option-btn--active' : ''
                    }`}
                    onClick={() => handleInputChange('propertyType', type)}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      {type === 'house' && (
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                      )}
                      {type === 'apartment' && (
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      )}
                      {type === 'villa' && (
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                      )}
                      {type === 'land' && (
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                      )}
                      {type === 'commercial' && (
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      )}
                      {type === 'industrial' && (
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      )}
                    </svg>
                    {t(type)}
                  </button>
                ))}
                <button
                  type="button"
                  className={`list-property-modal__option-btn ${
                    !['house', 'apartment', 'villa', 'land', 'commercial', 'industrial'].includes(formData.propertyType) 
                      ? 'list-property-modal__option-btn--active' : ''
                  }`}
                  onClick={() => handleInputChange('propertyType', 'others')}
                >
                  {t('others')}
                </button>
              </div>
            </div>

            {/* Listing Type */}
            <div className="list-property-modal__field">
              <label className="list-property-modal__label">
                {t('listingType')}*
              </label>
              <div className="list-property-modal__button-group">
                <button
                  type="button"
                  className={`list-property-modal__option-btn ${
                    formData.listingType === 'for-sale' ? 'list-property-modal__option-btn--active' : ''
                  }`}
                  onClick={() => handleInputChange('listingType', 'for-sale')}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 2L2 7v10c0 5.55 3.84 10 9 10s9-4.45 9-10V7l-10-5z"/>
                    <path d="M12 22s8-4 8-10V7l-8-5-8 5v5c0 6 8 10 8 10z"/>
                  </svg>
                  {t('forSale')}
                </button>
                <button
                  type="button"
                  className={`list-property-modal__option-btn ${
                    formData.listingType === 'for-rent' ? 'list-property-modal__option-btn--active' : ''
                  }`}
                  onClick={() => handleInputChange('listingType', 'for-rent')}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <path d="M9 22V12h6v10"/>
                  </svg>
                  {t('forRent')}
                </button>
              </div>
            </div>

            {/* Price */}
            <div className="list-property-modal__field">
              <label className="list-property-modal__label">
                {t('price')}*
              </label>
              <div className="list-property-modal__price-group">
                <input
                  type="text"
                  className="list-property-modal__input list-property-modal__input--price"
                  placeholder={t('enterPrice')}
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                />
                <select
                  className="list-property-modal__select"
                  value={formData.priceType}
                  onChange={(e) => handleInputChange('priceType', e.target.value)}
                >
                  <option value="monthly">{t('monthly')}</option>
                  <option value="yearly">{t('yearly')}</option>
                  <option value="total">{t('total')}</option>
                </select>
                <select
                  className="list-property-modal__select"
                  value={formData.currency}
                  onChange={(e) => handleInputChange('currency', e.target.value)}
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="CAD">CAD</option>
                </select>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="list-property-modal__step-content">
            <div className="list-property-modal__placeholder">
              <h3>{stepTitles[currentStep - 1]}</h3>
              <p>{t('stepComingSoon')}</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="list-property-modal">
      <div className="list-property-modal__overlay" onClick={handleClose} />
      <div className="list-property-modal__container">
        {/* Header */}
        <div className="list-property-modal__header">
          <h2 className="list-property-modal__title">{t('listYourProperty')}</h2>
          <button
            className="list-property-modal__close-btn"
            onClick={handleClose}
            type="button"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Step Indicator */}
        <div className="list-property-modal__steps">
          <div className="list-property-modal__steps-header">
            <span className="list-property-modal__steps-label">{t('description')}</span>
          </div>
          <div className="list-property-modal__steps-list">
            {stepTitles.map((title, index) => (
              <div
                key={index}
                className={`list-property-modal__step ${
                  index + 1 === currentStep ? 'list-property-modal__step--active' : ''
                } ${
                  index + 1 < currentStep ? 'list-property-modal__step--completed' : ''
                }`}
              >
                <div className="list-property-modal__step-number">
                  {index + 1 < currentStep ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <polyline points="20,6 9,17 4,12"></polyline>
                    </svg>
                  ) : (
                    String(index + 1).padStart(2, '0')
                  )}
                </div>
                <div className="list-property-modal__step-title">{title}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="list-property-modal__content">
          {renderStepContent()}
        </div>

        {/* Footer */}
        <div className="list-property-modal__footer">
          <button
            type="button"
            className="list-property-modal__btn list-property-modal__btn--secondary"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            {t('previous')}
          </button>
          <button
            type="button"
            className="list-property-modal__btn list-property-modal__btn--primary"
            onClick={handleNext}
          >
            {currentStep === TOTAL_STEPS ? t('submit') : t('next')}
          </button>
        </div>
      </div>
    </div>
  );
}
