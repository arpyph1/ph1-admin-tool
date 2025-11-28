import { getAllTeamMembers } from '@/lib/contentful-team';
import Image from 'next/image';
import Link from 'next/link';

export default async function AboutPage() {
  const teamMembers = await getAllTeamMembers();

  return (
    <main>
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              About PH1 Research
            </h1>
            <div className="text-xl text-gray-600 leading-relaxed">
              <p className="mb-4">
                We pinpoint what your customers and stakeholders want before mapping & testing 
                a new vision for your products and services.
              </p>
              <p>
                Our clients include product teams prototyping improvements, as well as 
                organizational leadership seeking to define and validate strategic futures.
              </p>
            </div>
          </div>
          <div className="flex justify-center">
            <img src="/images/contact/hero_graphic_expanded.svg" alt="PH1 Research" className="w-full max-w-md" />
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Meet Our Team
          </h2>
          
          {teamMembers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Team members coming soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {teamMembers.map((member) => (
                <Link
                  key={member.key}
                  href={`/team/${member.key}`}
                  className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all"
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    {member.photo ? (
                      <Image
                        src={member.photo}
                        alt={`${member.name} profile picture`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400 text-4xl">👤</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-1">{member.expertise}</p>
                    <p className="text-xs text-gray-500">{member.experience}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Excellence Section */}
      <div className="max-w-4xl mx-auto px-8 py-20">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Excellence in Research & Strategy
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            With over 20 years of experience, we've helped organizations from startups to 
            Fortune 500 companies understand their customers and build better products.
          </p>
        </div>
      </div>
    </main>
  );
}
