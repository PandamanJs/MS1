import { useEffect, useState } from "react";
import Button from "../components/Button";
import ProceedButton from "../components/ProceedButton";
import Title from "../components/Title";
import styles from "../styles/BalanceSummary.module.css";

function BalanceSummary() {
  const [students, setStudents] = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    async function fetchStudentsAndBalances() {
      setLoading(true);
      setError(null);
      try {
        // Fetch students for the parent (simulate login for now)
        const res = await fetch("http://localhost:8000/students/student-lookup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: "+260 97 999 9999" })
        });
        const data = await res.json();
        if (!data.success || !data.data || data.data.length === 0) {
          throw new Error(data.message || "No students found for this parent.");
        }
        setStudents(data.data);
        // Fetch balances for the first student by default
        if (data.data[0]) {
          const balRes = await fetch(`http://localhost:8000/students/${data.data[0].id}/fees`);
          const balData = await balRes.json();
          setBalances(balData.data || []);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchStudentsAndBalances();
  }, []);

  const handleSelectStudent = async (idx) => {
    setSelectedIdx(idx);
    setLoading(true);
    setError(null);
    try {
      const student = students[idx];
      const balRes = await fetch(`http://localhost:8000/students/${student.id}/fees`);
      const balData = await balRes.json();
      setBalances(balData.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  function handlePayForAllBalances() {}
  const handleAddToPayments = () => {
    setAdded(true);
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  const selectedStudent = students[selectedIdx] || null;

  return (
    <div className={styles.wrapper}>
      <Title />
      <div className={styles.header}>
        <h2>Current Balances Owing</h2>
        <div className={styles.totalLabel}>Total Balance</div>
        <div className={styles.totalAmount}>
          ZMW {balances.reduce((sum, b) => sum + (b.amount - (b.paid_amount || 0)), 0).toFixed(2)}
        </div>
        <Button
          givenClassName="active"
          message="Pay For All Balances"
          onClick={handlePayForAllBalances}
        />
      </div>
      <hr className={styles.separator} />
      <div className={styles.detailSection}>
        <h3>Detailed Balance info</h3>
        {students.length > 1 && (
          <div className={styles.studentSelector}>
            {students.map((student, idx) => (
              <button
                key={student.id}
                className={idx === selectedIdx ? styles.selected : ""}
                onClick={() => handleSelectStudent(idx)}
              >
                {student.first_name} {student.last_name}
              </button>
            ))}
          </div>
        )}
        {balances.length === 0 ? (
          <div>No outstanding balances.</div>
        ) : (
          balances.map((fee, i) => (
            <div key={fee.id} className={styles.breakdownBox}>
              <div className={styles.breakdownRowBold}>
                <span>{fee.fee_types?.name || "Fee"} - {fee.amount}</span>
                <span>Due: {fee.due_date}</span>
              </div>
              <div className={styles.breakdownRow}>
                <span>Paid</span>
                <span>K{fee.paid_amount || 0}</span>
              </div>
              <div className={styles.breakdownRow}>
                <span>Balance</span>
                <span>K{(fee.amount - (fee.paid_amount || 0)).toFixed(2)}</span>
              </div>
            </div>
          ))
        )}
        {added ? (
          <div className={styles.addedBox}>
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
