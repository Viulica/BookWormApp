// Login.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../App";

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

  return (
    <div>
      <form onSubmit={handleSubmit} method="post">
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Korisničko ime:
          </label>
          <input
            type="text"
            className="form-control"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Lozinka:
          </label>
          <input
            type="password"
            className="form-control"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
        </div>
        <button className="bg-orange-200">Prijava</button>
      </form>
    </div>
  );
};

export default Login;
