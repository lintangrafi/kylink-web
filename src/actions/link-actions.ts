'use server';

import { db } from '@/db';
import { links } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function createShortLink(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session) {
    return { error: 'Unauthorized' };
  }

  const originalUrl = formData.get('originalUrl') as string;
  let shortCode = formData.get('shortCode') as string;

  if (!originalUrl) {
    return { error: 'Original URL is required' };
  }

  if (!shortCode) {
    shortCode = Math.random().toString(36).substring(2, 8);
  }

  try {
    const existing = await db.query.links.findFirst({
      where: eq(links.shortCode, shortCode),
    });

    if (existing) {
      return { error: 'Short code already exists' };
    }

    const [newLink] = await db.insert(links).values({
      originalUrl,
      shortCode,
      userId: session.user.id,
    }).returning();

    revalidatePath('/dashboard');
    return { success: true, link: newLink };
  } catch (err) {
    console.error('Failed to create short link', err);
    return { error: 'Internal Server Error' };
  }
}

export async function getUserLinks() {
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session) {
    return [];
  }

  try {
    return await db.query.links.findMany({
      where: eq(links.userId, session.user.id),
      orderBy: [desc(links.createdAt)],
    });
  } catch (err) {
    console.error('Failed to fetch user links', err);
    return [];
  }
}

export async function toggleLinkAd(linkId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session) {
     throw new Error("Unauthorized");
  }

  // Find link and verify ownership OR check if admin
  const link = await db.query.links.findFirst({
    where: eq(links.id, linkId),
  });

  if (!link) {
     throw new Error("Link not found");
  }

  if (link.userId !== session.user.id && (session.user as any).role !== "admin") {
     throw new Error("Forbidden");
  }

  await db.update(links).set({
    isAdEnabled: !link.isAdEnabled,
  }).where(eq(links.id, linkId));

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/admin");
  return { success: true };
}
