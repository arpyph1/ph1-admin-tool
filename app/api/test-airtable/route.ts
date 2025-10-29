import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const token = process.env.AIRTABLE_ACCESS_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableName = process.env.AIRTABLE_TABLE_NAME || 'Leads from website';

  console.log('Testing Airtable connection...');
  console.log('Has token:', !!token);
  console.log('Base ID:', baseId);
  console.log('Table name:', tableName);

  if (!token || !baseId) {
    return NextResponse.json({ 
      error: 'Missing credentials',
      hasToken: !!token,
      hasBaseId: !!baseId
    }, { status: 500 });
  }

  try {
    const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}?maxRecords=1`;
    console.log('Testing URL:', url);

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', data);

    if (response.ok) {
      return NextResponse.json({ 
        success: true, 
        message: 'Airtable connection works!',
        recordCount: data.records?.length || 0
      });
    } else {
      return NextResponse.json({ 
        error: 'Airtable API error',
        status: response.status,
        details: data
      }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 });
  }
}
