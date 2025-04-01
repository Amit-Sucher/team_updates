import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '../auth/auth.config';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, content, imageUrl } = await request.json();

    const update = await prisma.update.create({
      data: {
        title,
        content,
        imageUrl,
        authorId: session.user.id,
      },
    });

    return NextResponse.json(update);
  } catch (error) {
    console.error('Error creating update:', error);
    return NextResponse.json(
      { error: 'Error creating update' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const updates = await prisma.update.findMany({
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    return NextResponse.json(updates);
  } catch (error) {
    console.error('Error fetching updates:', error);
    return NextResponse.json(
      { error: 'Error fetching updates' },
      { status: 500 }
    );
  }
} 