
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bot,
  Compass,
  FileText,
  Lightbulb,
  Linkedin,
  Twitter,
  Github,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { placeHolderImages } from "@/lib/placeholder-images";

const features = [
  {
    icon: <Bot className="h-8 w-8 text-primary" />,
    title: "AI Career Chat",
    description: "Discuss career options and get advice from our AI-powered mentor.",
  },
  {
    icon: <Lightbulb className="h-8 w-8 text-primary" />,
    title: "Personalized Suggestions",
    description:
      "Receive career recommendations based on your unique profile and skills.",
  },
  {
    icon: <Compass className="h-8 w-8 text-primary" />,
    title: "Custom Roadmaps",
    description: "Generate step-by-step guides for your chosen career path.",
  },
  {
    icon: <FileText className="h-8 w-8 text-primary" />,
    title: "Resume Support",
    description: "Get AI-driven feedback to optimize and improve your resume.",
  },
];

export default function LandingPage() {
  const heroImage = placeHolderImages.find(p => p.id === "landing-hero");
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Logo />
        <nav className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/login">Log In</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="relative w-full py-20 md:py-32 lg:py-40">
        {heroImage && 
            <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                fill
                className="object-cover"
                data-ai-hint={heroImage.imageHint}
                priority
            />
        }
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>
          <div className="container relative mx-auto px-4 text-center md:px-6">
            <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Find Your Future with Career Compass
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg text-foreground/80 md:text-xl">
              Your personal AI-powered guide to a successful and fulfilling
              career. Explore paths, build skills, and land your dream job.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/signup">Get Started for Free</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>
        <section id="features" className="w-full bg-muted/40 py-20 md:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto mb-16 max-w-3xl text-center">
              <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
                A Smarter Way to Navigate Your Career
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Career Compass provides a suite of AI tools to help you every
                step of the way.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <Card
                  key={feature.title}
                  className="transform-gpu transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl bg-card/50 backdrop-blur-sm"
                >
                  <CardHeader className="items-center">
                    {feature.icon}
                    <CardTitle className="font-headline mt-4 text-xl">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full border-t py-20 md:py-32">
          <div className="container mx-auto grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="font-headline text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Ready to Chart Your Course?
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join thousands of students and professionals who are building their future with Career Compass.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
              <Button size="lg" className="w-full" asChild>
                <Link href="/signup">Sign Up Now</Link>
              </Button>
              <p className="text-xs text-muted-foreground">
                Start for free. No credit card required.
              </p>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full bg-background border-t">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-6 md:flex-row md:px-6">
          <div className="flex items-center gap-2">
            <Logo />
            <span className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Career Compass. All rights reserved.
            </span>
          </div>
          <div className="flex gap-4">
            <Link href="#" className="text-muted-foreground hover:text-primary">
              <Twitter className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary">
              <Github className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary">
              <Linkedin className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
