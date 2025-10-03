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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { goalSettingAssistant, type GoalSettingAssistantOutput } from "@/ai/flows/goal-setting-assistant";
import { Loader2, Sparkles, Target, CheckCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";


const formSchema = z.object({
  goal: z
    .string()
    .min(10, { message: "Please describe your goal in more detail." }),
  timeframe: z.string({
    required_error: "Please select a timeframe.",
  }),
});

export default function GoalsPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GoalSettingAssistantOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { goal: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);
    try {
      const response = await goalSettingAssistant(values);
      setResult(response);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate a goal plan. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">
          Goal Setting & Tracking
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Turn your ambitions into actionable, measurable steps.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Define Your Career Goal</CardTitle>
          <CardDescription>
            Describe the career milestone you want to achieve, and the AI will help create a SMART plan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="goal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Goal</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., 'Become a Senior Software Engineer', 'Start my own freelance design business'"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="timeframe"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Desired Timeframe</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="Select a timeframe" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="3 months">3 Months</SelectItem>
                            <SelectItem value="6 months">6 Months</SelectItem>
                            <SelectItem value="1 year">1 Year</SelectItem>
                            <SelectItem value="2 years">2 Years</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading}>
                {loading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Plan...
                    </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Create SMART Plan
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
            <h2 className="text-xl font-semibold text-muted-foreground">Building your goal plan...</h2>
            <p className="text-muted-foreground">The AI is breaking down your goal into achievable steps.</p>
        </div>
      )}

      {result && !loading && (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">{result.title}</CardTitle>
                <CardDescription>
                    <strong>Your SMART Goal:</strong> {result.smartGoal}
                </CardDescription>
            </CardHeader>
            <CardContent>
                 <Accordion type="single" collapsible className="w-full">
                    {result.steps.map((step, index) => (
                         <AccordionItem value={`item-${index}`} key={index}>
                            <AccordionTrigger className="text-lg font-medium hover:no-underline">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                                        {index + 1}
                                    </div>
                                    {step.title}
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="space-y-4 pl-12 text-base text-muted-foreground">
                                <p>{step.description}</p>
                                <div className="flex items-center gap-2 rounded-md border bg-background p-3 text-sm">
                                    <Target className="h-4 w-4 flex-shrink-0 text-primary" />
                                    <span className="font-semibold text-foreground mr-2">Metric:</span>
                                    <span>{step.metric}</span>
                                </div>
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
