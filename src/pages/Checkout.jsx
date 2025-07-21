import { useEffect, useState } from "react";

function Checkout() {
  const [status, setStatus] = useState("loading"); // 'loading' | 'success' | 'error'
  const [transactionId, setTransactionId] = useState(null);

  useEffect(() => {
    const makePayment = async () => {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

      const items = JSON.parse(localStorage.getItem("checkoutItems") || "[]");

      if (items.length === 0) {
        setStatus("error");
        return;
      }

      const total = items.reduce((sum, item) => sum + item.amount, 0);

      try {
        const response = await fetch(`${API_URL}/payments/make-payment`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items, total }),
        });

        if (!response.ok) throw new Error("Payment failed");

        const result = await response.json();

        if (result.transaction_id) {
          localStorage.setItem("lastTransactionId", result.transaction_id);
          setTransactionId(result.transaction_id);
        }

        localStorage.removeItem("checkoutItems");
        setStatus("success");
      } catch (error) {
        console.error("Payment error:", error);
        setStatus("error");
      }
    };

    makePayment();
  }, []);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      {status === "loading" && (
        <>
          <h2>Processing Payment...</h2>
          <p>Please wait while we complete your transaction.</p>
        </>
      )}

      {status === "success" && (
        <>
          <h2>Payment Successful 🎉</h2>
          <p>Your payment has been processed successfully.</p>
          {transactionId && (
            <p>
              <strong>Transaction ID:</strong> {transactionId}
            </p>
          )}
        </>
      )}

      {status === "error" && (
        <>
          <h2>Payment Failed ❌</h2>
          <p>Something went wrong. Please try again later.</p>
        </>
      )}
    </div>
  );
}

export default Checkout;

