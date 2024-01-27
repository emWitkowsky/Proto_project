import React from 'react';
import axios from 'axios';

const DeleteCommentButton = ({ trackId, commentId }) => {
    const handleDelete = async () => {
        try {
            const response = await axios.delete(`http://localhost:5003/${trackId}/comment/${commentId}`, {
                withCredentials: true
            });
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <button onClick={handleDelete}>Delete Comm</button>
    );
};

export default DeleteCommentButton;