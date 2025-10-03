'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing AI-powered feedback and suggestions for resume improvement.
 *
 * It includes the following:
 * - `tuneResume` -  A function that accepts a resume as a data URI and returns feedback and suggestions for improvement.
 * - `TuneResumeInput` - The input type for the `tuneResume` function.
 * - `TuneResumeOutput` - The output type for the `tuneResume` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TuneResumeInputSchema = z.object({
  resumeDataUri: z
    .string()
    .describe(
      "The resume content as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'." // Corrected the expected format
    ),
});
export type TuneResumeInput = z.infer<typeof TuneResumeInputSchema>;

const TuneResumeOutputSchema = z.object({
  feedback: z.string().describe('AI-powered feedback and suggestions for resume improvement.'),
  isFixable: z.boolean().describe('Whether the resume content is parsable and can be corrected by the AI.'),
});
export type TuneResumeOutput = z.infer<typeof TuneResumeOutputSchema>;

export async function tuneResume(input: TuneResumeInput): Promise<TuneResumeOutput> {
  return tuneResumeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'tuneResumePrompt',
  input: {schema: TuneResumeInputSchema},
  output: {schema: TuneResumeOutputSchema},
  prompt: `You are a career advisor specializing in resume optimization. A student will provide their resume.
  
  Your tasks are:
  1. Give targeted feedback and actionable steps the student can take to improve their resume and increase their chances of securing internships or job opportunities.
  2. Determine if the provided document is a resume with text content that can be parsed and corrected. If the content is readable and structured like a resume (even a poorly formatted one), set 'isFixable' to true. If it is not a resume, is unreadable, or an image-only document, set 'isFixable' to false.

  Resume: {{media url=resumeDataUri}}`,
});

const tuneResumeFlow = ai.defineFlow(
  {
    name: 'tuneResumeFlow',
    inputSchema: TuneResumeInputSchema,
    outputSchema: TuneResumeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
