'use client'
import { useState } from 'react';
import axios from 'axios';

const UserList = () => {
    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        const response = await axios.get('http://localhost:5003/allUsers');
        setUsers(response.data);
    };

    return (
        <div>
            <button onClick={fetchUsers}>Get Users</button>
            {users && users.map(user => (
                <div key={user.id}>
                    <h2>{user.first_name} {user.last_name}</h2>
                    <p>{user.role}</p>
                    <p>{user.id}</p>
                    <p>{user.password}</p>
                </div>
            ))}
        </div>
    );
};

export default UserList;