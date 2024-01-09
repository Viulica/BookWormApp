import { baseUrl } from "@/App";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css"

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

   const handleRegister = async () => {
      const data = {
         datrod, korime, lozinka, ime, prezime, info, tipkorisnika
      }

      console.log(data);

      try {
         const response = await fetch(`${baseUrl}/api/register`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
         })

         if (!response.ok) {
            console.log("Korisnik već postoji, prijavi se!")
         }
         else {
            console.log(await response.json());
            alert("Login now!");
            navigate('/login');
         }
      }
      catch (error) {
         
      }
   };

   return (
      <div className="register-container">
         <form className="register-form">
           <h1 className="title">Registration</h1>
           <div className="form-input">
               <label htmlFor="username">username</label>   
               <input type="text" name="" id="username" className="form-control" placeholder="username" value={korime} onChange={(e) => setKorime(e.target.value)} />
           </div>
            <div className="form-input">
               <label htmlFor="password">
                  password
                  <input type="password" name="" id="password" className="form-control" placeholder="password" value={lozinka} onChange={(e) => setLozinka(e.target.value)} />
               </label>
            </div>

            <div className="form-input">
               <label htmlFor="name"> name </label>
               <input type="text" name="" id="name" className="form-control" placeholder="name" value={ime} onChange={(e) => setIme(e.target.value)}/>
            </div>

            <div className="form-input">
               <label htmlFor="surname">surname</label>
               <input type="text" name="" id="surname" className="form-control" placeholder="surname" value={prezime} onChange={(e) => setPrezime(e.target.value)} />
            </div>

            <div className="form-input">
               <label htmlFor="info">info</label>
               <input type="text" name="" id="info" className="form-control" placeholder="info" value={info} onChange={(e) => setInfo(e.target.value)}/>
            </div>

            <div className="form-input radio">
               <label>author</label>
                  <input
                     type="radio"
                     name="userType"
                     value="autor"
                     checked={tipkorisnika === 'autor'}
                     onChange={(e) => {setTipkorisnika(e.target.value)}}
                  />
            </div>

            <div className="form-input radio">
               <label>reader</label>
                  <input
                     type="radio"
                     name="userType"
                     value="čitatelj"
                     checked={tipkorisnika === 'autor'}
                     onChange={(e) => {setTipkorisnika(e.target.value)}}
                  />
            </div>

            <div className="form-input">
               <label>Date of birth: </label>
                  <input
                     type="date"
                     value={datrod}
                     onChange={(e) => setDatrod(e.target.value)}
                     />
            </div>
               <button className="button" onClick={handleRegister}>Register</button>
         </form>
      </div>
   );
}

export default Register;