import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function ProfileInfo() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5003/users/profile', { withCredentials: true });
        setProfile(response.data);
      } catch (error) {
        console.error(`Error fetching profile:`, error);
      }
    };

    fetchProfile();
  }, []);

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Profile</h1>
      <p>{profile.first_name}</p>
      <p>{profile.last_name}</p>
      <p>{profile.email}</p>
    </div>
  );
}