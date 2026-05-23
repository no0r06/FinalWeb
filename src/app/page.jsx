'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check if user is logged in
  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => {
        if (!res.ok) {
          router.push('/login');
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (data) setUser(data.user);
      })
      .catch(() => router.push('/login'));
  }, [router]);

  // Fetch jobs
  useEffect(() => {
    if (user) {
      fetch('/api/jobs')
        .then(res => {
          if (!res.ok) {
            throw new Error('Failed to fetch jobs');
          }
          return res.json();
        })
        .then(data => {
          if (data && Array.isArray(data)) {
            setJobs(data);
          } else {
            setJobs([]);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error('Jobs fetch error:', err);
          setJobs([]);
          setLoading(false);
        });
    }
  }, [user]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h1 style={{ margin: 0 }}>Job Board</h1>
        <button 
          onClick={handleLogout}
          style={{
            padding: '8px 16px',
            backgroundColor: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>
      
      <p>Welcome, {user.email} ({user.role})</p>
      
      {user.role === 'admin' && (
        <button style={{ marginBottom: '20px' }}>➕ Add Job</button>
      )}

      <div>
        {jobs.length === 0 ? (
          <p>No jobs available.</p>
        ) : (
          jobs.map(job => (
            <div key={job.id} style={{
              border: '1px solid #ddd',
              padding: '15px',
              marginBottom: '10px',
              borderRadius: '5px'
            }}>
              <h3>{job.title}</h3>
              <p>{job.company} — {job.location}</p>
              <p>{job.salary}</p>
              <p>{job.description}</p>
              {user.role === 'admin' && (
                <div>
                  <button style={{ marginRight: '10px' }}>✏️ Edit</button>
                  <button>🗑️ Delete</button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}