'use client';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useEffect, useState } from 'react';



export default function Page({ params }) {
    // const router = useRouter();
    // const { name } = router.query;
    const [track, setTrack] = useState(null);
    // console.log(params.slug);

    useEffect(() => {
        if (params.slug) {
            axios.get(`http://localhost:5003/track/${params.slug}`)
                .then(response => {
                    setTrack(response.data[0]);
                    // console.log(response.data)
                })
                .catch(error => {
                    console.error('Error fetching track:', error);
            });
        }
    }, [params.slug]);

    if (!track) {
        return <div>Loading...</div>;
    }
    

    return (
        <div>
            <h1>Track: {params.slug}</h1>
            <p>ID: {track.id}</p>
            {/* Display track information here. */}
        </div>
    );
}