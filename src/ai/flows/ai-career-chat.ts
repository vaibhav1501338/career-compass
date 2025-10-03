
'use server';

/**
 * @fileOverview This file defines the AI Career Chat flow, which allows students
 * to discuss career options and receive personalized advice through an AI-powered
 * chat interface.
 * 
 * @exports aiCareerChat - The main function to initiate the AI Career Chat flow.
 * @exports AiCareerChatInput - The input type for the aiCareerChat function.
 * @exports AiCareerChatOutput - The output type for the aiCareerChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiCareerChatInputSchema = z.object({
  message: z.string().describe('The message from the student.'),
  chatHistory: z
    .array(z.object({role: z.enum(['user', 'assistant']), content: z.string()}))
    .optional()
    .describe('The chat history between the student and the AI.'),
});
export type AiCareerChatInput = z.infer<typeof AiCareerChatInputSchema>;

const AiCareerChatOutputSchema = z.object({
  response: z.string().describe('The AI response to the student message.'),
});
export type AiCareerChatOutput = z.infer<typeof AiCareerChatOutputSchema>;

export async function aiCareerChat(input: AiCareerChatInput): Promise<AiCareerChatOutput> {
  return aiCareerChatFlow(input);
}

const aiCareerChatPrompt = ai.definePrompt({
  name: 'aiCareerChatPrompt',
  input: {schema: AiCareerChatInputSchema},
  output: {schema: AiCareerChatOutputSchema},
  prompt: `You are an AI career mentor, providing helpful and personalized advice to students exploring career options.

  Respond to the student's message based on the chat history and provide relevant suggestions and guidance.

  Chat History:
  {{#each chatHistory}}
  {{role}}: {{content}}
  {{/each}}

  user: {{{message}}}
  assistant:`,
});

const aiCareerChatFlow = ai.defineFlow(
  {
    name: 'aiCareerChatFlow',
    inputSchema: AiCareerChatInputSchema,
    outputSchema: AiCareerChatOutputSchema,
  },
  async input => {
    const {output} = await aiCareerChatPrompt(input);
    return output!;
  }
);
