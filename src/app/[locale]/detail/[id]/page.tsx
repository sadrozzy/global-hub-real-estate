'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import DetailSkeleton from '@/components/DetailSkeleton/DetailSkeleton';
import DetailHeader from '@/components/DetailHeader/DetailHeader';
import PropertyDetail from '@/components/PropertyDetail/PropertyDetail';
import { PropertyDetailData } from '@/types/property';
import './detail.scss';

export default function DetailPage() {
  const params = useParams();
  const t = useTranslations('DetailPage');
  const [property, setProperty] = useState<PropertyDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPropertyDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/property-detail', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: params.id,
            locale: params.locale,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch property details');
        }

        const data = await response.json();
        
        // Simulate loading delay for better UX
        setTimeout(() => {
          setProperty(data.property);
          setLoading(false);
        }, 800);
        
      } catch (err) {
        console.error('Error fetching property details:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    };

    if (params.id) {
      fetchPropertyDetail();
    }
  }, [params.id, params.locale]);

  const locale = params.locale as string;

  if (loading) {
    return (
      <div className="detail-page">
        <Header locale={locale} />
        <main className="detail-page__main">
          <DetailSkeleton />
        </main>
        <Footer locale={locale} />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="detail-page">
        <Header locale={locale} />
        <main className="detail-page__main">
          <div className="detail-error">
            <div className="detail-error__container">
              <h1>{t('error.title')}</h1>
              <p>{error || t('error.notFound')}</p>
              <button 
                onClick={() => window.history.back()}
                className="detail-error__back-btn"
              >
                {t('error.goBack')}
              </button>
            </div>
          </div>
        </main>
        <Footer locale={locale} />
      </div>
    );
  }

  return (
    <div className="detail-page">
      <Header locale={locale} />
      <main className="detail-page__main">
        <DetailHeader property={property} />
        <PropertyDetail property={property} />
      </main>
      <Footer locale={locale} />
    </div>
  );
}
