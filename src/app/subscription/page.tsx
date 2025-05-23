
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";

export default function SubscriptionPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-primary" />
            Subscription Management
          </CardTitle>
          <CardDescription>
            Manage your Chat AI subscription plan, view billing history, and update payment methods.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <div className="flex flex-col items-center justify-center p-10 min-h-[200px] border-2 border-dashed border-border rounded-lg bg-muted/20">
            <CreditCard className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-lg text-foreground text-center font-medium">
              Manage Your Plan
            </p>
             <p className="text-sm text-muted-foreground text-center mt-2 max-w-md">
              This is where you would view your current subscription tier (e.g., Free, Premium), upgrade or change your plan, and manage your billing details.
            </p>
             <p className="text-xs text-muted-foreground text-center mt-4">
              Full subscription management features, including integration with a payment provider, are planned for future development.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
