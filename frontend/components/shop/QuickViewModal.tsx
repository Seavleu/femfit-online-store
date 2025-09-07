'use client';

import { useState, useEffect } from 'react';
import { X, ShoppingCart, Heart, Star, Truck, Shield, RotateCcw, Eye } from 'lucide-react';
import { useCart, Product } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/currency';
import { cn } from '@/lib/utils';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToWishlist?: (productId: string) => void;
  isWishlisted?: boolean;
}

export default function QuickViewModal({ 
  product, 
  isOpen, 
  onClose, 
  onAddToWishlist,
  isWishlisted = false
}: QuickViewModalProps) {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || '');
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  
  const { addToCart } = useCart();

  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors?.[0] || '');
      setSelectedImage(0);
      setQuantity(1);
      setSelectedSize('');
    }
  }, [product]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!product || !isOpen) return null;

  const images = product.images || [product.image];
  const hasDiscount = product.originalPrice && product.originalPrice.usd > product.price.usd;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.originalPrice.usd - product.price.usd) / product.originalPrice.usd) * 100)
    : 0;

  const handleAddToCart = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      alert('Please select a size');
      return;
    }
    
    addToCart(product, quantity, selectedSize, selectedColor);
    onClose();
  };

  const handleWishlist = () => {
    onAddToWishlist?.(product.id.toString());
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" 
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-2xl font-space-grotesk font-bold">Quick View</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Product Images */}
                <div className="space-y-4">
                  <div className="aspect-square relative overflow-hidden rounded-xl bg-gray-100">
                    <img
                      src={images[selectedImage]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {hasDiscount && (
                      <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        -{discountPercentage}%
                      </div>
                    )}
                  </div>
                  
                  {images.length > 1 && (
                    <div className="grid grid-cols-4 gap-3">
                      {images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          className={`aspect-square relative overflow-hidden rounded-lg border-2 transition-colors ${
                            selectedImage === index ? 'border-black' : 'border-transparent'
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

                {/* Product Info */}
                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wide">{product.category}</p>
                    <h1 className="text-2xl font-bold text-gray-900 mt-1">{product.name}</h1>
                    
                    {product.rating && (
                      <div className="flex items-center mt-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(product.rating!) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">
                          {product.rating} ({product.reviews || 0} reviews)
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="space-y-1">
                      <span className="text-2xl font-bold text-gray-900">{formatPrice(product.price, 'USD')}</span>
                      <div className="text-lg text-gray-600">{formatPrice(product.price, 'KHR')}</div>
                    </div>
                    {hasDiscount && (
                      <span className="text-xl text-gray-500 line-through">{formatPrice(product.originalPrice!, 'USD')}</span>
                    )}
                  </div>

                  <p className="text-gray-600 leading-relaxed">{product.description}</p>

                  {/* Color Selection */}
                  {product.colors && product.colors.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-3">Color</h3>
                      <div className="flex space-x-3">
                        {product.colors.map((color) => (
                          <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={`w-8 h-8 rounded-full border-2 ${
                              selectedColor === color ? 'border-gray-900' : 'border-gray-300'
                            }`}
                            style={{ backgroundColor: color.toLowerCase() }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Size Selection */}
                  {product.sizes && product.sizes.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-3">Size</h3>
                      <div className="grid grid-cols-4 gap-3">
                        {product.sizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`py-2 px-4 border rounded-lg text-sm font-medium transition-colors ${
                              selectedSize === size
                                ? 'border-black bg-black text-white'
                                : 'border-gray-300 hover:border-gray-400'
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
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Quantity</h3>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:border-gray-400"
                      >
                        -
                      </button>
                      <span className="w-12 text-center font-medium">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:border-gray-400"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      <span>Add to Cart</span>
                    </button>
                    <button
                      onClick={handleWishlist}
                      className={cn(
                        "p-3 border rounded-lg transition-colors",
                        isWishlisted
                          ? "border-red-500 bg-red-500 text-white"
                          : "border-gray-300 hover:border-red-500"
                      )}
                    >
                      <Heart className={cn("w-5 h-5", isWishlisted && "fill-current")} />
                    </button>
                  </div>

                  {/* Features */}
                  <div className="border-t pt-6">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex items-center space-x-3">
                        <Truck className="w-5 h-5 text-gray-600" />
                        <span className="text-sm text-gray-600">Free shipping on orders over $100</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <RotateCcw className="w-5 h-5 text-gray-600" />
                        <span className="text-sm text-gray-600">30-day return policy</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Shield className="w-5 h-5 text-gray-600" />
                        <span className="text-sm text-gray-600">2-year warranty</span>
                      </div>
                    </div>
                  </div>

                  {/* View Full Details */}
                  <div className="border-t pt-6">
                    <button
                      onClick={onClose}
                      className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:border-black hover:text-black transition-colors flex items-center justify-center space-x-2"
                    >
                      <Eye className="w-5 h-5" />
                      <span>View Full Details</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
