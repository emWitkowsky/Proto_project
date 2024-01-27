'use client'
import { useState } from 'react';
import axios from 'axios';
import UserList from './usersbutton';
import AddTrackForm from './addTrack';
import UpdateUserRoleForm from './changeCred';
// import { useCookies } from 'next-client-cookies';
import UpdateTrackForm from './updTrack';
import DeleteTrackForm from './delTrack';

const AdminPanel = () => {

    return (
        <div>
            <UserList/>
            <AddTrackForm/>
            <UpdateUserRoleForm/>
            <UpdateTrackForm/>
            <DeleteTrackForm/>
        </div>
    );
};

export default AdminPanel;