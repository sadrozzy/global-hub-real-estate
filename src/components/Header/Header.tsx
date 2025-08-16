"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import "./Header.scss";

interface HeaderProps {
  locale: string;
}

export default function Header({ locale }: HeaderProps) {
  const t = useTranslations("Header");
  const router = useRouter();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLanguageChange = (newLocale: string) => {
    const currentPath = pathname.replace(`/${locale}`, "");
    router.push(`/${newLocale}${currentPath}`);
    setIsLanguageDropdownOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`header ${isScrolled ? "header--scrolled" : ""}`}>
      <div className="g_container">
        <div className="header__content">
          {/* Logo */}
          <Link href={`/${locale}`} className="header__logo flex">
            <Image
              src="/icons/logo.png"
              alt="My Global Hub"
              className="header__logo-image"
              width={32}
              height={32}
            />
            <span className="header__logo-text">My Global Hub</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="header__nav hide-md">
            <Link href={`/${locale}`} className="header__nav-link">
              {t("nav.home")}
            </Link>
            <Link href={`/${locale}/search`} className="header__nav-link">
              {t("nav.properties")}
            </Link>
            <Link href={`/${locale}/about`} className="header__nav-link">
              {t("nav.about")}
            </Link>
            <Link href={`/${locale}/contact`} className="header__nav-link">
              {t("nav.contact")}
            </Link>
          </nav>

          <div className="header__buttons hide-md">
            {/* Language Switcher */}
            <div className="header__language">
              <button
                className="header__language-btn"
                onClick={() =>
                  setIsLanguageDropdownOpen(!isLanguageDropdownOpen)
                }
                aria-label={t("language")}
              >
                <span className="header__language-current">
                  {t(`languages.${locale}`)}
                </span>
                <svg
                  className={`header__language-icon ${
                    isLanguageDropdownOpen
                      ? "header__language-icon--rotated"
                      : ""
                  }`}
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 4.5L6 7.5L9 4.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {isLanguageDropdownOpen && (
                <div className="header__language-dropdown">
                  <button
                    className={`header__language-option ${
                      locale === "en" ? "header__language-option--active" : ""
                    }`}
                    onClick={() => handleLanguageChange("en")}
                  >
                    {t("languages.en")}
                  </button>
                  <button
                    className={`header__language-option ${
                      locale === "es" ? "header__language-option--active" : ""
                    }`}
                    onClick={() => handleLanguageChange("es")}
                  >
                    {t("languages.es")}
                  </button>
                </div>
              )}
            </div>

            {/* List a Property */}
            <button className="header__cta" onClick={() => router.push(`/${locale}/register`)}>
              {t("cta")}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="header__mobile-btn hide-md-show"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <span
              className={`header__mobile-icon ${
                isMobileMenuOpen ? "header__mobile-icon--open" : ""
              }`}
            ></span>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="header__mobile-nav">
            <Link
              href={`/${locale}`}
              className="header__mobile-link"
              onClick={closeMobileMenu}
            >
              {t("nav.home")}
            </Link>
            <Link
              href={`/${locale}/search`}
              className="header__mobile-link"
              onClick={closeMobileMenu}
            >
              {t("nav.properties")}
            </Link>
            <Link
              href={`/${locale}/about`}
              className="header__mobile-link"
              onClick={closeMobileMenu}
            >
              {t("nav.about")}
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="header__mobile-link"
              onClick={closeMobileMenu}
            >
              {t("nav.contact")}
            </Link>
            <Link
              href={`/en${pathname.replace(/^\/[a-z]{2}/, '')}`}
              className="header__mobile-link"
              onClick={closeMobileMenu}
            >
              {t("nav.en")}
            </Link>
            <Link
              href={`/es${pathname.replace(/^\/[a-z]{2}/, '')}`}
              className="header__mobile-link"
              onClick={closeMobileMenu}
            >
              {t("nav.es")}
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
