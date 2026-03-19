import { Card, CardContent } from "@/components/ui/card";

interface ComingSoonProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function ComingSoon({ icon, title, description }: ComingSoonProps) {
  return (
    <Card className="mt-16 rounded-3xl border-none ring-0 shadow-warm">
      <CardContent className="p-12 text-center">
        {icon}
        <h2 className="mt-6 text-2xl font-bold">{title}</h2>
        <p className="mt-3 text-muted-foreground max-w-lg mx-auto">{description}</p>
      </CardContent>
    </Card>
  );
}
