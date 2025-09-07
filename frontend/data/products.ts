export interface Product {
  id: number;
  name: string;
  price: {
    usd: number;
    khr: number;
  };
  image: string;
  description: string;
  category: string;
  tags: string[];
  sizes: string[];
  images: string[];
  colors?: string[];
  originalPrice?: {
    usd: number;
    khr: number;
  };
  rating?: number;
  reviews?: number;
  material: string;
  care: string[];
  details: string;
  stock?: number;
}

export const products: Product[] = [
  {
    id: 1,
    name: 'Signature Collection Handbag',
    price: {
      usd: 2850,
      khr: 11685000
    },
    image: 'https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg',
    description: 'Handcrafted excellence with premium materials and timeless design.',
    category: 'Bags',
    tags: ['New', 'Popular'],
    sizes: ['One Size'],
    images: [
      'https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg',
      'https://images.pexels.com/photos/2866077/pexels-photo-2866077.jpeg',
      'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg'
    ],
    material: 'Italian Leather, Gold Hardware',
    care: ['Store in dust bag', 'Avoid direct sunlight', 'Clean with leather conditioner'],
    details: 'This exquisite handbag represents the pinnacle of luxury craftsmanship. Each piece is meticulously handcrafted by master artisans using the finest Italian leather and premium gold hardware. The timeless design ensures this piece will remain a cherished part of your collection for years to come.',
    stock: 15
  },
  {
    id: 2,
    name: 'Limited Edition Watch',
    price: {
      usd: 4200,
      khr: 17220000
    },
    image: 'https://images.pexels.com/photos/2866077/pexels-photo-2866077.jpeg',
    description: 'Exclusive design for discerning collectors with Swiss movement.',
    category: 'Accessories',
    tags: ['Limited Edition', 'Bestseller'],
    sizes: ['38mm', '42mm'],
    images: [
      'https://images.pexels.com/photos/2866077/pexels-photo-2866077.jpeg',
      'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg',
      'https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg'
    ],
    material: 'Stainless Steel, Sapphire Crystal',
    care: ['Water resistant to 100m', 'Service every 3-5 years', 'Avoid magnetic fields'],
    details: 'A masterpiece of horological engineering, this limited edition timepiece features a Swiss automatic movement and is crafted from the finest materials. Only 500 pieces will ever be made, making this a truly exclusive addition to any collection.',
    stock: 8
  },
  {
    id: 3,
    name: 'Heritage Series Coat',
    price: {
      usd: 3650,
      khr: 14965000
    },
    image: 'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg',
    description: 'Timeless appeal with modern sophistication and premium wool.',
    category: 'Clothing',
    tags: ['Popular', 'Sustainable'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [
      'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg',
      'https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg',
      'https://images.pexels.com/photos/2866077/pexels-photo-2866077.jpeg'
    ],
    material: '100% Merino Wool, Silk Lining',
    care: ['Dry clean only', 'Store on padded hangers', 'Brush regularly'],
    details: 'This heritage coat combines traditional tailoring techniques with contemporary design. Made from the finest merino wool and lined with pure silk, it offers both luxury and functionality for the modern wardrobe.',
    stock: 22
  },
  {
    id: 4,
    name: 'Artisan Jewelry Set',
    price: {
      usd: 1850,
      khr: 7585000
    },
    image: 'https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg',
    description: 'Handcrafted precious metals with ethically sourced gemstones.',
    category: 'Jewelry',
    tags: ['New', 'Sustainable'],
    sizes: ['One Size'],
    images: [
      'https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg',
      'https://images.pexels.com/photos/2866077/pexels-photo-2866077.jpeg',
      'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg'
    ],
    material: '18K Gold, Ethically Sourced Diamonds',
    care: ['Store separately', 'Clean with soft cloth', 'Professional cleaning recommended'],
    details: 'Each piece in this collection is individually crafted by skilled artisans using traditional techniques passed down through generations. The ethically sourced gemstones and recycled precious metals reflect our commitment to sustainable luxury.',
    stock: 12
  },
  {
    id: 5,
    name: 'Designer Silk Scarf',
    price: {
      usd: 450,
      khr: 1845000
    },
    image: 'https://images.pexels.com/photos/2866077/pexels-photo-2866077.jpeg',
    description: 'Hand-painted silk with exclusive artistic patterns.',
    category: 'Accessories',
    tags: ['New', 'Popular'],
    sizes: ['90cm x 90cm'],
    images: [
      'https://images.pexels.com/photos/2866077/pexels-photo-2866077.jpeg',
      'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg',
      'https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg'
    ],
    material: '100% Mulberry Silk',
    care: ['Hand wash in cold water', 'Air dry flat', 'Iron on low heat'],
    details: 'This exquisite silk scarf features hand-painted designs created by renowned artists. Each piece is unique, making it a perfect statement accessory for any sophisticated wardrobe.',
    stock: 35
  },
  {
    id: 6,
    name: 'Luxury Home Candle Set',
    price: {
      usd: 280,
      khr: 1148000
    },
    image: 'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg',
    description: 'Premium soy wax candles with custom fragrance blends.',
    category: 'Home',
    tags: ['Bestseller', 'Sustainable'],
    sizes: ['Set of 3'],
    images: [
      'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg',
      'https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg',
      'https://images.pexels.com/photos/2866077/pexels-photo-2866077.jpeg'
    ],
    material: 'Soy Wax, Cotton Wicks, Glass Vessels',
    care: ['Trim wick before each use', 'Burn for maximum 4 hours', 'Keep away from drafts'],
    details: 'Transform your space with these luxury candles featuring custom-blended fragrances. Made from sustainable soy wax and housed in elegant glass vessels that can be repurposed after use.',
    stock: 28
  }
];