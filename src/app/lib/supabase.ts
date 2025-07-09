  import { createClient } from "@supabase/supabase-js"

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/dashboard` : undefined
    }
  });
  if (error) throw error;
}

export async function callBackendWithAuth(endpoint: string, options: RequestInit = {}) {
  // Get the current session (access token)
  const { data: { session } } = await supabase.auth.getSession();
  const accessToken = session?.access_token;

  if (!accessToken) {
    throw new Error("No access token found. User may not be logged in.");
  }

  // Merge headers
  const headers = {
    ...(options.headers || {}),
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };

  // Call your backend
  const res = await fetch(endpoint, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let errorMsg = 'Backend error';
    try {
      const error = await res.json();
      errorMsg = error.error || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }

  return res.json();
}

export async function createOrGetUser() {
  // Get the current session (access token)
  const { data: { session } } = await supabase.auth.getSession();
  const accessToken = session?.access_token;

  if (!accessToken) {
    throw new Error("No access token found. User may not be logged in.");
  }

  // 1. Try to fetch the user from backend
  const userRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (userRes.ok) {
    // User exists, return the user data
    return await userRes.json();
  }

  // 2. If not found, create the user
  if (userRes.status === 404) {
    // Get user profile from Supabase
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No user found");

    // Use 'name' from user_metadata if available, else fallback
    const username = user.user_metadata?.name
      || user.user_metadata?.username
      || user.email?.split('@')[0]
      || 'User';

    const userData = {
      username,
      avatar_url: user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${user.email}`,
    };

    const createRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/create-user`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!createRes.ok) {
      let errorMsg = 'Backend error';
      try {
        const error = await createRes.json();
        errorMsg = error.error || errorMsg;
      } catch {}
      throw new Error(errorMsg);
    }

    return await createRes.json();
  }

  // 3. Other errors
  let errorMsg = 'Backend error';
  try {
    const error = await userRes.json();
    errorMsg = error.error || errorMsg;
  } catch {}
  throw new Error(errorMsg);
}

export async function logout() {
  await supabase.auth.signOut();
}
