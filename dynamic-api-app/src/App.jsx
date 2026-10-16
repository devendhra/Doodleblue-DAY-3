import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [genderFilter, setGenderFilter] = useState("all");
  const [changeCount, setChangeCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper function to interpret HTTP status codes
  const getHttpErrorMessage = (status, statusText) => {
    switch (status) {
      case 400:
        return "400 Bad Request: The request was invalid or malformed.";
      case 401:
        return "401 Unauthorized: Access denied. Authentication is required.";
      case 403:
        return "403 Forbidden: You do not have permission to access this resource.";
      case 404:
        return "404 Not Found: The requested API endpoint could not be found.";
      case 408:
        return "408 Request Timeout: The server timed out waiting for the request.";
      case 429:
        return "429 Too Many Requests: Rate limit exceeded. Please wait a moment and try again.";
      case 500:
        return "500 Internal Server Error: The server encountered an unexpected error. Please try again later.";
      case 502:
        return "502 Bad Gateway: Received an invalid response from upstream server.";
      case 503:
        return "503 Service Unavailable: The API server is temporarily overloaded or down for maintenance.";
      case 504:
        return "504 Gateway Timeout: Upstream server failed to respond in time.";
      default:
        if (status >= 500) {
          return `${status} Server Error: The remote server failed to fulfill the request.`;
        }
        return `HTTP Error ${status}: ${statusText || "Request failed."}`;
    }
  };

  const fetchUsers = async (gender = genderFilter) => {
    setLoading(true);
    setError(null); // Clear previous errors

    try {
      const apiUrl =
        gender === "all"
          ? "https://randomuser.me/api/?results=6"
          : `https://randomuser.me/api/?results=6&gender=${gender}`;

      const response = await fetch(apiUrl);

      // Check HTTP status code explicitly
      if (!response.ok) {
        throw new Error(getHttpErrorMessage(response.status, response.statusText));
      }

      const data = await response.json();
      console.log(data);
      // Validate data structure
      if (!data || !Array.isArray(data.results) || data.results.length === 0) {
        throw new Error("No user profiles returned from the API.");
      }

      setUsers(data.results);
      setSelectedUser(data.results[0]);
      setChangeCount((prev) => prev + 1);
    } catch (err) {
      console.error("Error fetching data:", err);
      if (err.name === "TypeError" && err.message.toLowerCase().includes("fetch")) {
        setError("Network Error: Unable to connect to the server. Please check your internet connection.");
      } else {
        setError(err.message || "An unexpected error occurred while fetching data.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers("all");
  }, []);

  const handleFilterChange = (newGender) => {
    setGenderFilter(newGender);
    fetchUsers(newGender);
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setChangeCount((prev) => prev + 1);
  };

  const handleNextUser = () => {
    if (users.length > 0) {
      const currentIndex = users.findIndex(
        (u) => u.login.uuid === selectedUser?.login?.uuid
      );
      const nextIndex = (currentIndex + 1) % users.length;
      setSelectedUser(users[nextIndex]);
      setChangeCount((prev) => prev + 1);
    }
  };

  

  return (
    <div className="app-container">
      <header className="header">
        <h1 className="title">Dynamic Profile Explorer</h1>
        <p className="subtitle">
          Fetching live profile images &amp; dynamic data from <code>randomuser.me</code> open API.
        </p>
        <div className="counter-badge">
          Profile Changes: <strong>{changeCount}</strong>
        </div>
      </header>

      <div className="controls-bar">
        <div className="filter-group">
          <span className="filter-label">Filter:</span>
          <button
            id="filterAll"
            className={`filter-btn ${genderFilter === "all" ? "active" : ""}`}
            onClick={() => handleFilterChange("all")}
            disabled={loading}
          >
            All
          </button>
          <button
            id="filterMale"
            className={`filter-btn ${genderFilter === "male" ? "active" : ""}`}
            onClick={() => handleFilterChange("male")}
            disabled={loading}
          >
            Male 
          </button>
          <button
            id="filterFemale"
            className={`filter-btn ${genderFilter === "female" ? "active" : ""}`}
            onClick={() => handleFilterChange("female")}
            disabled={loading}
          >
            Female 
          </button>
        </div>

        <div className="action-group">
          <button
            id="fetchNewBtn"
            className="primary-btn"
            onClick={() => fetchUsers(genderFilter)}
            disabled={loading}
          >
            {loading ? "Fetching..." : "Fetch New Profiles"}
          </button>

          <button
            id="nextProfileBtn"
            className="secondary-btn"
            onClick={handleNextUser}
            disabled={loading || users.length === 0}
          >
            Next Profile
          </button>
        </div>
      </div>

      {/* Inline banner if an error happens while profiles are already displayed */}
      {error && selectedUser && (
        <div className="error-banner">
          <span>⚠️ {error}</span>
          <div className="error-banner-actions">
            <button
              className="retry-btn-small"
              onClick={() => fetchUsers(genderFilter)}
            >
              Retry
            </button>
            <button
              className="dismiss-btn"
              onClick={() => setError(null)}
              title="Dismiss"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <main className="content">
        {loading && !selectedUser ? (
          <div className="loading-box">
            <div className="spinner"></div>
            <p>Loading dynamic data from Open API...</p>
          </div>
        ) : error && !selectedUser ? (
          <div className="error-box">
            <span className="error-icon">⚠️</span>
            <h3>Failed to Load Profiles</h3>
            <p className="error-message">{error}</p>
            <button
              id="retryBtn"
              className="primary-btn"
              onClick={() => fetchUsers(genderFilter)}
            >
              Try Again
            </button>
          </div>
        ) : selectedUser ? (
          <>
            <section className="spotlight-section">
              <div className="spotlight-card">
                <div className="avatar-wrapper">
                  <img
                    id="selectedUserImage"
                    src={selectedUser.picture.large}
                    alt={`${selectedUser.name.first} ${selectedUser.name.last}`}
                    className="avatar-large"
                  />
                  <span className="status-dot"></span>
                </div>

                <div className="user-details">
                  <div className="user-tags">
                    <span className="tag gender-tag">
                      {selectedUser.gender.toUpperCase()}
                    </span>
                    <span className="tag age-tag">
                      {selectedUser.dob.age} Years Old
                    </span>
                    <span className="tag country-tag">
                      {selectedUser.location.country}
                    </span>
                  </div>

                  <h2 className="user-name" id="selectedUserName">
                    {selectedUser.name.title} {selectedUser.name.first}{" "}
                    {selectedUser.name.last}
                  </h2>

                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">Email</span>
                      <span className="info-value" id="selectedUserEmail">
                        {selectedUser.email}
                      </span>
                    </div>

                    <div className="info-item">
                      <span className="info-label">Phone</span>
                      <span className="info-value" id="selectedUserPhone">
                        {selectedUser.phone}
                      </span>
                    </div>

                    <div className="info-item">
                      <span className="info-label">City</span>
                      <span className="info-value" id="selectedUserCity">
                        {selectedUser.location.city}
                      </span>
                    </div>

                    <div className="info-item">
                      <span className="info-label">Nationality</span>
                      <span className="info-value">
                        {selectedUser.nat}
                      </span>
                    </div>
                  </div>

                  <div className="card-actions">
                    <button
                      id="changeRandomBtn"
                      className="accent-btn"
                      onClick={handleNextUser}
                    >
                      Click to Switch Profile
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section className="grid-section">
              <div className="section-header">
                <h3>Select Any User to Update Spotlight Card</h3>
                <span className="hint-text">
                  (Clicking any card below dynamically updates the image and content above)
                </span>
              </div>

              <div className="cards-grid">
                {users.map((user) => {
                  const isSelected =
                    selectedUser?.login?.uuid === user.login.uuid;
                  return (
                    <div
                      key={user.login.uuid}
                      className={`user-card ${isSelected ? "selected" : ""}`}
                      onClick={() => handleSelectUser(user)}
                      title="Click to view details"
                    >
                      <img
                        src={user.picture.medium}
                        alt={user.name.first}
                        className="card-avatar"
                      />
                      <div className="card-info">
                        <h4 className="card-name">
                          {user.name.first} {user.name.last}
                        </h4>
                        <p className="card-email">{user.email}</p>
                        <span className="card-city">
                          {user.location.city}, {user.location.country}
                        </span>
                      </div>
                      {isSelected && <span className="active-pill">Active</span>}
                    </div>
                  );
                })}
              </div>
            </section>
          </>
        ) : (
          <div className="error-box">
            <p className="error-message">No user data available. Try fetching again.</p>
            <button
              className="primary-btn"
              onClick={() => fetchUsers(genderFilter)}
            >
              Fetch Profiles
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
