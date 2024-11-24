import React, { useState } from "react";
import { io } from "socket.io-client";
import Footer from "./Footer";
import Header from "./Header";
import ChatContainer from "./ChatContainer";
import Login from "./Login";

const socket = io("http://localhost:4000");
// const socket = io("https://kushals-chat-app-backend.onrender.com");
const BASE_URL = "http://localhost:4000";
// const BASE_URL = "https://kushals-chat-app-backend.onrender.com";

function App() {
  const [loggedIn, setLoggedIn] = useState(
    JSON.parse(localStorage.getItem("letstalk-loggedIn")) || false
  );
  const [username, setUsername] = useState(
    localStorage.getItem("letstalk-username") || ""
  );
  const [loading, setLoading] = useState(false);

  function logout(name) {
    socket.emit("leave", name);
    setLoggedIn(false);
    localStorage.setItem("letstalk-loggedIn", false);
    setUsername("");
    localStorage.setItem("letstalk-username", "");
    window.location.reload(true);
  }

  async function login(name, password) {
    setLoading(true);
    const response = await fetch(BASE_URL + "/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, password }),
    });
    const data = await response.json();
    setLoading(false);
    if (data.message === "welcome") {
      socket.emit("join", name);
      setLoggedIn(true);
      localStorage.setItem("letstalk-loggedIn", true);
      setUsername(name);
      localStorage.setItem("letstalk-username", name);
    }
  }

  return (
    <div>
      <Header loggedIn={loggedIn} logout={logout} username={username} />
      {!loggedIn ? (
        <Login login={login} loading={loading} />
      ) : (
        <ChatContainer socket={socket} username={username} />
      )}
      <Footer />
    </div>
  );
}

export default App;
