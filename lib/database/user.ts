import {supabase} from "../supabase"

// Register a new user
export async function Register(email: string, password: string) {
    const {data, error} = await supabase.auth.signUp({
        email,
        password
    })
    const user = data.user
    if (error) throw new Error("[Auth] Error while creating user: " + error.message)
    if (!user) throw new Error("[Auth] Error while creating user: User cannot be null")
    return {user, message: "[Auth] Successfully register user"}
}

// Login user
export async function Login(email: string, password: string) {
    const {data, error} = await supabase.auth.signInWithPassword({
        email,
        password
    })
    const user = data.user
    if (error) throw new Error("[Auth] Error while logging user: " + error.message)
    if (!user) throw new Error("[Auth] Error while logging user: User cannot be null")
    return {user, message: "[Auth] Successfully logged in user"}
}

// Logout user
export async function Logout() {
   const {error} = await supabase.auth.signOut()
   if (error) throw new Error("[Auth] Error while logging out user " + error.message)
    return {message: "[Auth] Successfully logged out user"}
}
