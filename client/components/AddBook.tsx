import React, { useState, useEffect } from "react";
import { baseUrl } from "../src/App";
import { useNavigate } from "react-router-dom";

const AddBook: React.FC = () => {

   const [allAuthors, setAllAuthors] = useState<any[]>([]);

   const [title, setTitle] = useState("");
   const [genre, setGenre] = useState("");
   const [published, setPublished] = useState("");
   const [about, setAbout] = useState("");
   const [isbn, setIsbn] = useState("");
   const [userId, setUserId] = useState<number>();
   const [coverImage, setCoverImage] = useState<File | null>(null);


   useEffect(() => {
      const fetchAllAuthors = async () => {
         const response = await fetch(`${baseUrl}/api/data/allAuthors`, {});

         if (response.ok) {
            const data = await response.json();
            // console.log(await response.json());
            setAllAuthors(data);
         }
         else {
            console.log(response);
         }
      }

      fetchAllAuthors();
   }, []);

   const handleAddBook = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const data = {
         title,
         genre,
         published,
         about,
         isbn,
         userId,
         coverImage
      };

      console.log(data);
      try {
         const response = await fetch(`${baseUrl}/api/data/addBook`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
         });

         if (response.ok) {
            console.log(await response.json());
         } else {
            console.error("Neuspješan poziv na /api/data/addBook");
         }
      } catch (error) {
         console.error("Greška prilikom dohvaćanja podataka profila", error);
      } 

      // console.log(document.getElementById('author'));
   };
   

   return (
      // title, genre, published, about, isbn, userId
      <form method="post" onSubmit={handleAddBook} encType="multipart/form-data">
         <input type="text" placeholder="Title" onChange={(e) => { setTitle(e.target.value); }} required/>
         <input type="text" placeholder="Genre" onChange={(e) => { setGenre(e.target.value); }} required/>
         <input type="text" placeholder="Published" onChange={(e) => { setPublished(e.target.value); }} required/>
         <input type="text" placeholder="About" onChange={(e) => { setAbout(e.target.value); }} required/>
         <input type="text" placeholder="Isbn" onChange={(e) => { setIsbn(e.target.value); }} required/>
         <select name="author" id="author" onChange={(e) => {
            setUserId(parseInt(e.target.value));
         }} required>
            <option value="">Odaberi autora</option>
            {allAuthors.map((author, index) => (
               <option value={author.idkorisnik} key={index}>{author.ime} { author.prezime }</option>
            ))}
         </select>

         <input type="file" id="coverImage" name="coverImage" accept="image/*" onChange={(e) => {
            const files = e.target.files;

            if (files && files.length > 0) {
               const file = files[0];
               setCoverImage(file);
            }
         }}></input>

         <button type="submit">Pošalji</button>
      </form>
  );
};

export default AddBook;
