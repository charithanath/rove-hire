import { requireAuth } from "@/lib/auth-helpers";
import { Sidebar } from "@/components/layout/sidebar";

/**
 * Authenticated HR shell layout.
 *
 * - requireAuth() validates the session server-side and redirects to /login
 *   if absent. All child routes inherit this protection automatically.
 * - Session user name/email are passed to Sidebar as props so the component
 *   never needs to call auth() itself (keeps it a pure client component).
 */
export default async function HRLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAuth();

  return (
    <div className="flex h-screen overflow-hidden bg-bg">
      <Sidebar
        userName={session.user.name ?? "HR User"}
        userEmail={session.user.email ?? ""}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
