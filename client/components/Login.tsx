// Login.tsx
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../src/App';

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
        const data = await response.json();
         console.log("Uspješan login:", data);
         navigate('/');
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
        <label htmlFor="username">Korisničko ime:</label>
        <input
          type="text"
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
        />

        <label htmlFor="password">Lozinka:</label>
        <input
          type="password" // Koristite type="password" za unos lozinke
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
        <button type="submit">Prijava</button>
      </form>
    </div>
  );
};

export default Login;