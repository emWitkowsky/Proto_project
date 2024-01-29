'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function PopularTracks() {
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await axios.get('http://localhost:5003/tracks/popular');
        setTracks(response.data);
      } catch (error) {
        console.error(`Error fetching popular tracks:`, error);
      }
    };

    fetchTracks();
  }, []);

  if (!tracks.length) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Popular Tracks</h1>
      {tracks.map((track, index) => (
        <div key={index}>
          <h2>{track.name}</h2>
          {/* <p>{track.artist}</p> */}
          {/* Add more fields as necessary */}
        </div>
      ))}
    </div>
  );
}