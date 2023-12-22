import React, { useState, useEffect } from "react";
import { baseUrl } from '../src/App';
import { useNavigate } from "react-router-dom";
import '../styles/Profile.css';

interface Profile{
   ime: string,
   prezime: string,
   korime: string,
   lozinka: string,
   info: string,
   datrod: string
 }

const MyProfile: React.FC = () => {
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

   return (
      <div>
         {
            loading ?
               <p className="p-4">Loading...</p> :
               <>
                  <div className="container">
                     <h1 className="display-6">My Profile</h1>
                     <p className="p-4">{JSON.stringify(profileData, null, 3)}</p>
                     <a href="/changeProfile" className="btn btn-primary">Promijeni</a>
                  </div>
               </>
         }
      </div>
   );
};

export default MyProfile;
