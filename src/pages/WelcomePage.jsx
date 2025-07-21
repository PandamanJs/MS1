import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Title from "../components/Title";
import Button from "../components/Button";
import styles from "../styles/WelcomePage.module.css";

export default function WelcomePage() {
  const [input, setInput] = useState("");
  const [parent, setParent] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setParent(null);
    setStudents([]);

    if (!input.trim()) {
      setError("Please enter a valid phone number, email, or student ID");
      setLoading(false);
      return;
    }

    try {
      let payload = {};
      if (/^\+?\d{7,}$/.test(input)) {
        payload.phone = input.trim();
      } else if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(input)) {
        payload.email = input.trim();
      } else {
        payload.student_id = input.trim();
      }

      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

      const res = await fetch(`${API_URL}/students/student-lookup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!data.success || !data.data || data.data.length === 0) {
        throw new Error(data.message || "No students found for this parent.");
      }

      setStudents(data.data);

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
        const parentRes = await fetch(`${API_URL}/parents/${parentId}`);
        const parentData = await parentRes.json();
        if (parentData.success && parentData.data) {
          setParent(parentData.data);

          // Optional: navigate to home with state
          navigate("/home", {
            state: {
              parentName: parentData.data.name || "Parent",
              students: data.data,
            },
          });
        }
      }
    } catch (err) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <Title />

      <section className={styles.schoolSection}>
        <div className={styles.school}>
          <h2>Pay School Fees for</h2>
          <h1 className={styles.schoolName}>Twalumbu Education Centre</h1>
          <h3>Enter your registered phone number, email or the student ID</h3>
        </div>

        <div className={styles.inputs}>
          <input
            type="text"
            placeholder="e.g. +260123456789 or student ID"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <Button
            message={loading ? "Loading..." : "Proceed"}
            givenClassName="active"
            onClick={handleSubmit}
            disabled={loading}
          />
        </div>

        {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}

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

        <div className={styles.terms}>
          <span>
            View the <a>terms</a> and <a>conditions</a> of service
          </span>
          <span>All Rights Reserved ©</span>
        </div>
      </section>
    </main>
  );
}
