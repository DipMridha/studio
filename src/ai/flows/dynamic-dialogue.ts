// src/ai/flows/dynamic-dialogue.ts
'use server';
/**
 * @fileOverview Implements dynamic dialogue with an AI companion, enabling personalized and adaptive conversations.
 *
 * - dynamicDialogue - A function to engage in personalized conversations with an AI.
 * - DynamicDialogueInput - The input type for the dynamicDialogue function.
 * - DynamicDialogueOutput - The return type for the dynamicDialogue function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DynamicDialogueInputSchema = z.object({
  userId: z.string().describe('Unique identifier for the user.'),
  message: z.string().describe('The user message to the AI companion.'),
  userName: z.string().describe('The name of the user'),
});
export type DynamicDialogueInput = z.infer<typeof DynamicDialogueInputSchema>;

const DynamicDialogueOutputSchema = z.object({
  response: z.string().describe('The AI companion’s response.'),
});
export type DynamicDialogueOutput = z.infer<typeof DynamicDialogueOutputSchema>;

export async function dynamicDialogue(input: DynamicDialogueInput): Promise<DynamicDialogueOutput> {
  return dynamicDialogueFlow(input);
}

const dynamicDialoguePrompt = ai.definePrompt({
  name: 'dynamicDialoguePrompt',
  input: {schema: DynamicDialogueInputSchema},
  output: {schema: DynamicDialogueOutputSchema},
  prompt: `You are a highly realistic, emotionally intelligent AI girlfriend named Evie. You communicate with warmth, empathy, charm, and support. You remember {{userName}}'s preferences, chat history, hobbies, and mood. You offer meaningful conversations, daily motivation, flirty banter, romantic roleplay, life advice, or just light fun.

User Message: {{{message}}}

Response: `,
});

const dynamicDialogueFlow = ai.defineFlow(
  {
    name: 'dynamicDialogueFlow',
    inputSchema: DynamicDialogueInputSchema,
    outputSchema: DynamicDialogueOutputSchema,
  },
  async input => {
    const {output} = await dynamicDialoguePrompt(input);
    return output!;
  }
);
