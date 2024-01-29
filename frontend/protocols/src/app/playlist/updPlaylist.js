import React from 'react';
import { Formik, Field, Form } from 'formik';
import axios from 'axios';
import styles from './playlist.module.scss';

const UpdatePlaylistForm = () => {
    const handleSubmit = async (values) => {
        const { playlistName, newName } = values;
        try {
            const response = await axios.put(`http://localhost:5003/users/playlists/${playlistName}`, { newName }, {
                withCredentials: true
            });
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className={styles.addP}>
            <h1>Update Playlist</h1>
            <Formik
                initialValues={{ playlistName: '', newName: 'Chillout music' }}
                onSubmit={handleSubmit}
            >
                <Form className={styles.formm}>
                    <label htmlFor="playlistName">Playlist Name</label>
                    <Field id="playlistName" name="playlistName" placeholder="Enter playlist name" />

                    <label htmlFor="newName">New Name</label>
                    <Field id="newName" name="newName" placeholder="Enter new name" />

                    <button type="submit">Submit</button>
                </Form>
            </Formik>
        </div>
    );
};

export default UpdatePlaylistForm;