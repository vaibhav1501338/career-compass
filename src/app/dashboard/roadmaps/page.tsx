
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Route, BookOpen, Code, Briefcase, ArrowRight } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Career Roadmaps | Career Compass",
    description: "Explore step-by-step roadmaps for your chosen career.",
};


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
    }
];

export default function RoadmapsPage() {
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

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {sampleRoadmaps.map(roadmap => (
            <Card key={roadmap.title} className="flex flex-col transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
                <CardHeader className="flex flex-row items-start gap-4">
                    {roadmap.icon}
                    <CardTitle className="font-headline text-xl">{roadmap.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-between">
                    <p className="text-muted-foreground">{roadmap.description}</p>
                    <Button variant="outline" asChild className="mt-4 w-fit">
                        <Link href={`/dashboard/roadmaps/${roadmap.slug}`}>
                            Generate Roadmap
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
