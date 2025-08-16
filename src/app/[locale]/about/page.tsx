"use client";

import { use } from "react";
import Image from "next/image";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { useTranslations } from "next-intl";
import "./page.scss";

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export default function AboutPage({ params }: AboutPageProps) {
  const { locale } = use(params);
  const t = useTranslations("About");

  return (
    <>
      <Header locale={locale} />
      <main className="about">
        {/* Hero Section */}
        <section className="about__hero">
          <div className="about__hero-container">
            <h1 className="about__hero-title">{t("hero.title")}<br/>My Global Hub</h1>
            <p className="about__hero-description">{t("hero.description")}</p>
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section className="about__mission-vision">
          <div className="about__mission-vision-container">
            <div className="about__mission-vision-card">
              <h3 className="about__mission-vision-card__title">
                {t("mission.visionTitle")}
              </h3>
              <p className="about__mission-vision-card__content">
                {t("mission.vision")}
              </p>
            </div>
            <div className="about__mission-vision-card">
              <h3 className="about__mission-vision-card__title">
                {t("mission.missionTitle")}
              </h3>
              <p className="about__mission-vision-card__content">
                {t("mission.content")}
              </p>
            </div>
          </div>
        </section>

        {/* Meet the Team Section */}
        <section className="g_container about__section">
          <div className="about__container">
            <div className="about__badge">{t("meetTheTeam.title")}</div>
            <h2 className="about__title">
              Here is our Expert
              <br />
              Team Members
            </h2>

            {/* Member 1 */}
            <div className="about__card">
              <div className="about__intro">
                <div className="about__image-wrapper">
                  <Image
                    src="/images/about/founder1.png"
                    alt="Carmen M. Perez-De La Matta"
                    className="about__image"
                    width={420}
                    height={420}
                  />
                </div>
                <h3 className="about__name">{t("meetTheTeam.member1.name")}</h3>
                <p className="about__role">{t("meetTheTeam.member1.role")}</p>
              </div>
              <div className="about__content">
                <div className="about__bio">
                  <p>{t("meetTheTeam.member1.bio1")}</p>
                  <p>{t("meetTheTeam.member1.bio2")}</p>
                  <p>{t("meetTheTeam.member1.bio3")}</p>
                </div>
              </div>
            </div>

            {/* Member 2 */}
            <div className="about__card">
              <div className="about__intro">
                <div className="about__image-wrapper">
                  <Image
                    src="/images/about/founder2.png"
                    alt="Edwin Perez Montalvo"
                    className="about__image"
                    width={420}
                    height={420}
                  />
                </div>
                <h3 className="about__name">{t("meetTheTeam.member2.name")}</h3>
                <p className="about__role">{t("meetTheTeam.member2.role")}</p>
              </div>
              <div className="about__content">
                <div className="about__bio">
                  <p>{t("meetTheTeam.member2.bio1")}</p>
                  <p>{t("meetTheTeam.member2.bio2")}</p>
                  <p>{t("meetTheTeam.member2.bio3")}</p>
                </div>
              </div>
            </div>

            {/* Member 3 */}
            <div className="about__card">
              <div className="about__intro">
                <div className="about__image-wrapper">
                  <Image
                    src="/images/about/engineer.jpg"
                    alt="Andy Chen"
                    className="about__image"
                    width={420}
                    height={420}
                  />
                </div>
                <h3 className="about__name">{t("meetTheTeam.member3.name")}</h3>
                <p className="about__role">{t("meetTheTeam.member3.role")}</p>
              </div>
              <div className="about__content">
                <div className="about__bio">
                  <p>{t("meetTheTeam.member3.bio1")}</p>
                  <p>{t("meetTheTeam.member3.bio2")}</p>
                  <p>{t("meetTheTeam.member3.bio3")}</p>
                </div>
              </div>
            </div>

            {/* Member 4 */}
            <div className="about__card">
              <div className="about__intro">
                <div className="about__image-wrapper">
                  <Image
                    src="/images/about/designer.png"
                    alt="Maria Nikolava"
                    className="about__image"
                    width={420}
                    height={420}
                  />
                </div>
                <h3 className="about__name">{t("meetTheTeam.member4.name")}</h3>
                <p className="about__role">{t("meetTheTeam.member4.role")}</p>
              </div>
              <div className="about__content">
                <div className="about__bio">
                  <p>{t("meetTheTeam.member4.bio1")}</p>
                  <p>{t("meetTheTeam.member4.bio2")}</p>
                  <p>{t("meetTheTeam.member4.bio3")}</p>
                </div>
              </div>
            </div>

            {/* Member 5 */}
            <div className="about__card">
              <div className="about__intro">
                <div className="about__image-wrapper">
                  <Image
                    src="/images/about/marketing-director.jpg"
                    alt="Edgar Arguello"
                    className="about__image"
                    width={420}
                    height={420}
                  />
                </div>
                <h3 className="about__name">{t("meetTheTeam.member5.name")}</h3>
                <p className="about__role">{t("meetTheTeam.member5.role")}</p>
              </div>
              <div className="about__content">
                <div className="about__bio">
                  <p>{t("meetTheTeam.member5.bio1")}</p>
                  <p>{t("meetTheTeam.member5.bio2")}</p>
                  <p>{t("meetTheTeam.member5.bio3")}</p>
                </div>
              </div>
            </div>

            {/* Member 6 */}
            <div className="about__card">
              <div className="about__intro">
                <div className="about__image-wrapper">
                  <Image
                    src="/images/about/sales-manager.jpg"
                    alt="Maria Nikolava"
                    className="about__image"
                    width={420}
                    height={420}
                  />
                </div>
                <h3 className="about__name">{t("meetTheTeam.member6.name")}</h3>
                <p className="about__role">{t("meetTheTeam.member6.role")}</p>
              </div>
              <div className="about__content">
                <div className="about__bio">
                  <p>{t("meetTheTeam.member6.bio1")}</p>
                  <p>{t("meetTheTeam.member6.bio2")}</p>
                  <p>{t("meetTheTeam.member6.bio3")}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="about__section about__section-cta">
          <div className="g_container about__section-cta-inner-wrapper">
            <div className="about__section-cta-inner">
              <div className="about__section-cta-inner-content">
                <h2>{t("readyToGoGlobal.title")}</h2>
                <p>{t("readyToGoGlobal.content")}</p>
                <a href={`/${locale}/contact`}>
                  {t("readyToGoGlobal.cta")}
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 12L10 8L6 4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </div>
              <div className="about__section-cta-inner-image hide-lg">
                <Image 
                  src="/images/about/bg-cta.png" 
                  alt="CTA" 
                  width={560}
                  height={580}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer locale={locale} />
    </>
  );
}
