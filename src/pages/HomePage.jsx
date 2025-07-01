import Button from "../components/Button";
import Title from "../components/Title";
import styles from "../styles/HomePage.module.css";
import { useLocation } from "react-router-dom";

function HomePage() {
  const location = useLocation();
  const parentName = location.state?.parentName || "Parent";
  return (
    <div className={styles.main}>
      <Title />
      <section className={styles.userInfo}>
        <h2>Good Afternoon</h2>
        <h1>{parentName}</h1>
        <h3>
          Which one of our services would you like us to help you with today?
        </h3>
      </section>
      <section className={styles.buttons}>
        <Button message="Pay For School Fees" givenClassName="active"></Button>
        <Button
          message="View/Clear Current Balances"
          givenClassName="notActive"
        ></Button>
        <Button
          message="View My Payment History"
          givenClassName="notActive"
        ></Button>
        <Button
          message="View School Payment Plans"
          givenClassName="notActive"
        ></Button>
      </section>
    </div>
  );
}

export default HomePage;
