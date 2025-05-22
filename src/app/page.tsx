
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, UserCog, Sparkles, Settings, CalendarCheck, BookOpen, Moon } from 'lucide-react'; // Added Moon

export default function HomePage() {
  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <Card className="shadow-lg overflow-hidden">
        <CardHeader className="text-center bg-card p-6 md:p-10">
          <div className="flex justify-center mb-4">
            <Image src="https://placehold.co/64x64.png" alt="Chat AI Logo" width={64} height={64} data-ai-hint="pink candy" className="rounded-md animate-pulse" />
          </div>
          <CardTitle className="text-3xl md:text-4xl font-bold">Welcome to Chat AI</CardTitle>
          <CardDescription className="text-lg text-muted-foreground mt-2">
            Your personal AI companion awaits. Explore the features below to get started and connect with Chat AI.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <p className="text-center text-muted-foreground mb-8 md:mb-10 text-base">
            Begin your journey with Chat AI.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              href="/chat"
              icon={<MessageCircle className="h-8 w-8 text-primary" />}
              title="Start"
              description="Engage in dynamic conversations with your AI companion. Choose a persona and language."
            />
            <FeatureCard
              href="/gallery"
              icon={<Sparkles className="h-8 w-8 text-primary" />}
              title="AI Generator"
              description="Generate unique images of your companion in various styles and scenes."
            />
            <FeatureCard
              href="/companion"
              icon={<UserCog className="h-8 w-8 text-primary" />}
              title="Companion"
              description="Personalize your AI companion's appearance and traits."
            />
            <FeatureCard
              href="/reminders"
              icon={<CalendarCheck className="h-8 w-8 text-primary" />}
              title="Reminders"
              description="Simulated daily calls, check-ins, and reminders. (Coming Soon)"
            />
            <FeatureCard
              href="/story"
              icon={<BookOpen className="h-8 w-8 text-primary" />}
              title="Story Mode"
              description="Engage in interactive story chapters where your choices influence relationship growth."
            />
            <FeatureCard
              href="/dream"
              icon={<Moon className="h-8 w-8 text-primary" />}
              title="Dream Mode"
              description="Enter a special night-time mood for dream-sharing and soft conversations."
            />
            <FeatureCard
              href="/settings"
              icon={<Settings className="h-8 w-8 text-primary" />}
              title="Settings"
              description="Configure your app preferences and account details. (Coming Soon)"
            />
          </div>
        </CardContent>
        <CardContent className="p-6 md:p-8 border-t text-center">
           <Link href="/chat" passHref>
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-shadow">
                <Sparkles className="mr-2 h-5 w-5" />
                Let's Chat Now!
              </Button>
            </Link>
        </CardContent>
      </Card>
    </div>
  );
}

interface FeatureCardProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ href, icon, title, description }: FeatureCardProps) {
  return (
    <Link href={href} passHref>
      <Card className="h-full hover:shadow-xl transition-shadow duration-300 cursor-pointer flex flex-col bg-card hover:border-primary/50">
        <CardHeader className="flex flex-row items-center gap-4 pb-2 pt-5 px-5">
          <div className="p-3 bg-primary/10 rounded-full">
            {icon}
          </div>
          <CardTitle className="text-xl font-semibold">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow px-5 pb-5">
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
