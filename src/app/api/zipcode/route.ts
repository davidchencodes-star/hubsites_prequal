import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const response = await fetch(`${process.env.API_BASE_URL}/ca/soft?id=${body.id}&zip=${body.zip}`);
    const data = await response.json();

    if (data.error == 0) {
      return NextResponse.json({ success: true, content: data }, { status: 200 });
    } else {
      return NextResponse.json({ success: false, content: data, msg: data.msg }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        msg: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 400 }
    )
  }
}

