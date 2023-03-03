import React, { useState } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import { useNavigate, useLocation } from "react-router-dom";

const cookies = new Cookies();

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(location.state?.error || "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/auth/login",
        { email, password },
        { withCredentials: true }
      );
      // the cookie is Saved Automaticly by using /withCredentials: true/
      // redirect to home page
      navigate("/");
    } catch (e) {
      if (e.response) setError(e.response.data.error);
      //else console.log(e);
    }
  };

  return (
    <>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <h3>{error}</h3>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </>
  );
}
