// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const UserPlaylists = () => {
//     const [playlists, setPlaylists] = useState([]);

//     useEffect(() => {
//         const fetchPlaylists = async () => {
//             try {
//                 const response = await axios.get('http://localhost:5003/users/playlists', {
//                     withCredentials: true
//                 });
//                 setPlaylists(response.data);
//             } catch (error) {
//                 console.error(error);
//             }
//         };

//         fetchPlaylists();
//     }, []);

//     return (
//         <div>
//             <h1>User Playlists</h1>
//             {playlists.map((playlist, index) => (
//                 <div key={index}>
//                     <h2>{playlist.name}</h2>
//                     {/* Render other playlist properties as needed */}
//                 </div>
//             ))}
//         </div>
//     );
// };

// export default UserPlaylists;
import React, { useState } from 'react';
import axios from 'axios';

const UserPlaylists = () => {
    const [playlists, setPlaylists] = useState([]);

    const fetchPlaylists = async () => {
        try {
            const response = await axios.get('http://localhost:5003/users/playlists', {
                withCredentials: true
            });
            setPlaylists(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h1>User Playlists</h1>
            <button onClick={fetchPlaylists}>Fetch Playlists</button>
            {playlists.map((playlist, index) => (
                <div key={index}>
                    <h2>{playlist.name}</h2>
                    {/* Render other playlist properties as needed */}
                </div>
            ))}
        </div>
    );
};

export default UserPlaylists;