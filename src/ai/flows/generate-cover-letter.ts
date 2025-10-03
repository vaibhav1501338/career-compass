
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a tailored cover letter.
 *
 * It includes the following:
 * - `generateCoverLetter` - A function that takes job and user details and returns a cover letter.
 * - `GenerateCoverLetterInput` - The input type for the `generateCoverLetter` function.
 * - `GenerateCoverLetterOutput` - The output type for the `generateCoverLetter` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCoverLetterInputSchema = z.object({
  jobTitle: z.string().describe("The title of the job being applied for."),
  companyName: z.string().describe("The name of the company."),
  jobDescription: z.string().describe("The job description."),
  userSkills: z.string().describe("The user's relevant skills, experience, and qualifications."),
});
export type GenerateCoverLetterInput = z.infer<typeof GenerateCoverLetterInputSchema>;

const GenerateCoverLetterOutputSchema = z.object({
  coverLetter: z.string().describe("The generated cover letter content."),
});
export type GenerateCoverLetterOutput = z.infer<typeof GenerateCoverLetterOutputSchema>;

export async function generateCoverLetter(input: GenerateCoverLetterInput): Promise<GenerateCoverLetterOutput> {
  return generateCoverLetterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCoverLetterPrompt',
  input: {schema: GenerateCoverLetterInputSchema},
  output: {schema: GenerateCoverLetterOutputSchema},
  prompt: `You are an expert career coach specializing in writing compelling cover letters. A user is applying for a '{{{jobTitle}}}' position at '{{{companyName}}}'.

  Your task is to write a professional and persuasive cover letter based on the provided job description and the user's skills.

  **Job Description:**
  {{{jobDescription}}}

  **User's Skills and Experience:**
  {{{userSkills}}}

  **Instructions:**
  1.  Start with a professional greeting.
  2.  In the first paragraph, introduce the user and the position they are applying for.
  3.  In the body paragraphs, highlight how the user's skills and experience (from '{{{userSkills}}}') match the requirements in the '{{{jobDescription}}}'. Be specific and provide examples where possible.
  4.  Conclude with a strong closing paragraph that reiterates interest and includes a call to action (e.g., requesting an interview).
  5.  End with a professional closing (e.g., "Sincerely,").

  The final output should be only the text of the cover letter.
  `,
});

const generateCoverLetterFlow = ai.defineFlow(
  {
    name: 'generateCoverLetterFlow',
    inputSchema: GenerateCoverLetterInputSchema,
    outputSchema: GenerateCoverLetterOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
