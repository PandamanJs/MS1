import styles from "../styles/SelectedChild.module.css";

function SelectedChild({ givenClassName }) {
  return (
    <div className={`${styles.main} ${styles[givenClassName]}`}>
      <span>Tabitha Kapambwe</span>
      <span>C20012</span>
    </div>
  );
}

export default SelectedChild;
