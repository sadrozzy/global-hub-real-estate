import { NextRequest, NextResponse } from 'next/server';

interface SearchFilters {
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

interface PropertyListing {
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

// Mock data generator with unique IDs
function generateMockListings(count: number = 24, startIndex: number = 0): PropertyListing[] {
  const mockListings: PropertyListing[] = [];
  const locations = ["New York, NY", "Los Angeles, CA", "Miami, FL", "Chicago, IL", "Houston, TX", "Seattle, WA", "Boston, MA", "Austin, TX"];
  const titles = ["Modern Apartment", "Luxury Villa", "Cozy House", "Penthouse Suite", "Family Home", "Studio Loft", "Townhouse", "Condo"];
  const amenitiesPool = ["pool", "gym", "parking", "garden", "balcony", "elevator"];
  
  for (let i = 0; i < count; i++) {
    const uniqueId = startIndex + i + 1;
    const randomAmenities = amenitiesPool
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 4) + 1);
    
    mockListings.push({
      id: `listing-${uniqueId}`,
      title: `${titles[uniqueId % titles.length]} ${uniqueId}`,
      location: locations[uniqueId % locations.length],
      price: Math.floor(Math.random() * 2000000) + 300000,
      bedrooms: Math.floor(Math.random() * 4) + 1,
      bathrooms: Math.floor(Math.random() * 3) + 1,
      area: Math.floor(Math.random() * 2000) + 800,
      image: "/images/listings/house.png",
      certified: Math.random() > 0.3,
      description: "Beautiful property with modern amenities and great location.",
      amenities: randomAmenities,
      listingType: Math.random() > 0.5 ? 'buy' : 'rent'
    });
  }
  return mockListings;
}

// Filter listings based on search criteria
function filterListings(listings: PropertyListing[], query: string, filters: SearchFilters): PropertyListing[] {
  return listings.filter(listing => {
    // Listing type filter (Buy or Rent)
    if (filters.listingType && listing.listingType !== filters.listingType) {
      return false;
    }

    // Text search
    if (query) {
      const searchText = query.toLowerCase();
      const matchesText = 
        listing.title.toLowerCase().includes(searchText) ||
        listing.location.toLowerCase().includes(searchText) ||
        listing.description.toLowerCase().includes(searchText);
      if (!matchesText) return false;
    }

    // Property type filter
    if (filters.propertyType.length > 0) {
      const listingType = listing.title.toLowerCase();
      const matchesType = filters.propertyType.some(type => 
        listingType.includes(type.toLowerCase())
      );
      if (!matchesType) return false;
    }

    // Price range filter
    if (listing.price < filters.priceRange.min || listing.price > filters.priceRange.max) {
      return false;
    }

    // Bedrooms filter
    if (filters.bedrooms !== "any") {
      const minBedrooms = parseInt(filters.bedrooms);
      if (listing.bedrooms < minBedrooms) return false;
    }

    // Bathrooms filter
    if (filters.bathrooms !== "any") {
      const minBathrooms = parseInt(filters.bathrooms);
      if (listing.bathrooms < minBathrooms) return false;
    }

    // Area filter
    if (listing.area < filters.area.min || listing.area > filters.area.max) {
      return false;
    }

    // Location filter
    if (filters.location) {
      const locationMatch = listing.location.toLowerCase().includes(filters.location.toLowerCase());
      if (!locationMatch) return false;
    }

    // Amenities filter
    if (filters.amenities.length > 0) {
      const hasAllAmenities = filters.amenities.every(amenity =>
        listing.amenities.includes(amenity)
      );
      if (!hasAllAmenities) return false;
    }

    return true;
  });
}

// Sort listings based on sort criteria
function sortListings(listings: PropertyListing[], sortBy: string): PropertyListing[] {
  const sorted = [...listings];
  
  switch (sortBy) {
    case 'price_low':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price_high':
      return sorted.sort((a, b) => b.price - a.price);
    case 'newest':
      return sorted.sort((a, b) => parseInt(b.id.split('-')[1]) - parseInt(a.id.split('-')[1]));
    case 'area_large':
      return sorted.sort((a, b) => b.area - a.area);
    case 'relevance':
    default:
      return sorted;
  }
}

// Generate a consistent set of mock listings (simulates database)
let cachedListings: PropertyListing[] | null = null;

function getAllMockListings(): PropertyListing[] {
  if (!cachedListings) {
    cachedListings = generateMockListings(100, 0);
  }
  return cachedListings;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query = '', filters, page = 1, limit = 12 } = body;

    // Get consistent mock data (simulates database query)
    const allListings = getAllMockListings();

    // Filter listings
    let filteredListings = filterListings(allListings, query, filters);

    // Sort listings
    filteredListings = sortListings(filteredListings, filters.sortBy);

    // Paginate results
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedListings = filteredListings.slice(startIndex, endIndex);

    // Calculate if there are more results
    const hasMore = endIndex < filteredListings.length;

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json({
      listings: paginatedListings,
      total: filteredListings.length,
      page,
      limit,
      hasMore,
      totalPages: Math.ceil(filteredListings.length / limit)
    });

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
