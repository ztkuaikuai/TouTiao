import { createClient } from "@/utils/supabase/client"
import type { User, Session } from "@supabase/supabase-js"
import { useEffect, useState } from "react"

export function useUser(): [User | null] {
    const supabase = createClient()
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        // Get the initial user state
        async function getInitialUser() {
            const { data: { user: initialUser } } = await supabase.auth.getUser()
            setUser(initialUser)
        }
        getInitialUser()

        // Subscribe to auth state changes
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session: Session | null) => {
            console.log('Auth event:', event, 'Session:', session)
            if (session && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED')) {
                setUser(session.user)
            } else if (event === 'SIGNED_OUT') {
                setUser(null)
            }
            // If initialUser was null and a session exists (e.g. on page refresh with active session)
            // Or if user logs in on another tab
            // This ensures the user state is correctly set based on the session from onAuthStateChange
            // which can sometimes be more up-to-date or fire after the initial getUser.
            if (user === null && session?.user) {
                setUser(session.user)
            }
        })

        // Cleanup subscription on unmount
        return () => {
            if (authListener && authListener.subscription) {
                authListener.subscription.unsubscribe()
            }
        }
    }, []) // Empty dependency array means this effect runs once on mount and cleans up on unmount
    
    return [user]
}
