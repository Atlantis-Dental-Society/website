"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CalendarDays, ChevronDown, FileText, FileStack, LayoutDashboard, LogOut, Menu, Palette, Settings, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Events", href: "/admin/events", icon: CalendarDays },
  { label: "Insights", href: "/admin/insights", icon: FileText },
  { label: "Members", href: "/admin/members", icon: Users },
  { label: "Settings", href: "/admin/settings", icon: Settings },
  { label: "Design System", href: "/design", icon: Palette },
];

interface PageItem {
  slug: string;
  title: string;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [pagesOpen, setPagesOpen] = useState(false);
  const [pages, setPages] = useState<PageItem[]>([]);

  const loadPages = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/pages");
      if (res.ok) setPages(await res.json());
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { setSheetOpen(false); }, [pathname]);

  useEffect(() => {
    loadPages();
  }, [loadPages]);

  // Auto-expand pages section when on a pages route
  useEffect(() => {
    if (pathname.startsWith("/admin/pages")) setPagesOpen(true);
  }, [pathname]);

  if (isPending) {
    return (
      <div className="flex min-h-[calc(100vh-4.5rem)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (session && session.user.role !== "admin") {
    return (
      <div className="flex min-h-[calc(100vh-4.5rem)] items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-extrabold">Access Denied</h1>
          <p className="mt-2 text-muted-foreground">You don&apos;t have permission to access the admin panel.</p>
          <Button
            variant="outline"
            className="mt-6 rounded-full"
            onClick={() => router.push("/")}
          >
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  const isOnPagesRoute = pathname.startsWith("/admin/pages");

  const sidebarContent = (
    <>
      <nav className="space-y-1 flex-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Button
              key={item.href}
              asChild
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-2.5 rounded-lg",
                isActive && "bg-primary/10 text-primary hover:bg-primary/15"
              )}
            >
              <Link href={item.href}>
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            </Button>
          );
        })}

        {/* Pages collapsible */}
        <div>
          <Button
            variant={isOnPagesRoute && !pathname.includes("/admin/pages/") ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start gap-2.5 rounded-lg",
              isOnPagesRoute && !pathname.includes("/admin/pages/") && "bg-primary/10 text-primary hover:bg-primary/15"
            )}
            onClick={() => setPagesOpen((o) => !o)}
          >
            <FileStack className="h-4 w-4" />
            Pages
            <ChevronDown className={cn("ml-auto h-4 w-4 transition-transform", pagesOpen && "rotate-180")} />
          </Button>
          {pagesOpen && (
            <div className="ml-4 mt-1 space-y-0.5 border-l border-border/40 pl-2">
              <Button
                asChild
                variant={pathname === "/admin/pages" ? "secondary" : "ghost"}
                size="sm"
                className={cn(
                  "w-full justify-start rounded-lg text-xs",
                  pathname === "/admin/pages" && "bg-primary/10 text-primary hover:bg-primary/15"
                )}
              >
                <Link href="/admin/pages">All Pages</Link>
              </Button>
              {pages.map((page) => {
                const href = `/admin/pages/${page.slug}`;
                const isActive = pathname === href;
                return (
                  <Button
                    key={page.slug}
                    asChild
                    variant={isActive ? "secondary" : "ghost"}
                    size="sm"
                    className={cn(
                      "w-full justify-start rounded-lg text-xs capitalize",
                      isActive && "bg-primary/10 text-primary hover:bg-primary/15"
                    )}
                  >
                    <Link href={href}>{page.slug}</Link>
                  </Button>
                );
              })}
            </div>
          )}
        </div>
      </nav>
      <Separator className="my-4 bg-border/30" />
      <div className="px-1">
        <p className="mb-2 truncate px-2 text-xs text-muted-foreground">
          {session?.user.email}
        </p>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2.5 rounded-lg text-muted-foreground hover:text-destructive"
          onClick={async () => {
            await authClient.signOut();
            router.push("/login");
          }}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-[calc(100vh-4.5rem)]">
      <aside className="hidden md:flex w-56 shrink-0 border-r border-border/30 bg-muted/30 p-4 flex-col">
        <div className="flex items-center gap-2 px-3 py-2 mb-2">
          <LayoutDashboard className="h-5 w-5 text-primary" />
          <span className="font-bold text-sm">Admin Panel</span>
        </div>
        <Separator className="mb-4 bg-border/30" />
        {sidebarContent}
      </aside>

      <div className="flex flex-1 flex-col">
        <div className="flex items-center gap-3 border-b border-border/30 bg-muted/30 px-4 py-3 md:hidden">
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-lg" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-4">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 text-sm">
                  <LayoutDashboard className="h-5 w-5 text-primary" />
                  Admin Panel
                </SheetTitle>
              </SheetHeader>
              <div className="mt-4 flex flex-col flex-1">
                {sidebarContent}
              </div>
            </SheetContent>
          </Sheet>
          <span className="font-bold text-sm">Admin Panel</span>
        </div>

        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
