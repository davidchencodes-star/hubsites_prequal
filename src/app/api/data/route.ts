import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { id, deployType, parentDomain, parentIP } = await request.json()

    const response = await fetch(`${process.env.API_BASE_URL}/ca/soft?id=${id}&deployType=${deployType}&parentDomain=${parentDomain}&parentIP=${parentIP}`);

    const data = await response.json();
    if (data.error == 0) {
      return NextResponse.json({ success: true, data: data }, { status: 200 });
    } else {
      return NextResponse.json({ success: false, msg: data.msg }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, msg: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

