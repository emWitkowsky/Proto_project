import React from 'react';
import { Formik, Field, Form } from 'formik';
import axios from 'axios';

const PostCommentForm = ({ trackId }) => {
    const handleSubmit = async (values) => {
        const { text } = values;
        try {
            const response = await axios.post(`http://localhost:5003/${trackId}/comment`, { text }, {
                withCredentials: true
            });
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h1>Post Comment</h1>
            <Formik
                initialValues={{ text: '' }}
                onSubmit={handleSubmit}
            >
                <Form>
                    <label htmlFor="text"></label>
                    <Field id="text" name="text" placeholder="Leave a comment" />
                    <button type="submit">Comment</button>
                </Form>
            </Formik>
        </div>
    );
};

export default PostCommentForm;