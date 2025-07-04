import { useState } from "react";
import Button from "../components/Button";
import ProceedButton from "../components/ProceedButton";
import Title from "../components/Title";
import styles from "../styles/BalanceSummary.module.css";

function BalanceSummary() {
  const [added, setAdded] = useState(false);
  function handlePayForAllBalances() {}
  const handleAddToPayments = () => {
    setAdded(true);
  };
  return (
    <div className={styles.wrapper}>
      <Title />
      <div className={styles.header}>
        <h2>Current Balances Owing</h2>
        <div className={styles.totalLabel}>Total Balance</div>
        <div className={styles.totalAmount}>ZMW 150.00</div>
        <Button
          givenClassName="active"
          message="Pay For All Balances"
          onClick={handlePayForAllBalances}
        />
      </div>

      <hr className={styles.separator} />

      {/* Detail Section */}
      <div className={styles.detailSection}>
        <h3>Detailed Balance info</h3>
        <p>
          Lorem ipsum dolor sit amet consectetur. Elementum faucibus odio augue
          dui.
        </p>

        <h4>Isaac Kapambwe’s School Fees - K1500</h4>

        {/* Progress Bar */}
        <div className={styles.progressBar}>
          <div className={styles.paid}></div>
          <div className={styles.remaining}></div>
        </div>

        <div className={styles.progressLabels}>
          <span>Paid</span>
          <span className={styles.rightAlign}>K150 Balance</span>
        </div>

        {/* Breakdown Table */}
        <div className={styles.breakdownBox}>
          <div className={styles.breakdownRow}>
            <span>① Grade 3 - Term 1 2025</span>
            <span>K1,500</span>
          </div>
          <div className={styles.breakdownRow}>
            <span>② Airtel Payment on 13/1/2025</span>
            <span>-K900</span>
          </div>
          <div className={styles.breakdownRow}>
            <span>③ Airtel Payment on 27/1/2025</span>
            <span>-K450</span>
          </div>
          <div className={styles.breakdownRowBold}>
            <span>Balance</span>
            <span>K150</span>
          </div>
        </div>

        {added ? (
          <div className={styles.addedBox}>
            {/* You can swap in your own SVG if you like */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
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
          </div>
        ) : (
          <button className={styles.addBtn} onClick={handleAddToPayments}>
            + add to payments
          </button>
        )}
      </div>

      <div className={styles.footer}>
        <ProceedButton />
      </div>
    </div>
  );
}

export default BalanceSummary;
