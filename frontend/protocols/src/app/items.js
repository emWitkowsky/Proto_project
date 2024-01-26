'use client';
import React, { useState } from 'react';
import SearchBar from './searchBar';
import styles from './items.module.scss';

// export default function Items() {
//     const [results, setResults] = useState([]);

//     const handleSearch = (data) => {
//         setResults(data);
//     };

//     return (
//         <div className={styles.content}>
//             <SearchBar onSearch={handleSearch} />
//             <div className={styles.main}>
//                 {results.map((result, index) => (
//                     <div key={index} className={styles.musicItems}>
//                         {/* Wyświetl wyniki wyszukiwania. Dostosuj to do struktury twoich danych. */}
//                         <h2>{result.name}</h2>
//                         <p>{result.genre}</p>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }

// import { useRouter } from 'next/router';
// // ... other imports

// export default function Items() {
//     const [results, setResults] = useState([]);
//     const router = useRouter(); // Add this line

//     const handleSearch = (data) => {
//         setResults(data);
//     };

//     const handleClick = (name) => { // Add this function
//         router.push(`/track/${name}`);
//     };

//     return (
//         <div className={styles.content}>
//             <SearchBar onSearch={handleSearch} />
//             <div className={styles.main}>
//                 {results.map((result, index) => (
//                     <div key={index} className={styles.musicItems} onClick={() => handleClick(result.name)}>
//                         {/* Display search results. Adjust this to your data structure. */}
//                         <h2>{result.name}</h2>
//                         <p>{result.genre}</p>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }

import Link from 'next/link';
// ... other imports

export default function Items() {
    const [results, setResults] = useState([]);

    const handleSearch = (data) => {
        setResults(data);
    };

    return (
        <div className={styles.content}>
            <SearchBar onSearch={handleSearch} />
            <div className={styles.main}>
                {results.map((result, index) => (
                    <Link key={index} href={`/track/${encodeURIComponent(result.name)}`} className={styles.musicItems}>
                        {/* Display search results. Adjust this to your data structure. */}
                        <h2>{result.name}</h2>
                        <p>{result.genre}</p>
                        {/* <p>{result.id}</p> */}
                    </Link>
                ))}
            </div>
        </div>
    );
}