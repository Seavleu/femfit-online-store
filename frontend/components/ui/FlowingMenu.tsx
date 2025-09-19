import React from 'react';
import { useRouter } from 'next/navigation';
import './FlowingMenu.css';

interface SubItem {
  name: string;
  href: string;
}

interface MenuItemProps {
  link: string;
  text: string;
  image: string;
  subItems?: SubItem[];
}

interface FlowingMenuProps {
  items?: MenuItemProps[];
  onClose?: () => void;
  onItemHover?: (item: MenuItemProps | null) => void;
}

const FlowingMenu: React.FC<FlowingMenuProps> = ({ items = [], onClose, onItemHover }) => {
  return (
    <div className="menu-wrap">
      <nav className="menu">
        {items.map((item, idx) => (
          <MenuItem key={idx} {...item} onClose={onClose} onItemHover={onItemHover} />
        ))}
      </nav>
    </div>
  );
};

const MenuItem: React.FC<MenuItemProps & { onClose?: () => void; onItemHover?: (item: MenuItemProps | null) => void }> = ({ link, text, image, subItems, onClose, onItemHover }) => {
  const router = useRouter();
  const itemRef = React.useRef<HTMLDivElement>(null);
  const marqueeRef = React.useRef<HTMLDivElement>(null);
  const marqueeInnerRef = React.useRef<HTMLDivElement>(null);

  // CSS-based animations instead of GSAP

  const distMetric = (x: number, y: number, x2: number, y2: number): number => {
    const xDiff = x - x2;
    const yDiff = y - y2;
    return xDiff * xDiff + yDiff * yDiff;
  };

  const findClosestEdge = (mouseX: number, mouseY: number, width: number, height: number): 'top' | 'bottom' => {
    const topEdgeDist = distMetric(mouseX, mouseY, width / 2, 0);
    const bottomEdgeDist = distMetric(mouseX, mouseY, width / 2, height);
    return topEdgeDist < bottomEdgeDist ? 'top' : 'bottom';
  };

  const handleMouseEnter = (ev: React.MouseEvent<HTMLAnchorElement>) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;
    const edge = findClosestEdge(x, y, rect.width, rect.height);

    // CSS-based animations instead of GSAP
    if (marqueeRef.current && marqueeInnerRef.current) {
      marqueeRef.current.style.transform = `translateY(${edge === 'top' ? '-101%' : '101%'})`;
      marqueeInnerRef.current.style.transform = `translateY(${edge === 'top' ? '101%' : '-101%'})`;
      
      // Trigger animation
      setTimeout(() => {
        if (marqueeRef.current && marqueeInnerRef.current) {
          marqueeRef.current.style.transform = 'translateY(0%)';
          marqueeInnerRef.current.style.transform = 'translateY(0%)';
        }
      }, 10);
    }

    // Show sub-items in right column
    onItemHover?.({ link, text, image, subItems });
  };

  const handleMouseLeave = (ev: React.MouseEvent<HTMLAnchorElement>) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;
    const edge = findClosestEdge(x, y, rect.width, rect.height);

    // CSS-based animations instead of GSAP
    if (marqueeRef.current && marqueeInnerRef.current) {
      marqueeRef.current.style.transform = `translateY(${edge === 'top' ? '-101%' : '101%'})`;
      marqueeInnerRef.current.style.transform = `translateY(${edge === 'top' ? '101%' : '-101%'})`;
    }

    // Let the parent handle the sub-items visibility with proper timing
    // The parent will use onMouseLeave on the container to manage this
  };

  const repeatedMarqueeContent = React.useMemo(() => {
    return Array.from({ length: 4 }).map((_, idx) => (
      <React.Fragment key={idx}>
        <span>{text}</span>
        <div className="marquee__img" style={{ backgroundImage: `url(${image})` }} />
      </React.Fragment>
    ));
  }, [text, image]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(link);
    onClose?.();
  };

  return (
    <div className="menu__item" ref={itemRef}>
      <a 
        className="menu__item-link" 
        href={link} 
        onMouseEnter={handleMouseEnter} 
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        {text}
      </a>
      <div className="marquee" ref={marqueeRef}>
        <div className="marquee__inner-wrap" ref={marqueeInnerRef}>
          <div className="marquee__inner" aria-hidden="true">
            {repeatedMarqueeContent}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlowingMenu;
