import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import "../css/AddQuizzes.css";

const AddQuizzes = () => {
  const addSampleQuizzes = async () => {
    try {
      // Add a sample quiz to Firestore
      await addDoc(collection(db, "quizzes"), {
        title: "JavaScript Basics",
        questions: [
          {
            question: "What is a closure?",
            options: ["Function within a function", "A loop", "Variable", "Object"],
            correctAnswer: "Function within a function",
            type: "single-choice"
          },
          {
            question: "Which of these is a truthy value?",
            options: ["0", "null", "undefined", "'0'"],
            correctAnswer: "'0'",
            type: "single-choice"
          }
        ]
      });

      await addDoc(collection(db, "quizzes"), {
        title: "React Fundamentals",
        questions: [
          {
            question: "What is JSX?",
            options: ["JavaScript Syntax", "JavaScript XML", "JavaScript Extension", "None"],
            correctAnswer: "JavaScript XML",
            type: "single-choice"
          },
          {
            question: "Can React components be stateful?",
            options: ["Yes", "No"],
            correctAnswer: "Yes",
            type: "true-false"
          }
        ]
      });

      console.log("Quizzes added successfully.");
    } catch (e) {
      console.error("Error adding quizzes: ", e);
    }
  };

  return (
    <div>
      <button onClick={addSampleQuizzes}>Add Sample Quizzes to Firestore</button>
    </div>
  );
};

export default AddQuizzes;
