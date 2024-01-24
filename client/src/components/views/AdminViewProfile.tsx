import React, { useState, useEffect } from "react";
import { baseUrl, storedToken } from "../../App";
import { useNavigate } from "react-router-dom";
import "../../styles/Profile.css";
import Slider, { getImageSource } from "../Slider";

const AdminViewProfile: React.FC = () => {
  const [userRole, setUserRole] = useState<string>("");

  const [isMyProfile, setIsMyProfile] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [profileData, setProfileData] = useState<any>({});
  const profileId = parseInt(
    window.location.pathname.split("/")[
      window.location.pathname.split("/").length - 1
    ]
  );
  const [showAllBooks, setShowAllBooks] = useState<boolean>(false);
  const [showAllUsers, setShowAllUsers] = useState<boolean>(false);
  const [writtenBooks, setWrittenBooks] = useState<any>([]);
  const [allDataAdmin, setAllDataAdmin] = useState<any>({});
  const [allUsers, setAllUsers] = useState<any>([]);
  const [allBooks, setAllBooks] = useState<any>([]);
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
          setIsMyProfile(profileId === data);
        } else if (response.status === 401) {
          navigate("/login");
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
        setUserRole(data.tipkorisnika);
        setProfileData(data);
        setLoading(false);
      } else if (response.status === 401) {
        navigate("/login");
      }
    } catch (error) {
      console.log("Greška prilikom dohvaćanja userId:", error);
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

  const fetchAllUsers = async () => {
    if (storedToken) {
      try {
        const response = await fetch(`${baseUrl}/api/data/allUsers`, {
          method: "GET",
          headers: {
            Authorization: `${storedToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setAllUsers([...data]);
          setShowAllUsers(true);
        }
      } catch (error) {
        console.error("Greška prilikom dohvaćanja svih korisnika:", error);
      }
    }
  };

  const fetchAllBooks = async () => {
    if (storedToken) {
      try {
        const response = await fetch(`${baseUrl}/api/data/allBooks`, {
          method: "GET",
          headers: {
            Authorization: `${storedToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setAllBooks([...data]);
          setShowAllBooks(true);
        }
      } catch (error) {
        console.error("Greška prilikom dohvaćanja svih knjiga:", error);
      }
    }
  };

  const fetchAllDataAdmin = async () => {
    if (storedToken) {
      try {
        const response = await fetch(`${baseUrl}/api/data/getAllData`, {
          method: "GET",
          headers: {
            Authorization: `${storedToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setAllDataAdmin({ ...data });
          setLoading(false);
        } else {
          console.log(await response.text());
        }
      } catch (error) {
        console.error("Greška prilikom dohvaćanja svih podataka:", error);
      }
    }
  };

  const openShowAllBooks = () => {
    fetchAllBooks();
  };
  const closeShowAllBooks = () => {
    setShowAllBooks(false);
  };

  const openShowAllUsers = () => {
    fetchAllUsers();
  };
  const closeShowAllUsers = () => {
    setShowAllUsers(false);
  };

  useEffect(() => {
    fetchMyUserId();
    fetchProfileData();
  }, []);

  useEffect(() => {
    if (userRole === "autor") {
      fetchMyWrittenBooks();
    } else if (userRole === "admin") {
      fetchAllDataAdmin();
    }
  }, [userRole]);

  const deleteUser = async (button: any) => {
    const deleteUserId = button.id;

    if (storedToken) {
      try {
        const response = await fetch(
          `${baseUrl}/api/data/deleteUser/${deleteUserId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `${storedToken}`,
            },
          }
        );

        if (response.ok) {
          alert(await response.text());
          fetchAllUsers();
        }
      } catch (error) {
        console.error("Greška prilikom brisanja korisnika:", error);
      }
    }
  };

  const deleteBook = async (button: any) => {
    const deleteBookId = button.id;

    if (storedToken) {
      try {
        const response = await fetch(
          `${baseUrl}/api/data/deleteBook/${deleteBookId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `${storedToken}`,
            },
          }
        );

        if (response.ok) {
          alert(await response.text());
          fetchAllBooks();
        }
      } catch (error) {
        console.error("Greška prilikom brisanja korisnika:", error);
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
              {!isMyProfile ? (
                <>
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

                  {userRole === "autor" && (
                    <>
                      <div className="vertical-line" />

                      <div className="container-profileData-info-writtenBooks">
                        <div>{profileData.napisaoKnjiga}</div>
                        <div>Written Books</div>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <>
                  <div className="container-number-of-users">
                    <div>{allDataAdmin.ukBrojKorisnika}</div>
                    <div>Number of users</div>
                  </div>

                  <div className="vertical-line" />

                  <div className="container-number-of-users">
                    <div>{allDataAdmin.ukBrojKnjiga}</div>
                    <div>Number of books</div>
                  </div>
                </>
              )}
            </div>
          </div>

          {storedToken && isMyProfile && (
            <>
              <div className="container-change-and-see-reading-list">
                {/* <a href="/changeProfile" className="btn btn-primary">
                  Change
                </a> */}
                {userRole === "autor" ||
                  (isMyProfile && (
                    <a href={"/addBook"} className="btn btn-primary">
                      Upload book
                    </a>
                  ))}
              </div>
              <div className="container-see-all-books-and-all-users">
                <a className="btn btn-primary" onClick={openShowAllBooks}>
                  See all books
                </a>
                <a className="btn btn-primary" onClick={openShowAllUsers}>
                  See all users
                </a>
              </div>
            </>
          )}

          {!isMyProfile && storedToken && (
            <div className="container-follow-message-and-see-reading-list">
              <a href={"/myBooks/" + profileId} className="btn btn-primary">
                See reading list
              </a>
              {/* <a
                href={"/inbox?idReciever=" + profileId}
                className="message-icon"
              >
                <MessageIcon />
              </a> */}
            </div>
          )}

          {!isMyProfile && (
            <>
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
            </>
          )}

          {userRole === "autor" ? (
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

          {showAllUsers && (
            <div className="background">
              <div className="window-all-users">
                <span className="exit" onClick={closeShowAllUsers}>
                  &times;
                </span>
                <div className="container-all-users">
                  <div className="all-users-title">
                    <p className="fs-4">All users</p>
                  </div>
                  <div className="all-users">
                    {allUsers.map((user: any, index: any) => (
                      <div className="user" key={index}>
                        <div className="delete-button">
                          <a
                            className="btn btn-danger"
                            id={user.idkorisnik}
                            onClick={(e) => {
                              deleteUser(e.target);
                            }}
                          >
                            &times;
                          </a>
                        </div>
                        <a href={"/profile/" + user.idkorisnik}>
                          <div className="user-data">
                            <div className="user-id">{user.idkorisnik}</div>
                            <div className="user-profile-picture">
                              <img
                                src="https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
                                alt=""
                              />
                            </div>

                            <div className="user-typeOfUser">
                              {user.tipkorisnika}
                            </div>
                            <div className="user-username">{user.korime}</div>

                            <div className="user-name-and-surname-and-dateOfBirth">
                              <div className="user-name-and-surname">
                                {user.ime + " " + user.prezime}
                              </div>
                              <div className="user-dateOfBirth">
                                {user.datrod}
                              </div>
                            </div>
                          </div>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {showAllBooks && (
            <div className="background">
              <div className="window-all-books">
                <span className="exit" onClick={closeShowAllBooks}>
                  &times;
                </span>
                <div className="container-all-books">
                  <div className="all-books-title">
                    <p className="fs-4">All books</p>
                  </div>
                  <div className="all-books-rows">
                    {allBooks.map((book: any, index: any) => (
                      <div className="book-row" key={index}>
                        <div className="delete-button">
                          <a
                            className="btn btn-danger"
                            id={book.idknjiga}
                            onClick={(e) => {
                              deleteBook(e.target);
                            }}
                          >
                            &times;
                          </a>
                        </div>
                        <a href={"/book/" + book.idknjiga}>
                          <div className="book-data-row">
                            <div className="book-id-row">{book.idknjiga}</div>
                            <div className="book-image-row">
                              <img src={getImageSource(book.slika)} alt="" />
                            </div>

                            <div className="book-genre-row">{book.zanr}</div>

                            <div className="book-title-and-published-row">
                              <div className="book-title-row">
                                {book.naslov}
                              </div>
                              <div className="book-published-row">
                                {book.godizd}
                              </div>
                            </div>
                            <div className="book-isbn-row">{book.isbn}</div>
                          </div>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminViewProfile;
