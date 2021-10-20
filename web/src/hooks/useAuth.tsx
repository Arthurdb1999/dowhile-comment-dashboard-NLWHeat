import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { api } from "../services/api";

type AuthProviderProps = PropsWithChildren<{}>

type User = {
    id: string;
    avatar_url: string;
    name: string;
    login: string;
}

type AuthContextData = {
    user: User | null;
    isSigningIn: boolean;
    signInUrl: string;
    signOut: () => void
}

type AuthResponse = {
    token: string;
    user: User
}
const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;

export const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({ children }: AuthProviderProps) {
    const signInUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=${clientId}`

    const [user, setUser] = useState<User | null>(null)
    const [isSigningIn, setIsSigningIn] = useState(false);

    function signOut() {
        setUser(null)
        localStorage.removeItem('@dowhile:token')
    }

    async function signIn(githubCode: string) {
        try {
            const { data: { token, user } } = await api.post<AuthResponse>('authenticate', {
                code: githubCode
            })

            localStorage.setItem('@dowhile:token', token)
            api.defaults.headers.common.authorization = `Bearer ${token}`
            setUser(user)
        } catch (error) {
            console.log(error)
        } finally {
            setIsSigningIn(false)
        }
    }

    useEffect(() => {
        const url = window.location.href
        const hasGithubCode = url.includes('?code=')

        if (hasGithubCode) {
            const [urlWithoutCode, githubCode] = url.split('?code=')
            window.history.pushState({}, '', urlWithoutCode)

            signIn(githubCode)
        }
    }, [])

    useEffect(() => {
        const token = localStorage.getItem('@dowhile:token')

        if (token) {
            api.defaults.headers.common.authorization = `Bearer ${token}`

            api.get<User>('/profile').then(response => {
                setUser(response.data)
            }).catch(() => {
                signOut()
            })
        }
    }, [])

    return (
        <AuthContext.Provider value={{ signInUrl, isSigningIn, user, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
  
    return context
  }