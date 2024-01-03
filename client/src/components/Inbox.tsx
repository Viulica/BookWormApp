import { baseUrl } from "@/App";
import React, { useEffect, useState } from "react";
import { useNavigate} from "react-router-dom";
import "../styles/Inbox.css";
import "../styles/Messages.css";
import Messages from "./Messages";

const Inbox: React.FC = () => {
  const [inboxData, setInboxData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [userId, setUserId] = useState<number>(0);
  const [idReciever, setIdReciever] = useState<string>("");
  const [showMessages, setShowMessages] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.search.split("=")[1]) {
      setIdReciever(window.location.search.split("=")[1]);
      setShowMessages(true);
    }

    const fetchInbox = async () => {
      const storedToken = sessionStorage.getItem("token");
      if (storedToken) {
        try {
          const response = await fetch(`${baseUrl}/api/inbox`, {
            headers: {
              Authorization: `${storedToken}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setInboxData(data);
            setLoading(false);
          } else {
            console.log(await response.json());
          }
        } catch (error) {
          console.error("Greška prilikom dohvaćanja poruka:", error);
        }
      } else {
        setTimeout(() => {
          navigate("/login");
          window.location.reload();
        }, 1500);
      }
    };

    const fetchUserId = async () => {
      const storedToken = sessionStorage.getItem("token");
      if (storedToken) {
        try {
          const response = await fetch(`${baseUrl}/api/data/getUserId`, {
            headers: {
              Authorization: `${storedToken}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setUserId(data);
          } else {
            console.log(await response.json());
          }
        } catch (error) {
          console.log("Greška prilikom dohvaćanja userId:", error);
        }
      }
    };

    fetchInbox();
    fetchUserId();
  }, [navigate]);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    //  console.log(searchTerm);
    const searchTermValue = e.target.value;
    try {
      const storedToken = sessionStorage.getItem("token");
      const response = await fetch(`${baseUrl}/api/inbox/findUsers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${storedToken}`,
        },
        body: JSON.stringify({ searchTerm: searchTermValue }),
      });

      if (response.ok) {
        const data = await response.json();
        setFilteredData(data);
      } else {
        console.log(await response.json());
      }
    } catch (error) {
      console.error("Greška prilikom pretraživanja korisnika:", error);
    }
  };

  return (
    <div className="container inbox">
      {loading ? (
        <p className="p-4">Loading...</p>
      ) : (
        <>
          <div className="container-title-and-searchbar">
            <div className="container-title display-6">
              <h1>Inbox</h1>
            </div>
            <div className="container-searchbar">
              <input
                type="text"
                placeholder="Find user..."
                value={searchTerm}
                onChange={(e) => {
                  console.log(e.target.value);
                  setSearchTerm(e.target.value);
                  handleChange(e);
                }}
              />
            </div>
            {searchTerm !== "" ? (
              <div className="container-searchedUsers">
                {filteredData.map((message, index) => (
                  <div className="user" key={index}>
                    <a
                      href={"/inbox?idReciever=" + message.idkorisnik}
                      className="text-primary"
                    >
                        {message.korime +
                          " (" +
                          message.ime +
                          " " +
                          message.prezime +
                          ")"}
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <></>
            )}
          </div>
          <div className="container-messages">
            <div className="choose-user">
              {inboxData.length > 0 ? (
                inboxData.map((message, index) => (
                  <div className="conversation" key={index}>
                    <a href={
                        message.idprimatelj === userId
                          ? "/inbox?idReciever=" + message.idposiljatelj
                          : "/inbox?idReciever=" + message.idprimatelj
                      }
                      className="text-primary"
                    >
                      {message.idprimatelj === userId
                        ? message.imePosiljatelj +
                          " " +
                          message.prezimePosiljatelj
                        : message.imePrimatelj + " " + message.prezimePrimatelj}
                    </a>
                  </div>
                ))
              ) : (
                <>Ništa</>
                )}
              </div>
              {showMessages && 
                <Messages/>
                }
          </div>
        </>
      )}
    </div>
  );
};

export default Inbox;
