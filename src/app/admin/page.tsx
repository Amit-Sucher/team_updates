'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { UploadButton } from '@uploadthing/react';
import { OurFileRouter } from '../api/uploadthing/core';
import Image from 'next/image';

interface FormEvent extends React.FormEvent {
  currentTarget: HTMLFormElement & {
    email: { value: string };
    password: { value: string };
  };
}

interface UploadResponse {
  url: string;
}

export default function AdminPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    const email = e.currentTarget.email.value;
    const password = e.currentTarget.password.value;

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError('Invalid email or password');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/updates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          imageUrl,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create update');
      }

      // Reset form
      setTitle('');
      setContent('');
      setImageUrl(null);
      
      // Redirect to home page
      router.push('/');
    } catch (error) {
      console.error('Error submitting update:', error);
      setError('Failed to create update. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInlineImageUpload = (res: UploadResponse[]) => {
    if (res?.[0]) {
      const imageMarkdown = `\n![Image](${res[0].url})\n`;
      setContent(prev => prev + imageMarkdown);
    }
  };

  if (status === 'loading') {
    return <div className="text-center text-black">Loading...</div>;
  }

  if (!session) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md border-t-4 border-[#d3af37]">
        <h1 className="text-3xl font-bold text-black mb-6">Sign In</h1>
        {error && (
          <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
            {error}
          </div>
        )}
        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-black">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#d3af37] focus:ring-[#d3af37] text-black"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-black">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#d3af37] focus:ring-[#d3af37] text-black"
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#012265] hover:bg-[#012265]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d3af37]"
          >
            Sign In
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-black">Add New Update</h1>
        <button
          onClick={() => signIn('credentials', { callbackUrl: '/admin' })}
          className="text-sm text-black hover:text-[#d3af37]"
        >
          Sign Out
        </button>
      </div>
      
      {error && (
        <div className="mb-6 p-4 text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-black">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#d3af37] focus:ring-[#d3af37] text-black"
            required
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-black">
            Content
          </label>
          <div className="flex gap-2 mb-2">
            <UploadButton<OurFileRouter>
              endpoint="imageUploader"
              onClientUploadComplete={handleInlineImageUpload}
              onUploadError={(error: Error) => {
                console.error('Upload error:', error);
                setError('Failed to upload image. Please try again.');
              }}
              className="ut-button:bg-[#012265] ut-button:text-white ut-button:hover:bg-[#012265]/90"
            />
            <span className="text-sm text-gray-500">Click to add an image at cursor position</span>
          </div>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={12}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#d3af37] focus:ring-[#d3af37] text-black font-mono"
            required
            placeholder="Write your update here...&#10;&#10;Images will be inserted at the cursor position when you click the upload button above."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Featured Image (Optional)
          </label>
          <UploadButton<OurFileRouter>
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              if (res?.[0]) {
                setImageUrl(res[0].url);
              }
            }}
            onUploadError={(error: Error) => {
              console.error('Upload error:', error);
              setError('Failed to upload image. Please try again.');
            }}
            className="ut-button:bg-[#012265] ut-button:text-white ut-button:hover:bg-[#012265]/90"
          />
          {imageUrl && (
            <div className="mt-2 relative w-full max-w-xs h-48">
              <Image
                src={imageUrl}
                alt="Featured Preview"
                fill
                className="rounded-lg shadow-sm object-cover"
              />
            </div>
          )}
        </div>

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#012265] hover:bg-[#012265]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d3af37] disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Update'}
          </button>
        </div>
      </form>
    </div>
  );
} 