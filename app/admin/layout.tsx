"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, FileText, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Events", href: "/admin/events", icon: CalendarDays },
  { label: "Insights", href: "/admin/insights", icon: FileText },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-[calc(100vh-4.5rem)]">
      <aside className="w-56 shrink-0 border-r border-border/30 bg-muted/30 p-4">
        <div className="flex items-center gap-2 px-3 py-2 mb-2">
          <LayoutDashboard className="h-5 w-5 text-primary" />
          <span className="font-bold text-sm">Admin Panel</span>
        </div>
        <Separator className="mb-4 bg-border/30" />
        <nav className="space-y-1">
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
        </nav>
      </aside>
      <div className="flex-1">{children}</div>
    </div>
  );
}
