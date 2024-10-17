import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import "./Header.style.css";

const Header = ({ user, handleLogout, getTasks,resetFilterPriority,resetHideDone   }) => {
  const [showLogout, setShowLogout] = useState(false);

  return (
    <header className="header">
     <div
        className="todo-logo"
        onClick={() => {
          resetFilterPriority(); 
          resetHideDone();
          getTasks();
        }}
      >
        todo
      </div>
      {user && (
        <>
          <div
            className="avatar-container"
            onClick={() => setShowLogout(!showLogout)}
          >
            <FontAwesomeIcon icon={faUserCircle} className="avatar" />
            {showLogout && (
              <div className="logout-menu" onClick={handleLogout}>
                <span className="logout-text">→ Sign Out</span>
              </div>
            )}
          </div>
        </>
      )}
    </header>
  );
};

export default Header;
