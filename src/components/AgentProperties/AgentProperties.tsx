'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import './AgentProperties.scss';

interface Property {
  id: string;
  title: string;
  address: string;
  price: string;
  image: string;
  status: 'approved' | 'pending' | 'rejected';
}

interface AgentPropertiesProps {
  uuid: string;
}

export default function AgentProperties({ uuid }: AgentPropertiesProps) {
  const t = useTranslations('AgentProfile');
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch agent properties
    const fetchProperties = async () => {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock data - in real app, this would come from API
      const mockProperties: Property[] = [
        {
          id: '1',
          title: 'Asri Permata',
          address: '100 High St, London, W1D 1NR',
          price: '$1,200',
          image: '/images/listings/house.png',
          status: 'approved'
        },
        {
          id: '2',
          title: 'Asri Permata',
          address: '100 High St, London, W1D 1NR',
          price: '$1,200',
          image: '/images/listings/house.png',
          status: 'pending'
        },
        {
          id: '3',
          title: 'Asri Permata',
          address: '100 High St, London, W1D 1NR',
          price: '$1,200',
          image: '/images/listings/house.png',
          status: 'rejected'
        },
        {
          id: '4',
          title: 'Asri Permata',
          address: '100 High St, London, W1D 1NR',
          price: '$1,200',
          image: '/images/listings/house.png',
          status: 'approved'
        },
        {
          id: '5',
          title: 'Asri Permata',
          address: '100 High St, London, W1D 1NR',
          price: '$1,200',
          image: '/images/listings/house.png',
          status: 'approved'
        },
        {
          id: '6',
          title: 'Asri Permata',
          address: '100 High St, London, W1D 1NR',
          price: '$1,200',
          image: '/images/listings/house.png',
          status: 'approved'
        }
      ];
      
      setProperties(mockProperties);
      setIsLoading(false);
    };

    fetchProperties();
  }, [uuid]);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved':
        return t('approved');
      case 'pending':
        return t('pending');
      case 'rejected':
        return t('rejected');
      default:
        return status;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'approved':
        return 'approved';
      case 'pending':
        return 'pending';
      case 'rejected':
        return 'rejected';
      default:
        return '';
    }
  };

  const handleEdit = (propertyId: string) => {
    // TODO: Navigate to property edit page or open edit modal
    console.log('Edit property:', propertyId);
  };

  if (isLoading) {
    return (
      <div className="agent-properties">
        <div className="agent-properties__loading">
          <div className="agent-properties__loading-spinner"></div>
          <p>{t('loadingProperties')}</p>
        </div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="agent-properties">
        <div className="agent-properties__empty">
          <p>{t('noProperties')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="agent-properties">
      <div className="agent-properties__container">
        <div className="agent-properties__grid">
          {properties.map((property) => (
            <div key={property.id} className="agent-properties__card">
              <div className="agent-properties__image-container">
                <Image
                  src={property.image}
                  alt={property.title}
                  fill
                  className="agent-properties__image"
                />
              </div>
              <div className="agent-properties__header">
                <span className={`agent-properties__status agent-properties__status--${getStatusClass(property.status)}`}>
                  {getStatusLabel(property.status)}
                </span>
                <button 
                  className="agent-properties__edit-btn"
                  onClick={() => handleEdit(property.id)}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                  </svg>
                  {t('edit')}
                </button>
              </div>
              <div className="agent-properties__content">
                <h3 className="agent-properties__title">{property.title}</h3>
                <div className="agent-properties__address">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  <span>{property.address}</span>
                </div>
                <div className="agent-properties__price">{property.price}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
