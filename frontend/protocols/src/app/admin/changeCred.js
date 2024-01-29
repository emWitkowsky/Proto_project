import React from 'react';
import { Formik, Field, Form } from 'formik';
import axios from 'axios';
import styles from './admin.module.scss';

const UpdateUserRoleForm = () => {
    const handleSubmit = async (values) => {
        const { userId, role } = values;
        try {
            const response = await axios.put(`http://localhost:5003/user/${userId}/role`, { role }, {
                withCredentials: true
            });
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className={styles.addTrackcss}>
            <h1 className={styles.title}>Update User Role</h1>
            <Formik
                initialValues={{ userId: '', role: 'Moderator' }}
                onSubmit={handleSubmit}
            >
                <Form className={styles.formm}>
                    <label htmlFor="userId">User ID</label>
                    <Field id="userId" name="userId" placeholder="Enter user ID" />

                    <label htmlFor="role">Role</label>
                    <Field id="role" name="role" placeholder="Enter role" />

                    <button type="submit">Submit</button>
                </Form>
            </Formik>
        </div>
    );
};

export default UpdateUserRoleForm;