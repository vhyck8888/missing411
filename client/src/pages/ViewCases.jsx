import React from 'react';
import { useNavigate } from 'react-router-dom';

const ViewCases = ({ user, cases, setSelectedCase, searchTerm }) => {
  const navigate = useNavigate();

  if (!user) {
    return <p>Please log in to view cases.</p>;
  }

  const approvedCases = cases.filter(c => c.pending === false);

  const filtered = approvedCases.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (c) => {
    setSelectedCase(c);
    navigate('/');
  };

  const getImageUrl = (caseItem) => {
    if (caseItem.photoUrl) {
      if (caseItem.photoUrl.startsWith('data:')) {
        return caseItem.photoUrl;
      }
      return `http://localhost:5000/uploads/${caseItem.photoUrl}`;
    }
    return null;
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Cases List</h2>
      {filtered.length === 0 ? (
        <p>No cases match your search.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {filtered.map((c) => {
            const imageUrl = getImageUrl(c);
            return (
              <li
                key={c._id}
                style={{ 
                  border: '1px solid #ccc', 
                  padding: '10px', 
                  marginBottom: '10px', 
                  cursor: 'pointer',
                  display: 'flex',
                  gap: '20px'
                }}
                onClick={() => handleSelect(c)}
              >
                <div style={{ width: '100px', height: '100px', overflow: 'hidden' }}>
                  {imageUrl ? (
                    <img 
                      src={imageUrl} 
                      alt={c.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/100?text=No+Image';
                      }}
                    />
                  ) : (
                    <div style={{ 
                      width: '100%', 
                      height: '100%', 
                      backgroundColor: '#eee',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      No Image
                    </div>
                  )}
                </div>
                <div>
                  <strong>Name:</strong> {c.name}<br />
                  <strong>Status:</strong> {c.status}<br />
                  <strong>Date:</strong> {new Date(c.date).toLocaleDateString()}<br />
                  <strong>Location:</strong> {c.latitude.toFixed(3)}, {c.longitude.toFixed(3)}
                  {c.description && (
                    <>
                      <br />
                      <strong>Description:</strong> {c.description}
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ViewCases;
