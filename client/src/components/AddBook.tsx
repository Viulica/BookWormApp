import React, { useState, useEffect } from "react";
import { baseUrl, storedToken } from "../App";
import "../styles/AddBook.css";

// let imageServer = "http://localhost:3500";

const AddBook: React.FC = () => {
  const [allAuthors, setAllAuthors] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [published, setPublished] = useState("");
  const [about, setAbout] = useState("");
  const [isbn, setIsbn] = useState("");
  const [userId, setUserId] = useState<number>(0);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [imagePath, setImagePath] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const [role, setRole] = useState<string>("");
  const [roleFetched, setRoleFetched] = useState<boolean>(false);
  const [selectedInput, setSelectedInput] = useState<"file" | "text">("file");
  const profileId = window.location.search.split("=")[1] || null;
  // console.log(profileId);

  const fetchAllAuthors = async () => {
    const response = await fetch(`${baseUrl}/api/data/allAuthors`, {});

    if (response.ok) {
      const data = await response.json();
      setAllAuthors(data);
    } else {
      console.log(response);
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
          setRoleFetched(true);
        } else {
          console.log(await response.json());
        }
      } catch (error) {
        console.error("Greška prilikom dohvaćanja uloge:", error);
      }
    }
  };
  useEffect(() => {
    fetchGetRole();
  }, []);

  useEffect(() => {
    if (roleFetched) {
      // Postavite setLoading tek nakon dohvata uloge
      setLoading(false);
    }
  }, [roleFetched]);

  useEffect(() => {
    if (!profileId) {
      fetchAllAuthors();
    } else {
      setUserId(parseInt(profileId));
    }
  }, [role]);
  const clearValidationMessage = (className: string) => {
    const validation = document.querySelector(className);
    if (validation) {
      validation.innerHTML = "";

      // setValidationError(false);
    }
  };

  const setValidationMessage = (className: string, message: string) => {
    const validation = document.querySelector(className);
    if (validation) {
      validation.innerHTML = message;

      // setValidationError(true);
    }
  };

  const checkISBN = async () => {
    if (storedToken) {
      try {
        const response = await fetch(`${baseUrl}/api/data/checkISBN/${isbn}`, {
          method: "POST",
          headers: {
            Authorization: `${storedToken}`,
          },
        });

        if (response.status === 400) {
          setValidationMessage(".container-validation", await response.text());
          return true;
        }
        else {
          return false;
        }
      } catch (error) {
        console.error("Greška prilikom dohvaćanja ISBN:", error);
      }
    }
  };

  const validateISBN = (e: React.ChangeEvent<HTMLInputElement>) => {
    const ISBN = e.target.value;
    if (ISBN.length >= 0 && ISBN.length < 13) {
      setIsbn(e.target.value);
    }
    else if (ISBN.length === 13) {
      setIsbn(e.target.value);
      checkISBN();
    }
  };

  const handleAddBook = async () => {
    if (
      title === "" ||
      genre === "" ||
      published === "" ||
      about === "" ||
      userId === 0
    ) {
      setValidationMessage(".container-validation", "All fields are required!");
      return;
    } else if (isbn.length < 13) {
      setValidationMessage(
        ".container-validation",
        "ISBN must have 13 numbers"
      );
      return;
    } else if (
      parseInt(published) < 0 ||
      parseInt(published) > new Date().getFullYear()
    ) {
      setValidationMessage(
        ".container-validation",
        `Year must be between 1500 and ${new Date().getFullYear()}`
      );
      return;
    }
    else if (isbn.length === 13) {
      if (await checkISBN()) {
        return;
      }
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("genre", genre);
    formData.append("published", published);
    formData.append("about", about);
    formData.append("isbn", isbn);
    formData.append("userId", userId.toString());

    if (imagePath && selectedInput === "text") {
      formData.append("imageUrl", imagePath);
    } else if (coverImage && selectedInput === "file") {
      // Ako korisnik unese datoteku, dodajte je u FormData
      formData.append("coverImage", coverImage!);
    }

    try {
      const response = await fetch(`${baseUrl}/api/data/addBook`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log(await response.json());
        alert("Book added!");
      } else {
        console.error("Neuspješan poziv na /api/data/addBook");
      }
    } catch (error) {
      console.error("Greška prilikom dohvaćanja podataka profila", error);
    }

    window.location.reload();

  };

  const handleInputChange = (inputType: "file" | "text") => {
    setSelectedInput(inputType);
  };

  return (
    <div className="container-add-book">
      {loading ? (
        <>
          <p className="p-4">Loading...</p>
        </>
      ) : (
        <>
          {role == "autor" || role == "admin" ? (
            <>
              <div className="container-add-book-title">
                <h1 className="display-6">Add book</h1>
              </div>

              <div className="container-validation"></div>

              <div className="container-bookData">
                <div className="mb-3">
                  <label htmlFor="title">Title:</label>
                  <input
                    type="text"
                    name="title"
                    className="form-control"
                    id="title"
                    onChange={(e) => {
                      setTitle(e.target.value);
                      clearValidationMessage(".container-validation");
                    }}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="genre">Genre:</label>
                  <input
                    type="text"
                    name="genre"
                    className="form-control"
                    id="genre"
                    onChange={(e) => {
                      setGenre(e.target.value);
                      clearValidationMessage(".container-validation");
                    }}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="published">Published:</label>
                  <input
                    type="number"
                    name="published"
                    className="form-control"
                    id="published"
                    onChange={(e) => {
                      setPublished(e.target.value);
                      clearValidationMessage(".container-validation");
                    }}
                    min={1000}
                    max={9999}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="about">About:</label>
                  <input
                    type="text"
                    name="about"
                    className="form-control"
                    id="about"
                    onChange={(e) => {
                      setAbout(e.target.value);
                      clearValidationMessage(".container-validation");
                    }}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="isbn">ISBN:</label>
                  <input
                    type="number"
                    name="isbn"
                    className="form-control"
                    id="isbn"
                    value={isbn}
                    onChange={(e) => {
                      validateISBN(e);
                      clearValidationMessage(".container-validation");
                    }}
                    required
                  />
                </div>
                {!profileId && (
                  <div className="mb-3">
                    <label htmlFor="author">Author</label>
                    <select
                      name="author"
                      id="author"
                      className="form-control"
                      onChange={(e) => {
                        setUserId(parseInt(e.target.value));
                        clearValidationMessage(".container-validation");
                      }}
                      required
                    >
                      <option value={0}>Choose author</option>
                      {allAuthors.map((author, index) => (
                        <option value={author.idkorisnik} key={index}>
                          {author.imeAutor} {author.prezAutor}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="mb-3">
                  <label htmlFor="inputSelector">Select Image Input Type</label>
                  <div className="options">
                    <button
                      className="btn btn-primary"
                      onClick={() => handleInputChange("file")}
                    >
                      File Input
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleInputChange("text")}
                    >
                      Text Input
                    </button>
                  </div>
                </div>

                {selectedInput === "file" && (
                  <div className="mb-3">
                    <input
                      type="file"
                      id="coverImage"
                      name="coverImage"
                      accept="image/*"
                      className="form-control"
                      onChange={(e) => {
                        const files = e.target.files;
                        if (files && files.length > 0) {
                          const file = files[0];
                          setCoverImage(file);
                          console.log(file);
                          console.log(files);
                          clearValidationMessage(".container-validation");
                        }
                      }}
                    />
                  </div>
                )}

                {selectedInput === "text" && (
                  <div className="mb-3">
                    <input
                      type="text"
                      name="imageUrl"
                      id="imageUrl"
                      className="form-control"
                      placeholder="path"
                      value={imagePath}
                      onChange={(e) => setImagePath(e.target.value)}
                    />
                  </div>
                )}
                <a onClick={handleAddBook} className="btn btn-primary">
                  Add
                </a>
              </div>
            </>
          ) : (
            <>
              <p className="p-4">You don't have permission for this site.</p>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default AddBook;
