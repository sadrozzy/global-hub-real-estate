"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import "./SearchHeader.scss";

interface SearchHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearch: () => void;
  totalResults: number;
  locale: string;
}

export default function SearchHeader({
  searchQuery,
  onSearchChange,
  onSearch,
  totalResults,
  locale
}: SearchHeaderProps) {
  const t = useTranslations("Search");
  const [inputValue, setInputValue] = useState(searchQuery);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onSearchChange(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <section className="search-header">
      <div className="search-header__background">
        <div className="g_container">
          <div className="search-header__content">
            <div className="search-header__title-section">
              <div className="search-header__title-content">
                <h1 className="search-header__title">
                  {t('title', { defaultValue: 'Explore Our Property Listings' })}
                </h1>
              </div>
              <div className="search-header__description-content">
                <p className="search-header__subtitle">
                  {t('subtitle', { defaultValue: 'Discover our curated selection of properties that cater to various lifestyles and budgets. Whether you\'re searching for a modern city apartment, a cozy suburban home, or an investment property, our listings have something for everyone.' })}
                </p>
              </div>
            </div>

            <div className="search-header__search-section">
              <form className="search-header__search-form" onSubmit={handleSubmit}>
                <div className="search-header__search-wrapper">
                  <Image
                    src="/images/common/search-icon.svg"
                    alt="Search"
                    width={20}
                    height={20}
                    className="search-header__search-icon"
                  />
                  <input
                    type="text"
                    className="search-header__search-input"
                    placeholder={t('searchPlaceholder', { defaultValue: 'Search Your Dream Property...' })}
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                  />
                  <button
                    type="submit"
                    className="search-header__search-button"
                  >
                    {t('searchButton', { defaultValue: 'Search' })}
                  </button>
                </div>
              </form>

              {totalResults > 0 && (
                <div className="search-header__results-count">
                  <span>
                    ( {t('resultsFound', { 
                      count: totalResults, 
                      defaultValue: `${totalResults} properties found` 
                    })} )
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
