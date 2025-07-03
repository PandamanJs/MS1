import styles from "../styles/PaymentHistoryBox.module.css";
import PaymentHistoryItem from "./PaymentHistoryItem";

function PaymentHistoryBox() {
  return (
    <div className={styles.historyBox}>
      <div className={styles.header}>
        <span>Service Description</span>
        <span>Amount (ZMW)</span>
      </div>
      {/* <PaymentHistoryItem /> */}
      <div className={styles.emptyState}>
        <div className={styles.icon}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
          >
            <path
              d="M8.51628 29.003C10.7188 30.2733 13.2742 31 15.9994 31C24.2837 31 31 24.2843 31 16C31 7.71575 24.2843 1 16 1C7.71573 1 1 7.71575 1 16C1 18.7252 1.72674 21.2807 2.99699 23.4832L3.00191 23.4917C3.12413 23.7036 3.18577 23.8105 3.21368 23.9115C3.24001 24.0067 3.24737 24.0924 3.24062 24.191C3.23338 24.2969 3.19767 24.4068 3.12447 24.6264L1.8431 28.4705L1.84149 28.4755C1.57113 29.2866 1.43595 29.6922 1.53231 29.9624C1.61632 30.198 1.80281 30.3839 2.03841 30.4679C2.30803 30.5641 2.71174 30.4295 3.51924 30.1603L3.5293 30.1566L7.37341 28.8752C7.59229 28.8023 7.70356 28.7653 7.80932 28.7581C7.90792 28.7513 7.99296 28.7602 8.08822 28.7865C8.18947 28.8145 8.29639 28.8762 8.50939 28.999L8.51628 29.003Z"
              stroke="#59B89E"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <div className={styles.message}>
          Select a Pupil to View Payment History
        </div>
      </div>
    </div>
  );
}

export default PaymentHistoryBox;
