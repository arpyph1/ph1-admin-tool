import { getTeamMember } from '@/lib/contentful-team';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (!key) {
      return Response.json(
        { error: 'Key parameter required' },
        { status: 400 }
      );
    }

    const teamMember = await getTeamMember(key);

    if (!teamMember) {
      return Response.json(
        { error: 'Team member not found' },
        { status: 404 }
      );
    }

    console.log('Returning team member:', teamMember);
    return Response.json(teamMember);

  } catch (error) {
    console.error('Error fetching team member:', error);
    return Response.json(
      { error: 'Failed to fetch team member' },
      { status: 500 }
    );
  }
}
