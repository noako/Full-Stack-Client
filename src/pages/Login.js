import React from "react";
import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setAuthState } = useContext(AuthContext);

  let history = useNavigate();
  const login = () => {
    axios
      .post("http://localhost:3001/auth/login", {
        username: username,
        password: password,
      })
      .then((response) => {
        if (response.data.error) {
          alert(response.data.error);
        } else {
          localStorage.setItem("accessToken", response.data.token);
          setAuthState({
            username: response.data.username,
            id: response.data.id,
            status: true,
          });
          history("/");
        }
      });
  };
  return (
    <div className="loginContainer">
      <label>Username:</label>
      <input
        type="text"
        onChange={(event) => {
          setUsername(event.target.value);
        }}
        name="username"
      />
      <label>Password:</label>
      <input
        type="password"
        onChange={(event) => {
          setPassword(event.target.value);
        }}
      />
      <button onClick={login}> Login </button>
    </div>
  );
}

export default Login;
