
'use server';

/**
 * @fileOverview This file defines a Genkit flow for refining a user's profile description for career suggestions.
 *
 * It includes the following:
 * - `refineDescription` - A function that takes a raw description and returns a more detailed and polished version.
 * - `RefineDescriptionInput` - The input type for the `refineDescription` function.
 * - `RefineDescriptionOutput` - The output type for the `refineDescription` function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const RefineDescriptionInputSchema = z.object({
  description: z.string().describe('The raw profile description from the user.'),
});
export type RefineDescriptionInput = z.infer<typeof RefineDescriptionInputSchema>;

const RefineDescriptionOutputSchema = z.object({
  refinedDescription: z.string().describe('The AI-refined profile description.'),
});
export type RefineDescriptionOutput = z.infer<typeof RefineDescriptionOutputSchema>;

export async function refineDescription(input: RefineDescriptionInput): Promise<RefineDescriptionOutput> {
  return refineDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'refineDescriptionPrompt',
  input: { schema: RefineDescriptionInputSchema },
  output: { schema: RefineDescriptionOutputSchema },
  prompt: `You are a helpful career assistant. A user has provided a description of their interests and skills. Your task is to refine this description to be more professional, detailed, and better suited for generating personalized career suggestions.

  Expand on the user's points, structure them clearly, and use professional language. Ensure the output is a single block of text that can be used in a form.

  Original Description:
  '{{{description}}}'

  Refine the description to be clear and comprehensive.
  `,
});

const refineDescriptionFlow = ai.defineFlow(
  {
    name: 'refineDescriptionFlow',
    inputSchema: RefineDescriptionInputSchema,
    outputSchema: RefineDescriptionOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
