import React, { useState, useEffect } from "react";
import { baseUrl, storedToken } from "../../App";
import { useNavigate } from "react-router-dom";
import "../../styles/Profile.css";
import Slider from "../Slider";

const UserViewProfile: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [userRole, setUserRole] = useState<string>("");
  const [profileData, setProfileData] = useState<any>({});
  const profileId = parseInt(
    window.location.pathname.split("/")[
      window.location.pathname.split("/").length - 1
    ]
  );
  const [writtenBooks, setWrittenBooks] = useState<any>([]);
  const navigate = useNavigate();

  const fetchProfileData = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/data/profile/${profileId}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserRole(data.tipkorisnika);

        if (data.tipkorisnika === "autor") {
          setProfileData(data);
        }
      } else if (response.status === 401) {
        navigate("/login");
      }
    } catch (error) {
      console.log("Greška prilikom dohvaćanja userId:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyWrittenBooks = async () => {
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
        setWrittenBooks(data);
        setLoading(false);
      } else if (response.status === 401) {
        navigate("/login");
      }
    } catch (error) {
      console.error("Greška prilikom dohvaćanja knjiga:", error);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  useEffect(() => {
    if (userRole === "autor") {
      fetchMyWrittenBooks();
    }
  }, [userRole]);

  return (
    <div className="content-profile">
      {loading ? (
        <p className="p-4">Loading...</p>
      ) : (
        <>
          {userRole === "autor" ? (
            <>
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

                  <div className="vertical-line" />

                  <div className="container-profileData-info-writtenBooks">
                    <div>{profileData.napisaoKnjiga}</div>
                    <div>Written Books</div>
                  </div>
                </div>
              </div>

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

              <div className="container-written-books">
                <div className="written-books-title">
                  <h1 className="display-6">Written books</h1>
                </div>
                <div className="written">
                  {writtenBooks.length > 0 ? (
                    <Slider books={writtenBooks} id={0} />
                  ) : (
                    <>
                      <p className="p-4 text-center">No written books!</p>
                    </>
                  )}
                </div>
              </div>
            </>
          ) : (
            <p className="p-4">
              You don't have permission to see other readers profile.{" "}
              <a
                href={"/login"}
                className="text-primary text-decoration-underline"
              >
                Login
              </a>{" "}
              or{" "}
              <a
                href={"/register"}
                className="text-primary text-decoration-underline"
              >
                register
              </a>{" "}
              to see more.
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default UserViewProfile;
