'use client'
import { useState } from 'react';
import axios from 'axios';
import UserList from './usersbutton';
import AddTrackForm from './addTrack';
import UpdateUserRoleForm from './changeCred';
// import { useCookies } from 'next-client-cookies';
import UpdateTrackForm from './updTrack';
import DeleteTrackForm from './delTrack';
import DeleteUserForm from './delUser';
import styles from './admin.module.scss';

const AdminPanel = () => {

    return (
        <div className={styles.adminn}>
            <UserList/>
            <AddTrackForm/>
            <UpdateUserRoleForm/>
            <UpdateTrackForm/>
            <DeleteTrackForm/>
            <DeleteUserForm/>
        </div>
    );
};

export default AdminPanel;