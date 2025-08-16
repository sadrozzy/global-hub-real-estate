"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { FilterState } from "@/app/[locale]/search/page";
import "./SearchFilters.scss";

interface SearchFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  locale: string;
}

export default function SearchFilters({
  filters,
  onFilterChange,
  locale
}: SearchFiltersProps) {
  const t = useTranslations("Search");
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterUpdate = (key: keyof FilterState, value: any) => {
    const updatedFilters = { ...localFilters, [key]: value };
    setLocalFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handlePropertyTypeChange = (type: string) => {
    const currentTypes = localFilters.propertyType;
    const updatedTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
    handleFilterUpdate('propertyType', updatedTypes);
  };

  const handleAmenityChange = (amenity: string) => {
    const currentAmenities = localFilters.amenities;
    const updatedAmenities = currentAmenities.includes(amenity)
      ? currentAmenities.filter(a => a !== amenity)
      : [...currentAmenities, amenity];
    handleFilterUpdate('amenities', updatedAmenities);
  };

  const clearAllFilters = () => {
    const clearedFilters: FilterState = {
      listingType: "buy",
      propertyType: [],
      priceRange: { min: 0, max: 10000000 },
      bedrooms: "any",
      bathrooms: "any",
      area: { min: 0, max: 10000 },
      location: "",
      amenities: [],
      sortBy: "relevance"
    };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const propertyTypes = [
    { value: "apartment", label: t('propertyTypes.apartment', { defaultValue: 'Apartment' }) },
    { value: "house", label: t('propertyTypes.house', { defaultValue: 'House' }) },
    { value: "villa", label: t('propertyTypes.villa', { defaultValue: 'Villa' }) },
    { value: "condo", label: t('propertyTypes.condo', { defaultValue: 'Condo' }) },
    { value: "townhouse", label: t('propertyTypes.townhouse', { defaultValue: 'Townhouse' }) }
  ];

  const amenitiesList = [
    { value: "pool", label: t('amenitiesList.pool', { defaultValue: 'Swimming Pool' }) },
    { value: "gym", label: t('amenitiesList.gym', { defaultValue: 'Gym' }) },
    { value: "parking", label: t('amenitiesList.parking', { defaultValue: 'Parking' }) },
    { value: "garden", label: t('amenitiesList.garden', { defaultValue: 'Garden' }) },
    { value: "balcony", label: t('amenitiesList.balcony', { defaultValue: 'Balcony' }) },
    { value: "elevator", label: t('amenitiesList.elevator', { defaultValue: 'Elevator' }) }
  ];

  const bedroomOptions = [
    { value: "any", label: t('any', { defaultValue: 'Any' }) },
    { value: "1", label: "1+" },
    { value: "2", label: "2+" },
    { value: "3", label: "3+" },
    { value: "4", label: "4+" },
    { value: "5", label: "5+" }
  ];

  const bathroomOptions = [
    { value: "any", label: t('any', { defaultValue: 'Any' }) },
    { value: "1", label: "1+" },
    { value: "2", label: "2+" },
    { value: "3", label: "3+" },
    { value: "4", label: "4+" }
  ];

  const sortOptions = [
    { value: "relevance", label: t('sortByOptions.relevance', { defaultValue: 'Relevance' }) },
    { value: "price_low", label: t('sortByOptions.priceLow', { defaultValue: 'Price: Low to High' }) },
    { value: "price_high", label: t('sortByOptions.priceHigh', { defaultValue: 'Price: High to Low' }) },
    { value: "newest", label: t('sortByOptions.newest', { defaultValue: 'Newest' }) },
    { value: "area_large", label: t('sortByOptions.areaLarge', { defaultValue: 'Largest Area' }) }
  ];

  return (
    <div className="search-filters">
      <div className="search-filters__header">
        <h3 className="search-filters__title">
          {t('filtersTitle', { defaultValue: 'Filters' })}
        </h3>
        <div className="search-filters__actions">
          <button
            className="search-filters__clear"
            onClick={clearAllFilters}
          >
            {t('clearAll', { defaultValue: 'Clear All' })}
          </button>
        </div>
      </div>

      <div className="search-filters__content">
        {/* Listing Type - Buy or Rent */}
        <div className="search-filters__group">
          <h4 className="search-filters__group-title">
            {t('listingType', { defaultValue: 'Listing Type' })}
          </h4>
          <div className="search-filters__toggle-group">
            <button
              type="button"
              className={`search-filters__toggle ${localFilters.listingType === 'buy' ? 'active' : ''}`}
              onClick={() => handleFilterUpdate('listingType', 'buy')}
            >
              {t('buy', { defaultValue: 'Buy' })}
            </button>
            <button
              type="button"
              className={`search-filters__toggle ${localFilters.listingType === 'rent' ? 'active' : ''}`}
              onClick={() => handleFilterUpdate('listingType', 'rent')}
            >
              {t('rent', { defaultValue: 'Rent' })}
            </button>
          </div>
        </div>

        {/* Property Type */}
        <div className="search-filters__group">
          <h4 className="search-filters__group-title">
            {t('propertyType', { defaultValue: 'Property Type' })}
          </h4>
          <div className="search-filters__checkboxes">
            {propertyTypes.map((type) => (
              <label key={type.value} className="search-filters__checkbox">
                <input
                  type="checkbox"
                  checked={localFilters.propertyType.includes(type.value)}
                  onChange={() => handlePropertyTypeChange(type.value)}
                />
                <span className="search-filters__checkbox-mark"></span>
                {type.label}
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="search-filters__group">
          <h4 className="search-filters__group-title">
            {t('priceRange', { defaultValue: 'Price Range' })}
          </h4>
          <div className="search-filters__range">
            <div className="search-filters__range-inputs">
              <input
                type="number"
                placeholder={t('minPrice', { defaultValue: 'Min Price' })}
                value={localFilters.priceRange.min || ''}
                onChange={(e) => handleFilterUpdate('priceRange', {
                  ...localFilters.priceRange,
                  min: parseInt(e.target.value) || 0
                })}
                className="search-filters__range-input"
              />
              <input
                type="number"
                placeholder={t('maxPrice', { defaultValue: 'Max Price' })}
                value={localFilters.priceRange.max === 10000000 ? '' : localFilters.priceRange.max}
                onChange={(e) => handleFilterUpdate('priceRange', {
                  ...localFilters.priceRange,
                  max: parseInt(e.target.value) || 10000000
                })}
                className="search-filters__range-input"
              />
            </div>
          </div>
        </div>

        {/* Bedrooms */}
        <div className="search-filters__group">
          <h4 className="search-filters__group-title">
            {t('bedrooms', { defaultValue: 'Bedrooms' })}
          </h4>
          <div className="search-filters__buttons">
            {bedroomOptions.map((option) => (
              <button
                key={option.value}
                className={`search-filters__button ${
                  localFilters.bedrooms === option.value ? 'active' : ''
                }`}
                onClick={() => handleFilterUpdate('bedrooms', option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bathrooms */}
        <div className="search-filters__group">
          <h4 className="search-filters__group-title">
            {t('bathrooms', { defaultValue: 'Bathrooms' })}
          </h4>
          <div className="search-filters__buttons">
            {bathroomOptions.map((option) => (
              <button
                key={option.value}
                className={`search-filters__button ${
                  localFilters.bathrooms === option.value ? 'active' : ''
                }`}
                onClick={() => handleFilterUpdate('bathrooms', option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Area */}
        <div className="search-filters__group">
          <h4 className="search-filters__group-title">
            {t('area', { defaultValue: 'Area (sq ft)' })}
          </h4>
          <div className="search-filters__range">
            <div className="search-filters__range-inputs">
              <input
                type="number"
                placeholder={t('minArea', { defaultValue: 'Min Area' })}
                value={localFilters.area.min || ''}
                onChange={(e) => handleFilterUpdate('area', {
                  ...localFilters.area,
                  min: parseInt(e.target.value) || 0
                })}
                className="search-filters__range-input"
              />
              <input
                type="number"
                placeholder={t('maxArea', { defaultValue: 'Max Area' })}
                value={localFilters.area.max === 10000 ? '' : localFilters.area.max}
                onChange={(e) => handleFilterUpdate('area', {
                  ...localFilters.area,
                  max: parseInt(e.target.value) || 10000
                })}
                className="search-filters__range-input"
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="search-filters__group">
          <h4 className="search-filters__group-title">
            {t('location', { defaultValue: 'Location' })}
          </h4>
          <input
            type="text"
            placeholder={t('locationPlaceholder', { defaultValue: 'Enter city or neighborhood' })}
            value={localFilters.location}
            onChange={(e) => handleFilterUpdate('location', e.target.value)}
            className="search-filters__text-input"
          />
        </div>

        {/* Amenities */}
        <div className="search-filters__group">
          <h4 className="search-filters__group-title">
            {t('amenities', { defaultValue: 'Amenities' })}
          </h4>
          <div className="search-filters__checkboxes">
            {amenitiesList.map((amenity) => (
              <label key={amenity.value} className="search-filters__checkbox">
                <input
                  type="checkbox"
                  checked={localFilters.amenities.includes(amenity.value)}
                  onChange={() => handleAmenityChange(amenity.value)}
                />
                <span className="search-filters__checkbox-mark"></span>
                {amenity.label}
              </label>
            ))}
          </div>
        </div>

        {/* Sort By */}
        <div className="search-filters__group">
          <h4 className="search-filters__group-title">
            {t('sortBy', { defaultValue: 'Sort By' })}
          </h4>
          <select
            value={localFilters.sortBy}
            onChange={(e) => handleFilterUpdate('sortBy', e.target.value)}
            className="search-filters__select"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
