"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  CalendarDays,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────
// Nav items
// ─────────────────────────────────────────────

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Jobs",
    href: "/jobs",
    icon: Briefcase,
  },
  {
    label: "Candidates",
    href: "/candidates",
    icon: Users,
  },
  {
    label: "Interviews",
    href: "/interviews",
    icon: CalendarDays,
  },
] as const;

// ─────────────────────────────────────────────
// Sidebar
// ─────────────────────────────────────────────

interface SidebarProps {
  userName: string;
  userEmail: string;
}

export function Sidebar({ userName, userEmail }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-56 flex-col border-r border-border bg-surface">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2.5 px-4 border-b border-border">
        <RoveLogo />
        <span className="text-sm font-semibold tracking-tight text-text-primary">
          ROVE Hire
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-3" aria-label="Main navigation">
        <ul className="flex flex-col gap-0.5" role="list">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-accent/10 text-accent font-medium"
                      : "text-text-muted hover:bg-[var(--color-surface-hover)] hover:text-text-primary"
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User footer */}
      <div className="border-t border-border p-3">
        <div className="flex items-center gap-2.5 rounded-md px-2 py-2">
          {/* Avatar */}
          <div
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/20 text-xs font-semibold text-accent"
            aria-hidden="true"
          >
            {getInitials(userName)}
          </div>
          {/* Info */}
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-text-primary">
              {userName}
            </p>
            <p className="truncate text-xs text-text-muted">{userEmail}</p>
          </div>
          {/* Sign out */}
          <SignOutButton />
        </div>
      </div>
    </aside>
  );
}

// ─────────────────────────────────────────────
// Sign-out button
// Auth.js v5 requires signOut() from next-auth/react on the client.
// Plain form POST to /api/auth/signout is Auth.js v4 only.
// ─────────────────────────────────────────────

function SignOutButton() {
  async function handleSignOut() {
    await signOut({ redirectTo: "/login" });
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="flex h-7 w-7 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-[var(--color-surface-hover)] hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      title="Sign out"
      aria-label="Sign out"
    >
      <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
    </button>
  );
}

// ─────────────────────────────────────────────
// ROVE logo mark — inline SVG, no external file needed
// ─────────────────────────────────────────────

function RoveLogo() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="24" height="24" rx="6" fill="var(--color-accent)" />
      <path
        d="M7 7h4.5a3 3 0 0 1 0 6H7V7Z"
        fill="white"
        fillOpacity="0.9"
      />
      <path
        d="M11.5 13 15 17h-2.5L9 13"
        fill="white"
        fillOpacity="0.9"
      />
    </svg>
  );
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
