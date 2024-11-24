import React from "react";
import "../styles/Header.css";

function Header({ loggedIn, logout, username }) {
  return (
    <h1>
      <div>
        Let's Talk <img src="./favicon.png"></img>
      </div>
      <div className="welcome-msg">Welcome {username} to the chatroom !</div>
      {loggedIn && (
        <button
          className="btn btn-danger"
          onClick={() => {
            logout(username);
          }}
        >
          <i className="fa-solid fa-arrow-left"></i> leave
        </button>
      )}
    </h1>
  );
}

export default Header;
