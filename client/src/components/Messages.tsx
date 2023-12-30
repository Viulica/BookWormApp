import { baseUrl } from '@/App';
import React, { useEffect, useState } from 'react';
import '../styles/Messages.css';

const Messages: React.FC = () => {

   const [messagesData, setMessagesData] = useState<any[]>([]);
   const [loading, setLoading] = useState<boolean>(true);
   const [userId, setUserId] = useState<number>(0);
   const [txtporuka, setTxtPoruka] = useState('');

   useEffect(() => {
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

      const fetchInbox = async () => {
         const storedToken = sessionStorage.getItem("token");
         if (storedToken) {
            const idReciever = window.location.href.split('/').at(window.location.href.split('/').length - 1);
            console.log(idReciever);
            try {
               const response = await fetch(`${baseUrl}/api/inbox/messages/${idReciever}`, {
                  method: 'GET',
                  headers: {
                     Authorization: `${storedToken}`,
                  },
               });

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

      fetchUserId();
      fetchInbox();
   }, []);

   const handleSendMessage = async () => {
      const storedToken = sessionStorage.getItem('token');
      const data = {
         txtporuka,
      };

      console.log(data);

      if (storedToken) {
         const idReciever = window.location.href.split('/').at(window.location.href.split('/').length - 1);
         console.log(idReciever);
         try {
            const response = await fetch(`${baseUrl}/api/inbox/messages/send/${idReciever}`, {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json',
                  Authorization: `${storedToken}`,
               },
               body: JSON.stringify(data),
            })

            console.log(await response.json());
         }
         catch (error) {
            console.log("Greška prilikom slanja poruke:", error);
         }
      }
   }
   

   return (
      <>
         {
            loading ? 
               <p className='p-4'>Loading...</p> :
               <>
                  <div className='container'>
                     {messagesData.map((message, index) => (

                        <div className={`container ${message.idposiljatelj === userId ? 'bg-info' : 'bg-light'}`} key={index}>
                           {message.idposiljatelj === userId ?
                              <div className='container'>
                                 <p><a href={"/profile/" + message.idposiljatelj} className='text-primary text-decoration-underline'>Me</a></p>
                                 <p>{ message.txtporuka }</p>
                                 <p>{ message.vremozn }</p>
                              </div> :
                              <div className='container'>
                                 <p><a href={"/profile/" + message.idposiljatelj} className='text-primary text-decoration-underline'>{message.imePosiljatelj + " " + message.prezimePosiljatelj}</a></p>
                                 <p>{ message.txtporuka }</p>
                                 <p>{message.vremozn}</p>
                              </div>
                           }
                        </div>
                     
                     ))}
                  </div>
                  <div className='form'>
                     <div className="form-group">
                        <input className="form-control" id="message-textarea" value={txtporuka} onChange={(e) => {setTxtPoruka(e.target.value)}}></input>
                     </div>
                     <div className='form-group'>
                        <button className='btn' onClick={handleSendMessage}>Send</button>
                     </div>
                  </div>
               </>
         }
      </>
   );
}

export default Messages;