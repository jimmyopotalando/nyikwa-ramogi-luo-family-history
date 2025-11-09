import React, { useEffect, useState } from 'react';

// ✅ Automatically detect backend URL
const API_BASE_URL =
  import.meta.env.MODE === 'development'
    ? 'http://localhost:5000' // your backend in dev
    : window.location.origin; // same domain in production

export default function ClanSelector({ county, onSelectClan, onBack }) {
  const [clans, setClans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchClans() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/clans?county=${encodeURIComponent(county)}`
        );

        // Parse JSON first
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || `Failed to fetch clans for ${county}`);
        }

        setClans(data.clans || []);
      } catch (err) {
        setError(err.message);
        setClans([]); // ensure no leftover clans show
      } finally {
        setLoading(false);
      }
    }

    fetchClans();
  }, [county]);

  return (
    <div style={styles.container}>
      <h2>Please select a clan in {county}:</h2>

      {loading && <p>Loading clans...</p>}

      {error && <p style={styles.error}>Error: {error}</p>}

      {!loading && !error && clans.length === 0 && (
        <p>No clans found for {county}.</p>
      )}

      <div style={styles.list}>
        {!loading &&
          !error &&
          clans.map((clan) => (
            <button
              key={clan}
              style={styles.button}
              onClick={() => onSelectClan(clan)}
            >
              {clan}
            </button>
          ))}
      </div>

      <button style={styles.backButton} onClick={onBack}>
        &larr; Back
      </button>
    </div>
  );
}

const styles = {
  container: {
    textAlign: 'center',
    padding: '1.5rem',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '300px',
    margin: 'auto',
    gap: '1rem',
  },
  button: {
    padding: '1rem',
    fontSize: '1.1rem',
    borderRadius: '6px',
    border: '1px solid #0070f3',
    backgroundColor: '#0070f3',
    color: 'white',
    cursor: 'pointer',
  },
  backButton: {
    marginTop: '2rem',
    padding: '0.8rem 1.2rem',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
  },
};
