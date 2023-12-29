import React, { useState, useEffect } from "react";
import { baseUrl } from "../App";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";

interface Profile {
  ime: string;
  prezime: string;
  korime: string;
  lozinka: string;
  info: string;
  datrod: string;
}

const ChangeProfile: React.FC = () => {
  const [profileData, setProfileData] = useState<Profile>({
    ime: "",
    prezime: "",
    korime: "",
    lozinka: "",
    info: "",
    datrod: "",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const fetchProfileData = async () => {
      // Provjeri postoji li token u sessionStorage
      const storedToken = sessionStorage.getItem("token");

      if (storedToken) {
        try {
          // Ako postoji token, izvrši poziv na /api/profile
          const response = await fetch(`${baseUrl}/api/data/profile`, {
            headers: {
              Authorization: `${storedToken}`,
            },
          });

          if (response.ok) {
            // Ako je odgovor uspješan, postavi podatke profila u stanje komponente
            const data = await response.json();
            console.log(data);
            setProfileData(data);
            setUsername(data.korime);
          } else {
            // Ako odgovor nije uspješan, možete poduzeti određene korake, npr. odjaviti korisnika
            console.error("Neuspješan poziv na /api/profile");
          }
        } catch (error) {
          console.error("Greška prilikom dohvaćanja podataka profila", error);
        } finally {
          // Postavi loading stanje na false kako bi se prikazao profil nakon dohvaćanja podataka
          setLoading(false);
        }
      } else {
        setTimeout(() => {
          navigate("/login");
          window.location.reload();
        }, 1500);
      }
    };

    fetchProfileData();
  }, []); // Prazan niz ovisnosti znači da će se useEffect izvršiti samo pri montiranju komponente

  const addBook = async () => {
    navigate("/addBook");
  };

  const handleChangeProfileData = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    navigate("/login");
  };

  const allowChange = () => {
    const inputs = document.querySelectorAll(".formChangeProfileData input");
    const buttonChange = document.getElementById("buttonChange");
    const buttonSave = document.getElementById("buttonSave");

    if (buttonChange && buttonSave) {
      Array.prototype.forEach.call(inputs, (input: HTMLInputElement) => {
        var isDisabled = input.disabled;
        input.disabled = !isDisabled;
      });

      buttonChange.style.display = "none";
      buttonSave.style.display = "block";
    }
  };

  return (
    <div>
      {loading ? (
        <>
          <p className="p-4">Učitavanje...</p>
        </>
      ) : (
        <>
          <h1 className="display-6">Bok, {username}!</h1>

          <form
            method="post"
            onSubmit={handleChangeProfileData}
            className="formChangeProfileData"
          >
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Ime:
              </label>
              <input
                type="text"
                name="name"
                id="name"
                className="form-control"
                value={profileData.ime}
                onChange={(e) => {
                  setProfileData({ ...profileData, ime: e.target.value });
                }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="surname" className="form-label">
                Prezime:
              </label>
              <input
                type="text"
                name="surname"
                id="surname"
                className="form-control"
                value={profileData.prezime}
                onChange={(e) => {
                  setProfileData({ ...profileData, prezime: e.target.value });
                }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="dateOfBirth" className="form-label">
                Datum rođenja:
              </label>
              <input
                type="date"
                name="dateOfBirth"
                id="dateOfBirth"
                className="form-control"
                value={profileData.datrod}
                onChange={(e) => {
                  setProfileData({ ...profileData, datrod: e.target.value });
                }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="username">Korisničko ime:</label>
              <input
                type="text"
                name="username"
                id="username"
                className="form-control"
                value={profileData.korime}
                onChange={(e) => {
                  setProfileData({ ...profileData, korime: e.target.value });
                }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password">Lozinka: </label>
              <input
                type="password"
                name="password"
                id="password"
                className="form-control"
                value={profileData.lozinka}
                onChange={(e) => {
                  setProfileData({ ...profileData, lozinka: e.target.value });
                }}
              />
            </div>
            <div className="mb-3">
              <button className="btn btn-primary" id="buttonSave">
                Spremi
              </button>
              <a href="/profile" className="btn btn-primary text-end">
                Natrag
              </a>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default ChangeProfile;
