import React, { useState, useEffect } from "react";
import { baseUrl, storedToken } from "../../App";
import { useNavigate } from "react-router-dom";
import "../../styles/Profile.css"
import { MessageIcon } from "../MessageIcon";
import StarRating from "../StarRating";
import MyBooks from "../MyBooks";
import Slider from "../Slider";

interface Role{
  role: string;
}

const AuthorViewProfile: React.FC<Role> = (props) => {

  const role = props.role;

  const [loading, setLoading] = useState<boolean>(true);
  const [myUserId, setMyUserId] = useState<number>(0);
  const [profileData, setProfileData] = useState<any>({});
  const profileId = parseInt(
    window.location.pathname.split("/")[
      window.location.pathname.split("/").length - 1
    ]
  );
  const [isAuthor, setIsAuthor] = useState<boolean>(false);
  const [isMyProfile, setIsMyProfile] = useState<boolean>(false);
  const [followStatus, setFollowStatus] = useState<string>("");
  // const [showSavedBooks, setShowSavedBooks] = useState<boolean>(false);
  const [writtenBooks, setWrittenBooks] = useState<any>([]);
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
        } else if (response.status === 401) {
          navigate("/login");
        } else {
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
        setProfileData(data);
        setIsAuthor(data.tipkorisnika === "autor");
      } else if (response.status === 401) {
        navigate("/login");
      } else {
        console.log(await response.json());
      }
    } catch (error) {
      console.log("Greška prilikom dohvaćanja userId:", error);
    }
  };

  const fetchFollowing = async () => {
    if (storedToken) {
      try {
        const response = await fetch(
          `${baseUrl}/api/data/profile/following/${profileId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${storedToken}`,
            },
          }
        );

        const data = await response.text();
        setFollowStatus(data);
        setLoading(false);
      } catch (error) {
        console.error("Greška prilikom dohvaćanja praćenja", error);
      }
    }
  };

  const fetchMyWrittenBooks = async () => {
    console.log("fetchMyWrittenBooks", profileId);
    try {
      const response = await fetch(
        `${baseUrl}/api/data/profile/myWrittenBooks/${profileId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setWrittenBooks(data);
        setLoading(false);
      } else if (response.status === 401) {
        navigate("/login");
      } else {
        // Treba prikazati na zaslon da nema nikakvih knjiga!
        console.log(await response.json());
      }
    } catch (error) {
      console.error("Greška prilikom dohvaćanja knjiga:", error);
    } finally {
      // setLoading(false);
    }
  };

  /*
  const openSavedBooks = () => {
    setShowSavedBooks(true);
  }
  const closeSavedBooks = () => {
    setShowSavedBooks(false);
  }
  */

  useEffect(() => {
    console.log("Izvrši");
    fetchMyUserId();
    fetchFollowing();
    fetchProfileData();
    fetchMyWrittenBooks();
  }, []);


  const handleFollowUser = async () => {
    if (storedToken) {
      try {
        const response = await fetch(
          `${baseUrl}/api/data/profile/follow/${profileId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${storedToken}`,
            },
          }
        );

        if (response.status === 204) {
          setProfileData({
            ...profileData,
            pratitelji: parseInt(profileData.pratitelji) - 1,
          });
        } else if (response.status === 200) {
          setProfileData({
            ...profileData,
            pratitelji: parseInt(profileData.pratitelji) + 1,
          });
        }
        fetchFollowing();
      } catch (error) {
        console.log("Greška prilikom praćenja korisnika:", error);
      }
    }
  };

  return (
    <div className="content-profile">
      {loading ? (
        <p className="p-4">Loading...</p>
      ) : (
        <>
          <div className="container-title">
            <h1 className="display-6">
              {isMyProfile && storedToken ? "My Profile" : ""}
            </h1>
          </div>

          <div className="container-profileData">
            <div className="container-profileData-image-and-username">
              <div className="container-profileData-image">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
                  alt=""
                />
              </div>
              <div className="container-profileData-username">
                {profileData.korime}
              </div>
            </div>
            <div className="container-profileData-info">
              <div className="container-profileData-info-followers">
                <div>{profileData.pratitelji}</div>
                <div>Followers</div>
              </div>

              <div className="vertical-line" />

              <div className="container-profileData-info-following">
                <div>{profileData.pratim}</div>
                <div>Following</div>
              </div>
              <div className="vertical-line" />

              <div className="container-profileData-info-savedBooks">
                <div>{profileData.spremljeneKnjige}</div>
                <div>Saved Books</div>
              </div>

              {isAuthor && (
                <>
                  <div className="vertical-line" />

                  <div className="container-profileData-info-writtenBooks">
                    <div>{profileData.napisaoKnjiga}</div>
                    <div>Written Books</div>
                  </div>
                </>
              )}
            </div>
          </div>

          {storedToken && isMyProfile && (
            <div className="container-change-and-see-reading-list">
              <a href="/changeProfile" className="btn btn-primary">
                Change
              </a>
              <a href={"/myBooks/" + profileId} className="btn btn-primary">
                See reading list
              </a>
              {isAuthor && (
                <a
                  href={"/addBook?profileId=" + myUserId}
                  className="btn btn-primary"
                >
                  Upload book
                </a>
              )}
            </div>
          )}

          {!isMyProfile && storedToken && (
            <div className="container-follow-message-and-see-reading-list">
              <a
                onClick={handleFollowUser}
                className={
                  followStatus === "Follow"
                    ? "btn btn-success"
                    : "btn btn-outline-warning"
                }
                id="follow-btn"
              >
                {followStatus}
              </a>
              <a href={"/myBooks/" + profileId} className="btn btn-primary">
                See reading list
              </a>
              <a
                href={"/inbox?idReciever=" + profileId}
                className="message-icon"
              >
                <MessageIcon />
              </a>
            </div>
            )}
            
            <div className="horizontal-line"></div>

            <div className="container-about-me">
              <div className="about-me-title-and-dateOfBirth">
                <div className="about-me-title">
                  <p className="fs-4">
                    {profileData.ime + " " + profileData.prezime}
                  </p>
                </div>
                <div className="about-me-dateOfBirth">
                  <p className="fs-6">{profileData.datrod}</p>
                </div>
              </div>
              {profileData.info && (
                <div className="about-me-title-and-info">
                  <div className="about-me-title">
                    <p className="fs-5">About me:</p>
                  </div>
                  <div className="about-me-info">{profileData.info}</div>
                </div>
              )}
            </div>
            <div className="horizontal-line"></div>
          

          {isAuthor ? (
            <div className="container-written-books">
              <div className="written-books-title">
                <h1 className="display-6">Written books</h1>
              </div>
              <div className="written">
                {writtenBooks.length > 0 ? (
                  <Slider books={writtenBooks} id={0} />
                ) : (
                  <>
                    <p className="p-4">No written books!</p>
                  </>
                )}
              </div>
            </div>
          ) : (
            <></>
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

export default AuthorViewProfile;
