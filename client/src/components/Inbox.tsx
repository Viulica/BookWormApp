import { baseUrl } from "@/App";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Inbox: React.FC = () => {
  const [inboxData, setInboxData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [userId, setUserId] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
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
                  Authorization: `${storedToken}`
               }
            });

            if (response.ok) {
               const data = await response.json();
               setUserId(data);
            }
            else {
               console.log(await response.json());
            }
         }
         catch (error) {
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
    <>
      {loading ? (
        <p className="p-4">Loading...</p>
      ) : (
        <>
          <div className="container">
            <div className="container-title-and-searchbar">
              <h1 className="display-6">Inbox</h1>
              <input
                type="text"
                placeholder="Pretraži korisnike..."
                value={searchTerm}
                onChange={(e) => {
                  console.log(e.target.value);
                  setSearchTerm(e.target.value);
                  handleChange(e);
                }}
              />
              {searchTerm !== "" ? (
                <>
                  {filteredData.map((message, index) => (
                    <a
                      href={"/messages/" + message.idkorisnik}
                      className="text-primary"
                      key={index}
                    >
                      <div className="container-searchedUsers">
                        {message.korime +
                          " (" +
                          message.ime +
                          " " +
                          message.prezime +
                          ")"}
                      </div>
                    </a>
                  ))}
                </>
              ) : (
                <></>
              )}
            </div>
            <div className="container-messages">
              {inboxData.length > 0 ? (
                inboxData.map((message, index) => (
                  <a
                    href={message.idprimatelj === userId ? "/messages/" + message.idposiljatelj : "/messages/" + message.idprimatelj}
                    className="text-primary"
                    key={index}
                  >
                    <div className="container">
                      {message.idprimatelj === userId ? message.imePosiljatelj + " " + message.prezimePosiljatelj : message.imePrimatelj + " " + message.prezimePrimatelj}
                    </div>
                  </a>
                ))
              ) : (
                <>Ništa</>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Inbox;
