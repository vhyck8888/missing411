import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import TopBar from './components/TopBar';
import SubmitCase from './pages/SubmitCase';
import ViewCases from './pages/ViewCases';
import HomePage from './pages/HomePage';
import './App.css';
import './index.css';
import VerifyEmail from './pages/VerifyEmail';
import DateTimeDisplay from './components/DateTimeDisplay'



function App() {
  const [user, setUser] = useState(null);
  const [selectedCase, setSelectedCase] = useState(null);
  const [cases, setCases] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [commentText, setCommentText] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/cases');
        const data = await res.json();
        setCases(data);
      } catch (err) {
        console.error('Error fetching cases:', err);
      }
    };

    fetchCases();
  }, []);

  useEffect(() => {
  const fetchProfile = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/profile', {
        credentials: 'include', // lets send cookie
      });
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  fetchProfile();
}, []);


  const login = (userData) => setUser(userData);

  const logout = async () => {
  try {
    await fetch('http://localhost:5000/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
  } catch (err) {
    console.error('Logout error:', err);
  }
  setUser(null);
  setSelectedCase(null);
};


  const onHomeClick = () => {
    setSelectedCase(null);
    navigate('/');
  };

  const handleSubmitComment = async () => {
  if (!commentText.trim()) {
    alert("Please enter a comment before submitting.");
    return;
  }

  try {
    const res = await fetch(`http://localhost:5000/api/cases/${selectedCase._id}/comment`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: commentText,
        userId: user?._id || null,
      }),
    });

    if (!res.ok) {
      throw new Error('Failed to submit comment.');
    }

    const updatedCase = await res.json();

    setCases(prev =>
      prev.map(c => (c._id === updatedCase._id ? updatedCase : c))
    );

    setSelectedCase(updatedCase);

    alert("Comment added!");
    setCommentText('');
    setIsCommenting(false);
  } catch (err) {
    console.error('Error submitting comment:', err);
    alert('Failed to submit comment.');
  }
};


  const handleCancel = () => {
    setCommentText('');
    setIsCommenting(false);
  };

  const handleKeyDown = (e) => {
    if ((e.key === 'Enter' && !e.shiftKey) || (e.key === 'Enter' && e.ctrlKey)) {
      e.preventDefault();
      handleSubmitSolution();
    }
  };
  

  return (
    <div className="app-container">
      <TopBar
        user={user}
        logout={logout}
        login={login}
        onHomeClick={onHomeClick}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {user && (
        <div className="nav-links">
          
          <Link to="/submit">Submit Case</Link>
          <Link to="/cases">View Cases</Link>

           <div className="nav-datetime">
          <DateTimeDisplay />
        </div>
        </div>
        
      )}

      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              user={user}
              selectedCase={selectedCase}
              setSelectedCase={setSelectedCase}
              commentText={commentText}
              setCommentText={setCommentText}
              isCommenting={isCommenting}
              setIsCommenting={setIsCommenting}
               handleSubmitComment={handleSubmitComment}
              handleCancel={handleCancel}
              handleKeyDown={handleKeyDown}
              cases={cases}
              searchTerm={searchTerm}
            />
          }
        />
        <Route
          path="/submit"
          element={<SubmitCase user={user} setCases={setCases} />}
        />
        <Route
          path="/cases"
          element={
            <ViewCases
              user={user}
              cases={cases}
              setSelectedCase={setSelectedCase}
              searchTerm={searchTerm}
            />
          }
        />
        <Route path="/verify" element={<VerifyEmail />} />
      </Routes>
    </div>
  );
}

export default App;
