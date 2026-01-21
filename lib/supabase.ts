import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

type ExtraConfig = {
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
};

const extra = (Constants.expoConfig?.extra || {}) as ExtraConfig;

if (!extra.SUPABASE_URL || !extra.SUPABASE_ANON_KEY) {
  throw new Error("Missing Supabase environment variables. Check your .env or app.config.js");
}

export const supabase = createClient(extra.SUPABASE_URL, extra.SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
