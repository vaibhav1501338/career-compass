'use server';

/**
 * @fileOverview This file defines a Genkit flow for breaking down a career goal into SMART steps.
 *
 * It includes the following:
 * - `goalSettingAssistant` - A function that takes a career goal and breaks it down into smaller, trackable steps.
 * - `GoalSettingAssistantInput` - The input type for the `goalSettingAssistant` function.
 * - `GoalSettingAssistantOutput` - The output type for the `goalSettingAssistant` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GoalSettingAssistantInputSchema = z.object({
  goal: z.string().describe('The user\'s high-level career goal.'),
  timeframe: z.string().describe('The desired timeframe to achieve the goal (e.g., 6 months, 1 year).'),
});
export type GoalSettingAssistantInput = z.infer<typeof GoalSettingAssistantInputSchema>;

const GoalSettingAssistantOutputSchema = z.object({
  title: z.string().describe('The title of the goal plan.'),
  smartGoal: z.string().describe('The user\'s goal, reframed as a SMART goal.'),
  steps: z.array(z.object({
      title: z.string().describe('The title of the goal step.'),
      description: z.string().describe('A detailed description of the step and how to achieve it.'),
      metric: z.string().describe('A measurable metric to track progress for this step.'),
  })).describe('A list of specific, measurable steps to achieve the main goal.'),
});
export type GoalSettingAssistantOutput = z.infer<typeof GoalSettingAssistantOutputSchema>;

export async function goalSettingAssistant(input: GoalSettingAssistantInput): Promise<GoalSettingAssistantOutput> {
  return goalSettingAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'goalSettingAssistantPrompt',
  input: {schema: GoalSettingAssistantInputSchema},
  output: {schema: GoalSettingAssistantOutputSchema},
  prompt: `You are a career coach who specializes in creating SMART goals. A user has a career goal: '{{{goal}}}' and wants to achieve it in '{{{timeframe}}}'.

  Your tasks are:
  1.  Reframe the user's input into a single, clear SMART (Specific, Measurable, Achievable, Relevant, Time-bound) goal.
  2.  Break down the SMART goal into a series of smaller, actionable steps.
  3.  For each step, provide a title, a brief description of what to do, and a clear, measurable metric for success.
  `,
});

const goalSettingAssistantFlow = ai.defineFlow(
  {
    name: 'goalSettingAssistantFlow',
    inputSchema: GoalSettingAssistantInputSchema,
    outputSchema: GoalSettingAssistantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
