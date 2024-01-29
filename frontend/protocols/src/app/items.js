'use client';
import React, { useState } from 'react';
import SearchBar from './searchBar';
import styles from './items.module.scss';
import Link from 'next/link';

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
                        <div className={styles.itemInside}>
                            <h2>{result.name}</h2>
                            <p>{result.genre}</p>
                        </div>
                        {/* <p>{result.id}</p> */}
                    </Link>
                ))}
            </div>
        </div>
    );
}