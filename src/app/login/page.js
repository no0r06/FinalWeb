'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState(null);
  const router = useRouter();
  const turnstileRef = useRef(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.turnstile && turnstileRef.current) {
        window.turnstile.render(turnstileRef.current, {
          sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
          callback: (token) => {
            setTurnstileToken(token);
          },
        });
      }
    };
    document.head.appendChild(script);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!turnstileToken) {
      setError('Please verify you are human');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, turnstileToken })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        setTurnstileToken(null);
        if (window.turnstile && turnstileRef.current) {
          window.turnstile.reset(turnstileRef.current);
        }
        setLoading(false);
        return;
      }

      router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
      
    } catch (err) {
      setError('Something went wrong');
      setTurnstileToken(null);
      if (window.turnstile && turnstileRef.current) {
        window.turnstile.reset(turnstileRef.current);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.overlay}>
        <div style={styles.card}>
          <div style={styles.logoArea}>
            <div style={styles.logoIcon}>💼</div>
            <h1 style={styles.title}>JobBoard</h1>
            <p style={styles.subtitle}>Sign in to continue</p>
          </div>
          
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.input}
                placeholder="admin@example.com"
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={styles.input}
                placeholder="••••••••"
              />
            </div>

            <div style={styles.turnstileWrapper}>
              <div ref={turnstileRef}></div>
            </div>

            {error && (
              <div style={styles.errorMessage}>
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !turnstileToken}
              style={{
                ...styles.button,
                ...((loading || !turnstileToken) ? styles.buttonDisabled : {})
              }}
            >
              {loading ? (
                <span style={styles.loadingSpinner}></span>
              ) : (
                'Login'
              )}
            </button>
          </form>

          <div style={styles.footer}>
            <p style={styles.footerText}>Test credentials: admin4180@gmail.com / admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1a1a1a 0%, #2d1818 50%, #1a1a1a 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  overlay: {
    position: 'relative',
    zIndex: 2,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    padding: '20px',
  },
  card: {
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    backdropFilter: 'blur(10px)',
    borderRadius: '24px',
    padding: '48px 40px',
    width: '100%',
    maxWidth: '460px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(220, 38, 38, 0.2)',
    animation: 'slideUp 0.6s ease-out',
  },
  logoArea: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  logoIcon: {
    fontSize: '64px',
    marginBottom: '16px',
    animation: 'pulse 2s infinite',
  },
  title: {
    color: '#ffffff',
    fontSize: '32px',
    fontWeight: '700',
    margin: '0 0 8px 0',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    color: '#a3a3a3',
    fontSize: '14px',
    margin: 0,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    color: '#e5e5e5',
    fontSize: '14px',
    fontWeight: '500',
  },
  input: {
    padding: '12px 16px',
    backgroundColor: '#1f1f1f',
    border: '1px solid #333333',
    borderRadius: '12px',
    color: '#ffffff',
    fontSize: '15px',
    transition: 'all 0.3s ease',
    outline: 'none',
  },
  inputFocus: {
    borderColor: '#dc2626',
    boxShadow: '0 0 0 3px rgba(220, 38, 38, 0.1)',
  },
  turnstileWrapper: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '8px',
  },
  errorMessage: {
    backgroundColor: 'rgba(220, 38, 38, 0.15)',
    border: '1px solid #dc2626',
    borderRadius: '12px',
    padding: '12px',
    color: '#ef4444',
    fontSize: '14px',
    textAlign: 'center',
    animation: 'shake 0.5s ease-in-out',
  },
  button: {
    backgroundColor: '#dc2626',
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    padding: '14px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '8px',
    position: 'relative',
  },
  buttonDisabled: {
    backgroundColor: '#7f1d1d',
    cursor: 'not-allowed',
    opacity: 0.7,
  },
  loadingSpinner: {
    display: 'inline-block',
    width: '20px',
    height: '20px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: '#ffffff',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  footer: {
    marginTop: '24px',
    textAlign: 'center',
  },
  footerText: {
    color: '#666666',
    fontSize: '12px',
    margin: 0,
  },
};

// Add this to your global CSS or use a <style> tag
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.05);
      }
    }
    
    @keyframes shake {
      0%, 100% {
        transform: translateX(0);
      }
      25% {
        transform: translateX(-5px);
      }
      75% {
        transform: translateX(5px);
      }
    }
    
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
    
    input:focus {
      border-color: #dc2626;
      box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
    }
    
    button:hover:not(:disabled) {
      background-color: #b91c1c;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
    }
  `;
  document.head.appendChild(styleSheet);
}