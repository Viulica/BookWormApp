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

  const handleChange = async () => {
    console.log(bookData);
    console.log(imagePath);
    console.log(fileImage);

    const formData = new FormData();
    formData.append("title", bookData.naslov);
    formData.append("genre", bookData.zanr);
    formData.append("published", bookData.godizd);
    formData.append("about", bookData.opis);
    formData.append("isbn", bookData.isbn);

    if (fileImage) {
      // Ako korisnik unese datoteku, dodajte je u FormData
      formData.append("fileImage", bookData.slika!);
    } else {
       console.log("Dodaj: ", bookData.slika);
       if (imagePath) {
          formData.append("imageUrl", imagePath);
       }
       else {
         formData.append("imageUrl", imagePath);
       }
    }

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
          <div className="container-title">
            <h1 className="display-6">Change book info</h1>
          </div>

          <div className="container-validation"></div>

          <div className="container-change-bookData">
            <div className="mb-3">
              <img
                src={coverImage || imagePath || getImageSource(bookData.slika)}
                alt="Slika"
                style={{ cursor: "pointer" }}
                onClick={openModal}
              />
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
                }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="published" className="form-label">
                Published
              </label>
              <input
                type="text"
                name="published"
                id="published"
                className="form-control"
                value={bookData.godizd}
                onChange={(e) => {
                  setBookData({ ...bookData, godizd: e.target.value });
                }}
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
                }}
              />
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
                }}
              ></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="isbn" className="form-label">
                ISBN
              </label>
              <input
                type="text"
                name="isbn"
                id="isbn"
                className="form-control"
                value={bookData.isbn}
                onChange={(e) => {
                  setBookData({ ...bookData, isbn: e.target.value });
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
              <a href={"/book/" + bookId} className="btn btn-primary text-end">
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
                  <a className="btn btn-primary" onClick={openShowPathInput}>
                    URL
                  </a>
                  <a className="btn btn-primary" onClick={handleOptionRemove}>
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
                    <a className="btn btn-primary" onClick={handleOptionText}>
                      Insert
                    </a>
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

export default ChangeBookInfo;
