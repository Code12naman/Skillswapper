// Skill recommendation flow
'use server';

/**
 * @fileOverview Skill recommendation AI agent.
 *
 * - recommendSkills - A function that recommends skills to a user.
 * - RecommendSkillsInput - The input type for the recommendSkills function.
 * - RecommendSkillsOutput - The return type for the recommendSkills function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendSkillsInputSchema = z.object({
  existingSkills: z
    .array(z.string())
    .describe('A list of skills the user already has.'),
  interests: z
    .array(z.string())
    .describe('A list of the user\'s interests.'),
});
export type RecommendSkillsInput = z.infer<typeof RecommendSkillsInputSchema>;

const RecommendSkillsOutputSchema = z.object({
  recommendedSkills: z
    .array(z.string())
    .describe('A list of skills recommended to the user.'),
});
export type RecommendSkillsOutput = z.infer<typeof RecommendSkillsOutputSchema>;

export async function recommendSkills(input: RecommendSkillsInput): Promise<RecommendSkillsOutput> {
  return recommendSkillsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendSkillsPrompt',
  input: {schema: RecommendSkillsInputSchema},
  output: {schema: RecommendSkillsOutputSchema},
  prompt: `You are a skill recommendation expert. Given a user's existing skills and interests, you will recommend new skills for them to learn or offer.

Existing Skills: {{#each existingSkills}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
Interests: {{#each interests}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Recommend 3-5 new skills that the user might be interested in, based on their existing skills and interests. The skills should be specific and well-defined.  Return the skills as a JSON array.

{{schema description=RecommendSkillsOutputSchema}}`,
});

const recommendSkillsFlow = ai.defineFlow(
  {
    name: 'recommendSkillsFlow',
    inputSchema: RecommendSkillsInputSchema,
    outputSchema: RecommendSkillsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
