import React from 'react'
import "../styles/images.css"
import "../styles/Book.css"

interface BookProps {
    naslov: string,
    autor: string,
    src: string,
    rating: number
}


const Book = (props: BookProps) => {

  return (
        <div className='book-container'>
            <img className='my-img' src={props.src}/>
            <div id="naslov">
                Naslov: {props.naslov}
            </div>
            <div id="autor">
                Autor: {props.autor}
            </div>
            <div id="rating">
                Rating: {props.rating}
            </div>
        </div>
  )
}

export default Book

