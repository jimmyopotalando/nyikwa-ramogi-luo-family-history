import React from 'react';

export default function PaymentSuccess({ onBack }) {
  return (
    <div style={styles.container}>
      <h2>✅ Payment Successful!</h2>
      <p>Your clan information will be sent to your phone via SMS shortly.</p>

      <button style={styles.button} onClick={onBack}>
        Back to Home
      </button>
    </div>
  );
}

const styles = {
  container: {
    textAlign: 'center',
    padding: '2rem',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  button: {
    marginTop: '2rem',
    padding: '0.8rem 1.2rem',
    fontSize: '1rem',
    cursor: 'pointer',
    borderRadius: '6px',
    border: '1px solid #0070f3',
    backgroundColor: '#0070f3',
    color: 'white',
  },
};
