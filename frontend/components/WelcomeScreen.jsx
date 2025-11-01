import React from 'react';

export default function WelcomeScreen({ onSelectOption }) {
  return (
    <div style={styles.container}>
      <h1>Welcome to Nyikwa Ramogi Luo Family History</h1>
      <p style={styles.subtitle}>
        Research by <strong>Rozenval Solutions</strong>
      </p>

      <div style={styles.menu}>
        <button style={styles.button} onClick={() => onSelectOption('clan')}>
          1️⃣ Clan
        </button>
        <button style={styles.button} onClick={() => onSelectOption('donate')}>
          2️⃣ Donate to Support Family History Research
        </button>
        <button style={styles.button} onClick={() => onSelectOption('comment')}>
          3️⃣ Leave a Comment
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
  subtitle: {
    marginTop: '0.5rem',
    color: '#555',
    fontSize: '1.1rem',
  },
  menu: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.2rem',
    marginTop: '2rem',
  },
  button: {
    padding: '1rem 1.5rem',
    fontSize: '1.1rem',
    borderRadius: '8px',
    border: '1px solid #0070f3',
    backgroundColor: '#0070f3',
    color: 'white',
    cursor: 'pointer',
    width: '80%',
    maxWidth: '400px',
  },
};
