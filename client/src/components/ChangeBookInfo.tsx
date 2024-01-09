import { baseUrl, storedToken } from "@/App";
import React, { useEffect, useRef, useState } from "react";
import { getImageSource } from "./Slider";
import "../styles/ChangeBookInfo.css";

const ChangeBookInfo: React.FC = () => {
  const bookId = window.location.pathname
    .split("/")
    .at(window.location.pathname.split("/").length - 1);
  const [bookData, setBookData] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [modal, setModal] = useState<boolean>(false);
  const [imagePath, setImagePath] = useState<string>("");
  const [fileImage, setFileImage] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [deleteImage, setDeleteImage] = useState<string>("0");
  const [showPathInput, setShowPathInput] = useState<boolean>(false);

  const openModal = () => {
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
  };

  const openShowPathInput = () => {
    closeModal();
    setShowPathInput(true);
  };

  const closeShowPathInput = () => {
    setShowPathInput(false);
  };

  const handleOptionFile = () => {
    setImagePath("");
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
    closeModal();
  };

  const handleOptionText = () => {
    setFileImage(null);
    setCoverImage(null);
    setBookData({ ...bookData, slika: imagePath });
    closeShowPathInput();
  };

  const handleOptionRemove = () => {
    setImagePath("");
    setCoverImage(null);
    setFileImage(null);
    setDeleteImage("1");
    setBookData({ ...bookData, slika: null });
    closeModal();
  };

  const fetchBookData = async () => {
    try {
      const response = await fetch(
        `${baseUrl}/api/data/getBookData/${bookId}`,
        {
          method: "GET",
          headers: {
            Authorization: `${storedToken}`,
          },
        }
      );

      if (response.ok) {
        setBookData(await response.json());
      }
    } catch (error) {
      console.error("Greška prilikom dohvata knjige:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookData();
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
        const response = await fetch(
          `${baseUrl}/api/data/checkISBN/${bookData.isbn}/${bookId}`,
          {
            method: "POST",
            headers: {
              Authorization: `${storedToken}`,
            },
          }
        );

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
      setBookData({ ...bookData, isbn: e.target.value });
      clearValidationMessage(".container-validation");
    }
    else if (ISBN.length === 13) {
      setBookData({ ...bookData, isbn: e.target.value });
      checkISBN();
    }
  };

  const handleChange = async () => {
    if (
      bookData.naslov === "" ||
      bookData.zanr === "" ||
      bookData.godizd === "" ||
      bookData.opis === ""
    ) {
      setValidationMessage(".container-validation", "All fields are required!");
      return;
    } else if (bookData.isbn.length < 13) {
      setValidationMessage(
        ".container-validation",
        "ISBN must have 13 numbers"
      );
      return;
    } else if (
      parseInt(bookData.godizd) < 0 ||
      parseInt(bookData.godizd) > new Date().getFullYear()
    ) {
      setValidationMessage(
        ".container-validation",
        `Year must be between 1500 and ${new Date().getFullYear()}`
      );
      return;
    }
    if (bookData.isbn.length === 13) {
      if (await checkISBN()) {
        return;
      }
    }

    const formData = new FormData();
    formData.append("title", bookData.naslov);
    formData.append("genre", bookData.zanr);
    formData.append("published", bookData.godizd);
    formData.append("about", bookData.opis);
    formData.append("isbn", bookData.isbn);

    if (fileImage) {
      // Ako korisnik unese datoteku, dodajte je u FormData
      formData.append("fileImage", bookData.slika!);
    }
    formData.append("deleteImage", deleteImage);
    formData.append("imageUrl", imagePath);

    try {
      const response = await fetch(
        `${baseUrl}/api/data/changeBookData/${bookId}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        console.log(await response.json());
        alert("Book data changed!");
      } else {
        console.error("Neuspješan poziv na /api/data/addBook");
      }
    } catch (error) {
      console.error("Greška prilikom dohvaćanja podataka profila", error);
    }

    window.location.reload();
  };

  return (
    <div className="container-change-book">
      {loading ? (
        <p className="p-4">Loading</p>
      ) : (
        <>
          {!storedToken ? (
            <p className="p-4">You don't have permission for this site!</p>
          ) : (
            <>
              <div className="container-title">
                <h1 className="display-6">Change book info</h1>
              </div>

              <div className="container-validation"></div>

              <div className="container-change-bookData">
                <div className="container-bookData-image-title-published-and-genre">
                  <div className="container-bookData-image">
                    <div className="div-for-edit-icon">
                      <img
                        src={
                          coverImage ||
                          imagePath ||
                          getImageSource(bookData.slika)
                        }
                        alt="Slika"
                        style={{ cursor: "pointer" }}
                        onClick={openModal}
                      />
                      <div
                        className="overlay"
                        id="overlay-id"
                        onClick={openModal}
                      ></div>
                    </div>
                    <input
                      type="file"
                      id="fileInput"
                      accept="image/*"
                      style={{ display: "none" }}
                      ref={fileInputRef}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const imageUrl = URL.createObjectURL(file);
                          setCoverImage(imageUrl);
                          setFileImage(file);
                          setBookData({ ...bookData, slika: file });
                        }
                      }}
                    />
                  </div>
                  <div className="container-bookData-title-published-and-genre">
                    <div className="mb-3">
                      <label htmlFor="title" className="form-label">
                        Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        id="title"
                        className="form-control"
                        value={bookData.naslov}
                        onChange={(e) => {
                          setBookData({ ...bookData, naslov: e.target.value });
                          clearValidationMessage(".container-validation");
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="published" className="form-label">
                        Published
                      </label>
                      <input
                        type="number"
                        name="published"
                        className="form-control"
                        id="published"
                        value={bookData.godizd}
                        onChange={(e) => {
                          setBookData({ ...bookData, godizd: e.target.value });
                          clearValidationMessage(".container-validation");
                        }}
                        min={1000}
                        max={9999}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="genre" className="form-label">
                        Genre
                      </label>
                      <input
                        type="text"
                        name="genre"
                        id="genre"
                        className="form-control"
                        value={bookData.zanr}
                        onChange={(e) => {
                          setBookData({ ...bookData, zanr: e.target.value });
                          clearValidationMessage(".container-validation");
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="about" className="form-label">
                    About
                  </label>
                  <textarea
                    rows={6}
                    name="about"
                    id="about"
                    className="form-control"
                    value={bookData.opis}
                    onChange={(e) => {
                      setBookData({ ...bookData, opis: e.target.value });
                      clearValidationMessage(".container-validation");
                    }}
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label htmlFor="isbn" className="form-label">
                    ISBN
                  </label>
                  <input
                    type="number"
                    name="isbn"
                    id="isbn"
                    className="form-control"
                    value={bookData.isbn}
                    onChange={(e) => {
                      validateISBN(e);
                    }}
                  />
                </div>

                <div className="mb-3" id="save-and-back-buttons">
                  <button
                    className="btn btn-primary"
                    id="buttonSave"
                    onClick={handleChange}
                  >
                    Save
                  </button>
                  <a
                    href={"/book/" + bookId}
                    className="btn btn-primary text-end"
                  >
                    Back
                  </a>
                </div>
              </div>

              {modal && (
                <div className="background">
                  <div className="window-image-input">
                    <span className="exit" onClick={closeModal}>
                      &times;
                    </span>
                    <div className="window-container">
                      <a className="btn btn-primary" onClick={handleOptionFile}>
                        File
                      </a>
                      <a
                        className="btn btn-primary"
                        onClick={openShowPathInput}
                      >
                        URL
                      </a>
                      <a
                        className="btn btn-primary"
                        onClick={handleOptionRemove}
                      >
                        Delete image
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {showPathInput && (
                <div className="background">
                  <div className="window-image-input">
                    <span className="exit" onClick={closeShowPathInput}>
                      &times;
                    </span>
                    <div className="window-container">
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
                        <a
                          className="btn btn-primary"
                          onClick={handleOptionText}
                        >
                          Insert
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ChangeBookInfo;
