import React from 'react';
import MapView from '../components/MapView';

const HomePage = ({
  user,
  selectedCase,
  setSelectedCase,
  commentText,
  setCommentText,
  isCommenting,
  setIsCommenting,
  handleSubmitComment,
  cases,
  searchTerm,
}) => {
  const filteredCases = user
    ? selectedCase
      ? [selectedCase]
      : cases.filter((c) =>
          c.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    : [];

  const isCaseSelected = !!selectedCase;

  const getImageUrl = (caseItem) => {
    if (!caseItem.photoUrl) return null;
    return caseItem.photoUrl.startsWith('http') 
      ? caseItem.photoUrl 
      : `http://localhost:5000/uploads/${caseItem.photoUrl}`;
  };

  if (!user) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Please log in to view and select cases.</h2>
      </div>
    );
  }

  return (
    <div className={`content-wrapper ${isCaseSelected ? 'column-layout' : ''}`}>
      <div className="map-section">
        <MapView cases={filteredCases} getImageUrl={getImageUrl} />
      </div>

      <div className="sidebar">
        {!selectedCase ? (
          <>
            <h3>Welcome!</h3>
            <p>
              Use the <strong>View Cases</strong> page to select a case,
              or search for a name above.
            </p>
            <p>Please respect the community guidelines</p>
            <p>This not a dating site </p>
          </>
        ) : (
          <>
            <h3>Case Details</h3>

            {selectedCase.photoUrl && (
              <div style={{ height: 250, overflow: 'hidden' }}>
                <img
                  src={getImageUrl(selectedCase)}
                  alt={selectedCase.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            )}

            <p><strong>Name:</strong> {selectedCase.name}</p>
            <p><strong>Status:</strong> {selectedCase.status}</p>
            <p><strong>Date:</strong> {new Date(selectedCase.date).toLocaleDateString()}</p>
            <p><strong>Location:</strong> {selectedCase.latitude}, {selectedCase.longitude}</p>
            {selectedCase.description && (
              <p><strong>Description:</strong> {selectedCase.description}</p>
            )}

            {selectedCase.comments?.length > 0 && (
              <div style={{ marginTop: '1rem' }}>
                <h4>Comments</h4>
                <ul>
                  {selectedCase.comments.map((comment, i) => (
                    <li key={i}>
                      <strong>{comment.user?.username || 'Anonymous'}:</strong> {comment.text}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div style={{ marginTop: '1rem' }}>
              {!isCommenting ? (
                <button onClick={() => setIsCommenting(true)}>
                  💬 Add a comment...
                </button>
              ) : (
                <>
                  <textarea
                    rows={3}
                    placeholder="Write a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                  <div style={{ marginTop: '8px' }}>
                    <button
                      onClick={handleSubmitComment}
                      disabled={!commentText.trim()}
                    >
                      Submit
                    </button>
                    <button
                      onClick={() => {
                        setCommentText('');
                        setIsCommenting(false);
                      }}
                      style={{ marginLeft: '8px' }}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </div>

            <button onClick={() => setSelectedCase(null)} style={{ marginTop: '15px' }}>
              Back to case list
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
