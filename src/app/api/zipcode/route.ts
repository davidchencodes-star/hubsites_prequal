import { NextRequest, NextResponse } from 'next/server'
import { logit, logError } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    logit('Zipcode Request:', body)

    // Build URL with query parameters
    const url = new URL(`${process.env.API_BASE_URL}/ca/soft`)
    url.searchParams.append('id', body.id || '')
    url.searchParams.append('zip', body.zip || '')

    logit('Fetching from:', url.toString())

    // Send POST request to the API (matching PHP behavior)
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({})
    });

    logit('Zipcode Response Status:', response.status)

    const data = await response.json();
    logit('Zipcode Response Data:', data)

    if (data.error == 0) {
      return NextResponse.json({ success: true, content: data }, { status: 200 });
    } else {
      return NextResponse.json({ success: false, content: data, msg: data.msg }, { status: 400 });
    }
  } catch (error) {
    logError('Zipcode Error:', error)
    return NextResponse.json(
      {
        success: false,
        msg: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 400 }
    )
  }
}

