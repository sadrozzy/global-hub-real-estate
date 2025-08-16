"use client";

import { use, useState } from "react";
import Image from "next/image";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import Modal from "@/components/Modal/Modal";
import { useTranslations } from "next-intl";
import "./page.scss";

interface ContactPageProps {
  params: Promise<{ locale: string }>;
}

const icons = {
  email: "/icons/contact-email.png",
  phone: "/icons/contact-phone.png",
  address: "/icons/contact-office.png",
};

export default function ContactPage({ params }: ContactPageProps) {
  const { locale } = use(params);
  const t = useTranslations("Contact");

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    message: '',
    privacyAccepted: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modal, setModal] = useState<{
    isOpen: boolean;
    type: 'success' | 'error';
    title: string;
    message: string;
  }>({ isOpen: false, type: 'success', title: '', message: '' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
    // Clear modal when user starts typing
    if (modal.isOpen) {
      setModal(prev => ({ ...prev, isOpen: false }));
    }
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      return t('feedback.error.validation.fullNameRequired');
    }

    if (!formData.email.trim()) {
      return t('feedback.error.validation.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return t('feedback.error.validation.emailInvalid');
    }

    if (!formData.phone.trim()) {
      return t('feedback.error.validation.phoneRequired');
    }

    if (!formData.message.trim()) {
      return t('feedback.error.validation.messageRequired');
    }

    if (!formData.privacyAccepted) {
      return t('feedback.error.validation.privacyRequired');
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setModal({
        isOpen: true,
        type: 'error',
        title: t('feedback.error.title'),
        message: validationError
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          source: 'real estate'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      // Show success modal
      setModal({
        isOpen: true,
        type: 'success',
        title: t('feedback.success.title'),
        message: t('feedback.success.message')
      });
      
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        message: '',
        privacyAccepted: false
      });
    } catch (error) {
      setModal({
        isOpen: true,
        type: 'error',
        title: t('feedback.error.title'),
        message: t('feedback.error.serverError')
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header locale={locale} />
      <main className="contact">
        {/* Hero Section */}
        <section className="contact__hero">
          <div className="contact__hero-container">
            <h1 className="contact__hero-title">
              {t("hero.title")}
              <br />
              My Global Hub
            </h1>
            <p className="contact__hero-description">{t("hero.description")}</p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="contact__section">
          <div className="contact__container">
            <div className="contact__content">
              {/* Contact Form */}
              <div className="contact__form-wrapper">
                <form
                  className="contact__form"
                  onSubmit={handleSubmit}
                >
                  <div className="contact__form-group">
                    <label htmlFor="fullName">
                      {t("form.name")}
                      <span className="contact__required">*</span>
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder={t("form.namePlaceholder")}
                    />
                  </div>

                  <div className="contact__form-group">
                    <label htmlFor="email">
                      {t("form.email")}
                      <span className="contact__required">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder={t("form.emailPlaceholder")}
                    />
                  </div>

                  <div className="contact__form-group">
                    <label htmlFor="phone">
                      {t("form.phone")}
                      <span className="contact__required">*</span>
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder={t("form.phonePlaceholder")}
                    />
                  </div>

                  <div className="contact__form-group">
                    <label htmlFor="message">
                      {t("form.message")}
                      <span className="contact__required">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder={t("form.messagePlaceholder")}
                      rows={6}
                    ></textarea>
                  </div>

                  <div className="contact__form-group contact__checkbox-group">
                    <label className="contact__checkbox-label">
                      <input 
                        type="checkbox" 
                        name="privacyAccepted"
                        checked={formData.privacyAccepted}
                        onChange={handleInputChange}
                      />
                      <span className="contact__checkmark"></span>
                      {t("form.privacy")}
                    </label>
                  </div>

                  <button 
                    type="submit" 
                    className="contact__submit-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : t("form.submit")}
                  </button>
                </form>
              </div>

              <Modal
                isOpen={modal.isOpen}
                onClose={() => setModal(prev => ({ ...prev, isOpen: false }))}
                type={modal.type}
                title={modal.title}
                message={modal.message}
              />

              {/* Contact Information */}
              <div className="contact__info-wrapper">
                <div className="contact__info-item">
                  <div className="contact__info-icon">
                    <Image 
                      src={icons.email} 
                      alt="Email" 
                      width={32}
                      height={32}
                      priority
                    />
                  </div>
                  <div className="contact__info-content">
                    <h3>{t("info.email")}</h3>
                    <p>{t("info.emailDesc")}</p>
                    <a
                      href={`mailto:${t("info.emailValue")}`}
                      className="contact__info-link"
                    >
                      {t("info.emailValue")}
                    </a>
                  </div>
                </div>

                <div className="contact__info-item">
                  <div className="contact__info-icon">
                    <Image 
                      src={icons.phone} 
                      alt="Phone" 
                      width={32}
                      height={32}
                      priority
                    />
                  </div>
                  <div className="contact__info-content">
                    <h3>{t("info.phone")}</h3>
                    <p>{t("info.phoneDesc")}</p>
                    <div className="contact__phone-numbers">
                      <a
                        href={`tel:${t("info.phoneUS")}`}
                        className="contact__info-link"
                      >
                        🇺🇸 {t("info.phoneUS")}
                      </a>
                      <a
                        href={`tel:${t("info.phoneDR")}`}
                        className="contact__info-link"
                      >
                        🇩🇴 {t("info.phoneDR")}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="contact__info-item">
                  <div className="contact__info-icon">
                    <Image 
                      src={icons.address} 
                      alt="Address" 
                      width={32}
                      height={32}
                      priority
                    />
                  </div>
                  <div className="contact__info-content">
                    <h3>{t("info.office")}</h3>
                    <p>{t("info.officeDesc")}</p>
                    <address className="contact__address">
                      {t("info.addressValue")}
                    </address>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer locale={locale} />
    </>
  );
}
