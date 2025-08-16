"use client";

import Image from "next/image";
import "./ListingCard.scss";
import { useRouter } from "next/navigation";

interface ListingCardProps {
  id: string;
  title: string;
  location: string;
  price: number | string;
  image: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  certified?: boolean;
  locale?: string;
  viewMode?: 'grid' | 'list';
}

export default function ListingCard({
  id,
  title,
  location,
  price,
  image,
  bedrooms,
  bathrooms,
  area,
  certified = false,
  locale = 'en',
  viewMode = 'grid',
}: ListingCardProps) {
  const router = useRouter();
  const formatPrice = (price: number | string): string => {
    if (typeof price === 'string') return price;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const redirectToDetailPage = (id: string) => {
    console.log(id);
    router.push(`/${locale}/detail/688c6e5f-7098-8333-873b-0f0703f3bf82`);
  };

  return (
    <div className="listing-card" onClick={() => redirectToDetailPage(id)}>
      <div className="listing-card__image-container">
        <Image
          src={image}
          alt={title}
          width={300}
          height={200}
          className="listing-card__image"
        />
        {certified && (
          <div className="listing-card__badge">
            <Image
              src="/icons/certified.png"
              alt="Certified"
              width={16}
              height={18}
            />
            <span>Certified</span>
          </div>
        )}
      </div>
      
      <div className="listing-card__content">
        <div className="listing-card__header">
          <h3 className="listing-card__title">{title}</h3>
          <span className="listing-card__price">{formatPrice(price)}</span>
        </div>
        
        <div className="listing-card__location">
          <Image
            src="/icons/location.png"
            alt="Location"
            width={16}
            height={16}
          />
          <span>{location}</span>
        </div>
        
        <div className="listing-card__details">
          <div className="listing-card__detail">
            <Image
              src="/icons/bath.png"
              alt="Bathrooms"
              width={16}
              height={16}
            />
            <span>{bathrooms}</span>
            <span>Bathroom</span>
          </div>
          
          <div className="listing-card__detail">
            <Image
              src="/icons/bed.png"
              alt="Bedrooms"
              width={16}
              height={16}
            />
            <span>{bedrooms}</span>
            <span>Bedroom</span>
          </div>
          
          <div className="listing-card__detail">
            <Image
              src="/icons/area.png"
              alt="Area"
              width={20}
              height={20}
            />
            <span>{area.toLocaleString()}</span>
            <span>sq ft</span>
          </div>
        </div>
      </div>
    </div>
  );
}
