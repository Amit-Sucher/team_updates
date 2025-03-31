import { headers } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

async function getUpdates() {
  const headersList = await headers();
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const host = await headersList.get('host') || 'localhost:3000';

  const res = await fetch(`${protocol}://${host}/api/updates`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch updates');
  }

  return res.json();
}

export default async function Home() {
  const session = await getServerSession(authOptions);
  const updates = await getUpdates();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-black">Team Updates</h1>
        {session && (
          <Link
            href="/admin"
            className="px-4 py-2 bg-[#012265] text-white rounded-md hover:bg-[#012265]/90 transition-colors"
          >
            Create Update
          </Link>
        )}
      </div>

      <div className="space-y-8">
        {updates.map((update: any) => (
          <article key={update.id} className="bg-white rounded-lg shadow-md overflow-hidden border-t-4 border-[#d3af37]">
            {update.imageUrl && (
              <div className="relative h-52 w-full">
                <Image
                  src={update.imageUrl}
                  alt={update.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-black mb-2">{update.title}</h2>
              <div className="text-sm text-black/70 mb-4">
                {new Date(update.createdAt).toLocaleDateString()} by {update.author?.name || 'Admin'}
              </div>
              <div className="prose prose-sm max-w-none text-black/80 [&_img]:w-4/5 [&_img]:mx-auto">
                <ReactMarkdown>{update.content}</ReactMarkdown>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
