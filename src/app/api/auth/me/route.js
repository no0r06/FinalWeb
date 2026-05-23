import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';

export async function GET(request) {
  // Get token from cookie
  const token = request.cookies.get('token')?.value;
  
  if (!token) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    );
  }
  
  const payload = await verifyToken(token);
  
  if (!payload) {
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    );
  }
  
  return NextResponse.json({
    user: {
      id: payload.userId,
      email: payload.email,
      role: payload.role
    }
  });
}