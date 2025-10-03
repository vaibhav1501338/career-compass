'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a step-by-step career roadmap.
 *
 * It includes the following:
 * - `generateCareerRoadmap` - A function that accepts a career title and returns a detailed roadmap.
 * - `GenerateCareerRoadmapInput` - The input type for the `generateCareerRoadmap` function.
 * - `GenerateCareerRoadmapOutput` - The output type for the `generateCareerRoadmap` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCareerRoadmapInputSchema = z.object({
  career: z.string().describe('The career title for which to generate a roadmap.'),
});
export type GenerateCareerRoadmapInput = z.infer<typeof GenerateCareerRoadmapInputSchema>;

const GenerateCareerRoadmapOutputSchema = z.object({
    title: z.string().describe('The title of the career roadmap.'),
    description: z.string().describe('A brief description of the career path.'),
    steps: z.array(z.object({
        title: z.string().describe('The title of the roadmap step.'),
        description: z.string().describe('A detailed description of the step, including what to learn and why it is important.'),
    })).describe('A list of steps to follow for the career path.'),
});
export type GenerateCareerRoadmapOutput = z.infer<typeof GenerateCareerRoadmapOutputSchema>;

export async function generateCareerRoadmap(input: GenerateCareerRoadmapInput): Promise<GenerateCareerRoadmapOutput> {
  return generateCareerRoadmapFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCareerRoadmapPrompt',
  input: {schema: GenerateCareerRoadmapInputSchema},
  output: {schema: GenerateCareerRoadmapOutputSchema},
  prompt: `You are an expert career advisor. A student wants a step-by-step roadmap for a career in '{{{career}}}'. 

  Generate a comprehensive, step-by-step guide for a student to follow. Start with foundational skills and progress to more advanced topics and practical experience. Each step should have a clear title and a detailed description of what to learn, why it's important, and suggested resources or projects.
  
  The roadmap should be encouraging and practical for a beginner.
  `,
});

const generateCareerRoadmapFlow = ai.defineFlow(
  {
    name: 'generateCareerRoadmapFlow',
    inputSchema: GenerateCareerRoadmapInputSchema,
    outputSchema: GenerateCareerRoadmapOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
