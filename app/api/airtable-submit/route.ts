import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, company, email, message, pageTitle, type } = body;

    console.log('=== AIRTABLE SUBMISSION ===');
    console.log('Received data:', { firstName, lastName, company, email, message, pageTitle, type });

    const airtableToken = process.env.AIRTABLE_ACCESS_TOKEN;
    const airtableBaseId = process.env.AIRTABLE_BASE_ID;
    const airtableTableName = process.env.AIRTABLE_TABLE_NAME || 'Leads from website';

    console.log('Airtable config:', {
      hasToken: !!airtableToken,
      tokenPreview: airtableToken ? airtableToken.substring(0, 10) + '...' : 'MISSING',
      baseId: airtableBaseId || 'MISSING',
      tableName: airtableTableName
    });

    if (!airtableToken || !airtableBaseId) {
      console.error('❌ Airtable credentials missing');
      return NextResponse.json({ 
        error: 'Configuration error - Airtable credentials not set',
        details: {
          hasToken: !!airtableToken,
          hasBaseId: !!airtableBaseId
        }
      }, { status: 500 });
    }

    const airtableUrl = `https://api.airtable.com/v0/${airtableBaseId}/${encodeURIComponent(airtableTableName)}`;
    console.log('Airtable URL:', airtableUrl);

    const fullName = [firstName, lastName].filter(Boolean).join(' ').trim() || 'Unknown';

    const record = {
      fields: {
        'Name': fullName,
        'Email': email,
        'Company': company || '',
        'Message': message || '',
        'Submitted': new Date().toISOString().split('T')[0],
      }
    };

    console.log('Submitting record:', record);

    const response = await fetch(airtableUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${airtableToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(record),
    });

    const data = await response.json();
    console.log('Airtable response status:', response.status);
    console.log('Airtable response data:', data);

    if (!response.ok) {
      console.error('❌ Airtable error:', data);
      return NextResponse.json({ 
        error: 'Failed to submit to Airtable', 
        details: data,
        status: response.status
      }, { status: 500 });
    }

    console.log('✅ Submitted to Airtable:', data.id);
    return NextResponse.json({ success: true, id: data.id });
  } catch (error: any) {
    console.error('❌ Airtable submission error:', error);
    return NextResponse.json({ 
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
