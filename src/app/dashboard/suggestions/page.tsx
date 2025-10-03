
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { personalizedCareerSuggestions } from "@/ai/flows/personalized-career-suggestions";
import { refineDescription } from "@/ai/flows/refine-profile-description";
import { Lightbulb, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";

const formSchema = z.object({
  profile: z
    .string()
    .min(10, { message: "Please tell us a bit more about yourself." }),
});

export default function SuggestionsPage() {
  const [loading, setLoading] = useState(false);
  const [refining, setRefining] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { profile: "" },
  });

  const profileValue = form.watch("profile");

  async function handleRefine() {
    const currentProfile = form.getValues("profile");
    if (!currentProfile.trim()) {
      toast({
        variant: "destructive",
        title: "Description is empty",
        description: "Please write something about yourself before refining.",
      });
      return;
    }

    setRefining(true);
    try {
      const result = await refineDescription({ description: currentProfile });
      if (result.refinedDescription) {
        form.setValue("profile", result.refinedDescription);
        toast({
            title: "Description Refined",
            description: "Your profile description has been enhanced by AI.",
        });
      } else {
        throw new Error("AI did not provide a refined description.");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Refinement Failed",
        description: "Could not refine the description. Please try again.",
      });
    } finally {
      setRefining(false);
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setSuggestions([]);
    try {
      const result = await personalizedCareerSuggestions({
        profile: values.profile,
      });
      if (result.careerSuggestions && result.careerSuggestions.length > 0) {
        setSuggestions(result.careerSuggestions);
      } else {
        toast({
          title: "No suggestions found",
          description: "Try describing your interests and skills differently.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "Failed to get career suggestions. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">
          Personalized Career Suggestions
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Let our AI find career paths that match your passion and skills.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="profile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interests, Skills, and background</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'I love building web applications with React and Node.js. I'm also interested in data science and machine learning. I have a background in computer science and enjoy solving complex problems.'"
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Describe your interests, skills, education, and what you enjoy doing. The more detail, the better!
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-wrap gap-2">
                <Button type="submit" disabled={loading || refining}>
                  {loading ? (
                      <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                      </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Get Suggestions
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={handleRefine} disabled={loading || refining || !profileValue.trim()}>
                   {refining ? (
                      <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Refining...
                      </>
                  ) : (
                    <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Refine with AI
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      {suggestions.length > 0 && (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">AI-Powered Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {suggestions.map((suggestion, index) => (
                        <li key={index} className="flex flex-col items-start gap-4 p-4 rounded-lg border bg-card/80 hover:bg-card hover:shadow-lg transition-all">
                            <div className="flex items-center gap-3">
                                <Lightbulb className="h-6 w-6 text-primary flex-shrink-0" />
                                <h3 className="font-semibold text-foreground">{suggestion}</h3>
                            </div>
                            <Button asChild variant="link" size="sm" className="-ml-4">
                                <Link href={`/dashboard/roadmaps/${suggestion.toLowerCase().replace(/\s+/g, '-')}`}>View Roadmap</Link>
                            </Button>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
