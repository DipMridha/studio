
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, CreditCard, ShieldCheck, Star, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Simple SVG icons as components for placeholders
const GPayIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/><path d="M15.87 8.43A4.5 4.5 0 0 0 12 7.5a4.5 4.5 0 0 0-4.5 4.5c0 2.13 1.49 3.93 3.5 4.36V18h2v-1.64c2.01-.43 3.5-2.23 3.5-4.36a4.48 4.48 0 0 0-.63-2.57z"/><path d="M12 13.5V10.5A1.5 1.5 0 0 1 13.5 9h.03c.8.02 1.47.69 1.47 1.5v3A1.5 1.5 0 0 1 13.5 15h-.03a1.53 1.53 0 0 1-1.47-1.5z"/></svg>;
const PayPalIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0.1" strokeLinecap="round" strokeLinejoin="round"><path d="M10.4.641c-1.34 0-2.16.12-2.86.96-.62.74-1.04 2.08-1.23 3.46H3.88c-.68 0-1.06.43-1.22.86-.16.44-.17 1.34 0 1.78l.03.13c.39 1.69.96 2.98 2.36 3.88 1.66 1.07 3.46 1.24 5.44 1.24H12c.34 0 .6-.01.74-.01.27.01.53.01.78.01h.17c2.11 0 3.73-.19 5.02-1.39 1.08-1 1.59-2.47 1.37-4.04-.14-1.04-.59-1.95-1.49-2.59-.9-.64-1.93-.89-3.41-.89h-1.1c-.25-.08-.49-.16-.72-.25-.71-.25-1.31-.48-1.64-1.18-.33-.7-.26-1.34.04-2.02.3-.68.9-1.11 1.74-1.11h2.31c.48 0 .81-.11.96-.55s.08-1.02-.08-1.46a.91.91 0 0 0-.9-.78h-2.31zm8.91 6.87c.1 1.39-.3 2.6-1.2 3.45-1.11 1.04-2.62 1.23-4.63 1.23h-.16c-.26 0-.52 0-.79-.01l-.74.01H10.3c-1.77 0-3.28-.17-4.8-.98-1.33-.72-1.85-1.83-2.2-3.41l-.02-.09c-.16-.43-.15-1.28 0-1.71.15-.4.52-.8.93-.8h2.5c.13.84.38 1.57.85 2.2.64.84 1.68 1.28 2.91 1.28h.7c1.82 0 2.93-.64 2.93-2.04 0-.55-.22-1.02-.72-1.36-.5-.33-1.21-.5-2.22-.5h-.64c-.29-.14-.59-.28-.9-.44-1.09-.55-1.76-1.24-1.76-2.45 0-1.01.53-1.84 1.52-2.41.99-.57 2.3-.71 3.74-.71h.5c.63 0 1.17.04 1.63.12.1.54.12 1.19 0 1.65-.12.46-.45.59-.93.59h-.47c-.99 0-1.63.3-1.94.88-.31.58-.31 1.11-.08 1.54.23.43.7.72 1.43.94.24.07.49.14.74.22h.77c1.99 0 3.28.36 4.08 1.21.8.85 1.1 2.04.91 3.25z"/></svg>;
const UsdtIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0.1"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm-1-3.998h2v-2h-2v2zm0-3h2v-2h-2v2zm0-3h2v-2h-2v2zm0-3h2V5h-2v2.002zM8.002 9H16v2H8.002V9zm0 3H16v2H8.002v-2z"/></svg>; 

interface Plan {
  id: string;
  title: string;
  price: string;
  duration?: string;
  features: string[];
  buttonText: string;
  isCurrent?: boolean;
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
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isDialogVisible, setIsDialogVisible] = useState(false);

  const handleSubscribeClick = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsDialogVisible(true);
  };

  const handleProceedWithPayment = () => {
    setIsDialogVisible(false);
    if (selectedPlan) {
        toast({
            title: "Thank You for Your Interest!",
            description: `You selected the ${selectedPlan.title}. Actual payment gateway integration is a future feature.`,
            duration: 5000,
        });
    }
    setSelectedPlan(null);
  };

  const currentPlanId = "free_trial"; // This would typically come from user data

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
                    onClick={() => handleSubscribeClick(plan)}
                    className="w-full"
                    variant={plan.isPopular ? "default" : "outline"}
                    disabled={plan.id === currentPlanId && plan.id !== "free_trial"}
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

      {selectedPlan && (
        <AlertDialog open={isDialogVisible} onOpenChange={setIsDialogVisible}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Your Subscription</AlertDialogTitle>
              <AlertDialogDescription>
                You have selected the <strong>{selectedPlan.title}</strong> plan for <strong>{selectedPlan.price} {selectedPlan.duration || ""}</strong>.
                <br/><br/>
                Clicking "Proceed (Simulated)" would normally take you to our secure payment gateway where you could choose from options like:
              </AlertDialogDescription>
            </AlertDialogHeader>
            
            {/* Payment methods div moved here, outside AlertDialogDescription */}
            <div className="flex items-center justify-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-1"><Phone className="h-4 w-4"/> PhonePe</div>
                <div className="flex items-center gap-1"><GPayIcon /> GPay</div>
                <div className="flex items-center gap-1"><UsdtIcon /> USDT</div>
                <div className="flex items-center gap-1"><PayPalIcon /> PayPal</div>
            </div>
            <p className="text-sm text-muted-foreground text-center">
                This is a simulation. No payment will be processed.
            </p>
            
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setSelectedPlan(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleProceedWithPayment}>
                Proceed (Simulated)
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
