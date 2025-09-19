'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Settings,
  Save,
  RefreshCw,
  Globe,
  Mail,
  CreditCard,
  Shield,
  Database,
  Bell,
  Palette,
  Users,
  Package,
  ShoppingCart,
  Eye,
  Lock,
  Key,
  Server,
  Cloud,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react'

interface SettingsCategory {
  id: string
  name: string
  description: string
  icon: any
  settings: SettingItem[]
}

interface SettingItem {
  id: string
  name: string
  description: string
  type: 'text' | 'email' | 'password' | 'number' | 'boolean' | 'select' | 'textarea' | 'url'
  value: any
  required: boolean
  options?: { label: string; value: string }[]
  validation?: {
    min?: number
    max?: number
    pattern?: string
    message?: string
  }
}

export default function SettingsConfiguration() {
  const [settings, setSettings] = useState<SettingsCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeCategory, setActiveCategory] = useState('general')
  const [hasChanges, setHasChanges] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')

  // Mock settings data - in production, this would come from API
  useEffect(() => {
    const mockSettings: SettingsCategory[] = [
      {
        id: 'general',
        name: 'General Settings',
        description: 'Basic store configuration and information',
        icon: Settings,
        settings: [
          {
            id: 'store_name',
            name: 'Store Name',
            description: 'The name of your store',
            type: 'text',
            value: 'FEMFIT',
            required: true,
            validation: { min: 2, max: 50 }
          },
          {
            id: 'store_description',
            name: 'Store Description',
            description: 'Brief description of your store',
            type: 'textarea',
            value: 'Premium fitness gear and activewear for the modern athlete',
            required: false
          },
          {
            id: 'store_email',
            name: 'Store Email',
            description: 'Primary contact email for your store',
            type: 'email',
            value: 'info@femfit.com',
            required: true
          },
          {
            id: 'store_phone',
            name: 'Store Phone',
            description: 'Primary contact phone number',
            type: 'text',
            value: '+1 (555) 123-4567',
            required: false
          },
          {
            id: 'store_address',
            name: 'Store Address',
            description: 'Physical store address',
            type: 'textarea',
            value: '123 Fitness Street\nNew York, NY 10001\nUnited States',
            required: false
          },
          {
            id: 'timezone',
            name: 'Timezone',
            description: 'Store timezone for order processing',
            type: 'select',
            value: 'America/New_York',
            required: true,
            options: [
              { label: 'Eastern Time (ET)', value: 'America/New_York' },
              { label: 'Central Time (CT)', value: 'America/Chicago' },
              { label: 'Mountain Time (MT)', value: 'America/Denver' },
              { label: 'Pacific Time (PT)', value: 'America/Los_Angeles' }
            ]
          },
          {
            id: 'currency',
            name: 'Default Currency',
            description: 'Primary currency for your store',
            type: 'select',
            value: 'USD',
            required: true,
            options: [
              { label: 'US Dollar (USD)', value: 'USD' },
              { label: 'Euro (EUR)', value: 'EUR' },
              { label: 'British Pound (GBP)', value: 'GBP' },
              { label: 'Canadian Dollar (CAD)', value: 'CAD' }
            ]
          }
        ]
      },
      {
        id: 'appearance',
        name: 'Appearance',
        description: 'Store theme, colors, and visual settings',
        icon: Palette,
        settings: [
          {
            id: 'primary_color',
            name: 'Primary Color',
            description: 'Main brand color for your store',
            type: 'text',
            value: '#000000',
            required: true
          },
          {
            id: 'secondary_color',
            name: 'Secondary Color',
            description: 'Secondary brand color',
            type: 'text',
            value: '#666666',
            required: false
          },
          {
            id: 'accent_color',
            name: 'Accent Color',
            description: 'Accent color for highlights and CTAs',
            type: 'text',
            value: '#FF6B35',
            required: false
          },
          {
            id: 'logo_url',
            name: 'Logo URL',
            description: 'URL to your store logo',
            type: 'url',
            value: 'https://femfit.com/logo.png',
            required: false
          },
          {
            id: 'favicon_url',
            name: 'Favicon URL',
            description: 'URL to your store favicon',
            type: 'url',
            value: 'https://femfit.com/favicon.ico',
            required: false
          },
          {
            id: 'enable_dark_mode',
            name: 'Enable Dark Mode',
            description: 'Allow customers to switch to dark mode',
            type: 'boolean',
            value: true,
            required: false
          }
        ]
      },
      {
        id: 'payment',
        name: 'Payment Settings',
        description: 'Payment gateway and processing configuration',
        icon: CreditCard,
        settings: [
          {
            id: 'payment_gateway',
            name: 'Payment Gateway',
            description: 'Primary payment processor',
            type: 'select',
            value: 'stripe',
            required: true,
            options: [
              { label: 'Stripe', value: 'stripe' },
              { label: 'PayPal', value: 'paypal' },
              { label: 'Square', value: 'square' },
              { label: 'Authorize.Net', value: 'authorize_net' }
            ]
          },
          {
            id: 'stripe_publishable_key',
            name: 'Stripe Publishable Key',
            description: 'Your Stripe publishable key',
            type: 'text',
            value: 'pk_test_...',
            required: false
          },
          {
            id: 'stripe_secret_key',
            name: 'Stripe Secret Key',
            description: 'Your Stripe secret key (encrypted)',
            type: 'password',
            value: 'sk_test_...',
            required: false
          },
          {
            id: 'paypal_client_id',
            name: 'PayPal Client ID',
            description: 'Your PayPal client ID',
            type: 'text',
            value: '',
            required: false
          },
          {
            id: 'enable_test_mode',
            name: 'Enable Test Mode',
            description: 'Use test payment credentials',
            type: 'boolean',
            value: true,
            required: false
          },
          {
            id: 'supported_currencies',
            name: 'Supported Currencies',
            description: 'Currencies accepted by your store',
            type: 'text',
            value: 'USD, EUR, GBP, CAD',
            required: false
          }
        ]
      },
      {
        id: 'shipping',
        name: 'Shipping Settings',
        description: 'Shipping methods, rates, and delivery options',
        icon: Package,
        settings: [
          {
            id: 'default_shipping_method',
            name: 'Default Shipping Method',
            description: 'Primary shipping method for orders',
            type: 'select',
            value: 'standard',
            required: true,
            options: [
              { label: 'Standard Shipping', value: 'standard' },
              { label: 'Express Shipping', value: 'express' },
              { label: 'Overnight Shipping', value: 'overnight' },
              { label: 'Free Shipping', value: 'free' }
            ]
          },
          {
            id: 'free_shipping_threshold',
            name: 'Free Shipping Threshold',
            description: 'Minimum order amount for free shipping',
            type: 'number',
            value: 75,
            required: false,
            validation: { min: 0 }
          },
          {
            id: 'shipping_zones',
            name: 'Shipping Zones',
            description: 'Regions where you ship products',
            type: 'textarea',
            value: 'United States, Canada, United Kingdom, European Union',
            required: false
          },
          {
            id: 'handling_fee',
            name: 'Handling Fee',
            description: 'Additional handling fee per order',
            type: 'number',
            value: 0,
            required: false,
            validation: { min: 0 }
          },
          {
            id: 'enable_tracking',
            name: 'Enable Order Tracking',
            description: 'Allow customers to track their orders',
            type: 'boolean',
            value: true,
            required: false
          }
        ]
      },
      {
        id: 'email',
        name: 'Email Settings',
        description: 'Email configuration and notification preferences',
        icon: Mail,
        settings: [
          {
            id: 'smtp_host',
            name: 'SMTP Host',
            description: 'Email server hostname',
            type: 'text',
            value: 'smtp.gmail.com',
            required: true
          },
          {
            id: 'smtp_port',
            name: 'SMTP Port',
            description: 'Email server port',
            type: 'number',
            value: 587,
            required: true,
            validation: { min: 1, max: 65535 }
          },
          {
            id: 'smtp_username',
            name: 'SMTP Username',
            description: 'Email server username',
            type: 'text',
            value: 'noreply@femfit.com',
            required: true
          },
          {
            id: 'smtp_password',
            name: 'SMTP Password',
            description: 'Email server password',
            type: 'password',
            value: '••••••••',
            required: true
          },
          {
            id: 'from_email',
            name: 'From Email',
            description: 'Default sender email address',
            type: 'email',
            value: 'noreply@femfit.com',
            required: true
          },
          {
            id: 'from_name',
            name: 'From Name',
            description: 'Default sender name',
            type: 'text',
            value: 'FEMFIT Store',
            required: true
          },
          {
            id: 'enable_order_emails',
            name: 'Enable Order Emails',
            description: 'Send emails for order confirmations and updates',
            type: 'boolean',
            value: true,
            required: false
          },
          {
            id: 'enable_marketing_emails',
            name: 'Enable Marketing Emails',
            description: 'Send promotional and marketing emails',
            type: 'boolean',
            value: true,
            required: false
          }
        ]
      },
      {
        id: 'security',
        name: 'Security Settings',
        description: 'Security configuration and access control',
        icon: Shield,
        settings: [
          {
            id: 'enable_2fa',
            name: 'Enable Two-Factor Authentication',
            description: 'Require 2FA for admin accounts',
            type: 'boolean',
            value: true,
            required: false
          },
          {
            id: 'session_timeout',
            name: 'Session Timeout (minutes)',
            description: 'How long admin sessions last',
            type: 'number',
            value: 60,
            required: true,
            validation: { min: 5, max: 480 }
          },
          {
            id: 'max_login_attempts',
            name: 'Max Login Attempts',
            description: 'Maximum failed login attempts before lockout',
            type: 'number',
            value: 5,
            required: true,
            validation: { min: 3, max: 10 }
          },
          {
            id: 'enable_https',
            name: 'Force HTTPS',
            description: 'Redirect all traffic to HTTPS',
            type: 'boolean',
            value: true,
            required: false
          },
          {
            id: 'enable_cors',
            name: 'Enable CORS',
            description: 'Allow cross-origin requests',
            type: 'boolean',
            value: false,
            required: false
          },
          {
            id: 'allowed_origins',
            name: 'Allowed Origins',
            description: 'Comma-separated list of allowed origins',
            type: 'textarea',
            value: 'https://femfit.com,https://www.femfit.com',
            required: false
          }
        ]
      },
      {
        id: 'notifications',
        name: 'Notifications',
        description: 'System notifications and alerts configuration',
        icon: Bell,
        settings: [
          {
            id: 'enable_email_notifications',
            name: 'Enable Email Notifications',
            description: 'Send email notifications for important events',
            type: 'boolean',
            value: true,
            required: false
          },
          {
            id: 'enable_sms_notifications',
            name: 'Enable SMS Notifications',
            description: 'Send SMS notifications for critical alerts',
            type: 'boolean',
            value: false,
            required: false
          },
          {
            id: 'low_stock_threshold',
            name: 'Low Stock Threshold',
            description: 'Alert when inventory falls below this level',
            type: 'number',
            value: 10,
            required: true,
            validation: { min: 1, max: 100 }
          },
          {
            id: 'order_notification_email',
            name: 'Order Notification Email',
            description: 'Email address for new order notifications',
            type: 'email',
            value: 'orders@femfit.com',
            required: false
          },
          {
            id: 'enable_daily_reports',
            name: 'Enable Daily Reports',
            description: 'Send daily sales and inventory reports',
            type: 'boolean',
            value: true,
            required: false
          },
          {
            id: 'enable_weekly_reports',
            name: 'Enable Weekly Reports',
            description: 'Send weekly performance reports',
            type: 'boolean',
            value: true,
            required: false
          }
        ]
      },
      {
        id: 'integrations',
        name: 'Integrations',
        description: 'Third-party service integrations and APIs',
        icon: Cloud,
        settings: [
          {
            id: 'google_analytics_id',
            name: 'Google Analytics ID',
            description: 'Your Google Analytics tracking ID',
            type: 'text',
            value: 'GA-XXXXXXXXX',
            required: false
          },
          {
            id: 'facebook_pixel_id',
            name: 'Facebook Pixel ID',
            description: 'Your Facebook Pixel tracking ID',
            type: 'text',
            value: '',
            required: false
          },
          {
            id: 'stripe_webhook_secret',
            name: 'Stripe Webhook Secret',
            description: 'Secret for Stripe webhook verification',
            type: 'password',
            value: 'whsec_...',
            required: false
          },
          {
            id: 'mailchimp_api_key',
            name: 'Mailchimp API Key',
            description: 'API key for Mailchimp integration',
            type: 'password',
            value: '••••••••',
            required: false
          },
          {
            id: 'enable_google_analytics',
            name: 'Enable Google Analytics',
            description: 'Track website analytics with Google Analytics',
            type: 'boolean',
            value: true,
            required: false
          },
          {
            id: 'enable_facebook_tracking',
            name: 'Enable Facebook Tracking',
            description: 'Track conversions with Facebook Pixel',
            type: 'boolean',
            value: false,
            required: false
          }
        ]
      }
    ]

    // Simulate API call
    setTimeout(() => {
      setSettings(mockSettings)
      setIsLoading(false)
    }, 1000)
  }, [])

  const handleSettingChange = (categoryId: string, settingId: string, value: any) => {
    setSettings(prev => prev.map(category => 
      category.id === categoryId 
        ? {
            ...category,
            settings: category.settings.map(setting =>
              setting.id === settingId 
                ? { ...setting, value }
                : setting
            )
          }
        : category
    ))
    setHasChanges(true)
  }

  const handleSave = async () => {
    setIsSaving(true)
    setSaveStatus('saving')
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setSaveStatus('success')
      setHasChanges(false)
      
      // Reset success status after 3 seconds
      setTimeout(() => setSaveStatus('idle'), 3000)
    } catch (error) {
      console.error('Save error:', error)
      setSaveStatus('error')
      
      // Reset error status after 3 seconds
      setTimeout(() => setSaveStatus('idle'), 3000)
    } finally {
      setIsSaving(false)
    }
  }

  const renderSettingInput = (setting: SettingItem, categoryId: string) => {
    const commonProps = {
      value: setting.value,
      onChange: (e: any) => handleSettingChange(categoryId, setting.id, e.target.value),
      className: "w-full"
    }

    switch (setting.type) {
      case 'text':
      case 'email':
      case 'url':
        return <Input {...commonProps} type={setting.type} />
      case 'password':
        return <Input {...commonProps} type="password" />
      case 'number':
        return <Input {...commonProps} type="number" min={setting.validation?.min} max={setting.validation?.max} />
      case 'textarea':
        return (
          <textarea
            {...commonProps}
            rows={3}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-900"
          />
        )
      case 'boolean':
        return (
          <Checkbox
            checked={setting.value}
            onCheckedChange={(checked) => handleSettingChange(categoryId, setting.id, checked)}
          />
        )
      case 'select':
        return (
          <select
            {...commonProps}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-900"
          >
            {setting.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )
      default:
        return <Input {...commonProps} />
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2">Loading settings...</p>
          </div>
        </div>
      </div>
    )
  }

  const activeCategoryData = settings.find(cat => cat.id === activeCategory)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Settings & Configuration</h2>
          <p className="text-gray-600">Manage your store settings and preferences</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!hasChanges || isSaving}
            className={saveStatus === 'success' ? 'bg-green-600' : saveStatus === 'error' ? 'bg-red-600' : ''}
          >
            {isSaving ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : saveStatus === 'success' ? (
              <CheckCircle className="w-4 h-4 mr-2" />
            ) : saveStatus === 'error' ? (
              <XCircle className="w-4 h-4 mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isSaving ? 'Saving...' : saveStatus === 'success' ? 'Saved!' : saveStatus === 'error' ? 'Error' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Settings Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Categories</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <nav className="space-y-1">
                {settings.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full text-left px-4 py-3 flex items-center space-x-3 transition-colors ${
                      activeCategory === category.id
                        ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <category.icon className="w-5 h-5" />
                    <div>
                      <div className="font-medium">{category.name}</div>
                      <div className="text-sm text-gray-500">{category.description}</div>
                    </div>
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          {activeCategoryData && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <activeCategoryData.icon className="w-6 h-6 mr-2" />
                  {activeCategoryData.name}
                </CardTitle>
                <p className="text-gray-600">{activeCategoryData.description}</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {activeCategoryData.settings.map((setting) => (
                  <div key={setting.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">
                        {setting.name}
                        {setting.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      {setting.type === 'boolean' && (
                        <div className="flex items-center space-x-2">
                          {renderSettingInput(setting, activeCategoryData.id)}
                        </div>
                      )}
                    </div>
                    
                    {setting.type !== 'boolean' && (
                      <div>
                        {renderSettingInput(setting, activeCategoryData.id)}
                      </div>
                    )}
                    
                    <p className="text-xs text-gray-500">{setting.description}</p>
                    
                    {setting.validation && (
                      <div className="text-xs text-gray-400">
                        {setting.validation.min && `Min: ${setting.validation.min}`}
                        {setting.validation.max && ` Max: ${setting.validation.max}`}
                        {setting.validation.pattern && ` Pattern: ${setting.validation.pattern}`}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Save Status */}
      {saveStatus !== 'idle' && (
        <Card className={saveStatus === 'success' ? 'bg-green-50 border-green-200' : saveStatus === 'error' ? 'bg-red-50 border-red-200' : ''}>
          <CardContent className="py-4">
            <div className="flex items-center space-x-2">
              {saveStatus === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : saveStatus === 'error' ? (
                <XCircle className="w-5 h-5 text-red-600" />
              ) : (
                <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
              )}
              <span className={saveStatus === 'success' ? 'text-green-800' : saveStatus === 'error' ? 'text-red-800' : 'text-blue-800'}>
                {saveStatus === 'success' ? 'Settings saved successfully!' : 
                 saveStatus === 'error' ? 'Failed to save settings. Please try again.' : 
                 'Saving settings...'}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
