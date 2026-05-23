import { NextResponse } from 'next/server';
import { jobs } from '@/lib/db';

export async function GET() {
  console.log('Jobs API was called');
  console.log('Jobs data:', jobs);
  
  try {
    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Error in jobs API:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}