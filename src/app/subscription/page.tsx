
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, CreditCard, ShieldCheck, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Plan {
  id: string;
  title: string;
  price: string;
  duration?: string;
  features: string[];
  buttonText: string;
  isCurrent?: boolean; // To highlight a current plan (hypothetical)
  isPopular?: boolean;
}

const subscriptionPlans: Plan[] = [
  {
    id: "free_trial",
    title: "7 Days Free Trial",
    price: "Free",
    duration: "for 7 days",
    features: [
      "Access to 2 starter companions",
      "Limited daily messages",
      "Basic personality customization",
    ],
    buttonText: "Start Free Trial",
    isPopular: true,
  },
  {
    id: "monthly",
    title: "Monthly Premium",
    price: "₹99",
    duration: "/ month",
    features: [
      "Access all AI Companions",
      "Unlimited messages",
      "Advanced personality customization",
      "Unlock all Story Mode chapters",
      "Priority support",
    ],
    buttonText: "Subscribe Now",
  },
  {
    id: "half_yearly",
    title: "6 Months Premium",
    price: "₹399",
    duration: "/ 6 months",
    features: [
      "All Monthly Premium features",
      "Save 33% (vs. monthly)",
      "Early access to new features",
    ],
    buttonText: "Subscribe Now",
    isPopular: true,
  },
  {
    id: "yearly",
    title: "1 Year Premium",
    price: "₹499",
    duration: "/ year",
    features: [
      "All Monthly Premium features",
      "Save over 58% (vs. monthly)",
      "Exclusive avatar items (future)",
    ],
    buttonText: "Subscribe Now",
  },
  {
    id: "tri_yearly",
    title: "3 Years Premium",
    price: "₹999",
    duration: "/ 3 years",
    features: [
      "All Monthly Premium features",
      "Best Value - Save over 72% (vs. monthly)",
      "Lifetime access to current premium features",
      "Special 'Founder' badge (future)",
    ],
    buttonText: "Subscribe Now",
  },
];

export default function SubscriptionPage() {
  const { toast } = useToast();

  const handleSubscribe = (planTitle: string) => {
    toast({
      title: "Subscription Action",
      description: `You clicked to subscribe to ${planTitle}. Payment integration is a future feature.`,
    });
    // In a real app, this would trigger a payment flow.
  };

  // Hypothetical current plan - in a real app, this would come from user data
  const currentPlanId = "free_trial"; 

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader className="text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <CreditCard className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="text-2xl md:text-3xl">Manage Your Subscription</CardTitle>
              <CardDescription className="mt-1">
                Choose the plan that's right for you and unlock the full Chat AI experience.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Card className="bg-muted/30 border-primary/50 shadow-md">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <ShieldCheck className="h-6 w-6 text-green-500" />
                Your Current Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const current = subscriptionPlans.find(p => p.id === currentPlanId);
                if (current) {
                  return (
                    <div>
                      <p className="text-lg font-semibold text-primary">{current.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {current.id === "free_trial" ? "Enjoy basic access." : "You have access to premium features."}
                      </p>
                    </div>
                  );
                }
                return <p className="text-muted-foreground">You are currently on the Free Plan.</p>;
              })()}
            </CardContent>
          </Card>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-foreground">Upgrade to Premium</h2>
            <p className="text-muted-foreground">Get more features and an enhanced experience.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subscriptionPlans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`flex flex-col justify-between shadow-md hover:shadow-xl transition-shadow duration-300 ${plan.isPopular ? 'border-2 border-primary ring-2 ring-primary/30' : 'border'}`}
              >
                <CardHeader className="pb-4">
                  {plan.isPopular && (
                    <div className="text-xs text-primary font-semibold mb-1 uppercase flex items-center justify-center gap-1">
                      <Star className="h-4 w-4 fill-primary text-primary"/> Popular Choice
                    </div>
                  )}
                  <CardTitle className="text-xl text-center font-bold">{plan.title}</CardTitle>
                  <CardDescription className="text-center text-2xl font-semibold text-primary mt-2">
                    {plan.price}
                    {plan.duration && <span className="text-sm font-normal text-muted-foreground ml-1">{plan.duration}</span>}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-2">
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="mt-auto pt-4">
                  <Button 
                    onClick={() => handleSubscribe(plan.title)} 
                    className="w-full"
                    variant={plan.isPopular ? "default" : "outline"}
                    disabled={plan.id === currentPlanId && plan.id !== "free_trial"} // Disable if it's the current non-trial plan
                  >
                    {plan.id === currentPlanId && plan.id !== "free_trial" ? "Current Plan" : plan.buttonText}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
        <CardFooter>
           <p className="text-xs text-muted-foreground text-center w-full">
            Prices are illustrative. Actual subscription management and payment processing are future features.
            By subscribing, you agree to our hypothetical Terms of Service and Privacy Policy.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

    