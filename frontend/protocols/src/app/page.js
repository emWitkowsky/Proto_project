'use client';
import React from "react";
import SearchBar from "./searchBar";
import Items from "./items";
import styles from "./home.module.scss";
import "./global.scss";
import LoginRegisterButtons from "./loginBar";

export default function Home() {
    return (
        <div className={styles.myDiv}>
            <div className={styles.navbar}>
                <h1 className={styles.myH1}>Music App</h1>
                <p>Music database</p>
                {/* <SearchBar /> */}
            </div>
            <div className={styles.loginBar}>
                <LoginRegisterButtons />
            </div>
            <Items className={styles.fullWidth} />
        </div>
    );
}