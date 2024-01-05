import React, { useState, useEffect } from "react";
import { baseUrl, storedToken } from "../App";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";
import { MessageIcon } from "./MessageIcon";
import StarRating from "./StarRating";
import MyBooks from "./MyBooks";


const Profile: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [myUserId, setMyUserId] = useState<number>(0);
  const [profileData, setProfileData] = useState<any>({});
  const profileId = parseInt(window.location.pathname.split("/")[window.location.pathname.split("/").length - 1]);
  const [isAuthor, setIsAuthor] = useState<boolean>(false);
  const [isMyProfile, setIsMyProfile] = useState<boolean>(true);
  const [followStatus, setFollowStatus] = useState<string>("");
  // const [showSavedBooks, setShowSavedBooks] = useState<boolean>(false);
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
          setIsMyProfile(profileId === data);
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

  const fetchFollowing = async () => {
    if (storedToken) {
      try {
        const response = await fetch(`${baseUrl}/api/data/profile/following/${profileId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${storedToken}`
          }
        })

        const data = await response.text();
        setFollowStatus(data);

      } catch (error) {
        console.error("Greška prilikom dohvaćanja praćenja", error);
      }
    }
  }

  /*
  const openSavedBooks = () => {
    setShowSavedBooks(true);
  }
  const closeSavedBooks = () => {
    setShowSavedBooks(false);
  }
  */

  useEffect(() => {
    fetchMyUserId();
    fetchFollowing();
    fetchProfileData();
  }, []);
  

  const handleFollowUser = async () => {
    if (storedToken) {
      try {
        const response = await fetch(`${baseUrl}/api/data/profile/follow/${profileId}`, {
          method: 'GET',
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
        fetchFollowing();
      }
      catch (error) {
        console.log("Greška prilikom praćenja korisnika:", error);
      }
    }
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
                <a href={"/myBooks/"+ profileId} className="btn btn-primary">
                  See reading list
                </a>
              </>
            )}

            {(!isMyProfile && storedToken) && (
              <>
                <a onClick={handleFollowUser} className={followStatus === "Follow" ? "btn btn-success" : "btn btn-outline-warning"} id="follow-btn">
                  {followStatus}
                </a>
                <a href={"/inbox?idReciever=" + profileId} className="message-icon">
                  <MessageIcon />
                </a>
                <a href={"/myBooks/"+ profileId} className="btn btn-primary">
                  See reading list
                </a>
              </>
            )}

            
            {/* {showSavedBooks && (
              <div className="background">
                <div className="window-user-reading-list">
                  <span className="exit" onClick={closeSavedBooks}>&times;</span>
                  <div>
                    <MyBooks />
                  </div>
                </div>
              </div>
            )} */}
        </>
      )}
    </div>
  );
};

export default Profile;
