import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, addDoc, collection, getDocs, writeBatch } from "firebase/firestore"; 
import { db } from "../firebase"; 
import { auth } from "../firebase"; 
import "../css/QuizPage.css";

const QuizPage = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState([]); // Initialize as an empty array
  const [wrongAnswersSummary, setWrongAnswersSummary] = useState([]); // To track wrong answers
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuiz = async () => {
      const quizDoc = doc(db, "quizzes", quizId);
      const quizSnapshot = await getDoc(quizDoc);
      if (quizSnapshot.exists()) {
        const quizData = quizSnapshot.data();
        setQuiz(quizData);
        // Initialize selectedAnswers with appropriate values
        setSelectedAnswers(new Array(quizData.questions.length).fill(null)); // For single and true/false
      } else {
        console.log("No such quiz!");
      }
    };
    fetchQuiz();
  }, [quizId]);

  const handleAnswerSubmit = (option) => {
    const currentQuestion = quiz.questions[currentQuestionIndex];
    
    // Handle answer selection
    if (currentQuestion.type === "multiple-choice") {
      const updatedSelectedAnswers = [...selectedAnswers];
      if (updatedSelectedAnswers[currentQuestionIndex] === null) {
        updatedSelectedAnswers[currentQuestionIndex] = []; // Initialize if null
      }

      // Toggle selection for multiple-choice answers
      if (updatedSelectedAnswers[currentQuestionIndex].includes(option)) {
        updatedSelectedAnswers[currentQuestionIndex] = updatedSelectedAnswers[currentQuestionIndex].filter(ans => ans !== option);
      } else {
        updatedSelectedAnswers[currentQuestionIndex].push(option);
      }
      setSelectedAnswers(updatedSelectedAnswers);
    } else {
      // For single-choice and true/false questions
      setSelectedAnswers(prev => {
        const updated = [...prev];
        updated[currentQuestionIndex] = option;
        return updated;
      });
    }
  };

  const handleNextQuestion = () => {
    const currentQuestion = quiz.questions[currentQuestionIndex];
    let isCorrect = false;

    if (currentQuestion.type === "single-choice" || currentQuestion.type === "true-false") {
      // Check if the selected answer is correct for single-choice questions
      isCorrect = selectedAnswers[currentQuestionIndex] === currentQuestion.correctAnswer;
    } else if (currentQuestion.type === "multiple-choice") {
      // Check if the selected answers include all correct answers
      const correctAnswers = currentQuestion.correctAnswer.split(','); // Assuming correct answers are stored as comma-separated string
      isCorrect = correctAnswers.every(answer => selectedAnswers[currentQuestionIndex]?.includes(answer));
    }

    // If the answer is incorrect, track the wrong answer details
    if (!isCorrect) {
      const userAnswer = selectedAnswers[currentQuestionIndex];
      setWrongAnswersSummary(prev => [
        ...prev,
        {
          question: currentQuestion.question,
          userAnswer: userAnswer,
          correctAnswer: currentQuestion.correctAnswer
        }
      ]);
    } else {
      setScore(score + 1);
    }

    // Move to the next question or show score if it's the last question
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowScore(true);
      saveUserScore(); // Save score when quiz is completed
    }
  };

  const handleBackToQuizSelection = () => {
    navigate("/"); // Redirect back to Quiz Selection page
  };

  const saveUserScore = async () => {
    const user = auth.currentUser; 
    if (user) {
      const userEmail = user.email;

      try {
        const scoresCollection = collection(db, "scores");
        const scoresSnapshot = await getDocs(scoresCollection);
        const scoresList = scoresSnapshot.docs.map(doc => doc.data());

        let newScores = [...scoresList, { email: userEmail, score: score, timestamp: new Date() }];
        newScores.sort((a, b) => b.score - a.score); // Sort scores in descending order

        newScores = newScores.slice(0, 10); // Keep only top 10 scores

        const batch = writeBatch(db);
        scoresSnapshot.docs.forEach(doc => {
          batch.delete(doc.ref); // Delete old scores
        });

        newScores.forEach(async (score) => {
          await addDoc(scoresCollection, score); // Add each score to Firestore
        });

        console.log("Score saved successfully.");
      } catch (error) {
        console.error("Error saving score: ", error);
      }
    } else {
      console.log("User is not logged in");
    }
  };

  // Calculate progress
  const progressPercentage = showScore ? 100 : (currentQuestionIndex / (quiz?.questions.length || 1)) * 100; // Avoid division by zero

  return (
    <div>
      {quiz ? (
        <div>
          <h2>{quiz.title}</h2>
          <div style={{ width: "100%", backgroundColor: "#e0e0e0", borderRadius: "5px", marginBottom: "20px" }}>
            <div
              style={{
                width: `${progressPercentage}%`,
                backgroundColor: "#76c7c0",
                height: "10px",
                borderRadius: "5px",
                transition: "width 0.3s ease"
              }}
            />
          </div>
          {!showScore ? (
            <div>
              <h3>{quiz.questions[currentQuestionIndex].question}</h3>
              {quiz.questions[currentQuestionIndex].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSubmit(option)}
                  style={{
                    backgroundColor:
                      selectedAnswers[currentQuestionIndex]?.includes(option), // Highlight selected options for multiple-choice
                  }}
                >
                  {option}
                </button>
              ))}

              <button onClick={handleNextQuestion}>Next Question</button>
            </div>
          ) : (
            <div>
              <h3>Your final score is: {score} / {quiz.questions.length}</h3>
              <h4>Summary of Wrong Answers:</h4>
              {wrongAnswersSummary.length > 0 ? (
                <ul>
                  {wrongAnswersSummary.map((wrongAnswer, index) => (
                    <li key={index}>
                      <strong>Question:</strong> {wrongAnswer.question} <br />
                      <strong>Your Answer:</strong> {wrongAnswer.userAnswer} <br />
                      <strong>Correct Answer:</strong> {wrongAnswer.correctAnswer} <br />
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No wrong answers! Great job!</p>
              )}
              <button onClick={handleBackToQuizSelection}>Go Back to Quiz Selection</button>
            </div>
          )}
        </div>
      ) : (
        <p>Loading quiz...</p>
      )}
    </div>
  );
};

export default QuizPage;
