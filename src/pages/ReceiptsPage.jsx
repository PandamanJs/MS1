import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/ReceiptsPage.module.css";
import Title from "../components/Title";

export default function ReceiptsPage() {
  const navigate = useNavigate();

  // Example data; replace with your real data
  const receipts = [
    {
      id: "0001",
      title: "School Fees",
      student: "Isaiah Kapambwe – Grade 3A",
      amount: "1,500.00",
      date: "17/03/2025",
    },
    {
      id: "0002",
      title: "ZNS Bus stop",
      student: "Isaiah Kapambwe – Grade 3A",
      amount: "1,500.00",
      date: "17/03/2025",
    },
    // ...more receipts
  ];

  return (
    <main className={styles.container}>
      <button
        className={styles.closeBtn}
        onClick={() => navigate(-1)}
        aria-label="Close"
      >
        ×
      </button>

      <h1 className={styles.title}>Sales Receipts</h1>
      <p className={styles.subtitle}>
        Download the receipts or have them sent to your whatsapp or email.
      </p>

      <ul className={styles.list}>
        {receipts.map((r) => (
          <li key={r.id} className={styles.item}>
            <div className={styles.info}>
              <div className={styles.header}>
                {r.title} – Receipt No. {r.id}
              </div>
              <div className={styles.meta}>{r.student}</div>
              <div className={styles.meta}>ZMW {r.amount}</div>
              <div className={styles.meta}>{r.date}</div>
            </div>

            <button className={styles.viewBtn}>View</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
