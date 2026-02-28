import { GoogleGenAI, Type } from "@google/genai";
import { PackagingStyle, ToyAnalysis } from "../types";

const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY;
  
  if (!apiKey || apiKey === "undefined" || apiKey === "") {
    throw new Error("API_KEY_MISSING");
  }
  return new GoogleGenAI({ apiKey });
};

async function withRetry<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
  let lastError: any;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      // Check if it's a 429 error
      const isRateLimit = error?.message?.includes("429") || error?.status === 429 || error?.message?.includes("RESOURCE_EXHAUSTED");
      
      if (isRateLimit && i < maxRetries - 1) {
        const delay = Math.pow(2, i) * 1000 + Math.random() * 1000;
        console.warn(`Rate limit hit. Retrying in ${Math.round(delay)}ms... (Attempt ${i + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
  throw lastError;
}

export async function analyzeToy(base64Image: string): Promise<ToyAnalysis> {
  return withRetry(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: [
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: base64Image.split(",")[1],
              },
            },
            {
              text: "Analyze this image and identify the toy. Provide details in JSON format. If no toy is clearly visible, try to identify the main object. Include: 'name' (a catchy name), 'description' (physical description), 'category' (e.g., Action Figure, Plush, Educational), and 'targetAudience' (e.g., Toddlers, Ages 6-12, Collectors).",
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            category: { type: Type.STRING },
            targetAudience: { type: Type.STRING },
          },
          required: ["name", "description", "category", "targetAudience"],
        },
      },
    });

    return JSON.parse(response.text || "{}");
  });
}

export async function generatePackaging(
  toy: ToyAnalysis,
  style: PackagingStyle,
  originalImageBase64?: string,
  refinementPrompt?: string
): Promise<{ imageUrl: string; prompt: string }> {
  const stylePrompts: Record<PackagingStyle, string> = {
    [PackagingStyle.FUTURISTIC]: "Sleek futuristic toy packaging, holographic accents, dark matte finish, glowing LED-like lines, minimalist high-tech typography, metallic textures.",
    [PackagingStyle.POP_ART]: "Pop art style toy packaging, Ben-Day dots, vibrant primary colors, comic book style speech bubbles, thick black outlines, energetic and playful layout.",
    [PackagingStyle.VINTAGE_WOODEN]: "Old-fashioned vintage wooden toy box style, dark stained wood texture, gold leaf lettering, classic illustrations, ornate borders, timeless and heirloom quality.",
    [PackagingStyle.NEO_MODERNIST]: "Neo-modernist design, vibrant liquid gradients, frosted glass (glassmorphism) overlays, bold Swiss typography, clean geometric shapes, high-end digital art aesthetic.",
    [PackagingStyle.URBAN_COLLECTIBLE]: "Urban art toy packaging, street-art inspired graphics, bold graffiti-style patterns, high-contrast colors, limited-edition collectible feel, edgy and contemporary.",
    [PackagingStyle.INDUSTRIAL_BRUTALIST]: "Industrial brutalist aesthetic, raw concrete and metal textures, technical blueprint illustrations, stark utilitarian typography, exposed structural elements, monochromatic with high-visibility accents.",
    [PackagingStyle.LEGO_ICONIC]: "LEGO-inspired packaging design, bold red primary accents, clean white borders, high-quality product photography showing the toy in a creative action scene, subtle brick-pattern textures, clear and friendly sans-serif typography.",
    [PackagingStyle.MATTEL_VIBRANT]: "Mattel-style vibrant packaging, high-gloss finish, dynamic energy streaks, bold color gradients like vibrant pink or racing blue, clear window-box aesthetic, playful and energetic typography.",
    [PackagingStyle.HASBRO_CINEMATIC]: "Hasbro-style cinematic packaging, dark dramatic backgrounds, character-centric illustrations, metallic foil accents, heavy bold typography, gritty and action-oriented atmosphere.",
    [PackagingStyle.TOYSRUS_PLAYFUL]: "Toys 'R' Us inspired retail packaging, friendly and accessible design, iconic blue and yellow color palette, playful star motifs, clear product visibility, cheerful and rounded typography, family-friendly atmosphere.",
    [PackagingStyle.POPMART_COLLECTIBLE]: "Pop Mart inspired blind-box packaging, high-end artistic character illustration, sophisticated matte finish, pastel or vibrant designer color palettes, clean modern layout, collectible art-toy aesthetic, premium and trendy feel.",
    [PackagingStyle.ZURU_VIBRANT]: "ZURU inspired high-energy packaging, vibrant neon colors, dynamic action graphics, 'unboxing surprise' aesthetic, bold high-contrast typography, glossy finish with starburst and explosion motifs, playful and exciting retail feel.",
  };

  const prompt = `You are a professional toy packaging designer. 
  In the provided image, there is a toy and a white area that represents the packaging box.
  Your task is to automatically identify this white packaging area and apply a design to it.
  
  TOY INFO:
  Name: ${toy.name}
  Category: ${toy.category}
  Description: ${toy.description}
  
  DESIGN STYLE:
  ${stylePrompts[style]}
  ${refinementPrompt ? `\n  USER REFINEMENT REQUEST: ${refinementPrompt}` : ""}
  
  TITLE DESIGN:
  - Create a LARGE, BOLD, AND STYLIZED TITLE for the toy: "${toy.name}".
  - The title should be the central typographic element on the front of the packaging.
  - The font style, effects (like 3D, glow, or texture), and placement of the title must perfectly match the theme of the ${toy.category} and the selected ${style} style.
  
  DESCRIPTION SECTION:
  - Include a DEDICATED SECTION for a brief description of the toy.
  - Use a clear, highly legible sans-serif font for this text.
  - The description should be: "${toy.description.substring(0, 100)}${toy.description.length > 100 ? '...' : ''}".
  - Place this section strategically (e.g., bottom corner or side panel) so it doesn't compete with the main title but remains easily readable.
  
  CONSTRAINTS:
  1. ONLY apply the design to the white surfaces of the packaging box.
  2. DO NOT alter the size, shape, or physical appearance of the packaging box itself.
  3. Keep the toy visible and integrated with the design as appropriate for the style.
  4. MAINTAIN THE EXACT SAME ANGLE AND PERSPECTIVE as the original image.
  5. TRANSFORM THE BACKGROUND to a pure, clean white studio background (#FFFFFF).
  6. OPTIMIZE LIGHTING AND SHADOWS: Use professional studio lighting to create realistic depth, soft shadows, and high-quality highlights on the box and toy.
  7. The final output must be a high-quality, professional commercial product photograph.`;

  const contents: any = {
    parts: [{ text: prompt }],
  };

  if (originalImageBase64) {
    contents.parts.unshift({
      inlineData: {
        mimeType: "image/jpeg",
        data: originalImageBase64.split(",")[1],
      },
    });
  }

  return withRetry(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents,
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        },
      },
    });

    let imageUrl = "";
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        imageUrl = `data:image/png;base64,${part.inlineData.data}`;
        break;
      }
    }

    if (!imageUrl) {
      throw new Error("Failed to generate image");
    }

    return { imageUrl, prompt };
  });
}
