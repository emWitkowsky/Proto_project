import React from 'react';
import { Formik, Field, Form } from 'formik';
import axios from 'axios';

const UpdateCommentForm = ({ commentId }) => {
    const handleSubmit = async (values) => {
        const { text } = values;
        try {
            const response = await axios.put(`http://localhost:5003/comment/${commentId}/update`, { text }, {
                withCredentials: true
            });
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            {/* <h1>Update Comment</h1> */}
            <Formik
                initialValues={{ text: 'Updated Kocham!' }}
                onSubmit={handleSubmit}
            >
                <Form>
                    {/* <label htmlFor="text">Update</label> */}
                    <Field id="text" name="text" placeholder="Corrected comment" />

                    <button type="submit">Update</button>
                </Form>
            </Formik>
        </div>
    );
};

export default UpdateCommentForm;