"use client"
import { useAuth } from "@/providers/auth-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageSquare, Lightbulb, Route, FileText, ArrowRight, Users, Target } from "lucide-react";

const features = [
    {
      href: "/dashboard/chat",
      icon: <MessageSquare className="h-8 w-8 text-primary" />,
      title: "AI Career Chat",
      description: "Discuss career options and get advice from our AI mentor.",
    },
    {
      href: "/dashboard/suggestions",
      icon: <Lightbulb className="h-8 w-8 text-primary" />,
      title: "Personalized Suggestions",
      description: "Receive career recommendations based on your profile.",
    },
    {
      href: "/dashboard/roadmaps",
      icon: <Route className="h-8 w-8 text-primary" />,
      title: "Custom Roadmaps",
      description: "Generate step-by-step guides for your chosen career path.",
    },
    {
      href: "/dashboard/resume",
      icon: <FileText className="h-8 w-8 text-primary" />,
      title: "Resume Support",
      description: "Get AI-driven feedback to optimize and improve your resume.",
    },
    {
      href: "/dashboard/networking",
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Networking Assistant",
      description: "Find professionals and get help with outreach messages.",
    },
    {
      href: "/dashboard/goals",
      icon: <Target className="h-8 w-8 text-primary" />,
      title: "Goal Setting",
      description: "Set and track SMART goals to advance your career.",
    },
  ];

export default function DashboardPage() {
    const { user } = useAuth();
    const displayName = user?.displayName?.split(" ")[0] || "there";

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div>
                <h1 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">
                    Welcome back, {displayName}!
                </h1>
                <p className="mt-2 text-lg text-muted-foreground">
                    Ready to take the next step in your career journey?
                </p>
            </div>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {features.map((feature, i) => (
                    <Card 
                        key={feature.title} 
                        className="group flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-card/80 hover:bg-card animate-fade-in-up"
                        style={{ animationDelay: `${i * 100}ms` }}
                    >
                        <CardHeader>
                            <div className="rounded-lg bg-primary/10 p-3 w-fit transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20">
                                {feature.icon}
                            </div>
                            <CardTitle className="font-headline mt-4 text-xl">{feature.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow flex flex-col justify-between">
                            <p className="text-muted-foreground">{feature.description}</p>
                            <Button variant="link" asChild className="mt-4 -ml-4 justify-start p-4 text-primary">
                                <Link href={feature.href}>
                                    Get Started
                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
