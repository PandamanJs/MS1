import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Title from "../components/Title";
import styles from "../styles/WelcomePage.module.css";

function WelcomePage() {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleProceed = async () => {
    setError("");

    if (!input.trim()) {
      setError("Please enter a valid phone number or student ID");
      return;
    }

    const payload = { search: input.trim() };

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

      const res = await fetch(`${API_URL}/lookup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const { success, parent, students } = await res.json();

      if (!success || !parent || !students || students.length === 0) {
        setError("Enter valid phone number or student ID");
        return;
      }

      const parentName = parent.name || "Parent";

      navigate("/home", {
        state: {
          parentName,
          students,
        },
      });

    } catch (err) {
      setError("Failed to connect to backend.");
      console.error("Connection error:", err);
    }
  };

  return (
    <main className={styles.main}>
      <Title />

      <section className={styles.schoolSection}>
        <div className={styles.school}>
          <h2>Pay School Fees for</h2>
          <h1 className={styles.schoolName}>Twalumbu Education Centre</h1>
          <h3>Enter your registered phone number or the student ID number</h3>
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
          />
        </div>

        {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}

        <div className={styles.terms}>
          <span>
            View the <a>terms</a> and
            <a> conditions </a> of service
          </span>
          <span>All Rights Reserved ©</span>

