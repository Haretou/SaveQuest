import { User } from "@supabase/supabase-js"
import { supabase } from "../supabase"
import { ErrorBoundary } from "expo-router"

// User global variable
let userID: string

// Register a new user
export async function Register(email: string, password: string) {
    const {data, error} = await supabase.auth.signUp({
        email,
        password
    })
    if (data.user) CreateUser(data.user)
    if (error) throw new Error(`[Auth] Error while creating user: ${error.message}`)
    if (!data.user) throw new Error("[Auth] Error while creating user: User cannot be null")
    return {message: "[Auth] Successfully register user"}
}

// Create user profile while registering
export async function CreateUser(user: User) {
    const { error } = await supabase.from("users").insert({
        id: user.id,
        username: "",
        first_name: "",
        last_name: "",
        email: user.email,
        avatar_url: "",
        level: 0,
        points: 0,
        streak: 0  
    })
    if (error) throw new Error(`[Auth] Error while creating user profile: ${error.message}`)
    return {message: "[Auth] Successfully created user profile"}
}

// Login user
export async function Login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    })
    const user = data.user;
    if (user) userID = data.user?.id
    else if (error) throw new Error("[Auth] Error while logging user: " + error.message)
    else throw new Error("[Auth] Error while logging user: User cannot be null")
    return {user, message: "[Auth] Successfully logged in user"}
}

// Logout user
export async function Logout() {
   const {error} = await supabase.auth.signOut()
   if (error) throw new Error("[Auth] Error while logging out user " + error.message)
    return {message: "[Auth] Successfully logged out user"}
}

// Get user using it's ID
export async function GetUserById() {
    const res = (await supabase.from("users").select().eq('id', userID)).data
    if (!res) throw new Error(`[Auth] Error while fetching data: User does not exist`)
    else return res
 }