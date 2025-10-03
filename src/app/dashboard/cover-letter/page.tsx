
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { generateCoverLetter, type GenerateCoverLetterOutput } from "@/ai/flows/generate-cover-letter";
import { Loader2, Sparkles, Clipboard, Check, Mail } from "lucide-react";
import { copyToClipboard } from "@/lib/copy-to-clipboard";

const formSchema = z.object({
    jobTitle: z.string().min(2, "Please enter a job title."),
    companyName: z.string().min(2, "Please enter a company name."),
    jobDescription: z.string().min(20, "Please provide a more detailed job description."),
    userSkills: z.string().min(20, "Please provide more details about your skills and experience."),
});

export default function CoverLetterPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateCoverLetterOutput | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        jobTitle: "",
        companyName: "",
        jobDescription: "",
        userSkills: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);
    try {
      const response = await generateCoverLetter(values);
      setResult(response);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate cover letter. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  const handleCopy = (text: string) => {
    copyToClipboard(text);
    setCopied(true);
    toast({ title: "Copied to clipboard!" });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">
          AI Cover Letter Builder
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Create a compelling cover letter tailored to your dream job.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Job & Profile Details</CardTitle>
          <CardDescription>
            Provide the job details and your relevant skills to generate a personalized cover letter.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="jobTitle"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Job Title</FormLabel>
                            <FormControl>
                            <Input
                                placeholder="e.g., 'Software Engineer'"
                                {...field}
                            />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="companyName"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Company Name</FormLabel>
                            <FormControl>
                            <Input
                                placeholder="e.g., 'Acme Inc.'"
                                {...field}
                            />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>
              <FormField
                control={form.control}
                name="jobDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste the job description here..."
                        rows={6}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="userSkills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Skills & Experience</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your skills, projects, and experiences that are relevant to this job..."
                        rows={6}
                        {...field}
                      />
                    </FormControl>
                     <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading}>
                {loading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Letter...
                    </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Cover Letter
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {loading && (
        <div className="flex flex-col items-center justify-center pt-20 gap-4 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <h2 className="text-xl font-semibold text-muted-foreground">Writing your cover letter...</h2>
            <p className="text-muted-foreground">The AI is crafting a letter just for you.</p>
        </div>
      )}

      {result && !loading && (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <Mail />
                    Your Generated Cover Letter
                </CardTitle>
                <CardDescription>
                    Review the letter below. You can copy it and customize it further.
                </CardDescription>
            </CardHeader>
            <CardContent className="relative">
                 <div className="prose prose-sm max-w-none rounded-md border bg-muted/30 p-4 text-foreground dark:prose-invert">
                    <p className="whitespace-pre-wrap">{result.coverLetter}</p>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-8 top-8 h-8 w-8"
                    onClick={() => handleCopy(result.coverLetter)}
                >
                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Clipboard className="h-4 w-4" />}
                </Button>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
