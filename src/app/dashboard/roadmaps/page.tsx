
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Route, BookOpen, Code, Briefcase } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Career Roadmaps | Career Compass",
    description: "Explore step-by-step roadmaps for your chosen career.",
};


const sampleRoadmaps = [
    {
        title: "Frontend Developer",
        icon: <Code className="h-8 w-8 text-primary" />,
        description: "Learn HTML, CSS, JavaScript, and a modern framework like React to build beautiful user interfaces."
    },
    {
        title: "Data Scientist",
        icon: <BookOpen className="h-8 w-8 text-primary" />,
        description: "Master Python, SQL, statistics, and machine learning to extract insights from data."
    },
    {
        title: "Product Manager",
        icon: <Briefcase className="h-8 w-8 text-primary" />,
        description: "Develop skills in market research, user experience, and project management to guide products to success."
    },
    {
        title: "DevOps Engineer",
        icon: <Route className="h-8 w-8 text-primary" />,
        description: "Combine software development and IT operations to shorten the systems development life cycle."
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
            <Card key={roadmap.title} className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center gap-4">
                    {roadmap.icon}
                    <div>
                        <CardTitle className="font-headline">{roadmap.title}</CardTitle>
                        <CardDescription className="mt-1">Coming Soon</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{roadmap.description}</p>
                </CardContent>
            </Card>
        ))}
      </div>
    </div>
  );
}
