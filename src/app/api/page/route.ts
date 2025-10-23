import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { page, name, phone, email } = body

    // Read the HTML file from the public/pages directory
    const fs = require('fs')
    const path = require('path')
    const filePath = path.join(process.cwd(), 'public', 'pages', page)
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { success: false, message: 'Page not found' },
        { status: 404 }
      )
    }

    let content = fs.readFileSync(filePath, 'utf8')
    
    // Replace placeholders
    content = content.replace(/{{DEALER_NAME}}/g, name || 'N/A')
    content = content.replace(/{{DEALER_PHONE}}/g, phone || 'N/A')
    content = content.replace(/{{ADF_EMAIL}}/g, email || 'N/A')
    content = content.replace(/{{DATE}}/g, new Date().toLocaleDateString())

    return NextResponse.json(
      { success: true, content: content },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 400 }
    )
  }
}

