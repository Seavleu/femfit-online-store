'use client';

import { useState, useEffect } from 'react';
import { 
  Star, Heart, ShoppingCart, Truck, Shield, RotateCcw, ArrowLeft, Home, 
  ZoomIn, Share2, Info, Package, Award, ChevronLeft, ChevronRight,
  Plus, Minus, Eye, MessageCircle, ThumbsUp, Clock, Users
} from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { Product } from '@/data/products';
import SizeGuideModal from './SizeGuideModal';
import { analyticsService } from '@/lib/analytics';
import { formatPrice } from '@/lib/currency';
import RecentlyViewedProducts from './RecentlyViewedProducts';
import ProductRecommendations from './ProductRecommendations';
import { addToRecentlyViewed } from './RecentlyViewedProducts';

interface EnhancedProductDetailProps {
  product: Product;
}

export default function EnhancedProductDetail({ product }: EnhancedProductDetailProps) {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '');
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [notification, setNotification] = useState('');
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [viewCount, setViewCount] = useState(Math.floor(Math.random() * 500) + 100);
  
  const { addToCart } = useCart();

  useEffect(() => {
    // Track product view
    analyticsService.trackProductView(product.id, product.category, product.tags);
    
    // Add to recently viewed
    addToRecentlyViewed(product);
    
    // Simulate view count increment
    setViewCount(prev => prev + 1);
  }, [product]);

  const images = product.images || [product.image];
  const price = product.price.usd;
  const originalPrice = product.originalPrice ? product.originalPrice.usd : null;
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  const handleAddToCart = async () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      showNotification('Please select a size');
      return;
    }
    
    setIsAddingToCart(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    addToCart(product, quantity, selectedSize, selectedColor);
    
    // Track add to cart
    analyticsService.trackAddToCart(product.id);
    
    setIsAddingToCart(false);
    showNotification('Added to cart successfully!');
  };

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      showNotification('Product link copied to clipboard!');
    }
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 bg-black text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-300 transform translate-x-0">
          {notification}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        {/* Enhanced Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <Link 
            href="/" 
            className="hover:text-pink-600 transition-colors flex items-center space-x-1 group"
          >
            <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link 
            href="/shop" 
            className="hover:text-pink-600 transition-colors"
          >
            Shop
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-pink-600 font-medium">{product.name}</span>
        </div>

        {/* Back Button */}
        <div className="mb-8">
          <Link
            href="/shop"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-pink-600 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Shop</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Enhanced Product Images */}
          <div className="space-y-6">
            {/* Main Image */}
            <div className="relative aspect-square overflow-hidden rounded-3xl bg-gray-100 group">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className={`w-full h-full object-cover transition-transform duration-500 ${
                  isImageZoomed ? 'scale-150' : 'group-hover:scale-105'
                }`}
              />
              
              {/* Discount Badge */}
              {discount > 0 && (
                <div className="absolute top-6 left-6 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  -{discount}%
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="absolute top-6 right-6 flex space-x-2">
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all shadow-lg group"
                >
                  <Heart className={`w-5 h-5 transition-colors ${
                    isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600 group-hover:text-red-500'
                  }`} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all shadow-lg group"
                >
                  <Share2 className="w-5 h-5 text-gray-600 group-hover:text-pink-600" />
                </button>
                <button
                  onClick={() => setIsImageZoomed(!isImageZoomed)}
                  className="p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all shadow-lg group"
                >
                  <ZoomIn className="w-5 h-5 text-gray-600 group-hover:text-pink-600" />
                </button>
              </div>

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-all shadow-lg opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-800" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-all shadow-lg opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-800" />
                  </button>
                </>
              )}

              {/* Image Indicator */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        selectedImage === index ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
            
            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-3">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square relative overflow-hidden rounded-xl transition-all duration-300 ${
                      selectedImage === index 
                        ? 'ring-3 ring-pink-500 scale-105' 
                        : 'hover:scale-105 hover:ring-2 hover:ring-pink-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Enhanced Product Info */}
          <div className="space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-sm text-pink-600 uppercase tracking-wide font-semibold bg-pink-50 px-3 py-1 rounded-full">
                  {product.category}
                </span>
                <div className="flex items-center text-sm text-gray-500">
                  <Eye className="w-4 h-4 mr-1" />
                  <span>{viewCount} views</span>
                </div>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3 leading-tight">{product.name}</h1>
              
              {/* Rating */}
              {product.rating && (
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating!) 
                            ? 'fill-yellow-400 text-yellow-400' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-3 text-sm text-gray-600 flex items-center">
                    <span className="font-medium">{product.rating}</span>
                    <span className="mx-1">•</span>
                    <span>{product.reviews} reviews</span>
                    <MessageCircle className="w-4 h-4 ml-2" />
                  </span>
                </div>
              )}
            </div>

            {/* Pricing */}
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-2xl">
              <div className="flex items-baseline space-x-4">
                <div className="space-y-1">
                  <span className="text-4xl font-bold text-gray-900">{formatPrice(product.price, 'USD')}</span>
                  <div className="text-lg text-gray-600">{formatPrice(product.price, 'KHR')}</div>
                </div>
                {originalPrice && (
                  <div className="flex flex-col">
                    <span className="text-xl text-gray-500 line-through">{formatPrice(product.originalPrice!, 'USD')}</span>
                    <span className="text-sm text-green-600 font-semibold">Save {formatPrice({usd: originalPrice - price, khr: 0}, 'USD')}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Product Features */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white rounded-xl shadow-sm border">
                <Package className="w-6 h-6 text-pink-600 mx-auto mb-2" />
                <div className="text-sm font-medium text-gray-900">Free Shipping</div>
                <div className="text-xs text-gray-600">Orders over $100</div>
              </div>
              <div className="text-center p-4 bg-white rounded-xl shadow-sm border">
                <Shield className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <div className="text-sm font-medium text-gray-900">Authentic</div>
                <div className="text-xs text-gray-600">100% Genuine</div>
              </div>
              <div className="text-center p-4 bg-white rounded-xl shadow-sm border">
                <RotateCcw className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <div className="text-sm font-medium text-gray-900">Easy Returns</div>
                <div className="text-xs text-gray-600">30-day policy</div>
              </div>
            </div>

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Color</h3>
                <div className="flex space-x-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`relative w-12 h-12 rounded-full border-3 transition-all ${
                        selectedColor === color 
                          ? 'border-pink-500 scale-110' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: color.toLowerCase() }}
                      title={color}
                    >
                      {selectedColor === color && (
                        <div className="absolute inset-0 rounded-full bg-white/20 flex items-center justify-center">
                          <div className="w-3 h-3 bg-white rounded-full shadow-sm" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-2">Selected: <span className="font-medium">{selectedColor}</span></p>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Size</h3>
                  <button
                    onClick={() => setShowSizeGuide(true)}
                    className="text-sm text-pink-600 hover:text-pink-700 underline flex items-center"
                  >
                    <Info className="w-4 h-4 mr-1" />
                    Size Guide
                  </button>
                </div>
                <div className="grid grid-cols-5 gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 px-4 border-2 rounded-xl text-sm font-medium transition-all ${
                        selectedSize === size
                          ? 'border-pink-500 bg-pink-50 text-pink-700'
                          : 'border-gray-200 hover:border-pink-300 hover:bg-pink-50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quantity</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border-2 border-gray-200 rounded-xl">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-gray-100 transition-colors rounded-l-xl"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-16 text-center font-semibold text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-gray-100 transition-colors rounded-r-xl"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{product.stock || 0}</span> items in stock
                </div>
              </div>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart || (product.stock && product.stock === 0)}
              className={`w-full py-4 px-8 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-3 ${
                isAddingToCart
                  ? 'bg-gray-400 cursor-not-allowed'
                  : product.stock && product.stock === 0
                  ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                  : 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1'
              }`}
            >
              {isAddingToCart ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Adding to Cart...</span>
                </>
              ) : product.stock && product.stock === 0 ? (
                <span>Out of Stock</span>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>

            {/* Product Info Tabs */}
            <div className="border-t pt-8">
              <div className="flex space-x-8 border-b">
                {['description', 'details', 'care'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab
                        ? 'border-pink-500 text-pink-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              <div className="pt-6">
                {activeTab === 'description' && (
                  <div className="prose text-gray-600 leading-relaxed">
                    <p>{product.description}</p>
                  </div>
                )}

                {activeTab === 'details' && (
                  <div className="space-y-4">
                    {product.material && (
                      <div className="flex items-start space-x-3">
                        <Award className="w-5 h-5 text-pink-600 mt-0.5" />
                        <div>
                          <span className="font-medium text-gray-900">Material:</span>
                          <span className="ml-2 text-gray-600">{product.material}</span>
                        </div>
                      </div>
                    )}
                    {product.details && (
                      <div className="flex items-start space-x-3">
                        <Package className="w-5 h-5 text-pink-600 mt-0.5" />
                        <div>
                          <span className="font-medium text-gray-900">Details:</span>
                          <span className="ml-2 text-gray-600">{product.details}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'care' && (
                  <div className="space-y-3">
                    {product.care && product.care.map((instruction, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-600">{instruction}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recently Viewed Products */}
        <div className="mt-24">
          <RecentlyViewedProducts maxProducts={4} />
        </div>

        {/* Product Recommendations */}
        <div className="mt-16">
          <ProductRecommendations 
            currentProduct={product}
            category={product.category}
            tags={product.tags}
            maxProducts={6}
          />
        </div>
      </div>

      {showSizeGuide && (
        <SizeGuideModal onClose={() => setShowSizeGuide(false)} />
      )}
    </div>
  );
}
