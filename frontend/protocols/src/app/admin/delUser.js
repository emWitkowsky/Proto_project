import React from 'react';
import { Formik, Field, Form } from 'formik';
import axios from 'axios';
import styles from './admin.module.scss';

const DeleteUserForm = () => {
//   const handleSubmit = async (values) => {
//     try {
//       const response = await axios.delete('http://localhost:5003/user/delete', { data: { email: values.email } });
//       console.log(response.data);
//     } catch (error) {
//       console.error(`Error deleting user:`, error);
//     }
//   };
    const handleSubmit = async (values) => {
        try {
            const response = await axios.delete('http://localhost:5003/user/delete', { 
            data: { email: values.email },
            withCredentials: true 
        });
        console.log(response.data);
        } catch (error) {
            console.error(`Error deleting user:`, error);
        }
  };

  return (
    <div>
        <h1 className={styles.title}>Delete User</h1>
        <Formik initialValues={{ email: '' }} onSubmit={handleSubmit}>
            <Form className={styles.formm}>
                <label htmlFor="email">Email</label>
                <Field id="email" name="email" placeholder="email" />

                <button type="submit">Delete User</button>
            </Form>
        </Formik>
    </div>
  );
};

export default DeleteUserForm;