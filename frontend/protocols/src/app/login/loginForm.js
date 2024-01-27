// import { Formik, Field, Form } from 'formik';

// export default function LoginForm() {
//     return (
//         <div>
//             <h1>Login</h1>
//             <p>Login page body content</p>
//             <Formik
//                 initialValues={{ email: '', password: '' }}
//                 onSubmit={async (values) => {
//                     await new Promise((r) => setTimeout(r, 500));
//                     alert(JSON.stringify(values, null, 2));
//                 }}
//             >
//                 <Form>
//                     <label htmlFor="email">Email</label>
//                     <Field id="email" name="email" placeholder="john@doe.com" />

//                     <label htmlFor="password">Password</label>
//                     <Field id="password" name="password" type="password" />

//                     <button type="submit">Submit</button>
//                 </Form>
//             </Formik>
//         </div>
//     );
// }

import { Formik, Field, Form } from 'formik';
import { useCookies } from 'next-client-cookies';
import { useHistory } from 'react-router-dom';

const LoginForm = () => {
    const cookies = useCookies();
    // const history = useHistory();
    return (
        <div>
            <h1>Login</h1>
            <p>Login page body content</p>
            <Formik
                initialValues={{ email: '', password: '' }}
                onSubmit={async (values) => {
                    const response = await fetch('http://localhost:5003/auth/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(values)
                    });

                    if (response.ok) {
                        const data = await response.json();
                        console.log(response);
                        cookies.set('token', data.data[1]);
                        console.log(data);
                        if (data.status === 'success') {
                            history.push('/');
                        }
                    } else {
                        console.error('Error:', response.status);
                    }
                }}
            >
                <Form>
                    <label htmlFor="email">Email</label>
                    <Field id="email" name="email" placeholder="john@doe.com" />

                    <label htmlFor="password">Password</label>
                    <Field id="password" name="password" type="password" />

                    <button type="submit">Submit</button>
                </Form>
            </Formik>
        </div>
    );
}

export default LoginForm;