import { NextRequest, NextResponse } from 'next/server';
import { PropertyDetailData } from '@/types/property';

// Mock property data generator
const generateMockProperty = (id: string): PropertyDetailData => {
  const properties = [
    {
      title: 'Sakoora Hill',
      type: 'House',
      description: 'Our Sakoora Hill beautiful three-bedroom home is located in a quiet residential community. This home features an open floor plan with a spacious living room, dining room, and kitchen. The master bedroom includes a walk-in closet and en-suite bathroom. The backyard offers privacy and is perfect for entertaining. With its prime location, this home offers an excellent opportunity for comfortable living.',
      location: {
        address: '123 Sakoora Hill Drive',
        city: 'San Francisco',
        state: 'CA',
        country: 'USA',
        zipCode: '94102',
        latitude: 37.7749,
        longitude: -122.4194,
        coordinates: { lat: 37.7749, lng: -122.4194 }
      },
      price: 315250,
      features: {
        bedrooms: 3,
        bathrooms: 2,
        area: 1450,
        areaUnit: 'sq ft',
        yearBuilt: 2018,
        parkingSpaces: 2,
        floors: 2
      }
    },
    {
      title: 'Modern Downtown Loft',
      type: 'Apartment',
      description: 'Stunning modern loft in the heart of downtown with floor-to-ceiling windows, exposed brick walls, and premium finishes throughout. This urban oasis features an open-concept design perfect for modern living and entertaining.',
      location: {
        address: '456 Urban Street',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        zipCode: '10001',
        latitude: 40.7128,
        longitude: -74.0060,
        coordinates: { lat: 40.7128, lng: -74.0060 }
      },
      price: 750000,
      features: {
        bedrooms: 2,
        bathrooms: 2,
        area: 1200,
        areaUnit: 'sq ft',
        yearBuilt: 2020,
        parkingSpaces: 1,
        floors: 1
      }
    },
    {
      title: 'Luxury Beachfront Villa',
      type: 'Villa',
      description: 'Exceptional beachfront villa offering panoramic ocean views and direct beach access. This architectural masterpiece features premium materials, smart home technology, and resort-style amenities including infinity pool and private dock.',
      location: {
        address: '789 Ocean Drive',
        city: 'Miami',
        state: 'FL',
        country: 'USA',
        zipCode: '33139',
        latitude: 25.7617,
        longitude: -80.1918,
        coordinates: { lat: 25.7617, lng: -80.1918 }
      },
      price: 2500000,
      features: {
        bedrooms: 5,
        bathrooms: 4,
        area: 3500,
        areaUnit: 'sq ft',
        yearBuilt: 2019,
        parkingSpaces: 3,
        floors: 2
      }
    }
  ];

  // Select property based on ID or use first one as default
  const propertyIndex = id === '688c6e5f-7098-8333-873b-0f0703f3bf82' ? 0 : 
                       id === '123e4567-e89b-12d3-a456-426614174000' ? 1 : 
                       id === '987fcdeb-51a2-43d1-9c4f-123456789abc' ? 2 : 0;
  
  const baseProperty = properties[propertyIndex];

  return {
    id,
    ...baseProperty,
    currency: 'USD',
    status: 'for-sale' as const,
    images: [
      {
        id: '1',
        url: '/images/properties/thumbnail-1.jpg',
        alt: `${baseProperty.title} - Main View`,
        isPrimary: true
      },
      {
        id: '2',
        url: '/images/properties/thumbnail-2.png',
        alt: `${baseProperty.title} - Living Room`,
      },
      {
        id: '3',
        url: '/images/properties/thumbnail-3.png',
        alt: `${baseProperty.title} - Kitchen`,
      },
      {
        id: '4',
        url: '/images/properties/thumbnail-4.png',
        alt: `${baseProperty.title} - Bedroom`,
      }
    ],
    amenities: [
      { id: '1', name: 'Swimming Pool', icon: 'pool' },
      { id: '2', name: 'Gym', icon: 'gym' },
      { id: '3', name: 'Parking', icon: 'parking' },
      { id: '4', name: 'Garden', icon: 'garden' },
      { id: '5', name: 'Balcony', icon: 'balcony' }
    ],
    agent: {
      id: 'agent-1',
      name: 'Diana Bermudez',
      avatar: '/images/agents/agent-avatar.png',
      phone: '+1 (555) 123-4567',
      email: 'diana.bermudez@myglobalhub.com',
      title: 'Senior Real Estate Agent'
    },
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    isCertified: true,
    virtualTourUrl: 'https://example.com/virtual-tour',
    floorPlanUrl: 'https://example.com/floor-plan'
  };
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, locale } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Property ID is required' },
        { status: 400 }
      );
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const property = generateMockProperty(id);

    return NextResponse.json({
      success: true,
      property,
      locale
    });

  } catch (error) {
    console.error('Error in property-detail API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
