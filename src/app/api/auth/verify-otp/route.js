import { NextResponse } from 'next/server';
import { signToken } from '@/lib/auth/jwt';
import { users } from '@/lib/db';
import { verifyOTP } from '@/lib/otpStore';

export async function POST(request) {
  try {
    const { email, otpCode } = await request.json();
    
    if (!email || !otpCode) {
      return NextResponse.json(
        { error: 'Email and OTP code required' },
        { status: 400 }
      );
    }
    
    // Verify OTP
    const isValid = verifyOTP(email, otpCode);
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP code' },
        { status: 401 }
      );
    }
    
    // Find user
    const user = users.find(u => u.email === email);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Generate JWT
    const token = await signToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });
    
    const response = NextResponse.json({
      success: true,
      user: { email: user.email, role: user.role }
    });
    
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
      path: '/'
    });
    
    return response;
    
  } catch (error) {
    console.error('OTP error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}