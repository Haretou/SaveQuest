import { useEffect, useState, useContext, createContext } from "react";
import { supabase } from "@/lib/supabase";
import { getUserProfile } from "@/lib/auth";

/** Context contract providing auth session, profile and group setter. */
interface AuthContextType {
  user: any;
  profile: any;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  setCurrentGroup: (groupId: string | null) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/** Provider wiring Supabase session with user profile and current group setter. */
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user ?? null);
      setLoading(false);
    })();

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      return;
    }

    (async () => {
      try {
        const profileData = await getUserProfile(user.id);
        setProfile(profileData);
      } catch (err) {
        console.log("Error loading profile:", err);
      }
    })();
  }, [user]);

  /** Refresh the profile from backend for the current user. */
  const refreshProfile = async () => {
    if (!user) return;
    const profileData = await getUserProfile(user.id);
    setProfile(profileData);
  };

  /** Update the current group id in Supabase and mirror locally. */
  const setCurrentGroup = async (groupId: string | null) => {
    if (!user) return;
    const { error } = await supabase
      .from("users")
      .update({ current_group: groupId })
      .eq("id", user.id);
    if (error) throw error;

    setProfile((prev: any) => ({ ...prev, current_group: groupId }));
  };

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, refreshProfile, setCurrentGroup }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/** Accessor hook for the auth context. */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
