import { baseUrl } from "@/App";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";

const Register: React.FC = () => {
  // datrod, korime, lozinka, ime, prezime, info, tipkorisnika

  const [korime, setKorime] = useState<string>("");
  const [lozinka, setLozinka] = useState<string>("");
  const [ime, setIme] = useState<string>("");
  const [prezime, setPrezime] = useState<string>("");
  const [info, setInfo] = useState<string>("");
  const [tipkorisnika, setTipkorisnika] = useState<string>();
  const [datrod, setDatrod] = useState<string>("");
  const navigate = useNavigate();
  const [isValidPass, setIsValidPass] = useState<boolean>(false);
  const [isValidUsr, setIsValidUsr] = useState<boolean>(false);
  const [isValidName, setIsValidName] = useState<boolean>(false);
  const [isValidSrname, setIsValidSrname] = useState<boolean>(false);
  const [isValidOption, setIsValidOption] = useState<boolean>(false);
  const [isValidDate, setIsValidDate] = useState<boolean>(false);
  const [passMessage, setPassMessage] = useState("");
  const [usrMessage, setUsrMessage] = useState("");
  const [imeMessage, setImeMessage] = useState("");
  const [srnameMessage, setSrnameMessage] = useState("");
  const [optionMessage, setoptionMessage] = useState("");
  const [dateMessage, setDateMessage] = useState("");

  const handleRegister = async (e: SubmitEvent) => {
    e.preventDefault();

    const data = {
      datrod,
      korime,
      lozinka,
      ime,
      prezime,
      info,
      tipkorisnika,
    };

    if (lozinka.length === 0) {
      setIsValidPass(false);
      setPassMessage("Polje za lozinku ne smije biti prazno");
    } else if (lozinka.length < 8) {
      setIsValidPass(false);
      setPassMessage("Duljina lozinke mora biti barem 8 znakova");
    } else {
      setIsValidPass(true);
      setPassMessage("");
    }

    if (korime.length === 0) {
      setUsrMessage("Korisnicko ime mora sadrzavati barem 1 znak");
      setIsValidUsr(false);
    } else {
      setIsValidUsr(true);
      setUsrMessage("");
    }

    if (ime.length === 0) {
      setImeMessage("Ime mora sadrzavati barem 1 znak");
      setIsValidName(false);
    } else {
      setIsValidName(true);
      setImeMessage("");
    }

    if (prezime.length === 0) {
      setSrnameMessage("Prezime mora sadrzavati barem 1 znak");
      setIsValidSrname(false);
    } else {
      setIsValidSrname(true);
      setSrnameMessage("");
    }

    if (tipkorisnika === "reader" || tipkorisnika === "author") {
      setIsValidOption(true);
      setoptionMessage("");
    } else {
      setIsValidOption(false);
      setoptionMessage("Morate izabrati tip korisnika");
    }

    if (datrod != "") {
      setIsValidDate(true);
      setDateMessage("");
    } else {
      setIsValidDate(false);
      setDateMessage("Morate unijeti datum rodenja");
    }
  };

  useEffect(() => {
    async function submit() {
      const data = {
        datrod,
        korime,
        lozinka,
        ime,
        prezime,
        info,
        tipkorisnika,
      };

      if (isValidUsr && isValidPass && isValidName && isValidSrname) {
        try {
          const response = await fetch(`${baseUrl}/api/register`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });

          if (!response.ok) {
            console.log("Korisnik već postoji, prijavi se!");
          } else {
            console.log(await response.json());
            alert("Login now!");
            navigate("/login");
          }
        } catch (error) {}
      }
    }

    submit();
  }, [isValidUsr, isValidPass, isValidName, isValidSrname]);

  return (
    <div className="register-container">
      {/* @ts-ignore */}
      <form onSubmit={handleRegister} className="register-form">
        <h1 className="title">Registration</h1>
        <div className="form-input">
          <label htmlFor="username">username</label>
          <input
            type="text"
            name=""
            id="username"
            className="form-control"
            placeholder="username"
            value={korime}
            onChange={(e) => setKorime(e.target.value)}
          />
          {!isValidUsr && <p className="poruka">{usrMessage}</p>}
        </div>
        <div className="form-input">
          <label htmlFor="password">
            password
            <input
              type="password"
              name=""
              id="password"
              className="form-control"
              placeholder="password"
              value={lozinka}
              onChange={(e) => setLozinka(e.target.value)}
            />
            {!isValidPass && <p className="poruka">{passMessage}</p>}
          </label>
        </div>

        <div className="form-input">
          <label htmlFor="name"> name </label>
          <input
            type="text"
            name=""
            id="name"
            className="form-control"
            placeholder="name"
            value={ime}
            onChange={(e) => setIme(e.target.value)}
          />
          {!isValidName && <p className="poruka">{imeMessage}</p>}
        </div>

        <div className="form-input">
          <label htmlFor="surname">surname</label>
          <input
            type="text"
            name=""
            id="surname"
            className="form-control"
            placeholder="surname"
            value={prezime}
            onChange={(e) => setPrezime(e.target.value)}
          />
          {!isValidSrname && <p className="poruka">{srnameMessage}</p>}
        </div>

        <div className="form-input">
          <label htmlFor="info">info</label>
          <input
            type="text"
            name=""
            id="info"
            className="form-control"
            placeholder="info"
            value={info}
            onChange={(e) => setInfo(e.target.value)}
          />
        </div>

        <div className="form-input radio">
          <label>author</label>
          <input
            type="radio"
            name="userType"
            value="author"
            checked={tipkorisnika === "author"}
            onChange={(e) => {
              setTipkorisnika(e.target.value);
            }}
          />
        </div>
        <div className="radio-container">
          <div className="form-input radio">
            <label>reader</label>
            <input
              type="radio"
              name="userType"
              value="reader"
              checked={tipkorisnika === "reader"}
              onChange={(e) => {
                setTipkorisnika(e.target.value);
              }}
            />
          </div>
          {!isValidOption && <p id="opt">{optionMessage}</p>}

          <div className="form-input date">
            <label>Date of birth: </label>
            <input
              type="date"
              value={datrod}
              onChange={(e) => setDatrod(e.target.value)}
            />
          </div>
        </div>

        {!isValidDate && <p id="date">{dateMessage}</p>}
        <button id="register-button" type="submit" className="button">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
