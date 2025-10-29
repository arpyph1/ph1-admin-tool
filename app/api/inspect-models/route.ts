import { NextResponse } from 'next/server';
import * as contentful from 'contentful-management';

export async function GET() {
  try {
    const client = contentful.createClient({
      accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN!,
    });

    const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID!);
    const environment = await space.getEnvironment('master');

    const contentTypes = await environment.getContentTypes();

    const models = contentTypes.items
      .filter((ct: any) => ['service', 'caseStudy', 'trends', 'homePage'].includes(ct.sys.id))
      .map((ct: any) => ({
        id: ct.sys.id,
        name: ct.name,
        fields: ct.fields.map((f: any) => ({
          id: f.id,
          name: f.name,
          type: f.type,
          required: f.required || false,
        }))
      }));

    return NextResponse.json({ models });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
