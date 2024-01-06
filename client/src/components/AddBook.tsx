import React, { useState, useEffect } from "react";
import { baseUrl, storedToken } from "../App";
import '../styles/AddBook.css';

let imageServer = "http://localhost:3500";

const AddBook: React.FC = () => {
  const [allAuthors, setAllAuthors] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [published, setPublished] = useState("");
  const [about, setAbout] = useState("");
  const [isbn, setIsbn] = useState("");
  const [userId, setUserId] = useState<number>(0);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const profileId = window.location.search.split("=")[1] || null;
  console.log(profileId);

  const fetchAllAuthors = async () => {
    const response = await fetch(`${baseUrl}/api/data/allAuthors`, {});

    if (response.ok) {
      const data = await response.json();
      setAllAuthors(data);
    } else {
      console.log(response);
    }
  };

  useEffect(() => {
    if (!profileId) {
      fetchAllAuthors();
    }
    setLoading(false);
  }, []);


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
          method: 'POST',
          headers: {
            Authorization: `${storedToken}`
          }
        });
        
        if (response.status === 400) {
          setValidationMessage(".container-validation", await response.text());
        }
        
      } catch (error) {
        console.error("Greška prilikom dohvaćanja ISBN:", error);
      }
    }
  }

  const validateISBN = () => {
    
  }

  const handleAddBook = async () => {

    console.log(title, genre, published, about, isbn, userId, coverImage)

    // TODO Maknula sa check za userid samo da probam jel slike rade
    if (title === "" || genre === "" || published === "" || about === "" || isbn === "" || !coverImage) {
      setValidationMessage(".container-validation", "All fields are required!");
      return;
    }
    else if (isbn !== "") {
      checkISBN();
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("genre", genre);
    formData.append("published", published);
    formData.append("about", about);
    formData.append("isbn", isbn);
    formData.append("userId", "4");

    if (userId) {
      formData.append("userId", userId.toString());
    }

    if (coverImage) {
      let extension = coverImage.name.split(".")[coverImage.name.split(".").length - 1];
      if (extension !== "png" && extension !== "jpeg" && extension !== "jpg") {
        // TODO bolja validacija
        console.log("Unsupported image type");
      }
      let imageNameRes = await fetch(`${imageServer}/upload`, {
        method: "POST",
        headers: {
          "content-type": extension === "png" ? "image/png" : "image/jpeg"
        },
        body: coverImage
      })

      if (imageNameRes.status === 400) {
        // TODO bolja validacija
        console.log("Error saving image on the server.");
      }

      let imageName = await imageNameRes.text();

      formData.append("coverImage", `${imageServer}/images/${imageName}.${extension}`);
    }



    console.log(formData);


    try {
      const response = await fetch(`${baseUrl}/api/data/addBook`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log(await response.json());
      } else {
        console.error("Neuspješan poziv na /api/data/addBook");
      }
    } catch (error) {
      console.error("Greška prilikom dohvaćanja podataka profila", error);
    }
  };

  return (
    <div className="container-add-book">
      {loading ? (
        <>
          <p className="p-4">Loading...</p>
        </>
      ) : (
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
                  clearValidationMessage('.container-validation');
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
                  clearValidationMessage('.container-validation');
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
                  clearValidationMessage('.container-validation');
                }}
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
                  clearValidationMessage('.container-validation');
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
                onChange={(e) => {
                  setIsbn(e.target.value);
                  clearValidationMessage('.container-validation');
                }}
                required
              />
            </div>
            {!profileId && (
              <div className="mb-3">
                <select
                  name="author"
                    id="author"
                    className="form-control"
                  onChange={(e) => {
                    setUserId(parseInt(e.target.value));
                    clearValidationMessage('.container-validation');
                  }}
                  required
                >
                  <option value={0}>Odaberi autora</option>
                  {allAuthors.map((author, index) => (
                    <option value={author.idkorisnik} key={index}>
                      {author.imeAutor} {author.prezAutor}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="mb-3">
              <label htmlFor="coverImage">Image</label>

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
                    clearValidationMessage('.container-validation');
                  }
                }}
              />
            </div>
            <a onClick={handleAddBook} className="btn btn-primary">
              Add
            </a>
          </div>
        </>
      )}
    </div>
  );
};

export default AddBook;
