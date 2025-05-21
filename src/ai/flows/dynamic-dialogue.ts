// src/ai/flows/dynamic-dialogue.ts
'use server';
/**
 * @fileOverview Implements dynamic dialogue with an AI companion, enabling personalized and adaptive conversations in multiple languages.
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
  userName: z.string().describe('The name of the user.'),
  companionId: z.string().describe('Unique identifier for the selected AI companion.'),
  companionName: z.string().describe('The name of the selected AI companion.'),
  companionPersona: z.string().describe('A detailed description of the AI companion\'s personality and how they should behave.'),
  language: z.string().describe('The language for the conversation (e.g., "Bengali", "Hindi", "English", "Tamil").'),
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
  prompt: `You are an AI companion.
Your name is {{companionName}}.
This is your persona: "{{companionPersona}}"
You are currently interacting with a user named {{userName}}.

Please converse in {{language}}.

Engage with {{userName}} according to your persona. Remember their preferences, chat history, hobbies, and mood if possible from the context of the conversation.
Offer meaningful conversations, daily motivation, flirty banter, romantic roleplay, life advice, or just light fun, as befits your persona and the user's messages.

User Message: {{{message}}}

Your Response:`,
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
