import { useState } from "react";
import styles from "../styles/HomePage.module.css";
function HomePage() {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  // Optionally, you can keep the result in state for further use
  // const [students, setStudents] = useState([]);

  const handleLookup = async () => {
    setError("");
    if (!input) {
      setError("Please enter a phone number or student ID");
      return;
    }
    // Basic validation: phone (9+ digits) or non-empty student ID
    const isPhone = /^\d{9,}$/.test(input);
    const isStudentId = !isPhone && input.trim().length > 0;
    if (!isPhone && !isStudentId) {
      setError("Enter valid phone number or student ID");
      return;
    }
    const payload = isPhone
      ? { parent_phone: input }
      : { student_id: input };
    try {
      // Use environment variable for backend URL
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/students/student-lookup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.success || !data.data || data.data.length === 0) {
        setError("Enter valid phone number or student ID");
        return;
      }
      // For now, just log the result. In the future, route to next page with parent name.
      console.log("Student lookup result:", data);
      // Example: extract parent name if available (future use)
      // const parentName = data.data[0]?.parent_name || "";
    } catch (err) {
      setError("Failed to connect to backend.");
      console.error("Failed to connect to backend.", err);
    }
  };


  return (
    <main className={styles.main}>
      <nav className={styles.navigation}>
        <div className={styles.iconNname}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            viewBox="0 0 25 25"
            fill="none"
          >
            <path
              d="M25 12.5L12.5 0L-2.48028e-06 12.5L12.5 25L25 12.5Z"
              fill="#003049"
            />
            <path
              d="M6.7478 11.9285L12.4006 6.27563L18.0043 11.8793"
              stroke="#98FBCB"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span className={styles.title}>Master Fees</span>
        </div>
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="35"
            height="34"
            viewBox="0 0 25 24"
            fill="none"
          >
            <path
              d="M5.5 17H19.5M5.5 12H19.5M5.5 7H19.5"
              stroke="#003049"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
      </nav>
      <section className={styles.schoolSection}>
        <div className={styles.school}>
          <h2>Pay School Fees for</h2>
          <h1 className={styles.schoolName}>Twalumbu Education Centre</h1>
          <h3>Enter your registered phone number or the studend ID number</h3>
        </div>
        <div className={styles.inputs}>
          <input type="text" placeholder="e.g. 09xx-xxx-xxx" value={input} onChange={e => setInput(e.target.value)} />
          <button onClick={handleLookup}>Proceed</button>
        </div>
        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
        <div className={styles.terms}>
          <span>
            View the <a>terms</a> and
            <a> conditions </a> of service
          </span>
          <span>All Rights Reserved ©</span>
        </div>
      </section>
      <footer className={styles.footer}>
        <div className={styles.topArt}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="63"
            height="119"
            viewBox="0 0 63 119"
            fill="none"
          >
            <path
              d="M-44 23.4101L39.484 18.0739L44.7739 100.832"
              stroke="#98FBCB"
              stroke-opacity="0.65"
              stroke-width="35"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="125"
            height="119"
            viewBox="0 0 125 119"
            fill="none"
          >
            <path
              d="M18 23.4101L101.484 18.0739L106.774 100.832"
              stroke="#B2CCFF"
              stroke-opacity="0.1"
              stroke-width="35"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <div className={styles.bottomArt}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="118"
            height="119"
            viewBox="0 0 118 119"
            fill="none"
          >
            <path
              d="M11 23.4101L94.484 18.0739L99.7738 100.832"
              stroke="#B2CCFF"
              stroke-opacity="0.3"
              stroke-width="35"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="125"
            height="92"
            viewBox="0 0 125 92"
            fill="none"
          >
            <path
              d="M18 23.4101L101.484 18.0739L106.774 100.832"
              stroke="#B2CCFF"
              stroke-opacity="0.45"
              stroke-width="35"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </footer>
    </main>
  );
}

export default HomePage;
