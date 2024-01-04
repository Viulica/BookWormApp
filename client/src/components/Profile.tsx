import React, { useState, useEffect } from "react";
import { baseUrl, storedToken } from "../App";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";


const Profile: React.FC = () => {
  // const [profileData, setProfileData] = useState<Profile>({
  //   ime: "",
  //   prezime: "",
  //   korime: "",
  //   lozinka: "",
  //   info: "",
  //   datrod: "",
  //   pratim: "",
  //   pratitelji: "",
  //   spremljeneKnjige: ""
  // });
  // const [loading, setLoading] = useState<boolean>(true);
  // const [username, setUsername] = useState<string>("");
  
  
  const [loading, setLoading] = useState<boolean>(true);
  const [myUserId, setMyUserId] = useState<number>(0);
  const [profileData, setProfileData] = useState<any>({});
  const profileId = parseInt(window.location.pathname.split("/")[window.location.pathname.split("/").length - 1]);
  const [isAuthor, setIsAuthor] = useState<boolean>(false);
  const [isMyProfile, setIsMyProfile] = useState<boolean>(false);
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

  const fetchProfileData = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/data/profile/${profileId}`, {
        headers: {
          Authorization: `${storedToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setLoading(false);
        setProfileData(data);
        setIsAuthor(data.tipkorisnika === 'autor');
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
  };

  useEffect(() => {
    fetchMyUserId();
    fetchProfileData();
  }, []);
  

  // Možda postoji neki drugi način!
  useEffect(() => {
    setIsMyProfile(profileId === myUserId);
  })

  const handleFollowUser = async () => {
    console.log("Follow");

    if (storedToken) {
      try {
        const response = await fetch(`${baseUrl}/api/data/profile/follow/${profileId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${storedToken}`
          }
        })

        if (response.status === 204) {
          setProfileData({ ...profileData, pratitelji: parseInt(profileData.pratitelji) - 1 });
          
        }
        else if (response.status === 200) {
          setProfileData({ ...profileData, pratitelji: parseInt(profileData.pratitelji) + 1 });
        }
        
      }
      catch (error) {
        console.log("Greška prilikom praćenja korisnika:", error);
      }
    }
  }


  // TODO - backend + frontend!!!
  const handleUserReadingList = () => {
    console.log("Reading list");
  }

  return (
    <div className="container profile">
      {loading ? (
        <p className="p-4">Loading...</p>
      ) : (
        <>
          <div className="container-title">
              <h1 className="display-6">{ isMyProfile ? "My Profile" : "" }</h1>
          </div>
            
            <div className="container-profileData">
              <div className="container-profileData-image-and-username">
                <div className="container-profileData-image"><img src="https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg" alt="" /></div>
                <div className="container-profileData-username">
                  {profileData.korime}
                </div>
              </div>
              <div className="container-profileData-info">
                
                <div className="container-profileData-info-followers">
                  <div>
                    {profileData.pratitelji}
                  </div>
                  <div>Followers</div>
                </div>

                <div className="vertical-line" />
                
                <div className="container-profileData-info-following">
                  <div>
                    {profileData.pratim}
                  </div>
                  <div>Following</div>
                </div>

                <div className="vertical-line" />
                
                <div className="container-profileData-info-savedBooks">
                  <div>
                    {profileData.spremljeneKnjige}
                  </div>
                  <div>Saved Books</div>
                </div>

                {isAuthor && (
                  <>
                    <div className="vertical-line" />

                    <div className="container-profileData-info-writtenBooks">
                      <div>
                        {profileData.napisaoKnjiga}
                      </div>
                      <div>Written Books</div>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {isMyProfile && (
              <>
                <a href="/changeProfile" className="btn btn-primary">
                  Change
                </a>
              </>
            )}

            {(!isMyProfile && storedToken) && (
              <>
                <a onClick={handleFollowUser} className="btn btn-primary" id="follow-btn">
                  Follow
                </a>
                <a href={"/inbox?idReciever=" + profileId} className="btn btn-primary">
                  Write message
                </a>
                <a onClick={handleUserReadingList} className="btn btn-primary">
                  See reading list
                </a>
              </>
            )}


        </>
      )}
    </div>
  );
};

export default Profile;
