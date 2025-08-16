"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { PropertyListing } from "@/app/[locale]/search/page";
import ListingCard from "@/components/ListingCard/ListingCard";
import "./SearchResults.scss";

interface SearchResultsProps {
  listings: PropertyListing[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  locale: string;
  isInitialLoad?: boolean;
}

export default function SearchResults({
  listings,
  loading,
  hasMore,
  onLoadMore,
  locale,
  isInitialLoad = false
}: SearchResultsProps) {
  const t = useTranslations("Search");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const LoadingSkeleton = () => (
    <div className="search-results__skeleton">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="search-results__skeleton-card">
          <div className="search-results__skeleton-image"></div>
          <div className="search-results__skeleton-content">
            <div className="search-results__skeleton-title"></div>
            <div className="search-results__skeleton-location"></div>
            <div className="search-results__skeleton-price"></div>
            <div className="search-results__skeleton-details">
              <div className="search-results__skeleton-detail"></div>
              <div className="search-results__skeleton-detail"></div>
              <div className="search-results__skeleton-detail"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const InitialState = () => (
    <div className="search-results__initial">
      <div className="search-results__initial-icon">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="40" cy="40" r="35" fill="#F3F4F6" stroke="#E5E7EB" strokeWidth="2"/>
          <path d="M25 35h30M25 40h30M25 45h25" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="60" cy="20" r="8" fill="#3B82F6"/>
          <path d="M57 17l6 6M63 17l-6 6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
      <h3 className="search-results__initial-title">
        {t('searchToStart', { defaultValue: 'Start your property search' })}
      </h3>
      <p className="search-results__initial-description">
        {t('searchToStartDescription', { 
          defaultValue: 'Use the search bar or filters to find your perfect property.' 
        })}
      </p>
    </div>
  );

  const EmptyState = () => (
    <div className="search-results__empty">
      <div className="search-results__empty-icon">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="40" cy="40" r="35" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2"/>
          <path d="M25 35h30M25 40h30M25 45h25" stroke="#D97706" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="60" cy="20" r="8" fill="#F59E0B"/>
          <path d="M56 16l8 8M64 16l-8 8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
      <h3 className="search-results__empty-title">
        {t('noResults', { defaultValue: 'No properties found' })}
      </h3>
      <p className="search-results__empty-description">
        {t('noResultsDescription', { 
          defaultValue: 'Try adjusting your search criteria or filters to find more properties.' 
        })}
      </p>
    </div>
  );

  if (loading && listings.length === 0) {
    return (
      <div className="search-results">
        <LoadingSkeleton />
      </div>
    );
  }

  if (!loading && listings.length === 0) {
    return (
      <div className="search-results">
        {isInitialLoad ? <InitialState /> : <EmptyState />}
      </div>
    );
  }

  return (
    <div className="search-results">
      <div className="search-results__header">
        <div className="search-results__info">
          <span className="search-results__count">
            {t('showingResults', { 
              count: listings.length, 
              defaultValue: `Showing ${listings.length} properties` 
            })}
          </span>
        </div>
        
        <div className="search-results__controls">
          <div className="search-results__view-toggle">
            <button
              className={`search-results__view-button ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title={t('gridView', { defaultValue: 'Grid View' })}
            >
              <Image
                src="/images/common/grid-icon.svg"
                alt="Grid view"
                width={18}
                height={18}
              />
            </button>
            <button
              className={`search-results__view-button ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title={t('listView', { defaultValue: 'List View' })}
            >
              <Image
                src="/images/common/list-icon.svg"
                alt="List view"
                width={18}
                height={18}
              />
            </button>
          </div>
        </div>
      </div>

      <div className={`search-results__grid ${viewMode === 'list' ? 'list-view' : ''}`}>
        {listings.map((listing) => (
          <div key={listing.id} className="search-results__item">
            <ListingCard
              id={listing.id}
              title={listing.title}
              location={listing.location}
              price={listing.price}
              bedrooms={listing.bedrooms}
              bathrooms={listing.bathrooms}
              area={listing.area}
              image={listing.image}
              certified={listing.certified}
              locale={locale}
              viewMode={viewMode}
            />
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="search-results__load-more">
          <button
            className="search-results__load-more-button"
            onClick={onLoadMore}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="search-results__spinner"></div>
                {t('loading', { defaultValue: 'Loading...' })}
              </>
            ) : (
              t('loadMore', { defaultValue: 'Load More Properties' })
            )}
          </button>
        </div>
      )}

      {loading && listings.length > 0 && (
        <div className="search-results__loading-overlay">
          <div className="search-results__spinner"></div>
        </div>
      )}
    </div>
  );
}
