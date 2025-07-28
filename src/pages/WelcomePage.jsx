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

      const cleanedInput = input.trim().replace(/\u200E/g, ""); 
      
      let payload = {};
      if (/^\+?\d{7,}$/.test(cleanedInput)) {
        payload.phone = cleanedInput.trim();
      } else if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(cleanedInput)) {
        payload.email = cleanedInput.trim();
      } else {
        payload.student_id = cleanedInput.trim();
      }

      console.log("Cleaned input:", cleanedInput)

      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

      const res = await fetch(`${API_URL}/lookup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }, 
        
        body: JSON.stringify({ search: cleanedInput }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "No students found");
      }
      
      if (!data.success || !data.students || data.students.length === 0) {
        throw new Error("No matching students or parents found. Please check your input.");
      }

      setStudents(data.students);
      setParent(data.parent);

          navigate("/home", {
            state: {
              parentName: `${data.parent.first_name} ${data.parent.last_name}`,
              students: data.students,
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

        <div className={styles.input}>
          <div className={styles.inputForm}>
            <label for="text">Enter your phone number or a student ID</label>
            <input
              type="text"
              placeholder="e.g. +260123456789 or 12323"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>

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
            View the <a href="#">terms</a> and <a href="#">conditions</a> of
            service
          </span>
          <span>All rights reserved ©</span>
        </div>
      </section>
    </main>
  );
}

//export default WelcomePage;
