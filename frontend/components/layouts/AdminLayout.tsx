'use client';

import { ReactNode, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();

  useEffect(() => {
    // Add data attribute to body for admin pages
    if (pathname?.startsWith('/admin')) {
      document.body.setAttribute('data-admin', 'true');
      document.body.setAttribute('data-pathname', pathname);
    } else {
      document.body.removeAttribute('data-admin');
      document.body.removeAttribute('data-pathname');
    }

    // Cleanup on unmount
    return () => {
      document.body.removeAttribute('data-admin');
      document.body.removeAttribute('data-pathname');
    };
  }, [pathname]);

  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}
