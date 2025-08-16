"use client";

import React from "react";
import "./Footer.scss";
import { useTranslations } from 'next-intl';
import Image from "next/image";

interface FooterProps {
  locale: string;
}

export default function Footer({ locale }: FooterProps) {
  const t = useTranslations("Footer");

  const socialLinks = [
    {
      name: "linkedin",
      icon: "/icons/linkedin.png",
      url: "#"
    },
    {
      name: "twitter", 
      icon: "/icons/twitter.png",
      url: "#"
    },
    {
      name: "instagram",
      icon: "/icons/instagram.png",
      url: "#"
    },
    {
      name: "facebook",
      icon: "/icons/facebook.png",
      url: "#"
    }
  ];

  return (
    <footer className="footer">
      <div className="g_container footer__container">
        {/* Main Footer Content */}
        <div className="footer__main">
          {/* Brand Section */}
          <div className="footer__brand">
            <div className="footer__logo">
              <Image
                src="/icons/logo.png"
                alt="My Global Hub"
                width={32}
                height={32}
              />
              <span className="footer__logo-text">My Global Hub</span>
            </div>
            <p className="footer__description">
              {t('description')}
            </p>
            <div className="footer__social">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  className="footer__social-link"
                  aria-label={t(`social.${social.name}`)}
                >
                  <span className="footer__social-icon flex items-center justify-center">
                    <Image
                      src={social.icon}
                      alt={t(`social.${social.name}`)}
                      width={24}
                      height={24}
                    />
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Sections */}
          <div className="footer__nav">
            {/* Company Section */}
            <div className="footer__nav-section">
              <h3 className="footer__nav-title">{t('sections.company.title')}</h3>
              <ul className="footer__nav-list">
                {t.raw('sections.company.links').map((link: string, index: number) => (
                  <li key={index}>
                    <a href="#" className="footer__nav-link">{link}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services Section */}
            <div className="footer__nav-section footer__nav-section--wide">
              <h3 className="footer__nav-title">{t('sections.services.title')}</h3>
              <div className="footer__services-grid">
                <ul className="footer__nav-list">
                  {t.raw('sections.services.links').slice(0, 7).map((link: string, index: number) => (
                    <li key={index}>
                      <a href="#" className="footer__nav-link">{link}</a>
                    </li>
                  ))}
                </ul>
                <ul className="footer__nav-list">
                  {t.raw('sections.services.links').slice(7).map((link: string, index: number) => (
                    <li key={index + 7}>
                      <a href="#" className="footer__nav-link">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Support Section */}
            <div className="footer__nav-section">
              <h3 className="footer__nav-title">{t('sections.support.title')}</h3>
              <ul className="footer__nav-list">
                {t.raw('sections.support.links').map((link: string, index: number) => (
                  <li key={index}>
                    <a href="#" className="footer__nav-link">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="footer__bottom">
          <div className="footer__bottom-content">
            <p className="footer__copyright">
              {t('copyright')}
            </p>
            <div className="footer__legal">
              <a href="#" className="footer__legal-link">{t('legal.terms')}</a>
              <span className="footer__legal-separator">•</span>
              <a href="#" className="footer__legal-link">{t('legal.privacy')}</a>
              <span className="footer__legal-separator">•</span>
              <a href="#" className="footer__legal-link">{t('legal.cookies')}</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 