import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UpdateCommentForm from './updComment';
import DeleteCommentButton from './delComment';
import PostCommentForm from './postComment';
import styles from './track.module.scss';

const TrackComments = ({ trackId, trakcName }) => {
    const [comments, setComments] = useState([]);

    // useEffect(() => {
    //     axios.get(`http://localhost:5003/${trackId}/comments`)
    //         .then(response => {
    //             setComments(response.data);
    //         })
    //         .catch(error => {
    //             console.error('Error fetching comments:', error);
    //     });
    // }, [trackId]);

    // if (!comments) {
    //     return <div>Loading...</div>;
    // }

    const fetchComments = () => {
        axios.get(`http://localhost:5003/${trackId}/comments`)
            .then(response => {
                setComments(response.data);
            })
            .catch(error => {
                console.error('Error fetching comments:', error);
        });
    };

    useEffect(() => {
        fetchComments();
    }, [trackId]);

    const handleNewComment = (newComment) => {
        setComments([...comments, newComment]);
    };

    return (
        <div>
            <h1>Comments for Track: {trakcName}</h1>
            {comments.map((comment, index) => (
                <div key={index} className={styles.comm}>
                    <p>{comment.date}</p>
                    <p>{comment.text}</p>
                    <UpdateCommentForm commentId={comment.id} />
                    <DeleteCommentButton trackId={trackId} commentId={comment.id} />
                    {/* Render other comment properties as needed */}
                </div>
            ))}
            <PostCommentForm trackId={trackId} onNewComment={handleNewComment} />
        </div>
    );
};

export default TrackComments;