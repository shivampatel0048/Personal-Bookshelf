import React, { useEffect, useState, useCallback } from 'react';
import debounce from 'lodash.debounce';

const BookSearchPage = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isHovered, setIsHovered] = useState(false);
    const [totalBooks, setTotalBooks] = useState(0);
    const [searchCache, setSearchCache] = useState({});
    const [isLoading, setIsLoading] = useState(false); // New state for loading indicator

    const fetchBooks = async (searchQuery) => {
        setIsLoading(true); // Show loader
        if (searchCache[searchQuery]) {
            setResults(searchCache[searchQuery]);
            setIsLoading(false); // Hide loader
            return;
        }
        const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(searchQuery)}&limit=10&page=1`);
        const data = await response.json();
        setResults(data.docs);
        setSearchCache(prevCache => ({ ...prevCache, [searchQuery]: data.docs }));
        setIsLoading(false); // Hide loader
    };

    const debouncedFetchBooks = useCallback(debounce(fetchBooks, 300), [searchCache]);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        if (value) {
            debouncedFetchBooks(value);
        } else {
            setResults([]);
        }
    };

    const addToBookshelf = (book) => {
        const currentBooks = JSON.parse(window.localStorage.getItem('bookshelf')) || [];
        const updatedBooks = [...currentBooks, book];
        window.localStorage.setItem('bookshelf', JSON.stringify(updatedBooks));
        setTotalBooks(updatedBooks.length);
    };

    useEffect(() => {
        const storedBooks = JSON.parse(window.localStorage.getItem('bookshelf')) || [];
        setTotalBooks(storedBooks.length);
    }, []);

    return (
        <div className="container flex justify-center mt-10 relative">
            {/* Loader */}
            {isLoading && (
                <div className="absolute w-screen h-screen">
                    <div className="fixed inset-0 bg-black flex justify-center items-center opacity-50 z-50">
                        <div className="z-50">
                            <div className="loader"></div>
                        </div>
                    </div>
                </div>
            )}
            <header>
                <a href="/bookshelf"
                    className="hidden sm:flex font-medium p-2 px-4 rounded-md bg-green-500 hover:bg-green-400 duration-300 absolute right-4 lg:right-20 top-5"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    My Bookshelf{totalBooks > 0 && <span className="text-xs font-normal bg-black/70 text-white p-1 w-6 text-center rounded-full absolute -top-3 -right-3 ml-1">{totalBooks}</span>}
                </a>
                <div className='sm:hidden'>
                    <p className={`absolute right-14 top-0 bg-green-400 text-black/80 p-1 px-3 rounded-s-full rounded-t-full ${isHovered ? '' : 'invisible'}`}>My Bookshelf</p>
                    <a href="/bookshelf"
                        className="p-3 absolute top-5 right-4 text-center border-black/30 border-2 rounded-full text-2xl hover:text-3xl ease-in duration-300"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        🛍️ {totalBooks > 0 && <span className="text-xs font-normal bg-black/70 text-white p-1 w-6 text-center rounded-full absolute -top-2">{totalBooks}</span>}
                    </a>
                </div>
            </header>
            <div className="flex flex-col justify-center items-center">
                <h2 className="font-bold text-xl mb-5">Search by book name:</h2>
                <input
                    type="text"
                    placeholder="Search for a book..."
                    value={query}
                    onChange={handleInputChange}
                    className="border px-5 p-2 rounded-full mb-8 md:w-96"
                />
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {results.map((book) => (
                        <li key={book.key} className="my-2 border-2 border-black p-3 rounded-md w-64 h-80 relative text-justify">
                            <p className='font-bold text-lg mb-3' >Book Title:  <span className="font-normal">{" "} {book.title}</span></p>
                            <p className='font-bold text-lg mb-3' >Edition Count: <span className="font-normal">{" "} {book.edition_count}</span></p>
                            <a href={`/book/${book.key}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    addToBookshelf({ ...book, key: book.key });
                                }}
                                className="absolute bottom-5 font-medium p-2 px-4 rounded-md bg-green-500 hover:bg-green-400 duration-300 left-10"
                            >
                                Add My Bookshelf
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default BookSearchPage;
