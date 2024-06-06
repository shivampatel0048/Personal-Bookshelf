import React, { useEffect, useState, useMemo } from 'react';

const PersonalBookshelfPage = () => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        try {
            const storedBooks = window.localStorage.getItem('bookshelf');
            console.log('Raw storedBooks from local storage:', storedBooks);
            const parsedBooks = JSON.parse(storedBooks) || [];
            console.log('Parsed books:', parsedBooks);
            setBooks(parsedBooks);
        } catch (error) {
            console.error('Error reading from local storage', error);
        }
    }, []);

    const bookCount = useMemo(() => books.length, [books]);

    return (
        <div className="container flex flex-col justify-center items-center mt-10 relative">
            <h1 className="text-xl font-bold mb-4 border-b-2 border-black/30 pb-1 px-4 relative">
                My Bookshelf
                {bookCount > 0 && (
                    <span className="text-xs font-normal bg-black/70 text-white p-1 w-6 text-center rounded-full absolute -top-3 ml-1">
                        {bookCount}
                    </span>
                )}
            </h1>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {books.map((book, index) => (
                    <li key={index} className="my-2 border-2 border-black p-3 rounded-md w-64 h-64 relative text-justify">
                        <p className='font-bold text-lg mb-3'>
                            Book Title: <span className="font-normal">{book.title}</span>
                        </p>
                        <p className='font-bold text-lg mb-3'>
                            Edition Count: <span className="font-normal">{book.edition_count}</span>
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PersonalBookshelfPage;
