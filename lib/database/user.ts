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

    // Initialiser le profil utilisateur
    await initializeUserIfNeeded(user.id, user.email);

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

    // Initialiser le profil si nécessaire
    await initializeUserIfNeeded(user.id, user.email);

    return {user, message: "[Auth] Successfully logged in user"}
}

// Initialiser le profil utilisateur si les colonnes sont NULL
async function initializeUserIfNeeded(userId: string, userEmail: string | undefined) {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('level, points, streak, preferences')
            .eq('id', userId)
            .single();

        // Si le user n'existe pas du tout dans public.users (erreur PGRST116)
        if (error && error.code === 'PGRST116') {
            // Créer l'entrée dans public.users
            await supabase
                .from('users')
                .insert({
                    id: userId,
                    email: userEmail,
                    level: 1,
                    points: 0,
                    streak: 0,
                    preferences: { completed_quests: [] }
                });
            return;
        }

        if (error) {
            return;
        }

        // Vérifier si le profil doit être initialisé
        const needsInit = data.level === null || data.points === null || data.streak === null || !data.preferences;

        if (needsInit) {
            await supabase
                .from('users')
                .update({
                    level: data.level ?? 1,
                    points: data.points ?? 0,
                    streak: data.streak ?? 0,
                    preferences: data.preferences ?? { completed_quests: [] }
                })
                .eq('id', userId);
        }
    } catch {
        // Erreur silencieuse
    }
}

// Logout user
export async function Logout() {
   const {error} = await supabase.auth.signOut()
   if (error) throw new Error("[Auth] Error while logging out user " + error.message)
    return {message: "[Auth] Successfully logged out user"}
}
