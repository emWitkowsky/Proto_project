import React from 'react';
import { Formik, Field, Form } from 'formik';
import axios from 'axios';
import styles from './admin.module.scss';

const DeleteTrackForm = () => {
    const handleSubmit = async (values) => {
        const { title } = values;
        try {
            const response = await axios({
                method: 'delete',
                url: 'http://localhost:5003/deleteTrack',
                data: {
                    title: title
                },
                withCredentials: true
            });
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className={styles.addTrackcss}>
            <h1 className={styles.title}>Delete Track</h1>
            <Formik
                initialValues={{ title: '' }}
                onSubmit={handleSubmit}
            >
                <Form className={styles.formm}>
                    <label htmlFor="title">Track Title</label>
                    <Field id="title" name="title" placeholder="Enter track title" />

                    <button type="submit">Submit</button>
                </Form>
            </Formik>
        </div>
    );
};

export default DeleteTrackForm;