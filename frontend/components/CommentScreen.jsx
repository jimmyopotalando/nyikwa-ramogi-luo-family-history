import React, { useState } from 'react';

export default function CommentScreen({ onBack }) {
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError(null);

    if (!comment.trim()) {
      setError('Comment cannot be empty.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment: comment.trim() }),
      });

      let data;
      try {
        data = await response.json(); // Safely parse JSON
      } catch {
        data = { message: response.statusText || 'Unknown error' };
      }

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit comment.');
      }

      setSubmitted(true);
      setComment('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={styles.container}>
        <h2>Thank you! Your comment has been received.</h2>
        <button style={styles.button} onClick={onBack}>← Back to Menu</button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2>Leave a Comment</h2>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={6}
        placeholder="Enter your comment here..."
        style={styles.textarea}
      />
      {error && <p style={styles.error}>{error}</p>}
      <button
        style={{ ...styles.button, opacity: loading ? 0.6 : 1 }}
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? 'Submitting...' : 'Submit'}
      </button>
      <button style={styles.backButton} onClick={onBack}>← Back</button>
    </div>
  );
}

const styles = {
  container: {
    textAlign: 'center',
    padding: '2rem',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  textarea: {
    width: '100%',
    maxWidth: '500px',
    padding: '1rem',
    fontSize: '1rem',
    borderRadius: '8px',
    border: '1px solid #ccc',
    marginBottom: '1rem',
  },
  button: {
    padding: '0.8rem 1.5rem',
    margin: '0.5rem',
    fontSize: '1rem',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#0070f3',
    color: 'white',
    cursor: 'pointer',
  },
  backButton: {
    backgroundColor: '#999',
  },
  error: {
    color: 'red',
    marginBottom: '1rem',
  },
};
