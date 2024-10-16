import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import "../css/QuizSelection.css";
const QuizSelection = () => {
  const [quizzes, setQuizzes] = useState([]);
  

  useEffect(() => {
    const fetchQuizzes = async () => {
      const quizCollection = collection(db, "quizzes");
      const quizSnapshot = await getDocs(quizCollection);
      const quizList = quizSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setQuizzes(quizList);
    };

    fetchQuizzes();
  }, []);

  return (
    <div>
      <h2>Select a Quiz</h2>
      <ul>
        {quizzes.map((quiz) => (
          <li key={quiz.id}>
            <h3>{quiz.title}</h3>
            <a href={`/quiz/${quiz.id}`}>Start Quiz</a>
          </li>
        ))}
      </ul>
      <Link to="/leaderboard">View Leaderboard</Link> {/* Add this link */}
    </div>
  );
};

export default QuizSelection;
