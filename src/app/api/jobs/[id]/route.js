import { NextResponse } from 'next/server';
import { jobs } from '@/lib/db';
import { verifyToken } from '@/lib/auth/jwt';

// UPDATE job
export async function PUT(request, { params }) {
  try {
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const payload = await verifyToken(token);
    
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    const { id } = await params;
    const jobId = parseInt(id);
    const jobIndex = jobs.findIndex(j => j.id === jobId);
    
    if (jobIndex === -1) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }
    
    const { title, company, location, salary, description, image } = await request.json();
    
    jobs[jobIndex] = {
      ...jobs[jobIndex],
      title: title || jobs[jobIndex].title,
      company: company || jobs[jobIndex].company,
      location: location || jobs[jobIndex].location,
      salary: salary || jobs[jobIndex].salary,
      description: description || jobs[jobIndex].description,
      image: image || jobs[jobIndex].image,
    };
    
    return NextResponse.json(jobs[jobIndex]);
    
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// DELETE job
export async function DELETE(request, { params }) {
  try {
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const payload = await verifyToken(token);
    
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    const { id } = await params;
    const jobId = parseInt(id);
    const jobIndex = jobs.findIndex(j => j.id === jobId);
    
    if (jobIndex === -1) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }
    
    jobs.splice(jobIndex, 1);
    
    return NextResponse.json({ message: 'Job deleted' });
    
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}