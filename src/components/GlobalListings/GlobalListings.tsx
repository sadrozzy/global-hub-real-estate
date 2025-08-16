"use client";

import { useCallback, useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import ListingCard from "../ListingCard/ListingCard";
import "./GlobalListings.scss";

// API Response interface
interface APIListing {
  listing_id: string;
  title: string;
  listing_type: string;
  rental_term: string | null;
  property_type: string;
  price: string;
  price_unit: string | null;
  currency: string;
  bedrooms: number | null;
  bathrooms: number;
  area: number;
  year_built: number;
  orientation: string;
  ownership_type: string;
  floor: string;
  furnished: boolean;
  certified: boolean;
  available_from: string;
  description: string;
  neighborhood_highlights: string[];
  agent_notes: string;
  agent_id: string | null;
  created_at: string;
  updated_at: string;
  // Address fields
  country: string;
  state_province: string;
  city: string;
  address: string;
  zipcode: string;
  latitude: number;
  longitude: number;
}

// Transformed listing interface for ListingCard
interface TransformedListing {
  id: string;
  title: string;
  location: string;
  price: string;
  image: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  certified: boolean;
}

export default function GlobalListings() {
  const t = useTranslations("GlobalListings");
  const locale = useLocale();
  const router = useRouter();
  const [listings, setListings] = useState<TransformedListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Transform API data to match ListingCard props
  const transformListing = useCallback((apiListing: APIListing): TransformedListing => {
    // Format price based on listing type and currency
    let formattedPrice = "";
    const price = parseFloat(apiListing.price);
    
    if (apiListing.listing_type === "rent") {
      if (apiListing.rental_term === "daily") {
        formattedPrice = `$${price.toLocaleString()}`;
      } else if (apiListing.rental_term === "monthly") {
        formattedPrice = `$${price.toLocaleString()}`;
      } else if (apiListing.rental_term === "yearly") {
        formattedPrice = `$${price.toLocaleString()}`;
      } else {
        formattedPrice = `$${price.toLocaleString()}`;
      }
    } else {
      formattedPrice = `$${price.toLocaleString()}`;
    }

    // Generate location from address and city
    const location = apiListing.address && apiListing.city 
      ? `${apiListing.address}, ${apiListing.city}`
      : "Premium Location";

    // Use a placeholder image based on property type
    const getImageForPropertyType = (propertyType: string): string => {
      // TODO: Add these image resources for property types
      const imageMap: { [key: string]: string } = {
        apartment: "/images/listings/apartment.jpg",
        house: "/images/listings/house.png",
        villa: "/images/listings/villa.jpg",
        condo: "/images/listings/condo.jpg",
        townhouse: "/images/listings/townhouse.jpg",
        commercial: "/images/listings/commercial.jpg"
      };
      return "/images/listings/house.png";
    };

    return {
      id: apiListing.listing_id,
      title: apiListing.title,
      location,
      price: formattedPrice,
      image: getImageForPropertyType(apiListing.property_type),
      bedrooms: apiListing.bedrooms || 0,
      bathrooms: apiListing.bathrooms,
      area: apiListing.area,
      certified: apiListing.certified
    };
  }, []); // No dependencies needed as the function is pure

  // Fetch listings from API with retry logic
  const fetchListings = useCallback(async (attempt: number = 1) => {
    try {
      setLoading(true); // Show loading skeleton for all attempts
      setError(null);
      
      const response = await fetch('https://service.mghirealty.com/api/getAllHotListings');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: APIListing[] = await response.json();
      
      // Transform and limit to 9 listings for the global listings section
      const transformedListings = data
        .slice(0, 9)
        .map(transformListing);
      
      setListings(transformedListings);
      setRetryCount(0); // Reset retry count on success
      setLoading(false);
    } catch (err) {
      console.log(`Error fetching listings (attempt ${attempt}):`, err);
      
      // Retry up to 3 times with exponential backoff
      if (attempt < 3) {
        const delay = Math.pow(2, attempt - 1) * 1000; // 1s, 2s, 4s delays
        console.log(`Retrying in ${delay}ms... (attempt ${attempt + 1}/3)`);
        
        setTimeout(() => {
          setRetryCount(attempt);
          fetchListings(attempt + 1);
        }, delay);
      } else {
        // All retries failed
        setError(err instanceof Error ? err.message : 'Failed to fetch listings');
        setRetryCount(attempt);
        setLoading(false);
      }
    }
  }, [transformListing]); // Include transformListing in dependencies

  // Manual retry function
  const handleRetry = () => {
    setRetryCount(0);
    fetchListings(1);
  };

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const handleViewMoreClick = () => {
    router.push(`/${locale}/search`);
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="global-listings__skeleton">
      {Array.from({ length: 9 }).map((_, index) => (
        <div key={index} className="global-listings__skeleton-card">
          <div className="global-listings__skeleton-image"></div>
          <div className="global-listings__skeleton-content">
            <div className="global-listings__skeleton-title"></div>
            <div className="global-listings__skeleton-location"></div>
            <div className="global-listings__skeleton-price"></div>
            <div className="global-listings__skeleton-details">
              <div className="global-listings__skeleton-detail"></div>
              <div className="global-listings__skeleton-detail"></div>
              <div className="global-listings__skeleton-detail"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Error state component with retry button
  const ErrorState = () => (
    <div className="global-listings__error">
      <h3 className="global-listings__error-title">Failed to load listings</h3>
      <p className="global-listings__error-description">
        We tried {retryCount} times but couldn't load the latest properties. 
        Please check your connection and try again.
      </p>
      <button 
        className="global-listings__retry-button"
        onClick={handleRetry}
        disabled={loading}
      >
        {loading ? "Retrying..." : "Try Again"}
      </button>
    </div>
  );

  return (
    <section id="listings" className="g_section_wrap global-listings">
      <div className="g_container global-listings__container">
        <div className="global-listings__header">
          <h2 className="global-listings__title">{t("title")}</h2>
          <p className="global-listings__description">{t("description")}</p>
        </div>
        
        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <ErrorState />
        ) : (
          <>
            <div className="global-listings__grid">
              {listings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  id={listing.id}
                  title={listing.title}
                  location={listing.location}
                  price={listing.price}
                  image={listing.image}
                  bedrooms={listing.bedrooms}
                  bathrooms={listing.bathrooms}
                  area={listing.area}
                  certified={listing.certified}
                />
              ))}
            </div>
            
            <div className="global-listings__footer">
              <button className="global-listings__view-more" onClick={handleViewMoreClick}>
                {t("viewMore")}
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
