'use client';
import React from 'react';
// import styles from './login.module.scss';
// import './global.scss';
import LoginForm from './loginForm';
import styles from './login.module.scss';


export default function Login() {
    return (
        <div className={styles.box}>
            <LoginForm />
        </div>
    );
}