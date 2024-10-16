import React, { useState, useEffect } from 'react'; // Add this line
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import "../css/AdminDashboard.css";

const AdminDashboard = () => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const fetchScores = async () => {
      const scoresCollection = collection(db, "scores");
      const scoresSnapshot = await getDocs(scoresCollection);
      const scoresList = scoresSnapshot.docs.map(doc => doc.data());
      setScores(scoresList);
    };
    fetchScores();
  }, []);

  return (
    <div>
      <h2>Leaderboard</h2>
      <ul>
        {scores.map((score, index) => (
          <li key={index}>{score.userName}: {score.points}</li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
