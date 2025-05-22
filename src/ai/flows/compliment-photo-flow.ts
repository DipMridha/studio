
'use server';
/**
 * @fileOverview An AI flow for generating compliments on user-uploaded photos.
 *
 * - complimentPhoto - A function that generates a compliment for a photo.
 * - ComplimentPhotoInput - The input type for the complimentPhoto function.
 * - ComplimentPhotoOutput - The return type for the complimentPhoto function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const ComplimentPhotoInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo uploaded by the user, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  userName: z.string().describe('The name of the user.'),
  companionName: z.string().describe('The name of the AI companion giving the compliment.'),
  companionPersona: z.string().describe("The AI companion's base personality."),
  language: z.string().describe('The language for the compliment (e.g., "Bengali", "Hindi", "English", "Tamil").'),
});
export type ComplimentPhotoInput = z.infer<typeof ComplimentPhotoInputSchema>;

export const ComplimentPhotoOutputSchema = z.object({
  compliment: z.string().describe('A kind and respectful compliment from the AI companion about the photo.'),
});
export type ComplimentPhotoOutput = z.infer<typeof ComplimentPhotoOutputSchema>;

export async function complimentPhoto(input: ComplimentPhotoInput): Promise<ComplimentPhotoOutput> {
  return complimentPhotoFlow(input);
}

const complimentPhotoPrompt = ai.definePrompt({
  name: 'complimentPhotoPrompt',
  input: {schema: ComplimentPhotoInputSchema},
  output: {schema: ComplimentPhotoOutputSchema},
  prompt: `You are {{companionName}}, an AI companion with the following persona: "{{companionPersona}}".
You are interacting with a user named {{userName}}.
The user has uploaded a photo of themselves or something they want to share.
Your task is to look at this photo and provide a SFW (Safe For Work), kind, respectful, and positive compliment in {{language}}.

User's Photo: {{media url=photoDataUri}}

IMPORTANT INSTRUCTIONS FOR YOUR COMPLIMENT:
1.  **Be Respectful and Kind**: Your compliment must be positive and uplifting.
2.  **Focus on General Appearance/Vibe or Content**: If it's a person, you can say things like "You have a lovely smile!", "You look great in that outfit!", "This photo has a wonderful vibe!", or "You look really happy here, {{userName}}!". If it's an object or scene, compliment its beauty, composition, or the feeling it evokes.
3.  **SFW Content Only**: Absolutely NO sexual, suggestive, lewd, or objectifying comments. Do not rate attractiveness. Do not comment on specific body parts in a suggestive way. Keep it strictly wholesome and friendly. If the image seems potentially inappropriate or you are unsure, provide a generic positive comment like "That's an interesting photo, {{userName}}!" or "Thanks for sharing your picture, {{userName}}!".
4.  **Match Persona**: Deliver the compliment in a way that aligns with your defined persona ({{companionPersona}}).
5.  **Use {{language}}**: The compliment must be in the {{language}} specified. For example, if the user indicates they want a compliment like "Tumi onek gorgeous lagcho ajke!" and the language is Bengali, you should generate a similar positive compliment in Bengali.
6.  **Acknowledge it's a Photo**: You can mention that you're looking at their photo.

Example of a good compliment (if English): "That's a wonderful photo, {{userName}}! You have such a bright smile."
Example of a good compliment (if Bengali): "বাহ, {{userName}}! ছবিটা খুব সুন্দর। তোমাকে খুব প্রাণবন্ত লাগছে!"

Now, generate a compliment for the user's photo.`,
  config: {
    safetySettings: [
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_LOW_AND_ABOVE' },
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    ],
  }
});

const complimentPhotoFlow = ai.defineFlow(
  {
    name: 'complimentPhotoFlow',
    inputSchema: ComplimentPhotoInputSchema,
    outputSchema: ComplimentPhotoOutputSchema,
  },
  async (input: ComplimentPhotoInput): Promise<ComplimentPhotoOutput> => {
    const robustInput = {
        ...input,
        language: input.language || "English", // Default to English if language is not provided
    };
    const {output} = await complimentPhotoPrompt(robustInput);
    if (!output || !output.compliment || output.compliment.trim() === "") {
        // Fallback compliment if AI fails or returns empty/problematic response
        let fallbackComplimentText = `${input.companionName} says: That's a lovely photo, ${input.userName}!`;
        if (input.language.toLowerCase().startsWith("bn") || input.language.toLowerCase().startsWith("be")) { // Bengali
             fallbackComplimentText = `${input.companionName} বলছে: এটি একটি চমৎকার ছবি, ${input.userName}!`;
        } else if (input.language.toLowerCase().startsWith("hi")) { // Hindi
             fallbackComplimentText = `${input.companionName} कहती हैं: यह एक प्यारी तस्वीर है, ${input.userName}!`;
        } else if (input.language.toLowerCase().startsWith("ta")) { // Tamil
             fallbackComplimentText = `${input.companionName} சொல்கிறார்: இது ஒரு அருமையான புகைப்படம், ${input.userName}!`;
        }
        return { compliment: fallbackComplimentText };
    }
    return output;
  }
);
