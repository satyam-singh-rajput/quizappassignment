import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import QuizSelection from './components/QuizSelection';
import QuizPage from './components/QuizPage';
import SignIn from './components/SignIn';
import Leaderboard from './components/LeaderBoard';
import UploadQuiz from './components/UploadQuiz'; // Import UploadQuiz component
import ProtectedRoute from './components/ProtectedRoute';
import { useTheme } from './ThemeContext';
import './styles.css'; // Import your CSS file

function App() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <Router>
      <div className={theme}> {/* Apply theme class to the main div */}
        <header>
          <h1>My Quiz App</h1>
          <button onClick={toggleTheme}>
            Switch to {theme === "light" ? "Dark" : "Light"} Theme
          </button>
        </header>
        
        <Routes>
          <Route path="/signin" element={<SignIn />} /> {/* SignIn page route */}
          
          {/* Protected Route for User and Admin */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <QuizSelection />
              </ProtectedRoute>
            }
          />
          
          <Route path="/quiz/:quizId" element={<QuizPage />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          
          {/* Admin Upload Route */}
          <Route 
            path="/admin/upload-quiz" 
            element={
              // <ProtectedRoute> {/* Protect the Upload Quiz route */}
                <UploadQuiz />
              // </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
