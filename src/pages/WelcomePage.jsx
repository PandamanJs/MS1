import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Title from "../components/Title";
import Button from "../components/Button";
import { lookupStudent } from "../services/database";
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
      
      console.log("Cleaned input:", cleanedInput);

      const result = await lookupStudent(cleanedInput);

      if (!result.success) {
        throw new Error(result.error || "No students found");
      }
      
      if (!result.data || result.data.length === 0) {
        throw new Error("No matching students or parents found. Please check your input.");
      }

      // Use the first student found as the primary student
      const foundStudents = result.data;
      setStudents(foundStudents);
      
      // Set parent info based on the first student
      const primaryStudent = foundStudents[0];
      setParent({
        first_name: "Parent of",
        last_name: primaryStudent.first_name
      });

      let title = "Mr./Miss./Mrs.";

      navigate("/home", {
        state: {
          parentName: `${title} ${primaryStudent.last_name}`,
          students: foundStudents.map(student => ({
            id: student.id,
            first_name: student.first_name,
            last_name: student.last_name,
            student_id: student.student_id
          })),
        },
      });
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
            <label htmlFor="text">Enter your phone number or a student ID</label>
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
