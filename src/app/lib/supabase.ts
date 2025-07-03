import { createClient } from "@supabase/supabase-js"

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
  if (error) throw error;
}
