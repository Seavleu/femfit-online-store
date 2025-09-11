'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronRight, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import CurvedLoop from '@/components/ui/CurvedLoop';
import FlowingMenu from '@/components/ui/FlowingMenu';

interface ShopSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShopSidebar({ isOpen, onClose }: ShopSidebarProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [hoveredItem, setHoveredItem] = useState<any>(null);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const mainCategories = [
    { id: 'new', name: 'New Products', hasArrow: true, href: '/shop?filter=new' },
    { id: 'trending', name: 'Trending Now', hasArrow: true, href: '/shop?filter=trending' },
    { id: 'shoes', name: 'Shoes', hasArrow: true, href: '/shop/shoes' },
    { id: 'hundred', name: 'Hundred', hasArrow: true, href: '/shop/hundred' },
    { id: 'wallet', name: 'Wallet', hasArrow: true, href: '/shop/wallet' },
    { id: 'accessories', name: 'Accessories', hasArrow: true, href: '/shop/accessories' },
    { id: 'gift', name: 'Gift', hasArrow: true, href: '/shop/gift' },
    { id: 'sale', name: 'Sale', hasArrow: true, href: '/shop?filter=sale', isSpecial: true },
    { id: 'story', name: 'Story', hasArrow: false, href: '/about' }
  ];

  // FlowingMenu items with images and sub-items
  const flowingMenuItems = [
    { 
      link: '/shop/women', 
      text: 'Women', 
      image: 'https://www.charleskeith.com/dw/image/v2/BCWJ_PRD/on/demandware.static/-/Library-Sites-CharlesKeith/default/dw31fceece/images/homepage/2025/charles-keith-home-opc-week-36-1-kr-500x667.jpg?sw=500&sh=667&sm=fit',
      subItems: [
        { name: 'Dresses', href: '/shop/women/dresses' },
        { name: 'Tops & Blouses', href: '/shop/women/tops' },
        { name: 'Bottoms', href: '/shop/women/bottoms' },
        { name: 'Outerwear', href: '/shop/women/outerwear' },
        { name: 'Activewear', href: '/shop/women/activewear' }
      ]
    },
    { 
      link: '/shop/men', 
      text: 'Men', 
      image: 'https://www.charleskeith.com/dw/image/v2/BCWJ_PRD/on/demandware.static/-/Library-Sites-CharlesKeith/default/dw0c5997b5/images/homepage/2025/charles-keith-home-opc-week-36-2-kr-500x667.jpg?sw=500&sh=667&sm=fit',
      subItems: [
        { name: 'Shirts', href: '/shop/men/shirts' },
        { name: 'T-Shirts', href: '/shop/men/t-shirts' },
        { name: 'Pants', href: '/shop/men/pants' },
        { name: 'Jackets', href: '/shop/men/jackets' },
        { name: 'Activewear', href: '/shop/men/activewear' }
      ]
    },
    { 
      link: '/shop/gym', 
      text: 'Gym', 
      image: 'https://www.charleskeith.com/dw/image/v2/BCWJ_PRD/on/demandware.static/-/Library-Sites-CharlesKeith/default/dw301a9ead/images/homepage/2025/charles-keith-home-opc-week-36-5-kr-500x667.jpg?sw=500&sh=667&sm=fit',
      subItems: [
        { name: 'Workout Tops', href: '/shop/gym/tops' },
        { name: 'Leggings', href: '/shop/gym/leggings' },
        { name: 'Sports Bras', href: '/shop/gym/sports-bras' },
        { name: 'Shorts', href: '/shop/gym/shorts' },
        { name: 'Equipment', href: '/shop/gym/equipment' }
      ]
    },
    { 
      link: '/shop/shoes', 
      text: 'Shoes', 
      image: 'https://www.charleskeith.com/dw/image/v2/BCWJ_PRD/on/demandware.static/-/Library-Sites-CharlesKeith/default/dwdbf1903e/images/homepage/2025/charles-keith-home-opc-week-36-4-kr-500x667.jpg?sw=500&sh=667&sm=fit',
      subItems: [
        { name: 'Sneakers', href: '/shop/shoes/sneakers' },
        { name: 'Heels', href: '/shop/shoes/heels' },
        { name: 'Flats', href: '/shop/shoes/flats' },
        { name: 'Boots', href: '/shop/shoes/boots' },
        { name: 'Sandals', href: '/shop/shoes/sandals' }
      ]
    },
    { 
      link: '/shop/accessories', 
      text: 'Accessories', 
      image: 'https://www.charleskeith.com/dw/image/v2/BCWJ_PRD/on/demandware.static/-/Library-Sites-CharlesKeith/default/dwfa08e8f9/images/homepage/2025/charles-keith-home-opc-week-36-3-kr-500x667.jpg?sw=500&sh=667&sm=fit',
      subItems: [
        { name: 'Bags', href: '/shop/accessories/bags' },
        { name: 'Wallets', href: '/shop/accessories/wallets' },
        { name: 'Belts', href: '/shop/accessories/belts' },
        { name: 'Jewelry', href: '/shop/accessories/jewelry' },
        { name: 'Watches', href: '/shop/accessories/watches' }
      ]
    },
    { 
      link: '/shop/perfume', 
      text: 'Perfume', 
      image: 'https://www.charleskeith.com/dw/image/v2/BCWJ_PRD/on/demandware.static/-/Library-Sites-CharlesKeith/default/dw31fceece/images/homepage/2025/charles-keith-home-opc-week-36-1-kr-500x667.jpg?sw=500&sh=667&sm=fit',
      subItems: [
        { name: 'Women\'s Fragrance', href: '/shop/perfume/women' },
        { name: 'Men\'s Fragrance', href: '/shop/perfume/men' },
        { name: 'Unisex', href: '/shop/perfume/unisex' },
        { name: 'Gift Sets', href: '/shop/perfume/gift-sets' }
      ]
    },
    { 
      link: '/shop/gift', 
      text: 'Gift', 
      image: 'https://www.charleskeith.com/dw/image/v2/BCWJ_PRD/on/demandware.static/-/Library-Sites-CharlesKeith/default/dw0c5997b5/images/homepage/2025/charles-keith-home-opc-week-36-2-kr-500x667.jpg?sw=500&sh=667&sm=fit',
      subItems: [
        { name: 'Gift Cards', href: '/shop/gift/gift-cards' },
        { name: 'Gift Sets', href: '/shop/gift/gift-sets' },
        { name: 'Special Occasions', href: '/shop/gift/special-occasions' },
        { name: 'Personalized', href: '/shop/gift/personalized' }
      ]
    }
  ];

  const utilityLinks = [
    { name: 'Order Inquiry', href: '/orders' },
    { name: 'Store location', href: '/stores' },
    { name: 'Frequently Asked Questions', href: '/faq' }
  ];

  // Category data for detailed views
  const categoryData = {
    new: {
      title: 'FASHION CATEGORIES',
      categories: [
        { name: 'Women\'s Clothing', href: '/shop/women/clothing' },
        { name: 'Men\'s Clothing', href: '/shop/men/clothing' },
        { name: 'Gym & Activewear', href: '/shop/gym' },
        { name: 'Women\'s Shoes', href: '/shop/women/shoes' },
        { name: 'Men\'s Shoes', href: '/shop/men/shoes' },
        { name: 'Accessories', href: '/shop/accessories' },
        { name: 'Perfume & Fragrance', href: '/shop/perfume' },
        { name: 'Gift Sets', href: '/shop/gifts' }
      ],
      collections: [
        { name: 'Spring Collection', image: 'https://www.charleskeith.com/dw/image/v2/BCWJ_PRD/on/demandware.static/-/Library-Sites-CharlesKeith/default/dw31fceece/images/homepage/2025/charles-keith-home-opc-week-36-1-kr-500x667.jpg?sw=500&sh=667&sm=fit' },
        { name: 'Summer Essentials', image: 'https://www.charleskeith.com/dw/image/v2/BCWJ_PRD/on/demandware.static/-/Library-Sites-CharlesKeith/default/dw0c5997b5/images/homepage/2025/charles-keith-home-opc-week-36-2-kr-500x667.jpg?sw=500&sh=667&sm=fit' },
        { name: 'Evening Wear', image: 'https://www.charleskeith.com/dw/image/v2/BCWJ_PRD/on/demandware.static/-/Library-Sites-CharlesKeith/default/dw301a9ead/images/homepage/2025/charles-keith-home-opc-week-36-5-kr-500x667.jpg?sw=500&sh=667&sm=fit' },
        { name: 'Casual Chic', image: 'https://www.charleskeith.com/dw/image/v2/BCWJ_PRD/on/demandware.static/-/Library-Sites-CharlesKeith/default/dwdbf1903e/images/homepage/2025/charles-keith-home-opc-week-36-4-kr-500x667.jpg?sw=500&sh=667&sm=fit' },
        { name: 'Work Collection', image: 'https://www.charleskeith.com/dw/image/v2/BCWJ_PRD/on/demandware.static/-/Library-Sites-CharlesKeith/default/dwfa08e8f9/images/homepage/2025/charles-keith-home-opc-week-36-3-kr-500x667.jpg?sw=500&sh=667&sm=fit' },
        { name: 'Holiday Special', image: 'https://www.charleskeith.com/dw/image/v2/BCWJ_PRD/on/demandware.static/-/Library-Sites-CharlesKeith/default/dw31fceece/images/homepage/2025/charles-keith-home-opc-week-36-1-kr-500x667.jpg?sw=500&sh=667&sm=fit' }
      ]
    },
    trending: {
      title: 'TRENDING NOW',
      categories: [
        { name: 'Best Sellers', href: '/shop?filter=bestsellers' },
        { name: 'Most Wanted', href: '/shop?filter=wanted' },
        { name: 'Limited Edition', href: '/shop?filter=limited' },
        { name: 'Celebrity Picks', href: '/shop?filter=celebrity' }
      ],
      collections: [
        { name: 'Viral Styles', image: 'https://www.charleskeith.com/dw/image/v2/BCWJ_PRD/on/demandware.static/-/Library-Sites-CharlesKeith/default/dw0c5997b5/images/homepage/2025/charles-keith-home-opc-week-36-2-kr-500x667.jpg?sw=500&sh=667&sm=fit' },
        { name: 'Social Media Faves', image: 'https://www.charleskeith.com/dw/image/v2/BCWJ_PRD/on/demandware.static/-/Library-Sites-CharlesKeith/default/dw301a9ead/images/homepage/2025/charles-keith-home-opc-week-36-5-kr-500x667.jpg?sw=500&sh=667&sm=fit' }
      ]
    }
  };

  const handleNavigation = (href: string) => {
    router.push(href);
    onClose();
  };

  const handleItemHover = (item: any) => {
    // Clear any existing timeout
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setHoveredItem(item);
  };

  const handleItemLeave = () => {
    // Only set timeout if we're not already hovering over sub-items
    if (!hoveredItem) return;
    
    const timeout = setTimeout(() => {
      setHoveredItem(null);
    }, 300); // 300ms delay to allow moving to sub-items
    setHoverTimeout(timeout);
  };

  const handleSubItemsHover = () => {
    // Clear timeout when hovering over sub-items
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
  };

  const handleSubItemsLeave = () => {
    // Set a delay when leaving sub-items area
    const timeout = setTimeout(() => {
      setHoveredItem(null);
    }, 300);
    setHoverTimeout(timeout);
  };

  const handleCategoryClick = (categoryId: string) => {
    if (categoryData[categoryId as keyof typeof categoryData]) {
      setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
    } else {
      const category = mainCategories.find(cat => cat.id === categoryId);
      if (category) {
        handleNavigation(category.href);
      }
    }
  };

  // Swipe/Drag handlers for collections
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
    scrollContainerRef.current.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    if (!scrollContainerRef.current) return;
    setIsDragging(false);
    scrollContainerRef.current.style.cursor = 'grab';
  };

  const handleMouseLeave = () => {
    if (!scrollContainerRef.current) return;
    setIsDragging(false);
    scrollContainerRef.current.style.cursor = 'grab';
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && !(event.target as Element).closest('.sidebar-container')) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [hoverTimeout]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 h-full bg-white z-50 sidebar-container transform transition-all duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full",
        hoveredItem ? "w-full sm:w-[760px] lg:w-[760px]" : "w-full sm:w-[380px] lg:w-[380px]"
      )}>
        <div className="flex h-full flex-col sm:flex-row">
          {/* Left Column - Main Navigation */}
          <div 
            className="w-full sm:w-[380px] border-r border-gray-200 flex flex-col"
            onMouseLeave={handleItemLeave}
          >
        {/* Header */}
            <div className="flex items-center justify-end p-4">
          <button
            onClick={onClose}
                className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 rounded-lg transition-colors duration-200"
          >
                <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

            {/* Main Navigation - FlowingMenu */}
            <div className="flex-1">
              <div style={{ height: '400px', position: 'relative' }}>
                <FlowingMenu 
                  items={flowingMenuItems} 
                  onClose={onClose} 
                  onItemHover={handleItemHover}
                />
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 mx-4"></div>

            {/* Utility Links */}
            <div className="px-4 py-4">
              <nav className="space-y-0">
                {utilityLinks.map((link) => (
                      <button
                    key={link.name}
                        onClick={() => handleNavigation(link.href)}
                    className="w-full h-[40px] flex items-center text-left px-4 text-[22px] font-futura font-thin text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                      >
                        {link.name}
                      </button>
                  ))}
              </nav>
              </div>

              {/* Footer */}
            <div className="px-4 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-[22px] font-futura font-thin text-gray-600">
                  Cambodia, US $
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-300 rounded flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-600">A</span>
                  </div>
                  <span className="text-[22px] font-futura font-thin text-gray-600 underline">English</span>
              </div>
          </div>
            </div>
          </div>

          {/* Right Column - Sub-items View */}
          {hoveredItem && (
            <div 
              className="w-full sm:w-[380px] p-4 sm:p-6 overflow-y-auto max-h-screen relative"
              onMouseEnter={handleSubItemsHover}
              onMouseLeave={handleSubItemsLeave}
            >
              {/* Connection indicator */}
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-2 h-8 bg-gray-200 rounded-r-full opacity-50"></div>
              {/* Animated Header */}
              {/* <div className="mb-6 sm:mb-8">
                <CurvedLoop 
                  marqueeText={`${hoveredItem.text.toUpperCase()} ✦ COLLECTION ✦`}
                  speed={1.5}
                  curveAmount={10}
                  direction="right"
                  interactive={true}
                  className="text-gray-800"
                />
              </div> */}

              {/* Sub-items */}
              {hoveredItem.subItems && hoveredItem.subItems.length > 0 && (
                <div className="space-y-1 mb-6 sm:mb-8">
                  <h4 className="text-xs font-medium uppercase mb-4 text-gray-500 tracking-widest">
                    SHOP BY CATEGORY
                  </h4>
                  {hoveredItem.subItems.map((subItem: any, index: number) => (
                      <button
                      key={index}
                      onClick={() => {
                        router.push(subItem.href);
                        onClose();
                      }}
                      className="w-full h-[35px] flex items-center text-left px-3 sm:px-4 text-[16px] sm:text-[18px] font-futura font-thin text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-all duration-200 group border border-transparent hover:border-gray-200"
                    >
                      <span className="group-hover:translate-x-2 transition-transform duration-200">
                        {subItem.name}
                      </span>
                      <ChevronRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      </button>
                  ))}
              </div>
              )}

              {/* Product Image Preview */}
              <div className="mt-6 sm:mt-8">
                <h4 className="text-xs font-medium uppercase mb-4 text-gray-500 tracking-widest">
                  FEATURED
                </h4>
                <div className="relative w-full h-48 sm:h-56 rounded-lg overflow-hidden group cursor-pointer bg-white"
                     onClick={() => {
                       router.push(hoveredItem.link);
                       onClose();
                     }}>
                  <img
                    src={hoveredItem.image}
                    alt={hoveredItem.text}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/50 transition-all duration-300" />
                  
                  {/* Product Name */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-sm font-futura font-thin text-white text-center leading-tight">
                      {hoveredItem.text} Collection
                    </p>
              </div>

                  {/* Hover Arrow */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-6 h-6 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <ChevronRight className="w-3 h-3 text-white" />
                    </div>
              </div>
            </div>
          </div>

              {/* Additional Curved Animation */}
              {/* <div className="mt-8">
                <CurvedLoop 
                  marqueeText="EXPLORE ✦ SHOP ✦ DISCOVER ✦"
                  speed={2}
                  curveAmount={10}
                  direction="left"
                  interactive={false}
                  className="text-gray-800"
                />
              </div> */}
            </div>
          )}
          </div>
        </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        @keyframes scroll-smooth {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
        
        .animate-scroll:hover {
          animation-play-state: paused;
        }
        
        .animate-scroll-smooth {
          animation: scroll-smooth 25s linear infinite;
        }
        
        .animate-scroll-smooth:hover {
          animation-play-state: paused;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .cursor-grab {
          cursor: grab;
        }
        
        .cursor-grabbing {
          cursor: grabbing;
        }
      `}</style>
    </>
  );
}
