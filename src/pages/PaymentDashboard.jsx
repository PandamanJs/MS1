import { useEffect, useState } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import Button from "../components/Button";
import styles from "../styles/PaymentDashboard.module.css";
import AddSchoolFeesForm from "../components/AddSchoolFeesForm";

function PaymentDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [students, setStudents] = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStudents() {
      setLoading(true);
      setError(null);
      try {
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
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchStudents();
  }, []);

  const handleSelectServices = () => {
    navigate("services");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const isBasePath = location.pathname === "/home/payment-dashboard";
  const selectedStudent = students[selectedIdx] || null;

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <main className={styles.main}>
      {isBasePath ? (
        <>
          <div
            className={styles.nav}
            onClick={handleGoBack}
            style={{ cursor: "pointer" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M18.7071 6.70711C19.0976 6.31658 19.0976 5.68342 18.7071 5.29289C18.3166 4.90237 17.6834 4.90237 17.2929 5.29289L12 10.5858L6.70711 5.29289C6.31658 4.90237 5.68342 4.90237 5.29289 5.29289C4.90237 5.68342 4.90237 6.31658 5.29289 6.70711L10.5858 12L5.29289 17.2929C4.90237 17.6834 4.90237 18.3166 5.29289 18.7071C5.68342 19.0976 6.31658 19.0976 6.70711 18.7071L12 13.4142L17.2929 18.7071C17.6834 19.0976 18.3166 19.0976 18.7071 18.7071C19.0976 18.3166 19.0976 17.6834 18.7071 17.2929L13.4142 12L18.7071 6.70711Z"
                fill="#2D3648"
              />
            </svg>
          </div>
          <div className={styles.instructions}>
            <h1>Choose the account(s) you want to pay for.</h1>
          </div>
          <div className={styles.subInstructions}>
            <h2>
              Tap the boxes to select the children you want to make a payment
              for.
            </h2>
          </div>
          <div className={styles.studentSelector}>
            {students.map((student, idx) => (
              <button
                key={student.id}
                className={idx === selectedIdx ? styles.selected : ""}
                onClick={() => setSelectedIdx(idx)}
              >
                {student.first_name} {student.last_name}
              </button>
            ))}
          </div>
          <Button
            message="Select Services"
            givenClassName="active"
            onClick={handleSelectServices}
          />
        </>
      ) : (
        <Outlet context={{ selectedStudent }} />
      )}
    </main>
  );
}

export default PaymentDashboard;
