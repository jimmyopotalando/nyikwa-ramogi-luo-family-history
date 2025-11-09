import React, { useState } from "react";

export default function ClanPaymentScreen({ clan, county, onBack, onPaymentSuccess }) {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const API_BASE_URL =
    import.meta.env.MODE === "development"
      ? "http://localhost:5000"
      : window.location.origin;

  const handlePayment = async () => {
    if (!phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }

    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/payments/stkpush`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          amount: 10,
          clan,
          county,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Payment initiation failed");
      }

      setMessage("Please check your phone and enter your M-Pesa PIN to complete payment.");
      onPaymentSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>{clan} Clan - {county}</h2>
      <p>
        To view <strong>{clan}</strong> clan history,
        <br /> 10/= will be deducted from your M-Pesa.
      </p>

      <div style={styles.form}>
        <label>Enter your M-Pesa phone number:</label>
        <input
          type="tel"
          placeholder="07XXXXXXXX"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={styles.input}
        />

        <button onClick={handlePayment} style={styles.proceedButton} disabled={loading}>
          {loading ? "Processing..." : "Proceed"}
        </button>

        {message && <p style={styles.message}>{message}</p>}
        {error && <p style={styles.error}>Error: {error}</p>}
      </div>

      <button onClick={onBack} style={styles.backButton}>
        &larr; Back
      </button>
    </div>
  );
}

const styles = {
  container: { textAlign: "center", padding: "1.5rem" },
  form: { marginTop: "1rem" },
  input: {
    width: "250px",
    padding: "0.5rem",
    marginTop: "0.5rem",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  proceedButton: {
    marginTop: "1rem",
    padding: "0.8rem 1.5rem",
    backgroundColor: "#0070f3",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  backButton: {
    marginTop: "2rem",
    padding: "0.6rem 1.2rem",
    cursor: "pointer",
  },
  message: { color: "green", marginTop: "1rem" },
  error: { color: "red", marginTop: "1rem" },
};
