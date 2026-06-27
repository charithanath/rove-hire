"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  CalendarDays,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard",  href: "/dashboard",  icon: LayoutDashboard },
  { label: "Candidates", href: "/candidates", icon: Users },
  { label: "Jobs",       href: "/jobs",       icon: Briefcase },
  { label: "Interviews", href: "/interviews", icon: CalendarDays },
] as const;

interface SidebarProps {
  userName:  string;
  userEmail: string;
}

export function Sidebar({ userName, userEmail }: SidebarProps) {
  const pathname = usePathname();
  const router   = useRouter();
  const [pending, startTransition] = useTransition();

  function navigate(href: string) {
    startTransition(() => router.push(href));
  }

  return (
    <aside className="flex h-full w-[232px] shrink-0 flex-col border-r border-border bg-surface">

      {/* Brand */}
      <div className="flex h-[60px] items-center gap-3 border-b border-border px-5">
        <Image
          src="/rove-logo.jpg"
          alt="ROVE"
          width={28}
          height={28}
          className="rounded-[7px] object-contain shrink-0"
          priority
        />
        <div className="min-w-0">
          <p className="text-[14px] font-bold tracking-tight text-text-primary leading-tight">
            ROVE Hire
          </p>
          <p className="text-[11px] text-text-muted leading-tight">Recruitment</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-3" aria-label="Main navigation">
        {/* Section label */}
        <p className="px-2 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-text-disabled">
          Main
        </p>
        <ul className="flex flex-col gap-0.5" role="list">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <li key={href}>
                <button
                  onClick={() => navigate(href)}
                  className={cn(
                    "group w-full flex items-center gap-2.5 rounded-[7px] px-2.5 py-2 text-[13.5px] font-medium transition-all duration-100",
                    active
                      ? "bg-[var(--color-accent-light)] text-accent"
                      : "text-text-muted hover:bg-[var(--color-surface-hover)] hover:text-text-primary"
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon
                    className={cn(
                      "h-[16px] w-[16px] shrink-0 transition-colors",
                      active ? "text-accent" : "text-text-muted group-hover:text-text-primary"
                    )}
                    aria-hidden="true"
                  />
                  {label}
                  {pending && active && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-accent/40 animate-pulse" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User footer */}
      <div className="border-t border-border p-3">
        <div className="flex items-center gap-2.5 rounded-[7px] px-2 py-2 hover:bg-[var(--color-surface-hover)] transition-colors">
          <div
            className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-white"
            aria-hidden="true"
          >
            {getInitials(userName)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold text-text-primary leading-tight">
              {userName}
            </p>
            <p className="truncate text-[11px] text-text-muted leading-tight mt-0.5">
              {userEmail}
            </p>
          </div>
          <SignOutButton />
        </div>
      </div>
    </aside>
  );
}

function SignOutButton() {
  async function handleSignOut() {
    await signOut({ redirect: false });
    window.location.href = "/login";
  }
  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="flex h-7 w-7 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-red-50 hover:text-danger"
      title="Sign out"
      aria-label="Sign out"
    >
      <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
    </button>
  );
}

function getInitials(name: string): string {
  return name.split(" ").map((p) => p[0]).join("").toUpperCase().slice(0, 2);
}
