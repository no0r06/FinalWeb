import { NextResponse } from 'next/server';
import { jobs } from '@/lib/db';
import { verifyToken } from '@/lib/auth/jwt';

// GET all jobs
export async function GET() {
  return NextResponse.json(jobs);
}

// POST new job (admin only)
export async function POST(request) {
  try {
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const payload = await verifyToken(token);
    
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    const { title, company, location, salary, description, image } = await request.json();
    
    if (!title || !company || !location || !salary || !description) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    
    const newJob = {
      id: jobs.length + 1,
      title,
      company,
      location,
      salary,
      description,
      image: image || 'https://picsum.photos/id/20/80/80',
    };
    
    jobs.push(newJob);
    
    return NextResponse.json(newJob, { status: 201 });
    
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}