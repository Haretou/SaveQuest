import { User } from "@supabase/supabase-js";
import { getConfirmRedirectUrl } from "../deeplink";
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
        password,
        options: { emailRedirectTo: getConfirmRedirectUrl() },
    })
    if (error) {
        const msg = error.message.toLowerCase()
        if (msg.includes("rate limit") || msg.includes("email rate limit") || msg.includes("over_email_send_rate_limit"))
            throw new Error("Trop de tentatives. Réessaie dans quelques minutes.")
        if (msg.includes("already registered") || msg.includes("user already exists"))
            throw new Error("Un compte existe déjà avec cet email.")
        throw new Error("Impossible de créer le compte. Réessaie plus tard.")
    }
    if (!data.user) throw new Error("Impossible de créer le compte. Réessaie plus tard.")
    await CreateUser(data.user, profileData)
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
    if (error) {
        const msg = error.message.toLowerCase()
        if (msg.includes("duplicate key") || msg.includes("already exists") || msg.includes("unique constraint"))
            throw new Error("Un compte existe déjà avec cet email.")
        throw new Error("Impossible de créer le profil. Réessaie plus tard.")
    }
    return { message: "[Auth] Successfully created user profile" }
}

// Login user
export async function Login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    })
    const user = data.user
    if (error) {
        const msg = error.message.toLowerCase()
        if (msg.includes("rate limit"))
            throw new Error("Trop de tentatives. Réessaie dans quelques minutes.")
        throw new Error(error.message)
    }
    if (!user) throw new Error("[Auth] Error while logging user: User cannot be null")
    return { user, message: "[Auth] Successfully logged in user" }
}

// Resend confirmation email
export async function ResendConfirmationEmail(email: string) {
    const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: { emailRedirectTo: getConfirmRedirectUrl() },
    });
    if (error) {
        const msg = error.message.toLowerCase()
        if (msg.includes("rate limit"))
            throw new Error("Trop de tentatives. Réessaie dans quelques minutes.")
        throw new Error("Impossible d'envoyer l'email. Réessaie plus tard.")
    }
    return { message: "[Auth] Confirmation email resent" };
}

// Logout user
export async function Logout() {
    const { error } = await supabase.auth.signOut()
    if (error) throw new Error("[Auth] Error while logging out user " + error.message)
    return { message: "[Auth] Successfully logged out user" }
}
