import { baseUrl, storedToken } from "@/App";
import React, { useEffect, useState } from "react";
import "../styles/AllAuthors.css";
import { useNavigate } from "react-router-dom";

const AllAuthors: React.FC = () => {
  const [allAuthors, setAllAuthors] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredData, setFilteredData] = useState<any>([]);
  const [role, setRole] = useState<string>("");
  const navigate = useNavigate();

  const fetchAllAuthors = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/data/allAuthors`, {
        method: "GET",
        headers: {
          "Contenty-type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setAllAuthors([...data]);
      }
    } catch (error) {
      console.error("Greška prilikom dohvaćanja svih autora:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGetRole = async () => {
    if (storedToken) {
      try {
        const response = await fetch(`${baseUrl}/api/data/profile/getRole`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${storedToken}`,
          },
        });

        if (response.ok) {
          const data = await response.text();
          console.log(data);
          setRole(data);
        } else {
          console.log(await response.json());
        }
      } catch (error) {
        console.error("Greška prilikom dohvaćanja uloge:", error);
      }
    }
  };

  useEffect(() => {
    fetchAllAuthors();
    fetchGetRole();
  }, []);

  const handleFind = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTermValue = e.target.value;
    console.log(searchTermValue);

    try {
      const response = await fetch(`${baseUrl}/api/data/findAuthors`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ searchTerm: searchTermValue }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setFilteredData([...data]);
      } else if (response.status === 401) {
        navigate("/login");
      } else {
        console.log(await response.json());
      }
    } catch (error) {
      console.error("Greška prilikom pretraživanja korisnika:", error);
    }
  };

  const deleteAuthor = async (button: any) => {
    console.log(button.id);
    const deleteUserId = button.id;

    if (storedToken) {
      try {
        const response = await fetch(`${baseUrl}/api/data/deleteUser/${deleteUserId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `${storedToken}`
          }
        })

        if (response.ok) {
          alert(await response.text());
          fetchAllAuthors();
        }
        
      } catch (error) {
        console.error("Greška prilikom brisanja korisnika:", error);
      }
    }
  }

  //   const handleSearch = async () => {
  //     console.log("Search");
  //     try {
  //       const response = await fetch(`${baseUrl}/api/data/searchAuthor`, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ searchTerm: searchTerm }),
  //       });

  //       if (response.ok) {
  //         const data = await response.json();
  //         console.log(data);
  //         setFilteredData([...data]);
  //       } else if (response.status === 401) {
  //         navigate("/login");
  //       } else {
  //         console.log(await response.json());
  //       }
  //     } catch (error) {
  //       console.error("Greška prilikom pretraživanja korisnika:", error);
  //     }
  //   };

  return !loading && allAuthors ? (
    <div className="content">
      <div className="search-authors">
        <div className="searchbar">
          <input
            type="text"
            placeholder="Find author..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              handleFind(e);
            }}
          />
          {/* <a className="btn btn-primary" onClick={handleSearch}>
            Search
          </a> */}
        </div>
        {searchTerm !== "" ? (
          <div className="container-searchedAuthors">
            {filteredData.map((author: any, index: any) => (
              <div className="user" key={index}>
                <a
                  href={"/profile/" + author.idkorisnik}
                  className="text-primary"
                >
                  {author.korime +
                    " (" +
                    author.ime +
                    " " +
                    author.prezime +
                    ")"}
                </a>
              </div>
            ))}
          </div>
        ) : (
          <></>
        )}
      </div>
      <div className="container-all-authors">
        {allAuthors.map((author: any, index: any) => (
          <div className="author" key={index}>
            {role === "admin" && (
              <div className="delete-button">
                <a className="btn btn-danger" id={author.idkorisnik} onClick={(e) => {
                  deleteAuthor(e.target);
                }}>&times;</a>
              </div>
            )}
            <a href={"/profile/" + author.idkorisnik}>
              <div className="author-data">
                <div className="author-profile-picture">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
                    alt=""
                  />
                </div>
                <div className="author-username-following">
                  <div className="author-username">{author.korime}</div>
                  <div className="author-following">
                    <div>{"Followers: " + author.pratitelji}</div>
                    <div>{"Following: " + author.pratim}</div>
                  </div>
                </div>

                <div className="author-name-and-surname-and-date-of-birth">
                  <div className="author-name-and-surname">
                    {author.imeAutor + " " + author.prezAutor}
                  </div>
                  <div className="author-date-of-birth">{author.datrod}</div>
                </div>

                <div className="author-saved-books-and-written-books">
                  <div className="author-saved-books">
                    {"Saved books: " + author.spremljeneKnjige}
                  </div>
                  <div className="author-written-books">
                    {"Written books: " + author.napisaoKnjiga}
                  </div>
                </div>
              </div>
            </a>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <p className="p-4">Loading...</p>
  );
};

export default AllAuthors;
