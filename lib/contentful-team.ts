import { Document } from '@contentful/rich-text-types';
import { createClient, Entry } from 'contentful';

export interface TeamMember {
  key: string;
  name: string;
  expertise: string;
  experience: string;
  bio: Document;
  bioPlainText: string;
  photo?: {
    url: string;
    title: string;
  };
  metaHtml?: string;
  carouselPriority?: number;
  ph1Url: string;
}

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
});

function extractPlainTextFromRichText(richText: Document): string {
  if (!richText || !richText.content) return '';
  
  let text = '';
  
  function traverse(node: any) {
    if (node.nodeType === 'text') {
      text += node.value;
    }
    if (node.content) {
      node.content.forEach(traverse);
    }
  }
  
  richText.content.forEach(traverse);
  return text.trim();
}

function mapTeamMember(entry: Entry<any>): TeamMember {
  const fields = entry.fields;
  
  return {
    key: fields.key,
    name: fields.name || fields.Name,
    expertise: fields.expertise || fields.Expertise || '',
    experience: fields.experience || fields.Experience || '',
    bio: fields.bio || fields.Bio,
    bioPlainText: extractPlainTextFromRichText(fields.bio || fields.Bio),
    photo: (fields.photo || fields.Photo) ? {
      url: `https:${(fields.photo || fields.Photo).fields.file.url}`,
      title: (fields.photo || fields.Photo).fields.title || fields.name || fields.Name,
    } : undefined,
    metaHtml: fields.metaHtml || fields['meta (HTML)'],
    carouselPriority: fields.carouselPriority || fields['Carousel priority'],
    ph1Url: `https://ph1.ca/team/${fields.key}`,
  };
}

export async function getAllTeamMembers(): Promise<TeamMember[]> {
  try {
    const entries = await client.getEntries<any>({
      content_type: 'teamMember',
      order: 'fields.carouselPriority',
    });

    return entries.items.map(entry => mapTeamMember(entry));
  } catch (error) {
    console.error('Error fetching team members from Contentful:', error);
    return [];
  }
}

export async function getTeamMember(key: string): Promise<TeamMember | null> {
  try {
    const entries = await client.getEntries<any>({
      content_type: 'teamMember',
      'fields.key': key,
      limit: 1,
    });

    if (entries.items.length === 0) {
      return null;
    }

    return mapTeamMember(entries.items[0]);
  } catch (error) {
    console.error(`Error fetching team member ${key}:`, error);
    return null;
  }
}

export function formatTeamContextForAI(teamMembers: TeamMember[]): string {
  if (teamMembers.length === 0) {
    return 'No team member information available.';
  }

  return `
PH1 TEAM MEMBERS (use this accurate information from Contentful):

${teamMembers.map(member => `
- ${member.name}
  Key: ${member.key}
  URL: ${member.ph1Url}
  Expertise: ${member.expertise}
  Experience: ${member.experience}
  Bio: ${member.bioPlainText.substring(0, 250)}${member.bioPlainText.length > 250 ? '...' : ''}
`).join('\n')}

CRITICAL INSTRUCTIONS FOR TEAM MEMBERS:
1. Always use exact names as listed above (correct spelling)
2. Always link to ph1.ca URLs: https://ph1.ca/team/{key}
3. Only mention team members when relevant to the content being generated
4. Never invent or assume team member information not listed above
5. If you need to mention a team member not listed, inform the user
6. Use their expertise and experience when contextually appropriate
`;
}

export async function getTeamMembersByExpertise(expertise: string): Promise<TeamMember[]> {
  try {
    const entries = await client.getEntries<any>({
      content_type: 'teamMember',
      'fields.expertise[match]': expertise,
    });

    return entries.items.map(entry => mapTeamMember(entry));
  } catch (error) {
    console.error(`Error fetching team members by expertise ${expertise}:`, error);
    return [];
  }
}

let cachedTeamMembers: TeamMember[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000;

export async function getCachedTeamMembers(): Promise<TeamMember[]> {
  const now = Date.now();
  
  if (cachedTeamMembers && (now - cacheTimestamp < CACHE_DURATION)) {
    return cachedTeamMembers;
  }
  
  cachedTeamMembers = await getAllTeamMembers();
  cacheTimestamp = now;
  return cachedTeamMembers;
}

export function clearTeamMemberCache() {
  cachedTeamMembers = null;
  cacheTimestamp = 0;
}
