import { baseUrl } from "@/App";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Inbox: React.FC = () => {
   const [inboxData, setInboxData] = useState<any[]>([]);
   const [loading, setLoading] = useState<boolean>(true);
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
            } else {
               console.log(await response.json());
            }
         } catch (error) {
            console.error("Greška prilikom dohvaćanja poruka:", error);
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

      fetchInbox();
   }, []);

   return (
      <>
         {
            loading ?
               <p className="p-4">Loading...</p> :
               <>
                  <div className="container">
                     <h1 className="display-6">Inbox</h1>
                     <div className="container">
                        {inboxData.length > 0 ? 
                           (inboxData.map((message, index) => (
                              <a href={"/messages/" + message.idprimatelj} className="text-primary" key={index}>
                                 <div className="container">{ message.imePrimatelj + " " + message.prezimePrimatelj }</div>
                              </a>
                           ))):
                              <>Ništa</>
                        }
                     </div>
                  </div>
               </>
         }

      </>
   );
};

export default Inbox;
