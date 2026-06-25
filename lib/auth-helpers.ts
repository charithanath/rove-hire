import { auth } from "@/auth";
import { redirect } from "next/navigation";

/**
 * Use in Server Components and API Route handlers to get the
 * current authenticated session. Redirects to /login if not signed in.
 *
 * Usage in a Server Component:
 *   const session = await requireAuth();
 *   const userId = session.user.id;
 */
export async function requireAuth() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }
  return session;
}

/**
 * Use in API Route handlers where you want to return 401
 * instead of redirecting (redirects don't make sense for fetch calls).
 *
 * Usage in an API route:
 *   const session = await getAuthSession();
 *   if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });
 */
export async function getAuthSession() {
  const session = await auth();
  if (!session?.user?.id) return null;
  return session;
}
