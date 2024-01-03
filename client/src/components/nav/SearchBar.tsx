import React from 'react'
import { useState } from 'react';

function SearchBar() {
    const[searchTerm, setSearchTerm] = useState("");
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };


    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // search logic here
        console.log("searching for: ", searchTerm);
    };
    return (
        <form className="my-form" onSubmit={handleSubmit}>
                <input className="my-input" type="text" placeholder="Search..." value={searchTerm} onChange={handleChange}/>
                <button className="my-button" type="submit">Search</button>
        </form>
    );
 
}


export default SearchBar;
