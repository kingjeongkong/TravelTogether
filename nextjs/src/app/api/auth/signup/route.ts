import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { email, password, name } = await req.json();
  try {
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: name,
    });
    await adminDb
      .collection('users')
      .doc(userRecord.uid)
      .set({
        name,
        email,
        image: '',
        tags: '',
        bio: '',
        location: { city: '', state: '' },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ success: false, message: errorMessage }, { status: 400 });
  }
}
