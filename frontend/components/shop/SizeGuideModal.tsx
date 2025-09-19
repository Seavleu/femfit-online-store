'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface SizeGuideModalProps {
  onClose: () => void;
}

const sizeChart = [
  { size: 'XS', chest: '32-34', waist: '24-26', hips: '34-36' },
  { size: 'S', chest: '34-36', waist: '26-28', hips: '36-38' },
  { size: 'M', chest: '36-38', waist: '28-30', hips: '38-40' },
  { size: 'L', chest: '38-40', waist: '30-32', hips: '40-42' },
  { size: 'XL', chest: '40-42', waist: '32-34', hips: '42-44' },
  { size: 'XXL', chest: '42-44', waist: '34-36', hips: '44-46' }
];

export default function SizeGuideModal({ onClose }: SizeGuideModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleClose = () => {
    onClose();
  };

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={handleClose}
    >
      <div
        ref={contentRef}
        className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-playfair font-bold">Size Guide</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="font-space-grotesk font-semibold mb-4">How to Measure</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start space-x-3">
                <span className="w-6 h-6 bg-luxury-gold text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                <div>
                  <strong>Chest:</strong> Measure around the fullest part of your chest, keeping the tape horizontal.
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="w-6 h-6 bg-luxury-gold text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                <div>
                  <strong>Waist:</strong> Measure around your natural waistline, keeping the tape comfortably loose.
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="w-6 h-6 bg-luxury-gold text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                <div>
                  <strong>Hips:</strong> Measure around the fullest part of your hips, keeping the tape horizontal.
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-space-grotesk font-semibold mb-4">Size Chart (inches)</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-space-grotesk font-semibold">Size</th>
                    <th className="text-left py-3 px-4 font-space-grotesk font-semibold">Chest</th>
                    <th className="text-left py-3 px-4 font-space-grotesk font-semibold">Waist</th>
                    <th className="text-left py-3 px-4 font-space-grotesk font-semibold">Hips</th>
                  </tr>
                </thead>
                <tbody>
                  {sizeChart.map((row, index) => (
                    <tr key={row.size} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                      <td className="py-3 px-4 font-medium">{row.size}</td>
                      <td className="py-3 px-4 text-gray-600">{row.chest}</td>
                      <td className="py-3 px-4 text-gray-600">{row.waist}</td>
                      <td className="py-3 px-4 text-gray-600">{row.hips}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-luxury-sand p-4 rounded-lg">
            <h4 className="font-space-grotesk font-semibold mb-2">Need Help?</h4>
            <p className="text-sm text-gray-600">
              If you're between sizes or need assistance with sizing, please contact our customer service team. 
              We're here to help you find the perfect fit.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}