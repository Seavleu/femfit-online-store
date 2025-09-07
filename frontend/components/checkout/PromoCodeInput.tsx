'use client';

import { useState, useRef } from 'react';
import { Tag, Check, X, Loader2 } from 'lucide-react';
import gsap from 'gsap';

interface PromoCode {
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  description: string;
}

interface PromoCodeInputProps {
  onApplyPromo: (promo: PromoCode | null) => void;
  appliedPromo?: PromoCode | null;
}

// Mock promo codes
const validPromoCodes: PromoCode[] = [
  { code: 'LUXE10', discount: 10, type: 'percentage', description: '10% off your order' },
  { code: 'WELCOME20', discount: 20, type: 'percentage', description: '20% off for new customers' },
  { code: 'SAVE50', discount: 50, type: 'fixed', description: '$50 off orders over $200' },
  { code: 'FREESHIP', discount: 0, type: 'fixed', description: 'Free shipping' },
];

export default function PromoCodeInput({ onApplyPromo, appliedPromo }: PromoCodeInputProps) {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || status === 'loading') return;

    setStatus('loading');
    setMessage('');

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const foundPromo = validPromoCodes.find(
      promo => promo.code.toLowerCase() === code.trim().toLowerCase()
    );

    if (foundPromo) {
      setStatus('success');
      setMessage(`Promo code applied! ${foundPromo.description}`);
      onApplyPromo(foundPromo);
      setCode('');

      // Success animation
      if (messageRef.current) {
        gsap.fromTo(messageRef.current,
          { scale: 0.9, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' }
        );
      }
    } else {
      setStatus('error');
      setMessage('Invalid promo code. Please try again.');

      // Shake animation for error
      if (inputRef.current) {
        gsap.to(inputRef.current, {
          x: 10,
          duration: 0.1,
          ease: 'power2.inOut',
          yoyo: true,
          repeat: 4
        });
      }
    }

    // Reset status after 3 seconds
    setTimeout(() => {
      setStatus('idle');
      setMessage('');
    }, 3000);
  };

  const handleRemovePromo = () => {
    onApplyPromo(null);
    setStatus('idle');
    setMessage('');
  };

  return (
    <div className="space-y-4">
      {appliedPromo ? (
        <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <Tag className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-green-800">{appliedPromo.code}</p>
              <p className="text-sm text-green-600">{appliedPromo.description}</p>
            </div>
          </div>
          <button
            onClick={handleRemovePromo}
            className="p-2 text-green-600 hover:text-green-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex space-x-3">
            <div className="relative flex-1">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Enter promo code"
                disabled={status === 'loading'}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors disabled:opacity-50"
              />
            </div>
            <button
              type="submit"
              disabled={status === 'loading' || !code.trim()}
              className="px-6 py-3 bg-black text-white font-medium hover:bg-gray-900 transition-colors disabled:opacity-50 flex items-center space-x-2 rounded-lg"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Applying...</span>
                </>
              ) : (
                <span>Apply</span>
              )}
            </button>
          </div>

          {message && (
            <div
              ref={messageRef}
              className={`flex items-center space-x-2 text-sm ${
                status === 'success' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {status === 'success' ? (
                <Check className="w-4 h-4" />
              ) : (
                <X className="w-4 h-4" />
              )}
              <span>{message}</span>
            </div>
          )}
        </form>
      )}

      {/* Available Promo Codes (for demo) */}
      <div className="text-xs text-gray-500">
        <p className="mb-2">Available promo codes for demo:</p>
        <div className="grid grid-cols-2 gap-2">
          {validPromoCodes.map(promo => (
            <button
              key={promo.code}
              onClick={() => setCode(promo.code)}
              className="text-left p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
            >
              <span className="font-mono font-medium">{promo.code}</span>
              <br />
              <span className="text-gray-400">{promo.description}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}