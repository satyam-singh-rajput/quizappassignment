import React, { useState, useEffect } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import "../css/LeaderBoard.css";
const Leaderboard = () => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const fetchScores = async () => {
      const q = query(collection(db, "scores"), orderBy("score", "desc")); // Fetch scores in descending order
      const scoreSnapshot = await getDocs(q);
      const scoreList = scoreSnapshot.docs.map((doc) => doc.data());

      // Keep only the top 10 scores
      setScores(scoreList.slice(0, 10)); // Set state to only the top 10 scores
    };

    fetchScores();
  }, []);

  return (
    <div>
      <h2>Leaderboard</h2>
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Score</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((score, index) => (
            <tr key={index}>
              <td>{score.email}</td>
              <td>{score.score}</td>
              <td>{new Date(score.timestamp.seconds * 1000).toLocaleDateString()}</td> {/* Convert Firestore timestamp */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
