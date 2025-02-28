'use server';

import { getDbUserId } from '@/actions/user.action';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const createPost = async (content: string, imageUrl: string) => {
  try {
    const userId = await getDbUserId();
    if (!userId) return;
    const post = await prisma.post.create({
      data: {
        content,
        image: imageUrl,
        authorId: userId,
      },
    });
    revalidatePath('/'); // Purge the cache into the homePage
    return { success: true, post };
  } catch (error) {
    console.error('Failed to create post', error);
    return { success: false, error: 'Failed to create post' };
  }
};

export const getPosts = async () => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            username: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                image: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });
    return posts;
  } catch (error) {
    console.log('Error while fetch posts', error);
    throw new Error('Failed to fetch posts');
  }
};
