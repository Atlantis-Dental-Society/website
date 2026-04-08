"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, FileText, ChevronLeft, ChevronRight, ShieldCheck, ShieldOff } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";

type Tab = "applications" | "users";

interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

interface Application {
  id: string;
  name: string;
  email: string;
  major: string | null;
  year: string | null;
  school: string | null;
  interestInDentistry: string | null;
  whyDentistry: string | null;
  submittedAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string | null;
  emailVerified: boolean;
  createdAt: string;
}

const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: "applications", label: "Applications", icon: FileText },
  { key: "users", label: "Registered Users", icon: Users },
];

export default function AdminMembersPage() {
  const { data: session } = authClient.useSession();
  const [tab, setTab] = useState<Tab>("applications");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<PaginatedResponse<Application | User>>({
    data: [],
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0,
  });

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/members?tab=${tab}&page=${page}`);
    if (res.ok) setResult(await res.json());
    setLoading(false);
  }, [tab, page]);

  useEffect(() => { load(); }, [load]);

  const toggleRole = async (userId: string, currentRole: string | null) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    const res = await fetch(`/api/admin/members/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });
    if (res.ok) {
      toast.success(`Role changed to ${newRole}`);
      load();
    } else {
      toast.error("Failed to update role");
    }
  };

  const switchTab = (t: Tab) => {
    setTab(t);
    setPage(1);
  };

  return (
    <div className="p-6 sm:p-8 lg:p-10">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold sm:text-3xl">Members</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {result.total} {tab === "applications" ? "applications" : "users"} total
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map((t) => (
          <Button
            key={t.key}
            variant={tab === t.key ? "secondary" : "ghost"}
            className={cn(
              "rounded-full gap-2",
              tab === t.key && "bg-primary/10 text-primary hover:bg-primary/15"
            )}
            onClick={() => switchTab(t.key)}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
          </Button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : result.data.length === 0 ? (
        <Card className="rounded-2xl border-none ring-0 shadow-warm">
          <CardContent className="p-8 text-center text-muted-foreground">
            No {tab === "applications" ? "applications" : "users"} yet.
          </CardContent>
        </Card>
      ) : tab === "applications" ? (
        <div className="space-y-3">
          {(result.data as Application[]).map((app) => (
            <Card key={app.id} className="rounded-2xl border-none ring-0 shadow-warm">
              <CardContent className="p-5 sm:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-base">{app.name}</h3>
                      {app.year && <Badge variant="secondary" className="rounded-full text-xs">{app.year}</Badge>}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{app.email}</p>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      {app.school && <span>{app.school}</span>}
                      {app.major && <span>{app.major}</span>}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(app.submittedAt).toLocaleDateString("en", { dateStyle: "medium" })}
                  </span>
                </div>
                {(app.interestInDentistry || app.whyDentistry) && (
                  <div className="mt-4 space-y-2 text-sm text-muted-foreground border-t border-border/30 pt-4">
                    {app.interestInDentistry && (
                      <div>
                        <span className="font-medium text-foreground">Interest: </span>
                        {app.interestInDentistry}
                      </div>
                    )}
                    {app.whyDentistry && (
                      <div>
                        <span className="font-medium text-foreground">Why dentistry: </span>
                        {app.whyDentistry}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {(result.data as User[]).map((u) => (
            <Card key={u.id} className="rounded-2xl border-none ring-0 shadow-warm">
              <CardContent className="p-5 sm:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-base">{u.name}</h3>
                      <Badge className={cn("rounded-full text-xs", u.role === "admin" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground")}>
                        {u.role === "admin" ? "Admin" : "User"}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{u.email}</p>
                    {u.phone && <p className="mt-0.5 text-xs text-muted-foreground">{u.phone}</p>}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      Joined {new Date(u.createdAt).toLocaleDateString("en", { dateStyle: "medium" })}
                    </span>
                    {session?.user.id !== u.id && (
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          "rounded-full gap-1.5 text-xs",
                          u.role === "admin"
                            ? "text-destructive hover:bg-destructive/10 hover:text-destructive"
                            : "text-primary hover:bg-primary/10 hover:text-primary"
                        )}
                        onClick={() => toggleRole(u.id, u.role)}
                      >
                        {u.role === "admin" ? (
                          <><ShieldOff className="h-3.5 w-3.5" /> Remove Admin</>
                        ) : (
                          <><ShieldCheck className="h-3.5 w-3.5" /> Make Admin</>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {result.totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground px-3">
            Page {page} of {result.totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            disabled={page >= result.totalPages}
            onClick={() => setPage(page + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
