'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [formData, setFormData] = useState({
    title: '', company: '', location: '', salary: '', description: '', image: ''
  });
  const [submitting, setSubmitting] = useState(false);

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

  const fetchJobs = () => {
    fetch('/api/jobs')
      .then(res => res.json())
      .then(data => {
        setJobs(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Jobs fetch error:', err);
        setJobs([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (user) fetchJobs();
  }, [user]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const openAddModal = () => {
    setEditingJob(null);
    setFormData({ title: '', company: '', location: '', salary: '', description: '', image: '' });
    setShowModal(true);
  };

  const openEditModal = (job) => {
    setEditingJob(job);
    setFormData(job);
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = editingJob ? `/api/jobs/${editingJob.id}` : '/api/jobs';
      const method = editingJob ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Failed to save job');

      fetchJobs();
      setShowModal(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (jobId) => {
    if (!confirm('Are you sure?')) return;
    try {
      await fetch(`/api/jobs/${jobId}`, { method: 'DELETE' });
      fetchJobs();
    } catch (err) {
      alert('Failed to delete');
    }
  };

  if (loading) return (
    <div style={stylesLoading.container}>
      <div style={stylesLoading.spinner}></div>
      <p style={stylesLoading.text}>Loading...</p>
    </div>
  );
  if (!user) return null;

  return (
    <div style={styles.container}>
      <nav style={styles.navbar}>
        <div style={styles.navContent}>
          <div style={styles.logoSection}>
            <span style={styles.logoIcon}>💼</span>
            <h1 style={styles.logoText}>JobBoard</h1>
          </div>
          <div style={styles.userSection}>
            <span style={styles.userEmail}>{user.email}</span>
            <span style={styles.userBadge}>{user.role}</span>
            <button onClick={handleLogout} style={styles.logoutButton}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main style={styles.main}>
        <div style={styles.header}>
          <h2 style={styles.pageTitle}>Available Positions</h2>
          {user.role === 'admin' && (
            <button onClick={openAddModal} style={styles.addButton}>
              + Add Job
            </button>
          )}
        </div>

        <div style={styles.jobsGrid}>
          {jobs.length === 0 ? (
            <p style={styles.emptyState}>No jobs available</p>
          ) : (
            jobs.map(job => (
              <div key={job.id} style={styles.jobCard}>
                <div style={styles.jobImage}>
                  <img src={job.image || 'https://picsum.photos/id/100/80/80'} alt={job.company} />
                </div>
                <div style={styles.jobContent}>
                  <h3 style={styles.jobTitle}>{job.title}</h3>
                  <p style={styles.jobCompany}>{job.company} • {job.location}</p>
                  <p style={styles.jobSalary}>{job.salary}</p>
                  <p style={styles.jobDescription}>{job.description}</p>
                </div>
                {user.role === 'admin' && (
                  <div style={styles.jobActions}>
                    <button onClick={() => openEditModal(job)} style={styles.editButton}>✏️</button>
                    <button onClick={() => handleDelete(job.id)} style={styles.deleteButton}>🗑️</button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>

      {/* Modal - same as before with black/red theme */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>{editingJob ? 'Edit Job' : 'Add New Job'}</h2>
            <form onSubmit={handleSubmit}>
              <input name="title" placeholder="Job Title" value={formData.title} onChange={handleInputChange} required style={styles.modalInput} />
              <input name="company" placeholder="Company" value={formData.company} onChange={handleInputChange} required style={styles.modalInput} />
              <input name="location" placeholder="Location" value={formData.location} onChange={handleInputChange} required style={styles.modalInput} />
              <input name="salary" placeholder="Salary" value={formData.salary} onChange={handleInputChange} required style={styles.modalInput} />
              <textarea name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} required rows="3" style={styles.modalTextarea} />
              <input name="image" placeholder="Image URL (optional)" value={formData.image} onChange={handleInputChange} style={styles.modalInput} />
              <div style={styles.modalButtons}>
                <button type="button" onClick={() => setShowModal(false)} style={styles.cancelButton}>Cancel</button>
                <button type="submit" disabled={submitting} style={styles.saveButton}>{submitting ? 'Saving...' : (editingJob ? 'Update' : 'Create')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a0a 100%)',
  },
  navbar: {
    backgroundColor: '#000000',
    borderBottom: '1px solid #dc2626',
    padding: '16px 32px',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  navContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logoIcon: {
    fontSize: '28px',
  },
  logoText: {
    color: '#ffffff',
    fontSize: '24px',
    fontWeight: '700',
    margin: 0,
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  userEmail: {
    color: '#e5e5e5',
    fontSize: '14px',
  },
  userBadge: {
    backgroundColor: '#dc2626',
    color: '#ffffff',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  logoutButton: {
    backgroundColor: 'transparent',
    border: '1px solid #dc2626',
    color: '#dc2626',
    padding: '6px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 32px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
  },
  pageTitle: {
    color: '#ffffff',
    fontSize: '28px',
    margin: 0,
  },
  addButton: {
    backgroundColor: '#dc2626',
    color: '#ffffff',
    border: 'none',
    padding: '10px 24px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  jobsGrid: {
    display: 'grid',
    gap: '20px',
  },
  jobCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: '16px',
    padding: '20px',
    display: 'flex',
    gap: '20px',
    transition: 'all 0.3s ease',
    border: '1px solid #2a2a2a',
    position: 'relative',
    animation: 'slideUp 0.5s ease-out',
  },
  jobImage: {
    flexShrink: 0,
    img: {
      width: '80px',
      height: '80px',
      borderRadius: '12px',
      objectFit: 'cover',
    },
  },
  jobContent: {
    flex: 1,
  },
  jobTitle: {
    color: '#ffffff',
    fontSize: '20px',
    fontWeight: '600',
    margin: '0 0 8px 0',
  },
  jobCompany: {
    color: '#a3a3a3',
    fontSize: '14px',
    margin: '0 0 4px 0',
  },
  jobSalary: {
    color: '#dc2626',
    fontSize: '16px',
    fontWeight: '600',
    margin: '0 0 8px 0',
  },
  jobDescription: {
    color: '#c4c4c4',
    fontSize: '14px',
    margin: 0,
  },
  jobActions: {
    display: 'flex',
    gap: '8px',
    alignItems: 'flex-start',
  },
  editButton: {
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  deleteButton: {
    backgroundColor: '#dc2626',
    color: '#ffffff',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.9)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#1a1a1a',
    padding: '32px',
    borderRadius: '20px',
    width: '500px',
    maxWidth: '90%',
    border: '1px solid #dc2626',
  },
  modalTitle: {
    color: '#ffffff',
    fontSize: '24px',
    marginBottom: '24px',
  },
  modalInput: {
    width: '100%',
    padding: '12px',
    marginBottom: '16px',
    backgroundColor: '#2a2a2a',
    border: '1px solid #3a3a3a',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '14px',
  },
  modalTextarea: {
    width: '100%',
    padding: '12px',
    marginBottom: '16px',
    backgroundColor: '#2a2a2a',
    border: '1px solid #3a3a3a',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '14px',
    fontFamily: 'inherit',
  },
  modalButtons: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    backgroundColor: '#3a3a3a',
    color: '#ffffff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  saveButton: {
    backgroundColor: '#dc2626',
    color: '#ffffff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  emptyState: {
    color: '#a3a3a3',
    textAlign: 'center',
    padding: '60px',
  },
};

const stylesLoading = {
  container: {
    minHeight: '100vh',
    background: '#0a0a0a',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '20px',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '3px solid #2a2a2a',
    borderTopColor: '#dc2626',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  text: {
    color: '#ffffff',
    fontSize: '16px',
  },
};

// Add animations to document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
    button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
    }
    .job-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.3);
      border-color: #dc2626;
    }
  `;
  document.head.appendChild(styleSheet);
}