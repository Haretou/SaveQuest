import { User } from "@supabase/supabase-js";
import { supabase } from "../supabase";

export interface UserProfileData {
    username: string;
    firstName: string;
    lastName: string;
    age: number;
    monthlyIncome: number;
    city: string;
}

export async function Register(email: string, password: string, profileData: UserProfileData) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password
    })
    if (data.user) await CreateUser(data.user, profileData)
    if (error) throw new Error(`[Auth] Error while creating user: ${error.message}`)
    if (!data.user) throw new Error("[Auth] Error while creating user: User cannot be null")
    return { message: "[Auth] Successfully register user" }
}

export async function CreateUser(user: User, profileData: UserProfileData) {
    const { error } = await supabase.from("users").insert({
        id: user.id,
        username: profileData.username,
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        email: user.email,
        avatar_url: "",
        monthly_income: profileData.monthlyIncome,
        age: profileData.age,
        city: profileData.city,
        level: 0,
        points: 0,
        streak: 0,
        subscription_status: "free",
    })
    if (error) throw new Error(`[Auth] Error while creating user profile: ${error.message}`)
    return { message: "[Auth] Successfully created user profile" }
}

// Login user
export async function Login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    })
    const user = data.user
    if (error) throw new Error("[Auth] Error while logging user: " + error.message)
    if (!user) throw new Error("[Auth] Error while logging user: User cannot be null")
    return { user, message: "[Auth] Successfully logged in user" }
}

// Logout user
export async function Logout() {
    const { error } = await supabase.auth.signOut()
    if (error) throw new Error("[Auth] Error while logging out user " + error.message)
    return { message: "[Auth] Successfully logged out user" }
}
