'use client';
import React from 'react';
import styles from './register.module.scss';
// import './global.scss';
import RegisterForm from './register';


export default function Register() {
    return (
        <div className={styles.register1}>
            <RegisterForm />
        </div>
    );
}