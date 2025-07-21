import { useEffect, useState } from "react";
import styles from "../styles/WelcomePage.module.css";
import Title from "../components/Title";

export default function WelcomePage() {
  const [input, setInput] = useState("");
  const [parent, setParent] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setParent(null);
    setStudents([]);
    try {
      // Determine lookup type
      let payload = {};
      if (/^\+?\d{7,}$/.test(input)) {
        payload.phone = input;
      } else if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(input)) {
        payload.email = input;
      } else {
        payload.student_id = input;
      }
      const res = await fetch("http://localhost:8000/students/student-lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.success || !data.data || data.data.length === 0) {
        throw new Error(data.message || "No students found for this parent.");
      }
      setStudents(data.data);
      // Try to get parent info from the first student (if available)
      let parentId = null;
      if (
        data.data[0] &&
        data.data[0].parent_student_links &&
        data.data[0].parent_student_links.length > 0
      ) {
        parentId = data.data[0].parent_student_links[0].parents.id;
      }
      if (!parentId && data.data[0].parent_id) {
        parentId = data.data[0].parent_id;
      }
      if (parentId) {
        const parentRes = await fetch(
          `http://localhost:8000/parents/${parentId}`
        );
        const parentData = await parentRes.json();
        if (parentData.success && parentData.data) {
          setParent(parentData.data);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <Title />
      <div className={styles.school}>
        <h2>Pay School Fees for</h2>
        <h1 className={styles.schoolName}>Twalumbu Education Centre</h1>
      </div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label htmlFor="lookupInput">
          Enter your registered phone, email, or student ID:
        </label>
        <input
          id="lookupInput"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. +260 123 4567"
          className={styles.input}
        />
        <button
          type="submit"
          className={styles.button}
          disabled={loading || !input}
        >
          {loading ? "Loading..." : "Lookup"}
        </button>
      </form>
      {error && <div className={styles.error}>{error}</div>}
      {parent && (
        <h1>
          Welcome, {parent.first_name}{" "}
          {parent.middle_name ? parent.middle_name + " " : ""}
          {parent.last_name}!
        </h1>
      )}
      {students.length > 0 && (
        <>
          <h2>Your Children:</h2>
          <ul className={styles.studentList}>
            {students.map((student) => (
              <li key={student.id} className={styles.studentItem}>
                {student.first_name} {student.last_name} (ID:{" "}
                {student.student_id}, Grade: {student.grade})
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}
