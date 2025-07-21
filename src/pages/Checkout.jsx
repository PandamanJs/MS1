import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function Checkout() {
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem("checkoutItems")) || [];
    setItems(storedItems);
  }, []);

  const handleConfirm = async () => {
    const total = items.reduce((sum, i) => sum + i.amount, 0);

    try {
      const response = await fetch(`${API_URL}/payments/make-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, total }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(`✅ Payment successful! Transaction ID: ${data.transaction_id}`);
        localStorage.removeItem("checkoutItems");
        setItems([]);
      } else {
        setMessage(`❌ Payment failed: ${data.error || "Unknown error"}`);
      }
    } catch (err) {
      setMessage(`❌ Network error: ${err.message}`);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Checkout</h1>

      {items.length === 0 ? (
        <p>No items in your checkout.</p>
      ) : (
        <div>
          <ul style={{ padding: 0, listStyle: "none" }}>
            {items.map((item, idx) => (
              <li key={idx} style={{ marginBottom: "1rem" }}>
                <strong>{item.name}</strong>: ${item.amount}
              </li>
            ))}
          </ul>

          <p>
            <strong>Total:</strong> $
            {items.reduce((sum, i) => sum + i.amount, 0).toFixed(2)}
          </p>

          <button onClick={handleConfirm} style={{ padding: "0.5rem 1rem", fontWeight: "bold" }}>
            Confirm Payment
          </button>
        </div>
      )}

      {message && (
        <div style={{ marginTop: "1rem", padding: "1rem", backgroundColor: "#f1f1f1" }}>
          {message}
        </div>
      )}
    </div>
  );
}

export default Checkout;

