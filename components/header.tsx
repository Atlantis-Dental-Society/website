"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, LogIn, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { ThemeToggle } from "./theme-toggle";
import { authClient } from "@/lib/auth-client";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Events", href: "/events" },
  { label: "Services", href: "/services" },
  { label: "Resources", href: "/resources" },
  { label: "Insights", href: "/insights" },
  { label: "Partner With Us", href: "/partner" },
  { label: "Join", href: "/join" },
  { label: "Contact", href: "/contact" },
];

export function Header({ logo }: { logo?: string }) {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  return (
    <header className="sticky top-0 z-50 border-b border-border/30 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image src={logo || "/logo.png"} alt="ADS" width={36} height={36} className="h-9 w-9" />
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-foreground leading-tight">ADS</span>
            <span className="hidden text-[10px] font-medium uppercase tracking-widest text-muted-foreground sm:block leading-tight">
              Atlantis Dental Society
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          {!session ? (
            <Button asChild variant="ghost" size="icon" className="rounded-2xl bg-primary/10 text-primary hover:bg-primary/20" aria-label="Login">
              <Link href="/login">
                <LogIn className="h-5 w-5" />
              </Link>
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-ring" style={{ backgroundColor: getAvatarColor(session.user.name) }}>
                  {getInitials(session.user.name)}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-xl">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium truncate">{session.user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
                </div>
                <DropdownMenuSeparator />
                {session.user.role === "admin" && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}
                {session.user.role === "admin" && <DropdownMenuSeparator />}
                <DropdownMenuItem
                  variant="destructive"
                  onClick={async () => {
                    await authClient.signOut();
                    router.push("/login");
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-2xl lg:hidden"
                aria-label="Toggle menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Image src={logo || "/logo.png"} alt="ADS" width={32} height={32} className="h-8 w-8" />
                  ADS
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4">
                {navLinks.map((link) => (
                  <SheetClose key={link.href} asChild>
                    <Link
                      href={link.href}
                      className="rounded-2xl px-4 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
                <div className="my-2 h-px bg-border/30" />
                {!session ? (
                  <SheetClose asChild>
                    <Link href="/login" className="rounded-2xl px-4 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary">
                      Login
                    </Link>
                  </SheetClose>
                ) : (
                  <>
                    {session.user.role === "admin" && (
                      <SheetClose asChild>
                        <Link href="/admin" className="rounded-2xl px-4 py-2.5 text-sm font-medium text-primary transition-all hover:bg-primary/10">
                          Dashboard
                        </Link>
                      </SheetClose>
                    )}
                    <SheetClose asChild>
                      <button
                        className="rounded-2xl px-4 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive text-left"
                        onClick={async () => {
                          await authClient.signOut();
                          router.push("/login");
                        }}
                      >
                        Sign Out
                      </button>
                    </SheetClose>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

const avatarColors = [
  "#D4AF37", "#7B916F", "#C4856A", "#8B7355", "#6B8E9B",
  "#9B6B8E", "#6B9B7A", "#B07D4B", "#7A6B9B", "#9B7A6B",
];

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return avatarColors[Math.abs(hash) % avatarColors.length];
}
