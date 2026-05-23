import { NextResponse } from 'next/server';
import { users } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { generateOTP } from '@/lib/generateOTP';
import { saveOTP } from '@/lib/otpStore';

// ... rest of imports

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, turnstileToken } = body;

    // ... Turnstile verification code here ...

    // Check user credentials - NOW USING bcrypt.compare
    const user = users.find((u) => u.email === email);
    
    if (!user) {
      console.log('❌ User not found');
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    // Compare provided password with stored hash
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      console.log('❌ Invalid password');
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    console.log('✅ Credentials valid');

    // ... rest of OTP generation and response code ...
    
  } catch (error) {
    // ... error handling
  }
}