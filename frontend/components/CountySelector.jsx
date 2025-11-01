import React from 'react';

// Sample hardcoded counties, can be replaced by metadata.json later if needed
const counties = [
  { id: 'siaya', name: 'Siaya' },
  { id: 'kisumu', name: 'Kisumu' },
  { id: 'homabay', name: 'Homabay' },
  { id: 'migori', name: 'Migori' },
];

export default function CountySelector({ onSelectCounty, onBack }) {
  return (
    <div style={styles.container}>
      <h2>Select your county:</h2>
      <div style={styles.list}>
        {counties.map((county) => (
          <button
            key={county.id}
            style={styles.button}
            onClick={() => onSelectCounty(county.name)}
          >
            {county.name}
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
};
