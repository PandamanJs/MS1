import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Title from "../components/Title";
import styles from "../styles/Checkout.module.css";

export default function Checkout() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("2450.00");
 // const items = [
 //
 //   { label: "Talitha Kapambwe’s School Fee", amount: 1500 },
 //   { label: "Talitha Kapambwe’s Transport Fee", amount: 950 },
 // ];
  const total = items.reduce((sum, i) => sum + i.amount, 0);

  const response = await fetch(`${API_URL}/payments/make-payment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      parent_id,
      payments: selectedStudents.map(s => ({
        student_id: s.student_id,
        amount: s.amount,
        payment_method: "mobile_money"
      })),
      transaction_reference: uuidv4()
    })
  });
  return (
    <main className={styles.main}>
      <Title />

      <div className={styles.container}>
        {/* Back button */}
        <button
          className={styles.backBtn}
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          ×
        </button>

        <h2 className={styles.heading}>Checkout</h2>

        {/* Card */}
        <div className={styles.card}>
          {/* Card header */}
          <div className={styles.cardHeader}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M9 8C9 9.65685 10.3431 11 12 11C13.6569 11 15 9.65685 15 8M3 16.8002V7.2002C3 6.08009 3 5.51962 3.21799 5.0918C3.40973 4.71547 3.71547 4.40973 4.0918 4.21799C4.51962 4 5.08009 4 6.2002 4H17.8002C18.9203 4 19.4796 4 19.9074 4.21799C20.2837 4.40973 20.5905 4.71547 20.7822 5.0918C21 5.5192 21 6.07899 21 7.19691V16.8036C21 17.9215 21 18.4805 20.7822 18.9079C20.5905 19.2842 20.2837 19.5905 19.9074 19.7822C19.48 20 18.921 20 17.8031 20H6.19691C5.07899 20 4.5192 20 4.0918 19.7822C3.71547 19.5905 3.40973 19.2842 3.21799 18.9079C3 18.4801 3 17.9203 3 16.8002Z"
                stroke="#003049"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <div>
              <div className={styles.cardTitle}>Payment</div>
              <div className={styles.cardDesc}>
                Proceed to pay the full amount at once...
              </div>
            </div>
          </div>

          {/* Amount input + go */}
          <div className={styles.amountRow}>
            {/* <div className={styles.currency}>ZMW</div> */}
            <input
              type="text"
              className={styles.amountInput}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <button
              className={styles.goBtn}
              onClick={() => console.log("Pay full:", amount)}
            >
              &rarr;
            </button>
          </div>

          {/* Items list */}
          <ul className={styles.itemList}>
            {items.map((it, i) => (
              <li key={i}>
                <svg
                  className={styles.checkIcon}
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M20 6L9 17L4 12"
                    stroke="#2BB6A9"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className={styles.itemLabel}>{it.label}</span>
                <span className={styles.itemAmount}>
                  ZMW {it.amount.toLocaleString()}
                </span>
              </li>
            ))}
            <li className={styles.totalRow}>
              <span>Total</span>
              <span>ZMW {total.toLocaleString()}</span>
            </li>
          </ul>

          {/* Info box */}
          <div className={styles.infoBox}>
            You can pay the complete balance at one go or you can choose to pay
            in part for each of the balances
          </div>

          {/* Divider */}
          <div className={styles.divider}>
            <span className={styles.line} />
            <span className={styles.or}>or</span>
            <span className={styles.line} />
          </div>

          {/* Pay in part */}
          <button className={styles.partBtn}>Pay in part</button>
        </div>
      </div>
    </main>
  );
}
