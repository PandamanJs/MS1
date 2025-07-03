import styles from "../styles/AddSchoolFeesForm.module.css";

function AddSchoolFeesForm() {
  return (
    <div className={styles.formContainer}>
      <h3 className={styles.header}>+ Add School Fees</h3>

      <div className={styles.fieldGroup}>
        <label htmlFor="grade">Select Grade</label>
        <select id="grade" className={styles.select}>
          <option>Grade 3 - K1,500 (Per term)</option>
          <option>Grade 4 - K1,700 (Per term)</option>
        </select>
      </div>

      <div className={styles.fieldGroup}>
        <label htmlFor="year">Enter Year of Service</label>
        <select id="year" className={styles.select}>
          <option>2025</option>
          <option>2024</option>
        </select>
      </div>

      <div className={styles.fieldGroup}>
        <label htmlFor="term">
          Select the Term (You can choose to pay for more than one term)
        </label>
        <select id="term" className={styles.select}>
          <option>Term 1</option>
          <option>Term 2</option>
          <option>Term 3</option>
        </select>
      </div>

      <button className={styles.doneButton}>Done</button>
    </div>
  );
}

export default AddSchoolFeesForm;
