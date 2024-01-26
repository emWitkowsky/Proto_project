import Link from 'next/link';

function LoginRegisterButtons() {
    return (
        <div>
            <Link href="/login">
                <button>Login</button>
            </Link>
            <Link href="/register">
                <button>Register</button>
            </Link>
        </div>
    );
}

export default LoginRegisterButtons;