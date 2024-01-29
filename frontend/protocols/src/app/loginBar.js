import Link from 'next/link';
import styles from './loginBar.module.scss';

function LoginRegisterButtons() {
    return (
        <div>
            <Link href="/login">
                <button className={styles.button}>Login</button>
            </Link>
            <Link href="/register">
                <button className={styles.button}>Register</button>
            </Link>
        </div>
    );
}

export default LoginRegisterButtons;