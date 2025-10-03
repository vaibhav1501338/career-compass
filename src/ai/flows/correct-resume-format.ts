
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
  
  Your task is to parse the content of the resume and restructure it into a professional format based on the following template. Correct any glaring grammatical errors you find. The output should be a single, well-formatted block of text that represents the corrected resume.

  **Resume Structure Template:**

  **[Full Name]**
  [Address] | [Phone Number] | [Email]

  ---

  **Objective**
  [A concise one-sentence objective related to the job the user is seeking.]

  ---

  **Education**
  **[School Name]**, [City, State]
  *Expected Graduation: [Month, Year]*
  GPA: [Your GPA]

  ---

  **Experience**
  **[Company/Organization Name]**, [City, State]
  *[Job Title]* | *[Start Date] – [End Date]*
  - [Responsibility or accomplishment 1]
  - [Responsibility or accomplishment 2]
  - [Responsibility or accomplishment 3]

  ---

  **Skills**
  - [Skill 1]
  - [Skill 2]
  - [Skill 3]

  ---

  **Awards and Honors**
  - [Award 1]
  - [Award 2]

  ---
  
  Now, analyze the following resume content and reformat it according to the template above.

  Original Resume:
  {{media url=resumeDataUri}}
  
  Provide the corrected content as a single block of text.`,
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
