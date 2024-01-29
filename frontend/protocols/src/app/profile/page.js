'use client';
import React from 'react';
import ProfileInfo from './profile';
import styles from './profile.module.scss';

export default function Profile() {
    return (
        <div className={styles.prof}>
            {/* <h1>Profile</h1>
            <p>Profile page body content</p> */}
            <ProfileInfo/>
        </div>
    );
}