// Layout constants and utilities for consistent responsive design

export const LAYOUT_CONSTANTS = {
  // Container widths
  CONTAINER_MAX_WIDTH: 'max-w-7xl',
  CONTAINER_PADDING: 'px-4 sm:px-6 lg:px-8',
  
  // Section spacing
  SECTION_PADDING: 'py-2.5',
  SECTION_PADDING_SMALL: 'py-2.5',
  SECTION_PADDING_LARGE: 'py-2.5',
  
  // Grid systems
  GRID_COLS_1: 'grid-cols-1',
  GRID_COLS_2: 'grid-cols-1 sm:grid-cols-2',
  GRID_COLS_3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  GRID_COLS_4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
  GRID_COLS_5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5',
  GRID_COLS_6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6',
  
  // Gap spacing
  GAP_SMALL: 'gap-2 sm:gap-4',
  GAP_MEDIUM: 'gap-4 sm:gap-6',
  GAP_LARGE: 'gap-6 sm:gap-8',
  
  // Typography responsive
  TEXT_XS: 'text-xs sm:text-sm',
  TEXT_SM: 'text-sm sm:text-base',
  TEXT_BASE: 'text-base sm:text-lg',
  TEXT_LG: 'text-lg sm:text-xl',
  TEXT_XL: 'text-xl sm:text-2xl',
  TEXT_2XL: 'text-2xl sm:text-3xl',
  TEXT_3XL: 'text-3xl sm:text-4xl',
  TEXT_4XL: 'text-4xl sm:text-5xl',
  
  // Specific font sizes
  SECTION_TITLE: 'text-2xl', // 24px
  PRODUCT_CARD: 'text-base', // 16px
  
  // Spacing responsive
  SPACE_XS: 'space-y-2 sm:space-y-4',
  SPACE_SM: 'space-y-4 sm:space-y-6',
  SPACE_MD: 'space-y-6 sm:space-y-8',
  SPACE_LG: 'space-y-8 sm:space-y-12',
  
  // Padding responsive
  PADDING_XS: 'p-2 sm:p-4',
  PADDING_SM: 'p-4 sm:p-6',
  PADDING_MD: 'p-6 sm:p-8',
  PADDING_LG: 'p-8 sm:p-12',
  
  // Margin responsive
  MARGIN_XS: 'm-2 sm:m-4',
  MARGIN_SM: 'm-4 sm:m-6',
  MARGIN_MD: 'm-6 sm:m-8',
  MARGIN_LG: 'm-8 sm:m-12',
} as const;

// Responsive breakpoint utilities
export const RESPONSIVE = {
  // Mobile first approach
  MOBILE: 'sm:hidden',
  TABLET: 'hidden sm:block lg:hidden',
  DESKTOP: 'hidden lg:block',
  
  // Show/hide at specific breakpoints
  SHOW_MOBILE: 'block sm:hidden',
  SHOW_TABLET: 'hidden sm:block lg:hidden',
  SHOW_DESKTOP: 'hidden lg:block',
  
  // Flex responsive
  FLEX_COL: 'flex flex-col',
  FLEX_ROW: 'flex flex-row',
  FLEX_COL_MD: 'flex flex-col sm:flex-row',
  FLEX_COL_LG: 'flex flex-col lg:flex-row',
  
  // Grid responsive
  GRID_1: 'grid grid-cols-1',
  GRID_2: 'grid grid-cols-1 sm:grid-cols-2',
  GRID_3: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  GRID_4: 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
  GRID_5: 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5',
  GRID_6: 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6',
} as const;

// Common layout patterns
export const LAYOUT_PATTERNS = {
  // Standard section wrapper
  SECTION: `${LAYOUT_CONSTANTS.CONTAINER_MAX_WIDTH} mx-auto ${LAYOUT_CONSTANTS.CONTAINER_PADDING}`,
  
  // Hero section
  HERO: `${LAYOUT_CONSTANTS.CONTAINER_MAX_WIDTH} mx-auto ${LAYOUT_CONSTANTS.CONTAINER_PADDING} ${LAYOUT_CONSTANTS.SECTION_PADDING_LARGE}`,
  
  // Content section
  CONTENT: `${LAYOUT_CONSTANTS.CONTAINER_MAX_WIDTH} mx-auto ${LAYOUT_CONSTANTS.CONTAINER_PADDING} ${LAYOUT_CONSTANTS.SECTION_PADDING}`,
  
  // Grid container
  GRID: `${RESPONSIVE.GRID_4} ${LAYOUT_CONSTANTS.GAP_MEDIUM}`,
  
  // Card container
  CARD: 'bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300',
  
  // Button container
  BUTTON_GROUP: 'flex flex-col sm:flex-row gap-4 sm:gap-6',
} as const;

// Typography scale
export const TYPOGRAPHY = {
  H1: 'text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight',
  H2: 'text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight',
  H3: 'text-xl sm:text-2xl lg:text-3xl font-semibold',
  H4: 'text-lg sm:text-xl lg:text-2xl font-semibold',
  H5: 'text-base sm:text-lg lg:text-xl font-medium',
  H6: 'text-sm sm:text-base lg:text-lg font-medium',
  BODY: 'text-sm sm:text-base leading-relaxed',
  SMALL: 'text-xs sm:text-sm',
  CAPTION: 'text-xs text-gray-500',
} as const;
