
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating mock job listings based on a query.
 *
 * It includes the following:
 * - `generateJobListings` - A function that accepts a search query and returns a list of sample job listings.
 * - `GenerateJobListingsInput` - The input type for the `generateJobListings` function.
 * - `GenerateJobListingsOutput`- The output type for the `generateJobListings` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateJobListingsInputSchema = z.object({
  query: z.string().describe('The job title or keywords to search for.'),
});
export type GenerateJobListingsInput = z.infer<typeof GenerateJobListingsInputSchema>;

const JobListingSchema = z.object({
    title: z.string().describe('The job title.'),
    company: z.string().describe('The name of the company.'),
    location: z.string().describe('The location of the job (e.g., "San Francisco, CA").'),
    description: z.string().describe('A brief, one-paragraph description of the job responsibilities and qualifications.'),
    url: z.string().describe('A placeholder URL to the job application, should be "#"'),
});

const GenerateJobListingsOutputSchema = z.object({
    jobs: z.array(JobListingSchema).describe('A list of 5 to 7 generated sample job listings.'),
});
export type GenerateJobListingsOutput = z.infer<typeof GenerateJobListingsOutputSchema>;

export async function generateJobListings(input: GenerateJobListingsInput): Promise<GenerateJobListingsOutput> {
  return generateJobListingsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateJobListingsPrompt',
  input: {schema: GenerateJobListingsInputSchema},
  output: {schema: GenerateJobListingsOutputSchema},
  prompt: `You are a helpful assistant that generates realistic-looking, sample job listings. A user is searching for jobs related to '{{{query}}}'.

  Your task is to generate a list of 5-7 distinct and realistic sample job postings. For each job, create a believable title, company name, location, and a short (one paragraph) description. Do not use real company names. Instead, invent plausible tech-sounding company names (e.g., "Innovatech", "QuantumLeap AI", "DataWeave", "NextGen Solutions").
  
  Make the job descriptions concise and focused on key responsibilities and qualifications. The 'url' for each job should just be '#'.
  `,
});

const generateJobListingsFlow = ai.defineFlow(
  {
    name: 'generateJobListingsFlow',
    inputSchema: GenerateJobListingsInputSchema,
    outputSchema: GenerateJobListingsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
