import { NextRequest, NextResponse } from 'next/server'
import { logit, logError } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const recaptcha = body.recaptcha;
    delete body.recaptcha;

    const recaptchaResponse = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptcha}`
    });

    const recaptchaData = await recaptchaResponse.json();
    if (!recaptchaData.success || recaptchaData.score < 0.5) {
      return NextResponse.json({ success: false, message: 'reCAPTCHA verification failed' }, { status: 400 });
    }

    const formData = {
      data: body,
      token: recaptcha
    };

    logit('Submitting data:', formData);

    // Here we would typically send the email through an API
    // For now, we'll just return success
    // In production, this should integrate with your email service
    const response = await fetch(`${process.env.API_BASE_URL}/ca/soft/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();
    logit('Response:', data);
    
    if (data.error == 0 || response.ok) {
      return NextResponse.json({ success: true, message: 'Application submitted successfully' }, { status: 200 });
    } else {
      return NextResponse.json({ success: false, message: data.msg || 'Application submission failed' }, { status: 400 });
    }
  } catch (error) {
    logError('Form submission error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Invalid form data',
        errors: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 400 }
    )
  }
}


