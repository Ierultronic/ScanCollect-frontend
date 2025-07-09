"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [sessionChecked, setSessionChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    let sentAuth = false;
    // Helper to check session with a short delay (for OAuth)
    const checkSession = async () => {
      // Wait a bit to allow Supabase to update session after OAuth
      await new Promise((res) => setTimeout(res, 300));
      const { data: { session } } = await supabase.auth.getSession();
      if (!session && mounted) {
        router.replace("/login");
      } else if (mounted) {
        setLoading(false);
        setSessionChecked(true);
        // Send JWT to backend /api/authenticate if not already sent
        if (session && !sentAuth) {
          sentAuth = true;
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/authenticate`, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${session.access_token}`,
              "Content-Type": "application/json"
            }
          }).catch((err) => {
            // Optionally handle error
            console.error("Failed to authenticate with backend:", err);
          });
        }
      }
    };
    checkSession();
    // Listen for auth state changes (e.g., after OAuth login)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setLoading(false);
        setSessionChecked(true);
        // Send JWT to backend /api/authenticate if not already sent
        if (session && !sentAuth) {
          sentAuth = true;
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/authenticate`, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${session.access_token}`,
              "Content-Type": "application/json"
            }
          }).catch((err) => {
            // Optionally handle error
            console.error("Failed to authenticate with backend:", err);
          });
        }
      }
    });
    return () => {
      mounted = false;
      listener?.subscription?.unsubscribe();
    };
  }, [router]);

  if (loading && !sessionChecked) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  return <>{children}</>;
} 