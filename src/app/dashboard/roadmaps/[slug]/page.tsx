
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { generateCareerRoadmap, type GenerateCareerRoadmapOutput } from '@/ai/flows/generate-career-roadmap';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function RoadmapDetailsPage() {
  const params = useParams();
  const [roadmap, setRoadmap] = useState<GenerateCareerRoadmapOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [careerTitle, setCareerTitle] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const slug = params.slug;
    if (slug && typeof slug === 'string') {
      const title = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      setCareerTitle(title);
    }
  }, [params.slug]);

  useEffect(() => {
    if (!careerTitle) return;

    const fetchRoadmap = async () => {
      setLoading(true);
      try {
        const result = await generateCareerRoadmap({ career: careerTitle });
        setRoadmap(result);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Generation Failed",
          description: "Could not generate the career roadmap. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmap();
  }, [careerTitle, toast]);
  
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/roadmaps">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
            <h1 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">
            {careerTitle ? `${careerTitle} Roadmap` : 'Roadmap'}
            </h1>
            <p className="mt-1 text-lg text-muted-foreground">
            Your personalized step-by-step guide.
            </p>
        </div>
      </div>
      
      {loading && (
        <div className="flex flex-col items-center justify-center pt-20 gap-4 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <h2 className="text-xl font-semibold text-muted-foreground">Generating your roadmap...</h2>
            <p className="text-muted-foreground">This may take a moment. The AI is crafting your personalized path.</p>
        </div>
      )}

      {roadmap && !loading && (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">{roadmap.title}</CardTitle>
                <CardDescription>{roadmap.description}</CardDescription>
            </CardHeader>
            <CardContent>
                 <Accordion type="single" collapsible className="w-full">
                    {roadmap.steps.map((step, index) => (
                         <AccordionItem value={`item-${index}`} key={index}>
                            <AccordionTrigger className="text-lg font-medium hover:no-underline">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                                        {index + 1}
                                    </div>
                                    {step.title}
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="text-base text-muted-foreground pl-12 prose prose-sm max-w-none dark:prose-invert">
                                <div dangerouslySetInnerHTML={{ __html: step.description.replace(/\n/g, '<br />') }} />
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                 </Accordion>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
