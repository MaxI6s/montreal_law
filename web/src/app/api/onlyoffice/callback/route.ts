import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('ONLYOFFICE Callback received:', body);

    // Status 2 means the document is ready to be saved
    if (body.status === 2) {
      const downloadUrl = body.url;
      console.log('Document ready for download at:', downloadUrl);
      
      // In a real implementation, we would download the file from downloadUrl
      // and save it to our storage (e.g., S3 or local disk).
      // For the hackathon demo, we will just log it.
    }

    return NextResponse.json({ error: 0 });
  } catch (error) {
    console.error('Error in ONLYOFFICE callback:', error);
    return NextResponse.json({ error: 1, message: 'Internal Server Error' }, { status: 500 });
  }
}
