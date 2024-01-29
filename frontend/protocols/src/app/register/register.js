import React from 'react';
import { Formik, Field, Form } from 'formik';
import axios from 'axios';
import styles from './register.module.scss';

const RegisterForm = () => {
  const handleSubmit = async (values) => {
    try {
      const response = await axios.post('http://localhost:5003/auth/register', values);
      console.log(response.data);
    } catch (error) {
      console.error(`Error registering user:`, error);
    }
  };

  return (
    <div className={styles.box1}>
        <h1 className={styles.title}>Register</h1>
        <Formik initialValues={{ first_name: '', last_name: '', email: '', password: '' }} onSubmit={handleSubmit}>
          <Form className={styles.box}>
            <label htmlFor="first_name">First Name:</label>
            <Field id="first_name" name="first_name" placeholder="Daniel" />

            <label htmlFor="last_name">Last Name:</label>
            <Field id="last_name" name="last_name" placeholder="Radcliffe" />

            <label htmlFor="email">Email:</label>
            <Field id="email" name="email" placeholder="DanielRad@example.com" />

            <label htmlFor="password">Password:</label>
            <Field id="password" name="password" type="password" placeholder="DanielRadcliffe1" />

            <button type="submit">Register</button>
          </Form>
        </Formik>
    </div>
  );
};

export default RegisterForm;