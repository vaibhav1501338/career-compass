'use server';

/**
 * @fileOverview A personalized career suggestion AI agent.
 *
 * - personalizedCareerSuggestions - A function that provides career suggestions based on user profile, interests, and skills.
 * - PersonalizedCareerSuggestionsInput - The input type for the personalizedCareerSuggestions function.
 * - PersonalizedCareerSuggestionsOutput - The return type for the personalizedCareerSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedCareerSuggestionsInputSchema = z.object({
  profile: z
    .string()
    .describe('The user profile, including interests and skills.'),
});
export type PersonalizedCareerSuggestionsInput = z.infer<typeof PersonalizedCareerSuggestionsInputSchema>;

const PersonalizedCareerSuggestionsOutputSchema = z.object({
  careerSuggestions: z
    .array(z.string())
    .describe('A list of career suggestions tailored to the user.'),
});
export type PersonalizedCareerSuggestionsOutput = z.infer<typeof PersonalizedCareerSuggestionsOutputSchema>;

export async function personalizedCareerSuggestions(
  input: PersonalizedCareerSuggestionsInput
): Promise<PersonalizedCareerSuggestionsOutput> {
  return personalizedCareerSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedCareerSuggestionsPrompt',
  input: {schema: PersonalizedCareerSuggestionsInputSchema},
  output: {schema: PersonalizedCareerSuggestionsOutputSchema},
  prompt: `You are an AI career mentor. Based on the user's profile, interests, and skills, you will provide personalized career suggestions.

User Profile: {{{profile}}}

Provide a list of career suggestions that align with the user's profile.
`,
});

const personalizedCareerSuggestionsFlow = ai.defineFlow(
  {
    name: 'personalizedCareerSuggestionsFlow',
    inputSchema: PersonalizedCareerSuggestionsInputSchema,
    outputSchema: PersonalizedCareerSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
