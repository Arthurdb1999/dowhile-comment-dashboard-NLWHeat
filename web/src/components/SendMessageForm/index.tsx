
import { FormEvent, useState } from 'react'
import { VscGithubInverted, VscSignOut } from 'react-icons/vsc'
import { useAuth } from '../../hooks/useAuth'
import { api } from '../../services/api'
import styles from './styles.module.scss'

export function SendMessageForm() {

    const { user, signOut } = useAuth()
    const [message, setMessage] = useState('')
    const [isSendingMessage, setIsSendingMessage] = useState(false)

    async function handleSendMessage(e: FormEvent) {
        e.preventDefault()
        if (!message.trim()) return

        setIsSendingMessage(true)
        try {
            await api.post('/messages', { message })

            setMessage('')
        } finally {
            setIsSendingMessage(false)
        }

    }

    return (
        <div className={styles.sendMessageFormWrapper}>
            <button onClick={signOut} className={styles.signOutButton}>
                <VscSignOut size="32" />
            </button>

            <header className={styles.userInformation}>
                <div className={styles.userImage}>
                    <img src={user?.avatar_url} alt={user?.name} />
                </div>
                <strong className={styles.userName}>{user?.name}</strong>
                <span className={styles.userGithub}>
                    <VscGithubInverted size="16" />
                    {user?.login}
                </span>
            </header>

            <form onSubmit={handleSendMessage} className={styles.sendMessageForm}>
                <label htmlFor="message">Mensagem</label>
                <textarea
                    name="message"
                    id="message"
                    placeholder="Qual sua expectativa para o evento?"
                    onChange={e => setMessage(e.target.value)}
                    value={message}
                />
                <button
                    type="submit"
                    disabled={isSendingMessage}
                >
                    Enviar Mensagem
                </button>
            </form>
        </div>
    )
}