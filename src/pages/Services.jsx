import { useState } from "react";
import Button from "../components/Button";
import CheckoutBar from "../components/CheckoutBar";
import PaymentHistoryBox from "../components/PaymentHistoryBox";
import AddSchoolFeesForm from "../components/AddSchoolFeesForm"; // Make sure this is created and exported
import SelectedChild from "../components/SelectedChild";
import Title from "../components/Title";
import styles from "../styles/Services.module.css";

function Services() {
  const [showAddFeesForm, setShowAddFeesForm] = useState(false);

  function handleAddSchoolFees() {
    setShowAddFeesForm((prev) => !prev);
  }

  return (
    <main>
      <Title />
      <div className={styles.instructions}>
        <h1>Choose the account(s) you want to pay for.</h1>
      </div>
      <div className={styles.subInstructions}>
        <h2>
          Tap the boxes to select the children you want to make a payment for.
        </h2>
      </div>
      <div className={styles.currentChild}></div>

      <div className={styles.container}>
        <div className={styles.selectedChildren}>
          <div className={styles.childCard}>
            <SelectedChild givenClassName="active" />
          </div>
          <div className={styles.childCard}>
            <SelectedChild givenClassName="notActive" />
          </div>
        </div>

        <div className={styles.paymentHistory}>
          {showAddFeesForm ? <AddSchoolFeesForm /> : <PaymentHistoryBox />}
        </div>

        <div className={styles.buttons}>
          <Button
            message={
              showAddFeesForm
                ? "← Back to Payment History"
                : "+ Add School Fees"
            }
            givenClassName="active"
            onClick={handleAddSchoolFees}
          />
          <Button
            message="Add Other Services"
            givenClassName="notActive"
            onClick={() => {}}
          />
        </div>
      </div>

      <CheckoutBar />
    </main>
  );
}

export default Services;
