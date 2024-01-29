import React from 'react';
import { Formik, Field, Form } from 'formik';
import axios from 'axios';
import { useCookies } from 'next-client-cookies';
import styles from './admin.module.scss';

const AddTrackForm = () => {
    const cookies = useCookies();
    const handleSubmit = async (values) => {
        try {
            // const response = await axios.post('http://localhost:5003/addTrack', values);
            // console.log(response.data);
            const response = await axios.post('http://localhost:5003/addTrack', values, {
                // headers: {
                //     'Cookie': cookies.get('token') 
                // }
                withCredentials: true
            });
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className={styles.addTrackcss}>
            <h1 className={styles.title}>Add Track</h1>
            <Formik
                initialValues={{ title: '', name: '', popular: '', genre: '' }}
                onSubmit={handleSubmit}
            >
                <Form className={styles.formm}>
                    <label htmlFor="title">Title</label>
                    <Field id="title" name="title" placeholder="Boys Like Toys" />

                    <label htmlFor="name">Name</label>
                    <Field id="name" name="name" placeholder="BLANKA" />

                    <label htmlFor="popular">Popular</label>
                    <Field id="popular" name="popular" placeholder="True" />

                    <label htmlFor="genre">Genre</label>
                    <Field id="genre" name="genre" placeholder="POP" />

                    <button type="submit">Submit</button>
                </Form>
            </Formik>
        </div>
    );
};

export default AddTrackForm;