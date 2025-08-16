"use client";

import { use, useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import SearchHeader from "@/components/SearchHeader/SearchHeader";
import SearchFilters from "@/components/SearchFilters/SearchFilters";
import SearchResults from "@/components/SearchResults/SearchResults";
import "./search.scss";

interface SearchPageProps {
  params: Promise<{ locale: string }>;
}

export interface FilterState {
  listingType: string; // 'buy' or 'rent'
  propertyType: string[];
  priceRange: { min: number; max: number };
  bedrooms: string;
  bathrooms: string;
  area: { min: number; max: number };
  location: string;
  amenities: string[];
  sortBy: string;
}

export interface PropertyListing {
  id: string;
  title: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image: string;
  certified: boolean;
  description: string;
  amenities: string[];
  listingType: string; // 'buy' or 'rent'
}

export default function SearchPage({ params }: SearchPageProps) {
  const { locale } = use(params);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filters, setFilters] = useState<FilterState>({
    listingType: "buy",
    propertyType: [],
    priceRange: { min: 0, max: 10000000 },
    bedrooms: "any",
    bathrooms: "any",
    area: { min: 0, max: 10000 },
    location: "",
    amenities: [],
    sortBy: "relevance"
  });
  const [listings, setListings] = useState<PropertyListing[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);

  const t = useTranslations("Search");

  // Fetch listings based on search query and filters
  const fetchListings = useCallback(async (page: number = 1, resetResults: boolean = true) => {
    setLoading(true);
    setIsInitialLoad(false);
    try {
      // Simulate API call - replace with actual API endpoint
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: searchQuery,
          filters,
          page,
          limit: 12
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (resetResults) {
          setListings(data.listings);
        } else {
          setListings(prev => [...prev, ...data.listings]);
        }
        setTotalResults(data.total);
        setHasMore(data.hasMore);
        setCurrentPage(page);
      } else {
        // Fallback to mock data if API fails
        const mockData = generateMockListings();
        setListings(mockData);
        setTotalResults(mockData.length);
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
      // Fallback to mock data
      const mockData = generateMockListings();
      setListings(mockData);
      setTotalResults(mockData.length);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filters]);

  // Generate mock listings for demonstration
  const generateMockListings = (): PropertyListing[] => {
    const mockListings: PropertyListing[] = [];
    const locations = ["New York, NY", "Los Angeles, CA", "Miami, FL", "Chicago, IL", "Houston, TX"];
    const titles = ["Modern Apartment", "Luxury Villa", "Cozy House", "Penthouse Suite", "Family Home"];
    
    for (let i = 1; i <= 24; i++) {
      mockListings.push({
        id: `listing-${i}`,
        title: `${titles[i % titles.length]} ${i}`,
        location: locations[i % locations.length],
        price: Math.floor(Math.random() * 2000000) + 300000,
        bedrooms: Math.floor(Math.random() * 4) + 1,
        bathrooms: Math.floor(Math.random() * 3) + 1,
        area: Math.floor(Math.random() * 2000) + 800,
        image: "/images/listings/house.png",
        certified: Math.random() > 0.3,
        description: "Beautiful property with modern amenities and great location.",
        amenities: ["Pool", "Gym", "Parking", "Garden"].slice(0, Math.floor(Math.random() * 4) + 1),
        listingType: Math.random() > 0.5 ? 'buy' : 'rent'
      });
    }
    return mockListings;
  };

  // Handle search query changes
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
    fetchListings(1, true);
  };

  // Handle search submission
  const handleSearch = () => {
    setCurrentPage(1);
    fetchListings(1, true);
  };

  // Load more results
  const loadMore = () => {
    if (hasMore && !loading) {
      fetchListings(currentPage + 1, false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  return (
    <div className="search-page">
      <Header locale={locale} />
      
      <main className="search-page__main">
        <SearchHeader 
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onSearch={handleSearch}
          totalResults={totalResults}
          locale={locale}
        />
        
        <div className="search-page__content">
          <div className="g_container search-page__container">
            <div className="search-page__layout">
              <aside className="search-page__filters">
                <SearchFilters 
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  locale={locale}
                />
              </aside>
              
              <section className="search-page__results">
                <SearchResults 
                  listings={listings}
                  loading={loading}
                  hasMore={hasMore}
                  onLoadMore={loadMore}
                  locale={locale}
                  isInitialLoad={isInitialLoad}
                />
              </section>
            </div>
          </div>
        </div>
      </main>
      
      <Footer locale={locale} />
    </div>
  );
}