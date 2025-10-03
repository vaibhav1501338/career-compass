'use server';

/**
 * @fileOverview This file defines a Genkit flow for correcting the format and content of a resume.
 *
 * It includes the following:
 * - `correctResumeFormat` - A function that takes resume content and returns a corrected version.
 * - `CorrectResumeFormatInput` - The input type for the function.
 * - `CorrectResumeFormatOutput` - The output type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const CorrectResumeFormatInputSchema = z.object({
  resumeDataUri: z
    .string()
    .describe(
      'The resume content as a data URI that must include a MIME type and use Base64 encoding.'
    ),
});
export type CorrectResumeFormatInput = z.infer<typeof CorrectResumeFormatInputSchema>;

const CorrectResumeFormatOutputSchema = z.object({
  correctedContent: z
    .string()
    .describe('The corrected and reformatted resume content as a single block of text.'),
});
export type CorrectResumeFormatOutput = z.infer<typeof CorrectResumeFormatOutputSchema>;

export async function correctResumeFormat(
  input: CorrectResumeFormatInput
): Promise<CorrectResumeFormatOutput> {
  return correctResumeFormatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'correctResumeFormatPrompt',
  input: { schema: CorrectResumeFormatInputSchema },
  output: { schema: CorrectResumeFormatOutputSchema },
  prompt: `You are an expert resume editor. A user has provided a resume with formatting issues.
  
  Your task is to parse the content of the resume, restructure it into a professional format, and correct any glaring grammatical errors.
  
  The output should be a single, well-formatted block of text that represents the corrected resume. Use clear headings (e.g., "Experience", "Education", "Skills").
  
  Original Resume:
  {{media url=resumeDataUri}}
  
  Provide the corrected content.`,
});

const correctResumeFormatFlow = ai.defineFlow(
  {
    name: 'correctResumeFormatFlow',
    inputSchema: CorrectResumeFormatInputSchema,
    outputSchema: CorrectResumeFormatOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
