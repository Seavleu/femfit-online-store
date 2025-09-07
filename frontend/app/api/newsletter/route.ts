import { NextRequest, NextResponse } from 'next/server';

interface MailchimpConfig {
  apiKey: string;
  serverPrefix: string;
  listId: string;
}

class MailchimpService {
  private config: MailchimpConfig;

  constructor() {
    this.config = {
      apiKey: process.env.MAILCHIMP_API_KEY || '',
      serverPrefix: process.env.MAILCHIMP_SERVER_PREFIX || 'us1',
      listId: process.env.MAILCHIMP_LIST_ID || '',
    };
  }

  async subscribeEmail(email: string, firstName?: string, lastName?: string) {
    if (!this.config.apiKey || !this.config.listId) {
      throw new Error('Mailchimp configuration missing');
    }

    const url = `https://${this.config.serverPrefix}.api.mailchimp.com/3.0/lists/${this.config.listId}/members`;
    
    const data = {
      email_address: email,
      status: 'subscribed',
      merge_fields: {
        FNAME: firstName || '',
        LNAME: lastName || '',
      },
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to subscribe to newsletter');
    }

    return await response.json();
  }
}

const mailchimpService = new MailchimpService();

export async function POST(request: NextRequest) {
  try {
    const { email, firstName, lastName } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // For demo purposes, simulate success
    if (process.env.NODE_ENV === 'development') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return NextResponse.json({ 
        success: true, 
        message: 'Successfully subscribed to newsletter' 
      });
    }

    // In production, use actual Mailchimp API
    await mailchimpService.subscribeEmail(email, firstName, lastName);

    return NextResponse.json({ 
      success: true, 
      message: 'Successfully subscribed to newsletter' 
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to subscribe to newsletter' 
      },
      { status: 500 }
    );
  }
}