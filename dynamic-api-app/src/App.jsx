import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [genderFilter, setGenderFilter] = useState("all");
  const [changeCount, setChangeCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async (gender = genderFilter) => {
    setLoading(true);
    try {
      const apiUrl =
        gender === "all"
          ? "https://randomuser.me/api/?results=6"
          : `https://randomuser.me/api/?results=6&gender=${gender}`;

      const response = await fetch(apiUrl);
      const data = await response.json();

      setUsers(data.results);
      setSelectedUser(data.results[0]);
      setChangeCount((prev) => prev + 1);
    } catch (error) {
      console.error("Error fetching data:", error);
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

        
      </header>

      <div className="controls-bar">
        <div className="filter-group">
          <span className="filter-label">Filter:</span>
          <button
            id="filterAll"
            className={`filter-btn ${genderFilter === "all" ? "active" : ""}`}
            onClick={() => handleFilterChange("all")}
          >
            All
          </button>
          <button
            id="filterMale"
            className={`filter-btn ${genderFilter === "male" ? "active" : ""}`}
            onClick={() => handleFilterChange("male")}
          >
            Male 
          </button>
          <button
            id="filterFemale"
            className={`filter-btn ${genderFilter === "female" ? "active" : ""}`}
            onClick={() => handleFilterChange("female")}
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
            {loading ? "Fetching..." : " Fetch New Profiles"}
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

      <main className="content">
        {loading && !selectedUser ? (
          <div className="loading-box">
            <div className="spinner"></div>
            <p>Loading dynamic data from Open API...</p>
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
                      <span className="info-label"> Email</span>
                      <span className="info-value" id="selectedUserEmail">
                        {selectedUser.email}
                      </span>
                    </div>

                    <div className="info-item">
                      <span className="info-label"> Phone</span>
                      <span className="info-value" id="selectedUserPhone">
                        {selectedUser.phone}
                      </span>
                    </div>

                    <div className="info-item">
                      <span className="info-label"> City</span>
                      <span className="info-value" id="selectedUserCity">
                        {selectedUser.location.city}
                      </span>
                    </div>

                    <div className="info-item">
                      <span className="info-label"> Nationality</span>
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
          <p className="error-message">No user data available. Try fetching again.</p>
        )}
      </main>

    </div>
  );
}

export default App;
