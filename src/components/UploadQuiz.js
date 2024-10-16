import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";
import "../css/UploadQuiz.css";
const UploadQuiz = () => {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([
    { question: "", options: ["", "", "", ""], correctAnswer: "", type: "single-choice" }
  ]);

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    if (field === "question") {
      newQuestions[index].question = value;
    } else if (field === "correctAnswer") {
      newQuestions[index].correctAnswer = value; // Update correct answer
    } else if (field === "type") {
      newQuestions[index].type = value; // Update question type
      // Reset options if changing to true/false
      if (value === "true-false") {
        newQuestions[index].options = ["True", "False"];
      } else {
        newQuestions[index].options = ["", "", "", ""]; // Reset options for other types
      }
    } else {
      newQuestions[index].options[field] = value; // Update options
    }
    setQuestions(newQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { question: "", options: ["", "", "", ""], correctAnswer: "", type: "single-choice" }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "quizzes"), {
        title,
        questions
      });
      alert("Quiz uploaded successfully!");
      setTitle(""); 
      setQuestions([{ question: "", options: ["", "", "", ""], correctAnswer: "", type: "single-choice" }]);
    } catch (error) {
      console.error("Error uploading quiz: ", error);
    }
  };

  return (
    <div>
      <h2>Upload a New Quiz</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Quiz Title"
          required
        />
        {questions.map((q, index) => (
          <div key={index}>
            <input
              type="text"
              value={q.question}
              onChange={(e) => handleQuestionChange(index, "question", e.target.value)}
              placeholder={`Question ${index + 1}`}
              required
            />
            <select value={q.type} onChange={(e) => handleQuestionChange(index, "type", e.target.value)}>
              <option value="single-choice">Single Choice</option>
              <option value="multiple-choice">Multiple Choice</option>
              <option value="true-false">True/False</option>
            </select>
            {q.type === "true-false" ? (
              <div>
                <input
                  type="text"
                  value="True"
                  disabled
                  placeholder="True" // Display "True"
                />
                <input
                  type="text"
                  value="False"
                  disabled
                  placeholder="False" // Display "False"
                />
                <input
                  type="text"
                  value={q.correctAnswer}
                  onChange={(e) => handleQuestionChange(index, "correctAnswer", e.target.value)}
                  placeholder="Correct Answer (True/False)"
                  required
                />
              </div>
            ) : (
              <>
                {q.options.map((option, optionIndex) => (
                  <input
                    key={optionIndex}
                    type="text"
                    value={option}
                    onChange={(e) => handleQuestionChange(index, optionIndex, e.target.value)}
                    placeholder={`Option ${optionIndex + 1}`}
                    required
                  />
                ))}
                <input
                  type="text"
                  value={q.correctAnswer}
                  onChange={(e) => handleQuestionChange(index, "correctAnswer", e.target.value)}
                  placeholder="Correct Answer (comma-separated for multiple)"
                  required
                />
              </>
            )}
          </div>
        ))}
        <button type="button" onClick={handleAddQuestion}>Add Another Question</button>
        <button type="submit">Submit Quiz</button>
      </form>
    </div>
  );
};

export default UploadQuiz;
