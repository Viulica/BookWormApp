import { baseUrl, storedToken } from "@/App";
import React, { useEffect, useState, useRef } from "react";
import "../styles/Messages.css";
import { useNavigate } from "react-router-dom";


const Messages: React.FC = () => {
  const [messagesData, setMessagesData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<number>(0);
  const [userData, setUserData] = useState<any>({});
  const [txtporuka, setTxtPoruka] = useState("");
  const [lastRefreshed, setLastRefreshed] = useState<string>("");
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const formatDate = (date: any) => {
    const vremenskiFormat = new Date(date).toLocaleTimeString("hr-HR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const datumskiFormat = new Date(date).toLocaleDateString("hr-HR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    return `${vremenskiFormat} (${datumskiFormat})`;
  };

  const scrollAllTheWayDown = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }

  useEffect(() => {    
    const fetchUserId = async () => {
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
          }
          else if (response.status === 401) {
            navigate('/login');
          }
          else {
            console.log(await response.json());
          }
        } catch (error) {
          console.log("Greška prilikom dohvaćanja userId:", error);
        }
      }
    };

    const fetchUserData = async () => {
      if (storedToken) {
        const idReciever = window.location.search.split("=")[1];
        try {
          const response = await fetch(`${baseUrl}/api/data/getUserData/${idReciever}`, {
            headers: {
              Authorization: `${storedToken}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setUserData(data);
          }
          else if (response.status === 401) {
            navigate('/login');
          }
          else {
            console.log(await response.json());
          }
        } catch (error) {
          console.log("Greška prilikom dohvaćanja userId:", error);
        }
      }
    };

    const fetchInbox = async () => {
      if (storedToken) {
        const idReciever = window.location.search.split("=")[1];
        try {
          const response = await fetch(
            `${baseUrl}/api/inbox/messages/${idReciever}`,
            {
              method: "GET",
              headers: {
                Authorization: `${storedToken}`,
              },
            }
          );

          console.log("IM ", response.status)

          if (response.ok) {
            const data = await response.json();
            setMessagesData(data);
          } else if (response.status === 304) {
            console.log("304")
          }
          else if (response.status === 401) {
            navigate('/login');
          }
          else {
            console.log(await response.json());
          }
        } catch (error) {
          console.error("Greška prilikom dohvaćanja poruka:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    setLastRefreshed(formatDate(new Date()));



    fetchUserId();
    fetchUserData();
    fetchInbox();
    const messageInterval = setInterval(() => {
      fetchInbox();
    }, 2000);

    return () => clearInterval(messageInterval);
  }, []);


  // Čim se učita stranica ili pošalje neka poruka mora se scrollati do kraja messages diva!
  useEffect(() => {
    scrollAllTheWayDown();
  }, [lastRefreshed])

  useEffect(() => {
    scrollAllTheWayDown();
  }, [messagesData])

  const handleSendMessage = async () => {

    if (txtporuka === "") {
      return;
    }

    const data = {
      txtporuka,
    };

    console.log(data);

    if (storedToken) {
      const idReciever = window.location.search.split("=")[1];
      console.log(idReciever);
      try {
        const response = await fetch(
          `${baseUrl}/api/inbox/messages/send/${idReciever}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${storedToken}`,
            },
            body: JSON.stringify(data),
          }
        );

        //window.location.reload();
        if (response.status === 401) {
          navigate('/login');
        }
        
        let newMessageData = messagesData;
        newMessageData.push((await response.json()).message);
        setMessagesData([...newMessageData]);
        setTxtPoruka("");
      } catch (error) {
        console.log("Greška prilikom slanja poruke:", error);
      }
    }
  };

  return (
    <>
      {loading ? (
        <p className="p-4">Loading...</p>
      ) : (
        <div className="container">
            <div>
              <a
                href={userData.idkorisnik === userId ? "/my-profile" : "/profile/" + userData.idkorisnik}
                className="text-primary text-decoration-underline"
              >
                { userData.ime + " "+ userData.prezime}
              </a>
            </div>
          <div className="messages" ref={messageContainerRef}>
              {messagesData.map((message, index) => (
                <div className={`${message.idposiljatelj === userId ? "d-flex justify-content-end" : "d-flex justify-content-start"}`} key={index}>
                <div
                  className={`message ${
                    message.idposiljatelj === userId ? "bg-info" : "bg-light"
                  }`}
                >
                  {message.idposiljatelj === userId ? (
                    <div className="container">
                      <p>
                        <a
                          href="/my-profile"
                          className="text-primary text-decoration-underline"
                        >
                          Me
                        </a>
                      </p>
                      <p>{message.txtporuka}</p>
                      <p>{formatDate(message.vremozn)}</p>
                    </div>
                  ) : (
                    <div className="container">
                      <p>
                        <a
                          href={"/profile/" + message.idposiljatelj}
                          className="text-primary text-decoration-underline"
                        >
                          {message.imePosiljatelj +
                            " " +
                            message.prezimePosiljatelj}
                        </a>
                      </p>
                      <p>{message.txtporuka}</p>
                      <p>{formatDate(message.vremozn)}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="form">
            <div className="form-group">
              <input
                className="form-control"
                id="message-textarea"
                value={txtporuka}
                placeholder="Write a message"
                onChange={(e) => {setTxtPoruka(e.target.value)}}
              ></input>
            </div>
            <div className="form-group">
              <button
                className="btn"
                onClick={handleSendMessage}
                id="sendButton">
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Messages;
