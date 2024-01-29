import React from 'react';
import { Formik, Field, Form } from 'formik';
import axios from 'axios';
import styles from './admin.module.scss';

const UpdateTrackForm = () => {
    const handleSubmit = async (values) => {
        const { trackId, name, popular, genre } = values;
        try {
            const response = await axios.put(`http://localhost:5003/admin/tracks/${trackId}`, { name, popular, genre }, {
                withCredentials: true
            });
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className={styles.addTrackcss}>
            <h1 className={styles.title}>Update Track</h1>
            <Formik
                initialValues={{ trackId: '', name: '', popular: '', genre: '' }}
                onSubmit={handleSubmit}
            >
                <Form className={styles.formm}>
                    <label htmlFor="trackId">Track ID</label>
                    <Field id="trackId" name="trackId" placeholder="Enter track ID" />

                    <label htmlFor="name">Name</label>
                    <Field id="name" name="name" placeholder="Enter name" />

                    <label htmlFor="popular">Popular</label>
                    <Field id="popular" name="popular" placeholder="Enter popularity status" />

                    <label htmlFor="genre">Genre</label>
                    <Field id="genre" name="genre" placeholder="Enter genre" />

                    <button type="submit">Submit</button>
                </Form>
            </Formik>
        </div>
    );
};

export default UpdateTrackForm;