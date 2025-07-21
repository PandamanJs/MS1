import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/ReceiptsPage.module.css";
import Title from "../components/Title";

export default function ReceiptsPage() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStudentsAndReceipts() {
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
        // Fetch receipts for the first student by default
        if (data.data[0]) {
          const recRes = await fetch(`http://localhost:8000/students/${data.data[0].id}/payments`);
          const recData = await recRes.json();
          setReceipts(recData.data || []);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchStudentsAndReceipts();
  }, []);

  const handleSelectStudent = async (idx) => {
    setSelectedIdx(idx);
    setLoading(true);
    setError(null);
    try {
      const student = students[idx];
      const recRes = await fetch(`http://localhost:8000/students/${student.id}/payments`);
      const recData = await recRes.json();
      setReceipts(recData.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  const selectedStudent = students[selectedIdx] || null;

  return (
    <main className={styles.container}>
      <button
        className={styles.closeBtn}
        onClick={() => navigate(-1)}
        aria-label="Close"
      >
        &times;
      </button>
      <h1 className={styles.title}>Sales Receipts</h1>
      <p className={styles.subtitle}>
        Download the receipts or have them sent to your whatsapp or email.
      </p>
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
      <ul className={styles.list}>
        {receipts.map((r) => (
          <li key={r.id} className={styles.item}>
            <div className={styles.info}>
              <div className={styles.header}>
                {r.notes || r.description || "Payment"} – Receipt No. {r.receipt_number || r.id}
              </div>
              <div className={styles.meta}>{selectedStudent ? `${selectedStudent.first_name} ${selectedStudent.last_name} – ${selectedStudent.grade}` : ""}</div>
              <div className={styles.meta}>ZMW {r.amount}</div>
              <div className={styles.meta}>{r.payment_date ? new Date(r.payment_date).toLocaleDateString() : ""}</div>
            </div>
            <button className={styles.viewBtn}>View</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
