import { baseUrl } from "@/App";
import React, { useEffect, useState } from "react";
import "../styles/Messages.css";

interface MessagesProps {
  param: string;
}

const Messages: React.FC<MessagesProps> = (props) => {
  const [messagesData, setMessagesData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<number>(0);
  const [txtporuka, setTxtPoruka] = useState("");
  const [lastRefreshed, setLastRefreshed] = useState<string>("");

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

  useEffect(() => {
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

    const fetchInbox = async () => {
      const storedToken = sessionStorage.getItem("token");
      if (storedToken) {
        var idReciever = props.param || window.location.href
          .split("/")
          .at(window.location.href.split("/").length - 1);

        console.log(idReciever);
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

          if (response.ok) {
            const data = await response.json();
            setMessagesData(data);
          } else {
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
    fetchInbox();
  }, []);

  const handleSendMessage = async () => {

    if (txtporuka === "") {
      return;
    }

    const storedToken = sessionStorage.getItem("token");
    const data = {
      txtporuka,
    };

    console.log(data);

    if (storedToken) {
      var idReciever = props.param || window.location.href
          .split("/")
          .at(window.location.href.split("/").length - 1);
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

        console.log(await response.json());
        window.location.reload();
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
          <div className="messages">
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
                          href={"/profile/" + message.idposiljatelj}
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
          <div className="refreshed">
            <span>Last refreshed: {lastRefreshed}</span>
            <a
              className="btn btn-primary"
              onClick={() => {
                window.location.reload();
              }}
            >
              Refresh
            </a>
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
