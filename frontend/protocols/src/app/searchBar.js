'use client';
import React, { useState } from 'react';
import axios from 'axios';
import styles from './searchBar.module.scss';

export default function SearchBar({ onSearch }) {
    const [query, setQuery] = useState('');

    const handleSearch = async () => {
        try {
            const response = await axios.get('http://localhost:5003/track/search', {
                params: {
                    q: query
                }
            });
            onSearch(response.data);
        } catch (error) {
            console.error('Error during search:', error);
        }
    };

    return (
        <div className={styles.searchbar}>
            <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search for music..."
                className={styles.search}
            />
            <button onClick={() => handleSearch()} className={styles.searchButton}>Search</button>
        </div>
    );
}
