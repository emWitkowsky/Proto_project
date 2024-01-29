'use client';
import React from 'react';
// import styles from './login.module.scss';
// import './global.scss';
import CreatePlaylistForm from './addPlaylist';
import PlaylistList from './getPlaylists';
import DeletePlaylistForm from './delPlaylist';
import UpdatePlaylistForm from './updPlaylist';
import styles from './playlist.module.scss';


export default function PlaylistMenu() {
    return (
        <div className={styles.box}>
            <CreatePlaylistForm/>
            <PlaylistList/>
            <DeletePlaylistForm/>
            <UpdatePlaylistForm/>
        </div>
    );
}