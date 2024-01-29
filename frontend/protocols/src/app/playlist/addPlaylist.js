import React from 'react';
import { Formik, Field, Form } from 'formik';
import axios from 'axios';
import styles from './playlist.module.scss';

const CreatePlaylistForm = () => {
    const handleSubmit = async (values) => {
        const { name } = values;
        try {
            const response = await axios.post('http://localhost:5003/playlists', { name }, {
                withCredentials: true
            });
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className={styles.addP}>
            <h1>Create Playlist</h1>
            <Formik
                initialValues={{ name: '' }}
                onSubmit={handleSubmit}
            >
                <Form className={styles.formm}>
                    <label htmlFor="name">Playlist Name</label>
                    <Field id="name" name="name" placeholder="Enter playlist name" />

                    <button type="submit">Submit</button>
                </Form>
            </Formik>
        </div>
    );
};

export default CreatePlaylistForm;