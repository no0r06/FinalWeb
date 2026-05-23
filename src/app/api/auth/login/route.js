import { NextResponse } from 'next/server';
import { users } from '@/lib/db';
import { generateOTP } from '@/lib/generateOTP';
import { saveOTP } from '@/lib/otpStore';

export async function POST(request) {
  try {
    const { email, password, turnstileToken } = await request.json();
    
    // Verify Turnstile
    if (!turnstileToken) {
      return NextResponse.json(
        { error: 'Please verify you are human' },
        { status: 400 }
      );
    }

    const turnstileRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: turnstileToken,
      }),
    });

    const turnstileData = await turnstileRes.json();

    if (!turnstileData.success) {
      return NextResponse.json(
        { error: 'Verification failed' },
        { status: 400 }
      );
    }
    
    // Check user credentials
    const user = users.find(u => u.email === email);
    
    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    // Generate and save OTP
    const otpCode = generateOTP();
    saveOTP(email, otpCode);
    
    // Log OTP to terminal (for testing)
    console.log(`\n=================================`);
    console.log(`🔐 OTP for ${email}: ${otpCode}`);
    console.log(`=================================\n`);
    
    // Return success — tell user to check OTP
    return NextResponse.json({
      success: true,
      message: 'OTP sent to your email',
      requiresOTP: true,
      email: email
    });
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}