'use client';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useEffect, useState } from 'react';
import TrackComments from './comments';
import PostCommentForm from './postComment';
import styles from './track.module.scss';




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
        <div className={styles.trackPage}>
            <div className={styles.title}>
                <div className={styles.header}>
                    <h1>Track: {params.slug}</h1>
                    <p>ID: {track.id}</p>
                    <p>Genre: {track.genre}</p>
                    <p>Popular: {track.popular}</p>
                </div>
            </div>
            {/* Display track information here. */}
            <div>
                <TrackComments trackId={track.id} trakcName={params.slug}/>
                {/* <PostCommentForm trackId={track.id} /> */}
            </div>
        </div>
    );
}