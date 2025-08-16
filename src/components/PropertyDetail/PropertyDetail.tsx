'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { PropertyDetailData } from '@/types/property';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import ListingCard from '@/components/ListingCard/ListingCard';
import './PropertyDetail.scss';

interface PropertyDetailProps {
  property: PropertyDetailData;
}

export default function PropertyDetail({ property }: PropertyDetailProps) {
  const t = useTranslations('DetailPage');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showAllImages, setShowAllImages] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatArea = (area: number, unit: string) => {
    return `${area.toLocaleString()} ${unit}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'for-sale':
        return 'status--for-sale';
      case 'for-rent':
        return 'status--for-rent';
      case 'sold':
        return 'status--sold';
      case 'rented':
        return 'status--rented';
      default:
        return 'status--default';
    }
  };

  const handleContactAgent = () => {
    // Handle contact agent action
    console.log('Contact agent:', property.agent.name);
  };

  const handleGetStarted = () => {
    // Handle get started action
    console.log('Get started for property:', property.id);
  };

  // Mock related properties data
  const relatedProperties = [
    {
      id: '1',
      title: 'Asri Permata',
      location: '100 High St, London, W1D 1NR',
      price: 1200,
      bedrooms: 3,
      bathrooms: 2,
      area: 1300,
      image: '/images/properties/thumbnail-1.jpg',
      certified: true
    },
    {
      id: '2',
      title: 'Modern Loft',
      location: '200 Park Ave, New York, NY 10001',
      price: 2500,
      bedrooms: 2,
      bathrooms: 2,
      area: 1100,
      image: '/images/properties/thumbnail-2.png',
      certified: true
    },
    {
      id: '3',
      title: 'Beach Villa',
      location: '300 Ocean Dr, Miami, FL 33139',
      price: 3800,
      bedrooms: 4,
      bathrooms: 3,
      area: 2200,
      image: '/images/properties/thumbnail-3.png',
      certified: true
    },
    {
      id: '4',
      title: 'Downtown Condo',
      location: '400 Main St, San Francisco, CA 94102',
      price: 1800,
      bedrooms: 2,
      bathrooms: 1,
      area: 950,
      image: '/images/properties/thumbnail-4.png',
      certified: false
    },
    {
      id: '5',
      title: 'Asri Permata',
      location: '100 High St, London, W1D 1NR',
      price: 1200,
      bedrooms: 3,
      bathrooms: 2,
      area: 1300,
      image: '/images/properties/thumbnail-5.png',
      certified: true
    },
    {
      id: '6',
      title: 'Modern Loft',
      location: '200 Park Ave, New York, NY 10001',
      price: 2500,
      bedrooms: 2,
      bathrooms: 2,
      area: 1100,
      image: '/images/properties/thumbnail-2.png',
      certified: true
    },
  ];

  const itemsPerSlide = 3;
  const maxSlides = Math.max(0, relatedProperties.length - itemsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => Math.min(prev + 1, maxSlides));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  };

  useEffect(() => {
    if (map.current) return; // initialize map only once
    
    mapboxgl.accessToken = "pk.eyJ1IjoieWFuZ2NoZW4iLCJhIjoiMmZkYTdhMjIzMTgyNjVkOGM5Njg5ZTgxODU5OGIwNjIifQ.04dQNMp8CSbFG0zziBz3lA";
    
    if (mapContainer.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [property.location.longitude, property.location.latitude],
        zoom: 15
      });

      // Add navigation controls (zoom in/out, compass)
      const nav = new mapboxgl.NavigationControl({
        showCompass: true,
        showZoom: true,
        visualizePitch: false
      });
      map.current.addControl(nav, 'top-right');

      // Add marker for the property
      new mapboxgl.Marker({
        color: '#3B82F6'
      })
        .setLngLat([property.location.longitude, property.location.latitude])
        .addTo(map.current);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [property.location.longitude, property.location.latitude]);

  return (
    <>
      <div className="property-detail">
        <div className="property-detail__container">
        {/* Property Details */}
        <div className="property-detail__details">
          <h2 className="property-detail__details-title">{t('sections.propertyDetails')}</h2>
          <div className="property-detail__details-grid">
            <div className="property-detail__detail-item">
              <span className="property-detail__detail-label">{t('details.lotSize')}</span>
              <span className="property-detail__detail-value">
                {formatArea(property.features.area, property.features.areaUnit)}
              </span>
            </div>

            <div className="property-detail__detail-item">
              <span className="property-detail__detail-label">{t('details.type')}</span>
              <span className="property-detail__detail-value">{property.type}</span>
            </div>

            <div className="property-detail__detail-item">
              <span className="property-detail__detail-label">{t('details.bedrooms')}</span>
              <span className="property-detail__detail-value">{property.features.bedrooms}</span>
            </div>

            <div className="property-detail__detail-item">
              <span className="property-detail__detail-label">{t('details.floors')}</span>
              <span className="property-detail__detail-value">{property.features.floors}</span>
            </div>

            <div className="property-detail__detail-item">
              <span className="property-detail__detail-label">{t('details.structureSize')}</span>
              <span className="property-detail__detail-value">
                {formatArea(property.features.area, property.features.areaUnit)}
              </span>
            </div>

            <div className="property-detail__detail-item">
              <span className="property-detail__detail-label">{t('details.furnished')}</span>
              <span className="property-detail__detail-value">{t('details.ground')}</span>
            </div>

            <div className="property-detail__detail-item">
              <span className="property-detail__detail-label">{t('details.bathrooms')}</span>
              <span className="property-detail__detail-value">{property.features.bathrooms}</span>
            </div>

            <div className="property-detail__detail-item">
              <span className="property-detail__detail-label">{t('details.garage')}</span>
              <span className="property-detail__detail-value">{property.features.parkingSpaces}</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="property-detail__content">
          {/* First Row - Image Gallery */}
          <div className="property-detail__gallery-row">
            <div className="property-detail__gallery">
              <div className="property-detail__main-image">
                <Image
                  src={property.images[selectedImageIndex]?.url || '/images/placeholder-property.jpg'}
                  alt={property.images[selectedImageIndex]?.alt || property.title}
                  fill
                  className="property-detail__main-image-img"
                  priority
                />
              </div>
              
              <div className="property-detail__thumbnails">
                {property.images.slice(0, 4).map((image, index) => (
                  <div
                    key={image.id}
                    className={`property-detail__thumbnail ${
                      selectedImageIndex === index ? 'property-detail__thumbnail--active' : ''
                    }`}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <Image
                      src={image.url}
                      alt={image.alt}
                      fill
                      className="property-detail__thumbnail-img"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Second Row - About (left) + Agent & Map (right) */}
          <div className="property-detail__info-row">
            {/* Left Half - About This Home */}
            <div className="property-detail__about">
              <h2 className="property-detail__about-title">{t('sections.aboutThisHome')}</h2>
              <div className="property-detail__about-content">
                <div className="property-detail__about-text">
                  <p>{property.description}</p>
                </div>
                <div className="property-detail__about-image">
                  <Image
                    src={property.images[property.images.length - 1]?.url || '/images/placeholder-property.jpg'}
                    alt="Property interior"
                    fill
                    className="property-detail__about-image-img"
                  />
                </div>
              </div>
            </div>

            {/* Right Half - Agent & Map */}
            <div className="property-detail__agent-map-section">
              {/* Agent Card */}
              <div className="property-detail__agent-card">
                <h3 className="property-detail__agent-title">{t('sections.listedByAgent')}</h3>
                <div className="property-detail__agent-info">
                  <div className="property-detail__agent-avatar">
                    <Image
                      src={property.agent.avatar}
                      alt={property.agent.name}
                      fill
                      className="property-detail__agent-avatar-img"
                    />
                  </div>
                  <div className="property-detail__agent-details">
                    <h4 className="property-detail__agent-name">{property.agent.name}</h4>
                    <p className="property-detail__agent-title-text">{property.agent.title}</p>
                  </div>
                </div>
                <button 
                  className="property-detail__contact-button"
                  onClick={handleContactAgent}
                >
                  {t('buttons.contactAgent')}
                </button>
              </div>

              {/* Map */}
              <div className="property-detail__map">
                <h3 className="property-detail__map-title">{t('sections.location')}</h3>
                <div className="property-detail__map-container">
                  <div ref={mapContainer} className="property-detail__map-box" />
                  <div className="property-detail__map-info">
                    <p className="property-detail__map-address">{property.location.address}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* Related Properties - Full Width Section */}
      <div className="property-detail__related-section">
        <div className="property-detail__related">
          <div className="property-detail__related-header">
            <div className="property-detail__related-text">
              <h2 className="property-detail__related-title">{t('sections.relatedProperties')}</h2>
              <p className="property-detail__related-subtitle">
                {t('sections.relatedSubtitle')}
              </p>
            </div>
            <div className="property-detail__related-navigation">
              <button 
                className="property-detail__nav-button property-detail__nav-button--prev"
                onClick={prevSlide}
                disabled={currentSlide === 0}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button 
                className="property-detail__nav-button property-detail__nav-button--next"
                onClick={nextSlide}
                disabled={currentSlide === maxSlides}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
          
          <div className="property-detail__related-carousel">
            <div 
              className="property-detail__related-track"
              style={{
                transform: `translateX(-${currentSlide * (100 / itemsPerSlide)}%)`,
                transition: 'transform 0.3s ease-in-out'
              }}
            >
              <div className="property-detail__related-slide">
                {relatedProperties.map((property) => (
                  <ListingCard
                    key={property.id}
                    id={property.id}
                    title={property.title}
                    location={property.location}
                    price={property.price}
                    image={property.image}
                    bedrooms={property.bedrooms}
                    bathrooms={property.bathrooms}
                    area={property.area}
                    certified={property.certified}
                    locale="en"
                    viewMode="grid"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
