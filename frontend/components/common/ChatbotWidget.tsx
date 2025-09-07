'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import gsap from 'gsap';
import { useTranslation } from '@/lib/i18n';
import { PerformanceMonitor } from '@/lib/performance';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const performanceMonitor = PerformanceMonitor.getInstance();

export default function ChatbotWidget() {
  const { t, language } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);

  // Predefined responses for common questions
  const responses = {
    en: {
      greeting: "Hello! I'm here to help you with your orders and questions. How can I assist you today?",
      orderStatus: "To check your order status, please provide your order number (e.g., FF000001).",
      delivery: "We typically deliver within 1-2 business days in Phnom Penh and 2-3 days in other provinces.",
      payment: "We accept ABA PayWay for secure mobile payments. You can pay using any ABA mobile banking app.",
      returns: "We offer a 30-day return policy for unused items in original packaging.",
      contact: "You can reach our customer service at +855 12 345 678 or email support@luxe.com",
      default: "I understand you're asking about that. For detailed assistance, please contact our customer service team."
    },
    km: {
      greeting: "សួស្តី! ខ្ញុំនៅទីនេះដើម្បីជួយអ្នកជាមួយការបញ្ជាទិញ និងសំណួររបស់អ្នក។ តើខ្ញុំអាចជួយអ្នកយ៉ាងណា?",
      orderStatus: "ដើម្បីពិនិត្យស្ថានភាពការបញ្ជាទិញរបស់អ្នក សូមផ្តល់លេខការបញ្ជាទិញ (ឧ. FF000001)។",
      delivery: "យើងធម្មតាដឹកជញ្ជូនក្នុងរយៈពេល ១-២ ថ្ងៃធ្វើការនៅភ្នំពេញ និង ២-៣ ថ្ងៃនៅខេត្តផ្សេងៗ។",
      payment: "យើងទទួលយក ABA PayWay សម្រាប់ការបង់ប្រាក់តាមទូរស័ព្ទដោយសុវត្ថិភាព។ អ្នកអាចបង់ប្រាក់ដោយប្រើកម្មវិធី ABA mobile banking។",
      returns: "យើងផ្តល់នូវគោលការណ៍ត្រឡប់ទំនិញក្នុងរយៈពេល ៣០ ថ្ងៃ សម្រាប់ទំនិញដែលមិនបានប្រើប្រាស់នៅក្នុងកញ្ចប់ដើម។",
      contact: "អ្នកអាចទាក់ទងសេវាកម្មអតិថិជនរបស់យើងតាម +855 12 345 678 ឬអ៊ីមែល support@luxe.com",
      default: "ខ្ញុំយល់អំពីសំណួររបស់អ្នក។ សម្រាប់ជំនួយលម្អិត សូមទាក់ទងក្រុមសេវាកម្មអតិថិជនរបស់យើង។"
    }
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add welcome message
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        text: responses[language].greeting,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, language]);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    
    if (!isOpen) {
      // Track chatbot open
      if (window.gtag) {
        window.gtag('event', 'chatbot_open', {
          event_category: 'User Interaction'
        });
      }
    }
  };

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    const currentResponses = responses[language];

    // Order status inquiry
    if (message.includes('order') || message.includes('status') || message.includes('បញ្ជាទិញ')) {
      return currentResponses.orderStatus;
    }
    
    // Delivery inquiry
    if (message.includes('delivery') || message.includes('shipping') || message.includes('ដឹកជញ្ជូន')) {
      return currentResponses.delivery;
    }
    
    // Payment inquiry
    if (message.includes('payment') || message.includes('pay') || message.includes('បង់ប្រាក់')) {
      return currentResponses.payment;
    }
    
    // Returns inquiry
    if (message.includes('return') || message.includes('refund') || message.includes('ត្រឡប់')) {
      return currentResponses.returns;
    }
    
    // Contact inquiry
    if (message.includes('contact') || message.includes('support') || message.includes('ទាក់ទង')) {
      return currentResponses.contact;
    }

    return currentResponses.default;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const startTime = performance.now();
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot thinking time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    // Get bot response
    const botResponse = getBotResponse(inputValue);
    
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: botResponse,
      sender: 'bot',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMessage]);
    setIsTyping(false);

    // Track response time
    const responseTime = performance.now() - startTime;
    performanceMonitor.trackChatbotResponse(responseTime);

    // Track chatbot interaction
    if (window.gtag) {
      window.gtag('event', 'chatbot_interaction', {
        event_category: 'User Interaction',
        event_label: language,
        value: Math.round(responseTime)
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={handleToggle}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-black text-white rounded-full shadow-lg hover:bg-gray-800 transition-all duration-300 hover:scale-110 flex items-center justify-center"
        aria-label={t('chatbot.open', 'Open chat')}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          ref={chatRef}
          className="fixed bottom-24 right-6 z-40 w-80 h-96 bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="bg-black text-white p-4 flex items-center space-x-3">
            <div className="w-8 h-8 bg-luxury-gold rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-black" />
            </div>
            <div>
              <h3 className="font-medium">FEMFIT Assistant</h3>
              <p className="text-xs text-gray-300">
                {t('chatbot.online', 'Online now')}
              </p>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={messagesRef}
            className="flex-1 p-4 overflow-y-auto space-y-4"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className="flex items-start space-x-2 max-w-[80%]">
                  {message.sender === 'bot' && (
                    <div className="w-6 h-6 bg-luxury-gold rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-3 h-3 text-black" />
                    </div>
                  )}
                  <div
                    className={`p-3 rounded-2xl ${
                      message.sender === 'user'
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-900'
                    } ${language === 'km' ? 'khmer-text' : ''}`}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                  {message.sender === 'user' && (
                    <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <User className="w-3 h-3 text-gray-600" />
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-luxury-gold rounded-full flex items-center justify-center">
                    <Bot className="w-3 h-3 text-black" />
                  </div>
                  <div className="bg-gray-100 p-3 rounded-2xl">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t('chatbot.placeholder', 'Type your message...')}
                className={`flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors text-sm ${
                  language === 'km' ? 'khmer-text' : ''
                }`}
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="p-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}