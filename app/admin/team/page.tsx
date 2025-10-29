import { getAllTeamMembers } from '@/lib/contentful-team';
import Image from 'next/image';
import Link from 'next/link';

export default async function TeamMembersAdminPage() {
  const teamMembers = await getAllTeamMembers();

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Team Members from Contentful</h1>
          <p className="text-gray-600">
            {teamMembers.length} team member{teamMembers.length !== 1 ? 's' : ''} available for content generation
          </p>
        </div>
        
        <Link
          href="/admin/team/create"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
        >
          + Create Team Member
        </Link>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
        <p className="text-sm text-blue-800">
          ℹ️ This data is automatically pulled from Contentful and included in AI generation context.
        </p>
      </div>

      {teamMembers.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <p className="font-semibold text-yellow-800 mb-2">
            No team members found
          </p>
          <p className="text-yellow-700 text-sm mb-4">
            Add team members to Contentful (content type: teamMember)
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member) => (
            <div 
              key={member.key}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              {member.photo && (
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <Image 
                    src={member.photo.url} 
                    alt={member.name}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
              )}
              
              <h3 className="text-xl font-bold text-center mb-1">
                {member.name}
              </h3>
              
              <p className="text-sm text-gray-600 text-center mb-4">
                {member.expertise}
              </p>
              
              <div className="border-t pt-4 space-y-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Key:</p>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {member.key}
                  </code>
                </div>
                
                <div>
                  <p className="text-xs text-gray-500 mb-1">Experience:</p>
                  <p className="text-sm">{member.experience}</p>
                </div>
                
                <div>
                  <p className="text-xs text-gray-500 mb-1">Bio:</p>
                  <p className="text-xs text-gray-700 line-clamp-3">
                    {member.bioPlainText}
                  </p>
                </div>
                
                <div className="pt-2 flex flex-col gap-2">
                  <Link
                    href={`/admin/team/edit/${member.key}`}
                    className="w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded text-sm font-medium transition-colors"
                  >
                    ✏️ Edit with AI
                  </Link>
                  
                  <a 
                    href={member.ph1Url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-800 text-center"
                  >
                    View on PH1.ca →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
