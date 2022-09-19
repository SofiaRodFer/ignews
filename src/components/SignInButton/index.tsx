import { FaGithub } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import { IconContext } from 'react-icons/lib';

import { signIn, signOut, useSession } from 'next-auth/react'

import styles from './styles.module.scss';

export function SignInButton() {
    const { data: session } = useSession()

    return session ? (
        <button 
            type="button"
            className={styles.signInButton}
            onClick={() => signOut()}
        >
            <FaGithub color='#04d361' />
            {session.user.name}
            <IconContext.Provider value={{ className: styles.closeIcon }}>
                <FiX color='#737380' />
            </IconContext.Provider>

        </button>
    ) : (
        <button
            type="button"
            className={styles.signInButton}
            onClick={() => signIn('github')}
        >
            <FaGithub color='#eba517' />
            Sign in with Github
        </button>
    );
}