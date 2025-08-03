import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');

      if (!token) {
        setStatus('error');
        setMessage('No verification token provided.');
        return;
      }

      try {
        const res = await fetch(`http://localhost:5000/api/auth/verify?token=${token}`);

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || 'Verification failed');
        }

        const data = await res.json();

        setStatus('success');
        setMessage(data.message);

        setTimeout(() => {
          navigate('/');
        }, 3000);
      } catch (err) {
        setStatus('error');
        setMessage(err.message || 'Network error occurred');
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      {status === 'verifying' && (
        <>
          <p>Verifying your email...</p>
          <div className="spinner" />
        </>
      )}
      {status === 'success' && (
        <>
          <p style={{ color: 'green' }}>{message}</p>
          <button onClick={() => navigate('/')}>Go to Home</button>
        </>
      )}
      {status === 'error' && <p style={{ color: 'red' }}>{message}</p>}
    </div>
  );
};

export default VerifyEmail;
