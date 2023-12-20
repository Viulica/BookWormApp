import { useState, useEffect } from "react";
import { baseUrl } from '../src/App';
import { useNavigate } from "react-router-dom";

const Profile: React.FC = () => {
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

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
            console.log(data.user);
            setProfileData(data.user);
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
      }
      else {
        setTimeout(() => {
          navigate('/login');
          window.location.reload();
        }, 1500);
      }
    };

    fetchProfileData();
  }, []); // Prazan niz ovisnosti znači da će se useEffect izvršiti samo pri montiranju komponente

  return (
    <div>
      <h1>Profil</h1>
      {loading && <p>Učitavanje profila...</p>}
      {profileData && (
        <div>
          <div><b>Podatci o korisniku:</b> </div>
          <div><u>Id korisnika:</u> { profileData.idkorisnik}</div>
          <div><u>Korisničko ime:</u> {profileData.korime}</div>
          <div><u>Lozinka:</u> {profileData.lozinka}</div>
          <div><u>Ime i prezime:</u> {profileData.ime } { profileData.prezime}</div>
          <div><u>Datum rođenja:</u> {profileData.datrod}</div>
          <div><u>Tip korisnika:</u> {profileData.tipkorisnika}</div>
          <div><u>Info:</u> { profileData.info}</div>
          <div></div>
        </div>
      )}
    </div>
  );
};

export default Profile;
