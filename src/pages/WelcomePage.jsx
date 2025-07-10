import { useEffect, useState } from "react";
import styles from "../styles/WelcomePage.module.css";

export default function WelcomePage() {
  const [parent, setParent] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchParentAndStudents() {
      setLoading(true);
      setError(null);
      try {
        // Simulate login: use hardcoded parent phone or email
        const res = await fetch("http://localhost:8000/students/student-lookup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: "+260 97 999 9999" })
        });
        const data = await res.json();
        if (!data.success || !data.data || data.data.length === 0) {
          throw new Error(data.message || "No students found for this parent.");
        }
        // The API returns an array of students; parent info is not directly included
        setStudents(data.data);
        // Fetch parent info using the parent_id from the first student link (simulate for now)
        // In a real app, you would get parent info from auth or a separate endpoint
        setParent({
          first_name: "Dummy",
          last_name: "Parent",
          phone: "+260 97 999 9999"
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchParentAndStudents();
  }, []);

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <main className={styles.main}>
      <h1>Welcome, {parent ? `${parent.first_name} ${parent.last_name}` : "Parent"}!</h1>
      <h2>Your Children:</h2>
      <ul className={styles.studentList}>
        {students.map((student) => (
          <li key={student.id} className={styles.studentItem}>
            {student.first_name} {student.last_name} (ID: {student.student_id}, Grade: {student.grade})
          </li>
        ))}
      </ul>
    </main>
  );
}
