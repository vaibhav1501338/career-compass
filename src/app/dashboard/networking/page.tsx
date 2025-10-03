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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { networkingAssistant, type NetworkingAssistantOutput } from "@/ai/flows/networking-assistant";
import { Loader2, Sparkles, Clipboard, Check, Users, Linkedin } from "lucide-react";
import { copyToClipboard } from "@/lib/copy-to-clipboard";

const formSchema = z.object({
  field: z
    .string()
    .min(2, { message: "Please enter a field of interest." }),
  goal: z
    .string()
    .min(10, { message: "Please describe your networking goal." }),
});

export default function NetworkingPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<NetworkingAssistantOutput | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { field: "", goal: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);
    try {
      const response = await networkingAssistant(values);
      setResult(response);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get networking suggestions. Please try again.",
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
          Networking Assistant
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Find the right people and craft the perfect outreach message.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Find Connections</CardTitle>
          <CardDescription>
            Tell us about your career field and what you hope to achieve.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="field"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Field of Interest</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., 'Cybersecurity', 'UX Design', 'Quantum Computing'"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="goal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Networking Goal</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'I want to find a mentor', 'I want to learn more about the day-to-day of a Product Manager role', 'I'm looking for an internship'"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                     <FormDescription>
                        What do you want to accomplish with your networking?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading}>
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
            </form>
          </Form>
        </CardContent>
      </Card>
      {result && (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2">
                        <Users />
                        Who to Connect With
                    </CardTitle>
                    <CardDescription>
                        Search for these roles on LinkedIn or other professional networks.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {result.professionalTitles.map((title, index) => (
                            <div key={index} className="flex items-center gap-2 rounded-full border bg-secondary/50 px-3 py-1 text-sm font-medium text-secondary-foreground">
                                {title}
                            </div>
                        ))}
                    </div>
                     <Button asChild variant="secondary" className="mt-4">
                        <a href="https://www.linkedin.com/search/results/people/" target="_blank" rel="noopener noreferrer">
                            <Linkedin className="mr-2 h-4 w-4" />
                            Search on LinkedIn
                        </a>
                    </Button>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Connection Message Template</CardTitle>
                    <CardDescription>
                        Use this template as a starting point. Be sure to personalize it!
                    </CardDescription>
                </CardHeader>
                <CardContent className="relative">
                    <div className="prose prose-sm max-w-none rounded-md border bg-muted/30 p-4 text-foreground dark:prose-invert">
                        <p className="whitespace-pre-wrap">{result.connectionMessage}</p>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-8 top-8 h-8 w-8"
                        onClick={() => handleCopy(result.connectionMessage)}
                    >
                        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Clipboard className="h-4 w-4" />}
                    </Button>
                </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}
