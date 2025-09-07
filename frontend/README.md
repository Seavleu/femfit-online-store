# FEMFIT Online Store

A modern, responsive e-commerce platform for fashion and fitness products built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- **Modern UI/UX**: Clean, minimalist design with black and white theme
- **Responsive Design**: Mobile-first approach with seamless experience across all devices
- **Interactive Animations**: GSAP-powered animations and smooth scrolling effects
- **Product Showcase**: Dynamic product grids with hover effects and filtering
- **Shopping Experience**: Intuitive navigation with sidebar and product categories
- **Brand Integration**: Animated brand sections and promotional elements

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Custom CSS animations
- **Animations**: GSAP, Framer Motion, Motion (Lenis)
- **UI Components**: shadcn/ui, Radix UI
- **Icons**: Lucide React
- **Authentication**: NextAuth.js (planned)
- **Database**: MongoDB (planned)
- **Payments**: ABA PayWay API (planned)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Seavleu/femfit-online-store.git
cd femfit-online-store/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
frontend/
├── app/                    # Next.js 13+ app directory
├── components/             # React components
│   ├── layout/            # Layout components (Header, Footer, etc.)
│   ├── sections/          # Page sections (Hero, Products, etc.)
│   ├── ui/                # Reusable UI components
│   └── pages/             # Page components
├── lib/                   # Utility functions and configurations
├── public/                # Static assets
└── styles/                # Global styles
```

## Key Components

- **HeroSection**: Main landing section with background image and CTA
- **HorizontalScrollSection**: Interactive horizontal scrolling showcase
- **BrandLogos**: Animated brand logo carousel
- **ProductGrid**: Dynamic product display with filtering
- **ShopSidebar**: Collapsible navigation sidebar
- **Footer**: Comprehensive footer with newsletter signup

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style

- TypeScript for type safety
- Tailwind CSS for styling
- ESLint for code quality
- Prettier for code formatting

## Deployment

The project is configured for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main branch

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is private and proprietary to FEMFIT.

## Contact

For questions or support, please contact the development team.
