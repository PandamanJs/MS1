import Button from "../components/Button";
import Title from "../components/Title";
import styles from "../styles/WelcomePage.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function WelcomePage() {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleProceed = async () => {
    setError("");
    if (!input) {
    setError("Please enter a phone number or student ID");
    return;
    }
    const isPhone = /^\d{9,}$/.test(input.replace(/[^0-9]/g, ''));
    const isStudentId = !isPhone && input.trim().length > 0;
    if (!isPhone && !isStudentId) {
        setError("Enter valid phone number or student ID");
        return;
    }
    const payload = isPhone ? { parent_phone: input } : { student_id: input };
    try {
       const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
       const res = await fetch(`${apiUrl}/lookup`, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(payload),
       });
       const { data } = await res.json();
       if (
         !data.success ||
         !data.data ||
         data.data.length === 0 ||
         data.message === "Parent found, but no students linked"
       ) {
         setError("Enter valid phone number or student ID");
         return;
       }
       // Try to extract parent name from the first student record (if available)
       let parentName = "Parent";
       let students = [];
       if (data.data && data.data[0]) {
         // If backend includes parent info, use it. Otherwise, fallback to student name.
         parentName =
           data.data[0].parent_name ||
           `${data.data[0].first_name} ${data.data[0].last_name}`;
         students = data.data;
       }
    navigate("/home", { state: { parentName, students } });
    //   navigate("/home");
     } catch (err) {
       setError("Failed to connect to backend.");
       console.error("Failed to connect to backend.", err);
     }
  };

  return (
    <main className={styles.main}>
      <Title />
      <section className={styles.schoolSection}>
        <div className={styles.school}>
          <h2>Pay School Fees for</h2>
          <h1 className={styles.schoolName}>Twalumbu Education Centre</h1>
          <h3>Enter your registered phone number or the studend ID number</h3>
        </div>
        <div className={styles.inputs}>
          <input
            type="text"
            placeholder="e.g. 09xx-xxx-xxx"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button
            message={"Proceed"}
            givenClassName="active"
            onClick={handleProceed}
          ></Button>
        </div>
        {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
        <div className={styles.terms}>
          <span>
            View the <a>terms</a> and
            <a> conditions </a> of service
          </span>
          <span>All Rights Reserved ©</span>
        </div>
      </section>
    </main>
  );
}

export default WelcomePage;
