"use client";

import Link from "next/link";
import { CalendarDays, FileText, Settings, Users, Mail, BookOpen, Palette, FileStack } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const sections = [
  {
    label: "Events",
    description: "Create, edit, and manage events",
    href: "/admin/events",
    icon: CalendarDays,
    color: "bg-primary/10 text-primary",
  },
  {
    label: "Insights",
    description: "Manage blog posts and articles",
    href: "/admin/insights",
    icon: FileText,
    color: "bg-sage/10 text-sage",
  },
  {
    label: "Pages",
    description: "Edit page content, heroes, and sections",
    href: "/admin/pages",
    icon: FileStack,
    color: "bg-terracotta/10 text-terracotta",
  },
  {
    label: "Settings",
    description: "Site name, logo, social links",
    href: "/admin/settings",
    icon: Settings,
    color: "bg-gold/10 text-gold",
  },
  {
    label: "Members",
    description: "View join applications and submissions",
    href: "/admin/members",
    icon: Users,
    color: "bg-primary/10 text-primary",
  },
  {
    label: "Email",
    description: "Notification settings and preferences",
    href: "/admin/email",
    icon: Mail,
    color: "bg-sage/10 text-sage",
    disabled: true,
  },
  {
    label: "Resources",
    description: "Manage guides, checklists, and materials",
    href: "/admin/resources",
    icon: BookOpen,
    color: "bg-terracotta/10 text-terracotta",
    disabled: true,
  },
  {
    label: "Design System",
    description: "Colors, typography, shadows, and technical details",
    href: "/design",
    icon: Palette,
    color: "bg-primary/10 text-primary",
  },
];

export default function AdminDashboard() {
  return (
    <div className="p-6 sm:p-8 lg:p-10">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold sm:text-3xl">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">Manage your ADS platform</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => {
          if (section.disabled) {
            return (
              <div key={section.href} className="cursor-not-allowed">
                <Card className="h-full rounded-2xl border-none ring-0 shadow-warm opacity-40 pointer-events-none">
                  <CardContent className="p-6">
                    <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${section.color}`}>
                      <section.icon className="h-6 w-6" />
                    </div>
                    <h2 className="font-bold text-lg">{section.label} <span className="text-xs font-normal text-muted-foreground">(Coming Soon)</span></h2>
                    <p className="mt-1 text-sm text-muted-foreground">{section.description}</p>
                  </CardContent>
                </Card>
              </div>
            );
          }
          return (
            <Link key={section.href} href={section.href} className="group">
              <Card className="h-full rounded-2xl border-none ring-0 shadow-warm hover:shadow-warm-lg transition-all hover:-translate-y-0.5">
                <CardContent className="p-6">
                  <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${section.color}`}>
                    <section.icon className="h-6 w-6" />
                  </div>
                  <h2 className="font-bold text-lg group-hover:text-primary transition-colors">{section.label}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{section.description}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
