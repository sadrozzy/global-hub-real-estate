"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState, useEffect, useRef, useCallback } from "react";
import "./Hero.scss";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Hero() {
  const t = useTranslations("Hero");
  const router = useRouter();
  const locale = useLocale();
  
  // Hero images array
  const heroImages = [
    "/images/heros/home-hero-1.jpg",
    "/images/heros/home-hero-2.jpg",
    "/images/heros/home-hero-3.jpg"
  ];

  const heroThumbnails = [
    "/images/heros/home-hero-thumb-1.png",
    "/images/heros/home-hero-thumb-2.png",
    "/images/heros/home-hero-thumb-3.png"
  ];
  
  // State to track currently selected image (default to first image)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  // Ref to store the interval ID for cleanup
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Function to start the auto-cycling timer
  const startAutoTimer = useCallback(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Start new interval
    intervalRef.current = setInterval(() => {
      setSelectedImageIndex((prevIndex) => 
        (prevIndex + 1) % heroImages.length
      );
    }, 5000); // 5 seconds
  }, [heroImages.length]); // Include heroImages.length as dependency
  
  // Handler for decoration card clicks
  const handleDecorationClick = (index: number) => {
    setSelectedImageIndex(index);
    // Reset the timer when user manually clicks
    startAutoTimer();
  };
  
  // Effect to start auto-cycling on component mount
  useEffect(() => {
    startAutoTimer();
    
    // Cleanup interval on component unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [startAutoTimer]); // Include startAutoTimer as dependency

  return (
    <section id="hero" className="g_section_wrap hero">
      <div className="g_container hero__container">
        <div className="hero__content">
          <div className="hero__text">
            <div className="hero__text__icon">
              <Image
                src="/images/common/award.png"
                alt="mghir-award"
                width={16}
                height={16}
                loading="eager"
                priority
              />
            </div>
            <h2 className="hero__text__title">{t("poweredBy")}</h2>
          </div>
          <div className="hero__title">
            <h1>{t("title")}</h1>
          </div>
          <button className="hero__cta" onClick={() => router.push(`/${locale}/register`)}>
            {t("cta")}
          </button>
        </div>
        <div className="hero__decoration hide-md">
          {heroThumbnails.map((imageSrc, index) => (
            <div 
              key={index}
              className={`hero__decoration__square hero__decoration__square--${index + 1} ${
                selectedImageIndex === index ? 'hero__decoration__square--active' : ''
              }`}
              onClick={() => handleDecorationClick(index)}
            >
              <Image
                src={imageSrc}
                alt={`hero decoration ${index + 1}`}
                width={196}
                height={140}
                style={{ width: "100%", height: "100%" }}
                loading="eager"
                priority
              />
            </div>
          ))}
        </div>
      </div>
      <div className="hero__bg" style={{ backgroundImage: `url("${heroImages[selectedImageIndex]}")` }}></div>
    </section>
  );
}
