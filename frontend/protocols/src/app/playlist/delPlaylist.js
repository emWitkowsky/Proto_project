import React from 'react';
import { Formik, Field, Form } from 'formik';
import axios from 'axios';
import styles from './playlist.module.scss';

const DeletePlaylistForm = () => {
    const handleSubmit = async (values) => {
        const { playlistName } = values;
        try {
            const response = await axios.delete(`http://localhost:5003/users/playlists/${playlistName}`, {
                withCredentials: true
            });
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className={styles.addP}>
            <h1>Delete Playlist</h1>
            <Formik
                initialValues={{ playlistName: '' }}
                onSubmit={handleSubmit}
            >
                <Form className={styles.formm}>
                    <label htmlFor="playlistName">Playlist Name</label>
                    <Field id="playlistName" name="playlistName" placeholder="Enter playlist name" />

                    <button type="submit">Submit</button>
                </Form>
            </Formik>
        </div>
    );
};

export default DeletePlaylistForm;