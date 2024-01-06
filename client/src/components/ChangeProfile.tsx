import React, { useState, useEffect } from "react";
import { baseUrl, storedToken } from "../App";
import { useNavigate } from "react-router-dom";
import "../styles/ChangeProfile.css";
import "../styles/Profile.css";

const ChangeProfile: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [myUserId, setMyUserId] = useState<number>(0);
  const [name, setName] = useState<string>("");
  const [surname, setSurname] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [info, setInfo] = useState<string>("");
  const [datrod, setDatrod] = useState<string>("");
  const [showPasswordInput, setShowPasswordInput] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<boolean>(false);
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const navigate = useNavigate();

  const fetchMyUserId = async () => {
    if (storedToken) {
      try {
        const response = await fetch(`${baseUrl}/api/data/getUserId`, {
          headers: {
            Authorization: `${storedToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setMyUserId(data);
        } else if (response.status === 401) {
          navigate("/login");
        } else {
          console.log(await response.json());
        }
      } catch (error) {
        console.log("Greška prilikom dohvaćanja userId:", error);
      }
    }
  };

  const fetchProfileData = async () => {
    if (storedToken) {
      try {
        const response = await fetch(`${baseUrl}/api/data/profile`, {
          headers: {
            Authorization: `${storedToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          // setProfileData(data);
          setUsername(data.korime);
          setName(data.ime);
          setSurname(data.prezime);
          setInfo(data.info || "");
          setDatrod(data.datrod);
        } else if (response.status === 401) {
          navigate("/login");
        } else {
          console.error("Neuspješan poziv na /api/profile");
        }
      } catch (error) {
        console.error("Greška prilikom dohvaćanja podataka profila", error);
      } finally {
        setLoading(false);
      }
    } else {
      setTimeout(() => {
        navigate("/login");
        window.location.reload();
      }, 1500);
    }
  };

  useEffect(() => {
    fetchMyUserId();
    fetchProfileData();
  }, []);

  const clearValidationMessage = (className: string) => {
    const validation = document.querySelector(className);
    if (validation) {
      validation.innerHTML = "";

      if (className.split("-")[0].split(".")[1] === "username") {
        const usernameInput = document.getElementById("username");
        if (usernameInput) {
          console.log(usernameInput);
          usernameInput.style.border =
            "var(--bs-border-width) solid var(--bs-border-color)";
        }
      }
      setValidationError(false);
    }
  };

  const setValidationMessage = (className: string, message: string) => {
    const validation = document.querySelector(className);
    if (validation) {
      validation.innerHTML = message;

      if (className.split("-")[0].split(".")[1] === "username") {
        const usernameInput = document.getElementById("username");
        if (usernameInput) {
          console.log(usernameInput);
          usernameInput.style.border = "1px solid red";
        }
      }

      setValidationError(true);
    }
  };

  const openPasswordInput = () => {
    if (
      name === "" ||
      surname === "" ||
      username === "" ||
      datrod === "" ||
      validationError
    ) {
      setValidationMessage(
        ".container-validation",
        "Check your data! No empty fields!"
      );
    } else {
      setPassword("");
      setShowPasswordInput(true);
    }
  };

  const closePasswordInput = () => {
    setShowPasswordInput(false);
    setValidationError(false);
  };

  const checkUsernameAvailability = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const data = { korime: e.target.value };
    if (storedToken) {
      try {
        const response = await fetch(
          `${baseUrl}/api/data/profile/checkUsername/${myUserId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${storedToken}`,
            },
            body: JSON.stringify(data),
          }
        );

        if (response.status === 400) {
          setValidationMessage(".username-validation", await response.text());
        } else if (response.ok) {
          clearValidationMessage(".username-validation");
        }
      } catch (error) {
        console.error("Greška prilikom provjere korime:", error);
      }
    }
  };

  const handleChangeProfileData = async () => {
    if (password === "") {
      setValidationMessage(".password-validation", "Insert password!");
      return;
    } else {
      closePasswordInput();
    }

    console.log("Change");

    const data = {
      ime: name,
      prezime: surname,
      info: info,
      korime: username,
      lozinka: password,
      datrod: datrod,
    };
    console.log(data);

    if (storedToken) {
      try {
        const response = await fetch(
          `${baseUrl}/api/data/profile/change/${myUserId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${storedToken}`,
            },
            body: JSON.stringify(data),
          }
        );

        if (response.ok) {
          setShowMessage(true);
          setTimeout(() => {
            navigate("/profile/" + myUserId);
          }, 2000)
        } else if (response.status === 401) {
          setTimeout(async () => {
            openPasswordInput();
            setValidationMessage(".password-validation", await response.text());
          }, 500);
        }
      } catch (error) {
        console.error("Greška prilikom promjene podataka!", error);
      }
    }
  };

  return (
    <div className="content-change-profile">
      {loading ? (
        <p className="p-4">Loading...</p>
      ) : (
        <>
          <div className="container-title">
            <h1 className="display-6">Change your profile data!</h1>
          </div>

          <div className="container-validation"></div>

          <div className="container-change-profileData">
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name:
              </label>
              <input
                type="text"
                name="name"
                id="name"
                className="form-control"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  clearValidationMessage(".container-validation");
                }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="surname" className="form-label">
                Surname:
              </label>
              <input
                type="text"
                name="surname"
                id="surname"
                className="form-control"
                value={surname}
                onChange={(e) => {
                  setSurname(e.target.value);
                  clearValidationMessage(".container-validation");
                }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="dateOfBirth" className="form-label">
                Date of birth:
              </label>
              <input
                type="date"
                name="dateOfBirth"
                id="dateOfBirth"
                className="form-control"
                value={datrod}
                onChange={(e) => {
                  setDatrod(e.target.value);
                  clearValidationMessage(".container-validation");
                }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="info" className="form-label">
                About me:
              </label>
              <textarea
                rows={6}
                name="info"
                id="info"
                className="form-control"
                value={info}
                onChange={(e) => {
                  setInfo(e.target.value);
                }}
              ></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="username">
                Username: <span className="username-validation"></span>
              </label>
              <input
                type="text"
                name="username"
                id="username"
                className="form-control"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  checkUsernameAvailability(e);
                  clearValidationMessage(".container-validation");
                }}
              />
            </div>
            <div className="mb-3" id="save-and-back-buttons">
              <button
                className="btn btn-primary"
                id="buttonSave"
                onClick={openPasswordInput}
              >
                Save
              </button>
              <a
                href={"/profile/" + myUserId}
                className="btn btn-primary text-end"
              >
                Back
              </a>
            </div>
          </div>

          {showPasswordInput && (
            <div className="background">
              <div className="window-password-input">
                <span className="exit" onClick={closePasswordInput}>
                  &times;
                </span>
                <div className="window-container">
                  <div className="password-validation"></div>
                  <div className="password-input">
                    <label htmlFor="password">Password:</label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      className="form-control"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        clearValidationMessage(".password-validation");
                      }}
                    />
                  </div>
                  <div className="submit">
                    <button
                      className="btn btn-primary"
                      onClick={handleChangeProfileData}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
            )}
            
            {showMessage && (
              <div className="background">
              <div className="window-password-input">
                <div className="window-container">
                  <div className="message-container">
                    Data successfully changed!
                  </div>
                </div>
              </div>
            </div>
            )

            }
        </>
      )}
    </div>
  );
};

export default ChangeProfile;
