"use client";

import { use } from "react";
import { useTranslations } from "next-intl";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import Hero from "@/components/Hero/Hero";
import GlobalListings from "@/components/GlobalListings/GlobalListings";
import FAQ from "@/components/FAQ/FAQ";

export default function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  const t = useTranslations("Hero");

  return (
    <>
      <Header locale={locale} />
      <main>
        <Hero />
        <GlobalListings />
        <FAQ />
      </main>
      <Footer locale={locale} />
    </>
  );
}
