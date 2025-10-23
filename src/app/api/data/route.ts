import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { id, deployType, parentDomain, parentIP } = await request.json()
    console.log('API Data Request:', { id, deployType, parentDomain, parentIP })

    // Build URL with query parameters
    const url = new URL(`${process.env.API_BASE_URL}/ca/soft`)
    url.searchParams.append('id', id || '')
    if (deployType) url.searchParams.append('deployType', deployType)
    if (parentDomain) url.searchParams.append('parentDomain', parentDomain)
    if (parentIP) url.searchParams.append('parentIP', parentIP)

    console.log('Fetching from:', url.toString())

    // Send POST request to the API (matching PHP behavior)
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({})
    });

    console.log('API Response Status:', response.status)

    const data = await response.json();
    console.log('API Response Data:', data)

    if (data.error == 0) {
      return NextResponse.json({ success: true, data: data }, { status: 200 });
    } else {
      return NextResponse.json({ success: false, msg: data.msg }, { status: 500 });
    }
  } catch (error) {
    console.error('API Data Error:', error)
    return NextResponse.json({ 
      success: false, 
      msg: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

