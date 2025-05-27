import { createClient } from "@/utils/supabase/client"
import type { User } from "@supabase/supabase-js"
import { useEffect, useState } from "react"

export function useUser(): [User | null] {
    const supabase = createClient()
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        async function getUser() {
            const { data: { user } } = await supabase.auth.getUser()
            console.log('user', user)
            setUser(user)
          }
          getUser()
    }, [])
    
    return [user]
}