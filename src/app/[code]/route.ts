import { db } from '@/db';
import { analytics, links } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const code = (await params).code;
  
  try {
    const link = await db.query.links.findFirst({
      where: eq(links.shortCode, code),
    });

    if (!link) {
      return new NextResponse('Link not found', { status: 404 });
    }

    // Record simple analytics
    const ip = request.headers.get('x-forwarded-for') || request.ip || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Fire and forget analytics insertion
    db.insert(analytics).values({
      linkId: link.id,
      ipAddress: ip,
      browser: userAgent,
    }).catch(console.error);

    return NextResponse.redirect(link.originalUrl);
  } catch (error) {
    console.error('Redirect Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
