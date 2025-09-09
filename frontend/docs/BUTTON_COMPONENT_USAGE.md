# Button Component Usage Guide

## Overview

The `Button` component is a reusable, square-styled button with hover animations and an arrow icon. It's designed to maintain consistency across your FEMFIT e-commerce platform.

## Component Features

- **Square Design**: Uses `rounded-lg` for modern, clean appearance
- **Hover Animations**: Background color changes and arrow icon appears on hover
- **Responsive**: Arrow icon hidden on small screens (`sm:hidden xm:hidden`)
- **Consistent Styling**: Uses your design system colors and typography

## Usage

### Basic Usage

```tsx
import Button from '@/components/Button';

<Button 
  href="/shop" 
  title="Shop Now" 
/>
```

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `href` | `string` | ✅ | The URL to navigate to |
| `title` | `string` | ✅ | The button text to display |

## Examples

### 1. Hero Section Button
```tsx
<Button 
  href="/curated/dry-season"
  title="SHOP EDITIONS"
/>
```

### 2. Product Showcase Button
```tsx
<Button 
  href={`/products/${product.id}`}
  title="View Details"
/>
```

### 3. MegaMenu Button
```tsx
<Button
  href="/shop?tags=Popular"
  title="Shop Now"
/>
```

### 4. Category Navigation
```tsx
<Button
  href="/shop/women"
  title="Women's Collection"
/>
```

## Styling Details

### Default Styles
- **Border**: `border-[#21212199]` (semi-transparent black)
- **Background**: Transparent by default
- **Text**: `text-secondry` color
- **Font**: `font-NeueMontreal` with `small-text` size
- **Padding**: `py-[3px] px-[12px]`

### Hover States
- **Background**: Changes to `bg-secondry`
- **Text**: Changes to `text-background`
- **Arrow Icon**: Scales from 0 to 100% (`scale-0 group-hover:scale-100`)

### Arrow Icon
- **Size**: 33x33px
- **Icon**: `ArrowUpRight` from Lucide React
- **Responsive**: Hidden on small screens (`sm:hidden xm:hidden`)

## Implementation Examples

### Replacing Existing Buttons

#### Before (Custom Button):
```tsx
<Link
  href="/shop"
  className="group relative flex h-12 w-[220px] items-center justify-between border-2 border-black rounded-lg bg-black font-medium text-white hover:bg-gray-800 transition-all duration-300"
>
  <span className="pl-4 text-white">SHOP EDITIONS</span>
  <div className="relative h-9 w-9 overflow-hidden bg-white rounded-full mr-1">
    {/* Complex arrow animation */}
  </div>
</Link>
```

#### After (Button Component):
```tsx
<Button 
  href="/shop"
  title="SHOP EDITIONS"
/>
```

### Integration with Animations

The Button component works seamlessly with Framer Motion animations:

```tsx
<motion.div variants={buttonVariants}>
  <Button 
    href="/shop"
    title="Shop Now"
  />
</motion.div>
```

## Best Practices

### 1. Consistent Usage
Use the Button component for all text-based navigation buttons to maintain design consistency.

### 2. Appropriate Text
Keep button text concise and action-oriented:
- ✅ "Shop Now"
- ✅ "View Details"
- ✅ "Learn More"
- ❌ "Click here to go to the shop page and browse our products"

### 3. Meaningful URLs
Ensure the `href` prop points to relevant, existing pages:
```tsx
// ✅ Good
<Button href="/shop/women" title="Women's Collection" />

// ❌ Avoid
<Button href="#" title="Coming Soon" />
```

### 4. Accessibility
The Button component includes proper accessibility features:
- Semantic HTML with `<Link>` component
- Proper focus states
- Screen reader friendly text

## Customization

### Modifying Colors
To change the button colors, update the CSS classes in the component:

```tsx
// In Button.tsx
<div className="rounded-lg border border-[#21212199] group-hover:bg-secondry py-[3px] px-[12px] cursor-pointer">
```

### Adding Custom Classes
You can extend the component by adding custom classes:

```tsx
// In Button.tsx - add className prop
export default function Button({ href, title, className }: TButtonProps & { className?: string }) {
  return (
    <div className={`flex flex-col pb-[10px] w-fit ${className}`}>
      {/* ... rest of component */}
    </div>
  );
}
```

## Common Use Cases

### 1. Product Cards
```tsx
<div className="product-card">
  <img src={product.image} alt={product.name} />
  <h3>{product.name}</h3>
  <p>{product.price}</p>
  <Button 
    href={`/products/${product.id}`}
    title="View Details"
  />
</div>
```

### 2. Category Sections
```tsx
<div className="category-section">
  <h2>Featured Categories</h2>
  <div className="grid grid-cols-3 gap-4">
    <Button href="/shop/women" title="Women" />
    <Button href="/shop/men" title="Men" />
    <Button href="/shop/accessories" title="Accessories" />
  </div>
</div>
```

### 3. Call-to-Action Sections
```tsx
<div className="cta-section">
  <h2>Discover Our Collection</h2>
  <p>Explore premium fashion and accessories</p>
  <Button 
    href="/shop"
    title="Start Shopping"
  />
</div>
```

## Migration Guide

### Step 1: Import the Component
```tsx
import Button from '@/components/Button';
```

### Step 2: Replace Existing Buttons
Find buttons with similar styling and replace them:

```tsx
// Before
<button className="px-4 py-2 bg-blue-500 text-white rounded">
  Click Me
</button>

// After
<Button 
  href="/target-page"
  title="Click Me"
/>
```

### Step 3: Update Props
Ensure you have both required props:
- `href`: The destination URL
- `title`: The button text

### Step 4: Test Functionality
Verify that:
- Navigation works correctly
- Hover animations function properly
- Responsive behavior is correct
- Accessibility features work

## Troubleshooting

### Common Issues

1. **Button not appearing**: Check that both `href` and `title` props are provided
2. **Styling issues**: Ensure your CSS variables (`secondry`, `background`) are defined
3. **Navigation not working**: Verify the `href` URL is correct and the page exists
4. **Arrow not showing**: Check that the screen size is above the `sm` breakpoint

### Debug Tips

1. **Check console for errors**: Look for missing props or undefined variables
2. **Inspect element**: Verify CSS classes are being applied correctly
3. **Test responsiveness**: Check behavior on different screen sizes
4. **Validate URLs**: Ensure all `href` values point to existing pages

## Performance Considerations

- The Button component is lightweight and optimized
- Uses CSS transitions for smooth animations
- No unnecessary re-renders with proper React patterns
- Compatible with Next.js Link optimization

## Browser Support

- ✅ Modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)
- ✅ CSS Grid and Flexbox support required
- ✅ CSS Custom Properties support required
