// Use server directive.
'use server';

/**
 * @fileOverview Flow for generating AI images of the AI companion.
 *
 * - generateAiImage - A function that handles the image generation process.
 * - GenerateAiImageInput - The input type for the generateAiImage function.
 * - GenerateAiImageOutput - The return type for the generateAiImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAiImageInputSchema = z.object({
  prompt: z.string().describe('The prompt for generating the AI image.'),
});
export type GenerateAiImageInput = z.infer<typeof GenerateAiImageInputSchema>;

const GenerateAiImageOutputSchema = z.object({
  imageUrl: z
    .string()
    .describe(
      'The URL of the generated AI image, as a data URI that must include a MIME type and use Base64 encoding. Expected format: data:<mimetype>;base64,<encoded_data>.'
    ),
});
export type GenerateAiImageOutput = z.infer<typeof GenerateAiImageOutputSchema>;

export async function generateAiImage(input: GenerateAiImageInput): Promise<GenerateAiImageOutput> {
  return generateAiImageFlow(input);
}

const generateAiImageFlow = ai.defineFlow(
  {
    name: 'generateAiImageFlow',
    inputSchema: GenerateAiImageInputSchema,
    outputSchema: GenerateAiImageOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      // IMPORTANT: ONLY the googleai/gemini-2.0-flash-exp model is able to generate images. You MUST use exactly this model to generate images.
      model: 'googleai/gemini-2.0-flash-exp',
      prompt: input.prompt,
      config: {
        responseModalities: ['TEXT', 'IMAGE'], // MUST provide both TEXT and IMAGE, IMAGE only won't work
      },
    });

    return {imageUrl: media.url!};
  }
);
