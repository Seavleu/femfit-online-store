import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Cambodian women's products mockup data
const femfitProducts = [
  {
    name: 'Khmer Traditional Silk Dress',
    description: 'Elegant traditional Cambodian silk dress perfect for special occasions. Handwoven by local artisans with intricate patterns.',
    price: 125.00,
    stock_quantity: 15,
    category: 'clothes',
    subcategory: 'traditional',
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&h=800&fit=crop'
    ],
    primary_image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=800&fit=crop',
    tags: ['traditional', 'silk', 'handmade', 'occasion'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Royal Blue', 'Emerald Green', 'Gold', 'Deep Red'],
    material: '100% Cambodian Silk',
    care_instructions: ['Dry clean only', 'Store in cool, dry place', 'Avoid direct sunlight'],
    details: {
      origin: 'Phnom Penh',
      artisan: 'Local weaver cooperative',
      pattern: 'Traditional Khmer motifs'
    },
    is_active: true,
    featured: true
  },
  {
    name: 'Modern Cambodian Casual Blouse',
    description: 'Contemporary blouse inspired by Cambodian designs, perfect for daily wear. Breathable cotton blend for tropical climate.',
    price: 45.00,
    stock_quantity: 32,
    category: 'clothes',
    subcategory: 'casual',
    images: [
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1571513722275-4b9cde74e5ac?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1583496661160-fb5886a13804?w=800&h=800&fit=crop'
    ],
    primary_image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=800&fit=crop',
    tags: ['casual', 'comfortable', 'modern', 'everyday'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['White', 'Light Pink', 'Soft Blue', 'Mint Green'],
    material: '60% Cotton, 40% Polyester',
    care_instructions: ['Machine wash cold', 'Tumble dry low', 'Iron on medium heat'],
    details: {
      fit: 'Relaxed',
      neckline: 'Round neck',
      sleeves: '3/4 length'
    },
    is_active: true,
    featured: false
  },
  {
    name: 'Lotus Blossom Handbag',
    description: 'Handcrafted leather handbag featuring lotus blossom design - symbol of purity in Cambodian culture. Perfect size for daily essentials.',
    price: 89.00,
    stock_quantity: 18,
    category: 'accessories',
    subcategory: 'bags',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800&h=800&fit=crop'
    ],
    primary_image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop',
    tags: ['handcrafted', 'leather', 'lotus', 'cultural'],
    sizes: ['One Size'],
    colors: ['Brown', 'Black', 'Tan'],
    material: 'Genuine Leather',
    care_instructions: ['Wipe with damp cloth', 'Use leather conditioner monthly', 'Store in dust bag'],
    details: {
      dimensions: '30cm x 25cm x 12cm',
      closure: 'Magnetic snap',
      pockets: 'Interior zip pocket, phone pocket'
    },
    is_active: true,
    featured: true
  },
  {
    name: 'Tropical Jasmine Perfume',
    description: 'Enchanting fragrance inspired by Cambodian jasmine flowers. Fresh, floral scent perfect for the tropical climate.',
    price: 65.00,
    stock_quantity: 25,
    category: 'perfume',
    subcategory: 'floral',
    images: [
      'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1582046709077-3c921fcc76dd?w=800&h=800&fit=crop'
    ],
    primary_image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&h=800&fit=crop',
    tags: ['jasmine', 'floral', 'tropical', 'long-lasting'],
    sizes: ['30ml', '50ml', '100ml'],
    colors: ['Clear'],
    material: 'Eau de Parfum',
    care_instructions: ['Store in cool place', 'Avoid direct sunlight', 'Do not shake'],
    details: {
      notes: 'Top: Jasmine, Middle: White flowers, Base: Sandalwood',
      longevity: '6-8 hours',
      sillage: 'Moderate'
    },
    is_active: true,
    featured: true
  },
  {
    name: 'Natural Khmer Beauty Face Cream',
    description: 'Moisturizing face cream made with traditional Cambodian herbs and modern skincare technology. Suitable for tropical skin.',
    price: 35.00,
    stock_quantity: 40,
    category: 'cosmetic',
    subcategory: 'skincare',
    images: [
      'https://images.unsplash.com/photo-1570554886111-e80fcac6c51b?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&h=800&fit=crop'
    ],
    primary_image: 'https://images.unsplash.com/photo-1570554886111-e80fcac6c51b?w=800&h=800&fit=crop',
    tags: ['natural', 'moisturizing', 'traditional', 'tropical'],
    sizes: ['30ml', '50ml'],
    colors: ['Cream'],
    material: 'Natural ingredients',
    care_instructions: ['Store below 25°C', 'Close tightly after use', 'Use within 12 months'],
    details: {
      skin_type: 'All skin types',
      key_ingredients: 'Turmeric, Coconut oil, Aloe vera',
      spf: 'SPF 15'
    },
    is_active: true,
    featured: false
  },
  {
    name: 'Cambodian Rose Lipstick',
    description: 'Long-lasting lipstick in shades inspired by Cambodian roses. Moisturizing formula perfect for humid climate.',
    price: 28.00,
    stock_quantity: 55,
    category: 'cosmetic',
    subcategory: 'makeup',
    images: [
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1631214524020-6b95b78ff4c5?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1588614492695-82263c0b3d1e?w=800&h=800&fit=crop'
    ],
    primary_image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&h=800&fit=crop',
    tags: ['long-lasting', 'moisturizing', 'rose', 'humid-climate'],
    sizes: ['3.5g'],
    colors: ['Rose Pink', 'Deep Rose', 'Coral Pink', 'Berry Rose'],
    material: 'Mineral-based formula',
    care_instructions: ['Store in cool place', 'Cap tightly', 'Use within 24 months'],
    details: {
      finish: 'Satin',
      coverage: 'Full coverage',
      wear_time: '6-8 hours'
    },
    is_active: true,
    featured: true
  },
  {
    name: 'Organic Cotton Intimate Wear Set',
    description: 'Comfortable and breathable intimate wear made from organic cotton. Designed for tropical climate comfort.',
    price: 42.00,
    stock_quantity: 28,
    category: 'sanitary',
    subcategory: 'intimate',
    images: [
      'https://images.unsplash.com/photo-1594736797933-d0d8b19c2d5f?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1619451334792-150b72495ccc?w=800&h=800&fit=crop'
    ],
    primary_image: 'https://images.unsplash.com/photo-1594736797933-d0d8b19c2d5f?w=800&h=800&fit=crop',
    tags: ['organic', 'cotton', 'comfortable', 'breathable'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['White', 'Nude', 'Light Pink'],
    material: '100% Organic Cotton',
    care_instructions: ['Machine wash cold', 'Gentle cycle', 'Air dry'],
    details: {
      set_includes: 'Bra and underwear',
      certifications: 'GOTS certified organic',
      features: 'Seamless design, tagless'
    },
    is_active: true,
    featured: false
  },
  {
    name: 'Bamboo Fiber Hair Accessories Set',
    description: 'Eco-friendly hair accessories made from sustainable bamboo fiber. Gentle on hair and environmentally conscious.',
    price: 22.00,
    stock_quantity: 45,
    category: 'accessories',
    subcategory: 'hair',
    images: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1614542542975-1b7f6d2d1ff6?w=800&h=800&fit=crop'
    ],
    primary_image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&h=800&fit=crop',
    tags: ['bamboo', 'eco-friendly', 'sustainable', 'hair-care'],
    sizes: ['One Size'],
    colors: ['Natural Bamboo', 'Light Brown'],
    material: 'Bamboo Fiber',
    care_instructions: ['Hand wash with mild soap', 'Air dry completely', 'Store in dry place'],
    details: {
      set_includes: 'Hair ties, headband, comb',
      sustainability: 'Biodegradable, renewable resource',
      texture: 'Smooth, anti-static'
    },
    is_active: true,
    featured: false
  },
  {
    name: 'Angkor Wat Inspired Jewelry Set',
    description: 'Elegant jewelry set inspired by the architectural beauty of Angkor Wat. Sterling silver with traditional motifs.',
    price: 156.00,
    stock_quantity: 12,
    category: 'accessories',
    subcategory: 'jewelry',
    images: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=800&fit=crop'
    ],
    primary_image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop',
    tags: ['sterling-silver', 'traditional', 'angkor', 'heritage'],
    sizes: ['One Size'],
    colors: ['Silver', 'Silver with Gold Accent'],
    material: '925 Sterling Silver',
    care_instructions: ['Clean with silver cloth', 'Store in jewelry box', 'Avoid contact with chemicals'],
    details: {
      set_includes: 'Necklace, earrings, bracelet',
      motifs: 'Angkor Wat temple patterns',
      chain_length: '18 inches (adjustable)'
    },
    is_active: true,
    featured: true
  },
  {
    name: 'Mekong Sunset Scarf',
    description: 'Lightweight silk scarf with gradient colors inspired by Mekong River sunsets. Perfect accessory for any outfit.',
    price: 58.00,
    stock_quantity: 22,
    category: 'accessories',
    subcategory: 'scarves',
    images: [
      'https://images.unsplash.com/photo-1591451658019-89e396a1a1ac?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1549062572-544a64fb0c56?w=800&h=800&fit=crop'
    ],
    primary_image: 'https://images.unsplash.com/photo-1591451658019-89e396a1a1ac?w=800&h=800&fit=crop',
    tags: ['silk', 'gradient', 'mekong', 'sunset'],
    sizes: ['90cm x 90cm'],
    colors: ['Orange Sunset', 'Purple Twilight', 'Pink Dawn'],
    material: '100% Mulberry Silk',
    care_instructions: ['Hand wash in cold water', 'Do not wring', 'Iron on low heat'],
    details: {
      pattern: 'Gradient sunset colors',
      texture: 'Smooth silk finish',
      versatility: 'Neck scarf, head wrap, or belt'
    },
    is_active: true,
    featured: false
  }
];

async function populateProducts() {
  try {
    console.log('Starting to populate products...');
    
    // Insert products one by one to handle any conflicts
    for (const product of femfitProducts) {
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select();
      
      if (error) {
        console.error(`Error inserting product "${product.name}":`, error);
      } else {
        console.log(`✅ Inserted: ${product.name}`);
      }
    }
    
    console.log('✅ Product population completed!');
    
    // Verify the data
    const { data: allProducts, error: fetchError } = await supabase
      .from('products')
      .select('*');
    
    if (fetchError) {
      console.error('Error fetching products:', fetchError);
    } else {
      console.log(`📊 Total products in database: ${allProducts?.length}`);
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the script
populateProducts();
