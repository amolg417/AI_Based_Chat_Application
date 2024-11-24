import React, { useState } from "react";
import "../styles/Login.css";
import Loader from "./Loader";

function Login({ login, loading }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="login-container">
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <h2>
          login <i className="fa-solid fa-arrow-right-to-bracket"></i>
        </h2>
        <input
          type="text"
          id="name"
          name="name"
          className="form-control"
          placeholder="Your name goes here :)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        ></input>
        <input
          type="password"
          id="password"
          name="password"
          className="form-control"
          placeholder="I hope you know the secret key XD"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        <div className="btn-group">
          <button
            type="proceed"
            className="btn btn-primary"
            onClick={() => {
              login(name, password);
              setName("");
              setPassword("");
            }}
          >
            let's go <i className="fa-solid fa-paper-plane"></i>{" "}
            {loading && <Loader />}
          </button>
          <button type="proceed" className="btn btn-warning">
            dummy <i className="fa-solid fa-star"></i>
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
