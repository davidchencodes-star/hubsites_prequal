import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { logit, logError } from '@/lib/logger'

// Phone number formatter (matches PHP formatPhoneNumber)
function formatPhoneNumber(phone: string): string {
  if (!phone) return 'N/A';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `${cleaned.substring(0, 3)}-${cleaned.substring(3, 6)}-${cleaned.substring(6)}`;
  }
  return phone;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const recaptcha = body.recaptcha;

    // Validate reCAPTCHA
    const recaptchaResponse = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptcha}`
    });

    const recaptchaData = await recaptchaResponse.json();
    
    if (!recaptchaData.success) {
      return NextResponse.json({ 
        success: false, 
        message: 'Error! The security token has expired or you are not a human.' 
      }, { status: 400 });
    }

    if (recaptchaData.score <= 0.5) {
      return NextResponse.json({ 
        success: false, 
        message: 'There was a problem with your submission, please try again.' 
      }, { status: 400 });
    }

    // Extract and format data
    const dealerName = body.dealerName || 'N/A';
    const dealerPhone = body.dealerPhone || 'N/A';
    const adfEmail = body.adfEmail || 'N/A';
    const adfEmails = body.adfEmails || '';
    const contactEmail = body.contactEmail || '';
    
    const firstName = body.firstName || 'N/A';
    const middleName = body.MI || 'N/A';
    const lastName = body.lastName || 'N/A';
    const fullName = [body.firstName, body.MI, body.lastName].filter(Boolean).join(' ');
    const suffix = body.suffix || 'N/A';
    const address = body.address || 'N/A';
    const zip = body.zip || 'N/A';
    const city = body.city || 'N/A';
    const state = body.state || 'N/A';
    const homePhone = formatPhoneNumber(body.homePhone);
    const mobilephone = formatPhoneNumber(body.mobilephone);
    const email = body.email || 'N/A';
    
    const date = new Date();
    const requestYear = date.getFullYear().toString();
    const requestDate = date.toISOString();

    const from = 'eleads@gormg.com';
    const POSTMARK_TOKEN = process.env.POSTMARK_TOKEN || '';

    if (!POSTMARK_TOKEN) {
      logError('POSTMARK_TOKEN not configured');
      return NextResponse.json({ 
        success: false, 
        message: 'Email service not configured' 
      }, { status: 500 });
    }

    const messages: any[] = [];

    // Send contact email (HTML) if contactEmail exists
    if (contactEmail && contactEmail !== '') {
      const contactHtmlPath = path.join(process.cwd(), 'public', 'pages', 'contact.html');
      let contactBody = fs.readFileSync(contactHtmlPath, 'utf8');
      
      contactBody = contactBody.replace(/{{dealerName}}/g, dealerName);
      contactBody = contactBody.replace(/{{fullName}}/g, fullName);
      contactBody = contactBody.replace(/{{mobilephone}}/g, mobilephone);
      contactBody = contactBody.replace(/{{email}}/g, email);
      contactBody = contactBody.replace(/{{address}}/g, address);
      contactBody = contactBody.replace(/{{zip}}/g, zip);
      contactBody = contactBody.replace(/{{city}}/g, city);
      contactBody = contactBody.replace(/{{state}}/g, state);
      contactBody = contactBody.replace(/{{requestYear}}/g, requestYear);

      messages.push({
        To: contactEmail,
        From: `no-reply<${from}>`,
        Subject: 'Get My Auto Lead From Prequal App',
        HtmlBody: contactBody
      });
      messages.push({
        To: 'sergino@getmyauto.com',
        From: `no-reply<${from}>`,
        Subject: 'Get My Auto Lead From Prequal App',
        HtmlBody: contactBody
      });
    }

    // Send ADF email (XML/Text)
    const adfRecipients = [adfEmail];
    if (adfEmails !== '') {
      const emails = adfEmails.split(',').map((e: string) => e.trim()).filter(Boolean);
      adfRecipients.push(...emails);
    }

    const adfXmlPath = path.join(process.cwd(), 'public', 'pages', 'adf.xml');
    let adfBody = fs.readFileSync(adfXmlPath, 'utf8');
    
    adfBody = adfBody.replace(/{{dealerName}}/g, dealerName);
    adfBody = adfBody.replace(/{{dealerPhone}}/g, formatPhoneNumber(dealerPhone));
    adfBody = adfBody.replace(/{{firstName}}/g, firstName);
    adfBody = adfBody.replace(/{{middleName}}/g, middleName);
    adfBody = adfBody.replace(/{{lastName}}/g, lastName);
    adfBody = adfBody.replace(/{{suffix}}/g, suffix);
    adfBody = adfBody.replace(/{{address}}/g, address);
    adfBody = adfBody.replace(/{{zip}}/g, zip);
    adfBody = adfBody.replace(/{{city}}/g, city);
    adfBody = adfBody.replace(/{{state}}/g, state);
    adfBody = adfBody.replace(/{{homePhone}}/g, homePhone);
    adfBody = adfBody.replace(/{{mobilephone}}/g, mobilephone);
    adfBody = adfBody.replace(/{{email}}/g, email);
    adfBody = adfBody.replace(/{{requestDate}}/g, requestDate);

    // Add ADF emails for each recipient
    adfRecipients.forEach(recipient => {
      if (recipient && recipient !== 'N/A') {
        messages.push({
          To: recipient,
          From: `no-reply<${from}>`,
          Subject: 'Get My Auto Lead From Prequal App',
          TextBody: adfBody
        });
      }
    });

    messages.push({
      To: 'sergino@getmyauto.com',
      From: `no-reply<${from}>`,
      Subject: 'Get My Auto Lead From Prequal App',
      TextBody: adfBody
    });

    // Send emails via Postmark
    try {
      const postmarkResponse = await fetch('https://api.postmarkapp.com/email/batch', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Postmark-Server-Token': POSTMARK_TOKEN
        },
        body: JSON.stringify(messages)
      });

      const postmarkData = await postmarkResponse.json();
      logit('Postmark response:', postmarkData);

      if (postmarkResponse.ok) {
        return NextResponse.json({ 
          success: true, 
          message: 'Application submitted successfully' 
        }, { status: 200 });
      } else {
        logError('Postmark error:', postmarkData);
        return NextResponse.json({ 
          success: false, 
          message: 'Failed to send email' 
        }, { status: 500 });
      }
    } catch (emailError) {
      logError('Email sending error:', emailError);
      return NextResponse.json({ 
        success: false, 
        message: 'Failed to send email' 
      }, { status: 500 });
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


