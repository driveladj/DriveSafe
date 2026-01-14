// This file is machine-generated - edit at your own risk.
'use server';

/**
 * @fileOverview An AI tool that recommends customized curriculum options based on student progress tracking.
 *
 * - aiCurriculumRecommendation - A function that handles the curriculum recommendation process.
 * - AICurriculumRecommendationInput - The input type for the aiCurriculumRecommendation function.
 * - AICurriculumRecommendationOutput - The return type for the aiCurriculumRecommendation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AICurriculumRecommendationInputSchema = z.object({
  studentProgress: z.string().describe('A summary of the student\'s progress, including areas of strength and weakness.'),
  availableResources: z.string().describe('A list of available learning resources, such as lesson plans and exercises.'),
});
export type AICurriculumRecommendationInput = z.infer<typeof AICurriculumRecommendationInputSchema>;

const AICurriculumRecommendationOutputSchema = z.object({
  recommendedCurriculum: z.string().describe('A detailed recommendation for a customized curriculum, including specific lesson plans and exercises.'),
  explanation: z.string().describe('An explanation of why this curriculum is recommended based on the student\'s progress.'),
});
export type AICurriculumRecommendationOutput = z.infer<typeof AICurriculumRecommendationOutputSchema>;

export async function aiCurriculumRecommendation(input: AICurriculumRecommendationInput): Promise<AICurriculumRecommendationOutput> {
  return aiCurriculumRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiCurriculumRecommendationPrompt',
  input: {schema: AICurriculumRecommendationInputSchema},
  output: {schema: AICurriculumRecommendationOutputSchema},
  prompt: `You are an AI assistant designed to recommend customized curriculum options based on a student's progress.

  Based on the student's progress and available resources, provide a detailed recommendation for a curriculum, and explain your reasoning.

  Student Progress: {{{studentProgress}}}
  Available Resources: {{{availableResources}}}
  `,
});

const aiCurriculumRecommendationFlow = ai.defineFlow(
  {
    name: 'aiCurriculumRecommendationFlow',
    inputSchema: AICurriculumRecommendationInputSchema,
    outputSchema: AICurriculumRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
