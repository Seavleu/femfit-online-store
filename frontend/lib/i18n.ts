'use client';

import { createContext, useContext } from 'react';

export type Language = 'en' | 'km';

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
  changeLanguage: (lang: Language) => void;
}

export const TranslationContext = createContext<TranslationContextType | null>(null);

// Translation dictionaries
export const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.shop': 'Shop',
    'nav.cart': 'Cart',
    'nav.profile': 'Profile',
    'nav.signin': 'Sign In',
    'nav.signup': 'Sign Up',
    'navigation.signOut': 'Sign Out',
    
    // Chatbot specific translations
    'chatbot.open': 'Open chat',
    'chatbot.online': 'Online now',
    'chatbot.placeholder': 'Type your message...',
    'chatbot.greeting': "Hello! I'm here to help you with your orders and questions. How can I assist you today?",
    'chatbot.orderStatus': 'To check your order status, please provide your order number (e.g., FF000001).',
    'chatbot.delivery': 'We typically deliver within 1-2 business days in Phnom Penh and 2-3 days in other provinces.',
    'chatbot.payment': 'We accept ABA PayWay for secure mobile payments. You can pay using any ABA mobile banking app.',
    'chatbot.returns': 'We offer a 30-day return policy for unused items in original packaging.',
    'chatbot.contact': 'You can reach our customer service at +855 12 345 678 or email support@luxe.com',
    'chatbot.default': "I understand you're asking about that. For detailed assistance, please contact our customer service team.",
    
    // Product
    'product.addToCart': 'Add to Cart',
    'product.outOfStock': 'Out of Stock',
    'product.selectSize': 'Select Size',
    'product.selectColor': 'Select Color',
    'product.sizeGuide': 'Size Guide',
    'product.details': 'Details',
    'product.care': 'Care Instructions',
    'product.material': 'Material',
    'product.price': 'Price',
    'product.quantity': 'Quantity',
    'product.inStock': 'In Stock',
    'product.description': 'Description',
    'product.specifications': 'Specifications',
    'product.reviews': 'Reviews',
    'product.size': 'Size',
    'product.color': 'Color',
    'product.brand': 'Brand',
    'product.buyNow': 'Buy Now',
    
    // Cart
    'cart.title': 'Shopping Cart',
    'cart.empty': 'Your cart is empty',
    'cart.continueShopping': 'Continue Shopping',
    'cart.checkout': 'Checkout',
    'cart.remove': 'Remove',
    'cart.quantity': 'Quantity',
    'cart.total': 'Total',
    'cart.subtotal': 'Subtotal',
    'cart.shipping': 'Shipping',
    'cart.tax': 'Tax',
    
    // Checkout
    'checkout.title': 'Checkout',
    'checkout.shipping': 'Shipping Information',
    'checkout.payment': 'Payment',
    'checkout.review': 'Review Order',
    'checkout.firstName': 'First Name',
    'checkout.lastName': 'Last Name',
    'checkout.email': 'Email',
    'checkout.phone': 'Phone Number',
    'checkout.address': 'Address',
    'checkout.city': 'City',
    'checkout.province': 'Province',
    'checkout.postalCode': 'Postal Code',
    'checkout.placeOrder': 'Place Order',
    'checkout.payWithPayWay': 'Pay with ABA PayWay',
    
    // Order
    'order.confirmation': 'Order Confirmation',
    'order.number': 'Order Number',
    'order.status': 'Status',
    'order.estimatedDelivery': 'Estimated Delivery',
    'order.trackOrder': 'Track Order',
    
    // Account
    'account.confirmSignOut': 'Are you sure you want to sign out?',
    'account.yesSignOut': 'Yes, Sign Out',
    'account.confirmSignOutButton': 'Confirm Sign Out',
    
    // Categories
    'category.clothes': 'Clothes',
    'category.accessories': 'Accessories',
    'category.perfume': 'Perfume',
    'category.cosmetic': 'Cosmetics',
    'category.sanitary': 'Sanitary Products',
    'category.other': 'Other',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.price': 'Price',
    'common.name': 'Name',
    'common.category': 'Category',
    'common.new': 'New',
    'common.popular': 'Popular',
    'common.bestseller': 'Bestseller',
    'common.confirm': 'Confirm',
    'common.close': 'Close',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.yes': 'Yes',
    'common.no': 'No',
    
    // Validation
    'validation.required': 'This field is required',
    'validation.email': 'Please enter a valid email',
    'validation.phone': 'Please enter a valid phone number',
    'validation.password': 'Password must be at least 8 characters',
    
    // Messages
    'message.addedToCart': 'Added to cart',
    'message.removedFromCart': 'Removed from cart',
    'message.orderPlaced': 'Order placed successfully',
    'message.paymentSuccess': 'Payment successful',
    'message.paymentFailed': 'Payment failed',
    'messages.success.signedOut': 'Signed out successfully',
    'messages.error.signOutFailed': 'Error signing out',
    'messages.error.general': 'Something went wrong. Please try again.',
    'messages.error.networkError': 'Network error. Please check your connection.',
    'messages.error.invalidCredentials': 'Invalid email or password',
    'messages.error.outOfStock': 'This product is out of stock',
    'messages.error.paymentFailed': 'Payment failed. Please try again.',
    'messages.info.loading': 'Loading...',
    'messages.info.noResults': 'No results found',
    'messages.info.searchPlaceholder': 'Search for products...',
  },
  km: {
    // Navigation
    'nav.home': 'ទំព័រដើម',
    'nav.shop': 'ហាង',
    'nav.cart': 'កន្ត្រក់',
    'nav.profile': 'ប្រវត្តិរូប',
    'nav.signin': 'ចូល',
    'nav.signup': 'ចុះឈ្មោះ',
    'navigation.signOut': 'ចេញ',
    
    // Chatbot specific translations
    'chatbot.open': 'បើកការជជែក',
    'chatbot.online': 'អនឡាញឥឡូវនេះ',
    'chatbot.placeholder': 'វាយសាររបស់អ្នក...',
    'chatbot.greeting': 'សួស្តី! ខ្ញុំនៅទីនេះដើម្បីជួយអ្នកជាមួយការបញ្ជាទិញ និងសំណួររបស់អ្នក។ តើខ្ញុំអាចជួយអ្នកយ៉ាងណា?',
    'chatbot.orderStatus': 'ដើម្បីពិនិត្យស្ថានភាពការបញ្ជាទិញរបស់អ្នក សូមផ្តល់លេខការបញ្ជាទិញ (ឧ. FF000001)។',
    'chatbot.delivery': 'យើងធម្មតាដឹកជញ្ជូនក្នុងរយៈពេល ១-២ ថ្ងៃធ្វើការនៅភ្នំពេញ និង ២-៣ ថ្ងៃនៅខេត្តផ្សេងៗ។',
    'chatbot.payment': 'យើងទទួលយក ABA PayWay សម្រាប់ការបង់ប្រាក់តាមទូរស័ព្ទដោយសុវត្ថិភាព។ អ្នកអាចបង់ប្រាក់ដោយប្រើកម្មវិធី ABA mobile banking។',
    'chatbot.returns': 'យើងផ្តល់នូវគោលការណ៍ត្រឡប់ទំនិញក្នុងរយៈពេល ៣០ ថ្ងៃ សម្រាប់ទំនិញដែលមិនបានប្រើប្រាស់នៅក្នុងកញ្ចប់ដើម។',
    'chatbot.contact': 'អ្នកអាចទាក់ទងសេវាកម្មអតិថិជនរបស់យើងតាម +855 12 345 678 ឬអ៊ីមែល support@luxe.com',
    'chatbot.default': 'ខ្ញុំយល់អំពីសំណួររបស់អ្នក។ សម្រាប់ជំនួយលម្អិត សូមទាក់ទងក្រុមសេវាកម្មអតិថិជនរបស់យើង។',
    
    // Product
    'product.addToCart': 'បន្ថែមទៅកន្ត្រក់',
    'product.outOfStock': 'អស់ពីស្តុក',
    'product.selectSize': 'ជ្រើសរើសទំហំ',
    'product.selectColor': 'ជ្រើសរើសពណ៌',
    'product.sizeGuide': 'មគ្គុទ្ទេសទំហំ',
    'product.details': 'ព័ត៌មានលម្អិត',
    'product.care': 'វិធីថែរក្សា',
    'product.material': 'សម្ភារៈ',
    'product.price': 'តម្លៃ',
    'product.quantity': 'បរិមាណ',
    'product.inStock': 'មាននៅក្នុងស្តុក',
    'product.description': 'ការពិពណ៌នា',
    'product.specifications': 'លក្ខណៈបច្ចេកទេស',
    'product.reviews': 'ការវាយតម្លៃ',
    'product.size': 'ទំហំ',
    'product.color': 'ពណ៌',
    'product.brand': 'ម៉ាក',
    'product.buyNow': 'ទិញឥឡូវនេះ',
    
    // Cart
    'cart.title': 'កន្ត្រក់ទិញទំនិញ',
    'cart.empty': 'កន្ត្រក់របស់អ្នកទទេ',
    'cart.continueShopping': 'បន្តទិញទំនិញ',
    'cart.checkout': 'បង់ប្រាក់',
    'cart.remove': 'លុបចេញ',
    'cart.quantity': 'បរិមាណ',
    'cart.total': 'សរុប',
    'cart.subtotal': 'សរុបរង',
    'cart.shipping': 'ការដឹកជញ្ជូន',
    'cart.tax': 'ពន្ធ',
    
    // Checkout
    'checkout.title': 'បង់ប្រាក់',
    'checkout.shipping': 'ព័ត៌មានដឹកជញ្ជូន',
    'checkout.payment': 'ការបង់ប្រាក់',
    'checkout.review': 'ពិនិត្យការបញ្ជាទិញ',
    'checkout.firstName': 'នាមខ្លួន',
    'checkout.lastName': 'នាមត្រកូល',
    'checkout.email': 'អ៊ីមែល',
    'checkout.phone': 'លេខទូរស័ព្ទ',
    'checkout.address': 'អាសយដ្ឋាន',
    'checkout.city': 'ទីក្រុង',
    'checkout.province': 'ខេត្ត',
    'checkout.postalCode': 'លេខប្រៃសណីយ៍',
    'checkout.placeOrder': 'បញ្ជាទិញ',
    'checkout.payWithPayWay': 'បង់ប្រាក់ជាមួយ ABA PayWay',
    
    // Order
    'order.confirmation': 'បញ្ជាក់ការបញ្ជាទិញ',
    'order.number': 'លេខការបញ្ជាទិញ',
    'order.status': 'ស្ថានភាព',
    'order.estimatedDelivery': 'ការដឹកជញ្ជូនប៉ាន់ស្មាន',
    'order.trackOrder': 'តាមដានការបញ្ជាទិញ',
    
    // Account
    'account.confirmSignOut': 'តើអ្នកប្រាកដថាចង់ចាកចេញមែនទេ?',
    'account.yesSignOut': 'បាទ/ចាស ចាកចេញ',
    'account.confirmSignOutButton': 'បញ្ជាក់ការចាកចេញ',
    
    // Categories
    'category.clothes': 'សម្លៀកបំពាក់',
    'category.accessories': 'គ្រឿងបន្លាស់',
    'category.perfume': 'ទឹកអប់',
    'category.cosmetic': 'គ្រឿងសម្អាង',
    'category.sanitary': 'ផលិតផលអនាម័យ',
    'category.other': 'ផ្សេងៗ',
    
    // Common
    'common.loading': 'កំពុងផ្ទុក...',
    'common.error': 'មានកំហុសកើតឡើង',
    'common.success': 'ជោគជ័យ',
    'common.cancel': 'បោះបង់',
    'common.save': 'រក្សាទុក',
    'common.edit': 'កែប្រែ',
    'common.delete': 'លុប',
    'common.search': 'ស្វែងរក',
    'common.filter': 'តម្រង',
    'common.sort': 'តម្រៀប',
    'common.price': 'តម្លៃ',
    'common.name': 'ឈ្មោះ',
    'common.category': 'ប្រភេទ',
    'common.new': 'ថ្មី',
    'common.popular': 'ពេញនិយម',
    'common.bestseller': 'លក់ដាច់បំផុត',
    'common.confirm': 'បញ្ជាក់',
    'common.close': 'បិទ',
    'common.back': 'ត្រឡប់',
    'common.next': 'បន្ទាប់',
    'common.previous': 'មុន',
    'common.yes': 'បាទ/ចាស',
    'common.no': 'ទេ',
    
    // Validation
    'validation.required': 'ចាំបាច់បំពេញ',
    'validation.email': 'សូមបញ្ចូលអ៊ីមែលត្រឹមត្រូវ',
    'validation.phone': 'សូមបញ្ចូលលេខទូរស័ព្ទត្រឹមត្រូវ',
    'validation.password': 'ពាក្យសម្ងាត់ត្រូវមានយ៉ាងហោចណាស់ ៨ តួអក្សរ',
    
    // Messages
    'message.addedToCart': 'បានបន្ថែមទៅកន្ត្រក់',
    'message.removedFromCart': 'បានលុបចេញពីកន្ត្រក់',
    'message.orderPlaced': 'បានបញ្ជាទិញដោយជោគជ័យ',
    'message.paymentSuccess': 'ការបង់ប្រាក់ជោគជ័យ',
    'message.paymentFailed': 'ការបង់ប្រាក់បរាជ័យ',
    'messages.success.signedOut': 'បានចាកចេញដោយជោគជ័យ',
    'messages.error.signOutFailed': 'កំហុសក្នុងការចាកចេញ',
    'messages.error.general': 'មានអ្វីមួយខុស។ សូមព្យាយាមម្តងទៀត។',
    'messages.error.networkError': 'កំហុសបណ្តាញ។ សូមពិនិត្យការតភ្ជាប់របស់អ្នក។',
    'messages.error.invalidCredentials': 'អ៊ីមែល ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវ',
    'messages.error.outOfStock': 'ផលិតផលនេះអស់ស្តុក',
    'messages.error.paymentFailed': 'ការទូទាត់បរាជ័យ។ សូមព្យាយាមម្តងទៀត។',
    'messages.info.loading': 'កំពុងផ្ទុក...',
    'messages.info.noResults': 'គ្មានលទ្ធផល',
    'messages.info.searchPlaceholder': 'ស្វែងរកផលិតផល...',
  }
};

// Translation function
export const getTranslation = (key: string, language: Language, fallback?: string): string => {
  const translation = translations[language]?.[key as keyof typeof translations.en];
  return translation || fallback || key;
};

// Format currency based on language
export const formatCurrencyByLanguage = (amount: number, currency: 'USD' | 'KHR', language: Language): string => {
  if (currency === 'USD') {
    return language === 'km' 
      ? `$${amount.toFixed(2)}` 
      : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  } else {
    return language === 'km'
      ? `${amount.toLocaleString('km-KH')} ៛`
      : new Intl.NumberFormat('en-US').format(amount) + ' KHR';
  }
};

// Hook that works with or without provider
export const useTranslation = () => {
  const context = useContext(TranslationContext);
  
  if (!context) {
    // Return a default implementation if used outside provider
    // This allows the ChatbotWidget to work even without the provider
    const defaultLanguage: Language = 'km';
    
    return {
      t: (key: string, fallback?: string) => getTranslation(key, defaultLanguage, fallback),
      language: defaultLanguage,
      changeLanguage: (lang: Language) => {
        console.warn('Translation provider not found. Please wrap your app with TranslationProvider');
      },
      setLanguage: (lang: Language) => {
        console.warn('Translation provider not found. Please wrap your app with TranslationProvider');
      }
    };
  }
  
  return context;
};