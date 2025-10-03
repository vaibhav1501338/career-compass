
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Route, BookOpen, Code, Briefcase, ArrowRight, PenTool, Shield, WandSparkles } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

// Since we're using hooks, we can't export metadata directly from the page.
// We can set it in the layout or keep it here for reference.
// export const metadata: Metadata = {
//     title: "Career Roadmaps | Career Compass",
//     description: "Explore step-by-step roadmaps for your chosen career.",
// };


const sampleRoadmaps = [
    {
        title: "Frontend Developer",
        slug: "frontend-developer",
        icon: <Code className="h-8 w-8 text-primary" />,
        description: "Learn to build beautiful and interactive user interfaces for the web."
    },
    {
        title: "Data Scientist",
        slug: "data-scientist",
        icon: <BookOpen className="h-8 w-8 text-primary" />,
        description: "Master skills to extract insights and build predictive models from data."
    },
    {
        title: "Product Manager",
        slug: "product-manager",
        icon: <Briefcase className="h-8 w-8 text-primary" />,
        description: "Guide products from concept to launch by connecting user needs with business goals."
    },
    {
        title: "DevOps Engineer",
        slug: "devops-engineer",
        icon: <Route className="h-8 w-8 text-primary" />,
        description: "Bridge development and operations to build and maintain scalable infrastructure."
    },
    {
        title: "UX/UI Designer",
        slug: "ux-ui-designer",
        icon: <PenTool className="h-8 w-8 text-primary" />,
        description: "Create user-centered designs that are both intuitive and visually appealing."
    },
    {
        title: "Cybersecurity Analyst",
        slug: "cybersecurity-analyst",
        icon: <Shield className="h-8 w-8 text-primary" />,
        description: "Protect organizational data and systems from cyber threats and attacks."
    }
];

export default function RoadmapsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [customCareer, setCustomCareer] = useState("");

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCareer.trim()) {
        toast({
            variant: "destructive",
            title: "Career title is required",
            description: "Please enter a career title to generate a roadmap.",
        })
      return;
    }
    const slug = customCareer.trim().toLowerCase().replace(/\s+/g, '-');
    router.push(`/dashboard/roadmaps/${slug}`);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">
          Career Roadmaps
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Step-by-step guides to help you navigate your chosen career path.
        </p>
      </div>

       <Card className="transition-shadow duration-300 hover:shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-4">
            <WandSparkles className="h-8 w-8 text-primary" />
            <CardTitle className="font-headline text-xl">Create Your Own Roadmap</CardTitle>
          </div>
          <CardDescription>
            Don't see your desired career? Enter one below to generate a custom roadmap with AI.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCustomSubmit} className="flex flex-col gap-4 sm:flex-row">
            <Input 
              placeholder="e.g., 'Blockchain Developer' or 'AI Ethicist'"
              value={customCareer}
              onChange={(e) => setCustomCareer(e.target.value)}
              className="flex-grow"
            />
            <Button type="submit" className="w-full sm:w-auto">
              Generate Custom Roadmap
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sampleRoadmaps.map(roadmap => (
            <Card key={roadmap.title} className="flex flex-col transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
                <CardHeader className="flex flex-row items-start gap-4">
                    {roadmap.icon}
                    <div className="flex-grow">
                        <CardTitle className="font-headline text-xl">{roadmap.title}</CardTitle>
                        <CardDescription className="mt-1">{roadmap.description}</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="flex-grow flex items-end">
                    <Button variant="outline" asChild className="mt-4 w-fit">
                        <Link href={`/dashboard/roadmaps/${roadmap.slug}`}>
                            View Roadmap
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        ))}
      </div>
    </div>
  );
}
