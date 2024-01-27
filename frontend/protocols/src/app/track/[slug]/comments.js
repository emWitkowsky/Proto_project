import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UpdateCommentForm from './updComment';
import DeleteCommentButton from './delComment';

const TrackComments = ({ trackId, trakcName }) => {
    const [comments, setComments] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:5003/${trackId}/comments`)
            .then(response => {
                setComments(response.data);
            })
            .catch(error => {
                console.error('Error fetching comments:', error);
        });
    }, [trackId]);

    if (!comments) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Comments for Track: {trakcName}</h1>
            {comments.map((comment, index) => (
                <div key={index}>
                    <p>{comment.date}</p>
                    <p>{comment.text}</p>
                    <UpdateCommentForm commentId={comment.id} />
                    <DeleteCommentButton trackId={trackId} commentId={comment.id} />
                    {/* Render other comment properties as needed */}
                </div>
            ))}
        </div>
    );
};

export default TrackComments;