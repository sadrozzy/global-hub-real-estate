export interface PropertyImage {
  id: string;
  url: string;
  alt: string;
  isPrimary?: boolean;
}

export interface PropertyAgent {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  email: string;
  title: string;
}

export interface PropertyFeature {
  id: string;
  name: string;
  icon: string;
}

export interface PropertyLocation {
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  latitude: number;
  longitude: number;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface PropertyDetailData {
  id: string;
  title: string;
  price: number;
  currency: string;
  type: string;
  status: 'for-sale' | 'for-rent' | 'sold' | 'rented';
  location: PropertyLocation;
  images: PropertyImage[];
  description: string;
  features: {
    bedrooms: number;
    bathrooms: number;
    area: number;
    areaUnit: string;
    yearBuilt: number;
    parkingSpaces: number;
    floors: number;
  };
  amenities: PropertyFeature[];
  agent: PropertyAgent;
  createdAt: string;
  updatedAt: string;
  isCertified: boolean;
  virtualTourUrl?: string;
  floorPlanUrl?: string;
}

export interface PropertyListingData {
  id: string;
  title: string;
  price: number;
  currency: string;
  location: string;
  image: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  areaUnit: string;
  type: string;
  isCertified: boolean;
}
