// Login.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../App";
import "../styles/login.css"

interface LoginForm {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginForm>({
    username: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      // Šaljemo podatke na backend
      const response = await fetch(`${baseUrl}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // Provjeravamo status odgovora
      if (response.ok) {
        const data = await response.text();
        console.log("Uspješan login:", data);
        sessionStorage.setItem("token", data);
        navigate("/");
        window.location.reload();
      } else {
        console.error("Neuspješan login:", response.statusText);
      }
    } catch (error) {
      console.error("Greška prilikom slanja zahtjeva:", error);
    }
  };

 function handleClick(){
    window.location.href = "/register"
 }

  return (
      <div className="login-container">
        <form onSubmit={handleSubmit} method="post" className="login-form">
          <h1 className="login-title">Login</h1>
          <div className="form-input">
            <label htmlFor="username" className="form-label">Username:</label>
            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />
          </div>

          <div className="form-input">
            <label htmlFor="password" className="form-label">Password:</label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>
            <button className="buton login-buton">Login</button>
            <button className="buton register-buton"onClick={handleClick}>Register</button>
        </form>
      </div>   
  );
};

export default Login;
