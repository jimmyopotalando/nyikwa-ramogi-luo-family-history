import React, { useState } from 'react';

export default function DonateScreen({ onBack }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

  const handleDonate = async () => {
    setError(null);
    setMessage('');

    if (!phoneNumber.trim() || !amount.trim()) {
      setError('Please enter both phone number and donation amount.');
      return;
    }

    if (!/^(?:254|\+254|0)?7\d{8}$/.test(phoneNumber)) {
      setError('Please enter a valid Kenyan phone number (e.g., 07XXXXXXXX).');
      return;
    }

    const normalizedPhone = phoneNumber.startsWith('0')
      ? '254' + phoneNumber.substring(1)
      : phoneNumber.replace('+', '');

    setLoading(true);

    try {
      const response = await fetch('/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: normalizedPhone,
          amount: parseFloat(amount),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to initiate donation. Please try again.');
      }

      setMessage(
        'Please check your phone and enter your M-Pesa PIN to complete the donation.'
      );
      setPhoneNumber('');
      setAmount('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>🙏 Donate to Support Family History Research</h2>
      <p>Your contribution helps preserve the Nyikwa Ramogi Luo heritage.</p>

      <div style={styles.form}>
        <input
          type="text"
          placeholder="Enter your phone number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          style={styles.input}
        />

        <input
          type="number"
          placeholder="Enter donation amount (KES)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={styles.input}
        />

        {error && <p style={styles.error}>{error}</p>}
        {message && <p style={styles.message}>{message}</p>}

        <button
          style={styles.button}
          onClick={handleDonate}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Proceed'}
        </button>

        <button style={styles.backButton} onClick={onBack}>
          ← Back
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    textAlign: 'center',
    padding: '2rem',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    marginTop: '2rem',
  },
  input: {
    padding: '0.8rem',
    width: '80%',
    maxWidth: '400px',
    fontSize: '1rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '0.9rem 1.5rem',
    fontSize: '1rem',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#0070f3',
    color: 'white',
    cursor: 'pointer',
    width: '80%',
    maxWidth: '400px',
  },
  backButton: {
    marginTop: '1rem',
    padding: '0.8rem 1.5rem',
    fontSize: '1rem',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#999',
    color: 'white',
    cursor: 'pointer',
    width: '80%',
    maxWidth: '400px',
  },
  error: {
    color: 'red',
    marginTop: '0.5rem',
  },
  message: {
    color: 'green',
    marginTop: '0.5rem',
  },
};
