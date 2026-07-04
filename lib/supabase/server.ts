/**
 * lib/supabase/server.ts
 * ─────────────────────────────────────────────
 * Creates a Supabase client for use exclusively in
 * Next.js Server Components, Route Handlers, and
 * Server Actions — using the @supabase/ssr cookie
 * adapter so sessions persist across SSR requests.
 */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // setAll is called from a Server Component — ignore the error.
            // Middleware keeps the session fresh via its own cookie writes.
          }
        },
      },
    }
  );
}
