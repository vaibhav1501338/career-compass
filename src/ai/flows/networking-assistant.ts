'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating networking suggestions.
 *
 * It includes the following:
 * - `networkingAssistant` - A function that suggests professionals to connect with and provides message templates.
 * - `NetworkingAssistantInput` - The input type for the `networkingAssistant` function.
 * - `NetworkingAssistantOutput` - The output type for the `networkingAssistant` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const NetworkingAssistantInputSchema = z.object({
  field: z.string().describe('The user\'s professional field or area of interest.'),
  goal: z.string().describe('The user\'s goal for networking (e.g., find a mentor, learn about a role).'),
});
export type NetworkingAssistantInput = z.infer<typeof NetworkingAssistantInputSchema>;

const NetworkingAssistantOutputSchema = z.object({
  professionalTitles: z.array(z.string()).describe('A list of relevant professional titles to search for on platforms like LinkedIn.'),
  connectionMessage: z.string().describe('An AI-generated template for a connection request message.'),
});
export type NetworkingAssistantOutput = z.infer<typeof NetworkingAssistantOutputSchema>;

export async function networkingAssistant(input: NetworkingAssistantInput): Promise<NetworkingAssistantOutput> {
  return networkingAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'networkingAssistantPrompt',
  input: {schema: NetworkingAssistantInputSchema},
  output: {schema: NetworkingAssistantOutputSchema},
  prompt: `You are a career networking expert. A user wants to connect with professionals in '{{{field}}}' to achieve their goal of '{{{goal}}}'.

  Your tasks are:
  1.  Suggest 3-5 relevant job titles or roles they should search for on professional networking platforms like LinkedIn.
  2.  Write a polite, concise, and professional connection request message template that the user can adapt. The message should mention their interest in the professional's field and their goal.
  `,
});

const networkingAssistantFlow = ai.defineFlow(
  {
    name: 'networkingAssistantFlow',
    inputSchema: NetworkingAssistantInputSchema,
    outputSchema: NetworkingAssistantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
